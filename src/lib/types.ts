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
  { value: "medium", label: "Medium", words: "150-250 words", chars: "~800-1500 chars" },
  { value: "long", label: "Long", words: "250-400 words", chars: "~1500-2500 chars" },
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
