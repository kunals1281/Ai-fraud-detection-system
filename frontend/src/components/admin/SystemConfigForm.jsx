import React, { useState, useEffect } from 'react';
import { Sliders, Save, CheckCircle2, AlertCircle, Shield, Gauge, Zap, Plane, Activity, ToggleLeft, ToggleRight } from 'lucide-react';
import { api } from '../../services/api';

export default function SystemConfigForm({ onConfigSaved }) {
  const [config, setConfig] = useState({
    flagRiskThreshold: 40.0,
    blockRiskThreshold: 75.0,
    zScoreThreshold: 2.5,
    maxVelocityTransactions: 4,
    velocityWindowMinutes: 10,
    maxTravelSpeedKmH: 800.0,
    autoBlockEnabled: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const data = await api.getSystemConfig();
      setConfig(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (preset) => {
    if (preset === 'strict') {
      setConfig(prev => ({
        ...prev,
        flagRiskThreshold: 30.0,
        blockRiskThreshold: 65.0,
        zScoreThreshold: 2.0,
        maxVelocityTransactions: 3,
        velocityWindowMinutes: 15,
        maxTravelSpeedKmH: 600.0,
        autoBlockEnabled: true
      }));
    } else if (preset === 'balanced') {
      setConfig(prev => ({
        ...prev,
        flagRiskThreshold: 40.0,
        blockRiskThreshold: 75.0,
        zScoreThreshold: 2.5,
        maxVelocityTransactions: 4,
        velocityWindowMinutes: 10,
        maxTravelSpeedKmH: 800.0,
        autoBlockEnabled: true
      }));
    } else if (preset === 'permissive') {
      setConfig(prev => ({
        ...prev,
        flagRiskThreshold: 55.0,
        blockRiskThreshold: 85.0,
        zScoreThreshold: 3.5,
        maxVelocityTransactions: 6,
        velocityWindowMinutes: 5,
        maxTravelSpeedKmH: 1000.0,
        autoBlockEnabled: true
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setStatusMessage(null);
      const res = await api.updateSystemConfig({
        ...config,
        updatedBy: 'Security_Operations'
      });
      setStatusMessage({
        type: 'success',
        text: res.message || 'Detection thresholds updated and applied to active ingestion pipeline.'
      });
      if (onConfigSaved) onConfigSaved();
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to update configuration.'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center text-slate-400">
        <Sliders className="w-8 h-8 animate-spin mx-auto text-indigo-400 mb-3" />
        <p className="text-sm">Loading security parameters...</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 lg:p-8 shadow-xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-white/[0.08] gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Security & Detection Rules Matrix</h2>
            <p className="text-xs text-slate-400">Calibrate real-time anomaly thresholds and autonomous intervention limits</p>
          </div>
        </div>

        {/* Security Profile Presets */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-white/[0.08]">
          <span className="text-[11px] text-slate-500 px-2 font-medium">Presets:</span>
          <button
            type="button"
            onClick={() => applyPreset('strict')}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-400 hover:text-white hover:bg-white/[0.04] transition"
          >
            Strict
          </button>
          <button
            type="button"
            onClick={() => applyPreset('balanced')}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/50 transition"
          >
            Balanced
          </button>
          <button
            type="button"
            onClick={() => applyPreset('permissive')}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-400 hover:text-white hover:bg-white/[0.04] transition"
          >
            Permissive
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
          statusMessage.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
        }`}>
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          )}
          <div>
            <span className="font-bold text-xs uppercase tracking-wider block">
              {statusMessage.type === 'success' ? 'Settings Saved' : 'Update Failed'}
            </span>
            <p className="text-xs mt-0.5">{statusMessage.text}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Flag Risk Threshold */}
          <div className="p-4.5 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Gauge className="w-4 h-4 text-amber-400" />
                <span>Suspicious 2FA Challenge Threshold</span>
              </div>
              <span className="font-mono text-xs font-bold text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                {config.flagRiskThreshold} / 100
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              step="1"
              value={config.flagRiskThreshold}
              onChange={(e) => setConfig({ ...config, flagRiskThreshold: parseFloat(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Transactions exceeding this risk level will prompt the cardholder with a 2FA mobile challenge.
            </p>
          </div>

          {/* Block Risk Threshold */}
          <div className="p-4.5 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Shield className="w-4 h-4 text-rose-400" />
                <span>Auto-Block Risk Threshold</span>
              </div>
              <span className="font-mono text-xs font-bold text-rose-400 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20">
                {config.blockRiskThreshold} / 100
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="99"
              step="1"
              value={config.blockRiskThreshold}
              onChange={(e) => setConfig({ ...config, blockRiskThreshold: parseFloat(e.target.value) })}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Transactions exceeding this risk score are immediately declined and card temporarily frozen.
            </p>
          </div>

          {/* Statistical Z-Score Sensitivity */}
          <div className="p-4.5 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Activity className="w-4 h-4 text-indigo-400" />
                <span>Z-Score Sensitivity (Outlier Limit)</span>
              </div>
              <span className="font-mono text-xs font-bold text-indigo-400 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                {config.zScoreThreshold} σ
              </span>
            </div>
            <input
              type="range"
              min="1.5"
              max="4.5"
              step="0.1"
              value={config.zScoreThreshold}
              onChange={(e) => setConfig({ ...config, zScoreThreshold: parseFloat(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Flags spending that deviates by {config.zScoreThreshold} standard deviations from user normal baseline.
            </p>
          </div>

          {/* Impossible Travel Speed Limit */}
          <div className="p-4.5 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Plane className="w-4 h-4 text-cyan-400" />
                <span>Impossible Travel Speed Limit</span>
              </div>
              <span className="font-mono text-xs font-bold text-cyan-400 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                {config.maxTravelSpeedKmH} km/h
              </span>
            </div>
            <input
              type="range"
              min="300"
              max="1200"
              step="50"
              value={config.maxTravelSpeedKmH}
              onChange={(e) => setConfig({ ...config, maxTravelSpeedKmH: parseFloat(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Maximum physical velocity allowed between consecutive transactions before triggering Geo-Impossible flag.
            </p>
          </div>

          {/* Velocity Burst Controls */}
          <div className="p-4.5 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Max Velocity Burst Count</span>
              </div>
              <span className="font-mono text-xs font-bold text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                {config.maxVelocityTransactions} tx / {config.velocityWindowMinutes}m
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Max Transactions:</label>
                <input
                  type="number"
                  min="2"
                  max="20"
                  value={config.maxVelocityTransactions}
                  onChange={(e) => setConfig({ ...config, maxVelocityTransactions: parseInt(e.target.value) || 4 })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-white/[0.08] text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Window (Mins):</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={config.velocityWindowMinutes}
                  onChange={(e) => setConfig({ ...config, velocityWindowMinutes: parseInt(e.target.value) || 10 })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-white/[0.08] text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Auto-Block Toggle Card */}
          <div className="p-4.5 rounded-xl bg-slate-900/60 border border-white/[0.06] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-white block">Autonomous Threat Neutralization</span>
              <p className="text-[11px] text-slate-400 max-w-xs">
                When enabled, high-threat transactions are blocked in 0ms without waiting for manual human audit.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setConfig({ ...config, autoBlockEnabled: !config.autoBlockEnabled })}
              className={`p-2 rounded-xl transition ${
                config.autoBlockEnabled 
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-slate-800 text-slate-400 border border-white/[0.08]'
              }`}
            >
              {config.autoBlockEnabled ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
          <span className="text-xs text-slate-400">
            Changes take effect immediately across all live evaluation nodes.
          </span>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-500/25 transition active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating Parameters...' : 'Apply Security Rules'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
