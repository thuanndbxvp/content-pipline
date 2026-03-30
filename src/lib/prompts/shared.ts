import type { ResearchArticle, PostLength } from "../types";

export const lengthGuide: Record<PostLength, string> = {
  short: "Total length: 80-150 words. Concise, punchy. Every word earns its place.",
  medium: "Total length: 150-300 words. Standard LinkedIn post with substance.",
  long: "Total length: 400-700 words. Article-length deep dive. Multiple sections, thorough analysis. This should read like a mini-article, not just a long post.",
};

export const toneGuide: Record<string, string> = {
  default: "Tone: Data-driven, confident, accessible. Not academic, not hype.",
  bold: "Tone: Provocative, contrarian. Challenge conventional wisdom. Take strong positions. Use rhetorical questions.",
  educational: "Tone: Teacher mode. Break down complex ideas simply. Use analogies. 'Here is why this matters' framing.",
  storytelling: "Tone: Narrative-driven. Start with a scene or moment. Build tension. Reveal the insight. Make the reader feel something.",
  analytical: "Tone: Deep analysis. Compare numbers, spot patterns, connect dots. Think like a research analyst writing for a smart audience.",
};

export function formatArticle(a: ResearchArticle): string {
  return `Title: ${a.title}\nSource: ${a.source}\nDate: ${a.date}\nSummary: ${a.summary}`;
}

export function buildContextSection(
  article: ResearchArticle,
  allArticles?: ResearchArticle[]
): string {
  if (allArticles && allArticles.length > 1) {
    return `## All Source Articles (use as context/data)\n${allArticles.map((a, i) => `${i + 1}. ${formatArticle(a)}`).join("\n\n")}\n\n## Primary Article (main focus)\n${formatArticle(article)}`;
  }
  return `## Source Article\n${formatArticle(article)}`;
}

export function buildMultiPostNote(postIndex?: number, totalPosts?: number): string {
  if (totalPosts && totalPosts > 1 && postIndex !== undefined) {
    return `\n\n## Multi-post Note\nThis is post ${postIndex + 1} of ${totalPosts}. Each post MUST have a completely different angle/focus. Do not repeat content across posts.`;
  }
  return "";
}

export function buildToneSection(tone: string, customTone?: string): string {
  if (tone === "custom" && customTone) {
    return `## Tone\n${customTone}`;
  }
  return `## Tone\n${toneGuide[tone] || toneGuide.default}`;
}
