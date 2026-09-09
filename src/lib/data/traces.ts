import type { Language, NodeTone, Trace, TraceInputField, TraceStep } from "@/lib/types";

/**
 * Trace generators.
 *
 * Each builder *runs* the algorithm and emits a step whenever the highlighted
 * line changes, so the variable table, the visual structures and the prose stay
 * in agreement by construction.
 *
 * Because they are parameterised by input and free of server-only imports, the
 * "Configure inputs" panel can re-run them in the browser to trace any input —
 * a trace is generated, never recorded. Phase 3 moves the same functions behind
 * `GET /api/problems/[slug]/trace` for languages we cannot execute client-side.
 */

type DraftStep = Omit<TraceStep, "stepIndex">;

const fmtInterval = (pair: [number, number]) => `[${pair[0]}, ${pair[1]}]`;

const fmtIntervals = (pairs: [number, number][]) => `[${pairs.map(fmtInterval).join(", ")}]`;

const withIndices = (drafts: DraftStep[]): TraceStep[] =>
  drafts.map((draft, index) => ({ ...draft, stepIndex: index + 1 }));

/* -------------------------------------------------------------------------- */
/* Line anchoring                                                              */
/* -------------------------------------------------------------------------- */

const LANGUAGES: Language[] = ["JAVA", "PYTHON"];

/**
 * An anchor identifies a source line by its content rather than its number.
 * `nth` disambiguates when the same text appears more than once (for example
 * `merged.add(active)` inside the loop and again after it).
 */
export type LineAnchor = string | { text: string; nth: number };

/**
 * Resolves content anchors to 1-based line numbers, per language.
 *
 * Hardcoding line numbers means every mapping below an edit silently points at
 * the wrong line. Anchors self-correct when the listing shifts, and a stale
 * anchor throws at module load instead of quietly mis-highlighting.
 */
export function resolveLines<K extends string>(
  code: Record<Language, string[]>,
  anchors: Record<K, Record<Language, LineAnchor>>,
): Record<K, Record<Language, number>> {
  const resolved = {} as Record<K, Record<Language, number>>;

  for (const key of Object.keys(anchors) as K[]) {
    const perLanguage = {} as Record<Language, number>;

    for (const language of LANGUAGES) {
      const anchor = anchors[key][language];
      const text = typeof anchor === "string" ? anchor : anchor.text;
      const nth = typeof anchor === "string" ? 1 : anchor.nth;

      let seen = 0;
      let found = -1;
      code[language].forEach((line, index) => {
        if (line.includes(text)) {
          seen += 1;
          if (seen === nth && found === -1) found = index + 1;
        }
      });

      if (found === -1) {
        throw new Error(
          `Trace anchor "${key}" (${language}) did not match occurrence ${nth} of ${JSON.stringify(text)}.`,
        );
      }
      perLanguage[language] = found;
    }

    resolved[key] = perLanguage;
  }

  return resolved;
}

/* -------------------------------------------------------------------------- */
/* Input parsing                                                               */
/* -------------------------------------------------------------------------- */

export class TraceInputError extends Error {}

/** Parses `[[1,3],[2,6]]` or `1,3 2,6` into interval pairs. */
export function parseIntervals(raw: string): [number, number][] {
  const numbers = raw.match(/-?\d+/g);
  if (!numbers || numbers.length === 0) {
    throw new TraceInputError("Enter at least one interval, e.g. [[1,3],[2,6]].");
  }
  if (numbers.length % 2 !== 0) {
    throw new TraceInputError("Every interval needs both a start and an end.");
  }

  const pairs: [number, number][] = [];
  for (let i = 0; i < numbers.length; i += 2) {
    const start = Number(numbers[i]);
    const end = Number(numbers[i + 1]);
    if (start > end) {
      throw new TraceInputError(`Interval [${start}, ${end}] ends before it starts.`);
    }
    pairs.push([start, end]);
  }

  if (pairs.length > 12) {
    throw new TraceInputError("Twelve intervals is the readable limit for the canvas.");
  }
  return pairs;
}

export function parseTraceString(raw: string): string {
  const value = raw.trim();
  if (value.length === 0) {
    throw new TraceInputError("Enter a string to scan.");
  }
  if (value.length > 24) {
    throw new TraceInputError("Keep it to 24 characters so the window stays legible.");
  }
  return value;
}

/* -------------------------------------------------------------------------- */
/* Merge Intervals — interval sweep                                            */
/* -------------------------------------------------------------------------- */

const MERGE_CODE: Record<Language, string[]> = {
  JAVA: [
    "class Solution {",
    "    public int[][] merge(int[][] intervals) {",
    "        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);",
    "",
    "        List<int[]> merged = new ArrayList<>();",
    "        int[] active = intervals[0];",
    "",
    "        for (int i = 1; i < intervals.length; i++) {",
    "            int[] current = intervals[i];",
    "",
    "            if (current[0] <= active[1]) {",
    "                active[1] = Math.max(active[1], current[1]);",
    "            } else {",
    "                merged.add(active);",
    "                active = current;",
    "            }",
    "        }",
    "",
    "        merged.add(active);",
    "        return merged.toArray(new int[merged.size()][]);",
    "    }",
    "}",
  ],
  PYTHON: [
    "class Solution:",
    "    def merge(self, intervals: List[List[int]]) -> List[List[int]]:",
    "        intervals.sort(key=lambda pair: pair[0])",
    "",
    "        merged = []",
    "        active = intervals[0]",
    "",
    "        for current in intervals[1:]:",
    "            if current[0] <= active[1]:",
    "                active[1] = max(active[1], current[1])",
    "            else:",
    "                merged.append(active)",
    "                active = current",
    "",
    "        merged.append(active)",
    "        return merged",
  ],
};

const MERGE_LINES = resolveLines(MERGE_CODE, {
  sort: { JAVA: "Arrays.sort", PYTHON: "intervals.sort" },
  initList: { JAVA: "new ArrayList", PYTHON: "merged = []" },
  initActive: { JAVA: "active = intervals[0]", PYTHON: "active = intervals[0]" },
  loop: { JAVA: "for (int i = 1", PYTHON: "for current in intervals" },
  // Python reads `current` in the for-statement itself, so both land there.
  readCurrent: { JAVA: "int[] current = intervals[i]", PYTHON: "for current in intervals" },
  compare: { JAVA: "if (current[0] <= active[1])", PYTHON: "if current[0] <= active[1]" },
  extend: { JAVA: "Math.max(active[1]", PYTHON: "max(active[1]" },
  commit: { JAVA: "merged.add(active)", PYTHON: "merged.append(active)" },
  reopen: { JAVA: "active = current;", PYTHON: "active = current" },
  // The same commit call appears again after the loop.
  finalCommit: {
    JAVA: { text: "merged.add(active)", nth: 2 },
    PYTHON: { text: "merged.append(active)", nth: 2 },
  },
  ret: { JAVA: "return merged.toArray", PYTHON: "return merged" },
});

export function buildMergeIntervalsTrace(input: [number, number][]): Trace {
  const sorted = input.map((pair) => [...pair] as [number, number]);
  sorted.sort((a, b) => a[0] - b[0]);

  const domainMax = Math.max(...sorted.map((pair) => pair[1])) + 1;
  const merged: [number, number][] = [];
  let active: [number, number] = [...sorted[0]];
  let activeIndex = 0;
  const drafts: DraftStep[] = [];

  const emit = (
    lineHighlight: Record<Language, number>,
    kind: TraceStep["kind"],
    phase: string,
    state: string,
    explanation: string,
    options: {
      i?: number;
      current?: [number, number];
      overlap?: boolean;
      cursorIndex?: number;
      changed?: string[];
    } = {},
  ) => {
    drafts.push({
      lineHighlight,
      kind,
      phase,
      state,
      explanation,
      changed: options.changed,
      variables: {
        i: options.i === undefined ? "—" : String(options.i),
        active: fmtInterval(active),
        current: options.current ? fmtInterval(options.current) : "—",
        overlap: options.overlap === undefined ? "—" : String(options.overlap),
        merged: `${merged.length} committed`,
      },
      structures: {
        intervals: {
          name: "intervals",
          values: sorted.map((pair) => [...pair] as [number, number]),
          activeIndex,
          cursorIndex: options.cursorIndex,
          merged: merged.map((pair) => [...pair] as [number, number]),
          domainMax,
        },
      },
      events: [],
    });
  };

  emit(
    MERGE_LINES.sort,
    "mutation",
    "Sort",
    "input sorted by start",
    "Sort by start time. This is what makes a single greedy pass safe — every interval to the left is already accounted for.",
    { changed: ["intervals"] },
  );

  emit(
    MERGE_LINES.initList,
    "call",
    "Initialize",
    "output list created",
    "Create the list that will hold committed ranges.",
  );

  emit(
    MERGE_LINES.initActive,
    "mutation",
    "Initialize",
    "first range held open",
    `Hold ${fmtInterval(active)} open as the active range. Its end is the only state that survives each comparison.`,
    { changed: ["active"] },
  );

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];

    emit(MERGE_LINES.loop, "call", "Merge scan", `loop i = ${i}`, "Advance to the next interval in sorted order.", {
      i,
    });

    emit(
      MERGE_LINES.readCurrent,
      "call",
      "Merge scan",
      `current = ${fmtInterval(current)}`,
      "Read the next interval.",
      { i, current, cursorIndex: i },
    );

    const overlaps = current[0] <= active[1];

    emit(
      MERGE_LINES.compare,
      "compare",
      "Merge scan",
      `${current[0]} ${overlaps ? "≤" : ">"} ${active[1]}`,
      overlaps
        ? `Start ${current[0]} falls at or before the active end ${active[1]} — the ranges overlap.`
        : `Start ${current[0]} sits past the active end ${active[1]} — the active range can never grow again.`,
      { i, current, overlap: overlaps, cursorIndex: i },
    );

    if (overlaps) {
      const extended = Math.max(active[1], current[1]);
      const contained = extended === active[1];
      active[1] = extended;
      sorted[activeIndex][1] = extended;

      emit(
        MERGE_LINES.extend,
        "mutation",
        "Merge scan",
        "active end extended",
        contained
          ? `${fmtInterval(current)} is contained by the active range, so the end stays at ${extended}. This is exactly why the assignment must be max().`
          : `Extend the active end to ${extended}.`,
        { i, current, overlap: true, cursorIndex: i, changed: ["active"] },
      );
    } else {
      merged.push([...active]);

      emit(
        MERGE_LINES.commit,
        "mutation",
        "Merge scan",
        "range committed",
        `Commit ${fmtInterval(merged[merged.length - 1])} to the output — nothing further can extend it.`,
        { i, current, overlap: false, cursorIndex: i, changed: ["merged"] },
      );

      active = [...current];
      activeIndex = i;

      emit(
        MERGE_LINES.reopen,
        "mutation",
        "Merge scan",
        "new range opened",
        `Open a new active range at ${fmtInterval(active)}.`,
        { i, current, overlap: false, cursorIndex: i, changed: ["active"] },
      );
    }
  }

  merged.push([...active]);
  emit(
    MERGE_LINES.finalCommit,
    "mutation",
    "Return",
    "final range committed",
    "The loop is done, so commit the range still held open.",
    { changed: ["merged"] },
  );

  emit(MERGE_LINES.ret, "return", "Return", "returning result", `Return ${fmtIntervals(merged)}.`);

  return {
    problemSlug: "merge-intervals",
    code: MERGE_CODE,
    steps: withIndices(drafts),
    inputLabel: fmtIntervals(input),
  };
}

/* -------------------------------------------------------------------------- */
/* Longest Substring Without Repeating Characters — sliding window            */
/* -------------------------------------------------------------------------- */

const WINDOW_CODE: Record<Language, string[]> = {
  JAVA: [
    "class Solution {",
    "    public int lengthOfLongestSubstring(String s) {",
    "        Map<Character, Integer> lastSeen = new HashMap<>();",
    "        int best = 0;",
    "        int left = 0;",
    "",
    "        for (int right = 0; right < s.length(); right++) {",
    "            char c = s.charAt(right);",
    "",
    "            if (lastSeen.containsKey(c) && lastSeen.get(c) >= left) {",
    "                left = lastSeen.get(c) + 1;",
    "            }",
    "",
    "            lastSeen.put(c, right);",
    "            best = Math.max(best, right - left + 1);",
    "        }",
    "",
    "        return best;",
    "    }",
    "}",
  ],
  PYTHON: [
    "class Solution:",
    "    def lengthOfLongestSubstring(self, s: str) -> int:",
    "        last_seen = {}",
    "        best = 0",
    "        left = 0",
    "",
    "        for right, c in enumerate(s):",
    "            if c in last_seen and last_seen[c] >= left:",
    "                left = last_seen[c] + 1",
    "",
    "            last_seen[c] = right",
    "            best = max(best, right - left + 1)",
    "",
    "        return best",
  ],
};

