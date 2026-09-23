const API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : '/api';

// Fallback in-memory state for standalone Vercel preview if backend is not yet deployed
let fallbackTransactions = [
  {
    id: 1,
    transactionId: "TX-9901",
    userId: "USR-9821",
    userEmail: "kunal@fintech.io",
    amount: 9450.00,
    currency: "USD",
    merchantName: "Offshore Crypto Liquidity Ltd",
    merchantCategory: "Cryptocurrency",
    locationCity: "George Town",
    locationCountry: "KY",
    latitude: 19.2869,
    longitude: -81.3674,
    ipAddress: "197.234.12.88",
    deviceId: "DEV-WIN-UNKNOWN-99",
    timestamp: new Date().toISOString(),
    status: "BLOCKED",
    riskScore: 87.5,
    isAnomaly: true,
    primaryReason: "Severe Amount Spike & Impossible Travel: 5,200 km in 1 hr",
    riskFactors: [
      { name: "Amount Outlier (Z-Score)", contributionPercent: 32.5, description: "Severe Amount Spike: $9,450.00 is 5.2σ above user mean", isFlagged: true },
      { name: "Device & Environment Anomaly", contributionPercent: 14.0, description: "High-risk jurisdiction (KY). Unrecognized Device Fingerprint.", isFlagged: true },
      { name: "Velocity Burst", contributionPercent: 3.0, description: "Normal velocity: 1 transaction(s) in 10 minutes", isFlagged: false },
      { name: "Impossible Travel (Geo-Velocity)", contributionPercent: 38.0, description: "Impossible Travel: 5,200 km from San Francisco in 1 hour", isFlagged: true }
    ]
  },
  {
    id: 2,
    transactionId: "TX-8801",
    userId: "USR-9821",
    userEmail: "kunal@fintech.io",
    amount: 45.50,
    currency: "USD",
    merchantName: "Blue Bottle Coffee",
    merchantCategory: "Food & Beverage",
    locationCity: "San Francisco",
    locationCountry: "US",
    latitude: 37.7749,
    longitude: -122.4194,
    ipAddress: "192.168.1.10",
    deviceId: "DEV-MAC-KUNAL",
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: "APPROVED",
    riskScore: 12.0,
    isAnomaly: false,
    primaryReason: "Normal transaction pattern",
    riskFactors: [
      { name: "Amount Outlier (Z-Score)", contributionPercent: 3.0, description: "Amount within normal baseline", isFlagged: false },
      { name: "Velocity Burst", contributionPercent: 2.0, description: "Normal cadence", isFlagged: false },
      { name: "Impossible Travel (Geo-Velocity)", contributionPercent: 2.0, description: "Location verified", isFlagged: false },
      { name: "Device & Environment Anomaly", contributionPercent: 2.0, description: "Trusted device", isFlagged: false }
    ]
  }
];

let fallbackAlerts = [
  {
    id: 1,
    alertId: "ALT-1001",
    transactionId: "TX-9901",
    userId: "USR-9821",
    amount: 9450.00,
    currency: "USD",
    merchantName: "Offshore Crypto Liquidity Ltd",
    riskScore: 87.5,
    reason: "Severe Amount Spike & Impossible Travel: 5,200 km in 1 hr",
    severity: "CRITICAL",
    status: "PENDING_REVIEW",
    createdAt: new Date().toISOString()
  }
];

let fallbackConfig = {
  flagRiskThreshold: 40.0,
  blockRiskThreshold: 75.0,
  zScoreThreshold: 2.5,
  maxVelocityTransactions: 4,
  velocityWindowMinutes: 10,
  maxTravelSpeedKmH: 800.0,
  autoBlockEnabled: true,
  updatedAt: new Date().toISOString()
};

let fallbackModel = {
  id: 1,
  modelName: "NeuroShield Ensemble Anomaly Detector",
  version: "v2.2",
  precisionScore: 0.985,
  recallScore: 0.964,
  f1Score: 0.974,
  rocAucScore: 0.984,
  totalEvaluations: 1434,
  truePositives: 132,
  falsePositives: 2,
  trueNegatives: 1412,
  falseNegatives: 5,
  amountAnomalyWeight: 0.37,
  velocityWeight: 0.26,
  geoVelocityWeight: 0.24,
  deviceMismatchWeight: 0.13,
  updatedAt: new Date().toISOString()
};

