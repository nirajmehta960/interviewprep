"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { Eyebrow, Rule } from "@/components/ui/Section";
import { Button } from "@/components/ui/Controls";
import { Chip, DifficultyTag } from "@/components/ui/Tag";
import { Inline } from "@/components/ui/Prose";
import { SolutionViewer } from "@/components/code/SolutionViewer";
import {
  DEFAULT_EASE_FACTOR,
  formatInterval,
  projectIntervals,
  type RecallQuality,
} from "@/lib/sm2";
import { DIFFICULTY_LABEL, type Difficulty, type Solution } from "@/lib/types";

export interface RevisionCard {
  slug: string;
  title: string;
  difficulty: Difficulty;
  categoryName: string;
  patternNames: string[];
  timeComplexity: string;
  spaceComplexity: string;
  keyTakeaway: string;
  criticalTrap: string;
  revisionSummary: string[];
  solutions: Solution[];
  reviewCount: number;
  intervalDays: number;
  traceSteps: number | null;
}

/** The five retrieval prompts from Phase 5, F5 step 1. */
const PROMPTS = [
  { key: "pattern", question: "What is the pattern?" },
  { key: "idea", question: "What is the key idea?" },
  { key: "complexity", question: "What is the time complexity?" },
  { key: "mistake", question: "What mistake should I avoid?" },
  { key: "explain", question: "Can I explain the solution?" },
] as const;

const TONE_TEXT = { danger: "text-danger", warn: "text-warn", brand: "text-brand" } as const;
const TONE_BAR = { danger: "bg-danger", warn: "bg-warn", brand: "bg-brand" } as const;

