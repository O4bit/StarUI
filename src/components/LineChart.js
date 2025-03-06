import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React from 'react';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart as RechartsLineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

const LineChart = ({
  data,
  dataKey,
  xAxisDataKey = 'timestamp',
  color,
  height = 300,
  title,
  unit = '',
  showLegend = false,
  showGrid = true,
  syncId,
  threshold = null,
  formatXAxis = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  },
  formatTooltip = (value) => {
    if (value === undefined || value === null) return '';
    return `${parseFloat(value).toFixed(1)}${unit}`;
  }
}) => {
  const theme = useTheme();
  
  const linearGradientId = `gradient-${dataKey}`;
  const strokeColor = color || theme.palette.primary.main;
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 1.5,
            borderRadius: 1,
            boxShadow: 1,
            border: '1px solid rgba(0, 0, 0, 0.1)'
          }}
        >
          <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'bold' }}>
            {new Date(label).toLocaleString()}
          </Typography>
          {payload.map((entry, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ 
                width: 10, 
                height: 10, 
                backgroundColor: entry.color, 
                borderRadius: '50%' 
              }} />
              <Typography variant="body2" color="text.secondary">
                {entry.name}: {typeof formatTooltip === 'function' ? formatTooltip(entry.value) : entry.value}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };
  
  return (
    <Box sx={{ width: '100%', height }}>
      {title && (
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
          {title}
        </Typography>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          syncId={syncId}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <defs>
            <linearGradient id={linearGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.8} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          
          {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />}
          
          <XAxis
            dataKey={xAxisDataKey}
            tickFormatter={formatXAxis}
            tick={{ fontSize: 12 }}
            tickSize={4}
            axisLine={false}
            tickLine={true}
            tickCount={5}
            scale="time"
            type="number"
            domain={['auto', 'auto']}
          />
          
          <YAxis
            tickFormatter={(value) => `${value}${unit}`}
            tick={{ fontSize: 12 }}
            tickSize={4}
            axisLine={false}
            tickLine={true}
            tickCount={5}
            domain={[0, 'auto']}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          {showLegend && <Legend />}
          
          {threshold !== null && (
            <ReferenceLine
              y={threshold}
              stroke={theme.palette.error.main}
              strokeDasharray="3 3"
              label={{ 
                value: `Threshold (${threshold}${unit})`,
                fill: theme.palette.error.main,
                fontSize: 12,
                position: 'insideTopRight'
              }}
            />
          )}
          
          <Line
            type="monotone"
            dataKey={dataKey}
            name={title || dataKey}
            stroke={strokeColor}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, stroke: theme.palette.background.paper, strokeWidth: 2 }}
            fill={`url(#${linearGradientId})`}
            animationDuration={500}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </Box>
  );
};

LineChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  dataKey: PropTypes.string.isRequired,
  xAxisDataKey: PropTypes.string,
  color: PropTypes.string,
  height: PropTypes.number,
  title: PropTypes.string,
  unit: PropTypes.string,
  showLegend: PropTypes.bool,
  showGrid: PropTypes.bool,
  syncId: PropTypes.string,
  threshold: PropTypes.number,
  formatXAxis: PropTypes.func,
  formatTooltip: PropTypes.func
};

export default LineChart;