import { PrismaClient, type Prisma } from "@prisma/client";
import { catalog, topInterview150 } from "../src/lib/data/catalog";
import { authoredProblems } from "../src/lib/data/problems";
import { conceptualQuestions } from "../src/lib/data/conceptual";
import { categories as dsaGroups, tagsFor } from "../src/lib/data/taxonomy";
import { DSA_TOPIC_SLUG, roles } from "../src/lib/data/hierarchy";

/**
 * Seeds the InterviewPrep hierarchy.
 *
 * Role → Category → Topic is created for every role; questions are seeded for
 * the DSA topic only (the LeetCode Top Interview 150), with the study plan's
 * 23 groups becoming subtopics. Other topics are seeded empty and filled in
 * over time.
 *
 * Idempotent — re-running updates rows in place rather than duplicating them.
 */

const prisma = new PrismaClient();

const writeUps = new Map(authoredProblems.map((entry) => [entry.slug, entry]));
const groupName = new Map(dsaGroups.map((group) => [group.slug, group.name]));

function assertIntegrity() {
  if (topInterview150.length !== 150) {
    throw new Error(`Expected 150 study plan questions, found ${topInterview150.length}.`);
  }

  const slugs = new Set<string>();
  for (const entry of catalog) {
    if (slugs.has(entry.slug)) throw new Error(`Duplicate slug in catalog: ${entry.slug}`);
    slugs.add(entry.slug);
    if (!groupName.has(entry.categorySlug)) {
      throw new Error(`${entry.slug} references unknown DSA group "${entry.categorySlug}".`);
    }
  }

  for (const slug of writeUps.keys()) {
    if (!slugs.has(slug)) throw new Error(`Write-up "${slug}" has no catalog entry.`);
  }

  const dsaTopic = roles
    .flatMap((role) => role.categories)
    .flatMap((category) => category.topics)
    .find((topic) => topic.slug === DSA_TOPIC_SLUG);
  if (!dsaTopic) throw new Error(`Hierarchy is missing the "${DSA_TOPIC_SLUG}" topic.`);

  // Conceptual questions share the globally unique `slug` column with the
  // catalog, so a collision would silently overwrite a problem write-up.
  const knownTopics = new Set(
    roles
      .flatMap((role) => role.categories)
      .flatMap((category) => category.topics)
      .map((topic) => topic.slug),
  );

  for (const entry of conceptualQuestions) {
    if (slugs.has(entry.slug)) {
      throw new Error(`Conceptual question "${entry.slug}" collides with a catalog slug.`);
    }
    slugs.add(entry.slug);

    if (!knownTopics.has(entry.topicSlug)) {
      throw new Error(`Conceptual question "${entry.slug}" targets unknown topic "${entry.topicSlug}".`);
    }
    if (!entry.shortAnswer || !entry.interviewTip) {
      throw new Error(`Conceptual question "${entry.slug}" is missing its answer or tip.`);
    }
  }
}

