import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Minimal inline renderer for `code`, **bold** and *italic* spans.
 *
 * The note and problem content is authored as light markdown. A full markdown
 * pipeline is not warranted for three inline forms, and keeping it to a plain
 * function means it works in server components with no client bundle cost.
 *
 * The alternation order matters: `**bold**` must be tried before `*italic*`,
 * or the italic branch would match the first two asterisks of a bold span.
 */
export function Inline({ text }: { text: string }) {
  const tokens = text
    .split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*\n]+\*)/g)
    .filter((token) => token.length > 0);

  return (
    <>
      {tokens.map((token, index) => {
        if (token.startsWith("`") && token.endsWith("`") && token.length > 2) {
          return (
            <code key={index} className="code-chip">
              {token.slice(1, -1)}
            </code>
          );
        }
        if (token.startsWith("**") && token.endsWith("**") && token.length > 4) {
          return (
            <strong key={index} className="font-medium text-ink">
              {token.slice(2, -2)}
            </strong>
          );
        }
        if (token.startsWith("*") && token.endsWith("*") && token.length > 2) {
          return <em key={index}>{token.slice(1, -1)}</em>;
        }
        return <span key={index}>{token}</span>;
      })}
    </>
  );
}

/**
 * Strip the inline markers for contexts that render plain text — page
 * metadata, `title` attributes, and anything read by a crawler.
 */
export function stripInline(text: string): string {
  return text.replace(/`([^`]+)`/g, "$1").replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1");
}

/** Paragraph stack with inline markdown applied. */
export function Paragraphs({
  items,
  className,
  size = "base",
}: {
  items: string[];
  className?: string;
  size?: "base" | "lead";
}) {
  return (
    <div
      className={cn(
        "space-y-3",
        size === "lead" ? "text-[15.5px] leading-[1.7]" : "text-[14.5px] leading-[1.7]",
        "text-ink-2",
        className,
      )}
    >
      {items.map((item, index) => (
        <p key={index}>
          <Inline text={item} />
        </p>
      ))}
    </div>
  );
}

/**
 * Numbered list where the marker sits in its own column, so wrapped lines
 * align under the text rather than under the number.
 */
export function NumberedList({
  items,
  className,
  divided = true,
}: {
  items: (string | ReactNode)[];
  className?: string;
  divided?: boolean;
}) {
  return (
    <ol className={cn(divided && "border-t border-rule-soft", className)}>
      {items.map((item, index) => (
        <li
          key={index}
          className={cn(
            "flex gap-4 py-3",
            divided && "border-b border-rule-soft",
          )}
        >
          <span className="marker-num mt-[5px] w-5 shrink-0">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="min-w-0 flex-1 text-[14.5px] leading-[1.65] text-ink-2">
            {typeof item === "string" ? <Inline text={item} /> : item}
          </span>
        </li>
      ))}
    </ol>
  );
}
