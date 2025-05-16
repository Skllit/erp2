import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
  LocalShipping as ShippingIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Overview Card Component
const OverviewCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <Paper
    sx={{
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      height: 140,
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ color }}>{icon}</Box>
    </Box>
    <Typography component="p" variant="h4">
      {value}
    </Typography>
  </Paper>
);

// Sales Data
const salesData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Sales',
      data: [12000, 19000, 15000, 25000, 22000, 30000],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    },
  ],
};

// Current Inventory
const currentInventory = [
  { id: 1, product: 'Product A', quantity: 50, threshold: 20 },
  { id: 2, product: 'Product B', quantity: 30, threshold: 15 },
  { id: 3, product: 'Product C', quantity: 25, threshold: 10 },
];

// Recent Sales
const recentSales = [
  { id: 1, product: 'Product X', quantity: 2, amount: 199.98, date: '2024-02-20' },
  { id: 2, product: 'Product Y', quantity: 1, amount: 149.99, date: '2024-02-20' },
  { id: 3, product: 'Product Z', quantity: 3, amount: 299.97, date: '2024-02-19' },
];

const BranchDashboard: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState('');
  const [warehouse, setWarehouse] = useState('');

  const handleRequestStock = (product: any) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
    setQuantity('');
    setWarehouse('');
  };

  const handleConfirmRequest = () => {
    // TODO: Implement API call to request stock
    handleCloseDialog();
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Box>
            <Typography variant="h4" gutterBottom>
              Branch Dashboard
            </Typography>
            
            {/* Overview Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <OverviewCard
                  title="Today's Sales"
                  value="$1,234"
                  icon={<MoneyIcon />}
                  color="#2e7d32"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <OverviewCard
                  title="Total Products"
                  value="150"
                  icon={<InventoryIcon />}
                  color="#1976d2"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <OverviewCard
                  title="Pending Orders"
                  value="8"
                  icon={<ShippingIcon />}
                  color="#ed6c02"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <OverviewCard
                  title="Sales Growth"
                  value="+15%"
                  icon={<TrendingUpIcon />}
                  color="#9c27b0"
                />
              </Grid>
            </Grid>

            {/* Sales Chart */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Sales Trend
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Line
                      data={salesData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top' as const,
                          },
                        },
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Recent Sales
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Product</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentSales.map((sale) => (
                          <TableRow key={sale.id}>
                            <TableCell>{sale.product}</TableCell>
                            <TableCell>${sale.amount}</TableCell>
                            <TableCell>{sale.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>

            {/* Inventory Management */}
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Current Inventory
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Current Quantity</TableCell>
                      <TableCell>Threshold</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentInventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.product}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.threshold}</TableCell>
                        <TableCell>
                          {item.quantity <= item.threshold ? (
                            <Typography color="error">Low Stock</Typography>
                          ) : (
                            <Typography color="success.main">In Stock</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleRequestStock(item)}
                          >
                            Request Stock
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Stock Request Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>Request Stock</DialogTitle>
              <DialogContent>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    Product: {selectedProduct?.product}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Current Stock: {selectedProduct?.quantity}
                  </Typography>
                  <TextField
                    fullWidth
                    label="Requested Quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    select
                    label="Warehouse"
                    value={warehouse}
                    onChange={(e) => setWarehouse(e.target.value)}
                    margin="normal"
                  >
                    <MenuItem value="warehouse1">Warehouse 1</MenuItem>
                    <MenuItem value="warehouse2">Warehouse 2</MenuItem>
                    <MenuItem value="warehouse3">Warehouse 3</MenuItem>
                  </TextField>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button onClick={handleConfirmRequest} variant="contained">
                  Submit Request
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        }
      />
      {/* Add more routes for other branch pages */}
    </Routes>
  );
};

export default BranchDashboard; 