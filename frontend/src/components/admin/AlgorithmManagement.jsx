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
    return <div className="p-8 text-center text-slate-400">Loading algorithm telemetry...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-[#111726] border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-6 border-b border-slate-800/80 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">{model?.modelName || 'NeuroShield AI'}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  {model?.version || 'v2.1'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  PRODUCTION
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Ensemble Anomaly Engine • Random Trees + Z-Score Heuristic + Geo Travel Velocity</p>
            </div>
          </div>

          {model?.updatedAt && (
            <span className="text-[11px] font-mono text-slate-400 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">
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
              <span className="font-semibold text-xs uppercase tracking-wider block">
                {statusMessage.type === 'success' ? 'Algorithm Refinement Output' : 'Update Error'}
              </span>
              <p className="text-sm mt-0.5">{statusMessage.text}</p>
            </div>
          </div>
        )}

        {/* Core Benchmark Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-xs text-slate-400 font-medium">Precision</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">
              {(Number(model?.precisionScore || 0.965) * 100).toFixed(1)}%
            </div>
            <span className="text-[11px] text-slate-500">True Fraud Accuracy</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-xs text-slate-400 font-medium">Recall Rate</span>
            <div className="text-2xl font-bold text-cyan-400 mt-1">
              {(Number(model?.recallScore || 0.942) * 100).toFixed(1)}%
            </div>
            <span className="text-[11px] text-slate-500">Attacks Detected</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-xs text-slate-400 font-medium">F1-Score</span>
            <div className="text-2xl font-bold text-indigo-400 mt-1">
              {(Number(model?.f1Score || 0.953) * 100).toFixed(1)}%
            </div>
            <span className="text-[11px] text-slate-500">Harmonic Balance</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-xs text-slate-400 font-medium">ROC-AUC</span>
            <div className="text-2xl font-bold text-amber-400 mt-1">
              {(Number(model?.rocAucScore || 0.978) * 100).toFixed(1)}%
            </div>
            <span className="text-[11px] text-slate-500">Separability Curve</span>
          </div>
        </div>
      </div>

      {/* Confusion Matrix & Signal Weights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2x2 Confusion Matrix */}
        <div className="bg-[#111726] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">Interactive Confusion Matrix</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              N = {model?.totalEvaluations || 1420} Samples
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* TP */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
              <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                True Positives (TP)
              </div>
              <div className="text-2xl font-mono font-bold text-white mt-1">
                {model?.truePositives || 118}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Fraud correctly intercepted</p>
            </div>

            {/* FP */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20">
              <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                False Positives (FP)
              </div>
              <div className="text-2xl font-mono font-bold text-white mt-1">
                {model?.falsePositives || 4}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Legit flagged as suspicious</p>
            </div>

            {/* FN */}
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20">
              <div className="text-xs text-rose-400 font-semibold uppercase tracking-wider">
                False Negatives (FN)
              </div>
              <div className="text-2xl font-mono font-bold text-white mt-1">
                {model?.falseNegatives || 6}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Undetected fraudulent cases</p>
            </div>

            {/* TN */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs text-slate-300 font-semibold uppercase tracking-wider">
                True Negatives (TN)
              </div>
              <div className="text-2xl font-mono font-bold text-white mt-1">
                {model?.trueNegatives || 1292}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Normal transactions approved</p>
            </div>
          </div>
        </div>

        {/* Feature Weights Calibrator */}
        <div className="bg-[#111726] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Dynamic Ensemble Signal Weights</h3>
            </div>
            <span className="text-xs text-emerald-400 font-mono">Normalized (Σ = 1.0)</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Amount Anomaly Outlier Weight</span>
                <span className="font-mono text-indigo-400 font-bold">
                  {((model?.amountAnomalyWeight || 0.35) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(model?.amountAnomalyWeight || 0.35) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Velocity Burst Limit Weight</span>
                <span className="font-mono text-cyan-400 font-bold">
                  {((model?.velocityWeight || 0.25) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${(model?.velocityWeight || 0.25) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Impossible Travel (Geo Velocity) Weight</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {((model?.geoVelocityWeight || 0.25) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(model?.geoVelocityWeight || 0.25) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Device & Environment Anomaly Weight</span>
                <span className="font-mono text-amber-400 font-bold">
                  {((model?.deviceMismatchWeight || 0.15) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(model?.deviceMismatchWeight || 0.15) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Retrain & Refine Algorithm Section */}
      <div className="bg-[#111726] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-800">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">Active-Learning Feedback & Algorithm Retraining</h3>
            <p className="text-xs text-slate-400">
              Input operator feedback or dispute audit telemetry to trigger machine learning weight recalibration
            </p>
          </div>
        </div>

        <form onSubmit={handleRetrain} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Performance Feedback & Tuning Objectives:
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="e.g., Optimize model to reduce false positives on international travel purchases while maintaining strict velocity burst detection for crypto merchants..."
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Note: Retraining generates a new model snapshot (e.g. {model?.version} → v{parseInt(model?.version?.substring(1) || 2)}.{parseInt(model?.version?.split('.')[1] || 1) + 1}) and recalculates confusion matrix.
            </span>

            <button
              type="submit"
              disabled={retraining}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-500/25 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${retraining ? 'animate-spin' : ''}`} />
              <span>{retraining ? 'Recalibrating Hyperparameters...' : 'Refine & Retrain Algorithm'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
