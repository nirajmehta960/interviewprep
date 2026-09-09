import { Breadcrumbs } from "@/components/layout/DocShell";
import { RevisionSession, type RevisionCard } from "@/components/revision/RevisionSession";
import { findBySlug, findQuestions } from "@/server/repositories/question.repository";
import { defaultTraceFor } from "@/lib/data/traces";

export const dynamic = "force-dynamic";

/**
 * Active-recall session (Phase 5, F5).
 *
 * Until review schedules are recorded, the queue is every written-up question.
 * The SM-2 projections on the rating buttons are real; only the persistence is
 * still to come.
 */
export default async function ReviewPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const requested = typeof params.question === "string" ? params.question : undefined;

  // A recall session reveals the reference solution, so only written-up
  // questions can be reviewed.
  const summaries = requested ? [] : await findQuestions({ writtenOnly: true });
  const slugs = requested ? [requested] : summaries.filter((q) => q.written).map((q) => q.slug);

  const details = await Promise.all(slugs.map((slug) => findBySlug(slug)));

  const cards: RevisionCard[] = details
    .filter((detail): detail is NonNullable<typeof detail> => Boolean(detail?.written))
    .map((detail) => {
      const trace = defaultTraceFor(detail.slug);
      return {
        slug: detail.slug,
        title: detail.title,
        difficulty: detail.difficulty,
        categoryName: detail.subtopic ?? detail.context.topic.name,
        patternNames: detail.tags.slice(0, 3),
        timeComplexity: detail.timeComplexity ?? "—",
        spaceComplexity: detail.spaceComplexity ?? "—",
        keyTakeaway: detail.shortAnswer ?? "",
        criticalTrap: detail.commonTrap ?? "",
        revisionSummary: detail.revisionSummary,
        solutions: detail.solutions,
        reviewCount: 0,
        intervalDays: 1,
        traceSteps: trace?.steps.length ?? null,
      };
    });

  return (
    <>
      <Breadcrumbs
        crumbs={[{ label: "InterviewPrep", href: "/" }, { label: "Revision" }]}
        meta={[`${cards.length} in session`, "Active recall"]}
      />
      <RevisionSession cards={cards} exitHref="/" />
    </>
  );
}
