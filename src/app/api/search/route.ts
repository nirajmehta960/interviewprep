import { NextResponse } from "next/server";
import { searchQuestions } from "@/server/repositories/question.repository";

/**
 * Command palette search.
 *
 * Server-side rather than shipping the whole question list to the client —
 * the catalog grows as topics are filled in, and this stays constant-size.
 */
export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q") ?? "";

  try {
    const results = await searchQuestions(query, 8);
    return NextResponse.json({ results });
  } catch (error) {
    console.error("search failed", error);
    return NextResponse.json({ results: [], error: "Search is unavailable." }, { status: 500 });
  }
}