async function main() {
  console.log("Validating content…");
  assertIntegrity();

  console.log("Seeding roles, categories and topics…");
  const topicIds = new Map<string, string>();
  let categoryCount = 0;
  let topicCount = 0;

  for (const [roleIndex, role] of roles.entries()) {
    const roleRow = await prisma.role.upsert({
      where: { slug: role.slug },
      update: {
        name: role.name,
        description: role.description,
        highlights: role.highlights,
        order: roleIndex + 1,
      },
      create: {
        slug: role.slug,
        name: role.name,
        description: role.description,
        highlights: role.highlights,
        order: roleIndex + 1,
      },
    });

    for (const [categoryIndex, category] of role.categories.entries()) {
      const categoryRow = await prisma.category.upsert({
        where: { roleId_slug: { roleId: roleRow.id, slug: category.slug } },
        update: { name: category.name, order: categoryIndex + 1 },
        create: {
          roleId: roleRow.id,
          slug: category.slug,
          name: category.name,
          order: categoryIndex + 1,
        },
      });
      categoryCount += 1;

      for (const [topicIndex, topic] of category.topics.entries()) {
        const topicRow = await prisma.topic.upsert({
          where: { categoryId_slug: { categoryId: categoryRow.id, slug: topic.slug } },
          update: {
            name: topic.name,
            monogram: topic.monogram,
            blurb: topic.blurb,
            order: topicIndex + 1,
          },
          create: {
            categoryId: categoryRow.id,
            slug: topic.slug,
            name: topic.name,
            monogram: topic.monogram,
            blurb: topic.blurb,
            order: topicIndex + 1,
          },
        });
        topicIds.set(`${role.slug}/${topic.slug}`, topicRow.id);
        topicCount += 1;
      }
    }
  }

  const dsaTopicId = topicIds.get(`software-engineer/${DSA_TOPIC_SLUG}`);
  if (!dsaTopicId) throw new Error("DSA topic was not created.");

  console.log("Seeding DSA questions…");
  let withWriteUp = 0;

  for (const entry of catalog) {
    const writeUp = writeUps.get(entry.slug);
    if (writeUp) withWriteUp += 1;

    const shared = {
      number: entry.number,
      title: entry.title,
      difficulty: entry.difficulty,
      // Everything in the study plan is a coding problem.
      type: "ALGORITHMIC" as const,
      collection: entry.collection,
      order: entry.order,
      topicId: dsaTopicId,
      // The 23 study plan groups become subtopics of DSA.
      subtopic: groupName.get(entry.categorySlug) ?? null,
      synopsis: entry.synopsis,
      leetcodeUrl: entry.leetcodeUrl,
      tags: tagsFor(entry.slug, entry.categorySlug, entry.patternSlugs),
      languages: entry.languages,

      shortAnswer: writeUp?.keyTakeaway ?? null,
      detailedExplanation: writeUp?.description ?? [],
      examples: (writeUp?.examples ?? []) as unknown as Prisma.InputJsonValue,
      constraints: writeUp?.constraints ?? [],
      approach: writeUp?.approach ?? [],
      timeComplexity: writeUp?.timeComplexity ?? null,
      spaceComplexity: writeUp?.spaceComplexity ?? null,
      // The authored "intuition" is what the interviewer is really testing.
      interviewTip: writeUp?.intuition ?? null,
      commonTrap: writeUp?.criticalTrap ?? null,
      followUpQuestions: [],
      relatedTopics: [],
      revisionSummary: writeUp?.revisionSummary ?? [],
    };

    const question = await prisma.question.upsert({
      where: { slug: entry.slug },
      update: shared,
      create: { slug: entry.slug, ...shared },
    });

    for (const solution of writeUp?.solutions ?? []) {
      await prisma.solution.upsert({
        where: { questionId_language: { questionId: question.id, language: solution.language } },
        update: { code: solution.code },
        create: { questionId: question.id, language: solution.language, code: solution.code },
      });
    }
  }

  console.log("Seeding conceptual questions…");
  let conceptualCount = 0;

  // Order restarts per topic so each topic's list is numbered from 1, and
  // prev/next inside a topic follows the authored sequence.
  const orderByTopic = new Map<string, number>();

  for (const entry of conceptualQuestions) {
    let topicId: string | undefined;
    for (const [key, id] of topicIds.entries()) {
      if (key.endsWith(`/${entry.topicSlug}`)) {
        topicId = id;
        break;
      }
    }

    if (!topicId) {
      throw new Error(`Conceptual question "${entry.slug}" references unknown topic "${entry.topicSlug}".`);
    }

    const order = (orderByTopic.get(entry.topicSlug) ?? 0) + 1;
    orderByTopic.set(entry.topicSlug, order);

    const shared = {
      number: null,
      title: entry.title,
      difficulty: entry.difficulty,
      // Theory questions have no input to trace, so no trace workbench.
      type: "CONCEPTUAL" as const,
      collection: "CORE" as const,
      order,
      topicId,
      subtopic: entry.subtopic,
      synopsis: entry.synopsis,
      leetcodeUrl: null,
      tags: entry.tags,
      languages: entry.example ? [entry.example.language] : [],

      shortAnswer: entry.shortAnswer,
      detailedExplanation: entry.detailedExplanation,
      examples: [] as unknown as Prisma.InputJsonValue,
      constraints: [],
      approach: [],
      timeComplexity: null,
      spaceComplexity: null,
      interviewTip: entry.interviewTip,
      commonTrap: entry.commonTrap ?? null,
      followUpQuestions: entry.followUpQuestions,
      relatedTopics: entry.relatedTopics,
      revisionSummary: [],
    };

    const question = await prisma.question.upsert({
      where: { slug: entry.slug },
      update: shared,
      create: { slug: entry.slug, ...shared },
    });
    conceptualCount += 1;

    // The illustrative snippet is stored as a solution so the reading view can
    // reuse the existing language-toggling code viewer.
    if (entry.example) {
      await prisma.solution.upsert({
        where: {
          questionId_language: { questionId: question.id, language: entry.example.language },
        },
        update: { code: entry.example.code },
        create: {
          questionId: question.id,
          language: entry.example.language,
          code: entry.example.code,
        },
      });
    }
  }

  const [roleTotal, questionTotal, solutionTotal] = await Promise.all([
    prisma.role.count(),
    prisma.question.count(),
    prisma.solution.count(),
  ]);

  const subtopics = await prisma.question.groupBy({
    by: ["subtopic"],
    _count: { _all: true },
    orderBy: { subtopic: "asc" },
  });

  console.log("\nSeed complete:");
  console.log(`  ${roleTotal} roles · ${categoryCount} categories · ${topicCount} topics`);
  console.log(`  ${questionTotal} questions (${topInterview150.length} in Top Interview 150)`);
  console.log(`  ${withWriteUp} with write-ups, ${questionTotal - withWriteUp} catalog-only`);
  console.log(`  ${conceptualCount} conceptual questions (Java, Python)`);
  console.log(`  ${solutionTotal} reference solutions`);
  console.log(`  ${subtopics.length} DSA subtopics`);
}

main()
  .catch((error) => {
    console.error("\nSeed failed:", error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
