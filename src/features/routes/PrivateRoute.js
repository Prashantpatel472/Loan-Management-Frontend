
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const token = localStorage.getItem('token');
  return isLoggedIn && token ? children : <Navigate to="/" />;
};

export default PrivateRoute;
