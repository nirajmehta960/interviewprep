import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Section";
import type { ArrayStructure } from "@/lib/types";

/** Each pointer keeps one colour across every problem that uses it. */
const POINTER_TONE: Record<string, string> = {
  left: "text-brand",
  right: "text-danger",
  i: "text-warn",
  j: "text-warn",
  slow: "text-brand",
  fast: "text-danger",
};

const pointerTone = (name: string) => POINTER_TONE[name] ?? "text-ink-3";

/**
 * 1D array / string visualizer.
 *
 * Element boxes with the active window tinted, plus labelled pointer arrows
 * below the cells. Indices stay visible above every cell, because most
 * off-by-one confusion is really index confusion.
 */
export function ArrayVisualizer({ data }: { data: ArrayStructure }) {
  const highlighted = new Set(data.highlightedIndices ?? []);
  const pointers = data.pointers ?? {};

  // Group pointers by the index they land on, so two pointers on the same cell
  // stack instead of overlapping.
  const pointersByIndex = new Map<number, string[]>();
  for (const [name, index] of Object.entries(pointers)) {
    pointersByIndex.set(index, [...(pointersByIndex.get(index) ?? []), name]);
  }

  const sorted = [...highlighted].sort((a, b) => a - b);
  const windowStart = sorted[0];
  const windowEnd = sorted[sorted.length - 1];

  /**
   * Highlighted cells only form a "window" when they are contiguous. Problems
   * like 3Sum highlight three separate probes, and labelling those as a window
   * of width 5 would be actively misleading.
   */
  const isContiguous =
    sorted.length > 1 && sorted.every((value, index) => index === 0 || value === sorted[index - 1] + 1);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
        <Eyebrow>
          {data.name} · {data.values.length} elements
        </Eyebrow>
        {isContiguous ? (
          <Eyebrow className="text-brand">
            window [{windowStart}, {windowEnd}] · width {sorted.length}
          </Eyebrow>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-y-6">
        {data.values.map((value, index) => {
          const inWindow = highlighted.has(index);
          const names = pointersByIndex.get(index) ?? [];
          const isWindowStart = isContiguous && index === windowStart;
          const isWindowEnd = isContiguous && index === windowEnd;

          return (
            <div key={index} className="flex w-[46px] shrink-0 flex-col items-center">
              <span
                className={cn(
                  "mb-1 font-mono text-[9.5px] tabular-nums",
                  inWindow ? "text-brand" : "text-ink-4",
                )}
              >
                {index}
              </span>

              <div
                className={cn(
                  "flex size-[38px] items-center justify-center border font-mono text-[15px] transition-all duration-150",
                  inWindow
                    ? "border-brand bg-tint-brand text-brand"
                    : "border-rule bg-card text-ink-3",
                  isWindowStart && "border-l-2",
                  isWindowEnd && "border-r-2",
                )}
              >
                {value}
              </div>

              <div className="mt-1.5 flex min-h-[34px] flex-col items-center gap-0.5">
                {names.map((name) => (
                  <span key={name} className="flex flex-col items-center">
                    <span
                      aria-hidden
                      className={cn("font-mono text-[10px] leading-none", pointerTone(name))}
                    >
                      ▲
                    </span>
                    <span
                      className={cn("font-mono text-[9.5px] tracking-[0.06em]", pointerTone(name))}
                    >
                      {name}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