export const api = {
  // Transactions
  getTransactions: async (userId = '') => {
    try {
      const url = userId ? `${API_BASE}/transactions?userId=${encodeURIComponent(userId)}` : `${API_BASE}/transactions`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend unavailable, using client-side fallback:', e.message);
    }
    return userId ? fallbackTransactions.filter(t => t.userId === userId) : fallbackTransactions;
  },

  submitTransaction: async (data) => {
    try {
      const res = await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend unavailable, executing client-side simulation:', e.message);
    }

    // Client-side simulation fallback
    const isHighAmount = parseFloat(data.amount) > 5000;
    const isCrypto = (data.merchantName || '').toLowerCase().includes('crypto') || (data.locationCountry === 'KY');
    const isTokyo = (data.locationCity || '').toLowerCase().includes('tokyo');
    const isBot = (data.merchantName || '').toLowerCase().includes('micro') || (data.merchantName || '').toLowerCase().includes('bot');

    let status = 'APPROVED';
    let riskScore = 12.0;
    let reason = 'Normal transaction pattern';
    let isAnomaly = false;

    if (isTokyo) {
      status = 'BLOCKED';
      riskScore = 88.0;
      isAnomaly = true;
      reason = 'Impossible Travel: 12,531 km traveled in 0 mins (Speed: 6,254 km/h exceeds 800 km/h limit)';
    } else if (isHighAmount || isCrypto) {
      status = 'BLOCKED';
      riskScore = 85.0;
      isAnomaly = true;
      reason = `Severe Amount Spike: $${parseFloat(data.amount).toFixed(2)} on high-risk jurisdiction (${data.locationCountry})`;
    } else if (isBot) {
      status = 'BLOCKED';
      riskScore = 82.0;
      isAnomaly = true;
      reason = 'Critical Carding/Bot Velocity: Rapid automated probing pattern';
    }

    const newTx = {
      id: fallbackTransactions.length + 1,
      transactionId: 'TX-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      userId: data.userId || 'USR-9821',
      userEmail: data.userEmail || 'kunal@fintech.io',
      amount: parseFloat(data.amount) || 10,
      currency: data.currency || 'USD',
      merchantName: data.merchantName || 'Demo Merchant',
      merchantCategory: data.merchantCategory || 'General',
      locationCity: data.locationCity || 'San Francisco',
      locationCountry: data.locationCountry || 'US',
      latitude: data.latitude,
      longitude: data.longitude,
      ipAddress: data.ipAddress || '192.168.1.1',
      deviceId: data.deviceId || 'DEV-WEB',
      timestamp: new Date().toISOString(),
      status: status,
      riskScore: riskScore,
      isAnomaly: isAnomaly,
      primaryReason: reason,
      evaluationTimeMs: 4,
      riskFactors: [
        { name: "Amount Outlier (Z-Score)", contributionPercent: isHighAmount ? 35.0 : 4.0, description: isHighAmount ? `Severe outlier: $${data.amount}` : "Amount normal", isFlagged: isHighAmount },
        { name: "Velocity Burst", contributionPercent: isBot ? 40.0 : 3.0, description: isBot ? "Rapid bot burst detected" : "Normal cadence", isFlagged: isBot },
        { name: "Impossible Travel (Geo-Velocity)", contributionPercent: isTokyo ? 35.0 : 2.0, description: isTokyo ? "12,531 km traveled in 0m" : "Consistent location", isFlagged: isTokyo },
        { name: "Device & Environment Anomaly", contributionPercent: isCrypto ? 25.0 : 3.0, description: isCrypto ? "Offshore jurisdiction (KY)" : "Trusted device", isFlagged: isCrypto }
      ]
    };

    fallbackTransactions.unshift(newTx);
    if (status !== 'APPROVED') {
      fallbackAlerts.unshift({
        id: fallbackAlerts.length + 1,
        alertId: 'ALT-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        transactionId: newTx.transactionId,
        userId: newTx.userId,
        amount: newTx.amount,
        currency: newTx.currency,
        merchantName: newTx.merchantName,
        riskScore: newTx.riskScore,
        reason: newTx.primaryReason,
        severity: status === 'BLOCKED' ? 'CRITICAL' : 'HIGH',
        status: 'PENDING_REVIEW',
        createdAt: new Date().toISOString()
      });
    }

    return newTx;
  },

  // Alerts
  getAlerts: async (userId = '') => {
    try {
      const url = userId ? `${API_BASE}/alerts?userId=${encodeURIComponent(userId)}` : `${API_BASE}/alerts`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend unavailable, using alerts fallback');
    }
    return userId ? fallbackAlerts.filter(a => a.userId === userId) : fallbackAlerts;
  },

  resolveAlert: async (alertId, resolutionData) => {
    try {
      const res = await fetch(`${API_BASE}/alerts/${alertId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resolutionData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend unavailable, resolving alert locally');
    }
    const alert = fallbackAlerts.find(a => a.alertId === alertId);
    if (alert) {
      alert.status = resolutionData.status;
      alert.resolvedAt = new Date().toISOString();
      alert.resolvedBy = resolutionData.resolvedBy;
    }
    return alert || { alertId, ...resolutionData };
  },

  // Admin Configuration
  getSystemConfig: async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/config`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend unavailable, using config fallback');
    }
    return fallbackConfig;
  },

  updateSystemConfig: async (configData) => {
    try {
      const res = await fetch(`${API_BASE}/admin/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend unavailable, saving config locally');
    }
    fallbackConfig = { ...fallbackConfig, ...configData, updatedAt: new Date().toISOString() };
    return {
      message: 'System configuration updated successfully. New detection thresholds applied.',
      success: true,
      config: fallbackConfig
    };
  },

  // Admin Reports & Analytics
  getDetectionReports: async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/reports`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend unavailable, compiling reports fallback');
    }
    const blockedCount = fallbackTransactions.filter(t => t.status === 'BLOCKED').length;
    const suspiciousCount = fallbackTransactions.filter(t => t.status === 'SUSPICIOUS').length;
    const totalAmount = fallbackTransactions.reduce((acc, t) => acc + (t.amount || 0), 0);
    const blockedAmount = fallbackTransactions.filter(t => t.status !== 'APPROVED').reduce((acc, t) => acc + (t.amount || 0), 0);

    return {
      totalTransactions: fallbackTransactions.length,
      totalFraudCases: blockedCount,
      totalSuspiciousCases: suspiciousCount,
      totalApprovedCases: fallbackTransactions.length - (blockedCount + suspiciousCount),
      fraudRatePercent: fallbackTransactions.length > 0 ? Math.round(((blockedCount + suspiciousCount) / fallbackTransactions.length) * 1000) / 10 : 0,
      totalBlockedAmount: blockedAmount,
      totalProcessedAmount: totalAmount,
      casesByCategory: { "Cryptocurrency": 1, "Digital Goods": 1, "Luxury Goods": 1 },
      casesByCountry: { "KY": 1, "NG": 1, "JP": 1 },
      recentFlaggedTransactions: fallbackTransactions.filter(t => t.status !== 'APPROVED'),
      pendingAlerts: fallbackAlerts.filter(a => a.status === 'PENDING_REVIEW')
    };
  },

  // Algorithm Management
  getAlgorithmModel: async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/algorithm`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend unavailable, using model fallback');
    }
    return fallbackModel;
  },

  retrainAlgorithm: async (feedbackData = {}) => {
    try {
      const res = await fetch(`${API_BASE}/admin/algorithm/retrain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend unavailable, recalibrating model locally');
    }
    const currentV = parseFloat(fallbackModel.version.replace('v', '')) || 2.2;
    fallbackModel = {
      ...fallbackModel,
      version: `v${(currentV + 0.1).toFixed(1)}`,
      precisionScore: 0.988,
      recallScore: 0.969,
      f1Score: 0.978,
      rocAucScore: 0.989,
      truePositives: fallbackModel.truePositives + 15,
      updatedAt: new Date().toISOString()
    };
    return {
      message: `Fraud detection algorithm model successfully refined and calibrated to version ${fallbackModel.version}`,
      success: true,
      updatedModel: fallbackModel
    };
  }
};
