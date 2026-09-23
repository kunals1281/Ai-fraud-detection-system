import React, { useState } from 'react';
import DetectionReports from './DetectionReports';
import SystemConfigForm from './SystemConfigForm';
import AlgorithmManagement from './AlgorithmManagement';
import { BarChart3, Sliders, Cpu, Activity, Eye } from 'lucide-react';
import RiskBadge from '../common/RiskBadge';

export default function AdminDashboard({
  reports,
  transactions,
  onConfigSaved,
  onAlgorithmUpdated,
  onAlertResolved,
  onInspectTransaction
}) {
  const [activeTab, setActiveTab] = useState('reports'); // 'reports' | 'config' | 'algorithm' | 'stream'

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#111726] border border-slate-800 rounded-2xl">
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
            activeTab === 'reports'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Detection Reports & Threat Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
            activeTab === 'config'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Configuration Settings Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('algorithm')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
            activeTab === 'algorithm'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Algorithm Management & Retraining</span>
        </button>

        <button
          onClick={() => setActiveTab('stream')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
            activeTab === 'stream'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Live Ingestion Stream ({transactions ? transactions.length : 0})</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'reports' && (
        <DetectionReports
          reports={reports}
          onInspectTransaction={onInspectTransaction}
          onAlertResolved={onAlertResolved}
        />
      )}

      {activeTab === 'config' && (
        <SystemConfigForm onConfigSaved={onConfigSaved} />
      )}

      {activeTab === 'algorithm' && (
        <AlgorithmManagement onAlgorithmUpdated={onAlgorithmUpdated} />
      )}

      {activeTab === 'stream' && (
        <div className="bg-[#111726] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <h3 className="text-sm font-semibold text-white">Real-Time Ingestion Audit Feed</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Live Intercept Pipeline • H2 Persisted
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800/80 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="pb-3 pr-4">Timestamp</th>
                  <th className="pb-3 pr-4">Tx Reference</th>
                  <th className="pb-3 pr-4">User</th>
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3 pr-4">Merchant</th>
                  <th className="pb-3 pr-4">Verdict</th>
                  <th className="pb-3 pr-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(!transactions || transactions.length === 0) ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-slate-500">
                      No transactions recorded in ingestion buffer.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-900/40 transition">
                      <td className="py-3.5 pr-4 text-slate-400 font-mono">
                        {new Date(tx.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-3.5 pr-4 font-mono font-medium text-indigo-400">
                        {tx.transactionId}
                      </td>
                      <td className="py-3.5 pr-4 text-slate-300 font-medium">
                        {tx.userId}
                      </td>
                      <td className="py-3.5 pr-4 font-bold text-white">
                        ${Number(tx.amount).toFixed(2)}
                      </td>
                      <td className="py-3.5 pr-4 text-slate-300">
                        {tx.merchantName}
                      </td>
                      <td className="py-3.5 pr-4">
                        <RiskBadge status={tx.status} score={tx.riskScore} />
                      </td>
                      <td className="py-3.5 pr-4 text-right">
                        <button
                          onClick={() => onInspectTransaction(tx)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 text-[11px] font-semibold transition inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
