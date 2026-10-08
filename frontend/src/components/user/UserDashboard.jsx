import React, { useState } from 'react';
import AccountCard from './AccountCard';
import TransactionAlerts from './TransactionAlerts';
import TransactionSimulator from './TransactionSimulator';
import RiskBadge from '../common/RiskBadge';
import { History, Eye, MapPin, Filter, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function UserDashboard({ userTransactions, userAlerts, onAlertResolved, onTransactionProcessed, onInspectTransaction }) {
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'APPROVED' | 'SUSPICIOUS' | 'BLOCKED'

  const filteredTransactions = (userTransactions || []).filter(tx => {
    if (statusFilter === 'ALL') return true;
    return tx.status === statusFilter;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Profile & Smart Virtual Card */}
      <AccountCard balance={24850.75} userName="Kunal Sharma" userId="USR-9821" />

      {/* Security Alerts Banner */}
      <TransactionAlerts alerts={userAlerts} onAlertResolved={onAlertResolved} />

      {/* Interactive AI Simulator */}
      <TransactionSimulator
        userId="USR-9821"
        onTransactionProcessed={onTransactionProcessed}
        onInspectXai={onInspectTransaction}
      />

      {/* Recent User Transactions Activity Table */}
      <div className="glass-card rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3.5 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Recent Transactions & AI Verdicts</h3>
              <p className="text-xs text-slate-400">Continuous anomaly monitoring on card & account activity</p>
            </div>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-white/[0.08]">
            {['ALL', 'APPROVED', 'SUSPICIOUS', 'BLOCKED'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                  statusFilter === status
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {status === 'ALL' ? 'All' : status === 'APPROVED' ? 'Safe' : status === 'SUSPICIOUS' ? 'Suspicious' : 'Blocked'}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 pr-4">Tx ID</th>
                <th className="pb-3 pr-4">Merchant</th>
                <th className="pb-3 pr-4">Location</th>
                <th className="pb-3 pr-4">Amount</th>
                <th className="pb-3 pr-4">AI Verdict</th>
                <th className="pb-3 pr-4 text-right">Diagnostic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No transactions found for the selected filter.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3.5 pr-4 font-mono font-medium text-indigo-300">
                      {tx.transactionId}
                    </td>
                    <td className="py-3.5 pr-4 font-medium text-white">
                      <div>{tx.merchantName}</div>
                      <span className="text-[10px] text-slate-400 font-normal">{tx.merchantCategory}</span>
                    </td>
                    <td className="py-3.5 pr-4 text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {tx.locationCity}, {tx.locationCountry}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 font-bold text-white">
                      ${Number(tx.amount).toFixed(2)}
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
    </div>
  );
}
