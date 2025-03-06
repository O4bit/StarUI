"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.appwriteService = void 0;

var _appwrite = require("appwrite");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var client = new _appwrite.Client();
client.setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1').setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID || '');
var account = new _appwrite.Account(client);
var databases = new _appwrite.Databases(client);
var databaseId = process.env.REACT_APP_APPWRITE_DATABASE_ID || '';
var metricsCollectionId = process.env.REACT_APP_APPWRITE_METRICS_COLLECTION_ID || '';
var logsCollectionId = process.env.REACT_APP_APPWRITE_LOGS_COLLECTION_ID || '';
var appwriteService = {
  createAccount: function createAccount(email, password, name) {
    var response;
    return regeneratorRuntime.async(function createAccount$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return regeneratorRuntime.awrap(account.create('unique()', email, password, name));

          case 3:
            response = _context.sent;

            if (!response) {
              _context.next = 8;
              break;
            }

            _context.next = 7;
            return regeneratorRuntime.awrap(appwriteService.login(email, password));

          case 7:
            return _context.abrupt("return", _context.sent);

          case 8:
            return _context.abrupt("return", response);

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](0);
            throw _context.t0;

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 11]]);
  },
  login: function login(email, password) {
    return regeneratorRuntime.async(function login$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return regeneratorRuntime.awrap(account.createEmailSession(email, password));

          case 3:
            return _context2.abrupt("return", _context2.sent);

          case 6:
            _context2.prev = 6;
            _context2.t0 = _context2["catch"](0);
            throw _context2.t0;

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 6]]);
  },
  logout: function logout() {
    return regeneratorRuntime.async(function logout$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return regeneratorRuntime.awrap(account.deleteSession('current'));

          case 3:
            return _context3.abrupt("return", _context3.sent);

          case 6:
            _context3.prev = 6;
            _context3.t0 = _context3["catch"](0);
            throw _context3.t0;

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[0, 6]]);
  },
  getCurrentUser: function getCurrentUser() {
    return regeneratorRuntime.async(function getCurrentUser$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return regeneratorRuntime.awrap(account.get());

          case 3:
            return _context4.abrupt("return", _context4.sent);

          case 6:
            _context4.prev = 6;
            _context4.t0 = _context4["catch"](0);
            console.error("Error getting current user:", _context4.t0);
            return _context4.abrupt("return", null);

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[0, 6]]);
  },
  getMetrics: function getMetrics() {
    var limit,
        _args5 = arguments;
    return regeneratorRuntime.async(function getMetrics$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            limit = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : 100;
            _context5.prev = 1;
            _context5.next = 4;
            return regeneratorRuntime.awrap(databases.listDocuments(databaseId, metricsCollectionId, [_appwrite.Query.orderDesc('timestamp'), _appwrite.Query.limit(limit)]));

          case 4:
            return _context5.abrupt("return", _context5.sent);

          case 7:
            _context5.prev = 7;
            _context5.t0 = _context5["catch"](1);
            console.error("Error fetching metrics:", _context5.t0);
            throw _context5.t0;

          case 11:
          case "end":
            return _context5.stop();
        }
      }
    }, null, null, [[1, 7]]);
  },
  getMetricsHistory: function getMetricsHistory() {
    var hours,
        timestamp,
        _args6 = arguments;
    return regeneratorRuntime.async(function getMetricsHistory$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            hours = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : 24;
            _context6.prev = 1;
            timestamp = new Date();
            timestamp.setHours(timestamp.getHours() - hours);
            _context6.next = 6;
            return regeneratorRuntime.awrap(databases.listDocuments(databaseId, metricsCollectionId, [_appwrite.Query.greaterThan('timestamp', timestamp.toISOString()), _appwrite.Query.orderAsc('timestamp'), _appwrite.Query.limit(500)]));

          case 6:
            return _context6.abrupt("return", _context6.sent);

          case 9:
            _context6.prev = 9;
            _context6.t0 = _context6["catch"](1);
            console.error("Error fetching metrics history:", _context6.t0);
            throw _context6.t0;

          case 13:
          case "end":
            return _context6.stop();
        }
      }
    }, null, null, [[1, 9]]);
  },
  getLogs: function getLogs() {
    var filters,
        limit,
        queries,
        _args7 = arguments;
    return regeneratorRuntime.async(function getLogs$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            filters = _args7.length > 0 && _args7[0] !== undefined ? _args7[0] : {};
            limit = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : 50;
            _context7.prev = 2;
            queries = [_appwrite.Query.orderDesc('timestamp'), _appwrite.Query.limit(limit)];

            if (filters.severity && filters.severity !== 'all') {
              queries.push(_appwrite.Query.equal('severity', filters.severity));
            }

            if (filters.service) {
              queries.push(_appwrite.Query.equal('service', filters.service));
            }

            if (filters.startDate) {
              queries.push(_appwrite.Query.greaterThanEqual('timestamp', new Date(filters.startDate).toISOString()));
            }

            if (filters.endDate) {
              queries.push(_appwrite.Query.lessThanEqual('timestamp', new Date(filters.endDate).toISOString()));
            }

            _context7.next = 10;
            return regeneratorRuntime.awrap(databases.listDocuments(databaseId, logsCollectionId, queries));

          case 10:
            return _context7.abrupt("return", _context7.sent);

          case 13:
            _context7.prev = 13;
            _context7.t0 = _context7["catch"](2);
            console.error("Error fetching logs:", _context7.t0);
            throw _context7.t0;

          case 17:
          case "end":
            return _context7.stop();
        }
      }
    }, null, null, [[2, 13]]);
  },
  getAuditLogs: function getAuditLogs() {
    var filters,
        limit,
        queries,
        _args8 = arguments;
    return regeneratorRuntime.async(function getAuditLogs$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            filters = _args8.length > 0 && _args8[0] !== undefined ? _args8[0] : {};
            limit = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : 50;
            _context8.prev = 2;
            queries = [_appwrite.Query.orderDesc('timestamp'), _appwrite.Query.limit(limit)];

            if (filters.userId) {
              queries.push(_appwrite.Query.equal('userId', filters.userId));
            }

            if (filters.action) {
              queries.push(_appwrite.Query.equal('action', filters.action));
            }

            if (filters.startDate) {
              queries.push(_appwrite.Query.greaterThanEqual('timestamp', new Date(filters.startDate).toISOString()));
            }

            if (filters.endDate) {
              queries.push(_appwrite.Query.lessThanEqual('timestamp', new Date(filters.endDate).toISOString()));
            }

            _context8.next = 10;
            return regeneratorRuntime.awrap(databases.listDocuments(databaseId, 'audit_logs', queries));

          case 10:
            return _context8.abrupt("return", _context8.sent);

          case 13:
            _context8.prev = 13;
            _context8.t0 = _context8["catch"](2);
            console.error("Error fetching audit logs:", _context8.t0);
            throw _context8.t0;

          case 17:
          case "end":
            return _context8.stop();
        }
      }
    }, null, null, [[2, 13]]);
  },
  createLog: function createLog(data) {
    return regeneratorRuntime.async(function createLog$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;
            _context9.next = 3;
            return regeneratorRuntime.awrap(databases.createDocument(databaseId, logsCollectionId, 'unique()', _objectSpread({}, data, {
              timestamp: new Date().toISOString()
            })));

          case 3:
            return _context9.abrupt("return", _context9.sent);

          case 6:
            _context9.prev = 6;
            _context9.t0 = _context9["catch"](0);
            console.error("Error creating log:", _context9.t0);
            throw _context9.t0;

          case 10:
          case "end":
            return _context9.stop();
        }
      }
    }, null, null, [[0, 6]]);
  }
};
exports.appwriteService = appwriteService;
var _default = appwriteService;
exports["default"] = _default;