import type { ConceptualQuestion } from "../conceptual";

export const frameworksQuestions: ConceptualQuestion[] = [
  /* ==========================================================================
     React
     ========================================================================== */
  {
    topicSlug: "react",
    slug: "react-virtual-dom-fiber-reconciler",
    title: "How does the React Virtual DOM & Fiber Reconciler work?",
    difficulty: "HARD",
    subtopic: "React Architecture",
    synopsis: "In-memory UI trees, diffing algorithm, Fiber node work units, and concurrent rendering.",
    shortAnswer:
      "The Virtual DOM is a lightweight in-memory representation of real DOM nodes. The Fiber Reconciler breaks reconciliation work into incremental units (Fiber nodes), enabling React to pause, reuse, or prioritize rendering work (Concurrent React) before committing batch updates to the real DOM.",
    detailedExplanation: [
      "**Virtual DOM.** React creates a JS object tree representing current UI. On state change, it creates a new Virtual DOM tree.",
      "**Diffing Algorithm (Heuristic O(N)).** Compares old vs new tree: 1. Different element types recreate the whole subtree. 2. `key` props identify stable elements across list reorders to avoid destruction.",
      "**Fiber Architecture.** Replaced the synchronous stack reconciler in React 16. Each component is a Fiber node unit of work. Allows splitting render work into chunks, yielding to browser main thread for user input/animations.",
      "**Render vs Commit Phase.** Render Phase (asynchronous, interruptible: builds Fiber tree, computes diffs) ➔ Commit Phase (synchronous: applies changes to real DOM).",
    ],
    example: {
      language: "JAVA",
      code: `// Re-render Optimization Example:
// Bad: Array index as key causes unnecessary re-creations during list shifts
// {items.map((item, index) => <TodoItem key={index} data={item} />)}

// Good: Unique stable ID preserves Fiber state and DOM nodes
// {items.map(item => <TodoItem key={item.id} data={item} />)}`,
    },
    interviewTip:
      "Explain why using array index as `key` breaks component state in dynamic/sorted lists: React uses `key` to match Fibers between renders. Index keys cause React to re-use Fiber nodes for wrong data.",
    commonTrap:
      "Thinking Virtual DOM is faster than real DOM operations for every case. VDOM adds memory and diffing overhead, but enables declarative UI and optimized batching.",
    followUpQuestions: [
      "What is the difference between React Server Components (RSC) and Client Components?",
      "How does automatic batching work in React 18?",
    ],
    relatedTopics: ["React", "Virtual DOM", "Fiber", "Reconciliation"],
    tags: ["React", "Virtual DOM", "Fiber", "Reconciliation", "Frontend Architecture"],
  },
  {
    topicSlug: "react",
    slug: "react-hooks-useeffect-lifecycle-memoization",
    title: "React Hooks: useEffect Lifecycle, useCallback & useMemo Optimization",
    difficulty: "MEDIUM",
    subtopic: "React Component Logic",
    synopsis: "Declarative synchronization, dependency array rules, cleanup functions, and memoization.",
    shortAnswer:
      "`useEffect` synchronizes components with external systems. Dependency arrays control execution timing: empty `[]` runs once on mount, omitting array runs after every render, and `[deps]` runs when deps change. `useMemo` caches computed values; `useCallback` caches function references to prevent unnecessary child re-renders.",
    detailedExplanation: [
      "**useEffect Lifecycle.** Replaces `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`. Returned cleanup function runs before effect re-execution and unmount.",
      "**Dependency Array Golden Rule.** Every reactive variable (props, state, internal functions) used inside `useEffect` MUST be declared in the dependency array to avoid stale closures.",
      "**useMemo.** `const cachedValue = useMemo(() => computeExpensive(a, b), [a, b]);` Caches heavy calculations.",
      "**useCallback.** `const memoizedFn = useCallback(() => handleClick(id), [id]);` Preserves function reference identity across renders, useful when passing callbacks to `React.memo` child components.",
    ],
    example: {
      language: "JAVA",
      code: `// Cleanup & Synchronization Example:
// useEffect(() => {
//     const socket = connectWebSocket(url);
//     socket.on('message', handleMessage);
//     return () => socket.disconnect(); // Cleanup function on unmount/dep change
// }, [url]);`,
    },
    interviewTip:
      "Over-using `useCallback` and `useMemo` everywhere adds memory overhead. Explain that you only memoize when: 1. Passing functions to `React.memo` components. 2. Heavy expensive loops (> 1000 items). 3. Function is a dependency of another effect.",
    commonTrap:
      "Mutating state directly (`state.count = 5`) instead of using setter functions (`setState`), which skips React's re-render cycle.",
    followUpQuestions: [
      "Why should you never call Hooks inside loops, conditions, or nested functions?",
      "What is stale closure in React custom hooks and how do you fix it?",
    ],
    relatedTopics: ["React", "Hooks", "useEffect", "useCallback", "useMemo"],
    tags: ["React", "Hooks", "Performance", "State Management"],
  },

];


