import { BRAND_CONTEXT } from "../context";
import type { ResearchArticle, PostLength } from "../types";

const lengthGuide: Record<PostLength, string> = {
  short: "Total length: 80-150 words (500-800 characters). Keep it punchy — 3-5 list items max.",
  medium: "Total length: 150-250 words (800-1500 characters). Standard LinkedIn post — 5-7 list items.",
  long: "Total length: 250-400 words (1500-2500 characters). Comprehensive list — 7-10 items with details.",
};

function formatArticle(a: ResearchArticle): string {
  return `Title: ${a.title}\nSource: ${a.source}\nDate: ${a.date}\nSummary: ${a.summary}\nURL: ${a.url}`;
}

export function toplistPrompt(
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
    ? `\n\n## Multi-post Note\nThis is post ${postIndex + 1} of ${totalPosts}. Each post should have a DIFFERENT angle/focus. Don't repeat the same content across posts.`
    : "";

  return `${BRAND_CONTEXT}

## Task
Write a LinkedIn Toplist post. The post should curate and present key items in a numbered list format.

${contextSection}${multiPostNote}

## Toplist Format Structure
1. HOOK (1-2 lines): Start with a compelling stat or bold claim that stops the scroll
2. CONTEXT (2-3 lines): Why this matters right now, cite the source
3. NUMBERED LIST (5-10 items): Each item has:
   - Name/entity (company, tool, fund, etc.)
   - → Key detail or data point
   - Specific metric when available
4. TAKEAWAY (2-3 lines): What pattern emerges, what it means for the reader
5. CTA: Engagement question OR soft Affitor mention

## Length
${lengthGuide[length]}

## Constraints
- Every item must have specific data from the source
- Use numbered list (1, 2, 3...) with → for sub-details
- No generic filler — every sentence adds value
- Write in English only
- Use Unicode bold for section emphasis where appropriate
- Include source attribution`;
}
