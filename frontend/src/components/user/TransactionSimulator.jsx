import React, { useState } from 'react';
import { Send, Zap, Shield, AlertTriangle, ShieldAlert, Cpu, Sparkles, MapPin, Coffee, DollarSign, Plane, Bot } from 'lucide-react';
import { api } from '../../services/api';
import RiskBadge from '../common/RiskBadge';

export default function TransactionSimulator({ userId = "USR-9821", onTransactionProcessed, onInspectXai }) {
  const [form, setForm] = useState({
    userId: userId,
    userEmail: 'kunal@fintech.io',
    amount: '45.00',
    currency: 'USD',
    merchantName: 'Blue Bottle Coffee',
    merchantCategory: 'Dining & Food',
    locationCity: 'San Francisco',
    locationCountry: 'US',
    latitude: 37.7749,
    longitude: -122.4194,
    deviceId: 'DEV-MAC-KUNAL',
    ipAddress: '192.168.1.10'
  });

  const [submitting, setSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const presets = [
    {
      id: 'normal',
      title: 'Normal Coffee ($4.50)',
      icon: Coffee,
      color: 'text-emerald-400',
      bg: 'hover:bg-emerald-950/20 hover:border-emerald-500/30',
      data: {
        amount: '4.50',
        merchantName: 'Starbucks Reserve',
        merchantCategory: 'Food & Beverage',
        locationCity: 'San Francisco',
        locationCountry: 'US',
        latitude: 37.7749,
        longitude: -122.4194,
        deviceId: 'DEV-MAC-KUNAL',
        ipAddress: '192.168.1.10'
      }
    },
    {
      id: 'outlier',
      title: 'Sudden $9,800 Wire Outlier',
      icon: DollarSign,
      color: 'text-rose-400',
      bg: 'hover:bg-rose-950/20 hover:border-rose-500/30',
      data: {
        amount: '9800.00',
        merchantName: 'Offshore Cayman Liquidity Corp',
        merchantCategory: 'Financial Services',
        locationCity: 'George Town',
        locationCountry: 'KY',
        latitude: 19.2869,
        longitude: -81.3674,
        deviceId: 'DEV-WIN-UNKNOWN-99',
        ipAddress: '197.234.12.88'
      }
    },
    {
      id: 'travel',
      title: 'Impossible Travel (Tokyo in 15m)',
      icon: Plane,
      color: 'text-amber-400',
      bg: 'hover:bg-amber-950/20 hover:border-amber-500/30',
      data: {
        amount: '650.00',
        merchantName: 'Ginza Luxury Boutiques',
        merchantCategory: 'Luxury Goods',
        locationCity: 'Tokyo',
        locationCountry: 'JP',
        latitude: 35.6762,
        longitude: 139.6503,
        deviceId: 'DEV-MAC-KUNAL',
        ipAddress: '133.242.18.9'
      }
    },
    {
      id: 'carding',
      title: 'Carding Bot Burst (Rapid Probe)',
      icon: Bot,
      color: 'text-cyan-400',
      bg: 'hover:bg-cyan-950/20 hover:border-cyan-500/30',
      data: {
        amount: '1.99',
        merchantName: 'Automated Micro Test Vendor',
        merchantCategory: 'Digital Goods',
        locationCity: 'Lagos',
        locationCountry: 'NG',
        latitude: 6.5244,
        longitude: 3.3792,
        deviceId: 'DEV-AUTOMATED-RUNNER',
        ipAddress: '41.203.77.102'
      }
    }
  ];

  const handleApplyPreset = (preset) => {
    setForm(prev => ({
      ...prev,
      ...preset.data
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.submitTransaction({
        ...form,
        amount: parseFloat(form.amount) || 1.0,
        latitude: parseFloat(form.latitude) || 37.7749,
        longitude: parseFloat(form.longitude) || -122.4194
      });
      setLastResult(res);
      if (onTransactionProcessed) onTransactionProcessed(res);
    } catch (err) {
      alert('Error submitting transaction: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#111726] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Interactive Transaction & Attack Simulator</h3>
            <p className="text-xs text-slate-400">Simulate normal spending or inject synthetic attack vectors into the live AI pipeline</p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          Ensemble AI Armed
        </span>
      </div>

      {/* 1-Click Attack Presets for Evaluation Demo */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          One-Click Evaluation Presets (Click to Auto-Fill & Test):
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {presets.map(p => {
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className={`p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-left transition flex items-center gap-2.5 ${p.bg}`}
              >
                <div className={`p-1.5 rounded-lg bg-slate-800 shrink-0 ${p.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold text-slate-200 truncate">{p.title}</div>
                  <div className="text-[10px] text-slate-500 truncate">{p.data.merchantName}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Transaction Details Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] text-slate-400 font-semibold block mb-1">Amount ($ USD):</label>
            <input
              type="number"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm font-bold text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 font-semibold block mb-1">Merchant / Recipient:</label>
            <input
              type="text"
              value={form.merchantName}
              onChange={(e) => setForm({ ...form, merchantName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 font-semibold block mb-1">Category:</label>
            <input
              type="text"
              value={form.merchantCategory}
              onChange={(e) => setForm({ ...form, merchantCategory: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-[11px] text-slate-400 font-semibold block mb-1">City:</label>
            <input
              type="text"
              value={form.locationCity}
              onChange={(e) => setForm({ ...form, locationCity: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 font-semibold block mb-1">Country Code:</label>
            <input
              type="text"
              value={form.locationCountry}
              onChange={(e) => setForm({ ...form, locationCountry: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono uppercase focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 font-semibold block mb-1">Latitude:</label>
            <input
              type="number"
              step="any"
              value={form.latitude}
              onChange={(e) => setForm({ ...form, latitude: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 font-semibold block mb-1">Longitude:</label>
            <input
              type="number"
              step="any"
              value={form.longitude}
              onChange={(e) => setForm({ ...form, longitude: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-500/25 transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Running Neural Anomaly Scan...' : 'Execute Transaction'}</span>
          </button>
        </div>
      </form>

      {/* Live AI Response Preview Banner */}
      {lastResult && (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Detection Outcome:</span>
              <RiskBadge status={lastResult.status} score={lastResult.riskScore} />
            </div>

            <span className="text-xs font-mono text-slate-500">
              Evaluated in {lastResult.evaluationTimeMs}ms
            </span>
          </div>

          <p className="text-xs text-slate-300 font-medium">
            {lastResult.primaryReason}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
            <span className="text-slate-400 font-mono">TX ID: {lastResult.transactionId}</span>
            <button
              type="button"
              onClick={() => onInspectXai(lastResult)}
              className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Inspect XAI Risk Breakdown</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
