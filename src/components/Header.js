import React from 'react';
import { AppBar, Toolbar, Box, Button } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const theme = {
  primary: '#E8DCC4', // Beige
  secondary: '#000000', // Negro
  hover: '#F2E8D9', // Beige más claro para hover
  background: '#FAF6F0', // Beige muy claro para el fondo
};

const Header = () => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  const isLoggedIn = !!username;
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('username');
    navigate('/');
  };

  // Verificar si estamos en la página de login
  const isLoginPage = location.pathname === '/';

  // No mostrar nada en el header si estamos en la página de login
  if (isLoginPage) {
    return (
      <AppBar 
        position="static" 
        color="transparent" 
        elevation={0}
        sx={{
          borderBottom: '1px solid #e0e0e0',
          marginBottom: 2
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
          <img 
            src="/images/LogoGani.jpeg" 
            alt="Gani Import" 
            style={{ 
              height: '60px',
              objectFit: 'contain'
            }}
          />
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: theme.primary }}>
      <Toolbar>
        <Link to="/marketplace" style={{ textDecoration: 'none', color: 'inherit' }}>
          <img 
            src="/images/LogoGani.jpeg" 
            alt="Logo" 
            style={{ 
              height: '50px', 
              marginRight: '20px',
              cursor: 'pointer' 
            }} 
          />
        </Link>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isLoggedIn && isAdmin && (
            <>
              <Button
                color="inherit"
                onClick={() => navigate('/admin/users')}
                sx={{ color: theme.secondary }}
              >
                Crear Usuario
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate('/admin/orders')}
                sx={{ color: theme.secondary }}
              >
                Ver Pedidos
              </Button>
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{ color: theme.secondary }}
              >
                Cerrar Sesión
              </Button>
            </>
          )}
          {isLoggedIn && !isAdmin && (
            <>
              <Button
                color="inherit"
                onClick={() => navigate('/my-orders')}
                sx={{ color: theme.secondary }}
              >
                Mis Pedidos
              </Button>
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{ color: theme.secondary }}
              >
                Cerrar Sesión
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 