import type { LinkedListLane, TraceStep } from "@/lib/types";

/**
 * Runtime shape classification.
 *
 * DSA solutions use a small, stereotyped set of shapes, which is what makes
 * inference practical here where it would not be for general code. Each
 * snapshot value is matched against those shapes and routed to a visualizer.
 */

/**
 * Names treated as indices into an array.
 *
 * An allowlist rather than "any integer within bounds" on purpose — `best`,
 * `sum` and `carry` are all small integers too, and calling them pointers
 * would draw confident nonsense.
 */
const POINTER_NAMES = new Set([
  "i", "j", "k", "l", "r", "left", "right", "lo", "hi", "low", "high", "mid",
  "start", "end", "slow", "fast", "read", "write", "index", "idx", "pos", "cur",
  "curr", "current", "front", "back", "top",
]);

const isNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const isPrimitive = (value: unknown) =>
  typeof value === "number" || typeof value === "string" || typeof value === "boolean";

const isPair = (value: unknown): value is [number, number] =>
  Array.isArray(value) && value.length === 2 && isNumber(value[0]) && isNumber(value[1]);

/** An array of `[start, end]` pairs — an interval set. */
const isIntervalArray = (value: unknown): value is [number, number][] =>
  Array.isArray(value) && value.length > 0 && value.every(isPair);

/** An array of primitives — the plain array/string case. */
const isPrimitiveArray = (value: unknown): value is (number | string)[] =>
  Array.isArray(value) && value.length > 0 && value.every(isPrimitive);

type Recordish = Record<string, unknown>;

const isNodeLike = (value: unknown): value is Recordish =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  "next" in (value as Recordish);

const nodeValue = (node: Recordish): string | number => {
  const candidate = node.val ?? node.value ?? node.data ?? node.key;
  return isPrimitive(candidate) ? (candidate as string | number) : "•";
};

/**
 * Walks a `.next` chain, returning the node objects themselves.
 *
 * Identity is preserved by the snapshot clone (shared references stay shared),
 * so these refs can be compared afterwards to work out which variables point
 * at which node.
 */
function chainRefs(head: Recordish): { refs: Recordish[]; terminated: boolean } {
  const refs: Recordish[] = [];
  const seen = new Set<object>();
  let cursor: unknown = head;

  while (cursor && typeof cursor === "object" && !seen.has(cursor as object) && refs.length < 40) {
    seen.add(cursor as object);
    refs.push(cursor as Recordish);
    cursor = (cursor as Recordish).next;
  }

  return { refs, terminated: cursor === null || cursor === undefined };
}

export function formatValue(value: unknown): string {
  if (value === undefined) return "—";
  if (value === null) return "null";
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  if (Array.isArray(value)) {
    const inner = value
      .slice(0, 8)
      .map((item) =>
        Array.isArray(item)
          ? `[${item.slice(0, 4).join(",")}]`
          : isPrimitive(item)
            ? String(item)
            : "…",
      )
      .join(", ");
    return `[${inner}${value.length > 8 ? ", …" : ""}]`;
  }

  if (isNodeLike(value)) return `node(${nodeValue(value as Recordish)})`;

  const entries = Object.entries(value as Recordish).slice(0, 4);
  if (entries.length === 0) return "{ }";
  return `{ ${entries.map(([k, v]) => `${k}:${isPrimitive(v) ? v : "…"}`).join(" ")} }`;
}

export interface Classified {
  structures: TraceStep["structures"];
  variables: Record<string, string>;
}

export function classify(snapshot: Record<string, unknown>): Classified {
  const entries = Object.entries(snapshot);
  const structures: TraceStep["structures"] = {};

  /* --- Intervals ------------------------------------------------------- */
  const intervalCandidates = entries
    .filter(([, value]) => isIntervalArray(value))
    .sort((a, b) => (b[1] as unknown[]).length - (a[1] as unknown[]).length);

  if (intervalCandidates.length > 0) {
    const [name, values] = intervalCandidates[0] as [string, [number, number][]];
    // A second pair-array is almost always the committed output.
    const merged = (intervalCandidates[1]?.[1] as [number, number][] | undefined) ?? [];
    const domainMax = Math.max(1, ...values.map((pair) => pair[1]), ...merged.map((pair) => pair[1])) + 1;

    structures.intervals = { name, values, merged, domainMax };
  }

  /* --- Linked lists ---------------------------------------------------- */
  const listEntries = entries.filter(([, value]) => isNodeLike(value)) as [string, Recordish][];

  if (listEntries.length > 0) {
    // Longest chains first, so full lists win over the suffixes that cursor
    // variables point at.
    const chains = listEntries
      .map(([name, head]) => ({ name, ...chainRefs(head) }))
      .sort((a, b) => b.refs.length - a.refs.length)
      .slice(0, 3);

    const lanes: LinkedListLane[] = chains.map((chain) => ({
      label: chain.name,
      terminal: chain.terminated,
      nodes: chain.refs.map((ref, index) => ({
        id: `${chain.name}-${index}`,
        value: nodeValue(ref),
        tone: "default" as const,
      })),
    }));

    // Any node-valued variable that lands on a drawn node becomes a pointer.
    const pointers: Record<string, string> = {};
    for (const [name, value] of listEntries) {
      for (const chain of chains) {
        const index = chain.refs.indexOf(value);
        if (index >= 0) {
          pointers[name] = `${chain.name}-${index}`;
          break;
        }
      }
    }

    if (lanes.some((laneItem) => laneItem.nodes.length > 0)) {
      structures.linkedList = { lanes, pointers };
    }
  }

  /* --- Arrays ---------------------------------------------------------- */
  if (!structures.intervals) {
    const arrayCandidates: [string, (number | string)[]][] = [];
    for (const [name, value] of entries) {
      if (isPrimitiveArray(value)) {
        arrayCandidates.push([name, value]);
      } else if (typeof value === "string" && value.length > 1 && value.length <= 60) {
        // A string is an array of characters for visualisation purposes.
        arrayCandidates.push([name, value.split("")]);
      }
    }
    arrayCandidates.sort((a, b) => b[1].length - a[1].length);

    if (arrayCandidates.length > 0) {
      const [name, values] = arrayCandidates[0];

      const pointers: Record<string, number> = {};
      for (const [key, value] of entries) {
        if (POINTER_NAMES.has(key) && isNumber(value) && value >= 0 && value < values.length) {
          pointers[key] = value;
        }
      }

      const names = Object.keys(pointers);
      /*
       * `left` and `right` alone read as the bounds of a window, so the span
       * between them is highlighted. Any other combination is a set of
       * independent probes and only the cells themselves are marked.
       */
      const isWindow =
        names.length === 2 &&
        names.includes("left") &&
        names.includes("right") &&
        pointers.left <= pointers.right;

      const highlightedIndices = isWindow
        ? Array.from({ length: pointers.right - pointers.left + 1 }, (_, k) => pointers.left + k)
        : Object.values(pointers);

      structures.array = { name, values, highlightedIndices, pointers };
    }
  }

  /* --- Variable table --------------------------------------------------- */
  const variables: Record<string, string> = {};
  for (const [name, value] of entries) {
    variables[name] = formatValue(value);
  }

  return { structures, variables };
}

/** Names whose formatted value differs between two snapshots. */
export function diffChanged(
  previous: Record<string, string> | undefined,
  current: Record<string, string>,
): string[] {
  if (!previous) return [];
  return Object.keys(current).filter((name) => previous[name] !== current[name]);
}
