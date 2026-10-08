import React, { useEffect } from 'react';
import { X, ShieldAlert, ShieldCheck, Cpu, MapPin, Smartphone, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import RiskBadge from './RiskBadge';

export default function XaiModal({ transaction, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!transaction) return null;

  let riskFactors = [];
  try {
    if (transaction.riskFactors) {
      riskFactors = transaction.riskFactors;
    } else if (transaction.riskFactorsJson) {
      riskFactors = JSON.parse(transaction.riskFactorsJson);
    }
  } catch (e) {
    riskFactors = [];
  }

  const score = Math.round(transaction.riskScore || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-[#0c111e] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden text-slate-200 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Explainable AI (XAI) Diagnostic Scan
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Reference: <span className="text-indigo-300 font-semibold">{transaction.transactionId}</span> • {transaction.merchantName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition"
            title="Close dialog (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Main Risk Overview Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-[#10172b] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
                Transaction Value & Status
              </span>
              <div className="text-2xl font-black text-white mt-0.5">
                ${Number(transaction.amount).toFixed(2)} <span className="text-xs font-normal text-slate-400">{transaction.currency || 'USD'}</span>
              </div>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{new Date(transaction.timestamp).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-white/[0.06]">
              <RiskBadge status={transaction.status} score={score} />
              <div className="text-xs font-mono text-slate-400">
                Risk Confidence: <span className="font-bold text-white">{score} / 100</span>
              </div>
            </div>
          </div>

          {/* AI Decision Rationale */}
          {transaction.primaryReason && (
            <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
              transaction.status === 'BLOCKED'
                ? 'bg-rose-950/20 border-rose-500/25 text-rose-200'
                : transaction.status === 'SUSPICIOUS'
                ? 'bg-amber-950/20 border-amber-500/25 text-amber-200'
                : 'bg-emerald-950/20 border-emerald-500/25 text-emerald-200'
            }`}>
              {transaction.status === 'BLOCKED' ? (
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              ) : transaction.status === 'SUSPICIOUS' ? (
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider block opacity-90">
                  AI Model Decision Attribution:
                </span>
                <p className="text-sm font-medium mt-0.5 text-white/90">
                  {transaction.primaryReason}
                </p>
              </div>
            </div>
          )}

          {/* Factor Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <span>Ensemble Feature Weight Contributions</span>
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">Normalized Attribution</span>
            </div>

            <div className="space-y-2.5">
              {riskFactors.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-900/40 border border-white/[0.06] text-xs text-slate-400 text-center">
                  All ensemble signals within standard operating limits.
                </div>
              ) : (
                riskFactors.map((factor, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-white/[0.07] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${factor.isFlagged ? 'bg-rose-400 animate-pulse' : 'bg-emerald-400'}`}></span>
                        {factor.name}
                      </span>
                      <span className={`font-mono font-bold ${factor.isFlagged ? 'text-rose-400' : 'text-slate-400'}`}>
                        +{factor.contributionPercent}% impact
                      </span>
                    </div>

                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-white/[0.04]">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          factor.isFlagged
                            ? 'bg-gradient-to-r from-amber-400 to-rose-500'
                            : 'bg-emerald-400'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(8, factor.contributionPercent * 2.5))}%` }}
                      ></div>
                    </div>

                    <p className="text-xs text-slate-400">{factor.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Telemetry Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-white/[0.07] flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-slate-400 font-medium">Origin Location</div>
                <div className="text-white font-semibold">
                  {transaction.locationCity || 'San Francisco'}, {transaction.locationCountry || 'US'}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-white/[0.07] flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <div className="text-slate-400 font-medium">Device & Network Identity</div>
                <div className="text-white font-mono text-[11px] truncate">
                  {transaction.deviceId || 'DEV-SECURE'} • {transaction.ipAddress || '192.168.1.1'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-900/70 border-t border-white/[0.08] flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            NeuroShield Decision Engine • Trace verified
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-white/[0.08] hover:bg-white/[0.14] text-white transition active:scale-95"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
