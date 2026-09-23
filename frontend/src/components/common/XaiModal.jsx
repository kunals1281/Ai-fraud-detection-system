import React from 'react';
import { X, ShieldAlert, Cpu, MapPin, Smartphone, Clock, TrendingUp } from 'lucide-react';
import RiskBadge from './RiskBadge';

export default function XaiModal({ transaction, onClose }) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#0f1422] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                Explainable AI (XAI) Risk Decomposition
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                TX: {transaction.transactionId} • {transaction.merchantName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Top Score Banner */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Evaluation Outcome</div>
              <div className="text-xl font-bold text-white mt-0.5">
                ${Number(transaction.amount).toFixed(2)} {transaction.currency}
              </div>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                {new Date(transaction.timestamp).toLocaleString()}
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <RiskBadge status={transaction.status} score={score} />
              <div className="text-xs font-mono text-slate-400">
                Composite Risk: <span className="font-bold text-white">{score} / 100</span>
              </div>
            </div>
          </div>

          {/* Primary Reason */}
          {transaction.primaryReason && (
            <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold uppercase text-indigo-400 tracking-wider">AI Diagnostic Rationale:</span>
                <p className="text-sm text-slate-200 mt-0.5 font-medium">{transaction.primaryReason}</p>
              </div>
            </div>
          )}

          {/* Factors Contribution Breakdown */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Multi-Factor Signal Weights
            </h4>
            <div className="space-y-3">
              {riskFactors.map((factor, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${factor.isFlagged ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                      {factor.name}
                    </span>
                    <span className={`font-mono font-bold ${factor.isFlagged ? 'text-rose-400' : 'text-slate-400'}`}>
                      +{factor.contributionPercent}% contribution
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        factor.isFlagged
                          ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(8, factor.contributionPercent * 2.5))}%` }}
                    ></div>
                  </div>

                  <p className="text-xs text-slate-400">{factor.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Telemetry Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/70 flex items-center gap-3">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <div className="text-slate-400 font-medium">Origin Location</div>
                <div className="text-slate-200 font-semibold">{transaction.locationCity || 'N/A'}, {transaction.locationCountry || 'N/A'}</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/70 flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <div className="text-slate-400 font-medium">Device & IP Fingerprint</div>
                <div className="text-slate-200 font-mono text-[11px] truncate max-w-[200px]">
                  {transaction.deviceId || 'DEV-WEB-98'} • {transaction.ipAddress || '192.168.1.1'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-900/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