const WINDOW_LINES = resolveLines(WINDOW_CODE, {
  initMap: { JAVA: "new HashMap", PYTHON: "last_seen = {}" },
  initBest: { JAVA: "int best = 0", PYTHON: "best = 0" },
  initLeft: { JAVA: "int left = 0", PYTHON: "left = 0" },
  loop: { JAVA: "for (int right = 0", PYTHON: "for right, c in enumerate" },
  // Python destructures the character in the for-statement itself.
  readChar: { JAVA: "char c = s.charAt(right)", PYTHON: "for right, c in enumerate" },
  guard: { JAVA: "lastSeen.containsKey(c)", PYTHON: "if c in last_seen" },
  jump: { JAVA: "left = lastSeen.get(c) + 1", PYTHON: "left = last_seen[c] + 1" },
  record: { JAVA: "lastSeen.put(c, right)", PYTHON: "last_seen[c] = right" },
  best: { JAVA: "best = Math.max", PYTHON: "best = max(" },
  ret: { JAVA: "return best", PYTHON: "return best" },
});

export function buildSlidingWindowTrace(s: string): Trace {
  const chars = s.split("");
  const lastSeen = new Map<string, number>();
  let best = 0;
  let left = 0;
  const drafts: DraftStep[] = [];

  const windowIndices = (right: number) =>
    right < left ? [] : Array.from({ length: right - left + 1 }, (_, k) => left + k);

  const emit = (
    lineHighlight: Record<Language, number>,
    kind: TraceStep["kind"],
    phase: string,
    state: string,
    explanation: string,
    options: { right?: number; c?: string; changed?: string[] } = {},
  ) => {
    const right = options.right;
    const seenEntries = [...lastSeen.entries()].map(([key, value]) => `${key}:${value}`).join(" ");

    drafts.push({
      lineHighlight,
      kind,
      phase,
      state,
      explanation,
      changed: options.changed,
      variables: {
        right: right === undefined ? "—" : String(right),
        left: String(left),
        c: options.c ? `'${options.c}'` : "—",
        width: right === undefined ? "—" : String(right - left + 1),
        best: String(best),
        lastSeen: seenEntries.length > 0 ? `{ ${seenEntries} }` : "{ }",
      },
      structures: {
        array: {
          name: "s",
          values: chars,
          highlightedIndices: right === undefined ? [] : windowIndices(right),
          pointers: right === undefined ? { left } : { left, right },
        },
      },
      events: [],
    });
  };

  emit(
    WINDOW_LINES.initMap,
    "call",
    "Initialize",
    "map created",
    "Track the latest index at which each character was seen.",
  );
  emit(WINDOW_LINES.initBest, "call", "Initialize", "best = 0", "The answer is a width, so it starts at zero.");
  emit(
    WINDOW_LINES.initLeft,
    "call",
    "Initialize",
    "left = 0",
    "The window's left edge. It only ever moves forward.",
  );

  for (let right = 0; right < chars.length; right++) {
    const c = chars[right];

    emit(WINDOW_LINES.loop, "call", "Window scan", `right = ${right}`, "Extend the window one character to the right.", {
      right,
    });

    emit(WINDOW_LINES.readChar, "call", "Window scan", `c = '${c}'`, `Read the incoming character '${c}'.`, {
      right,
      c,
    });

    const seenAt = lastSeen.get(c);
    const insideWindow = seenAt !== undefined && seenAt >= left;

    emit(
      WINDOW_LINES.guard,
      "compare",
      "Window scan",
      insideWindow ? "duplicate inside window" : "window still valid",
      seenAt === undefined
        ? `'${c}' has not been seen before, so the window stays valid.`
        : insideWindow
          ? `'${c}' was last seen at index ${seenAt}, at or after left = ${left} — it is inside the window.`
          : `'${c}' was last seen at index ${seenAt}, before left = ${left}. It is already outside the window, so the guard rejects it.`,
      { right, c },
    );

    if (insideWindow && seenAt !== undefined) {
      left = seenAt + 1;
      emit(
        WINDOW_LINES.jump,
        "mutation",
        "Window scan",
        `left jumps to ${left}`,
        `Jump left past the previous '${c}' in one move. Walking it forward one step at a time would cost the O(n) guarantee.`,
        { right, c, changed: ["left"] },
      );
    }

    lastSeen.set(c, right);
    emit(
      WINDOW_LINES.record,
      "mutation",
      "Window scan",
      `lastSeen['${c}'] = ${right}`,
      `Record the latest position of '${c}'.`,
      { right, c, changed: ["lastSeen"] },
    );

    const width = right - left + 1;
    const improved = width > best;
    best = Math.max(best, width);
    emit(
      WINDOW_LINES.best,
      "mutation",
      "Window scan",
      improved ? `best = ${best}` : `best unchanged at ${best}`,
      improved
        ? `The window is ${width} wide — a new maximum.`
        : `The window is ${width} wide, which does not beat ${best}.`,
      { right, c, changed: improved ? ["best"] : undefined },
    );
  }

  emit(WINDOW_LINES.ret, "return", "Return", "returning result", `Return the widest valid window: ${best}.`);

  return {
    problemSlug: "longest-substring-without-repeating-characters",
    code: WINDOW_CODE,
    steps: withIndices(drafts),
    inputLabel: `s = "${s}"`,
  };
}

/* -------------------------------------------------------------------------- */
/* Add Two Numbers — linked list column addition                              */
/* -------------------------------------------------------------------------- */

const ADD_CODE: Record<Language, string[]> = {
  JAVA: [
    "class Solution {",
    "    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {",
    "        ListNode dummy = new ListNode(0);",
    "        ListNode current = dummy;",
    "        int carry = 0;",
    "",
    "        while (l1 != null || l2 != null || carry != 0) {",
    "            int sum = (l1 != null ? l1.val : 0)",
    "                    + (l2 != null ? l2.val : 0) + carry;",
    "",
    "            carry = sum / 10;",
    "            current.next = new ListNode(sum % 10);",
    "",
    "            current = current.next;",
    "            if (l1 != null) l1 = l1.next;",
    "            if (l2 != null) l2 = l2.next;",
    "        }",
    "",
    "        return dummy.next;",
    "    }",
    "}",
  ],
  PYTHON: [
    "class Solution:",
    "    def addTwoNumbers(self, l1: ListNode, l2: ListNode) -> ListNode:",
    "        dummy = ListNode(0)",
    "        current = dummy",
    "        carry = 0",
    "",
    "        while l1 or l2 or carry:",
    "            total = (l1.val if l1 else 0) + (l2.val if l2 else 0) + carry",
    "",
    "            carry, digit = divmod(total, 10)",
    "            current.next = ListNode(digit)",
    "",
    "            current = current.next",
    "            l1 = l1.next if l1 else None",
    "            l2 = l2.next if l2 else None",
    "",
    "        return dummy.next",
  ],
};

const ADD_LINES = resolveLines(ADD_CODE, {
  initDummy: { JAVA: "ListNode dummy = new ListNode(0)", PYTHON: "dummy = ListNode(0)" },
  initCurrent: { JAVA: "ListNode current = dummy", PYTHON: "current = dummy" },
  initCarry: { JAVA: "int carry = 0", PYTHON: "carry = 0" },
  loop: { JAVA: "while (l1 != null", PYTHON: "while l1 or l2 or carry" },
  sum: { JAVA: "int sum = (l1 != null", PYTHON: "total = (l1.val if l1" },
  carry: { JAVA: "carry = sum / 10", PYTHON: "carry, digit = divmod" },
  append: { JAVA: "current.next = new ListNode", PYTHON: "current.next = ListNode(digit)" },
  advanceCurrent: { JAVA: "current = current.next;", PYTHON: "current = current.next" },
  advanceInputs: { JAVA: "if (l1 != null) l1 = l1.next", PYTHON: "l1 = l1.next if l1" },
  ret: { JAVA: "return dummy.next", PYTHON: "return dummy.next" },
});

/** Parses `2,4,3` or `[2,4,3]` into digits. */
export function parseDigits(raw: string, label: string): number[] {
  const numbers = raw.match(/\d/g);
  if (!numbers || numbers.length === 0) {
    throw new TraceInputError(`Enter at least one digit for ${label}, e.g. 2,4,3.`);
  }
  if (numbers.length > 8) {
    throw new TraceInputError(`Keep ${label} to 8 digits so the lanes stay legible.`);
  }
  return numbers.map(Number);
}

export function buildAddTwoNumbersTrace(digits1: number[], digits2: number[]): Trace {
  const drafts: DraftStep[] = [];

  // The lists are immutable here; `consumed` counts model the pointer walking
  // off the front, which is what the Java/Python code does to l1 and l2.
  const lane = (label: string, digits: number[], consumed: number, activeAt: number | null) => ({
    label,
    terminal: true,
    nodes: digits.map((digit, index) => ({
      id: `${label}-${index}`,
      value: digit,
      tone:
        index < consumed
          ? ("consumed" as const)
          : index === activeAt
            ? ("active" as const)
            : ("default" as const),
    })),
  });

  let carry = 0;
  let index = 0;
  const output: number[] = [];
  let justCreated = -1;

  const emit = (
    lineHighlight: Record<Language, number>,
    kind: TraceStep["kind"],
    phase: string,
    state: string,
    explanation: string,
    options: { sum?: number | null; changed?: string[]; showActive?: boolean } = {},
  ) => {
    const active = options.showActive ? index : null;
    const p1 = index < digits1.length ? `${digits1[index]}` : "null";
    const p2 = index < digits2.length ? `${digits2[index]}` : "null";

    drafts.push({
      lineHighlight,
      kind,
      phase,
      state,
      explanation,
      changed: options.changed,
      variables: {
        l1: index < digits1.length ? `node(${p1})` : "null",
        l2: index < digits2.length ? `node(${p2})` : "null",
        sum: options.sum === undefined || options.sum === null ? "—" : String(options.sum),
        carry: String(carry),
        result: output.length > 0 ? output.join(" → ") : "empty",
      },
      structures: {
        linkedList: {
          lanes: [
            lane("l1", digits1, index, active),
            lane("l2", digits2, index, active),
            {
              label: "result",
              terminal: output.length > 0,
              emptyHint: "dummy.next is still null",
              nodes: output.map((digit, position) => ({
                id: `result-${position}`,
                value: digit,
                tone: position === justCreated ? ("created" as const) : ("default" as const),
              })),
            },
          ],
          pointers: {
            ...(index < digits1.length ? { l1: `l1-${index}` } : {}),
            ...(index < digits2.length ? { l2: `l2-${index}` } : {}),
            ...(output.length > 0 ? { current: `result-${output.length - 1}` } : {}),
          },
        },
      },
      events: [],
    });
  };

  emit(
    ADD_LINES.initDummy,
    "call",
    "Initialize",
    "dummy node created",
    "Start with a dummy node. It removes the special case for the first digit, so the loop never has to ask whether the result list is empty.",
    { changed: ["result"] },
  );

  emit(
    ADD_LINES.initCurrent,
    "call",
    "Initialize",
    "current = dummy",
    "`current` is the tail of the result list. It always points at the last node written.",
  );

  emit(
    ADD_LINES.initCarry,
    "call",
    "Initialize",
    "carry = 0",
    "Digits are stored least-significant first, so a plain left-to-right walk is column addition from the ones place upward.",
  );

  while (index < digits1.length || index < digits2.length || carry !== 0) {
    const a = index < digits1.length ? digits1[index] : 0;
    const b = index < digits2.length ? digits2[index] : 0;

    emit(
      ADD_LINES.loop,
      "call",
      "Column addition",
      `column ${index}`,
      index < digits1.length || index < digits2.length
        ? `Digits remain, so process column ${index}.`
        : `Both lists are exhausted but carry is ${carry}, so one more column is still owed.`,
      { showActive: true },
    );

    const sum = a + b + carry;
    emit(
      ADD_LINES.sum,
      "compare",
      "Column addition",
      `${a} + ${b} + ${carry} = ${sum}`,
      `A missing digit counts as 0, which is what lets lists of different lengths share one loop.`,
      { sum, showActive: true },
    );

    const nextCarry = Math.floor(sum / 10);
    const digit = sum % 10;
    carry = nextCarry;

    emit(
      ADD_LINES.carry,
      "mutation",
      "Column addition",
      `carry = ${carry}`,
      nextCarry > 0
        ? `${sum} does not fit in one digit, so ${digit} stays and 1 carries into the next column.`
        : `${sum} fits in a single digit, so nothing carries.`,
      { sum, changed: ["carry"], showActive: true },
    );

    output.push(digit);
    justCreated = output.length - 1;

    emit(
      ADD_LINES.append,
      "mutation",
      "Column addition",
      `append ${digit}`,
      `Link a new node holding ${digit} onto the tail of the result.`,
      { sum, changed: ["result"], showActive: true },
    );

    emit(
      ADD_LINES.advanceCurrent,
      "mutation",
      "Column addition",
      "current advances",
      "Move `current` onto the node just written so the next append lands after it.",
      { sum, showActive: true },
    );

    index += 1;
    justCreated = -1;

    emit(
      ADD_LINES.advanceInputs,
      "mutation",
      "Column addition",
      `l1 / l2 advance`,
      "Advance each input pointer only if it still has a node — guarding here is what prevents a null dereference on the shorter list.",
      { changed: ["l1", "l2"] },
    );
  }

  emit(
    ADD_LINES.ret,
    "return",
    "Return",
    "returning result",
    `Return dummy.next, skipping the placeholder: ${output.join(" → ")}.`,
  );

  return {
    problemSlug: "add-two-numbers",
    code: ADD_CODE,
    steps: withIndices(drafts),
    inputLabel: `l1 = [${digits1.join(",")}], l2 = [${digits2.join(",")}]`,
  };
}

