export interface ResearchArticle {
  id: string;
  title: string;
  source: string;
  url: string;
  date: string;
  summary: string;
  keyData: string;
  selected: boolean;
}

export type ContentFormat = "toplist" | "pov" | "case-study";

export type PostLength = "short" | "medium" | "long";

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
