import axios from 'axios';
import { getAuthData, clearAuthData } from './secureStorage';

// Always use the same origin where the app is hosted
const getBaseURL = () => {
  const { protocol, hostname, port } = window.location;
  const basePort = port ? `:${port}` : '';
  return `${protocol}//${hostname}${basePort}`;
};

const axiosInstance = axios.create({
  baseURL: getBaseURL()
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








