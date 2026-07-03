import React from "react";
import { User } from "firebase/auth";
import { ConfigState } from "../types";
import { Sparkles, Database, CheckCircle, HelpCircle, LogOut } from "lucide-react";

interface HeaderProps {
  user: User | null;
  config: ConfigState | null;
  spreadsheetId: string | null;
  onLogout: () => void;
}

export default function Header({ user, config, spreadsheetId, onLogout }: HeaderProps) {
  return (
    <header id="app-header" className="border-b border-white/10 bg-[#0D0D0D] backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand/Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                SocialSync <span className="text-indigo-400">Auto</span>
              </h1>
              <p className="text-[11px] text-gray-500 font-mono">v1.2.0 • Full-Stack</p>
            </div>
          </div>

          {/* Integration Badge Indicators */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Sheets Status */}
            <div className="flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1 text-xs text-emerald-400">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="font-medium">
                {spreadsheetId ? "Google Sheet Synced" : "Google Sheets Active"}
              </span>
            </div>

            {/* Content AI status */}
            {config && (
              <div
                className={`flex items-center space-x-1.5 rounded-full px-2.5 py-1 text-xs border ${
                  config.hasGroqKey
                    ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                    : "bg-white/5 border-white/10 text-gray-400"
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${config.hasGroqKey ? "bg-indigo-400 animate-pulse" : "bg-gray-500"}`} />
                <span className="font-medium">
                  {config.hasGroqKey ? "Groq LLaMA3 active" : "Gemini fallback active"}
                </span>
              </div>
            )}

            {/* Unsplash status */}
            {config && (
              <div
                className={`flex items-center space-x-1.5 rounded-full px-2.5 py-1 text-xs border ${
                  config.hasUnsplashKey
                    ? "bg-sky-500/10 border-sky-500/20 text-sky-400"
                    : "bg-white/5 border-white/10 text-gray-400"
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${config.hasUnsplashKey ? "bg-sky-400" : "bg-gray-500"}`} />
                <span className="font-medium">
                  {config.hasUnsplashKey ? "Unsplash Connected" : "Local Curated Photos"}
                </span>
              </div>
            )}
          </div>

          {/* User Section */}
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2.5">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-8 h-8 rounded-full border border-white/15"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-semibold text-gray-300">
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                  </div>
                )}
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-medium text-white leading-none">
                    {user.displayName}
                  </p>
                  <p className="text-[10px] text-gray-400 leading-none mt-1">
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                id="btn-logout"
                onClick={onLogout}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition"
                title="Disconnect from Google"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
