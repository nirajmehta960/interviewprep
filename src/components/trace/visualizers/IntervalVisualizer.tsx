import { Eyebrow } from "@/components/ui/Section";
import type { IntervalStructure } from "@/lib/types";

/**
 * Interval sweep visualizer.
 *
 * Intervals are stacked one per row and positioned along a shared axis, so an
 * overlap reads as a vertical column rather than as ambiguous stacking on a
 * single line. Committed ranges get their own axis below the input.
 */

const PAD_LEFT = 46;
const PAD_RIGHT = 16;
const VIEW_WIDTH = 760;
const ROW_HEIGHT = 30;
const BAR_HEIGHT = 20;
const AXIS_HEIGHT = 22;

export function IntervalVisualizer({ data }: { data: IntervalStructure }) {
  const { values, activeIndex, cursorIndex, merged, domainMax } = data;

  const plotWidth = VIEW_WIDTH - PAD_LEFT - PAD_RIGHT;
  const x = (value: number) => PAD_LEFT + (value / domainMax) * plotWidth;

  const inputHeight = values.length * ROW_HEIGHT + AXIS_HEIGHT;
  const mergedHeight = Math.max(1, merged.length) * ROW_HEIGHT + AXIS_HEIGHT;

  // Integer ticks, thinned out so labels never collide.
  const tickStep = Math.max(1, Math.ceil(domainMax / 14));
  const ticks = Array.from(
    { length: Math.floor(domainMax / tickStep) + 1 },
    (_, index) => index * tickStep,
  );

  const Axis = ({ y }: { y: number }) => (
    <g>
      <line x1={PAD_LEFT} y1={y} x2={VIEW_WIDTH - PAD_RIGHT} y2={y} stroke="var(--color-rule)" strokeWidth={1} />
      {ticks.map((tick) => (
        <g key={tick}>
          <line x1={x(tick)} y1={y} x2={x(tick)} y2={y + 4} stroke="var(--color-rule)" strokeWidth={1} />
          <text
            x={x(tick)}
            y={y + 15}
            textAnchor="middle"
            className="fill-[var(--color-ink-4)] font-mono text-[9px]"
          >
            {tick}
          </text>
        </g>
      ))}
    </g>
  );

  return (
    <div className="space-y-6">
      <section>
        <Eyebrow className="mb-2 block">Input intervals · sorted by start</Eyebrow>

        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${inputHeight}`}
          className="w-full"
          role="img"
          aria-label={`${values.length} input intervals`}
        >
          {/* Column guides at every tick keep positions comparable. */}
          {ticks.map((tick) => (
            <line
              key={`guide-${tick}`}
              x1={x(tick)}
              y1={0}
              x2={x(tick)}
              y2={values.length * ROW_HEIGHT}
              stroke="var(--color-rule-soft)"
              strokeWidth={1}
            />
          ))}

          {values.map((interval, index) => {
            const isActive = index === activeIndex;
            const isCursor = index === cursorIndex;
            const y = index * ROW_HEIGHT + (ROW_HEIGHT - BAR_HEIGHT) / 2;
            const barX = x(interval[0]);
            const barWidth = Math.max(2, x(interval[1]) - x(interval[0]));

            const fill = isActive
              ? "var(--color-tint-brand)"
              : isCursor
                ? "var(--color-tint-danger)"
                : "var(--color-card)";
            const stroke = isActive
              ? "var(--color-brand)"
              : isCursor
                ? "var(--color-danger)"
                : "var(--color-rule)";

            return (
              <g key={index}>
                <text
                  x={PAD_LEFT - 10}
                  y={y + BAR_HEIGHT / 2 + 3}
                  textAnchor="end"
                  className="fill-[var(--color-ink-4)] font-mono text-[9.5px]"
                >
                  {String(index).padStart(2, "0")}
                </text>

                <rect
                  x={barX}
                  y={y}
                  width={barWidth}
                  height={BAR_HEIGHT}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isActive || isCursor ? 1.5 : 1}
                  style={{ transition: "all 180ms ease" }}
                />

                <text
                  x={barX + 7}
                  y={y + BAR_HEIGHT / 2 + 3.5}
                  className={
                    isActive
                      ? "fill-[var(--color-brand)] font-mono text-[10px]"
                      : isCursor
                        ? "fill-[var(--color-danger)] font-mono text-[10px]"
                        : "fill-[var(--color-ink-2)] font-mono text-[10px]"
                  }
                >
                  [{interval[0]}, {interval[1]}]
                </text>

                {isActive || isCursor ? (
                  <text
                    x={barX + barWidth + 8}
                    y={y + BAR_HEIGHT / 2 + 3.5}
                    className={
                      isActive
                        ? "fill-[var(--color-brand)] font-mono text-[8.5px] tracking-[0.1em]"
                        : "fill-[var(--color-danger)] font-mono text-[8.5px] tracking-[0.1em]"
                    }
                  >
                    {isActive ? "ACTIVE" : "CURRENT"}
                  </text>
                ) : null}
              </g>
            );
          })}

          <Axis y={values.length * ROW_HEIGHT} />
        </svg>
      </section>

      <section>
        <Eyebrow className="mb-2 block">
          Merged output · {String(merged.length).padStart(2, "0")} committed
        </Eyebrow>

        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${mergedHeight}`}
          className="w-full"
          role="img"
          aria-label={`${merged.length} merged intervals`}
        >
          {merged.length === 0 ? (
            <text
              x={PAD_LEFT}
              y={ROW_HEIGHT / 2 + 4}
              className="fill-[var(--color-ink-4)] font-mono text-[10px]"
            >
              nothing committed yet
            </text>
          ) : (
            merged.map((interval, index) => {
              const y = index * ROW_HEIGHT + (ROW_HEIGHT - BAR_HEIGHT) / 2;
              const barX = x(interval[0]);
              const barWidth = Math.max(2, x(interval[1]) - x(interval[0]));

              return (
                <g key={index}>
                  <rect
                    x={barX}
                    y={y}
                    width={barWidth}
                    height={BAR_HEIGHT}
                    fill="var(--color-brand)"
                    opacity={0.86}
                  />
                  <text
                    x={barX + 7}
                    y={y + BAR_HEIGHT / 2 + 3.5}
                    className="fill-[var(--color-paper)] font-mono text-[10px]"
                  >
                    [{interval[0]}, {interval[1]}]
                  </text>
                </g>
              );
            })
          )}

          <Axis y={Math.max(1, merged.length) * ROW_HEIGHT} />
        </svg>
      </section>
    </div>
  );
}
