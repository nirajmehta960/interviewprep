import type { ConceptualQuestion } from "../conceptual";

export const nodeQuestions: ConceptualQuestion[] = [
  {
    topicSlug: "nodejs",
    slug: "nodejs-event-loop-libuv-architecture",
    title: "How does the Node.js Event Loop & Libuv C++ Thread Pool handle concurrency?",
    difficulty: "HARD",
    subtopic: "Core Architecture",
    synopsis: "Single-threaded V8 execution model backed by Libuv event loop and thread pool for non-blocking I/O.",
    shortAnswer:
      "Node.js runs user JavaScript on a single thread inside V8, but offloads asynchronous I/O operations (file system, DNS, crypto) to Libuv. Libuv delegates network events to OS kernel primitives (epoll, kqueue) and CPU/disk operations to a background C++ thread pool (default 4 threads), emitting callback events back to the event loop phases without blocking execution.",
    detailedExplanation: [
      "**Single-Threaded Model:** JavaScript executes on one main thread. Async non-blocking operations allow thousands of concurrent requests to be queued without thread-per-request overhead.",
      "**Libuv C++ Library:** Provides the cross-platform event loop and asynchronous thread pool (`UV_THREADPOOL_SIZE`, default 4, expandable up to 1024). Tasks offloaded to the pool include file I/O (`fs`), crypto (`pbkdf2`, `randomBytes`), DNS lookups (`dns.lookup`), and zlib compression.",
      "**Event Loop Phases (Executed sequentially in a loop):**",
      "  1. **Timers Phase:** Executes callbacks scheduled by `setTimeout()` and `setInterval()`.",
      "  2. **Pending Callbacks:** Executes deferred I/O callbacks (e.g., TCP errors).",
      "  3. **Idle, Prepare:** Internal Libuv house-keeping.",
      "  4. **Poll Phase:** Retrieves new I/O events and executes I/O related callbacks (most user code).",
      "  5. **Check Phase:** Executes callbacks scheduled by `setImmediate()`.",
      "  6. **Close Callbacks:** Executes socket/handle close events (e.g., `socket.on('close')`).",
      "**Microtasks vs Macrotasks:** `process.nextTick()` and Promise microtasks run immediately between phase transitions, taking priority over macrotasks like `setImmediate()` and `setTimeout()`.",
    ],
    interviewTip:
      "Always clarify that Node.js is NOT multi-threaded for JS code, but relies on C++ multi-threading via Libuv under the hood. If asked how to scale CPU-bound tasks, recommend `Worker Threads` or `Cluster` module.",
    commonTrap:
      "Confusing `process.nextTick()` with `setImmediate()`. `process.nextTick()` executes immediately after the current operation finishes (before the event loop continues), while `setImmediate()` runs in the Check phase of the loop.",
    followUpQuestions: [
      "What happens if `process.nextTick()` is called recursively?",
      "How do you increase the Libuv thread pool size in production?",
    ],
    relatedTopics: ["Libuv", "Event Loop", "V8 Engine", "Asynchronous I/O"],
    tags: ["Node.js", "Event Loop", "Libuv", "Architecture", "Non-blocking"],
  },
  {
    topicSlug: "nodejs",
    slug: "nodejs-streams-buffers-backpressure",
    title: "What are Streams and Buffers in Node.js, and how do you handle Backpressure?",
    difficulty: "HARD",
    subtopic: "Data Processing",
    synopsis: "Chunk-by-chunk binary data processing with memory-efficient stream piping and backpressure control.",
    shortAnswer:
      "Buffers represent fixed-length raw memory allocations outside the V8 heap. Streams allow reading or writing data in sequential chunks rather than loading entire files into memory. Backpressure occurs when data is read faster than a writable stream can consume it; Node handles this by pausing the readable stream (`stream.pause()`) when `write()` returns `false`, resuming (`stream.resume()`) once the `drain` event fires.",
    detailedExplanation: [
      "**Buffer Class:** Allocates raw binary memory outside the V8 heap (`Buffer.from()`, `Buffer.alloc()`). Used for binary data manipulation, image encoding, and network sockets.",
      "**Types of Streams:**",
      "  1. **Readable:** Data source (e.g., `fs.createReadStream()`, `http.IncomingMessage`).",
      "  2. **Writable:** Data destination (e.g., `fs.createWriteStream()`, `http.ServerResponse`).",
      "  3. **Duplex:** Both Readable and Writable (e.g., `net.Socket`).",
      "  4. **Transform:** Duplex stream where output is computed from input (e.g., `zlib.createGzip()`).",
      "**High Water Mark:** Internal buffer size threshold (default 64KB for file streams, 16KB for normal streams).",
      "**Backpressure Management:** If `writable.write(chunk)` returns `false`, the internal buffer is full. `pipeline()` or `.pipe()` automatically manages pausing and resuming streams to prevent memory bloat and application crashes.",
    ],
    interviewTip:
      "Emphasize using `pipeline` from `stream/promises` over legacy `.pipe()`, as `pipeline` handles error cleanup across all chained streams automatically.",
    commonTrap:
      "Using `fs.readFile()` on multi-gigabyte log files, causing out-of-memory (OOM) crashes. Use `fs.createReadStream()` instead.",
    followUpQuestions: [
      "What is the difference between `Buffer.alloc()` and `Buffer.allocUnsafe()`?",
      "How does `pipeline` from `stream/promises` handle stream errors?",
    ],
    relatedTopics: ["Streams", "Buffers", "Backpressure", "Memory Optimization"],
    tags: ["Node.js", "Streams", "Buffers", "I/O", "Performance"],
  },
  {
    topicSlug: "nodejs",
    slug: "nodejs-commonjs-vs-es-modules",
    title: "What is the difference between CommonJS (CJS) and ES Modules (ESM) in Node.js?",
    difficulty: "MEDIUM",
    subtopic: "Module System",
    synopsis: "Synchronous runtime loading (CJS) versus static asynchronous module resolution (ESM).",
    shortAnswer:
      "CommonJS (`require`/`module.exports`) is Node's legacy module system where modules are loaded synchronously at runtime. ES Modules (`import`/`export`) is the ECMAScript standard where module resolution is static and asynchronous, allowing tree-shaking and top-level await. ESM modules run in strict mode by default.",
    detailedExplanation: [
      "**CommonJS (CJS):** Uses `require('module')` and `module.exports = {}`. Loading happens dynamically at runtime, allowing conditional requires inside functions or `if` statements.",
      "**ES Modules (ESM):** Uses `import` and `export`. Module dependency tree is parsed statically before code execution begins.",
      "**Interoperability & Nuances:**",
      "  - CJS can import ESM asynchronously via dynamic `import()`, but cannot use `require()` for ESM files.",
      "  - ESM does not have built-in `__dirname` or `__filename`; developers derive them via `import.meta.url` and `fileURLToPath`.",
      "  - ESM supports **Top-Level Await**, allowing async data loading before module exports are evaluated.",
    ],
    interviewTip:
      "Explain how to enable ESM in Node.js: add `\"type\": \"module\"` to `package.json`, or use the `.mjs` file extension.",
    commonTrap:
      "Trying to use `require()` inside an ES module file (`.mjs`), which throws a `ReferenceError: require is not defined`.",
    followUpQuestions: [
      "How do circular dependencies behave differently in CJS versus ESM?",
      "How do you recreate `__dirname` in an ES Module in Node.js?",
    ],
    relatedTopics: ["CommonJS", "ES Modules", "Module Resolution", "Node.js Environment"],
    tags: ["Node.js", "Modules", "CJS", "ESM", "JavaScript"],
  },
  {
    topicSlug: "nodejs",
    slug: "nodejs-event-emitter-pattern",
    title: "How does the EventEmitter pattern work in Node.js, and how do you prevent memory leaks?",
    difficulty: "MEDIUM",
    subtopic: "Core Concepts",
    synopsis: "Observer design pattern providing publish-subscribe event handling across Node core modules.",
    shortAnswer:
      "The `EventEmitter` class in the `events` module enables objects to emit named events that trigger registered listener functions synchronously. Many core Node modules (`http.Server`, `fs.ReadStream`) inherit from `EventEmitter`. Memory leaks occur when listeners are registered repeatedly without removal; Node warns when listeners exceed `defaultMaxListeners` (10).",
    detailedExplanation: [
      "**Core Methods:**",
      "  - `emitter.on(event, listener)`: Registers a persistent callback function for an event.",
      "  - `emitter.once(event, listener)`: Registers a single-use listener that automatically deregisters after firing.",
      "  - `emitter.emit(event, ...args)`: Synchronously calls each listener registered for the event name.",
      "  - `emitter.removeListener(event, listener)` / `off()`: Deregisters a listener callback.",
      "**Error Handling:** Emitting an `'error'` event without a registered listener causes Node to print a stack trace and crash the process.",
      "**Memory Leak Prevention:** Long-lived event emitters (e.g., global singletons or HTTP servers) hold reference callbacks in memory. Always clean up listeners with `emitter.off()` or use `AbortSignal` with `events.on()`.",
    ],
    interviewTip:
      "Mention that listeners are called synchronously in the order they were registered. If async processing is needed inside a listener, wrap handler logic in setImmediate or async functions.",
    commonTrap:
      "Adding event listeners inside HTTP request handlers without removing them, causing memory usage to climb continuously per request.",
    followUpQuestions: [
      "What happens when an EventEmitter emits an 'error' event and no listener exists?",
      "How does `events.once()` with `AbortSignal` work in modern Node.js?",
    ],
    relatedTopics: ["EventEmitter", "Observer Pattern", "Memory Leaks", "Event-Driven"],
    tags: ["Node.js", "EventEmitter", "Design Patterns", "Events"],
  },
  {
    topicSlug: "nodejs",
    slug: "nodejs-worker-threads-vs-cluster-child-process",
    title: "How do Worker Threads differ from Cluster Module and Child Processes in Node.js?",
    difficulty: "HARD",
    subtopic: "Concurrency & Scaling",
    synopsis: "Comparing shared-memory threads, multi-process clustering, and spawned child processes for CPU scaling.",
    shortAnswer:
      "Child Processes (`child_process`) spawn completely independent OS processes with isolated memory. The Cluster module builds on `child_process` to fork multiple Node workers sharing a single server port via master round-robin load balancing. Worker Threads (`worker_threads`) run multiple threads within a single process, sharing memory (`ArrayBuffer`/`SharedArrayBuffer`) for CPU-heavy tasks without IPC serialization overhead.",
    detailedExplanation: [
      "**Child Process (`spawn`, `exec`, `fork`):**",
      "  - `exec`: Spawns a shell, buffers output (maxBuffer limit 1MB).",
      "  - `spawn`: Streams data via stdout/stderr, suitable for long-running CLI tools.",
      "  - `fork`: Spawns a new V8 Node process with built-in IPC channel (`process.send()`).",
      "**Cluster Module:** Scales Node.js HTTP servers across multiple CPU cores. The master process accepts incoming TCP connections and distributes them to worker processes using Round-Robin (except on Windows).",
      "**Worker Threads (`worker_threads`):** Ideal for CPU-intensive calculations (encryption, image manipulation, AI inference). Threads share memory via `SharedArrayBuffer` and transfer ownership of `ArrayBuffer` objects without copying bytes.",
    ],
    interviewTip:
      "Use Cluster / PM2 for horizontal scaling of I/O bound web servers across CPU cores. Use Worker Threads for CPU-bound computations within a single application process.",
    commonTrap:
      "Using Worker Threads for I/O operations thinking it will increase speed; Node's native event loop already handles async I/O efficiently.",
    followUpQuestions: [
      "What is `SharedArrayBuffer` and how do `Atomics` prevent race conditions in Worker Threads?",
      "How does PM2 utilize Node's cluster module under the hood?",
    ],
    relatedTopics: ["Worker Threads", "Cluster Module", "Child Process", "Multithreading"],
    tags: ["Node.js", "Multithreading", "Cluster", "Worker Threads", "Scaling"],
  },
  {
    topicSlug: "nodejs",
    slug: "nodejs-async-flow-promises-async-await",
    title: "How do Callbacks, Promises, and Async/Await differ, and how does Error-First Callback pattern work?",
    difficulty: "EASY",
    subtopic: "Asynchronous Programming",
    synopsis: "Evolution of asynchronous control flow from error-first callbacks to Promises and clean async/await syntax.",
    shortAnswer:
      "Error-first callbacks pass an `error` object as the first argument `(err, result)` to ensure errors are handled before processing data. Promises encapsulate future asynchronous values with `.then()` and `.catch()`. `async/await` is syntactic sugar over Promises that allows writing asynchronous code sequentially using standard `try/catch` error handling.",
    detailedExplanation: [
      "**Error-First Callbacks:** Standard legacy Node convention: `fs.readFile(path, (err, data) => { if (err) return handle(err); use(data); });`.",
      "**Callback Hell & Pyramids of Doom:** Deeply nested callbacks make code unreadable, hard to trace, and prone to unhandled errors.",
      "**Promises:** State machine transition (`pending` ➔ `fulfilled` or `rejected`). Enables chaining and combinators:",
      "  - `Promise.all()`: Fails fast if any promise rejects.",
      "  - `Promise.allSettled()`: Waits for all promises to settle regardless of rejection.",
      "  - `Promise.race()`: Resolves/rejects as soon as the first promise settles.",
      "**Promisification:** Converting callback APIs into Promise-returning functions using `util.promisify()` or `fs.promises`.",
    ],
    interviewTip:
      "Highlight `Promise.allSettled()` when querying multiple external APIs where individual failures should not halt the entire batch execution.",
    commonTrap:
      "Forgetting `await` on a Promise-returning function inside an async function, causing it to return a pending Promise instead of the unwrapped data value.",
    followUpQuestions: [
      "What is unhandled rejection in Promises and how do you monitor it globally in Node.js?",
      "How does `util.promisify` convert standard error-first callback functions under the hood?",
    ],
    relatedTopics: ["Async/Await", "Promises", "Callbacks", "Control Flow"],
    tags: ["Node.js", "Async", "Promises", "Control Flow", "JavaScript"],
  },
  {
    topicSlug: "nodejs",
    slug: "nodejs-memory-management-v8-garbage-collection",
    title: "How does Memory Management and V8 Garbage Collection work in Node.js?",
    difficulty: "HARD",
    subtopic: "Performance & Memory",
    synopsis: "Generational V8 garbage collection (Scavenge vs Mark-Sweep) and memory leak diagnostic techniques.",
    shortAnswer:
      "V8 splits memory into Stack (primitive types, execution context) and Heap (objects, closures). The Heap is divided into New Space (Young Generation) and Old Space. Small/short-lived objects are collected quickly by the Scavenger algorithm (Cheney's copying), while long-lived objects are promoted to Old Space and cleaned up via Mark-Sweep and Mark-Compact algorithms. Memory leaks occur when unreachable objects remain referenced.",
    detailedExplanation: [
      "**V8 Heap Memory Spaces:**",
      "  - **New Space (Young Generation):** Holds short-lived allocations (1MB–8MB). Scavenge GC runs frequently and fast.",
      "  - **Old Space (Old Generation):** Holds objects that survived two Scavenge cycles. Collected via Mark-Sweep-Compact.",
      "  - **Large Object Space:** Objects exceeding memory allocation limits.",
      "**Common Causes of Node.js Memory Leaks:**",
      "  1. Global variables (`global.cache = {}`).",
      "  2. Uncleared `setInterval()` or `setTimeout()` timers holding object references in closures.",
      "  3. Unbounded cache objects without eviction strategies (LRU).",
      "  4. Dangling EventEmitter listeners.",
      "**Diagnostics:** Inspect heap usage via `process.memoryUsage()` (`heapUsed`, `heapTotal`, `rss`, `external`). Capture heap snapshots using Chrome DevTools or `v8.writeHeapSnapshot()`.",
    ],
    interviewTip:
      "If asked how to debug a production memory leak: take two heap snapshots at different times under load, compare diffs in Chrome DevTools to locate accumulating constructor objects.",
    commonTrap:
      "Assuming setting a local variable to `null` forces immediate garbage collection. Garbage collection is non-deterministic and triggered by V8 memory pressure heuristics.",
    followUpQuestions: [
      "What is `RSS` (Resident Set Size) and how does it differ from V8 Heap Used?",
      "How do `WeakMap` and `WeakSet` assist in avoiding memory leaks?",
    ],
    relatedTopics: ["V8 Engine", "Garbage Collection", "Memory Leaks", "Profiling"],
    tags: ["Node.js", "Memory", "V8", "Garbage Collection", "Performance"],
  },
  {
    topicSlug: "nodejs",
    slug: "nodejs-file-system-fs-async-operations",
    title: "How does Node.js File System (fs) module perform non-blocking asynchronous I/O?",
    difficulty: "EASY",
    subtopic: "Core APIs",
    synopsis: "Asynchronous file I/O operations using callbacks, promises, streams, and file descriptors.",
    shortAnswer:
      "The `fs` module provides synchronous, callback-based, and promise-based APIs (`fs/promises`) for file manipulation. Asynchronous operations delegate disk access to Libuv thread pool threads, preventing file system latency from blocking the V8 main thread. Files are accessed via File Descriptors (numeric handles maintained by OS kernel).",
    detailedExplanation: [
      "**API Flavors:**",
      "  - **Synchronous (`fs.readFileSync`):** Blocks main event loop thread; avoid in web request routes.",
      "  - **Callback (`fs.readFile`):** Non-blocking error-first callback.",
      "  - **Promise-Based (`fs.promises.readFile` or `require('fs/promises')`):** Supports `async/await` cleanly.",
      "  - **Streams (`fs.createReadStream`):** Reads file in chunks via file descriptor without loading entire file into RAM.",
      "**Path Resolution:** Always combine `path.join()` or `path.resolve()` with `__dirname` to avoid relative path lookup bugs across operating systems.",
      "**File Permissions:** `fs.chmod()`, `fs.chown()`, and `fs.stat()` query metadata like inode numbers, file size, and timestamps.",
    ],
    interviewTip:
      "Emphasize never using synchronous file methods (`readFileSync`, `writeFileSync`) inside HTTP route handlers, as they freeze all concurrent incoming client requests.",
    commonTrap:
      "Using `fs.exists()` (which is deprecated). Use `fs.access()` or directly attempt `fs.open()` / `fs.readFile()` and catch `ENOENT` errors.",
    followUpQuestions: [
      "Why is `fs.exists()` deprecated and what race condition does it introduce?",
      "What is the difference between `path.join()` and `path.resolve()`?",
    ],
    relatedTopics: ["File System", "fs Module", "Non-Blocking I/O", "Path Resolution"],
    tags: ["Node.js", "File System", "fs", "I/O", "Core Modules"],
  },
  {
    topicSlug: "nodejs",
    slug: "nodejs-process-object-environment-variables",
    title: "What is the Process Object and how do Environment Variables and Signal Handling work?",
    difficulty: "EASY",
    subtopic: "Runtime Environment",
    synopsis: "Global process control, CLI argument parsing, environment variable binding, and graceful shutdown signal traps.",
    shortAnswer:
      "The `process` object is a global instance providing info and control over the running Node.js process. It gives access to environment variables (`process.env`), command line arguments (`process.argv`), memory statistics (`process.memoryUsage()`), and system signals (`SIGINT`, `SIGTERM`) for graceful app termination.",
    detailedExplanation: [
      "**Environment Variables (`process.env`):** Key-value pairs passed from host OS or `.env` files (via `dotenv` or Node 20+ native `--env-file`).",
      "**Command Line Arguments (`process.argv`):** Array containing `[nodeExecutablePath, scriptPath, ...userArgs]`.",
      "**Graceful Shutdown Signal Handling:** Catching `SIGINT` (Ctrl+C) and `SIGTERM` (container stop signal) to close database connections and HTTP server before calling `process.exit(0)`.",
      "**Uncaught Exception Traps:**",
      "  - `process.on('uncaughtException')`: Catches unhandled synchronous errors.",
      "  - `process.on('unhandledRejection')`: Catches unhandled promise rejections.",
    ],
    interviewTip:
      "Explain why after catching `uncaughtException`, you should log the error and gracefully restart the process (using PM2 or Kubernetes), as process state becomes corrupt.",
    commonTrap:
      "Calling `process.exit(1)` immediately inside a SIGTERM handler before allowing active HTTP requests to finish.",
    followUpQuestions: [
      "How do you implement graceful shutdown in a Node.js HTTP server on SIGTERM?",
      "How does Node 20+ native `--env-file` flag eliminate the need for the `dotenv` package?",
    ],
    relatedTopics: ["Process", "Environment Variables", "Graceful Shutdown", "Signals"],
    tags: ["Node.js", "Process", "Signals", "DevOps", "Runtime"],
  },
  {
    topicSlug: "nodejs",
    slug: "nodejs-security-best-practices",
    title: "What are key Node.js Security Best Practices (ReDoS, Dependency Auditing, Prototype Pollution)?",
    difficulty: "MEDIUM",
    subtopic: "Security",
    synopsis: "Preventing Regular Expression Denial of Service, Prototype Pollution, and dependency vulnerability exploits.",
    shortAnswer:
      "Node.js security requires auditing third-party packages (`npm audit`), mitigating Regular Expression Denial of Service (ReDoS) by avoiding nested quantifiers, guarding against Prototype Pollution with `Object.freeze()` or `Map`, running as non-root user, and using timing-safe comparisons (`crypto.timingSafeEqual`) for secrets.",
    detailedExplanation: [
      "**ReDoS (Regular Expression Denial of Service):** Catastrophic backtracking in poorly constructed Regexes running on V8 main thread can freeze the event loop for seconds/minutes.",
      "**Prototype Pollution:** Attackers inject properties into `Object.prototype` via recursive merge operations (`{__proto__: {admin: true}}`), altering app behavior globally. Fix: use `Object.create(null)` or `Map` data structures.",
      "**Timing Attacks:** Using `==` or `===` to check secrets (JWT, API keys) leaks execution time based on character match length. Use `crypto.timingSafeEqual()` instead.",
      "**Dependency Security:** Run `npm audit`, pin lockfiles (`package-lock.json`), and use automated tools like Snyk or Renovate.",
      "**Command Injection:** Never pass user input directly into `child_process.exec()`; use `child_process.execFile()` with argument arrays instead.",
    ],
    interviewTip:
      "Mention OWASP Node.js Top 10 security guidelines: strict input validation, avoiding `eval()`, running Node in container unprivileged (`USER node`), and header security.",
    commonTrap:
      "Using `child_process.exec('ls ' + userInput)` which allows command injection shell exploits like `userInput = '; rm -rf /'`. Use `execFile` with explicit parameters.",
    followUpQuestions: [
      "What is catastrophic backtracking in regular expressions and how do you prevent ReDoS?",
      "How does `crypto.timingSafeEqual` prevent side-channel timing attacks?",
    ],
    relatedTopics: ["Security", "OWASP", "ReDoS", "Prototype Pollution"],
    tags: ["Node.js", "Security", "OWASP", "Vulnerabilities", "Best Practices"],
  },
];
