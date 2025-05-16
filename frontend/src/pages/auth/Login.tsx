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
} from '@mui/material';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import axios from 'axios';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password should be of minimum 6 characters length'),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        dispatch(loginStart());
        const response = await axios.post('http://localhost:5000/api/auth/login', values);
        
        if (!response.data.user || !response.data.user.role) {
          throw new Error('Invalid response from server');
        }
        
        dispatch(loginSuccess(response.data));
        
        // Navigate based on role
        const role = response.data.user.role;
        let redirectPath = '/';
        
        switch (role) {
          case 'admin':
            redirectPath = '/admin';
            break;
          case 'company':
            redirectPath = '/company';
            break;
          case 'warehouse-manager':
            redirectPath = '/warehouse';
            break;
          case 'branch-manager':
            redirectPath = '/branch';
            break;
          case 'sales':
            redirectPath = '/sales';
            break;
        }
        
        navigate(redirectPath, { replace: true });
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Login failed';
        dispatch(loginFailure(errorMessage));
        console.error('Login error:', err);
      }
    },
  });

  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <Typography component="h1" variant="h5" align="center" gutterBottom>
        Sign In
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit}>
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

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>

        <Box sx={{ textAlign: 'center' }}>
          <Link href="/register" variant="body2">
            {"Don't have an account? Sign Up"}
          </Link>
        </Box>
      </form>
    </Box>
  );
};

export default Login; 