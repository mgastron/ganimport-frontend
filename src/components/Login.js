import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username: username,
        password: password
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
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
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