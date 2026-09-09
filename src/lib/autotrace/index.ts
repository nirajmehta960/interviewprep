import type { Trace, TraceStep } from "@/lib/types";
import { InstrumentError } from "./instrument";
import { runInstrumented } from "./run";
import { classify, diffChanged } from "./classify";

export { InstrumentError } from "./instrument";
export { formatValue } from "./classify";

/**
 * Auto-trace pipeline: instrument → run → classify → assemble.
 *
 * The output is the same `Trace` the hand-authored generators produce, so the
 * existing workbench, visualizers and timeline render it with no special
 * casing. What an auto-trace cannot supply is the *prose* — explanations here
 * are derived from the source line and the observed change, and are meant to be
 * overwritten by the reader for the steps that matter.
 */

export interface AutoTraceResult {
  trace?: Trace;
  /** A hard failure — nothing could be traced. */
  error?: string;
  /** The user's code threw partway; steps up to that point are still usable. */
  runtimeError?: string;
  truncated: boolean;
}

export function buildAutoTrace(source: string): AutoTraceResult {
  let outcome;
  try {
    outcome = runInstrumented(source);
  } catch (error) {
    if (error instanceof InstrumentError) return { error: error.message, truncated: false };
    return { error: error instanceof Error ? error.message : String(error), truncated: false };
  }

  const { steps: raw, lines, error: runtimeError, truncated } = outcome;

  if (raw.length === 0) {
    return {
      error:
        runtimeError ??
        "The code parsed but produced no steps. Make sure the function is actually called.",
      truncated,
    };
  }

  const steps: TraceStep[] = [];
  let previousVariables: Record<string, string> | undefined;

  raw.forEach((rawStep, index) => {
    const { structures, variables } = classify(rawStep.snapshot);
    const changed = diffChanged(previousVariables, variables);
    const sourceLine = (lines[rawStep.line - 1] ?? "").trim();

    const changeSummary = changed
      .slice(0, 3)
      .map((name) => `${name} = ${variables[name]}`)
      .join(" · ");

    steps.push({
      stepIndex: index + 1,
      lineHighlight: { JAVA: rawStep.line, PYTHON: rawStep.line },
      phase: rawStep.phase,
      kind: rawStep.kind,
      state: changed.length > 0 ? changeSummary || `${changed.length} changed` : `line ${rawStep.line}`,
      explanation:
        changed.length > 0
          ? `${sourceLine} — ${changeSummary}`
          : sourceLine || `Line ${rawStep.line}`,
      changed,
      variables,
      structures,
      events: [],
    });

    previousVariables = variables;
  });

  return {
    // Both listings are the same source; the workbench hides the language
    // toggle when it sees one listing shared across both slots.
    trace: {
      problemSlug: "auto",
      code: { JAVA: lines, PYTHON: lines },
      steps,
      inputLabel: `${steps.length} steps captured`,
    },
    runtimeError,
    truncated,
  };
}
