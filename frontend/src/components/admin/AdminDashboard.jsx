import React, { useState } from 'react';
import DetectionReports from './DetectionReports';
import SystemConfigForm from './SystemConfigForm';
import AlgorithmManagement from './AlgorithmManagement';
import { BarChart3, Sliders, Cpu, Activity, Eye, Search, Filter } from 'lucide-react';
import RiskBadge from '../common/RiskBadge';

export default function AdminDashboard({
  reports,
  transactions,
  onConfigSaved,
  onAlgorithmUpdated,
  onAlertResolved,
  onInspectTransaction
}) {
  const [activeTab, setActiveTab] = useState('reports'); // 'reports' | 'stream' | 'config' | 'algorithm'
  const [streamSearch, setStreamSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredStream = (transactions || []).filter(tx => {
    const matchesQuery = 
      (tx.transactionId || '').toLowerCase().includes(streamSearch.toLowerCase()) ||
      (tx.merchantName || '').toLowerCase().includes(streamSearch.toLowerCase()) ||
      (tx.userId || '').toLowerCase().includes(streamSearch.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || tx.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Sleek Sub-Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 glass-card rounded-2xl">
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
            activeTab === 'reports'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Overview & Threat Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('stream')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
            activeTab === 'stream'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Live Ingestion Feed</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-indigo-300 font-mono">
            {transactions ? transactions.length : 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
            activeTab === 'config'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Detection Rules Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('algorithm')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
            activeTab === 'algorithm'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>AI Model & Retraining</span>
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

      {activeTab === 'stream' && (
        <div className="glass-card rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <h3 className="text-sm font-bold text-white">Live Ingestion & Intercept Feed</h3>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={streamSearch}
                  onChange={(e) => setStreamSearch(e.target.value)}
                  placeholder="Filter by TX ID, merchant, user..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-white/[0.08]">
                {['ALL', 'BLOCKED', 'SUSPICIOUS', 'APPROVED'].map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition ${
                      statusFilter === status
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {status === 'ALL' ? 'All' : status === 'APPROVED' ? 'Safe' : status === 'SUSPICIOUS' ? 'Suspicious' : 'Blocked'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="pb-3 pr-4">Timestamp</th>
                  <th className="pb-3 pr-4">Tx Reference</th>
                  <th className="pb-3 pr-4">User</th>
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3 pr-4">Merchant</th>
                  <th className="pb-3 pr-4">Verdict</th>
                  <th className="pb-3 pr-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredStream.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-slate-400">
                      No transactions matching current filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStream.map((tx) => (
                    <tr key={tx.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-3.5 pr-4 text-slate-400 font-mono">
                        {new Date(tx.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-3.5 pr-4 font-mono font-medium text-indigo-300">
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
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white text-[11px] font-semibold transition inline-flex items-center gap-1 active:scale-95"
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

      {activeTab === 'config' && (
        <SystemConfigForm onConfigSaved={onConfigSaved} />
      )}

      {activeTab === 'algorithm' && (
        <AlgorithmManagement onAlgorithmUpdated={onAlgorithmUpdated} />
      )}
    </div>
  );
}
