import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import LineChart from './LineChart';

const MetricsChart = ({ 
  title, 
  data,
  dataKey, 
  color, 
  unit = '%',
  currentValue = '0',
  loading = false,
  threshold = null,
  height = 300
}) => {
  return (
    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {loading ? (
            <CircularProgress size={24} sx={{ mr: 1 }} />
          ) : (
            <Typography 
              variant="h5" 
              component="span" 
              sx={{ 
                color: threshold && parseFloat(currentValue) > threshold ? 'error.main' : 'success.main',
                fontWeight: 'bold'
              }}
            >
              {currentValue}{unit}
            </Typography>
          )}
        </Box>
      </Box>
      
      {loading && !data?.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
          <CircularProgress />
        </Box>
      ) : data?.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
          <Typography variant="body2" color="text.secondary">
            No data available
          </Typography>
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1, minHeight: 250 }}>
          <LineChart 
            data={data}
            dataKey={dataKey}
            title={title}
            color={color}
            unit={unit}
            threshold={threshold}
            height={height}
          />
        </Box>
      )}
    </Paper>
  );
};

MetricsChart.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  dataKey: PropTypes.string.isRequired,
  color: PropTypes.string,
  unit: PropTypes.string,
  currentValue: PropTypes.string,
  loading: PropTypes.bool,
  threshold: PropTypes.number,
  height: PropTypes.number
};

export default MetricsChart;