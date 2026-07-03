import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Layers,
  BarChart3,
  BookOpen,
  User,
  LogOut,
  Calendar,
  Clock,
  ExternalLink,
  Table,
} from "lucide-react";
import ContentGenerator from "./components/ContentGenerator";
import TopicsList from "./components/TopicsList";
import AnalyticsPanel from "./components/AnalyticsPanel";
import MonthlySummary from "./components/MonthlySummary";
import { Topic, Post, EngagementTrend, PlatformEngagement } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<"generator" | "topics" | "analytics" | "summary">("generator");
  const [currentTime, setCurrentTime] = useState("");
  
  // Sheet state
  const [spreadsheetId, setSpreadsheetId] = useState("social_media_flow_2026");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Core mock dataset seeded for out-of-the-box utility
  const [topics, setTopics] = useState<Topic[]>([
    {
      id: "1",
      title: "Using Gemini and Google Sheets to automate content scheduling",
      category: "Technology",
      status: "active",
      keywords: ["automation", "AI", "workflow"],
    },
    {
      id: "2",
      title: "How continuous analytics reporting optimizes digital campaigns",
      category: "Business",
      status: "active",
      keywords: ["reporting", "analytics", "ROI"],
    },
    {
      id: "3",
      title: "Minimalist visual designs for modern web components",
      category: "Design",
      status: "active",
      keywords: ["typography", "UIUX", "minimalism"],
    },
  ]);

  const [posts, setPosts] = useState<Post[]>([
    {
      id: "p1",
      topicId: "1",
      platform: "LinkedIn",
      caption: "Supercharge your productivity! Integrating artificial intelligence models with spreadsheet ledgers creates zero-overhead content scheduling solutions for enterprise managers. Try building yours today! #AI #Automation #Productivity",
      likes: 342,
      shares: 68,
      comments: 24,
      clicks: 110,
      engagementRate: 5.2,
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
      status: "published",
      createdAt: "2026-07-01 10:00",
    },
    {
      id: "p2",
      topicId: "2",
      platform: "Instagram",
      caption: "Data doesn't lie. Continuous evaluation of active metrics allows companies to re-allocate branding capital dynamically. Our audits showed a 3x lift in audience engagement. #DataAnalytics #KPIs #Growth",
      likes: 850,
      shares: 120,
      comments: 42,
      clicks: 280,
      engagementRate: 8.7,
      imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=80",
      status: "published",
      createdAt: "2026-07-02 14:15",
    },
    {
      id: "p3",
      topicId: "3",
      platform: "Facebook",
      caption: "Elegance comes from subtraction, not addition. Custom color palettes, precise typography pairings, and structured components make your product tell an unforgettable story. #DesignSystem #UIUX #Elegance",
      likes: 195,
      shares: 30,
      comments: 11,
      clicks: 55,
      engagementRate: 3.1,
      imageUrl: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=600&q=80",
      status: "published",
      createdAt: "2026-07-03 09:30",
    },
  ]);

  // Clock Update
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) +
          " UTC"
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handlers for Topics List
  const handleAddTopic = (title: string, category: string, keywords: string[]) => {
    const newTopic: Topic = {
      id: (topics.length + 1).toString(),
      title,
      category,
      status: "active",
      keywords,
    };
    setTopics((prev) => [newTopic, ...prev]);
  };

  const handleUpdateTopicStatus = (id: string, status: "active" | "completed" | "paused") => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  };

  // Handler for Content Scheduling
  const handleSchedulePost = (
    newPost: Omit<Post, "id" | "likes" | "shares" | "comments" | "clicks" | "engagementRate" | "status" | "createdAt"> & {
      status: "scheduled";
      scheduledFor: string;
    }
  ) => {
    // Generate simulated metrics for scheduling preview
    const likes = Math.floor(Math.random() * 200) + 50;
    const shares = Math.floor(likes * 0.2);
    const comments = Math.floor(likes * 0.08);
    const clicks = Math.floor(likes * 0.6);
    const engagementRate = parseFloat(((likes + shares + comments) / 100).toFixed(1));

    const post: Post = {
      id: "p" + (posts.length + 1).toString(),
      topicId: newPost.topicId,
      platform: newPost.platform,
      caption: newPost.caption,
      imageUrl: newPost.imageUrl,
      status: "published", // Show as published/live in dashboard for simplicity
      createdAt: newPost.scheduledFor,
      likes,
      shares,
      comments,
      clicks,
      engagementRate,
    };

    setPosts((prev) => [post, ...prev]);
  };

  // Google OAuth Login Trigger
  const triggerOAuth = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setIsAuthenticated(true);
    }, 1200);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Aggregate stats calculations
  const totalPosts = posts.length;
  const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);
  const totalShares = posts.reduce((sum, p) => sum + p.shares, 0);
  const totalComments = posts.reduce((sum, p) => sum + p.comments, 0);
  const totalClicks = posts.reduce((sum, p) => sum + p.clicks, 0);
  const averageEngagement = parseFloat(
    (posts.reduce((sum, p) => sum + p.engagementRate, 0) / (totalPosts || 1)).toFixed(1)
  );

  const engagementData: EngagementTrend[] = posts
    .slice()
    .reverse()
    .map((p) => ({
      date: p.createdAt.split(" ")[0].slice(5), // extract MM-DD
      engagement: p.engagementRate,
    }));

  const platformData: PlatformEngagement[] = ["Instagram", "Facebook", "LinkedIn"].map((platform) => {
    const platformPosts = posts.filter((p) => p.platform === platform);
    const avgEng = platformPosts.reduce((sum, p) => sum + p.engagementRate, 0) / (platformPosts.length || 1);
    return {
      name: platform,
      engagement: parseFloat(avgEng.toFixed(1)),
    };
  });

  const bestPost = posts.reduce((best, p) => (p.engagementRate > (best?.engagementRate || 0) ? p : best), null as Post | null);

  const platformLikes = (platform: string) =>
    posts.filter((p) => p.platform === platform).reduce((sum, p) => sum + p.likes, 0);

  const avgClicks = Math.floor(totalClicks / (totalPosts || 1));

  const platformEng = (platform: string) => {
    const channelPosts = posts.filter((p) => p.platform === platform);
    const avg = channelPosts.reduce((sum, p) => sum + p.engagementRate, 0) / (channelPosts.length || 1);
    return parseFloat(avg.toFixed(1));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col font-sans">
      {/* Top Banner Navigation */}
      <header className="bg-[#141414] border-b border-white/10 sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-500 to-rose-500 p-2.5 rounded-xl border border-white/10 shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight uppercase">SocialPost Automator</h1>
            <p className="text-[10.5px] text-gray-400 font-mono">Google Sheet Sync Terminal</p>
          </div>
        </div>

        {/* Global Utilities */}
        <div className="flex items-center gap-4">
          {/* UTC Clock */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0a0a0a] border border-white/5 font-mono text-xs text-gray-400">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{currentTime}</span>
          </div>

          {/* Sheets OAuth Sign In */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2.5 bg-[#0a0a0a] border border-emerald-500/15 rounded-xl px-3.5 py-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-gray-300 font-mono">Sheets Live</span>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-rose-400 p-0.5 rounded cursor-pointer transition-colors"
                title="Disconnect Sheets Ledger"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={triggerOAuth}
              disabled={isAuthenticating}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 text-white text-xs font-semibold cursor-pointer transition-all"
            >
              <Table className="w-3.5 h-3.5" />
              {isAuthenticating ? "Connecting Sheets..." : "Connect Sheets Ledger"}
            </button>
          )}
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-grow max-w-7xl mx-auto w-full p-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-white/10 gap-2 pb-px overflow-x-auto">
          {[
            { id: "generator", label: "Content Creator", icon: Sparkles },
            { id: "topics", label: "Topic Bank", icon: BookOpen },
            { id: "analytics", label: "Performance Analytics", icon: BarChart3 },
            { id: "summary", label: "Monthly reporting", icon: Layers },
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "border-indigo-500 text-indigo-400"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                <TabIcon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Panel Viewports */}
        <div className="py-2">
          {activeTab === "generator" && (
            <ContentGenerator topics={topics} onSchedulePost={handleSchedulePost} />
          )}

          {activeTab === "topics" && (
            <TopicsList
              topics={topics}
              onAddTopic={handleAddTopic}
              onUpdateStatus={handleUpdateTopicStatus}
            />
          )}

          {activeTab === "analytics" && (
            <AnalyticsPanel
              totalPosts={totalPosts}
              totalLikes={totalLikes}
              totalShares={totalShares}
              totalComments={totalComments}
              averageEngagement={averageEngagement}
              engagementData={engagementData}
              platformData={platformData}
              bestPost={bestPost}
            />
          )}

          {activeTab === "summary" && (
            <MonthlySummary
              spreadsheetId={spreadsheetId}
              avgEngRate={averageEngagement}
              totalPosts={totalPosts}
              platformLikes={platformLikes}
              avgClicks={avgClicks}
              platformEng={platformEng}
            />
          )}
        </div>
      </main>

      {/* Footer information section */}
      <footer className="bg-[#141414] border-t border-white/10 px-6 py-4 flex flex-col md:flex-row justify-between items-center text-[10.5px] text-gray-500 gap-2">
        <p>© 2026 SocialPost Automator • Real-Time Performance Analytics Node.</p>
        <p className="flex items-center gap-1.5 font-mono">
          Sheet Node ID:
          <span className="text-gray-400 bg-[#0A0A0A] border border-white/5 px-2 py-0.5 rounded">
            {spreadsheetId}
          </span>
          • Audit Compliant Status
        </p>
      </footer>
    </div>
  );
}
