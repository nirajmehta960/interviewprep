import type { Collection, Difficulty, Problem } from "@/lib/types";
import { CATEGORY_PATTERNS } from "./taxonomy";

/**
 * LeetCode **Top Interview 150** catalog.
 *
 * Single source of truth for the study plan: `prisma/seed.ts` writes these rows
 * to Postgres, and the UI reads the same list, so the two cannot drift.
 *
 * Rows carry catalog metadata only. Deep content (examples, approach,
 * solutions) lives in `problems.ts` and is merged in by slug — a problem
 * without a write-up still appears in the index and degrades to an honest
 * empty state on its detail pages.
 */

/** [number, slug, title, difficulty, categorySlug, synopsis] */
type Row = [number, string, string, Difficulty, string, string];

const TOP_150: Row[] = [
  // --- Array / String (24) ------------------------------------------------
  [88, "merge-sorted-array", "Merge Sorted Array", "EASY", "array-string", "Merge from the back so writes never clobber unread values."],
  [27, "remove-element", "Remove Element", "EASY", "array-string", "Compact in place with a slow write pointer."],
  [26, "remove-duplicates-from-sorted-array", "Remove Duplicates from Sorted Array", "EASY", "array-string", "Sorted input means duplicates are adjacent — keep one of each run."],
  [80, "remove-duplicates-from-sorted-array-ii", "Remove Duplicates from Sorted Array II", "MEDIUM", "array-string", "Allow two copies by comparing against the value two slots back."],
  [169, "majority-element", "Majority Element", "EASY", "array-string", "Boyer-Moore voting cancels minority elements against the candidate."],
  [189, "rotate-array", "Rotate Array", "MEDIUM", "array-string", "Three reversals rotate in place with no extra array."],
  [121, "best-time-to-buy-and-sell-stock", "Best Time to Buy and Sell Stock", "EASY", "array-string", "Track the lowest price so far and the best profit against it."],
  [122, "best-time-to-buy-and-sell-stock-ii", "Best Time to Buy and Sell Stock II", "MEDIUM", "array-string", "Unlimited trades — bank every upward step."],
  [55, "jump-game", "Jump Game", "MEDIUM", "array-string", "Carry the furthest reachable index; fail when it falls behind."],
  [45, "jump-game-ii", "Jump Game II", "MEDIUM", "array-string", "Greedy level expansion — count a jump as each reach window closes."],
  [274, "h-index", "H-Index", "MEDIUM", "array-string", "Bucket the citation counts, then sweep down for the largest h."],
  [380, "insert-delete-getrandom-o1", "Insert Delete GetRandom O(1)", "MEDIUM", "array-string", "Array for random access, map for lookup, swap-with-last to delete."],
  [238, "product-of-array-except-self", "Product of Array Except Self", "MEDIUM", "array-string", "Prefix products left, suffix products right, no division."],
  [134, "gas-station", "Gas Station", "MEDIUM", "array-string", "If total gas covers total cost, start just after the last deficit."],
  [135, "candy", "Candy", "HARD", "array-string", "Two sweeps — left to right, then right to left, taking the max."],
  [42, "trapping-rain-water", "Trapping Rain Water", "HARD", "array-string", "Water over a bar is bounded by the smaller of the two max walls."],
  [13, "roman-to-integer", "Roman to Integer", "EASY", "array-string", "Subtract when a smaller numeral precedes a larger one."],
  [12, "integer-to-roman", "Integer to Roman", "MEDIUM", "array-string", "Greedily subtract the largest token, subtractive forms included."],
  [58, "length-of-last-word", "Length of Last Word", "EASY", "array-string", "Scan from the end, skipping trailing spaces first."],
  [14, "longest-common-prefix", "Longest Common Prefix", "EASY", "array-string", "Shrink a candidate prefix against each string in turn."],
  [151, "reverse-words-in-a-string", "Reverse Words in a String", "MEDIUM", "array-string", "Split on runs of whitespace, then reverse the word order."],
  [6, "zigzag-conversion", "Zigzag Conversion", "MEDIUM", "array-string", "Walk rows with a bouncing direction, appending per row."],
  [28, "find-the-index-of-the-first-occurrence-in-a-string", "Find the Index of the First Occurrence in a String", "EASY", "array-string", "Substring search — sliding compare, or KMP for linear time."],
  [68, "text-justification", "Text Justification", "HARD", "array-string", "Greedily pack each line, then distribute spaces left-heavy."],

  // --- Two Pointers (5) ---------------------------------------------------
  [125, "valid-palindrome", "Valid Palindrome", "EASY", "two-pointers", "Converge from both ends, skipping non-alphanumerics."],
  [392, "is-subsequence", "Is Subsequence", "EASY", "two-pointers", "Advance the needle only on a match; the haystack always advances."],
  [167, "two-sum-ii-input-array-is-sorted", "Two Sum II - Input Array Is Sorted", "MEDIUM", "two-pointers", "Sorted input lets the sum be steered by moving one end."],
  [11, "container-with-most-water", "Container With Most Water", "MEDIUM", "two-pointers", "Move the shorter wall inward — it is the binding constraint."],
  [15, "three-sum", "3Sum", "MEDIUM", "two-pointers", "Sort, fix one number, then squeeze the rest with two pointers."],

  // --- Sliding Window (4) -------------------------------------------------
  [209, "minimum-size-subarray-sum", "Minimum Size Subarray Sum", "MEDIUM", "sliding-window", "Grow right until the sum qualifies, then shrink from the left."],
  [3, "longest-substring-without-repeating-characters", "Longest Substring Without Repeating Characters", "MEDIUM", "sliding-window", "Jump the left edge past the duplicate's last-seen index."],
  [30, "substring-with-concatenation-of-all-words", "Substring with Concatenation of All Words", "HARD", "sliding-window", "Fixed-width window stepped by word length, counting frequencies."],
  [76, "minimum-window-substring", "Minimum Window Substring", "HARD", "sliding-window", "Expand to cover every required count, then contract while valid."],

  // --- Matrix (5) ---------------------------------------------------------
  [36, "valid-sudoku", "Valid Sudoku", "MEDIUM", "matrix", "One pass with three sets of seen values: row, column, and box."],
  [54, "spiral-matrix", "Spiral Matrix", "MEDIUM", "matrix", "Walk the four boundaries inward, shrinking after each edge."],
  [48, "rotate-image", "Rotate Image", "MEDIUM", "matrix", "Transpose, then reverse each row — rotation with no second grid."],
  [73, "set-matrix-zeroes", "Set Matrix Zeroes", "MEDIUM", "matrix", "Use the first row and column as the marker storage."],
  [289, "game-of-life", "Game of Life", "MEDIUM", "matrix", "Encode the next state in spare bits so updates stay simultaneous."],

  // --- Hashmap (9) --------------------------------------------------------
  [383, "ransom-note", "Ransom Note", "EASY", "hashmap", "Count the letters available, then spend them against the note."],
  [205, "isomorphic-strings", "Isomorphic Strings", "EASY", "hashmap", "A consistent mapping has to hold in both directions."],
  [290, "word-pattern", "Word Pattern", "EASY", "hashmap", "Bijection between pattern letters and words, both ways."],
  [242, "valid-anagram", "Valid Anagram", "EASY", "hashmap", "Equal multisets of characters — count up, then count down."],
  [49, "group-anagrams", "Group Anagrams", "MEDIUM", "hashmap", "Key each word by its sorted letters or its letter counts."],
  [1, "two-sum", "Two Sum", "EASY", "hashmap", "Look up the complement before inserting the current number."],
  [202, "happy-number", "Happy Number", "EASY", "hashmap", "Detect the cycle in repeated digit-square sums."],
  [219, "contains-duplicate-ii", "Contains Duplicate II", "EASY", "hashmap", "Remember each value's latest index and test the gap."],
  [128, "longest-consecutive-sequence", "Longest Consecutive Sequence", "MEDIUM", "hashmap", "Only start counting at a number with no predecessor in the set."],

  // --- Intervals (4) ------------------------------------------------------
  [228, "summary-ranges", "Summary Ranges", "EASY", "intervals", "Close a range as soon as the next number breaks the run."],
  [56, "merge-intervals", "Merge Intervals", "MEDIUM", "intervals", "Sort by start, then extend or commit the active range."],
  [57, "insert-interval", "Insert Interval", "MEDIUM", "intervals", "Copy what ends before, absorb what overlaps, copy the rest."],
  [452, "minimum-number-of-arrows-to-burst-balloons", "Minimum Number of Arrows to Burst Balloons", "MEDIUM", "intervals", "Sort by end and shoot at each earliest end point."],

  // --- Stack (5) ----------------------------------------------------------
  [20, "valid-parentheses", "Valid Parentheses", "EASY", "stack", "Close each bracket against the most recent opener."],
  [71, "simplify-path", "Simplify Path", "MEDIUM", "stack", "Push directory names, pop on `..`, ignore `.` and blanks."],
  [155, "min-stack", "Min Stack", "MEDIUM", "stack", "Carry the running minimum alongside each pushed value."],
  [150, "evaluate-reverse-polish-notation", "Evaluate Reverse Polish Notation", "MEDIUM", "stack", "Push operands, pop two on an operator, push the result."],
  [224, "basic-calculator", "Basic Calculator", "HARD", "stack", "Stack the running total and sign when a parenthesis opens."],

  // --- Linked List (11) ---------------------------------------------------
  [141, "linked-list-cycle", "Linked List Cycle", "EASY", "linked-list", "Fast and slow pointers meet if and only if a cycle exists."],
  [2, "add-two-numbers", "Add Two Numbers", "MEDIUM", "linked-list", "Column addition from the ones place, carrying forward."],
  [21, "merge-two-sorted-lists", "Merge Two Sorted Lists", "EASY", "linked-list", "Splice the smaller head each round behind a dummy node."],
  [138, "copy-list-with-random-pointer", "Copy List with Random Pointer", "MEDIUM", "linked-list", "Interleave copies with originals, then split the two lists."],
  [92, "reverse-linked-list-ii", "Reverse Linked List II", "MEDIUM", "linked-list", "Reverse a sublist in place and re-stitch both boundaries."],
  [25, "reverse-nodes-in-k-group", "Reverse Nodes in k-Group", "HARD", "linked-list", "Reverse a full block of k, leaving any remainder untouched."],
  [19, "remove-nth-node-from-end-of-list", "Remove Nth Node From End of List", "MEDIUM", "linked-list", "Open an n-node gap, then walk both pointers to the end."],
  [82, "remove-duplicates-from-sorted-list-ii", "Remove Duplicates from Sorted List II", "MEDIUM", "linked-list", "Delete every node of a duplicated run, not just the extras."],
  [61, "rotate-list", "Rotate List", "MEDIUM", "linked-list", "Close the list into a ring, then break it at the new tail."],
  [86, "partition-list", "Partition List", "MEDIUM", "linked-list", "Build two chains and join them, preserving relative order."],
  [146, "lru-cache", "LRU Cache", "MEDIUM", "linked-list", "Hash map for lookup, doubly linked list for recency order."],

  // --- Binary Tree General (14) -------------------------------------------
  [104, "maximum-depth-of-binary-tree", "Maximum Depth of Binary Tree", "EASY", "binary-tree-general", "Depth is one plus the deeper of the two subtrees."],
  [100, "same-tree", "Same Tree", "EASY", "binary-tree-general", "Compare values and structure in lockstep, nulls included."],
  [226, "invert-binary-tree", "Invert Binary Tree", "EASY", "binary-tree-general", "Swap the children at every node on the way down."],
  [101, "symmetric-tree", "Symmetric Tree", "EASY", "binary-tree-general", "Mirror comparison — left against right, outside against inside."],
  [105, "construct-binary-tree-from-preorder-and-inorder-traversal", "Construct Binary Tree from Preorder and Inorder Traversal", "MEDIUM", "binary-tree-general", "Preorder gives the root; inorder gives the split point."],
  [106, "construct-binary-tree-from-inorder-and-postorder-traversal", "Construct Binary Tree from Inorder and Postorder Traversal", "MEDIUM", "binary-tree-general", "Postorder's last value is the root; build the right subtree first."],
  [117, "populating-next-right-pointers-in-each-node-ii", "Populating Next Right Pointers in Each Node II", "MEDIUM", "binary-tree-general", "Thread each level using the level above as a linked list."],
  [114, "flatten-binary-tree-to-linked-list", "Flatten Binary Tree to Linked List", "MEDIUM", "binary-tree-general", "Splice the left subtree between the node and its right child."],
  [112, "path-sum", "Path Sum", "EASY", "binary-tree-general", "Subtract as you descend and test the remainder at a leaf."],
  [129, "sum-root-to-leaf-numbers", "Sum Root to Leaf Numbers", "MEDIUM", "binary-tree-general", "Carry the running number down, accumulate at each leaf."],
  [124, "binary-tree-maximum-path-sum", "Binary Tree Maximum Path Sum", "HARD", "binary-tree-general", "Return the best single branch, record the best bent path."],
  [173, "binary-search-tree-iterator", "Binary Search Tree Iterator", "MEDIUM", "binary-tree-general", "A stack of left spines yields in-order values on demand."],
  [222, "count-complete-tree-nodes", "Count Complete Tree Nodes", "EASY", "binary-tree-general", "Compare left and right depths to count whole subtrees at once."],
  [236, "lowest-common-ancestor-of-a-binary-tree", "Lowest Common Ancestor of a Binary Tree", "MEDIUM", "binary-tree-general", "The split point where the targets fall into different subtrees."],

  // --- Binary Tree BFS (4) ------------------------------------------------
  [199, "binary-tree-right-side-view", "Binary Tree Right Side View", "MEDIUM", "binary-tree-bfs", "Take the last node of every level."],
  [637, "average-of-levels-in-binary-tree", "Average of Levels in Binary Tree", "EASY", "binary-tree-bfs", "Sum each level and divide by its snapshotted width."],
  [102, "binary-tree-level-order-traversal", "Binary Tree Level Order Traversal", "MEDIUM", "binary-tree-bfs", "Snapshot the queue size to fence each level."],
  [103, "binary-tree-zigzag-level-order-traversal", "Binary Tree Zigzag Level Order Traversal", "MEDIUM", "binary-tree-bfs", "Level order, reversing the collected row on alternate depths."],

  // --- Binary Search Tree (3) ---------------------------------------------
  [530, "minimum-absolute-difference-in-bst", "Minimum Absolute Difference in BST", "EASY", "binary-search-tree", "In-order visits values in sorted order — compare neighbours."],
  [230, "kth-smallest-element-in-a-bst", "Kth Smallest Element in a BST", "MEDIUM", "binary-search-tree", "In-order traversal, stopping at the kth value."],
  [98, "validate-binary-search-tree", "Validate Binary Search Tree", "MEDIUM", "binary-search-tree", "Carry an open min/max range down, not just a parent comparison."],

  // --- Graph General (6) --------------------------------------------------
  [200, "number-of-islands", "Number of Islands", "MEDIUM", "graph-general", "Each unvisited land cell starts an island; flood it to sink it."],
  [130, "surrounded-regions", "Surrounded Regions", "MEDIUM", "graph-general", "Mark regions reachable from the border, then flip the rest."],
  [133, "clone-graph", "Clone Graph", "MEDIUM", "graph-general", "Map original nodes to their copies to survive cycles."],
  [399, "evaluate-division", "Evaluate Division", "MEDIUM", "graph-general", "Ratios are weighted edges; a query is a path product."],
  [207, "course-schedule", "Course Schedule", "MEDIUM", "graph-general", "A cycle is the only thing that blocks a valid order."],
  [210, "course-schedule-ii", "Course Schedule II", "MEDIUM", "graph-general", "Kahn's algorithm, emitting the order it peels courses off in."],

  // --- Graph BFS (3) ------------------------------------------------------
  [909, "snakes-and-ladders", "Snakes and Ladders", "MEDIUM", "graph-bfs", "Board squares are nodes; a die roll is an edge of weight one."],
  [433, "minimum-genetic-mutation", "Minimum Genetic Mutation", "MEDIUM", "graph-bfs", "Shortest path over one-character mutations within the bank."],
  [127, "word-ladder", "Word Ladder", "HARD", "graph-bfs", "BFS over wildcard buckets instead of comparing every pair."],

  // --- Trie (3) -----------------------------------------------------------
  [208, "implement-trie-prefix-tree", "Implement Trie (Prefix Tree)", "MEDIUM", "trie", "Children per character, with a terminal flag for whole words."],
  [211, "design-add-and-search-words-data-structure", "Design Add and Search Words Data Structure", "MEDIUM", "trie", "A wildcard forks the search across every child."],
  [212, "word-search-ii", "Word Search II", "HARD", "trie", "Walk the board once, pruning against a trie of all the words."],

  // --- Backtracking (7) ---------------------------------------------------
  [17, "letter-combinations-of-a-phone-number", "Letter Combinations of a Phone Number", "MEDIUM", "backtracking", "Branch once per digit, one letter per level."],
  [77, "combinations", "Combinations", "MEDIUM", "backtracking", "Advance the start index so combinations never repeat."],
  [46, "permutations", "Permutations", "MEDIUM", "backtracking", "Swap or mark used, then undo the choice on the way back up."],
  [39, "combination-sum", "Combination Sum", "MEDIUM", "backtracking", "Reuse is allowed, so recurse on the same index."],
  [52, "n-queens-ii", "N-Queens II", "HARD", "backtracking", "Track occupied columns and both diagonals as you place rows."],
  [22, "generate-parentheses", "Generate Parentheses", "MEDIUM", "backtracking", "Open while you can, close only while it stays balanced."],
  [79, "word-search", "Word Search", "MEDIUM", "backtracking", "Mark the cell visited during recursion, restore it after."],

  // --- Divide & Conquer (4) -----------------------------------------------
  [108, "convert-sorted-array-to-binary-search-tree", "Convert Sorted Array to Binary Search Tree", "EASY", "divide-conquer", "The middle element balances each subtree."],
  [148, "sort-list", "Sort List", "MEDIUM", "divide-conquer", "Split at the middle with fast/slow, then merge sorted halves."],
  [427, "construct-quad-tree", "Construct Quad Tree", "MEDIUM", "divide-conquer", "Recurse into quadrants, collapsing uniform blocks into a leaf."],
  [23, "merge-k-sorted-lists", "Merge k Sorted Lists", "HARD", "divide-conquer", "Pair up and merge, or pull heads from a min-heap."],

  // --- Kadane's Algorithm (2) ---------------------------------------------
  [53, "maximum-subarray", "Maximum Subarray", "MEDIUM", "kadane", "Restart the run whenever the carried sum turns negative."],
  [918, "maximum-sum-circular-subarray", "Maximum Sum Circular Subarray", "MEDIUM", "kadane", "The wrapping case is the total minus the minimum subarray."],

  // --- Binary Search (7) --------------------------------------------------
  [35, "search-insert-position", "Search Insert Position", "EASY", "binary-search", "The lower bound is exactly where the value would be inserted."],
  [74, "search-a-2d-matrix", "Search a 2D Matrix", "MEDIUM", "binary-search", "Treat the grid as one sorted array via index arithmetic."],
  [162, "find-peak-element", "Find Peak Element", "MEDIUM", "binary-search", "Walk uphill — the rising side always contains a peak."],
  [33, "search-in-rotated-sorted-array", "Search in Rotated Sorted Array", "MEDIUM", "binary-search", "One half is always sorted; decide which, then test the range."],
  [34, "find-first-and-last-position-of-element-in-sorted-array", "Find First and Last Position of Element in Sorted Array", "MEDIUM", "binary-search", "Two boundary searches — leftmost and rightmost."],
  [153, "find-minimum-in-rotated-sorted-array", "Find Minimum in Rotated Sorted Array", "MEDIUM", "binary-search", "Compare against the right end to find the rotation point."],
  [4, "median-of-two-sorted-arrays", "Median of Two Sorted Arrays", "HARD", "binary-search", "Binary search the partition point of the shorter array."],

  // --- Heap (4) -----------------------------------------------------------
  [215, "kth-largest-element-in-an-array", "Kth Largest Element in an Array", "MEDIUM", "heap", "Keep a min-heap of size k, or quickselect the partition."],
  [502, "ipo", "IPO", "HARD", "heap", "Unlock affordable projects by capital, then take the best profit."],
  [373, "find-k-pairs-with-smallest-sums", "Find K Pairs with Smallest Sums", "MEDIUM", "heap", "Expand the frontier one neighbour at a time from a heap."],
  [295, "find-median-from-data-stream", "Find Median from Data Stream", "HARD", "heap", "Two heaps balanced around the middle of the stream."],

  // --- Bit Manipulation (6) -----------------------------------------------
  [67, "add-binary", "Add Binary", "EASY", "bit-manipulation", "Column addition from the right with a carry bit."],
  [190, "reverse-bits", "Reverse Bits", "EASY", "bit-manipulation", "Shift out of the source and into the accumulating result."],
  [191, "number-of-1-bits", "Number of 1 Bits", "EASY", "bit-manipulation", "n & (n-1) clears the lowest set bit each round."],
  [136, "single-number", "Single Number", "EASY", "bit-manipulation", "XOR cancels every pair, leaving the loner behind."],
  [137, "single-number-ii", "Single Number II", "MEDIUM", "bit-manipulation", "Count bits modulo three, or track two-state accumulators."],
  [201, "bitwise-and-of-numbers-range", "Bitwise AND of Numbers Range", "MEDIUM", "bit-manipulation", "The answer is the common binary prefix of the two bounds."],

  // --- Math (6) -----------------------------------------------------------
  [9, "palindrome-number", "Palindrome Number", "EASY", "math", "Reverse half the digits and compare — no string needed."],
  [66, "plus-one", "Plus One", "EASY", "math", "Propagate the carry from the last digit; grow only on all nines."],
  [172, "factorial-trailing-zeroes", "Factorial Trailing Zeroes", "MEDIUM", "math", "Count the factors of five, including higher powers."],
  [69, "sqrtx", "Sqrt(x)", "EASY", "math", "Binary search the integer whose square does not exceed x."],
  [50, "powx-n", "Pow(x, n)", "MEDIUM", "math", "Square the base and halve the exponent."],
  [149, "max-points-on-a-line", "Max Points on a Line", "HARD", "math", "Group by normalised slope from each anchor point."],

  // --- 1D DP (5) ----------------------------------------------------------
  [70, "climbing-stairs", "Climbing Stairs", "EASY", "dp-1d", "Ways to reach a step are the sum of the two steps before it."],
  [198, "house-robber", "House Robber", "MEDIUM", "dp-1d", "Take and skip one, or skip and keep the best so far."],
  [139, "word-break", "Word Break", "MEDIUM", "dp-1d", "A prefix is breakable if some split leaves a dictionary word."],
  [322, "coin-change", "Coin Change", "MEDIUM", "dp-1d", "Fewest coins for each amount, built from smaller amounts."],
  [300, "longest-increasing-subsequence", "Longest Increasing Subsequence", "MEDIUM", "dp-1d", "Patience sorting with binary search gives O(n log n)."],

  // --- Multidimensional DP (9) --------------------------------------------
  [120, "triangle", "Triangle", "MEDIUM", "dp-multi", "Fold from the bottom row upward, taking the cheaper child."],
  [64, "minimum-path-sum", "Minimum Path Sum", "MEDIUM", "dp-multi", "Each cell costs itself plus the cheaper of up and left."],
  [63, "unique-paths-ii", "Unique Paths II", "MEDIUM", "dp-multi", "Paths sum from above and left; obstacles contribute zero."],
  [5, "longest-palindromic-substring", "Longest Palindromic Substring", "MEDIUM", "dp-multi", "Expand around each of the 2n-1 possible centres."],
  [97, "interleaving-string", "Interleaving String", "MEDIUM", "dp-multi", "A grid over both prefixes; each cell consumes one character."],
  [72, "edit-distance", "Edit Distance", "MEDIUM", "dp-multi", "Insert, delete, or replace — cheapest neighbour plus one."],
  [123, "best-time-to-buy-and-sell-stock-iii", "Best Time to Buy and Sell Stock III", "HARD", "dp-multi", "Four running states track two complete transactions."],
  [188, "best-time-to-buy-and-sell-stock-iv", "Best Time to Buy and Sell Stock IV", "HARD", "dp-multi", "Generalise to k transactions with a buy/sell state per k."],
  [221, "maximal-square", "Maximal Square", "MEDIUM", "dp-multi", "A square's side is one plus the min of its three neighbours."],
];

