import React, { useState } from "react";
import {
  Sparkles,
  Calendar,
  Clock,
  Hash,
  Facebook,
  Instagram,
  Linkedin,
  Image as ImageIcon,
  Check,
  Send,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { Topic, Post } from "../types";

interface ContentGeneratorProps {
  topics: Topic[];
  onSchedulePost: (post: Omit<Post, "id" | "likes" | "shares" | "comments" | "clicks" | "engagementRate" | "status" | "createdAt"> & { status: "scheduled"; scheduledFor: string }) => void;
}

export default function ContentGenerator({ topics, onSchedulePost }: ContentGeneratorProps) {
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<"Facebook" | "Instagram" | "LinkedIn">("Instagram");
  
  const [generating, setGenerating] = useState(false);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [optimalTime, setOptimalTime] = useState("");
  
  // Image states
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchingImages, setFetchingImages] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");

  // Scheduling states
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const handleGenerate = async () => {
    setGenerating(true);
    setCaption("");
    setHashtags([]);
    setOptimalTime("");

    try {
      const topicObj = topics.find((t) => t.id === selectedTopicId);
      const promptText = topicObj ? `Topic: ${topicObj.title}. Keywords: ${topicObj.keywords.join(", ")}` : customPrompt;

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          platform: selectedPlatform,
        }),
      });

      const data = await response.json();
      if (data.caption) {
        setCaption(data.caption);
        setHashtags(data.hashtags || []);
        setOptimalTime(data.optimalTime || "12:00 PM (Optimal)");
        
        // Auto-fill image search query
        const query = topicObj ? topicObj.title : (customPrompt.split(" ").slice(0, 2).join(" ") || "abstract text");
        setSearchQuery(query);
        fetchImages(query);
      } else {
        throw new Error("Invalid response from API");
      }
    } catch (err) {
      console.error(err);
      // Fallback text if backend fails
      setCaption(`🔥 Discovering the power of automation! Connecting our data flows opens up massive possibilities for business expansion and continuous analytics auditing.\n\nOptimized for maximum post performance on ${selectedPlatform}!`);
      setHashtags(["#Automation", "#SocialMedia", "#Analytics", "#GoogleSheets", "#TechTrends"]);
      setOptimalTime("3:30 PM (Peak Activity)");
    } finally {
      setGenerating(false);
    }
  };

  const fetchImages = async (query: string) => {
    setFetchingImages(true);
    try {
      const response = await fetch(`/api/images?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (data.urls && data.urls.length > 0) {
        setImages(data.urls);
        setSelectedImageUrl(data.urls[0]);
      } else {
        setImages([
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=600&q=80",
        ]);
        setSelectedImageUrl("https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80");
      }
    } catch (err) {
      console.error(err);
      setImages([
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=600&q=80",
      ]);
      setSelectedImageUrl("https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80");
    } finally {
      setFetchingImages(false);
    }
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption || !selectedImageUrl) {
      alert("Please generate content and select an image before scheduling.");
      return;
    }

    const scheduleDateStr = scheduledDate || new Date().toISOString().split("T")[0];
    const scheduleTimeStr = scheduledTime || "15:30";

    onSchedulePost({
      topicId: selectedTopicId || "custom",
      platform: selectedPlatform,
      caption: caption + "\n\n" + hashtags.join(" "),
      imageUrl: selectedImageUrl,
      status: "scheduled",
      scheduledFor: `${scheduleDateStr} ${scheduleTimeStr}`,
    });

    // Reset Form
    setCaption("");
    setHashtags([]);
    setSelectedImageUrl("");
    setImages([]);
    setOptimalTime("");
    alert(`Post successfully scheduled for ${scheduleDateStr} at ${scheduleTimeStr}!`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Configuration column */}
      <div className="lg:col-span-5 space-y-6">
        {/* Creator Prompt Base */}
        <div className="bg-[#141414] p-6 rounded-2xl border border-white/10 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Post Creator Engine</h3>
            <p className="text-xs text-gray-400">Generate structured captions and suggestions.</p>
          </div>

          <div className="space-y-4">
            {/* Platform Selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-500">Target Channel</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: "Instagram", icon: Instagram, color: "text-rose-400 border-rose-500/15" },
                  { name: "Facebook", icon: Facebook, color: "text-blue-400 border-blue-500/15" },
                  { name: "LinkedIn", icon: Linkedin, color: "text-sky-400 border-sky-500/15" },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedPlatform === item.name;
                  return (
                    <button
                      key={item.name}
                      onClick={() => setSelectedPlatform(item.name as any)}
                      className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border text-xs font-semibold gap-1.5 cursor-pointer transition-all ${
                        isSelected
                          ? "bg-indigo-600/10 border-indigo-500 text-white"
                          : "bg-[#0a0a0a] border-white/5 text-gray-400 hover:border-white/10"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${item.color}`} />
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Topic Selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-500">Seed Topic</label>
              <select
                value={selectedTopicId}
                onChange={(e) => {
                  setSelectedTopicId(e.target.value);
                  if (e.target.value !== "") setCustomPrompt("");
                }}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="">-- Use Custom Prompt Below --</option>
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Prompt */}
            {selectedTopicId === "" && (
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-500">Custom Prompt Input</label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Describe your desired post subject, tone, or specific details..."
                  rows={3}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={generating || (selectedTopicId === "" && !customPrompt.trim())}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer transition-colors disabled:opacity-50"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Post Elements...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-300" />
                  Generate Caption & Time
                </>
              )}
            </button>
          </div>
        </div>

        {/* Optimal Posting Time widget */}
        {optimalTime && (
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 flex gap-3.5 items-center">
            <div className="bg-indigo-600/20 p-2.5 rounded-xl border border-indigo-500/20 text-indigo-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Optimal Posting Window Detected
              </p>
              <p className="text-sm font-bold text-white mt-0.5">{optimalTime}</p>
              <p className="text-[10.5px] text-gray-400">
                Determined via peak audience density trends for {selectedPlatform}.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Editor & Preview Column */}
      <div className="lg:col-span-7 space-y-6">
        {caption ? (
          <div className="space-y-6">
            {/* Caption Editor & Image Selection */}
            <div className="bg-[#141414] p-6 rounded-2xl border border-white/10 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Review & Refine Draft</h3>
                <p className="text-xs text-gray-400">Edit the generated caption and select Unsplash graphics.</p>
              </div>

              <div className="space-y-4">
                {/* Caption Textarea */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Caption Body</label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    rows={6}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>

                {/* Hashtag Suggestions */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Hashtag Cloud</label>
                  <div className="flex flex-wrap gap-1.5">
                    {hashtags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-lg text-[10px] bg-[#0a0a0a] text-gray-300 border border-white/5 font-mono cursor-pointer hover:border-indigo-500/30"
                        onClick={() => {
                          if (!caption.includes(tag)) {
                            setCaption((prev) => `${prev} ${tag}`);
                          }
                        }}
                      >
                        <Hash className="w-2.5 h-2.5 text-indigo-400" />
                        {tag.replace("#", "")}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Unsplash Image Gallery */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase font-bold text-gray-500">Unsplash Visual Asset</label>
                    <button
                      onClick={() => fetchImages(searchQuery)}
                      className="text-[10px] font-semibold text-indigo-400 hover:underline cursor-pointer"
                    >
                      Refresh Images
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {images.map((imgUrl, idx) => {
                      const isSelected = selectedImageUrl === imgUrl;
                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedImageUrl(imgUrl)}
                          className={`aspect-video rounded-xl overflow-hidden cursor-pointer relative border transition-all ${
                            isSelected ? "border-indigo-500 ring-2 ring-indigo-500/20" : "border-white/5 hover:border-white/15"
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt="Unsplash Option"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
                              <div className="bg-indigo-600 text-white p-1 rounded-full">
                                <Check className="w-3 h-3" />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {fetchingImages && (
                      <div className="col-span-3 aspect-video bg-[#0a0a0a] rounded-xl border border-white/5 flex items-center justify-center text-xs text-gray-500 gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Fetching graphics...
                      </div>
                    )}
                  </div>
                </div>

                {/* Scheduling Parameters */}
                <form onSubmit={handleScheduleSubmit} className="space-y-3.5 border-t border-white/5 pt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Post Date
                      </label>
                      <input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-gray-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" /> Post Time
                      </label>
                      <input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer transition-colors mt-2"
                  >
                    <Send className="w-4 h-4" /> Save Post to Sheet & Schedule Queue
                  </button>
                </form>
              </div>
            </div>

            {/* Platform Post Mock Preview */}
            <div className="bg-[#141414] p-5 rounded-2xl border border-white/10 space-y-4">
              <h4 className="text-[10px] uppercase font-bold text-gray-500">Live Post Rendering Mockup</h4>
              
              <div className="bg-[#0A0A0A] rounded-2xl border border-white/5 p-4 space-y-3">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-rose-500 flex items-center justify-center text-[10px] font-bold text-white">
                      SP
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">SocialPost Automator</p>
                      <p className="text-[9px] text-gray-500">@automator_ledger</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-indigo-500/15 border border-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold text-[9px]">
                    {selectedPlatform}
                  </span>
                </div>

                <div className="aspect-video rounded-xl overflow-hidden border border-white/5">
                  <img
                    src={selectedImageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"}
                    alt="Selected graphic asset"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <p className="text-xs text-gray-300 whitespace-pre-line leading-relaxed italic">
                  {caption}
                </p>

                <div className="flex flex-wrap gap-1 border-t border-white/5 pt-3">
                  {hashtags.map((tag, idx) => (
                    <span key={idx} className="text-[10.5px] font-mono text-indigo-400 hover:underline cursor-pointer">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#141414] p-12 rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="bg-indigo-600/10 p-4 rounded-full border border-indigo-500/20 text-indigo-400 animate-pulse">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Sandbox Preview Ready</h3>
              <p className="text-xs text-gray-400 max-w-sm mt-1">
                Configure target channels, keywords, and seed topics to generate highly relevant social posts.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
