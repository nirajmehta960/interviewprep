import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import {
  DIFFICULTY_LABEL,
  MASTERY_LABEL,
  MASTERY_ORDER,
  type Difficulty,
  type MasteryLevel,
} from "@/lib/types";

export type Tone = "brand" | "success" | "danger" | "warn" | "neutral";

const TEXT_TONE: Record<Tone, string> = {
  brand: "text-brand",
  success: "text-success",
  danger: "text-danger",
  warn: "text-warn",
  neutral: "text-ink-3",
};

const FILL_TONE: Record<Tone, string> = {
  brand: "bg-brand",
  success: "bg-success",
  danger: "bg-danger",
  warn: "bg-warn",
  neutral: "bg-ink-4",
};

/**
 * Difficulty reads as a three-step ramp: beginner → intermediate → advanced.
 *
 * Green rather than brand blue for the easiest step: blue is the link and
 * active-state colour throughout, so a blue "Beginner" label sitting beside a
 * question title looks clickable when it is not.
 */
export const difficultyTone = (difficulty: Difficulty): Tone =>
  difficulty === "EASY" ? "success" : difficulty === "MEDIUM" ? "warn" : "danger";

export const masteryTone = (mastery: MasteryLevel): Tone => {
  const index = MASTERY_ORDER.indexOf(mastery);
  if (index <= 0) return "neutral";
  return "success";
};

/** Difficulty is set in the accent colour rather than boxed, per the mockups. */
export function DifficultyTag({
  difficulty,
  className,
}: {
  difficulty: Difficulty;
  className?: string;
}) {
  return (
    <span className={cn("text-[13px]", TEXT_TONE[difficultyTone(difficulty)], className)}>
      {DIFFICULTY_LABEL[difficulty]}
    </span>
  );
}

/** Square swatch + label, used in dense table rows. */
export function DifficultySwatch({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn("size-2", FILL_TONE[difficultyTone(difficulty)])} aria-hidden />
      <span className="text-[13px] text-ink-2">{DIFFICULTY_LABEL[difficulty]}</span>
    </span>
  );
}

/**
 * Six-segment position readout for the mastery state machine. Showing the
 * stage *and* the distance still to travel is more informative than a
 * single word, and it makes rows comparable at a glance.
 */
export function MasteryStepper({
  mastery,
  showLabel = true,
  className,
}: {
  mastery: MasteryLevel;
  showLabel?: boolean;
  className?: string;
}) {
  const reached = MASTERY_ORDER.indexOf(mastery);
  const tone = masteryTone(mastery);

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {showLabel ? (
        <span className={cn("text-[13px] whitespace-nowrap", TEXT_TONE[tone])}>
          {MASTERY_LABEL[mastery]}
        </span>
      ) : null}
      <span
        className="inline-flex items-center gap-[3px]"
        role="img"
        aria-label={`Mastery: ${MASTERY_LABEL[mastery]}, stage ${reached} of 5`}
      >
        {MASTERY_ORDER.map((_, index) => (
          <span
            key={index}
            className={cn(
              "h-[2px] w-[9px]",
              index === 0 ? "hidden" : "",
              index <= reached ? FILL_TONE[tone] : "bg-rule",
            )}
          />
        ))}
      </span>
    </span>
  );
}

/**
 * Rounded pill for subtopics, languages, and tags.
 *
 * Sans rather than monospace, and fully rounded: the platform register reads
 * these as content labels, not as instrument readouts.
 */
export function Chip({
  children,
  className,
  tone = "neutral",
}: {
  children: ReactNode;
  className?: string;
  tone?: Tone;
}) {
  const tones: Record<Tone, string> = {
    brand: "border-brand/25 text-brand bg-tint-brand",
    success: "border-success/25 text-success bg-tint-success",
    danger: "border-danger/25 text-danger bg-tint-danger",
    warn: "border-warn/25 text-warn bg-tint-warn",
    neutral: "border-rule text-ink-2 bg-paper-sunken",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[12.5px] font-medium whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Horizontal meter. The count stays visible — the bar is only the signal. */
export function Meter({
  value,
  max,
  tone = "brand",
  className,
  width = "w-24",
}: {
  value: number;
  max: number;
  tone?: Tone;
  className?: string;
  width?: string;
}) {
  const pct = max <= 0 ? 0 : Math.min(100, Math.round((value / max) * 100));

  return (
    <span
      className={cn("inline-block h-[3px] bg-rule-soft align-middle", width, className)}
      role="img"
      aria-label={`${value} of ${max}`}
    >
      <span className={cn("block h-full", FILL_TONE[tone])} style={{ width: `${pct}%` }} />
    </span>
  );
}

/** Value + meter pair, aligned so columns of these line up. */
export function MeterCell({
  value,
  max,
  tone = "brand",
}: {
  value: number;
  max: number;
  tone?: Tone;
}) {
  return (
    <span className="inline-flex items-center gap-3 tabular-nums">
      <span className={cn("w-5 text-right text-[13px]", value === 0 ? "text-ink-4" : "text-ink")}>
        {value}
      </span>
      <Meter value={value} max={max} tone={tone} />
    </span>
  );
}

export function StatusDot({ tone = "brand", className }: { tone?: Tone; className?: string }) {
  return <span className={cn("inline-block size-[7px]", FILL_TONE[tone], className)} aria-hidden />;
}
