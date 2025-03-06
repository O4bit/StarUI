import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


api.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response && error.response.status === 401) {

      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;


export const systemService = {
  getHealth: () => api.get('/system/health'),
  getMetrics: () => api.get('/system/metrics'),
  getMetricsHistory: (timeframe = '24h') => api.get(`/system/metrics/history?timeframe=${timeframe}`),
};


export const logsService = {
  getSystemLogs: (params) => api.get('/logs', { params }),
  getAuditLogs: (params) => api.get('/logs/audit', { params }),
};


export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};