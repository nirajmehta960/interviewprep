import type {
  ActivityEntry,
  Bookmark,
  CategoryStat,
  PatternStat,
  Progress,
  RevisionEntry,
} from "@/lib/types";

/** Notebook fields per problem, from the Phase 4 structured note schema. */
export const NOTE_FIELDS = [
  { key: "myUnderstanding", group: "Understand", label: "My Understanding", prompt: "In your own words, what is this problem asking?" },
  { key: "mentalModel", group: "Understand", label: "My Mental Model", prompt: "What picture do you hold in your head while solving it?" },
  { key: "keyInsight", group: "Understand", label: "Important Insight", prompt: "What makes the approach work?" },
  { key: "myMistake", group: "Correct", label: "My Mistake", prompt: "What did you get wrong the first time?" },
  { key: "commonMistakes", group: "Correct", label: "Common Mistake", prompt: "What do most people get wrong here?" },
  { key: "keepForgetting", group: "Correct", label: "Things I Keep Forgetting", prompt: "What detail slips away between reviews?" },
  { key: "interviewTips", group: "Explain", label: "Interview Explanation", prompt: "How would you explain this in 60 seconds?" },
] as const;

export type NoteFieldKey = (typeof NOTE_FIELDS)[number]["key"];

export const progress: Progress[] = [
  {
    problemSlug: "merge-intervals",
    mastery: "SOLVED_INDEPENDENTLY",
    traceCompleted: true,
    bookmarked: true,
    lastStudiedAt: "2026-09-08",
    notesFilled: 5,
    notesTotal: 7,
  },
  {
    problemSlug: "longest-substring-without-repeating-characters",
    mastery: "TRACED",
    traceCompleted: true,
    bookmarked: false,
    lastStudiedAt: "2026-09-07",
    notesFilled: 3,
    notesTotal: 7,
  },
  {
    problemSlug: "two-sum",
    mastery: "INTERVIEW_READY",
    traceCompleted: true,
    bookmarked: true,
    lastStudiedAt: "2026-09-06",
    notesFilled: 7,
    notesTotal: 7,
  },
  {
    problemSlug: "lru-cache",
    mastery: "STUDIED",
    traceCompleted: false,
    bookmarked: true,
    lastStudiedAt: "2026-09-07",
    notesFilled: 2,
    notesTotal: 7,
  },
  {
    problemSlug: "add-two-numbers",
    mastery: "TRACED",
    traceCompleted: true,
    bookmarked: false,
    lastStudiedAt: "2026-09-06",
    notesFilled: 2,
    notesTotal: 7,
  },
  {
    problemSlug: "coin-change",
    mastery: "STUDIED",
    traceCompleted: false,
    bookmarked: false,
    lastStudiedAt: "2026-09-02",
    notesFilled: 1,
    notesTotal: 7,
  },
  {
    problemSlug: "valid-parentheses",
    mastery: "INTERVIEW_READY",
    traceCompleted: true,
    bookmarked: false,
    lastStudiedAt: "2026-09-05",
    notesFilled: 6,
    notesTotal: 7,
  },
  {
    problemSlug: "number-of-islands",
    mastery: "CAN_EXPLAIN",
    traceCompleted: true,
    bookmarked: false,
    lastStudiedAt: "2026-09-04",
    notesFilled: 4,
    notesTotal: 7,
  },
  {
    problemSlug: "binary-tree-level-order-traversal",
    mastery: "TRACED",
    traceCompleted: true,
    bookmarked: true,
    lastStudiedAt: "2026-09-05",
    notesFilled: 3,
    notesTotal: 7,
  },
  {
    problemSlug: "daily-temperatures",
    mastery: "STUDIED",
    traceCompleted: false,
    bookmarked: true,
    lastStudiedAt: "2026-08-30",
    notesFilled: 2,
    notesTotal: 7,
  },
  {
    problemSlug: "course-schedule",
    mastery: "STUDIED",
    traceCompleted: false,
    bookmarked: false,
    lastStudiedAt: "2026-09-01",
    notesFilled: 1,
    notesTotal: 7,
  },
  {
    problemSlug: "product-of-array-except-self",
    mastery: "CAN_EXPLAIN",
    traceCompleted: true,
    bookmarked: false,
    lastStudiedAt: "2026-09-03",
    notesFilled: 4,
    notesTotal: 7,
  },
  {
    problemSlug: "three-sum",
    mastery: "TRACED",
    traceCompleted: true,
    bookmarked: true,
    lastStudiedAt: "2026-09-02",
    notesFilled: 3,
    notesTotal: 7,
  },
  {
    problemSlug: "house-robber-ii",
    mastery: "SOLVED_INDEPENDENTLY",
    traceCompleted: true,
    bookmarked: false,
    lastStudiedAt: "2026-09-04",
    notesFilled: 5,
    notesTotal: 7,
  },
  {
    problemSlug: "binary-tree-right-side-view",
    mastery: "NOT_STUDIED",
    traceCompleted: false,
    bookmarked: false,
    lastStudiedAt: null,
    notesFilled: 0,
    notesTotal: 7,
  },
];

