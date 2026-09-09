import type { ConceptualQuestion } from "../conceptual";

export const oopQuestions: ConceptualQuestion[] = [
  // --- CORE OOP & PILLARS (1 - 10) ---
  {
    topicSlug: "oop",
    slug: "what-is-oops",
    title: "What is Object-Oriented Programming (OOP) and why is it used?",
    difficulty: "EASY",
    subtopic: "Core OOP",
    synopsis: "Programming paradigm based on objects containing data (attributes) and code (methods).",
    shortAnswer:
      "Object-Oriented Programming (OOP) is a paradigm organized around objects—data structures holding state (fields) and behavior (methods)—rather than actions or standalone functions. It improves code reusability, maintainability, modularity, and security by modeling real-world entities.",
    detailedExplanation: [
      "**Modularity & Organization:** Code is grouped into self-contained units (classes and objects), making large software systems easier to manage and scale.",
      "**Code Reusability:** Through inheritance and composition, existing code can be reused without rewriting or duplicating logic.",
      "**Maintainability & Data Security:** Encapsulation hides private object state from external mutation, enforcing strict contracts and reducing side effects.",
      "**Real-World Modeling:** Represents business domains naturally by translating physical or conceptual entities (e.g. BankAccount, User, Vehicle) into classes.",
    ],
    example: {
      language: "JAVA",
      code: `// Modeling a BankAccount in Java
public class BankAccount {
    private String accountNumber;
    private double balance; // Encapsulated state

    public BankAccount(String accountNumber, double initialBalance) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }

    public void deposit(double amount) {
        if (amount > 0) this.balance += amount;
    }

    public double getBalance() { return balance; }
}`,
    },
    interviewTip:
      "Contrast OOP with Procedural Programming (like C). Procedural programming focuses on functions acting on global data; OOP bundles data and functions together into protected objects.",
    commonTrap:
      "Claiming OOP is inherently faster than procedural or functional programming. OOP introduces virtual method lookup overhead and memory pointers.",
    followUpQuestions: [
      "Difference between Procedural and Object-Oriented Programming?",
      "What are the four pillars of OOP?",
      "Does Python strictly enforce OOP like Java?",
    ],
    relatedTopics: ["Encapsulation", "Procedural vs OOP", "Classes"],
    tags: ["OOP", "Fundamentals"],
  },
  {
    topicSlug: "oop",
    slug: "four-pillars-of-oop",
    title: "What are the Four Pillars of Object-Oriented Programming?",
    difficulty: "EASY",
    subtopic: "Core OOP",
    synopsis: "Encapsulation, Abstraction, Inheritance, and Polymorphism.",
    shortAnswer:
      "The four pillars are Encapsulation (bundling data and methods while restricting access), Abstraction (hiding implementation details behind clean interfaces), Inheritance (reusing parent class attributes and behaviors), and Polymorphism (allowing one interface to represent different underlying concrete types).",
    detailedExplanation: [
      "**Encapsulation.** Restricts direct access to an object's internal state using private variables and public methods (getters/setters).",
      "**Abstraction.** Exposes *what* an object does rather than *how* it does it (e.g., interfaces and abstract classes).",
      "**Inheritance.** Establishes an 'is-a' hierarchy, allowing child classes to inherit properties and methods from parent classes.",
      "**Polymorphism.** Enables method overloading (compile-time) and method overriding (runtime), allowing a single method call to execute different behaviors depending on the target object type.",
    ],
    example: {
      language: "PYTHON",
      code: `# Four Pillars in Python
from abc import ABC, abstractmethod

class Animal(ABC): # Abstraction
    def __init__(self, name):
        self._name = name # Encapsulation (protected attribute)

    @abstractmethod
    def make_sound(self):
        pass

class Dog(Animal): # Inheritance
    def make_sound(self): # Polymorphism
        return f"{self._name} barks: Woof!"

dog = Dog("Buddy")
print(dog.make_sound()) # Buddy barks: Woof!`,
    },
    interviewTip:
      "Clearly distinguish Abstraction from Encapsulation: Encapsulation hides data/state; Abstraction hides implementation details.",
    commonTrap:
      "Confusing Abstraction and Encapsulation. Remember: Encapsulation is data security; Abstraction is complexity reduction.",
    followUpQuestions: [
      "Difference between Abstraction and Encapsulation?",
      "Why is composition preferred over inheritance in modern OOP?",
      "How does runtime polymorphism work in Java vs Python?",
    ],
    relatedTopics: ["Encapsulation", "Abstraction", "Inheritance", "Polymorphism"],
    tags: ["OOP", "Pillars", "Architecture"],
  },
  {
    topicSlug: "oop",
    slug: "class-vs-object",
    title: "What is the difference between a Class and an Object?",
    difficulty: "EASY",
    subtopic: "Core OOP",
    synopsis: "Blueprint/Template vs Concrete Instance residing in memory.",
    shortAnswer:
      "A class is a logical blueprint or user-defined type that defines the structure (fields) and capabilities (methods) of an entity. An object is a physical, concrete instance of a class allocated in memory at runtime.",
    detailedExplanation: [
      "**Class (Blueprint):** Consists of declaration, attribute definitions, and method implementations. Takes no physical heap memory space for data values until instantiated.",
      "**Object (Instance):** Created using the `new` keyword (Java) or class instantiation `Class()` (Python). Occupies memory on the heap and holds actual runtime data.",
      "**Relationship:** One class can be used to instantiate infinite independent object instances, each maintaining its own attribute values.",
    ],
    example: {
      language: "JAVA",
      code: `// Class definition (Blueprint)
class Car {
    String color;
    void drive() { System.out.println("Car is driving..."); }
}

public class Main {
    public static void main(String[] args) {
        // Object creation (Physical instance on Heap)
        Car car1 = new Car();
        car1.color = "Red";

        Car car2 = new Car();
        car2.color = "Blue";
    }
}`,
    },
    interviewTip:
      "Use the analogy: A Class is an architectural blueprint of a house; an Object is the actual physical house built on a plot of land.",
    commonTrap:
      "Thinking class variables (static fields) belong to individual objects. Static variables belong to the class blueprint, shared by all instances.",
    followUpQuestions: [
      "Where are objects stored in memory (Heap vs Stack)?",
      "What is an Anonymous Object?",
      "How does class loading work in the JVM?",
    ],
    relatedTopics: ["Classes", "Objects", "Memory Management"],
    tags: ["OOP", "Basics"],
  },
  {
    topicSlug: "oop",
    slug: "encapsulation-explained",
    title: "What is Encapsulation and how is it implemented?",
    difficulty: "EASY",
    subtopic: "Core OOP",
    synopsis: "Bundling data and methods while restricting direct access via access modifiers.",
    shortAnswer:
      "Encapsulation is the mechanism of wrapping data (variables) and code (methods) together as a single unit while restricting direct access to internal components. It is implemented by declaring variables as `private` and exposing public getter and setter methods with validation.",
    detailedExplanation: [
      "**Data Protection:** Prevents external code from corrupting internal object state with invalid values.",
      "**Controlled Access:** Getters provide read-only access, while setters validate input before updating state.",
      "**Implementation Independence:** Internal class implementation can change (e.g. changing data structure from List to Array) without breaking callers.",
    ],
    example: {
      language: "JAVA",
      code: `public class Employee {
    private double salary; // Encapsulated private field

    public double getSalary() {
        return salary;
    }

    public void setSalary(double salary) {
        if (salary > 0) { // Validation logic inside setter
            this.salary = salary;
        } else {
            throw new IllegalArgumentException("Invalid salary amount");
        }
    }
}`,
    },
    interviewTip:
      "Highlight how encapsulation supports the Single Responsibility Principle and maintains invariants inside domain models.",
    commonTrap:
      "Generating getters and setters blindly for every field without adding validation or immutability checks, which negates encapsulation benefits.",
    followUpQuestions: [
      "Difference between Encapsulation and Data Hiding?",
      "How is encapsulation achieved in Python where there are no strict private keywords?",
      "What are Access Modifiers in Java?",
    ],
    relatedTopics: ["Access Modifiers", "Data Hiding", "Immutability"],
    tags: ["OOP", "Encapsulation"],
  },
  {
    topicSlug: "oop",
    slug: "data-hiding-vs-encapsulation",
    title: "How is Data Hiding different from Encapsulation?",
    difficulty: "MEDIUM",
    subtopic: "Core OOP",
    synopsis: "Data hiding focuses on security/privacy; Encapsulation focuses on bundling.",
    shortAnswer:
      "Encapsulation is the process of binding data and methods into a single unit (class). Data Hiding is a specific subset of encapsulation that restricts direct access to internal state using `private` or `protected` access specifiers to prevent unauthorized modification.",
    detailedExplanation: [
      "**Encapsulation (Wrapping):** Focuses on grouping fields and methods together. Example: A class containing variables and methods.",
      "**Data Hiding (Privacy):** Focuses on security by hiding implementation details from the outside world. Example: Declaring variables as `private`.",
      "**Analogy:** A capsule wraps medicines together (Encapsulation); the opaque outer shell hides the internal chemical contents from exposure (Data Hiding).",
    ],
    example: {
      language: "PYTHON",
      code: `# Data Hiding in Python using Name Mangling (__private)
class Wallet:
    def __init__(self, initial_amount):
        self.__balance = initial_amount # Private field (Data Hiding)

    def get_balance(self): # Public getter (Encapsulation)
        return self.__balance

w = Wallet(500)
print(w.get_balance()) # 500
# print(w.__balance)   # AttributeError: 'Wallet' object has no attribute '__balance'`,
    },
    interviewTip:
      "Mention that Python enforces data hiding via name mangling (`__var`) by convention rather than strict language-level keywords like Java's `private`.",
    commonTrap:
      "Assuming Python's `_protected` or `__private` makes data completely inaccessible. In Python, `_Wallet__balance` can still be accessed via reflection.",
    followUpQuestions: [
      "How does Python name mangling work?",
      "What are package-private (default) access modifiers in Java?",
      "Why is Reflection a double-edged sword for data hiding?",
    ],
    relatedTopics: ["Encapsulation", "Access Specifiers", "Python Internals"],
    tags: ["OOP", "Security"],
  },
  {
    topicSlug: "oop",
    slug: "abstraction-explained",
    title: "What is Abstraction and how does it differ from Encapsulation?",
    difficulty: "EASY",
    subtopic: "Core OOP",
    synopsis: "Hiding implementation complexity behind abstract interfaces.",
    shortAnswer:
      "Abstraction hides internal implementation details and shows only essential functionality to the user (e.g. interfaces, abstract classes). Encapsulation hides data and restricts access to fields via access modifiers. Abstraction operates at the design level; Encapsulation operates at the implementation level.",
    detailedExplanation: [
      "**Abstraction (Design Level):** Defines *what* an object does rather than *how*. Example: Driving a car by turning the steering wheel without knowing how the internal combustion engine works.",
      "**Encapsulation (Implementation Level):** Defines *how* data is stored and protected. Example: Keeping engine fuel injection data variables private.",
      "**Key Mechanism:** Abstraction is achieved via Abstract Classes and Interfaces in Java/C++ or ABC module in Python.",
    ],
    example: {
      language: "JAVA",
      code: `// Abstraction: Exposing abstract method contract
public interface PaymentGateway {
    boolean processPayment(double amount); // What it does
}

// Concrete Implementation (Hidden from caller)
public class StripeGateway implements PaymentGateway {
    @Override
    public boolean processPayment(double amount) {
        // Complex HTTP API call & RSA encryption logic hidden
        return true;
    }
}`,
    },
    interviewTip:
      "Summarize with: 'Abstraction is about hiding complexity; Encapsulation is about hiding data.'",
    commonTrap:
      "Stating that Interfaces are the only way to achieve abstraction. Abstract classes, method signatures, and high-level APIs all provide abstraction.",
    followUpQuestions: [
      "Difference between Abstract Class and Interface?",
      "Can an abstract class have constructors in Java?",
      "What are default methods in Java 8 interfaces?",
    ],
    relatedTopics: ["Abstract Class", "Interfaces", "Encapsulation"],
    tags: ["OOP", "Abstraction"],
  },
  {
    topicSlug: "oop",
    slug: "inheritance-types",
    title: "What is Inheritance and what are its different types?",
    difficulty: "EASY",
    subtopic: "Core OOP",
    synopsis: "Single, Multilevel, Hierarchical, Multiple, and Hybrid Inheritance.",
    shortAnswer:
      "Inheritance allows a child (derived) class to acquire properties and methods of a parent (base) class, establishing an 'is-a' relationship. Types include Single, Multilevel, Hierarchical, Multiple, and Hybrid inheritance.",
    detailedExplanation: [
      "**Single Inheritance:** A child class inherits from one parent class (`A -> B`).",
      "**Multilevel Inheritance:** A child class inherits from a derived parent class (`A -> B -> C`).",
      "**Hierarchical Inheritance:** Multiple child classes inherit from a single parent class (`A -> B` and `A -> C`).",
      "**Multiple Inheritance:** A child class inherits directly from more than one parent class (`A, B -> C`). Supported in Python and C++, but NOT directly supported with classes in Java to prevent ambiguity.",
      "**Hybrid Inheritance:** Combination of two or more types of inheritance.",
    ],
    example: {
      language: "PYTHON",
      code: `# Multiple Inheritance in Python
class Engine:
    def start_engine(self): return "V8 Engine started"

class GPS:
    def locate(self): return "Coordinates: 37.7749, -122.4194"

class SmartCar(Engine, GPS): # Inherits from both Engine and GPS
    pass

car = SmartCar()
print(car.start_engine())
print(car.locate())`,
    },
    interviewTip:
      "Be prepared to explain why Java avoids multiple class inheritance (the Diamond Problem) and how Python solves it using Method Resolution Order (MRO / C3 Linearization).",
    commonTrap:
      "Confusing 'is-a' (Inheritance) with 'has-a' (Composition). Inherit only when the child is truly a subtype of the parent.",
    followUpQuestions: [
      "What is the Diamond Problem in Multiple Inheritance?",
      "How does Python MRO work (`__mro__`)?",
      "How does Java support multiple inheritance via Interfaces?",
    ],
    relatedTopics: ["Inheritance", "Diamond Problem", "Composition"],
    tags: ["OOP", "Inheritance"],
  },
  {
    topicSlug: "oop",
    slug: "diamond-problem-explained",
    title: "What is the Diamond Problem in Multiple Inheritance and how is it resolved?",
    difficulty: "MEDIUM",
    subtopic: "Core OOP",
    synopsis: "Ambiguity when a class inherits from two classes with a common superclass.",
    shortAnswer:
      "The Diamond Problem occurs in multiple inheritance when class D inherits from both B and C, which both inherit from class A. If B and C override a method from A, class D does not know which method version to inherit, creating ambiguity. Java avoids this by disallowing multiple class inheritance; Python resolves it using C3 Linearization MRO.",
    detailedExplanation: [
      "**Diamond Topology:** `A` is superclass of `B` and `C`. `D` extends both `B` and `C` (`D -> B, C -> A`).",
      "**Java Solution:** Disallows extending multiple classes. For interfaces with default method collisions, Java forces class D to explicitly override the conflicting method.",
      "**Python Solution:** Uses C3 Linearization algorithm to create a deterministic Method Resolution Order (`D.__mro__`).",
    ],
    example: {
      language: "PYTHON",
      code: `class A:
    def show(self): print("A")

class B(A):
    def show(self): print("B")

class C(A):
    def show(self): print("C")

class D(B, C): pass

d = D()
d.show() # Prints "B" because D's MRO resolves B before C
print(D.__mro__) # (D, B, C, A, object)`,
    },
    interviewTip:
      "Write out the class hierarchy graph on a whiteboard or scratchpad. Show how Python's `super()` follows MRO sequentially rather than making direct parent calls.",
    commonTrap:
      "Assuming Java 8 default methods in interfaces bring back the Diamond Problem. Java forces a compile-time error if two interfaces have identical default methods without an explicit override.",
    followUpQuestions: [
      "How to resolve default method conflicts in Java 8 interfaces?",
      "What is C3 Linearization?",
      "Difference between `super()` in Java vs Python?",
    ],
    relatedTopics: ["Multiple Inheritance", "MRO", "Java Interfaces"],
    tags: ["OOP", "Inheritance", "Advanced"],
  },
  {
    topicSlug: "oop",
    slug: "polymorphism-compile-vs-runtime",
    title: "What is Polymorphism? Explain Compile-Time vs Runtime Polymorphism.",
    difficulty: "MEDIUM",
    subtopic: "Core OOP",
    synopsis: "Method Overloading (Static/Compile-time) vs Method Overriding (Dynamic/Runtime).",
    shortAnswer:
      "Polymorphism allows one interface or method name to perform different actions. Compile-time polymorphism (Method Overloading) resolves method calls during compilation based on parameter signatures. Runtime polymorphism (Method Overriding) resolves calls dynamically at runtime based on the actual object instance on the heap.",
    detailedExplanation: [
      "**Compile-Time Polymorphism (Static Binding / Overloading):** Multiple methods in the same class share the same name but different parameters (number, type, or order). Resolved by compiler.",
      "**Runtime Polymorphism (Dynamic Binding / Overriding):** Subclass provides a specific implementation of a method declared in its superclass. Resolved at runtime via virtual method dispatch.",
      "**Python Context:** Python does not support traditional compile-time method overloading (last method definition overwrites previous ones), but supports runtime polymorphism dynamically (Duck Typing).",
    ],
    example: {
      language: "JAVA",
      code: `class Calculator {
    // Compile-time Polymorphism (Overloading)
    int add(int a, int b) { return a + b; }
    double add(double a, double b) { return a + b; }
}

class Animal {
    void sound() { System.out.println("Animal sound"); }
}

class Cat extends Animal {
    // Runtime Polymorphism (Overriding)
    @Override
    void sound() { System.out.println("Meow"); }
}

public class Test {
    public static void main(String[] args) {
        Animal myPet = new Cat(); // Polymorphic substitution
        myPet.sound(); // Output: "Meow" (Resolved at Runtime)
    }
}`,
    },
    interviewTip:
      "Remember: Overloading = Same method name, different parameters, same class. Overriding = Same method name, same parameters, parent-child classes.",
    commonTrap:
      "Thinking changing only the return type creates a valid method overload in Java. Return type alone is insufficient to overload a method.",
    followUpQuestions: [
      "What is Virtual Method Dispatch / vtable?",
      "Can static or private methods be overridden in Java?",
      "How does Python handle method overloading?",
    ],
    relatedTopics: ["Overloading", "Overriding", "Dynamic Dispatch"],
    tags: ["OOP", "Polymorphism"],
  },
  {
    topicSlug: "oop",
    slug: "oop-overloading-vs-overriding",
    title: "What is the difference between Method Overloading and Method Overriding?",
    difficulty: "EASY",
    subtopic: "Core OOP",
    synopsis: "Same class/different signature (Overloading) vs Parent-child/same signature (Overriding).",
    shortAnswer:
      "Method Overloading occurs within the same class when methods share the same name but have different parameter lists (compile-time polymorphism). Method Overriding occurs when a child class provides a specific implementation of a parent class method with the exact same name, return type, and parameters (runtime polymorphism).",
    detailedExplanation: [
      "**Scope:** Overloading occurs in a single class; Overriding occurs across parent and child classes.",
      "**Parameters:** Overloading MUST have different parameters; Overriding MUST have identical parameters.",
      "**Binding:** Overloading uses static/early binding; Overriding uses dynamic/late binding.",
      "**Private/Static/Final Methods:** Overloading can overload private/static/final methods; Overriding CANNOT override private, static, or final methods.",
    ],
    example: {
      language: "JAVA",
      code: `class Printer {
    // Overloading: Different parameters
    void print(String text) { System.out.println(text); }
    void print(int number) { System.out.println(number); }
}

class AdvancedPrinter extends Printer {
    // Overriding: Same signature in child class
    @Override
    void print(String text) {
        System.out.println("Advanced: " + text);
    }
}`,
    },
    interviewTip:
      "Emphasize that overriding static methods results in 'Method Hiding' (shadowing), not true polymorphic overriding.",
    commonTrap:
      "Believing Python supports traditional method overloading. Defining multiple methods with the same name in Python leaves only the last defined method active.",
    followUpQuestions: [
      "What is Method Hiding in Java?",
      "Can an overridden method throw a broader checked exception?",
      "What is Covariant Return Type?",
    ],
    relatedTopics: ["Method Overloading", "Method Overriding", "Polymorphism"],
    tags: ["OOP", "Methods"],
  },

  // --- CLASSES, OBJECTS & LIFECYCLE (11 - 20) ---
  {
    topicSlug: "oop",
    slug: "oop-abstract-class-vs-interface",
    title: "What is the difference between an Abstract Class and an Interface?",
    difficulty: "MEDIUM",
    subtopic: "Classes & Interfaces",
    synopsis: "Partial implementation & state ('is-a') vs Pure contract & capability ('can-do').",
    shortAnswer:
      "An Abstract Class can have state (instance fields), constructors, and both concrete and abstract methods ('is-a' relationship). An Interface defines a pure behavior contract ('can-do' relationship) without instance state. A class can extend only one abstract class but implement multiple interfaces.",
    detailedExplanation: [
      "**State/Fields:** Abstract classes can hold non-static, non-final instance variables. Interfaces can only hold `public static final` constants.",
      "**Constructors:** Abstract classes have constructors (invoked by subclass `super()`). Interfaces CANNOT have constructors.",
      "**Multiple Inheritance:** A class can inherit from only ONE abstract class, but can implement MULTIPLE interfaces.",
      "**Default/Static Methods:** Modern Java (Java 8+) allows default and static methods in interfaces, narrowing the gap, but interfaces still cannot store instance state.",
    ],
    example: {
      language: "JAVA",
      code: `// Abstract Class (State + Partial Implementation)
abstract class Vehicle {
    protected String brand; // Instance state allowed
    public Vehicle(String brand) { this.brand = brand; }
    abstract void drive(); // Abstract method
}

// Interface (Pure Capability Contract)
interface Electric {
    void chargeBattery();
}

// Class extends 1 Abstract Class AND implements 1 Interface
class Tesla extends Vehicle implements Electric {
    public Tesla() { super("Tesla"); }
    @Override void drive() { System.out.println("Silent driving"); }
    @Override public void chargeBattery() { System.out.println("Charging Supercharger"); }
}`,
    },
    interviewTip:
      "Use this rule of thumb: Use Abstract Classes when sharing code/state between closely related classes; use Interfaces to define common behavior across unrelated classes (e.g. `Comparable`, `Serializable`).",
    commonTrap:
      "Saying interfaces cannot have method implementations at all. Java 8+ added `default` and `static` methods to interfaces.",
    followUpQuestions: [
      "Why can't interfaces have constructors?",
      "What are Java 8 default methods?",
      "How does Python handle Abstract Base Classes (`abc.ABC`)?",
    ],
    relatedTopics: ["Abstract Class", "Interface", "Multiple Inheritance"],
    tags: ["OOP", "Architecture"],
  },
  {
    topicSlug: "oop",
    slug: "constructors-in-oop",
    title: "What is a Constructor? Explain Default, Parameterized, and Copy Constructors.",
    difficulty: "EASY",
    subtopic: "Lifecycle & Memory",
    synopsis: "Special initialization method invoked when an object is instantiated.",
    shortAnswer:
      "A Constructor is a special member function executed automatically when an object is instantiated (`new`). It has the same name as the class and no return type. Types include Default Constructor (no args), Parameterized Constructor (initializes custom values), and Copy Constructor (creates a duplicate of an existing object).",
    detailedExplanation: [
      "**Default Constructor:** Provided automatically by compiler if no explicit constructor is defined. Initializes fields to default values (0, null, false).",
      "**Parameterized Constructor:** Takes arguments to initialize an object with specific initial data.",
      "**Copy Constructor:** Takes an existing object of the same class as a parameter to copy its state into a new instance.",
    ],
    example: {
      language: "JAVA",
      code: `public class Point {
    int x, y;

    // Default Constructor
    public Point() { this(0, 0); }

    // Parameterized Constructor
    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    // Copy Constructor
    public Point(Point other) {
        this.x = other.x;
        this.y = other.y;
    }
}`,
    },
    interviewTip:
      "Mention that if you define *any* parameterized constructor, the compiler no longer provides the default no-arg constructor automatically.",
    commonTrap:
      "Adding a return type (even `void`) to a constructor. Doing so turns it into a regular method rather than a constructor.",
    followUpQuestions: [
      "Can a constructor be private?",
      "What is Constructor Chaining?",
      "How does `__init__` work in Python?",
    ],
    relatedTopics: ["Constructors", "Object Lifecycle", "Copy Constructor"],
    tags: ["OOP", "Constructors"],
  },
  {
    topicSlug: "oop",
    slug: "shallow-vs-deep-copy",
    title: "What is the difference between Shallow Copy and Deep Copy?",
    difficulty: "MEDIUM",
    subtopic: "Lifecycle & Memory",
    synopsis: "Copying object references vs recursively cloning nested objects.",
    shortAnswer:
      "A Shallow Copy duplicates the top-level object structure but copies field references to nested objects, meaning both original and copy share nested memory objects. A Deep Copy recursively clones the object and all nested objects, producing entirely independent object graphs in memory.",
    detailedExplanation: [
      "**Shallow Copy:** Fast operation. Primitive fields are copied by value; object reference fields are copied by reference. Modifying a nested object in the copy affects the original object.",
      "**Deep Copy:** Slower operation. Creates brand-new memory allocations for all nested objects and collections. Changes to the copy never affect the original.",
      "**Implementation:** In Java, implemented via custom copy constructors, clone overriding, or serialization. In Python, via `copy.copy()` vs `copy.deepcopy()`.",
    ],
    example: {
      language: "PYTHON",
      code: `import copy

class Address:
    def __init__(self, city): self.city = city

class Person:
    def __init__(self, name, address):
        self.name = name
        self.address = address

p1 = Person("Alice", Address("NYC"))

# Shallow Copy
p_shallow = copy.copy(p1)
p_shallow.address.city = "LA"
print(p1.address.city) # "LA" (Shared reference updated!)

# Deep Copy
p1.address.city = "NYC"
p_deep = copy.deepcopy(p1)
p_deep.address.city = "Chicago"
print(p1.address.city) # "NYC" (Original unchanged!)`,
    },
    interviewTip:
      "Warn interviewers about circular references when writing custom deep copy functions. Mention Python's `deepcopy` handles circular graphs automatically using a memoization dictionary.",
    commonTrap:
      "Assuming Java's `Object.clone()` performs a deep copy. Default `super.clone()` performs a shallow copy.",
    followUpQuestions: [
      "How does Java `Cloneable` interface work?",
      "How to deep copy using Serialization?",
      "Performance trade-offs of Deep Copy vs Shallow Copy?",
    ],
    relatedTopics: ["Shallow Copy", "Deep Copy", "Memory"],
    tags: ["OOP", "Memory"],
  },
  {
    topicSlug: "oop",
    slug: "destructors-and-garbage-collection",
    title: "What is a Destructor and how does Garbage Collection replace it?",
    difficulty: "MEDIUM",
    subtopic: "Lifecycle & Memory",
    synopsis: "Manual cleanup (C++) vs Automatic Memory Deallocation (Java/Python).",
    shortAnswer:
      "A Destructor is a special method automatically invoked when an object goes out of scope or is explicitly destroyed (e.g. `~ClassName()` in C++) to release unmanaged memory. In managed languages like Java and Python, Automatic Garbage Collection tracks object references and frees memory automatically, replacing manual destructors.",
    detailedExplanation: [
      "**C++ Destructors:** Called deterministically as soon as object stack memory frame exits or `delete` is called on heap pointers.",
      "**Java Garbage Collection:** Non-deterministic. Objects with zero reachable references from GC Roots are reclaimed asynchronously by GC worker threads.",
      "**Python `__del__`:** Called when an object's reference count drops to zero, but not guaranteed in all shutdown scenarios.",
    ],
    example: {
      language: "PYTHON",
      code: `class ResourceHandler:
    def __init__(self, filename):
        self.file = open(filename, 'w')
        print("File opened")

    def __del__(self): # Destructor / Finalizer equivalent
        self.file.close()
        print("File closed by destructor")

# Better alternative: Context Manager (with statement)
class ManagedFile:
    def __enter__(self): return self
    def __exit__(self, exc_type, exc_val, exc_tb): print("Resource cleaned up reliably")`,
    },
    interviewTip:
      "Explain why relying on destructors/finalizers for resource cleanup (like file handles or DB connections) is bad practice in managed languages. Recommend `try-with-resources` (Java) or `with` statements (Python).",
    commonTrap:
      "Confusing Java `finalize()` with C++ destructors. `finalize()` is deprecated in modern Java because GC invocation time is unpredictable.",
    followUpQuestions: [
      "Why was `Object.finalize()` deprecated in Java 9?",
      "What is Reference Counting vs Tracing Garbage Collection?",
      "How does `try-with-resources` work in Java?",
    ],
    relatedTopics: ["Destructors", "Garbage Collection", "Resource Management"],
    tags: ["OOP", "Memory"],
  },
  {
    topicSlug: "oop",
    slug: "this-and-super-keywords",
    title: "What are the `this` and `super` keywords in Object-Oriented Programming?",
    difficulty: "EASY",
    subtopic: "Language Mechanics",
    synopsis: "Current instance reference (`this`/`self`) vs Parent class reference (`super`).",
    shortAnswer:
      "The `this` keyword (or `self` in Python) refers to the current object instance executing the method, used to resolve variable shadowing and invoke overloaded constructors. The `super` keyword refers to the immediate parent class instance, used to invoke superclass constructors or overridden parent methods.",
    detailedExplanation: [
      "**Shadowing Resolution:** `this.name = name` differentiates instance field `name` from parameter `name`.",
      "**Constructor Chaining:** `this(...)` calls another constructor in the same class; `super(...)` calls a constructor in the parent class.",
      "**Python Equivalents:** Python uses explicit `self` as the first argument in instance methods and `super()` to access parent MRO methods.",
    ],
    example: {
      language: "JAVA",
      code: `class Parent {
    String role = "Parent";
    Parent(String role) { this.role = role; }
    void show() { System.out.println("Parent show"); }
}

class Child extends Parent {
    String role = "Child";

    Child() {
        super("Parent Role"); // Calls Parent constructor
    }

    void display() {
        System.out.println(this.role);  // Prints "Child"
        System.out.println(super.role); // Prints "Parent Role"
        super.show();                   // Calls Parent show()
    }
}`,
    },
    interviewTip:
      "Mention that `super()` or `this()` constructor calls in Java MUST be the very first line of a constructor.",
    commonTrap:
      "Attempting to use `this` or `super` inside a `static` method. Static methods belong to the class, not an object instance.",
    followUpQuestions: [
      "Why must `super()` be the first statement in a Java constructor?",
      "How does Python's `super()` resolve methods in multiple inheritance?",
      "Difference between `self` in Python and `this` in Java?",
    ],
    relatedTopics: ["this Keyword", "super Keyword", "Constructors"],
    tags: ["OOP", "Language Mechanics"],
  },
  {
    topicSlug: "oop",
    slug: "access-modifiers-explained",
    title: "What are Access Specifiers / Modifiers and why are they used?",
    difficulty: "EASY",
    subtopic: "Core OOP",
    synopsis: "Public, Private, Protected, and Default scope boundaries.",
    shortAnswer:
      "Access modifiers define the scope and visibility of classes, variables, and methods. In Java, they include `public` (accessible anywhere), `protected` (same package + subclasses), `package-private/default` (same package), and `private` (same class only). They enforce Encapsulation and Data Hiding.",
    detailedExplanation: [
      "**private:** Restricted strictly to the declaring class. Highest security level.",
      "**default (no keyword):** Package-private. Accessible by any class within the same package.",
      "**protected:** Accessible within the same package AND by subclasses in different packages.",
      "**public:** Accessible from any package across the entire application.",
    ],
    example: {
      language: "JAVA",
      code: `package com.example;

public class AccessDemo {
    private int privateVar = 10;   // Same class only
    int defaultVar = 20;           // Same package only
    protected int protectedVar = 30; // Same package + Subclasses
    public int publicVar = 40;     // Accessible everywhere
}`,
    },
    interviewTip:
      "Contrast Java's strict compile-time access enforcement with Python's convention-based approach (`_protected` single underscore vs `__private` double underscore name mangling).",
    commonTrap:
      "Confusing `protected` with `default`. `protected` grants access to subclasses outside the package, whereas `default` does not.",
    followUpQuestions: [
      "Can a top-level class be declared private in Java?",
      "How does Python implement access control?",
      "What is package-private visibility?",
    ],
    relatedTopics: ["Access Modifiers", "Encapsulation", "Scope"],
    tags: ["OOP", "Security"],
  },
  {
    topicSlug: "oop",
    slug: "static-vs-dynamic-binding",
    title: "What is Static (Early) Binding vs Dynamic (Late) Binding?",
    difficulty: "MEDIUM",
    subtopic: "Language Mechanics",
    synopsis: "Compile-time method resolution vs Runtime method dispatch.",
    shortAnswer:
      "Static Binding (Early Binding) occurs at compile time when the compiler resolves method calls based on the variable's declared type (used for private, static, final methods, and overloaded methods). Dynamic Binding (Late Binding) occurs at runtime based on the actual object reference on the heap (used for overridden methods).",
    detailedExplanation: [
      "**Static Binding:** Compiler knows exact memory address of the method at build time. Faster performance, zero runtime lookup overhead.",
      "**Dynamic Binding:** Compiler leaves method call unresolved. At runtime, the JVM/runtime inspects the object's Virtual Method Table (vtable) to dispatch the call.",
      "**Key Distinction:** Overloaded methods use static binding; Overridden methods use dynamic binding.",
    ],
    example: {
      language: "JAVA",
      code: `class Base {
    static void staticMethod() { System.out.println("Base Static"); }
    void instanceMethod() { System.out.println("Base Instance"); }
}

class Derived extends Base {
    static void staticMethod() { System.out.println("Derived Static"); }
    @Override void instanceMethod() { System.out.println("Derived Instance"); }
}

public class BindingTest {
    public static void main(String[] args) {
        Base obj = new Derived();

        obj.staticMethod();   // Prints "Base Static" (Static Binding based on reference type Base)
        obj.instanceMethod(); // Prints "Derived Instance" (Dynamic Binding based on actual object Derived)
    }
}`,
    },
    interviewTip:
      "Highlight how method hiding (static methods) uses static binding while method overriding uses dynamic binding.",
    commonTrap:
      "Assuming static methods can be polymorphically overridden. Static methods are bound at compile time and hidden, not overridden.",
    followUpQuestions: [
      "Why are final methods statically bound?",
      "What is a Virtual Method Table (vtable)?",
      "How does dynamic dispatch impact performance?",
    ],
    relatedTopics: ["Static Binding", "Dynamic Dispatch", "Polymorphism"],
    tags: ["OOP", "Internals"],
  },
  {
    topicSlug: "oop",
    slug: "coupling-and-cohesion",
    title: "What are Coupling and Cohesion in Object-Oriented Design?",
    difficulty: "MEDIUM",
    subtopic: "Architecture & Design",
    synopsis: "Goal: High Cohesion (focused modules) and Low Coupling (independent modules).",
    shortAnswer:
      "Cohesion measures how focused and strongly related the responsibilities inside a single module/class are. Coupling measures how dependent different modules/classes are on each other. Ideal software design strives for High Cohesion (single focused job per class) and Low/Loose Coupling (minimal inter-class dependencies via interfaces).",
    detailedExplanation: [
      "**High Cohesion:** A class has a clear, tight single responsibility (e.g. `UserRepository` handles database access only). Easy to maintain, test, and reuse.",
      "**Low Coupling:** Classes interact through interfaces rather than concrete classes (e.g. depending on `MessageSender` interface rather than `SendGridEmailClient`). Changes to one class do not cascade to others.",
      "**Tightly Coupled Risk:** Modifying one class breaks multiple unrelated classes across the codebase.",
    ],
    example: {
      language: "JAVA",
      code: `// Low Coupling & High Cohesion
interface Logger { void log(String msg); }

class ConsoleLogger implements Logger {
    public void log(String msg) { System.out.println(msg); }
}

class OrderService { // Highly Cohesive: Handles order processing only
    private final Logger logger; // Loosely Coupled: Depends on Logger interface

    public OrderService(Logger logger) { this.logger = logger; }
    public void placeOrder() {
        logger.log("Order placed successfully");
    }
}`,
    },
    interviewTip:
      "Relate High Cohesion to the Single Responsibility Principle (SRP) and Low Coupling to the Dependency Inversion Principle (DIP).",
    commonTrap:
      "Conflating coupling with cohesion. Cohesion is internal focus within a class; Coupling is external dependency between classes.",
    followUpQuestions: [
      "How does Dependency Injection promote low coupling?",
      "What is Tight Coupling vs Loose Coupling?",
      "How to refactor a god class into cohesive components?",
    ],
    relatedTopics: ["Coupling", "Cohesion", "SOLID"],
    tags: ["OOP", "Design Principles"],
  },
  {
    topicSlug: "oop",
    slug: "composition-vs-aggregation-vs-association",
    title: "What is the difference between Association, Aggregation, and Composition?",
    difficulty: "MEDIUM",
    subtopic: "Relationships",
    synopsis: "General link (Association) vs Weak ownership (Aggregation) vs Strong lifecycle ownership (Composition).",
    shortAnswer:
      "Association represents a general relationship between objects. Aggregation is a weak 'has-a' relationship where child objects can exist independently of the parent (e.g. Teacher and Department). Composition is a strong 'has-a' relationship where child objects cannot exist without the parent (e.g. Room and House).",
    detailedExplanation: [
      "**Association:** Structural connection between two independent classes (e.g. Student and Course).",
      "**Aggregation (Weak Has-A):** Parent holds a reference to child, but child lifecycle is independent. If parent is destroyed, child survives. Example: A `Library` has `Book` objects; if Library is deleted, Books still exist.",
      "**Composition (Strong Has-A):** Child is created and managed entirely inside the parent. If parent is destroyed, child is destroyed with it. Example: A `Car` has an `Engine`; if Car is garbage collected, Engine is destroyed.",
    ],
    example: {
      language: "JAVA",
      code: `// Composition: Engine lifecycle is tied to Car
class Engine { }
class Car {
    private final Engine engine;
    public Car() {
        this.engine = new Engine(); // Car owns Engine lifecycle
    }
}

// Aggregation: Student exists independently of School
class Student { }
class School {
    private List<Student> students; // Injected from outside
    public School(List<Student> students) {
        this.students = students; // School does not own Student lifecycle
    }
}`,
    },
    interviewTip:
      "Draw the UML diagram notation mentally: Association = plain line, Aggregation = open diamond, Composition = filled/black diamond.",
    commonTrap:
      "Treating Aggregation and Composition as identical. Remember: Composition = strict shared lifecycle (destruction cascading); Aggregation = independent lifecycles.",
    followUpQuestions: [
      "Why is composition preferred over inheritance?",
      "How to model composition in SQL databases (Cascade Delete)?",
      "UML relationship notations?",
    ],
    relatedTopics: ["Composition", "Aggregation", "Association"],
    tags: ["OOP", "UML", "Design"],
  },
  {
    topicSlug: "oop",
    slug: "composition-over-inheritance",
    title: "Why is 'Composition over Inheritance' a recommended design principle?",
    difficulty: "MEDIUM",
    subtopic: "Relationships",
    synopsis: "Flexible runtime behavior delegation vs fragile compile-time class hierarchies.",
    shortAnswer:
      "Composition ('has-a') embeds references to other objects to delegate behavior at runtime, making systems flexible and loosely coupled. Inheritance ('is-a') creates rigid compile-time class hierarchies that break encapsulation when parent classes change (Fragile Base Class problem).",
    detailedExplanation: [
      "**Fragile Base Class Problem:** Modifying a base class method can silently break subclasses that depend on internal implementation details.",
      "**Runtime Flexibility:** Composition allows swapping behaviors dynamically at runtime (e.g. Strategy Pattern). Inheritance fixes behavior permanently at compile time.",
      "**Single Inheritance Restriction:** In languages like Java, a class can extend only one base class. Overusing inheritance consumes that single slot unnecessarily.",
    ],
    example: {
      language: "JAVA",
      code: `// Behavior interfaces
interface FlyBehavior { void fly(); }
class FlyWithWings implements FlyBehavior { public void fly() { System.out.println("Flying with wings!"); } }

// Duck HAS-A FlyBehavior (Composition)
public class Duck {
    private FlyBehavior flyBehavior; // Delegated behavior

    public Duck(FlyBehavior fb) { this.flyBehavior = fb; }
    public void performFly() { flyBehavior.fly(); }
    public void setFlyBehavior(FlyBehavior fb) { this.flyBehavior = fb; } // Dynamic runtime swap!
}`,
    },
    interviewTip:
      "Cite the Strategy Pattern as the textbook example of composition over inheritance. Use inheritance only when true polymorphic substitution (Liskov Substitution Principle) is strictly required.",
    commonTrap:
      "Using inheritance purely for code reuse without a valid 'is-a' domain relationship.",
    followUpQuestions: [
      "What is the Strategy Pattern?",
      "What is the Fragile Base Class problem?",
      "When IS inheritance appropriate?",
    ],
    relatedTopics: ["Composition", "Inheritance", "Design Patterns"],
    tags: ["OOP", "Design Principles"],
  },

  // --- POLYMORPHISM, BINDING & DISPATCH (21 - 30) ---
  {
    topicSlug: "oop",
    slug: "virtual-functions-and-vtable",
    title: "What is a Virtual Function and how does a Virtual Table (vtable) work?",
    difficulty: "HARD",
    subtopic: "Polymorphism & Dispatch",
    synopsis: "Function overridable in child class resolved dynamically via vtable pointer (vptr).",
    shortAnswer:
      "A Virtual Function is a method declared in a base class that can be overridden in derived classes to enable runtime polymorphism. Languages implement this using a Virtual Method Table (vtable)—an array of function pointers per class—and a hidden `vptr` inside each object pointing to its class's vtable.",
    detailedExplanation: [
      "**vtable Structure:** Created by compiler for every class containing at least one virtual function. Maps virtual method indexes to actual function code addresses.",
      "**vptr (Virtual Pointer):** Added as a hidden pointer field in object instances. Initialized during constructor execution to point to the class's vtable.",
      "**Dynamic Dispatch Step:** Calling `obj->virtualMethod()` performs a 2-step lookup: 1) Dereference `vptr` to find vtable, 2) Index vtable to get function pointer and execute code.",
      "**Java vs C++:** In Java, ALL non-static, non-private, non-final instance methods are virtual by default. In C++, methods must explicitly use the `virtual` keyword.",
    ],
    example: {
      language: "JAVA",
      code: `class Shape {
    // Virtual by default in Java
    void draw() { System.out.println("Shape"); }
}

class Circle extends Shape {
    @Override
    void draw() { System.out.println("Circle"); }
}

public class Main {
    public static void main(String[] args) {
        Shape s = new Circle();
        s.draw(); // JVM looks up Circle's vtable -> calls Circle.draw()
    }
}`,
    },
    interviewTip:
      "Highlight the performance trade-off: Virtual function dispatch introduces a pointer indirection overhead and prevents inline optimizations by the compiler.",
    commonTrap:
      "Calling virtual methods inside constructors. The object's `vptr` may point to the base class vtable during base constructor execution, executing base class methods unexpectedly.",
    followUpQuestions: [
      "Why are static methods not virtual?",
      "What is a Pure Virtual Function in C++?",
      "What is the memory footprint of vptr per object?",
    ],
    relatedTopics: ["vtable", "Dynamic Dispatch", "Virtual Functions"],
    tags: ["OOP", "Internals", "Memory"],
  },
  {
    topicSlug: "oop",
    slug: "covariant-return-type",
    title: "What is a Covariant Return Type in method overriding?",
    difficulty: "MEDIUM",
    subtopic: "Polymorphism & Dispatch",
    synopsis: "Overridden method in child class returning a narrower subtype of superclass return type.",
    shortAnswer:
      "A Covariant Return Type allows an overriding method in a subclass to return a narrower subtype of the return type declared in the superclass method, eliminating the need for explicit type casting by callers.",
    detailedExplanation: [
      "**Before Java 5:** Overridden methods had to return the exact same type as declared in the superclass.",
      "**Java 5+ Feature:** Subclasses can specify a more specific return type.",
      "**Benefit:** Clean fluent APIs and Factory Methods without typecasting at invocation sites.",
    ],
    example: {
      language: "JAVA",
      code: `class Animal {
    Animal reproduce() { return new Animal(); }
}

class Dog extends Animal {
    // Covariant Return Type: Returns Dog (subtype of Animal)
    @Override
    Dog reproduce() { return new Dog(); }
}

public class Test {
    public static void main(String[] args) {
        Dog dog = new Dog();
        Dog puppy = dog.reproduce(); // No explicit (Dog) cast needed!
    }
}`,
    },
    interviewTip:
      "Mention that covariance applies to return types in overriding, but method parameters in overriding must remain invariant.",
    commonTrap:
      "Attempting to return a broader supertype in an overriding method. Return type covariance allows narrower types only.",
    followUpQuestions: [
      "What is Covariance vs Contravariance in Generics?",
      "Can return type be changed in method overloading?",
      "Factory Pattern with Covariant Returns?",
    ],
    relatedTopics: ["Covariance", "Method Overriding", "Generics"],
    tags: ["OOP", "Java Features"],
  },
  {
    topicSlug: "oop",
    slug: "method-hiding-vs-overriding",
    title: "What is Method Hiding (Shadowing) vs Method Overriding?",
    difficulty: "MEDIUM",
    subtopic: "Polymorphism & Dispatch",
    synopsis: "Static method shadowing based on reference vs Instance method overriding based on object.",
    shortAnswer:
      "Method Overriding occurs when a child class implements an instance method of a parent class (resolved dynamically at runtime based on the heap object). Method Hiding occurs when a child class declares a static method with the exact same signature as a static method in the parent class (resolved statically at compile time based on reference type).",
    detailedExplanation: [
      "**Instance Methods (Overriding):** Polymorphic. Invoked version depends on actual object type at runtime.",
      "**Static Methods (Method Hiding):** Non-polymorphic. Invoked version depends on declared compiler variable reference type.",
      "**Annotation:** `@Override` works for instance methods, but will throw a compiler error if placed on a static method intended to hide a parent static method.",
    ],
    example: {
      language: "JAVA",
      code: `class Parent {
    static void staticMethod() { System.out.println("Parent Static"); }
    void instanceMethod() { System.out.println("Parent Instance"); }
}

class Child extends Parent {
    static void staticMethod() { System.out.println("Child Static"); } // Hiding
    @Override void instanceMethod() { System.out.println("Child Instance"); } // Overriding
}

public class Test {
    public static void main(String[] args) {
        Parent p = new Child();
        p.staticMethod();   // Prints "Parent Static" (Method Hiding - Reference Type)
        p.instanceMethod(); // Prints "Child Instance" (Overriding - Heap Object Type)
    }
}`,
    },
    interviewTip:
      "Remember rule: 'Static methods are hidden; Instance methods are overridden.'",
    commonTrap:
      "Thinking static methods can be overridden polymorphically.",
    followUpQuestions: [
      "Can a static method override an instance method?",
      "Why can't static methods access `this`?",
      "What is Variable Shadowing?",
    ],
    relatedTopics: ["Method Hiding", "Method Overriding", "Static Methods"],
    tags: ["OOP", "Java Mechanics"],
  },
  {
    topicSlug: "oop",
    slug: "operator-overloading",
    title: "What is Operator Overloading and how is it supported in Java vs Python?",
    difficulty: "MEDIUM",
    subtopic: "Language Mechanics",
    synopsis: "Giving custom mathematical operator behavior to user-defined objects.",
    shortAnswer:
      "Operator Overloading allows custom classes to redefine the behavior of built-in operators like `+`, `-`, `*`, or `==`. Python fully supports operator overloading via magic dunder methods (e.g. `__add__`). Java does NOT support custom operator overloading (except built-in string concatenation `+`) to maintain code simplicity and readability.",
    detailedExplanation: [
      "**Python Magic Methods:** Defining `__add__(self, other)` enables `obj1 + obj2` syntax natively for custom classes.",
      "**Java Philosophy:** Java designers omitted operator overloading to prevent ambiguous or obfuscated code (e.g. overriding `+` to subtract).",
      "**C++ Comparison:** C++ allows overloading almost all operators using `operator+` syntax.",
    ],
    example: {
      language: "PYTHON",
      code: `class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    # Operator Overloading for + operator
    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

v1 = Vector(1, 2)
v2 = Vector(3, 4)
v3 = v1 + v2 # Calls v1.__add__(v2)
print(v3) # Vector(4, 6)`,
    },
    interviewTip:
      "Mention Python's rich dunder methods (`__eq__`, `__lt__`, `__mul__`) as the primary mechanism for Pythonic OOP operator overloading.",
    commonTrap:
      "Stating Java supports operator overloading because `+` works for `String`. String `+` is a hardcoded language compiler optimization, not user-defined operator overloading.",
    followUpQuestions: [
      "What are Dunder (Double Underscore) methods in Python?",
      "Difference between `__eq__` and `is` in Python?",
      "Why did Java omit operator overloading?",
    ],
    relatedTopics: ["Operator Overloading", "Dunder Methods", "Python Mechanics"],
    tags: ["OOP", "Python", "Language Design"],
  },
  {
    topicSlug: "oop",
    slug: "duck-typing-explained",
    title: "What is Duck Typing in dynamic object-oriented programming?",
    difficulty: "MEDIUM",
    subtopic: "Polymorphism & Dispatch",
    synopsis: "'If it walks like a duck and quacks like a duck, it's a duck.'",
    shortAnswer:
      "Duck Typing is a dynamic typing concept where an object's suitability is determined by the presence of specific methods and properties rather than its explicit class inheritance hierarchy. Used extensively in Python, Ruby, and JavaScript.",
    detailedExplanation: [
      "**Dynamic Polymorphism:** Does not require objects to inherit from a common interface or abstract base class.",
      "**Principle:** If an object implements `read()` and `write()`, it can be passed to a file-processing function regardless of whether it is a `File`, `Socket`, or `StringIO` object.",
      "**Comparison:** Java uses explicit nominative typing (`implements Interface`); Python uses duck typing (structural compatibility).",
    ],
    example: {
      language: "PYTHON",
      code: `class Duck:
    def quack(self): print("Quack quack!")

class Person:
    def quack(self): print("I can imitate a duck!")

def make_it_quack(obj):
    # No type check or interface inheritance required!
    obj.quack()

make_it_quack(Duck())   # Quack quack!
make_it_quack(Person()) # I can imitate a duck!`,
    },
    interviewTip:
      "Mention `Protocol` from Python's `typing` module (PEP 544) as static duck typing (structural subtyping) for Python static analysis.",
    commonTrap:
      "Assuming Duck Typing eliminates runtime errors. Calling a missing method on a duck-typed object raises an `AttributeError` at runtime.",
    followUpQuestions: [
      "Difference between Nominative Typing (Java) and Structural Typing (TypeScript/Python Protocols)?",
      "How to perform type hints with Protocols in Python?",
      "EAFP (Easier to ask for forgiveness than permission) principle in Python?",
    ],
    relatedTopics: ["Duck Typing", "Dynamic Typing", "Protocols"],
    tags: ["OOP", "Python", "Dynamic Languages"],
  },
  {
    topicSlug: "oop",
    slug: "sealed-and-final-classes",
    title: "What is a Final Class (Java) or Sealed Class (Java 17+) in OOP?",
    difficulty: "MEDIUM",
    subtopic: "Classes & Interfaces",
    synopsis: "Restricting inheritance hierarchy for security, immutability, and domain control.",
    shortAnswer:
      "A `final` class cannot be extended/inherited by any subclass (e.g. `String` in Java). A `sealed` class (Java 17+) restricts inheritance by explicitly listing which specific subclasses are permitted to extend it, allowing controlled domain modeling.",
    detailedExplanation: [
      "**Final Class:** Completely halts inheritance. Ensures immutability and security (e.g., `java.lang.String` is final so hackers cannot subclass it to tamper with string pools).",
      "**Sealed Class (Java 17):** Declares `sealed class Shape permits Circle, Square`. Only listed classes can extend `Shape`.",
      "**Subclass Requirements for Sealed:** Permitted subclasses must be marked `final`, `sealed`, or `non-sealed`.",
    ],
    example: {
      language: "JAVA",
      code: `// Sealed Class permitting exact subclasses
public sealed class Shape permits Circle, Rectangle {}

// Subclasses must specify sealed/final status
public final class Circle extends Shape {}
public final class Rectangle extends Shape {}

// Attempting unpermitted inheritance causes compile error:
// public class Triangle extends Shape {} // COMPILE ERROR!`,
    },
    interviewTip:
      "Highlight how sealed classes enable exhaustive pattern matching in Java switch expressions, similar to ADTs (Algebraic Data Types) in functional languages.",
    commonTrap:
      "Confusing `final` class with `final` variable or `final` method. Final variable = constant; Final method = cannot override; Final class = cannot extend.",
    followUpQuestions: [
      "Why is `java.lang.String` marked final?",
      "How to emulate final classes in Python (`@final` decorator)?",
      "Sealed classes vs Enums?",
    ],
    relatedTopics: ["Final Keyword", "Sealed Classes", "Immutability"],
    tags: ["OOP", "Java 17", "Security"],
  },
  {
    topicSlug: "oop",
    slug: "immutability-in-oop",
    title: "What is Immutability in OOP and how do you make a class Immutable?",
    difficulty: "MEDIUM",
    subtopic: "Design & Architecture",
    synopsis: "Objects whose state cannot be modified after construction.",
    shortAnswer:
      "An Immutable class is one whose instance state cannot be changed after instantiation. In Java, it is created by marking the class `final`, making fields `private final`, providing no setters, performing defensive copies of mutable constructor parameters, and returning defensive copies from getters.",
    detailedExplanation: [
      "**Thread Safety:** Immutable objects are inherently thread-safe without synchronization locks.",
      "**Cacheable:** Can be shared safely across threads and cached (e.g. String pool, Integer cache).",
      "**Defensive Copying:** Critical step: If an immutable class takes a mutable field like `java.util.Date` or `List`, it MUST clone or copy it inside constructor and getters.",
    ],
    example: {
      language: "JAVA",
      code: `import java.util.Date;

public final class ImmutableUser {
    private final String username;
    private final Date joiningDate; // Mutable object

    public ImmutableUser(String username, Date joiningDate) {
        this.username = username;
        this.joiningDate = new Date(joiningDate.getTime()); // Defensive Copy
    }

    public String getUsername() { return username; }
    public Date getJoiningDate() {
        return new Date(joiningDate.getTime()); // Defensive Copy
    }
}`,
    },
    interviewTip:
      "Mention Java 14+ `record` feature as a built-in syntax for creating immutable data carrier classes.",
    commonTrap:
      "Marking a class `final` and fields `final`, but returning a direct reference to a mutable `List` or `Date` object in a getter. External callers can mutate the internal list contents!",
    followUpQuestions: [
      "What is Defensive Copying?",
      "How do Java 14 Records work?",
      "How to create immutable classes in Python (`dataclass(frozen=True)`)?",
    ],
    relatedTopics: ["Immutability", "Defensive Copying", "Thread Safety"],
    tags: ["OOP", "Immutability", "Concurrency"],
  },
  {
    topicSlug: "oop",
    slug: "reflection-and-rtti",
    title: "What is Reflection / Run-Time Type Information (RTTI) in OOP?",
    difficulty: "HARD",
    subtopic: "Language Mechanics",
    synopsis: "Inspecting and modifying class metadata and object fields dynamically at runtime.",
    shortAnswer:
      "Reflection (or RTTI) is the capability of a program to inspect, introspect, and modify its own class structures, methods, fields, and constructors at runtime without knowing their names at compile time. Used heavily by frameworks like Spring (Dependency Injection) and JUnit.",
    detailedExplanation: [
      "**Capabilities:** Instantiating objects dynamically, invoking private methods, reading metadata annotations, and modifying private fields.",
      "**Framework Usage:** Spring container inspects `@Autowired` annotations and uses reflection to inject dependencies into private fields.",
      "**Performance Drawbacks:** Bypasses JVM JIT optimizations, making reflective method calls significantly slower than direct calls.",
      "**Security Risks:** Can break encapsulation by invoking `field.setAccessible(true)` to modify private data.",
    ],
    example: {
      language: "JAVA",
      code: `import java.lang.reflect.Field;

class Secret {
    private String password = "SuperSecret123";
}

public class ReflectionDemo {
    public static void main(String[] args) throws Exception {
        Secret secret = new Secret();

        // Inspecting and modifying private field via Reflection
        Field field = Secret.class.getDeclaredField("password");
        field.setAccessible(true); // Bypass encapsulation!

        System.out.println("Extracted: " + field.get(secret)); // "SuperSecret123"
    }
}`,
    },
    interviewTip:
      "Acknowledge the power of reflection for framework authors, but warn about its production risks: performance overhead, security restrictions, and loss of compile-time type safety.",
    commonTrap:
      "Overusing reflection in standard business application code. Reflection should be reserved for general frameworks, libraries, and serializers.",
    followUpQuestions: [
      "How does Reflection impact JIT compilation?",
      "How is reflection handled in Python (`getattr`, `setattr`, `dir`)?",
      "What is Java Module System (`jpms`) security restriction on reflection?",
    ],
    relatedTopics: ["Reflection", "RTTI", "Spring Framework"],
    tags: ["OOP", "Reflection", "Advanced"],
  },
  {
    topicSlug: "oop",
    slug: "mixins-in-oop",
    title: "What is a Mixin in Object-Oriented Programming?",
    difficulty: "MEDIUM",
    subtopic: "Architecture & Design",
    synopsis: "Class providing reusable method implementations meant to be mixed into other classes.",
    shortAnswer:
      "A Mixin is a class containing methods meant to be injected into or inherited by other classes to add specific functionality, without acting as the parent class in a formal 'is-a' hierarchy. Popular in Python, Ruby, and JavaScript.",
    detailedExplanation: [
      "**Purpose:** Promotes code reuse across unrelated classes without deep inheritance hierarchies.",
      "**Python Implementation:** Uses multiple inheritance where mixin classes have no `__init__` state and only provide utility methods.",
      "**Java Equivalent:** Default methods in Interfaces (Java 8+) achieve mixin-like capabilities.",
    ],
    example: {
      language: "PYTHON",
      code: `# Mixin class providing JSON serialization
import json

class JSONMixin:
    def to_json(self):
        return json.dumps(self.__dict__)

class User(JSONMixin):
    def __init__(self, name, email):
        self.name = name
        self.email = email

class Product(JSONMixin):
    def __init__(self, title, price):
        self.title = title
        self.price = price

u = User("Alice", "alice@example.com")
print(u.to_json()) # {"name": "Alice", "email": "alice@example.com"}`,
    },
    interviewTip:
      "Explain how mixins encourage the Interface Segregation Principle (ISP) by keeping auxiliary behaviors (like logging, serialization) isolated.",
    commonTrap:
      "Adding state (`__init__`) to mixin classes, which leads to diamond inheritance state bugs.",
    followUpQuestions: [
      "Difference between Mixins and Abstract Classes?",
      "How do Java 8 Interface Default Methods act like Mixins?",
      "Mixins vs Decorators?",
    ],
    relatedTopics: ["Mixins", "Multiple Inheritance", "Design Patterns"],
    tags: ["OOP", "Python", "Patterns"],
  },
  {
    topicSlug: "oop",
    slug: "inner-and-anonymous-classes",
    title: "What is an Inner Class and Anonymous Class in Java/OOP?",
    difficulty: "MEDIUM",
    subtopic: "Classes & Interfaces",
    synopsis: "Nested class declared inside another class vs one-off inline subclass/interface implementation.",
    shortAnswer:
      "An Inner Class is a non-static class declared inside another class, holding an implicit reference to the outer class instance. An Anonymous Class is an unnamed inline implementation of a class or interface declared and instantiated in a single statement.",
    detailedExplanation: [
      "**Member Inner Class:** Has access to all outer class private fields and methods. Requires outer class instance to instantiate (`outer.new Inner()`).",
      "**Static Nested Class:** Does NOT hold reference to outer class instance. Better memory efficiency.",
      "**Anonymous Class:** Used for quick one-off listener implementations or interface callbacks (largely replaced by Lambda expressions in Java 8+).",
    ],
    example: {
      language: "JAVA",
      code: `public class Outer {
    private String secret = "Outer Secret";

    // Non-static Inner Class
    class Inner {
        void reveal() { System.out.println(secret); } // Accesses outer private state
    }

    public static void main(String[] args) {
        // Anonymous Class implementing Runnable inline
        Runnable r = new Runnable() {
            @Override
            public void run() { System.out.println("Anonymous class running"); }
        };
        new Thread(r).start();
    }
}`,
    },
    interviewTip:
      "Warn about memory leaks: Non-static inner classes keep an implicit strong reference to the outer class instance, preventing Garbage Collection of the outer object.",
    commonTrap:
      "Confusing Non-static Inner Class with Static Nested Class. Use static nested classes whenever inner class does not require access to outer instance variables.",
    followUpQuestions: [
      "Why cause memory leaks with non-static inner classes?",
      "Anonymous Classes vs Lambda Expressions in Java 8?",
      "What is a Local Inner Class?",
    ],
    relatedTopics: ["Inner Class", "Anonymous Class", "Memory Leaks"],
    tags: ["OOP", "Java Features"],
  },

  // --- SOLID & DESIGN PRINCIPLES (31 - 40) ---
  {
    topicSlug: "oop",
    slug: "solid-principles-overview",
    title: "What are the SOLID Principles in Object-Oriented Design?",
    difficulty: "HARD",
    subtopic: "SOLID Principles",
    synopsis: "SRP, OCP, LSP, ISP, DIP — 5 core principles for maintainable software architecture.",
    shortAnswer:
      "SOLID is an acronym for 5 design principles: Single Responsibility Principle (SRP), Open/Closed Principle (OCP), Liskov Substitution Principle (LSP), Interface Segregation Principle (ISP), and Dependency Inversion Principle (DIP). They ensure software is modular, scalable, testable, and maintainable.",
    detailedExplanation: [
      "**S — Single Responsibility:** A class should have only one reason to change.",
      "**O — Open/Closed:** Open for extension, closed for modification.",
      "**L — Liskov Substitution:** Subtypes must be substitutable for base types without breaking program correctness.",
      "**I — Interface Segregation:** Clients should not be forced to depend on interface methods they do not use.",
      "**D — Dependency Inversion:** Depend on abstractions, not concrete implementations.",
    ],
    example: {
      language: "JAVA",
      code: `// D — Dependency Inversion Example:
// High-level NotificationService depends on abstraction (MessageSender)
interface MessageSender { void send(String msg); }

class EmailSender implements MessageSender {
    public void send(String msg) { System.out.println("Email: " + msg); }
}

class NotificationService {
    private final MessageSender sender;
    public NotificationService(MessageSender sender) { this.sender = sender; }
    public void notify(String msg) { sender.send(msg); }
}`,
    },
    interviewTip:
      "Pick 2 principles to explain deeply with code examples (LSP and DIP are the most frequently asked by technical interviewers).",
    commonTrap:
      "Memorizing the acronym definition without being able to demonstrate a violation and its refactored solution.",
    followUpQuestions: [
      "What is a violation of Liskov Substitution Principle?",
      "How does Dependency Injection relate to Dependency Inversion?",
      "Difference between DIP, IoC, and DI?",
    ],
    relatedTopics: ["SOLID", "Architecture", "Design Principles"],
    tags: ["OOP", "SOLID", "Architecture"],
  },
  {
    topicSlug: "oop",
    slug: "srp-single-responsibility-principle",
    title: "Explain the Single Responsibility Principle (SRP) with examples.",
    difficulty: "MEDIUM",
    subtopic: "SOLID Principles",
    synopsis: "A class should have one, and only one, reason to change.",
    shortAnswer:
      "The Single Responsibility Principle (SRP) states that a class should have only one reason to change, meaning it should perform a single cohesive job or business responsibility. Violating SRP creates monolithic 'God classes' that break easily when requirements change.",
    detailedExplanation: [
      "**Violation Example:** An `Invoice` class that calculates invoice totals, prints invoice receipts, AND saves invoices to PostgreSQL database.",
      "**Reasoning for Split:** Business tax calculation changes impact line items; printing changes impact UI templates; database changes impact SQL queries. Mixing these creates 3 reasons to change.",
      "**Refactored Solution:** Split into `Invoice` (data model), `InvoiceRepository` (database persistence), and `InvoicePrinter` (presentation).",
    ],
    example: {
      language: "JAVA",
      code: `// --- REFACTORED (Adheres to SRP) ---

// 1. Data Responsibility
class Invoice {
    public double calculateTotal() { return 100.0; }
}

// 2. Persistence Responsibility
class InvoiceRepository {
    public void saveToDatabase(Invoice invoice) {
        System.out.println("Saving invoice to DB...");
    }
}

// 3. Presentation Responsibility
class InvoicePrinter {
    public void printReceipt(Invoice invoice) {
        System.out.println("Printing receipt...");
    }
}`,
    },
    interviewTip:
      "Define 'reason to change' in terms of business actors. SRP means a module should be responsible to one, and only one, actor (e.g. CFO vs DBA vs UI Designer).",
    commonTrap:
      "Taking SRP to an extreme where every class has only 1 single method, causing massive code explosion and fragmented navigation.",
    followUpQuestions: [
      "How does SRP improve unit testing?",
      "What is a God Class anti-pattern?",
      "Relationship between SRP and High Cohesion?",
    ],
    relatedTopics: ["SRP", "SOLID", "Cohesion"],
    tags: ["OOP", "SOLID"],
  },
  {
    topicSlug: "oop",
    slug: "ocp-open-closed-principle",
    title: "Explain the Open/Closed Principle (OCP) with examples.",
    difficulty: "MEDIUM",
    subtopic: "SOLID Principles",
    synopsis: "Software entities should be open for extension, but closed for modification.",
    shortAnswer:
      "The Open/Closed Principle (OCP) states that classes should be open for extension (adding new features) but closed for modification (modifying existing tested code). It is achieved using Abstraction, Interfaces, and Polymorphism.",
    detailedExplanation: [
      "**Violation:** Using giant `if-else` or `switch` statements to calculate discounts for different customer types (`if (type == VIP) ... else if (type == REGULAR)...`). Adding a new customer type requires modifying tested core source code.",
      "**Adherence:** Define a `DiscountStrategy` interface. Add new customer types by creating new concrete strategy classes without touching existing codebase.",
    ],
    example: {
      language: "JAVA",
      code: `// Open/Closed Principle via Polymorphism
interface DiscountStrategy {
    double applyDiscount(double price);
}

class RegularDiscount implements DiscountStrategy {
    public double applyDiscount(double price) { return price * 0.95; }
}

class VIPDiscount implements DiscountStrategy {
    public double applyDiscount(double price) { return price * 0.80; }
}

// Open for extension: New SuperVIPDiscount class can be added without modifying Calculator!
class DiscountCalculator {
    public double calculate(double price, DiscountStrategy strategy) {
        return strategy.applyDiscount(price);
    }
}`,
    },
    interviewTip:
      "Connect OCP to Design Patterns: Strategy Pattern, Factory Pattern, and Decorator Pattern are all direct applications of OCP.",
    commonTrap:
      "Modifying core production code and regression testing the whole application every time a new business requirement is added.",
    followUpQuestions: [
      "Which design patterns help enforce OCP?",
      "How does OCP reduce regression bugs?",
      "What is the Decorator Pattern?",
    ],
    relatedTopics: ["OCP", "SOLID", "Strategy Pattern"],
    tags: ["OOP", "SOLID"],
  },
  {
    topicSlug: "oop",
    slug: "lsp-liskov-substitution-principle",
    title: "Explain the Liskov Substitution Principle (LSP) with code examples.",
    difficulty: "HARD",
    subtopic: "SOLID Principles",
    synopsis: "Subtypes must be substitutable for their base types without breaking application correctness.",
    shortAnswer:
      "The Liskov Substitution Principle (LSP) states that objects of a subclass must be substitutable for objects of its superclass without altering any of the desirable properties of the program (correctness, task execution). The classic violation is `Square` extending `Rectangle`.",
    detailedExplanation: [
      "**Classic Violation (Square extends Rectangle):** In math, a Square is a Rectangle. But in OOP, `Rectangle` allows setting width and height independently (`setWidth(5); setHeight(10);` -> Area = 50). If `Square` overrides both setters to keep sides equal (`setWidth(5)` also sets height to 5), passing a `Square` where a `Rectangle` is expected breaks tests predicting Area = 50.",
      "**Rule:** Subclasses must fulfill superclass method pre-conditions and post-conditions.",
    ],
    example: {
      language: "JAVA",
      code: `// --- LSP VIOLATION ---
class Rectangle {
    protected int width, height;
    public void setWidth(int w) { this.width = w; }
    public void setHeight(int h) { this.height = h; }
    public int getArea() { return width * height; }
}

class Square extends Rectangle {
    @Override
    public void setWidth(int w) { this.width = w; this.height = w; } // Unexpected side effect!
    @Override
    public void setHeight(int h) { this.width = h; summer: this.height = h; }
}

// Client expecting Rectangle breaks when receiving Square:
// void testArea(Rectangle r) { r.setWidth(5); r.setHeight(4); assert r.getArea() == 20; } // FAILS for Square!`,
    },
    interviewTip:
      "Explain the solution: Don't use inheritance between Square and Rectangle. Make them both independent classes implementing a shared `Shape` interface with a `getArea()` method.",
    commonTrap:
      "Inheriting purely because of real-world taxonomy (IS-A in English does not always mean IS-A in OOP behavioral contracts).",
    followUpQuestions: [
      "How to fix the Square/Rectangle LSP violation?",
      "What are Pre-conditions and Post-conditions in contract design?",
      "Relationship between LSP and Composition?",
    ],
    relatedTopics: ["LSP", "SOLID", "Contract Design"],
    tags: ["OOP", "SOLID", "Architecture"],
  },
  {
    topicSlug: "oop",
    slug: "isp-interface-segregation-principle",
    title: "Explain the Interface Segregation Principle (ISP) with examples.",
    difficulty: "MEDIUM",
    subtopic: "SOLID Principles",
    synopsis: "Clients should not be forced to depend on interfaces they do not use.",
    shortAnswer:
      "The Interface Segregation Principle (ISP) states that no client should be forced to depend on methods it does not use. Instead of creating large, monolithic interfaces ('fat interfaces'), split them into smaller, role-specific, focused interfaces.",
    detailedExplanation: [
      "**Violation:** A giant `MultiFunctionPrinter` interface with `print()`, `scan()`, `fax()`. A simple `BasicPrinter` class implementing this interface is forced to throw `UnsupportedOperationException` for `scan()` and `fax()`.",
      "**Refactored Solution:** Separate into `Printer`, `Scanner`, and `FaxMachine` interfaces. A multi-function device implements all three, while a basic printer implements only `Printer`.",
    ],
    example: {
      language: "JAVA",
      code: `// --- REFACTORED (Adheres to ISP) ---
interface Printer { void print(); }
interface Scanner { void scan(); }

class BasicPrinter implements Printer {
    public void print() { System.out.println("Printing..."); }
}

class AdvancedCopier implements Printer, Scanner {
    public void print() { System.out.println("Printing..."); }
    public void scan() { System.out.println("Scanning..."); }
}`,
    },
    interviewTip:
      "Mention single-method functional interfaces in Java (like `Runnable`, `Callable`, `Consumer`) as textbook examples of ISP.",
    commonTrap:
      "Creating huge monolithic interfaces with 30 methods, forcing implementers to write dummy empty methods.",
    followUpQuestions: [
      "How does ISP relate to Single Responsibility Principle?",
      "What is a Fat Interface?",
      "Interface Segregation in microservices API contracts?",
    ],
    relatedTopics: ["ISP", "SOLID", "Interfaces"],
    tags: ["OOP", "SOLID"],
  },
  {
    topicSlug: "oop",
    slug: "dip-dependency-inversion-principle",
    title: "Explain the Dependency Inversion Principle (DIP). How does it differ from DI and IoC?",
    difficulty: "HARD",
    subtopic: "SOLID Principles",
    synopsis: "High-level modules should depend on abstractions, not concrete implementations.",
    shortAnswer:
      "Dependency Inversion Principle (DIP) is a high-level architectural principle stating that high-level business modules should not depend on low-level implementation details; both should depend on abstractions (interfaces). Inversion of Control (IoC) is the design pattern that flips execution control, and Dependency Injection (DI) is the specific technique used to supply concrete implementations to high-level modules.",
    detailedExplanation: [
      "**DIP (Principle):** Design guideline: 'Depend upon abstractions, not concretions.'",
      "**IoC (Pattern/Concept):** Instead of application code calling framework methods, the framework calls application code (Hollywood Principle: 'Don't call us, we'll call you').",
      "**DI (Technique):** Passing concrete dependencies into a class via Constructor, Setter, or Field Injection.",
    ],
    example: {
      language: "JAVA",
      code: `// Abstraction
interface Database { void connect(); }

class MySQLDatabase implements Database {
    public void connect() { System.out.println("MySQL Connected"); }
}

// High-level App depends on Database interface, NOT MySQLDatabase
class App {
    private final Database db;
    // Dependency Injection via constructor
    public App(Database db) { this.db = db; }
    public void start() { db.connect(); }
}`,
    },
    interviewTip:
      "Clarify the relationship clearly: DIP is the conceptual principle; IoC is the architectural pattern; DI is the concrete mechanism used by Spring/Guice.",
    commonTrap:
      "Confusing Dependency Inversion with Dependency Injection. DIP is the overarching rule; DI is the implementation tool.",
    followUpQuestions: [
      "Constructor Injection vs Field Injection in Spring?",
      "What is the Hollywood Principle?",
      "How to write unit tests for classes adhering to DIP using Mocks?",
    ],
    relatedTopics: ["DIP", "Dependency Injection", "Inversion of Control"],
    tags: ["OOP", "SOLID", "Spring"],
  },
  {
    topicSlug: "oop",
    slug: "law-of-demeter",
    title: "What is the Law of Demeter (Principle of Least Knowledge)?",
    difficulty: "MEDIUM",
    subtopic: "Design Principles",
    synopsis: "'Don't talk to strangers' — only interact with immediate friends.",
    shortAnswer:
      "The Law of Demeter (LoD) states that an object should only communicate with its immediate collaborators and should not know about the internal structure or navigation path of nested objects. It prevents long dot-chains like `a.getB().getC().getD().doSomething()`.",
    detailedExplanation: [
      "**Rule:** A method `m` of object `A` can only call methods of: 1) `A` itself, 2) Objects passed as parameters to `m`, 3) Objects created within `m`, 4) Direct instance component variables of `A`.",
      "**Problem with Chaining:** `a.getB().getC().doAction()` tightly couples `A` to `B`, `C`, and their internal methods. If `B` or `C` changes, `A` breaks.",
      "**Refactored Solution:** Delegate responsibility: `a.doActionOnC()`.",
    ],
    example: {
      language: "JAVA",
      code: `// --- VIOLATION of Law of Demeter ---
// wallet = customer.getWallet().getMoney(); // Long train-wreck chain!

// --- ADHERENCE ---
class Wallet {
    private double balance;
    public boolean deduct(double amount) {
        if (balance >= amount) { balance -= amount; return true; }
        return false;
    }
}

class Customer {
    private Wallet wallet;
    public boolean pay(double amount) {
        return wallet.deduct(amount); // Delegates to immediate member
    }
}`,
    },
    interviewTip:
      "Mention that method chaining in Fluent APIs or Builders (`StringBuilder.append().append()`) does NOT violate the Law of Demeter because it returns the same instance type.",
    commonTrap:
      "Confusing fluent interfaces/builder patterns with Law of Demeter violations.",
    followUpQuestions: [
      "Why is method chaining in Builder pattern not an LoD violation?",
      "How does LoD reduce ripple effects in code maintenance?",
      "Relationship between LoD and Tight Coupling?",
    ],
    relatedTopics: ["Law of Demeter", "Coupling", "Clean Code"],
    tags: ["OOP", "Clean Code"],
  },
  {
    topicSlug: "oop",
    slug: "fluent-interface-and-method-chaining",
    title: "What is Method Chaining and how is a Fluent Interface designed?",
    difficulty: "EASY",
    subtopic: "Design & Architecture",
    synopsis: "Returning `this` from methods to enable readable chainable method calls.",
    shortAnswer:
      "Method Chaining is an OOP design technique where methods return `this` (the current object instance), allowing multiple method calls to be chained together sequentially in a single expression. A Fluent Interface uses method chaining to build readable DSL-like code.",
    detailedExplanation: [
      "**Mechanism:** Every setter or modifier method ends with `return this;`.",
      "**Use Cases:** Builder Pattern, Stream API, Criteria Queries, StringBuilder.",
      "**Readability:** Replaces verbose line-by-line configuration with clean readable code blocks.",
    ],
    example: {
      language: "JAVA",
      code: `public class RequestBuilder {
    private String url;
    private String method = "GET";

    public RequestBuilder setUrl(String url) {
        this.url = url;
        return this; // Enables chaining
    }

    public RequestBuilder setMethod(String method) {
        this.method = method;
        return this;
    }

    public static void main(String[] args) {
        // Fluent Method Chaining
        RequestBuilder req = new RequestBuilder()
                .setUrl("https://api.example.com")
                .setMethod("POST");
    }
}`,
    },
    interviewTip:
      "Cite `java.lang.StringBuilder` and `java.util.stream.Stream` as textbook Java standard library fluent interfaces.",
    commonTrap:
      "Forgetting to handle NullPointerExceptions in intermediate chain links when chaining methods across different object types.",
    followUpQuestions: [
      "How does Builder Pattern use Fluent Interface?",
      "Difference between Fluent Interface and Method Chaining?",
      "Method chaining in Python (`self` return)?",
    ],
    relatedTopics: ["Fluent Interface", "Builder Pattern", "API Design"],
    tags: ["OOP", "API Design"],
  },

  // --- DESIGN PATTERNS & ARCHITECTURAL OOP (41 - 62) ---
  {
    topicSlug: "oop",
    slug: "singleton-pattern-implementation",
    title: "What is the Singleton Pattern? How to implement a thread-safe Singleton in Java & Python?",
    difficulty: "MEDIUM",
    subtopic: "Design Patterns",
    synopsis: "Ensures a class has only one instance and provides a global access point.",
    shortAnswer:
      "The Singleton Pattern ensures a class has only one single instance in memory and provides a global point of access to it. In Java, it is implemented using double-checked locking with `volatile`, or Bill Pugh Holder idiom, or Enum. In Python, using module-level instances or metaclasses.",
    detailedExplanation: [
      "**Bill Pugh Singleton (Java):** Uses a static inner helper class. Lazy-loaded, thread-safe, with zero synchronization performance overhead.",
      "**Enum Singleton (Java):** Best approach. Handles serialization and reflection attacks automatically.",
      "**Python Singleton:** Modules in Python are singletons by default because Python caches imported modules in `sys.modules`.",
    ],
    example: {
      language: "JAVA",
      code: `// Bill Pugh Thread-Safe Singleton Idiom
public class DatabaseConnection {
    private DatabaseConnection() {} // Private constructor

    private static class InstanceHolder {
        private static final DatabaseConnection INSTANCE = new DatabaseConnection();
    }

    public static DatabaseConnection getInstance() {
        return InstanceHolder.INSTANCE; // Lazy loaded & thread-safe!
    }
}`,
    },
    interviewTip:
      "Mention that reflection can break private constructors in traditional Singletons, but Enum Singletons in Java are protected by the JVM against reflection attacks.",
    commonTrap:
      "Implementing lazy Singletons using non-volatile variables with double-checked locking, which causes instruction reordering bugs in multithreaded environments.",
    followUpQuestions: [
      "Why is Enum Singleton reflection-proof?",
      "What is Double-Checked Locking and why is `volatile` required?",
      "Singletons vs Static Utility Classes?",
    ],
    relatedTopics: ["Singleton Pattern", "Design Patterns", "Thread Safety"],
    tags: ["OOP", "Design Patterns", "Concurrency"],
  },
  {
    topicSlug: "oop",
    slug: "factory-vs-abstract-factory-pattern",
    title: "What is Factory Method Pattern vs Abstract Factory Pattern?",
    difficulty: "HARD",
    subtopic: "Design Patterns",
    synopsis: "Creating single objects (Factory Method) vs creating families of related objects (Abstract Factory).",
    shortAnswer:
      "Factory Method defines an interface for creating a single object, allowing subclasses to decide which concrete class to instantiate. Abstract Factory provides an interface for creating families of related or dependent objects without specifying their concrete classes.",
    detailedExplanation: [
      "**Factory Method (1 Product):** A single method creates objects of a single hierarchy (e.g. `ButtonFactory.createButton()`).",
      "**Abstract Factory (Family of Products):** An factory interface with multiple methods creating a full suite of products (e.g. `GUIFactory` creates `Button`, `Checkbox`, and `Scrollbar` for Windows vs Mac).",
    ],
    example: {
      language: "JAVA",
      code: `// Abstract Factory Interface
interface GUIFactory {
    Button createButton();
    Checkbox createCheckbox();
}

class WindowsFactory implements GUIFactory {
    public Button createButton() { return new WindowsButton(); }
    public Checkbox createCheckbox() { return new WindowsCheckbox(); }
}

class MacFactory implements GUIFactory {
    public Button createButton() { return new MacButton(); }
    public Checkbox createCheckbox() { return new MacCheckbox(); }
}`,
    },
    interviewTip:
      "Summarize: 'Factory Method uses inheritance to create one object; Abstract Factory uses composition to create a suite of related objects.'",
    commonTrap:
      "Conflating Simple Factory (a utility class with static switch statement) with the formal GoF Factory Method pattern.",
    followUpQuestions: [
      "Simple Factory vs Factory Method?",
      "How does Dependency Injection replace manual Factory classes?",
      "Real-world examples in Spring (`BeanFactory`)?",
    ],
    relatedTopics: ["Factory Pattern", "Abstract Factory", "Design Patterns"],
    tags: ["OOP", "Design Patterns"],
  },
  {
    topicSlug: "oop",
    slug: "builder-pattern-explained",
    title: "What is the Builder Pattern and when should it be used?",
    difficulty: "MEDIUM",
    subtopic: "Design Patterns",
    synopsis: "Constructing complex objects step-by-step to eliminate telescopic constructors.",
    shortAnswer:
      "The Builder Pattern separates the construction of a complex object from its representation, allowing the same construction process to create different representations. It solves the 'Telescoping Constructor' problem (multiple constructors with many optional parameters).",
    detailedExplanation: [
      "**Telescoping Constructor Anti-Pattern:** Having constructors like `User(name)`, `User(name, age)`, `User(name, age, email)`, `User(name, age, email, phone)`. Hard to read and error-prone.",
      "**Solution:** Fluent Builder class with chainable parameter methods and a final `.build()` validation call.",
      "**Lombok `@Builder`:** Annotates Java classes to auto-generate builder implementations at compile time.",
    ],
    example: {
      language: "JAVA",
      code: `public class User {
    private final String name;  // Required
    private final int age;      // Optional
    private final String email; // Optional

    private User(Builder builder) {
        this.name = builder.name;
        this.age = builder.age;
        this.email = builder.email;
    }

    public static class Builder {
        private final String name;
        private int age;
        private String email;

        public Builder(String name) { this.name = name; }
        public Builder age(int age) { this.age = age; return this; }
        public Builder email(String email) { this.email = email; return this; }

        public User build() { return new User(this); }
    }
}`,
    },
    interviewTip:
      "Highlight that Builder ensures Immutability because fields in the target object can be declared `private final` without public setters.",
    commonTrap:
      "Using Builder for tiny classes with only 1 or 2 mandatory fields where a simple constructor is cleaner.",
    followUpQuestions: [
      "Difference between Builder and Prototype Pattern?",
      "How does Lombok `@Builder` work?",
      "Builder Pattern in Python using kwargs?",
    ],
    relatedTopics: ["Builder Pattern", "Fluent Interface", "Immutability"],
    tags: ["OOP", "Design Patterns"],
  },
  {
    topicSlug: "oop",
    slug: "strategy-pattern-explained",
    title: "What is the Strategy Pattern and how does it implement OCP?",
    difficulty: "MEDIUM",
    subtopic: "Design Patterns",
    synopsis: "Encapsulating interchangeable algorithms into separate classes.",
    shortAnswer:
      "The Strategy Pattern defines a family of algorithms, encapsulates each one inside a separate class, and makes them interchangeable at runtime. It allows the algorithm to vary independently from clients that use it, directly implementing the Open/Closed Principle.",
    detailedExplanation: [
      "**Use Case:** Payment processing (CreditCard, PayPal, Crypto), Sorting strategies, Compression algorithms (ZIP, RAR).",
      "**Structure:** `Context` class holds reference to `Strategy` interface. Client injects desired concrete strategy.",
      "**Eliminates Conditionals:** Replaces complex `if-else` or `switch` blocks with clean polymorphic dispatch.",
    ],
    example: {
      language: "PYTHON",
      code: `from abc import ABC, abstractmethod

class PaymentStrategy(ABC):
    @abstractmethod
    def pay(self, amount): pass

class CreditCardPayment(PaymentStrategy):
    def pay(self, amount): print(f"Paid \${amount} via Credit Card")

class CryptoPayment(PaymentStrategy):
    def pay(self, amount): print(f"Paid \${amount} via Bitcoin")

class ShoppingCart:
    def __init__(self, strategy: PaymentStrategy):
        self.strategy = strategy

    def checkout(self, amount):
        self.strategy.pay(amount)

cart = ShoppingCart(CryptoPayment())
cart.checkout(100) # Paid \$100 via Bitcoin`,
    },
    interviewTip:
      "Mention that in Python or Java 8+, single-method Strategy interfaces can be replaced concisely with First-Class Functions or Lambdas.",
    commonTrap:
      "Overcomplicating simple logic when a function pointer or lambda is sufficient.",
    followUpQuestions: [
      "Strategy Pattern vs State Pattern?",
      "How to pass Lambdas as Strategies in Java 8?",
      "Strategy Pattern vs Template Method Pattern?",
    ],
    relatedTopics: ["Strategy Pattern", "OCP", "Design Patterns"],
    tags: ["OOP", "Design Patterns"],
  },
  {
    topicSlug: "oop",
    slug: "observer-pattern-explained",
    title: "What is the Observer Pattern and how is it used in event-driven systems?",
    difficulty: "MEDIUM",
    subtopic: "Design Patterns",
    synopsis: "One-to-many dependency notification mechanism when state changes.",
    shortAnswer:
      "The Observer Pattern establishes a one-to-many dependency between objects so that when one object (Subject/Observable) changes state, all registered dependents (Observers) are notified and updated automatically. Used in event listeners, Reactive Programming, and MVC architectures.",
    detailedExplanation: [
      "**Subject (Publisher):** Maintains a list of observers and provides `attach()`, `detach()`, and `notify()` methods.",
      "**Observer (Subscriber):** Implements an `update()` method called by the subject upon state change.",
      "**Loose Coupling:** Subject knows only that observers implement the `Observer` interface; it does not know their concrete implementation.",
    ],
    example: {
      language: "JAVA",
      code: `import java.util.*;

interface Observer { void update(float price); }

class StockTicker {
    private final List<Observer> observers = new ArrayList<>();
    private float price;

    public void subscribe(Observer o) { observers.add(o); }
    public void setPrice(float price) {
        this.price = price;
        for (Observer o : observers) o.update(price);
    }
}

class MobileApp implements Observer {
    public void update(float price) { System.out.println("Mobile alert: $" + price); }
}`,
    },
    interviewTip:
      "Distinguish Observer Pattern (in-memory direct method invocation) from Publish-Subscribe Pattern (decoupled via message broker like Kafka/RabbitMQ).",
    commonTrap:
      "Memory Leaks (Lapsed Listener Problem): Forgetting to un-subscribe observers from long-lived Subjects prevents observers from being Garbage Collected.",
    followUpQuestions: [
      "What is the Lapsed Listener Problem?",
      "Observer Pattern vs Pub/Sub Pattern?",
      "How does RxJava / Project Reactor build on Observer Pattern?",
    ],
    relatedTopics: ["Observer Pattern", "Event Driven", "Design Patterns"],
    tags: ["OOP", "Design Patterns", "Events"],
  },
  {
    topicSlug: "oop",
    slug: "adapter-pattern-explained",
    title: "What is the Adapter Pattern and how does it bridge incompatible interfaces?",
    difficulty: "EASY",
    subtopic: "Design Patterns",
    synopsis: "Wrapper enabling incompatible interfaces to collaborate.",
    shortAnswer:
      "The Adapter Pattern acts as a wrapper that converts the interface of a class into another interface that callers expect. It allows classes with incompatible interfaces to work together seamlessly without modifying their source code.",
    detailedExplanation: [
      "**Analogy:** A physical AC power adapter that allows a 3-prong US plug to fit into a 2-prong European wall outlet.",
      "**Types:** Object Adapter (uses composition) vs Class Adapter (uses multiple inheritance). Object Adapter is strongly preferred.",
      "**Use Case:** Integrating legacy libraries or 3rd-party SDKs into an existing system without rewriting core domain code.",
    ],
    example: {
      language: "JAVA",
      code: `// Target Interface expected by application
interface TypeC { void connectTypeC(); }

// Legacy 3rd party class (Adaptee)
class MicroUsb { void connectMicroUsb() { System.out.println("MicroUSB Connected"); } }

// Adapter Class using Composition
class USBAdapter implements TypeC {
    private final MicroUsb microUsbDevice;
    public USBAdapter(MicroUsb device) { this.microUsbDevice = device; }

    @Override
    public void connectTypeC() {
        microUsbDevice.connectMicroUsb(); // Translates call
    }
}`,
    },
    interviewTip:
      "Cite `java.util.Arrays.asList()` as a classic Java standard library example of an Adapter.",
    commonTrap:
      "Confusing Adapter with Decorator. Adapter changes the interface to make things compatible; Decorator keeps the same interface to add new behavior.",
    followUpQuestions: [
      "Adapter vs Decorator vs Proxy Pattern?",
      "Class Adapter vs Object Adapter?",
      "Real-world legacy integration scenarios?",
    ],
    relatedTopics: ["Adapter Pattern", "Structural Patterns", "Design Patterns"],
    tags: ["OOP", "Design Patterns"],
  },
  {
    topicSlug: "oop",
    slug: "decorator-pattern-explained",
    title: "What is the Decorator Pattern and how does it dynamically extend behavior?",
    difficulty: "MEDIUM",
    subtopic: "Design Patterns",
    synopsis: "Attaching additional responsibilities to an object dynamically without inheritance.",
    shortAnswer:
      "The Decorator Pattern attaches additional responsibilities or behaviors to an object dynamically at runtime. Decorators provide a flexible alternative to subclassing for extending functionality, wrapping the original object inside a matching interface wrapper.",
    detailedExplanation: [
      "**Structure:** Decorator implements the same interface as the target component AND holds a reference to a target component instance.",
      "**Avoids Class Explosion:** Instead of creating `CoffeeWithMilk`, `CoffeeWithSugar`, `CoffeeWithMilkAndSugar` classes, wrap a base `Coffee` object with `MilkDecorator` and `SugarDecorator`.",
      "**Standard Library Example:** Java I/O streams: `new BufferedReader(new FileReader(file))`.",
    ],
    example: {
      language: "JAVA",
      code: `interface Coffee { double getCost(); }

class SimpleCoffee implements Coffee { public double getCost() { return 2.0; } }

// Abstract Decorator
abstract class CoffeeDecorator implements Coffee {
    protected final Coffee decoratedCoffee;
    public CoffeeDecorator(Coffee coffee) { this.decoratedCoffee = coffee; }
    public double getCost() { return decoratedCoffee.getCost(); }
}

class MilkDecorator extends CoffeeDecorator {
    public MilkDecorator(Coffee c) { super(c); }
    @Override public double getCost() { return super.getCost() + 0.5; }
}

// Usage: Stacking decorators
Coffee myCoffee = new MilkDecorator(new SimpleCoffee()); // Cost: 2.5`,
    },
    interviewTip:
      "Mention Java's `java.io` package (`BufferedInputStream`, `GZIPInputStream`) as the iconic real-world Decorator implementation.",
    commonTrap:
      "Confusing Decorator with Proxy. Decorator adds features dynamically; Proxy controls access to an object.",
    followUpQuestions: [
      "Decorator vs Proxy vs Composite Pattern?",
      "How Java I/O uses Decorator Pattern?",
      "Python `@decorator` syntax vs OOP Decorator pattern?",
    ],
    relatedTopics: ["Decorator Pattern", "Design Patterns", "Java IO"],
    tags: ["OOP", "Design Patterns"],
  },
  {
    topicSlug: "oop",
    slug: "proxy-pattern-explained",
    title: "What is the Proxy Pattern? Explain Virtual, Protective, and Remote Proxies.",
    difficulty: "MEDIUM",
    subtopic: "Design Patterns",
    synopsis: "Placeholder object controlling access to another target object.",
    shortAnswer:
      "The Proxy Pattern provides a surrogate or placeholder object to control access to another target object. It can add security checks (Protection Proxy), lazy loading initialization (Virtual Proxy), or remote network communication (Remote Proxy / RMI).",
    detailedExplanation: [
      "**Virtual Proxy:** Delays expensive object creation until it is actually accessed (e.g. Loading high-res images lazily).",
      "**Protection Proxy:** Checks caller permissions before forwarding requests to sensitive target objects.",
      "**Spring AOP:** Uses Dynamic Proxies (JDK Dynamic Proxy / CGLIB) to inject cross-cutting concerns like `@Transactional` and logging.",
    ],
    example: {
      language: "JAVA",
      code: `interface Image { void display(); }

class RealImage implements Image {
    public RealImage(String file) { loadFromDisk(file); }
    private void loadFromDisk(String file) { System.out.println("Heavy loading " + file); }
    public void display() { System.out.println("Displaying image"); }
}

// Virtual Proxy for Lazy Loading
class ProxyImage implements Image {
    private RealImage realImage;
    private final String file;

    public ProxyImage(String file) { this.file = file; }

    public void display() {
        if (realImage == null) realImage = new RealImage(file); // Lazy init
        realImage.display();
    }
}`,
    },
    interviewTip:
      "Explain how Spring AOP uses JDK Dynamic Proxies (for interfaces) and CGLIB proxies (for concrete classes) to handle `@Transactional` boundaries.",
    commonTrap:
      "Thinking a proxy alters method behavior. Proxies manage execution access, lazy loading, or auditing without changing business logic contracts.",
    followUpQuestions: [
      "How does Spring AOP use Dynamic Proxies?",
      "JDK Dynamic Proxy vs CGLIB?",
      "Proxy vs Adapter Pattern?",
    ],
    relatedTopics: ["Proxy Pattern", "Spring AOP", "Lazy Loading"],
    tags: ["OOP", "Design Patterns", "Spring"],
  },
  {
    topicSlug: "oop",
    slug: "mvc-pattern-in-oop",
    title: "What is the Model-View-Controller (MVC) Pattern in OOP software architecture?",
    difficulty: "EASY",
    subtopic: "Architecture & Design",
    synopsis: "Separating data (Model), presentation (View), and business logic (Controller).",
    shortAnswer:
      "MVC is an architectural pattern that divides an application into three interconnected components: Model (data structure and business rules), View (UI layout and presentation), and Controller (processes user input and coordinates Model and View updates).",
    detailedExplanation: [
      "**Model:** Encapsulates domain data, entity state, and persistence logic. Independent of UI.",
      "**View:** Renders data formatting for the user (HTML, JSON, UI components).",
      "**Controller:** Receives incoming HTTP requests/user inputs, invokes Model business logic, and selects appropriate View for response.",
    ],
    example: {
      language: "PYTHON",
      code: `# Model
class UserModel:
    def __init__(self, name): self.name = name

# View
class UserView:
    def render(self, user): print(f"<h1>User Profile: {user.name}</h1>")

# Controller
class UserController:
    def __init__(self, model, view):
        self.model = model
        self.view = view

    def update_user(self, new_name):
        self.model.name = new_name
        self.view.render(self.model)`,
    },
    interviewTip:
      "Relate MVC directly to the Single Responsibility Principle: Model handles data; View handles rendering; Controller handles flow orchestration.",
    commonTrap:
      "Writing business validation logic inside View templates or Controller classes ('Fat Controllers'). Business logic belongs in the Model/Service layer.",
    followUpQuestions: [
      "What is a Fat Controller anti-pattern?",
      "MVC vs MVP vs MVVM architectures?",
      "How Spring MVC implements Controller routing?",
    ],
    relatedTopics: ["MVC", "Architecture", "Design Patterns"],
    tags: ["OOP", "Architecture", "Web"],
  },
  {
    topicSlug: "oop",
    slug: "value-object-vs-entity",
    title: "What is a Value Object vs Entity in Domain-Driven Design (DDD) / OOP?",
    difficulty: "HARD",
    subtopic: "Architecture & Design",
    synopsis: "Identity-based objects (Entity) vs Attribute-equality immutable objects (Value Object).",
    shortAnswer:
      "An Entity is defined by a unique, thread-safe identity (e.g. `User` with ID `101`) that remains constant across state changes. A Value Object has no conceptual identity and is defined entirely by the equality of its attributes (e.g. `Money(10, 'USD')` or `Address`). Value Objects are immutable.",
    detailedExplanation: [
      "**Entity:** Two entities with identical field values are NOT equal unless their IDs match. Example: Two users named 'John Doe' living at same address are distinct entities.",
      "**Value Object:** Two Value Objects with identical attribute values ARE equal. Example: Two \$20 bills have identical value objects; swapping them makes no difference.",
      "**Immutability:** Value Objects should always be immutable; Entities can mutate internal state over their lifecycle.",
    ],
    example: {
      language: "JAVA",
      code: `// Value Object (Attribute Equality + Immutable)
public final class Money {
    private final double amount;
    private final String currency;

    public Money(double amount, String currency) {
        this.amount = amount;
        this.currency = currency;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Money)) return false;
        Money money = (Money) o;
        return Double.compare(money.amount, amount) == 0 && currency.equals(money.currency);
    }
}`,
    },
    interviewTip:
      "Cite `java.lang.String` and `java.time.LocalDate` as built-in Java Value Objects.",
    commonTrap:
      "Assigning database primary key IDs to pure Value Objects. If it has an ID, it is an Entity.",
    followUpQuestions: [
      "Why should Value Objects be immutable?",
      "How to map Value Objects in JPA/Hibernate (`@Embeddable`)?",
      "Entities vs DTOs vs Value Objects?",
    ],
    relatedTopics: ["Value Object", "Entity", "Domain-Driven Design"],
    tags: ["OOP", "DDD", "Architecture"],
  },
  {
    topicSlug: "oop",
    slug: "dto-vs-dao-vs-repository",
    title: "What is a DTO vs DAO vs Repository in object-oriented architecture?",
    difficulty: "MEDIUM",
    subtopic: "Architecture & Design",
    synopsis: "Data transfer container (DTO) vs Low-level DB access (DAO) vs High-level domain collection (Repository).",
    shortAnswer:
      "A DTO (Data Transfer Object) is a plain data container with no business logic used to carry data across process/network boundaries. A DAO (Data Access Object) provides direct CRUD database operations for specific tables. A Repository acts as an in-memory domain collection abstraction hiding database details.",
    detailedExplanation: [
      "**DTO:** Plain data holder (often Java `record` or POJO) serialized to JSON/XML for API requests/responses.",
      "**DAO:** Table-centric persistence class (e.g. `UserDao.insert()`, `UserDao.update()`). Directly executes SQL/JDBC calls.",
      "**Repository:** Domain-centric abstraction (e.g. `UserRepository.findActiveSubscribers()`). May query multiple DAOs or caches underneath.",
    ],
    example: {
      language: "JAVA",
      code: `// DTO: Network carrier (no behavior)
public record UserResponseDTO(String username, String email) {}

// Repository: Domain abstraction
public interface UserRepository {
    User findById(String id);
    void save(User user);
}`,
    },
    interviewTip:
      "Highlight how DTOs prevent exposing domain entities directly over REST APIs, protecting security and internal database schemas.",
    commonTrap:
      "Putting business validation logic inside a DTO. DTOs are data carriers only.",
    followUpQuestions: [
      "Why not return JPA entities directly from REST controllers?",
      "DAO Pattern vs Repository Pattern?",
      "How Spring Data JPA generates Repositories automatically?",
    ],
    relatedTopics: ["DTO", "DAO", "Repository Pattern"],
    tags: ["OOP", "Architecture", "Patterns"],
  },
  {
    topicSlug: "oop",
    slug: "oop-vs-functional-programming",
    title: "How does Object-Oriented Programming (OOP) compare to Functional Programming (FP)?",
    difficulty: "MEDIUM",
    subtopic: "Architecture & Design",
    synopsis: "Objects & Mutable State vs Pure Functions & Immutability.",
    shortAnswer:
      "OOP organizes software around objects bundling mutable state and behavior together, emphasizing inheritance and polymorphism. FP organizes software around pure functions, immutability, and stateless transformations, emphasizing composition of functions without side effects.",
    detailedExplanation: [
      "**State:** OOP encapsulates state within objects (often mutable); FP avoids mutable state entirely.",
      "**Primary Building Block:** Objects & Classes (OOP) vs Pure Functions & High-Order Functions (FP).",
      "**Concurrency:** FP is naturally thread-safe due to immutability; OOP requires explicit synchronization (locks/mutexes) to prevent race conditions on mutable object fields.",
      "**Modern Synergy:** Modern languages like Java 8+, Python, and Scala blend both paradigms (e.g. OOP domain classes with FP Stream/Lambda pipelines).",
    ],
    example: {
      language: "JAVA",
      code: `List<Integer> numbers = List.of(1, 2, 3, 4, 5);

// Functional Approach (Pure, immutable stream pipeline)
int sumOfEvens = numbers.stream()
        .filter(n -> n % 2 == 0)
        .mapToInt(n -> n * 2)
        .sum(); // Result: 12`,
    },
    interviewTip:
      "Conclude that modern enterprise software is rarely purely OOP or purely FP; best practices use OOP for high-level module architecture and FP for internal data processing pipelines.",
    commonTrap:
      "Treating OOP and FP as mutually exclusive enemies. Modern languages integrate both effectively.",
    followUpQuestions: [
      "What is a Pure Function?",
      "How do Java Streams combine OOP and FP?",
      "What are Higher-Order Functions?",
    ],
    relatedTopics: ["OOP vs FP", "Functional Programming", "Java Streams"],
    tags: ["OOP", "Paradigm", "Architecture"],
  },
];
