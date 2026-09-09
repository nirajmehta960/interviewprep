const fs = require('fs');

const raw = fs.readFileSync('src/lib/data/conceptual.ts', 'utf8');

// Find original java array boundary: 'const java: ConceptualQuestion[] = [' to line before 'const python'
const javaStart = raw.indexOf('const java: ConceptualQuestion[] = [');
const pythonStart = raw.indexOf('const python: ConceptualQuestion[] = [');

// Extract pure java block
let javaPart = raw.substring(javaStart, pythonStart);

// Clean any trailing syntax errors at the end of javaPart
if (javaPart.includes('];')) {
  javaPart = javaPart.substring(0, javaPart.indexOf('];'));
}

// Find original python array boundary: 'const python: ConceptualQuestion[] = ['
let pythonPart = raw.substring(pythonStart);
// Clean pythonPart to remove invalid generated insertions at the bottom
if (pythonPart.includes('/** Every authored conceptual question')) {
  pythonPart = pythonPart.substring(0, pythonPart.indexOf('/** Every authored conceptual question'));
}
if (pythonPart.includes('];')) {
  pythonPart = pythonPart.substring(0, pythonPart.lastIndexOf('];'));
}

// Now let's append our 7 clean Java questions and 6 clean Python questions
const javaNew = `
  {
    topicSlug: "java",
    slug: "java-streams-vs-collections",
    title: "What are Java Streams and how do they differ from Collections?",
    difficulty: "MEDIUM",
    subtopic: "Java 8+",
    synopsis: "In-memory data structures vs lazy, non-storage processing pipelines.",
    shortAnswer:
      "A Collection is an in-memory data structure holding elements that can be iterated over multiple times. A Stream is an un-counted, lazy pipeline of computations over a data source that does not store data, is consumed only once, and supports declarative functional transformations like map, filter, and reduce.",
    detailedExplanation: [
      "**Storage vs Computation.** Collections are about data storage and memory footprint: you add, remove, and query elements. Streams are about computation: you declare what operations to apply without modifying the underlying source.",
      "**Eager vs Lazy.** Collections are eagerly evaluated: elements exist in memory before you interact with them. Streams are lazy: intermediate operations (like filter or map) build an execution pipeline and perform zero work until a terminal operation (like collect or findFirst) is invoked.",
      "**Single-pass consumption.** You can iterate a Collection as many times as you like. A Stream can be traversed only once; calling another operation after a terminal operation throws an IllegalStateException.",
      "**Internal vs External Iteration.** Collections require explicit for loops (external iteration). Streams manage iteration internally, allowing the engine to optimize execution (such as automatic parallelization via parallelStream())."
    ],
    example: {
      language: "JAVA",
      code: "List<String> names = List.of(\\"Alice\\", \\"Bob\\", \\"Charlie\\", \\"David\\");\\n\\n// Collection: eager, external iteration\\nList<String> upperList = new ArrayList<>();\\nfor (String n : names) {\\n    if (n.length() > 3) upperList.add(n.toUpperCase());\\n}\\n\\n// Stream: lazy, declarative functional pipeline\\nList<String> upperStream = names.stream()\\n    .filter(name -> name.length() > 3)\\n    .map(String::toUpperCase)\\n    .collect(Collectors.toList());"
    },
    interviewTip:
      "A great candidate emphasizes short-circuiting and laziness: findFirst() on a stream over 1,000,000 items stops evaluating the moment a match is found, whereas a naive collection transform processes all items upfront. Also mention that parallel streams must avoid shared mutable state.",
    commonTrap:
      "Reusing a stream instance after a terminal operation has already executed. Always create a fresh stream pipeline.",
    followUpQuestions: [
      "What is the difference between intermediate and terminal operations?",
      "How does short-circuiting work in Java Streams?",
      "When should you NOT use parallelStreams?"
    ],
    relatedTopics: ["Java 8+", "Streams", "Collections", "Lambda Expressions"],
    tags: ["Java 8+", "Streams", "Functional Programming"]
  },
  {
    topicSlug: "java",
    slug: "abstract-class-vs-interface",
    title: "What is the difference between an Abstract Class and an Interface in Java 8+?",
    difficulty: "MEDIUM",
    subtopic: "OOP",
    synopsis: "Is-a stateful hierarchy vs can-do behavior contracts with default methods.",
    shortAnswer:
      "An Abstract Class defines an 'is-a' relationship with single inheritance, state (instance fields), constructors, and access modifiers. An Interface defines a 'can-do' contract supporting multiple inheritance, default methods, static methods, and public static final constants, but cannot hold instance state.",
    detailedExplanation: [
      "**State and Fields.** Abstract classes can declare instance variables, instance initializers, and non-final fields. Interfaces can only hold public static final constants.",
      "**Inheritance.** A class can extend only one Abstract Class (single inheritance), but can implement multiple Interfaces (multiple inheritance of behavior).",
      "**Constructors and Access Modifiers.** Abstract classes can have constructors (invoked by subclass super()) and methods with protected or private visibility. Interface methods default to public (with private methods allowed in Java 9 for internal reuse).",
      "**Java 8+ Default Methods.** Since Java 8, interfaces can provide concrete default method implementations (default void log() { ... }), blurring the line with abstract classes. However, default methods cannot access instance state."
    ],
    example: {
      language: "JAVA",
      code: "// Abstract Class: stores state, single inheritance\\nabstract class Animal {\\n    protected String name;\\n    public Animal(String name) { this.name = name; }\\n    abstract void makeSound();\\n}\\n\\n// Interface: contract & behavior, multiple inheritance\\ninterface Swimmer {\\n    default void swim() {\\n        System.out.println(\\"Swimming in water...\\");\\n    }\\n}\\n\\nclass Duck extends Animal implements Swimmer {\\n    public Duck(String name) { super(name); }\\n    @Override void makeSound() { System.out.println(\\"Quack\\"); }\\n}"
    },
    interviewTip:
      "Draw the architectural boundary clearly: use Abstract Classes when sharing code and state among closely related subclasses; use Interfaces to define capabilities across unrelated classes (e.g. Runnable, Comparable, Serializable).",
    commonTrap:
      "Thinking default methods in Java 8 make abstract classes obsolete. Default methods cannot hold instance variables.",
    followUpQuestions: [
      "How does Java resolve default method conflicts in multiple interface inheritance?",
      "Why were private methods added to interfaces in Java 9?",
      "What is a functional interface?"
    ],
    relatedTopics: ["OOP", "Interfaces", "Abstraction", "Java 8+"],
    tags: ["OOP", "Design"]
  },
  {
    topicSlug: "java",
    slug: "final-finally-finalize",
    title: "What is the difference between final, finally, and finalize?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Immutability modifier, exception cleanup block, and deprecated GC hook.",
    shortAnswer:
      "final is a keyword/modifier used to prevent reassignment (variables), method overriding, or class inheritance. finally is a block used in try-catch structures to guarantee resource cleanup. finalize() is a deprecated method on java.lang.Object called by the GC before reclaiming an object.",
    detailedExplanation: [
      "**final (Modifier).** Variable: Makes a primitive value unmodifiable or reference un-reassignable. Method: Prevents overriding. Class: Prevents inheritance.",
      "**finally (Exception Handling).** Executes regardless of whether an exception was thrown or caught. Used for resource cleanup.",
      "**finalize() (GC Cleanup - Deprecated).** Called by Garbage Collector prior to deallocation. It is unpredictable, deprecated in Java 9, and removed in modern Java."
    ],
    example: {
      language: "JAVA",
      code: "public final class ImmutableHolder {\\n    private final List<String> items = new ArrayList<>();\\n\\n    public void process() {\\n        try {\\n            System.out.println(\\"Processing...\\");\\n        } catch (Exception e) {\\n            System.err.println(\\"Error: \\" + e.getMessage());\\n        } finally {\\n            System.out.println(\\"Always executes!\\");\\n        }\\n    }\\n}"
    },
    interviewTip:
      "When discussing final variables, clarify that final List<String> prevents reassigning the list reference to a new list, but elements can still be added or removed from the list.",
    commonTrap:
      "Thinking finally ALWAYS executes. If System.exit(0) is called or JVM crashes, finally will not run.",
    followUpQuestions: [
      "Does a final object reference make the object immutable?",
      "What happens if System.exit(0) is called inside a try block?",
      "Why was finalize() deprecated?"
    ],
    relatedTopics: ["Fundamentals", "Exception Handling", "Garbage Collection"],
    tags: ["Fundamentals", "Exception Handling"]
  },
  {
    topicSlug: "java",
    slug: "synchronized-vs-lock",
    title: "What is the difference between synchronized keyword and ReentrantLock?",
    difficulty: "MEDIUM",
    subtopic: "Multithreading",
    synopsis: "Implicit block-scoped locking vs explicit tryLock & fair concurrency control.",
    shortAnswer:
      "synchronized is an implicit, block-scoped language construct tied to an object's intrinsic monitor. ReentrantLock is an explicit java.util.concurrent API offering advanced capabilities like non-blocking tryLock(), timed acquisition, fair locking policies, and multiple Condition variables.",
    detailedExplanation: [
      "**Control & Scope.** synchronized locks and unlocks implicitly around a method or block. ReentrantLock requires explicit lock.lock() and lock.unlock() calls inside a finally block.",
      "**Non-blocking & Timed Acquisition.** ReentrantLock provides tryLock() and tryLock(timeout, unit) to attempt lock acquisition without blocking indefinitely.",
      "**Fairness Policy.** ReentrantLock accepts a fairness parameter (new ReentrantLock(true)) to grant lock access to the longest-waiting thread.",
      "**Conditions.** synchronized uses single wait/notify per monitor. ReentrantLock supports multiple Condition objects for targeted thread signaling."
    ],
    example: {
      language: "JAVA",
      code: "ReentrantLock lock = new ReentrantLock(true);\\nCondition notFull = lock.newCondition();\\n\\npublic void doWork() {\\n    if (lock.tryLock()) {\\n        try {\\n            // Critical section\\n        } finally {\\n            lock.unlock();\\n        }\\n    } else {\\n        System.out.println(\\"Lock busy, performing fallback task\\");\\n    }\\n}"
    },
    interviewTip:
      "Always emphasize putting lock.unlock() in a finally block! If an exception is thrown without a finally block, the lock remains held forever.",
    commonTrap:
      "Forgetting to call unlock() in a finally block when using ReentrantLock.",
    followUpQuestions: [
      "What is a reentrant lock?",
      "How does tryLock() prevent deadlocks?",
      "Difference between notify() and Condition.signal()?"
    ],
    relatedTopics: ["Multithreading", "Concurrency", "JVM"],
    tags: ["Multithreading", "Concurrency"]
  },
  {
    topicSlug: "java",
    slug: "volatile-keyword-java",
    title: "What does the volatile keyword do in Java?",
    difficulty: "HARD",
    subtopic: "Multithreading",
    synopsis: "Memory visibility and instruction reordering prevention vs atomicity.",
    shortAnswer:
      "The volatile keyword guarantees memory visibility by forcing reads and writes directly to main memory rather than CPU caches. It also establishes a happens-before relationship that prevents compiler/CPU instruction reordering, but it does NOT guarantee atomicity for compound operations (like count++).",
    detailedExplanation: [
      "**Visibility Guarantee.** Without volatile, threads caching a variable in CPU registers/caches might not see updates written by another thread. volatile flushes writes to main memory immediately.",
      "**Instruction Reordering (Happens-Before).** The compiler and CPU reorder instructions for performance. volatile creates a memory barrier: writes cannot be reordered before preceding writes.",
      "**Lack of Atomicity.** volatile boolean flag is safe for single-writer flag checks. However, compound operations like count++ are NOT atomic and require AtomicInteger or synchronized."
    ],
    example: {
      language: "JAVA",
      code: "public class WorkerThread extends Thread {\\n    private volatile boolean running = true;\\n\\n    public void run() {\\n        while (running) {\\n            // Work\\n        }\\n    }\\n\\n    public void stopWorker() {\\n        this.running = false;\\n    }\\n}"
    },
    interviewTip:
      "A classical question is 'Why is count++ not safe with volatile?'. Explain that count++ compiles into 3 separate bytecode instructions (getfield, iadd, putfield).",
    commonTrap:
      "Using volatile for counter variables expecting thread safety. Use AtomicInteger instead.",
    followUpQuestions: [
      "What is the Java Memory Model (JMM) happens-before relationship?",
      "How does volatile compare to AtomicInteger?",
      "What is Double-Checked Locking and why does it require volatile?"
    ],
    relatedTopics: ["Multithreading", "Concurrency", "JVM", "Java Memory Model"],
    tags: ["Multithreading", "Concurrency", "JVM"]
  },
  {
    topicSlug: "java",
    slug: "string-stringbuilder-stringbuffer",
    title: "What is the difference between String, StringBuilder, and StringBuffer?",
    difficulty: "EASY",
    subtopic: "Strings",
    synopsis: "Immutability vs mutable thread-safe vs mutable thread-unsafe performance.",
    shortAnswer:
      "String is immutable: every modification creates a new object in memory. StringBuilder is mutable and unsynchronized, making it fast for single-threaded string manipulation. StringBuffer is mutable and synchronized, offering thread safety at the cost of performance overhead.",
    detailedExplanation: [
      "**String (Immutable).** Any concatenation (s += \\"a\\") allocates a new String object, making string loops inefficient.",
      "**StringBuilder (Mutable, Unsynchronized).** Modifies an internal dynamic char/byte array in-place without creating new objects.",
      "**StringBuffer (Mutable, Synchronized).** Methods are thread-safe (synchronized). Used when multiple threads mutate the same string buffer."
    ],
    example: {
      language: "JAVA",
      code: "// Slow: Creates 1000 String objects\\nString s = \\"\\";\\nfor (int i = 0; i < 1000; i++) s += i;\\n\\n// Fast: Modifies internal array in-place\\nStringBuilder sb = new StringBuilder();\\nfor (int i = 0; i < 1000; i++) sb.append(i);\\nString result = sb.toString();"
    },
    interviewTip:
      "Note that since Java 5, the compiler automatically converts simple string concatenations into StringBuilder calls. However, inside explicit for loops, manual StringBuilder is mandatory.",
    commonTrap:
      "Using StringBuffer everywhere out of habit. In 99% of single-threaded scenarios, StringBuilder is preferred.",
    followUpQuestions: [
      "How does String Constant Pool optimization work?",
      "What is String Interning?",
      "How does Java 9 Compact Strings optimize memory?"
    ],
    relatedTopics: ["Strings", "Fundamentals", "Performance"],
    tags: ["Strings", "Fundamentals"]
  },
  {
    topicSlug: "java",
    slug: "checked-vs-unchecked-exceptions",
    title: "What is the difference between Checked and Unchecked Exceptions in Java?",
    difficulty: "EASY",
    subtopic: "Exception Handling",
    synopsis: "Compile-time enforced recovery vs runtime programming logic bugs.",
    shortAnswer:
      "Checked exceptions (subclasses of Exception excluding RuntimeException) are checked at compile-time and must be handled via try-catch or declared via throws. Unchecked exceptions (subclasses of RuntimeException or Error) represent logical programming bugs or system failures checked at runtime.",
    detailedExplanation: [
      "**Checked Exceptions.** Represent recoverable conditions outside application control (e.g., IOException, SQLException). The compiler forces mandatory handling.",
      "**Unchecked Exceptions (RuntimeException).** Represent programming flaws or invalid API usage (e.g., NullPointerException, IllegalArgumentException).",
      "**Errors.** Subclasses of java.lang.Error (e.g. OutOfMemoryError) represent catastrophic system-level failures."
    ],
    example: {
      language: "JAVA",
      code: "// Checked Exception\\npublic void readFile(String path) throws IOException {\\n    FileReader file = new FileReader(path);\\n}\\n\\n// Unchecked Exception\\npublic void processName(String name) {\\n    if (name == null) throw new IllegalArgumentException(\\"Name cannot be null\\");\\n}"
    },
    interviewTip:
      "Modern frameworks (like Spring) favor Unchecked Exceptions to reduce boilerplate throws declarations while wrapping infrastructure errors in clean runtime exceptions.",
    commonTrap:
      "Catching java.lang.Error or Exception broadly without specific handling.",
    followUpQuestions: [
      "Why does Spring framework wrap checked exceptions into unchecked exceptions?",
      "What is try-with-resources and AutoCloseable?",
      "What is exception suppression in Java 7+?"
    ],
    relatedTopics: ["Exception Handling", "Fundamentals"],
    tags: ["Exception Handling"]
  }
`;

