import { parse } from "acorn";
import type { EventKind } from "@/lib/types";

/**
 * Source instrumentation.
 *
 * Rather than interpreting JavaScript, we splice a `__step(...)` call in front
 * of every statement and then let the real engine run it. That gives real
 * values and real control flow for the cost of a parse, and there is no
 * language semantics to reimplement.
 *
 * Insertions are applied back-to-front so earlier offsets stay valid.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyNode = any;

const LOOP_TYPES = new Set([
  "ForStatement",
  "ForOfStatement",
  "ForInStatement",
  "WhileStatement",
  "DoWhileStatement",
]);

/** Statement type → the coarse event kind shown on the timeline ruler. */
const STATEMENT_KIND: Record<string, EventKind> = {
  IfStatement: "compare",
  SwitchStatement: "compare",
  ForStatement: "compare",
  ForOfStatement: "compare",
  ForInStatement: "compare",
  WhileStatement: "compare",
  DoWhileStatement: "compare",
  ReturnStatement: "return",
  ThrowStatement: "return",
  VariableDeclaration: "mutation",
  ExpressionStatement: "mutation",
  BreakStatement: "call",
  ContinueStatement: "call",
};

/**
 * Statements we never instrument.
 *
 * Function declarations are hoisted, so a step on one tells you nothing, and
 * blocks would double-report the statements inside them.
 */
const SKIP_TYPES = new Set([
  "FunctionDeclaration",
  "ClassDeclaration",
  "BlockStatement",
  "EmptyStatement",
]);

export class InstrumentError extends Error {}

interface Insertion {
  offset: number;
  text: string;
}

/** Generic AST walk that also hands each visitor its ancestor chain. */
function walkNode(node: AnyNode, ancestors: AnyNode[], visit: (n: AnyNode, a: AnyNode[]) => void) {
  visit(node, ancestors);
  const next = [...ancestors, node];

  for (const key of Object.keys(node)) {
    if (key === "loc" || key === "start" || key === "end" || key === "type" || key === "range") {
      continue;
    }
    const value = (node as Record<string, unknown>)[key];

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item && typeof item === "object" && typeof (item as AnyNode).type === "string") {
          walkNode(item, next, visit);
        }
      }
    } else if (value && typeof value === "object" && typeof (value as AnyNode).type === "string") {
      walkNode(value as AnyNode, next, visit);
    }
  }
}

/** Collects every identifier bound by a declaration pattern. */
function collectPatternNames(pattern: AnyNode, into: Set<string>) {
  if (!pattern || typeof pattern !== "object") return;

  switch (pattern.type) {
    case "Identifier":
      into.add(pattern.name);
      break;
    case "ObjectPattern":
      for (const property of pattern.properties ?? []) {
        collectPatternNames(property.value ?? property.argument, into);
      }
      break;
    case "ArrayPattern":
      for (const element of pattern.elements ?? []) collectPatternNames(element, into);
      break;
    case "AssignmentPattern":
      collectPatternNames(pattern.left, into);
      break;
    case "RestElement":
      collectPatternNames(pattern.argument, into);
      break;
    default:
      break;
  }
}

const FUNCTION_TYPES = new Set([
  "FunctionDeclaration",
  "FunctionExpression",
  "ArrowFunctionExpression",
]);

/**
 * Name of the innermost enclosing function, used to label the timeline phase.
 * Falls back to the variable a function expression was assigned to.
 */
function enclosingFunctionName(ancestors: AnyNode[], node: AnyNode): string {
  const chain = [...ancestors, node];

  for (let index = chain.length - 1; index >= 0; index--) {
    const candidate = chain[index];
    if (!FUNCTION_TYPES.has(candidate.type)) continue;

    if (candidate.id?.name) return candidate.id.name;

    const parent = chain[index - 1];
    if (parent?.type === "VariableDeclarator" && parent.id?.type === "Identifier") {
      return parent.id.name;
    }
    if (parent?.type === "Property" && parent.key?.name) return parent.key.name;
    return "anonymous";
  }

  return "main";
}

export interface InstrumentResult {
  /** Function body to be run with (__step, __v) in scope. */
  code: string;
  /** Names the snapshot will attempt to read. */
  names: string[];
  /** Original source, split for the code panel. */
  lines: string[];
  /** Number of instrumented statements. */
  probeCount: number;
}

export function instrument(source: string): InstrumentResult {
  let ast: AnyNode;
  try {
    ast = parse(source, { ecmaVersion: 2022, locations: true, sourceType: "script" });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new InstrumentError(`Could not parse the source: ${message}`);
  }

  const names = new Set<string>();
  const insertions: Insertion[] = [];

  // Pass 1 — every binding in the program, so the snapshot knows what to read.
  walkNode(ast, [], (node) => {
    if (node.type === "VariableDeclarator") collectPatternNames(node.id, names);
    if (
      node.type === "FunctionDeclaration" ||
      node.type === "FunctionExpression" ||
      node.type === "ArrowFunctionExpression"
    ) {
      for (const param of node.params ?? []) collectPatternNames(param, names);
    }
    if (node.type === "ForOfStatement" || node.type === "ForInStatement") {
      if (node.left?.type === "VariableDeclaration") {
        for (const declarator of node.left.declarations ?? []) {
          collectPatternNames(declarator.id, names);
        }
      }
    }
  });

  const sortedNames = [...names].sort();
  // Reading a `let` before its initialiser throws, so every read is guarded.
  const snapshotLiteral = `{${sortedNames.map((name) => `${JSON.stringify(name)}:__v(()=>${name})`).join(",")}}`;

  // Pass 2 — a probe in front of each statement that lives in a statement list.
  walkNode(ast, [], (node, ancestors) => {
    const lists: AnyNode[][] = [];
    if (Array.isArray(node.body)) lists.push(node.body);
    if (Array.isArray(node.consequent)) lists.push(node.consequent);
    if (lists.length === 0) return;

    const loopDepth = ancestors.filter((a) => LOOP_TYPES.has(a.type)).length;

    for (const list of lists) {
      for (const statement of list) {
        if (!statement || typeof statement.type !== "string") continue;
        if (SKIP_TYPES.has(statement.type)) continue;

        const kind = STATEMENT_KIND[statement.type] ?? "call";
        const ownLoopDepth = LOOP_TYPES.has(node.type) ? loopDepth + 1 : loopDepth;

        /*
         * Phase names the enclosing function and its loop depth. Keying off
         * loop depth alone puts a helper's `return` in the same bucket as the
         * algorithm's, which scrambles the timeline once helpers exist.
         */
        const fnName = enclosingFunctionName(ancestors, node);
        const depthSuffix = ownLoopDepth === 0 ? "" : ownLoopDepth === 1 ? " · loop" : " · inner";
        const phase = `${fnName}${depthSuffix}`;

        insertions.push({
          offset: statement.start,
          text: `__step(${statement.loc.start.line},${JSON.stringify(kind)},${JSON.stringify(phase)},${snapshotLiteral});`,
        });
      }
    }
  });

  if (insertions.length === 0) {
    throw new InstrumentError(
      "Nothing to trace. Define a function and call it, for example: const result = solve(input);",
    );
  }

  insertions.sort((a, b) => b.offset - a.offset);

  let code = source;
  for (const insertion of insertions) {
    code = code.slice(0, insertion.offset) + insertion.text + code.slice(insertion.offset);
  }

  return {
    code,
    names: sortedNames,
    lines: source.split("\n"),
    probeCount: insertions.length,
  };
}
