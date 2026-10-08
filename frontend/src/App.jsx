import React, { useState, useEffect } from 'react';
import Header from './components/common/Header';
import AdminDashboard from './components/admin/AdminDashboard';
import UserDashboard from './components/user/UserDashboard';
import XaiModal from './components/common/XaiModal';
import { api } from './services/api';
import { ShieldCheck, ShieldAlert, AlertTriangle, X } from 'lucide-react';

export default function App() {
  const [activeRole, setActiveRole] = useState('user'); // Default to 'user' for a friendlier, cleaner first impression!
  const [transactions, setTransactions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [reports, setReports] = useState(null);
  const [selectedTxForXai, setSelectedTxForXai] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastNotification, setToastNotification] = useState(null);

  const demoUserId = 'USR-9821';

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setIsRefreshing(true);
      const [txList, alertList, reportData] = await Promise.all([
        api.getTransactions(),
        api.getAlerts(),
        api.getDetectionReports()
      ]);
      setTransactions(txList);
      setAlerts(alertList);
      setReports(reportData);
    } catch (err) {
      console.error('Error fetching data from NeuroShield API', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleTransactionProcessed = (newTx) => {
    // Show toast
    if (newTx.status === 'BLOCKED') {
      setToastNotification({
        type: 'danger',
        title: 'High Threat Intercepted & Blocked',
        message: `${newTx.primaryReason} ($${Number(newTx.amount).toFixed(2)})`
      });
    } else if (newTx.status === 'SUSPICIOUS') {
      setToastNotification({
        type: 'warning',
        title: 'Suspicious Activity Detected',
        message: `2FA Challenge generated for $${Number(newTx.amount).toFixed(2)} at ${newTx.merchantName}`
      });
    } else {
      setToastNotification({
        type: 'success',
        title: 'Transaction Clean & Approved',
        message: `Neural scan passed: $${Number(newTx.amount).toFixed(2)} at ${newTx.merchantName}`
      });
    }

    setTimeout(() => {
      setToastNotification(null);
    }, 6000);

    // Refresh data
    loadAllData();
  };

  const userTransactions = transactions.filter(t => t.userId === demoUserId);
  const userAlerts = alerts.filter(a => a.userId === demoUserId);
  const pendingAlertsCount = alerts.filter(a => a.status === 'PENDING_REVIEW').length;

  return (
    <div className="min-h-screen bg-[#070a12] bg-mesh-radial text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Global Toast Alert */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md animate-fadeIn">
          <div className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-start gap-3.5 ${
            toastNotification.type === 'danger'
              ? 'bg-rose-950/90 border-rose-500/40 text-rose-200 shadow-rose-950/50'
              : toastNotification.type === 'warning'
              ? 'bg-amber-950/90 border-amber-500/40 text-amber-200 shadow-amber-950/50'
              : 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200 shadow-emerald-950/50'
          }`}>
            {toastNotification.type === 'danger' ? (
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            ) : toastNotification.type === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <h5 className="text-xs font-bold uppercase tracking-wider">{toastNotification.title}</h5>
              <p className="text-xs mt-0.5 opacity-90 font-medium">{toastNotification.message}</p>
            </div>
            <button
              onClick={() => setToastNotification(null)}
              className="text-white/60 hover:text-white text-xs font-bold transition p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        pendingAlertsCount={pendingAlertsCount}
        onRefresh={loadAllData}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8">
        {activeRole === 'admin' ? (
          <AdminDashboard
            reports={reports}
            transactions={transactions}
            onConfigSaved={loadAllData}
            onAlgorithmUpdated={loadAllData}
            onAlertResolved={loadAllData}
            onInspectTransaction={setSelectedTxForXai}
          />
        ) : (
          <UserDashboard
            userTransactions={userTransactions}
            userAlerts={userAlerts}
            onAlertResolved={loadAllData}
            onTransactionProcessed={handleTransactionProcessed}
            onInspectTransaction={setSelectedTxForXai}
          />
        )}
      </main>

      {/* Explainable AI Modal */}
      {selectedTxForXai && (
        <XaiModal
          transaction={selectedTxForXai}
          onClose={() => setSelectedTxForXai(null)}
        />
      )}

      {/* Modern Minimalist Footer */}
      <footer className="border-t border-white/[0.06] bg-[#05070d]/90 px-4 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>NeuroShield • Real-Time AI Fraud Prevention Architecture</span>
          <span className="font-mono text-[11px] text-slate-500">
            Spring Boot 3 • Ensemble ML • React 18 • Vite
          </span>
        </div>
      </footer>
    </div>
  );
}
