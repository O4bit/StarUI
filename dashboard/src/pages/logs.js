import {
  FilterAlt as FilterIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { useEffect, useState } from 'react';
import { logsService } from '../api';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';

const severityLevels = [
  { value: 'all', label: 'All Levels' },
  { value: 'info', label: 'Info', color: 'info' },
  { value: 'warning', label: 'Warning', color: 'warning' },
  { value: 'error', label: 'Error', color: 'error' },
  { value: 'critical', label: 'Critical', color: 'error' },
  { value: 'debug', label: 'Debug', color: 'default' },
];

const Logs = () => {
  const { hasRole } = useAuth();
  const isAdmin = hasRole('admin');
  
    const [tabValue, setTabValue] = useState(0);
  
  
  const [filters, setFilters] = useState({
    severity: 'all',
    service: '',
    startDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
    endDate: new Date(),
    limit: 50,
    userId: '',
    action: ''
  });
  
  
  const [systemLogs, setSystemLogs] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  
  
  useEffect(() => {
    loadLogs();
  }, [tabValue, page, rowsPerPage]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(0); 
  };
  
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(0);
  };
  
  const applyFilters = () => {
    setPage(0);
    loadLogs();
  };
  
  const resetFilters = () => {
    setFilters({
      severity: 'all',
      service: '',
      startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      endDate: new Date(),
      limit: 50,
      userId: '',
      action: ''
    });
    setPage(0);
    loadLogs();
  };
  
  
  const loadLogs = async () => {
    if (!isAdmin) {
      setError('You do not have permission to view logs');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { startDate, endDate, severity, service, limit, userId, action } = filters;
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };
      
            if (severity !== 'all') params.severity = severity;
      if (service) params.service = service;
      
      if (tabValue === 0) {
              const result = await logsService.getSystemLogs(params);
        setSystemLogs(result.data.logs);
        setTotalCount(result.data.totalCount);
      } else {
      
        if (userId) params.userId = userId;
        if (action) params.action = action;
        const result = await logsService.getAuditLogs(params);
        setAuditLogs(result.data.logs);
        setTotalCount(result.data.totalCount);
      }
    } catch (err) {
      console.error('Error loading logs:', err);
      setError('Failed to load logs. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  
  const getSeverityColor = (severity) => {
    const level = severityLevels.find(l => l.value === severity);
    return level ? level.color : 'default';
  };
  
  
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };
  
  
  const renderSystemLogsTable = () => (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Severity</TableCell>
            <TableCell>Service</TableCell>
            <TableCell>Message</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {systemLogs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No logs found
              </TableCell>
            </TableRow>
          ) : (
            systemLogs.map((log) => (
              <TableRow key={log.id} hover>
                <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                <TableCell>
                  <Chip 
                    label={log.severity} 
                    size="small"
                    color={getSeverityColor(log.severity)}
                  />
                </TableCell>
                <TableCell>{log.service || 'system'}</TableCell>
                <TableCell sx={{ maxWidth: 300, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                  {log.message}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
  
    const renderAuditLogsTable = () => (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>IP Address</TableCell>
            <TableCell>Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {auditLogs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No logs found
              </TableCell>
            </TableRow>
          ) : (
            auditLogs.map((log) => (
              <TableRow key={log.id} hover>
                <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                <TableCell>{log.user_id}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.ip_address}</TableCell>
                <TableCell sx={{ maxWidth: 300, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                  {typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
  
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            System Logs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and filter system and audit logs
          </Typography>
        </Box>
        
        {!isAdmin && (
          <Alert severity="warning" sx={{ mb: 4 }}>
            Administrator privileges required to view logs
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}
        
        {isAdmin && (
          <>
            <Paper sx={{ mb: 4 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="System Logs" />
                <Tab label="Audit Logs" />
              </Tabs>
            </Paper>
            
            <Paper sx={{ p: 3, mb: 4 }}>
              <Grid container spacing={3}>
                {/* Filter controls for both tabs */}
                <Grid item xs={12} md={tabValue === 0 ? 4 : 3}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="From Date"
                      value={filters.startDate}
                      onChange={(value) => handleFilterChange('startDate', value)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12} md={tabValue === 0 ? 4 : 3}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="To Date"
                      value={filters.endDate}
                      onChange={(value) => handleFilterChange('endDate', value)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
                
                {/* System logs specific filters */}
                {tabValue === 0 && (
                  <>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel id="severity-label">Severity</InputLabel>
                        <Select
                          labelId="severity-label"
                          value={filters.severity}
                          label="Severity"
                          onChange={(e) => handleFilterChange('severity', e.target.value)}
                        >
                          {severityLevels.map((level) => (
                            <MenuItem key={level.value} value={level.value}>
                              {level.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Service"
                        value={filters.service}
                        onChange={(e) => handleFilterChange('service', e.target.value)}
                        fullWidth
                      />
                    </Grid>
                  </>
                )}
                
                {/* Audit logs specific filters */}
                {tabValue === 1 && (
                  <>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="User ID"
                        value={filters.userId}
                        onChange={(e) => handleFilterChange('userId', e.target.value)}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Action"
                        value={filters.action}
                        onChange={(e) => handleFilterChange('action', e.target.value)}
                        fullWidth
                      />
                    </Grid>
                  </>
                )}
                
                {/* Filter action buttons */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button 
                      variant="outlined" 
                      onClick={resetFilters}
                    >
                      Reset
                    </Button>
                    <Button 
                      variant="contained" 
                      startIcon={<FilterIcon />}
                      onClick={applyFilters}
                    >
                      Apply Filters
                    </Button>
                    <Tooltip title="Refresh Logs">
                      <IconButton 
                        color="primary" 
                        onClick={loadLogs}
                        disabled={loading}
                      >
                        <RefreshIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
            
            {/* Loading state */}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            )}
            
            {/* Logs tables */}
            {!loading && (
              <Box>
                {tabValue === 0 ? renderSystemLogsTable() : renderAuditLogsTable()}
              </Box>
            )}
          </>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default Logs;