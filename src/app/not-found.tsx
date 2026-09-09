import Link from "next/link";
import { Eyebrow } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[520px] px-8 py-28 text-center">
      <Eyebrow className="block">404 / not in the index</Eyebrow>
      <h1 className="mt-4 text-[34px] leading-tight">That page is not in the notebook.</h1>
      <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">
        The record may have been renamed, or the slug may be misspelled.
      </p>
      <div className="mt-7 flex justify-center gap-6">
        <Link href="/" className="link-quiet font-sans text-[11px] tracking-[0.07em] text-brand uppercase">
          Study desk
        </Link>
        <Link
          href="/problems"
          className="link-quiet font-sans text-[11px] tracking-[0.07em] text-brand uppercase"
        >
          Problem index
        </Link>
      </div>
    </div>
  );
}
