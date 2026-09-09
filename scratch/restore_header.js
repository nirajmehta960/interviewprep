const fs = require('fs');

const header = `import type { Difficulty, Language } from "@/lib/types";

/**
 * Authored conceptual questions for the language topics.
 *
 * Distinct from \`problems.ts\`, which holds algorithmic write-ups keyed to the
 * LeetCode study plan. These are theory questions: there is no input/output to
 * trace, so the shape carries an interview-ready answer, the understanding
 * behind it, and one illustrative snippet rather than a reference solution.
 *
 * \`difficulty\` maps to the study vocabulary the browsing screens use:
 * EASY → Beginner, MEDIUM → Intermediate, HARD → Advanced.
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

/* ==========================================================================
   Java
   ========================================================================== */

`;

const currentContent = fs.readFileSync('src/lib/data/conceptual.ts', 'utf8');

// Prepend header if not already present
if (!currentContent.includes('export interface ConceptualQuestion')) {
  fs.writeFileSync('src/lib/data/conceptual.ts', header + currentContent);
  console.log('Header restored successfully!');
}
