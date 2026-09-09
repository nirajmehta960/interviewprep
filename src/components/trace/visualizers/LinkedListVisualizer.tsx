import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Section";
import type { LinkedListStructure, NodeTone } from "@/lib/types";

/**
 * Linked list visualizer.
 *
 * Each list gets its own lane so the two inputs and the growing output can be
 * compared column by column — which is the whole point in column-addition
 * problems, where node *i* of every lane belongs to the same place value.
 */

const NODE_TONE: Record<NodeTone, string> = {
  default: "border-rule bg-card text-ink",
  active: "border-brand bg-tint-brand text-brand",
  created: "border-danger bg-tint-danger text-danger",
  consumed: "border-rule-soft bg-paper-sunken text-ink-4",
};

const POINTER_TONE: Record<string, string> = {
  l1: "text-brand",
  l2: "text-brand",
  current: "text-danger",
  prev: "text-warn",
  next: "text-ink-3",
};

export function LinkedListVisualizer({ data }: { data: LinkedListStructure }) {
  // Invert the pointer map so each node knows which pointers land on it.
  const pointersByNode = new Map<string, string[]>();
  for (const [name, nodeId] of Object.entries(data.pointers)) {
    pointersByNode.set(nodeId, [...(pointersByNode.get(nodeId) ?? []), name]);
  }

  return (
    <div className="space-y-7">
      {data.lanes.map((lane) => (
        <section key={lane.label}>
          <Eyebrow className="mb-2.5 block">
            {lane.label}
            {lane.nodes.length > 0 ? ` · ${lane.nodes.length} nodes` : ""}
          </Eyebrow>

          {lane.nodes.length === 0 ? (
            <p className="border border-dashed border-rule px-4 py-3 font-mono text-[11px] text-ink-4">
              {lane.emptyHint ?? "empty"}
            </p>
          ) : (
            <div className="flex flex-wrap items-start gap-y-4">
              {lane.nodes.map((node, index) => {
                const names = pointersByNode.get(node.id) ?? [];

                return (
                  <div key={node.id} className="flex items-start">
                    <div className="flex w-[52px] shrink-0 flex-col items-center">
                      <div
                        className={cn(
                          "flex size-[40px] items-center justify-center border font-mono text-[15px] transition-all duration-150",
                          NODE_TONE[node.tone ?? "default"],
                        )}
                      >
                        {node.value}
                      </div>

                      {/* Pointer labels sit under the node they address. */}
                      <div className="mt-1.5 flex min-h-[30px] flex-col items-center gap-0.5">
                        {names.map((name) => (
                          <span key={name} className="flex flex-col items-center">
                            <span
                              aria-hidden
                              className={cn(
                                "font-mono text-[9px] leading-none",
                                POINTER_TONE[name] ?? "text-ink-3",
                              )}
                            >
                              ▲
                            </span>
                            <span
                              className={cn(
                                "border px-1 font-mono text-[9px] tracking-[0.06em]",
                                POINTER_TONE[name] ?? "text-ink-3",
                                names.length > 0 ? "border-current/30" : "border-rule",
                              )}
                            >
                              {name}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Link arrow to the next node, or to the null terminal. */}
                    {index < lane.nodes.length - 1 ? (
                      <Arrow tone={node.tone === "consumed" ? "faint" : "solid"} />
                    ) : lane.terminal ? (
                      <>
                        <Arrow tone="dashed" />
                        <span
                          className="mt-[10px] flex size-[20px] items-center justify-center rounded-full border border-danger/40 font-mono text-[10px] text-danger/70"
                          title="null"
                        >
                          ø
                        </span>
                      </>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

function Arrow({ tone }: { tone: "solid" | "faint" | "dashed" }) {
  const stroke =
    tone === "solid" ? "var(--color-ink-3)" : tone === "faint" ? "var(--color-rule)" : "var(--color-rule)";

  return (
    <svg
      viewBox="0 0 28 12"
      className="mt-[14px] h-3 w-7 shrink-0"
      aria-hidden
      preserveAspectRatio="none"
    >
      <line
        x1={0}
        y1={6}
        x2={20}
        y2={6}
        stroke={stroke}
        strokeWidth={1.2}
        strokeDasharray={tone === "dashed" ? "3 3" : undefined}
      />
      <path d="M20 2.5 L26 6 L20 9.5 Z" fill={stroke} />
    </svg>
  );
}