/* -------------------------------------------------------------------------- */
/* 3Sum — sort plus a two-pointer squeeze                                     */
/* -------------------------------------------------------------------------- */

const THREE_SUM_CODE: Record<Language, string[]> = {
  JAVA: [
    "class Solution {",
    "    public List<List<Integer>> threeSum(int[] nums) {",
    "        Arrays.sort(nums);",
    "        List<List<Integer>> result = new ArrayList<>();",
    "",
    "        for (int i = 0; i < nums.length - 2; i++) {",
    "            if (nums[i] > 0) break;",
    "            if (i > 0 && nums[i] == nums[i - 1]) continue;",
    "",
    "            int left = i + 1, right = nums.length - 1;",
    "            while (left < right) {",
    "                int sum = nums[i] + nums[left] + nums[right];",
    "",
    "                if (sum < 0) {",
    "                    left++;",
    "                } else if (sum > 0) {",
    "                    right--;",
    "                } else {",
    "                    result.add(List.of(nums[i], nums[left], nums[right]));",
    "                    while (left < right && nums[left] == nums[left + 1]) left++;",
    "                    while (left < right && nums[right] == nums[right - 1]) right--;",
    "                    left++;",
    "                    right--;",
    "                }",
    "            }",
    "        }",
    "",
    "        return result;",
    "    }",
    "}",
  ],
  PYTHON: [
    "class Solution:",
    "    def threeSum(self, nums: List[int]) -> List[List[int]]:",
    "        nums.sort()",
    "        result = []",
    "",
    "        for i in range(len(nums) - 2):",
    "            if nums[i] > 0:",
    "                break",
    "            if i > 0 and nums[i] == nums[i - 1]:",
    "                continue",
    "",
    "            left, right = i + 1, len(nums) - 1",
    "            while left < right:",
    "                total = nums[i] + nums[left] + nums[right]",
    "",
    "                if total < 0:",
    "                    left += 1",
    "                elif total > 0:",
    "                    right -= 1",
    "                else:",
    "                    result.append([nums[i], nums[left], nums[right]])",
    "                    while left < right and nums[left] == nums[left + 1]:",
    "                        left += 1",
    "                    while left < right and nums[right] == nums[right - 1]:",
    "                        right -= 1",
    "                    left += 1",
    "                    right -= 1",
    "",
    "        return result",
  ],
};

const THREE_SUM_LINES = resolveLines(THREE_SUM_CODE, {
  sort: { JAVA: "Arrays.sort", PYTHON: "nums.sort()" },
  initResult: { JAVA: "new ArrayList", PYTHON: "result = []" },
  loopI: { JAVA: "for (int i = 0", PYTHON: "for i in range(len(nums)" },
  breakPositive: { JAVA: "if (nums[i] > 0) break", PYTHON: "if nums[i] > 0:" },
  skipDup: { JAVA: "nums[i] == nums[i - 1]) continue", PYTHON: "if i > 0 and nums[i]" },
  initPointers: { JAVA: "int left = i + 1", PYTHON: "left, right = i + 1" },
  // The colon / brace keeps these distinct from the `while ... and ...` dedupe loops.
  whileLoop: { JAVA: "while (left < right) {", PYTHON: "while left < right:" },
  sum: { JAVA: "int sum = nums[i]", PYTHON: "total = nums[i]" },
  tooSmall: { JAVA: "if (sum < 0)", PYTHON: "if total < 0:" },
  advanceLeft: { JAVA: "left++;", PYTHON: "left += 1" },
  tooBig: { JAVA: "} else if (sum > 0)", PYTHON: "elif total > 0:" },
  advanceRight: { JAVA: "right--;", PYTHON: "right -= 1" },
  record: { JAVA: "result.add(List.of", PYTHON: "result.append([nums[i]" },
  skipLeftDup: { JAVA: "nums[left] == nums[left + 1]", PYTHON: "nums[left] == nums[left + 1]" },
  skipRightDup: { JAVA: "nums[right] == nums[right - 1]", PYTHON: "nums[right] == nums[right - 1]" },
  // Third occurrence: the two closing moves after a hit.
  closeBoth: {
    JAVA: { text: "left++;", nth: 3 },
    PYTHON: { text: "left += 1", nth: 3 },
  },
  ret: { JAVA: "return result", PYTHON: "return result" },
});

/** Parses `-1,0,1,2,-1,-4` or `[-1,0,1]` into numbers. */
export function parseNumberList(raw: string): number[] {
  const numbers = raw.match(/-?\d+/g);
  if (!numbers || numbers.length < 3) {
    throw new TraceInputError("3Sum needs at least three numbers, e.g. -1,0,1,2,-1,-4.");
  }
  if (numbers.length > 10) {
    throw new TraceInputError("Ten numbers is the readable limit for the canvas.");
  }
  return numbers.map(Number);
}

export function buildThreeSumTrace(input: number[]): Trace {
  const nums = [...input].sort((a, b) => a - b);
  const result: number[][] = [];
  const drafts: DraftStep[] = [];

  let i = 0;
  let left = 0;
  let right = 0;
  let sum: number | null = null;

  const fmtResult = () =>
    result.length === 0 ? "empty" : result.map((t) => `[${t.join(",")}]`).join(" ");

  const emit = (
    lineHighlight: Record<Language, number>,
    kind: TraceStep["kind"],
    phase: string,
    state: string,
    explanation: string,
    options: { showPointers?: boolean; changed?: string[] } = {},
  ) => {
    const pointers: Record<string, number> = { i };
    if (options.showPointers) {
      pointers.left = left;
      pointers.right = right;
    }

    drafts.push({
      lineHighlight,
      kind,
      phase,
      state,
      explanation,
      changed: options.changed,
      variables: {
        i: String(i),
        left: options.showPointers ? String(left) : "—",
        right: options.showPointers ? String(right) : "—",
        sum: sum === null ? "—" : String(sum),
        found: `${result.length} triplet${result.length === 1 ? "" : "s"}`,
        result: fmtResult(),
      },
      structures: {
        array: {
          name: "nums",
          values: [...nums],
          // Non-contiguous on purpose: these are three probes, not a window.
          highlightedIndices: options.showPointers ? [i, left, right] : [i],
          pointers,
        },
      },
      events: [],
    });
  };

  emit(
    THREE_SUM_LINES.sort,
    "mutation",
    "Sort",
    "input sorted",
    "Sorting does two jobs: it turns the inner search into a two-pointer squeeze, and it puts equal values next to each other so duplicates can be skipped cheaply.",
    { changed: ["nums"] },
  );

  emit(THREE_SUM_LINES.initResult, "call", "Initialize", "result list created", "Collect the triplets here.");

  for (i = 0; i < nums.length - 2; i++) {
    sum = null;

    emit(THREE_SUM_LINES.loopI, "call", "Fix i", `i = ${i}`, `Fix ${nums[i]} as the first number of the triplet.`);

    if (nums[i] > 0) {
      emit(
        THREE_SUM_LINES.breakPositive,
        "compare",
        "Fix i",
        `${nums[i]} > 0`,
        `Everything from here on is positive, so no triplet can still sum to zero. Stop early.`,
      );
      break;
    }

    emit(
      THREE_SUM_LINES.breakPositive,
      "compare",
      "Fix i",
      `${nums[i]} ≤ 0`,
      "A non-positive first number leaves room to reach zero, so keep going.",
    );

    if (i > 0 && nums[i] === nums[i - 1]) {
      emit(
        THREE_SUM_LINES.skipDup,
        "compare",
        "Fix i",
        "duplicate i skipped",
        `nums[${i}] repeats nums[${i - 1}], so every triplet starting here was already found. Skip it — this is the first of three places duplicates must be handled.`,
      );
      continue;
    }

    if (i > 0) {
      emit(
        THREE_SUM_LINES.skipDup,
        "compare",
        "Fix i",
        "i is not a repeat",
        `nums[${i}] differs from nums[${i - 1}], so this is a new starting value.`,
      );
    }

    left = i + 1;
    right = nums.length - 1;

    emit(
      THREE_SUM_LINES.initPointers,
      "mutation",
      "Squeeze",
      `left = ${left}, right = ${right}`,
      "Squeeze the remainder of the array from both ends.",
      { showPointers: true, changed: ["left", "right"] },
    );

    while (left < right) {
      emit(
        THREE_SUM_LINES.whileLoop,
        "call",
        "Squeeze",
        `left ${left} < right ${right}`,
        "The pointers have not met, so there is still a pair to test.",
        { showPointers: true },
      );

      sum = nums[i] + nums[left] + nums[right];

      emit(
        THREE_SUM_LINES.sum,
        "compare",
        "Squeeze",
        `${nums[i]} + ${nums[left]} + ${nums[right]} = ${sum}`,
        "Add the fixed number to the pair under the two pointers.",
        { showPointers: true },
      );

      if (sum < 0) {
        emit(
          THREE_SUM_LINES.tooSmall,
          "mutation",
          "Squeeze",
          `${sum} < 0 · left advances`,
          `The sum is short of zero. Because the array is sorted, only a larger left value can help — moving right would make it smaller still.`,
          { showPointers: true, changed: ["left"] },
        );
        left += 1;
      } else if (sum > 0) {
        emit(
          THREE_SUM_LINES.tooBig,
          "mutation",
          "Squeeze",
          `${sum} > 0 · right retreats`,
          "The sum overshoots zero, so pull the right pointer down to a smaller value.",
          { showPointers: true, changed: ["right"] },
        );
        right -= 1;
      } else {
        const triplet = [nums[i], nums[left], nums[right]];
        result.push(triplet);

        emit(
          THREE_SUM_LINES.record,
          "mutation",
          "Squeeze",
          `found [${triplet.join(", ")}]`,
          `The three values sum to zero. Record the triplet.`,
          { showPointers: true, changed: ["result", "found"] },
        );

        let skippedLeft = 0;
        while (left < right && nums[left] === nums[left + 1]) {
          left += 1;
          skippedLeft += 1;
        }
        if (skippedLeft > 0) {
          emit(
            THREE_SUM_LINES.skipLeftDup,
            "mutation",
            "Squeeze",
            `left skips ${skippedLeft} duplicate${skippedLeft === 1 ? "" : "s"}`,
            "Walk left past its duplicate run, or the identical triplet would be recorded again. This is the second place duplicates must be handled.",
            { showPointers: true, changed: ["left"] },
          );
        }

        let skippedRight = 0;
        while (left < right && nums[right] === nums[right - 1]) {
          right -= 1;
          skippedRight += 1;
        }
        if (skippedRight > 0) {
          emit(
            THREE_SUM_LINES.skipRightDup,
            "mutation",
            "Squeeze",
            `right skips ${skippedRight} duplicate${skippedRight === 1 ? "" : "s"}`,
            "Same on the right — the third and last place duplicates must be handled.",
            { showPointers: true, changed: ["right"] },
          );
        }

        left += 1;
        right -= 1;

        emit(
          THREE_SUM_LINES.closeBoth,
          "mutation",
          "Squeeze",
          "both pointers close in",
          "The pair is used up, so move both pointers inward to look for the next one.",
          { showPointers: true, changed: ["left", "right"] },
        );
      }
    }
  }

  sum = null;
  i = Math.max(0, Math.min(i, nums.length - 1));

  emit(
    THREE_SUM_LINES.ret,
    "return",
    "Return",
    "returning result",
    result.length === 0
      ? "No triplet sums to zero, so return an empty list."
      : `Return ${result.length} triplet${result.length === 1 ? "" : "s"}: ${fmtResult()}.`,
  );

  return {
    problemSlug: "three-sum",
    code: THREE_SUM_CODE,
    steps: withIndices(drafts),
    inputLabel: `nums = [${input.join(",")}]`,
  };
}

/* -------------------------------------------------------------------------- */
/* Registry                                                                    */
/* -------------------------------------------------------------------------- */

export interface TraceRecipe {
  problemSlug: string;
  fields: TraceInputField[];
  /** Builds a trace from raw field values. Throws TraceInputError on bad input. */
  build: (values: Record<string, string>) => Trace;
}

/** Parses a comma or bracket separated list of integers for a trace input. */
export function parseTraceNumbers(raw: string, label: string): number[] {
  const numbers = raw.match(/-?\d+/g);
  if (!numbers || numbers.length === 0) {
    throw new TraceInputError(`Enter at least one number for ${label}.`);
  }
  if (numbers.length > 12) {
    throw new TraceInputError("Twelve numbers is the readable limit for the canvas.");
  }
  return numbers.map(Number);
}

