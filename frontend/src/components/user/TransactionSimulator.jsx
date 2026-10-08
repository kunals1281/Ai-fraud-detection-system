import React, { useState } from 'react';
import { Zap, Send, Coffee, DollarSign, Plane, Bot, ChevronDown, ChevronUp, Cpu, Sparkles, MapPin, Building, Globe } from 'lucide-react';
import { api } from '../../services/api';
import RiskBadge from '../common/RiskBadge';

export default function TransactionSimulator({ userId = "USR-9821", onTransactionProcessed, onInspectXai }) {
  const [form, setForm] = useState({
    userId: userId,
    userEmail: 'kunal@fintech.io',
    amount: '45.00',
    currency: 'USD',
    merchantName: 'Blue Bottle Coffee',
    merchantCategory: 'Food & Beverage',
    locationCity: 'San Francisco',
    locationCountry: 'US',
    latitude: 37.7749,
    longitude: -122.4194,
    deviceId: 'DEV-MAC-KUNAL',
    ipAddress: '192.168.1.10'
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [activePreset, setActivePreset] = useState(null);

  const presets = [
    {
      id: 'normal',
      title: 'Coffee at Cafe',
      amount: '$4.50',
      badge: 'Safe Baseline',
      icon: Coffee,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      cardBorder: 'hover:border-emerald-500/40',
      data: {
        amount: '4.50',
        merchantName: 'Blue Bottle Coffee',
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
      title: 'Sudden $9,800 Wire',
      amount: '$9,800.00',
      badge: 'Amount Spike',
      icon: DollarSign,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      cardBorder: 'hover:border-rose-500/40',
      data: {
        amount: '9800.00',
        merchantName: 'Offshore Cayman Liquidity Ltd',
        merchantCategory: 'Financial Services',
        locationCity: 'George Town',
        locationCountry: 'KY',
        latitude: 19.2869,
        longitude: -81.3674,
        deviceId: 'DEV-UNKNOWN-99',
        ipAddress: '197.234.12.88'
      }
    },
    {
      id: 'travel',
      title: 'Impossible Travel',
      amount: '$650.00',
      badge: 'Tokyo in 15m',
      icon: Plane,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      cardBorder: 'hover:border-amber-500/40',
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
      title: 'Carding Bot Burst',
      amount: '$1.99',
      badge: 'Rapid Probing',
      icon: Bot,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      cardBorder: 'hover:border-cyan-500/40',
      data: {
        amount: '1.99',
        merchantName: 'Automated Micro Test Vendor',
        merchantCategory: 'Digital Goods',
        locationCity: 'Lagos',
        locationCountry: 'NG',
        latitude: 6.5244,
        longitude: 3.3792,
        deviceId: 'DEV-BOT-RUNNER',
        ipAddress: '41.203.77.102'
      }
    }
  ];

  const handleApplyPreset = (preset) => {
    setActivePreset(preset.id);
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
      alert('Error evaluating transaction: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 lg:p-7 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-white/[0.08] gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Interactive AI Fraud Simulator</h3>
            <p className="text-xs text-slate-400">Test live transactions or simulate real-world attack vectors in 1 click</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
          <span>ENSEMBLE SCAN READY</span>
        </div>
      </div>

      {/* 1-Click Evaluation Scenarios */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Select 1-Click Test Vector:</span>
          </label>
          <span className="text-[11px] text-slate-500">Click to autofill scenario</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {presets.map(p => {
            const Icon = p.icon;
            const isSelected = activePreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className={`p-3.5 rounded-xl text-left transition-all border relative flex items-start gap-3 glass-card-interactive ${p.cardBorder} ${
                  isSelected 
                    ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10' 
                    : 'bg-slate-900/50 border-white/[0.06]'
                }`}
              >
                <div className={`p-2 rounded-xl border shrink-0 ${p.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="overflow-hidden flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-white truncate">{p.title}</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-300 mt-0.5">{p.amount}</div>
                  <span className="inline-block text-[10px] text-slate-400 mt-1 px-1.5 py-0.5 rounded bg-white/[0.05]">
                    {p.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Simplified Transaction Form */}
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1.5">
              Amount ($ USD)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">$</span>
              <input
                type="number"
                step="0.01"
                value={form.amount}
                onChange={(e) => {
                  setActivePreset(null);
                  setForm({ ...form, amount: e.target.value });
                }}
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/[0.1] text-base font-bold text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1.5 flex items-center gap-1">
              <Building className="w-3 h-3 text-slate-400" />
              <span>Merchant / Recipient</span>
            </label>
            <input
              type="text"
              value={form.merchantName}
              onChange={(e) => {
                setActivePreset(null);
                setForm({ ...form, merchantName: e.target.value });
              }}
              placeholder="e.g., Apple Store"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/[0.1] text-xs font-medium text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              required
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1.5">
              Category
            </label>
            <input
              type="text"
              value={form.merchantCategory}
              onChange={(e) => {
                setActivePreset(null);
                setForm({ ...form, merchantCategory: e.target.value });
              }}
              placeholder="e.g., Food & Beverage"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/[0.1] text-xs font-medium text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>City Location</span>
            </label>
            <input
              type="text"
              value={form.locationCity}
              onChange={(e) => {
                setActivePreset(null);
                setForm({ ...form, locationCity: e.target.value });
              }}
              placeholder="e.g., San Francisco"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/[0.1] text-xs font-medium text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1.5 flex items-center gap-1">
              <Globe className="w-3 h-3 text-slate-400" />
              <span>Country Code</span>
            </label>
            <input
              type="text"
              value={form.locationCountry}
              onChange={(e) => {
                setActivePreset(null);
                setForm({ ...form, locationCountry: e.target.value.toUpperCase() });
              }}
              placeholder="US"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/[0.1] text-xs font-bold text-white uppercase font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>
        </div>

        {/* Collapsible Advanced Parameters */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-300 font-semibold transition"
          >
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>{showAdvanced ? 'Hide Advanced GPS & Device Telemetry' : 'Show Advanced GPS & Device Telemetry'}</span>
          </button>

          {showAdvanced && (
            <div className="mt-3 p-4 rounded-xl bg-slate-950/60 border border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fadeIn">
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">Latitude:</label>
                <input
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/[0.08] text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">Longitude:</label>
                <input
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/[0.08] text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">IP Address:</label>
                <input
                  type="text"
                  value={form.ipAddress}
                  onChange={(e) => setForm({ ...form, ipAddress: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/[0.08] text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">Device ID:</label>
                <input
                  type="text"
                  value={form.deviceId}
                  onChange={(e) => setForm({ ...form, deviceId: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/[0.08] text-xs text-white font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Action */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-lg shadow-indigo-500/25 transition active:scale-95 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? 'Running Neural Scan...' : 'Scan & Execute Transaction'}</span>
          </button>
        </div>
      </form>

      {/* Dynamic Instant AI Result Card */}
      {lastResult && (
        <div className="p-4.5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0e1629] to-slate-900 border border-white/[0.1] space-y-3.5 shadow-xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">AI Verdict:</span>
              <RiskBadge status={lastResult.status} score={lastResult.riskScore} />
            </div>

            <span className="text-[11px] font-mono text-slate-400">
              Evaluated in <strong className="text-emerald-400">{lastResult.evaluationTimeMs || 4}ms</strong>
            </span>
          </div>

          <p className="text-xs text-slate-200 font-medium">
            {lastResult.primaryReason}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-white/[0.08] text-xs gap-2">
            <span className="text-slate-400 font-mono text-[11px]">
              ID: <span className="text-indigo-300 font-semibold">{lastResult.transactionId}</span>
            </span>

            <button
              type="button"
              onClick={() => onInspectXai(lastResult)}
              className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-bold transition"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Inspect Explainable AI (XAI) Breakdown</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
