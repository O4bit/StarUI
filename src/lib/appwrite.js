import { Account, Client, Databases, Query } from 'appwrite';

const client = new Client();

client
    .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID || '');

const account = new Account(client);
const databases = new Databases(client);

const databaseId = process.env.REACT_APP_APPWRITE_DATABASE_ID || '';
const metricsCollectionId = process.env.REACT_APP_APPWRITE_METRICS_COLLECTION_ID || '';
const logsCollectionId = process.env.REACT_APP_APPWRITE_LOGS_COLLECTION_ID || '';

export const appwriteService = {
    createAccount: async (email, password, name) => {
        try {
            const response = await account.create('unique()', email, password, name);
            if (response) {
                return await appwriteService.login(email, password);
            }
            return response;
        } catch (error) {
            throw error;
        }
    },

    login: async (email, password) => {
        try {
            return await account.createEmailSession(email, password);
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        try {
            return await account.deleteSession('current');
        } catch (error) {
            throw error;
        }
    },

    getCurrentUser: async () => {
        try {
            return await account.get();
        } catch (error) {
            console.error("Error getting current user:", error);
            return null;
        }
    },

    getMetrics: async (limit = 100) => {
        try {
            return await databases.listDocuments(
                databaseId,
                metricsCollectionId,
                [
                    Query.orderDesc('timestamp'),
                    Query.limit(limit)
                ]
            );
        } catch (error) {
            console.error("Error fetching metrics:", error);
            throw error;
        }
    },

    getMetricsHistory: async (hours = 24) => {
        try {
            const timestamp = new Date();
            timestamp.setHours(timestamp.getHours() - hours);
            
            return await databases.listDocuments(
                databaseId,
                metricsCollectionId,
                [
                    Query.greaterThan('timestamp', timestamp.toISOString()),
                    Query.orderAsc('timestamp'),
                    Query.limit(500)
                ]
            );
        } catch (error) {
            console.error("Error fetching metrics history:", error);
            throw error;
        }
    },

    getLogs: async (filters = {}, limit = 50) => {
        try {
            const queries = [
                Query.orderDesc('timestamp'),
                Query.limit(limit)
            ];
            
            if (filters.severity && filters.severity !== 'all') {
                queries.push(Query.equal('severity', filters.severity));
            }
            
            if (filters.service) {
                queries.push(Query.equal('service', filters.service));
            }
            
            if (filters.startDate) {
                queries.push(Query.greaterThanEqual('timestamp', new Date(filters.startDate).toISOString()));
            }
            
            if (filters.endDate) {
                queries.push(Query.lessThanEqual('timestamp', new Date(filters.endDate).toISOString()));
            }
            
            return await databases.listDocuments(
                databaseId,
                logsCollectionId,
                queries
            );
        } catch (error) {
            console.error("Error fetching logs:", error);
            throw error;
        }
    },

    getAuditLogs: async (filters = {}, limit = 50) => {
        try {
            const queries = [
                Query.orderDesc('timestamp'),
                Query.limit(limit)
            ];
            
            if (filters.userId) {
                queries.push(Query.equal('userId', filters.userId));
            }
            
            if (filters.action) {
                queries.push(Query.equal('action', filters.action));
            }
            
            if (filters.startDate) {
                queries.push(Query.greaterThanEqual('timestamp', new Date(filters.startDate).toISOString()));
            }
            
            if (filters.endDate) {
                queries.push(Query.lessThanEqual('timestamp', new Date(filters.endDate).toISOString()));
            }
            
            return await databases.listDocuments(
                databaseId,
                'audit_logs',
                queries
            );
        } catch (error) {
            console.error("Error fetching audit logs:", error);
            throw error;
        }
    },

    createLog: async (data) => {
        try {
            return await databases.createDocument(
                databaseId,
                logsCollectionId,
                'unique()',
                {
                    ...data,
                    timestamp: new Date().toISOString()
                }
            );
        } catch (error) {
            console.error("Error creating log:", error);
            throw error;
        }
    }
};

export default appwriteService;