"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { CodeBlock } from "./CodeBlock";
import { Segmented } from "@/components/ui/Controls";
import { Eyebrow } from "@/components/ui/Section";
import type { Language, Solution } from "@/lib/types";

const LABEL: Record<Language, string> = { JAVA: "Java", PYTHON: "Python" };

/** Read-only solution listing with a language toggle and copy action. */
export function SolutionViewer({
  solutions,
  fileLabel,
}: {
  solutions: Solution[];
  fileLabel?: string;
}) {
  const [language, setLanguage] = useState<Language>(solutions[0]?.language ?? "JAVA");
  const [copied, setCopied] = useState(false);

  const solution = solutions.find((s) => s.language === language) ?? solutions[0];
  if (!solution) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(solution.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard access can be denied; the listing is still selectable.
    }
  };

  return (
    <div className="border border-rule bg-card">
      <div className="flex items-center justify-between gap-4 border-b border-rule px-3.5 py-2.5">
        <div className="flex items-center gap-3">
          <Segmented
            label="Solution language"
            value={language}
            onChange={setLanguage}
            options={solutions.map((s) => ({ value: s.language, label: LABEL[s.language] }))}
          />
          {fileLabel ? <Eyebrow className="hidden sm:inline">{fileLabel}</Eyebrow> : null}
        </div>

        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 font-mono text-[10.5px] tracking-[0.07em] text-ink-3 uppercase transition-colors hover:text-brand"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-brand" strokeWidth={2} /> Copied
            </>
          ) : (
            <>
              <Copy className="size-3.5" strokeWidth={1.7} /> Copy
            </>
          )}
        </button>
      </div>

      <CodeBlock lines={solution.code.split("\n")} language={language} className="px-1 py-3" />
    </div>
  );
}
