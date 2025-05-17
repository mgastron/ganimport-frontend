import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api.js';
import {
  Button,
  TextField,
  Container,
  Box,
  Typography,
  Paper
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('API URL being used:', process.env.REACT_APP_API_URL);
    
    try {
      const response = await axios.post('https://ganimport-backend-production.up.railway.app/api/auth/login', {
        username,
        password
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        localStorage.setItem('username', username);
        localStorage.setItem('isAdmin', response.data.isAdmin);
        console.log('Username stored:', username); // Para debug
        navigate('/marketplace');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Credenciales inválidas');
    }
  };

  const handleWhatsApp = () => {
    window.location.href = 'https://wa.me/5491128961362';
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center">
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
          </Box>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              If you need an account contact us
            </Typography>
            <Button
              variant="contained"
              color="success"
              startIcon={<WhatsAppIcon />}
              onClick={handleWhatsApp}
            >
              WhatsApp Contact
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 