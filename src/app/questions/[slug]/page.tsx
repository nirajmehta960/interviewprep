import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, PlayCircle } from "lucide-react";
import { Breadcrumbs, DocShell } from "@/components/layout/DocShell";
import { Eyebrow } from "@/components/ui/Section";
import { Chip, DifficultyTag } from "@/components/ui/Tag";
import { Inline, stripInline } from "@/components/ui/Prose";
import { QuestionArticle } from "@/components/questions/QuestionArticle";
import { ReadingTOC, type TocEntry } from "@/components/questions/ReadingTOC";
import {
  findBySlug,
  findRelated,
  getNeighbours,
} from "@/server/repositories/question.repository";
import { questionHref } from "@/lib/routes";
import { recipeForProblem } from "@/lib/data/traces";
import { DIFFICULTY_STUDY_LABEL } from "@/lib/types";

export const dynamic = "force-dynamic";

interface QuestionParams {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: QuestionParams): Promise<Metadata> {
  const { slug } = await params;
  const question = await findBySlug(slug);
  if (!question) return { title: "Question not found — InterviewPrep" };

  return {
    title: `${question.title} — InterviewPrep`,
    description: stripInline(question.shortAnswer ?? question.synopsis),
  };
}

/**
 * Detail page for a coding problem.
 *
 * Only algorithmic questions get their own page — they need a solution listing,
 * complexity, and eventually the trace workbench. Theory questions are read
 * inline on their topic page, so this route redirects them to that anchor
 * rather than 404-ing: the URL shape predates the reading view and is still
 * what older links and bookmarks point at.
 */
