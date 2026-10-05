import React from 'react';
import { Shield, Activity, User, ShieldCheck, RefreshCw } from 'lucide-react';

export default function Header({ activeRole, setActiveRole, pendingAlertsCount, onRefresh, isRefreshing }) {
  return (
    <header className="sticky top-0 z-40 bg-[#0a0d14]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & System Status */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">NeuroShield</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  AI Core v2.1
                </span>
              </div>
              <p className="text-xs text-slate-400">Enterprise Real-Time Fraud Detection & Prevention</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            ACTIVE DEFENSE • 12ms
          </div>
        </div>

        {/* Role Switcher & Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Role Navigation Switch */}
          <div className="flex p-1 bg-slate-900/90 rounded-xl border border-slate-800 shadow-inner">
            <button
              onClick={() => setActiveRole('admin')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeRole === 'admin'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Admin Operations</span>
              {pendingAlertsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold animate-pulse">
                  {pendingAlertsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveRole('user')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeRole === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>User Financial Hub</span>
              {pendingAlertsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              )}
            </button>
          </div>

          {/* Presentation Deck Link */}
          <a
            href="/presentation.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-950/60 border border-indigo-700/40 text-indigo-300 hover:text-white hover:bg-indigo-900/60 hover:border-indigo-500 transition text-xs font-semibold shadow-sm shadow-indigo-950"
            title="Open College Review Presentation Slides"
          >
            <span>📊 Presentation Deck</span>
          </a>

          {/* Quick Refresh */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-indigo-400 hover:border-slate-700 transition"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
}
