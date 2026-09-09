"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Controls";
import { Meter } from "@/components/ui/Tag";
import { Inline } from "@/components/ui/Prose";

export interface NoteField {
  key: string;
  group: string;
  label: string;
  prompt: string;
}

export interface NoteReference {
  label: string;
  detail: string;
  href: string;
}

type SaveState = "idle" | "saving" | "saved";

const AUTOSAVE_DELAY_MS = 700;

/**
 * Structured notebook (Phase 4, F4).
 *
 * Autosave is simulated locally: the debounce, the status badge and the field
 * accounting are all real, but nothing is persisted until the notes API lands.
 */
export function NotesWorkspace({
  slug,
  title,
  fields,
  initialNotes,
  initialFreeform,
  references,
}: {
  slug: string;
  title: string;
  fields: NoteField[];
  initialNotes: Record<string, string>;
  initialFreeform: string;
  references: NoteReference[];
}) {
  const [notes, setNotes] = useState<Record<string, string>>(initialNotes);
  const [freeform, setFreeform] = useState(initialFreeform);
  const [activeKey, setActiveKey] = useState(fields[2]?.key ?? fields[0]?.key ?? "");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [freeformState, setFreeformState] = useState<SaveState>("idle");

  const saveTimer = useRef<number | null>(null);
  const freeformTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      if (freeformTimer.current) window.clearTimeout(freeformTimer.current);
    };
  }, []);

  const activeIndex = fields.findIndex((field) => field.key === activeKey);
  const activeField = fields[activeIndex] ?? fields[0];
  const activeValue = notes[activeField.key] ?? "";

  const filled = fields.filter((field) => (notes[field.key] ?? "").trim().length > 0).length;

  const groups = useMemo(() => {
    const order: string[] = [];
    const map = new Map<string, NoteField[]>();
    for (const field of fields) {
      if (!map.has(field.group)) {
        map.set(field.group, []);
        order.push(field.group);
      }
      map.get(field.group)?.push(field);
    }
    return order.map((group) => ({ group, items: map.get(group) ?? [] }));
  }, [fields]);

  const wordCount = activeValue.trim().length === 0 ? 0 : activeValue.trim().split(/\s+/).length;

  const updateField = (value: string) => {
    setNotes((current) => ({ ...current, [activeField.key]: value }));
    setSaveState("saving");
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => setSaveState("saved"), AUTOSAVE_DELAY_MS);
  };

  const updateFreeform = (value: string) => {
    setFreeform(value);
    setFreeformState("saving");
    if (freeformTimer.current) window.clearTimeout(freeformTimer.current);
    freeformTimer.current = window.setTimeout(() => setFreeformState("saved"), AUTOSAVE_DELAY_MS);
  };

  const SaveBadge = ({ state }: { state: SaveState }) => {
    if (state === "saving")
      return (
        <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] tracking-[0.07em] text-ink-3 uppercase">
          <Loader2 className="size-3 animate-spin" strokeWidth={2} /> Saving
        </span>
      );
    if (state === "saved")
      return (
        <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] tracking-[0.07em] text-brand uppercase">
          <Check className="size-3" strokeWidth={2.2} /> Saved
        </span>
      );
    return <Eyebrow>Autosave on</Eyebrow>;
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[168px_minmax(0,1fr)_286px]">
      {/* Note map ---------------------------------------------------------- */}
      <aside className="xl:sticky xl:top-8 xl:h-fit">
        <div className="flex items-baseline justify-between gap-2">
          <Eyebrow>Note map</Eyebrow>
          <span className="font-mono text-[10px] tabular-nums text-ink-4">
            {String(fields.length).padStart(2, "0")}
          </span>
        </div>

        <nav className="mt-4 space-y-4" aria-label="Note fields">
          {groups.map(({ group, items }) => (
            <div key={group}>
              <Eyebrow className="block pb-1.5">{group}</Eyebrow>
              <ul>
                {items.map((field) => {
                  const isActive = field.key === activeField.key;
                  const hasContent = (notes[field.key] ?? "").trim().length > 0;

                  return (
                    <li key={field.key}>
                      <button
                        type="button"
                        onClick={() => setActiveKey(field.key)}
                        aria-current={isActive ? "true" : undefined}
                        className={cn(
                          "relative flex w-full items-center gap-2 py-1.5 pl-3 text-left text-[13px] transition-colors",
                          isActive ? "font-medium text-brand" : "text-ink-2 hover:text-ink",
                        )}
                      >
                        {isActive ? (
                          <span className="absolute top-1 bottom-1 left-0 w-[2px] bg-brand" aria-hidden />
                        ) : null}
                        <span
                          aria-hidden
                          className={cn(
                            "size-[7px] shrink-0 border",
                            hasContent ? "border-brand bg-brand" : "border-ink-4 bg-transparent",
                          )}
                        />
                        <span className="min-w-0 flex-1 truncate">{field.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mt-6 border-t border-rule pt-4">
          <Eyebrow className="block pb-2">Fields filled</Eyebrow>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[12px] tabular-nums text-ink">
              {String(filled).padStart(2, "0")} / {String(fields.length).padStart(2, "0")}
            </span>
            <Meter value={filled} max={fields.length} width="w-14" />
          </div>
        </div>
      </aside>

      {/* Editor ------------------------------------------------------------ */}
      <div className="min-w-0">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-2.5">
            <span className="marker-num">{String(activeIndex + 1).padStart(2, "0")}</span>
            <Eyebrow>{activeField.group}</Eyebrow>
          </div>
          <Eyebrow>
            Field {String(activeIndex + 1).padStart(2, "0")} / {String(fields.length).padStart(2, "0")}
          </Eyebrow>
        </div>

        <h1 className="text-[30px] leading-tight">{activeField.label}</h1>
        <p className="mt-2 text-[14.5px] text-ink-2">{activeField.prompt}</p>

        <div className="mt-6 border border-rule bg-card">
          <div className="flex items-center justify-between gap-3 border-b border-rule px-4 py-2.5">
            <Eyebrow>Note · plain text</Eyebrow>
            <SaveBadge state={saveState} />
          </div>

          <textarea
            value={activeValue}
            onChange={(event) => updateField(event.target.value)}
            placeholder={activeField.prompt}
            rows={12}
            className="ruled w-full resize-y bg-transparent px-5 py-2 text-[14.5px] leading-8 text-ink outline-none placeholder:text-ink-4"
          />

          <div className="flex items-center justify-between gap-3 border-t border-rule px-4 py-2.5">
            <Eyebrow>
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </Eyebrow>
            <Eyebrow>Local draft</Eyebrow>
          </div>
        </div>

        {/* Rendered preview so markdown-ish input reads back cleanly. */}
        {activeValue.trim().length > 0 ? (
          <div className="mt-6">
            <Eyebrow className="block pb-2.5">Reads back as</Eyebrow>
            <div className="space-y-3 border-l-2 border-brand/30 pl-5 text-[14.5px] leading-[1.75] text-ink-2">
              {activeValue.split("\n\n").map((paragraph, index) => (
                <p key={index}>
                  <Inline text={paragraph} />
                </p>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-8 flex items-center justify-between border-t border-rule pt-4">
          <Button
            variant="quiet"
            size="sm"
            disabled={activeIndex === 0}
            onClick={() => setActiveKey(fields[Math.max(0, activeIndex - 1)].key)}
          >
            Previous field
          </Button>
          <Eyebrow>{title}</Eyebrow>
          <Button
            variant="outline"
            size="sm"
            disabled={activeIndex === fields.length - 1}
            onClick={() => setActiveKey(fields[Math.min(fields.length - 1, activeIndex + 1)].key)}
          >
            Next field
            <ChevronDown className="size-3.5" strokeWidth={1.8} />
          </Button>
        </div>
      </div>

      {/* Free-form + references -------------------------------------------- */}
      <aside className="space-y-6">
        <div className="border border-rule bg-card">
          <div className="flex items-center justify-between gap-3 border-b border-rule px-3.5 py-2.5">
            <Eyebrow>Free-form notes</Eyebrow>
            <SaveBadge state={freeformState} />
          </div>
          <textarea
            value={freeform}
            onChange={(event) => updateFreeform(event.target.value)}
            placeholder="Unstructured scratch space"
            rows={10}
            className="w-full resize-y bg-transparent px-3.5 py-3 text-[13px] leading-[1.75] text-ink outline-none placeholder:text-ink-4"
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-2 pb-2.5">
            <Eyebrow>Linked references</Eyebrow>
            <span className="font-mono text-[10px] tabular-nums text-ink-4">
              {String(references.length).padStart(2, "0")}
            </span>
          </div>

          <ul className="border-t border-rule-soft">
            {references.map((reference) => (
              <li key={reference.href} className="border-b border-rule-soft">
                <Link
                  href={reference.href}
                  className="group flex items-baseline justify-between gap-3 py-2.5"
                >
                  <span className="min-w-0">
                    <span className="block text-[13px] text-ink group-hover:text-brand">
                      {reference.label}
                    </span>
                    <span className="block truncate text-[11.5px] text-ink-3">
                      {reference.detail}
                    </span>
                  </span>
                  <span aria-hidden className="text-ink-4 group-hover:text-brand">
                    ↗
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-rule pt-4">
          <Eyebrow className="block pb-2">Presentation</Eyebrow>
          <Link
            href={`/questions/${slug}`}
            className="flex items-center justify-between gap-3 border border-brand/40 bg-tint-brand px-3.5 py-3 transition-colors hover:border-brand"
          >
            <span className="text-[13px] text-brand">Interview explanation</span>
            <span aria-hidden className="text-brand">
              ↗
            </span>
          </Link>
          <p className="mt-2 text-[11.5px] leading-relaxed text-ink-3">
            Present the saved field as a clear 60-second answer.
          </p>
        </div>
      </aside>
    </div>
  );
}