/** Parses a single integer trace input, e.g. a search target. */
export function parseTraceTarget(raw: string, label: string): number {
  const trimmed = raw.trim();
  const value = Number(trimmed);
  if (trimmed.length === 0 || !Number.isFinite(value)) {
    throw new TraceInputError(`${label} must be a number.`);
  }
  return value;
}

export const traceRecipes: TraceRecipe[] = [
  {
    problemSlug: "merge-intervals",
    fields: [
      {
        key: "intervals",
        label: "intervals",
        hint: "Up to 12 pairs. Order does not matter — the algorithm sorts first.",
        placeholder: "[[1,3],[2,6],[8,10]]",
        value: "[[1,3],[2,6],[8,10],[9,12],[15,18],[17,20]]",
      },
    ],
    build: (values) => buildMergeIntervalsTrace(parseIntervals(values.intervals ?? "")),
  },
  {
    problemSlug: "longest-substring-without-repeating-characters",
    fields: [
      {
        key: "s",
        label: "s",
        hint: "Up to 24 characters. Try one with an early repeat, like pwwkew.",
        placeholder: "abcabcbb",
        value: "abcabcbb",
      },
    ],
    build: (values) => buildSlidingWindowTrace(parseTraceString(values.s ?? "")),
  },
  {
    problemSlug: "add-two-numbers",
    fields: [
      {
        key: "l1",
        label: "l1",
        hint: "Digits least-significant first. 2,4,3 is the number 342.",
        placeholder: "2,4,3",
        value: "2,4,3",
      },
      {
        key: "l2",
        label: "l2",
        hint: "Try different lengths, or 9,9,9 to watch the carry ripple.",
        placeholder: "5,6,4",
        value: "5,6,4",
      },
    ],
    build: (values) =>
      buildAddTwoNumbersTrace(
        parseDigits(values.l1 ?? "", "l1"),
        parseDigits(values.l2 ?? "", "l2"),
      ),
  },
  {
    problemSlug: "three-sum",
    fields: [
      {
        key: "nums",
        label: "nums",
        hint: "3 to 10 numbers. Try -2,0,0,2,2 to watch all three dedupe guards fire.",
        placeholder: "-1,0,1,2,-1,-4",
        value: "-1,0,1,2,-1,-4",
      },
    ],
    build: (values) => buildThreeSumTrace(parseNumberList(values.nums ?? "")),
  },
  {
    problemSlug: "binary-tree-level-order-traversal",
    fields: [
      {
        key: "root",
        label: "root",
        hint: "Level order, with null for a missing child. Up to 15 nodes.",
        placeholder: "3,9,20,null,null,15,7",
        value: "3,9,20,null,null,15,7",
      },
    ],
    build: (values) => buildLevelOrderTrace(parseTreeLevels(values.root ?? "")),
  },
  {
    problemSlug: "maximum-subarray",
    fields: [
      {
        key: "nums",
        label: "nums",
        hint: "Try -3,-2,-5 — all negative is where the naive version returns 0.",
        placeholder: "-2,1,-3,4,-1,2,1,-5,4",
        value: "-2,1,-3,4,-1,2,1,-5,4",
      },
    ],
    build: (values) => buildMaxSubarrayTrace(parseTraceNumbers(values.nums ?? "", "nums")),
  },
  {
    problemSlug: "best-time-to-buy-and-sell-stock",
    fields: [
      {
        key: "prices",
        label: "prices",
        hint: "Try 7,6,4,3,1 — a falling market must return 0, not a loss.",
        placeholder: "7,1,5,3,6,4",
        value: "7,1,5,3,6,4",
      },
    ],
    build: (values) => buildBuySellTrace(parseTraceNumbers(values.prices ?? "", "prices")),
  },
  {
    problemSlug: "search-in-rotated-sorted-array",
    fields: [
      {
        key: "nums",
        label: "nums",
        hint: "An ascending array, rotated. Must be distinct values.",
        placeholder: "4,5,6,7,0,1,2",
        value: "4,5,6,7,0,1,2",
      },
      {
        key: "target",
        label: "target",
        hint: "Try 3 to watch the window close on a miss.",
        placeholder: "0",
        value: "0",
      },
    ],
    build: (values) => {
      const nums = parseTraceNumbers(values.nums ?? "", "nums");
      const raw = (values.target ?? "").trim();
      const target = Number(raw);
      if (raw.length === 0 || !Number.isFinite(target)) {
        throw new TraceInputError("Target must be a number.");
      }
      return buildRotatedSearchTrace(nums, target);
    },
  },
  {
    problemSlug: "array-linear-search",
    fields: [
      {
        key: "numbers",
        label: "numbers",
        hint: "Unsorted is fine — that is the point.",
        placeholder: "2,4,6,8,10",
        value: "2,4,6,8,10",
      },
      {
        key: "key",
        label: "key",
        hint: "Try 5 to watch it check every element and still miss.",
        placeholder: "8",
        value: "8",
      },
    ],
    build: (values) =>
      buildLinearSearchTrace(
        parseTraceNumbers(values.numbers ?? "", "numbers"),
        parseTraceTarget(values.key ?? "", "key"),
      ),
  },
  {
    problemSlug: "binary-search",
    fields: [
      {
        key: "nums",
        label: "nums",
        hint: "Must be sorted ascending — the halving depends on it.",
        placeholder: "-1,0,3,5,9,12",
        value: "-1,0,3,5,9,12",
      },
      {
        key: "target",
        label: "target",
        hint: "Try 2 to watch the window close empty.",
        placeholder: "9",
        value: "9",
      },
    ],
    build: (values) => {
      const nums = parseTraceNumbers(values.nums ?? "", "nums");
      for (let i = 1; i < nums.length; i++) {
        if (nums[i] < nums[i - 1]) {
          throw new TraceInputError("Binary search needs a sorted array — try ascending values.");
        }
      }
      return buildBinarySearchTrace(nums, parseTraceTarget(values.target ?? "", "target"));
    },
  },
  {
    problemSlug: "array-reverse-in-place",
    fields: [
      {
        key: "numbers",
        label: "numbers",
        hint: "Try an odd length to see the middle element stay put.",
        placeholder: "2,4,6,8,10",
        value: "2,4,6,8,10",
      },
    ],
    build: (values) => buildReverseArrayTrace(parseTraceNumbers(values.numbers ?? "", "numbers")),
  },
  {
    problemSlug: "course-schedule",
    fields: [
      {
        key: "n",
        label: "numCourses",
        hint: "2 to 8 courses, numbered from 0.",
        placeholder: "4",
        value: "4",
      },
      {
        key: "prerequisites",
        label: "prerequisites",
        hint: "Pairs of [course, prerequisite]. Try [[1,0],[0,1]] to watch a cycle stall.",
        placeholder: "[[1,0],[2,1],[3,2]]",
        value: "[[1,0],[2,0],[3,1],[3,2]]",
      },
    ],
    build: (values) => {
      const { n, edges } = parseCourseSchedule(values.n ?? "", values.prerequisites ?? "");
      return buildCourseScheduleTrace(n, edges);
    },
  },
];

export const recipeForProblem = (slug: string) => traceRecipes.find((r) => r.problemSlug === slug);

/** Builds a trace from a recipe's default field values. */
export const defaultTraceFor = (slug: string): Trace | undefined => {
  const recipe = recipeForProblem(slug);
  if (!recipe) return undefined;
  const values = Object.fromEntries(recipe.fields.map((f) => [f.key, f.value]));
  return recipe.build(values);
};

/* -------------------------------------------------------------------------- */
/* Binary tree — level order traversal (BFS)                                   */
/* -------------------------------------------------------------------------- */

const LEVEL_ORDER_CODE: Record<Language, string[]> = {
  JAVA: [
    "class Solution {",
    "    public List<List<Integer>> levelOrder(TreeNode root) {",
    "        List<List<Integer>> result = new ArrayList<>();",
    "        if (root == null) return result;",
    "",
    "        Queue<TreeNode> queue = new ArrayDeque<>();",
    "        queue.offer(root);",
    "",
    "        while (!queue.isEmpty()) {",
    "            int levelSize = queue.size();",
    "            List<Integer> level = new ArrayList<>();",
    "",
    "            for (int i = 0; i < levelSize; i++) {",
    "                TreeNode node = queue.poll();",
    "                level.add(node.val);",
    "",
    "                if (node.left != null) queue.offer(node.left);",
    "                if (node.right != null) queue.offer(node.right);",
    "            }",
    "",
    "            result.add(level);",
    "        }",
    "",
    "        return result;",
    "    }",
    "}",
  ],
  PYTHON: [
    "class Solution:",
    "    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:",
    "        result = []",
    "        if not root:",
    "            return result",
    "",
    "        queue = deque([root])",
    "",
    "        while queue:",
    "            level_size = len(queue)",
    "            level = []",
    "",
    "            for _ in range(level_size):",
    "                node = queue.popleft()",
    "                level.append(node.val)",
    "",
    "                if node.left:",
    "                    queue.append(node.left)",
    "                if node.right:",
    "                    queue.append(node.right)",
    "",
    "            result.append(level)",
    "",
    "        return result",
  ],
};

const LEVEL_ORDER_LINES = resolveLines(LEVEL_ORDER_CODE, {
  initResult: { JAVA: "List<List<Integer>> result", PYTHON: "result = []" },
  guardEmpty: { JAVA: "if (root == null)", PYTHON: "if not root:" },
  initQueue: { JAVA: "Queue<TreeNode> queue", PYTHON: "queue = deque([root])" },
  seedQueue: { JAVA: "queue.offer(root)", PYTHON: "queue = deque([root])" },
  whileQueue: { JAVA: "while (!queue.isEmpty())", PYTHON: "while queue:" },
  levelSize: { JAVA: "int levelSize", PYTHON: "level_size = len(queue)" },
  initLevel: { JAVA: "List<Integer> level", PYTHON: "level = []" },
  forLevel: { JAVA: "for (int i = 0; i < levelSize", PYTHON: "for _ in range(level_size)" },
  poll: { JAVA: "queue.poll()", PYTHON: "queue.popleft()" },
  visit: { JAVA: "level.add(node.val)", PYTHON: "level.append(node.val)" },
  pushLeft: { JAVA: "node.left != null", PYTHON: "if node.left:" },
  pushRight: { JAVA: "node.right != null", PYTHON: "if node.right:" },
  commitLevel: { JAVA: "result.add(level)", PYTHON: "result.append(level)" },
  ret: { JAVA: "return result;", PYTHON: { text: "return result", nth: 2 } },
});

/**
 * Parses a LeetCode-style level-order array into heap-indexed nodes.
 *
 * `null` marks an absent child, so positions must be tracked rather than
 * counted — `[3,9,20,null,null,15,7]` puts 15 at heap index 6, not 4.
 */
export function parseTreeLevels(raw: string): { index: number; value: number }[] {
  const tokens = raw
    .replace(/[[\]\s]/g, "")
    .split(",")
    .filter((token) => token.length > 0);

  if (tokens.length === 0) {
    throw new TraceInputError("Enter a tree, e.g. 3,9,20,null,null,15,7.");
  }
  if (tokens.length > 15) {
    throw new TraceInputError("Fifteen nodes is the readable limit for the canvas.");
  }
  if (tokens[0] === "null") {
    throw new TraceInputError("The root cannot be null.");
  }

  // Walk the array as a level-order stream, assigning heap indices per level.
  const nodes: { index: number; value: number }[] = [];
  let cursor = 0;
  let frontier = [1];

  while (cursor < tokens.length && frontier.length > 0) {
    const next: number[] = [];

    for (const heapIndex of frontier) {
      if (cursor >= tokens.length) break;
      const token = tokens[cursor++];

      if (token === "null") continue;
      const value = Number(token);
      if (!Number.isFinite(value)) {
        throw new TraceInputError(`"${token}" is not a number or null.`);
      }

      nodes.push({ index: heapIndex, value });
      next.push(heapIndex * 2, heapIndex * 2 + 1);
    }

    frontier = next;
  }

  if (nodes.length === 0) throw new TraceInputError("That tree has no nodes.");
  return nodes;
}

