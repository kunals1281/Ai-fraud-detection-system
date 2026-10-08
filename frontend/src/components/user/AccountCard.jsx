import React, { useState } from 'react';
import { Wifi, ShieldCheck, ArrowUpRight, ArrowDownLeft, Lock, Unlock, Copy, Check, Eye, EyeOff } from 'lucide-react';

export default function AccountCard({ balance = 24850.75, userName = "Kunal Sharma", userId = "USR-9821" }) {
  const [isFrozen, setIsFrozen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  const handleCopyCard = () => {
    navigator.clipboard?.writeText('4912 8820 9310 4912');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl p-6 lg:p-7 relative overflow-hidden transition-all">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Visual Premium Holographic Smart Card */}
        <div className={`w-full sm:w-88 md:w-96 h-52 rounded-2xl p-5.5 relative flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-500 border ${
          isFrozen 
            ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 opacity-90' 
            : 'bg-gradient-to-br from-indigo-900 via-[#181d3d] to-[#0a0f24] border-indigo-500/30 ring-1 ring-white/10 hover:shadow-indigo-500/20'
        }`}>
          {/* Holographic background glows */}
          <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-cyan-400/15 blur-2xl"></div>
          <div className="absolute -left-10 -bottom-10 w-36 h-36 rounded-full bg-indigo-500/20 blur-2xl"></div>

          {/* Top row: Chip + Contactless + Brand */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              {/* Metallic Chip */}
              <div className="w-9 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-500 border border-amber-300 shadow-sm relative overflow-hidden">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-amber-600/60"></div>
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-amber-600/60"></div>
              </div>
              <Wifi className="w-4 h-4 text-white/60 rotate-90" />
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] tracking-widest text-indigo-300 font-bold uppercase">
                NeuroShield Obsidian
              </span>
            </div>
          </div>

          {/* Center Card Number */}
          <div className="relative z-10 font-mono text-lg tracking-widest text-white/95 flex items-center justify-between">
            <span>•••• •••• •••• 4912</span>
            <button
              onClick={handleCopyCard}
              className="p-1 rounded text-white/40 hover:text-white transition"
              title="Copy card number"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Bottom Card Row */}
          <div className="flex items-center justify-between relative z-10 text-xs">
            <div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">Cardholder</div>
              <div className="font-bold text-white tracking-wide text-sm">{userName}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">Expires</div>
              <div className="font-mono text-white text-xs">09/29</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">Status</div>
              <div className={`flex items-center gap-1 font-semibold text-xs ${isFrozen ? 'text-rose-400' : 'text-emerald-400'}`}>
                {isFrozen ? (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Frozen</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Protected</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account Details & Quick Controls */}
        <div className="flex-1 space-y-5 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Available Smart Balance</span>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-slate-500 hover:text-slate-300 transition"
                  title={showBalance ? "Hide balance" : "Show balance"}
                >
                  {showBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="text-3xl lg:text-4xl font-black text-white mt-1 tracking-tight">
                {showBalance ? `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••••'}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1.5 font-mono">
                <span>Account: <strong className="text-slate-300">{userId}</strong></span>
                <span>•</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Multi-Factor AI Guard Active
                </span>
              </div>
            </div>

            {/* Quick Card Freeze Button */}
            <button
              onClick={() => setIsFrozen(!isFrozen)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition active:scale-95 ${
                isFrozen
                  ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25'
                  : 'bg-slate-800/80 border border-white/[0.08] text-slate-300 hover:text-white hover:bg-slate-700/80'
              }`}
            >
              {isFrozen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{isFrozen ? 'Unfreeze Card' : 'Freeze Card'}</span>
            </button>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/[0.06] flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Monthly Inflow</span>
                <span className="text-sm font-bold text-white">$14,250.00</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/[0.06] flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Monthly Spend</span>
                <span className="text-sm font-bold text-white">$3,180.40</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
