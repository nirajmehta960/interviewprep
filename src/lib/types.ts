/**
 * Domain types.
 *
 * These mirror the Prisma entities specified in Phase 1 so that the UI can be
 * built against fixtures now and switched to the REST layer in Phase 2 without
 * touching component code.
 */

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export type Language = "JAVA" | "PYTHON";

/** Display form of the language enum. Never render the raw enum value. */
export const LANGUAGE_LABEL: Record<Language, string> = {
  JAVA: "Java",
  PYTHON: "Python",
};

/**
 * ALGORITHMIC questions are coding problems with their own page and workbench;
 * CONCEPTUAL and BEHAVIORAL are theory, read inline on the topic page.
 */
export type QuestionType = "CONCEPTUAL" | "ALGORITHMIC" | "BEHAVIORAL";

/** The 6-stage mastery state machine (Phase 4). Order is significant. */
export type MasteryLevel =
  | "NOT_STUDIED"
  | "STUDIED"
  | "TRACED"
  | "CAN_EXPLAIN"
  | "SOLVED_INDEPENDENTLY"
  | "INTERVIEW_READY";

export const MASTERY_ORDER: MasteryLevel[] = [
  "NOT_STUDIED",
  "STUDIED",
  "TRACED",
  "CAN_EXPLAIN",
  "SOLVED_INDEPENDENTLY",
  "INTERVIEW_READY",
];

export const MASTERY_LABEL: Record<MasteryLevel, string> = {
  NOT_STUDIED: "Not studied",
  STUDIED: "Studied",
  TRACED: "Traced",
  CAN_EXPLAIN: "Can explain",
  SOLVED_INDEPENDENTLY: "Independent",
  INTERVIEW_READY: "Interview ready",
};

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
};

/**
 * The study plan's own vocabulary for the same three levels.
 *
 * Algorithmic problems are conventionally Easy/Medium/Hard, but a conceptual
 * question bank reads as a progression — so browsing screens use these labels
 * while problem-solving screens (workbench, revision) keep the short ones.
 */
export const DIFFICULTY_STUDY_LABEL: Record<Difficulty, string> = {
  EASY: "Beginner",
  MEDIUM: "Intermediate",
  HARD: "Advanced",
};

export const DIFFICULTY_STUDY_BLURB: Record<Difficulty, string> = {
  EASY: "Fundamentals you are expected to know without hesitation.",
  MEDIUM: "Deeper understanding and practical, applied knowledge.",
  HARD: "Internals, edge cases, and real-world trade-offs.",
};

/** Beginner → Intermediate → Advanced. Order is significant. */
export const DIFFICULTY_ORDER: Difficulty[] = ["EASY", "MEDIUM", "HARD"];

export type RevisionStatus = "DUE" | "UPCOMING" | "MASTERED";

export interface Category {
  slug: string;
  name: string;
  problemCount: number;
  /** Two-letter mark used on directory cards. */
  monogram: string;
}

export interface Pattern {
  slug: string;
  name: string;
  problemCount: number;
}

export interface Example {
  label: string;
  input: string;
  output: string;
  explanation?: string;
}

export interface Solution {
  language: Language;
  code: string;
}

/** Which curated list a problem belongs to. */
export type Collection = "TOP_150" | "EXTRA";

/**
 * A problem record.
 *
 * Catalog fields are always present. The deep fields below are optional because
 * all 150 study plan problems are seeded, but only some have been written up —
 * a half-written problem should render an honest empty state rather than
 * placeholder prose.
 */
export interface Problem {
  slug: string;
  /** LeetCode number, or null for a fundamentals exercise with no upstream. */
  number: number | null;
  title: string;
  difficulty: Difficulty;
  categorySlug: string;
  patternSlugs: string[];
  /** One-line index summary, e.g. "Arrays + hash map — look up the complement". */
  synopsis: string;
  /** Null when the problem does not exist on LeetCode. */
  leetcodeUrl: string | null;
  languages: Language[];
  collection: Collection;
  /** Position within the study plan, for stable ordering. */
  order: number;