export default async function QuestionPage({ params }: QuestionParams) {
  const { slug } = await params;

  const question = await findBySlug(slug);
  if (!question) notFound();

  if (question.type !== "ALGORITHMIC") {
    redirect(
      questionHref({
        slug: question.slug,
        type: question.type,
        difficulty: question.difficulty,
        roleSlug: question.context.role.slug,
        topicSlug: question.context.topic.slug,
      }),
    );
  }

  const [neighbours, related] = await Promise.all([getNeighbours(slug), findRelated(slug, 4)]);

  const { context } = question;
  const topicPath = `/roles/${context.role.slug}/${context.topic.slug}`;

  // A trace exists only where a generator is registered for the slug, so the
  // call to action appears exactly when it leads somewhere useful.
  const hasTrace = Boolean(recipeForProblem(question.slug));

  // Built from what this question actually has, so a sparsely written entry
  // does not advertise empty sections.
  const toc: TocEntry[] = [
    hasTrace ? { id: "trace", label: "Visual trace" } : null,
    question.shortAnswer ? { id: "short-answer", label: "Short answer" } : null,
    question.detailedExplanation.length > 0
      ? { id: "explanation", label: "Detailed explanation" }
      : null,
    question.approach.length > 0 ? { id: "approach", label: "Approach" } : null,
    question.examples.length > 0 ? { id: "examples", label: "Example" } : null,
    question.solutions.length > 0 ? { id: "code", label: "Code" } : null,
    question.timeComplexity || question.spaceComplexity
      ? { id: "complexity", label: "Complexity" }
      : null,
    question.interviewTip ? { id: "interview-tip", label: "Interview tip" } : null,
    question.commonTrap ? { id: "common-trap", label: "Common trap" } : null,
    question.followUpQuestions.length > 0
      ? { id: "follow-ups", label: "Follow-up questions" }
      : null,
    related.length > 0 ? { id: "related", label: "Related questions" } : null,
  ].filter((entry): entry is TocEntry => entry !== null);

  return (
    <DocShell roleSlug={context.role.slug} activeTopicSlug={context.topic.slug}>
      <Breadcrumbs
        crumbs={[
          { label: context.role.name, href: `/roles/${context.role.slug}` },
          { label: context.topic.name, href: topicPath },
          ...(question.subtopic
            ? [
                {
                  label: question.subtopic,
                  href: `${topicPath}?sub=${encodeURIComponent(question.subtopic)}`,
                },
              ]
            : []),
          { label: DIFFICULTY_STUDY_LABEL[question.difficulty] },
        ]}
      />

      <div className="mx-auto flex w-full min-w-0 max-w-[1180px] gap-10 px-4 py-10 sm:px-8">
        {/* Capped near 74ch — long technical prose past that costs the reader
            their place on every line return. */}
        <article className="w-full min-w-0 max-w-[74ch] flex-1">
          <header>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <DifficultyTag difficulty={question.difficulty} />
              <span className="text-ink-4" aria-hidden>
                ·
              </span>
              <Eyebrow>{DIFFICULTY_STUDY_LABEL[question.difficulty]}</Eyebrow>
              {question.number ? (
                <>
                  <span className="text-ink-4" aria-hidden>
                    ·
                  </span>
                  <Eyebrow>#{question.number}</Eyebrow>
                </>
              ) : null}
            </div>

            <h1 className="mt-4 text-[34px] leading-[1.14]">{question.title}</h1>

            {question.synopsis ? (
              <p className="mt-4 text-[16px] leading-[1.7] text-ink-2">
                <Inline text={question.synopsis} />
              </p>
            ) : null}

            {question.tags.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-1.5">
                {question.tags.map((tag) => (
                  <Chip key={tag}>{tag}</Chip>
                ))}
              </div>
            ) : null}
          </header>

          {hasTrace ? (
            <section id="trace" className="mt-8 scroll-mt-24">
              <Link
                href={`/questions/${question.slug}/trace`}
                className="group flex items-center gap-4 rounded-card border border-brand/30 bg-tint-brand px-5 py-4 transition-colors hover:border-brand"
              >
                <PlayCircle
                  className="size-7 shrink-0 text-brand"
                  strokeWidth={1.6}
                  aria-hidden
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-[15.5px] font-semibold text-ink">
                    Step through this algorithm
                  </span>
                  <span className="mt-0.5 block text-[13.5px] leading-relaxed text-ink-2">
                    Watch the code, variables and data structure advance together — on your own
                    input, not a recording.
                  </span>
                </span>
                <span
                  aria-hidden
                  className="shrink-0 text-brand transition-transform duration-150 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
            </section>
          ) : null}

          <QuestionArticle question={question} variant="page" />

          {related.length > 0 ? (
            <section id="related" className="mt-11 scroll-mt-24">
              <Eyebrow className="mb-4 block">Related questions</Eyebrow>
              <ul className="border-t border-rule-soft">
                {related.map((item) => (
                  <li key={item.slug} className="border-b border-rule-soft">
                    <Link
                      href={`/questions/${item.slug}`}
                      className="group flex items-baseline justify-between gap-4 py-3"
                    >
                      <span className="text-[14.5px] text-ink-2 transition-colors group-hover:text-brand">
                        {item.title}
                      </span>
                      <span className="shrink-0">
                        <DifficultyTag difficulty={item.difficulty} className="text-[11.5px]" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {neighbours.previous || neighbours.next ? (
            <nav
              aria-label="Question navigation"
              className="mt-12 grid gap-px border border-rule bg-rule sm:grid-cols-2"
            >
              {neighbours.previous ? (
                <Link
                  href={`/questions/${neighbours.previous.slug}`}
                  className="group flex items-start gap-3 bg-card px-4 py-4 transition-colors hover:bg-paper-sunken"
                >
                  <ArrowLeft
                    className="mt-[3px] size-3.5 shrink-0 text-ink-4 transition-colors group-hover:text-brand"
                    strokeWidth={1.7}
                  />
                  <span className="min-w-0">
                    <Eyebrow className="mb-1 block">Previous</Eyebrow>
                    <span className="block text-[13.5px] leading-snug text-ink-2 transition-colors group-hover:text-brand">
                      {neighbours.previous.title}
                    </span>
                  </span>
                </Link>
              ) : (
                <span className="hidden bg-card sm:block" />
              )}

              {neighbours.next ? (
                <Link
                  href={`/questions/${neighbours.next.slug}`}
                  className="group flex items-start justify-end gap-3 bg-card px-4 py-4 text-right transition-colors hover:bg-paper-sunken"
                >
                  <span className="min-w-0">
                    <Eyebrow className="mb-1 block">Next</Eyebrow>
                    <span className="block text-[13.5px] leading-snug text-ink-2 transition-colors group-hover:text-brand">
                      {neighbours.next.title}
                    </span>
                  </span>
                  <ArrowRight
                    className="mt-[3px] size-3.5 shrink-0 text-ink-4 transition-colors group-hover:text-brand"
                    strokeWidth={1.7}
                  />
                </Link>
              ) : null}
            </nav>
          ) : null}
        </article>

        <aside className="hidden w-[196px] shrink-0 xl:block">
          <ReadingTOC entries={toc} />
        </aside>
      </div>
    </DocShell>
  );
}