export const revisionQueue: RevisionEntry[] = [
  {
    problemSlug: "longest-substring-without-repeating-characters",
    dueLabel: "Today",
    dueInDays: 0,
    reviewCount: 3,
    lastRecall: "partial",
    status: "DUE",
  },
  {
    problemSlug: "two-sum",
    dueLabel: "Today",
    dueInDays: 0,
    reviewCount: 5,
    lastRecall: "remembered",
    status: "DUE",
  },
  {
    problemSlug: "course-schedule",
    dueLabel: "Tomorrow",
    dueInDays: 1,
    reviewCount: 1,
    lastRecall: "forgot",
    status: "DUE",
  },
  {
    problemSlug: "binary-tree-level-order-traversal",
    dueLabel: "Sep 11",
    dueInDays: 3,
    reviewCount: 2,
    lastRecall: "partial",
    status: "UPCOMING",
  },
  {
    problemSlug: "merge-intervals",
    dueLabel: "Sep 12",
    dueInDays: 4,
    reviewCount: 4,
    lastRecall: "remembered",
    status: "UPCOMING",
  },
  {
    problemSlug: "coin-change",
    dueLabel: "Sep 14",
    dueInDays: 6,
    reviewCount: 1,
    lastRecall: "forgot",
    status: "UPCOMING",
  },
  {
    problemSlug: "daily-temperatures",
    dueLabel: "Sep 16",
    dueInDays: 8,
    reviewCount: 2,
    lastRecall: "partial",
    status: "UPCOMING",
  },
];

export const activity: ActivityEntry[] = [
  {
    problemSlug: "merge-intervals",
    dateLabel: "Sep 08",
    activity: "TRACE",
    detail: "27 steps · stopped at the contained-interval case",
    mastery: "SOLVED_INDEPENDENTLY",
  },
  {
    problemSlug: "lru-cache",
    dateLabel: "Sep 07",
    activity: "NOTE",
    detail: "18 min · mental model written",
    mastery: "STUDIED",
  },
  {
    problemSlug: "longest-substring-without-repeating-characters",
    dateLabel: "Sep 07",
    activity: "TRACE",
    detail: "45 steps · window jump confirmed",
    mastery: "TRACED",
  },
  {
    problemSlug: "two-sum",
    dateLabel: "Sep 06",
    activity: "REVIEW",
    detail: "6 prompts · remembered",
    mastery: "INTERVIEW_READY",
  },
  {
    problemSlug: "valid-parentheses",
    dateLabel: "Sep 05",
    activity: "REVIEW",
    detail: "5 prompts · remembered",
    mastery: "INTERVIEW_READY",
  },
  {
    problemSlug: "binary-tree-level-order-traversal",
    dateLabel: "Sep 05",
    activity: "READ",
    detail: "Approach · 2 steps",
    mastery: "TRACED",
  },
];

/**
 * Per-category study state.
 *
 * `total` is the study plan's own count for the group, and `due` is derived
 * from `revisionQueue` above so the matrix and the queue cannot contradict
 * each other.
 */
export const categoryStats: CategoryStat[] = [
  { categorySlug: "array-string", studied: 9, traced: 6, independent: 4, mastered: 2, due: 0, total: 24 },
  { categorySlug: "two-pointers", studied: 4, traced: 3, independent: 2, mastered: 1, due: 0, total: 5 },
  { categorySlug: "sliding-window", studied: 4, traced: 3, independent: 2, mastered: 1, due: 1, total: 4 },
  { categorySlug: "matrix", studied: 2, traced: 1, independent: 1, mastered: 0, due: 0, total: 5 },
  { categorySlug: "hashmap", studied: 6, traced: 4, independent: 3, mastered: 2, due: 1, total: 9 },
  { categorySlug: "intervals", studied: 3, traced: 2, independent: 2, mastered: 1, due: 1, total: 4 },
  { categorySlug: "stack", studied: 4, traced: 3, independent: 2, mastered: 2, due: 1, total: 5 },
  { categorySlug: "linked-list", studied: 5, traced: 3, independent: 2, mastered: 1, due: 0, total: 11 },
  { categorySlug: "binary-tree-general", studied: 4, traced: 2, independent: 1, mastered: 0, due: 0, total: 14 },
  { categorySlug: "binary-tree-bfs", studied: 3, traced: 2, independent: 1, mastered: 1, due: 1, total: 4 },
  { categorySlug: "binary-search-tree", studied: 1, traced: 1, independent: 0, mastered: 0, due: 0, total: 3 },
  { categorySlug: "graph-general", studied: 3, traced: 2, independent: 1, mastered: 1, due: 1, total: 6 },
  { categorySlug: "graph-bfs", studied: 1, traced: 0, independent: 0, mastered: 0, due: 0, total: 3 },
  { categorySlug: "trie", studied: 1, traced: 0, independent: 0, mastered: 0, due: 0, total: 3 },
  { categorySlug: "backtracking", studied: 2, traced: 1, independent: 1, mastered: 0, due: 0, total: 7 },
  { categorySlug: "divide-conquer", studied: 1, traced: 1, independent: 0, mastered: 0, due: 0, total: 4 },
  { categorySlug: "kadane", studied: 2, traced: 1, independent: 1, mastered: 1, due: 0, total: 2 },
  { categorySlug: "binary-search", studied: 3, traced: 2, independent: 2, mastered: 1, due: 0, total: 7 },
  { categorySlug: "heap", studied: 1, traced: 1, independent: 0, mastered: 0, due: 0, total: 4 },
  { categorySlug: "bit-manipulation", studied: 2, traced: 1, independent: 1, mastered: 1, due: 0, total: 6 },
  { categorySlug: "math", studied: 2, traced: 1, independent: 1, mastered: 0, due: 0, total: 6 },
  { categorySlug: "dp-1d", studied: 3, traced: 2, independent: 1, mastered: 1, due: 1, total: 5 },
  { categorySlug: "dp-multi", studied: 2, traced: 1, independent: 0, mastered: 0, due: 1, total: 9 },
];

