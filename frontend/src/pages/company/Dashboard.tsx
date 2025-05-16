import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  Inventory as InventoryIcon,
  Store as StoreIcon,
  LocalShipping as ShippingIcon,
  TrendingUp as TrendingUpIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import CompanyManagement from './CompanyManagement';
import ProductManagement from './ProductManagement';
import BranchManagement from './BranchManagement';
import WarehouseManagement from './WarehouseManagement';
import AddManager from './AddManager';

const drawerWidth = 240;

const CompanyDashboard: React.FC = () => {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/company/dashboard' },
    { text: 'Company Profile', icon: <BusinessIcon />, path: '/company/profile' },
    { text: 'Products', icon: <InventoryIcon />, path: '/company/products' },
    { text: 'Branches', icon: <StoreIcon />, path: '/company/branches' },
    { text: 'Warehouses', icon: <ShippingIcon />, path: '/company/warehouses' },
    { text: 'Add Manager', icon: <PersonAddIcon />, path: '/company/managers' },
    { text: 'Sales', icon: <TrendingUpIcon />, path: '/company/sales' },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Company Portal
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            onClick={handleDrawerToggle}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Company Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Routes>
          <Route path="/" element={<CompanyManagement />} />
          <Route path="/profile" element={<CompanyManagement />} />
          <Route path="/products" element={<ProductManagement />} />
          <Route path="/branches" element={<BranchManagement />} />
          <Route path="/warehouses" element={<WarehouseManagement />} />
          <Route path="/managers" element={<AddManager />} />
          <Route path="/sales" element={<div>Sales Management</div>} />
        </Routes>
      </Box>
    </Box>
  );
};

export default CompanyDashboard; 