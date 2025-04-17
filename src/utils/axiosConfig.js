import axios from 'axios';

// Crear una instancia de axios
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Agregar un interceptor para todas las peticiones
axiosInstance.interceptors.request.use(
  config => {
    const username = localStorage.getItem('username');
    console.log('Sending request with username:', username); // Para debug
    
    if (username) {
      config.headers['X-Username'] = username;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axiosInstance; 