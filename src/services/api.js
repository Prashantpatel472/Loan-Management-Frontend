import { createAsyncThunk } from "@reduxjs/toolkit";
import { isApiError } from "../common/utility";
import requestsApi from "../app/requestsApi";

const API_URL = 'http://localhost:8080/user/login'; // Replace with your actual API URL


export const loginApi = async (postData) => {
  const formData = new FormData();
  formData.append('userName', postData.userName);
  formData.append('password', postData.password);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });
console.log("response",response);
    if (!response.ok) {
      alert("Login failed");
      throw new Error('Login failed'); // Handle error as needed
    }

   return response;
  } catch (error) {
    throw error;
  }
};
 