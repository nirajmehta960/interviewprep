import type { ConceptualQuestion } from "../conceptual";

export const javaQuestions: ConceptualQuestion[] = [
  {
    topicSlug: "java",
    slug: "what-is-java",
    title: "What is Java?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "The one-paragraph definition, and why the JVM is the part that matters.",
    shortAnswer:
      "Java is a statically typed, object-oriented, class-based language that compiles to platform-independent bytecode rather than native machine code. That bytecode runs on the Java Virtual Machine, which is what gives Java its 'write once, run anywhere' property.",
    detailedExplanation: [
      "Java sits in a deliberate middle ground. Unlike C or C++, it does not compile straight to machine instructions for one processor; unlike a purely interpreted language, it does not re-read source text at run time. Instead `javac` compiles `.java` source into `.class` files containing **bytecode** — a compact instruction set for an abstract machine that no physical CPU implements.",
      "The Java Virtual Machine then executes that bytecode. Because a JVM exists for Linux, Windows, macOS and more, the same `.class` file runs unchanged everywhere a JVM is available. Portability is therefore a property of the JVM, not of the language syntax.",
      "Three other decisions define the language in practice: It is **statically typed**, has **automatic memory management** via garbage collection, and is **class-based object-oriented**.",
      "Modern Java is also no longer purely interpreted. The JVM's just-in-time compiler watches which bytecode runs hot and compiles those paths to native code at run time.",
    ],
    interviewTip:
      "The interviewer is checking whether you understand that portability comes from the JVM rather than from the language syntax. Mention JIT compilation to signal architectural depth.",
    commonTrap:
      "Calling Java 'fully interpreted'. It compiles ahead of time to bytecode and then JIT-compiles hot paths to native code at run time.",
    followUpQuestions: [
      "What happens when you run a Java program?",
      "What is bytecode?",
      "Why is Java platform independent?",
      "What is the role of the JVM?",
    ],
    relatedTopics: ["JVM", "JRE", "JDK", "Java Compilation", "Bytecode"],
    tags: ["Fundamentals", "JVM"],
  },
  {
    topicSlug: "java",
    slug: "java-main-features",
    title: "What are the main features of Java?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "The features worth naming, each with the reason it exists.",
    shortAnswer:
      "Platform independence through bytecode and the JVM, object orientation, automatic garbage collection, strong static typing, built-in multithreading, and a large standard library.",
    detailedExplanation: [
      "**Platform independence.** Source compiles to bytecode; any JVM runs it.",
      "**Object oriented.** Everything except primitives is an object. The language enforces encapsulation, inheritance, polymorphism, and abstraction.",
      "**Automatic memory management.** The garbage collector reclaims unreachable objects, eliminating manual-free memory bugs.",
      "**Strong static typing.** Types are checked at compile time, eliminating a large class of runtime errors.",
      "**Multithreading.** `Thread`, `synchronized`, and `java.util.concurrent` are built into the platform.",
    ],
    interviewTip:
      "Attach a reason to each feature — 'garbage collection, which removes manual-free bugs at the cost of pause times' says far more than the word 'garbage collection' alone.",
    followUpQuestions: [
      "Which of these features has the biggest performance cost?",
      "What does the JVM actually guarantee about thread visibility?",
      "How do generics improve on pre-Java-5 collections?",
    ],
    relatedTopics: ["JVM", "Garbage Collection", "Generics", "Multithreading"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "java",
    slug: "jdk-jre-jvm-difference",
    title: "What is the difference between JDK, JRE, and JVM?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Three nested layers: the JDK builds, the JRE runs, the JVM executes.",
    shortAnswer:
      "They are three nested layers. The JVM is the abstract machine that executes bytecode. The JRE is the JVM plus the standard class libraries — everything needed to run a Java program. The JDK is the JRE plus development tools such as the javac compiler — everything needed to build one.",
    detailedExplanation: [
      "**JVM (Java Virtual Machine).** Specification and runtime engine that loads and executes bytecode.",
      "**JRE (Java Runtime Environment).** JVM + Core Class Libraries. Needed to run Java applications.",
      "**JDK (Java Development Kit).** JRE + Development Tools (`javac`, `javadoc`, `jar`, `jdb`). Needed to build Java applications.",
      "The containment is strict: **JDK ⊃ JRE ⊃ JVM**.",
    ],
    example: {
      language: "JAVA",
      code: "// Compiling needs JDK (javac)\n// Running needs JRE (contains JVM)\npublic class Hello {\n    public static void main(String[] args) {\n        System.out.println(\"Running on JVM\");\n    }\n}",
    },
    interviewTip:
      "Explain the practical deployment impact: why Docker runtime containers only ship a JRE (or jlink image) rather than a full JDK.",
    commonTrap:
      "Saying the JVM is what you install. You install a JDK or JRE; the JVM is an execution engine inside it.",
    followUpQuestions: [
      "What happens when you run a Java program?",
      "What is bytecode?",
      "Why is Java platform independent?",
    ],
    relatedTopics: ["JVM", "JRE", "JDK", "Java Compilation"],
    tags: ["Fundamentals", "JVM"],
  },
  {
    topicSlug: "java",
    slug: "equals-vs-double-equals",
    title: "What is the difference between == and equals()?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Reference identity versus value equality, and why string literals confuse the issue.",
    shortAnswer:
      "== compares memory reference identity for objects (and value for primitives). equals() is a method overridden by classes to compare internal content value.",
    detailedExplanation: [
      "For primitives, == compares value directly.",
      "For objects, == checks if two references point to the exact same heap memory address.",
      "equals() compares logical content (e.g. String, Integer, LocalDate).",
      "If you override equals(), you MUST override hashCode() to maintain HashMap/HashSet contracts.",
    ],
    example: {
      language: "JAVA",
      code: 'String a = "hello";\nString b = "hello";\nString c = new String("hello");\n\na == b;       // true (String Pool reference)\na == c;       // false (new object forced)\na.equals(c);  // true (content matches)',
    },
    interviewTip:
      "Mention String Constant Pool interning and Integer caching (-128 to 127) as real-world cases where == produces unexpected behavior.",
    commonTrap:
      "Overriding equals() without hashCode(), which breaks hash-based collections like HashMap and HashSet.",
    followUpQuestions: [
      "Why must equals() and hashCode() be overridden together?",
      "What is the string constant pool?",
      "Why does Integer caching stop at 127?",
    ],
    relatedTopics: ["Strings", "Collections", "hashCode"],
    tags: ["Fundamentals", "Strings"],
  },
  {
    topicSlug: "java",
    slug: "java-primitive-types",
    title: "What are primitive data types in Java?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "The eight primitives, their sizes, and how autoboxing relates them to wrappers.",
    shortAnswer:
      "There are eight: byte, short, int, long, float, double, char, and boolean. They hold values directly on the stack rather than heap references and cannot be null.",
    detailedExplanation: [
      "Integral types: byte (8-bit), short (16-bit), int (32-bit), long (64-bit).",
      "Floating-point types: float (32-bit), double (64-bit).",
      "Character type: char (16-bit unsigned UTF-16 code unit).",
      "Boolean type: boolean (true/false).",
      "Wrapper classes (Integer, Long) allow primitives in generic collections via autoboxing, which introduces heap memory overhead and NullPointerException risks.",
    ],
    example: {
      language: "JAVA",
      code: 'int primitive = 42; // Primitive, cannot be null\nInteger boxed = 42;  // Autoboxed object, can be null\n\nMap<String, Integer> map = new HashMap<>();\nint val = map.get("missing"); // Throws NullPointerException!',
    },
    interviewTip:
      "Explain the performance overhead of autoboxing: List<Integer> allocates a wrapper object per item, whereas int[] is contiguous memory.",
    followUpQuestions: [
      "What is autoboxing and when does it hurt performance?",
      "Why can't you write List<int>?",
    ],
    relatedTopics: ["Data Types", "Generics", "Collections"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "java",
    slug: "arraylist-vs-linkedlist",
    title: "What is the difference between ArrayList and LinkedList?",
    difficulty: "MEDIUM",
    subtopic: "Collections",
    synopsis: "Backing store, operation costs, and why ArrayList usually wins.",
    shortAnswer:
      "ArrayList is backed by a dynamic resizable array, providing O(1) random index access. LinkedList is a doubly linked list, providing O(1) insertions at head/tail but O(N) lookup by index.",
    detailedExplanation: [
      "ArrayList stores elements contiguously. Accessing index i is a single offset calculation O(1). Appending is amortized O(1).",
      "LinkedList stores nodes with prev/next pointers. Accessing index i requires traversing i links O(N).",
      "Cache locality gives ArrayList a massive real-world performance advantage over LinkedList due to CPU cache prefetching.",
    ],
    example: {
      language: "JAVA",
      code: "List<Integer> arrayList = new ArrayList<>();\nList<Integer> linkedList = new LinkedList<>();\n\narrayList.get(500);  // O(1) fast\nlinkedList.get(500); // O(N) walks 500 node links",
    },
    interviewTip:
      "Highlight CPU cache locality: ArrayList's contiguous memory is CPU cache-friendly, making it faster than LinkedList in 99% of production applications.",
    followUpQuestions: [
      "How does ArrayList grow and what is the amortized cost?",
      "When would you use ArrayDeque over LinkedList?",
    ],
    relatedTopics: ["Collections", "ArrayList", "LinkedList"],
    tags: ["Collections", "Performance"],
  },
  {
    topicSlug: "java",
    slug: "how-hashmap-works-internally",
    title: "How does HashMap work internally?",
    difficulty: "MEDIUM",
    subtopic: "Collections",
    synopsis: "Buckets, hashing, collision handling, and the treeify threshold.",
    shortAnswer:
      "HashMap uses an array of buckets. On put(), it computes key.hashCode(), applies a bit-spreading function, maps to a bucket index (hash & (n-1)), and stores the entry. Collisions chain in linked lists, converting to red-black trees when a bucket exceeds 8 entries.",
    detailedExplanation: [
      "**Bit Spreading.** Hash code is XOR-shifted `h ^ (h >>> 16)` to mix high bits into low bits before index calculation.",
      "**Treeification (Java 8+).** Buckets with > 8 entries convert to Red-Black Trees (O(log N) lookup) if table capacity is >= 64, preventing hash collision DoS attacks.",
      "**Resizing.** When size > capacity * loadFactor (default 0.75), the table doubles and rehashes entries efficiently.",
    ],
    example: {
      language: "JAVA",
      code: 'Map<Key, String> map = new HashMap<>(16, 0.75f);\nmap.put(key, "value");',
    },
    interviewTip:
      "Explain why mutating a key object after insertion causes data loss: its hashCode changes, mapping subsequent get() calls to the wrong bucket index.",
    followUpQuestions: [
      "What happens when two keys have the same hash?",
      "Can HashMap have a null key?",
      "Why is the default load factor 0.75?",
    ],
    relatedTopics: ["Collections", "HashMap", "Hashing"],
    tags: ["Collections", "HashMap"],
  },
  {
    topicSlug: "java",
    slug: "hashset-vs-treeset",
    title: "What is the difference between HashSet and TreeSet?",
    difficulty: "MEDIUM",
    subtopic: "Collections",
    synopsis: "Hashing vs sorted ordering, and the cost of each guarantee.",
    shortAnswer:
      "HashSet is backed by a HashMap and offers O(1) average performance without ordering. TreeSet is backed by a Red-Black Tree (TreeMap), offering O(log N) performance while keeping elements sorted.",
    detailedExplanation: [
      "HashSet relies on hashCode() and equals() for uniqueness.",
      "TreeSet relies on Comparable (compareTo) or Comparator for ordering and uniqueness.",
      "TreeSet permits navigation queries: first(), last(), ceiling(), floor(), headSet().",
    ],
    example: {
      language: "JAVA",
      code: 'Set<String> hashSet = new HashSet<>(List.of("c", "a", "b")); // Unordered\nSet<String> treeSet = new TreeSet<>(List.of("c", "a", "b")); // [a, b, c] sorted',
    },
    interviewTip:
      "Point out that TreeSet uses compareTo() rather than equals() for element equality checks. If a Comparator returns 0 for two objects, TreeSet considers them duplicates.",
    followUpQuestions: [
      "When would you use LinkedHashSet?",
      "Why does TreeSet reject null elements?",
    ],
    relatedTopics: ["Collections", "HashSet", "TreeSet"],
    tags: ["Collections"],
  },
  {
    topicSlug: "java",
    slug: "overloading-vs-overriding",
    title: "What is method overloading vs method overriding?",
    difficulty: "MEDIUM",
    subtopic: "OOP",
    synopsis: "Compile-time signature selection versus run-time dynamic dispatch.",
    shortAnswer:
      "Overloading is multiple methods in the same class sharing a name but having different parameter signatures (compile-time polymorphism). Overriding is a subclass redefining an inherited method with identical signature (runtime polymorphism).",
    detailedExplanation: [
      "Overloading: Resolved statically by the compiler based on declared reference types.",
      "Overriding: Resolved dynamically by the JVM at runtime based on the actual object instance type (vtable lookup).",
      "Static, private, and final methods CANNOT be overridden.",
    ],
    example: {
      language: "JAVA",
      code: 'class Parent {\n    void display(Object o) { System.out.println("Object"); }\n}\nclass Child extends Parent {\n    @Override void display(Object o) { System.out.println("Child Object"); }\n}',
    },
    interviewTip:
      "Emphasize that method overload selection is static (based on reference type), whereas override dispatch is dynamic (based on heap object instance).",
    followUpQuestions: [
      "Can you override a static method?",
      "What are covariant return types?",
    ],
    relatedTopics: ["OOP", "Polymorphism", "Inheritance"],
    tags: ["OOP"],
  },
  {
    topicSlug: "java",
    slug: "java-garbage-collection",
    title: "How does garbage collection work in Java?",
    difficulty: "HARD",
    subtopic: "JVM",
    synopsis: "Reachability tracing, generational collection, and collector tradeoffs.",
    shortAnswer:
      "Java GC reclaims memory occupied by objects no longer reachable from GC roots. It uses generational collection: Young Generation (Eden, Survivor spaces) for short-lived objects, and Old Generation for long-lived objects.",
    detailedExplanation: [
      "Tracing from GC Roots (stack frames, static references, JNI pointers). Unreachable objects are marked for collection.",
      "Minor GC collects Eden space by copying survivors to Survivor spaces.",
      "Major/Full GC collects Old Generation using Mark-Sweep-Compact.",
      "Modern collectors (G1GC, ZGC) minimize Stop-The-World (STW) pauses via concurrent marking and compaction.",
    ],
    interviewTip:
      "Clarify that Java GC uses reachability tracing from GC roots, NOT reference counting. That is why circular references do not leak memory in Java.",
    followUpQuestions: [
      "What is a memory leak in a garbage-collected language?",
      "How does G1GC differ from ZGC?",
    ],
    relatedTopics: ["JVM", "Garbage Collection", "Memory Management"],
    tags: ["JVM", "Performance"],
  },
  {
    topicSlug: "java",
    slug: "jvm-execution-lifecycle",
    title: "What happens inside the JVM when a Java program runs?",
    difficulty: "HARD",
    subtopic: "JVM",
    synopsis: "Class loading, verification, execution, and JIT compilation.",
    shortAnswer:
      "The ClassLoader loads .class files into memory, the Verifier validates bytecode safety, and the JVM initializes static blocks. Execution begins via interpreter, while the JIT compiler compiles hot execution paths into native machine code.",
    detailedExplanation: [
      "Class Loading Delegation: Bootstrap -> Extension/Platform -> Application ClassLoader.",
      "Bytecode Verification: Guarantees type safety and stack bounds.",
      "Runtime Memory: Heap, Stack (per thread), PC Register, Metaspace.",
      "JIT Compilation: Tiered compilation (C1 compiler for quick startup, C2 for aggressive optimizations).",
    ],
    interviewTip:
      "Explain JVM warm-up: initial execution is interpreted; as method invocation counters cross thresholds, JIT compiles hot paths to native code.",
    followUpQuestions: [
      "What is tiered compilation?",
      "Why does JVM warm-up affect microbenchmarks?",
    ],
    relatedTopics: ["JVM", "JIT", "Bytecode"],
    tags: ["JVM", "Architecture"],
  },
  {
    topicSlug: "java",
    slug: "java-memory-model",
    title: "Explain the Java Memory Model (JMM).",
    difficulty: "HARD",
    subtopic: "Multithreading",
    synopsis: "Happens-before relationship, visibility guarantees, and instruction reordering.",
    shortAnswer:
      "The Java Memory Model defines rules for thread visibility and instruction reordering across CPU caches. It specifies a happens-before relationship enforced via volatile, synchronized, and final keywords.",
    detailedExplanation: [
      "Without synchronization, CPUs and compilers reorder instructions and cache variables locally.",
      "Happens-Before Rules: Monitor unlock happens-before subsequent lock; Volatile write happens-before subsequent volatile read; Thread.start() happens-before thread execution.",
      "volatile guarantees visibility and prevents reordering, but does NOT guarantee atomicity for compound operations.",
    ],
    example: {
      language: "JAVA",
      code: "private volatile boolean flag = true; // Flushes directly to main memory",
    },
    interviewTip:
      "State clearly: volatile provides visibility and ordering, but NOT atomicity. count++ on a volatile variable is still a race condition.",
    followUpQuestions: [
      "Why is double-checked locking broken without volatile?",
      "What guarantees do final fields provide during construction?",
    ],
    relatedTopics: ["Multithreading", "Concurrency", "JVM"],
    tags: ["Multithreading", "Concurrency"],
  },
  {
    topicSlug: "java",
    slug: "how-concurrenthashmap-works",
    title: "How does ConcurrentHashMap work?",
    difficulty: "HARD",
    subtopic: "Multithreading",
    synopsis: "Per-bin CAS locking, removal of Segment locks, and lock-free reads.",
    shortAnswer:
      "Since Java 8, ConcurrentHashMap uses per-bucket node locking (synchronized on the first bin node) and CAS (Compare-And-Swap) for empty bucket insertion. Reads are completely lock-free via volatile node references.",
    detailedExplanation: [
      "Replaced Java 7's 16-Segment lock array with granular per-bin locking.",
      "Uncontended writes into empty buckets use CAS (`Unsafe.compareAndSwapObject`) without taking any locks.",
      "Iterators are weakly consistent (never throw ConcurrentModificationException).",
      "Forbids null keys and null values to avoid ambiguity in concurrent lookups.",
    ],
    example: {
      language: "JAVA",
      code: "ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();\nmap.merge(key, 1, Integer::sum); // Atomic update under bin lock",
    },
    interviewTip:
      "Explain why get()-then-put() is still a race condition on ConcurrentHashMap! You must use atomic composite operations like computeIfAbsent() or merge().",
    followUpQuestions: [
      "Why does ConcurrentHashMap forbid null keys and values?",
      "What is a weakly consistent iterator?",
    ],
    relatedTopics: ["Multithreading", "Collections", "Concurrency"],
    tags: ["Multithreading", "Collections"],
  },
  {
    topicSlug: "java",
    slug: "java-streams-vs-collections",
    title: "What are Java Streams and how do they differ from Collections?",
    difficulty: "MEDIUM",
    subtopic: "Java 8+",
    synopsis: "In-memory data structures vs lazy, non-storage processing pipelines.",
    shortAnswer:
      "A Collection is an in-memory data structure holding elements. A Stream is an un-counted, lazy processing pipeline over a data source that does not store data, is consumed only once, and supports functional transformations.",
    detailedExplanation: [
      "Collections are eagerly evaluated. Streams are lazily evaluated (intermediate ops execute only when terminal op is invoked).",
      "Collections can be iterated multiple times. Streams can be traversed only ONCE.",
      "Streams support transparent parallelization via parallelStream().",
    ],
    example: {
      language: "JAVA",
      code: 'List<String> list = List.of("a", "b", "c");\nList<String> upper = list.stream()\n    .filter(s -> !s.isEmpty())\n    .map(String::toUpperCase)\n    .collect(Collectors.toList());',
    },
    interviewTip:
      "Emphasize stream laziness and short-circuiting: stream.filter(...).findFirst() stops processing immediately when the first match is found.",
    followUpQuestions: [
      "What is the difference between intermediate and terminal operations?",
      "When should you NOT use parallelStreams?",
    ],
    relatedTopics: ["Java 8+", "Streams", "Collections"],
    tags: ["Java 8+", "Streams"],
  },
  {
    topicSlug: "java",
    slug: "abstract-class-vs-interface",
    title: "What is the difference between an Abstract Class and an Interface in Java 8+?",
    difficulty: "MEDIUM",
    subtopic: "OOP",
    synopsis: "Is-a stateful hierarchy vs can-do behavior contracts with default methods.",
    shortAnswer:
      "An Abstract Class defines an 'is-a' relationship with single inheritance, constructors, and instance state. An Interface defines a 'can-do' contract supporting multiple inheritance, default methods, and static constants, but no instance state.",
    detailedExplanation: [
      "Abstract classes can declare instance variables, constructors, and non-public methods.",
      "Interfaces can only hold static final constants and methods defaulting to public.",
      "Since Java 8, interfaces can provide concrete default method implementations.",
    ],
    example: {
      language: "JAVA",
      code: 'abstract class Animal { protected String name; }\ninterface Swimmer { default void swim() { System.out.println("Swimming"); } }',
    },
    interviewTip:
      "Use Abstract Classes when sharing state across tightly coupled subclasses; use Interfaces to define capabilities across unrelated classes.",
    followUpQuestions: [
      "How does Java resolve default method conflicts in multiple interface inheritance?",
      "What is a functional interface?",
    ],
    relatedTopics: ["OOP", "Interfaces", "Java 8+"],
    tags: ["OOP"],
  },
  {
    topicSlug: "java",
    slug: "final-finally-finalize",
    title: "What is the difference between final, finally, and finalize?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Immutability modifier, exception cleanup block, and deprecated GC hook.",
    shortAnswer:
      "final is a keyword to restrict reassignment (variable), overriding (method), or inheritance (class). finally is an exception handling block for cleanup. finalize() is a deprecated Object method called before GC cleanup.",
    detailedExplanation: [
      "final variable: primitives unmodifiable, object references un-reassignable.",
      "finally block: executes regardless of exceptions.",
      "finalize(): deprecated in Java 9, unreliable.",
    ],
    interviewTip:
      "Note that final List<String> prevents reassigning the list reference, but elements within the list can still be mutated.",
    commonTrap:
      "Thinking finally ALWAYS runs. System.exit(0) or JVM crashes bypass finally execution.",
    followUpQuestions: [
      "What happens if System.exit(0) is called in try block?",
      "Why was finalize() deprecated?",
    ],
    relatedTopics: ["Fundamentals", "Exception Handling"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "java",
    slug: "synchronized-vs-lock",
    title: "What is the difference between synchronized keyword and ReentrantLock?",
    difficulty: "MEDIUM",
    subtopic: "Multithreading",
    synopsis: "Implicit block-scoped locking vs explicit tryLock & fair concurrency control.",
    shortAnswer:
      "synchronized is an implicit, block-scoped language keyword tied to intrinsic monitors. ReentrantLock is an explicit java.util.concurrent API offering tryLock(), timed acquisition, fair locking, and multiple Conditions.",
    detailedExplanation: [
      "synchronized acquires/releases locks automatically.",
      "ReentrantLock requires explicit lock() and unlock() inside try-finally.",
      "ReentrantLock supports non-blocking tryLock() and fairness policies.",
    ],
    example: {
      language: "JAVA",
      code: "ReentrantLock lock = new ReentrantLock();\nif (lock.tryLock()) {\n    try { /* critical section */ } finally { lock.unlock(); }\n}",
    },
    interviewTip:
      "Always put lock.unlock() in a finally block to prevent deadlocks if exceptions occur.",
    followUpQuestions: [
      "What is a reentrant lock?",
      "How does tryLock() prevent deadlocks?",
    ],
    relatedTopics: ["Multithreading", "Concurrency"],
    tags: ["Multithreading"],
  },
  {
    topicSlug: "java",
    slug: "volatile-keyword-java",
    title: "What does the volatile keyword do in Java?",
    difficulty: "HARD",
    subtopic: "Multithreading",
    synopsis: "Memory visibility and instruction reordering prevention vs atomicity.",
    shortAnswer:
      "volatile guarantees memory visibility by reading/writing directly to main memory rather than CPU caches. It also prevents instruction reordering via memory barriers, but does NOT guarantee atomicity for compound operations.",
    detailedExplanation: [
      "Flushes writes to main memory immediately.",
      "Establishes a happens-before relationship.",
      "Compound operations (count++) are NOT atomic with volatile.",
    ],
    interviewTip:
      "Explain why count++ is not thread-safe with volatile: count++ executes as 3 separate bytecode instructions (read, add, write).",
    followUpQuestions: [
      "How does volatile compare to AtomicInteger?",
      "What is Double-Checked Locking?",
    ],
    relatedTopics: ["Multithreading", "JVM"],
    tags: ["Multithreading"],
  },
  {
    topicSlug: "java",
    slug: "string-stringbuilder-stringbuffer",
    title: "What is the difference between String, StringBuilder, and StringBuffer?",
    difficulty: "EASY",
    subtopic: "Strings",
    synopsis: "Immutability vs mutable thread-safe vs mutable thread-unsafe performance.",
    shortAnswer:
      "String is immutable. StringBuilder is mutable and unsynchronized (fast for single-thread). StringBuffer is mutable and synchronized (thread-safe).",
    detailedExplanation: [
      "String concatenation allocates new objects.",
      "StringBuilder modifies internal char array in-place without allocations.",
      "StringBuffer uses synchronized methods for thread safety.",
    ],
    example: {
      language: "JAVA",
      code: "StringBuilder sb = new StringBuilder();\nfor(int i=0; i<1000; i++) sb.append(i);\nString res = sb.toString();",
    },
    interviewTip:
      "Mention that Java 5+ automatically converts simple string concatenation into StringBuilder, but explicit loops require manual StringBuilder.",
    followUpQuestions: [
      "How does String Constant Pool work?",
      "What is String Interning?",
    ],
    relatedTopics: ["Strings", "Performance"],
    tags: ["Strings"],
  },
  {
    topicSlug: "java",
    slug: "checked-vs-unchecked-exceptions",
    title: "What is the difference between Checked and Unchecked Exceptions in Java?",
    difficulty: "EASY",
    subtopic: "Exception Handling",
    synopsis: "Compile-time enforced recovery vs runtime programming logic bugs.",
    shortAnswer:
      "Checked exceptions (Exception subclasses excluding RuntimeException) are verified at compile-time. Unchecked exceptions (RuntimeException subclasses or Error) are runtime programming bugs.",
    detailedExplanation: [
      "Checked: IOException, SQLException (must be caught or declared throws).",
      "Unchecked: NullPointerException, IllegalArgumentException (runtime flaws).",
      "Errors: OutOfMemoryError (catastrophic JVM failures).",
    ],
    interviewTip:
      "Spring Framework wraps checked exceptions into unchecked runtime exceptions to reduce boilerplate exception propagation.",
    followUpQuestions: [
      "What is try-with-resources?",
      "What is exception suppression in Java 7+?",
    ],
    relatedTopics: ["Exception Handling"],
    tags: ["Exception Handling"],
  },
  {
    topicSlug: "java",
    slug: "java-serializable-transient-serialversionuid",
    title: "What is Serialization, Externalizable, transient, and serialVersionUID in Java?",
    difficulty: "MEDIUM",
    subtopic: "I/O & Serialization",
    synopsis: "Object graph byte-stream conversion, transient field exclusion, and schema compatibility.",
    shortAnswer:
      "Serialization converts an object into a byte stream (Serializable). Externalizable allows custom serialization methods. transient excludes fields from serialization. serialVersionUID validates class version compatibility.",
    detailedExplanation: [
      "Serializable is a marker interface.",
      "transient excludes sensitive/transient fields (passwords, socket handles).",
      "serialVersionUID prevents InvalidClassException during deserialization.",
    ],
    example: {
      language: "JAVA",
      code: "public class User implements Serializable {\n    private static final long serialVersionUID = 1L;\n    private transient String password;\n}",
    },
    interviewTip:
      "Static variables are never serialized because they belong to the class rather than object instance state.",
    followUpQuestions: [
      "What happens if a superclass is Serializable but subclass is not?",
      "What is readResolve() in Singleton serialization?",
    ],
    relatedTopics: ["Serialization", "I/O"],
    tags: ["Serialization"],
  },
  {
    topicSlug: "java",
    slug: "java-fail-fast-vs-fail-safe-iterators",
    title: "What is the difference between Fail-Fast and Fail-Safe Iterators in Java?",
    difficulty: "MEDIUM",
    subtopic: "Collections",
    synopsis: "Direct collection modification checks vs snapshot/concurrent iterator isolation.",
    shortAnswer:
      "Fail-Fast iterators (ArrayList, HashMap) throw ConcurrentModificationException if the collection is structurally modified during iteration. Fail-Safe iterators (CopyOnWriteArrayList, ConcurrentHashMap) operate on a snapshot or concurrent data structure.",
    detailedExplanation: [
      "Fail-Fast checks modCount on every next() call.",
      "Fail-Safe iterators do not throw exceptions but may not reflect real-time updates.",
    ],
    interviewTip:
      "Enhanced for-each loops use iterators internally, so modifying a list inside a for-each loop triggers ConcurrentModificationException.",
    followUpQuestions: [
      "How does modCount work in ArrayList?",
      "Why doesn't CopyOnWriteArrayList iterator support remove()?",
    ],
    relatedTopics: ["Collections", "Iterators"],
    tags: ["Collections"],
  },
  {
    topicSlug: "java",
    slug: "java-functional-interfaces-lambdas",
    title: "What are Functional Interfaces, Lambda Expressions, and Method References?",
    difficulty: "EASY",
    subtopic: "Java 8+",
    synopsis: "Single Abstract Method (SAM) contracts, anonymous function syntax, and shorthand references.",
    shortAnswer:
      "A Functional Interface contains exactly one abstract method (@FunctionalInterface). Lambdas provide a concise syntax to instantiate SAM interfaces. Method References (Class::method) provide shorthand syntax for invoking existing methods.",
    detailedExplanation: [
      "Built-in Interfaces: Function<T,R>, Predicate<T>, Supplier<T>, Consumer<T>.",
      "Lambdas execute via invokedynamic instructions without creating extra inner class files.",
    ],
    example: {
      language: "JAVA",
      code: 'List<String> list = List.of("a", "b");\nlist.forEach(System.out::println);',
    },
    interviewTip:
      "Variables referenced inside a Lambda expression must be final or effectively final.",
    followUpQuestions: [
      "What does effectively final mean?",
      "How does invokedynamic optimize lambdas?",
    ],
    relatedTopics: ["Java 8+", "Lambda Expressions"],
    tags: ["Java 8+"],
  },
  {
    topicSlug: "java",
    slug: "java-optional-class-best-practices",
    title: "What is java.util.Optional and what are its best practices?",
    difficulty: "EASY",
    subtopic: "Java 8+",
    synopsis: "Container object for null-safety, functional pipeline methods, and anti-patterns.",
    shortAnswer:
      "Optional<T> represents presence or absence of a non-null value. Best practices dictate using Optional as a return type and using orElseGet() for lazy evaluation.",
    detailedExplanation: [
      "orElse(val) evaluates fallback eagerly; orElseGet(Supplier) evaluates fallback lazily.",
      "flatMap flattens nested Optionals.",
    ],
    interviewTip:
      "Never call optional.get() without checking optional.isPresent() first.",
    followUpQuestions: [
      "Why is Optional not Serializable?",
      "Why shouldn't Optional be used as a parameter?",
    ],
    relatedTopics: ["Java 8+", "Optional"],
    tags: ["Java 8+"],
  },
  {
    topicSlug: "java",
    slug: "java-thread-lifecycle-wait-notify",
    title: "What are Java Thread States and how do wait(), notify(), and notifyAll() work?",
    difficulty: "MEDIUM",
    subtopic: "Multithreading",
    synopsis: "NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED, and monitor synchronization.",
    shortAnswer:
      "Threads have 6 states (NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED). Inter-thread signaling uses wait() (releases lock and waits) and notifyAll() inside synchronized blocks.",
    detailedExplanation: [
      "wait() releases monitor lock; sleep() holds monitor lock.",
      "Must be invoked from inside synchronized blocks.",
    ],
    interviewTip:
      "Always invoke wait() inside a while loop to guard against spurious wakeups.",
    followUpQuestions: [
      "What is a spurious wakeup?",
      "Difference between Thread.sleep() and Object.wait()?",
    ],
    relatedTopics: ["Multithreading"],
    tags: ["Multithreading"],
  },
  {
    topicSlug: "java",
    slug: "java-copy-on-write-array-list",
    title: "How does CopyOnWriteArrayList work and when should you use it?",
    difficulty: "MEDIUM",
    subtopic: "Collections",
    synopsis: "Copy-on-write array mutability, lock-free reads, and snapshot iterator safety.",
    shortAnswer:
      "CopyOnWriteArrayList clones its underlying array on mutations (add/set/remove). Reads are lock-free and fast. Ideal for read-heavy scenarios.",
    detailedExplanation: [
      "Mutations acquire lock and copy array to N+1 size.",
      "Iterators read from immutable array snapshot.",
    ],
    interviewTip:
      "Do NOT use CopyOnWriteArrayList in write-heavy scenarios due to O(N) array copy overhead.",
    followUpQuestions: [
      "What is CopyOnWriteArraySet?",
      "How does it compare to Collections.synchronizedList()?",
    ],
    relatedTopics: ["Collections", "Concurrency"],
    tags: ["Collections"],
  },
  {
    topicSlug: "java",
    slug: "java-metaspace-vs-permgen-memory",
    title: "What is Metaspace vs PermGen and how is JVM memory structured?",
    difficulty: "HARD",
    subtopic: "JVM",
    synopsis: "Class metadata storage transition from fixed JVM heap (PermGen) to native RAM (Metaspace).",
    shortAnswer:
      "Metaspace replaced PermGen in Java 8. PermGen was fixed-size JVM heap memory; Metaspace allocates directly from native OS memory.",
    detailedExplanation: [
      "Heap Memory: Young Gen (Eden, S0, S1) + Old Gen.",
      "Metaspace: Stores class definitions in native memory.",
      "String Constant Pool moved from PermGen to Heap in Java 7.",
    ],
    interviewTip:
      "StackOverflowError occurs when thread call stack exceeds depth limit; OutOfMemoryError occurs when Heap or Metaspace cannot allocate.",
    followUpQuestions: [
      "Where is String Constant Pool located in Java 8+?",
      "How do you troubleshoot Metaspace leaks?",
    ],
    relatedTopics: ["JVM", "Memory Management"],
    tags: ["JVM"],
  },
  {
    topicSlug: "java",
    slug: "java-comparable-vs-comparator",
    title: "What is the difference between Comparable and Comparator in Java?",
    difficulty: "EASY",
    subtopic: "Collections",
    synopsis: "Natural sorting order (compareTo) vs custom multiple sorting strategies (compare).",
    shortAnswer:
      "Comparable defines natural sorting order for a class via compareTo(Object). Comparator defines custom/multiple sorting strategies outside the class via compare(Obj1, Obj2).",
    detailedExplanation: [
      "Comparable is in java.lang package; implements `int compareTo(T o)`.",
      "Comparator is in java.util package; implements `int compare(T o1, T o2)`.",
      "Comparator supports functional composition in Java 8 (`Comparator.comparing(User::getName).thenComparing(...)`).",
    ],
    example: {
      language: "JAVA",
      code: "List<User> users = getUsers();\nusers.sort(Comparator.comparing(User::getAge).thenComparing(User::getName));",
    },
    interviewTip:
      "If you cannot modify the class source code (e.g. 3rd-party library), you MUST use a Comparator for sorting.",
    followUpQuestions: [
      "What happens if compareTo is inconsistent with equals?",
      "How does Collections.sort() work internally?",
    ],
    relatedTopics: ["Collections", "Sorting"],
    tags: ["Collections"],
  },

  // --------------------------------------------------------------------------
  // ADDITIONAL GEEKSFORGEEKS JAVA QUESTIONS (29 - 62)
  // --------------------------------------------------------------------------
  {
    topicSlug: "java",
    slug: "java-string-constant-pool-interning",
    title: "What is the String Constant Pool and String Interning in Java?",
    difficulty: "EASY",
    subtopic: "Strings",
    synopsis: "Special heap memory area for caching string literals and String.intern().",
    shortAnswer:
      "The String Constant Pool (SCP) is a specialized area of heap memory where Java caches string literals to conserve memory. `String.intern()` manually places or retrieves a string from the pool so that identical content shares the exact same reference address.",
    detailedExplanation: [
      "Literal creation (`String s = \'hello\'`) checks SCP first. If found, returns pooled reference; if absent, adds to SCP.",
      "`new String(\'hello\')` forces creation of a new Object on the heap, bypassing direct pool assignment.",
      "`str.intern()` returns the pool canonical reference.",
      "Since Java 7, the String Constant Pool resides inside the main Heap (moved out of PermGen).",
    ],
    example: {
      language: "JAVA",
      code: 'String s1 = "Java";\nString s2 = "Java";\nString s3 = new String("Java");\nString s4 = s3.intern();\n\nSystem.out.println(s1 == s2); // true (same SCP reference)\nSystem.out.println(s1 == s3); // false (s3 is Heap object)\nSystem.out.println(s1 == s4); // true (intern() returned SCP reference)',
    },
    interviewTip:
      "Call out memory location: SCP was moved from PermGen into the main Heap in Java 7, preventing PermGen OutOfMemoryErrors.",
    followUpQuestions: [
      "Why are Strings immutable in Java?",
      "How does String interning impact garbage collection?",
    ],
    relatedTopics: ["Strings", "Memory Management", "JVM"],
    tags: ["Strings", "Fundamentals"],
  },
  {
    topicSlug: "java",
    slug: "java-multiple-inheritance-diamond-problem",
    title: "Why doesn't Java support Multiple Inheritance with classes, and how are Interface Default Method conflicts resolved?",
    difficulty: "MEDIUM",
    subtopic: "OOP",
    synopsis: "Diamond Problem ambiguity prevention and explicit Interface.super.method() resolution.",
    shortAnswer:
      "Java forbids multiple class inheritance to avoid the Diamond Problem (ambiguity when two parent classes define the same state/method). Since Java 8 introduced default methods in interfaces, interface name conflicts are resolved by requiring the implementing class to explicitly override the conflicting method.",
    detailedExplanation: [
      "Class Level: A class can `extend` only one superclass to prevent ambiguous instance field and method dispatch.",
      "Interface Level: A class can `implement` multiple interfaces.",
      "Default Method Conflict Resolution: If `InterfaceA` and `InterfaceB` both define `default void log()`, class `C` implementing both MUST override `log()` or explicitly pick one via `InterfaceA.super.log()`.",
    ],
    example: {
      language: "JAVA",
      code: 'interface A { default void show() { System.out.println("A"); } }\ninterface B { default void show() { System.out.println("B"); } }\n\nclass C implements A, B {\n    @Override\n    public void show() {\n        A.super.show(); // Explicitly resolve conflict to Interface A\n    }\n}',
    },
    interviewTip:
      "Explain the exact compiler error rule: 'Class method beats interface default method; sub-interface beats super-interface; otherwise explicit override is mandatory.'",
    followUpQuestions: [
      "What is the class-wins rule in Java default method resolution?",
      "How does C++ handle the Diamond Problem using virtual inheritance?",
    ],
    relatedTopics: ["OOP", "Interfaces", "Inheritance"],
    tags: ["OOP"],
  },
  {
    topicSlug: "java",
    slug: "java-static-keyword-usage",
    title: "What is the static keyword in Java (Variables, Methods, Blocks, Nested Classes)?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Class-level memory allocation shared across instances.",
    shortAnswer:
      "`static` members belong to the class itself rather than individual object instances. Memory for static variables is allocated once when the class is loaded, making static members shared globally across all class instances.",
    detailedExplanation: [
      "Static Variables: Shared single copy across all class instances stored in Metaspace/Heap.",
      "Static Methods: Utility methods invoked via `ClassName.method()` that cannot access `this` or instance fields directly.",
      "Static Initializer Blocks: `static { ... }` runs ONCE when the class is loaded by JVM ClassLoader.",
      "Static Nested Classes: Nested class that does NOT hold an implicit reference to an enclosing outer class instance.",
    ],
    example: {
      language: "JAVA",
      code: 'public class Counter {\n    public static int count = 0; // Shared across all instances\n    static {\n        System.out.println("Class loaded once");\n    }\n    public static void increment() { count++; }\n}',
    },
    interviewTip:
      "Highlight memory leak potential: static fields persist for the lifetime of the JVM application process and are not garbage collected until ClassLoader is unloaded.",
    commonTrap:
      "Trying to access `this` or instance instance fields inside a `static` method.",
    followUpQuestions: [
      "Can you override a static method in Java?",
      "What is method hiding?",
    ],
    relatedTopics: ["Fundamentals", "OOP", "JVM"],
    tags: ["Fundamentals", "OOP"],
  },
  {
    topicSlug: "java",
    slug: "java-super-vs-this-keywords",
    title: "What is the difference between super and this keywords in Java?",
    difficulty: "EASY",
    subtopic: "OOP",
    synopsis: "Referencing current instance (this) vs parent class instance (super).",
    shortAnswer:
      "`this` refers to the current object instance within a class method or constructor. `super` refers to the immediate parent class instance, used to invoke overridden superclass methods or constructors.",
    detailedExplanation: [
      "`this()` invokes another constructor in the same class (constructor chaining). Must be the first statement.",
      "`super()` invokes the parent class constructor. Must be the first statement.",
      "`this.field` resolves field shadowing when local parameter names match field names.",
      "`super.field` or `super.method()` accesses overridden parent class members.",
    ],
    example: {
      language: "JAVA",
      code: 'class Parent { Parent(String msg) {} }\nclass Child extends Parent {\n    Child() {\n        super("Init Parent"); // Invoke parent constructor\n    }\n}',
    },
    interviewTip:
      "Remind interviewers that both `this()` and `super()` must be the VERY FIRST statement inside a constructor, meaning they cannot be called together in the same constructor body.",
    followUpQuestions: [
      "What happens if a constructor does not explicitly call super() or this()?",
      "Can static methods use super or this?",
    ],
    relatedTopics: ["OOP", "Constructors", "Inheritance"],
    tags: ["OOP"],
  },
  {
    topicSlug: "java",
    slug: "java-constructors-default-parameterized",
    title: "What are Constructors in Java (Default, Parameterized, Copy, Chaining)?",
    difficulty: "EASY",
    subtopic: "OOP",
    synopsis: "Instance initialization blocks, compiler default rules, and constructor chaining.",
    shortAnswer:
      "A Constructor is a special block of code matching the class name that executes when an object is instantiated (`new`). If no constructor is written, Java provides an implicit no-arg default constructor. Parameterized constructors initialize custom instance state.",
    detailedExplanation: [
      "Default Constructor: Compiler automatically inserts a zero-argument constructor ONLY if no constructors are declared.",
      "Constructor Overloading: Multiple constructors with different parameter signatures.",
      "Constructor Chaining: Calling `this(...)` to delegate initialization across constructors in the same class.",
      "Constructors do NOT have a return type (not even `void`). Declaring a return type turns it into a standard method!",
    ],
    example: {
      language: "JAVA",
      code: 'public class Car {\n    private String model;\n    public Car() { this("Default Model"); } // Constructor chaining\n    public Car(String model) { this.model = model; }\n}',
    },
    interviewTip:
      "Common gotcha: If you declare ANY custom parameterized constructor, Java will NOT provide the default no-arg constructor automatically.",
    followUpQuestions: [
      "Can a constructor be declared final, static, or abstract?",
      "How do private constructors enforce Singleton patterns?",
    ],
    relatedTopics: ["OOP", "Constructors"],
    tags: ["OOP"],
  },
  {
    topicSlug: "java",
    slug: "java-access-modifiers-scopes",
    title: "What are Access Modifiers in Java (public, protected, package-private, private)?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Encapsulation boundaries controlling class, field, and method visibility.",
    shortAnswer:
      "Access modifiers define the scope of visibility for classes, methods, and variables. Java has 4 levels: `private` (same class only), package-private (default, same package), `protected` (same package + subclasses anywhere), and `public` (accessible everywhere).",
    detailedExplanation: [
      "`private`: Visible strictly inside the declaring class.",
      "Package-private (default, no keyword): Visible to all classes in the same package.",
      "`protected`: Visible to same package classes AND subclasses in external packages via inheritance.",
      "`public`: Accessible across all packages in the project.",
      "Top-level classes can ONLY be declared `public` or package-private (not `private` or `protected`).",
    ],
    interviewTip:
      "Remember accessibility escalation: Overridden methods in subclasses CANNOT reduce visibility (e.g. overriding a `protected` method cannot make it `private`).",
    followUpQuestions: [
      "Why can't top-level classes be private?",
      "How does module encapsulation work in Java 9+ (module-info.java)?",
    ],
    relatedTopics: ["Fundamentals", "OOP", "Encapsulation"],
    tags: ["Fundamentals", "OOP"],
  },
  {
    topicSlug: "java",
    slug: "java-pass-by-value-proof",
    title: "Is Java pass-by-value or pass-by-reference?",
    difficulty: "MEDIUM",
    subtopic: "Fundamentals",
    synopsis: "Java is strictly pass-by-value for both primitives and object references.",
    shortAnswer:
      "Java is STRICTLY pass-by-value. For primitives, Java passes a copy of the primitive value. For objects, Java passes a copy of the reference pointer address. Mutating an object's state modifies the original heap object, but reassigning the reference parameter inside a method has zero effect on the caller.",
    detailedExplanation: [
      "Primitive Arguments: Value copied to stack frame. Changes inside method are lost.",
      "Object Reference Arguments: Reference memory address is copied by value. The caller and method parameter initially point to the exact same heap object.",
      "Mutating Object State: `user.setName(\'Alice\')` mutates shared object on heap.",
      "Rebinding Reference: `user = new User()` changes local copy of reference address; caller reference remains untouched.",
    ],
    example: {
      language: "JAVA",
      code: 'public static void swap(Point p1, Point p2) {\n    Point temp = p1;\n    p1 = p2;\n    p2 = temp; // Rebinds local stack copies; caller references do NOT swap!\n}',
    },
    interviewTip:
      "Demonstrate proof with reference swapping: if Java were pass-by-reference, a `swap(a, b)` method would swap caller variables. In Java, reference swapping fails because references are passed by value.",
    commonTrap:
      "Confusing 'passing a reference by value' with 'pass by reference'.",
    followUpQuestions: [
      "How does C++ pass-by-reference (`int &x`) differ from Java?",
      "What is stack frame variable allocation during method calls?",
    ],
    relatedTopics: ["Fundamentals", "Memory Management", "JVM"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "java",
    slug: "java-wrapper-classes-autoboxing-unboxing",
    title: "What are Wrapper Classes, Autoboxing, Unboxing, and Integer Caching in Java?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Converting primitives to objects, compiler conversion sugar, and Integer cache bounds.",
    shortAnswer:
      "Wrapper classes (`Integer`, `Double`) wrap primitive values inside heap objects. Autoboxing automatically converts primitives to wrappers (`int` $\rightarrow$ `Integer`), and unboxing converts wrappers back to primitives. Java caches `Integer` objects between `-128` and `127` for memory reuse.",
    detailedExplanation: [
      "Autoboxing: `Integer num = 5;` compiles to `Integer num = Integer.valueOf(5);`.",
      "Unboxing: `int val = num;` compiles to `int val = num.intValue();`.",
      "NullPointerException Risk: Unboxing a `null` wrapper object throws `NullPointerException`.",
      "Integer Cache: `Integer.valueOf(x)` reuses pre-allocated cached instances for values $-128 \le x \le 127$. Thus `Integer.valueOf(100) == Integer.valueOf(100)` is `true`, but for `200` it is `false`.",
    ],
    example: {
      language: "JAVA",
      code: 'Integer a = 100;\nInteger b = 100;\nSystem.out.println(a == b); // true (Cached range -128 to 127)\n\nInteger c = 200;\nInteger d = 200;\nSystem.out.println(c == d); // false (Distinct heap instances!)',
    },
    interviewTip:
      "Warn about performance in loops: `Long sum = 0L; for(long i=0; i<N; i++) sum += i;` creates millions of temporary `Long` objects due to unboxing/autoboxing in loop iterations!",
    followUpQuestions: [
      "Why does Integer caching stop at 127?",
      "Can Integer cache size be adjusted via JVM flags (`-XX:AutoBoxCacheMax`)?",
    ],
    relatedTopics: ["Fundamentals", "Data Types", "JVM"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "java",
    slug: "java-shallow-vs-deep-copy-cloneable",
    title: "How does Object Cloning work in Java (Cloneable, clone(), Shallow vs Deep Copy)?",
    difficulty: "MEDIUM",
    subtopic: "OOP",
    synopsis: "Bitwise field duplication vs recursive nested object duplication.",
    shortAnswer:
      "Cloning creates a copy of an object. A Shallow Copy duplicates object fields as-is (copying primitive values and copying object references). A Deep Copy recursively clones all nested mutable sub-objects so the clone shares no references with the original.",
    detailedExplanation: [
      "`Cloneable` Interface: Marker interface required to call `super.clone()`. Without it, `clone()` throws `CloneNotSupportedException`.",
      "`Object.clone()`: Performs a native field-by-field shallow copy by default.",
      "Shallow Copy Hazard: Mutating a nested array or object inside a shallow copy mutates the original object's state.",
      "Best Practice: Copy constructors (`new User(otherUser)`) or Serialization are preferred over the broken legacy `Cloneable` interface.",
    ],
    example: {
      language: "JAVA",
      code: 'public class Person implements Cloneable {\n    String name;\n    int[] scores;\n    @Override\n    public Person clone() throws CloneNotSupportedException {\n        Person cloned = (Person) super.clone();\n        cloned.scores = this.scores.clone(); // Deep copy inner array\n        return cloned;\n    }\n}',
    },
    interviewTip:
      "State Josh Bloch's advice (Effective Java): `Cloneable` is severely flawed; prefer Copy Constructors or Factory Methods for object duplication.",
    followUpQuestions: [
      "Why is Cloneable considered a broken interface in Java?",
      "How to implement deep copy using Copy Constructors?",
    ],
    relatedTopics: ["OOP", "Cloning", "Memory Management"],
    tags: ["OOP"],
  },
  {
    topicSlug: "java",
    slug: "java-generics-type-erasure",
    title: "What are Generics, Wildcards (? extends T, ? super T), and Type Erasure in Java?",
    difficulty: "HARD",
    subtopic: "Generics",
    synopsis: "Compile-time type safety, bytecode eraser, and Producer Extends Consumer Super (PECS).",
    shortAnswer:
      "Generics provide compile-time type safety for collections and classes. Type Erasure removes generic type information at compile time, replacing parameters with `Object` or bounds in bytecode. Wildcards handle variance: `? extends T` (covariance/read-only) and `? super T` (contravariance/write-only).",
    detailedExplanation: [
      "Type Erasure: Java generics exist ONLY at compile time for safety checks; at runtime, `List<String>` and `List<Integer>` both become raw `List` in bytecode.",
      "PECS Rule: **Producer Extends, Consumer Super**. Use `? extends T` if reading items from a collection (Producer); use `? super T` if writing items to a collection (Consumer).",
      "Generic Limitations: Cannot instantiate generic arrays (`new T[10]`) or primitive type parameters (`List<int>` is invalid).",
    ],
    example: {
      language: "JAVA",
      code: '// PECS Example\npublic static void copy(List<? extends Number> src, List<? super Number> dest) {\n    for (Number n : src) dest.add(n);\n}',
    },
    interviewTip:
      "Use the mnemonic **PECS** (Producer Extends, Consumer Super) to demonstrate mastery over wildcard covariance/contravariance.",
    followUpQuestions: [
      "Why can't you create an array of generic types (`new List<String>[10]`)?",
      "What is bridge method generated by compiler during type erasure?",
    ],
    relatedTopics: ["Generics", "Type Erasure", "Collections"],
    tags: ["Generics", "Advanced Java"],
  },
  {
    topicSlug: "java",
    slug: "java-enum-features",
    title: "What are Enums in Java and how can they have constructors, fields, and methods?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Type-safe constants inheriting from java.lang.Enum with rich OOP functionality.",
    shortAnswer:
      "An Enum (`enum`) is a type-safe fixed set of constants in Java. Unlike basic C enums, Java enums are full-fledged classes that inherit from `java.lang.Enum`, can have private constructors, custom fields, methods, and implement interfaces.",
    detailedExplanation: [
      "Type Safety: Eliminates magic string/int constants (`public static final int STATUS_ACTIVE = 1`).",
      "Constructors: Enum constructors are implicitly `private` and called automatically when enum constants are loaded.",
      "Methods & Interfaces: Enums can implement interfaces and override abstract methods per constant.",
      "EnumSet & EnumMap: Ultra-fast specialized bitset and array-backed collections designed exclusively for Enums.",
    ],
    example: {
      language: "JAVA",
      code: 'public enum Operation {\n    PLUS("+") { public double apply(double x, double y) { return x + y; } },\n    MINUS("-") { public double apply(double x, double y) { return x - y; } };\n\n    private final String symbol;\n    Operation(String symbol) { this.symbol = symbol; }\n    public abstract double apply(double x, double y);\n}',
    },
    interviewTip:
      "Highlight Enum Singleton: Enums are the safest way to write Singletons in Java because JVM guarantees thread-safe initialization and protects against deserialization reflection attacks.",
    followUpQuestions: [
      "Why is Enum Singleton reflection-proof?",
      "How is EnumSet implemented using bit vectors?",
    ],
    relatedTopics: ["Fundamentals", "OOP", "Design Patterns"],
    tags: ["Fundamentals", "OOP"],
  },
  {
    topicSlug: "java",
    slug: "java-singleton-design-pattern-enum",
    title: "How do you implement a thread-safe Singleton in Java (Double-Checked Locking vs Bill Pugh vs Enum)?",
    difficulty: "HARD",
    subtopic: "Design Patterns",
    synopsis: "Ensuring single instance instantiation across multithreaded runtimes.",
    shortAnswer:
      "A Singleton restricts a class to a single object instance. Modern thread-safe implementations include: 1) Bill Pugh Holder (lazy loading via static inner class), 2) Double-Checked Locking (with `volatile`), and 3) Enum Singleton (simplest, reflection-proof).",
    detailedExplanation: [
      "Eager Initialization: Simple, but instantiates object early even if never used.",
      "Double-Checked Locking: Uses `volatile` instance field and synchronized block inside null check to prevent instruction reordering bugs.",
      "Bill Pugh Singleton: Uses static inner holder class `Holder.INSTANCE`. Lazy loaded on demand by JVM ClassLoader without synchronization overhead.",
      "Enum Singleton: Guaranteed thread-safe, lazy loaded, and protected against reflection/deserialization attacks by JVM spec.",
    ],
    example: {
      language: "JAVA",
      code: '// Bill Pugh Singleton (Recommended for classes)\npublic class Singleton {\n    private Singleton() {}\n    private static class Holder {\n        private static final Singleton INSTANCE = new Singleton();\n    }\n    public static Singleton getInstance() { return Holder.INSTANCE; }\n}',
    },
    interviewTip:
      "Explain why `volatile` is MANDATORY for Double-Checked Locking: without volatile, instruction reordering can publish a partially initialized object reference to another thread!",
    followUpQuestions: [
      "How can reflection break a private constructor Singleton?",
      "How does readResolve() prevent deserialization from creating duplicate Singleton instances?",
    ],
    relatedTopics: ["Design Patterns", "Multithreading", "Concurrency"],
    tags: ["Design Patterns", "Multithreading"],
  },
  {
    topicSlug: "java",
    slug: "java-threadpool-executorservice",
    title: "How does ExecutorService and ThreadPoolExecutor work in Java (corePoolSize, maximumPoolSize, workQueue)?",
    difficulty: "HARD",
    subtopic: "Multithreading",
    synopsis: "Reusing worker threads via queue handling and pool size scaling.",
    shortAnswer:
      "`ExecutorService` manages worker thread execution pools. `ThreadPoolExecutor` processes tasks based on 3 main parameters: `corePoolSize` (minimum active threads), `workQueue` (task backlog queue), and `maximumPoolSize` (peak thread limit).",
    detailedExplanation: [
      "Task Submission Flow: 1) If active threads < `corePoolSize`, spawn new worker thread. 2) If active threads $\ge$ `corePoolSize`, add task to `workQueue`. 3) If `workQueue` is full, spawn new worker thread up to `maximumPoolSize`. 4) If `maximumPoolSize` reached, invoke `RejectedExecutionHandler`.",
      "Standard Factory Pools: `Executors.newFixedThreadPool(n)` (unbounded LinkedBlockingQueue), `Executors.newCachedThreadPool()` (SynchronousQueue with zero core pool size).",
      "Resource Trap: `newFixedThreadPool` uses an unbounded queue, which can cause `OutOfMemoryError` if producer outpaces consumers.",
    ],
    example: {
      language: "JAVA",
      code: 'ThreadPoolExecutor executor = new ThreadPoolExecutor(\n    2, 4, 60L, TimeUnit.SECONDS, new ArrayBlockingQueue<>(100)\n);\nexecutor.execute(() -> System.out.println("Running task"));',
    },
    interviewTip:
      "Warn against `Executors.newFixedThreadPool` in production: its default unbounded `LinkedBlockingQueue` can grow infinitely and crash the JVM with OutOfMemoryError.",
    followUpQuestions: [
      "What are the 4 standard RejectedExecutionHandler policies in Java?",
      "How does ThreadPoolExecutor reuse threads internally?",
    ],
    relatedTopics: ["Multithreading", "Concurrency", "ExecutorService"],
    tags: ["Multithreading", "Concurrency"],
  },
  {
    topicSlug: "java",
    slug: "java-callable-vs-runnable-future",
    title: "What is the difference between Runnable and Callable in Java, and how does Future / CompletableFuture work?",
    difficulty: "MEDIUM",
    subtopic: "Multithreading",
    synopsis: "No-return void tasks vs value-returning throwing tasks and async pipelines.",
    shortAnswer:
      "`Runnable` defines a task returning `void` that cannot throw checked exceptions. `Callable<V>` defines a task returning a result `V` and can throw checked exceptions. A `Future<V>` represents an asynchronous computation result, while `CompletableFuture<V>` enables non-blocking reactive task chaining.",
    detailedExplanation: [
      "`Runnable.run()`: `public void run()`. Used by basic `Thread` objects.",
      "`Callable.call()`: `public V call() throws Exception`. Used with `ExecutorService.submit()`.",
      "`Future.get()`: Blocking call that waits until async calculation completes.",
      "`CompletableFuture`: Introduces non-blocking callback pipelines (`thenApply`, `thenAccept`, `thenCompose`, `allOf`) to avoid thread blocking.",
    ],
    example: {
      language: "JAVA",
      code: 'CompletableFuture.supplyAsync(() -> "Fetch Data")\n    .thenApply(data -> data + " -> Processed")\n    .thenAccept(System.out::println);',
    },
    interviewTip:
      "Highlight non-blocking reactive chains: `CompletableFuture` avoids blocking main threads compared to traditional `Future.get()` calls.",
    followUpQuestions: [
      "What is the difference between thenApply() and thenCompose() in CompletableFuture?",
      "How does exception handling work in CompletableFuture (exceptionally / handle)?",
    ],
    relatedTopics: ["Multithreading", "Concurrency", "Async"],
    tags: ["Multithreading", "Java 8+"],
  },
  {
    topicSlug: "java",
    slug: "java-deadlock-prevention",
    title: "What is Deadlock in Java, what are its 4 necessary conditions, and how do you prevent or detect it?",
    difficulty: "HARD",
    subtopic: "Multithreading",
    synopsis: "Circular lock dependency blocking, Coffman conditions, and lock ordering solutions.",
    shortAnswer:
      "A Deadlock occurs when two or more threads are blocked forever, waiting for locks held by each other. Deadlock requires 4 Coffman conditions: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Prevention relies on enforcing a strict global lock acquisition order.",
    detailedExplanation: [
      "Circular Wait Scenario: Thread 1 holds Lock A and requests Lock B. Thread 2 holds Lock B and requests Lock A.",
      "Prevention: Always acquire multiple locks in the exact same deterministic order across all codebase threads.",
      "Timeout Locks: Use `ReentrantLock.tryLock(timeout)` instead of intrinsic `synchronized` blocks to break infinite waiting.",
      "Detection Tools: Generate a JVM thread dump (`jstack <pid>` or `VisualVM`) to identify deadlocked threads automatically.",
    ],
    example: {
      language: "JAVA",
      code: '// Fix Deadlock by ordering locks based on System.identityHashCode or ID\npublic void transfer(Account from, Account to, double amount) {\n    Account first = from.id < to.id ? from : to;\n    Account second = from.id < to.id ? to : from;\n    synchronized(first) {\n        synchronized(second) {\n            // Safe transfer\n        }\n    }\n}',
    },
    interviewTip:
      "Describe the global lock acquisition ordering strategy—it directly breaks the Circular Wait Coffman condition.",
    followUpQuestions: [
      "What is Livelock vs Starvation?",
      "How does jstack diagnose deadlocks in production environments?",
    ],
    relatedTopics: ["Multithreading", "Concurrency", "JVM"],
    tags: ["Multithreading"],
  },
  {
    topicSlug: "java",
    slug: "java-custom-annotations-reflection",
    title: "What are Annotations and Reflection in Java (java.lang.reflect)?",
    difficulty: "MEDIUM",
    subtopic: "Advanced Java",
    synopsis: "Runtime metadata decoration (@Retention, @Target) and dynamic class inspection.",
    shortAnswer:
      "Annotations provide metadata attached to classes, methods, or fields (`@Retention`, `@Target`). Reflection (`java.lang.reflect`) allows Java code to dynamically inspect and modify class structures, constructors, methods, and private fields at runtime.",
    detailedExplanation: [
      "Retention Policy: `@Retention(RetentionPolicy.RUNTIME)` retains annotations in bytecode for runtime reflection.",
      "Target Policy: `@Target(ElementType.METHOD)` restricts where annotations can be placed.",
      "Reflection Utility: Inspect private members (`field.setAccessible(true)`), invoke hidden methods (`method.invoke(obj)`).",
      "Framework Core: Spring (IoC dependency injection), JUnit, and Jackson JSON mappers rely heavily on Reflection.",
      "Performance Overhead: Reflection bypasses JIT compiler optimizations and is significantly slower than direct method execution.",
    ],
    example: {
      language: "JAVA",
      code: '@Retention(RetentionPolicy.RUNTIME)\n@Target(ElementType.METHOD)\n@interface LogExecution {}\n\n// Reading reflection:\nMethod m = clazz.getMethod("myMethod");\nif (m.isAnnotationPresent(LogExecution.class)) { /* Run logic */ }',
    },
    interviewTip:
      "Acknowledge the power of reflection for framework authors, but warn about risks: breaking encapsulation, security manager restrictions, and JIT performance overhead.",
    followUpQuestions: [
      "How does Spring IoC container use reflection for @Autowired dependency injection?",
      "How does Java 9+ Modules limit deep reflection across packages?",
    ],
    relatedTopics: ["Advanced Java", "Reflection", "Spring Framework"],
    tags: ["Advanced Java"],
  },
  {
    topicSlug: "java",
    slug: "java-hashtable-vs-hashmap-concurrenthashmap",
    title: "What is the difference between Hashtable, HashMap, and ConcurrentHashMap in Java?",
    difficulty: "MEDIUM",
    subtopic: "Collections",
    synopsis: "Legacy coarse lock vs unsynchronized map vs modern fine-grained CAS bucket map.",
    shortAnswer:
      "`Hashtable` is a legacy thread-safe map that synchronizes every method entirely (slow). `HashMap` is unsynchronized, fast, and allows one `null` key. `ConcurrentHashMap` provides high-concurrency thread safety using per-bucket node locks and CAS without locking the whole table.",
    detailedExplanation: [
      "`Hashtable`: Synchronizes entire map on `this`. Null keys/values strictly forbidden. Obsolete class.",
      "`HashMap`: Single-threaded map. Unsynchronized. Allows 1 `null` key and multiple `null` values.",
      "`ConcurrentHashMap`: Multi-threaded map. Lock-free reads, per-bucket writes. Forbids `null` keys and values.",
      "`Collections.synchronizedMap(map)`: Wraps a normal map with full table synchronization (similar to Hashtable).",
    ],
    interviewTip:
      "Emphasize that `Hashtable` is obsolete; modern Java codebases use `HashMap` for single-thread scenarios and `ConcurrentHashMap` for multithreaded scenarios.",
    followUpQuestions: [
      "Why does ConcurrentHashMap forbid null keys and null values?",
      "How does Collections.synchronizedMap differ from ConcurrentHashMap?",
    ],
    relatedTopics: ["Collections", "HashMap", "Concurrency"],
    tags: ["Collections", "Multithreading"],
  },
  {
    topicSlug: "java",
    slug: "java-queue-vs-priorityqueue-deque",
    title: "What is the difference between Queue, PriorityQueue, and ArrayDeque in Java?",
    difficulty: "MEDIUM",
    subtopic: "Collections",
    synopsis: "FIFO queues vs min-heap priority queues vs resizable array double-ended queues.",
    shortAnswer:
      "`Queue` is a FIFO interface (`offer`, `poll`). `PriorityQueue` processes elements based on natural order or Comparator using a Min-Binary Heap ($O(\log N)$ insertion/poll). `ArrayDeque` is a resizable array implementation of `Deque` that outperforms `Stack` and `LinkedList` as a double-ended queue.",
    detailedExplanation: [
      "`Queue` Methods: `offer()` (non-blocking insert), `poll()` (remove head or null), `peek()` (view head).",
      "`PriorityQueue`: Elements ordered by priority (not FIFO). Unbounded binary min-heap array. Does NOT permit `null`.",
      "`ArrayDeque`: Circular array double-ended queue. Faster than `Stack` (LIFO) and faster than `LinkedList` (FIFO) due to cache locality and zero node allocation overhead.",
    ],
    example: {
      language: "JAVA",
      code: '// Priority Queue (Min-Heap)\nPriorityQueue<Integer> pq = new PriorityQueue<>();\npq.offer(30); pq.offer(10); pq.offer(20);\nSystem.out.println(pq.poll()); // 10 (smallest first!)\n\n// ArrayDeque as Stack\nDeque<String> stack = new ArrayDeque<>();\nstack.push("A"); stack.pop();',
    },
    interviewTip:
      "State Java official recommendation: Always use `ArrayDeque` instead of the legacy `java.util.Stack` class or `LinkedList` when building stacks and queues.",
    followUpQuestions: [
      "Why is java.util.Stack deprecated/discouraged?",
      "How does a PriorityQueue resize its internal array?",
    ],
    relatedTopics: ["Collections", "Queue", "PriorityQueue"],
    tags: ["Collections", "Data Structures"],
  },
  {
    topicSlug: "java",
    slug: "java-var-keyword-local-variable-type-inference",
    title: "What is Local Variable Type Inference (var) in Java 10+ and what are its constraints?",
    difficulty: "EASY",
    subtopic: "Java 8+",
    synopsis: "Compiler local variable type inference without runtime overhead.",
    shortAnswer:
      "Introduced in Java 10, `var` enables local variable type inference. The compiler infers the variable type automatically from the initializer expression at compile time. It has zero runtime overhead and does NOT turn Java into a dynamically typed language.",
    detailedExplanation: [
      "Compile-Time Feature: The generated bytecode explicitly contains the inferred type (e.g. `String`, `List<User>`).",
      "Allowed Locations: Local variables with initializers, loop index variables (`for (var x : list)`), and try-with-resources variables.",
      "Restrictions: Cannot be used for class fields, method parameter types, method return types, or uninitialized variables (`var x;` is invalid).",
    ],
    example: {
      language: "JAVA",
      code: '// Reduces verbose boilerplate:\nMap<User, List<Order>> userOrders = new HashMap<>();\n// With var:\nvar userOrders = new HashMap<User, List<Order>>();',
    },
    interviewTip:
      "Clarify that `var` is still 100% statically typed. It is purely syntactic sugar handled by `javac` during compilation.",
    followUpQuestions: [
      "Why can't `var` be used for method return types or class fields?",
      "What happens when using `var` with diamond operators (`new ArrayList<>()`)?",
    ],
    relatedTopics: ["Java 8+", "Syntactic Sugar"],
    tags: ["Java 8+"],
  },
  {
    topicSlug: "java",
    slug: "java-records-feature",
    title: "What are Java Records (record) introduced in Java 14/17 and how do they differ from standard classes?",
    difficulty: "MEDIUM",
    subtopic: "Java 8+",
    synopsis: "Immutable data carrier classes generating auto getters, equals, hashCode, and toString.",
    shortAnswer:
      "A `record` (Java 14+ preview, Java 17 standard) is a concise immutable data-carrier class. The compiler automatically generates `final` instance fields, a canonical constructor, getters (`name()`), `equals()`, `hashCode()`, and `toString()`, eliminating boilerplate DTO code.",
    detailedExplanation: [
      "Immutability: All fields in a record are implicitly `private final`.",
      "Inheritance Restriction: Records implicitly extend `java.lang.Record` and CANNOT extend other classes (though they can implement interfaces).",
      "Compact Constructor: Allows validation logic inside constructors without repeating field assignments.",
      "Accessor Naming: Accessors use field name syntax `record.field()` rather than JavaBean `record.getField()`.",
    ],
    example: {
      language: "JAVA",
      code: 'public record Point(int x, int y) {\n    // Compact constructor validation:\n    public Point {\n        if (x < 0) throw new IllegalArgumentException("x cannot be negative");\n    }\n}\n\nPoint p = new Point(10, 20);\nSystem.out.println(p.x()); // 10',
    },
    interviewTip:
      "Highlight Records as the ideal solution for DTOs, API request/response payloads, and Map keys.",
    followUpQuestions: [
      "Can a Record declare mutable instance fields?",
      "How do Records simplify Serialization?",
    ],
    relatedTopics: ["Java 8+", "OOP", "Immutability"],
    tags: ["Java 8+", "Modern Java"],
  },
  {
    topicSlug: "java",
    slug: "java-sealed-classes-interfaces",
    title: "What are Sealed Classes and Interfaces (sealed, permits) in Java 17+?",
    difficulty: "MEDIUM",
    subtopic: "Java 8+",
    synopsis: "Restricting class inheritance hierarchy to explicit authorized subclasses.",
    shortAnswer:
      "Sealed Classes and Interfaces (`sealed`, Java 17+) allow authors to restrict which specific subclasses or sub-interfaces are permitted to extend/implement them using the `permits` clause, enabling strict algebraic data type modeling.",
    detailedExplanation: [
      "Syntax: `public sealed class Shape permits Circle, Square, Rectangle {}`.",
      "Subclass Rules: Permitted subclasses MUST explicitly declare one of three modifiers: 1) `final` (cannot be extended further), 2) `sealed` (extends hierarchy control), or 3) `non-sealed` (opens class to unrestricted inheritance).",
      "Exhaustive Pattern Matching: Enables compiler exhaustiveness checks in `switch` statements without requiring a default clause.",
    ],
    example: {
      language: "JAVA",
      code: 'public sealed interface Shape permits Circle, Square {}\npublic final class Circle implements Shape { double radius; }\npublic final class Square implements Shape { double side; }',
    },
    interviewTip:
      "Connect Sealed Classes to Pattern Matching: sealed hierarchies allow the Java compiler to guarantee exhaustiveness in `switch` expressions.",
    followUpQuestions: [
      "What is the difference between sealed, final, and non-sealed subclasses?",
      "How do sealed classes help domain-driven design?",
    ],
    relatedTopics: ["Java 8+", "Modern Java", "OOP"],
    tags: ["Java 8+", "Modern Java"],
  },
  {
    topicSlug: "java",
    slug: "java-pattern-matching-instanceof-switch",
    title: "How does Pattern Matching for instanceof and switch work in Java 16/21?",
    difficulty: "MEDIUM",
    subtopic: "Java 8+",
    synopsis: "Eliminating explicit casting boilerplate and enabling switch record destructuring.",
    shortAnswer:
      "Pattern Matching for `instanceof` (Java 16) combines type checking and automatic casting into a single step. Pattern Matching for `switch` (Java 21) allows switching on object types, record patterns, and guarded conditions (`when`), eliminating verbose casting boilerplate.",
    detailedExplanation: [
      "Legacy: `if (obj instanceof String) { String s = (String) obj; ... }`.",
      "Pattern `instanceof`: `if (obj instanceof String s) { System.out.println(s.length()); }`.",
      "Switch Patterns (Java 21): Supports type patterns, null handling (`case null`), and record decomposition patterns (`case Point(int x, int y)`).",
    ],
    example: {
      language: "JAVA",
      code: 'Object obj = "Hello Java 21";\nString result = switch (obj) {\n    case String s when s.length() > 5 -> "Long string: " + s;\n    case String s -> "Short string";\n    case Integer i -> "Number: " + i;\n    default -> "Unknown";\n};',
    },
    interviewTip:
      "Highlight clean functional syntax: pattern matching eliminates repetitive manual cast lines (`(String) obj`).",
    followUpQuestions: [
      "What are Record Patterns in Java 21?",
      "How does the compiler enforce exhaustiveness in switch pattern matching?",
    ],
    relatedTopics: ["Java 8+", "Modern Java", "Pattern Matching"],
    tags: ["Java 8+", "Modern Java"],
  },
  {
    topicSlug: "java",
    slug: "java-virtual-threads-project-loom",
    title: "What are Virtual Threads (Project Loom / Java 21) and how do they differ from Platform Threads?",
    difficulty: "HARD",
    subtopic: "Multithreading",
    synopsis: "Lightweight user-mode JVM threads enabling high-throughput concurrent I/O scaling.",
    shortAnswer:
      "Virtual Threads (Java 21, Project Loom) are lightweight user-mode threads managed directly by the JVM rather than the OS kernel. Unlike 1:1 Platform Threads (which cost 1MB+ stack memory and OS thread switches), millions of Virtual Threads can run concurrently over a small pool of carrier OS threads.",
    detailedExplanation: [
      "Platform Threads: 1:1 mapping with OS kernel threads. High memory footprint (~1MB stack), slow context switching.",
      "Virtual Threads: M:N mapping. Managed by JVM runtime. Extends `java.lang.Thread`. Extremely cheap overhead (~few hundred bytes).",
      "Cooperative Unmounting: When a Virtual Thread encounters blocking I/O (e.g. database query, socket read), the JVM unmounts it from the carrier OS thread, freeing the carrier thread to run other virtual threads.",
      "Thread-per-Request Model: Makes high-concurrency web applications scalable without writing complex reactive async callback code.",
    ],
    example: {
      language: "JAVA",
      code: 'try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {\n    IntStream.range(0, 10_000).forEach(i -> {\n        executor.submit(() -> {\n            Thread.sleep(1000); // Non-blocking unmount!\n            return i;\n        });\n    });\n} // Auto-waits for all 10,000 virtual threads',
    },
    interviewTip:
      "Highlight the fundamental paradigm shift: Virtual Threads make thread-per-request blocking code performant at scale, replacing messy reactive non-blocking frameworks (`RxJava`, `Reactor`) for I/O bound workloads.",
    commonTrap:
      "Pooling Virtual Threads! Virtual threads are so cheap that they should be created on-demand and discarded—never pooled via FixedThreadPool.",
    followUpQuestions: [
      "What is Thread Pinning in Virtual Threads (synchronized blocks / native calls)?",
      "How do Virtual Threads compare to Kotlin Coroutines or Go Goroutines?",
    ],
    relatedTopics: ["Multithreading", "Concurrency", "Virtual Threads", "Modern Java"],
    tags: ["Multithreading", "Modern Java"],
  },
  {
    topicSlug: "java",
    slug: "java-vector-vs-arraylist",
    title: "What is the difference between Vector and ArrayList in Java?",
    difficulty: "EASY",
    subtopic: "Collections",
    synopsis: "Legacy synchronized dynamic array vs modern unsynchronized high-performance array.",
    shortAnswer:
      "`Vector` is a legacy thread-safe collection where every method is `synchronized` (causing high lock contention). `ArrayList` is a modern unsynchronized collection that provides significantly higher performance for single-threaded or custom synchronized workflows.",
    detailedExplanation: [
      "Synchronization: `Vector` synchronizes every individual method. `ArrayList` is unsynchronized.",
      "Growth Factor: When capacity is exceeded, `Vector` doubles its array size (100% growth), whereas `ArrayList` grows by 50% (`oldCap + (oldCap >> 1)`).",
      "Historical Status: `Vector` is a legacy JDK 1.0 class retrofitted into Collections Framework. `ArrayList` is the standard since JDK 1.2.",
    ],
    interviewTip:
      "If thread safety is needed, recommend `Collections.synchronizedList(new ArrayList<>())` or `CopyOnWriteArrayList` over `Vector`.",
    followUpQuestions: [
      "Why is doubling array capacity in Vector less memory efficient than ArrayList 1.5x growth?",
      "What is Enumeration vs Iterator in Vector?",
    ],
    relatedTopics: ["Collections", "ArrayList"],
    tags: ["Collections"],
  },
  {
    topicSlug: "java",
    slug: "java-throw-vs-throws",
    title: "What is the difference between throw and throws keywords in Java?",
    difficulty: "EASY",
    subtopic: "Exception Handling",
    synopsis: "Explicitly raising an exception instance vs declaring method exception signatures.",
    shortAnswer:
      "`throw` is an action keyword used inside a method body to explicitly raise a specific exception object instance (`throw new Exception()`). `throws` is a declaration clause used in a method signature to declare exceptions that the method might propagate to its caller.",
    detailedExplanation: [
      "`throw`: Followed by an exception instance (`throw instance`). Executes exception propagation immediately.",
      "`throws`: Followed by exception class names (`throws IOException, SQLException`). Declares checked exceptions for caller handling.",
      "Multiple exceptions: `throws` can declare multiple comma-separated exception classes; `throw` can only raise one exception at a time.",
    ],
    example: {
      language: "JAVA",
      code: 'public void validateAge(int age) throws IllegalArgumentException { // Signature declaration\n    if (age < 18) {\n        throw new IllegalArgumentException("Underage"); // Explicit instance throw\n    }\n}',
    },
    interviewTip:
      "Summarize cleanly: 'throw raises an exception instance; throws declares an exception signature class.'",
    followUpQuestions: [
      "Can unchecked exceptions be declared in a throws signature?",
      "What is re-throwing exceptions?",
    ],
    relatedTopics: ["Exception Handling"],
    tags: ["Exception Handling"],
  },
  {
    topicSlug: "java",
    slug: "java-try-catch-finally-return-values",
    title: "What happens if a return statement is present in both try and finally blocks?",
    difficulty: "MEDIUM",
    subtopic: "Exception Handling",
    synopsis: "Finally block execution order and return value overriding.",
    shortAnswer:
      "If both `try` (or `catch`) and `finally` blocks contain `return` statements, the `return` statement in the `finally` block OVERRIDES any return value or exception thrown in the `try`/`catch` blocks.",
    detailedExplanation: [
      "Execution Order: The code inside `finally` ALWAYS executes before method exit.",
      "Return Overriding: If `try` calculates a return value `1` and `finally` executes `return 2`, the method returns `2`.",
      "Exception Swallowing: If `try` throws an exception and `finally` executes `return`, the thrown exception is completely suppressed and lost!",
    ],
    example: {
      language: "JAVA",
      code: 'public static int test() {\n    try {\n        return 1;\n    } finally {\n        return 2; // Overrides try return! Returns 2.\n    }\n}',
    },
    interviewTip:
      "Calling out exception swallowing makes a great impression: placing `return` inside a `finally` block is an anti-pattern because it silently swallows uncaught exceptions.",
    commonTrap:
      "Putting `return` inside `finally` blocks in production code.",
    followUpQuestions: [
      "What happens if System.exit(0) is called in try block?",
      "Does finally execute if an OutOfMemoryError occurs?",
    ],
    relatedTopics: ["Exception Handling", "Control Flow"],
    tags: ["Exception Handling"],
  },
  {
    topicSlug: "java",
    slug: "java-marker-interfaces",
    title: "What is a Marker Interface in Java (Serializable, Cloneable, RandomAccess)?",
    difficulty: "EASY",
    subtopic: "OOP",
    synopsis: "Empty tagging interfaces providing type metadata to JVM and frameworks.",
    shortAnswer:
      "A Marker Interface is an empty interface containing no methods or constants (e.g. `Serializable`, `Cloneable`, `RandomAccess`). It serves as a type tag to signal special behavior guarantees to the JVM or framework via `instanceof` checks.",
    detailedExplanation: [
      "Purpose: Delivers metadata type indications to compiler/JVM without forcing method implementations.",
      "Examples: `java.io.Serializable` (allows object serialization), `java.lang.Cloneable` (permits `Object.clone()`), `java.util.RandomAccess` (indicates fast $O(1)$ index access in lists).",
      "Modern Alternative: Custom Annotations (`@Annotation`) have largely superseded marker interfaces in modern Java framework design.",
    ],
    example: {
      language: "JAVA",
      code: 'if (list instanceof RandomAccess) {\n    // Use fast index-based for loop\n    for (int i = 0; i < list.size(); i++) { list.get(i); }\n} else {\n    // Use iterator loop for LinkedList\n    for (String item : list) { ... }\n}',
    },
    interviewTip:
      "Compare marker interfaces with annotations: annotations provide more flexible metadata placement, but marker interfaces enforce compile-time type safety (`List<Serializable>`).",
    followUpQuestions: [
      "Why is RandomAccess marker interface checked in Collections.binarySearch()?",
      "How do annotations differ from marker interfaces?",
    ],
    relatedTopics: ["OOP", "Interfaces", "JVM"],
    tags: ["OOP"],
  },
  {
    topicSlug: "java",
    slug: "java-strictfp-keyword",
    title: "What is the strictfp keyword in Java?",
    difficulty: "HARD",
    subtopic: "Fundamentals",
    synopsis: "Ensuring identical IEEE 754 floating-point calculations across different CPU architectures.",
    shortAnswer:
      "`strictfp` (strict floating-point) is a keyword that restricts floating-point calculations (`float` and `double`) to strictly follow IEEE 754 standards, ensuring identical floating-point results across different hardware CPU platforms.",
    detailedExplanation: [
      "Platform Variation: Different CPU microarchitectures (x86 80-bit FPU registers vs ARM 64-bit FPU) can produce slightly different floating-point precision results.",
      "`strictfp` Enforcement: Forces 32-bit (float) and 64-bit (double) exponent limits during intermediate calculations.",
      "Java 17 Update: Since Java 17, all floating-point expressions are ALWAYS strictly IEEE 754 compliant, making the `strictfp` keyword obsolete.",
    ],
    interviewTip:
      "Demonstrate up-to-date knowledge by mentioning that `strictfp` was made obsolete in Java 17 because default floating-point execution is now always strict.",
    followUpQuestions: [
      "Why do IEEE 754 floating-point calculations produce precision errors like 0.1 + 0.2 != 0.3?",
      "When should BigDecimal be used instead of float/double?",
    ],
    relatedTopics: ["Fundamentals", "Math", "Modern Java"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "java",
    slug: "java-object-class-methods",
    title: "What are the core methods of java.lang.Object?",
    difficulty: "EASY",
    subtopic: "OOP",
    synopsis: "Root superclass methods inherited by every Java object.",
    shortAnswer:
      "`java.lang.Object` is the root of the Java class hierarchy. Its core methods are: `equals()`, `hashCode()`, `toString()`, `clone()`, `getClass()`, `finalize()` (deprecated), and concurrency monitor methods `wait()`, `notify()`, `notifyAll()`.",
    detailedExplanation: [
      "`equals(Object)` & `hashCode()`: Used for logical equality and hash table index resolution.",
      "`toString()`: String representation (`ClassName@hashCodeHex`).",
      "`getClass()`: Returns the runtime `Class<?>` reflection object.",
      "`clone()`: Creates a field-by-field shallow copy.",
      "`wait()`, `notify()`, `notifyAll()`: Inter-thread synchronization on monitor lock.",
    ],
    interviewTip:
      "Highlight that `wait()`, `notify()`, and `notifyAll()` belong to `Object` (not `Thread`) because intrinsic monitor locks are attached to heap objects.",
    followUpQuestions: [
      "Why are wait() and notify() declared on Object instead of Thread?",
      "What is the default implementation of toString() in Object?",
    ],
    relatedTopics: ["OOP", "Object Methods", "JVM"],
    tags: ["OOP"],
  },
  {
    topicSlug: "java",
    slug: "java-inner-classes-types",
    title: "What are the different types of Inner Classes in Java (Member, Static Nested, Local, Anonymous)?",
    difficulty: "MEDIUM",
    subtopic: "OOP",
    synopsis: "Class encapsulation variations and outer instance reference bindings.",
    shortAnswer:
      "Java supports 4 types of nested classes: 1) Static Nested Class (no outer instance reference), 2) Member Inner Class (holds implicit outer `this` reference), 3) Local Inner Class (defined inside a method), and 4) Anonymous Inner Class (unnamed inline subclass/interface implementation).",
    detailedExplanation: [
      "Static Nested Class: `static class Nested {}`. Does NOT hold outer reference. Prevents memory leaks.",
      "Member Inner Class: `class Inner {}`. Can access outer class private fields directly, but holds strong pointer to outer instance.",
      "Local Inner Class: Defined inside a method body. Can access method local variables if `final` or effectively final.",
      "Anonymous Inner Class: Instantiated inline (`new Runnable() { public void run() {} }`). Largely replaced by Lambda expressions in Java 8+.",
    ],
    example: {
      language: "JAVA",
      code: 'public class Outer {\n    static class StaticNested {} // Best practice for helper classes\n    class Inner {}               // Holds Outer.this pointer\n}',
    },
    interviewTip:
      "Warn about memory leaks: Member Inner classes hold an implicit reference to their outer instance, which can prevent outer instances from being garbage collected in Android or long-lived handler pools.",
    followUpQuestions: [
      "Why does non-static inner class cause memory leaks in Android handlers?",
      "How do lambdas replace anonymous inner classes in bytecode execution?",
    ],
    relatedTopics: ["OOP", "Inner Classes", "Memory Management"],
    tags: ["OOP"],
  },
  {
    topicSlug: "java",
    slug: "java-array-length-vs-string-length",
    title: "What is the difference between array length, String length(), and Collection size()?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Syntactic property attribute vs string length method vs collection element count.",
    shortAnswer:
      "`length` is an immutable field property on Java array objects (`arr.length`). `length()` is a method on `String` objects returning UTF-16 character count (`str.length()`). `size()` is a method on `Collection` objects returning stored element count (`list.size()`).",
    detailedExplanation: [
      "Array: Primitive/Object arrays use the final field property `arr.length` (no parentheses).",
      "String: Strings use the method `str.length()` (with parentheses).",
      "Collections: Interfaces (`List`, `Set`, `Map`) use the method `collection.size()`.",
    ],
    example: {
      language: "JAVA",
      code: 'int[] arr = new int[5];\nint len1 = arr.length;      // Field attribute\n\nString str = "Hello";\nint len2 = str.length();    // Method call\n\nList<Integer> list = List.of(1, 2, 3);\nint len3 = list.size();     // Collection method call',
    },
    interviewTip:
      "Simple syntax check: candidates often write `arr.length()` or `str.length` by mistake during whiteboard coding sessions.",
    followUpQuestions: [
      "How does String.length() handle unicode surrogate pairs?",
      "What is String.codePointCount()?",
    ],
    relatedTopics: ["Fundamentals", "Strings", "Collections"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "java",
    slug: "java-system-gc-vs-runtime-gc",
    title: "What does System.gc() do and can you force garbage collection in Java?",
    difficulty: "EASY",
    subtopic: "JVM",
    synopsis: "Requesting vs guaranteeing JVM garbage collection execution.",
    shortAnswer:
      "`System.gc()` (or `Runtime.getRuntime().gc()`) suggests that the JVM expend effort toward recycling unreachable objects. However, it is ONLY a hint or request—the JVM does NOT guarantee that garbage collection will run immediately or at all.",
    detailedExplanation: [
      "Hint, Not Command: The JVM garbage collector decides when to execute based on memory allocation pressure.",
      "Performance Overhead: Calling `System.gc()` in production can trigger a full Stop-The-World pause, hurting latency.",
      "Disabling System.gc: Production JVMs often pass `-XX:+DisableExplicitGC` flag to ignore `System.gc()` calls completely.",
    ],
    interviewTip:
      "Emphasize: Never call `System.gc()` in production business code—trust the JVM GC algorithms to handle heap management automatically.",
    followUpQuestions: [
      "What does -XX:+DisableExplicitGC flag do?",
      "How to tune garbage collection triggers using JVM flags?",
    ],
    relatedTopics: ["JVM", "Garbage Collection", "Performance"],
    tags: ["JVM"],
  },
  {
    topicSlug: "java",
    slug: "java-io-vs-nio",
    title: "What is the difference between Java I/O (blocking streams) and Java NIO (non-blocking channels, buffers, selectors)?",
    difficulty: "HARD",
    subtopic: "I/O & Serialization",
    synopsis: "Stream-oriented blocking I/O vs buffer-oriented non-blocking event selectors.",
    shortAnswer:
      "Standard Java I/O (`java.io`) is stream-oriented and thread-blocking (one thread per socket connection). Java NIO (`java.nio`, Non-blocking I/O) is buffer-oriented and channel-based, using a single `Selector` thread to manage thousands of concurrent socket connections multiplexed via OS kernel epoll/kqueue.",
    detailedExplanation: [
      "Java I/O: Stream-based (`InputStream`, `OutputStream`). Reads byte by byte or line by line. Thread blocks on `read()` until data arrives.",
      "Java NIO: Buffer & Channel based (`FileChannel`, `SocketChannel`, `ByteBuffer`). Data read into buffers. Non-blocking.",
      "NIO Selectors: Single thread monitors multiple network channels for read/write readiness events via kernel system calls (`epoll` on Linux, `kqueue` on macOS).",
      "Use Case: Netty framework and high-concurrency web servers (Tomcat NIO, Netty, Mina) rely on Java NIO for extreme scalability.",
    ],
    example: {
      language: "JAVA",
      code: '// NIO Selector Multiplexing\nSelector selector = Selector.open();\nServerSocketChannel serverChannel = ServerSocketChannel.open();\nserverChannel.configureBlocking(false);\nserverChannel.register(selector, SelectionKey.OP_ACCEPT);',
    },
    interviewTip:
      "Highlight OS kernel multiplexing (`epoll` / `kqueue`): NIO allows a single Selector thread to handle 100,000+ open socket connections efficiently without thread context-switching overhead.",
    followUpQuestions: [
      "How does Netty leverage Java NIO for asynchronous event-driven networking?",
      "What is DirectByteBuffer vs HeapByteBuffer in Java NIO?",
    ],
    relatedTopics: ["I/O & Serialization", "NIO", "Concurrency"],
    tags: ["I/O & Serialization", "Performance"],
  },
  {
    topicSlug: "java",
    slug: "java-default-and-static-interface-methods",
    title: "Why were Default and Static methods introduced in Interfaces in Java 8?",
    difficulty: "EASY",
    subtopic: "Java 8+",
    synopsis: "Interface evolution without breaking backward compatibility of existing implementations.",
    shortAnswer:
      "Default methods (`default`) were introduced in Java 8 to allow adding new methods to existing interfaces (e.g. adding `stream()` and `forEach()` to `java.util.Collection`) without breaking existing 3rd-party implementations. Static methods allow interfaces to host utility factory functions.",
    detailedExplanation: [
      "Backward Compatibility: Adding an abstract method to `Collection` in Java 8 would have broken millions of custom library classes. `default` methods provide default implementation fallback.",
      "API Organization: Static methods on interfaces eliminate the need for companion utility classes (`Collections`, `Paths`).",
      "Multiple Interface Defaults: Conflicting default method signatures across multiple implemented interfaces must be explicitly resolved in the implementing class.",
    ],
    example: {
      language: "JAVA",
      code: 'public interface Iterable<T> {\n    // Default method added in Java 8 without breaking existing implementations!\n    default void forEach(Consumer<? super T> action) {\n        for (T t : this) action.accept(t);\n    }\n}',
    },
    interviewTip:
      "Connect `default` methods directly to Java 8 Streams: `Collection.stream()` was added as a default method so all Java 7 collections gained stream capabilities instantly upon updating to Java 8.",
    followUpQuestions: [
      "How does default method resolution handle conflicts?",
      "Can default methods override Object class methods like equals() or hashCode()?",
    ],
    relatedTopics: ["Java 8+", "Interfaces", "OOP"],
    tags: ["Java 8+", "OOP"],
  },
];
