import React, { useState } from 'react';
import AccountCard from './AccountCard';
import TransactionAlerts from './TransactionAlerts';
import TransactionSimulator from './TransactionSimulator';
import RiskBadge from '../common/RiskBadge';
import { History, Eye, ShieldCheck, MapPin } from 'lucide-react';

export default function UserDashboard({ userTransactions, userAlerts, onAlertResolved, onTransactionProcessed, onInspectTransaction }) {
  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview' | 'simulator'

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Profile / Card Hub */}
      <AccountCard balance={24850.75} userName="Kunal Sharma" userId="USR-9821" />

      {/* Security Alerts Banner / Feed */}
      <TransactionAlerts alerts={userAlerts} onAlertResolved={onAlertResolved} />

      {/* Simulator / Attack Playground */}
      <TransactionSimulator
        userId="USR-9821"
        onTransactionProcessed={onTransactionProcessed}
        onInspectXai={onInspectTransaction}
      />

      {/* User Transaction Activity Table */}
      <div className="bg-[#111726] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Recent Account Transactions & Security Status</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {userTransactions ? userTransactions.length : 0} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 pr-4">Reference</th>
                <th className="pb-3 pr-4">Merchant</th>
                <th className="pb-3 pr-4">Location</th>
                <th className="pb-3 pr-4">Amount</th>
                <th className="pb-3 pr-4">AI Security Verdict</th>
                <th className="pb-3 pr-4 text-right">Diagnostic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {(!userTransactions || userTransactions.length === 0) ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    No transactions recorded yet for this account.
                  </td>
                </tr>
              ) : (
                userTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3.5 pr-4 font-mono font-medium text-slate-400">
                      {tx.transactionId}
                    </td>
                    <td className="py-3.5 pr-4 font-medium text-white">
                      {tx.merchantName}
                      <span className="block text-[10px] text-slate-500">{tx.merchantCategory}</span>
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
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 text-[11px] font-semibold transition inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>XAI Review</span>
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
