"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Code2,
  Pause,
  Play,
  Play as Run,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Section";
import { Button, IconButton, Segmented } from "@/components/ui/Controls";
import { CodeBlock } from "@/components/code/CodeBlock";
import { TraceCanvas, TraceRuler } from "./TraceCanvas";
import { SPEEDS, usePlayback } from "./usePlayback";
import { buildAutoTrace, type AutoTraceResult } from "@/lib/autotrace";

export interface AutoSample {
  label: string;
  source: string;
}

/**
 * Paste-a-solution workbench.
 *
 * The source is instrumented, executed in this tab, and classified into
 * visualizers — no per-problem authoring. What it cannot produce is the prose:
 * explanations here are derived from the source line and the observed change.
 */
export function AutoTraceWorkbench({ samples }: { samples: AutoSample[] }) {
  const [source, setSource] = useState(samples[0]?.source ?? "");
  const [editing, setEditing] = useState(true);
  const [result, setResult] = useState<AutoTraceResult>(() =>
    buildAutoTrace(samples[0]?.source ?? ""),
  );

  const codePaneRef = useRef<HTMLDivElement>(null);

  const trace = result.trace;
  const steps = useMemo(() => trace?.steps ?? [], [trace]);
  const { cursor, playing, speed, atEnd, setSpeed, goTo, reset, togglePlay, stepBy } = usePlayback(
    steps.length,
  );

  const step = steps[cursor];

  /*
   * Open on the first step that actually has something drawn. Step 1 is
   * usually the top-level call, before any data exists, which makes for a
   * blank and unhelpful first frame.
   */
  useEffect(() => {
    const first = steps.findIndex(
      (item) =>
        item.structures.array || item.structures.intervals || item.structures.linkedList,
    );
    if (first > 0) goTo(first);
    // Only when a new trace is produced, not on every cursor move.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps]);

  // Keep the executing line in view.
  useEffect(() => {
    if (!step || editing) return;
    const row = codePaneRef.current?.querySelector(`#code-line-${step.lineHighlight.JAVA}`);
    row?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [step, editing]);

  const run = () => {
    setResult(buildAutoTrace(source));
    reset();
    setEditing(false);
  };

  const loadSample = (label: string) => {
    const sample = samples.find((item) => item.label === label);
    if (!sample) return;
    setSource(sample.source);
    setResult(buildAutoTrace(sample.source));
    reset();
    setEditing(false);
  };

  const lineCount = source.split("\n").length;

  return (
    <div className="flex h-[calc(100vh-56px)] min-h-[680px] flex-col">
      {/* Header ------------------------------------------------------------ */}
      <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-rule px-6 py-3">
        <div className="flex min-w-0 items-center gap-4">
          <h1 className="truncate text-[19px] leading-none">Visualizer workbench</h1>
          <Eyebrow className="hidden sm:inline">Paste a solution · JavaScript</Eyebrow>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Segmented
            label="Sample"
            value=""
            onChange={loadSample}
            options={samples.map((sample) => ({ value: sample.label, label: sample.label }))}
          />
          <Button variant={editing ? "outline" : "primary"} size="sm" onClick={() => setEditing((v) => !v)}>
            <Code2 className="size-3.5" strokeWidth={1.7} />
            {editing ? "Show trace" : "Edit source"}
          </Button>
          <Button variant="primary" size="sm" onClick={run}>
            <Run className="size-3.5" strokeWidth={2} />
            Run trace
          </Button>
        </div>
      </header>

      {/* Diagnostics ------------------------------------------------------- */}
      {result.error || result.runtimeError || result.truncated ? (
        <div
          className={cn(
            "flex items-start gap-2.5 border-b px-6 py-2.5",
            result.error ? "border-danger/30 bg-tint-danger" : "border-warn/30 bg-tint-warn",
          )}
        >
          <AlertTriangle
            className={cn("mt-[2px] size-3.5 shrink-0", result.error ? "text-danger" : "text-warn")}
            strokeWidth={1.8}
          />
          <p className="text-[12.5px] leading-relaxed text-ink-2">
            {result.error ? (
              <>
                <span className="font-medium text-danger">Could not trace.</span> {result.error}
              </>
            ) : result.runtimeError ? (
              <>
                <span className="font-medium text-warn">The code threw:</span>{" "}
                <span className="font-mono text-[11.5px]">{result.runtimeError}</span> — steps up to
                that point are still shown.
              </>
            ) : (
              <>
                <span className="font-medium text-warn">Step limit reached.</span> The trace was
                cut at {steps.length} steps; try a smaller input.
              </>
            )}
          </p>
        </div>
      ) : null}

      {/* Body -------------------------------------------------------------- */}
      <div className="flex min-h-0 flex-1">
        <aside
          className={cn(
            "flex shrink-0 flex-col border-r border-rule",
            editing ? "w-[560px]" : "w-[400px]",
          )}
        >
          <div className="flex items-center justify-between gap-3 border-b border-rule px-4 py-2.5">
            <Eyebrow>{editing ? "Source · editable" : "Source · executing"}</Eyebrow>
            <Eyebrow>
              {editing ? `${lineCount} lines` : step ? `Line ${step.lineHighlight.JAVA}` : "—"}
            </Eyebrow>
          </div>

          {editing ? (
            <>
              <textarea
                value={source}
                onChange={(event) => setSource(event.target.value)}
                spellCheck={false}
                className="min-h-0 flex-1 resize-none bg-transparent px-4 py-3 font-mono text-[12.5px] leading-[1.75] text-ink outline-none"
              />
              <div className="border-t border-rule px-4 py-2.5">
                <Eyebrow>End with a call, e.g. const result = solve(input);</Eyebrow>
              </div>
            </>
          ) : (
            <>
              <div ref={codePaneRef} className="min-h-0 flex-1 overflow-auto py-2">
                <CodeBlock
                  lines={trace?.code.JAVA ?? source.split("\n")}
                  language="JAVA"
                  activeLine={step?.lineHighlight.JAVA}
                  onLineClick={(line) => {
                    const target = steps.findIndex((item) => item.lineHighlight.JAVA === line);
                    if (target >= 0) goTo(target);
                  }}
                />
              </div>
              <div className="border-t border-rule px-4 py-2.5">
                <Eyebrow>Click a line to seek</Eyebrow>
              </div>
            </>
          )}
        </aside>

        {step ? (
          <TraceCanvas
            step={step}
            total={steps.length}
            inputLabel={trace?.inputLabel ?? ""}
            emptyHint="No array, interval set, or linked list was recognised on this step. The state panel still shows every variable."
          />
        ) : (
          <div className="flex flex-1 items-center justify-center px-8">
            <p className="max-w-[42ch] text-center text-[13.5px] leading-relaxed text-ink-3">
              Paste a JavaScript solution, end it with a call, and press Run trace.
            </p>
          </div>
        )}
      </div>

      {/* Playback ---------------------------------------------------------- */}
      {steps.length > 0 && step ? (
        <footer className="border-t border-rule px-6 py-3">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <IconButton label="Reset" size="sm" onClick={reset}>
                <RotateCcw className="size-3.5" strokeWidth={1.7} />
              </IconButton>
              <IconButton
                label="Previous step"
                size="sm"
                onClick={() => stepBy(-1)}
                disabled={cursor === 0}
              >
                <ChevronLeft className="size-4" strokeWidth={1.8} />
              </IconButton>
              <Button variant="primary" size="sm" onClick={togglePlay} className="w-[74px]">
                {playing ? (
                  <>
                    <Pause className="size-3.5" strokeWidth={2} /> Pause
                  </>
                ) : (
                  <>
                    <Play className="size-3.5" strokeWidth={2} /> {atEnd ? "Replay" : "Play"}
                  </>
                )}
              </Button>
              <IconButton
                label="Next step"
                size="sm"
                onClick={() => stepBy(1)}
                disabled={atEnd}
              >
                <ChevronRight className="size-4" strokeWidth={1.8} />
              </IconButton>
            </div>

            <TraceRuler steps={steps} cursor={cursor} onSeek={goTo} />

            <div className="flex shrink-0 items-center gap-4">
              <Segmented
                label="Playback speed"
                value={String(speed)}
                onChange={(value) => setSpeed(Number(value) as (typeof SPEEDS)[number])}
                options={SPEEDS.map((value) => ({ value: String(value), label: `${value}×` }))}
              />
              <span className="font-mono text-[12px] tabular-nums text-ink-2">
                {String(step.stepIndex).padStart(2, "0")} / {steps.length}
              </span>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <Eyebrow>Space play · ← → step · R reset</Eyebrow>
            <Eyebrow>Generated · explanations are derived, not authored</Eyebrow>
          </div>
        </footer>
      ) : null}
    </div>
  );
}
