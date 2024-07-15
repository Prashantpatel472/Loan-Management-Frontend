import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice'; // Import your reducer(s) here

const store = configureStore({
  reducer: {
    // Add your reducers here
    auth: authReducer,
    // otherReducer: otherReducer, // If you have more reducers
  },
});

export default store;
