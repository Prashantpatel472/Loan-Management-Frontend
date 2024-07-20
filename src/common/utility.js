// common/utility.js
export const getLocalStorageData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const isUserLoggedIn = () => {
  return !!localStorage.getItem('token');
};

export const getErrorDetails = (error) => {
    let statusCode = "";
    let msg = "";
    statusCode = error.response ? error.response : error.code;
    msg = error.response ? error.response : error.message;
    return { statusCode, msg };
};