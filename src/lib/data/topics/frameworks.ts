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

  /* ==========================================================================
     Node.js & Express.js
     ========================================================================== */
  {
    topicSlug: "nodejs",
    slug: "nodejs-event-loop-libuv-architecture",
    title: "How does Node.js handle concurrency (Non-Blocking I/O & Libuv)?",
    difficulty: "HARD",
    subtopic: "Node.js Core",
    synopsis: "Single-threaded event loop, Libuv C++ worker pool, non-blocking asynchronous I/O.",
    shortAnswer:
      "Node.js runs single-threaded JavaScript code on the V8 engine, but delegates heavy I/O operations (file system, network, crypto) to Libuv. Libuv uses OS kernel primitives (epoll/kqueue) or a background C++ thread pool (default 4 threads) to perform non-blocking I/O without blocking the main event loop.",
    detailedExplanation: [
      "**Single Thread vs Worker Pool.** JS user code runs on 1 main thread. Async tasks (file I/O `fs`, DNS lookups, crypto `pbkdf2`, compression `zlib`) run asynchronously on the Libuv thread pool (`UV_THREADPOOL_SIZE`).",
      "**Libuv Event Loop Phases.** 1. Timers (`setTimeout`). 2. Pending Callbacks (I/O errors). 3. Poll (retrieves new I/O events). 4. Check (`setImmediate`). 5. Close Callbacks (`socket.on('close')`).",
      "**Streams & Buffers.** Node processes large data in chunks via Streams (Readable, Writable, Transform) without loading full files into memory.",
    ],
    example: {
      language: "JAVA",
      code: `// Non-blocking file reading using Streams:
// const fs = require('fs');
// const readStream = fs.createReadStream('./huge_log.txt', { highWaterMark: 64 * 1024 });
// readStream.on('data', (chunk) => {
//     console.log(\`Received \${chunk.length} bytes\`);
// });`,
    },
    interviewTip:
      "If asked how to handle CPU-heavy operations (e.g. video processing, image resizing) in Node.js, do NOT run them directly on the main event loop. Recommend `Worker Threads` (`worker_threads` module) or child processes.",
    commonTrap:
      "Executing CPU-intensive synchronous loops on the main thread, which blocks all concurrent incoming HTTP requests.",
    followUpQuestions: [
      "How do Worker Threads differ from Child Processes (cluster module) in Node.js?",
      "What happens when the Libuv thread pool size is exhausted under heavy file I/O load?",
    ],
    relatedTopics: ["Node.js", "Event Loop", "Libuv", "Streams"],
    tags: ["Node.js", "Libuv", "Event Loop", "Backend Architecture"],
  },
  {
    topicSlug: "express",
    slug: "express-middleware-error-handling-pipeline",
    title: "How does the Express.js Middleware Pipeline & Error Handling work?",
    difficulty: "EASY",
    subtopic: "Express.js Framework",
    synopsis: "Sequential (req, res, next) pipeline execution, custom middleware, and 4-argument error handlers.",
    shortAnswer:
      "Express.js processes incoming HTTP requests through a chain of Middleware functions `(req, res, next)`. Each middleware can inspect/modify the request, send a response, or pass control to the next middleware via `next()`. Error handling middleware takes 4 arguments `(err, req, res, next)` and catches uncaught pipeline errors.",
    detailedExplanation: [
      "**Middleware Mechanics.** Functions executed sequentially in order of registration (`app.use()`).",
      "**Types of Middleware.** 1. Application-level (`app.use()`). 2. Router-level (`router.use()`). 3. Built-in (`express.json()`, `express.static()`). 4. Third-party (`cors`, `helmet`, `morgan`). 5. Error-handling.",
      "**Error Handling Pipeline.** Calling `next(err)` skips all remaining standard middleware and jumps straight to the next registered 4-argument error middleware.",
    ],
    example: {
      language: "JAVA",
      code: `// Express Middleware Pipeline & Error Handler Example:
// const app = express();
// app.use(express.json()); // Built-in parsing middleware

// Custom Auth Middleware
// function authenticate(req, res, next) {
//     if (!req.headers.authorization) return next(new Error('Unauthorized'));
//     next();
// }

// Global Error Handler (4 Arguments)
// app.use((err, req, res, next) => {
//     res.status(err.status || 500).json({ error: err.message });
// });`,
    },
    interviewTip:
      "Highlight security best practices in Express.js: always use `helmet` for security headers, `express-rate-limit` against DDoS/brute-force, and validate inputs via `joi` or `zod` before routing.",
    commonTrap:
      "Forgetting to call `next()` or `res.send()` inside a middleware, leaving the HTTP client hanging indefinitely until request timeout.",
    followUpQuestions: [
      "How do async/await errors behave in Express 4 vs Express 5?",
      "What is CORS and how does Express handle preflight OPTIONS requests?",
    ],
    relatedTopics: ["Express.js", "Node.js", "REST APIs", "Middleware"],
    tags: ["Express.js", "Node.js", "Middleware", "REST APIs", "Backend"],
  },
];

