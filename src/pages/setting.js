import {
  Add as AddIcon,
  Api as ApiIcon,
  ContentCopy as CopyIcon,
  Delete as DeleteIcon,
  Notifications as NotificationsIcon,
  PersonAdd as PersonAddIcon,
  Save as SaveIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import api from '../api';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Settings = () => {
  const { user, hasRole } = useAuth();
  const isAdmin = hasRole('admin');
  
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  

  const [systemSettings, setSystemSettings] = useState({
    apiUrl: '',
    metricCollectionInterval: 60,
    logRetentionDays: 30,
    enableAudit: true
  });
  

  const [users, setUsers] = useState([]);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'user'
  });
  

  const [securitySettings, setSecuritySettings] = useState({
    mfaRequired: false,
    passwordMinLength: 8,
    sessionTimeout: 60,
    apiRateLimit: 100
  });
  

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: false,
    discordAlerts: false,
    alertOnHighCpu: true,
    alertOnHighMemory: true,
    alertOnDiskSpace: true,
    alertThresholdCpu: 90,
    alertThresholdMemory: 90,
    alertThresholdDisk: 90
  });
  

  const [apiTokens, setApiTokens] = useState([]);
  const [newTokenName, setNewTokenName] = useState('');
  const [newTokenDialog, setNewTokenDialog] = useState(false);
  const [generatedToken, setGeneratedToken] = useState('');
  
 
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
 
  useEffect(() => {
    if (!isAdmin) return;
    
    const loadTabData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        switch(tabValue) {
          case 0: 
            await loadSystemSettings();
            break;
          case 1: 
            await loadUsers();
            break;
          case 2: 
            await loadSecuritySettings();
            break;
          case 3: 
            await loadNotificationSettings();
            break;
          case 4: 
            await loadApiTokens();
            break;
          default:
            break;
        }
      } catch (err) {
        console.error('Failed to load settings data:', err);
        setError('Failed to load settings data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadTabData();
  }, [tabValue, isAdmin]);
  
  const loadSystemSettings = async () => {
    try {
      const response = await api.get('/system/settings');
      setSystemSettings(response.data);
    } catch (err) {
      console.error('Error loading system settings:', err);
      throw err;
    }
  };
  
  const updateSystemSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await api.put('/system/settings', systemSettings);
      
      setSuccess('System settings updated successfully');
    } catch (err) {
      console.error('Failed to update system settings:', err);
      setError('Failed to update system settings');
    } finally {
      setLoading(false);
    }
  };
  
  const loadUsers = async () => {
    try {
      const response = await api.get('/auth/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Error loading users:', err);
      throw err;
    }
  };
  
  const createUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await api.post('/auth/users', newUser);
      
      setUserDialogOpen(false);
      setNewUser({ username: '', password: '', role: 'user' });
      await loadUsers();
      
      setSuccess('User created successfully');
    } catch (err) {
      console.error('Failed to create user:', err);
      setError('Failed to create user: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };
  
  const deleteUser = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      
      await api.delete(`/auth/users/${userId}`);
      
      await loadUsers();
      setSuccess('User deleted successfully');
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };
  
  const loadSecuritySettings = async () => {
    try {
      const response = await api.get('/system/security-settings');
      setSecuritySettings(response.data);
    } catch (err) {
      console.error('Error loading security settings:', err);
      throw err;
    }
  };
  
  const updateSecuritySettings = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await api.put('/system/security-settings', securitySettings);
      
      setSuccess('Security settings updated successfully');
    } catch (err) {
      console.error('Failed to update security settings:', err);
      setError('Failed to update security settings');
    } finally {
      setLoading(false);
    }
  };
  
  const loadNotificationSettings = async () => {
    try {
      const response = await api.get('/system/notification-settings');
      setNotificationSettings(response.data);
    } catch (err) {
      console.error('Error loading notification settings:', err);
      throw err;
    }
  };
  
  const updateNotificationSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await api.put('/system/notification-settings', notificationSettings);
      
      setSuccess('Notification settings updated successfully');
    } catch (err) {
      console.error('Failed to update notification settings:', err);
      setError('Failed to update notification settings');
    } finally {
      setLoading(false);
    }
  };
  
  const loadApiTokens = async () => {
    try {
      const response = await api.get('/auth/tokens');
      setApiTokens(response.data);
    } catch (err) {
      console.error('Error loading API tokens:', err);
      throw err;
    }
  };
  
  const createApiToken = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/auth/tokens', { name: newTokenName });
      
      setGeneratedToken(response.data.token);
      setNewTokenName('');
      await loadApiTokens();
    } catch (err) {
      console.error('Failed to create API token:', err);
      setError('Failed to create API token');
    } finally {
      setLoading(false);
    }
  };
  
  const revokeApiToken = async (tokenId) => {
    try {
      setLoading(true);
      setError(null);
      
      await api.delete(`/auth/tokens/${tokenId}`);
      
      await loadApiTokens();
      setSuccess('API token revoked successfully');
    } catch (err) {
      console.error('Failed to revoke API token:', err);
      setError('Failed to revoke API token');
    } finally {
      setLoading(false);
    }
  };
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccess('Token copied to clipboard');
  };
  
  const renderSystemSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="API URL"
          variant="outlined"
          value={systemSettings.apiUrl}
          onChange={(e) => setSystemSettings({ ...systemSettings, apiUrl: e.target.value })}
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Metric Collection Interval (seconds)"
          type="number"
          variant="outlined"
          value={systemSettings.metricCollectionInterval}
          onChange={(e) => setSystemSettings({ 
            ...systemSettings, 
            metricCollectionInterval: parseInt(e.target.value) || 60 
          })}
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Log Retention Period (days)"
          type="number"
          variant="outlined"
          value={systemSettings.logRetentionDays}
          onChange={(e) => setSystemSettings({ 
            ...systemSettings, 
            logRetentionDays: parseInt(e.target.value) || 30 
          })}
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <FormControlLabel
          control={
            <Switch
              checked={systemSettings.enableAudit}
              onChange={(e) => setSystemSettings({ ...systemSettings, enableAudit: e.target.checked })}
            />
          }
          label="Enable Audit Logging"
        />
      </Grid>
      
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={updateSystemSettings}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Settings'}
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
  
  const renderUsers = () => (
    <>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => setUserDialogOpen(true)}
        >
          Add New User
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>MFA Enabled</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    {user.roles.map(role => (
                      <Chip 
                        key={role} 
                        label={role} 
                        size="small" 
                        color={role === 'admin' ? 'primary' : 'default'}
                        sx={{ mr: 0.5 }}
                      />
                    ))}
                  </TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
                  <TableCell>{user.mfa_enabled ? 'Enabled' : 'Disabled'}</TableCell>
                  <TableCell>
                    <Tooltip title="Delete User">
                      <IconButton 
                        color="error" 
                        onClick={() => deleteUser(user.id)}
                        disabled={user.username === 'admin'}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* New User Dialog */}
      <Dialog open={userDialogOpen} onClose={() => setUserDialogOpen(false)}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            variant="outlined"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel>Role</InputLabel>
            <Select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              label="Role"
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={createUser} 
            variant="contained" 
            disabled={!newUser.username || !newUser.password}
          >
            Create User
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
  
  const renderSecuritySettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={securitySettings.mfaRequired}
              onChange={(e) => setSecuritySettings({ ...securitySettings, mfaRequired: e.target.checked })}
            />
          }
          label="Require Multi-Factor Authentication"
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Minimum Password Length"
          type="number"
          variant="outlined"
          value={securitySettings.passwordMinLength}
          onChange={(e) => setSecuritySettings({ 
            ...securitySettings, 
            passwordMinLength: parseInt(e.target.value) || 8 
          })}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Session Timeout (minutes)"
          type="number"
          variant="outlined"
          value={securitySettings.sessionTimeout}
          onChange={(e) => setSecuritySettings({ 
            ...securitySettings, 
            sessionTimeout: parseInt(e.target.value) || 60 
          })}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="API Rate Limit (requests per minute)"
          type="number"
          variant="outlined"
          value={securitySettings.apiRateLimit}
          onChange={(e) => setSecuritySettings({ 
            ...securitySettings, 
            apiRateLimit: parseInt(e.target.value) || 100 
          })}
        />
      </Grid>
      
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={updateSecuritySettings}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Security Settings'}
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
  
  const renderNotificationSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={notificationSettings.emailAlerts}
              onChange={(e) => setNotificationSettings({ ...notificationSettings, emailAlerts: e.target.checked })}
            />
          }
          label="Enable Email Alerts"
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={notificationSettings.discordAlerts}
              onChange={(e) => setNotificationSettings({ ...notificationSettings, discordAlerts: e.target.checked })}
            />
          }
          label="Enable Discord Alerts"
        />
      </Grid>
      
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>Alert Triggers</Typography>
        <Divider sx={{ mb: 2 }} />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <FormControlLabel
          control={
            <Switch
              checked={notificationSettings.alertOnHighCpu}
              onChange={(e) => setNotificationSettings({ ...notificationSettings, alertOnHighCpu: e.target.checked })}
            />
          }
          label="Alert on High CPU Usage"
        />
        
        <TextField
          fullWidth
          label="CPU Threshold (%)"
          type="number"
          variant="outlined"
          value={notificationSettings.alertThresholdCpu}
          onChange={(e) => setNotificationSettings({ 
            ...notificationSettings, 
            alertThresholdCpu: parseInt(e.target.value) || 90 
          })}
          sx={{ mt: 1 }}
          disabled={!notificationSettings.alertOnHighCpu}
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <FormControlLabel
          control={
            <Switch
              checked={notificationSettings.alertOnHighMemory}
              onChange={(e) => setNotificationSettings({ ...notificationSettings, alertOnHighMemory: e.target.checked })}
            />
          }
          label="Alert on High Memory Usage"
        />
        
        <TextField
          fullWidth
          label="Memory Threshold (%)"
          type="number"
          variant="outlined"
          value={notificationSettings.alertThresholdMemory}
          onChange={(e) => setNotificationSettings({ 
            ...notificationSettings, 
            alertThresholdMemory: parseInt(e.target.value) || 90 
          })}
          sx={{ mt: 1 }}
          disabled={!notificationSettings.alertOnHighMemory}
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <FormControlLabel
          control={
            <Switch
              checked={notificationSettings.alertOnDiskSpace}
              onChange={(e) => setNotificationSettings({ ...notificationSettings, alertOnDiskSpace: e.target.checked })}
            />
          }
          label="Alert on Low Disk Space"
        />
        
        <TextField
          fullWidth
          label="Disk Usage Threshold (%)"
          type="number"
          variant="outlined"
          value={notificationSettings.alertThresholdDisk}
          onChange={(e) => setNotificationSettings({ 
            ...notificationSettings, 
            alertThresholdDisk: parseInt(e.target.value) || 90 
          })}
          sx={{ mt: 1 }}
          disabled={!notificationSettings.alertOnDiskSpace}
        />
      </Grid>
      
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={updateNotificationSettings}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Notification Settings'}
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
  
  // Render API tokens tab
  const renderApiTokens = () => (
    <>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setNewTokenDialog(true)}
        >
          Generate New API Token
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Token Name</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {apiTokens.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No API tokens found
                </TableCell>
              </TableRow>
            ) : (
              apiTokens.map((token) => (
                <TableRow key={token.id}>
                  <TableCell>{token.name}</TableCell>
                  <TableCell>{new Date(token.created_at).toLocaleString()}</TableCell>
                  <TableCell>{new Date(token.expires_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <Tooltip title="Revoke Token">
                      <IconButton 
                        color="error" 
                        onClick={() => revokeApiToken(token.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* New Token Dialog */}
      <Dialog open={newTokenDialog} onClose={() => setNewTokenDialog(false)}>
        <DialogTitle>Generate New API Token</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Token Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newTokenName}
            onChange={(e) => setNewTokenName(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          
          {generatedToken && (
            <Box sx={{ mt: 2, p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Your new API token (copy it now, it won't be shown again):
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'monospace',
                    p: 1,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    overflow: 'auto',
                    flexGrow: 1
                  }}
                >
                  {generatedToken}
                </Typography>
                <IconButton
                  onClick={() => copyToClipboard(generatedToken)}
                  size="small"
                  sx={{ ml: 1 }}
                >
                  <CopyIcon />
                </IconButton>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setNewTokenDialog(false);
            setGeneratedToken('');
          }}>
            {generatedToken ? 'Close' : 'Cancel'}
          </Button>
          {!generatedToken && (
            <Button 
              onClick={createApiToken} 
              variant="contained" 
              disabled={!newTokenName}
            >
              Generate Token
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
  
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            System Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure system parameters, users, and security settings
          </Typography>
        </Box>
        
        {!isAdmin ? (
          <Alert severity="warning" sx={{ mb: 4 }}>
            You don't have administrator privileges to access these settings
          </Alert>
        ) : (
          <>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
                {success}
              </Alert>
            )}
            
            <Paper sx={{ mb: 3 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab icon={<SettingsIcon />} label="System" />
                <Tab icon={<PersonAddIcon />} label="Users" />
                <Tab icon={<SecurityIcon />} label="Security" />
                <Tab icon={<NotificationsIcon />} label="Notifications" />
                <Tab icon={<ApiIcon />} label="API Tokens" />
              </Tabs>
              
              <TabPanel value={tabValue} index={0}>
                {renderSystemSettings()}
              </TabPanel>
              
              <TabPanel value={tabValue} index={1}>
                {renderUsers()}
              </TabPanel>
              
              <TabPanel value={tabValue} index={2}>
                {renderSecuritySettings()}
              </TabPanel>
              
              <TabPanel value={tabValue} index={3}>
                {renderNotificationSettings()}
              </TabPanel>
              
              <TabPanel value={tabValue} index={4}>
                {renderApiTokens()}
              </TabPanel>
            </Paper>
          </>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default Settings;