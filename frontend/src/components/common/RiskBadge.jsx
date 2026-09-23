import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function RiskBadge({ status, score }) {
  if (status === 'APPROVED') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <ShieldCheck className="w-3.5 h-3.5" />
        Safe ({score ? Math.round(score) : 0})
      </span>
    );
  }

  if (status === 'SUSPICIOUS') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
        <AlertTriangle className="w-3.5 h-3.5" />
        Suspicious ({score ? Math.round(score) : 0})
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
      <ShieldAlert className="w-3.5 h-3.5" />
      Blocked ({score ? Math.round(score) : 0})
    </span>
  );
}
