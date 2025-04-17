import React from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { IconButton, Badge } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CartIcon = () => {
  const navigate = useNavigate();
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const itemCount = cartItems.length;

  return (
    <IconButton
      onClick={() => navigate('/cart')}
      sx={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#1976d2',
        color: 'white',
        '&:hover': {
          backgroundColor: '#1565c0', 
        },
        width: '56px',
        height: '56px',
        boxShadow: '0 3px 5px 2px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Badge badgeContent={itemCount} color="error">
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
  );
};

export default CartIcon; 