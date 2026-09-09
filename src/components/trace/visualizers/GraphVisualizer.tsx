import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Section";
import type { GraphStructure, NodeTone } from "@/lib/types";

/**
 * Graph visualizer.
 *
 * Nodes are placed on a circle in declaration order. A force layout would look
 * better on paper but is the wrong tool here: it is non-deterministic and
 * settles differently each render, so the graph would drift while the reader
 * steps the trace. A circle is stable, every node is visible, and no edge is
 * ever hidden behind a node.
 *
 * The trade-off is that dense graphs get a busy middle, so the builders keep
 * traced graphs small — which they should be anyway to stay readable.
 */

const NODE_TONE: Record<NodeTone, string> = {
  default: "border-rule bg-card text-ink",
  active: "border-brand bg-brand text-paper",
  created: "border-success bg-tint-success text-success",
  consumed: "border-rule-soft bg-paper-sunken text-ink-4",
};

/*
 * Edges are drawn from the text ramp rather than the hairline tokens. A border
 * colour is tuned to sit *under* content; a 1.5px line across open canvas needs
 * more weight, and on the dark surface `rule-soft` is 5% white — a traversed
 * edge simply vanished, taking the graph's shape with it.
 */
const EDGE_STROKE: Record<NonNullable<GraphStructure["edges"][number]["tone"]>, string> = {
  default: "var(--color-ink-4)",
  active: "var(--color-brand)",
  consumed: "var(--color-rule)",
};

const SIZE = 260;
const RADIUS = 96;
const NODE = 38;

export function GraphVisualizer({ data }: { data: GraphStructure }) {
  const count = data.nodes.length;

  if (count === 0) {
    return (
      <section>
        <Eyebrow className="mb-2.5 block">{data.name}</Eyebrow>
        <p className="rounded-card border border-dashed border-rule px-4 py-3 font-mono text-[11px] text-ink-4">
          empty graph
        </p>
      </section>
    );
  }

  // Start at 12 o'clock and go clockwise, so node 0 is where the eye lands.
  const position = (index: number) => {
    const angle = (index / count) * 2 * Math.PI - Math.PI / 2;
    return {
      x: SIZE / 2 + RADIUS * Math.cos(angle),
      y: SIZE / 2 + RADIUS * Math.sin(angle),
    };
  };

  const indexById = new Map(data.nodes.map((node, index) => [node.id, index]));

  return (
    <div className="space-y-6">
      <section>
        <Eyebrow className="mb-2.5 block">
          {data.name} · {count} nodes · {data.edges.length} edges
        </Eyebrow>

        <div className="relative" style={{ width: SIZE, height: SIZE }}>
          <svg className="absolute inset-0" width={SIZE} height={SIZE} aria-hidden>
            {data.directed ? (
              <defs>
                {(["default", "active", "consumed"] as const).map((tone) => (
                  <marker
                    key={tone}
                    id={`arrow-${tone}`}
                    viewBox="0 0 8 8"
                    refX="7"
                    refY="4"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 7 4 L 0 7 z" fill={EDGE_STROKE[tone]} />
                  </marker>
                ))}
              </defs>
            ) : null}

            {data.edges.map((edge, index) => {
              const from = indexById.get(edge.from);
              const to = indexById.get(edge.to);
              if (from === undefined || to === undefined) return null;

              const a = position(from);
              const b = position(to);

              // Stop the line short of the node so an arrowhead is not buried
              // under the circle it points at.
              const dx = b.x - a.x;
              const dy = b.y - a.y;
              const length = Math.hypot(dx, dy) || 1;
              const inset = NODE / 2 + 3;
              const tone = edge.tone ?? "default";

              return (
                <line
                  key={`${edge.from}-${edge.to}-${index}`}
                  x1={a.x + (dx / length) * inset}
                  y1={a.y + (dy / length) * inset}
                  x2={b.x - (dx / length) * inset}
                  y2={b.y - (dy / length) * inset}
                  stroke={EDGE_STROKE[tone]}
                  strokeWidth={tone === "active" ? 2 : 1.5}
                  markerEnd={data.directed ? `url(#arrow-${tone})` : undefined}
                />
              );
            })}
          </svg>

          {data.nodes.map((node, index) => {
            const { x, y } = position(index);

            return (
              <div
                key={node.id}
                className="absolute flex flex-col items-center"
                style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
              >
                <span
                  className={cn(
                    "flex items-center justify-center rounded-full border font-mono text-[12.5px] tabular-nums transition-colors",
                    NODE_TONE[node.tone ?? "default"],
                  )}
                  style={{ width: NODE, height: NODE }}
                >
                  {node.label}
                </span>
                {node.badge ? (
                  <span className="mt-1 font-mono text-[10px] whitespace-nowrap text-ink-3">
                    {node.badge}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {data.frontier ? (
        <section>
          <Eyebrow className="mb-2.5 block">
            {data.frontier.label} · {data.frontier.ids.length}
          </Eyebrow>

          {data.frontier.ids.length === 0 ? (
            <p className="rounded-card border border-dashed border-rule px-3 py-2 font-mono text-[11px] text-ink-4">
              {data.frontier.emptyHint ?? "empty"}
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {data.frontier.ids.map((id, index) => (
                <span
                  key={`${id}-${index}`}
                  className="rounded-control border border-brand/40 bg-tint-brand px-2 py-1 font-mono text-[11.5px] tabular-nums text-brand"
                >
                  {data.nodes.find((node) => node.id === id)?.label ?? id}
                </span>
              ))}
            </div>
          )}
        </section>
      ) : null}

      {data.order && data.order.length > 0 ? (
        <section>
          <Eyebrow className="mb-2.5 block">Order · {data.order.length} committed</Eyebrow>
          <div className="flex flex-wrap items-center gap-1.5">
            {data.order.map((value, index) => (
              <span key={index} className="flex items-center gap-1.5">
                {index > 0 ? (
                  <span className="font-mono text-[10px] text-ink-4" aria-hidden>
                    →
                  </span>
                ) : null}
                <span className="rounded-control border border-success/40 bg-tint-success px-2 py-1 font-mono text-[11.5px] tabular-nums text-success">
                  {value}
                </span>
              </span>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