export function buildLevelOrderTrace(input: { index: number; value: number }[]): Trace {
  const byIndex = new Map(input.map((node) => [node.index, node.value]));
  const idOf = (heapIndex: number) => `n${heapIndex}`;
  const depthOf = (heapIndex: number) => Math.floor(Math.log2(heapIndex));
  const slotOf = (heapIndex: number) => heapIndex - 2 ** depthOf(heapIndex);

  const drafts: DraftStep[] = [];

  const visited = new Set<number>();
  const active = new Set<number>();
  let queue: number[] = [];
  let levels: number[][] = [];
  let level: number[] = [];
  let current: number | null = null;
  let levelSize = 0;

  const treeNodes = () =>
    input.map(({ index, value }) => ({
      id: idOf(index),
      value,
      depth: depthOf(index),
      slot: slotOf(index),
      parentId: index === 1 ? undefined : idOf(Math.floor(index / 2)),
      tone: (current === index
        ? "active"
        : visited.has(index)
          ? "consumed"
          : active.has(index)
            ? "created"
            : "default") as NodeTone,
    }));

  const emit = (
    lineHighlight: Record<Language, number>,
    kind: TraceStep["kind"],
    phase: string,
    state: string,
    explanation: string,
    changed?: string[],
  ) => {
    drafts.push({
      lineHighlight,
      kind,
      phase,
      state,
      explanation,
      changed,
      variables: {
        node: current === null ? "—" : String(byIndex.get(current)),
        levelSize: levelSize === 0 ? "—" : String(levelSize),
        queue: queue.length === 0 ? "empty" : queue.map((i) => byIndex.get(i)).join(", "),
        level: level.length === 0 ? "empty" : `[${level.join(", ")}]`,
        result: `${levels.length} level${levels.length === 1 ? "" : "s"}`,
      },
      structures: {
        tree: {
          name: "root",
          nodes: treeNodes(),
          pointers: current === null ? {} : { node: idOf(current) },
          frontier: {
            label: "Queue · front first",
            ids: queue.map(idOf),
            emptyHint: "empty",
          },
          levels: levels.map((row) => [...row]),
        },
      },
      events: [],
    });
  };

  emit(LEVEL_ORDER_LINES.initResult, "call", "Initialize", "result created", "Each entry of the result will be one level of the tree, top to bottom.");

  emit(LEVEL_ORDER_LINES.guardEmpty, "compare", "Initialize", "root is not null", "An empty tree returns an empty list, so the traversal below can assume a root exists.");

  queue = [1];
  active.add(1);
  emit(
    LEVEL_ORDER_LINES.seedQueue,
    "mutation",
    "Initialize",
    "root queued",
    "Seed the queue with the root. The queue always holds exactly the nodes discovered but not yet visited.",
    ["queue"],
  );

  while (queue.length > 0) {
    emit(LEVEL_ORDER_LINES.whileQueue, "compare", "Level scan", `${queue.length} queued`, "While anything remains queued there is another level to read.");

    levelSize = queue.length;
    emit(
      LEVEL_ORDER_LINES.levelSize,
      "mutation",
      "Level scan",
      `levelSize = ${levelSize}`,
      "This is the whole trick: capture the queue's size *before* adding any children. That count is exactly the width of the current level, so the level boundary needs no sentinel value.",
      ["levelSize"],
    );

    level = [];
    emit(LEVEL_ORDER_LINES.initLevel, "call", "Level scan", "level list created", "Collect this level's values here.");

    for (let i = 0; i < levelSize; i++) {
      const heapIndex = queue.shift()!;
      current = heapIndex;
      active.delete(heapIndex);

      emit(
        LEVEL_ORDER_LINES.poll,
        "mutation",
        "Level scan",
        `node = ${byIndex.get(heapIndex)}`,
        `Take ${byIndex.get(heapIndex)} off the front of the queue.`,
        ["node", "queue"],
      );

      level.push(byIndex.get(heapIndex)!);
      visited.add(heapIndex);
      emit(
        LEVEL_ORDER_LINES.visit,
        "mutation",
        "Level scan",
        `level = [${level.join(", ")}]`,
        `Record ${byIndex.get(heapIndex)} in the current level.`,
        ["level"],
      );

      const leftIndex = heapIndex * 2;
      const rightIndex = heapIndex * 2 + 1;

      if (byIndex.has(leftIndex)) {
        queue.push(leftIndex);
        active.add(leftIndex);
        emit(
          LEVEL_ORDER_LINES.pushLeft,
          "mutation",
          "Level scan",
          `queued ${byIndex.get(leftIndex)}`,
          `Left child ${byIndex.get(leftIndex)} exists, so it joins the back of the queue for the next level.`,
          ["queue"],
        );
      } else {
        emit(LEVEL_ORDER_LINES.pushLeft, "compare", "Level scan", "no left child", "Nothing to queue on the left.");
      }

      if (byIndex.has(rightIndex)) {
        queue.push(rightIndex);
        active.add(rightIndex);
        emit(
          LEVEL_ORDER_LINES.pushRight,
          "mutation",
          "Level scan",
          `queued ${byIndex.get(rightIndex)}`,
          `Right child ${byIndex.get(rightIndex)} exists, so it queues behind the left one — which is what keeps each level in left-to-right order.`,
          ["queue"],
        );
      } else {
        emit(LEVEL_ORDER_LINES.pushRight, "compare", "Level scan", "no right child", "Nothing to queue on the right.");
      }
    }

    current = null;
    levels = [...levels, [...level]];
    emit(
      LEVEL_ORDER_LINES.commitLevel,
      "mutation",
      "Commit level",
      `${levels.length} level${levels.length === 1 ? "" : "s"} done`,
      `Level ${levels.length} is complete: [${level.join(", ")}]. Everything still queued belongs to the next level down.`,
      ["result"],
    );
  }

  levelSize = 0;
  level = [];
  emit(
    LEVEL_ORDER_LINES.ret,
    "return",
    "Return",
    `${levels.length} levels`,
    `The queue is empty, so every node has been visited. Time and space are both O(n) — each node is queued and polled exactly once.`,
  );

  return {
    problemSlug: "binary-tree-level-order-traversal",
    code: LEVEL_ORDER_CODE,
    steps: withIndices(drafts),
    inputLabel: `root = [${input.map((n) => n.value).join(", ")}]`,
  };
}

/* -------------------------------------------------------------------------- */
/* Graph — course schedule (Kahn's topological sort)                           */
/* -------------------------------------------------------------------------- */

const COURSE_SCHEDULE_CODE: Record<Language, string[]> = {
  JAVA: [
    "class Solution {",
    "    public boolean canFinish(int n, int[][] prerequisites) {",
    "        List<List<Integer>> graph = new ArrayList<>();",
    "        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());",
    "        int[] indegree = new int[n];",
    "",
    "        for (int[] edge : prerequisites) {",
    "            graph.get(edge[1]).add(edge[0]);",
    "            indegree[edge[0]]++;",
    "        }",
    "",
    "        Queue<Integer> queue = new ArrayDeque<>();",
    "        for (int i = 0; i < n; i++) {",
    "            if (indegree[i] == 0) queue.offer(i);",
    "        }",
    "",
    "        int taken = 0;",
    "        while (!queue.isEmpty()) {",
    "            int course = queue.poll();",
    "            taken++;",
    "",
    "            for (int next : graph.get(course)) {",
    "                indegree[next]--;",
    "                if (indegree[next] == 0) queue.offer(next);",
    "            }",
    "        }",
    "",
    "        return taken == n;",
    "    }",
    "}",
  ],
  PYTHON: [
    "class Solution:",
    "    def canFinish(self, n: int, prerequisites: List[List[int]]) -> bool:",
    "        graph = [[] for _ in range(n)]",
    "        indegree = [0] * n",
    "",
    "        for course, prereq in prerequisites:",
    "            graph[prereq].append(course)",
    "            indegree[course] += 1",
    "",
    "        queue = deque(i for i in range(n) if indegree[i] == 0)",
    "",
    "        taken = 0",
    "        while queue:",
    "            course = queue.popleft()",
    "            taken += 1",
    "",
    "            for nxt in graph[course]:",
    "                indegree[nxt] -= 1",
    "                if indegree[nxt] == 0:",
    "                    queue.append(nxt)",
    "",
    "        return taken == n",
  ],
};

const COURSE_SCHEDULE_LINES = resolveLines(COURSE_SCHEDULE_CODE, {
  initGraph: { JAVA: "List<List<Integer>> graph", PYTHON: "graph = [[] for _ in range(n)]" },
  initIndegree: { JAVA: "int[] indegree = new int[n]", PYTHON: "indegree = [0] * n" },
  buildLoop: { JAVA: "for (int[] edge : prerequisites)", PYTHON: "for course, prereq in prerequisites:" },
  addEdge: { JAVA: "graph.get(edge[1]).add", PYTHON: "graph[prereq].append(course)" },
  bumpIndegree: { JAVA: "indegree[edge[0]]++", PYTHON: "indegree[course] += 1" },
  seedQueue: { JAVA: "if (indegree[i] == 0) queue.offer(i)", PYTHON: "queue = deque(i for i in range(n)" },
  initTaken: { JAVA: "int taken = 0", PYTHON: "taken = 0" },
  whileQueue: { JAVA: "while (!queue.isEmpty())", PYTHON: "while queue:" },
  poll: { JAVA: "int course = queue.poll()", PYTHON: "course = queue.popleft()" },
  take: { JAVA: "taken++", PYTHON: "taken += 1" },
  neighbourLoop: { JAVA: "for (int next : graph.get(course))", PYTHON: "for nxt in graph[course]:" },
  decrement: { JAVA: "indegree[next]--", PYTHON: "indegree[nxt] -= 1" },
  maybeQueue: { JAVA: "if (indegree[next] == 0) queue.offer(next)", PYTHON: "if indegree[nxt] == 0:" },
  ret: { JAVA: "return taken == n", PYTHON: "return taken == n" },
});

/** Parses `4; 1,0; 2,1; 3,2` into a course count and [course, prereq] pairs. */
export function parseCourseSchedule(rawCount: string, rawEdges: string) {
  const n = Number(rawCount.trim());
  if (!Number.isInteger(n) || n < 2 || n > 8) {
    throw new TraceInputError("Course count must be a whole number from 2 to 8.");
  }

  const pairs = rawEdges.match(/-?\d+\s*,\s*-?\d+/g) ?? [];
  if (pairs.length === 0) {
    throw new TraceInputError("Enter prerequisites as pairs, e.g. [[1,0],[2,1]].");
  }
  if (pairs.length > 10) {
    throw new TraceInputError("Ten prerequisites is the readable limit for the canvas.");
  }

  const edges = pairs.map((pair) => {
    const [course, prereq] = pair.split(",").map((part) => Number(part.trim()));
    if (course < 0 || course >= n || prereq < 0 || prereq >= n) {
      throw new TraceInputError(`Course ids must be between 0 and ${n - 1}.`);
    }
    if (course === prereq) {
      throw new TraceInputError(`Course ${course} cannot be its own prerequisite.`);
    }
    return [course, prereq] as [number, number];
  });

  return { n, edges };
}

