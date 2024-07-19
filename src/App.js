import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
// import Dashboard from './features/Dashboard/Dashboard'; // Assuming this is the path to your Dashboard component
import { getLocalStorageData, isUserLoggedIn } from './common/utility'; // Assuming utility functions for authentication
import { loginSuccess } from './reducers/authSlice'; // Assuming your authSlice for handling authentication
import './App.css';
import Login from './features/Auth/login';
import Dashboard from './features/Dashboard/Dashboard';
import AuthResetPassword from './features/Auth/AuthResetPassword';
import CustomersList from './features/Dashboard/CustomersList';

function App() {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn); // Replace 'auth' with your slice name
  const dispatch = useDispatch();

  useEffect(() => {
    const userData = getLocalStorageData('loggedUser'); // Example function to get user data from localStorage
    if (userData) {
      dispatch(loginSuccess(userData)); // Dispatch action to update Redux state with user data
    }
  }, [dispatch]);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reset" element={<AuthResetPassword />} />
          <Route path="/customer" element={<CustomersList />} />
          

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
