import type { ConceptualQuestion } from "../conceptual";

export const javascriptQuestions: ConceptualQuestion[] = [
  {
    topicSlug: "javascript",
    slug: "what-is-javascript",
    title: "What is JavaScript and what are its main features?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "High-level, dynamically typed, single-threaded language powering web runtimes.",
    shortAnswer:
      "JavaScript is a high-level, dynamically typed, interpreted/JIT-compiled, single-threaded programming language with first-class functions and prototypal inheritance, primarily used for web application development across browsers and Node.js.",
    detailedExplanation: [
      "Dynamic Typing: Variables are bound to values at runtime rather than fixed types.",
      "First-Class Functions: Functions can be assigned to variables, passed as arguments, and returned from other functions.",
      "Prototypal Inheritance: Objects inherit behavior directly from other prototype objects.",
      "Non-blocking Event-Driven I/O: Uses single-threaded event loop to handle concurrent asynchronous events.",
    ],
    interviewTip:
      "Mention that JS engine (V8, JavaScriptCore) JIT-compiles JS code to machine code at runtime for high execution performance.",
    followUpQuestions: [
      "What is ECMAScript (ES)?",
      "How does V8 JIT compiler work (Ignition & TurboFan)?",
    ],
    relatedTopics: ["JavaScript Fundamentals", "V8 Engine", "ECMAScript"],
    tags: ["Fundamentals", "JavaScript"],
  },
  {
    topicSlug: "javascript",
    slug: "js-data-types-primitives-objects",
    title: "What are data types in JavaScript (Primitives vs Reference Types)?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "7 primitive types stored by value vs Object reference types.",
    shortAnswer:
      "JavaScript has 7 primitive data types (string, number, boolean, null, undefined, symbol, bigint) which are immutable and stored by value, and Reference types (Object, Array, Function) which are mutable and stored by reference in the heap.",
    detailedExplanation: [
      "Primitive values are stored directly in memory (stack) and are immutable.",
      "Reference types (Objects) store a memory reference pointing to the object on the heap.",
      "`typeof null` returns `'object'` (a historical legacy JS bug).",
      "`BigInt` represents integers beyond $2^{53} - 1$ (`Number.MAX_SAFE_INTEGER`).",
    ],
    example: {
      language: "JAVA",
      code: `// Primitive value copy:
let a = 10;
let b = a;
b = 20; // a remains 10

// Reference copy:
let obj1 = { name: "Alice" };
let obj2 = obj1;
obj2.name = "Bob"; // obj1.name is now "Bob"!`,
    },
    interviewTip:
      "Call out the famous JS gotcha: `typeof null === 'object'` due to early 32-bit type tag representations in JS engine implementations.",
    followUpQuestions: [
      "Why is typeof null 'object'?",
      "What is the difference between Primitive Wrapper objects and primitive literals?",
    ],
    relatedTopics: ["Fundamentals", "Data Types"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "javascript",
    slug: "js-var-let-const",
    title: "What is the difference between var, let, and const in JavaScript?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Function scope & hoisting vs block scope and temporal dead zones.",
    shortAnswer:
      "`var` is function-scoped, hoisted with `undefined` initialization, and allows re-declaration. `let` and `const` are block-scoped (`{}`), hoisted into the Temporal Dead Zone (TDZ), and forbid re-declaration. `const` also forbids variable re-assignment.",
    detailedExplanation: [
      "`var`: Function-scoped, attached to `window` in browser global scope.",
      "`let`: Block-scoped, re-assignable, not attached to global object.",
      "`const`: Block-scoped, requires initial value, binding cannot be reassigned (though internal object properties can be mutated!).",
    ],
    example: {
      language: "JAVA",
      code: `const user = { name: "Alice" };
user.name = "Bob"; // Allowed (mutating property)
// user = {};     // TypeError: Assignment to constant variable!`,
    },
    interviewTip:
      "Emphasize that `const` guarantees immutability of the *variable reference binding*, NOT the underlying object content.",
    followUpQuestions: [
      "What is Temporal Dead Zone (TDZ)?",
      "Why were let and const introduced in ES6?",
    ],
    relatedTopics: ["Fundamentals", "Scope", "ES6"],
    tags: ["Fundamentals", "Scope"],
  },
  {
    topicSlug: "javascript",
    slug: "js-hoisting",
    title: "What is Hoisting in JavaScript and how does it affect functions and variables?",
    difficulty: "MEDIUM",
    subtopic: "Language Core",
    synopsis: "Creation phase memory allocation of declarations before execution phase.",
    shortAnswer:
      "Hoisting is JavaScript's default behavior of moving variable and function declarations to the top of their containing scope during compilation phase. Function declarations are hoisted with full definition, `var` is hoisted initialized to `undefined`, while `let` and `const` are hoisted into the uninitialized Temporal Dead Zone (TDZ).",
    detailedExplanation: [
      "Compilation / Creation Phase: JS engine registers declarations in Memory space.",
      "Function Declarations: Hoisted fully (can be called before code definition).",
      "Function Expressions (`var f = () => {}`): Only variable declaration is hoisted initialized to `undefined`.",
      "Temporal Dead Zone: Accessing `let`/`const` before declaration line raises `ReferenceError`.",
    ],
    example: {
      language: "JAVA",
      code: `sayHello(); // Works! Output: "Hello"
function sayHello() { console.log("Hello"); }

console.log(x); // Output: undefined
var x = 5;

// console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 10;`,
    },
    interviewTip:
      "Explain hoisting in terms of JS execution context phases: 1. Creation Phase (memory allocation), 2. Execution Phase.",
    followUpQuestions: [
      "What happens when a function declaration and a var variable share the same name?",
      "What is the Temporal Dead Zone?",
    ],
    relatedTopics: ["Hoisting", "Execution Context", "Scope"],
    tags: ["Language Core", "Hoisting"],
  },
  {
    topicSlug: "javascript",
    slug: "js-closures",
    title: "What are Closures in JavaScript and how do they work?",
    difficulty: "MEDIUM",
    subtopic: "Language Core",
    synopsis: "Functions retaining access to outer lexical scope variables after outer function return.",
    shortAnswer:
      "A closure is a function bundled together with references to its surrounding lexical environment. It gives inner functions access to outer function variables even after the outer function has completed execution.",
    detailedExplanation: [
      "Lexical Scope: Outer variables accessible by inner nested functions.",
      "Use Cases: Data privacy/encapsulation (private variables), currying, module patterns, event listener handlers.",
      "Memory Leak Risk: Unused closures holding massive outer scopes can prevent garbage collection.",
    ],
    example: {
      language: "JAVA",
      code: `function createCounter() {
    let count = 0; // Private variable encapsulated by closure
    return {
        increment: () => ++count,
        getCount: () => count
    };
}
const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.getCount());  // 1`,
    },
    interviewTip:
      "Use data privacy / encapsulation as the primary real-world use case for closures.",
    followUpQuestions: [
      "How do closures work inside for loops with var vs let?",
      "How to fix stale closures in React hooks?",
    ],
    relatedTopics: ["Closures", "Scope", "Functions"],
    tags: ["Closures", "Language Core"],
  },
  {
    topicSlug: "javascript",
    slug: "js-scope-chain-lexical-environment",
    title: "What is Scope and Scope Chain in JavaScript?",
    difficulty: "EASY",
    subtopic: "Language Core",
    synopsis: "Variable accessibility boundaries and outer lexical environment resolution.",
    shortAnswer:
      "Scope determines the accessibility of variables in code. JavaScript has Global Scope, Function Scope, and Block Scope (`{}`). When resolving a variable, JS traverses the Scope Chain from current local scope outwards to global scope, raising `ReferenceError` if not found.",
    detailedExplanation: [
      "Global Scope: Accessible throughout application.",
      "Function Scope: Variables defined inside function with `var`/`let`/`const`.",
      "Block Scope: Introduced in ES6 for `let` and `const` inside `{}` blocks.",
      "Lexical Scope: Scope is determined statically at code write/author time, based on where functions are physically declared.",
    ],
    interviewTip:
      "Clarify that JavaScript uses *lexical* scoping (determined at compile/author time), not *dynamic* scoping (determined at runtime call stack).",
    followUpQuestions: [
      "Difference between lexical scope and dynamic scope?",
      "What is Global Scope Pollution?",
    ],
    relatedTopics: ["Scope", "Lexical Environment", "Execution Context"],
    tags: ["Scope", "Language Core"],
  },
  {
    topicSlug: "javascript",
    slug: "js-this-keyword-binding",
    title: "How does the 'this' keyword work in JavaScript and what are its binding rules?",
    difficulty: "MEDIUM",
    subtopic: "Language Core",
    synopsis: "Call-time invocation context determination and lexical arrow function binding.",
    shortAnswer:
      "`this` refers to the execution context object of a function call. Its value is determined at runtime based on invocation syntax: Default Binding, Implicit Binding (`obj.fn()`), Explicit Binding (`call`/`apply`/`bind`), `new` Binding, or Lexical Binding (Arrow Functions).",
    detailedExplanation: [
      "1. `new` Binding: `new Person()` binds `this` to newly created instance object.",
      "2. Explicit Binding: `fn.call(ctx)`, `fn.apply(ctx)`, `fn.bind(ctx)` explicitly sets `this`.",
      "3. Implicit Binding: `obj.method()` binds `this` to `obj`.",
      "4. Default Binding: Standalone function call binds to `window` (or `undefined` in strict mode).",
      "5. Arrow Functions: Inherit `this` lexically from enclosing outer scope (no dynamic `this`).",
    ],
    example: {
      language: "JAVA",
      code: `const obj = {
    name: "Alice",
    regularFn: function() { console.log(this.name); },
    arrowFn: () => { console.log(this.name); }
};

obj.regularFn(); // Output: "Alice" (Implicit binding)
obj.arrowFn();   // Output: undefined (Lexical global binding)`,
    },
    interviewTip:
      "Always highlight that Arrow Functions do NOT have their own `this` binding—they retain the `this` value of their enclosing scope.",
    followUpQuestions: [
      "Why can't arrow functions be used as constructors?",
      "What happens to 'this' inside lost implicit binding callbacks?",
    ],
    relatedTopics: ["this", "Functions", "Object Oriented JS"],
    tags: ["this", "Language Core"],
  },
  {
    topicSlug: "javascript",
    slug: "js-call-apply-bind",
    title: "What is the difference between call(), apply(), and bind() in JavaScript?",
    difficulty: "EASY",
    subtopic: "Functions",
    synopsis: "Explicit 'this' context binding methods and argument passing styles.",
    shortAnswer:
      "`call()` invokes a function immediately passing `this` and arguments individually (`fn.call(ctx, arg1, arg2)`). `apply()` invokes immediately passing arguments as an array (`fn.apply(ctx, [arg1, arg2])`). `bind()` returns a NEW bound function without executing it immediately.",
    detailedExplanation: [
      "`call(thisArg, arg1, arg2, ...)`: Immediate invocation with comma-separated arguments.",
      "`apply(thisArg, [argsArray])`: Immediate invocation with argument array.",
      "`bind(thisArg, arg1, ...)`: Partial application returning bound function for future invocation.",
    ],
    example: {
      language: "JAVA",
      code: `function greet(greeting, punctuation) {
    console.log(greeting + " " + this.name + punctuation);
}
const user = { name: "Alice" };

greet.call(user, "Hello", "!");   // Output: "Hello Alice!"
greet.apply(user, ["Hi", "."]);   // Output: "Hi Alice."
const boundGreet = greet.bind(user, "Hey");
boundGreet("?");                  // Output: "Hey Alice?"`,
    },
    interviewTip:
      "Memory mnemonic: **C**all = **C**omma-separated, **A**pply = **A**rray, **B**ind = **B**ounds new function.",
    followUpQuestions: [
      "How to implement custom Function.prototype.bind polyfill?",
      "What is Function Currying using bind()?",
    ],
    relatedTopics: ["Functions", "this", "Prototypes"],
    tags: ["Functions", "this"],
  },
  {
    topicSlug: "javascript",
    slug: "js-event-loop-concurrency",
    title: "How does the JavaScript Event Loop work (Microtasks vs Macrotasks)?",
    difficulty: "HARD",
    subtopic: "JavaScript Engine",
    synopsis: "Call stack, Web APIs, Microtask Queue (Promises), and Macrotask Queue (setTimeout).",
    shortAnswer:
      "JavaScript is single-threaded. The Event Loop continuously checks if the Call Stack is empty. When empty, it drains ALL tasks in the Microtask Queue (Promises, queueMicrotask) before processing a SINGLE Macrotask (setTimeout, setInterval, I/O).",
    detailedExplanation: [
      "Call Stack: Executes synchronous bytecode LIFO.",
      "Web APIs: Browser thread handles async tasks (timers, DOM events, fetch).",
      "Microtask Queue: High-priority queue (`Promise.then`, `MutationObserver`). Drained completely before next tick or render.",
      "Macrotask Queue: Low-priority queue (`setTimeout`, `setInterval`, I/O). One task processed per event loop tick.",
    ],
    example: {
      language: "JAVA",
      code: `console.log("1: Sync");
setTimeout(() => console.log("2: Macrotask"), 0);
Promise.resolve().then(() => console.log("3: Microtask"));
console.log("4: Sync");

// Output Order:
// 1: Sync -> 4: Sync -> 3: Microtask -> 2: Macrotask`,
    },
    interviewTip:
      "Trace order step-by-step: 1. Synchronous Stack $\rightarrow$ 2. Microtask Queue (all) $\rightarrow$ 3. UI Render $\rightarrow$ 4. Macrotask Queue (one item).",
    followUpQuestions: [
      "What happens if a microtask recursively enqueues another microtask?",
      "Difference between process.nextTick and setImmediate in Node.js?",
    ],
    relatedTopics: ["Event Loop", "Asynchronous", "Promises"],
    tags: ["Event Loop", "Engine"],
  },
  {
    topicSlug: "javascript",
    slug: "js-promises-async-await",
    title: "What are Promises and how does async/await work in JavaScript?",
    difficulty: "MEDIUM",
    subtopic: "Asynchronous",
    synopsis: "Asynchronous operation states, promise chaining, and syntactic sugar generators.",
    shortAnswer:
      "A Promise represents an asynchronous value in 1 of 3 states: Pending, Fulfilled, or Rejected. `async/await` is syntactic sugar built on Promises and Generators, making asynchronous code read synchronously without blocking the event loop.",
    detailedExplanation: [
      "Promise States: Pending (initial), Fulfilled (`resolve(val)`), Rejected (`reject(err)`). State transitions are immutable.",
      "Chaining: `.then()` returns a new Promise, preventing Callback Hell.",
      "`async` functions return a Promise implicitly.",
      "`await` pauses async function execution until Promise settles, yielding control back to Event Loop.",
    ],
    example: {
      language: "JAVA",
      code: `async function fetchData() {
    try {
        const res = await fetch("https://api.example.com/data");
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Fetch failed", err);
    }
}`,
    },
    interviewTip:
      "Always wrap `await` calls in `try...catch` blocks or attach `.catch()` to prevent unhandled promise rejections.",
    followUpQuestions: [
      "What is UnhandledPromiseRejection warning?",
      "How to convert callback functions into Promises (promisify)?",
    ],
    relatedTopics: ["Asynchronous", "Promises", "Async/Await"],
    tags: ["Asynchronous"],
  },
  {
    topicSlug: "javascript",
    slug: "js-promise-all-race-allsettled-any",
    title: "What is the difference between Promise.all(), Promise.allSettled(), Promise.race(), and Promise.any()?",
    difficulty: "MEDIUM",
    subtopic: "Asynchronous",
    synopsis: "Combinator methods for managing concurrent promise arrays.",
    shortAnswer:
      "`Promise.all()` waits for all promises to fulfill (fails fast on first rejection). `Promise.allSettled()` waits for all to settle regardless of outcome. `Promise.race()` settles on the first promise to settle (fulfill or reject). `Promise.any()` fulfills on the first promise to fulfill (rejects if all reject).",
    detailedExplanation: [
      "`Promise.all([p1, p2])`: Returns array of results. Short-circuits on first rejection.",
      "`Promise.allSettled([p1, p2])`: Returns array of objects `{ status: 'fulfilled'|'rejected', value|reason }`.",
      "`Promise.race([p1, p2])`: Returns first resolved or rejected value/error.",
      "`Promise.any([p1, p2])`: Returns first fulfilled value. If all reject, throws `AggregateError`.",
    ],
    interviewTip:
      "Use `Promise.allSettled()` when you need all API call results regardless of individual failures (e.g. batch dashboard widgets).",
    followUpQuestions: [
      "What is AggregateError in Promise.any()?",
      "How to implement custom Promise.all polyfill?",
    ],
    relatedTopics: ["Promises", "Asynchronous", "Concurrency"],
    tags: ["Promises", "Asynchronous"],
  },
  {
    topicSlug: "javascript",
    slug: "js-prototypal-inheritance-prototype-chain",
    title: "How does Prototypal Inheritance and Prototype Chain work in JavaScript?",
    difficulty: "MEDIUM",
    subtopic: "Language Core",
    synopsis: "Object-to-object delegation via __proto__ links up to Object.prototype.",
    shortAnswer:
      "JavaScript uses prototypal inheritance where objects inherit properties and methods directly from other objects via a hidden `[[Prototype]]` reference (`__proto__`). Property lookups traverse up the prototype chain until found or reaching `Object.prototype.__proto__ === null`.",
    detailedExplanation: [
      "Constructor Function: `function Person() {}` has a `.prototype` property attached.",
      "Instance Link: Instance created via `new Person()` has `__proto__` pointing to `Person.prototype`.",
      "`Object.create(proto)`: Creates a new object with specified prototype object.",
      "HasOwnProperty: `obj.hasOwnProperty('prop')` checks if property belongs to instance vs prototype chain.",
    ],
    example: {
      language: "JAVA",
      code: `function Animal(name) { this.name = name; }
Animal.prototype.speak = function() { console.log(this.name + " makes a sound"); };

const dog = new Animal("Dog");
dog.speak(); // Found on Animal.prototype!
console.log(dog.__proto__ === Animal.prototype); // true`,
    },
    interviewTip:
      "Clarify the distinction: `prototype` is a property on constructor functions, while `__proto__` (`[[Prototype]]`) is the internal link on instance objects.",
    followUpQuestions: [
      "Difference between __proto__ and prototype?",
      "How do ES6 classes map to prototypal inheritance behind the scenes?",
    ],
    relatedTopics: ["Prototypes", "OOP", "Object Oriented JS"],
    tags: ["Prototypes", "Language Core"],
  },
  {
    topicSlug: "javascript",
    slug: "js-double-equals-vs-triple-equals",
    title: "What is the difference between == (loose equality) and === (strict equality)?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Implicit type coercion vs strict value and type checking.",
    shortAnswer:
      "`==` (loose equality) performs implicit type coercion before comparing values. `===` (strict equality) compares both value and type without performing type conversion.",
    detailedExplanation: [
      "`5 == '5'` is `true` because string `'5'` is coerced to number `5`.",
      "`5 === '5'` is `false` because types differ (`number` vs `string`).",
      "Abstract Equality Comparison Algorithm (ES spec): Handles boolean coercion, string to number coercion, object to primitive `[Symbol.toPrimitive]` conversion.",
      "Falsy loose equality gotchas: `0 == ''` (true), `false == []` (true), `null == undefined` (true).",
    ],
    interviewTip:
      "Always use `===` in production code. The only common exception is checking for nullish values `if (x == null)` which catches both `null` and `undefined`.",
    commonTrap:
      "Assuming `NaN === NaN` is true. `NaN` is the only value in JavaScript that is not equal to itself!",
    followUpQuestions: [
      "Why is Object.is(NaN, NaN) true while NaN === NaN is false?",
      "What is the Abstract Equality Comparison Algorithm?",
    ],
    relatedTopics: ["Fundamentals", "Operators", "Type Coercion"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "javascript",
    slug: "js-null-vs-undefined",
    title: "What is the difference between null and undefined in JavaScript?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Explicit intentional absence of value vs unassigned default state.",
    shortAnswer:
      "`undefined` means a variable has been declared but not yet assigned a value (or a function missing a return statement). `null` is an explicit assignment representing an intentional absence of any object value.",
    detailedExplanation: [
      "`undefined`: Type is `undefined`. Automatically set by JS engine.",
      "`null`: Type is `'object'` (legacy bug). Manually assigned by developer to clear object references.",
      "`null == undefined` is `true`; `null === undefined` is `false`.",
    ],
    example: {
      language: "JAVA",
      code: `let x;            // undefined (unassigned)
let y = null;     // null (explicit empty value)
console.log(typeof x); // "undefined"
console.log(typeof y); // "object"`,
    },
    interviewTip:
      "Use `null` when explicitly resetting or clearing object references so GC can reclaim heap memory.",
    followUpQuestions: [
      "How does default parameter handling treat null vs undefined?",
      "What does Nullish Coalescing operator (??) return for null vs undefined?",
    ],
    relatedTopics: ["Fundamentals", "Data Types"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "javascript",
    slug: "js-type-coercion-implicit-explicit",
    title: "What is Type Coercion in JavaScript (Implicit vs Explicit)?",
    difficulty: "MEDIUM",
    subtopic: "Fundamentals",
    synopsis: "Automatic runtime type conversion rules and mathematical/string operator behaviors.",
    shortAnswer:
      "Type Coercion is the automatic conversion of values from one data type to another. Implicit coercion occurs automatically during operations (`'5' + 2 -> '52'`), while Explicit coercion is triggered manually by developer calls (`Number('5')`).",
    detailedExplanation: [
      "Addition Operator `+`: If any operand is a string, performs string concatenation. Otherwise, converts to numbers.",
      "Subtraction/Multiplication `- * /`: Always converts operands to numbers (`'5' - 2 -> 3`).",
      "Truthiness Coercion: Falsy values (`false`, `0`, `''`, `null`, `undefined`, `NaN`) coerce to `false` in conditionals.",
    ],
    example: {
      language: "JAVA",
      code: `console.log("5" + 2); // "52" (String concatenation)
console.log("5" - 2); // 3    (Numeric subtraction)
console.log(true + 1); // 2   (true coerced to 1)
console.log([] + {});  // "[object Object]"`,
    },
    interviewTip:
      "Explain the `+` overloaded duality: `+` acts as string concatenation if string operand exists, whereas `-` always forces numeric conversion.",
    followUpQuestions: [
      "What are the 6 falsy values in JavaScript?",
      "How does Symbol.toPrimitive control object coercion?",
    ],
    relatedTopics: ["Fundamentals", "Type Coercion"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "javascript",
    slug: "js-nan-and-isnan",
    title: "What is NaN in JavaScript and how do isNaN() vs Number.isNaN() differ?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Not-a-Number special value, self-inequality, and robust type checking.",
    shortAnswer:
      "`NaN` ('Not-a-Number') is a special numeric value representing an invalid math calculation. Global `isNaN(val)` coerces `val` to number before checking, while `Number.isNaN(val)` strictly checks if `val` is of type number AND equals `NaN` without coercion.",
    detailedExplanation: [
      "`typeof NaN === 'number'`. It is a value of the Number type representing undefined or unrepresentable mathematical result.",
      "`NaN === NaN` is `false`. Use `Object.is(NaN, NaN)` or `Number.isNaN()` to check for `NaN`.",
      "`isNaN('hello')` returns `true` (coerces string to `NaN`). `Number.isNaN('hello')` returns `false` (string is not of type number).",
    ],
    example: {
      language: "JAVA",
      code: `console.log(isNaN("hello"));        // true  (Coerces "hello" to NaN)
console.log(Number.isNaN("hello")); // false (Type is string, not NaN number)
console.log(Number.isNaN(NaN));     // true`,
    },
    interviewTip:
      "Always recommend `Number.isNaN()` over global `isNaN()` due to unwanted implicit type coercions.",
    followUpQuestions: [
      "Why does typeof NaN return 'number'?",
      "How to polyfill Number.isNaN?",
    ],
    relatedTopics: ["Fundamentals", "Math"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "javascript",
    slug: "js-arrow-functions-vs-regular",
    title: "What is the difference between Arrow Functions and Regular Functions in JavaScript?",
    difficulty: "EASY",
    subtopic: "Functions",
    synopsis: "Lexical 'this' binding, arguments object absence, and constructor capability.",
    shortAnswer:
      "Arrow functions (`() => {}`) have lexical `this` binding (inherit from outer scope), lack their own `arguments` object, cannot be used as constructors (`new`), and cannot be used as generator functions. Regular functions have dynamic `this` bound at call time.",
    detailedExplanation: [
      "No `this`: Arrow functions capture `this` from enclosing scope at definition time.",
      "No `arguments`: Arrow functions use rest parameters (`(...args) => {}`) instead of `arguments` object.",
      "No `prototype`: Arrow functions do not have a `.prototype` property and throw `TypeError` if invoked with `new`.",
    ],
    example: {
      language: "JAVA",
      code: `const obj = {
    count: 0,
    incrementLater() {
        setTimeout(() => {
            this.count++; // 'this' lexically bound to obj!
            console.log(this.count); // 1
        }, 100);
    }
};
obj.incrementLater();`,
    },
    interviewTip:
      "Avoid using arrow functions as object methods when you need dynamic `this` pointing to the object instance.",
    followUpQuestions: [
      "Why can't arrow functions be used as constructors?",
      "How do arrow functions simplify callback handlers?",
    ],
    relatedTopics: ["Functions", "this", "ES6"],
    tags: ["Functions", "ES6"],
  },
  {
    topicSlug: "javascript",
    slug: "js-higher-order-functions",
    title: "What are Higher-Order Functions in JavaScript?",
    difficulty: "EASY",
    subtopic: "Functions",
    synopsis: "Functions accepting other functions as arguments or returning functions.",
    shortAnswer:
      "A Higher-Order Function (HOF) is a function that receives another function as an argument, returns a function, or both. Built-in examples include `map()`, `filter()`, `reduce()`, and `setTimeout()`.",
    detailedExplanation: [
      "First-Class Citizens: Enables passing functions as first-class data values.",
      "Abstraction: Abstracts iteration logic or asynchronous callbacks.",
      "Functional Composition: Enables building reusable utility pipelines (e.g. `compose`, `pipe`).",
    ],
    example: {
      language: "JAVA",
      code: `// Custom Higher-Order Function returning a function:
function multiplyBy(factor) {
    return (num) => num * factor;
}
const double = multiplyBy(2);
console.log(double(5)); // 10`,
    },
    interviewTip:
      "Highlight functional programming principles: HOFs promote declarative, reusable code over imperative loops.",
    followUpQuestions: [
      "How do array methods (map, filter, reduce) operate as HOFs?",
      "What is Function Composition?",
    ],
    relatedTopics: ["Functions", "Functional Programming"],
    tags: ["Functions"],
  },
  {
    topicSlug: "javascript",
    slug: "js-callback-functions-and-callback-hell",
    title: "What are Callbacks and what is Callback Hell / Pyramid of Doom?",
    difficulty: "EASY",
    subtopic: "Asynchronous",
    synopsis: "Functions passed as arguments and nested async callback pyramid resolution.",
    shortAnswer:
      "A Callback is a function passed as an argument to another function to be executed later. 'Callback Hell' occurs when multiple nested asynchronous callbacks create deeply indented, unmaintainable code ('Pyramid of Doom'). Promises and `async/await` solve this.",
    detailedExplanation: [
      "Callback Pattern: Standard for asynchronous event handling in early JS/Node.",
      "Pyramid of Doom: Deep nested error handling and control flow leading to readability issues.",
      "Solution: Flattening via Promises (`.then()`) or `async/await` try-catch blocks.",
    ],
    interviewTip:
      "Explain how Promises flatten nested callbacks into linear readable chains.",
    followUpQuestions: [
      "What is Error-First Callback convention in Node.js?",
      "How to convert callback APIs to Promises?",
    ],
    relatedTopics: ["Asynchronous", "Promises", "Callbacks"],
    tags: ["Asynchronous"],
  },
  {
    topicSlug: "javascript",
    slug: "js-currying",
    title: "What is Currying in JavaScript and how is it implemented?",
    difficulty: "MEDIUM",
    subtopic: "Functions",
    synopsis: "Transforming multi-argument functions into sequences of single-argument functions.",
    shortAnswer:
      "Currying is a functional programming technique of evaluating a function with multiple arguments into a sequence of nested functions, each taking a single argument (`f(a, b, c)` $\rightarrow$ `f(a)(b)(c)`).",
    detailedExplanation: [
      "Closure Based: Inner functions retain access to previously passed arguments via closures.",
      "Partial Application: Allows pre-configuring reusable function arguments.",
      "Infinite Currying: Curried functions that continuously accept arguments until invoked empty (`add(1)(2)(3)()`).",
    ],
    example: {
      language: "JAVA",
      code: `// Standard function:
const add = (a, b) => a + b;

// Curried version:
const curriedAdd = (a) => (b) => a + b;
const addFive = curriedAdd(5);
console.log(addFive(10)); // 15`,
    },
    interviewTip:
      "Highlight utility: currying helps create specialized helper functions by locking in initial parameters.",
    followUpQuestions: [
      "Difference between Currying and Partial Application?",
      "How to implement auto-curry wrapper function in JS?",
    ],
    relatedTopics: ["Functions", "Closures", "Functional Programming"],
    tags: ["Functions", "Advanced JS"],
  },
  {
    topicSlug: "javascript",
    slug: "js-memoization",
    title: "What is Memoization in JavaScript and how does it optimize performance?",
    difficulty: "MEDIUM",
    subtopic: "Performance",
    synopsis: "Caching expensive function return results based on input arguments.",
    shortAnswer:
      "Memoization is an optimization technique that caches the return results of expensive function calls based on their input parameters. When called with identical arguments, it returns the cached result without re-executing computations.",
    detailedExplanation: [
      "Cache Object: Uses a closure object/Map to store argument-to-result key-value mappings.",
      "Pure Functions Required: Works ONLY for pure deterministic functions (same inputs always produce same output).",
      "Memory vs Time Tradeoff: Uses memory to store cached values in exchange for faster execution speed.",
    ],
    example: {
      language: "JAVA",
      code: `function memoize(fn) {
    const cache = {};
    return function(...args) {
        const key = JSON.stringify(args);
        if (key in cache) return cache[key];
        const result = fn(...args);
        cache[key] = result;
        return result;
    };
}`,
    },
    interviewTip:
      "Mention that React `useMemo` and `React.memo` are built on this exact memoization cache pattern.",
    followUpQuestions: [
      "Why must memoized functions be pure?",
      "What are the cache size memory eviction strategies (LRU cache)?",
    ],
    relatedTopics: ["Performance", "Closures", "Caching"],
    tags: ["Performance", "Advanced JS"],
  },
  {
    topicSlug: "javascript",
    slug: "js-debounce-vs-throttle",
    title: "What is the difference between Debouncing and Throttling in JavaScript?",
    difficulty: "MEDIUM",
    subtopic: "Performance",
    synopsis: "Delaying execution until inactivity vs rate-limiting execution to fixed time intervals.",
    shortAnswer:
      "Debouncing delays executing a function until a specified time has elapsed since the last event invocation (useful for search input auto-complete). Throttling limits function execution to at most once per fixed time interval (useful for scroll/resize listeners).",
    detailedExplanation: [
      "Debounce: Resets timer on every new event call. Executes ONLY after user stops triggering events.",
      "Throttle: Executes immediately or periodically, enforcing a maximum invocation rate limit.",
      "Implementation: Debounce uses `clearTimeout` / `setTimeout`; Throttle uses timestamp tracking or timer locks.",
    ],
    example: {
      language: "JAVA",
      code: `// Simple Debounce implementation:
function debounce(fn, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}`,
    },
    interviewTip:
      "Use clear real-world examples: Debounce for search input typeahead; Throttle for window resize or infinite scroll handlers.",
    followUpQuestions: [
      "How to implement a throttle function with leading and trailing options?",
      "How does requestAnimationFrame relate to throttling scroll events?",
    ],
    relatedTopics: ["Performance", "Event Loop", "DOM"],
    tags: ["Performance", "DOM"],
  },
  {
    topicSlug: "javascript",
    slug: "js-event-bubbling-and-capturing",
    title: "What is Event Bubbling, Event Capturing (Trickling), and Event Delegation?",
    difficulty: "MEDIUM",
    subtopic: "DOM & Web APIs",
    synopsis: "3-phase DOM event propagation lifecycle and delegating events to parent elements.",
    shortAnswer:
      "DOM Events propagate in 3 phases: 1. Capturing Phase (event travels down from Window to Target), 2. Target Phase, and 3. Bubbling Phase (event bubbles up from Target to Window). Event Delegation attaches a single event listener to a parent element to handle events on dynamic children using bubbling.",
    detailedExplanation: [
      "Capturing: `addEventListener('click', fn, true)` (useCapture = true).",
      "Bubbling: Default behavior (`useCapture = false`).",
      "Stopping Propagation: `e.stopPropagation()` stops further bubbling/capturing propagation up or down the DOM tree.",
      "Preventing Default: `e.preventDefault()` stops browser default behavior (e.g. form submission refresh).",
      "Event Delegation Benefit: Drastically reduces memory consumption by avoiding attaching listener instances to thousands of list items.",
    ],
    interviewTip:
      "Highlight Event Delegation memory savings: attaching 1 click listener to a `<ul>` handles clicks on 10,000 `<li>` items via `e.target`.",
    followUpQuestions: [
      "Difference between e.target and e.currentTarget?",
      "Difference between stopPropagation() and stopImmediatePropagation()?",
    ],
    relatedTopics: ["DOM", "Events", "Performance"],
    tags: ["DOM", "Events"],
  },
  {
    topicSlug: "javascript",
    slug: "js-dom-manipulation-selectors",
    title: "How does DOM Manipulation work in JavaScript (selectors, element creation, reflow/repaint)?",
    difficulty: "EASY",
    subtopic: "DOM & Web APIs",
    synopsis: "Accessing HTML DOM nodes, element creation, and minimizing reflow performance layout hits.",
    shortAnswer:
      "DOM Manipulation allows JavaScript to inspect and alter document structure, styles, and content (`querySelector`, `createElement`, `appendChild`). Reflow (layout calculation) and Repaint (pixel rendering) occur on DOM updates and should be batched via DocumentFragments to preserve 60fps performance.",
    detailedExplanation: [
      "Selectors: `document.getElementById`, `document.querySelector`, `querySelectorAll` (returns NodeList).",
      "Reflow: Browser recalculates positions and geometries of elements. Triggered by changing width, height, font-size, or reading `offsetHeight`.",
      "Repaint: Browser redraws visual elements without changing layout (color, visibility).",
      "Optimization: Use `DocumentFragment` or `requestAnimationFrame` to batch DOM mutations in memory.",
    ],
    interviewTip:
      "Explain DocumentFragment: building a sub-tree off-DOM in a DocumentFragment and appending it once causes ONLY 1 reflow instead of N reflows.",
    followUpQuestions: [
      "Difference between NodeList and HTMLCollection?",
      "What forces a synchronous browser reflow (layout thrashing)?",
    ],
    relatedTopics: ["DOM", "Performance", "Web APIs"],
    tags: ["DOM", "Performance"],
  },
  {
    topicSlug: "javascript",
    slug: "js-map-filter-reduce",
    title: "How do map(), filter(), and reduce() work on JavaScript arrays?",
    difficulty: "EASY",
    subtopic: "Data Structures",
    synopsis: "Non-mutating functional array iteration, transformation, filtering, and aggregation.",
    shortAnswer:
      "`map()` creates a new array by applying a transformation to every element. `filter()` creates a new array containing elements that satisfy a predicate test. `reduce()` aggregates array elements into a single accumulated return value.",
    detailedExplanation: [
      "Immutability: All 3 methods return new data without mutating the original source array.",
      "`map(cb)`: `cb(item, index, array)`. Returns new transformed item.",
      "`filter(cb)`: `cb(item, index, array)`. Returns boolean truthy/falsy.",
      "`reduce(cb, initialValue)`: `cb(accumulator, currentValue, index, array)`.",
    ],
    example: {
      language: "JAVA",
      code: `const nums = [1, 2, 3, 4];
const doubledEvensSum = nums
    .filter(n => n % 2 === 0)   // [2, 4]
    .map(n => n * 2)           // [4, 8]
    .reduce((acc, n) => acc + n, 0); // 12`,
    },
    interviewTip:
      "Always specify `initialValue` in `reduce()` to avoid errors when reducing empty arrays.",
    followUpQuestions: [
      "How to implement custom Array.prototype.reduce polyfill?",
      "What is the difference between map() and forEach()?",
    ],
    relatedTopics: ["Arrays", "Functional Programming"],
    tags: ["Arrays", "Data Structures"],
  },
  {
    topicSlug: "javascript",
    slug: "js-set-map-weakset-weakmap",
    title: "What is the difference between Set, Map, WeakSet, and WeakMap in ES6?",
    difficulty: "MEDIUM",
    subtopic: "Data Structures",
    synopsis: "Key-value and value set collections with strong vs weak garbage collection reference handling.",
    shortAnswer:
      "`Set` holds unique values. `Map` holds arbitrary key-value pairs (keys can be any type). `WeakSet` and `WeakMap` hold WEAK references to object keys only, allowing garbage collection of keys if no other references exist, preventing memory leaks.",
    detailedExplanation: [
      "`Set`: Unique items, iterable, retains insertion order.",
      "`Map`: Key-value pairs allowing objects/functions as keys. Preserves insertion order, size property.",
      "`WeakMap`: Keys MUST be objects/symbols. Weak key references allow GC. Non-iterable (no `.size`, `.keys()`).",
      "`WeakSet`: Elements MUST be objects. Non-iterable.",
      "Use Case for WeakMap: Storing private metadata or caching data associated with DOM nodes without preventing GC.",
    ],
    interviewTip:
      "Highlight memory leak prevention: `WeakMap` keys are garbage collected automatically when the target object reference is deleted elsewhere.",
    followUpQuestions: [
      "Why are WeakMap and WeakSet non-iterable?",
      "Difference between Map and Plain Object ({}) in JS?",
    ],
    relatedTopics: ["Data Structures", "ES6", "Memory Management"],
    tags: ["Data Structures", "ES6"],
  },
  {
    topicSlug: "javascript",
    slug: "js-destructuring-assignment",
    title: "What is Destructuring Assignment in JavaScript (Array and Object destructuring)?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Unpacking properties from objects and arrays into distinct variables.",
    shortAnswer:
      "Destructuring Assignment (ES6) is a syntax that allows unpacking values from arrays or properties from objects into distinct variables in a single clean expression.",
    detailedExplanation: [
      "Object Destructuring: `{ name, age } = user`. Supports property renaming `{ name: username }` and default fallback values `{ role = 'guest' }`.",
      "Array Destructuring: `[a, b, ...rest] = numbers`. Positional extraction.",
      "Nested Destructuring: Extracting deeply nested API payload properties directly.",
    ],
    example: {
      language: "JAVA",
      code: `const user = { id: 1, info: { name: "Alice" } };
const { info: { name: userName }, role = "User" } = user;
console.log(userName, role); // "Alice", "User"

const [first, second, ...rest] = [10, 20, 30, 40];
console.log(first, rest); // 10, [30, 40]`,
    },
    interviewTip:
      "Show how destructuring simplifies React props unpacking inside function component parameter signatures.",
    followUpQuestions: [
      "What happens when destructuring undefined or null?",
      "How to swap two variables without a temporary variable using array destructuring?",
    ],
    relatedTopics: ["ES6", "Syntax"],
    tags: ["Fundamentals", "ES6"],
  },
  {
    topicSlug: "javascript",
    slug: "js-spread-vs-rest-operator",
    title: "What is the difference between the Spread operator and Rest parameter in JavaScript?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Unpacking iterables into individual elements (...) vs packing multiple arguments into an array (...).",
    shortAnswer:
      "Both use `...` syntax. The Spread operator expands/unpacks an iterable (array, object) into individual elements. The Rest parameter collects/packs multiple individual function arguments into a single array parameter.",
    detailedExplanation: [
      "Spread `...iter`: `[...arr1, ...arr2]` or `{ ...obj1, ...obj2 }`.",
      "Rest `...args`: `function sum(...numbers) {}` gathers variable parameters.",
      "Rest must be the final parameter in a function definition signature.",
    ],
    example: {
      language: "JAVA",
      code: `// Spread: Unpacks array into arguments / elements
const arr = [1, 2, 3];
const newArr = [...arr, 4, 5]; // [1, 2, 3, 4, 5]

// Rest: Packs arguments into an array
function addAll(...nums) {
    return nums.reduce((a, b) => a + b, 0);
}`,
    },
    interviewTip:
      "Distinguish by position: Spread is used in function CALLS or Array/Object LITERALS; Rest is used in function PARAMETER signatures.",
    followUpQuestions: [
      "Does object spread {...obj} create a shallow or deep copy?",
      "Why does rest parameter replace the legacy arguments object?",
    ],
    relatedTopics: ["ES6", "Operators", "Functions"],
    tags: ["Fundamentals", "ES6"],
  },
  {
    topicSlug: "javascript",
    slug: "js-template-literals",
    title: "What are Template Literals and Tagged Template Literals in ES6?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Multiline backtick string interpolation `${expr}` and custom tagged parser functions.",
    shortAnswer:
      "Template Literals (backticks ``` ` ```) allow embedded string interpolation `${expression}` and multiline strings. Tagged Template Literals allow parsing template literals with a custom function tag (`tag\`Hello ${name}\``).",
    detailedExplanation: [
      "Interpolation: Evaluates JS expressions inside `${}`.",
      "Multiline: Preserves line breaks without `\\n` escaping.",
      "Tagged Templates: Function receives raw string literals array as first argument and evaluated `${}` values as subsequent arguments. Used in `styled-components` and SQL sanitizers.",
    ],
    example: {
      language: "JAVA",
      code: `function sanitize(strings, ...values) {
    return strings.reduce((prev, current, i) =>
        prev + current + (values[i] ? String(values[i]).replace(/</g, "&lt;") : ""), ""
    );
}
const user = "<script>";
const safeHTML = sanitize\`User: \${user}\`; // Custom tagged parsing`,
    },
    interviewTip:
      "Mention `styled-components` in React as a famous real-world application of Tagged Template Literals (`styled.div\`color: red;\``).",
    followUpQuestions: [
      "What is String.raw in tagged template literals?",
      "How do template literals improve security against XSS when properly tagged?",
    ],
    relatedTopics: ["ES6", "Strings", "Syntax"],
    tags: ["Fundamentals", "ES6"],
  },
  {
    topicSlug: "javascript",
    slug: "js-shallow-vs-deep-copy",
    title: "How do Shallow Copy and Deep Copy work in JavaScript?",
    difficulty: "MEDIUM",
    subtopic: "Fundamentals",
    synopsis: "Top-level reference copying vs full recursive object cloning.",
    shortAnswer:
      "A Shallow Copy (`{...obj}`, `Object.assign()`) creates a new outer object but retains references to nested child objects. A Deep Copy (`structuredClone()`, `JSON.parse(JSON.stringify())`) recursively clones all nested objects so no references are shared.",
    detailedExplanation: [
      "Shallow Copy Methods: Spread `{...obj}`, `Object.assign({}, obj)`, `array.slice()`, `Array.from()`, `concat()`.",
      "`JSON.parse(JSON.stringify(obj))`: Simple deep copy workaround, BUT fails on `Date`, `RegExp`, `Map`, `Set`, `undefined`, functions, and circular references!",
      "`structuredClone(obj)`: Modern native Web API for deep cloning complex objects, handling cyclic references and standard built-in types.",
    ],
    example: {
      language: "JAVA",
      code: `const orig = { a: 1, nested: { b: 2 } };
const shallow = { ...orig };
shallow.nested.b = 99; // orig.nested.b becomes 99!

const deep = structuredClone(orig);
deep.nested.b = 500; // orig.nested.b remains untouched!`,
    },
    interviewTip:
      "Recommend native `structuredClone()` (ES2022) for deep cloning, calling out the flaws of the legacy `JSON.parse(JSON.stringify())` hack.",
    commonTrap:
      "Using `JSON.parse(JSON.stringify(obj))` on objects containing functions, `undefined`, or circular references (throws `TypeError`).",
    followUpQuestions: [
      "Why does structuredClone fail on DOM nodes and functions?",
      "How to implement custom recursive deepClone function?",
    ],
    relatedTopics: ["Fundamentals", "Objects", "Memory Management"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "javascript",
    slug: "js-es6-classes-vs-constructor-functions",
    title: "How do ES6 Classes work in JavaScript and how do they relate to Constructor Functions?",
    difficulty: "EASY",
    subtopic: "OOP",
    synopsis: "Syntactic sugar over prototypal inheritance.",
    shortAnswer:
      "ES6 Classes (`class Person {}`) are syntactic sugar over JavaScript's existing prototypal inheritance model. Class methods are attached to `Person.prototype`, constructor initializes instance fields, and inheritance uses `extends` / `super()`.",
    detailedExplanation: [
      "Under the Hood: Classes compile down to standard constructor functions and prototype assignments.",
      "Strict Mode: Class bodies execute implicitly in Strict Mode (`'use strict'`).",
      "Non-hoisted: Unlike function declarations, classes are NOT hoisted (TDZ rules apply).",
      "Private Fields: Private instance fields use `#field` syntax (ES2022).",
    ],
    example: {
      language: "JAVA",
      code: `class Person {
    #id = 1; // Private field (ES2022)
    constructor(name) { this.name = name; }
    speak() { console.log("Hi " + this.name); }
}
const p = new Person("Alice");
p.speak(); // "Hi Alice"`,
    },
    interviewTip:
      "Emphasize that JavaScript classes do NOT introduce a new OOP inheritance model—they are purely syntactic sugar over prototypal inheritance.",
    followUpQuestions: [
      "What is private field syntax (#field) in ES2022?",
      "What is static block initialization in ES2022 classes?",
    ],
    relatedTopics: ["OOP", "Prototypes", "ES6"],
    tags: ["OOP", "ES6"],
  },
  {
    topicSlug: "javascript",
    slug: "js-modules-esm-vs-commonjs",
    title: "What is the difference between ES Modules (ESM) and CommonJS (CJS)?",
    difficulty: "MEDIUM",
    subtopic: "Modules",
    synopsis: "Static asynchronous import/export vs dynamic synchronous require/module.exports.",
    shortAnswer:
      "CommonJS (`require()`, `module.exports`) is Node.js's legacy synchronous module system evaluated at runtime. ES Modules (`import`, `export`) is the official ECMAScript standard, loaded asynchronously and parsed statically at compile-time (enabling Tree Shaking).",
    detailedExplanation: [
      "CommonJS (CJS): Synchronous, dynamic imports permitted anywhere in code (`if(cond) require(...)`).",
      "ES Modules (ESM): Static structure (`import` at top level). Enables static analysis and dead-code elimination (Tree Shaking).",
      "Dynamic Imports: ESM supports dynamic asynchronous imports via `import('module.js')` returning a Promise.",
      "Strict Mode: ESM modules are automatically strictly executed.",
    ],
    interviewTip:
      "Highlight Tree Shaking: ESM's static import structure allows bundlers (Webpack, Rollup, Vite) to statically eliminate unused code exports.",
    followUpQuestions: [
      "Why can't you use require() inside pure ES modules?",
      "What is top-level await in ES Modules?",
    ],
    relatedTopics: ["Modules", "Bundling", "Node.js"],
    tags: ["Modules", "ES6"],
  },
  {
    topicSlug: "javascript",
    slug: "js-strict-mode",
    title: "What is Strict Mode ('use strict') in JavaScript and what does it prevent?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Restricted JS execution mode throwing errors for silent gotchas.",
    shortAnswer:
      "Strict Mode (`'use strict'`) opts JavaScript into a restricted execution mode that catches silent errors, prevents accidental global variable creation, forbids duplicate parameter names, and sets default un-bound `this` to `undefined` instead of `window`.",
    detailedExplanation: [
      "Prevents Accidental Globals: Assigning `x = 5` without declaration throws `ReferenceError`.",
      "`this` in Functions: Unbound regular function `this` evaluates to `undefined` instead of global `window`.",
      "Read-Only Safeguard: Assigning to read-only properties throws `TypeError` instead of failing silently.",
      "Forbids `with` statement and `eval` scope pollution.",
    ],
    interviewTip:
      "Note that ES6 Classes and ES Modules execute in Strict Mode automatically.",
    followUpQuestions: [
      "Why is 'with' statement forbidden in strict mode?",
      "How to enable strict mode globally vs function level?",
    ],
    relatedTopics: ["Fundamentals", "Language Core"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "javascript",
    slug: "js-symbols-primitive",
    title: "What is the Symbol primitive type in ES6 and what are its use cases?",
    difficulty: "MEDIUM",
    subtopic: "Fundamentals",
    synopsis: "Unique immutable primitive identifier for non-clashing object keys.",
    shortAnswer:
      "A `Symbol` is a primitive type that guarantees 100% unique, immutable values. Symbols are primarily used as private/unique object property keys to avoid property name collisions across external libraries.",
    detailedExplanation: [
      "Uniqueness: `Symbol('id') !== Symbol('id')` is always `true`.",
      "Non-enumerable: Symbol properties are skipped by `for...in`, `Object.keys()`, and `JSON.stringify()`. Access via `Object.getOwnPropertySymbols(obj)`.",
      "Well-Known Symbols: Built-in engine hooks (`Symbol.iterator`, `Symbol.asyncIterator`, `Symbol.toPrimitive`, `Symbol.hasInstance`).",
    ],
    example: {
      language: "JAVA",
      code: `const ID = Symbol("userId");
const user = {
    name: "Alice",
    [ID]: 12345 // Non-colliding unique property key
};
console.log(user[ID]); // 12345
console.log(Object.keys(user)); // ["name"] (Symbol hidden from keys iteration)`,
    },
    interviewTip:
      "Mention Well-Known Symbols like `Symbol.iterator`: adding `[Symbol.iterator]` method makes custom objects iterable with `for...of` loops!",
    followUpQuestions: [
      "What is Symbol.for() and global Symbol registry?",
      "How does Symbol.iterator make custom objects iterable?",
    ],
    relatedTopics: ["Fundamentals", "ES6", "Prototypes"],
    tags: ["Fundamentals", "ES6"],
  },
  {
    topicSlug: "javascript",
    slug: "js-generators-iterators",
    title: "What are Iterators and Generator Functions (function*, yield) in JavaScript?",
    difficulty: "HARD",
    subtopic: "Language Core",
    synopsis: "Custom iterable protocols, state suspension with yield, and lazy sequence generation.",
    shortAnswer:
      "A Generator (`function*`) is a special function that can pause execution using the `yield` keyword and resume state later when `.next()` is called. Generators return a Generator Iterator object conforming to the Iterator Protocol (`{ value, done }`).",
    detailedExplanation: [
      "State Suspension: `yield` suspends execution and returns a value to caller.",
      "Iterator Protocol: Object with `.next()` returning `{ value: any, done: boolean }`.",
      "Two-Way Communication: Passing values into `.next(val)` sends data back into the generator at the paused `yield` line.",
      "`yield*`: Delegates generation to another generator or iterable.",
    ],
    example: {
      language: "JAVA",
      code: `function* idGenerator() {
    let id = 1;
    while (true) {
        yield id++;
    }
}
const gen = idGenerator();
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2`,
    },
    interviewTip:
      "Highlight lazy evaluation: generators generate infinite sequences on demand with $O(1)$ memory consumption.",
    followUpQuestions: [
      "How do Redux-Saga or async/await build on top of Generators?",
      "Difference between yield and yield*?",
    ],
    relatedTopics: ["Iterators", "Generators", "Async"],
    tags: ["Language Core", "Advanced JS"],
  },
  {
    topicSlug: "javascript",
    slug: "js-service-workers-web-workers",
    title: "What is the difference between Web Workers and Service Workers in JavaScript?",
    difficulty: "MEDIUM",
    subtopic: "Web APIs",
    synopsis: "Background multithreaded CPU computation workers vs network proxy offline caching workers.",
    shortAnswer:
      "A Web Worker runs background scripts on a separate thread to handle heavy CPU tasks without freezing UI rendering. A Service Worker acts as a network proxy sitting between browser and network, enabling offline PWA caching, push notifications, and background sync.",
    detailedExplanation: [
      "Web Worker: Dedicated to a single page tab. Used for heavy math, image parsing, data crunching. Communicates via `postMessage`.",
      "Service Worker: Event-driven network proxy shared across origin tabs. Intercepts fetch requests (`fetch` event) for offline caching (PWA). No direct DOM access.",
    ],
    interviewTip:
      "Clarify DOM access: neither Web Workers nor Service Workers can directly access or mutate DOM elements.",
    followUpQuestions: [
      "How do Progressive Web Apps (PWA) use Service Workers?",
      "How to pass data using Transferable Objects in Web Workers?",
    ],
    relatedTopics: ["Web APIs", "Performance", "PWA"],
    tags: ["Web APIs", "Performance"],
  },
  {
    topicSlug: "javascript",
    slug: "js-localstorage-sessionstorage-cookies",
    title: "What is the difference between localStorage, sessionStorage, and Cookies?",
    difficulty: "EASY",
    subtopic: "Web APIs",
    synopsis: "Client-side web storage mechanisms, capacities, and server transmission properties.",
    shortAnswer:
      "`localStorage` persists data permanently across browser restarts (~5MB). `sessionStorage` persists data only for the duration of the current browser tab session (~5MB). `Cookies` are small key-value pairs (~4KB) automatically sent to the server in HTTP headers with every request.",
    detailedExplanation: [
      "`localStorage`: 5-10MB, no expiration, origin-isolated, synchronous API.",
      "`sessionStorage`: 5MB, destroyed when tab closes, tab-isolated.",
      "`Cookies`: 4KB, optional expiration date, auto-sent in HTTP headers (`Cookie: ...`). Secure flags: `HttpOnly` (blocks JS reading/XSS), `Secure` (HTTPS only), `SameSite` (CSRF defense).",
    ],
    interviewTip:
      "Highlight security: Sensitive authentication JWT tokens should be stored in `HttpOnly` `SameSite` Cookies (NOT `localStorage`) to protect against XSS steal attacks.",
    commonTrap:
      "Storing auth tokens in `localStorage` where any XSS script injection can read `localStorage.getItem('token')`.",
    followUpQuestions: [
      "What is IndexedDB and when should it be used over localStorage?",
      "How does HttpOnly cookie protect against XSS?",
    ],
    relatedTopics: ["Web APIs", "Storage", "Security"],
    tags: ["Web APIs", "Security"],
  },
  {
    topicSlug: "javascript",
    slug: "js-garbage-collection-mark-sweep",
    title: "How does Memory Management and Garbage Collection (Mark-and-Sweep) work in JavaScript?",
    difficulty: "HARD",
    subtopic: "JavaScript Engine",
    synopsis: "Automatic heap memory allocation, reachability tracing from global roots, and memory leaks.",
    shortAnswer:
      "JavaScript automatically manages memory allocation and deallocation using Garbage Collection. The modern V8 engine uses the **Mark-and-Sweep** algorithm: starting from roots (`window`), it marks all reachable objects in memory, and sweeps (deallocates) unmarked unreachable memory objects.",
    detailedExplanation: [
      "Reachability: Objects are kept in memory as long as they are reachable from GC Roots (Global objects, active stack frame local variables).",
      "Mark-and-Sweep Algorithm: 1. Mark phase (traces root references). 2. Sweep phase (reclaims unreachable heap blocks).",
      "Common JS Memory Leaks: 1. Accidental global variables (`x = 5`), 2. Forgotten `setInterval` timers, 3. Detached DOM tree nodes retained in JS variables, 4. Unused closure retention.",
    ],
    interviewTip:
      "Explain detached DOM nodes: if a DOM node is removed from DOM tree but a JS object still holds a reference pointer to it, the entire node sub-tree leaks memory.",
    followUpQuestions: [
      "What is Reference Counting GC algorithm and why was it replaced by Mark-and-Sweep?",
      "How to debug memory leaks using Chrome DevTools Heap Snapshot?",
    ],
    relatedTopics: ["Engine", "Garbage Collection", "Performance"],
    tags: ["Engine", "Performance"],
  },
  {
    topicSlug: "javascript",
    slug: "js-weakref-finalizationregistry",
    title: "What are WeakRef and FinalizationRegistry in modern JavaScript?",
    difficulty: "HARD",
    subtopic: "Language Core",
    synopsis: "Weak object references preventing GC retention and cleanup callback registration.",
    shortAnswer:
      "`WeakRef` (ES2021) allows creating weak references to objects without preventing those objects from being garbage collected. `FinalizationRegistry` allows registering callbacks that execute after a target object has been garbage collected.",
    detailedExplanation: [
      "`WeakRef`: `const ref = new WeakRef(obj)`. Access target via `ref.deref()`. Returns `undefined` if object was GC'd.",
      "`FinalizationRegistry`: `const registry = new FinalizationRegistry(heldValue => {})`. Useful for cleaning up native resources or cache tracking.",
      "Caution: Garbage collection timing is non-deterministic; avoid using `WeakRef` for core architecture logic flow.",
    ],
    interviewTip:
      "Advise caution: `WeakRef` is designed for advanced caching structures—do NOT build core application logic depending on GC cleanup timing.",
    followUpQuestions: [
      "How does WeakRef differ from WeakMap?",
      "Why is garbage collection timing non-deterministic across browser JS engines?",
    ],
    relatedTopics: ["Language Core", "Garbage Collection", "ES6"],
    tags: ["Advanced JS", "Memory"],
  },
  {
    topicSlug: "javascript",
    slug: "js-event-emitter-pattern",
    title: "How to build a custom Event Emitter pattern in JavaScript?",
    difficulty: "MEDIUM",
    subtopic: "Design Patterns",
    synopsis: "Observer pattern implementation managing event subscriptions and emissions.",
    shortAnswer:
      "The Event Emitter pattern implements the Observer pattern, keeping an in-memory dictionary of event names mapped to arrays of callback listener functions, supporting `on(event, listener)`, `off(event, listener)`, and `emit(event, data)`.",
    detailedExplanation: [
      "`on(event, listener)`: Adds callback to event array queue.",
      "`off(event, listener)`: Filters out specified callback from queue.",
      "`emit(event, data)`: Iterates over event listener queue and invokes callbacks with data payload.",
      "`once(event, listener)`: Wraps listener in a one-time wrapper that unsubscribes itself after first emission.",
    ],
    example: {
      language: "JAVA",
      code: `class EventEmitter {
    constructor() { this.events = {}; }
    on(event, listener) {
        (this.events[event] = this.events[event] || []).push(listener);
    }
    emit(event, ...args) {
        (this.events[event] || []).forEach(fn => fn(...args));
    }
    off(event, listener) {
        this.events[event] = (this.events[event] || []).filter(fn => fn !== listener);
    }
}`,
    },
    interviewTip:
      "Writing a custom `EventEmitter` from scratch is one of the most popular live coding challenges in senior JavaScript technical rounds.",
    followUpQuestions: [
      "How to implement once() in EventEmitter?",
      "How does Node.js events.EventEmitter handle memory leak warnings (maxListeners)?",
    ],
    relatedTopics: ["Design Patterns", "Events", "Observer Pattern"],
    tags: ["Design Patterns", "Coding Challenge"],
  },
  {
    topicSlug: "javascript",
    slug: "js-slice-vs-splice",
    title: "What is the difference between array.slice() and array.splice() in JavaScript?",
    difficulty: "EASY",
    subtopic: "Data Structures",
    synopsis: "Non-mutating shallow sub-array extraction vs in-place element insertion and deletion.",
    shortAnswer:
      "`slice(start, end)` returns a shallow copy of a portion of an array without mutating the original array. `splice(start, deleteCount, ...items)` mutates the original array in-place by removing, replacing, or inserting elements.",
    detailedExplanation: [
      "`slice(start, end)`: `end` index is exclusive. Returns new array. Non-mutating.",
      "`splice(start, deleteCount, item1, item2)`: Mutates original source array. Returns array of deleted items.",
    ],
    example: {
      language: "JAVA",
      code: `const arr = [1, 2, 3, 4, 5];
const sliced = arr.slice(1, 3); // [2, 3] (arr unchanged)

const removed = arr.splice(1, 2, 99); // arr becomes [1, 99, 4, 5], removed = [2, 3]`,
    },
    interviewTip:
      "Memory mnemonic: **Splicing** mutates and splices elements into the original array; **Slicing** takes a non-mutating slice out of the array.",
    followUpQuestions: [
      "How to remove an item from an array immutably using slice or filter?",
      "What is toSpliced() in ES2023?",
    ],
    relatedTopics: ["Arrays", "Data Structures"],
    tags: ["Arrays", "Data Structures"],
  },
  {
    topicSlug: "javascript",
    slug: "js-for-in-vs-for-of",
    title: "What is the difference between for...in and for...of loops in JavaScript?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Iterating over object enumerable property keys vs iterating over iterable values.",
    shortAnswer:
      "`for...in` iterates over all enumerable property KEYS (string names) of an object (including prototype chain). `for...of` iterates over the VALUES of an iterable object (Arrays, Strings, Sets, Maps, Generators).",
    detailedExplanation: [
      "`for...in`: Used for Objects. Walks prototype chain (check `hasOwnProperty`!).",
      "`for...of`: Used for Iterables (objects with `[Symbol.iterator]`). Throws `TypeError` if used on non-iterable plain objects.",
    ],
    example: {
      language: "JAVA",
      code: `const arr = ["a", "b", "c"];
for (let key in arr) { console.log(key); }   // "0", "1", "2" (Index keys)
for (let val of arr) { console.log(val); }   // "a", "b", "c" (Values)`,
    },
    interviewTip:
      "Warn: Do NOT use `for...in` to iterate over arrays! It iterates over string array index keys and arbitrary prototype properties in non-guaranteed order.",
    followUpQuestions: [
      "How to make a custom object iterable with for...of?",
      "What is Object.keys() vs for...in?",
    ],
    relatedTopics: ["Fundamentals", "Control Flow", "Iterators"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "javascript",
    slug: "js-object-freeze-vs-seal",
    title: "What is the difference between Object.freeze() and Object.seal() in JavaScript?",
    difficulty: "MEDIUM",
    subtopic: "Objects",
    synopsis: "Preventing element additions/deletions vs preventing property value mutations.",
    shortAnswer:
      "`Object.seal()` prevents adding or deleting properties on an object, but allows mutating existing property values. `Object.freeze()` seals the object AND makes all existing properties read-only (prevents mutation).",
    detailedExplanation: [
      "`Object.seal()`: `configurable: false`. Cannot add/delete keys. CAN edit key values.",
      "`Object.freeze()`: `configurable: false`, `writable: false`. Cannot add/delete keys AND cannot edit key values.",
      "Shallow Immutability: Both `freeze()` and `seal()` are SHALLOW. Nested inner objects remain mutable unless recursively frozen.",
    ],
    interviewTip:
      "Highlight shallow immutability: freezing an object containing a nested object `{ a: { b: 1 } }` does NOT freeze the inner nested object!",
    followUpQuestions: [
      "How to write a deepFreeze utility function?",
      "What is Object.preventExtensions()?",
    ],
    relatedTopics: ["Objects", "Immutability"],
    tags: ["Objects"],
  },
  {
    topicSlug: "javascript",
    slug: "js-optional-chaining-nullish-coalescing",
    title: "How do Optional Chaining (?.) and Nullish Coalescing (??) work in ES2020?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Safe short-circuit property evaluation and null/undefined fallback handling.",
    shortAnswer:
      "Optional Chaining (`?.`) short-circuits property evaluation returning `undefined` if the object reference is `null` or `undefined`. Nullish Coalescing (`??`) returns its right-hand operand ONLY when its left-hand operand evaluates to `null` or `undefined` (unlike `||` which catches all falsy values).",
    detailedExplanation: [
      "`?.`: `user?.address?.city` returns `undefined` without throwing `TypeError: Cannot read properties of undefined`.",
      "`??`: `val ?? fallback` triggers ONLY for `null` or `undefined`.",
      "`||` vs `??`: `0 || 100` yields `100` (coerces `0` as falsy). `0 ?? 100` yields `0` (preserves valid `0` or `''`).",
    ],
    example: {
      language: "JAVA",
      code: `const count = 0;
const qty1 = count || 10; // 10 (0 is falsy for ||)
const qty2 = count ?? 10; // 0  (0 is valid non-nullish value for ??)

const city = user?.address?.city; // Safe navigation`,
    },
    interviewTip:
      "Use `??` over `||` when zero `0`, empty string `''`, or `false` are valid business values you want to preserve.",
    followUpQuestions: [
      "How does optional chaining work with function calls user.getName?.()?",
      "Can optional chaining be used on left-hand assignment target?",
    ],
    relatedTopics: ["ES6", "Operators", "Syntax"],
    tags: ["Fundamentals", "ES6"],
  },
  {
    topicSlug: "javascript",
    slug: "js-pure-functions-side-effects",
    title: "What are Pure Functions and Side Effects in Functional Programming?",
    difficulty: "EASY",
    subtopic: "Functional Programming",
    synopsis: "Deterministic function evaluations without external state mutations.",
    shortAnswer:
      "A Pure Function is a function that given the exact same input arguments will ALWAYS return the exact same output, producing zero side effects (does not mutate external variables, global state, DOM, or make network requests).",
    detailedExplanation: [
      "Determinism: `f(x)` always returns same result `y`.",
      "No Side Effects: Does not modify external variables, database, IO, or global state.",
      "Benefits: Extremely easy to unit test, refactor, memoize, and execute concurrently without race conditions.",
    ],
    interviewTip:
      "Tie pure functions directly to React: React functional components must act as pure functions with respect to their props.",
    followUpQuestions: [
      "Why are pure functions easier to unit test?",
      "What are Referential Transparency and Immutability?",
    ],
    relatedTopics: ["Functional Programming", "Architecture"],
    tags: ["Functional Programming"],
  },
  {
    topicSlug: "javascript",
    slug: "js-first-class-functions",
    title: "What does it mean that functions are 'First-Class Citizens' in JavaScript?",
    difficulty: "EASY",
    subtopic: "Functions",
    synopsis: "Functions treated like standard primitive data variables.",
    shortAnswer:
      "In JavaScript, functions are 'First-Class Citizens' (First-Class Functions), meaning functions can be treated like any other variable: assigned to variables, passed as arguments into other functions, returned from functions, and assigned properties.",
    detailedExplanation: [
      "Variable Assignment: `const greet = function() {};`.",
      "Pass as Argument: `setTimeout(fn, 1000)`.",
      "Return from Function: Higher-Order Functions / Closures (`return () => {}`).",
      "Properties on Functions: Since functions are callable objects, properties can be attached (`fn.myMeta = 1`).",
    ],
    interviewTip:
      "State that First-Class Functions are the foundational pillar enabling Functional Programming, Closures, and Higher-Order Functions in JS.",
    followUpQuestions: [
      "How do First-Class Functions enable higher-order abstractions?",
      "What is the difference between Function Declarations and Function Expressions?",
    ],
    relatedTopics: ["Functions", "Functional Programming"],
    tags: ["Functions"],
  },
  {
    topicSlug: "javascript",
    slug: "js-temporal-dead-zone",
    title: "What is the Temporal Dead Zone (TDZ) in JavaScript?",
    difficulty: "MEDIUM",
    subtopic: "Language Core",
    synopsis: "Time period between scope entry and let/const variable initialization.",
    shortAnswer:
      "The Temporal Dead Zone (TDZ) is the period between entering a scope and the line where a `let` or `const` variable is declared and initialized. Accessing the variable during the TDZ raises a `ReferenceError`.",
    detailedExplanation: [
      "Hoisting Behavior: `let` and `const` ARE hoisted into scope memory during creation phase, BUT remain uninitialized.",
      "TDZ Duration: Starts when execution context scope opens, ends when code execution reaches the `let`/`const` statement line.",
      "Why TDZ Exists: Helps catch programming errors by preventing usage of variables before explicit initialization.",
    ],
    example: {
      language: "JAVA",
      code: `{
    // TDZ for 'value' starts here!
    // console.log(value); // ReferenceError: Cannot access 'value' before initialization
    let value = 42; // TDZ ends here!
}`,
    },
    interviewTip:
      "Correct the misconception: `let` and `const` *are* hoisted, but they enter the TDZ instead of being initialized to `undefined` like `var`.",
    followUpQuestions: [
      "Why does typeof uninitializedLet raise ReferenceError inside TDZ?",
      "How does TDZ affect default parameter values in functions?",
    ],
    relatedTopics: ["Scope", "Hoisting", "Language Core"],
    tags: ["Scope", "Language Core"],
  },
  {
    topicSlug: "javascript",
    slug: "js-shadow-dom-custom-elements",
    title: "What are Web Components, Shadow DOM, and Custom Elements?",
    difficulty: "HARD",
    subtopic: "Web APIs",
    synopsis: "Native browser encapsulation technologies for reusable custom UI components.",
    shortAnswer:
      "Web Components are a set of native browser APIs used to create reusable, encapsulated custom HTML tags. They consist of: 1. Custom Elements (defining HTML tags), 2. Shadow DOM (scoped isolated CSS/DOM tree), and 3. HTML Templates.",
    detailedExplanation: [
      "Custom Elements: `customElements.define('my-button', MyButtonClass)` extending `HTMLElement`.",
      "Shadow DOM: Encapsulates component styles and DOM structure (`element.attachShadow({ mode: 'open' })`), preventing global CSS leaking in or out.",
      "Use Case: Building cross-framework UI design system libraries that run anywhere natively without React/Vue overhead.",
    ],
    interviewTip:
      "Highlight style isolation: Shadow DOM guarantees component CSS rules will never clash with or contaminate global page CSS.",
    followUpQuestions: [
      "What is the difference between Open and Closed Shadow DOM mode?",
      "How do CSS Slots (<slot>) work in Shadow DOM?",
    ],
    relatedTopics: ["Web APIs", "DOM", "Web Components"],
    tags: ["Web APIs", "Architecture"],
  },
  {
    topicSlug: "javascript",
    slug: "js-typeof-vs-instanceof",
    title: "What is the difference between typeof and instanceof operators in JavaScript?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Checking primitive type strings vs checking prototype class chain inheritance.",
    shortAnswer:
      "`typeof` evaluates the primitive data type of an expression returning a string name (`'number'`, `'string'`, `'object'`). `instanceof` checks if a constructor function's `prototype` property exists anywhere in the target object's prototype chain.",
    detailedExplanation: [
      "`typeof operand`: Evaluates primitive types. Caveat: `typeof [] === 'object'`, `typeof null === 'object'`.",
      "`obj instanceof Constructor`: Evaluates prototype chain inheritance (`[] instanceof Array` is `true`).",
      "Array checking best practice: Use `Array.isArray(arr)` instead of `typeof` or `instanceof` (which fails across iframe window boundaries).",
    ],
    example: {
      language: "JAVA",
      code: `console.log(typeof "hello"); // "string"
console.log(typeof []);      // "object"
console.log([] instanceof Array); // true
console.log([] instanceof Object); // true (Array inherits from Object)`,
    },
    interviewTip:
      "Point out iframe gotcha: `instanceof Array` returns `false` for arrays created inside an iframe because each iframe window has a distinct `Array.prototype` constructor!",
    followUpQuestions: [
      "Why does instanceof fail across iframe execution contexts?",
      "How to implement custom Symbol.hasInstance?",
    ],
    relatedTopics: ["Fundamentals", "Operators", "Prototypes"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "javascript",
    slug: "js-eval-security-risks",
    title: "What is the eval() function and why is its use strongly discouraged?",
    difficulty: "EASY",
    subtopic: "Security",
    synopsis: "Dynamic string execution, code injection risks, and compiler performance destruction.",
    shortAnswer:
      "`eval()` evaluates JavaScript code represented as a string. Its use is strongly discouraged because it creates severe Remote Code Execution (RCE) and XSS security vulnerabilities, destroys JIT compiler optimizations, and degrades runtime execution performance.",
    detailedExplanation: [
      "Security Risk: Executing untrusted user input via `eval()` allows malicious arbitrary script execution.",
      "Performance Destruction: Prevents V8 JIT compiler optimizations because variable lookup scopes cannot be determined statically at compile time.",
      "Alternatives: Use `JSON.parse()` for parsing data JSON strings or `Function()` constructor for isolated scope string evaluation.",
    ],
    interviewTip:
      "Remember the web development mantra: **'eval() is evil'**.",
    followUpQuestions: [
      "How does eval() break static variable scoping?",
      "What is the difference between eval() and new Function()?",
    ],
    relatedTopics: ["Security", "Engine", "Performance"],
    tags: ["Security", "Fundamentals"],
  },
  {
    topicSlug: "javascript",
    slug: "js-settimeout-vs-setinterval-vs-requestanimationframe",
    title: "What is the difference between setTimeout, setInterval, and requestAnimationFrame?",
    difficulty: "MEDIUM",
    subtopic: "Web APIs",
    synopsis: "One-shot timer vs recurring interval vs 60fps browser render refresh rate synchronization.",
    shortAnswer:
      "`setTimeout` schedules a task once after a delay. `setInterval` repeatedly schedules a task every N milliseconds. `requestAnimationFrame` (rAF) schedules a callback function to execute right before the browser's next screen repaint (~60fps / 16.6ms), optimizing smooth animations and saving battery when tabs are backgrounded.",
    detailedExplanation: [
      "`setTimeout(fn, delay)`: One-shot macrotask.",
      "`setInterval(fn, delay)`: Recurring macrotask. Gotcha: Callbacks can stack up if execution takes longer than delay!",
      "`requestAnimationFrame(fn)`: Synchronizes with hardware screen refresh rate (60Hz/120Hz). Pauses automatically when tab is hidden, saving CPU/battery.",
    ],
    interviewTip:
      "For recurring tasks, prefer recursive `setTimeout` over `setInterval` to avoid overlapping callback queue stacking when tasks take longer than the interval.",
    followUpQuestions: [
      "Why does setInterval stack up if task execution is slow?",
      "Why is requestAnimationFrame better for CSS layout animations?",
    ],
    relatedTopics: ["Web APIs", "Performance", "Event Loop"],
    tags: ["Web APIs", "Performance"],
  },
  {
    topicSlug: "javascript",
    slug: "js-fetch-api-vs-xhr",
    title: "What is the difference between Fetch API and XMLHttpRequest (XHR)?",
    difficulty: "EASY",
    subtopic: "Web APIs",
    synopsis: "Modern Promise-based HTTP fetching vs legacy event-callback request object.",
    shortAnswer:
      "`Fetch API` is a modern Promise-based standard for making network requests. `XMLHttpRequest` (XHR) is a legacy callback-based API. Fetch is cleaner and stream-friendly, but does not natively track download/upload progress or reject HTTP 404/500 status codes automatically.",
    detailedExplanation: [
      "Promise Native: `fetch()` uses Promises (`await fetch()`); XHR uses event callbacks (`xhr.onload`).",
      "HTTP Error Traps: `fetch()` resolves successfully even for HTTP 404 or 500 errors! It rejects ONLY on network failure or request blocking. Check `response.ok`.",
      "Progress Tracking: XHR supports `xhr.onprogress`; Fetch requires reading `response.body` ReadableStream.",
    ],
    example: {
      language: "JAVA",
      code: `async function loadData() {
    const res = await fetch("/api/data");
    if (!res.ok) throw new Error("HTTP Error " + res.status);
    return await res.json();
}`,
    },
    interviewTip:
      "Call out `fetch` gotcha: `fetch()` does NOT reject on HTTP 404 or 500 status codes! You must check `response.ok` manually.",
    followUpQuestions: [
      "How to cancel a fetch request using AbortController?",
      "How to send cookies automatically with fetch (credentials: 'include')?",
    ],
    relatedTopics: ["Web APIs", "Network", "Promises"],
    tags: ["Web APIs", "Network"],
  },
  {
    topicSlug: "javascript",
    slug: "js-cors-cross-origin-resource-sharing",
    title: "What is CORS (Cross-Origin Resource Sharing) and how does it work?",
    difficulty: "MEDIUM",
    subtopic: "Security",
    synopsis: "Browser same-origin policy enforcement and server access control headers.",
    shortAnswer:
      "CORS is a browser security mechanism enforcing the Same-Origin Policy (SOP). It prevents scripts on origin A (`app.com`) from reading response data fetched from origin B (`api.com`) unless origin B explicitly sends HTTP headers allowing access (`Access-Control-Allow-Origin`).",
    detailedExplanation: [
      "Origin Definition: Combination of **Scheme + Hostname + Port** (e.g. `https://example.com:443`).",
      "Same-Origin Policy (SOP): Restricts client scripts from reading cross-origin responses.",
      "CORS Headers: `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers`.",
    ],
    interviewTip:
      "Clarify: CORS is enforced by the **browser**, not the server! The server actually processes the request, but the browser blocks JavaScript from reading the response if CORS headers are missing.",
    followUpQuestions: [
      "Why doesn't CORS protect non-browser clients like Postman or cURL?",
      "What is a CORS preflight request?",
    ],
    relatedTopics: ["Security", "Network", "Browser APIs"],
    tags: ["Security", "Network"],
  },
  {
    topicSlug: "javascript",
    slug: "js-cors-preflight-options",
    title: "What is a CORS Preflight Request (OPTIONS method)?",
    difficulty: "MEDIUM",
    subtopic: "Security",
    synopsis: "Browser pre-check HTTP OPTIONS request before executing non-simple cross-origin requests.",
    shortAnswer:
      "A Preflight Request is an automatic HTTP `OPTIONS` request sent by the browser before executing a 'non-simple' cross-origin request. It checks whether the target server permits the HTTP method, custom headers, or credentials.",
    detailedExplanation: [
      "Simple Requests (No Preflight): `GET`, `HEAD`, `POST` with standard content-types (`text/plain`, `multipart/form-data`, `application/x-www-form-urlencoded`).",
      "Non-Simple Requests (Triggers Preflight): Requests using `application/json`, custom HTTP headers (`Authorization`), or methods like `PUT`, `DELETE`, `PATCH`.",
      "Preflight Response Headers: `Access-Control-Allow-Origin`, `Access-Control-Max-Age` (caches preflight check).",
    ],
    interviewTip:
      "Mention `Access-Control-Max-Age`: caching preflight OPTIONS responses on the browser reduces unnecessary extra roundtrip latency for web APIs.",
    followUpQuestions: [
      "What conditions classify a request as a Simple Request?",
      "How to debug CORS preflight failures in browser DevTools?",
    ],
    relatedTopics: ["Security", "Network", "REST APIs"],
    tags: ["Security", "Network"],
  },
  {
    topicSlug: "javascript",
    slug: "js-cross-site-scripting-xss",
    title: "What is Cross-Site Scripting (XSS) and how do you prevent it in JavaScript?",
    difficulty: "MEDIUM",
    subtopic: "Security",
    synopsis: "Malicious script injection into web applications and sanitization defenses.",
    shortAnswer:
      "XSS is a security vulnerability where an attacker injects malicious JavaScript into a trusted website, executing in victim browsers. Types include Stored XSS, Reflected XSS, and DOM-based XSS. Prevention requires contextual output encoding, sanitizing HTML (`DOMPurify`), using `textContent` instead of `innerHTML`, and setting Content Security Policy (CSP).",
    detailedExplanation: [
      "Stored XSS: Malicious script stored permanently in database and rendered to users.",
      "Reflected XSS: Malicious payload reflected immediately via URL params.",
      "DOM-based XSS: Malicious script executed via unsafe client DOM sinks (`innerHTML`, `eval`, `document.write`).",
      "Defenses: 1. Sanitize HTML via `DOMPurify`, 2. Avoid `innerHTML` / `dangerouslySetInnerHTML`, 3. Store tokens in `HttpOnly` cookies, 4. Implement strict Content Security Policy (CSP) headers.",
    ],
    interviewTip:
      "Highlight CSP (Content Security Policy) HTTP headers as the ultimate defense-in-depth security layer against XSS.",
    followUpQuestions: [
      "What is Content Security Policy (CSP)?",
      "Difference between textContent and innerHTML security?",
    ],
    relatedTopics: ["Security", "Web Security", "DOM"],
    tags: ["Security", "Web Security"],
  },
  {
    topicSlug: "javascript",
    slug: "js-csrf-cross-site-request-forgery",
    title: "What is Cross-Site Request Forgery (CSRF) and how do SameSite cookies protect against it?",
    difficulty: "MEDIUM",
    subtopic: "Security",
    synopsis: "Unauthorized command execution from malicious third-party sites using auto-attached session cookies.",
    shortAnswer:
      "CSRF is an attack where a malicious website tricks a victim's browser into sending unauthorized requests to a vulnerable site where the user is authenticated, taking advantage of auto-attached cookies. Protections include Anti-CSRF Tokens and `SameSite` cookie attributes (`Strict` or `Lax`).",
    detailedExplanation: [
      "Attack Vector: User logged into `bank.com`. User visits `evil.com`. `evil.com` submits hidden form to `bank.com/transfer`. Browser automatically attaches session cookie!",
      "SameSite Cookies: `SameSite=Strict` (never sends cookie on cross-site requests). `SameSite=Lax` (sends cookie only on top-level GET navigation).",
      "Anti-CSRF Tokens: Server generates unique random token embedded in stateful forms or custom request headers (`X-CSRF-Token`).",
    ],
    interviewTip:
      "State that modern browsers default to `SameSite=Lax`, which drastically reduces default CSRF vulnerability windows across the web.",
    followUpQuestions: [
      "Difference between SameSite=Strict and SameSite=Lax?",
      "Why doesn't CORS protect against CSRF form submissions?",
    ],
    relatedTopics: ["Security", "Cookies", "Web Security"],
    tags: ["Security", "Web Security"],
  },
  {
    topicSlug: "javascript",
    slug: "js-pass-by-value-vs-reference",
    title: "Is JavaScript pass-by-value or pass-by-reference?",
    difficulty: "MEDIUM",
    subtopic: "Fundamentals",
    synopsis: "Primitives passed by value; Objects passed by copy of reference.",
    shortAnswer:
      "JavaScript is strictly pass-by-value. For primitive types, JS passes a copy of the actual value. For objects, JS passes a copy of the reference address pointer (call-by-sharing). Mutating an object property alters the original object, but reassigning the parameter reference has no effect on the caller.",
    detailedExplanation: [
      "Primitive arguments: Value copied. Changes inside function do not affect caller.",
      "Object arguments: Pointer reference copied by value. `obj.prop = 'new'` mutates shared heap object.",
      "Reassignment: `obj = { new: 'val' }` rebinds local parameter reference copy; caller reference is untouched.",
    ],
    example: {
      language: "JAVA",
      code: `function modify(item, list) {
    item = 99;         // Rebinds local primitive copy
    list.push(4);      // Mutates caller object!
    list = [100, 200]; // Rebinds local reference copy
}
let num = 10;
let arr = [1, 2, 3];
modify(num, arr);
console.log(num); // 10
console.log(arr); // [1, 2, 3, 4]`,
    },
    interviewTip:
      "Use the formal CS term 'Call-by-sharing' or 'Pass by copy of reference'.",
    followUpQuestions: [
      "How to prevent object mutation inside functions (Object.freeze)?",
      "What is memory stack vs heap allocation in JS runtime?",
    ],
    relatedTopics: ["Fundamentals", "Memory Management"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "javascript",
    slug: "js-array-isarray",
    title: "Why shouldn't you use typeof to check if a variable is an Array, and why is Array.isArray() preferred?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "typeof [] === 'object' gotcha and cross-realm iframe prototype checks.",
    shortAnswer:
      "`typeof []` returns `'object'` because arrays are instances of Object in JS. `instanceof Array` can fail across distinct iframe window execution contexts. `Array.isArray(val)` is the standard, reliable method to check for arrays across all realms.",
    detailedExplanation: [
      "`typeof []` $\rightarrow$ `'object'`. Does not distinguish array from plain object.",
      "`[] instanceof Array` $\rightarrow$ Fails if array was created in a different iframe/realm window.",
      "`Array.isArray(val)` $\rightarrow$ Safely checks internal `[[Class]]` or Symbol tag across all realms.",
    ],
    interviewTip:
      "Always use `Array.isArray()` when validating arrays in robust library APIs.",
    followUpQuestions: [
      "How to polyfill Array.isArray using Object.prototype.toString.call()?",
      "What is a Realm in JavaScript?",
    ],
    relatedTopics: ["Arrays", "Fundamentals", "Data Types"],
    tags: ["Fundamentals", "Arrays"],
  },
  {
    topicSlug: "javascript",
    slug: "js-object-keys-values-entries",
    title: "How do Object.keys(), Object.values(), and Object.entries() work in JavaScript?",
    difficulty: "EASY",
    subtopic: "Objects",
    synopsis: "Extracting array arrays of own enumerable object keys, values, and tuple pairs.",
    shortAnswer:
      "`Object.keys(obj)` returns an array of an object's own enumerable property names. `Object.values(obj)` returns an array of property values. `Object.entries(obj)` returns an array of key-value pair tuples `[key, value]`.",
    detailedExplanation: [
      "Own Properties Only: Skips prototype chain properties (unlike `for...in`).",
      "Enumerable Only: Skips non-enumerable properties and Symbol keys.",
      "`Object.fromEntries(entries)`: Reconstructs an object from an array of key-value pair tuples.",
    ],
    example: {
      language: "JAVA",
      code: `const user = { name: "Alice", age: 25 };
console.log(Object.keys(user));    // ["name", "age"]
console.log(Object.values(user));  // ["Alice", 25]
console.log(Object.entries(user)); // [["name", "Alice"], ["age", 25]]

// Easy Object transformation pipeline:
const doubled = Object.fromEntries(
    Object.entries({ a: 1, b: 2 }).map(([k, v]) => [k, v * 2])
); // { a: 2, b: 4 }`,
    },
    interviewTip:
      "Combine `Object.entries()` with `Array.prototype.map()` and `Object.fromEntries()` for clean functional object transformations.",
    followUpQuestions: [
      "What is Object.fromEntries() in ES2019?",
      "How to retrieve non-enumerable properties using Object.getOwnPropertyNames()?",
    ],
    relatedTopics: ["Objects", "Arrays", "ES6"],
    tags: ["Objects", "Fundamentals"],
  },
  {
    topicSlug: "javascript",
    slug: "js-void-0-operator",
    title: "What is the void 0 operator in JavaScript and why was it traditionally used?",
    difficulty: "MEDIUM",
    subtopic: "Fundamentals",
    synopsis: "Evaluating expressions to undefined without risk of mutable undefined shadowing.",
    shortAnswer:
      "`void expression` evaluates an expression and unconditionally returns `undefined`. `void 0` was traditionally used to obtain the true `undefined` primitive value because in early JS (ES3), `undefined` was a mutable global property that could be overwritten.",
    detailedExplanation: [
      "ES3 Legacy Vulnerability: Global `undefined` could be overwritten (`window.undefined = 'hacked'`). `void 0` guaranteed safe `undefined` evaluation.",
      "ES5 Fix: In modern JS (ES5+), global `undefined` is a read-only, non-configurable property.",
      "Minifier Usage: Modern JS bundlers and minifiers still replace `undefined` with `void 0` because `void 0` saves bytes (6 characters vs 9 characters).",
    ],
    interviewTip:
      "Mention minification: minifiers convert `undefined` to `void 0` to reduce bundle byte size.",
    followUpQuestions: [
      "How do minifiers optimize code using void 0?",
      "What are Bookmarklets using javascript:void(0)?",
    ],
    relatedTopics: ["Fundamentals", "Minification", "Language History"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "javascript",
    slug: "js-proxy-and-reflect",
    title: "What are Proxy and Reflect API in ES6 and how do they work?",
    difficulty: "HARD",
    subtopic: "Advanced JS",
    synopsis: "Meta-programming traps for object operations and matching atomic reflection methods.",
    shortAnswer:
      "`Proxy` creates an object wrapper that intercepts and customizes fundamental operations on a target object (get, set, deleteProperty) using 'traps'. `Reflect` is a built-in object providing matching atomic reflection methods to perform default internal object operations.",
    detailedExplanation: [
      "Proxy Traps: `get()`, `set()`, `has()`, `deleteProperty()`, `apply()`, `construct()`.",
      "Reflect Companion: `Reflect.get(target, prop, receiver)` forwards operation to default internal JS object behavior.",
      "Framework Core: Vue 3 reactivity system (`reactive()`) and MobX use ES6 `Proxy` to track state changes automatically.",
    ],
    example: {
      language: "JAVA",
      code: `const target = { name: "Alice" };
const handler = {
    get(target, prop, receiver) {
        console.log("Accessing prop: " + prop);
        return Reflect.get(target, prop, receiver);
    }
};
const proxy = new Proxy(target, handler);
console.log(proxy.name); // Logs "Accessing prop: name", returns "Alice"`,
    },
    interviewTip:
      "Highlight real-world framework usage: Vue 3 replaced `Object.defineProperty` with ES6 `Proxy` for fine-grained reactive state tracking.",
    followUpQuestions: [
      "How does Vue 3 reactivity rely on ES6 Proxy?",
      "What are Revocable Proxies (Proxy.revocable)?",
    ],
    relatedTopics: ["Proxy", "Reflect", "Metaprogramming", "ES6"],
    tags: ["Advanced JS", "Metaprogramming"],
  },
  {
    topicSlug: "javascript",
    slug: "js-bigint-primitive",
    title: "What is BigInt primitive in JavaScript and when should you use it?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Arbitrary-precision integer primitive for numbers beyond MAX_SAFE_INTEGER.",
    shortAnswer:
      "`BigInt` (ES2020) is a primitive type that can safely store and operate on arbitrary-precision integers larger than JavaScript's maximum safe integer limit ($2^{53} - 1$, `Number.MAX_SAFE_INTEGER`). BigInt literals end with an `n` suffix (`100n`).",
    detailedExplanation: [
      "Creation: Append `n` suffix (`9007199254740991n`) or call `BigInt('9007199254740991')`.",
      "No Mixed Math: Cannot perform direct arithmetic between `BigInt` and standard `Number` without explicit conversion (`10n + BigInt(5)`).",
      "Use Cases: High-precision financial calculations, 64-bit database IDs, cryptography.",
    ],
    example: {
      language: "JAVA",
      code: `const maxSafe = BigInt(Number.MAX_SAFE_INTEGER); // 9007199254740991n
const huge = maxSafe + 2n; // 9007199254740993n
console.log(typeof huge);  // "bigint"`,
    },
    interviewTip:
      "Warn: `BigInt` cannot be serialized into JSON directly via standard `JSON.stringify()` without a custom replacer function!",
    followUpQuestions: [
      "Why does JSON.stringify throw TypeError on BigInt?",
      "How does IEEE 754 floating-point format cause precision loss above MAX_SAFE_INTEGER?",
    ],
    relatedTopics: ["Fundamentals", "Data Types", "Math"],
    tags: ["Fundamentals"],
  },
];
