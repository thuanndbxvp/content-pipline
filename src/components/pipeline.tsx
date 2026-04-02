"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import type {
  ResearchArticle,
  ContentFormat,
  GeneratedPost,
  PostLength,
  ContentLanguage,
  ResearchSource,
  AISettings,
} from "@/lib/types";
import { POST_LENGTHS, TONE_PRESETS, RESEARCH_SOURCES } from "@/lib/types";

const STEPS = ["research", "select", "format", "write"] as const;
const FORMATS: { value: ContentFormat; label: string; icon: string; desc: string }[] = [
  { value: "toplist", label: "Toplist", icon: "📋", desc: "Numbered list with data" },
  { value: "pov", label: "POV", icon: "💡", desc: "Bold opinion backed by data" },
  { value: "case-study", label: "Case Study", icon: "🏢", desc: "Deep-dive one company" },
  { value: "how-to", label: "How-to", icon: "🛠️", desc: "Step-by-step guide" },
];

const UI_TEXT = {
  en: {
    appTitle: "Content Pipeline",
    dismiss: "Dismiss",
    steps: {
      research: "Research",
      select: "Select",
      format: "Format",
      write: "Write",
    },
    topic: "Topic",
    topicPlaceholder: 'e.g. "AI startups funding rounds March 2026"',
    source: "Source",
    research: "Research",
    researching: "Researching...",
    articlesFound: "Articles Found",
    selected: "selected",
    selectAll: "Select all",
    clear: "Clear",
    continueWith: "Continue with",
    article: "article",
    articles: "articles",
    contentFormat: "Content Format",
    tone: "Tone",
    customTonePlaceholder: "Describe your tone...",
    length: "Length",
    outputPosts: "Output Posts",
    sourcesSelected: "sources selected",
    post: "post",
    posts: "posts",
    writeWithClaude: "Write with Claude",
    writing: "Writing...",
    writingPost: "Writing post",
    of: "of",
    copy: "Copy",
    generateImage: "Generate Image",
    generating: "Generating...",
    generatingInfographic: "Generating infographic...",
    downloadPng: "Download PNG",
    startNewPipeline: "Start New Pipeline",
    newsBadge: "NEWS",
    aiSettings: "AI Settings",
    showAiSettings: "Show AI Settings",
    hideAiSettings: "Hide AI Settings",
    useServerKeys: "Use server ENV keys",
    anthropicModel: "Anthropic model",
    anthropicApiKey: "Anthropic API key",
    braveApiKey: "Brave Search API key",
    optionalWhenEnv: "Optional when server ENV keys are configured",
    formats: {
      toplist: { label: "Toplist", desc: "Numbered list with data" },
      pov: { label: "POV", desc: "Bold opinion backed by data" },
      "case-study": { label: "Case Study", desc: "Deep-dive one company" },
      "how-to": { label: "How-to", desc: "Step-by-step guide" },
    },
    tones: {
      default: { label: "Default", desc: "Data-driven, confident, accessible" },
      bold: { label: "Bold / Provocative", desc: "Strong opinions, challenge status quo" },
      educational: { label: "Educational", desc: "Explain concepts, teach the reader" },
      storytelling: { label: "Storytelling", desc: "Narrative arc, engage emotionally" },
      analytical: { label: "Analytical", desc: "Deep data analysis, charts-in-words" },
      custom: { label: "Custom", desc: "Write your own tone instructions" },
    },
    lengths: {
      short: "Short",
      medium: "Medium",
      long: "Long",
    },
    sources: {
      all: "All Sources",
      news: "News",
      linkedin: "LinkedIn",
      youtube: "YouTube",
      blogs: "Blogs & Articles",
    },
  },
  vn: {
    appTitle: "Quy trình nội dung",
    dismiss: "Đóng",
    steps: {
      research: "Nghiên cứu",
      select: "Chọn",
      format: "Định dạng",
      write: "Viết",
    },
    topic: "Chủ đề",
    topicPlaceholder: 'VD: "startup AI gọi vốn tháng 3/2026"',
    source: "Nguồn",
    research: "Nghiên cứu",
    researching: "Đang nghiên cứu...",
    articlesFound: "Bài đã tìm thấy",
    selected: "đã chọn",
    selectAll: "Chọn tất cả",
    clear: "Bỏ chọn",
    continueWith: "Tiếp tục với",
    article: "bài",
    articles: "bài",
    contentFormat: "Định dạng nội dung",
    tone: "Giọng điệu",
    customTonePlaceholder: "Mô tả giọng điệu bạn muốn...",
    length: "Độ dài",
    outputPosts: "Số bài đầu ra",
    sourcesSelected: "nguồn đã chọn",
    post: "bài",
    posts: "bài",
    writeWithClaude: "Viết với Claude",
    writing: "Đang viết...",
    writingPost: "Đang viết bài",
    of: "trên",
    copy: "Sao chép",
    generateImage: "Tạo ảnh",
    generating: "Đang tạo...",
    generatingInfographic: "Đang tạo infographic...",
    downloadPng: "Tải PNG",
    startNewPipeline: "Bắt đầu quy trình mới",
    newsBadge: "TIN",
    aiSettings: "Cấu hình AI",
    showAiSettings: "Hiện cấu hình AI",
    hideAiSettings: "Ẩn cấu hình AI",
    useServerKeys: "Dùng API key từ ENV server",
    anthropicModel: "Model Anthropic",
    anthropicApiKey: "API key Anthropic",
    braveApiKey: "API key Brave Search",
    optionalWhenEnv: "Không bắt buộc nếu server đã có ENV keys",
    formats: {
      toplist: { label: "Toplist", desc: "Danh sách đánh số có dữ liệu" },
      pov: { label: "POV", desc: "Quan điểm mạnh có dữ liệu hỗ trợ" },
      "case-study": { label: "Case Study", desc: "Phân tích sâu một công ty" },
      "how-to": { label: "How-to", desc: "Hướng dẫn từng bước" },
    },
    tones: {
      default: { label: "Mặc định", desc: "Dựa trên dữ liệu, tự tin, dễ hiểu" },
      bold: { label: "Mạnh / Gây tranh luận", desc: "Quan điểm rõ, thách thức số đông" },
      educational: { label: "Giáo dục", desc: "Giải thích khái niệm, giúp người đọc hiểu" },
      storytelling: { label: "Kể chuyện", desc: "Có mạch truyện, tăng kết nối cảm xúc" },
      analytical: { label: "Phân tích", desc: "Phân tích sâu, nhiều dữ kiện" },
      custom: { label: "Tùy chỉnh", desc: "Tự nhập hướng dẫn giọng điệu" },
    },
    lengths: {
      short: "Ngắn",
      medium: "Trung bình",
      long: "Dài",
    },
    sources: {
      all: "Tất cả nguồn",
      news: "Tin tức",
      linkedin: "LinkedIn",
      youtube: "YouTube",
      blogs: "Blog & Bài viết",
    },
  },
} as const;

