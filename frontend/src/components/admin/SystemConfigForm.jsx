import React, { useState, useEffect } from 'react';
import { Sliders, Save, CheckCircle2, AlertCircle, Shield, Gauge, Zap, Plane } from 'lucide-react';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setStatusMessage(null);
      const res = await api.updateSystemConfig({
        ...config,
        updatedBy: 'Admin_Ops'
      });
      setStatusMessage({
        type: 'success',
        text: res.message || 'System configuration updated successfully. New detection thresholds applied.'
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
    return <div className="p-8 text-center text-slate-400">Loading detection parameters...</div>;
  }

  return (
    <div className="bg-[#111726] border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-6 border-b border-slate-800/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">System Configuration Matrix</h2>
            <p className="text-xs text-slate-400">Configure machine learning detection thresholds and real-time rule parameters</p>
          </div>
        </div>

        {config.updatedAt && (
          <span className="text-[11px] font-mono text-slate-400 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">
            Last Updated: {new Date(config.updatedAt).toLocaleTimeString()}
          </span>
        )}
      </div>

      {statusMessage && (
        <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 transition-all ${
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
            <span className="font-semibold text-xs uppercase tracking-wider block">
              {statusMessage.type === 'success' ? 'Configuration Confirmation' : 'Update Failed'}
            </span>
            <p className="text-sm mt-0.5">{statusMessage.text}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Flag Risk Threshold */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Gauge className="w-4 h-4 text-amber-400" />
                <span>Suspicious Flag Threshold</span>
              </div>
              <span className="font-mono text-sm font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
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
            <p className="text-xs text-slate-400">
              Transactions with risk score ≥ this threshold trigger user challenge & suspicious alert.
            </p>
          </div>

          {/* Block Risk Threshold */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Shield className="w-4 h-4 text-rose-400" />
                <span>Auto-Block Risk Threshold</span>
              </div>
              <span className="font-mono text-sm font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
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
            <p className="text-xs text-slate-400">
              Transactions with risk score ≥ this threshold are automatically rejected and blocked immediately.
            </p>
          </div>

          {/* Z-Score Sensitivity */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Gauge className="w-4 h-4 text-indigo-400" />
                <span>Amount Anomaly (Z-Score σ)</span>
              </div>
              <span className="font-mono text-sm font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                {config.zScoreThreshold} σ
              </span>
            </div>
            <input
              type="range"
              min="1.5"
              max="5.0"
              step="0.1"
              value={config.zScoreThreshold}
              onChange={(e) => setConfig({ ...config, zScoreThreshold: parseFloat(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <p className="text-xs text-slate-400">
              Statistical standard deviation cutoff above historical mean to flag amount spikes.
            </p>
          </div>

          {/* Velocity Window & Count */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Max Velocity Burst Limit</span>
              </div>
              <span className="font-mono text-sm font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                {config.maxVelocityTransactions} tx / {config.velocityWindowMinutes} min
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Max Transactions:</label>
                <input
                  type="number"
                  min="2"
                  max="20"
                  value={config.maxVelocityTransactions}
                  onChange={(e) => setConfig({ ...config, maxVelocityTransactions: parseInt(e.target.value) || 4 })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Window (Mins):</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={config.velocityWindowMinutes}
                  onChange={(e) => setConfig({ ...config, velocityWindowMinutes: parseInt(e.target.value) || 10 })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Prevents carding bots and rapid automated transaction bursts.
            </p>
          </div>

          {/* Travel Speed Limit */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Plane className="w-4 h-4 text-emerald-400" />
                <span>Impossible Travel Speed Limit</span>
              </div>
              <span className="font-mono text-sm font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                {config.maxTravelSpeedKmH} km/h
              </span>
            </div>
            <input
              type="range"
              min="300"
              max="1500"
              step="50"
              value={config.maxTravelSpeedKmH}
              onChange={(e) => setConfig({ ...config, maxTravelSpeedKmH: parseFloat(e.target.value) })}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <p className="text-xs text-slate-400">
              Calculates Haversine distance between consecutive physical locations divided by elapsed time.
            </p>
          </div>

          {/* Auto Block Toggle */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-400" />
                <span>Autonomous Threat Neutralization</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Automatically block high-risk transactions instantly without manual operator intervention.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.autoBlockEnabled}
                onChange={(e) => setConfig({ ...config, autoBlockEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={loadConfig}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
          >
            Reset Defaults
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-500/25 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating Matrix...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