  // --- Deep content, present once the problem has been written up ---------
  description?: string[];
  examples?: Example[];
  constraints?: string[];
  intuition?: string;
  approach?: string[];
  timeComplexity?: string;
  spaceComplexity?: string;
  keyTakeaway?: string;
  revisionSummary?: string[];
  criticalTrap?: string;
  solutions?: Solution[];
}

/** True when a problem has enough written up to render the detail views. */
export const hasWriteUp = (problem: Problem): boolean =>
  Boolean(problem.intuition && problem.approach?.length && problem.solutions?.length);

/**
 * A fully authored write-up, as stored in `problems.ts`.
 *
 * Catalog metadata on these records (category, synopsis, …) is superseded by
 * `catalog.ts`, which is the single source of truth for the study plan; only
 * the deep fields are merged in.
 */
export interface AuthoredProblem {
  slug: string;
  /** Null for a fundamentals exercise with no LeetCode number. */
  number: number | null;
  title: string;
  difficulty: Difficulty;
  categorySlug: string;
  patternSlugs: string[];
  synopsis: string;
  description: string[];
  examples: Example[];
  constraints: string[];
  intuition: string;
  approach: string[];
  timeComplexity: string;
  spaceComplexity: string;
  keyTakeaway: string;
  revisionSummary: string[];
  criticalTrap: string;
  /** Null when the exercise does not exist on LeetCode. */
  leetcodeUrl: string | null;
  languages: Language[];
  solutions: Solution[];
}

export interface Progress {
  problemSlug: string;
  mastery: MasteryLevel;
  traceCompleted: boolean;
  bookmarked: boolean;
  lastStudiedAt: string | null;
  /** Field count for the structured notebook: filled / total. */
  notesFilled: number;
  notesTotal: number;
}

export interface RevisionEntry {
  problemSlug: string;
  dueLabel: string;
  /** Days from today; negative = overdue, 0 = today. */
  dueInDays: number;
  reviewCount: number;
  lastRecall: "forgot" | "partial" | "remembered" | "easy" | null;
  status: RevisionStatus;
}

export interface ActivityEntry {
  problemSlug: string;
  dateLabel: string;
  activity: "TRACE" | "NOTE" | "REVIEW" | "READ";
  detail: string;
  mastery: MasteryLevel;
}

export interface CategoryStat {
  categorySlug: string;
  studied: number;
  traced: number;
  independent: number;
  mastered: number;
  due: number;
  total: number;
}

export interface PatternStat {
  patternSlug: string;
  mastered: number;
  studied: number;
  due: number;
}

export interface Bookmark {
  problemSlug: string;
  note: string;
}

/* -------------------------------------------------------------------------- */
/* Trace protocol (Phase 3)                                                    */
/* -------------------------------------------------------------------------- */

export type SemanticEvent =
  | { type: "ARRAY_ACCESS"; index: number }
  | { type: "ARRAY_UPDATE"; index: number; newValue: unknown }
  | { type: "POINTER_MOVE"; name: string; targetId: string | number }
  | { type: "COMPARE"; elements: string[] }
  | { type: "SWAP"; indexA: number; indexB: number }
  | { type: "STACK_PUSH"; item: unknown }
  | { type: "STACK_POP"; item: unknown }
  | { type: "NODE_VISIT"; nodeId: string }
  | { type: "RECURSION_CALL"; functionName: string; args: Record<string, unknown> }
  | { type: "RECURSION_RETURN"; value: unknown }
  | { type: "DP_UPDATE"; row: number; col: number; value: unknown };

/** Coarse classification used to draw the timeline ruler's event marks. */
export type EventKind = "call" | "compare" | "mutation" | "return";

