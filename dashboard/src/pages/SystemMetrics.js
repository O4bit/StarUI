import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  HelpOutline as UnknownIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const SystemHealthCard = ({
  title,
  value,
  statusColor = null,
  icon: CustomIcon,
  loading = false
}) => {
  let StatusIcon = null;
  let iconColor = 'inherit';
  
  if (statusColor && !CustomIcon) {
    if (statusColor === 'success') {
      StatusIcon = CheckCircleIcon;
      iconColor = 'success.main';
    } else if (statusColor === 'warning') {
      StatusIcon = WarningIcon;
      iconColor = 'warning.main';
    } else if (statusColor === 'error') {
      StatusIcon = ErrorIcon;
      iconColor = 'error.main';
    } else {
      StatusIcon = UnknownIcon;
      iconColor = 'text.secondary';
    }
  } else if (CustomIcon) {
    StatusIcon = CustomIcon;
    iconColor = statusColor || 'primary.main';
  }

  return (
    <Paper
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'box-shadow 0.3s, transform 0.3s',
        '&:hover': {
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
          transform: 'translateY(-2px)'
        }
      }}
      elevation={1}
      className="dashboard-card"
    >
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <Typography variant="h5" component="div" fontWeight="medium">
            {value}
          </Typography>
        )}
        
        {StatusIcon && !loading && (
          <Box sx={{ ml: 1 }}>
            <StatusIcon sx={{ color: iconColor }} />
          </Box>
        )}
      </Box>
    </Paper>
  );
};

SystemHealthCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  statusColor: PropTypes.oneOf(['success', 'warning', 'error', null]),
  icon: PropTypes.elementType,
  loading: PropTypes.bool
};

export default SystemHealthCard;