export function RevisionSession({ cards, exitHref }: { cards: RevisionCard[]; exitHref: string }) {
  const [position, setPosition] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState<{ slug: string; quality: RecallQuality; days: number }[]>(
    [],
  );

  const card = cards[position];

  // Every card starts a fresh recall attempt.
  useEffect(() => {
    setRevealed(false);
    setAnswers({});
  }, [position]);

  const projections = useMemo(
    () =>
      card
        ? projectIntervals({
            easeFactor: DEFAULT_EASE_FACTOR,
            reviewCount: card.reviewCount,
            intervalDays: card.intervalDays,
          })
        : [],
    [card],
  );

  if (cards.length === 0) {
    return (
      <div className="mx-auto max-w-[520px] px-8 py-24 text-center">
        <Eyebrow className="block">Review queue</Eyebrow>
        <h1 className="mt-3 text-[30px] leading-tight">Nothing is due right now.</h1>
        <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">
          The queue refills as intervals lapse. Rating a problem &ldquo;Forgot&rdquo; brings it back
          tomorrow; &ldquo;Very easy&rdquo; pushes it weeks out.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Link
            href="/problems"
            className="link-quiet font-mono text-[11px] tracking-[0.07em] text-brand uppercase"
          >
            Study something new
          </Link>
        </div>
      </div>
    );
  }

  /* Session summary once every card has been rated. */
  if (!card) {
    return (
      <div className="mx-auto max-w-[560px] px-8 py-20">
        <Eyebrow className="block">Session complete</Eyebrow>
        <h1 className="mt-3 text-[32px] leading-tight">
          {completed.length} {completed.length === 1 ? "problem" : "problems"} reviewed.
        </h1>
        <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">
          Each interval was recalculated from your rating and the problem&rsquo;s existing ease
          factor.
        </p>

        <ul className="mt-8 border-t border-rule">
          {completed.map((entry) => {
            const source = cards.find((item) => item.slug === entry.slug);
            const option = projectIntervals({
              easeFactor: DEFAULT_EASE_FACTOR,
              reviewCount: source?.reviewCount ?? 0,
              intervalDays: source?.intervalDays ?? 1,
            }).find((o) => o.quality === entry.quality);

            return (
              <li
                key={entry.slug}
                className="flex items-baseline justify-between gap-4 border-b border-rule-soft py-3.5"
              >
                <Link
                  href={`/questions/${entry.slug}`}
                  className="font-display text-[16px] text-ink hover:text-brand"
                >
                  {source?.title ?? entry.slug}
                </Link>
                <span className="flex items-baseline gap-3">
                  <span className={cn("text-[12.5px]", option ? TONE_TEXT[option.tone] : "")}>
                    {option?.label}
                  </span>
                  <span className="font-mono text-[11px] text-ink-3">
                    next in {formatInterval(entry.days)}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex gap-3">
          <Button variant="primary" size="md" onClick={() => setPosition(0)}>
            Run the queue again
          </Button>
          <Link
            href={exitHref}
            className="link-quiet self-center font-mono text-[11px] tracking-[0.07em] text-ink-2 uppercase"
          >
            Back to the desk
          </Link>
        </div>
      </div>
    );
  }

  const rate = (quality: RecallQuality, days: number) => {
    setCompleted((current) => [...current, { slug: card.slug, quality, days }]);
    setPosition((current) => current + 1);
  };

  return (
    <div className="mx-auto w-full max-w-[1120px] px-6 py-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="size-2 bg-brand" aria-hidden />
          <Eyebrow>DSA Notebook / Revision</Eyebrow>
        </div>
        <Link
          href={exitHref}
          className="link-quiet font-mono text-[11px] tracking-[0.07em] text-ink-2 uppercase"
        >
          Exit revision ↗
        </Link>
      </div>

      <div className="mt-5 border border-rule bg-card px-8 py-9 sm:px-12">
        {/* Card head ----------------------------------------------------- */}
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0">
            <Eyebrow className="block">Problem review</Eyebrow>
            <h1 className="mt-2.5 text-[34px] leading-tight">{card.title}</h1>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px]">
              <DifficultyTag difficulty={card.difficulty} />
              <span className="text-ink-4">·</span>
              <span className="text-ink-2">{card.categoryName}</span>
              {card.patternNames.map((name) => (
                <span key={name} className="flex items-center gap-2.5">
                  <span className="text-ink-4">/</span>
                  <span className="text-ink-2">{name}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="text-right">
            <Eyebrow className="block">Review position</Eyebrow>
            <p className="mt-1.5 font-display text-[26px] leading-none tabular-nums">
              <span className="text-brand">{String(position + 1).padStart(2, "0")}</span>
              <span className="text-ink-4"> / {String(cards.length).padStart(2, "0")}</span>
            </p>
          </div>
        </div>

        <Rule className="my-8" />

        {/* Retrieval ----------------------------------------------------- */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_212px]">
          <div className="min-w-0">
            <div className="mb-5 flex items-baseline justify-between gap-4">
              <Eyebrow>Answer from memory</Eyebrow>
              <Eyebrow>Five prompts</Eyebrow>
            </div>

            <ol className="space-y-6">
              {PROMPTS.map((prompt, index) => (
                <li key={prompt.key}>
                  <div className="flex items-baseline gap-2.5">
                    <span className="border border-brand/40 px-1.5 py-0.5 font-mono text-[10px] leading-none text-brand">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-[17px]">{prompt.question}</h2>
                  </div>
                  <textarea
                    value={answers[prompt.key] ?? ""}
                    onChange={(event) =>
                      setAnswers((current) => ({ ...current, [prompt.key]: event.target.value }))
                    }
                    rows={2}
                    placeholder="Write what you know…"
                    className="ruled mt-2.5 w-full resize-y border-b border-rule bg-transparent px-1 py-1 text-[14px] leading-8 text-ink outline-none placeholder:text-ink-4 focus:border-brand"
                  />
                </li>
              ))}
            </ol>
          </div>

          <aside className="space-y-5 lg:border-l lg:border-rule lg:pl-8">
            <div>
              <Eyebrow className="block pb-1.5">Recall first</Eyebrow>
              <p className="text-[12.5px] leading-relaxed text-ink-2">
                Write what you know before checking the reference. Short answers are enough.
              </p>
            </div>
            <div className="border-t border-rule pt-4">
              <Eyebrow className="block pb-1.5">No timer</Eyebrow>
              <p className="text-[13px] text-ink">Take the time you need.</p>
            </div>
            <div className="border-t border-rule pt-4">
              <Eyebrow className="block pb-1.5">Reference</Eyebrow>
              <p className="text-[12.5px] leading-relaxed text-ink-2">
                The solution stays hidden until you reveal it.
              </p>
            </div>
            {card.traceSteps ? (
              <div className="border-t border-rule pt-4">
                <Eyebrow className="block pb-1.5">Trace</Eyebrow>
                <Link
                  href={`/questions/${card.slug}/trace`}
                  className="link-quiet text-[12.5px] text-brand"
                >
                  {card.traceSteps} steps ↗
                </Link>
              </div>
            ) : null}
          </aside>
        </div>

        <Rule className="my-8" />

        {/* Reveal -------------------------------------------------------- */}
        {!revealed ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Button variant="primary" size="lg" onClick={() => setRevealed(true)}>
              Reveal answer
              <ArrowDown className="size-3.5" strokeWidth={2} />
            </Button>
            <p className="text-[12.5px] text-ink-3">Answer from memory, then compare.</p>
          </div>
        ) : (
          <div className="space-y-8">
            <section>
              <div className="mb-4 flex items-baseline justify-between gap-4">
                <h2 className="text-[22px]">30-second summary</h2>
                <Eyebrow>High yield</Eyebrow>
              </div>

              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_200px]">
                <ol className="border-t border-rule-soft">
                  {card.revisionSummary.map((line, index) => (
                    <li key={index} className="flex gap-3.5 border-b border-rule-soft py-3">
                      <span className="marker-num mt-[5px] w-5 shrink-0">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[14px] leading-relaxed text-ink-2">
                        <Inline text={line} />
                      </span>
                    </li>
                  ))}
                </ol>

                <div className="space-y-3">
                  <div className="border border-rule bg-paper-sunken px-3.5 py-3">
                    <Eyebrow className="block pb-2">Complexity</Eyebrow>
                    <dl className="space-y-1.5">
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-[12px] text-ink-3">Time</dt>
                        <dd className="font-mono text-[12px] text-ink">{card.timeComplexity}</dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-[12px] text-ink-3">Space</dt>
                        <dd className="font-mono text-[12px] text-ink">{card.spaceComplexity}</dd>
                      </div>
                    </dl>
                  </div>
                  <Chip tone="warn">{DIFFICULTY_LABEL[card.difficulty]}</Chip>
                </div>
              </div>
            </section>

            <section className="border border-danger/30 bg-tint-danger px-5 py-4">
              <Eyebrow className="block pb-1.5">Critical trap</Eyebrow>
              <p className="text-[13.5px] leading-relaxed text-ink-2">
                <Inline text={card.criticalTrap} />
              </p>
            </section>

            <section>
              <div className="mb-3 flex items-baseline justify-between gap-4">
                <h2 className="text-[22px]">Reference solution</h2>
                <Eyebrow>Java / Python</Eyebrow>
              </div>
              <SolutionViewer solutions={card.solutions} />
            </section>
          </div>
        )}

        <Rule className="my-8" />

        {/* Rating -------------------------------------------------------- */}
        <section>
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <Eyebrow className="block pb-1.5">Recall rating</Eyebrow>
              <h2 className="text-[22px]">How well did you remember?</h2>
            </div>
            <p className="text-[12.5px] text-ink-3">
              {revealed ? "Intervals come from SM-2." : "Reveal the answer before rating."}
            </p>
          </div>

          <div className="grid grid-cols-2 border-t border-l border-rule lg:grid-cols-4">
            {projections.map((option, index) => (
              <button
                key={option.quality}
                type="button"
                disabled={!revealed}
                onClick={() => rate(option.quality, option.intervalDays)}
                className={cn(
                  "group border-r border-b border-rule px-4 py-4 text-left transition-colors",
                  revealed ? "hover:bg-paper-sunken" : "cursor-not-allowed opacity-45",
                )}
              >
                <span className="marker-num block">{String(index + 1).padStart(2, "0")}</span>
                <span className="mt-1.5 block text-[14px] text-ink">{option.label}</span>
                <span className={cn("mt-3 block h-[3px] w-10", TONE_BAR[option.tone])} />
                <span className="mt-2.5 block font-mono text-[10.5px] tracking-[0.06em] text-ink-3 uppercase">
                  Next in {formatInterval(option.intervalDays)}
                </span>
              </button>
            ))}
          </div>
        </section>

        {completed.length > 0 ? (
          <p className="mt-5 inline-flex items-center gap-2 font-mono text-[10.5px] tracking-[0.07em] text-brand uppercase">
            <Check className="size-3" strokeWidth={2.2} />
            {completed.length} rated this session
          </p>
        ) : null}
      </div>
    </div>
  );
}
