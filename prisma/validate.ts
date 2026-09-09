import { catalog, extraProblems, fundamentalProblems, topInterview150 } from "../src/lib/data/catalog";
import { authoredProblems } from "../src/lib/data/problems";
import { categories, patterns } from "../src/lib/data/taxonomy";

/**
 * Catalog integrity check.
 *
 * Runs without a database, so content errors are caught before a seed is
 * attempted. `npm run db:seed` performs the same assertions.
 */

const errors: string[] = [];

const slugs = new Set<string>();
for (const entry of catalog) {
  if (slugs.has(entry.slug)) errors.push(`duplicate slug: ${entry.slug}`);
  slugs.add(entry.slug);
}

// Only numbered problems can collide; fundamentals exercises have no number.
const numbers = new Set<number>();
for (const entry of catalog) {
  if (entry.number === null) continue;
  if (numbers.has(entry.number)) errors.push(`duplicate problem number: ${entry.number}`);
  numbers.add(entry.number);
}

if (topInterview150.length !== 150) {
  errors.push(`study plan should hold 150 problems, found ${topInterview150.length}`);
}

const categorySlugs = new Set(categories.map((c) => c.slug));
for (const entry of catalog) {
  if (!categorySlugs.has(entry.categorySlug)) {
    errors.push(`${entry.slug}: unknown category "${entry.categorySlug}"`);
  }
}

const patternSlugs = new Set(patterns.map((p) => p.slug));
for (const entry of catalog) {
  for (const slug of entry.patternSlugs) {
    if (!patternSlugs.has(slug)) errors.push(`${entry.slug}: unknown pattern "${slug}"`);
  }
}

for (const writeUp of authoredProblems) {
  if (!slugs.has(writeUp.slug)) errors.push(`write-up "${writeUp.slug}" has no catalog entry`);
}

// Slugs drive the LeetCode URL, so a typo would produce a dead link.
for (const entry of catalog) {
  // Fundamentals exercises have no upstream problem, so no URL to check.
  if (entry.leetcodeUrl !== null) {
    const expected = `https://leetcode.com/problems/${entry.slug}/`;
    if (entry.leetcodeUrl !== expected) errors.push(`${entry.slug}: url does not match slug`);
  }
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(entry.slug)) errors.push(`${entry.slug}: malformed slug`);
  if (!entry.synopsis.trim()) errors.push(`${entry.slug}: empty synopsis`);
}

console.log(
  `Catalog: ${catalog.length} problems (${topInterview150.length} plan + ${extraProblems.length} extra + ${fundamentalProblems.length} fundamentals)`,
);
console.log(`Categories: ${categories.length}   Patterns: ${patterns.length}`);
console.log(`Write-ups: ${authoredProblems.length}\n`);

console.log("Per-category counts vs the study plan:");
for (const category of categories) {
  const actual = topInterview150.filter((p) => p.categorySlug === category.slug).length;
  const ok = actual === category.problemCount;
  if (!ok) {
    errors.push(
      `category "${category.slug}" declares ${category.problemCount} but catalog has ${actual}`,
    );
  }
  console.log(
    `  ${ok ? "ok  " : "FAIL"} ${category.name.padEnd(22)} ${String(actual).padStart(3)} / ${category.problemCount}`,
  );
}

const difficulties = topInterview150.reduce<Record<string, number>>((acc, p) => {
  acc[p.difficulty] = (acc[p.difficulty] ?? 0) + 1;
  return acc;
}, {});
console.log(`\nDifficulty spread: ${JSON.stringify(difficulties)}`);

if (errors.length > 0) {
  console.error(`\n${errors.length} error(s):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log("\nAll integrity checks pass.");
