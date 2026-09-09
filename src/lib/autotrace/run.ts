import type { EventKind } from "@/lib/types";
import { instrument } from "./instrument";

/**
 * Executes instrumented source and collects a snapshot at every probe.
 *
 * Runs in the browser on the user's own tab: their code, their sandbox, no
 * server attack surface. The step cap is what makes an accidental infinite
 * loop terminate instead of hanging the page.
 */

const MAX_STEPS = 3000;
/** Total values cloned per snapshot — bounds the cost of a large structure. */
const CLONE_BUDGET = 1500;

export interface RawStep {
  line: number;
  kind: EventKind;
  phase: string;
  snapshot: Record<string, unknown>;
}

export interface RunOutcome {
  steps: RawStep[];
  lines: string[];
  /** Set when the user's code threw. Partial steps are still returned. */
  error?: string;
  /** Set when the step cap was hit — usually a runaway loop. */
  truncated: boolean;
}

class StepLimitReached extends Error {}

/**
 * Deep-clones a snapshot value.
 *
 * This is the load-bearing detail of the whole tracer: the snapshot object
 * holds live references, so without cloning at capture time every step would
 * display the final state of the run.
 */
function cloneValue(value: unknown, seen: Map<object, unknown>, budget: { left: number }): unknown {
  if (value === null || typeof value !== "object") {
    // Functions are noise in a variable table.
    return typeof value === "function" ? undefined : value;
  }
  if (budget.left <= 0) return "…";

  const existing = seen.get(value as object);
  if (existing !== undefined) return existing;

  budget.left -= 1;

  if (Array.isArray(value)) {
    const copy: unknown[] = [];
    seen.set(value as object, copy);
    for (const item of value) copy.push(cloneValue(item, seen, budget));
    return copy;
  }

  if (value instanceof Map) {
    const copy: Record<string, unknown> = {};
    seen.set(value as object, copy);
    for (const [key, entry] of value.entries()) {
      copy[String(key)] = cloneValue(entry, seen, budget);
    }
    return copy;
  }

  if (value instanceof Set) {
    const copy: unknown[] = [];
    seen.set(value as object, copy);
    for (const entry of value.values()) copy.push(cloneValue(entry, seen, budget));
    return copy;
  }

  const copy: Record<string, unknown> = {};
  seen.set(value as object, copy);
  for (const key of Object.keys(value as Record<string, unknown>)) {
    copy[key] = cloneValue((value as Record<string, unknown>)[key], seen, budget);
  }
  return copy;
}

export function runInstrumented(source: string): RunOutcome {
  const { code, lines } = instrument(source);
  const steps: RawStep[] = [];
  let truncated = false;

  const guardedRead = (read: () => unknown) => {
    try {
      return read();
    } catch {
      // Temporal dead zone, or a name not yet in scope.
      return undefined;
    }
  };

  const step = (
    line: number,
    kind: EventKind,
    phase: string,
    snapshot: Record<string, unknown>,
  ) => {
    if (steps.length >= MAX_STEPS) {
      truncated = true;
      throw new StepLimitReached();
    }

    const seen = new Map<object, unknown>();
    const budget = { left: CLONE_BUDGET };
    const cloned: Record<string, unknown> = {};

    for (const key of Object.keys(snapshot)) {
      const value = snapshot[key];
      if (value === undefined) continue;
      cloned[key] = cloneValue(value, seen, budget);
    }

    steps.push({ line, kind, phase, snapshot: cloned });
  };

  try {
    // Indirect construction keeps the user's code out of this module's scope.
    const factory = new Function(
      "__step",
      "__v",
      `"use strict";\n${code}`,
    ) as (s: typeof step, v: typeof guardedRead) => void;

    factory(step, guardedRead);
  } catch (error) {
    if (!(error instanceof StepLimitReached)) {
      const message = error instanceof Error ? error.message : String(error);
      return { steps, lines, error: message, truncated };
    }
  }

  return { steps, lines, truncated };
}