export interface IntervalStructure {
  name: string;
  /** Inclusive [start, end] ranges in domain units. */
  values: [number, number][];
  /** Index of the interval currently held open. */
  activeIndex?: number;
  /** Index of the interval being compared against the active one. */
  cursorIndex?: number;
  /** Ranges already committed to the output. */
  merged: [number, number][];
  /** Upper bound of the x axis. */
  domainMax: number;
}

export interface ArrayStructure {
  name: string;
  values: (number | string)[];
  highlightedIndices?: number[];
  pointers?: Record<string, number>;
}

export type NodeTone = "default" | "active" | "created" | "consumed";

export interface LinkedListNode {
  id: string;
  value: string | number;
  tone?: NodeTone;
}

/** One row of nodes on the canvas, e.g. the two inputs and the result. */
export interface LinkedListLane {
  label: string;
  nodes: LinkedListNode[];
  /** Draw the terminal null marker after the last node. */
  terminal: boolean;
  /** Shown when the lane has no nodes yet. */
  emptyHint?: string;
}

export interface LinkedListStructure {
  lanes: LinkedListLane[];
  /** Pointer name → node id. */
  pointers: Record<string, string>;
}

/** An auxiliary collection shown beside a structure, e.g. a BFS queue. */
export interface Frontier {
  label: string;
  /** Node ids, in the order the algorithm holds them. */
  ids: string[];
  emptyHint?: string;
}

export interface TreeNodeShape {
  id: string;
  value: string | number;
  /**
   * Position in heap-index terms: `depth` is the row (0 = root) and `slot` is
   * the column within that row, 0-based out of `2 ** depth`. Storing the slot
   * rather than a pixel x keeps the builder free of layout concerns and lets
   * the visualizer scale to any width.
   */
  depth: number;
  slot: number;
  tone?: NodeTone;
  /** Parent id, for drawing the edge. Absent on the root. */
  parentId?: string;
}

export interface TreeStructure {
  name: string;
  nodes: TreeNodeShape[];
  /** Pointer name → node id. */
  pointers?: Record<string, string>;
  frontier?: Frontier;
  /** Nodes already emitted to the result, grouped as the answer is built. */
  levels?: (string | number)[][];
}

export interface GraphNodeShape {
  id: string;
  label: string | number;
  tone?: NodeTone;
  /** Small annotation drawn under the node, e.g. an indegree count. */
  badge?: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  tone?: "default" | "active" | "consumed";
}

export interface GraphStructure {
  name: string;
  nodes: GraphNodeShape[];
  edges: GraphEdge[];
  /** Directed edges get arrowheads; undirected ones do not. */
  directed?: boolean;
  frontier?: Frontier;
  /** Ordered output, e.g. a topological order as it is committed. */
  order?: (string | number)[];
}

export interface TraceStep {
  stepIndex: number;
  /**
   * The active source line per language. The same logical step maps to
   * different line numbers in Java and Python, so it is stored per language
   * rather than assuming one canonical listing.
   */
  lineHighlight: Record<Language, number>;
  explanation: string;
  /** Short state summary shown above the explanation. */
  state: string;
  /** Coarse stage of the algorithm, e.g. "Merge scan". Groups the timeline. */
  phase: string;
  kind: EventKind;
  variables: Record<string, string>;
  /** Variable names whose value changed on this step. */
  changed?: string[];
  structures: {
    array?: ArrayStructure;
    intervals?: IntervalStructure;
    linkedList?: LinkedListStructure;
    tree?: TreeStructure;
    graph?: GraphStructure;
  };
  events: SemanticEvent[];
}

export interface Trace {
  problemSlug: string;
  /** Source lines per language, 1-indexed by position in each array. */
  code: Record<Language, string[]>;
  steps: TraceStep[];
  /** Human-readable description of the input this trace was generated from. */
  inputLabel: string;
}

/** Editable input spec powering the "Configure inputs" panel. */
export interface TraceInputField {
  key: string;
  label: string;
  hint: string;
  placeholder: string;
  value: string;
}
