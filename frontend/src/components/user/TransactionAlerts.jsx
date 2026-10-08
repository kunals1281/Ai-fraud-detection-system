import React, { useState } from 'react';
import { Bell, ShieldAlert, CheckCircle2, ShieldCheck, Clock, X, AlertTriangle } from 'lucide-react';
import { api } from '../../services/api';

export default function TransactionAlerts({ alerts, onAlertResolved }) {
  const [resolvingId, setResolvingId] = useState(null);
  const [notification, setNotification] = useState(null);

  const handleResolve = async (alertId, status) => {
    try {
      setResolvingId(alertId);
      await api.resolveAlert(alertId, {
        status: status,
        resolutionNotes: status === 'VERIFIED_BY_USER' ? 'Confirmed by cardholder via 2FA verification' : 'Reported as unauthorized fraud by cardholder',
        resolvedBy: 'Cardholder_Portal'
      });
      setNotification({
        type: status === 'VERIFIED_BY_USER' ? 'success' : 'alert',
        message: status === 'VERIFIED_BY_USER' 
          ? 'Transaction confirmed & safely verified.' 
          : 'Card frozen immediately. Security Ops notified.'
      });
      if (onAlertResolved) onAlertResolved();
    } catch (err) {
      console.error('Failed to resolve alert', err);
    } finally {
      setResolvingId(null);
    }
  };

  const pendingAlerts = (alerts || []).filter(a => a.status === 'PENDING_REVIEW');

  return (
    <div className="glass-card rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Security & Risk Alerts</h3>
            <p className="text-xs text-slate-400">Suspicious activities flagged for your immediate review</p>
          </div>
        </div>

        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-900 border border-white/[0.08] text-slate-400">
          {pendingAlerts.length} Action Needed
        </span>
      </div>

      {notification && (
        <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
          notification.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
        }`}>
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-white font-bold ml-2 text-sm"
          >
            ×
          </button>
        </div>
      )}

      <div className="space-y-3">
        {(!alerts || alerts.length === 0) ? (
          <div className="py-8 px-4 text-center rounded-xl bg-slate-900/30 border border-white/[0.05]">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white">All Clear! No Active Security Threats</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Your accounts and cards are continuously guarded by the NeuroShield anomaly engine. Any unusual behavior will appear here instantly.
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
                    ? 'bg-gradient-to-r from-amber-950/20 via-slate-900/80 to-slate-900/90 border-amber-500/35 shadow-lg'
                    : 'bg-slate-900/40 border-white/[0.06] opacity-70'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      alert.severity === 'CRITICAL'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {alert.severity === 'CRITICAL' ? (
                        <ShieldAlert className="w-5 h-5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          ${Number(alert.amount).toFixed(2)} at {alert.merchantName}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isPending ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {alert.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 mt-1 font-medium">
                        {alert.reason}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1.5 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {new Date(alert.createdAt).toLocaleTimeString()}
                        </span>
                        <span>•</span>
                        <span>Risk Index: {Math.round(alert.riskScore)}/100</span>
                      </div>
                    </div>
                  </div>

                  {/* Self-Service Actions */}
                  {isPending && (
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.06]">
                      <button
                        onClick={() => handleResolve(alert.alertId, 'VERIFIED_BY_USER')}
                        disabled={resolvingId === alert.alertId}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm It's Me (2FA)</span>
                      </button>

                      <button
                        onClick={() => handleResolve(alert.alertId, 'CONFIRMED_FRAUD')}
                        disabled={resolvingId === alert.alertId}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
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