/** Problems kept outside the study plan but already written up. */
const EXTRAS: Row[] = [
  [739, "daily-temperatures", "Daily Temperatures", "MEDIUM", "stack", "Monotonic stack — hold unresolved days until a warmer one arrives."],
  [213, "house-robber-ii", "House Robber II", "MEDIUM", "dp-1d", "1D DP on a circle — run the line twice and drop one end."],
  [704, "binary-search", "Binary Search", "EASY", "binary-search", "The canonical halving loop — get the bounds and the midpoint right."],
  [217, "contains-duplicate", "Contains Duplicate", "EASY", "hashmap", "A set answers it in one pass; the nested loop is the version to outgrow."],
  [37, "sudoku-solver", "Sudoku Solver", "HARD", "backtracking", "Place, recurse, and undo — the constraint check is the whole cost."],
  [78, "subsets", "Subsets", "MEDIUM", "backtracking", "Every element is an independent include-or-exclude decision."],
  [62, "unique-paths", "Unique Paths", "MEDIUM", "backtracking", "Right or down at every cell — the recursion that memoisation turns into DP."],
  [543, "diameter-of-binary-tree", "Diameter of Binary Tree", "EASY", "binary-tree-general", "Return height and diameter together, or you re-walk the tree at every node."],
  [572, "subtree-of-another-tree", "Subtree of Another Tree", "EASY", "binary-tree-general", "Find a candidate root, then test the whole shape from there."],
  [206, "reverse-linked-list", "Reverse Linked List", "EASY", "linked-list", "Three pointers walking forward, flipping each next as they go."],
  [234, "palindrome-linked-list", "Palindrome Linked List", "EASY", "linked-list", "Find the middle, reverse the back half, then walk both inward."],
  [240, "search-a-2d-matrix-ii", "Search a 2D Matrix II", "MEDIUM", "matrix", "Start at a corner where one move shrinks rows and the other shrinks columns."],
  [1572, "matrix-diagonal-sum", "Matrix Diagonal Sum", "EASY", "matrix", "Both diagonals in one pass, minus the double-counted centre."],
  [84, "largest-rectangle-in-histogram", "Largest Rectangle in Histogram", "HARD", "stack", "Each bar's width runs to the next smaller bar on either side."],
  [7, "reverse-integer", "Reverse Integer", "MEDIUM", "math", "Pull digits off the back — and detect the overflow before it happens."],
];

