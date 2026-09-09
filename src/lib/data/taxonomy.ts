import type { Category, Pattern } from "@/lib/types";

/**
 * Categories mirror LeetCode's **Top Interview 150** study plan groupings, so
 * the index reads the same way the study plan does.
 *
 * `problemCount` is the study plan's own count for each group; it is asserted
 * against the seeded catalog in `catalog.ts`.
 */
export const categories: Category[] = [
  { slug: "array-string", name: "Array / String", problemCount: 24, monogram: "AR" },
  // Not part of the study plan: foundational array exercises, so 0 planned.
  { slug: "array-fundamentals", name: "Array Fundamentals", problemCount: 0, monogram: "AF" },
  // Likewise outside the plan: classic drills grouped by their own topic.
  { slug: "recursion", name: "Recursion", problemCount: 0, monogram: "RC" },
  { slug: "sorting", name: "Sorting Algorithms", problemCount: 0, monogram: "SO" },
  { slug: "queue", name: "Queue", problemCount: 0, monogram: "QU" },
  { slug: "two-pointers", name: "Two Pointers", problemCount: 5, monogram: "TP" },
  { slug: "sliding-window", name: "Sliding Window", problemCount: 4, monogram: "SW" },
  { slug: "matrix", name: "Matrix", problemCount: 5, monogram: "MX" },
  { slug: "hashmap", name: "Hashmap", problemCount: 9, monogram: "HM" },
  { slug: "intervals", name: "Intervals", problemCount: 4, monogram: "IV" },
  { slug: "stack", name: "Stack", problemCount: 5, monogram: "ST" },
  { slug: "linked-list", name: "Linked List", problemCount: 11, monogram: "LL" },
  { slug: "binary-tree-general", name: "Binary Tree General", problemCount: 14, monogram: "BT" },
  { slug: "binary-tree-bfs", name: "Binary Tree BFS", problemCount: 4, monogram: "BB" },
  { slug: "binary-search-tree", name: "Binary Search Tree", problemCount: 3, monogram: "BST" },
  { slug: "graph-general", name: "Graph General", problemCount: 6, monogram: "GR" },
  { slug: "graph-bfs", name: "Graph BFS", problemCount: 3, monogram: "GB" },
  { slug: "trie", name: "Trie", problemCount: 3, monogram: "TI" },
  { slug: "backtracking", name: "Backtracking", problemCount: 7, monogram: "BK" },
  { slug: "divide-conquer", name: "Divide & Conquer", problemCount: 4, monogram: "DC" },
  { slug: "kadane", name: "Kadane's Algorithm", problemCount: 2, monogram: "KD" },
  { slug: "binary-search", name: "Binary Search", problemCount: 7, monogram: "BS" },
  { slug: "heap", name: "Heap", problemCount: 4, monogram: "HP" },
  { slug: "bit-manipulation", name: "Bit Manipulation", problemCount: 6, monogram: "BM" },
  { slug: "math", name: "Math", problemCount: 6, monogram: "MA" },
  { slug: "dp-1d", name: "1D DP", problemCount: 5, monogram: "DP" },
  { slug: "dp-multi", name: "Multidimensional DP", problemCount: 9, monogram: "MD" },
];

/** Techniques, as a secondary axis that cuts across the study plan groups. */
export const patterns: Pattern[] = [
  { slug: "hash-map", name: "Hash map", problemCount: 12 },
  { slug: "two-pointers", name: "Two pointers", problemCount: 11 },
  { slug: "sliding-window", name: "Sliding window", problemCount: 4 },
  { slug: "sweep-line", name: "Sweep line", problemCount: 4 },
  { slug: "monotonic-stack", name: "Monotonic stack", problemCount: 3 },
  { slug: "binary-search", name: "Binary search", problemCount: 8 },
  { slug: "fast-slow", name: "Fast & slow pointers", problemCount: 3 },
  { slug: "bfs", name: "Breadth-first search", problemCount: 10 },
  { slug: "dfs", name: "Depth-first search", problemCount: 14 },
  { slug: "backtracking", name: "Backtracking", problemCount: 7 },
  { slug: "topological-sort", name: "Topological sort", problemCount: 2 },
  { slug: "prefix-sum", name: "Prefix / suffix", problemCount: 5 },
  { slug: "tabulation", name: "Tabulation", problemCount: 12 },
  { slug: "greedy", name: "Greedy", problemCount: 8 },
  { slug: "heap", name: "Heap", problemCount: 4 },
  { slug: "in-place", name: "In-place rewrite", problemCount: 9 },
  { slug: "bit-tricks", name: "Bit tricks", problemCount: 6 },
  { slug: "math", name: "Math", problemCount: 6 },
  { slug: "trie", name: "Trie", problemCount: 3 },
  { slug: "divide-conquer", name: "Divide & conquer", problemCount: 4 },
  { slug: "sorting", name: "Sorting", problemCount: 6 },
  { slug: "recursion", name: "Recursion", problemCount: 10 },
];

