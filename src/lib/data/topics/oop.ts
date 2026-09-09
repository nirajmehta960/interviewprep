import type { ConceptualQuestion } from "../conceptual";

export const oopQuestions: ConceptualQuestion[] = [
  {
    topicSlug: "oop",
    slug: "four-pillars-of-oop",
    title: "What are the Four Pillars of Object-Oriented Programming?",
    difficulty: "EASY",
    subtopic: "Core OOP",
    synopsis: "Encapsulation, Abstraction, Inheritance, and Polymorphism.",
    shortAnswer:
      "The four pillars are Encapsulation (bundling data and methods while restricting access), Abstraction (hiding internal implementation details and exposing clean interfaces), Inheritance (reusing parent class attributes and behaviors), and Polymorphism (allowing one interface to represent different underlying forms).",
    detailedExplanation: [
      "**Encapsulation.** Keeps fields private and exposes controlled access via public getters/setters or methods. Protects internal state consistency.",
      "**Abstraction.** Exposes *what* an object does rather than *how* it works (e.g. interfaces, abstract classes). Reduces complexity for API callers.",
      "**Inheritance.** Establishes an 'is-a' hierarchy allowing derived classes to inherit fields and methods from a base class, promoting code reuse.",
      "**Polymorphism.** Allows objects of different concrete types to be treated uniformly through a shared superclass or interface (Compile-time via overloading, Runtime via overriding).",
    ],
    example: {
      language: "JAVA",
      code: `// Encapsulation & Abstraction
public abstract class Shape {
    private String color; // Encapsulated private state
    public Shape(String color) { this.color = color; }
    public abstract double calculateArea(); // Abstract contract
}

// Inheritance & Polymorphism
public class Circle extends Shape {
    private double radius;
    public Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }
    @Override
    public double calculateArea() { return Math.PI * radius * radius; }
}`,
    },
    interviewTip:
      "Connect abstraction and encapsulation clearly: Encapsulation is about hiding state and data access inside a class; Abstraction is about hiding implementation logic behind an interface or contract.",
    commonTrap:
      "Confusing Abstraction with Encapsulation. Encapsulation hides data; Abstraction hides implementation details.",
    followUpQuestions: [
      "Difference between composition and inheritance?",
      "Why is composition preferred over inheritance in modern software design?",
      "How does runtime polymorphism work in the JVM?",
    ],
    relatedTopics: ["Encapsulation", "Abstraction", "Inheritance", "Polymorphism"],
    tags: ["OOP", "Design"],
  },
  {
    topicSlug: "oop",
    slug: "composition-over-inheritance",
    title: "Why is 'Composition over Inheritance' a recommended design principle?",
    difficulty: "MEDIUM",
    subtopic: "Design Principles",
    synopsis: "Flexible 'has-a' delegation vs fragile 'is-a' tight coupling hierarchies.",
    shortAnswer:
      "Composition ('has-a') embeds references to other objects to delegate behavior at runtime, making systems flexible and loosely coupled. Inheritance ('is-a') creates rigid compile-time class hierarchies that break encapsulation when parent classes change (the Fragile Base Class problem).",
    detailedExplanation: [
      "**Fragile Base Class Problem.** Changes to a superclass can silently break subclasses that rely on internal implementation details of parent methods.",
      "**Runtime Flexibility.** Composition allows switching behaviors dynamically at runtime by swapping reference instances (e.g. Strategy Pattern). Inheritance fixes behavior permanently at compile-time.",
      "**Single Inheritance Constraint.** In languages like Java, a class can extend only one base class. Overusing inheritance consumes that single slot early.",
    ],
    example: {
      language: "JAVA",
      code: `// Interface behavior contracts
interface FlyBehavior { void fly(); }
class FlyWithWings implements FlyBehavior { public void fly() { System.out.println("Flying high!"); } }

// Duck HAS-A FlyBehavior (Composition)
public class Duck {
    private FlyBehavior flyBehavior; // Delegated instance
    public Duck(FlyBehavior fb) { this.flyBehavior = fb; }
    public void performFly() { flyBehavior.fly(); }
    public void setFlyBehavior(FlyBehavior fb) { this.flyBehavior = fb; } // Dynamic swap at runtime
}`,
    },
    interviewTip:
      "Quote the Strategy Pattern as the textbook example of composition over inheritance. Use inheritance only when true polymorphic substitution (Liskov Substitution Principle) is strictly required.",
    commonTrap:
      "Using inheritance purely to reuse code without a genuine 'is-a' relationship.",
    followUpQuestions: [
      "What is the Liskov Substitution Principle (LSP)?",
      "What is the Strategy Pattern?",
      "How does Delegation Pattern work?",
    ],
    relatedTopics: ["Composition", "Inheritance", "Design Patterns"],
    tags: ["OOP", "Design Principles"],
  },
  {
    topicSlug: "oop",
    slug: "solid-principles-explained",
    title: "What are the SOLID Principles in Object-Oriented Design?",
    difficulty: "HARD",
    subtopic: "Design Principles",
    synopsis: "Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.",
    shortAnswer:
      "SOLID is an acronym for 5 design principles that make software maintainable and scalable: Single Responsibility (one reason to change), Open/Closed (open for extension, closed for modification), Liskov Substitution (subtypes must be substitutable for base types), Interface Segregation (fine-grained interfaces), and Dependency Inversion (depend on abstractions, not concretions).",
    detailedExplanation: [
      "**S — Single Responsibility Principle (SRP):** A class should have only one reason to change, meaning a single job or responsibility.",
      "**O — Open/Closed Principle (OCP):** Software entities should be open for extension (via polymorphism/interfaces) but closed for modification of existing source code.",
      "**L — Liskov Substitution Principle (LSP):** Derived classes must be completely substitutable for their base classes without altering program correctness.",
      "**I — Interface Segregation Principle (ISP):** Clients should not be forced to depend on interface methods they do not use (prefer small role-based interfaces over fat monolithic interfaces).",
      "**D — Dependency Inversion Principle (DIP):** High-level modules should not depend on low-level modules; both should depend on abstractions (interfaces).",
    ],
    example: {
      language: "JAVA",
      code: `// Dependency Inversion: Depend on abstraction (MessageSender), not concrete SMTP Client
interface MessageSender {
    void send(String message);
}

class EmailSender implements MessageSender {
    public void send(String message) { System.out.println("Email: " + message); }
}

class NotificationService {
    private final MessageSender sender; // Injected abstraction
    public NotificationService(MessageSender sender) {
        this.sender = sender;
    }
    public void notifyUser(String msg) { sender.send(msg); }
}`,
    },
    interviewTip:
      "Pick 2 principles to explain in depth with concrete examples (LSP and DIP are most commonly probed by interviewers). Name Spring Dependency Injection as a classic implementation of DIP.",
    commonTrap:
      "Memorizing the acronym without being able to give a real-world code example for LSP or DIP.",
    followUpQuestions: [
      "What is a violation of Liskov Substitution Principle?",
      "How does Dependency Injection relate to Dependency Inversion?",
      "What is the difference between DIP and IoC (Inversion of Control)?",
    ],
    relatedTopics: ["SOLID", "Design Principles", "Dependency Injection"],
    tags: ["OOP", "SOLID", "Architecture"],
  },
];
