import type { ConceptualQuestion } from "../conceptual";

export const behavioralQuestions: ConceptualQuestion[] = [
  {
    topicSlug: "behavioral",
    slug: "star-method-technical-conflict",
    title: "How do you structure Behavioral Interview answers using the STAR Method?",
    difficulty: "EASY",
    subtopic: "Behavioral Framework",
    synopsis: "Situation, Task, Action, Result framework for technical and team stories.",
    shortAnswer:
      "The STAR Method structures behavioral responses into 4 concise parts: Situation (set context in 2 sentences), Task (explain your specific responsibility), Action (describe the specific engineering steps YOU took), and Result (quantify the measurable business or technical outcome).",
    detailedExplanation: [
      "**Situation (15%).** Set concise context: project goals, team scale, or technical constraints. Avoid spending 3 minutes on background.",
      "**Task (15%).** State your personal ownership: what were YOU specifically assigned or compelled to solve?",
      "**Action (55% - Focus).** Detail your technical execution: architectural trade-offs evaluated, technical consensus built, debugging steps taken, or refactoring implemented.",
      "**Result (15%).** Quantify impact: 'reduced API latency by 45%', 'prevented $50k in infrastructure costs', 'delivered 2 weeks ahead of deadline'. Always include lessons learned.",
    ],
    example: {
      language: "JAVA",
      code: `// STAR Response Outline for Technical Conflict:
// Situation: Team split between REST vs gRPC for new microservice.
// Task: I was responsible for leading API architecture.
// Action: Built benchmarks comparing latency & payload size, presented data to team.
// Result: Team reached consensus on gRPC, reducing service-to-service latency by 65%.`,
    },
    interviewTip:
      "Focus 60% of your time on the Action section! Interviewers care less about what the company did, and most about what YOU specifically implemented, coded, or led.",
    commonTrap:
      "Using 'We' exclusively throughout the story without clarifying 'I'. Interviewers need to know YOUR individual contribution.",
    followUpQuestions: [
      "Tell me about a time you made a technical mistake and how you handled it.",
      "How do you handle disagreement with a Senior Engineer or Product Manager?",
      "Tell me about a project that failed or went over schedule.",
    ],
    relatedTopics: ["Behavioral", "Interviewing", "STAR Method"],
    tags: ["Behavioral", "Soft Skills"],
  },
];
