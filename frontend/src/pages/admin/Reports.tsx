import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useApi } from '../../hooks/useApi';
import apiService from '../../services/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ReportData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface ReportParams {
  timeRange: string;
  startDate?: string;
  endDate?: string;
}

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState<string>('sales');
  const [timeRange, setTimeRange] = useState<string>('monthly');
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  const { data: salesData, loading: salesLoading, error: salesError, execute: fetchSales } = useApi<ReportData>();
  const { data: inventoryData, loading: inventoryLoading, error: inventoryError, execute: fetchInventory } = useApi<ReportData>();
  const { data: customersData, loading: customersLoading, error: customersError, execute: fetchCustomers } = useApi<ReportData>();

  useEffect(() => {
    const fetchData = async () => {
      const params: ReportParams = {
        timeRange,
        startDate: dateRange.startDate?.toISOString(),
        endDate: dateRange.endDate?.toISOString(),
      };

      try {
        switch (reportType) {
          case 'sales':
            await fetchSales(async () => apiService.getSalesReport(params));
            break;
          case 'inventory':
            await fetchInventory(async () => apiService.getInventoryReport(params));
            break;
          case 'customers':
            await fetchCustomers(async () => apiService.getCustomersReport(params));
            break;
        }
      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    };

    fetchData();
  }, [reportType, timeRange, dateRange, fetchSales, fetchInventory, fetchCustomers]);

  const handleExport = async () => {
    try {
      const params: ReportParams = {
        timeRange,
        startDate: dateRange.startDate?.toISOString(),
        endDate: dateRange.endDate?.toISOString(),
      };

      const blob = await apiService.exportReport(reportType, params);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}_report.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  const renderChart = () => {
    if (salesLoading || inventoryLoading || customersLoading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      );
    }

    const error = salesError || inventoryError || customersError;
    if (error) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography color="error">{error}</Typography>
        </Box>
      );
    }

    const data = reportType === 'sales' ? salesData : reportType === 'inventory' ? inventoryData : customersData;

    if (!data) {
      return null;
    }

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
        },
      },
    };

    switch (reportType) {
      case 'sales':
        return <Line data={data} options={chartOptions} />;
      case 'inventory':
        return <Bar data={data} options={chartOptions} />;
      case 'customers':
        return <Doughnut data={data} options={chartOptions} />;
      default:
        return null;
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Report Type</InputLabel>
            <Select
              value={reportType}
              label="Report Type"
              onChange={(e) => setReportType(e.target.value)}
            >
              <MenuItem value="sales">Sales Report</MenuItem>
              <MenuItem value="inventory">Inventory Report</MenuItem>
              <MenuItem value="customers">Customer Report</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
              <MenuItem value="custom">Custom Range</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {timeRange === 'custom' && (
          <>
            <Grid item xs={12} md={3}>
              <DatePicker
                label="Start Date"
                value={dateRange.startDate}
                onChange={(date) => setDateRange((prev) => ({ ...prev, startDate: date }))}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <DatePicker
                label="End Date"
                value={dateRange.endDate}
                onChange={(date) => setDateRange((prev) => ({ ...prev, endDate: date }))}
              />
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleExport}>
            Export to Excel
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            {renderChart()}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports; 