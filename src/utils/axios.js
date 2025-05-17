import axios from 'axios';
import API_URL from '../config/api.js';

// Crear una instancia de axios con la configuración base
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true // Habilitar envío de cookies en solicitudes cross-origin
});

// Agregar un interceptor para incluir el username y token en cada petición
axiosInstance.interceptors.request.use(config => {
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  
  if (username) {
    config.headers['X-Username'] = username;
  }
  
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
    config.headers['X-Auth-Token'] = token;
  }
  
  return config;
});

export default axiosInstance; 