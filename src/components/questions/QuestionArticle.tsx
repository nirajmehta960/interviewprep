import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow, Panel, SectionKicker } from "@/components/ui/Section";
import { Chip } from "@/components/ui/Tag";
import { Inline, NumberedList, Paragraphs } from "@/components/ui/Prose";
import { SolutionViewer } from "@/components/code/SolutionViewer";
import type { QuestionDetail } from "@/server/repositories/question.repository";

/**
 * The body of a written-up question: answer, explanation, example, tip.
 *
 * Two variants, one source of truth:
 *
 * - `page` — the question owns the whole screen (algorithmic problems). Sections
 *   carry anchor ids and numbered kickers so the contents rail can target them.
 * - `inline` — the question is one entry in a topic read straight down the page
 *   (theory). Section ids are dropped, because a dozen questions on one page
 *   would otherwise all claim `#short-answer`, and the numbered kickers become
 *   plain labels so the running numbers belong to the questions, not their parts.
 */
export function QuestionArticle({
  question,
  variant = "page",
}: {
  question: QuestionDetail;
  variant?: "page" | "inline";
}) {
  const inline = variant === "inline";

  const hasExplanation = question.detailedExplanation.length > 0;
  const hasApproach = question.approach.length > 0;
  const hasExamples = question.examples.length > 0;
  const hasComplexity = Boolean(question.timeComplexity || question.spaceComplexity);
  const isAlgorithmic = question.type === "ALGORITHMIC";

  const section = (id: string, index: number, kicker: string, children: ReactNode) => (
    <Section id={inline ? undefined : id} index={index} kicker={kicker} inline={inline}>
      {children}
    </Section>
  );

  return (
    <>
      {!question.written && !question.shortAnswer && !hasExplanation ? (
        <div
          className={cn(
            "border border-dashed border-rule bg-paper-sunken/40 px-6 py-8",
            inline ? "mt-4" : "mt-8",
          )}
        >
          <Eyebrow>Outline only</Eyebrow>
          <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-ink-2">
            This question is indexed but not yet written up.
          </p>
        </div>
      ) : null}

      {question.shortAnswer
        ? section(
            "short-answer",
            1,
            "Short answer",
            /* The interview-ready version: tinted so it stays findable when
               scrubbing back through a long page under time pressure. */
            <Panel tone="brand" className="p-5">
              <p className="text-[15.5px] leading-[1.7] text-ink">
                <Inline text={question.shortAnswer} />
              </p>
            </Panel>,
          )
        : null}

      {hasExplanation
        ? section(
            "explanation",
            2,
            "Detailed explanation",
            <Paragraphs items={question.detailedExplanation} size="lead" />,
          )
        : null}

      {hasApproach
        ? section("approach", 3, "Approach", <NumberedList items={question.approach} />)
        : null}

      {hasExamples
        ? section(
            "examples",
            4,
            "Example",
            <>
              <div className="space-y-4">
                {question.examples.map((example, index) => (
                  <Panel key={index} className="p-0">
                    {example.label ? (
                      <div className="border-b border-rule px-4 py-2">
                        <Eyebrow>{example.label}</Eyebrow>
                      </div>
                    ) : null}
                    <dl className="divide-y divide-rule-soft">
                      <ExampleRow term="Input" value={example.input} />
                      <ExampleRow term="Output" value={example.output} />
                      {example.explanation ? (
                        <ExampleRow term="Why" value={example.explanation} mono={false} />
                      ) : null}
                    </dl>
                  </Panel>
                ))}
              </div>

              {question.constraints.length > 0 ? (
                <div className="mt-5">
                  <Eyebrow className="mb-2 block">Constraints</Eyebrow>
                  <ul className="space-y-1.5">
                    {question.constraints.map((constraint) => (
                      <li key={constraint} className="flex gap-2.5 text-[13.5px] text-ink-2">
                        <span className="text-ink-4" aria-hidden>
                          —
                        </span>
                        <span>
                          <Inline text={constraint} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>,
          )
        : null}

      {question.solutions.length > 0
        ? section(
            "code",
            5,
            /* For a theory question the listing *is* the worked example; for a
               problem it is the reference solution. */
            isAlgorithmic ? "Code" : "Example",
            <SolutionViewer solutions={question.solutions} />,
          )
        : null}

      {hasComplexity
        ? section(
            "complexity",
            6,
            "Complexity",
            <dl className="grid gap-px border border-rule bg-rule sm:grid-cols-2">
              {question.timeComplexity ? (
                <div className="bg-card px-4 py-3.5">
                  <dt className="eyebrow mb-1.5">Time</dt>
                  <dd className="font-mono text-[15px] text-ink">{question.timeComplexity}</dd>
                </div>
              ) : null}
              {question.spaceComplexity ? (
                <div className="bg-card px-4 py-3.5">
                  <dt className="eyebrow mb-1.5">Space</dt>
                  <dd className="font-mono text-[15px] text-ink">{question.spaceComplexity}</dd>
                </div>
              ) : null}
            </dl>,
          )
        : null}

      {question.interviewTip
        ? section(
            "interview-tip",
            7,
            "Interview tip",
            <Panel tone="warn" className="p-5">
              <p className="mb-2 font-display text-[17px] leading-snug text-ink">
                What the interviewer is actually checking
              </p>
              <p className="text-[14.5px] leading-[1.7] text-ink-2">
                <Inline text={question.interviewTip} />
              </p>
            </Panel>,
          )
        : null}

      {question.commonTrap
        ? section(
            "common-trap",
            8,
            "Common trap",
            <Panel tone="danger" className="p-5">
              <p className="text-[14.5px] leading-[1.7] text-ink-2">
                <Inline text={question.commonTrap} />
              </p>
            </Panel>,
          )
        : null}

      {question.followUpQuestions.length > 0
        ? section(
            "follow-ups",
            9,
            "Common follow-up questions",
            <ul className="border-t border-rule-soft">
              {question.followUpQuestions.map((followUp) => (
                <li
                  key={followUp}
                  className="flex gap-3 border-b border-rule-soft py-3 text-[14.5px] leading-[1.6] text-ink-2"
                >
                  <span className="text-ink-4" aria-hidden>
                    ?
                  </span>
                  <span>
                    <Inline text={followUp} />
                  </span>
                </li>
              ))}
            </ul>,
          )
        : null}

      {question.relatedTopics.length > 0 ? (
        <div className={cn("border-t border-rule pt-5", inline ? "mt-8" : "mt-10")}>
          <Eyebrow className="mb-2.5 block">Related topics</Eyebrow>
          <div className="flex flex-wrap gap-1.5">
            {question.relatedTopics.map((topic) => (
              <Chip key={topic}>{topic}</Chip>
            ))}
          </div>
        </div>
      ) : null}

      {question.leetcodeUrl ? (
        <p className="mt-6 text-[13px] text-ink-3">
          <a
            href={question.leetcodeUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="link-quiet text-brand"
          >
            Open the original problem
          </a>
        </p>
      ) : null}
    </>
  );
}

function Section({
  id,
  index,
  kicker,
  inline,
  children,
}: {
  id?: string;
  index: number;
  kicker: string;
  inline: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn(inline ? "mt-6" : "mt-11 scroll-mt-24")}>
      {inline ? (
        <Eyebrow className="mb-2.5 block">{kicker}</Eyebrow>
      ) : (
        <SectionKicker index={index} label={kicker} className="mb-4" />
      )}
      {children}
    </section>
  );
}

function ExampleRow({
  term,
  value,
  mono = true,
}: {
  term: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex gap-4 px-4 py-2.5">
      <dt className="eyebrow w-14 shrink-0 pt-[3px]">{term}</dt>
      <dd
        className={
          mono
            ? "min-w-0 flex-1 font-mono text-[12.5px] leading-relaxed break-words text-ink"
            : "min-w-0 flex-1 text-[13.5px] leading-relaxed text-ink-2"
        }
      >
        {mono ? value : <Inline text={value} />}
      </dd>
    </div>
  );
}
