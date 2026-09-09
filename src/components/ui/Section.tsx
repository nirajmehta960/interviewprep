import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Small uppercase sans label for secondary meta. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("eyebrow", className)}>{children}</span>;
}

/**
 * Section label above a heading.
 *
 * The `index` is still accepted so the many call sites keep working, but it is
 * no longer rendered: the running `01 /` numbers were the editorial system's
 * signature, and on a course platform they read as clutter. The prop is
 * deliberately kept rather than removed so this stayed a one-file change.
 */
export function SectionKicker({
  index: _index,
  label,
  className,
}: {
  index?: number;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <Eyebrow>{label}</Eyebrow>
    </div>
  );
}

export function Rule({ className, soft }: { className?: string; soft?: boolean }) {
  return (
    <hr
      className={cn("border-0 border-t", soft ? "border-t-rule-soft" : "border-t-rule", className)}
    />
  );
}

/**
 * Standard section header: numbered kicker, serif title, and an optional
 * right-aligned meta slot that sits on the title's baseline.
 */
export function SectionHead({
  index,
  kicker,
  title,
  meta,
  description,
  className,
}: {
  index: number;
  kicker: string;
  title: string;
  meta?: ReactNode;
  description?: string;
  className?: string;
}) {
  return (
    <header className={cn("mb-6", className)}>
      <SectionKicker index={index} label={kicker} className="mb-3" />
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="text-[26px] leading-tight">{title}</h2>
        {meta ? <div className="eyebrow shrink-0">{meta}</div> : null}
      </div>
      {description ? <p className="mt-2 max-w-prose text-ink-2">{description}</p> : null}
    </header>
  );
}

/**
 * A content block: rounded, hairline-bordered, and softly lifted when it sits
 * on the page surface. Tinted tones keep a matching border so the block still
 * has an edge on a white ground.
 */
export function Panel({
  children,
  className,
  tone = "card",
}: {
  children: ReactNode;
  className?: string;
  tone?: "card" | "sunken" | "brand" | "success" | "danger" | "warn";
}) {
  const tones = {
    card: "bg-card border-rule shadow-card",
    sunken: "bg-paper-sunken border-rule",
    brand: "bg-tint-brand border-brand/15",
    success: "bg-tint-success border-success/15",
    danger: "bg-tint-danger border-danger/15",
    warn: "bg-tint-warn border-warn/15",
  } as const;

  return <div className={cn("rounded-card border", tones[tone], className)}>{children}</div>;
}

/**
 * Callout used for intuition and key-takeaway blocks: a numbered marker, a
 * serif lead line, and body copy on a tinted ground.
 */
export function Callout({
  index,
  kicker,
  title,
  children,
  tone = "brand",
}: {
  index?: number;
  kicker: string;
  title?: string;
  children: ReactNode;
  tone?: "brand" | "danger" | "warn";
}) {
  const marker = {
    brand: "border-brand/40 text-brand",
    danger: "border-danger/40 text-danger",
    warn: "border-warn/40 text-warn",
  } as const;

  return (
    <Panel tone={tone} className="p-6">
      <div className="mb-3 flex items-center gap-2.5">
        {index !== undefined ? (
          <span
            className={cn(
              "border px-1.5 py-0.5 font-mono text-[10px] leading-none tabular-nums",
              marker[tone],
            )}
          >
            {String(index).padStart(2, "0")}
          </span>
        ) : null}
        <Eyebrow>{kicker}</Eyebrow>
      </div>
      {title ? <h3 className="mb-2 text-[21px] leading-snug">{title}</h3> : null}
      <div className="max-w-prose text-ink-2">{children}</div>
    </Panel>
  );
}
