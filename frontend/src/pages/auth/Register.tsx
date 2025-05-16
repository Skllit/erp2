import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { loginSuccess } from '../../store/slices/authSlice';
import axios from 'axios';

const validationSchema = Yup.object({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username should be of minimum 3 characters length'),
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password should be of minimum 6 characters length'),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
  role: Yup.string()
    .required('Role is required')
    .oneOf(['admin', 'company', 'warehouse-manager', 'branch-manager', 'sales'], 'Invalid role'),
});

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'company', label: 'Company Manager' },
  { value: 'warehouse-manager', label: 'Warehouse Manager' },
  { value: 'branch-manager', label: 'Branch Manager' },
  { value: 'sales', label: 'Sales' },
];

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.post('http://localhost:5000/api/auth/register', {
          username: values.username,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
          role: values.role.toLowerCase(),
        });
        
        dispatch(loginSuccess(response.data));
        navigate('/login');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Registration failed');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <Typography component="h1" variant="h5" align="center" gutterBottom>
        Sign Up
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="username"
          name="username"
          label="Username"
          value={formik.values.username}
          onChange={formik.handleChange}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
          margin="normal"
        />

        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          margin="normal"
        />
        
        <TextField
          fullWidth
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          margin="normal"
        />

        <TextField
          fullWidth
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
          helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="role-label">Role</InputLabel>
          <Select
            labelId="role-label"
            id="role"
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
            error={formik.touched.role && Boolean(formik.errors.role)}
            label="Role"
          >
            {roles.map((role) => (
              <MenuItem key={role.value} value={role.value}>
                {role.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </Button>

        <Box sx={{ textAlign: 'center' }}>
          <Link href="/login" variant="body2">
            {"Already have an account? Sign In"}
          </Link>
        </Box>
      </form>
    </Box>
  );
};

export default Register; 