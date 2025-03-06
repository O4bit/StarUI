import { CheckCircle, Error, Warning } from '@mui/icons-material';
import { Box, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import React from 'react';

/**
 * 
 * @param {String}
 * @param {String|Number}
 * @param {String} 
 * @param {Boolean}
 */
const SystemHealthCard = ({ title, value, statusColor, loading = false }) => {

  const getStatusIcon = () => {
    switch (statusColor) {
      case 'success':
        return <CheckCircle color="success" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'error':
        return <Error color="error" />;
      default:
        return null;
    }
  };
  

  const getTextColor = () => {
    switch (statusColor) {
      case 'success':
        return 'success.main';
      case 'warning':
        return 'warning.main';
      case 'error':
        return 'error.main';
      default:
        return 'text.primary';
    }
  };
  
  return (
    <Card sx={{ height: '100%', minWidth: 200 }}>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography 
              variant="h4" 
              component="div" 
              sx={{ 
                fontWeight: 'medium', 
                color: getTextColor(),
                mr: 1,
                flexGrow: 1
              }}
            >
              {value}
            </Typography>
            {getStatusIcon()}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemHealthCard;