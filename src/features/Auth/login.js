import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Checkbox, FormControlLabel, Grid, Link, Typography, Container, Box, Avatar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { loginSuccess, loginFailure } from '../../reducers/authSlice';
import { showAlert, startLoader, stopLoader } from '../../reducers/commonSilce';
import { loginApi } from '../../services/api';

const defaultTheme = createTheme();

const Login = () => {
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
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }} />
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="userName"
              label="User Name"
              name="userName"
              autoComplete="userName"
              autoFocus
              value={formData.userName}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" onClick={handleClickShowPassword} />}
              label="Remember me"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" onClick={onForgetPassword}>
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
