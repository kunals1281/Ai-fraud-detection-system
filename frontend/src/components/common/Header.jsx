import React from 'react';
import { Shield, ShieldAlert, CreditCard, LayoutDashboard, RefreshCw, Zap } from 'lucide-react';

export default function Header({ activeRole, setActiveRole, pendingAlertsCount, onRefresh, isRefreshing }) {
  return (
    <header className="sticky top-0 z-40 bg-[#070a12]/85 backdrop-blur-xl border-b border-white/[0.07] px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & System Status */}
        <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#070a12] radar-dot"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  NeuroShield
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  AI Core v2.2
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Real-Time Autonomous Fraud Prevention</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>ACTIVE SHIELD • 12ms SCAN</span>
          </div>
        </div>

        {/* Navigation Switch & Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Role Navigation Switch */}
          <div className="flex p-1 bg-slate-900/90 rounded-xl border border-white/[0.08] shadow-inner backdrop-blur-md">
            <button
              onClick={() => setActiveRole('admin')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeRole === 'admin'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Admin Center</span>
              {pendingAlertsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold leading-none">
                  {pendingAlertsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveRole('user')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeRole === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>User Portal</span>
              {pendingAlertsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              )}
            </button>
          </div>

          {/* Refresh Action */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl bg-slate-900/90 border border-white/[0.08] text-slate-400 hover:text-indigo-300 hover:border-indigo-500/40 hover:bg-slate-800 transition active:scale-95"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
}