export function buildCourseScheduleTrace(n: number, edges: [number, number][]): Trace {
  const graph: number[][] = Array.from({ length: n }, () => []);
  const indegree = new Array<number>(n).fill(0);

  const drafts: DraftStep[] = [];

  let queue: number[] = [];
  let taken = 0;
  let current: number | null = null;
  let neighbour: number | null = null;
  const done = new Set<number>();
  const order: number[] = [];
  let builtEdges: [number, number][] = [];

  const idOf = (course: number) => `c${course}`;

  const graphStructure = () => ({
    name: "courses",
    directed: true,
    nodes: Array.from({ length: n }, (_, course) => ({
      id: idOf(course),
      label: course,
      badge: `in ${indegree[course]}`,
      tone: (current === course
        ? "active"
        : done.has(course)
          ? "consumed"
          : queue.includes(course)
            ? "created"
            : "default") as NodeTone,
    })),
    edges: builtEdges.map(([course, prereq]) => ({
      from: idOf(prereq),
      to: idOf(course),
      tone: (current === prereq && neighbour === course
        ? "active"
        : done.has(prereq)
          ? "consumed"
          : "default") as "default" | "active" | "consumed",
    })),
    frontier: {
      label: "Queue · ready to take",
      ids: queue.map(idOf),
      emptyHint: "nothing ready",
    },
    order: [...order],
  });

  const emit = (
    lineHighlight: Record<Language, number>,
    kind: TraceStep["kind"],
    phase: string,
    state: string,
    explanation: string,
    changed?: string[],
  ) => {
    drafts.push({
      lineHighlight,
      kind,
      phase,
      state,
      explanation,
      changed,
      variables: {
        course: current === null ? "—" : String(current),
        next: neighbour === null ? "—" : String(neighbour),
        taken: `${taken} of ${n}`,
        indegree: `[${indegree.join(", ")}]`,
        queue: queue.length === 0 ? "empty" : queue.join(", "),
      },
      structures: { graph: graphStructure() },
      events: [],
    });
  };

  emit(COURSE_SCHEDULE_LINES.initGraph, "call", "Build graph", `${n} courses`, "Build an adjacency list pointing from a prerequisite to the courses it unlocks.");

  emit(COURSE_SCHEDULE_LINES.initIndegree, "call", "Build graph", "indegrees zeroed", "The indegree of a course is how many prerequisites it is still waiting on.");

  for (const [course, prereq] of edges) {
    graph[prereq].push(course);
    builtEdges = [...builtEdges, [course, prereq]];
    emit(
      COURSE_SCHEDULE_LINES.addEdge,
      "mutation",
      "Build graph",
      `${prereq} → ${course}`,
      `Course ${prereq} must come before ${course}, so the edge points from ${prereq} to ${course}. Getting this direction backwards is the most common way this solution fails.`,
    );

    indegree[course] += 1;
    emit(
      COURSE_SCHEDULE_LINES.bumpIndegree,
      "mutation",
      "Build graph",
      `indegree[${course}] = ${indegree[course]}`,
      `Course ${course} now waits on ${indegree[course]} prerequisite${indegree[course] === 1 ? "" : "s"}.`,
      ["indegree"],
    );
  }

  queue = Array.from({ length: n }, (_, i) => i).filter((i) => indegree[i] === 0);
  emit(
    COURSE_SCHEDULE_LINES.seedQueue,
    "mutation",
    "Seed queue",
    `${queue.length} ready`,
    queue.length === 0
      ? "No course has indegree 0, so every course waits on another — the graph is one big cycle and nothing can start."
      : `Courses ${queue.join(", ")} have no prerequisites, so they can be taken immediately.`,
    ["queue"],
  );

  emit(COURSE_SCHEDULE_LINES.initTaken, "call", "Seed queue", "taken = 0", "Count how many courses get taken. If that reaches n, the whole schedule is possible.");

  while (queue.length > 0) {
    emit(COURSE_SCHEDULE_LINES.whileQueue, "compare", "Take courses", `${queue.length} queued`, "Keep taking whatever is currently unblocked.");

    const course = queue.shift()!;
    current = course;
    neighbour = null;
    emit(COURSE_SCHEDULE_LINES.poll, "mutation", "Take courses", `course = ${course}`, `Take course ${course}.`, ["course", "queue"]);

    taken += 1;
    done.add(course);
    order.push(course);
    emit(COURSE_SCHEDULE_LINES.take, "mutation", "Take courses", `${taken} of ${n} taken`, `That is ${taken} course${taken === 1 ? "" : "s"} completed.`, ["taken"]);

    for (const next of graph[course]) {
      neighbour = next;
      emit(COURSE_SCHEDULE_LINES.neighbourLoop, "call", "Release", `next = ${next}`, `Course ${course} unlocks ${next}.`, ["next"]);

      indegree[next] -= 1;
      emit(
        COURSE_SCHEDULE_LINES.decrement,
        "mutation",
        "Release",
        `indegree[${next}] = ${indegree[next]}`,
        `One prerequisite of ${next} is now satisfied.`,
        ["indegree"],
      );

      if (indegree[next] === 0) {
        queue.push(next);
        emit(
          COURSE_SCHEDULE_LINES.maybeQueue,
          "mutation",
          "Release",
          `queued ${next}`,
          `Course ${next} is waiting on nothing now, so it becomes available.`,
          ["queue"],
        );
      } else {
        emit(
          COURSE_SCHEDULE_LINES.maybeQueue,
          "compare",
          "Release",
          `${next} still blocked`,
          `Course ${next} still waits on ${indegree[next]} prerequisite${indegree[next] === 1 ? "" : "s"}.`,
        );
      }
    }

    neighbour = null;
  }

  current = null;
  const possible = taken === n;
  emit(
    COURSE_SCHEDULE_LINES.ret,
    "return",
    "Return",
    possible ? "schedule is possible" : "cycle detected",
    possible
      ? `All ${n} courses were taken, so no cycle exists and the schedule is possible. O(V + E) time.`
      : `Only ${taken} of ${n} courses could be taken. The remainder form a cycle — each waits on another inside the same group, so none ever reaches indegree 0.`,
  );

  return {
    problemSlug: "course-schedule",
    code: COURSE_SCHEDULE_CODE,
    steps: withIndices(drafts),
    inputLabel: `n = ${n}, prerequisites = [${edges.map(([c, p]) => `[${c},${p}]`).join(", ")}]`,
  };
}

/* -------------------------------------------------------------------------- */
/* Maximum subarray — Kadane's scan                                            */
/* -------------------------------------------------------------------------- */

const MAX_SUBARRAY_CODE: Record<Language, string[]> = {
  JAVA: [
    "class Solution {",
    "    public int maxSubArray(int[] nums) {",
    "        int currentSum = 0;",
    "        int maxSum = Integer.MIN_VALUE;",
    "",
    "        for (int i = 0; i < nums.length; i++) {",
    "            currentSum += nums[i];",
    "            maxSum = Math.max(currentSum, maxSum);",
    "",
    "            if (currentSum < 0) {",
    "                currentSum = 0;",
    "            }",
    "        }",
    "        return maxSum;",
    "    }",
    "}",
  ],
  PYTHON: [
    "class Solution:",
    "    def maxSubArray(self, nums: List[int]) -> int:",
    "        current_sum = 0",
    "        max_sum = float('-inf')",
    "",
    "        for i in range(len(nums)):",
    "            current_sum += nums[i]",
    "            max_sum = max(current_sum, max_sum)",
    "",
    "            if current_sum < 0:",
    "                current_sum = 0",
    "",
    "        return int(max_sum)",
  ],
};

const MAX_SUBARRAY_LINES = resolveLines(MAX_SUBARRAY_CODE, {
  initCurrent: { JAVA: "int currentSum = 0", PYTHON: "current_sum = 0" },
  initMax: { JAVA: "int maxSum = Integer.MIN_VALUE", PYTHON: "max_sum = float('-inf')" },
  loop: { JAVA: "for (int i = 0", PYTHON: "for i in range(len(nums))" },
  add: { JAVA: "currentSum += nums[i]", PYTHON: "current_sum += nums[i]" },
  record: { JAVA: "maxSum = Math.max", PYTHON: "max_sum = max(current_sum" },
  test: { JAVA: "if (currentSum < 0)", PYTHON: "if current_sum < 0:" },
  reset: { JAVA: "currentSum = 0;", PYTHON: { text: "current_sum = 0", nth: 2 } },
  ret: { JAVA: "return maxSum", PYTHON: "return int(max_sum)" },
});

export function buildMaxSubarrayTrace(nums: number[]): Trace {
  const drafts: DraftStep[] = [];

  let currentSum = 0;
  let maxSum = Number.NEGATIVE_INFINITY;
  let i = -1;
  let runStart = 0;

  const fmt = (value: number) => (value === Number.NEGATIVE_INFINITY ? "-∞" : String(value));

  const emit = (
    lineHighlight: Record<Language, number>,
    kind: TraceStep["kind"],
    phase: string,
    state: string,
    explanation: string,
    changed?: string[],
  ) => {
    // Highlight the run currently under consideration, not just the cursor —
    // seeing the window collapse on a reset is the whole lesson here.
    const highlighted =
      i < 0 ? [] : Array.from({ length: i - runStart + 1 }, (_, k) => runStart + k);

    drafts.push({
      lineHighlight,
      kind,
      phase,
      state,
      explanation,
      changed,
      variables: {
        i: i < 0 ? "—" : String(i),
        "nums[i]": i < 0 ? "—" : String(nums[i]),
        currentSum: fmt(currentSum),
        maxSum: fmt(maxSum),
        run: i < 0 ? "—" : `[${nums.slice(runStart, i + 1).join(", ")}]`,
      },
      structures: {
        array: {
          name: "nums",
          values: [...nums],
          highlightedIndices: highlighted,
          pointers: i < 0 ? {} : { i },
        },
      },
      events: [],
    });
  };

  emit(MAX_SUBARRAY_LINES.initCurrent, "call", "Initialize", "currentSum = 0", "The running sum of the subarray ending at the current index.");
  emit(
    MAX_SUBARRAY_LINES.initMax,
    "call",
    "Initialize",
    "maxSum = -∞",
    "Starting at negative infinity rather than 0 is what lets an all-negative array return its largest element. The subarray must be non-empty.",
  );

  for (i = 0; i < nums.length; i++) {
    emit(MAX_SUBARRAY_LINES.loop, "call", "Scan", `i = ${i}`, `Consider index ${i}, value ${nums[i]}.`);

    currentSum += nums[i];
    emit(
      MAX_SUBARRAY_LINES.add,
      "mutation",
      "Scan",
      `currentSum = ${currentSum}`,
      `Extend the current run by ${nums[i]}.`,
      ["currentSum"],
    );

    const improved = currentSum > maxSum;
    maxSum = Math.max(currentSum, maxSum);
    emit(
      MAX_SUBARRAY_LINES.record,
      improved ? "mutation" : "compare",
      "Scan",
      `maxSum = ${fmt(maxSum)}`,
      improved
        ? `${currentSum} beats the previous best, so it becomes the answer so far. Note this happens *before* any reset — that ordering is what makes an all-negative input work.`
        : `${currentSum} does not beat ${fmt(maxSum)}, so the best stays put.`,
      improved ? ["maxSum"] : undefined,
    );

    if (currentSum < 0) {
      emit(
        MAX_SUBARRAY_LINES.test,
        "compare",
        "Restart",
        `${currentSum} < 0`,
        "The run has gone negative. Any prefix with a negative sum can only drag down whatever follows it.",
      );
      currentSum = 0;
      runStart = i + 1;
      emit(
        MAX_SUBARRAY_LINES.reset,
        "mutation",
        "Restart",
        "currentSum = 0",
        "Abandon the run and start fresh at the next index. This is the single decision Kadane's makes at every step: extend, or restart.",
        ["currentSum", "run"],
      );
    } else {
      emit(MAX_SUBARRAY_LINES.test, "compare", "Scan", `${currentSum} >= 0`, "The run is still worth carrying forward.");
    }
  }

  i = -1;
  emit(
    MAX_SUBARRAY_LINES.ret,
    "return",
    "Return",
    `maxSum = ${fmt(maxSum)}`,
    `One pass, two variables: O(n) time and O(1) space.`,
  );

  return {
    problemSlug: "maximum-subarray",
    code: MAX_SUBARRAY_CODE,
    steps: withIndices(drafts),
    inputLabel: `nums = [${nums.join(", ")}]`,
  };
}

/* -------------------------------------------------------------------------- */
/* Best time to buy and sell stock                                             */
/* -------------------------------------------------------------------------- */

const BUY_SELL_CODE: Record<Language, string[]> = {
  JAVA: [
    "class Solution {",
    "    public int maxProfit(int[] prices) {",
    "        int buyPrice = Integer.MAX_VALUE;",
    "        int maxProfit = 0;",
    "",
    "        for (int i = 0; i < prices.length; i++) {",
    "            if (buyPrice < prices[i]) {",
    "                int profit = prices[i] - buyPrice;",
    "                maxProfit = Math.max(maxProfit, profit);",
    "            } else {",
    "                buyPrice = prices[i];",
    "            }",
    "        }",
    "        return maxProfit;",
    "    }",
    "}",
  ],
  PYTHON: [
    "class Solution:",
    "    def maxProfit(self, prices: List[int]) -> int:",
    "        buy_price = float('inf')",
    "        max_profit = 0",
    "",
    "        for i in range(len(prices)):",
    "            if buy_price < prices[i]:",
    "                profit = prices[i] - buy_price",
    "                max_profit = max(max_profit, profit)",
    "            else:",
    "                buy_price = prices[i]",
    "",
    "        return max_profit",
  ],
};

const BUY_SELL_LINES = resolveLines(BUY_SELL_CODE, {
  initBuy: { JAVA: "int buyPrice = Integer.MAX_VALUE", PYTHON: "buy_price = float('inf')" },
  initProfit: { JAVA: "int maxProfit = 0", PYTHON: "max_profit = 0" },
  loop: { JAVA: "for (int i = 0", PYTHON: "for i in range(len(prices))" },
  test: { JAVA: "if (buyPrice < prices[i])", PYTHON: "if buy_price < prices[i]:" },
  profit: { JAVA: "int profit = prices[i] - buyPrice", PYTHON: "profit = prices[i] - buy_price" },
  best: { JAVA: "maxProfit = Math.max", PYTHON: "max_profit = max(max_profit" },
  updateBuy: { JAVA: "buyPrice = prices[i]", PYTHON: "buy_price = prices[i]" },
  ret: { JAVA: "return maxProfit", PYTHON: "return max_profit" },
});

