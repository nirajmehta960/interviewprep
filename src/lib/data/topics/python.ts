import type { ConceptualQuestion } from "../conceptual";

export const pythonQuestions: ConceptualQuestion[] = [
  {
    topicSlug: "python",
    slug: "what-is-python",
    title: "What is Python?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Dynamic typing, interpretation, and what CPython actually does.",
    shortAnswer:
      "Python is a high-level, dynamically typed, interpreted language with automatic memory management and readability emphasis. The reference implementation, CPython, compiles source code to bytecode and executes it on a stack-based virtual machine.",
    detailedExplanation: [
      "Python is dynamically typed (variables bound to objects at runtime) and strongly typed (no implicit type coercions like `1 + '1'`).",
      "CPython compiles `.py` source code to `.pyc` bytecode, which runs on the CPython VM.",
      "Memory management uses reference counting + a cyclic generational garbage collector.",
      "Global Interpreter Lock (GIL) limits execution to 1 thread of bytecode at a time per process.",
    ],
    interviewTip:
      "Distinguish Python the language from CPython the reference implementation. Mention that the GIL is a CPython property, not a language specification rule.",
    commonTrap:
      "Confusing dynamic typing with weak typing. Python checks types dynamically but enforces them strictly.",
    followUpQuestions: [
      "What is the GIL and when does it matter?",
      "How does Python manage memory?",
      "What is the difference between CPython and PyPy?",
    ],
    relatedTopics: ["Python Fundamentals", "Memory Management", "GIL"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "python",
    slug: "python-list-vs-tuple",
    title: "What is the difference between a list and a tuple?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Mutability, hashability, and the semantic signal each one sends.",
    shortAnswer:
      "Lists are mutable and heterogeneous. Tuples are immutable and hashable (if elements are hashable), allowing them to be used as dictionary keys or set elements.",
    detailedExplanation: [
      "Lists support `append`, `insert`, and item mutation. Tuples cannot be modified after creation.",
      "Tuples are hashable and can be dictionary keys or set elements.",
      "Tuples have smaller memory footprints and faster construction overhead.",
      "Immutability in tuples is shallow: a tuple containing a list can still have its inner list mutated.",
    ],
    example: {
      language: "PYTHON",
      code: 'my_list = [1, 2, 3]\nmy_tuple = (1, 2, 3)\nmy_dict = {my_tuple: "valid"} # List as key raises TypeError!',
    },
    interviewTip:
      "Highlight shallow immutability: a tuple containing a list `(1, [2, 3])` is NOT hashable because the inner list is mutable.",
    followUpQuestions: [
      "Why can a tuple be a dict key but not a list?",
      "When would you use a NamedTuple or dataclass?",
    ],
    relatedTopics: ["Lists", "Tuples", "Dictionaries"],
    tags: ["Fundamentals", "Data Structures"],
  },
  {
    topicSlug: "python",
    slug: "python-mutable-default-argument",
    title: "Why are mutable default arguments dangerous?",
    difficulty: "EASY",
    subtopic: "Functions",
    synopsis: "Defaults evaluate once at definition time, so the object is shared across calls.",
    shortAnswer:
      "Default argument expressions are evaluated ONCE when the function definition (`def`) is executed, not on each call. A mutable default (`[]` or `{}`) is shared across all function invocations.",
    detailedExplanation: [
      "Default values are stored on `func.__defaults__` when the function is defined.",
      "Modifying a default parameter in one function call alters it for all subsequent calls.",
      "Idiomatic fix: Use `None` as sentinel default value and initialize the mutable object inside the function body.",
    ],
    example: {
      language: "PYTHON",
      code: "# Broken:\ndef append_to(element, target=[]):\n    target.append(element)\n    return target\n\n# Fixed:\ndef append_to(element, target=None):\n    if target is None:\n        target = []\n    target.append(element)\n    return target",
    },
    interviewTip:
      "Explain *why* mutable defaults fail: default expressions evaluate at function definition time (import time) and attach to `func.__defaults__`.",
    commonTrap:
      "Using `datetime.now()` as default argument: `def log(msg, when=datetime.now())` freezes the time at import time!",
    followUpQuestions: [
      "Where are default values stored in Python function objects?",
      "When is a mutable default actually useful (e.g. memoization cache)?",
    ],
    relatedTopics: ["Functions", "Mutability"],
    tags: ["Functions", "Gotchas"],
  },
  {
    topicSlug: "python",
    slug: "python-shallow-vs-deep-copy",
    title: "What is the difference between a shallow and a deep copy?",
    difficulty: "MEDIUM",
    subtopic: "Fundamentals",
    synopsis: "One level of copying versus a full recursive clone.",
    shortAnswer:
      "A shallow copy (`copy.copy()`) creates a new outer container but retains references to original nested objects. A deep copy (`copy.deepcopy()`) recursively clones all nested objects.",
    detailedExplanation: [
      "Shallow copy constructs a new object and populates it with references to original child elements.",
      "Deep copy constructs a new object and recursively inserts copies of child elements.",
      "Deep copy tracks reference memos to handle cyclic references without infinite recursion.",
    ],
    example: {
      language: "PYTHON",
      code: "import copy\norig = [[1, 2], [3, 4]]\nshallow = copy.copy(orig)\ndeep = copy.deepcopy(orig)\norig[0][0] = 99 # shallow[0][0] becomes 99, deep[0][0] remains 1",
    },
    interviewTip:
      "Mention that slicing `a[:]` or list constructor `list(a)` produces shallow copies.",
    followUpQuestions: [
      "How does copy.deepcopy handle cyclic object references?",
      "How do custom classes override copy behavior via __copy__ and __deepcopy__?",
    ],
    relatedTopics: ["Fundamentals", "Memory Management"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "python",
    slug: "python-gil-multithreading-multiprocessing",
    title: "What is the Global Interpreter Lock (GIL) and how does it affect concurrency?",
    difficulty: "HARD",
    subtopic: "Concurrency",
    synopsis: "CPython single-thread bytecode execution mutex and CPU vs I/O bound work.",
    shortAnswer:
      "The GIL is a mutex in CPython that prevents multiple native OS threads from executing Python bytecode simultaneously. It makes threading effective for I/O-bound tasks but useless for CPU-bound tasks (which require multiprocessing).",
    detailedExplanation: [
      "The GIL protects CPython memory management and reference counting from race conditions.",
      "I/O operations (file, network, sleep) release the GIL while waiting.",
      "CPU-bound tasks should use the `multiprocessing` module or C extension modules (NumPy, Cython) that release the GIL.",
    ],
    interviewTip:
      "Clarify that Python GIL is an implementation detail of CPython. Alternative implementations like Jython or IronPython do not have a GIL.",
    followUpQuestions: [
      "Why does CPython rely on GIL instead of fine-grained locks?",
      "What is free-threaded Python (PEP 703 / Python 3.13)?",
    ],
    relatedTopics: ["GIL", "Multithreading", "Multiprocessing"],
    tags: ["Concurrency", "GIL"],
  },
  {
    topicSlug: "python",
    slug: "python-decorators-explained",
    title: "How do Python Decorators work?",
    difficulty: "MEDIUM",
    subtopic: "Functions",
    synopsis: "Higher-order function wrappers and syntactic sugar.",
    shortAnswer:
      "A decorator is a function that takes another function as an argument, wraps it with extra behavior in a closure, and returns the wrapper. `@decorator` is syntactic sugar for `func = decorator(func)`.",
    detailedExplanation: [
      "Decorators use closures to wrap original function calls with pre- and post-processing logic.",
      "`@functools.wraps(func)` preserves original function metadata (`__name__`, `__doc__`).",
      "Decorators with arguments require 3 nested function levels.",
    ],
    example: {
      language: "PYTHON",
      code: 'import functools\ndef my_decorator(func):\n    @functools.wraps(func)\n    def wrapper(*args, **kwargs):\n        print("Before")\n        return func(*args, **kwargs)\n    return wrapper',
    },
    interviewTip:
      "Always use `@functools.wraps` when writing custom decorators to prevent losing docstrings and function names.",
    followUpQuestions: [
      "How do you write a decorator that accepts parameters?",
      "How do class-based decorators work using __call__?",
    ],
    relatedTopics: ["Decorators", "Functions", "Closures"],
    tags: ["Decorators", "Functions"],
  },
  {
    topicSlug: "python",
    slug: "python-generators-yield",
    title: "What are Generators and how does the yield keyword work?",
    difficulty: "MEDIUM",
    subtopic: "Functions",
    synopsis: "Lazy iterator generation, state suspension, and memory efficiency.",
    shortAnswer:
      "Generators are functions that return an iterator using the `yield` keyword. `yield` suspends execution and returns a value to the caller, resuming state on the next call to `next()`.",
    detailedExplanation: [
      "Generators produce items on-demand (lazy evaluation), maintaining O(1) memory complexity.",
      "Calling a generator function returns a generator object without executing code until `next()` is called.",
      "`yield from` delegates generation to a sub-generator.",
    ],
    example: {
      language: "PYTHON",
      code: "def count_up_to(max):\n    count = 1\n    while count <= max:\n        yield count\n        count += 1",
    },
    interviewTip:
      "Highlight memory savings: reading a 10GB log file line-by-line using a generator uses kilobytes of memory, whereas `file.readlines()` loads 10GB into RAM.",
    followUpQuestions: [
      "What is the difference between yield and yield from?",
      "How do send(), throw(), and close() turn generators into coroutines?",
    ],
    relatedTopics: ["Generators", "Iterators"],
    tags: ["Generators", "Performance"],
  },
  {
    topicSlug: "python",
    slug: "python-dict-hashmap-implementation",
    title: "How is Python's dict implemented internally?",
    difficulty: "HARD",
    subtopic: "Data Structures",
    synopsis: "Open-addressing hash table, compact array layout, and hash collisions.",
    shortAnswer:
      "Python dictionaries are implemented as open-addressing hash tables with quadratic probing. Since Python 3.6, dicts maintain insertion order using a compact array layout.",
    detailedExplanation: [
      "Key objects must be hashable (`__hash__` and `__eq__`).",
      "Compact layout stores entries in a contiguous dense array and uses a small sparse index array.",
      "Hash collisions are resolved via pseudo-random open addressing probing `i = (5*i + 1 + perturb) % capacity`.",
    ],
    interviewTip:
      "Mention that Python dicts guarantee insertion order since Python 3.7+ as an official language spec.",
    followUpQuestions: [
      "Why must dictionary keys be hashable?",
      "How did Python 3.6 reduce dictionary memory usage by 20-25%?",
    ],
    relatedTopics: ["Dictionaries", "Hashing", "Data Structures"],
    tags: ["Data Structures", "Internals"],
  },
  {
    topicSlug: "python",
    slug: "python-is-vs-double-equals",
    title: "What is the difference between 'is' and '==' in Python?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Object identity vs value equality.",
    shortAnswer:
      "`is` checks object identity (whether two references point to the exact same memory address `id(a) == id(b)`). `==` checks value equality (whether values match via `a.__eq__(b)`).",
    detailedExplanation: [
      "`is` compares memory addresses.",
      "`==` invokes `__eq__()` operator overload.",
      "Integer interning (-5 to 256) and String interning cause `is` to evaluate True for small literal objects.",
    ],
    example: {
      language: "PYTHON",
      code: "a = [1, 2]\nb = [1, 2]\na == b # True (same content)\na is b # False (distinct memory objects)",
    },
    interviewTip:
      "Always use `is` when comparing with `None` (`if x is None:`).",
    followUpQuestions: [
      "Why is Integer interning limited to -5 to 256 in CPython?",
      "Why should you never compare strings using 'is'?",
    ],
    relatedTopics: ["Fundamentals", "Operators"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "python",
    slug: "python-lambda-map-filter-reduce",
    title: "How do Lambda functions, map(), filter(), and reduce() work?",
    difficulty: "EASY",
    subtopic: "Functions",
    synopsis: "Anonymous inline functions and functional processing primitives.",
    shortAnswer:
      "Lambda functions are small anonymous inline functions (`lambda args: expr`). `map()` applies a function to all iterable items. `filter()` selects elements satisfying a predicate. `reduce()` aggregates elements cumulatively.",
    detailedExplanation: [
      "Lambdas are restricted to a single expression (implicit return).",
      "`map()` and `filter()` return lazy iterators in Python 3.",
      "`reduce()` was moved to `functools.reduce` in Python 3.",
    ],
    example: {
      language: "PYTHON",
      code: "from functools import reduce\nnums = [1, 2, 3, 4]\nevens = list(filter(lambda x: x % 2 == 0, nums))\nsum_all = reduce(lambda a, b: a + b, nums)",
    },
    interviewTip:
      "State that List Comprehensions and Generator Expressions are generally preferred over `map()` and `filter()` in Python for readability.",
    followUpQuestions: [
      "Why does Python limit lambdas to a single expression?",
      "How do list comprehensions compare to map() + filter()?",
    ],
    relatedTopics: ["Functions", "Lambda"],
    tags: ["Functions"],
  },
  {
    topicSlug: "python",
    slug: "python-list-sorting-timsort",
    title: "How does sorting work in Python (sort vs sorted & Timsort)?",
    difficulty: "MEDIUM",
    subtopic: "Data Structures",
    synopsis: "In-place list.sort() vs new list sorted() and Timsort algorithm.",
    shortAnswer:
      "`list.sort()` sorts a list in-place returning None. `sorted()` returns a new sorted list from any iterable. Both use Timsort, a hybrid stable algorithm (Merge Sort + Insertion Sort) with O(N log N) worst-case and O(N) best-case complexity.",
    detailedExplanation: [
      "Timsort identifies already-sorted segments (runs) and merges them efficiently.",
      "Supports key functions (`key=len` or `key=lambda x: x.age`) and `reverse=True`.",
      "Stable sort: preserves relative order of elements with equal keys.",
    ],
    interviewTip:
      "Mention Timsort's O(N) best-case complexity on nearly-sorted data.",
    followUpQuestions: [
      "What is a stable sort?",
      "How does Timsort optimize real-world data sorting?",
    ],
    relatedTopics: ["Sorting", "Algorithms", "Lists"],
    tags: ["Sorting", "Algorithms"],
  },
  {
    topicSlug: "python",
    slug: "python-exception-handling-try-except-else-finally",
    title: "How does Exception Handling (try-except-else-finally) work in Python?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Catching errors, optional else blocks, and guaranteed cleanup finally blocks.",
    shortAnswer:
      "`try` runs code. `except` catches exceptions. `else` runs ONLY if NO exception was raised in try. `finally` runs unconditionally for resource cleanup.",
    detailedExplanation: [
      "`else` executes after `try` succeeds without exception.",
      "`finally` executes even if `return` or uncaught exceptions occur.",
      "Custom exceptions inherit from `Exception` (not `BaseException`).",
    ],
    example: {
      language: "PYTHON",
      code: "try:\n    f = open('data.txt')\nexcept FileNotFoundError:\n    print('File missing')\nelse:\n    print('File read successfully')\nfinally:\n    print('Cleanup completed')",
    },
    interviewTip:
      "Explain `else` block: separating code that might raise exceptions from code that should only run if try succeeded.",
    followUpQuestions: [
      "What is the exception hierarchy in Python (BaseException vs Exception)?",
      "What is Exception Chaining (`raise from`)?",
    ],
    relatedTopics: ["Exception Handling", "Fundamentals"],
    tags: ["Exception Handling"],
  },
  {
    topicSlug: "python",
    slug: "python-set-frozenset",
    title: "What is the difference between set and frozenset in Python?",
    difficulty: "EASY",
    subtopic: "Data Structures",
    synopsis: "Mutable set vs immutable hashable frozenset.",
    shortAnswer:
      "`set` is a mutable collection of unique hashable elements. `frozenset` is an immutable, hashable set that can be used as dictionary keys or set elements.",
    detailedExplanation: [
      "Both provide O(1) membership testing (`in`), union (`|`), intersection (`&`), difference (`-`).",
      "Elements inside set/frozenset must be immutable and hashable.",
    ],
    interviewTip:
      "Use `frozenset` when you need a set of sets or set as dictionary keys.",
    followUpQuestions: [
      "How is set implemented internally in CPython?",
      "Why can't a set contain a list?",
    ],
    relatedTopics: ["Sets", "Data Structures"],
    tags: ["Data Structures"],
  },
  {
    topicSlug: "python",
    slug: "dunder-methods-magic-methods",
    title: "What are magic (dunder) methods and how do they enable operator overloading?",
    difficulty: "MEDIUM",
    subtopic: "OOP",
    synopsis: "Double-underscore methods hooking into Python syntax.",
    shortAnswer:
      "Dunder methods (`__init__`, `__str__`, `__len__`, `__add__`) are special hook methods in Python allowing custom classes to integrate with built-in functions (`len()`) and syntax operators (`+`, `==`).",
    detailedExplanation: [
      "`__str__` is for user display; `__repr__` is for developer debugging.",
      "`__getitem__` enables indexing and slicing.",
      "`__call__` makes instances callable like functions.",
    ],
    example: {
      language: "PYTHON",
      code: "class Point:\n    def __init__(self, x, y): self.x = x; self.y = y\n    def __add__(self, other): return Point(self.x + other.x, self.y + other.y)",
    },
    interviewTip:
      "If `__str__` is missing, Python falls back to `__repr__`.",
    followUpQuestions: [
      "Difference between __str__ and __repr__?",
      "How does __call__ work?",
    ],
    relatedTopics: ["OOP", "Python Fundamentals"],
    tags: ["OOP"],
  },
  {
    topicSlug: "python",
    slug: "python-new-vs-init",
    title: "What is the difference between __new__ and __init__ in Python?",
    difficulty: "HARD",
    subtopic: "OOP",
    synopsis: "Object creation (allocator) vs object initialization (constructor).",
    shortAnswer:
      "`__new__` creates and returns a new object instance. `__init__` initializes instance attributes after creation. `__new__` takes `cls`; `__init__` takes `self`.",
    detailedExplanation: [
      "`__new__` is overridden for immutable types and Singletons.",
      "`__init__` returns None.",
    ],
    interviewTip:
      "Immutable built-in subclasses (int, str, tuple) must mutate attributes inside `__new__`.",
    followUpQuestions: [
      "Why must __init__ return None?",
      "How do you build a thread-safe Singleton using __new__?",
    ],
    relatedTopics: ["OOP", "Design Patterns"],
    tags: ["OOP"],
  },
  {
    topicSlug: "python",
    slug: "python-context-managers-with-statement",
    title: "How do Context Managers and the 'with' statement work in Python?",
    difficulty: "MEDIUM",
    subtopic: "Fundamentals",
    synopsis: "Resource management protocol (__enter__ and __exit__) and @contextmanager.",
    shortAnswer:
      "Context managers automate resource allocation and cleanup using `__enter__()` and `__exit__()` methods invoked by the `with` statement.",
    detailedExplanation: [
      "`__enter__` returns the target object.",
      "`__exit__` handles cleanup and can suppress exceptions by returning True.",
      "`@contextmanager` decorator converts generators into context managers.",
    ],
    interviewTip:
      "Returning True from `__exit__` suppresses exceptions raised inside the with-block.",
    followUpQuestions: [
      "What arguments are passed to __exit__?",
      "What is contextlib.ExitStack?",
    ],
    relatedTopics: ["Context Managers", "File I/O"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "python",
    slug: "python-list-comp-vs-generator-expression",
    title: "What is the difference between List Comprehension and Generator Expression?",
    difficulty: "EASY",
    subtopic: "Data Structures",
    synopsis: "Eager in-memory list creation vs lazy streaming iterator evaluation.",
    shortAnswer:
      "List Comprehension `[x for x in data]` eagerly constructs a list in RAM. Generator Expression `(x for x in data)` lazily evaluates items one by one on-demand with O(1) RAM.",
    detailedExplanation: [
      "Generators use O(1) memory.",
      "Generators are single-pass iterators.",
    ],
    interviewTip:
      "Use Generator Expressions when passing data directly into streaming functions like `sum()` or `max()`.",
    followUpQuestions: [
      "Difference between iter() and next()?",
      "How does itertools.islice work?",
    ],
    relatedTopics: ["Generators", "List Comprehension"],
    tags: ["Performance"],
  },
  {
    topicSlug: "python",
    slug: "python-metaclasses-explained",
    title: "What are Metaclasses in Python and how do they work?",
    difficulty: "HARD",
    subtopic: "OOP",
    synopsis: "The 'class of a class' pattern, type object instantiation, and class creation interception.",
    shortAnswer:
      "A Metaclass is the class of a class (`type`). It intercepts and customizes class object creation before class instantiation.",
    detailedExplanation: [
      "Custom metaclasses inherit from `type`.",
      "Used in ORMs (Django, SQLAlchemy) and schema validation.",
    ],
    interviewTip:
      "Class decorators or `__init_subclass__` can solve most class customization needs without metaclasses.",
    followUpQuestions: [
      "What is __init_subclass__?",
      "What is Metaclass Conflict?",
    ],
    relatedTopics: ["OOP", "Metaclasses"],
    tags: ["Advanced Python"],
  },
  {
    topicSlug: "python",
    slug: "python-gc-refcount-generational",
    title: "How does Python Memory Management and Garbage Collection work?",
    difficulty: "HARD",
    subtopic: "Memory Management",
    synopsis: "Reference counting (sys.getrefcount), cyclic garbage collection, and 3-generation heaps.",
    shortAnswer:
      "Memory management uses Reference Counting (instant deallocation when count=0) + a cyclic Generational Garbage Collector (Generations 0, 1, 2) for reference loops.",
    detailedExplanation: [
      "Reference counting deallocates memory immediately when count reaches 0.",
      "Cyclic GC handles self-referential cycles (`a.append(b); b.append(a)`).",
    ],
    interviewTip:
      "`sys.getrefcount(x)` returns a count 1 higher because getrefcount argument creates a temporary reference.",
    followUpQuestions: [
      "What is PyMalloc?",
      "What are weak references (weakref)?",
    ],
    relatedTopics: ["Memory Management", "Garbage Collection"],
    tags: ["Internals"],
  },
  {
    topicSlug: "python",
    slug: "python-args-kwargs-unpacking",
    title: "How do *args, **kwargs, and Positional/Keyword-only Parameters work?",
    difficulty: "EASY",
    subtopic: "Functions",
    synopsis: "Positional tuple packing (*args), dictionary packing (**kwargs), and bare star separators.",
    shortAnswer:
      "`*args` packs positional arguments into a tuple. `**kwargs` packs keyword arguments into a dict. Bare `*` forces keyword-only arguments; `/` forces positional-only.",
    detailedExplanation: [
      "Unpacking in calls: `func(*list)` and `func(**dict)`.",
      "Parameter order: Positional-only `/`, standard, `*args`, Keyword-only `*`, `**kwargs`.",
    ],
    interviewTip:
      "Use `/` for C extension functions or parameters whose names might change without breaking call sites.",
    followUpQuestions: [
      "What happens when unpacking a dict with a single asterisk?",
      "Why were positional-only parameters introduced in Python 3.8?",
    ],
    relatedTopics: ["Functions", "Syntax"],
    tags: ["Functions"],
  },
  {
    topicSlug: "python",
    slug: "python-decorators-functools-wraps",
    title: "How do Decorators work and why is @functools.wraps essential?",
    difficulty: "MEDIUM",
    subtopic: "Functions",
    synopsis: "Higher-order function wrappers, closures, and preserving function metadata.",
    shortAnswer:
      "Decorators wrap functions using closures. `@functools.wraps` copies original function metadata (`__name__`, `__doc__`) to the wrapper function.",
    detailedExplanation: [
      "Without `@wraps`, function name becomes `'wrapper'`, breaking docstrings and introspective tools.",
    ],
    interviewTip:
      "Parametric decorators accepting arguments require 3 nested function levels.",
    followUpQuestions: [
      "How do class-based decorators work using __call__?",
      "In what order do chained decorators execute?",
    ],
    relatedTopics: ["Functions", "Decorators"],
    tags: ["Decorators"],
  },
  {
    topicSlug: "python",
    slug: "python-property-decorator-getter-setter",
    title: "How does the @property decorator work (Getters, Setters, Deleters)?",
    difficulty: "MEDIUM",
    subtopic: "OOP",
    synopsis: "Descriptor protocol encapsulation for controlled attribute access.",
    shortAnswer:
      "`@property` turns a method into a read-only attribute getter. Paired with `@var.setter` and `@var.deleter`, it provides clean encapsulation without breaking public attribute syntax.",
    detailedExplanation: [
      "Uses Python Descriptor protocol (`__get__`, `__set__`, `__delete__`).",
      "Allows adding validation logic to attribute assignment retroactively.",
    ],
    example: {
      language: "PYTHON",
      code: "class Circle:\n    def __init__(self, radius):\n        self._radius = radius\n    @property\n    def radius(self):\n        return self._radius\n    @radius.setter\n    def radius(self, value):\n        if value < 0: raise ValueError('Radius cannot be negative')\n        self._radius = value",
    },
    interviewTip:
      "Avoid writing Java-style `get_radius()` methods in Python! Use direct public attributes first, and refactor to `@property` if validation is needed later.",
    followUpQuestions: [
      "What is the Python Descriptor Protocol (__get__, __set__)?",
      "What is the difference between data descriptors and non-data descriptors?",
    ],
    relatedTopics: ["OOP", "Decorators", "Descriptors"],
    tags: ["OOP"],
  },
  {
    topicSlug: "python",
    slug: "python-dataclasses-vs-namedtuple",
    title: "What is the difference between @dataclass and NamedTuple in Python?",
    difficulty: "EASY",
    subtopic: "Data Structures",
    synopsis: "Mutable code generation class vs immutable tuple record.",
    shortAnswer:
      "`@dataclass` generates boilerplate methods (`__init__`, `__repr__`, `__eq__`) for mutable classes. `NamedTuple` creates immutable tuple subclasses with named field access.",
    detailedExplanation: [
      "`@dataclass` supports default values, mutability (or `frozen=True`), and inheritance.",
      "`NamedTuple` inherits from `tuple`, supports indexing `item[0]` and unpacking `a, b = item`.",
    ],
    interviewTip:
      "Use `NamedTuple` when you need tuple backward compatibility (indexing/unpacking); use `@dataclass` for mutable state objects or rich OOP methods.",
    followUpQuestions: [
      "How do post-init checks work in @dataclass (__post_init__)?",
      "How do field default factories work in @dataclass?",
    ],
    relatedTopics: ["Data Structures", "OOP"],
    tags: ["Data Structures"],
  },
  {
    topicSlug: "python",
    slug: "python-asyncio-event-loop-async-await",
    title: "How does asyncio and async/await work in Python?",
    difficulty: "HARD",
    subtopic: "Concurrency",
    synopsis: "Single-threaded cooperative multitasking event loop and coroutines.",
    shortAnswer:
      "`asyncio` enables cooperative single-threaded asynchronous concurrency. Functions defined with `async def` return coroutines. `await` yields control back to the event loop while waiting for non-blocking I/O.",
    detailedExplanation: [
      "Cooperative Multitasking: A running coroutine explicitly yields control via `await`.",
      "Event Loop schedules and executes tasks, managing socket read/write events.",
      "Async code MUST use async libraries (`aiohttp`, `asyncpg`); blocking code will stall the entire event loop.",
    ],
    example: {
      language: "PYTHON",
      code: "import asyncio\nasync def fetch_data():\n    await asyncio.sleep(1) # Yields control to event loop\n    return 'data'\nasyncio.run(fetch_data())",
    },
    interviewTip:
      "Highlight the golden rule of asyncio: NEVER call blocking synchronous functions (like `time.sleep()` or standard `requests.get()`) inside async coroutines! Use `asyncio.to_thread()` if legacy sync code must be run.",
    followUpQuestions: [
      "What is the difference between asyncio Task and Future?",
      "How does asyncio.gather() execute concurrent coroutines?",
    ],
    relatedTopics: ["Concurrency", "asyncio", "Event Loop"],
    tags: ["Concurrency", "Async"],
  },

  // --------------------------------------------------------------------------
  // ADDITIONAL GEEKSFORGEEKS QUESTIONS (25 - 62)
  // --------------------------------------------------------------------------
  {
    topicSlug: "python",
    slug: "python-pass-by-object-reference",
    title: "Is Python pass-by-value or pass-by-reference?",
    difficulty: "MEDIUM",
    subtopic: "Fundamentals",
    synopsis: "Pass-by-object-reference (call-by-assignment) and binding semantics.",
    shortAnswer:
      "Python is neither strictly pass-by-value nor pass-by-reference. It uses 'pass-by-object-reference' (or call-by-assignment). Arguments are passed by object reference: mutating a passed mutable object inside a function affects the caller, but rebinding the parameter variable inside the function does not.",
    detailedExplanation: [
      "When a variable is passed into a function, the function receives a copy of the reference to the underlying object.",
      "If the object is mutable (e.g. list, dict), mutating it via reference (`arg.append(1)`) modifies the object in place for the caller.",
      "If the parameter is rebound (`arg = [1, 2, 3]`), the local variable points to a new object, leaving the caller's reference unchanged.",
      "If the object is immutable (e.g. int, string, tuple), operations create new objects, preserving the original caller value.",
    ],
    example: {
      language: "PYTHON",
      code: 'def modify(lst, val):\n    lst.append(val)   # Mutates original caller object\n    lst = [99, 100]   # Rebinds local variable; caller unaffected\n\nmy_list = [1, 2]\nmodify(my_list, 3)\nprint(my_list)        # Output: [1, 2, 3]',
    },
    interviewTip:
      "Use the exact Python term 'Pass-by-object-reference' or 'Call-by-assignment' and draw the clear boundary between mutating an object vs rebinding a variable name.",
    commonTrap:
      "Thinking reassignment (`x = y`) copies values. Reassignment only binds a variable name to an object reference.",
    followUpQuestions: [
      "How does call-by-assignment differ from C++ reference parameters (`int &x`)?",
      "Why does `x += [1]` behave differently than `x = x + [1]` inside a function?",
    ],
    relatedTopics: ["Fundamentals", "Functions", "Memory Management"],
    tags: ["Fundamentals", "Functions"],
  },
  {
    topicSlug: "python",
    slug: "python-namespaces-types",
    title: "What are Namespaces in Python and what are their types?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Dictionaries mapping variable names to object references across scopes.",
    shortAnswer:
      "A namespace is a system (implemented internally as a dictionary) that ensures all variable names are unique and mapped to their corresponding objects. Python has Built-in, Global, Enclosing, and Local namespaces.",
    detailedExplanation: [
      "Local Namespace: Created when a function is called, containing local parameters and variables. Deleted on return.",
      "Enclosing (Nonlocal) Namespace: Namespace of enclosing outer functions when using nested closures.",
      "Global Namespace: Created when a module is loaded (`__main__` or imported `.py` file). Persists until interpreter exit.",
      "Built-in Namespace: Contains built-in functions (`len()`, `print()`, `TypeError`). Created when Python starts.",
      "`globals()` and `locals()` built-in functions return dictionaries representing global and local namespaces.",
    ],
    interviewTip:
      "Explain namespaces as Python's variable lookup map: names are keys and object memory addresses are values.",
    followUpQuestions: [
      "What happens if a variable exists in both global and local namespaces?",
      "What does locals() return inside class definitions?",
    ],
    relatedTopics: ["Fundamentals", "Scope", "LEGB"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "python",
    slug: "python-legb-rule-scope",
    title: "What is Scope and the LEGB Rule in Python?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Resolution order for variable lookups: Local -> Enclosing -> Global -> Built-in.",
    shortAnswer:
      "Scope defines the region of code where a variable name is directly accessible. Python resolves variable lookups sequentially using the LEGB rule: Local first, then Enclosing (closure), then Global (module), and finally Built-in.",
    detailedExplanation: [
      "L - Local: Names assigned inside a function body or lambda expression.",
      "E - Enclosing: Names in the local scope of any and all enclosing (nesting) functions, evaluated inner to outer.",
      "G - Global: Names declared at the top level of a module file or via `global` keyword.",
      "B - Built-in: Preloaded Python names such as `range`, `ValueError`, `open`.",
      "If Python cannot find a variable after checking all four LEGB scopes, it raises a `NameError`.",
    ],
    example: {
      language: "PYTHON",
      code: 'x = "Global"\ndef outer():\n    x = "Enclosing"\n    def inner():\n        x = "Local"\n        print(x) # Prints "Local"\n    inner()\nouter()',
    },
    interviewTip:
      "Highlight that LEGB applies to variable *resolution* (lookup). Creating or assigning variables defaults strictly to the Local scope unless marked `global` or `nonlocal`.",
    commonTrap:
      "Accidentally shadowing built-in functions, e.g., declaring `list = [1, 2]` hides the built-in `list()` constructor in local/global scope.",
    followUpQuestions: [
      "Why does `UnboundLocalError` occur when referencing a global variable before local assignment?",
      "How do module imports populate the Global scope?",
    ],
    relatedTopics: ["Fundamentals", "Scope", "LEGB"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "python",
    slug: "python-global-vs-nonlocal",
    title: "What is the difference between global and nonlocal keywords?",
    difficulty: "MEDIUM",
    subtopic: "Functions",
    synopsis: "Modifying variables in module-level scope vs outer enclosing closure scope.",
    shortAnswer:
      "`global` explicitly binds a variable inside a function to the module-level global scope. `nonlocal` explicitly binds a variable to the nearest enclosing (outer function) scope, excluding global.",
    detailedExplanation: [
      "By default, assigning a variable inside a function creates a new local variable.",
      "Use `global var_name` when you need to rebind or mutate a top-level module variable inside a function.",
      "Use `nonlocal var_name` in nested functions to rebind variables from outer outer-function scopes (essential for maintaining closure state).",
      "`nonlocal` cannot bind to variables in global scope or built-in scope; if no enclosing scope match exists, Python raises `SyntaxError`.",
    ],
    example: {
      language: "PYTHON",
      code: 'def make_counter():\n    count = 0\n    def increment():\n        nonlocal count # Rebinds outer count\n        count += 1\n        return count\n    return increment\n\nc = make_counter()\nprint(c()) # Output: 1\nprint(c()) # Output: 2',
    },
    interviewTip:
      "Explain `nonlocal` using stateful closure counters—it avoids the need for object instances or global variables.",
    followUpQuestions: [
      "What error occurs if `nonlocal` is used without an enclosing scope?",
      "How do global variables affect code testability and thread safety?",
    ],
    relatedTopics: ["Functions", "Closures", "Scope"],
    tags: ["Functions", "Scope"],
  },
  {
    topicSlug: "python",
    slug: "python-docstrings-vs-comments",
    title: "What are Docstrings in Python and how do they differ from Comments?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Runtime documentation strings (__doc__) versus developer compile-time comments.",
    shortAnswer:
      "Comments (`#`) are ignored by the Python compiler and exist solely for humans reading the source code. Docstrings (`\'\'\'...\'\'\'`) are retained at runtime as string literals attached to modules, classes, or functions via `__doc__`.",
    detailedExplanation: [
      "Comments begin with `#` and are completely stripped during tokenization/bytecode compilation.",
      "Docstrings are multiline triple-quoted strings placed immediately after `def`, `class`, or at the top of a module.",
      "Docstrings are accessible at runtime via `obj.__doc__` and displayed by `help(obj)` or automated doc generators (Sphinx, MkDocs).",
      "Follow standard docstring style conventions such as Google Style, NumPy Style, or PEP 257.",
    ],
    example: {
      language: "PYTHON",
      code: 'def add(a: int, b: int) -> int:\n    """Calculate sum of two integers.\n\n    Args:\n        a: First number\n        b: Second number\n    Returns:\n        Sum of a and b\n    """\n    return a + b\n\nprint(add.__doc__)',
    },
    interviewTip:
      "Mention that docstrings are programmatically inspectable at runtime (`func.__doc__`), making them useful for interactive REPL exploration and framework metadata extraction.",
    followUpQuestions: [
      "How does docstring testing (`doctest` module) work?",
      "What is PEP 257?",
    ],
    relatedTopics: ["Fundamentals", "Documentation"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "python",
    slug: "python-append-vs-extend",
    title: "What is the difference between list append() and extend() in Python?",
    difficulty: "EASY",
    subtopic: "Data Structures",
    synopsis: "Adding a single object element vs concatenating all elements from an iterable.",
    shortAnswer:
      "`append(x)` adds `x` as a single element to the end of the list. `extend(iterable)` iterates through `iterable` and appends each element individually to the list.",
    detailedExplanation: [
      "`append(x)` increases list length by exactly 1, even if `x` is a list or tuple (`lst.append([1, 2])` yields `[..., [1, 2]]`).",
      "`extend(iterable)` increases list length by `len(iterable)`, unpacking elements into the list (`lst.extend([1, 2])` yields `[..., 1, 2]`).",
      "Both modify the list in-place and return `None`.",
      "Time complexity for both is amortized O(K) where K is the number of elements appended.",
    ],
    example: {
      language: "PYTHON",
      code: 'a = [1, 2]\na.append([3, 4]) # Result: [1, 2, [3, 4]]\n\nb = [1, 2]\nb.extend([3, 4]) # Result: [1, 2, 3, 4]',
    },
    interviewTip:
      "Note that `lst.extend(iterable)` is functionally equivalent to `lst += iterable` in-place addition.",
    commonTrap:
      "Passing a string to `extend()`: `lst.extend('abc')` appends `'a'`, `'b'`, `'c'` individually because strings are iterables!",
    followUpQuestions: [
      "What is the time complexity of append vs insert(0, item)?",
      "How does list dynamic array over-allocation work in CPython?",
    ],
    relatedTopics: ["Lists", "Data Structures"],
    tags: ["Data Structures", "Lists"],
  },
  {
    topicSlug: "python",
    slug: "python-remove-pop-del",
    title: "What is the difference between remove(), pop(), and del in Python lists?",
    difficulty: "EASY",
    subtopic: "Data Structures",
    synopsis: "Removing by value vs removing & returning by index vs deleting by index/slice/variable.",
    shortAnswer:
      "`remove(val)` removes the first matching VALUE from the list. `pop(idx)` removes and RETURNS the element at index `idx` (defaulting to last). `del` is a statement that deletes by index, slice, or deletes the variable itself.",
    detailedExplanation: [
      "`list.remove(value)`: Searches list left-to-right for first occurrence of `value`. Raises `ValueError` if value not found. Returns `None`. O(N) time.",
      "`list.pop(index=-1)`: Removes element at given index and returns it. Raises `IndexError` if index out of bounds. O(1) for last element, O(N) for intermediate index.",
      "`del list[index]` or `del list[start:stop]`: Deletes index or slice without returning a value. Can also delete entire variable reference (`del x`).",
    ],
    example: {
      language: "PYTHON",
      code: 'lst = [10, 20, 30, 20]\nlst.remove(20) # lst becomes [10, 30, 20]\nval = lst.pop(0) # val = 10, lst becomes [30, 20]\ndel lst[0]     # lst becomes [20]',
    },
    interviewTip:
      "Summarize clearly: `remove` takes a value, `pop` takes an index and returns the item, `del` is a keyword statement.",
    followUpQuestions: [
      "What happens when calling pop() on an empty list?",
      "How does del affect reference count of deleted objects?",
    ],
    relatedTopics: ["Lists", "Data Structures"],
    tags: ["Data Structures"],
  },
  {
    topicSlug: "python",
    slug: "python-break-continue-pass",
    title: "What is the difference between break, continue, and pass statements?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Loop termination, skipping iterations, and syntactic null placeholders.",
    shortAnswer:
      "`break` terminates the nearest enclosing loop immediately. `continue` skips the remainder of the current loop iteration and jumps to the next iteration. `pass` is a null statement placeholder that does nothing.",
    detailedExplanation: [
      "`break`: Exits the loop control flow entirely. If the loop has an `else` block, `break` skips the loop's `else` block.",
      "`continue`: Immediately jumps back to loop header to evaluate condition / retrieve next iterable item.",
      "`pass`: Used as a placeholder where Python syntax requires a statement (e.g. empty function, empty class, exception pass-through).",
    ],
    example: {
      language: "PYTHON",
      code: 'for i in range(5):\n    if i == 1:\n        continue # Skip 1\n    if i == 3:\n        break    # Stop loop at 3\n    print(i)     # Output: 0, 2',
    },
    interviewTip:
      "Explain that `pass` is a no-op placeholder resolved at compile time, whereas `break` and `continue` alter loop execution flow.",
    commonTrap:
      "Confusing `pass` with `continue`. `pass` continues executing subsequent lines inside the same loop iteration!",
    followUpQuestions: [
      "How does the `else` clause work in Python `for` and `while` loops?",
      "What is the difference between `pass` and `Ellipsis` (`...`)?",
    ],
    relatedTopics: ["Control Flow", "Fundamentals"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "python",
    slug: "python-if-name-main",
    title: "What does the `if __name__ == '__main__'` construct do in Python?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Differentiating between direct script execution and module importing.",
    shortAnswer:
      "`if __name__ == '__main__'` checks whether the Python script is being run directly from CLI or imported as a module into another file. When executed directly, Python sets `__name__ = '__main__'`; when imported, `__name__` is set to the file's module name.",
    detailedExplanation: [
      "Every Python module has a built-in variable named `__name__`.",
      "If executing `python myscript.py`, CPython assigns `'__main__'` to `__name__` in that top-level script.",
      "If imported (`import myscript`), Python assigns `'myscript'` to `__name__`.",
      "This block allows files to serve dual purposes: reusable module libraries AND executable CLI scripts with entrypoint code.",
    ],
    example: {
      language: "PYTHON",
      code: 'def main():\n    print("Script running directly")\n\nif __name__ == "__main__":\n    main()',
    },
    interviewTip:
      "Emphasize modular design: putting execution logic inside `if __name__ == '__main__'` prevents side effects when unit testing or importing functions from that file.",
    followUpQuestions: [
      "What is sys.argv and how is it parsed inside main()?",
      "What happens when python -m module is executed from the terminal?",
    ],
    relatedTopics: ["Modules", "Fundamentals"],
    tags: ["Fundamentals", "Modules"],
  },
  {
    topicSlug: "python",
    slug: "python-modules-vs-packages",
    title: "What is the difference between Modules and Packages in Python?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Single `.py` file vs directory containing multiple modules and `__init__.py`.",
    shortAnswer:
      "A Module is a single Python file (`.py`) containing functions, classes, and code. A Package is a directory containing multiple Python modules and an `__init__.py` file (or namespace package structure) enabling hierarchical dot notation imports.",
    detailedExplanation: [
      "Module: Imported via `import my_module` or `from my_module import my_func`.",
      "Package: Directory containing `__init__.py` and sub-modules (`import pkg.subpkg.module`).",
      "`__init__.py`: Initializes package scope, executes package-level initialization code, and defines `__all__` exported symbols.",
      "Namespace Packages (PEP 420, Python 3.3+): Directories without `__init__.py` that allow splitting packages across multiple zip files or directory paths.",
    ],
    interviewTip:
      "Explain the hierarchy clearly: File -> Module, Directory of Modules -> Package, Collection of Packages -> Library/Distribution.",
    followUpQuestions: [
      "What is PEP 420 namespace package?",
      "What is `__all__` used for in `__init__.py` during `from package import *`?",
    ],
    relatedTopics: ["Modules", "Packages", "Fundamentals"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "python",
    slug: "python-slicing-explained",
    title: "How does Slicing work in Python `sequence[start:stop:step]`?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Non-mutating sequence extraction with start, stop, and step indexing.",
    shortAnswer:
      "Slicing extracts a shallow copy of a sub-sequence using `sequence[start:stop:step]`. `start` is inclusive (default 0), `stop` is exclusive (default len), and `step` is stride/direction (default 1).",
    detailedExplanation: [
      "`sequence[start:stop]`: Extracts elements from index `start` up to but not including `stop`.",
      "Negative indices count backwards from the end (`-1` is last element).",
      "Negative step stride reverses traversal direction (`seq[::-1]` reverses a string or list).",
      "Slice indices handle out-of-bounds gracefully without raising `IndexError`.",
      "Slice object creation: `slice(start, stop, step)` can be passed directly as `seq[slice_obj]`.",
    ],
    example: {
      language: "PYTHON",
      code: 's = "Hello World"\nprint(s[0:5])   # "Hello"\nprint(s[6:])    # "World"\nprint(s[::-1])  # "dlroW olleH" (Reversed)',
    },
    interviewTip:
      "Highlight out-of-bounds safety: `lst[100:200]` returns `[]` rather than throwing `IndexError`.",
    followUpQuestions: [
      "How do slice assignments work (`lst[1:3] = [10, 20, 30]`)?",
      "What is `slice` class syntax in Python?",
    ],
    relatedTopics: ["Fundamentals", "Lists", "Strings"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "python",
    slug: "python-compiled-or-interpreted",
    title: "Is Python a compiled or an interpreted language?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Two-stage execution pipeline: compilation to bytecode and interpretation by CPython VM.",
    shortAnswer:
      "Python is both compiled and interpreted. Source code (`.py`) is first compiled into intermediate bytecode (`.pyc`), which is then interpreted line-by-line by the Python Virtual Machine (PVM).",
    detailedExplanation: [
      "Compilation Phase: CPython parses source code into an Abstract Syntax Tree (AST) and compiles it into `.pyc` bytecode files stored in `__pycache__`.",
      "Interpretation Phase: The Python Virtual Machine (PVM) reads bytecode instructions and executes corresponding native C instructions on the target CPU.",
      "JIT Compilers: Implementations like PyPy add Just-In-Time compilation to compile hot bytecode directly to native machine code at runtime.",
    ],
    interviewTip:
      "Emphasize that 'interpreted' vs 'compiled' is an implementation detail of the runtime (CPython, PyPy, Jython), not a property of the language specification itself.",
    followUpQuestions: [
      "What are `.pyc` files and where are they stored in Python 3?",
      "How does PyPy JIT compiler achieve 5-10x performance gains over CPython?",
    ],
    relatedTopics: ["Fundamentals", "CPython", "Virtual Machine"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "python",
    slug: "python-key-features",
    title: "What are the key features of Python?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "High-level abstractions, dynamic typing, automatic memory management, and batteries included.",
    shortAnswer:
      "Key features of Python include clean readability, dynamic typing, interpreted execution, multi-paradigm support (OOP, Functional, Procedural), automatic memory management via Garbage Collection, and a vast standard library ('batteries included').",
    detailedExplanation: [
      "Readable & Expressive Syntax: Indentation-based block structure reduces boilerplate.",
      "Dynamically and Strongly Typed: Variable types are resolved at runtime and enforced strictly without implicit coercions.",
      "Multi-Paradigm: Supports Object-Oriented, Imperative, Functional, and Metaprogramming styles.",
      "Automatic Memory Management: Reference counting plus automatic cyclic garbage collection.",
      "Extensible in C/C++: Native bindings allow embedding high-performance C libraries (NumPy, TensorFlow, PyTorch).",
    ],
    interviewTip:
      "Group features logically (Syntax, Typing, Paradigm, Ecosystem) rather than listing random keywords.",
    followUpQuestions: [
      "What does 'batteries included' mean in the context of Python standard library?",
      "How does Python compare to Java in terms of development velocity vs execution speed?",
    ],
    relatedTopics: ["Fundamentals", "Python Architecture"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "python",
    slug: "python-set-vs-dict",
    title: "What is the difference between a Set and a Dictionary in Python?",
    difficulty: "EASY",
    subtopic: "Data Structures",
    synopsis: "Unordered collection of unique keys vs key-value mapping structure.",
    shortAnswer:
      "A `set` is an unordered collection of unique, hashable elements. A `dict` is an ordered collection of unique hashable keys mapped to arbitrary value objects.",
    detailedExplanation: [
      "`set`: Created using `{elem1, elem2}` or `set()`. Stores elements only. Optimized for O(1) membership testing and mathematical set operations (union, intersection).",
      "`dict`: Created using `{key: value}` or `dict()`. Stores key-value mappings. Optimized for O(1) key lookups, updates, and key-based retrievals.",
      "Both use open-addressing hash tables internally and require elements/keys to be hashable (`__hash__` and `__eq__`).",
      "Empty literal `{}` creates a dictionary, not a set (`set()` must be used for empty set).",
    ],
    example: {
      language: "PYTHON",
      code: 'my_set = {1, 2, 3}\nmy_dict = {"a": 1, "b": 2}\nempty_dict = {}     # type: dict\nempty_set = set()   # type: set',
    },
    interviewTip:
      "Highlight the syntactic gotcha: `{}` produces a `dict`. To initialize an empty set, you MUST use `set()`.",
    followUpQuestions: [
      "Why must set elements and dictionary keys be hashable?",
      "How does set intersection (`&`) achieve average O(min(len(s1), len(s2))) time complexity?",
    ],
    relatedTopics: ["Data Structures", "Sets", "Dictionaries"],
    tags: ["Data Structures"],
  },
  {
    topicSlug: "python",
    slug: "python-dict-vs-list",
    title: "What is the difference between a Dictionary and a List in Python?",
    difficulty: "EASY",
    subtopic: "Data Structures",
    synopsis: "Dynamic contiguous array (O(N) search) vs open-address hash map (O(1) key access).",
    shortAnswer:
      "A List is an ordered, index-based dynamic array that accesses elements by integer position in O(1) time but searches by value in O(N) time. A Dictionary is a key-value hash table that accesses values by unique hashable key in average O(1) time.",
    detailedExplanation: [
      "List: Element access via `lst[index]` (0-based integer). Allows duplicate values. Maintains positional sequence.",
      "Dictionary: Value access via `d[key]`. Keys must be unique and hashable. Preserves insertion order (Python 3.7+).",
      "Search performance: `item in list` requires O(N) linear scan; `key in dict` requires O(1) hash lookup.",
      "Memory: Dictionaries have higher memory overhead per entry due to hash table array allocation.",
    ],
    interviewTip:
      "Frame the answer around lookup complexity: choose List when ordering and positional indexing matter; choose Dict when fast key-based retrieval matters.",
    followUpQuestions: [
      "What is the memory footprint difference between list and dict?",
      "How does collections.defaultdict simplify dictionary lookups?",
    ],
    relatedTopics: ["Data Structures", "Lists", "Dictionaries"],
    tags: ["Data Structures"],
  },
  {
    topicSlug: "python",
    slug: "python-array-vs-list",
    title: "What is the difference between Python lists and arrays?",
    difficulty: "MEDIUM",
    subtopic: "Data Structures",
    synopsis: "Heterogeneous reference lists vs homogeneous raw contiguous memory arrays.",
    shortAnswer:
      "Python `list` is a built-in dynamic container holding references to arbitrary objects (heterogeneous). Python `array` (from `array` module) or NumPy `ndarray` stores contiguous homogeneous typed raw data values (integers, floats) with drastically lower memory overhead.",
    detailedExplanation: [
      "Memory Layout: `list` stores an array of pointers pointing to Python PyObject structs scattered in memory. `array`/`NumPy` stores contiguous raw bytes in memory.",
      "Type Homogeneity: `list` allows mixing strings, ints, objects. `array` requires all elements to share the exact same primitive C type code (e.g. `'i'`, `'f'`).",
      "Performance: `NumPy` arrays perform vectorised SIMD C operations across contiguous memory buffers, yielding 10x-100x speed improvements for scientific math.",
    ],
    example: {
      language: "PYTHON",
      code: 'import array\nimport numpy as np\n\npy_list = [1, "two", 3.0] # Valid heterogeneous list\nc_array = array.array("i", [1, 2, 3]) # Homogeneous signed ints\nnp_arr = np.array([1, 2, 3], dtype=np.int32) # NumPy C-contiguous array',
    },
    interviewTip:
      "Clarify whether the interviewer means the standard library `array.array` module or `numpy.ndarray`.",
    followUpQuestions: [
      "What is vectorized computation in NumPy?",
      "How does memory cache locality benefit contiguous arrays over pointer lists?",
    ],
    relatedTopics: ["Data Structures", "NumPy", "Memory Management"],
    tags: ["Data Structures", "Performance"],
  },
  {
    topicSlug: "python",
    slug: "python-division-operators",
    title: "What is the difference between `/` (true division) and `//` (floor division) in Python?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Floating-point quotient division vs floor integer division rounding down.",
    shortAnswer:
      "`/` (true division) always returns a `float`, even if the division result is a whole integer (`7 / 2 -> 3.5`, `4 / 2 -> 2.0`). `//` (floor division) divides numbers and rounds down to the nearest lower integer (floor toward $-\\infty$).",
    detailedExplanation: [
      "True Division `/`: Converts operands to float if necessary and returns floating-point result.",
      "Floor Division `//`: Returns largest integer less than or equal to quotient.",
      "Negative Floor Division Gotcha: `-7 // 2` equals `-4` (not `-3`), because floor rounds down towards $-\\infty$.",
      "Operand Types for `//`: If operands are integers, result is `int` (`7 // 2 -> 3`). If any operand is `float`, result is `float` (`7.0 // 2 -> 3.0`).",
    ],
    example: {
      language: "PYTHON",
      code: "print(7 / 2)   # 3.5 (float)\nprint(7 // 2)  # 3 (int)\nprint(-7 // 2) # -4 (rounded down toward negative infinity!)",
    },
    interviewTip:
      "Always call out negative numbers: `-7 // 2` yields `-4` because floor rounds towards negative infinity, not zero.",
    commonTrap:
      "Assuming `//` truncates towards zero like C/C++ integer division (`-7 / 2 == -3` in C++, but `-7 // 2 == -4` in Python).",
    followUpQuestions: [
      "What is `divmod(a, b)` in Python?",
      "How did division behavior change between Python 2 and Python 3?",
    ],
    relatedTopics: ["Fundamentals", "Operators", "Math"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "python",
    slug: "python-math-floor-ceil-trunc",
    title: "What is the difference between math.floor(), math.ceil(), and math.trunc() in Python?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Rounding towards negative infinity vs positive infinity vs zero.",
    shortAnswer:
      "`math.floor(x)` rounds down towards negative infinity. `math.ceil(x)` rounds up towards positive infinity. `math.trunc(x)` truncates fractional digits, rounding towards zero.",
    detailedExplanation: [
      "`math.floor(3.7)` -> `3`, `math.floor(-3.2)` -> `-4`.",
      "`math.ceil(3.2)` -> `4`, `math.ceil(-3.7)` -> `-3`.",
      "`math.trunc(3.7)` -> `3`, `math.trunc(-3.7)` -> `-3` (drops decimal portion entirely).",
      "All three functions return an `int` in Python 3.",
    ],
    example: {
      language: "PYTHON",
      code: "import math\nx = -3.7\nprint(math.floor(x)) # -4\nprint(math.ceil(x))  # -3\nprint(math.trunc(x)) # -3",
    },
    interviewTip:
      "Summarize with a single mental model: `floor` goes left on number line, `ceil` goes right, `trunc` goes towards zero.",
    followUpQuestions: [
      "How does built-in `round(x, n)` handle banker's rounding (round half to even)?",
      "What does `round(2.5)` evaluate to in Python 3?",
    ],
    relatedTopics: ["Fundamentals", "Math"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "python",
    slug: "python-str-vs-repr",
    title: "What is the difference between __str__ and __repr__ in Python?",
    difficulty: "MEDIUM",
    subtopic: "OOP",
    synopsis: "Human-readable user representation vs unambiguous developer debugging string.",
    shortAnswer:
      "`__str__` returns an informal, readable string representation intended for end-user display (`str(obj)` or `print(obj)`). `__repr__` returns an unambiguous, formal string representation intended for developer debugging (`repr(obj)`), ideally valid Python code.",
    detailedExplanation: [
      "`__str__`: Used by `print()`, `str()`, `f\'{obj}\'`. Focuses on user readability.",
      "`__repr__`: Used by interactive REPL, containers (`[obj1, obj2]`), and `repr()`. Focuses on clarity and unambiguity.",
      "Fallback: If a class implements `__repr__` but omits `__str__`, Python uses `__repr__` as fallback for `__str__`.",
      "Rule of thumb: `eval(repr(obj)) == obj` should hold true whenever possible.",
    ],
    example: {
      language: "PYTHON",
      code: 'import datetime\ntoday = datetime.date.today()\nprint(str(today))  # "2026-09-08" (User friendly)\nprint(repr(today)) # "datetime.date(2026, 9, 8)" (Developer unambiguous)',
    },
    interviewTip:
      "State the rule: 'str is for users, repr is for developers'. Always write `__repr__` first when building custom classes.",
    followUpQuestions: [
      "What happens if __str__ is defined but __repr__ is not?",
      "How does `f\'{obj!r}\'` format strings using __repr__?",
    ],
    relatedTopics: ["OOP", "Dunder Methods"],
    tags: ["OOP"],
  },
  {
    topicSlug: "python",
    slug: "python-multiple-inheritance-mro",
    title: "How does Multiple Inheritance and Method Resolution Order (MRO / C3 Linearization) work in Python?",
    difficulty: "HARD",
    subtopic: "OOP",
    synopsis: "Resolving class method lookups in diamond inheritance using C3 Linearization.",
    shortAnswer:
      "Python supports multiple inheritance and resolves method/attribute lookups using Method Resolution Order (MRO), calculated via the C3 Linearization algorithm. MRO ensures parents are searched after children and in the order specified in class definitions, resolving diamond inheritance gracefully.",
    detailedExplanation: [
      "Diamond Inheritance Problem: Occurs when class `D` inherits from `B` and `C`, which both inherit from `A`.",
      "C3 Linearization guarantees 3 properties: Monotonicity (subclass order preserved), local precedence order preserved, and every class visited once.",
      "`Class.mro()` or `Class.__mro__` returns a tuple showing the exact lookup sequence for a class.",
      "`super()` uses MRO sequence to call next class in linearized chain, NOT just immediate parent.",
    ],
    example: {
      language: "PYTHON",
      code: 'class A: pass\nclass B(A): pass\nclass C(A): pass\nclass D(B, C): pass\n\nprint(D.mro())\n# [<class "__main__.D">, <class "__main__.B">, <class "__main__.C">, <class "__main__.A">, <class "object">]',
    },
    interviewTip:
      "Emphasize that `super()` does not just call the direct parent class—it calls the NEXT class in the object's MRO chain.",
    followUpQuestions: [
      "What is TypeError: Cannot create a consistent method resolution order (MRO)?",
      "How does C3 Linearization prevent visiting class A twice in diamond inheritance?",
    ],
    relatedTopics: ["OOP", "Inheritance", "MRO"],
    tags: ["OOP", "Advanced Python"],
  },
  {
    topicSlug: "python",
    slug: "python-classmethod-vs-staticmethod",
    title: "What is the difference between @classmethod and @staticmethod in Python?",
    difficulty: "MEDIUM",
    subtopic: "OOP",
    synopsis: "Binding implicit `cls` state parameter vs independent utility static function.",
    shortAnswer:
      "`@classmethod` receives the class object (`cls`) as its implicit first argument and can access/modify class state or serve as alternative constructors. `@staticmethod` receives no implicit first argument and behaves like an isolated regular function scoped inside the class namespace.",
    detailedExplanation: [
      "`@classmethod`: Defined with `@classmethod`. Receives `cls` implicitly. Can modify class attributes and instantiate class objects (`cls(*args)`).",
      "`@staticmethod`: Defined with `@staticmethod`. Receives no `self` or `cls`. Has no access to class or instance state unless explicitly passed.",
      "Use Cases: Use `@classmethod` for factory constructors (`from_json`, `from_dict`). Use `@staticmethod` for isolated helper/utility functions related to the class topic.",
    ],
    example: {
      language: "PYTHON",
      code: 'class Date:\n    def __init__(self, year, month, day):\n        self.year, self.month, self.day = year, month, day\n\n    @classmethod\n    def from_string(cls, date_str):\n        y, m, d = map(int, date_str.split("-"))\n        return cls(y, m, d) # Factory constructor\n\n    @staticmethod\n    def is_valid_year(year):\n        return 1900 <= year <= 2100',
    },
    interviewTip:
      "Highlight Factory Pattern: `@classmethod` is the standard Pythonic way to implement alternative class constructors.",
    followUpQuestions: [
      "How do class methods work with inheritance (subclass factory instantiation)?",
      "How are descriptors implemented behind `@classmethod` and `@staticmethod`?",
    ],
    relatedTopics: ["OOP", "Decorators", "Design Patterns"],
    tags: ["OOP"],
  },
  {
    topicSlug: "python",
    slug: "python-abstract-base-classes-abc",
    title: "What are Abstract Base Classes (ABC) and @abstractmethod in Python?",
    difficulty: "MEDIUM",
    subtopic: "OOP",
    synopsis: "Enforcing interface contracts and preventing instantiation of unfulfilled subclasses.",
    shortAnswer:
      "Abstract Base Classes (via `abc.ABC` module) define abstract interfaces that concrete subclasses MUST implement. Decorating a method with `@abstractmethod` prevents instantiation of any subclass that fails to override that method.",
    detailedExplanation: [
      "Module: Import `ABC` and `abstractmethod` from `abc` module.",
      "Instantiation Enforcement: If a subclass fails to implement all `@abstractmethod` definitions, CPython raises `TypeError` upon subclass instantiation.",
      "Interface Contract: Ensures polymorphic consistency across diverse implementations (e.g. database adapters, payment gateways).",
      "Abstract Properties: Abstract properties can be created using `@property` combined with `@abstractmethod`.",
    ],
    example: {
      language: "PYTHON",
      code: 'from abc import ABC, abstractmethod\n\nclass Animal(ABC):\n    @abstractmethod\n    def make_sound(self):\n        pass\n\nclass Dog(Animal):\n    def make_sound(self):\n        return "Woof"\n\n# Animal() -> TypeError: Can\'t instantiate abstract class Animal',
    },
    interviewTip:
      "Mention that Python raises `TypeError` at INSTANTIATION time, not definition time, if abstract methods are unfulfilled.",
    followUpQuestions: [
      "What is `abc.ABCMeta` and how does `__init_subclass__` relate?",
      "What is Virtual Subclassing via `ABC.register()`?",
    ],
    relatedTopics: ["OOP", "Design Patterns", "Abstractions"],
    tags: ["OOP"],
  },
  {
    topicSlug: "python",
    slug: "python-slots-optimization",
    title: "What is __slots__ in Python classes and when should you use it?",
    difficulty: "HARD",
    subtopic: "OOP",
    synopsis: "Eliminating instance __dict__ overhead to reduce memory consumption by ~60%.",
    shortAnswer:
      "`__slots__` is a class attribute that explicitly restricts instance attributes to a fixed set of names. It prevents the automatic creation of an instance `__dict__` dictionary, reducing memory footprint by up to 60-70% and speeding up attribute access.",
    detailedExplanation: [
      "By default, Python stores instance attributes in a dynamic `__dict__` dictionary, requiring high memory overhead per object.",
      "`__slots__ = ('name', 'age')` replaces `__dict__` with a compact array of fixed descriptor pointers.",
      "When to Use: Use when instantiating millions of small lightweight data objects in memory.",
      "Trade-offs: Cannot add dynamic attributes not listed in `__slots__`. Prevents multiple inheritance unless child class also declares slots or handles empty slot layout.",
    ],
    example: {
      language: "PYTHON",
      code: 'class Point:\n    __slots__ = ("x", "y")\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\np = Point(1, 2)\n# p.z = 3 raises AttributeError!',
    },
    interviewTip:
      "Emphasize memory optimization: `__slots__` is built for high-cardinality in-memory objects (e.g. 10 million telemetry points).",
    followUpQuestions: [
      "What happens if a child class inherits from a parent with __slots__?",
      "Can `@dataclass(slots=True)` be used in Python 3.10+?",
    ],
    relatedTopics: ["OOP", "Memory Management", "Performance"],
    tags: ["OOP", "Performance"],
  },
  {
    topicSlug: "python",
    slug: "python-closures",
    title: "What are Closures in Python and how do they work?",
    difficulty: "MEDIUM",
    subtopic: "Functions",
    synopsis: "Inner function capturing and retaining enclosing scope variables after outer return.",
    shortAnswer:
      "A Closure is an inner function that remembers and retains access to variables from its enclosing outer function's scope, even after the outer function has finished executing and returned.",
    detailedExplanation: [
      "Three Criteria: 1) Nested inner function, 2) Inner function references variable in enclosing outer function scope, 3) Outer function returns the inner function object.",
      "Cell Objects: Python stores enclosed scope variables in `cell` objects inside `inner_func.__closure__` tuple.",
      "State Encapsulation: Closures provide lightweight data hiding without creating a full class definition.",
      "Mutating Closure State: Mutating outer variables inside closure requires `nonlocal` declaration.",
    ],
    example: {
      language: "PYTHON",
      code: 'def multiplier(factor):\n    def multiply(number):\n        return number * factor # Captures "factor"\n    return multiply\n\ndouble = multiplier(2)\nprint(double(5)) # Output: 10\nprint(double.__closure__[0].cell_contents) # Output: 2',
    },
    interviewTip:
      "Point to `func.__closure__` as proof during technical explanations—Python explicitly attaches captured variable cells to the function object.",
    followUpQuestions: [
      "How are decorators built on top of closures?",
      "Why do late-binding closures inside loops require default parameter bindings (`fn(x=x)`)?",
    ],
    relatedTopics: ["Functions", "Decorators", "Scope"],
    tags: ["Functions"],
  },
  {
    topicSlug: "python",
    slug: "python-monkey-patching",
    title: "What is Monkey Patching in Python and when is it used?",
    difficulty: "MEDIUM",
    subtopic: "Advanced Python",
    synopsis: "Dynamic runtime modification of modules or classes without altering original source code.",
    shortAnswer:
      "Monkey Patching refers to dynamically modifying classes, modules, or functions at runtime without altering the original source code. It is commonly used in testing (mocking network calls) or applying hotfixes to third-party libraries.",
    detailedExplanation: [
      "Dynamic Attribute Rebinding: Functions and module attributes in Python are mutable references that can be swapped at runtime (`module.func = new_func`).",
      "Testing & Mocking: Libraries like `unittest.mock` or `pytest-mock` use monkey patching to replace slow network I/O calls with mock stubs during tests.",
      "Asynchronous Frameworks: Event-driven libraries like `gevent` monkey patch standard library sockets to be non-blocking.",
      "Risks: Can cause hidden side effects, obscure bugs, and make debugging difficult across team codebases.",
    ],
    example: {
      language: "PYTHON",
      code: 'import requests\n\ndef mock_get(url):\n    return "Mock Response"\n\n# Monkey patch standard requests.get at runtime\nrequests.get = mock_get\nprint(requests.get("https://example.com")) # Output: "Mock Response"',
    },
    interviewTip:
      "Acknowledge utility for unit testing / mocking, but warn that monkey patching in production code is generally an anti-pattern due to maintainability risks.",
    followUpQuestions: [
      "How does unittest.mock.patch safely restore monkey patched objects using context managers?",
      "How does gevent.monkey.patch_all() work?",
    ],
    relatedTopics: ["Advanced Python", "Testing", "Dynamic Typing"],
    tags: ["Advanced Python", "Testing"],
  },
  {
    topicSlug: "python",
    slug: "python-pickle-pickling-unpickling",
    title: "What is Pickling and Unpickling in Python (pickle module)?",
    difficulty: "MEDIUM",
    subtopic: "Fundamentals",
    synopsis: "Byte stream serialization of object hierarchies and security risks of untrusted data.",
    shortAnswer:
      "Pickling is the process of serializing Python object hierarchies into a binary byte stream (`pickle.dumps()`). Unpickling deserializes byte streams back into living Python object hierarchies (`pickle.loads()`).",
    detailedExplanation: [
      "Serialization: Converts Python objects (lists, dicts, custom class instances) into binary format for disk storage or network transmission.",
      "Python Specific: `pickle` is Python-specific and binary-based (unlike language-agnostic JSON or YAML).",
      "CRITICAL SECURITY TRAP: Never unpickle untrusted data! `pickle.loads()` can execute arbitrary machine code via custom `__reduce__` methods.",
      "Alternatives: Use JSON, Protocol Buffers, or MessagePack for untrusted or cross-language data exchanges.",
    ],
    example: {
      language: "PYTHON",
      code: 'import pickle\ndata = {"a": 1, "b": [1, 2, 3]}\nserialized = pickle.dumps(data) # Serialization to bytes\ndeserialized = pickle.loads(serialized) # Deserialization back to object',
    },
    interviewTip:
      "Always mention the critical security vulnerability: unpickling untrusted input can execute arbitrary remote code!",
    commonTrap:
      "Using `pickle` for untrusted API request payloads. Always use JSON or schema-validated formats for external API endpoints.",
    followUpQuestions: [
      "How does __reduce__ control pickle serialization behavior?",
      "Why is JSON preferred over pickle for web API payloads?",
    ],
    relatedTopics: ["Serialization", "Fundamentals", "Security"],
    tags: ["Fundamentals", "Security"],
  },
  {
    topicSlug: "python",
    slug: "python-string-and-int-interning",
    title: "What is String and Integer Interning in Python?",
    difficulty: "HARD",
    subtopic: "Memory Management",
    synopsis: "Reusing single global object instances for small integers and identifier-like strings.",
    shortAnswer:
      "Interning is an internal CPython memory optimization where identical immutable literal objects are cached and reused in memory. CPython automatically interns small integers in the range `-5` to `256` and identifier-like string literals.",
    detailedExplanation: [
      "Small Integer Interning: CPython pre-allocates an array of integer objects for `-5` to `256` upon interpreter startup. Any reference to these numbers points to the exact same memory address (`id()`).",
      "String Interning: String literals that look like Python identifiers (alphanumeric + underscores) are interned automatically. Custom strings can be interned manually via `sys.intern(s)`.",
      "Performance Benefit: Interned string comparisons become O(1) memory pointer identity comparisons (`is`) rather than O(N) character-by-character scans (`==`).",
    ],
    example: {
      language: "PYTHON",
      code: 'import sys\na = 250\nb = 250\nprint(a is b) # True (Small int interned)\n\ns1 = sys.intern("hello world!")\ns2 = sys.intern("hello world!")\nprint(s1 is s2) # True (Manually interned string)',
    },
    interviewTip:
      "Warn never to rely on `is` for string comparison in business logic—interning rules vary by compiler, optimization flag, and CPython version.",
    followUpQuestions: [
      "Why is integer interning bounded to -5 through 256?",
      "How does sys.intern() optimize key lookups in compiler symbol tables?",
    ],
    relatedTopics: ["Memory Management", "CPython", "Internals"],
    tags: ["Internals", "Performance"],
  },
  {
    topicSlug: "python",
    slug: "python-enumerate-vs-range-len",
    title: "Why should you use enumerate() over range(len()) in Python loops?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Clean Pythonic tuple unpacking of index and value without index lookup overhead.",
    shortAnswer:
      "`enumerate(iterable)` is cleaner and more Pythonic because it yields (index, item) pairs directly in a single iteration step. `range(len(seq))` requires manual index tracking and redundant list item lookups (`seq[i]`).",
    detailedExplanation: [
      "Readability: `for i, item in enumerate(seq):` avoids clunky `seq[i]` indexing expressions.",
      "Custom Start Index: `enumerate(seq, start=1)` allows specifying an initial offset without extra arithmetic (`i + 1`).",
      "Generics & Streams: `enumerate()` works on any iterable (generators, files, sets) even if they do not support `len()` or indexing `seq[i]`.",
    ],
    example: {
      language: "PYTHON",
      code: 'fruits = ["apple", "banana", "cherry"]\n# Non-Pythonic:\nfor i in range(len(fruits)):\n    print(i, fruits[i])\n\n# Pythonic:\nfor i, fruit in enumerate(fruits, start=1):\n    print(i, fruit)',
    },
    interviewTip:
      "Highlight iterable compatibility: `enumerate()` works on non-indexable iterables like streaming files or generator expressions where `len()` would throw `TypeError`.",
    followUpQuestions: [
      "How is enumerate() implemented as an iterator object?",
      "How do zip() and enumerate() combine in nested loops?",
    ],
    relatedTopics: ["Fundamentals", "Loops", "Iterators"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "python",
    slug: "python-zip-and-unzipping",
    title: "How does zip() work in Python and how do you unzip a list of tuples?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Pairing parallel iterables and unzipping using star unpacking `zip(*zipped)`.",
    shortAnswer:
      "`zip(*iterables)` pairs corresponding elements from multiple iterables into tuples, stopping when the shortest iterable is exhausted. Unzipping a list of tuples back into separate iterables is done by passing unpacked sequences `zip(*zipped)`.",
    detailedExplanation: [
      "Lazy Evaluation: `zip()` returns a lazy iterator in Python 3, using O(1) memory.",
      "`strict=True` (Python 3.10+): Raises `ValueError` if input iterables have unequal lengths.",
      "Unzipping Syntax: `zip(*pairs)` unpacks the list of tuples as positional arguments into `zip`, transposing rows into columns.",
    ],
    example: {
      language: "PYTHON",
      code: 'names = ["Alice", "Bob"]\nscores = [85, 92]\nzipped = list(zip(names, scores)) # [("Alice", 85), ("Bob", 92)]\n\n# Unzipping back:\nunzipped_names, unzipped_scores = zip(*zipped)\n# unzipped_names = ("Alice", "Bob")',
    },
    interviewTip:
      "Demonstrate `zip(*zipped)` matrix transposition—it is a favorite short coding snippet in technical interviews.",
    followUpQuestions: [
      "What is itertools.zip_longest?",
      "How does zip(strict=True) protect against silent truncated data processing in Python 3.10+?",
    ],
    relatedTopics: ["Fundamentals", "Iterators"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "python",
    slug: "python-any-and-all",
    title: "How do any() and all() work in Python?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Short-circuiting truthiness evaluations across iterables.",
    shortAnswer:
      "`any(iterable)` returns `True` if AT LEAST ONE element in iterable is truthy (short-circuits on first True). `all(iterable)` returns `True` if ALL elements are truthy (short-circuits on first False).",
    detailedExplanation: [
      "`any()` short-circuits: Stops iterating immediately upon encountering the first truthy item.",
      "`all()` short-circuits: Stops iterating immediately upon encountering the first falsy item.",
      "Vacuous Truth / Edge Cases: `all([])` returns `True` (vacuous truth in logic). `any([])` returns `False`.",
    ],
    example: {
      language: "PYTHON",
      code: 'nums = [2, 4, 6, 7]\nhas_odd = any(n % 2 != 0 for n in nums) # True\nall_even = all(n % 2 == 0 for n in nums) # False',
    },
    interviewTip:
      "Call out vacuous truth: `all([])` evaluates to `True` by mathematical logic convention because no element violated the truth condition.",
    followUpQuestions: [
      "How do generator expressions optimize memory inside any() and all()?",
      "What is truthiness in Python (what objects evaluate to False)?",
    ],
    relatedTopics: ["Fundamentals", "Iterators", "Boolean Logic"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "python",
    slug: "python-ternary-operator",
    title: "How do Ternary Operators (conditional expressions) work in Python?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Inline single-line conditional value expression `value_if_true if condition else value_if_false`.",
    shortAnswer:
      "Python provides inline conditional expressions using the syntax `value_if_true if condition else value_if_false`. It evaluates `condition` first and returns only the corresponding branch value.",
    detailedExplanation: [
      "Expression vs Statement: Ternary operator is an expression that yields a value and can be assigned directly to variables or passed to functions.",
      "Short-Circuit Evaluation: Only the winning branch expression is evaluated.",
      "Chaining: Can be nested (`a if cond1 else b if cond2 else c`), though excessive nesting hurts code readability.",
    ],
    example: {
      language: "PYTHON",
      code: 'age = 20\nstatus = "Adult" if age >= 18 else "Minor"\nprint(status) # "Adult"',
    },
    interviewTip:
      "Remind interviewers that both `if` and `else` branches are mandatory in Python ternary expressions—you cannot omit the `else` clause.",
    followUpQuestions: [
      "Difference between ternary operator and tuple shortcut `(val_false, val_true)[condition]`?",
      "Why is tuple shortcut `(a, b)[cond]` dangerous compared to ternary operator?",
    ],
    relatedTopics: ["Fundamentals", "Control Flow"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "python",
    slug: "python-string-reversal",
    title: "How can you reverse a string in Python and what are the trade-offs of each method?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Slicing `[::-1]`, `reversed()` iterator, and recursive / list join approaches.",
    shortAnswer:
      "The most Pythonic and efficient way to reverse a string is slicing `s[::-1]` (O(N) time, optimized in C). Alternatively, `''.join(reversed(s))` uses lazy iterator traversal with O(N) time and space.",
    detailedExplanation: [
      "Slicing `s[::-1]`: Fastest method. Implemented directly in C inside CPython slice evaluation.",
      "`''.join(reversed(s))`: Uses built-in `reversed()` iterator, avoiding index calculations explicitly.",
      "Loop / Concatenation: Manually building string in loop using `+` is bad practice (O(N^2) time due to string immutability re-allocations).",
    ],
    example: {
      language: "PYTHON",
      code: 's = "interview"\nrev1 = s[::-1]                # Fast & idiomatic\nrev2 = "".join(reversed(s))   # Iterator approach',
    },
    interviewTip:
      "Always state that `s[::-1]` is the idiomatic standard in Python and mention why string immutability makes `+` loop concatenation O(N^2).",
    followUpQuestions: [
      "How to reverse a list in-place using list.reverse() vs slicing list[::-1]?",
      "How does string immutability impact memory allocations during string modification?",
    ],
    relatedTopics: ["Strings", "Fundamentals"],
    tags: ["Fundamentals", "Strings"],
  },
  {
    topicSlug: "python",
    slug: "python-range-vs-xrange",
    title: "What is the difference between range() and xrange() in Python (Python 2 vs Python 3)?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Eager list construction in Python 2 vs lazy range sequence object in Python 3.",
    shortAnswer:
      "In Python 2, `range()` created and populated a full in-memory `list`, while `xrange()` returned a lazy generator-like object. In Python 3, `xrange()` was removed, and `range()` was redesigned to be a memory-efficient sequence object.",
    detailedExplanation: [
      "Python 2 `range()`: Allocated full list in RAM (e.g. `range(1000000)` created 1 million int objects).",
      "Python 2 `xrange()`: Computed values lazily on demand (O(1) RAM).",
      "Python 3 `range()`: Implements immutable sequence protocol (supports `len()`, `in` membership testing, indexing) with O(1) memory complexity regardless of size.",
    ],
    interviewTip:
      "Clarify that Python 3 `range()` is NOT a simple generator—it is a specialized immutable sequence class that supports O(1) membership testing (`999 in range(1000000)` takes O(1) time!).",
    followUpQuestions: [
      "Why is `999999 in range(100000000)` O(1) time in Python 3?",
      "How does range object implement sequence protocol methods?",
    ],
    relatedTopics: ["Fundamentals", "Python History"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "python",
    slug: "python-file-io-methods",
    title: "How does File I/O work in Python (read, readline, readlines, write)?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "File reading methods, streaming iteration, and deterministic context management.",
    shortAnswer:
      "File I/O in Python uses `open(filename, mode)`. `read()` reads entire content into a string. `readline()` reads a single line. `readlines()` returns a list of all lines. Iterating over the file object directly (`for line in file:`) streams lines with O(1) memory.",
    detailedExplanation: [
      "`read(size=-1)`: Loads up to `size` bytes (or full file if -1) into memory. Risk of Out-Of-Memory for multi-gigabyte files.",
      "`readline()`: Reads next single line up to `\\n`.",
      "`readlines()`: Eagerly reads all lines into a `list` of strings.",
      "Streaming Iteration: `for line in f:` is the most memory-efficient approach, buffering line by line.",
      "Context Manager: Always use `with open(...) as f:` to guarantee immediate closing of file handles upon exiting block.",
    ],
    example: {
      language: "PYTHON",
      code: 'with open("log.txt", "r") as f:\n    for line in f: # Memory-efficient line streaming\n        print(line.strip())',
    },
    interviewTip:
      "Emphasize file object line streaming `for line in file:` for processing large files in production.",
    followUpQuestions: [
      "What is buffering mode in open()?",
      "What is the difference between binary mode 'rb' and text mode 'r'?",
    ],
    relatedTopics: ["File I/O", "Fundamentals", "Context Managers"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "python",
    slug: "python-operator-precedence",
    title: "How does Operator Precedence work in Python?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Rules governing evaluation order of operators in complex expressions.",
    shortAnswer:
      "Operator precedence dictates the order in which Python evaluates operations in an expression. Parentheses `()` have highest precedence, followed by exponentiation `**`, unary operators (`+x`, `-x`, `~x`), multiplicative operations (`*`, `/`, `//`, `%`), additive operations (`+`, `-`), comparisons, and logical operators (`not`, `and`, `or`).",
    detailedExplanation: [
      "Parentheses `()` override standard precedence execution.",
      "Exponentiation `**` binds right-to-left (`2 ** 3 ** 2 == 2 ** 9 = 512`).",
      "Most arithmetic and logical operators evaluate left-to-right.",
      "Chained Comparisons: Python allows `1 < x < 10`, which evaluates as `(1 < x) and (x < 10)` with single evaluation of `x`.",
    ],
    interviewTip:
      "Mention right-to-left associativity of exponentiation `**` and chained comparison evaluation `a < b < c`.",
    followUpQuestions: [
      "How does short-circuit evaluation work for `and` / `or` logical operators?",
      "Why is explicit parenthesizing preferred over relying on subtle operator precedence rules?",
    ],
    relatedTopics: ["Fundamentals", "Operators"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "python",
    slug: "python-shallow-vs-deep-equality",
    title: "What is the difference between shallow equality, deep equality, and reference equality in Python?",
    difficulty: "MEDIUM",
    subtopic: "Fundamentals",
    synopsis: "Comparing memory references (is), shallow item values (==), and deep nested structures.",
    shortAnswer:
      "Reference equality (`is`) checks if two variables point to the exact same memory object (`id(a) == id(b)`). Shallow value equality (`==`) checks if top-level contents match via `__eq__`. Deep equality recursively checks that all nested sub-objects and values match.",
    detailedExplanation: [
      "Reference Identity (`is`): Fastest check (compares pointers). Returns True ONLY if both names reference identical heap object.",
      "Value Equality (`==`): Calls `a.__eq__(b)`. For built-in containers (lists, dicts), `==` performs recursive value equality checking across child elements.",
      "Custom Class Equality: By default, custom classes inherit `object.__eq__`, which defaults to reference equality (`is`). Overriding `__eq__` enables custom value comparison.",
    ],
    interviewTip:
      "Point out that custom Python objects fall back to reference equality unless `__eq__` is explicitly implemented.",
    followUpQuestions: [
      "What happens if a class overrides __eq__ without overriding __hash__?",
      "Why does setting __eq__ set __hash__ to None by default?",
    ],
    relatedTopics: ["Fundamentals", "OOP", "Operators"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "python",
    slug: "python-mutable-vs-immutable",
    title: "What is the difference between Mutable and Immutable data types in Python?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Objects whose state can be changed in-place vs objects that create new instances on modification.",
    shortAnswer:
      "Mutable objects (`list`, `dict`, `set`, `bytearray`) can be modified in-place without changing their memory identity (`id()`). Immutable objects (`int`, `float`, `str`, `tuple`, `frozenset`, `bytes`) cannot be modified after creation; any update produces a new object.",
    detailedExplanation: [
      "Mutability & Hashability: Only immutable objects (where all nested elements are also immutable) are hashable and can be dictionary keys or set elements.",
      "In-Place Operations: Mutating a mutable object alters all references pointing to that object.",
      "Memory & Security: Immutable objects thread-safe, predictable, and facilitate string/integer interning optimizations.",
    ],
    example: {
      language: "PYTHON",
      code: 's = "hello"\ns = s + " world" # Creates a NEW string object in memory\n\nlst = [1, 2]\nlst.append(3)   # Modifies EXISTING list object in-place (same id)',
    },
    interviewTip:
      "Tie mutability directly to hashability: dictionary keys and set elements MUST be hashable, which requires immutability.",
    followUpQuestions: [
      "Is a tuple containing a list mutable or immutable?",
      "Why are immutable objects thread-safe by default?",
    ],
    relatedTopics: ["Fundamentals", "Data Structures"],
    tags: ["Fundamentals"],
  },
  {
    topicSlug: "python",
    slug: "python-descriptors-protocol",
    title: "What is the Python Descriptor Protocol (__get__, __set__, __delete__)?",
    difficulty: "HARD",
    subtopic: "OOP",
    synopsis: "Low-level object attribute access customization mechanism powering @property and methods.",
    shortAnswer:
      "The Descriptor Protocol is a low-level Python mechanism where an object defines any of `__get__()`, `__set__()`, or `__delete__()` methods. Descriptors customize attribute lookup, assignment, and deletion on other classes, powering `@property`, `@classmethod`, `@staticmethod`, and ORM field mappings.",
    detailedExplanation: [
      "Data Descriptors: Define both `__get__()` and `__set__()` (or `__delete__()`). Has higher lookup precedence than instance dictionary.",
      "Non-Data Descriptors: Define only `__get__()` (e.g. regular functions/methods). Instance dictionary takes precedence.",
      "Lookup Mechanics: When evaluating `obj.attr`, Python checks class hierarchy for descriptors before looking in `obj.__dict__`.",
    ],
    example: {
      language: "PYTHON",
      code: 'class NonNegative:\n    def __init__(self, name):\n        self.name = name\n    def __get__(self, instance, owner):\n        return instance.__dict__.get(self.name, 0)\n    def __set__(self, instance, value):\n        if value < 0: raise ValueError("Value cannot be negative")\n        instance.__dict__[self.name] = value\n\nclass Profile:\n    age = NonNegative("age")',
    },
    interviewTip:
      "Mastering descriptors signals senior Python expertise: explain that `@property`, `@classmethod`, and bound methods are all built using descriptors.",
    followUpQuestions: [
      "What is the difference between Data Descriptors and Non-Data Descriptors?",
      "How does Python convert class methods to bound methods using __get__?",
    ],
    relatedTopics: ["OOP", "Descriptors", "Advanced Python"],
    tags: ["OOP", "Advanced Python"],
  },
];
