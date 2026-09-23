import React from 'react';
import { CreditCard, Wifi, ShieldCheck, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function AccountCard({ balance = 24850.75, userName = "Kunal Sharma", userId = "USR-9821" }) {
  return (
    <div className="bg-[#111726] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Visual Glassmorphic Credit Card */}
        <div className="w-full md:w-80 h-48 rounded-2xl p-5 bg-gradient-to-br from-indigo-700 via-indigo-900 to-slate-950 text-white border border-indigo-500/30 shadow-2xl relative flex flex-col justify-between overflow-hidden group">
          {/* Card background art */}
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-cyan-400/20 blur-xl group-hover:scale-125 transition-transform duration-700"></div>
          <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-indigo-500/20 blur-xl"></div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-5 rounded bg-amber-400/80 border border-amber-300"></div>
              <Wifi className="w-4 h-4 text-white/70 rotate-90" />
            </div>
            <span className="font-mono text-xs tracking-widest text-indigo-300 font-bold">NEUROSHIELD BLACK</span>
          </div>

          <div className="relative z-10 font-mono text-base tracking-widest text-white/90">
            •••• •••• •••• 4912
          </div>

          <div className="flex items-center justify-between relative z-10 text-xs">
            <div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400">Cardholder</div>
              <div className="font-semibold text-white tracking-wide">{userName}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400">Expires</div>
              <div className="font-mono text-white">09/29</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400">Security</div>
              <div className="flex items-center gap-1 text-emerald-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                AI-Secured
              </div>
            </div>
          </div>
        </div>

        {/* Account Details & Balances */}
        <div className="flex-1 space-y-4 w-full">
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Available Smart Balance</div>
            <div className="text-3xl font-extrabold text-white mt-1">
              ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-mono">
              <span>Account ID: {userId}</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">Protected by NeuroShield v2.1</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Monthly Inflow</div>
                <div className="text-sm font-bold text-white">$14,250.00</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Monthly Spend</div>
                <div className="text-sm font-bold text-white">$3,180.40</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
