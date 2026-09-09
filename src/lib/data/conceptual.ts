import type { Difficulty, Language } from "@/lib/types";
import { allModularQuestions } from "./topics";

/**
 * Authored conceptual questions interface and exports.
 *
 * All topic questions live in dedicated files under `src/lib/data/topics/`
 * (e.g. `java.ts`, `python.ts`, `data_analyst.ts`, `ai_engineer.ts`, etc.)
 * and are aggregated via `allModularQuestions`.
 */
export interface ConceptualQuestion {
  /** Topic slug this belongs to, e.g. "java" or "python". */
  topicSlug: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  /** Grouping inside the topic — becomes the subtopic filter. */
  subtopic: string;
  synopsis: string;
  /** The thirty-second spoken answer. */
  shortAnswer: string;
  detailedExplanation: string[];
  /** One short listing that makes the idea concrete. Optional. */
  example?: { language: Language; code: string };
  interviewTip: string;
  commonTrap?: string;
  followUpQuestions: string[];
  relatedTopics: string[];
  tags: string[];
}

/** Every authored conceptual question across all roles and topics. */
export const conceptualQuestions: ConceptualQuestion[] = allModularQuestions;
