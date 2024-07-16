import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // useNavigate can be replace with useHistory
import { Button, TextField, Checkbox, FormControlLabel, Grid, Link, Typography, Container, Box, Avatar } from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { loginStart, loginSuccess, loginFailure } from '../../reducers/authSlice';
import { showAlert, startLoader, stopLoader } from '../../reducers/commonSilce'; //Assuming you have a commonSilce for showing alerts
import { loginApi } from '../../services/api';
import { ALERT_ERROR } from '../../common/constants';
import { getErrorDetails } from '../../common/utility';

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
const onForgetPassword=(e)=>{
  navigate('/reset'); 
}

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
  
    dispatch(startLoader()); // Dispatch action to start loader
  
    const postData = {
      userName: formData.userName,
      password: formData.password,
    };
  
    loginApi(postData)
      .then((response) => {
        dispatch(loginSuccess(response)); // Dispatch action for successful login
        navigate('/dashboard'); // Navigate to dashboard on successful login
      })
      .catch((error) => {
        const errorMessage = error.message || 'Login failed';
        dispatch(loginFailure(errorMessage)); // Dispatch action for login failure
        dispatch(showAlert({ type: 'error', message: errorMessage })); // Dispatch action to show alert
      })
      .finally(() => {
       
        dispatch(stopLoader()); // Dispatch action to stop loader, regardless of success or failure
      });
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
         
          </Avatar>
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
              control={<Checkbox value="remember" color="primary" onClick={handleClickShowPassword}/>}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" onClick= {onForgetPassword}>
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
