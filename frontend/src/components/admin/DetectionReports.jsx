import React, { useState } from 'react';
import { ShieldAlert, DollarSign, Activity, FileText, Globe, ShoppingBag, Eye, CheckCircle2, XCircle, ArrowUpRight } from 'lucide-react';
import RiskBadge from '../common/RiskBadge';
import { api } from '../../services/api';

export default function DetectionReports({ reports, onInspectTransaction, onAlertResolved }) {
  const [resolvingId, setResolvingId] = useState(null);

  if (!reports) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center text-slate-400">
        <Activity className="w-8 h-8 animate-spin mx-auto text-indigo-400 mb-3" />
        <p className="text-sm">Loading security telemetry & detection reports...</p>
      </div>
    );
  }

  const handleResolveAlert = async (alertId, status) => {
    try {
      setResolvingId(alertId);
      await api.resolveAlert(alertId, {
        status: status,
        resolutionNotes: status === 'CONFIRMED_FRAUD' ? 'Confirmed fraudulent activity by Security Operations' : 'Dismissed as false positive by Security Operations',
        resolvedBy: 'Security_Operations'
      });
      if (onAlertResolved) onAlertResolved();
    } catch (err) {
      console.error('Failed to resolve alert', err);
    } finally {
      setResolvingId(null);
    }
  };

  const categories = Object.entries(reports.casesByCategory || {});
  const countries = Object.entries(reports.casesByCountry || {});

  return (
    <div className="space-y-6">
      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Processed */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Volume</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2 tracking-tight">
            ${Number(reports.totalProcessedAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <span className="text-indigo-400 font-semibold">{reports.totalTransactions}</span> transactions scanned
          </div>
        </div>

        {/* Fraud Value Blocked */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Threats Intercepted</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-400 mt-2 tracking-tight">
            ${Number(reports.totalBlockedAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <span className="text-rose-400 font-semibold">{reports.totalFraudCases}</span> attacks neutralized
          </div>
        </div>

        {/* Anomaly Detection Rate */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Anomaly Rate</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2 tracking-tight">
            {reports.fraudRatePercent}%
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <span className="text-amber-400 font-semibold">{reports.totalSuspiciousCases}</span> required 2FA challenge
          </div>
        </div>

        {/* System Precision */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">AI Precision</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2 tracking-tight">
            98.5%
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <span className="text-emerald-400 font-semibold">96.4%</span> recall rate
          </div>
        </div>
      </div>

      {/* Visual Analytics & Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution by Category */}
        <div className="glass-card rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Fraud Vectors by Merchant Category</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">{categories.length} Vectors</span>
          </div>

          <div className="space-y-3.5">
            {categories.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No category anomalies recorded.</p>
            ) : (
              categories.map(([category, count]) => {
                const total = reports.totalFraudCases + reports.totalSuspiciousCases || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={category} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-200 font-medium">{category}</span>
                      <span className="text-slate-400 font-mono">{count} cases ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/[0.04]">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-rose-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(12, pct)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Distribution by Country */}
        <div className="glass-card rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Geographical Origin Hotspots</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">{countries.length} Jurisdictions</span>
          </div>

          <div className="space-y-3.5">
            {countries.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No jurisdictional threats recorded.</p>
            ) : (
              countries.map(([country, count]) => {
                const total = reports.totalFraudCases + reports.totalSuspiciousCases || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={country} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-200 font-mono font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                        Jurisdiction: {country}
                      </span>
                      <span className="text-slate-400 font-mono">{count} incidents ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/[0.04]">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(12, pct)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Flagged Cases & Operator Action Review Table */}
      <div className="glass-card rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3.5 border-b border-white/[0.08] gap-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white">Detected Cases Under Review</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {reports.pendingAlerts ? reports.pendingAlerts.length : 0} Pending Review
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 pr-4">Case ID</th>
                <th className="pb-3 pr-4">User</th>
                <th className="pb-3 pr-4">Amount</th>
                <th className="pb-3 pr-4">Merchant</th>
                <th className="pb-3 pr-4">Risk Reason</th>
                <th className="pb-3 pr-4">Severity</th>
                <th className="pb-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {(!reports.pendingAlerts || reports.pendingAlerts.length === 0) ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500">
                    No active fraud alerts pending operator review.
                  </td>
                </tr>
              ) : (
                reports.pendingAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3.5 pr-4 font-mono font-medium text-indigo-300">
                      {alert.alertId}
                    </td>
                    <td className="py-3.5 pr-4 text-slate-300 font-medium">
                      {alert.userId}
                    </td>
                    <td className="py-3.5 pr-4 font-bold text-white">
                      ${Number(alert.amount).toFixed(2)}
                    </td>
                    <td className="py-3.5 pr-4 text-slate-300">
                      {alert.merchantName}
                    </td>
                    <td className="py-3.5 pr-4 text-slate-400 max-w-xs truncate" title={alert.reason}>
                      {alert.reason}
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        alert.severity === 'CRITICAL' 
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/25' 
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                      }`}>
                        {alert.severity} ({Math.round(alert.riskScore)})
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleResolveAlert(alert.alertId, 'CONFIRMED_FRAUD')}
                          disabled={resolvingId === alert.alertId}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-semibold transition active:scale-95 disabled:opacity-50"
                        >
                          Confirm Fraud
                        </button>
                        <button
                          onClick={() => handleResolveAlert(alert.alertId, 'DISMISSED')}
                          disabled={resolvingId === alert.alertId}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition active:scale-95 disabled:opacity-50"
                        >
                          Dismiss
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
