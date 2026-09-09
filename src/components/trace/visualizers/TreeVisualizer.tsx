import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Section";
import type { NodeTone, TreeStructure } from "@/lib/types";

/**
 * Binary tree visualizer.
 *
 * Layout comes from the node's `depth` and `slot` rather than a layout engine:
 * a node at depth *d* occupies one of `2 ** d` evenly spaced columns, which is
 * exactly the heap-index convention the builders already use. That keeps the
 * geometry deterministic — the same tree always draws identically, so stepping
 * the trace never shifts the picture underneath the reader.
 *
 * Edges are drawn as SVG lines behind the nodes; the nodes themselves are
 * absolutely positioned HTML so they inherit the type and colour tokens
 * instead of re-declaring them in SVG.
 */

const NODE_TONE: Record<NodeTone, string> = {
  default: "border-rule bg-card text-ink",
  active: "border-brand bg-brand text-paper",
  created: "border-success bg-tint-success text-success",
  consumed: "border-rule-soft bg-paper-sunken text-ink-4",
};

const ROW_HEIGHT = 68;
const NODE = 38;

export function TreeVisualizer({ data }: { data: TreeStructure }) {
  if (data.nodes.length === 0) {
    return (
      <section>
        <Eyebrow className="mb-2.5 block">{data.name}</Eyebrow>
        <p className="rounded-card border border-dashed border-rule px-4 py-3 font-mono text-[11px] text-ink-4">
          empty tree
        </p>
      </section>
    );
  }

  const maxDepth = Math.max(...data.nodes.map((node) => node.depth));
  const height = (maxDepth + 1) * ROW_HEIGHT;

  // Percentage placement so the tree fills whatever width the canvas gives it.
  const xPercent = (depth: number, slot: number) => ((slot + 0.5) / 2 ** depth) * 100;
  const yPx = (depth: number) => depth * ROW_HEIGHT + ROW_HEIGHT / 2;

  const byId = new Map(data.nodes.map((node) => [node.id, node]));

  const pointersByNode = new Map<string, string[]>();
  for (const [name, nodeId] of Object.entries(data.pointers ?? {})) {
    pointersByNode.set(nodeId, [...(pointersByNode.get(nodeId) ?? []), name]);
  }

  return (
    <div className="space-y-6">
      <section>
        <Eyebrow className="mb-2.5 block">
          {data.name} · {data.nodes.length} nodes
        </Eyebrow>

        <div className="relative w-full" style={{ height }}>
          <svg
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
            aria-hidden
          >
            {data.nodes.map((node) => {
              if (!node.parentId) return null;
              const parent = byId.get(node.parentId);
              if (!parent) return null;

              return (
                <line
                  key={`${parent.id}-${node.id}`}
                  x1={`${xPercent(parent.depth, parent.slot)}%`}
                  y1={yPx(parent.depth)}
                  x2={`${xPercent(node.depth, node.slot)}%`}
                  y2={yPx(node.depth)}
                  /* Same reasoning as the graph: hairline tokens are too
                     faint for a line on open canvas, especially on dark. */
                  stroke={
                    node.tone === "consumed" ? "var(--color-rule)" : "var(--color-ink-4)"
                  }
                  strokeWidth={1.5}
                />
              );
            })}
          </svg>

          {data.nodes.map((node) => {
            const pointers = pointersByNode.get(node.id) ?? [];

            return (
              <div
                key={node.id}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${xPercent(node.depth, node.slot)}%`,
                  top: yPx(node.depth),
                  transform: "translate(-50%, -50%)",
                }}
              >
                <span
                  className={cn(
                    "flex items-center justify-center rounded-full border font-mono text-[12.5px] tabular-nums transition-colors",
                    NODE_TONE[node.tone ?? "default"],
                  )}
                  style={{ width: NODE, height: NODE }}
                >
                  {node.value}
                </span>

                {pointers.length > 0 ? (
                  <span className="mt-1 font-mono text-[10px] whitespace-nowrap text-brand">
                    {pointers.join(" ")}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {data.frontier ? <FrontierRow frontier={data.frontier} byId={byId} /> : null}

      {data.levels && data.levels.length > 0 ? (
        <section>
          <Eyebrow className="mb-2.5 block">Result · {data.levels.length} levels</Eyebrow>
          <div className="flex flex-wrap gap-2">
            {data.levels.map((level, index) => (
              <span
                key={index}
                className="rounded-control border border-rule bg-paper-sunken px-2.5 py-1 font-mono text-[11.5px] tabular-nums text-ink-2"
              >
                [{level.join(", ")}]
              </span>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

/** The auxiliary queue or stack, rendered left-to-right in holding order. */
function FrontierRow({
  frontier,
  byId,
}: {
  frontier: NonNullable<TreeStructure["frontier"]>;
  byId: Map<string, { value: string | number }>;
}) {
  return (
    <section>
      <Eyebrow className="mb-2.5 block">
        {frontier.label} · {frontier.ids.length}
      </Eyebrow>

      {frontier.ids.length === 0 ? (
        <p className="rounded-card border border-dashed border-rule px-3 py-2 font-mono text-[11px] text-ink-4">
          {frontier.emptyHint ?? "empty"}
        </p>
      ) : (
        <div className="flex flex-wrap items-center gap-1.5">
          {frontier.ids.map((id, index) => (
            <span key={`${id}-${index}`} className="flex items-center gap-1.5">
              {index > 0 ? (
                <span className="font-mono text-[10px] text-ink-4" aria-hidden>
                  ←
                </span>
              ) : null}
              <span className="rounded-control border border-brand/40 bg-tint-brand px-2 py-1 font-mono text-[11.5px] tabular-nums text-brand">
                {byId.get(id)?.value ?? id}
              </span>
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
