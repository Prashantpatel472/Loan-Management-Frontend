// import { LOGIN_API_URL } from "./apiManagement,js";

import { LOGIN_API_URL } from "./apiManagement,js";



export const loginApi = async (postData) => {
  const formData = new FormData();
  formData.append('userName', postData.userName);
  formData.append('password', postData.password);

  try {
    const response = await fetch( 'http://${APIHEADER}:8080/user/login', {
      method: 'POST',
      body: formData,
    });
console.log("response",response);
    if (!response.ok) {
      alert("Login failed");
      throw new Error('Login failed'); 
    }

    const data = await response.json();
    console.log("data",data);
    return data;
  } catch (error) {
    throw error;
  }
};
 