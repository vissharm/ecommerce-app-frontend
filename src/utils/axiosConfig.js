import axios from 'axios';
import { getAuthData, clearAuthData } from './secureStorage';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || ''
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const { token } = getAuthData();
    console.log('Sending request with token:', token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log('Response error:', error.response);
    if (error.response?.status === 401) {
      clearAuthData();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;








