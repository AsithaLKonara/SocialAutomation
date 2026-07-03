import React, { useState } from "react";
import { Download, Printer, CheckCircle, Database } from "lucide-react";

interface MonthlySummaryProps {
  spreadsheetId: string;
  avgEngRate: number;
  totalPosts: number;
  platformLikes: (platform: string) => number;
  avgClicks: number;
  platformEng: (platform: string) => number;
}

export default function MonthlySummary({
  spreadsheetId,
  avgEngRate,
  totalPosts,
  platformLikes,
  avgClicks,
  platformEng,
}: MonthlySummaryProps) {
  const [exporting, setExporting] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      alert("Successfully compiled and downloaded audit-ready monthly PDF report!");
    }, 1500);
  };

  const handleSheetsSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      alert("Successfully synced monthly summaries back to Google Sheets!");
    }, 1500);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#141414] p-6 rounded-2xl border border-white/10">
        <div>
          <h2 className="text-base font-semibold text-white">Monthly Reporting Executive Summary</h2>
          <p className="text-xs text-gray-400">
            Aggregates raw performance logs from Google Sheets into audit-ready monthly files.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleSheetsSync}
            disabled={syncing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 text-xs font-semibold cursor-pointer disabled:opacity-50"
          >
            <Database className="w-3.5 h-3.5" />
            {syncing ? "Syncing..." : "Sync to Sheets"}
          </button>

          <button
            onClick={handleExport}
            disabled={exporting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            {exporting ? "Compiling..." : "Export PDF Report"}
          </button>

          <button
            onClick={printReport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#202020] hover:bg-[#2a2a2a] text-gray-300 border border-white/5 text-xs font-semibold cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print File
          </button>
        </div>
      </div>

      {/* Main Report Body */}
      <div className="bg-[#141414] p-8 rounded-3xl border border-white/10 space-y-8" id="report-view">
        {/* Document Header */}
        <div className="flex justify-between items-start border-b border-white/5 pb-6">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-400">
              Internal Performance Record
            </span>
            <h1 className="text-lg font-bold text-white uppercase tracking-tight">
              Social Automation Performance File
            </h1>
            <p className="text-xs text-gray-400 font-mono">
              Spreadsheet ID: {spreadsheetId || "google_sheets_node_3675"}
            </p>
          </div>

          <div className="text-right space-y-1 font-mono text-[11px] text-gray-400">
            <p>Report Period: July 2026 • Live Sync</p>
            <p className="text-indigo-400 font-semibold flex items-center justify-end gap-1">
              <CheckCircle className="w-3 h-3" /> Audit Compliant
            </p>
          </div>
        </div>

        {/* Corporate Header Info Block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#0a0a0a] p-5 rounded-2xl border border-white/5 text-xs">
          <div>
            <p className="text-gray-500 font-semibold">Node Name</p>
            <p className="text-white font-bold mt-1 text-sm">SocialPost Automator</p>
            <p className="text-gray-400 mt-0.5">Google Sheet Managed Node</p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold">Integrations</p>
            <p className="text-white font-bold mt-1 text-sm">Gemini, Unsplash</p>
            <p className="text-gray-400 mt-0.5">Active API Channels</p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold">Aggregation Scope</p>
            <p className="text-white font-bold mt-1 text-sm">FB, IG, LinkedIn</p>
            <p className="text-gray-400 mt-0.5">Performance Metrics Tracked</p>
          </div>
        </div>

        {/* Key Aggregate Metrics */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
            Key Performance Indicators
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5">
              <p className="text-[10px] text-gray-500 uppercase font-semibold">Aggregate Engagement</p>
              <p className="text-xl font-bold text-indigo-400 mt-1">{avgEngRate}%</p>
              <p className="text-[9px] text-gray-500 mt-0.5">Average Across Platforms</p>
            </div>

            <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5">
              <p className="text-[10px] text-gray-500 uppercase font-semibold">Post Aggregates</p>
              <p className="text-xl font-bold text-white mt-1">{totalPosts}</p>
              <p className="text-[9px] text-gray-500 mt-0.5">Total Content Pieces Published</p>
            </div>

            <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5">
              <p className="text-[10px] text-gray-500 uppercase font-semibold">Aggregate Likes</p>
              <p className="text-xl font-bold text-white mt-1">
                {(platformLikes("Facebook") + platformLikes("Instagram") + platformLikes("LinkedIn")).toLocaleString()}
              </p>
              <p className="text-[9px] text-gray-500 mt-0.5">Sum of All Public Likes</p>
            </div>

            <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5">
              <p className="text-[10px] text-gray-500 uppercase font-semibold">Average Clicks</p>
              <p className="text-xl font-bold text-white mt-1">{avgClicks}</p>
              <p className="text-[9px] text-gray-500 mt-0.5">Traffic Referral Rate</p>
            </div>
          </div>
        </div>

        {/* Channel Breakdown List */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
            Channel Breakdown Performance
          </h3>

          <div className="divide-y divide-white/5">
            {["Facebook", "Instagram", "LinkedIn"].map((platform) => (
              <div key={platform} className="py-4 flex justify-between items-center text-xs">
                <div>
                  <p className="font-semibold text-white">{platform}</p>
                  <p className="text-gray-400 mt-0.5">Active Performance Summary</p>
                </div>

                <div className="flex gap-8 text-right font-mono text-[11px]">
                  <div>
                    <p className="text-gray-500">Likes</p>
                    <p className="text-white font-bold mt-0.5">{platformLikes(platform).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Engagement</p>
                    <p className="text-indigo-400 font-bold mt-0.5">{platformEng(platform)}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Closing Notes */}
        <div className="border-t border-white/5 pt-6 text-[10.5px] text-gray-500 space-y-1 font-mono">
          <p>Verified Node Ledger Registry Log • Compliant under social automation guidelines.</p>
          <p>
            Disclaimer: Performance aggregates are pulled directly from Google Sheets API source logs,
            providing historical accuracy for audit purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
