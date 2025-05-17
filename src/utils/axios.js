import axios from 'axios';
import API_URL from '../config/api.js';

// Crear una instancia de axios con la configuración base
const axiosInstance = axios.create({
  baseURL: API_URL
});

// Agregar un interceptor para incluir el username en cada petición
axiosInstance.interceptors.request.use(config => {
  const username = localStorage.getItem('username');
  if (username) {
    config.headers['X-Username'] = username;
  }
  return config;
});

export default axiosInstance; 