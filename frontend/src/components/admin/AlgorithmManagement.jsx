import React, { useState, useEffect } from 'react';
import { Cpu, RefreshCw, CheckCircle2, TrendingUp, Layers, Sliders, Sparkles, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export default function AlgorithmManagement({ onAlgorithmUpdated }) {
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    try {
      setLoading(true);
      const data = await api.getAlgorithmModel();
      setModel(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetrain = async (e) => {
    e.preventDefault();
    try {
      setRetraining(true);
      setStatusMessage(null);
      const res = await api.retrainAlgorithm({
        feedbackNotes: feedback || 'Active learning calibration using latest verified fraud cases and dispute feedback.',
        adminUser: 'Admin_Lead_Engineer'
      });
      setModel(res.updatedModel);
      setStatusMessage({
        type: 'success',
        text: res.message || `Algorithm model successfully updated to version ${res.updatedModel.version}`
      });
      setFeedback('');
      if (onAlgorithmUpdated) onAlgorithmUpdated();
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to update algorithm.'
      });
    } finally {
      setRetraining(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center text-slate-400">
        <Cpu className="w-8 h-8 animate-spin mx-auto text-indigo-400 mb-3" />
        <p className="text-sm">Loading algorithm telemetry & model weights...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="glass-card rounded-2xl p-6 lg:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-6 border-b border-white/[0.08] gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">{model?.modelName || 'NeuroShield AI'}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {model?.version || 'v2.2'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  PRODUCTION ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Ensemble Architecture • Random Forest + Z-Score Heuristic + Geolocation Velocity Engine</p>
            </div>
          </div>

          {model?.updatedAt && (
            <span className="text-[11px] font-mono text-slate-400 px-3 py-1 rounded-xl bg-slate-900 border border-white/[0.08]">
              Calibrated: {new Date(model.updatedAt).toLocaleTimeString()}
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
              <span className="font-bold text-xs uppercase tracking-wider block">
                {statusMessage.type === 'success' ? 'Model Recalibration Successful' : 'Update Failed'}
              </span>
              <p className="text-xs mt-0.5">{statusMessage.text}</p>
            </div>
          </div>
        )}

        {/* Core Benchmark Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.06]">
            <span className="text-xs text-slate-400 font-medium">Precision</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {(Number(model?.precisionScore || 0.985) * 100).toFixed(1)}%
            </div>
            <span className="text-[11px] text-slate-500">True Fraud Accuracy</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.06]">
            <span className="text-xs text-slate-400 font-medium">Recall Rate</span>
            <div className="text-2xl font-black text-cyan-400 mt-1">
              {(Number(model?.recallScore || 0.964) * 100).toFixed(1)}%
            </div>
            <span className="text-[11px] text-slate-500">Attacks Intercepted</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.06]">
            <span className="text-xs text-slate-400 font-medium">F1-Score</span>
            <div className="text-2xl font-black text-indigo-400 mt-1">
              {(Number(model?.f1Score || 0.974) * 100).toFixed(1)}%
            </div>
            <span className="text-[11px] text-slate-500">Harmonic Balance</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.06]">
            <span className="text-xs text-slate-400 font-medium">ROC-AUC</span>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {(Number(model?.rocAucScore || 0.984) * 100).toFixed(1)}%
            </div>
            <span className="text-[11px] text-slate-500">Separability Curve</span>
          </div>
        </div>
      </div>

      {/* Confusion Matrix & Signal Weights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2x2 Confusion Matrix */}
        <div className="glass-card rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Active Confusion Matrix</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              N = {model?.totalEvaluations || 1434} Samples
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* TP */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/25">
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">
                True Positives (TP)
              </span>
              <div className="text-2xl font-mono font-bold text-white mt-1">
                {model?.truePositives || 132}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Fraud correctly blocked</p>
            </div>

            {/* FP */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/25">
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">
                False Positives (FP)
              </span>
              <div className="text-2xl font-mono font-bold text-white mt-1">
                {model?.falsePositives || 2}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Legitimate marked suspicious</p>
            </div>

            {/* FN */}
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/25">
              <span className="text-xs text-rose-400 font-bold uppercase tracking-wider block">
                False Negatives (FN)
              </span>
              <div className="text-2xl font-mono font-bold text-white mt-1">
                {model?.falseNegatives || 5}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Undetected fraudulent cases</p>
            </div>

            {/* TN */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.06]">
              <span className="text-xs text-slate-300 font-bold uppercase tracking-wider block">
                True Negatives (TN)
              </span>
              <div className="text-2xl font-mono font-bold text-white mt-1">
                {model?.trueNegatives || 1412}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Normal transactions approved</p>
            </div>
          </div>
        </div>

        {/* Feature Weights Calibrator */}
        <div className="glass-card rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Dynamic Ensemble Feature Weights</h3>
            </div>
            <span className="text-xs text-emerald-400 font-mono">Normalized (Σ = 1.0)</span>
          </div>

          <div className="space-y-4 pt-1">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Amount Outlier (Z-Score)</span>
                <span className="font-mono text-indigo-400 font-bold">
                  {((model?.amountAnomalyWeight || 0.37) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/[0.04]">
                <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${(model?.amountAnomalyWeight || 0.37) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Velocity Burst Limit</span>
                <span className="font-mono text-cyan-400 font-bold">
                  {((model?.velocityWeight || 0.26) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/[0.04]">
                <div className="bg-cyan-500 h-full rounded-full transition-all duration-500" style={{ width: `${(model?.velocityWeight || 0.26) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Impossible Travel (Geo-Velocity)</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {((model?.geoVelocityWeight || 0.24) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/[0.04]">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${(model?.geoVelocityWeight || 0.24) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Device & Jurisdiction Anomaly</span>
                <span className="font-mono text-amber-400 font-bold">
                  {((model?.deviceMismatchWeight || 0.13) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/[0.04]">
                <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${(model?.deviceMismatchWeight || 0.13) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Retrain & Refine Algorithm Section */}
      <div className="glass-card rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5 pb-3.5 border-b border-white/[0.08]">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Active Learning & Model Calibration</h3>
            <p className="text-xs text-slate-400">
              Provide operator audit notes or feedback to trigger automatic weight recalibration
            </p>
          </div>
        </div>

        <form onSubmit={handleRetrain} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Tuning Objectives & Audit Notes:
            </label>
            <textarea
              rows={2}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="e.g., Optimize model to minimize false positives on cross-border travel while maintaining zero tolerance on carding bot probes..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
            <span className="text-xs text-slate-500">
              Retraining immediately creates a new model snapshot (v2.2 → v2.3) and recalibrates confusion telemetry.
            </span>

            <button
              type="submit"
              disabled={retraining}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-500/25 transition active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${retraining ? 'animate-spin' : ''}`} />
              <span>{retraining ? 'Recalibrating Hyperparameters...' : 'Refine & Retrain Model'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