export const patternStats: PatternStat[] = [
  { patternSlug: "sliding-window", mastered: 4, studied: 4, due: 0 },
  { patternSlug: "two-pointers", mastered: 3, studied: 4, due: 1 },
  { patternSlug: "binary-search", mastered: 3, studied: 5, due: 0 },
  { patternSlug: "hash-map", mastered: 4, studied: 7, due: 1 },
  { patternSlug: "monotonic-stack", mastered: 2, studied: 4, due: 2 },
  { patternSlug: "bfs", mastered: 3, studied: 6, due: 1 },
  { patternSlug: "tabulation", mastered: 2, studied: 7, due: 3 },
  { patternSlug: "dfs", mastered: 1, studied: 3, due: 1 },
  { patternSlug: "topological-sort", mastered: 1, studied: 3, due: 1 },
  { patternSlug: "sweep-line", mastered: 1, studied: 4, due: 1 },
  { patternSlug: "prefix-sum", mastered: 2, studied: 4, due: 0 },
  { patternSlug: "fast-slow", mastered: 1, studied: 4, due: 1 },
];

export const bookmarks: Bookmark[] = [
  { problemSlug: "daily-temperatures", note: "Monotonic stack pattern" },
  { problemSlug: "three-sum", note: "When to use two pointers" },
  { problemSlug: "number-of-islands", note: "BFS vs DFS checklist" },
  { problemSlug: "coin-change", note: "DP state definition notes" },
  { problemSlug: "merge-intervals", note: "Extend vs commit decision" },
  { problemSlug: "lru-cache", note: "Sentinel node trick" },
  { problemSlug: "two-sum", note: "Complement before insert" },
];

/** The session banner on the dashboard. Phase 6 derives this from the DB. */
export const session = {
  dateLabel: "08 Sep 2026",
  plannedMinutes: 42,
  lastSyncLabel: "08 Sep 2026, 10:42",
  resume: {
    problemSlug: "merge-intervals",
    context: "You were tracing the sort-by-start approach. The active range is the fourth interval, before the overlap check.",
    stepIndex: 14,
    openedLabel: "8 min ago",
  },
};

/** Free-form notes already written, keyed by problem then field. */
export const savedNotes: Record<string, Partial<Record<NoteFieldKey, string>>> = {
  "merge-intervals": {
    myUnderstanding:
      "Collapse a list of ranges so that no two of them overlap, keeping the full coverage of the original list.",
    mentalModel:
      "One range is held open at a time. Each new range either stretches it or closes it and starts a new one.",
    keyInsight:
      "The sort is not the solution — it makes the greedy choice safe. Once intervals are ordered by start, every interval to the left has already been considered, so I only need to carry the farthest end of the merged block.\n\nIf the next start is less than or equal to the active end, the intervals overlap, so I extend with max(activeEnd, nextEnd). The invariant is simple: the active end always reaches the furthest point covered by the current group.\n\nI must not replace the end with nextEnd. A long interval can contain a shorter one, and losing the larger end would break the merge later.",
    myMistake:
      "I wrote active[1] = current[1] and it passed the basic overlap example, then failed on [[1,10],[2,3]].",
    keepForgetting: "Touching endpoints count as overlapping, so the comparison is <= and not <.",
  },
  "longest-substring-without-repeating-characters": {
    myUnderstanding:
      "Find the width of the widest stretch of the string in which no character repeats.",
    mentalModel:
      "A window slides right. When a duplicate walks in, the left edge teleports past the old copy.",
    keyInsight:
      "A sliding window lets the string be read once, while the last-seen map tells me exactly where the current range stops being valid.",
  },
};

export const freeformNotes: Record<string, string> = {
  "merge-intervals":
    "Watch the end, not the length. The current interval can carry a farther end than the next one.\n\nNeed to sort first. The end is the only piece of state that survives each comparison.\n\n→ ask: why max(end, nextEnd)?",
  "longest-substring-without-repeating-characters":
    "The guard lastSeen[c] >= left is the whole trick. Without it left walks backwards.",
};
