import { BRAND_CONTEXT } from "../context";
import type { ResearchArticle, PostLength } from "../types";

const lengthGuide: Record<PostLength, string> = {
  short: "Total length: 80-150 words (500-800 characters). Sharp and punchy — one strong argument.",
  medium: "Total length: 150-250 words (800-1500 characters). Standard POV with evidence and analysis.",
  long: "Total length: 250-400 words (1500-2500 characters). Deep analysis with multiple data points.",
};

function formatArticle(a: ResearchArticle): string {
  return `Title: ${a.title}\nSource: ${a.source}\nDate: ${a.date}\nSummary: ${a.summary}\nURL: ${a.url}`;
}

export function povPrompt(
  article: ResearchArticle,
  length: PostLength = "medium",
  allArticles?: ResearchArticle[],
  postIndex?: number,
  totalPosts?: number
): string {
  const contextSection = allArticles && allArticles.length > 1
    ? `\n## All Source Articles (use as additional context/data)\n${allArticles.map((a, i) => `${i + 1}. ${formatArticle(a)}`).join("\n\n")}\n\n## Primary Article (focus on this one)\n${formatArticle(article)}`
    : `## Source Article\n${formatArticle(article)}`;

  const multiPostNote = totalPosts && totalPosts > 1 && postIndex !== undefined
    ? `\n\n## Multi-post Note\nThis is post ${postIndex + 1} of ${totalPosts}. Each post should argue a DIFFERENT thesis/angle. Don't repeat arguments.`
    : "";

  return `${BRAND_CONTEXT}

## Task
Write a LinkedIn POV (Point of View / Hot Take) post. Argue a clear, opinionated perspective backed by data.

${contextSection}${multiPostNote}

## POV Format Structure
1. HOOK (1-2 lines): Contrarian or bold opening statement that challenges conventional wisdom
2. DATA (3-5 lines): Present the evidence — specific numbers, company names, dollar amounts
3. ANALYSIS (3-5 lines): What this actually means. Connect the dots others are missing.
   Structure as "If you're [role]: [insight]" or "What this means for [audience]:"
4. PREDICTION/STANCE (2-3 lines): Take a clear position. "This is the new reality." Don't hedge.
5. CTA: Provocative question to drive comments

## Length
${lengthGuide[length]}

## Constraints
- Must argue ONE clear thesis — not a balanced overview
- Use specific data to support every claim
- Tone: Confident, direct, slightly provocative
- Short paragraphs — 1-2 sentences each
- No bullet points — this is narrative, not a list
- Write in English only
- No infographic needed for POV — text-only performs best`;
}
