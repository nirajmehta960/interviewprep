import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, DocPage } from "@/components/layout/DocShell";
import { Eyebrow, SectionKicker } from "@/components/ui/Section";
import { getRoleTree } from "@/server/repositories/taxonomy.repository";

export const dynamic = "force-dynamic";

/**
 * Role hub (Phase 2, F2).
 *
 * Preparation categories with their topic cards — read entirely from the
 * database, so a newly seeded topic appears here automatically.
 */
export default async function RoleHubPage({ params }: { params: Promise<{ role: string }> }) {
  const { role: roleSlug } = await params;
  const tree = await getRoleTree(roleSlug);
  if (!tree) notFound();

  const readyTopics = tree.categories
    .flatMap((category) => category.topics)
    .filter((topic) => topic.questionCount > 0);

  return (
    <>
      <Breadcrumbs
        crumbs={[{ label: "Roles", href: "/" }, { label: tree.name }]}
        meta={[`${tree.questionCount} questions`, `${readyTopics.length} topics ready`]}
      />

      <DocPage>
        <SectionKicker index={1} label="Role hub" className="mb-4" />
        <h1 className="max-w-[22ch] text-[40px] leading-[1.08]">{tree.name}</h1>
        <p className="mt-4 max-w-[60ch] text-[15.5px] leading-relaxed text-ink-2">
          {tree.description}
        </p>

        {tree.categories.map((category, categoryIndex) => (
          <section key={category.slug} className="mt-12">
            <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-rule pb-2.5">
              <div className="flex items-baseline gap-2.5">
                <span className="marker-num">{String(categoryIndex + 1).padStart(2, "0")}</span>
                <h2 className="text-[21px]">{category.name}</h2>
              </div>
              <Eyebrow>
                {category.topics.reduce((sum, topic) => sum + topic.questionCount, 0)} questions
              </Eyebrow>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {category.topics.map((topic) => {
                const ready = topic.questionCount > 0;

                return (
                  <Link
                    key={topic.slug}
                    href={`/roles/${tree.slug}/${topic.slug}`}
                    className="group flex flex-col rounded-card border border-rule bg-card p-4 shadow-card transition-all hover:border-brand/40 hover:shadow-card-hover"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex size-[22px] shrink-0 items-center justify-center border border-rule bg-paper-sunken font-sans text-[9px] tracking-[0.04em] text-ink-3">
                        {topic.monogram}
                      </span>
                      <span
                        className={
                          ready
                            ? "font-sans text-[11.5px] tabular-nums text-brand"
                            : "font-sans text-[11.5px] text-ink-4"
                        }
                      >
                        {ready ? topic.questionCount : "soon"}
                      </span>
                    </div>

                    <h3 className="mt-3 font-display text-[17px] leading-snug text-ink transition-colors group-hover:text-brand">
                      {topic.name}
                    </h3>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-3">{topic.blurb}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </DocPage>
    </>
  );
}
