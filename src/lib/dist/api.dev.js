"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authService = exports.logsService = exports.systemService = exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api'; // Create axios instance

var api = _axios["default"].create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
}); // Response interceptor for error handling


api.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  // Handle session expiration
  if (error.response && error.response.status === 401) {
    // Check if we're not already on the login page
    if (!window.location.pathname.includes('/login')) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
  }

  return Promise.reject(error);
});
var _default = api; // System services

exports["default"] = _default;
var systemService = {
  getHealth: function getHealth() {
    return api.get('/system/health');
  },
  getMetrics: function getMetrics() {
    return api.get('/system/metrics');
  },
  getMetricsHistory: function getMetricsHistory() {
    var timeframe = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '24h';
    return api.get("/system/metrics/history?timeframe=".concat(timeframe));
  }
}; // Logs services

exports.systemService = systemService;
var logsService = {
  getSystemLogs: function getSystemLogs(params) {
    return api.get('/logs', {
      params: params
    });
  },
  getAuditLogs: function getAuditLogs(params) {
    return api.get('/logs/audit', {
      params: params
    });
  }
}; // Auth services

exports.logsService = logsService;
var authService = {
  login: function login(credentials) {
    return api.post('/auth/login', credentials);
  },
  logout: function logout() {
    return api.post('/auth/logout');
  },
  getCurrentUser: function getCurrentUser() {
    return api.get('/auth/me');
  }
};
exports.authService = authService;