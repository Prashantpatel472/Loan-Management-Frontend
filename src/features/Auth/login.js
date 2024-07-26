import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Checkbox, FormControlLabel, Grid, Link, Typography, Container, Box, Avatar, IconButton, InputAdornment, Stack } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { loginSuccess, loginFailure } from '../../reducers/authSlice';
import { showAlert, startLoader, stopLoader } from '../../reducers/commonSilce';
import { loginApi } from '../../services/api';
import Iconify from '../../components/iconify';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';

import Logo from '../../components/logo';
import Divider from '@mui/material/Divider';
import { bgGradient } from '../../theme/css';


const Login = () => {
  const defaultTheme = createTheme();
  const theme = useTheme();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onForgetPassword = () => {
    navigate('/reset');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(startLoader());

    const postData = {
      userName: formData.userName,
      password: formData.password,
    };

    loginApi(postData)
      .then((data) => {
        const { status, token } = data; // Extracting necessary data
        if (status === 'success') {
          localStorage.setItem('token', token); // Store token in localStorage
          dispatch(loginSuccess({ userName: formData.userName, token }));
          navigate('/dashboard');
        } else {
          throw new Error('Login failed');
        }
      })
      .catch((error) => {
        const errorMessage = error.message || 'Login failed';
        dispatch(loginFailure(errorMessage));
        dispatch(showAlert({ type: 'error', message: errorMessage }));
      })
      .finally(() => {
        dispatch(stopLoader());
      });
  };

  return (
    <Box
    sx={{
      ...bgGradient({
        color: alpha(theme.palette.background.default, 0.9),
        imgUrl: '/assets/background/overlay_4.jpg',
      }),
      height: 1,
    }}
  >
    <Logo
      sx={{
        position: 'fixed',
        top: { xs: 16, md: 24 },
        left: { xs: 16, md: 24 },
      }}
    />

    <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
      <Card
        sx={{
          p: 5,
          width: 1,
          maxWidth: 420,
        }}
      >
        <Typography variant="h4">Sign in to LMS</Typography>

        <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
          Don’t have an account?
          <Link variant="subtitle2" sx={{ ml: 0.5 }}>
            Get started
          </Link>
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button
            fullWidth
            size="large"
            color="inherit"
            variant="outlined"
            sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
          >
            <Iconify icon="eva:google-fill" color="#DF3E30" />
          </Button>

          <Button
            fullWidth
            size="large"
            color="inherit"
            variant="outlined"
            sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
          >
            <Iconify icon="eva:facebook-fill" color="#1877F2" />
          </Button>

          <Button
            fullWidth
            size="large"
            color="inherit"
            variant="outlined"
            sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
          >
            <Iconify icon="eva:twitter-fill" color="#1C9CEA" />
          </Button>
        </Stack>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            OR
          </Typography>
        </Divider>

          <Stack spacing={3}>
        <TextField name="userName" label="Email address" onChange={handleChange}/>

        <TextField
          name="password"
          label="Password"
          onChange={handleChange}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }} onClick={onForgetPassword}>
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleSubmit}
      >
        Login
      </LoadingButton>
    
      </Card>
      </Stack>
    </Box>
  );
};

export default Login;