/**
 * Foundational array exercises.
 *
 * These are not interview questions from any list — they are the drills that
 * teach array mechanics, and they have no upstream LeetCode problem, hence the
 * null number and URL. They are kept in the catalog rather than a separate
 * store so that one seed, one validator and one set of screens cover
 * everything; the `EXTRA` collection and their own subtopic keep them from
 * being mistaken for study-plan problems.
 */
type FundamentalRow = [
  slug: string,
  title: string,
  difficulty: Difficulty,
  categorySlug: string,
  synopsis: string,
];

const FUNDAMENTALS: FundamentalRow[] = [
  ["array-linear-search", "Linear Search in an Array", "EASY", "array-fundamentals", "Walk every index until the key appears — the baseline every search improves on."],
  ["array-reverse-in-place", "Reverse an Array in Place", "EASY", "array-fundamentals", "Two pointers closing from the ends, swapping as they meet."],
  ["array-largest-and-smallest", "Find the Largest and Smallest Element", "EASY", "array-fundamentals", "One pass, two running extremes — and the right sentinel values."],
  ["array-print-all-pairs", "Print All Pairs in an Array", "EASY", "array-fundamentals", "Why the inner loop starts at i+1, and why that gives n(n-1)/2 pairs."],
  ["array-print-all-subarrays", "Print All Subarrays and Their Sums", "EASY", "array-fundamentals", "Every contiguous slice, and the prefix-sum trick that removes the third loop."],
  ["array-pass-by-reference", "Are Arrays Passed by Value or Reference in Java?", "EASY", "array-fundamentals", "The reference is copied, the array is not — so a method can mutate the caller's array."],
  ["backtracking-undo-step", "The Backtracking Undo Step, Isolated", "EASY", "backtracking", "Strip away the puzzle and watch what the undo line actually does to the array."],
  ["binary-tree-traversals", "Preorder, Inorder and Postorder Traversal", "EASY", "binary-tree-general", "One recursion, three orders — only the position of the visit line moves."],
  ["binary-tree-build-from-preorder", "Build a Binary Tree from a Preorder Array", "EASY", "binary-tree-general", "A shared index consumed in preorder, with -1 marking an absent child."],
  ["binary-tree-count-and-sum", "Count Nodes and Sum a Binary Tree", "EASY", "binary-tree-general", "The same post-order shape answers both — combine children, then add yourself."],
  ["binary-tree-top-view", "Top View of a Binary Tree", "MEDIUM", "binary-tree-general", "Horizontal distance plus BFS — the first node seen at each column wins."],

  // Bit manipulation drills
  ["bit-get-set-clear", "Get, Set and Clear the i-th Bit", "EASY", "bit-manipulation", "Three one-liners built from a single shifted mask."],
  ["bit-odd-or-even", "Check Odd or Even with Bitwise AND", "EASY", "bit-manipulation", "Only bit 0 decides parity, so one AND replaces the modulo."],

  // Sorting algorithms
  ["sort-bubble", "Bubble Sort", "EASY", "sorting", "Adjacent swaps bubble the extreme to the end on every pass."],
  ["sort-selection", "Selection Sort", "EASY", "sorting", "Scan for the extreme, swap it into place, shrink the unsorted region."],
  ["sort-insertion", "Insertion Sort", "EASY", "sorting", "Shift the sorted prefix right until the current value fits."],
  ["sort-counting", "Counting Sort", "EASY", "sorting", "Tally occurrences, then rebuild — O(n + k) without comparisons."],

  // Recursion drills
  ["recursion-factorial", "Factorial by Recursion", "EASY", "recursion", "The smallest possible recursion: one base case, one call."],
  ["recursion-fibonacci", "Fibonacci by Recursion", "EASY", "recursion", "Two calls per frame is what makes the naive version exponential."],
  ["recursion-sum-to-n", "Sum of the First n Numbers", "EASY", "recursion", "One call per frame — reusing the result is the difference between O(n) and O(2^n)."],
  ["recursion-print-inc-dec", "Print n to 1 and 1 to n", "EASY", "recursion", "The same recursion prints both orders; only the print position moves."],
  ["recursion-is-array-sorted", "Check if an Array is Sorted, Recursively", "EASY", "recursion", "Compare a pair, then delegate the rest to the next frame."],
  ["recursion-first-last-occurrence", "First and Last Occurrence of a Key", "EASY", "recursion", "Check before recursing for the first; recurse before checking for the last."],
  ["recursion-tiling-problem", "Tiling a 2 x n Board", "EASY", "recursion", "Place a vertical tile or two horizontal ones — the Fibonacci recurrence in disguise."],
  ["recursion-friends-pairing", "Friends Pairing Problem", "MEDIUM", "recursion", "Stay single or pair with one of the n-1 others."],
  ["sort-merge", "Merge Sort", "MEDIUM", "sorting", "Split to single elements, then merge sorted halves back together."],
  ["sort-quick", "Quick Sort", "MEDIUM", "sorting", "Partition around a pivot, then sort the two sides independently."],
  ["string-is-palindrome", "Check if a String is a Palindrome", "EASY", "array-string", "Two indices closing inward — and every pair must match, not just one."],

  // Stack drills
  ["stack-stock-span", "Stock Span Problem", "MEDIUM", "stack", "How many consecutive days back had a price no higher than today."],
  ["stack-next-greater-element", "Next Greater Element to the Right", "MEDIUM", "stack", "Scan right to left, popping everything the current bar dwarfs."],
  ["stack-duplicate-parentheses", "Detect Duplicate Parentheses", "MEDIUM", "stack", "A closing bracket with nothing between it and its opener is redundant."],
  ["stack-reverse-string", "Reverse a String Using a Stack", "EASY", "stack", "Push every character, pop them all — LIFO is the reversal."],
  ["stack-implement-array", "Implement a Stack Using an Array", "EASY", "stack", "Push and pop at the tail so both stay O(1)."],
  ["stack-implement-linked-list", "Implement a Stack Using a Linked List", "EASY", "stack", "Insert and remove at the head — the tail is unreachable in O(1)."],
  ["stack-push-at-bottom", "Push an Element to the Bottom of a Stack", "MEDIUM", "stack", "Unwind the whole stack on the call stack, then rebuild it."],
  ["stack-reverse-recursive", "Reverse a Stack Recursively", "MEDIUM", "stack", "Pop everything, then re-insert each element at the bottom."],

  // Queue drills
  ["queue-implement-array", "Implement a Queue Using an Array", "EASY", "queue", "Add at the rear; the naive removal shifts everything, which a circular buffer fixes."],
  ["queue-implement-linked-list", "Implement a Queue Using a Linked List", "EASY", "queue", "Head and tail pointers give O(1) at both ends."],
  ["queue-using-two-stacks", "Implement a Queue Using Two Stacks", "MEDIUM", "queue", "Two LIFOs compose into a FIFO — the question is which operation pays."],

  // Linked list drills
  ["linked-list-zig-zag", "Zig-Zag a Linked List", "MEDIUM", "linked-list", "Split, reverse the back half, then weave the two together."],
  ["linked-list-remove-cycle", "Detect and Remove a Cycle", "MEDIUM", "linked-list", "Meet inside the loop, then walk from the head to find its entry point."],
  ["linked-list-implement-singly", "Implement a Singly Linked List", "EASY", "linked-list", "Add, remove and search at both ends, plus the tail pointer that keeps addLast O(1)."],
  ["linked-list-implement-doubly", "Implement a Doubly Linked List", "EASY", "linked-list", "Two pointers per node buy O(1) removal from the tail."],

  // String drills
  ["string-run-length-compression", "Run-Length String Compression", "EASY", "array-string", "Collapse runs to a character plus its count."],
  ["string-largest-lexicographic", "Find the Lexicographically Largest String", "EASY", "array-string", "compareTo, not the > operator — and never == for equality."],
  ["string-count-vowels", "Count the Vowels in a String", "EASY", "array-string", "One pass with a membership test, and a decision about case."],
  ["string-shortest-path-displacement", "Shortest Path from a Direction String", "EASY", "array-string", "Only net displacement matters, so the route collapses to two counters."],
  ["string-iterate-characters", "Iterate a String Character by Character", "EASY", "array-string", "charAt in a loop — and why concatenating in one is a trap."],

  // Matrix drills
  ["matrix-transpose", "Transpose a Matrix", "EASY", "matrix", "Swap the loop order to read columns as rows."],
  ["matrix-min-max-and-search", "Largest, Smallest and Linear Search in a Matrix", "EASY", "matrix", "Nested traversal with running extremes and an early return."],
  ["matrix-count-and-row-sum", "Count a Value and Sum a Row in a Matrix", "EASY", "matrix", "The two smallest matrix traversals, and the row-length pitfall in both."],

  // Number drills worth keeping from JavaBasics
  ["math-is-prime", "Check if a Number is Prime", "EASY", "math", "Trial division to the square root — and the guard that 1 is not prime."],
  ["math-sum-of-digits", "Sum the Digits of a Number", "EASY", "math", "Peel the last digit with % 10, drop it with / 10."],
  ["math-binary-to-decimal", "Convert Binary to Decimal", "EASY", "math", "Each digit weighted by its power of two."],
  ["math-decimal-to-binary", "Convert Decimal to Binary", "EASY", "math", "Repeated division by two, read the remainders backwards."],
  ["math-binomial-coefficient", "Binomial Coefficient nCr", "EASY", "math", "Multiply and divide as you go — factorials overflow long before nCr does."],
  ["math-leap-year", "Check for a Leap Year", "EASY", "math", "Divisible by 4, except centuries, except every 400 years."],
];

