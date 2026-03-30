export interface ResearchArticle {
  id: string;
  title: string;
  source: string;
  url: string;
  date: string;
  summary: string;
  keyData: string;
  tag?: string;
  selected: boolean;
}

export type ContentFormat = "toplist" | "pov" | "case-study" | "how-to";

export type PostLength = "short" | "medium" | "long";

export type ContentLanguage = "en" | "vn";

export type ResearchSource = "all" | "news" | "linkedin" | "youtube" | "blogs";

export const POST_LENGTHS: { value: PostLength; label: string; words: string; chars: string }[] = [
  { value: "short", label: "Short", words: "80-150 words", chars: "~500-800 chars" },
  { value: "medium", label: "Medium", words: "150-300 words", chars: "~800-1800 chars" },
  { value: "long", label: "Long", words: "400-700 words", chars: "~2500-4500 chars" },
];

export const TONE_PRESETS: { value: string; label: string; desc: string }[] = [
  { value: "default", label: "Default", desc: "Data-driven, confident, accessible" },
  { value: "bold", label: "Bold / Provocative", desc: "Strong opinions, challenge status quo" },
  { value: "educational", label: "Educational", desc: "Explain concepts, teach the reader" },
  { value: "storytelling", label: "Storytelling", desc: "Narrative arc, engage emotionally" },
  { value: "analytical", label: "Analytical", desc: "Deep data analysis, charts-in-words" },
  { value: "custom", label: "Custom", desc: "Write your own tone instructions" },
];

export const RESEARCH_SOURCES: { value: ResearchSource; label: string; icon: string; query?: string }[] = [
  { value: "all", label: "All Sources", icon: "🌐" },
  { value: "news", label: "News", icon: "📰" },
  { value: "linkedin", label: "LinkedIn", icon: "💼", query: "site:linkedin.com" },
  { value: "youtube", label: "YouTube", icon: "▶️", query: "site:youtube.com" },
  { value: "blogs", label: "Blogs & Articles", icon: "📝", query: "blog OR article OR guide" },
];

// Auto-tag rules: keyword patterns -> tag
export const TAG_RULES: { tag: string; patterns: RegExp }[] = [
  { tag: "Funding", patterns: /fund|raise|round|series [a-c]|seed|valuation|invest|vc|venture/i },
  { tag: "AI", patterns: /\bai\b|artificial intelligence|machine learning|llm|gpt|claude|openai/i },
  { tag: "SaaS", patterns: /\bsaas\b|software as a service|subscription|arr|mrr/i },
  { tag: "Tools", patterns: /tool|platform|app|software|stack|framework/i },
  { tag: "Trends", patterns: /trend|report|survey|data|statistic|forecast|prediction/i },
  { tag: "Startup", patterns: /startup|founder|launch|accelerator|incubator|yc|y combinator/i },
  { tag: "Growth", patterns: /growth|marketing|gtm|acquisition|retention|conversion/i },
];

export interface GeneratedPost {
  id: string;
  articleId: string;
  format: ContentFormat;
  content: string;
  imageHtml?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface PipelineSession {
  id: string;
  topic: string;
  articles: ResearchArticle[];
  selectedArticleIds: string[];
  format: ContentFormat;
  posts: GeneratedPost[];
  createdAt: string;
}
