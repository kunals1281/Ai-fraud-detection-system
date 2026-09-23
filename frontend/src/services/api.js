const API_BASE = '/api';

export const api = {
  // Transactions
  getTransactions: async (userId = '') => {
    const url = userId ? `${API_BASE}/transactions?userId=${encodeURIComponent(userId)}` : `${API_BASE}/transactions`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return res.json();
  },

  submitTransaction: async (data) => {
    const res = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to process transaction');
    }
    return res.json();
  },

  // Alerts
  getAlerts: async (userId = '') => {
    const url = userId ? `${API_BASE}/alerts?userId=${encodeURIComponent(userId)}` : `${API_BASE}/alerts`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
  },

  resolveAlert: async (alertId, resolutionData) => {
    const res = await fetch(`${API_BASE}/alerts/${alertId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resolutionData)
    });
    if (!res.ok) throw new Error('Failed to resolve alert');
    return res.json();
  },

  // Admin Configuration
  getSystemConfig: async () => {
    const res = await fetch(`${API_BASE}/admin/config`);
    if (!res.ok) throw new Error('Failed to fetch system config');
    return res.json();
  },

  updateSystemConfig: async (configData) => {
    const res = await fetch(`${API_BASE}/admin/config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(configData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update configuration');
    }
    return res.json();
  },

  // Admin Reports & Analytics
  getDetectionReports: async () => {
    const res = await fetch(`${API_BASE}/admin/reports`);
    if (!res.ok) throw new Error('Failed to fetch detection reports');
    return res.json();
  },

  // Algorithm Management
  getAlgorithmModel: async () => {
    const res = await fetch(`${API_BASE}/admin/algorithm`);
    if (!res.ok) throw new Error('Failed to fetch algorithm model');
    return res.json();
  },

  retrainAlgorithm: async (feedbackData = {}) => {
    const res = await fetch(`${API_BASE}/admin/algorithm/retrain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedbackData)
    });
    if (!res.ok) throw new Error('Failed to retrain algorithm');
    return res.json();
  }
};
