import React, { useState } from "react";
import { Plus, Tag, Layers, CheckCircle2, AlertCircle, Play } from "lucide-react";
import { Topic } from "../types";

interface TopicsListProps {
  topics: Topic[];
  onAddTopic: (title: string, category: string, keywords: string[]) => void;
  onUpdateStatus: (id: string, status: "active" | "completed" | "paused") => void;
}

export default function TopicsList({ topics, onAddTopic, onUpdateStatus }: TopicsListProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Technology");
  const [newKeywords, setNewKeywords] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const keywordsArray = newKeywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k !== "");

    onAddTopic(newTitle, newCategory, keywordsArray);
    setNewTitle("");
    setNewKeywords("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Add Topic Form */}
      <div className="lg:col-span-4 bg-[#141414] p-6 rounded-2xl border border-white/10 h-fit space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Add Content Topic</h3>
          <p className="text-xs text-gray-400">Specify themes for post generation.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-gray-500">Topic Title / Subject</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. AI-driven social tools"
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-gray-500">Category</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="Technology">Technology</option>
              <option value="Business">Business</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Design">Design</option>
              <option value="Health">Health</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-gray-500">Keywords (Comma Separated)</label>
            <input
              type="text"
              value={newKeywords}
              onChange={(e) => setNewKeywords(e.target.value)}
              placeholder="e.g. automation, sheets, efficiency"
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer transition-colors mt-2"
          >
            <Plus className="w-4 h-4" /> Add Topic
          </button>
        </form>
      </div>

      {/* Topics List Grid */}
      <div className="lg:col-span-8 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-semibold text-white">Google Sheet Topic Bank</h3>
            <p className="text-xs text-gray-400">Interactive topic bank synchronizing live from Sheets.</p>
          </div>
          <span className="text-[10px] font-mono bg-[#141414] border border-white/10 text-indigo-400 px-3 py-1 rounded-full">
            {topics.length} Topics Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="bg-[#141414] p-5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4 hover:border-white/20 transition-all group"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0A0A0A] text-indigo-400 border border-white/5">
                    <Layers className="w-3 h-3" /> {topic.category}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider ${
                      topic.status === "active"
                        ? "text-emerald-400"
                        : topic.status === "completed"
                        ? "text-indigo-400"
                        : "text-amber-400"
                    }`}
                  >
                    {topic.status === "active" && <CheckCircle2 className="w-3 h-3" />}
                    {topic.status === "paused" && <AlertCircle className="w-3 h-3" />}
                    {topic.status}
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-white line-clamp-2">{topic.title}</h4>
              </div>

              <div className="space-y-3">
                {/* Keywords */}
                {topic.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {topic.keywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[9px] bg-[#0A0A0A] text-gray-400 border border-white/5 font-mono"
                      >
                        <Tag className="w-2 h-2 text-indigo-400" /> {kw}
                      </span>
                    ))}
                  </div>
                )}

                {/* Quick Status Modifiers */}
                <div className="flex gap-1 border-t border-white/5 pt-3">
                  {topic.status !== "active" && (
                    <button
                      onClick={() => onUpdateStatus(topic.id, "active")}
                      className="text-[10px] font-semibold text-emerald-400 hover:bg-emerald-500/10 px-2.5 py-1 rounded cursor-pointer transition-colors"
                    >
                      Activate
                    </button>
                  )}
                  {topic.status === "active" && (
                    <button
                      onClick={() => onUpdateStatus(topic.id, "paused")}
                      className="text-[10px] font-semibold text-amber-400 hover:bg-amber-500/10 px-2.5 py-1 rounded cursor-pointer transition-colors"
                    >
                      Pause
                    </button>
                  )}
                  {topic.status !== "completed" && (
                    <button
                      onClick={() => onUpdateStatus(topic.id, "completed")}
                      className="text-[10px] font-semibold text-indigo-400 hover:bg-indigo-500/10 px-2.5 py-1 rounded cursor-pointer transition-colors ml-auto"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {topics.length === 0 && (
            <div className="col-span-2 bg-[#141414] p-10 rounded-2xl border border-dashed border-white/10 text-center text-gray-500 text-xs">
              No topics in the bank. Add your first topic to begin generation!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
