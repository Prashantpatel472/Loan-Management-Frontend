// App.js
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getLocalStorageData, isUserLoggedIn } from './common/utility';
import { loginSuccess } from './reducers/authSlice';
import './App.css';
import Login from './features/Auth/login';
import Dashboard from './features/Dashboard/Dashboard';
import AuthResetPassword from './features/Auth/AuthResetPassword';
import CustomersList from './features/customers/CustomersList';
import PrivateRoute from './features/routes/PrivateRoute';


function App() {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = getLocalStorageData('loggedUser');
      if (userData) {
        dispatch(loginSuccess(userData));
      }
    }
  }, [dispatch]);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/reset" element={<AuthResetPassword />} />
          <Route path="/customer" element={<PrivateRoute><CustomersList /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
