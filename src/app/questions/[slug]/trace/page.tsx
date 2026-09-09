import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { TraceWorkbench } from "@/components/trace/TraceWorkbench";
import { findBySlug } from "@/server/repositories/question.repository";
import { questionHref } from "@/lib/routes";

export const dynamic = "force-dynamic";

interface TraceParams {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TraceParams): Promise<Metadata> {
  const { slug } = await params;
  const question = await findBySlug(slug);
  if (!question) return { title: "Question not found — InterviewPrep" };

  return {
    title: `Trace: ${question.title} — InterviewPrep`,
    description: `Step through ${question.title} line by line, with the variable table and visual structures in sync.`,
  };
}

/**
 * Visual trace workbench for one coding problem.
 *
 * Its own route rather than a section on the question page: the workbench wants
 * the full viewport — code pane, canvas, variable table and playback controls
 * side by side — and squeezing that into a 74ch reading column would make all
 * four unusable.
 *
 * Whether a trace exists is decided inside the workbench, which already renders
 * an honest "no trace authored yet" state. That keeps this route reachable for
 * every problem, so the link never dead-ends differently depending on content.
 */
export default async function QuestionTracePage({ params }: TraceParams) {
  const { slug } = await params;

  const question = await findBySlug(slug);
  if (!question) notFound();

  // Theory questions have no execution to step through, so send them back to
  // where they are actually read.
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

  return (
    <TraceWorkbench
      slug={question.slug}
      title={question.title}
      difficulty={question.difficulty}
      patternNames={question.subtopic ? [question.subtopic] : question.tags.slice(0, 2)}
      leetcodeUrl={question.leetcodeUrl}
    />
  );
}