export function buildBuySellTrace(prices: number[]): Trace {
  const drafts: DraftStep[] = [];

  let buyPrice = Number.POSITIVE_INFINITY;
  let buyIndex = -1;
  let maxProfit = 0;
  let bestPair: [number, number] | null = null;
  let i = -1;
  let profit: number | null = null;

  const fmtBuy = () => (buyPrice === Number.POSITIVE_INFINITY ? "∞" : String(buyPrice));

  const emit = (
    lineHighlight: Record<Language, number>,
    kind: TraceStep["kind"],
    phase: string,
    state: string,
    explanation: string,
    changed?: string[],
  ) => {
    const pointers: Record<string, number> = {};
    if (i >= 0) pointers.i = i;
    if (buyIndex >= 0) pointers.buy = buyIndex;

    drafts.push({
      lineHighlight,
      kind,
      phase,
      state,
      explanation,
      changed,
      variables: {
        i: i < 0 ? "—" : String(i),
        "prices[i]": i < 0 ? "—" : String(prices[i]),
        buyPrice: fmtBuy(),
        profit: profit === null ? "—" : String(profit),
        maxProfit: String(maxProfit),
        bestTrade: bestPair ? `buy ${bestPair[0]} → sell ${bestPair[1]}` : "none",
      },
      structures: {
        array: {
          name: "prices",
          values: [...prices],
          // Only the two ends of the best trade so far are highlighted, so the
          // answer stays visible while the cursor moves on.
          highlightedIndices: bestPair
            ? [prices.indexOf(bestPair[0]), i].filter((x) => x >= 0)
            : i >= 0
              ? [i]
              : [],
          pointers,
        },
      },
      events: [],
    });
  };

  emit(
    BUY_SELL_LINES.initBuy,
    "call",
    "Initialize",
    "buyPrice = ∞",
    "The cheapest price seen so far. Starting at infinity means the first day always becomes the buy price.",
  );
  emit(
    BUY_SELL_LINES.initProfit,
    "call",
    "Initialize",
    "maxProfit = 0",
    "Starting at 0 encodes that doing nothing is allowed — a falling market must return 0, not a loss.",
  );

  for (i = 0; i < prices.length; i++) {
    profit = null;
    emit(BUY_SELL_LINES.loop, "call", "Scan", `i = ${i}`, `Day ${i}, price ${prices[i]}.`);

    if (buyPrice < prices[i]) {
      emit(
        BUY_SELL_LINES.test,
        "compare",
        "Sell?",
        `${prices[i]} > ${fmtBuy()}`,
        `Today is above the cheapest day, so selling today is worth pricing.`,
      );

      profit = prices[i] - buyPrice;
      emit(
        BUY_SELL_LINES.profit,
        "mutation",
        "Sell?",
        `profit = ${profit}`,
        `Selling today against the ${buyPrice} buy yields ${profit}.`,
        ["profit"],
      );

      const improved = profit > maxProfit;
      if (improved) {
        maxProfit = profit;
        bestPair = [buyPrice, prices[i]];
      }
      emit(
        BUY_SELL_LINES.best,
        improved ? "mutation" : "compare",
        "Sell?",
        `maxProfit = ${maxProfit}`,
        improved
          ? `That is the best trade so far: buy at ${buyPrice}, sell at ${prices[i]}.`
          : `${profit} does not beat ${maxProfit}, so the best trade is unchanged.`,
        improved ? ["maxProfit", "bestTrade"] : undefined,
      );
    } else {
      emit(
        BUY_SELL_LINES.test,
        "compare",
        "Rebase",
        `${prices[i]} <= ${fmtBuy()}`,
        "Today is no higher than the cheapest day so far, so there is no profit to take — but there is a better day to buy.",
      );
      buyPrice = prices[i];
      buyIndex = i;
      emit(
        BUY_SELL_LINES.updateBuy,
        "mutation",
        "Rebase",
        `buyPrice = ${prices[i]}`,
        `Move the buy point to day ${i}. Any earlier, higher price is now irrelevant — it could never beat this one.`,
        ["buyPrice"],
      );
    }
  }

  i = -1;
  profit = null;
  emit(
    BUY_SELL_LINES.ret,
    "return",
    "Return",
    `maxProfit = ${maxProfit}`,
    maxProfit === 0
      ? "No profitable pair existed, so the answer is 0 — the trade is simply skipped."
      : `Best achievable profit is ${maxProfit}. One pass, constant space.`,
  );

  return {
    problemSlug: "best-time-to-buy-and-sell-stock",
    code: BUY_SELL_CODE,
    steps: withIndices(drafts),
    inputLabel: `prices = [${prices.join(", ")}]`,
  };
}

/* -------------------------------------------------------------------------- */
/* Search in rotated sorted array                                              */
/* -------------------------------------------------------------------------- */

const ROTATED_CODE: Record<Language, string[]> = {
  JAVA: [
    "class Solution {",
    "    public int search(int[] nums, int target) {",
    "        int low = 0;",
    "        int high = nums.length - 1;",
    "",
    "        while (low <= high) {",
    "            int mid = low + (high - low) / 2;",
    "",
    "            if (nums[mid] == target) {",
    "                return mid;",
    "            }",
    "",
    "            if (nums[low] <= nums[mid]) {",
    "                if (nums[low] <= target && target < nums[mid]) {",
    "                    high = mid - 1;",
    "                } else {",
    "                    low = mid + 1;",
    "                }",
    "            } else {",
    "                if (nums[mid] < target && target <= nums[high]) {",
    "                    low = mid + 1;",
    "                } else {",
    "                    high = mid - 1;",
    "                }",
    "            }",
    "        }",
    "        return -1;",
    "    }",
    "}",
  ],
  PYTHON: [
    "class Solution:",
    "    def search(self, nums: List[int], target: int) -> int:",
    "        low = 0",
    "        high = len(nums) - 1",
    "",
    "        while low <= high:",
    "            mid = low + (high - low) // 2",
    "",
    "            if nums[mid] == target:",
    "                return mid",
    "",
    "            if nums[low] <= nums[mid]:",
    "                if nums[low] <= target < nums[mid]:",
    "                    high = mid - 1",
    "                else:",
    "                    low = mid + 1",
    "            else:",
    "                if nums[mid] < target <= nums[high]:",
    "                    low = mid + 1",
    "                else:",
    "                    high = mid - 1",
    "",
    "        return -1",
  ],
};

const ROTATED_LINES = resolveLines(ROTATED_CODE, {
  initLow: { JAVA: "int low = 0", PYTHON: "low = 0" },
  initHigh: { JAVA: "int high = nums.length - 1", PYTHON: "high = len(nums) - 1" },
  whileLoop: { JAVA: "while (low <= high)", PYTHON: "while low <= high:" },
  mid: { JAVA: "int mid = low +", PYTHON: "mid = low +" },
  hit: { JAVA: "if (nums[mid] == target)", PYTHON: "if nums[mid] == target:" },
  hitReturn: { JAVA: "return mid;", PYTHON: "return mid" },
  leftSorted: { JAVA: "if (nums[low] <= nums[mid])", PYTHON: "if nums[low] <= nums[mid]:" },
  leftContains: {
    JAVA: "if (nums[low] <= target && target < nums[mid])",
    PYTHON: "if nums[low] <= target < nums[mid]:",
  },
  goLeft: { JAVA: "high = mid - 1;", PYTHON: "high = mid - 1" },
  goRight: { JAVA: "low = mid + 1;", PYTHON: "low = mid + 1" },
  rightContains: {
    JAVA: "if (nums[mid] < target && target <= nums[high])",
    PYTHON: "if nums[mid] < target <= nums[high]:",
  },
  goRight2: { JAVA: { text: "low = mid + 1;", nth: 2 }, PYTHON: { text: "low = mid + 1", nth: 2 } },
  goLeft2: {
    JAVA: { text: "high = mid - 1;", nth: 2 },
    PYTHON: { text: "high = mid - 1", nth: 2 },
  },
  miss: { JAVA: "return -1", PYTHON: "return -1" },
});

export function buildRotatedSearchTrace(nums: number[], target: number): Trace {
  const drafts: DraftStep[] = [];

  let low = 0;
  let high = nums.length - 1;
  let mid: number | null = null;
  let found: number | null = null;

  const emit = (
    lineHighlight: Record<Language, number>,
    kind: TraceStep["kind"],
    phase: string,
    state: string,
    explanation: string,
    changed?: string[],
  ) => {
    const pointers: Record<string, number> = {};
    if (low <= high) {
      pointers.low = low;
      pointers.high = high;
    }
    if (mid !== null) pointers.mid = mid;

    // The live window is the highlight: watching it halve is the point.
    const highlighted =
      low <= high ? Array.from({ length: high - low + 1 }, (_, k) => low + k) : [];

    drafts.push({
      lineHighlight,
      kind,
      phase,
      state,
      explanation,
      changed,
      variables: {
        target: String(target),
        low: String(low),
        high: String(high),
        mid: mid === null ? "—" : String(mid),
        "nums[mid]": mid === null ? "—" : String(nums[mid]),
        window: low <= high ? `[${nums.slice(low, high + 1).join(", ")}]` : "empty",
      },
      structures: {
        array: {
          name: "nums",
          values: [...nums],
          highlightedIndices: highlighted,
          pointers,
        },
      },
      events: [],
    });
  };

  emit(ROTATED_LINES.initLow, "call", "Initialize", "low = 0", "Search the whole array to begin with.");
  emit(ROTATED_LINES.initHigh, "call", "Initialize", `high = ${high}`, `The window spans all ${nums.length} elements.`);

  while (low <= high) {
    emit(ROTATED_LINES.whileLoop, "compare", "Narrow", `${high - low + 1} in window`, "Keep halving while the window is non-empty.");

    mid = low + Math.floor((high - low) / 2);
    emit(
      ROTATED_LINES.mid,
      "mutation",
      "Narrow",
      `mid = ${mid}`,
      `Midpoint is index ${mid}, value ${nums[mid]}. Computing it as low + (high - low) / 2 avoids the overflow that (low + high) / 2 risks on very large bounds.`,
      ["mid"],
    );

    if (nums[mid] === target) {
      emit(ROTATED_LINES.hit, "compare", "Hit", `${nums[mid]} == ${target}`, "Found it.");
      found = mid;
      emit(ROTATED_LINES.hitReturn, "return", "Hit", `index ${mid}`, `Target ${target} sits at index ${mid}.`);
      break;
    }

    emit(ROTATED_LINES.hit, "compare", "Narrow", `${nums[mid]} != ${target}`, "Not the midpoint, so decide which side to keep.");

    if (nums[low] <= nums[mid]) {
      emit(
        ROTATED_LINES.leftSorted,
        "compare",
        "Pick half",
        "left half sorted",
        `nums[low] = ${nums[low]} is at or below nums[mid] = ${nums[mid]}, so everything from low to mid is in ascending order. That is the half whose range we can reason about exactly.`,
      );

      if (nums[low] <= target && target < nums[mid]) {
        emit(
          ROTATED_LINES.leftContains,
          "compare",
          "Pick half",
          `${nums[low]} <= ${target} < ${nums[mid]}`,
          "The target falls inside the sorted left half's range, so it can only be there.",
        );
        high = mid - 1;
        mid = null;
        emit(ROTATED_LINES.goLeft, "mutation", "Narrow", `high = ${high}`, "Discard the right half.", ["high", "window"]);
      } else {
        emit(
          ROTATED_LINES.leftContains,
          "compare",
          "Pick half",
          "not in left range",
          "The target is outside the sorted half's range, so it must lie in the rotated right half.",
        );
        low = mid + 1;
        mid = null;
        emit(ROTATED_LINES.goRight, "mutation", "Narrow", `low = ${low}`, "Discard the left half.", ["low", "window"]);
      }
    } else {
      emit(
        ROTATED_LINES.leftSorted,
        "compare",
        "Pick half",
        "right half sorted",
        `nums[low] = ${nums[low]} is above nums[mid] = ${nums[mid]}, so the rotation point lies in the left half — which makes the right half the sorted one.`,
      );

      if (nums[mid] < target && target <= nums[high]) {
        emit(
          ROTATED_LINES.rightContains,
          "compare",
          "Pick half",
          `${nums[mid]} < ${target} <= ${nums[high]}`,
          "The target falls inside the sorted right half's range.",
        );
        low = mid + 1;
        mid = null;
        emit(ROTATED_LINES.goRight2, "mutation", "Narrow", `low = ${low}`, "Discard the left half.", ["low", "window"]);
      } else {
        emit(
          ROTATED_LINES.rightContains,
          "compare",
          "Pick half",
          "not in right range",
          "Outside the sorted half's range, so search the rotated left half.",
        );
        high = mid - 1;
        mid = null;
        emit(ROTATED_LINES.goLeft2, "mutation", "Narrow", `high = ${high}`, "Discard the right half.", ["high", "window"]);
      }
    }
  }

  if (found === null) {
    mid = null;
    emit(
      ROTATED_LINES.miss,
      "return",
      "Return",
      "-1",
      `The window closed without a hit, so ${target} is not in the array. O(log n) either way — each step discarded half of what remained.`,
    );
  }

  return {
    problemSlug: "search-in-rotated-sorted-array",
    code: ROTATED_CODE,
    steps: withIndices(drafts),
    inputLabel: `nums = [${nums.join(", ")}], target = ${target}`,
  };
}

/* -------------------------------------------------------------------------- */
/* Array fundamentals — linear search, binary search, in-place reverse         */
/* -------------------------------------------------------------------------- */

const LINEAR_SEARCH_CODE: Record<Language, string[]> = {
  JAVA: [
    "class Solution {",
    "    public int linearSearch(int[] numbers, int key) {",
    "        for (int i = 0; i < numbers.length; i++) {",
    "            if (numbers[i] == key) {",
    "                return i;",
    "            }",
    "        }",
    "        return -1;",
    "    }",
    "}",
  ],
  PYTHON: [
    "class Solution:",
    "    def linear_search(self, numbers: List[int], key: int) -> int:",
    "        for i in range(len(numbers)):",
    "            if numbers[i] == key:",
    "                return i",
    "",
    "        return -1",
  ],
};

