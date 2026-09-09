"use client";

import { useState } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Section";
import { Inline } from "@/components/ui/Prose";
import { IconButton } from "@/components/ui/Controls";
import { IntervalVisualizer } from "./visualizers/IntervalVisualizer";
import { ArrayVisualizer } from "./visualizers/ArrayVisualizer";
import { LinkedListVisualizer } from "./visualizers/LinkedListVisualizer";
import { TreeVisualizer } from "./visualizers/TreeVisualizer";
import { GraphVisualizer } from "./visualizers/GraphVisualizer";
import type { TraceStep } from "@/lib/types";

/**
 * The canvas shared by both workbenches: grid ground, whichever visualizers the
 * step carries, a floating state card, the explanation, and zoom.
 */
export function TraceCanvas({
  step,
  total,
  inputLabel,
  emptyHint,
}: {
  step: TraceStep;
  total: number;
  inputLabel: string;
  emptyHint?: string;
}) {
  const [zoom, setZoom] = useState(100);

  const hasStructure =
    Boolean(step.structures.intervals) ||
    Boolean(step.structures.array) ||
    Boolean(step.structures.linkedList) ||
    Boolean(step.structures.tree) ||
    Boolean(step.structures.graph);

  return (
    <div className="relative min-h-0 flex-1 overflow-auto">
      <div
        className="min-h-full p-8 pb-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-rule-soft) 1px, transparent 1px), linear-gradient(to bottom, var(--color-rule-soft) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <Eyebrow className="text-ink">{step.phase}</Eyebrow>
            <span className="font-mono text-[11px] tabular-nums text-ink-3">
              {String(step.stepIndex).padStart(2, "0")} / {total}
            </span>
          </div>
          <Eyebrow>{inputLabel}</Eyebrow>
        </div>

        <div
          className="origin-top-left transition-transform duration-150"
          style={{ transform: `scale(${zoom / 100})`, width: `${10000 / zoom}%` }}
        >
          <div className="max-w-[860px]">
            {step.structures.intervals ? (
              <IntervalVisualizer data={step.structures.intervals} />
            ) : null}
            {step.structures.array ? <ArrayVisualizer data={step.structures.array} /> : null}
            {step.structures.linkedList ? (
              <LinkedListVisualizer data={step.structures.linkedList} />
            ) : null}
            {step.structures.tree ? <TreeVisualizer data={step.structures.tree} /> : null}
            {step.structures.graph ? <GraphVisualizer data={step.structures.graph} /> : null}

            {!hasStructure ? (
              <p className="max-w-[46ch] border border-dashed border-rule px-5 py-4 text-[13px] leading-relaxed text-ink-3">
                {emptyHint ??
                  "No data structure was recognised on this step. The variable table on the right still shows the full state."}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Floating state card */}
      <div className="pointer-events-none absolute top-6 right-6 w-[242px]">
        <div className="pointer-events-auto max-h-[52vh] overflow-auto border border-rule bg-card/95 backdrop-blur-[2px]">
          <div className="sticky top-0 border-b border-rule bg-card/95 px-3.5 py-2">
            <Eyebrow>State</Eyebrow>
          </div>
          <dl className="px-3.5 py-2.5">
            {Object.entries(step.variables).map(([name, value]) => {
              const changed = step.changed?.includes(name);
              return (
                <div key={name} className="flex items-baseline justify-between gap-3 py-[3px]">
                  <dt className="shrink-0 font-mono text-[11px] text-ink-3">{name}</dt>
                  <dd
                    className={cn(
                      "max-w-[140px] truncate font-mono text-[11.5px] tabular-nums",
                      changed
                        ? "text-danger underline decoration-danger/40 underline-offset-2"
                        : "text-ink",
                    )}
                    title={value}
                  >
                    {value}
                  </dd>
                </div>
              );
            })}
          </dl>
          <div className="border-t border-rule px-3.5 py-2">
            <Eyebrow
              className={
                step.kind === "mutation"
                  ? "text-danger"
                  : step.kind === "return"
                    ? "text-brand"
                    : undefined
              }
            >
              {step.kind} · {step.state}
            </Eyebrow>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 w-full max-w-[560px] -translate-x-1/2 px-6">
        <div className="pointer-events-auto border border-rule bg-card/95 px-5 py-4 shadow-[0_12px_32px_-20px_rgba(27,27,24,0.4)] backdrop-blur-[2px]">
          <Eyebrow className="block pb-1.5">Explanation</Eyebrow>
          <p className="text-[13.5px] leading-relaxed text-ink">
            {/* Explanations are authored in the same light markdown as the rest
                of the content, so `code`, **bold** and *italic* must render
                here too rather than leaking their markers. */}
            <Inline text={step.explanation} />
          </p>
        </div>
      </div>

      {/* Zoom */}
      <div className="absolute right-6 bottom-6 flex items-center gap-1 border border-rule bg-card/95 px-1.5 py-1 backdrop-blur-[2px]">
        <IconButton
          label="Zoom out"
          size="sm"
          variant="quiet"
          onClick={() => setZoom((z) => Math.max(60, z - 10))}
        >
          <Minus className="size-3.5" strokeWidth={1.8} />
        </IconButton>
        <span className="w-9 text-center font-mono text-[10.5px] tabular-nums text-ink-2">
          {zoom}%
        </span>
        <IconButton
          label="Zoom in"
          size="sm"
          variant="quiet"
          onClick={() => setZoom((z) => Math.min(160, z + 10))}
        >
          <Plus className="size-3.5" strokeWidth={1.8} />
        </IconButton>
        <IconButton label="Reset zoom" size="sm" variant="quiet" onClick={() => setZoom(100)}>
          <RotateCcw className="size-3.5" strokeWidth={1.7} />
        </IconButton>
      </div>
    </div>
  );
}

/** Timeline ruler with per-kind tick geometry, shared by both workbenches. */
export function TraceRuler({
  steps,
  cursor,
  onSeek,
}: {
  steps: TraceStep[];
  cursor: number;
  onSeek: (index: number) => void;
}) {
  const TICK: Record<string, { height: string; color: string }> = {
    call: { height: "h-2", color: "bg-ink-4" },
    compare: { height: "h-3", color: "bg-ink-2" },
    mutation: { height: "h-5", color: "bg-danger" },
    return: { height: "h-5", color: "bg-brand" },
  };

  const segments: { phase: string; start: number; length: number }[] = [];
  steps.forEach((item, index) => {
    const last = segments[segments.length - 1];
    if (last && last.phase === item.phase) last.length += 1;
    else segments.push({ phase: item.phase, start: index, length: 1 });
  });

  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-end gap-[2px]" role="group" aria-label="Trace timeline">
        {steps.map((item, index) => {
          const style = TICK[item.kind] ?? TICK.call;
          const isCurrent = index === cursor;
          const isPast = index < cursor;

          return (
            <button
              key={index}
              type="button"
              title={`Step ${item.stepIndex} · ${item.phase} · ${item.state}`}
              aria-label={`Go to step ${item.stepIndex}`}
              aria-current={isCurrent ? "step" : undefined}
              onClick={() => onSeek(index)}
              className="group flex min-w-[2px] flex-1 items-end justify-center pt-3 pb-1"
            >
              <span
                className={cn(
                  "w-full max-w-[6px] transition-all duration-100",
                  isCurrent ? "h-6 bg-brand" : style.height,
                  !isCurrent && (isPast ? style.color : "bg-rule"),
                  !isCurrent && "group-hover:bg-ink-3",
                )}
              />
            </button>
          );
        })}
      </div>

      <div className="flex gap-[2px] border-t border-rule-soft">
        {segments.map((segment) => (
          <div
            key={`${segment.phase}-${segment.start}`}
            style={{ flexGrow: segment.length }}
            className="min-w-0 border-l border-rule-soft pt-1 pl-1.5 first:border-l-0 first:pl-0"
          >
            <span className="marker-num block truncate">{segment.phase}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
