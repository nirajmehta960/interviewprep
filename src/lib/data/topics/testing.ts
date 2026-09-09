import type { ConceptualQuestion } from "../conceptual";

export const testingQuestions: ConceptualQuestion[] = [
  {
    topicSlug: "testing",
    slug: "testing-pyramid-mocking-vs-stubbing",
    title: "What is the Testing Pyramid and what is the difference between Mocking and Stubbing?",
    difficulty: "EASY",
    subtopic: "Testing Strategies",
    synopsis: "Unit ➔ Integration ➔ E2E test distribution and dummy state vs behavior verification.",
    shortAnswer:
      "The Testing Pyramid recommends having a large base of fast, isolated Unit Tests, a moderate layer of Integration Tests, and a minimal top layer of End-to-End (E2E) Tests. A Stub provides predefined canned data responses to calls. A Mock verifies behavior: it records calls and asserts that expected methods were invoked with specific arguments.",
    detailedExplanation: [
      "**Testing Pyramid Tiers:**",
      "- **Unit Tests (70%).** Tests individual functions/classes in isolation. Extremely fast (milliseconds).",
      "- **Integration Tests (20%).** Tests interactions between modules, DB repositories, and external APIs.",
      "- **E2E Tests (10%).** Tests full application flows in a real browser/environment. Slow and fragile.",
      "**Stubs vs Mocks:**",
      "- **Stub.** State verification. Returns fake canned answers (when(repo.findById('1')).thenReturn(user)). Does not care how many times it was called.",
      "- **Mock.** Behavior verification. Asserts call counts and arguments (verify(emailService, times(1)).sendEmail(any())).",
    ],
    example: {
      language: "JAVA",
      code: `// Mockito Example (Mocking & Stubbing)
UserRepository mockRepo = mock(UserRepository.class);

// Stubbing: Return canned fake user when called
when(mockRepo.findById("42")).thenReturn(Optional.of(new User("Alice")));

// Behavior Verification (Mocking): Ensure save() was called exactly 1 time
userService.updateName("42", "Alice Smith");
verify(mockRepo, times(1)).save(any(User.class));`,
    },
    interviewTip:
      "Differentiate between Mocks, Stubs, and Fakes: Fakes have working implementations (like an in-memory H2 database); Stubs return hardcoded data; Mocks verify method invocations.",
    commonTrap:
      "Over-mocking everything in integration tests, resulting in tests passing while the real system fails in production.",
    followUpQuestions: [
      "What is Test-Driven Development (TDD) red-green-refactor cycle?",
      "Difference between Mocks, Stubs, and Fakes?",
      "Why is code coverage alone a misleading metric?",
    ],
    relatedTopics: ["Testing", "Unit Testing", "Mockito", "TDD"],
    tags: ["Testing", "Quality"],
  },
];