/**
 * Default techniques for a study plan group. A problem may override these, but
 * the default keeps the pattern filter useful across the whole catalog without
 * hand-tagging 150 entries.
 */
export const CATEGORY_PATTERNS: Record<string, string[]> = {
  "array-string": ["in-place", "greedy"],
  "two-pointers": ["two-pointers"],
  "sliding-window": ["sliding-window", "hash-map"],
  matrix: ["in-place"],
  hashmap: ["hash-map"],
  intervals: ["sweep-line", "sorting"],
  stack: ["monotonic-stack"],
  "linked-list": ["fast-slow"],
  "binary-tree-general": ["dfs", "recursion"],
  "binary-tree-bfs": ["bfs"],
  "binary-search-tree": ["dfs", "recursion"],
  "graph-general": ["dfs"],
  "graph-bfs": ["bfs"],
  trie: ["trie"],
  backtracking: ["backtracking", "recursion"],
  "divide-conquer": ["divide-conquer", "recursion"],
  kadane: ["tabulation", "greedy"],
  "binary-search": ["binary-search"],
  heap: ["heap"],
  "bit-manipulation": ["bit-tricks"],
  math: ["math"],
  "dp-1d": ["tabulation"],
  "dp-multi": ["tabulation"],
};

export const categoryName = (slug: string) =>
  categories.find((c) => c.slug === slug)?.name ?? slug;

export const categoryMonogram = (slug: string) =>
  categories.find((c) => c.slug === slug)?.monogram ?? slug.slice(0, 2).toUpperCase();

export const patternName = (slug: string) =>
  patterns.find((p) => p.slug === slug)?.name ?? slug;

/**
 * Authored display tags. Anything not listed here falls back to the category
 * and pattern names, so every card still carries useful chips.
 */
export const PROBLEM_TAGS: Record<string, string[]> = {
  "merge-intervals": ["Intervals", "Sorting", "Greedy", "Sweep Line"],
  "longest-substring-without-repeating-characters": ["Sliding Window", "Hash Map", "String"],
  "two-sum": ["Hash Map", "Array", "Complement"],
  "add-two-numbers": ["Linked List", "Math", "Carry", "Dummy Head"],
  "lru-cache": ["Design", "Hash Map", "Doubly Linked List", "O(1)"],
  "coin-change": ["Dynamic Programming", "Tabulation", "Unbounded"],
  "valid-parentheses": ["Stack", "String", "Matching"],
  "number-of-islands": ["DFS", "Flood Fill", "Matrix", "Connected Components"],
  "binary-tree-level-order-traversal": ["BFS", "Binary Tree", "Queue"],
  "daily-temperatures": ["Monotonic Stack", "Array", "Indices"],
  "course-schedule": ["Topological Sort", "Indegree", "Cycle Detection", "Graph"],
  "product-of-array-except-self": ["Prefix Product", "Suffix Product", "Array"],
  "three-sum": ["Two Pointers", "Sorting", "Duplicate Handling"],
  "house-robber-ii": ["Dynamic Programming", "Circular", "State Machine"],
  "binary-tree-right-side-view": ["BFS", "Binary Tree", "Level Boundary"],
};

/**
 * Display tags for a problem's directory card. Falls back to the category and
 * pattern names so every card carries useful chips without hand-tagging 150
 * entries.
 */
export const tagsFor = (slug: string, categorySlug?: string, patternSlugs: string[] = []) => {
  const authored = PROBLEM_TAGS[slug];
  if (authored) return authored;

  const derived = [
    ...(categorySlug ? [categoryName(categorySlug)] : []),
    ...patternSlugs.map(patternName),
  ];
  return [...new Set(derived)];
};
