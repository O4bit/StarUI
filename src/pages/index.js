import {
  ArrowForward as ArrowForwardIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import MetricsChart from '../components/MetricsChart';
import SystemHealthCard from '../components/SystemHealthCard';
import { appwriteService } from '../lib/appwrite';

const Dashboard = () => {
  const [health, setHealth] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [history, setHistory] = useState({
    cpu: [],
    memory: [],
    disk: [],
    temperature: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(30000);
  
  useEffect(() => {
    loadDashboardData();
    
    const intervalId = setInterval(loadDashboardData, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [refreshInterval]);
  
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [healthData, metricsData, historyData] = await Promise.all([
        appwriteService.getSystemHealth(),
        appwriteService.getSystemMetrics(),
        appwriteService.getMetricsHistory('1h')
      ]);
      
      setHealth(healthData);
      setMetrics(metricsData);
      
      setHistory({
        cpu: historyData.documents.map(point => ({ 
          timestamp: new Date(point.timestamp).getTime(),
          usage: point.cpuUsage || 0
        })),
        memory: historyData.documents.map(point => ({ 
          timestamp: new Date(point.timestamp).getTime(),
          usage: point.memoryUsage || 0
        })),
        disk: historyData.documents.map(point => ({ 
          timestamp: new Date(point.timestamp).getTime(),
          usage: point.diskUsage || 0
        })),
        temperature: historyData.documents.map(point => ({
          timestamp: new Date(point.timestamp).getTime(),
          value: point.temperature || 0
        }))
      });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load system data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    seconds %= 86400;
    
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
    
    return parts.join(' ');
  };
  
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
          <div>
            <Typography variant="h4" gutterBottom>
              System Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Overview of system performance and health
            </Typography>
          </div>
          <Box>
            <Tooltip title="Refresh Data">
              <IconButton 
                onClick={loadDashboardData} 
                disabled={loading}
                color="primary"
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}
        
        {loading && !health && !metrics ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} sm={6} md={3}>
                <SystemHealthCard 
                  title="System Status"
                  value={health?.status || 'Unknown'}
                  statusColor={health?.status === 'online' ? 'success' : 'error'}
                  loading={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <SystemHealthCard 
                  title="Uptime" 
                  value={health?.uptime ? formatUptime(health.uptime) : 'Unknown'} 
                  loading={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <SystemHealthCard 
                  title="Load Average" 
                  value={health?.loadAverage ? health.loadAverage[0].toFixed(2) : 'Unknown'} 
                  statusColor={
                    health?.loadAverage && health.loadAverage[0] > 1 ? 
                      (health.loadAverage[0] > 2 ? 'error' : 'warning') : 
                      'success'
                  }
                  loading={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <SystemHealthCard 
                  title="Memory Usage" 
                  value={metrics?.memory ? 
                    `${((metrics.memory.used / metrics.memory.total) * 100).toFixed(1)}%` : 
                    'Unknown'} 
                  statusColor={
                    metrics?.memory ?
                      (metrics.memory.used / metrics.memory.total > 0.9 ? 'error' : 
                       metrics.memory.used / metrics.memory.total > 0.7 ? 'warning' : 
                       'success') :
                      null
                  }
                  loading={loading}
                />
              </Grid>
            </Grid>
            
            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} md={6}>
                <MetricsChart 
                  data={history.cpu}
                  dataKey="usage"
                  color="#3f51b5"
                  unit="%"
                  currentValue={metrics?.load?.currentLoad?.toFixed(1) || '0'}
                  title="CPU Usage"
                  threshold={90}
                  loading={loading}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <MetricsChart 
                  data={history.memory}
                  dataKey="usage"
                  color="#f44336" 
                  unit="%"
                  currentValue={metrics?.memory ? 
                    ((metrics.memory.used / metrics.memory.total) * 100).toFixed(1) : '0'}
                  title="Memory Usage"
                  threshold={90}
                  loading={loading}
                />
              </Grid>
            </Grid>
            
            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} md={6}>
                <MetricsChart 
                  data={history.temperature}
                  dataKey="value"
                  color="#ff9800"
                  unit="°C"
                  currentValue={metrics?.temperature?.main?.toFixed(1) || 'N/A'}
                  title="CPU Temperature"
                  threshold={80}
                  loading={loading}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <MetricsChart 
                  data={history.disk}
                  dataKey="usage"
                  color="#4caf50"
                  unit="%"
                  currentValue={metrics?.disk?.[0]?.use?.toFixed(1) || '0'}
                  title="Disk Usage"
                  threshold={90}
                  loading={loading}
                />
              </Grid>
            </Grid>
            
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <Button 
                    variant="outlined" 
                    component={Link} 
                    to="/logs" 
                    endIcon={<ArrowForwardIcon />}
                  >
                    View System Logs
                  </Button>
                </Grid>
                <Grid item>
                  <Button 
                    variant="outlined"
                    component={Link}
                    to="/settings"
                    endIcon={<ArrowForwardIcon />}
                  >
                    System Settings
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default Dashboard;