const LINEAR_SEARCH_LINES = resolveLines(LINEAR_SEARCH_CODE, {
  loop: { JAVA: "for (int i = 0", PYTHON: "for i in range(len(numbers))" },
  test: { JAVA: "if (numbers[i] == key)", PYTHON: "if numbers[i] == key:" },
  hit: { JAVA: "return i;", PYTHON: "return i" },
  miss: { JAVA: "return -1", PYTHON: "return -1" },
});

export function buildLinearSearchTrace(numbers: number[], key: number): Trace {
  const drafts: DraftStep[] = [];
  let i = -1;
  let found: number | null = null;

  const emit = (
    lineHighlight: Record<Language, number>,
    kind: TraceStep["kind"],
    phase: string,
    state: string,
    explanation: string,
  ) => {
    drafts.push({
      lineHighlight,
      kind,
      phase,
      state,
      explanation,
      variables: {
        key: String(key),
        i: i < 0 ? "—" : String(i),
        "numbers[i]": i < 0 ? "—" : String(numbers[i]),
        checked: i < 0 ? "0" : `${i + 1} of ${numbers.length}`,
      },
      structures: {
        array: {
          name: "numbers",
          values: [...numbers],
          // Everything already ruled out stays dim; only the cursor is lit.
          highlightedIndices: i < 0 ? [] : [i],
          pointers: i < 0 ? {} : { i },
        },
      },
      events: [],
    });
  };

  for (i = 0; i < numbers.length; i++) {
    emit(LINEAR_SEARCH_LINES.loop, "call", "Scan", `i = ${i}`, `Move the cursor to index ${i}.`);

    if (numbers[i] === key) {
      emit(LINEAR_SEARCH_LINES.test, "compare", "Hit", `${numbers[i]} == ${key}`, "Match.");
      found = i;
      emit(
        LINEAR_SEARCH_LINES.hit,
        "return",
        "Hit",
        `index ${i}`,
        `Returning from inside the loop is what makes this *first* occurrence and lets it stop early — ${numbers.length - i - 1} element${numbers.length - i - 1 === 1 ? "" : "s"} never had to be examined.`,
      );
      break;
    }

    emit(
      LINEAR_SEARCH_LINES.test,
      "compare",
      "Scan",
      `${numbers[i]} != ${key}`,
      `${numbers[i]} is not the key, so index ${i} is ruled out. With no ordering to exploit, nothing else can be ruled out with it.`,
    );
  }

  if (found === null) {
    i = -1;
    emit(
      LINEAR_SEARCH_LINES.miss,
      "return",
      "Return",
      "-1",
      `Every element was checked and none matched, so the key is absent. That is the cost of an unsorted array: the worst case must touch all n.`,
    );
  }

  return {
    problemSlug: "array-linear-search",
    code: LINEAR_SEARCH_CODE,
    steps: withIndices(drafts),
    inputLabel: `numbers = [${numbers.join(", ")}], key = ${key}`,
  };
}

const BINARY_SEARCH_CODE: Record<Language, string[]> = {
  JAVA: [
    "class Solution {",
    "    public int search(int[] nums, int target) {",
    "        int start = 0, end = nums.length - 1;",
    "",
    "        while (start <= end) {",
    "            int mid = start + (end - start) / 2;",
    "",
    "            if (nums[mid] == target) {",
    "                return mid;",
    "            }",
    "            if (nums[mid] < target) {",
    "                start = mid + 1;",
    "            } else {",
    "                end = mid - 1;",
    "            }",
    "        }",
    "        return -1;",
    "    }",
    "}",
  ],
  PYTHON: [
    "class Solution:",
    "    def search(self, nums: List[int], target: int) -> int:",
    "        start, end = 0, len(nums) - 1",
    "",
    "        while start <= end:",
    "            mid = start + (end - start) // 2",
    "",
    "            if nums[mid] == target:",
    "                return mid",
    "            if nums[mid] < target:",
    "                start = mid + 1",
    "            else:",
    "                end = mid - 1",
    "",
    "        return -1",
  ],
};

const BINARY_SEARCH_LINES = resolveLines(BINARY_SEARCH_CODE, {
  init: { JAVA: "int start = 0, end", PYTHON: "start, end = 0" },
  whileLoop: { JAVA: "while (start <= end)", PYTHON: "while start <= end:" },
  mid: { JAVA: "int mid = start +", PYTHON: "mid = start +" },
  hit: { JAVA: "if (nums[mid] == target)", PYTHON: "if nums[mid] == target:" },
  hitReturn: { JAVA: "return mid;", PYTHON: "return mid" },
  tooSmall: { JAVA: "if (nums[mid] < target)", PYTHON: "if nums[mid] < target:" },
  goRight: { JAVA: "start = mid + 1", PYTHON: "start = mid + 1" },
  goLeft: { JAVA: "end = mid - 1", PYTHON: "end = mid - 1" },
  miss: { JAVA: "return -1", PYTHON: "return -1" },
});

export function buildBinarySearchTrace(nums: number[], target: number): Trace {
  const drafts: DraftStep[] = [];

  let start = 0;
  let end = nums.length - 1;
  let mid: number | null = null;
  let found: number | null = null;

  const emit = (
    lineHighlight: Record<Language, number>,
    kind: TraceStep["kind"],
    phase: string,
    state: string,
    explanation: string,
    changed?: string[],
  ) => {
    const pointers: Record<string, number> = {};
    if (start <= end) {
      pointers.start = start;
      pointers.end = end;
    }
    if (mid !== null) pointers.mid = mid;

    drafts.push({
      lineHighlight,
      kind,
      phase,
      state,
      explanation,
      changed,
      variables: {
        target: String(target),
        start: String(start),
        end: String(end),
        mid: mid === null ? "—" : String(mid),
        "nums[mid]": mid === null ? "—" : String(nums[mid]),
        remaining: start <= end ? String(end - start + 1) : "0",
      },
      structures: {
        array: {
          name: "nums",
          values: [...nums],
          highlightedIndices:
            start <= end ? Array.from({ length: end - start + 1 }, (_, k) => start + k) : [],
          pointers,
        },
      },
      events: [],
    });
  };

  emit(
    BINARY_SEARCH_LINES.init,
    "call",
    "Initialize",
    `window 0..${end}`,
    "The window is inclusive at both ends, which is what pairs with `start <= end` below.",
  );

  while (start <= end) {
    emit(
      BINARY_SEARCH_LINES.whileLoop,
      "compare",
      "Halve",
      `${end - start + 1} remaining`,
      "The equality matters: without it a one-element window is never examined.",
    );

    mid = start + Math.floor((end - start) / 2);
    emit(
      BINARY_SEARCH_LINES.mid,
      "mutation",
      "Halve",
      `mid = ${mid}`,
      "Written as start + (end - start) / 2 rather than (start + end) / 2 — the latter overflows `int` on large bounds and goes negative.",
      ["mid"],
    );

    if (nums[mid] === target) {
      emit(BINARY_SEARCH_LINES.hit, "compare", "Hit", `${nums[mid]} == ${target}`, "Match.");
      found = mid;
      emit(
        BINARY_SEARCH_LINES.hitReturn,
        "return",
        "Hit",
        `index ${mid}`,
        `Found in ${drafts.filter((d) => d.kind === "mutation").length} halvings — log₂(${nums.length}) is about ${Math.ceil(Math.log2(nums.length + 1))}.`,
      );
      break;
    }

    if (nums[mid] < target) {
      emit(
        BINARY_SEARCH_LINES.tooSmall,
        "compare",
        "Halve",
        `${nums[mid]} < ${target}`,
        `Because the array is sorted, everything from start through mid is also below the target — all ${mid - start + 1} of those are ruled out at once.`,
      );
      start = mid + 1;
      mid = null;
      emit(BINARY_SEARCH_LINES.goRight, "mutation", "Halve", `start = ${start}`, "Move past mid, never onto it — landing on mid again is how this loops forever.", ["start", "remaining"]);
    } else {
      emit(
        BINARY_SEARCH_LINES.tooSmall,
        "compare",
        "Halve",
        `${nums[mid]} > ${target}`,
        `Sortedness rules out mid and everything to its right — ${end - mid + 1} elements in one comparison.`,
      );
      end = mid - 1;
      mid = null;
      emit(BINARY_SEARCH_LINES.goLeft, "mutation", "Halve", `end = ${end}`, "Move past mid on the other side.", ["end", "remaining"]);
    }
  }

  if (found === null) {
    mid = null;
    emit(
      BINARY_SEARCH_LINES.miss,
      "return",
      "Return",
      "-1",
      "start passed end, so the window is empty and the target is absent.",
    );
  }

  return {
    problemSlug: "binary-search",
    code: BINARY_SEARCH_CODE,
    steps: withIndices(drafts),
    inputLabel: `nums = [${nums.join(", ")}], target = ${target}`,
  };
}

const REVERSE_CODE: Record<Language, string[]> = {
  JAVA: [
    "class Solution {",
    "    public void reverseArray(int[] numbers) {",
    "        int first = 0, last = numbers.length - 1;",
    "",
    "        while (first < last) {",
    "            int temp = numbers[last];",
    "            numbers[last] = numbers[first];",
    "            numbers[first] = temp;",
    "",
    "            first++;",
    "            last--;",
    "        }",
    "    }",
    "}",
  ],
  PYTHON: [
    "class Solution:",
    "    def reverse_array(self, numbers: List[int]) -> None:",
    "        first, last = 0, len(numbers) - 1",
    "",
    "        while first < last:",
    "            numbers[first], numbers[last] = numbers[last], numbers[first]",
    "",
    "            first += 1",
    "            last -= 1",
  ],
};

const REVERSE_LINES = resolveLines(REVERSE_CODE, {
  init: { JAVA: "int first = 0, last", PYTHON: "first, last = 0" },
  whileLoop: { JAVA: "while (first < last)", PYTHON: "while first < last:" },
  swap: { JAVA: "int temp = numbers[last]", PYTHON: "numbers[first], numbers[last] =" },
  writeFirst: { JAVA: "numbers[first] = temp", PYTHON: "numbers[first], numbers[last] =" },
  advance: { JAVA: "first++", PYTHON: "first += 1" },
});

export function buildReverseArrayTrace(input: number[]): Trace {
  const numbers = [...input];
  const drafts: DraftStep[] = [];

  let first = 0;
  let last = numbers.length - 1;
  let swaps = 0;

  const emit = (
    lineHighlight: Record<Language, number>,
    kind: TraceStep["kind"],
    phase: string,
    state: string,
    explanation: string,
    changed?: string[],
  ) => {
    drafts.push({
      lineHighlight,
      kind,
      phase,
      state,
      explanation,
      changed,
      variables: {
        first: String(first),
        last: String(last),
        "numbers[first]": first < numbers.length ? String(numbers[first]) : "—",
        "numbers[last]": last >= 0 ? String(numbers[last]) : "—",
        swaps: String(swaps),
      },
      structures: {
        array: {
          name: "numbers",
          values: [...numbers],
          highlightedIndices: first < last ? [first, last] : [],
          pointers: first <= last ? { first, last } : {},
        },
      },
      events: [],
    });
  };

  emit(
    REVERSE_LINES.init,
    "call",
    "Initialize",
    `first = 0, last = ${last}`,
    "One pointer at each end. They will meet in the middle after exactly ⌊n/2⌋ swaps.",
  );

  while (first < last) {
    emit(
      REVERSE_LINES.whileLoop,
      "compare",
      "Swap inward",
      `${first} < ${last}`,
      "Strictly less than: if they were equal we would be swapping the middle element with itself.",
    );

    const a = numbers[first];
    const b = numbers[last];
    numbers[first] = b;
    numbers[last] = a;
    swaps += 1;
    emit(
      REVERSE_LINES.swap,
      "mutation",
      "Swap inward",
      `${a} ⇄ ${b}`,
      `Index ${first} and index ${last} exchange values. In Java this needs a temporary; Python can do it in one tuple assignment.`,
      ["numbers[first]", "numbers[last]", "swaps"],
    );

    first += 1;
    last -= 1;
    emit(
      REVERSE_LINES.advance,
      "mutation",
      "Swap inward",
      `first = ${first}, last = ${last}`,
      "Step both pointers inward. Every pair is touched exactly once, which is why this is n/2 swaps and not n.",
      ["first", "last"],
    );
  }

  emit(
    REVERSE_LINES.whileLoop,
    "return",
    "Done",
    `${swaps} swap${swaps === 1 ? "" : "s"}`,
    numbers.length % 2 === 1
      ? `The pointers met on index ${first}, the middle element — it is already in the right place, so it is never swapped.`
      : "The pointers crossed, so every pair has been exchanged. Reversed in place with O(1) extra space.",
  );

  return {
    problemSlug: "array-reverse-in-place",
    code: REVERSE_CODE,
    steps: withIndices(drafts),
    inputLabel: `numbers = [${input.join(", ")}]`,
  };
}