const pythonNew = `
  {
    topicSlug: "python",
    slug: "is-vs-double-equals-python",
    title: "What is the difference between 'is' and '==' in Python?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Object identity (memory address) vs value equality (__eq__).",
    shortAnswer:
      "'is' checks object identity: whether two variables point to the exact same memory address in RAM (id(a) == id(b)). '==' checks value equality: whether the values of two objects are logically equal as evaluated by their __eq__() method.",
    detailedExplanation: [
      "**Identity ('is').** Compares object pointers. a is b is True if and only if id(a) == id(b). It evaluates memory addresses.",
      "**Equality ('==').** Invokes the left operand's __eq__() method. Two distinct list instances in memory with identical elements will return True for ==, but False for is.",
      "**Integer & String Interning Trap.** CPython caches small integers (-5 to 256) and short string literals. Always use == for value comparisons!"
    ],
    example: {
      language: "PYTHON",
      code: "a = [1, 2, 3]\\nb = [1, 2, 3]\\nc = a\\n\\na == b  # True  — values are identical\\na is b  # False — distinct objects in memory\\na is c  # True  — point to same object\\n\\nx = 256\\ny = 256\\nx is y  # True (small integer cached)"
    },
    interviewTip:
      "Singletons like None should always be checked with is (if x is None:), because is cannot be overloaded by custom class __eq__ methods and is faster.",
    commonTrap:
      "Using is to compare numbers or strings (if name is 'Alice':). Use == for value comparisons.",
    followUpQuestions: [
      "Why is 'if x is None' preferred over 'if x == None'?",
      "How does object interning work in CPython?",
      "How can you override '==' behavior in custom classes?"
    ],
    relatedTopics: ["Python Fundamentals", "Memory Management", "Data Types"],
    tags: ["Fundamentals", "Data Types"]
  },
  {
    topicSlug: "python",
    slug: "legb-rule-scope",
    title: "What is the LEGB rule for variable scope in Python?",
    difficulty: "EASY",
    subtopic: "Functions & Scope",
    synopsis: "Local ➔ Enclosing ➔ Global ➔ Built-in variable resolution hierarchy.",
    shortAnswer:
      "LEGB defines Python's 4-tier variable lookup hierarchy: Local (inside current function), Enclosing (nested outer functions), Global (module level), and Built-in (python keywords & functions like len, range). Python searches these scopes in order from L to E to G to B.",
    detailedExplanation: [
      "**L — Local.** Variables defined inside the current function body.",
      "**E — Enclosing.** Names in the local scope of enclosing/nested functions (closures).",
      "**G — Global.** Module-level variables defined at the top of a file.",
      "**B — Built-in.** Python built-in modules containing functions like print(), len(), ValueError.",
      "**Modifying Outer Scopes.** Reassigning a global variable inside a function requires the global keyword. Modifying an enclosing function variable requires nonlocal."
    ],
    example: {
      language: "PYTHON",
      code: "x = \\"Global\\"\\n\\ndef outer():\\n    x = \\"Enclosing\\"\\n    def inner():\\n        nonlocal x\\n        x = \\"Modified Enclosing\\"\\n        print(\\"Local:\\", x)\\n    inner()\\n    print(\\"Outer:\\", x)\\n\\nouter()"
    },
    interviewTip:
      "Shadowing built-ins is a common interview trap: if you name a variable list = [1, 2], you shadow the built-in function list(), causing unexpected TypeError later.",
    commonTrap:
      "Trying to reassign a global or enclosing variable inside a function without declaring global or nonlocal first.",
    followUpQuestions: [
      "What is the difference between global and nonlocal keywords?",
      "What is a Python closure?",
      "What happens when you shadow a built-in function?"
    ],
    relatedTopics: ["Functions & Scope", "Python Fundamentals"],
    tags: ["Functions", "Scope"]
  },
  {
    topicSlug: "python",
    slug: "context-managers-with-statement",
    title: "What are context managers and how does the 'with' statement work?",
    difficulty: "MEDIUM",
    subtopic: "File Handling",
    synopsis: "Deterministic resource acquisition and cleanup via __enter__ and __exit__.",
    shortAnswer:
      "A context manager is a Python object that manages resource allocation and cleanup using the 'with' statement. It guarantees that cleanup code executes via __exit__() even if exceptions occur, avoiding resource leaks like open files or un-released locks.",
    detailedExplanation: [
      "**Protocol.** Any class implementing __enter__(self) and __exit__(self, exc_type, exc_val, exc_tb) is a context manager.",
      "**Execution Flow.** Upon entering a with block, __enter__() runs and its return value is bound to the target variable. Upon exiting the block, __exit__() executes automatically.",
      "**Exception Handling.** If an exception occurs inside the block, it is passed to __exit__(). If __exit__() returns True, the exception is suppressed; otherwise it propagates.",
      "**contextlib.** The @contextmanager decorator in contextlib allows creating context managers using a simple generator function with a yield statement."
    ],
    example: {
      language: "PYTHON",
      code: "from contextlib import contextmanager\\n\\nclass ManagedFile:\\n    def __init__(self, filename): self.filename = filename\\n    def __enter__(self):\\n        self.file = open(self.filename, 'w')\\n        return self.file\\n    def __exit__(self, exc_type, exc_val, exc_tb):\\n        if self.file: self.file.close()\\n\\n@contextmanager\\ndef custom_resource():\\n    print(\\"Acquiring resource...\\")\\n    yield \\"RESOURCE\\"\\n    print(\\"Cleaning up resource...\\")"
    },
    interviewTip:
      "Mention that context managers are useful for far more than opening files: acquiring DB connections, setting temporary environment configs, and acquiring threading locks (with lock:).",
    commonTrap:
      "Forgetting that __exit__ MUST handle cleanup even when an exception occurs.",
    followUpQuestions: [
      "How do you suppress exceptions inside a context manager?",
      "How does contextlib.contextmanager work internally?",
      "What is ContextDecorator?"
    ],
    relatedTopics: ["File Handling", "Memory Management", "Decorators"],
    tags: ["File Handling", "Resource Management"]
  },
  {
    topicSlug: "python",
    slug: "property-decorator-getters-setters",
    title: "How does @property work in Python for getters and setters?",
    difficulty: "MEDIUM",
    subtopic: "OOP",
    synopsis: "Pythonic encapsulation using descriptors instead of Java-style get_x() methods.",
    shortAnswer:
      "@property is a built-in decorator that transforms a class method into a read-only property attribute. Combined with @<name>.setter and @<name>.deleter, it enables clean Pythonic getters and setters without breaking public attribute access syntax.",
    detailedExplanation: [
      "**Pythonic Encapsulation.** In Python, public attributes are accessed directly (obj.voltage). If validation logic is needed later, @property converts the attribute into a descriptor without changing caller syntax (obj.voltage = 12 instead of obj.set_voltage(12)).",
      "**Descriptors under the hood.** property implements the descriptor protocol (__get__, __set__, __delete__).",
      "**Validation & Read-Only.** Omitting the setter creates a read-only attribute that throws an AttributeError if mutated."
    ],
    example: {
      language: "PYTHON",
      code: "class Celsius:\\n    def __init__(self, temp=0): self._temp = temp\\n\\n    @property\\n    def temp(self): return self._temp\\n\\n    @temp.setter\\n    def temp(self, val):\\n        if val < -273.15: raise ValueError(\\"Temperature below absolute zero!\\")\\n        self._temp = val\\n\\nc = Celsius(25)\\nc.temp = 30"
    },
    interviewTip:
      "Distinguish Python's philosophy from Java: Python does NOT recommend writing explicit getters/setters upfront (get_name(), set_name()). Start with public attributes and refactor to @property only when validation or computation is required.",
    commonTrap:
      "Naming the underlying private instance attribute the same name as the property (self.temp = temp inside temp.setter), causing infinite recursion stack overflow.",
    followUpQuestions: [
      "What is the descriptor protocol in Python?",
      "How do you create a read-only property?",
      "Difference between @property and cached_property?"
    ],
    relatedTopics: ["OOP", "Decorators", "Python Fundamentals"],
    tags: ["OOP", "Decorators"]
  },
  {
    topicSlug: "python",
    slug: "multiprocessing-vs-multithreading-python",
    title: "What is the difference between multiprocessing and threading in Python?",
    difficulty: "HARD",
    subtopic: "Multithreading",
    synopsis: "Shared memory I/O concurrency vs isolated process CPU parallelism bypassing GIL.",
    shortAnswer:
      "threading uses OS threads in a single process with shared memory, suitable for I/O-bound tasks (network, disk) but restricted by the GIL to 1 active CPU core. multiprocessing spawns separate Python interpreter processes with isolated memory spaces, running across multiple CPU cores for CPU-bound tasks.",
    detailedExplanation: [
      "**GIL Constraint.** CPython's Global Interpreter Lock permits only one thread to execute Python bytecode at a time. Therefore, threading CANNOT speed up CPU-heavy computations.",
      "**I/O-Bound vs CPU-Bound.** threading is ideal for I/O-bound tasks where threads spend time waiting for network/disk responses. multiprocessing is ideal for CPU-heavy tasks (image processing, math).",
      "**Memory & Overhead.** Threads share memory easily. Processes have separate memory spaces, requiring IPC (Queues, Pipes, SharedMemory) and higher startup overhead."
    ],
    example: {
      language: "PYTHON",
      code: "from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor\\nimport time\\n\\ndef io_task(url): time.sleep(1); return \\"Done\\"\\ndef cpu_task(n): return sum(i * i for i in range(n))\\n\\nwith ThreadPoolExecutor(max_workers=4) as ex:\\n    res = list(ex.map(io_task, [\\"url1\\", \\"url2\\"]))\\n\\nwith ProcessPoolExecutor(max_workers=4) as ex:\\n    res = list(ex.map(cpu_task, [10**7, 10**7]))"
    },
    interviewTip:
      "If asked how to choose: 'Use threading or asyncio for I/O-bound tasks; use multiprocessing for CPU-bound tasks.' Mention concurrent.futures as the modern API abstraction.",
    commonTrap:
      "Using threading to speed up heavy mathematical calculations expecting multi-core performance gains.",
    followUpQuestions: [
      "How do processes communicate in multiprocessing?",
      "What is asyncio and how does it compare to threading?",
      "Why is process creation slower on Windows than Unix (fork vs spawn)?"
    ],
    relatedTopics: ["Multithreading", "Multiprocessing", "GIL", "Performance"],
    tags: ["Multithreading", "Concurrency", "Performance"]
  },
  {
    topicSlug: "python",
    slug: "dunder-methods-magic-methods",
    title: "What are magic (dunder) methods and how do they enable operator overloading?",
    difficulty: "MEDIUM",
    subtopic: "OOP",
    synopsis: "Double-underscore methods hooking into Python syntax and built-in functions.",
    shortAnswer:
      "Dunder (double underscore) methods like __init__, __str__, __len__, and __add__ are special hook methods in Python. They allow custom user-defined classes to integrate seamlessly with Python built-in functions (len(), str()) and syntax operators (+, ==, [], in).",
    detailedExplanation: [
      "**Operator Overloading.** Implementing __add__(self, other) enables the + operator; __eq__ enables ==; __getitem__ enables indexing obj[key].",
      "**Built-in Functions.** Calling len(obj) invokes obj.__len__(); str(obj) invokes obj.__str__(); iter(obj) invokes obj.__iter__().",
      "**String Representation.** __repr__ provides an unambiguous developer representation (ideally valid python code); __str__ provides a friendly user display."
    ],
    example: {
      language: "PYTHON",
      code: "class Vector:\\n    def __init__(self, x, y): self.x = x; self.y = y\\n    def __add__(self, other): return Vector(self.x + other.x, self.y + other.y)\\n    def __repr__(self): return f\\"Vector({self.x}, {self.y})\\"\\n    def __eq__(self, other): return self.x == other.x and self.y == other.y\\n\\nv1 = Vector(2, 4)\\nv2 = Vector(1, 3)\\nprint(v1 + v2)"
    },
    interviewTip:
      "Remember: __str__ is for end-users, __repr__ is for developers/debugging. If __str__ is not defined, Python falls back to __repr__.",
    commonTrap:
      "Directly calling obj.__len__() in application code instead of the built-in len(obj).",
    followUpQuestions: [
      "What is the difference between __str__ and __repr__?",
      "How does __getitem__ enable slicing and iteration?",
      "What is __call__ and how does it make instances callable?"
    ],
    relatedTopics: ["OOP", "Python Fundamentals", "Data Types"],
    tags: ["OOP", "Fundamentals"]
  }
`;

const updatedContent = javaPart + ',\n' + javaNew + '\n];\n\n' + pythonPart + ',\n' + pythonNew + '\n];\n\n/** Every authored conceptual question, in stable per-topic order. */\nexport const conceptualQuestions: ConceptualQuestion[] = [...java, ...python];\n';

fs.writeFileSync('src/lib/data/conceptual.ts', updatedContent);
console.log('Successfully updated conceptual.ts cleanly!');
