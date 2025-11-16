import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Distributions API
 */
export const distributionsApi = {
  // Get all distributions
  getAll: async (limit = 20, offset = 0) => {
    const response = await api.get(`/distributions?limit=${limit}&offset=${offset}`);
    return response.data;
  },

  // Get distribution by ID
  getById: async (id) => {
    const response = await api.get(`/distributions/${id}`);
    return response.data;
  },

  // Create distribution from JSON
  create: async (data) => {
    const response = await api.post('/distributions/create', data);
    return response.data;
  },

  // Upload CSV
  uploadCSV: async (file, metadata) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', metadata.name);
    formData.append('type', metadata.type);
    formData.append('tokenAddress', metadata.tokenAddress);
    formData.append('tokenSymbol', metadata.tokenSymbol);

    const response = await api.post('/distributions/upload-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Propose distribution to Safe
  propose: async (id) => {
    const response = await api.post(`/distributions/${id}/propose`);
    return response.data;
  },

  // Download CSV template
  downloadTemplate: () => {
    window.open(`${API_URL}/api/distributions/template/csv`, '_blank');
  },

  // Get audit logs
  getAuditLogs: async (limit = 50, offset = 0) => {
    const response = await api.get(`/distributions/audit/logs?limit=${limit}&offset=${offset}`);
    return response.data;
  },
};

/**
 * Safe API
 */
export const safeApi = {
  // Get Safe info
  getInfo: async () => {
    const response = await api.get('/safe/info');
    return response.data;
  },

  // Execute Safe transaction
  execute: async (safeTxHash) => {
    const response = await api.post(`/safe/execute/${safeTxHash}`);
    return response.data;
  },
};

export default api;
