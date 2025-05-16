import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useApi } from '../../hooks/useApi';
import apiService from '../../services/api';

interface Warehouse {
  _id: string;
  name: string;
  location: string;
  managerId: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

interface WarehouseFormData {
  name: string;
  location: string;
  managerId: string;
}

const WarehouseManagement: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [formData, setFormData] = useState<WarehouseFormData>({
    name: '',
    location: '',
    managerId: '',
  });
  const [managers, setManagers] = useState<User[]>([]);

  const {
    data: warehouses,
    loading,
    error,
    execute: fetchWarehouses,
  } = useApi<Warehouse[] | null>();

  const {
    execute: createWarehouse,
    loading: creating,
    error: createError,
  } = useApi<Warehouse>();

  const {
    execute: updateWarehouse,
    loading: updating,
    error: updateError,
  } = useApi<Warehouse>();

  const {
    execute: deleteWarehouse,
    loading: deleting,
    error: deleteError,
  } = useApi<void>();

  useEffect(() => {
    console.log('Initializing warehouse management...');
    fetchWarehouses(apiService.getWarehouses);
    fetchManagers();
  }, [fetchWarehouses]);

  const fetchManagers = async () => {
    try {
      console.log('Fetching warehouse managers...');
      const response = await apiService.getWarehouseManagers();
      console.log('Warehouse managers response:', response);
      if (response && Array.isArray(response)) {
        setManagers(response);
      } else {
        console.error('Invalid response format:', response);
        setManagers([]);
      }
    } catch (err) {
      console.error('Failed to fetch warehouse managers:', err);
      setManagers([]);
    }
  };

  const handleOpenDialog = (warehouse?: Warehouse) => {
    console.log('Opening dialog with managers:', managers);
    setSelectedWarehouse(warehouse || null);
    setFormData({
      name: warehouse?.name || '',
      location: warehouse?.location || '',
      managerId: warehouse?.managerId || '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedWarehouse(null);
    setFormData({
      name: '',
      location: '',
      managerId: '',
    });
  };

  const handleSubmit = async () => {
    try {
      const warehouseData: WarehouseFormData = {
        name: formData.name,
        location: formData.location,
        managerId: formData.managerId,
      };

      if (selectedWarehouse) {
        await updateWarehouse(apiService.updateWarehouse, selectedWarehouse._id, warehouseData);
      } else {
        await createWarehouse(apiService.createWarehouse, warehouseData);
      }
      handleCloseDialog();
      fetchWarehouses(apiService.getWarehouses);
    } catch (error) {
      console.error('Error submitting warehouse:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this warehouse?')) {
      try {
        await deleteWarehouse(apiService.deleteWarehouse, id);
        fetchWarehouses(apiService.getWarehouses);
      } catch (error) {
        console.error('Error deleting warehouse:', error);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Warehouse Management</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog()}
        >
          Add Warehouse
        </Button>
      </Box>

      {(error || createError || updateError || deleteError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || createError || updateError || deleteError}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Manager</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(warehouses || []).map((warehouse) => (
              <TableRow key={warehouse._id}>
                <TableCell>{warehouse.name}</TableCell>
                <TableCell>{warehouse.location}</TableCell>
                <TableCell>
                  {managers.find(m => m._id === warehouse.managerId)?.username || 'Not assigned'}
                </TableCell>
                <TableCell>{new Date(warehouse.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(warehouse)}
                    disabled={creating || updating || deleting}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(warehouse._id)}
                    disabled={creating || updating || deleting}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedWarehouse ? 'Edit Warehouse' : 'Add Warehouse'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                error={!formData.name}
                helperText={!formData.name ? 'Name is required' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                error={!formData.location}
                helperText={!formData.location ? 'Location is required' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required error={!formData.managerId}>
                <InputLabel>Manager</InputLabel>
                <Select
                  value={formData.managerId}
                  onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                  label="Manager"
                >
                  {managers.map((manager) => (
                    <MenuItem key={manager._id} value={manager._id}>
                      {manager.username} ({manager.email})
                    </MenuItem>
                  ))}
                </Select>
                {!formData.managerId && (
                  <Typography color="error" variant="caption">
                    Manager is required
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            color="primary" 
            disabled={creating || updating || !formData.name || !formData.location || !formData.managerId}
          >
            {selectedWarehouse ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WarehouseManagement; 