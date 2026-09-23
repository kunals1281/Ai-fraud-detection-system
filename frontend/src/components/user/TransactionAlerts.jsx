import React, { useState } from 'react';
import { Bell, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Clock } from 'lucide-react';
import { api } from '../../services/api';

export default function TransactionAlerts({ alerts, onAlertResolved }) {
  const [resolvingId, setResolvingId] = useState(null);
  const [resolutionStatus, setResolutionStatus] = useState(null);

  const handleResolve = async (alertId, status) => {
    try {
      setResolvingId(alertId);
      await api.resolveAlert(alertId, {
        status: status,
        resolutionNotes: status === 'VERIFIED_BY_USER' ? 'Verified by user via 2FA mobile challenge' : 'Reported as unauthorized fraud by cardholder',
        resolvedBy: 'User_SelfService'
      });
      setResolutionStatus({
        alertId,
        message: status === 'VERIFIED_BY_USER' ? 'Transaction verified successfully.' : 'Card frozen. Threat report escalated to Security Ops.'
      });
      if (onAlertResolved) onAlertResolved();
    } catch (err) {
      console.error(err);
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div className="bg-[#111726] border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Security & Fraud Alerts</h3>
            <p className="text-xs text-slate-400">Real-time alerts for suspicious activities detected on your accounts</p>
          </div>
        </div>

        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
          {alerts ? alerts.length : 0} Total Alerts
        </span>
      </div>

      {resolutionStatus && (
        <div className="mb-4 p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-center justify-between">
          <span>{resolutionStatus.message}</span>
          <button
            onClick={() => setResolutionStatus(null)}
            className="text-slate-400 hover:text-white font-bold ml-2"
          >
            ×
          </button>
        </div>
      )}

      <div className="space-y-3">
        {(!alerts || alerts.length === 0) ? (
          <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800/80">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
            <h4 className="text-sm font-semibold text-white">All Clear! No Active Threat Alerts</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Your accounts are actively shielded by the NeuroShield AI anomaly engine. Any unusual behavior will trigger an immediate alert here.
            </p>
          </div>
        ) : (
          alerts.map((alert) => {
            const isPending = alert.status === 'PENDING_REVIEW';
            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition-all ${
                  isPending
                    ? 'bg-gradient-to-r from-amber-950/20 to-slate-900/80 border-amber-500/30 shadow-lg'
                    : 'bg-slate-900/40 border-slate-800 opacity-75'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      alert.severity === 'CRITICAL'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      <ShieldAlert className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          ${Number(alert.amount).toFixed(2)} at {alert.merchantName}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isPending ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {alert.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 mt-1 font-medium">
                        {alert.reason}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1.5 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(alert.createdAt).toLocaleTimeString()}
                        </span>
                        <span>•</span>
                        <span>Risk Score: {Math.round(alert.riskScore)}/100</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {isPending && (
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      <button
                        onClick={() => handleResolve(alert.alertId, 'VERIFIED_BY_USER')}
                        disabled={resolvingId === alert.alertId}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>This was me (2FA)</span>
                      </button>

                      <button
                        onClick={() => handleResolve(alert.alertId, 'CONFIRMED_FRAUD')}
                        disabled={resolvingId === alert.alertId}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Report Fraud</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
