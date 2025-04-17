import axios from 'axios';

// Crear una instancia de axios con la configuración base
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080'
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