function Spinner({ size = 14 }: { size?: number }) {
  return (
    <svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

export default function Pipeline() {
  const [step, setStep] = useState(0);
  const [topic, setTopic] = useState("");
  const [researchSource, setResearchSource] = useState<ResearchSource>("all");
  const [articles, setArticles] = useState<ResearchArticle[]>([]);
  const [format, setFormat] = useState<ContentFormat>("toplist");
  const [postLength, setPostLength] = useState<PostLength>("medium");
  const [outputCount, setOutputCount] = useState(1);
  const [tone, setTone] = useState("default");
  const [customTone, setCustomTone] = useState("");
  const [language, setLanguage] = useState<ContentLanguage>("en");
  const [posts, setPosts] = useState<GeneratedPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [writingIndex, setWritingIndex] = useState(-1);
  const [imageLoadingIds, setImageLoadingIds] = useState<Set<string>>(new Set());
  const [showAiSettings, setShowAiSettings] = useState(false);
  const [aiSettings, setAiSettings] = useState<AISettings>({
    useServerKeys: true,
    anthropicModel: "claude-sonnet-4-20250514",
    anthropicApiKey: "",
    braveApiKey: "",
  });

  const t = UI_TEXT[language];
  const selectedArticles = articles.filter((a) => a.selected);
  const cleanContent = (text: string) => text.replace(/\*\*/g, "").replace(/\*([^*]+)\*/g, "$1").replace(/—/g, "-");

  const requestAISettings = useMemo(() => ({
    useServerKeys: aiSettings.useServerKeys,
    anthropicModel: aiSettings.anthropicModel,
    anthropicApiKey: aiSettings.useServerKeys ? undefined : aiSettings.anthropicApiKey?.trim() || undefined,
    braveApiKey: aiSettings.useServerKeys ? undefined : aiSettings.braveApiKey?.trim() || undefined,
  }), [aiSettings]);

  const handleResearch = useCallback(async () => {
    if (!topic.trim()) return;
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, source: researchSource, aiSettings: requestAISettings }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Research failed");
      setArticles(data.articles); setOutputCount(1); setStep(1);
    } catch (err) { setError(err instanceof Error ? err.message : "Research failed"); }
    finally { setLoading(false); }
  }, [topic, researchSource, requestAISettings]);

  const toggleArticle = (id: string) => setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, selected: !a.selected } : a)));
  const selectAll = () => setArticles((prev) => prev.map((a) => ({ ...a, selected: true })));
  const clearAll = () => setArticles((prev) => prev.map((a) => ({ ...a, selected: false })));

  const handleWrite = useCallback(async () => {
    const selected = articles.filter((a) => a.selected);
    if (selected.length === 0) return;
    setStep(3); setLoading(true); setError(null); setPosts([]);
    const count = Math.min(outputCount, selected.length);
    for (let i = 0; i < count; i++) {
      setWritingIndex(i);
      const primaryArticle = selected[i];
      const postId = `post-${Date.now()}-${i}`;
      setPosts((prev) => [...prev, { id: postId, articleId: primaryArticle.id, format, content: "", createdAt: new Date().toISOString() }]);
      try {
        const res = await fetch("/api/write", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            article: primaryArticle,
            format,
            length: postLength,
            allArticles: selected,
            postIndex: i,
            totalPosts: count,
            tone,
            customTone: tone === "custom" ? customTone : undefined,
            language,
            aiSettings: requestAISettings,
          }),
        });
        if (!res.ok) { const errData = await res.json(); throw new Error(errData.error || "Write failed"); }
        const reader = res.body?.getReader(); const decoder = new TextDecoder(); let buffer = "";
        if (reader) {
          let done = false;
          while (!done) {
            const { value, done: d } = await reader.read();
            done = d;
            if (value) {
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() || "";
              for (const line of lines) {
                if (line.startsWith("data: ") && line !== "data: [DONE]") {
                  try {
                    const p = JSON.parse(line.slice(6));
                    if (p.text) setPosts((prev) => prev.map((po) => po.id === postId ? { ...po, content: po.content + p.text } : po));
                  } catch {}
                }
              }
            }
          }
          if (buffer.startsWith("data: ") && buffer !== "data: [DONE]") {
            try {
              const p = JSON.parse(buffer.slice(6));
              if (p.text) setPosts((prev) => prev.map((po) => po.id === postId ? { ...po, content: po.content + p.text } : po));
            } catch {}
          }
        }
      } catch (err) {
        setPosts((prev) => prev.map((p) => p.id === postId && !p.content ? { ...p, content: "[Error: failed to generate]" } : p));
        setError(err instanceof Error ? err.message : "Write failed");
        break;
      }
    }
    setWritingIndex(-1); setLoading(false);
  }, [articles, format, postLength, outputCount, tone, customTone, language, requestAISettings]);

  const handleGenerateImage = useCallback(async (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post || !post.content) return;
    setImageLoadingIds((prev) => new Set(prev).add(postId));
    try {
      const dataRes = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postContent: post.content,
          title: articles.find((a) => a.id === post.articleId)?.title || "",
          format: post.format,
          aiSettings: requestAISettings,
        }),
      });
      const dataJson = await dataRes.json();
      if (!dataRes.ok) throw new Error(dataJson.error);

      const ogRes = await fetch("/api/og", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ infographic: dataJson.infographic }) });
      if (!ogRes.ok) throw new Error("Image render failed");
      const blob = await ogRes.blob(); const imageUrl = URL.createObjectURL(blob);
      setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, imageUrl, imageHtml: JSON.stringify(dataJson.infographic) } : p));
    } catch (err) { setError(err instanceof Error ? err.message : "Image generation failed"); }
    finally { setImageLoadingIds((prev) => { const next = new Set(prev); next.delete(postId); return next; }); }
  }, [posts, articles, requestAISettings]);

  const copyPost = (content: string) => { navigator.clipboard.writeText(cleanContent(content)); };
  const downloadImage = (imageUrl: string, postId: string) => { const a = document.createElement("a"); a.href = imageUrl; a.download = `affitor-${postId}.png`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(imageUrl); };

  const chip = (selected: boolean) =>
    selected
      ? "bg-bg-brand border-primary text-text-brand"
      : "bg-bg-primary border-border-primary text-text-secondary hover:border-border-tertiary";

  return (
    <div className="min-h-screen bg-bg-secondary">
      <header className="h-16 bg-bg-primary border-b border-border-primary sticky top-0 z-10">
        <div className="max-w-[960px] mx-auto px-6 h-full flex items-center gap-2.5">
          <Image src="/affitor-logo.svg" alt="Affitor" width={20} height={20} />
          <span className="text-sm font-semibold text-text-primary">Affitor</span>
          <span className="text-sm font-semibold text-primary">{t.appTitle}</span>
        </div>
      </header>

      <div className="max-w-[960px] mx-auto px-6 py-5">
        <nav className="flex items-center gap-1.5 mb-5">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1.5">
              <button onClick={() => i < step && !loading && setStep(i)}
                className={`h-8 px-3 rounded-lg text-[13px] font-medium transition-all flex items-center gap-1.5 ${
                  i === step ? "bg-primary text-white"
                  : i < step && !loading ? "bg-bg-brand text-text-brand cursor-pointer hover:bg-primary-light"
                  : "bg-bg-tertiary text-text-tertiary cursor-default"
                }`}
              >{i + 1} {t.steps[s]}</button>
              {i < STEPS.length - 1 && <span className="text-text-tertiary text-xs">→</span>}
            </div>
          ))}
        </nav>

        {error && (
          <div className="mb-4 px-4 py-2.5 rounded-lg text-[13px] flex items-center justify-between bg-error-bg text-error-text border border-error/20">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="font-medium text-xs hover:underline ml-4">{t.dismiss}</button>
          </div>
        )}

        {step === 0 && (
          <div className="bg-bg-primary rounded-xl border border-border-primary p-5">
            <div className="text-[13px] font-semibold text-text-primary mb-3">{t.topic}</div>
            <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleResearch()}
              placeholder={t.topicPlaceholder}
              className="w-full h-10 rounded-lg border border-border-secondary px-3 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-border-focus focus:ring-2 focus:ring-border-focus transition-all"
            />
            <div className="mt-4">
              <span className="text-xs font-medium text-text-secondary">{t.source}</span>
              <div className="flex gap-1.5 mt-1.5 flex-wrap">
                {RESEARCH_SOURCES.map((s) => (
                  <button key={s.value} onClick={() => setResearchSource(s.value)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${chip(researchSource === s.value)}`}>{s.icon} {t.sources[s.value]}</button>
                ))}
              </div>
            </div>
            <button onClick={handleResearch} disabled={loading || !topic.trim()} className="mt-5 h-9 px-4 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-hover disabled:opacity-40 transition-all inline-flex items-center gap-2">
              {loading ? <><Spinner /> {t.researching}</> : t.research}
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-bg-primary rounded-xl border border-border-primary p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[13px] font-semibold text-text-primary">{t.articlesFound}</div>
                <span className="text-xs text-text-tertiary">{selectedArticles.length} {t.selected}</span>
              </div>
              <div className="flex gap-3 mb-3">
                <button onClick={selectAll} className="text-xs font-medium text-text-brand hover:underline">{t.selectAll}</button>
                <button onClick={clearAll} className="text-xs font-medium text-text-secondary hover:underline">{t.clear}</button>
              </div>
              <div className="space-y-1.5">
                {articles.map((article) => (
                  <div key={article.id} onClick={() => toggleArticle(article.id)} className={`p-3 rounded-lg border cursor-pointer transition-all ${article.selected ? "border-primary bg-bg-brand" : "border-border-primary bg-bg-primary hover:border-border-secondary"}`}>
                    <div className="flex items-start gap-2.5">
                      <div className={`w-4 h-4 mt-0.5 rounded flex-shrink-0 flex items-center justify-center text-[10px] ${article.selected ? "bg-primary text-white" : "border border-border-secondary bg-bg-primary"}`}>{article.selected ? "✓" : ""}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-text-primary leading-snug">{article.title}</p>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className="text-[11px] font-medium text-text-brand">{article.source}</span>
                          <span className="text-[11px] text-text-tertiary">{article.date}</span>
                          {article.keyData === "News" && <span className="px-1.5 py-px rounded text-[10px] font-medium bg-warning-bg text-warning-text">{t.newsBadge}</span>}
                          {article.tag && <span className="px-1.5 py-px rounded text-[10px] font-medium bg-info-bg text-info-text">{article.tag}</span>}
                        </div>
                        <p className="text-xs text-text-secondary mt-1 line-clamp-2">{article.summary}</p>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[11px] text-text-tertiary hover:text-text-brand mt-1.5 transition-colors"
                        >
                          <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 3H3v10h10v-3M9 2h5v5M14 2L7 9"/></svg>
                          {article.url.replace(/^https?:\/\//, "").substring(0, 60)}{article.url.length > 68 ? "..." : ""}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {selectedArticles.length > 0 && (
              <button onClick={() => { setOutputCount((prev) => Math.min(prev, selectedArticles.length)); setStep(2); }} className="h-9 px-4 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-hover transition-all inline-flex items-center gap-2">{t.continueWith} {selectedArticles.length} {selectedArticles.length > 1 ? t.articles : t.article} →</button>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-bg-primary rounded-xl border border-border-primary p-5 space-y-5">
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-semibold text-text-primary">{t.contentFormat}</div>
                <div className="flex rounded-lg overflow-hidden border border-border-secondary">
                  {(["en", "vn"] as const).map((l) => (
                    <button key={l} onClick={() => setLanguage(l)} className={`px-3 py-1.5 text-xs font-medium transition-all ${language === l ? "bg-primary text-white" : "bg-bg-primary text-text-secondary hover:bg-bg-hover"}`}>{l === "en" ? "🇺🇸 English" : "🇻🇳 Tiếng Việt"}</button>
                  ))}
                </div>
              </div>

              <div>
                <button onClick={() => setShowAiSettings((prev) => !prev)} className="h-8 px-3 rounded-lg text-xs font-medium border border-border-secondary text-text-secondary hover:bg-bg-hover transition-all">
                  {showAiSettings ? t.hideAiSettings : t.showAiSettings}
                </button>

                {showAiSettings && (
                  <div className="mt-3 rounded-lg border border-border-primary bg-bg-secondary p-4 space-y-3">
                    <div className="text-[13px] font-semibold text-text-primary">{t.aiSettings}</div>
                    <label className="flex items-center gap-2 text-xs text-text-secondary">
                      <input
                        type="checkbox"
                        checked={aiSettings.useServerKeys}
                        onChange={(e) => setAiSettings((prev) => ({ ...prev, useServerKeys: e.target.checked }))}
                      />
                      {t.useServerKeys}
                    </label>
                    <p className="text-[11px] text-text-tertiary">{t.optionalWhenEnv}</p>

                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <div className="text-xs font-medium text-text-secondary mb-1.5">{t.anthropicModel}</div>
                        <input
                          type="text"
                          value={aiSettings.anthropicModel}
                          onChange={(e) => setAiSettings((prev) => ({ ...prev, anthropicModel: e.target.value }))}
                          className="w-full h-9 rounded-lg border border-border-secondary px-3 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-border-focus"
                        />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-text-secondary mb-1.5">{t.anthropicApiKey}</div>
                        <input
                          type="password"
                          autoComplete="off"
                          value={aiSettings.anthropicApiKey || ""}
                          onChange={(e) => setAiSettings((prev) => ({ ...prev, anthropicApiKey: e.target.value }))}
                          disabled={aiSettings.useServerKeys}
                          className="w-full h-9 rounded-lg border border-border-secondary px-3 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-border-focus disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-text-secondary mb-1.5">{t.braveApiKey}</div>
                        <input
                          type="password"
                          autoComplete="off"
                          value={aiSettings.braveApiKey || ""}
                          onChange={(e) => setAiSettings((prev) => ({ ...prev, braveApiKey: e.target.value }))}
                          disabled={aiSettings.useServerKeys}
                          className="w-full h-9 rounded-lg border border-border-secondary px-3 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-border-focus disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2">
                {FORMATS.map((f) => (
                  <button key={f.value} onClick={() => setFormat(f.value)} className={`p-3 rounded-lg border text-left transition-all ${chip(format === f.value)}`}>
                    <div className="text-lg">{f.icon}</div>
                    <div className="text-[13px] font-medium text-text-primary mt-1">{t.formats[f.value].label}</div>
                    <div className="text-[11px] text-text-tertiary mt-0.5">{t.formats[f.value].desc}</div>
                  </button>
                ))}
              </div>

              <div>
                <div className="text-[13px] font-semibold text-text-primary mb-3">{t.tone}</div>
                <div className="grid grid-cols-3 gap-2">
                  {TONE_PRESETS.map((tonePreset) => (
                    <button key={tonePreset.value} onClick={() => setTone(tonePreset.value)} className={`p-2.5 rounded-lg border text-left transition-all ${chip(tone === tonePreset.value)}`}>
                      <div className="text-xs font-medium text-text-primary">{t.tones[tonePreset.value as keyof typeof t.tones].label}</div>
                      <div className="text-[11px] text-text-tertiary mt-0.5">{t.tones[tonePreset.value as keyof typeof t.tones].desc}</div>
                    </button>
                  ))}
                </div>
                {tone === "custom" && (
                  <textarea value={customTone} onChange={(e) => setCustomTone(e.target.value)} placeholder={t.customTonePlaceholder}
                    className="mt-2 w-full rounded-lg border border-border-secondary px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-border-focus min-h-[72px]" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <div className="text-[13px] font-semibold text-text-primary mb-3">{t.length}</div>
                  <div className="space-y-1.5">
                    {POST_LENGTHS.map((lengthOption) => (
                      <button key={lengthOption.value} onClick={() => setPostLength(lengthOption.value)} className={`w-full p-2.5 rounded-lg border text-left transition-all flex justify-between items-center ${chip(postLength === lengthOption.value)}`}>
                        <span className="text-[13px] font-medium text-text-primary">{t.lengths[lengthOption.value]}</span>
                        <span className="text-xs text-text-brand">{lengthOption.words}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-text-primary mb-3">{t.outputPosts}</div>
                  <p className="text-xs text-text-secondary mb-2">{selectedArticles.length} {t.sourcesSelected}</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 5].filter(n => n <= selectedArticles.length).map((n) => (
                      <button key={n} onClick={() => setOutputCount(n)} className={`flex-1 py-2.5 rounded-lg border text-center transition-all ${chip(outputCount === n)}`}>
                        <div className="text-base font-bold text-text-primary">{n}</div>
                        <div className="text-[11px] text-text-tertiary">{n > 1 ? t.posts : t.post}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <button onClick={handleWrite} disabled={loading} className="h-9 px-5 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-hover disabled:opacity-40 transition-all inline-flex items-center gap-2">{loading ? <><Spinner /> {t.writing}</> : t.writeWithClaude}</button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            {loading && writingIndex >= 0 && (
              <div className="flex items-center gap-2 text-[13px] text-text-brand"><Spinner /> {t.writingPost} {writingIndex + 1} {t.of} {Math.min(outputCount, selectedArticles.length)}...</div>
            )}
            {posts.map((post, i) => {
              const article = articles.find((a) => a.id === post.articleId);
              const isImageLoading = imageLoadingIds.has(post.id);
              const hasContent = post.content && !post.content.startsWith("[Error:");
              return (
                <div key={post.id} className="bg-bg-primary rounded-xl border border-border-primary p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-bg-brand text-text-brand flex-shrink-0">{t.post} {i + 1}</span>
                      {article && <span className="text-xs text-text-tertiary truncate">{article.title}</span>}
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button onClick={() => copyPost(post.content)} disabled={!hasContent} className="h-7 px-2.5 rounded-md text-xs font-medium border border-border-secondary text-text-secondary hover:bg-bg-hover disabled:opacity-30 transition-all">{t.copy}</button>
                      {!post.imageUrl && !isImageLoading && (
                        <button onClick={() => handleGenerateImage(post.id)} disabled={loading || !hasContent} className="h-7 px-2.5 rounded-md text-xs font-medium bg-bg-brand text-text-brand border border-primary/30 hover:bg-primary-light disabled:opacity-30 transition-all">{t.generateImage}</button>
                      )}
                    </div>
                  </div>
                  <div className="whitespace-pre-wrap text-[13px] leading-relaxed rounded-lg p-4 bg-bg-secondary text-text-primary max-h-[480px] overflow-y-auto">
                    {post.content ? cleanContent(post.content) : <span className="flex items-center gap-2 text-text-tertiary"><Spinner /> {t.generating}</span>}
                  </div>
                  {isImageLoading && <div className="mt-3 flex items-center gap-2 text-xs text-text-brand"><Spinner /> {t.generatingInfographic}</div>}
                  {post.imageUrl && (
                    <div className="mt-3">
                      <Image src={post.imageUrl} alt="Infographic" width={360} height={450} unoptimized className="rounded-lg max-w-[360px] border border-border-primary h-auto" />
                      <button onClick={() => downloadImage(post.imageUrl!, post.id)} className="mt-2 h-7 px-2.5 rounded-md text-xs font-medium bg-success-bg text-success-text border border-success/20 transition-all">{t.downloadPng}</button>
                    </div>
                  )}
                </div>
              );
            })}
            {!loading && posts.length > 0 && (
              <button onClick={() => { setStep(0); setPosts([]); setArticles([]); setTopic(""); setOutputCount(1); }} className="h-9 px-4 rounded-lg text-sm font-medium border border-border-secondary text-text-secondary hover:bg-bg-hover transition-all">{t.startNewPipeline}</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
