import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Globe,
  TrendingUp,
  ThumbsUp,
  Share2,
  MessageSquare,
  Award,
  Sparkles,
} from "lucide-react";
import { EngagementTrend, PlatformEngagement, Post } from "../types";

interface AnalyticsPanelProps {
  totalPosts: number;
  totalLikes: number;
  totalShares: number;
  totalComments: number;
  averageEngagement: number;
  engagementData: EngagementTrend[];
  platformData: PlatformEngagement[];
  bestPost: Post | null;
}

export default function AnalyticsPanel({
  totalPosts,
  totalLikes,
  totalShares,
  totalComments,
  averageEngagement,
  engagementData,
  platformData,
  bestPost,
}: AnalyticsPanelProps) {
  return (
    <div className="space-y-6">
      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Posts */}
        <div className="bg-[#141414] p-5 rounded-2xl border border-white/10">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Total Posts</span>
            <Globe className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{totalPosts}</p>
          <p className="text-[10px] text-indigo-400 mt-1.5 font-semibold flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> Live Sync Active
          </p>
        </div>

        {/* Total Likes */}
        <div className="bg-[#141414] p-5 rounded-2xl border border-white/10">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Total Likes</span>
            <ThumbsUp className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{totalLikes.toLocaleString()}</p>
          <p className="text-[10px] text-gray-500 mt-1.5">Across all platforms</p>
        </div>

        {/* Total Shares */}
        <div className="bg-[#141414] p-5 rounded-2xl border border-white/10">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Total Shares</span>
            <Share2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{totalShares.toLocaleString()}</p>
          <p className="text-[10px] text-gray-500 mt-1.5">Viral amplifications</p>
        </div>

        {/* Total Comments */}
        <div className="bg-[#141414] p-5 rounded-2xl border border-white/10">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Comments</span>
            <MessageSquare className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{totalComments.toLocaleString()}</p>
          <p className="text-[10px] text-gray-500 mt-1.5">Engaged discussions</p>
        </div>

        {/* Avg Engagement */}
        <div className="bg-[#141414] p-5 rounded-2xl border border-white/10 col-span-2 lg:col-span-1">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Avg Eng. Rate</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{averageEngagement}%</p>
          <p className="text-[10px] text-emerald-400 mt-1.5 font-bold">
            Benchmark: 3.5%
          </p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Engagement Over Time */}
        <div className="lg:col-span-8 bg-[#141414] p-6 rounded-2xl border border-white/10 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Engagement Trend Rate %</h3>
            <p className="text-xs text-gray-400">Post performance ratios plotted historically.</p>
          </div>

          <div className="h-72 w-full">
            {engagementData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={engagementData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="engColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0D0D0D",
                      color: "#fff",
                      borderRadius: "12px",
                      fontSize: "11px",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="engagement"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#engColor)"
                    name="Engagement Rate %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-gray-500">
                No performance data to display yet.
              </div>
            )}
          </div>
        </div>

        {/* Platform Comparison */}
        <div className="lg:col-span-4 bg-[#141414] p-6 rounded-2xl border border-white/10 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Engagement by Platform</h3>
            <p className="text-xs text-gray-400">Average engagement rate percent by channel.</p>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            {platformData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0D0D0D",
                      color: "#fff",
                      borderRadius: "12px",
                      fontSize: "11px",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  />
                  <Bar dataKey="engagement" fill="#6366f1" radius={[4, 4, 0, 0]} name="Avg Engagement %">
                    {/* Recharts can color bars individually if needed */}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-gray-500">No comparative data.</div>
            )}
          </div>
        </div>
      </div>

      {/* Highlights & Best Post Breakdown */}
      {bestPost && (
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 uppercase tracking-wider">
              🏆 Best Performing Campaign
            </span>
            <h3 className="text-sm font-semibold text-white">
              Outstanding Reach on {bestPost.platform}
            </h3>
            <p className="text-xs text-gray-300 line-clamp-2 italic">
              &ldquo;{bestPost.caption}&rdquo;
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-400 pt-2">
              <span className="text-gray-300">Likes: <b className="text-indigo-400">{bestPost.likes}</b></span>
              <span className="text-gray-300">Shares: <b className="text-indigo-400">{bestPost.shares}</b></span>
              <span className="text-gray-300">Comments: <b className="text-indigo-400">{bestPost.comments}</b></span>
              <span className="text-gray-300">Clicks: <b className="text-indigo-400">{bestPost.clicks}</b></span>
              <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-md text-[10.5px]">
                Eng Rate: <b>{bestPost.engagementRate}%</b>
              </span>
            </div>
          </div>

          <div className="md:col-span-4 aspect-video rounded-xl overflow-hidden shadow-sm border border-white/10">
            <img
              src={bestPost.imageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80"}
              alt="Best post asset"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