const toProblem = (row: Row, index: number, collection: Collection): Problem => {
  const [number, slug, title, difficulty, categorySlug, synopsis] = row;
  return {
    slug,
    number,
    title,
    difficulty,
    categorySlug,
    patternSlugs: CATEGORY_PATTERNS[categorySlug] ?? [],
    synopsis,
    leetcodeUrl: `https://leetcode.com/problems/${slug}/`,
    languages: ["JAVA", "PYTHON"],
    collection,
    order: index + 1,
  };
};

/** The 150 study plan problems, in plan order. */
export const topInterview150: Problem[] = TOP_150.map((row, index) =>
  toProblem(row, index, "TOP_150"),
);

/** Extra problems outside the plan. */
export const extraProblems: Problem[] = EXTRAS.map((row, index) =>
  toProblem(row, TOP_150.length + index, "EXTRA"),
);

const toFundamental = (row: FundamentalRow, index: number): Problem => {
  const [slug, title, difficulty, categorySlug, synopsis] = row;
  return {
    slug,
    number: null,
    title,
    difficulty,
    categorySlug,
    patternSlugs: CATEGORY_PATTERNS[categorySlug] ?? [],
    synopsis,
    leetcodeUrl: null,
    languages: ["JAVA", "PYTHON"],
    collection: "EXTRA",
    order: TOP_150.length + EXTRAS.length + index + 1,
  };
};

/** Foundational drills, outside any interview list. */
export const fundamentalProblems: Problem[] = FUNDAMENTALS.map(toFundamental);

export const catalog: Problem[] = [
  ...topInterview150,
  ...extraProblems,
  ...fundamentalProblems,
];
