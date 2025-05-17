import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Typography, Paper, Box } from '@mui/material';
import API_URL from '../config/api.js';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const location = useLocation();
  const { highlightOrder, message } = location.state || {};

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/orders`);
      console.log('Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Orders received:', data);
        setOrders(data);
      } else {
        console.error('Response not ok:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    if (message) {
      // Mostrar mensaje de éxito
      alert(message);
    }
  }, [message]);

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 4 }}>Lista de Pedidos</Typography>
      {orders.length === 0 ? (
        <Typography>No hay pedidos para mostrar</Typography>
      ) : (
        orders.map(order => (
          <Paper 
            key={order.orderNumber}
            sx={{ 
              p: 2, 
              mb: 2,
              backgroundColor: order.orderNumber === highlightOrder ? '#f0f7ff' : 'white',
              border: order.orderNumber === highlightOrder ? '2px solid #1976d2' : 'none'
            }}
          >
            <Typography variant="h6">
              Número de Orden: {order.orderNumber}
            </Typography>
            <Typography>
              Fecha: {new Date(order.orderDate).toLocaleString()}
            </Typography>
            <Typography>
              Estado: {order.estado}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Total: ${order.total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
            {/* Lista de items */}
            {order.items.map(item => (
              <Box key={item.id} sx={{ mt: 1, ml: 2 }}>
                <Typography>
                  {item.productName} - {item.quantity} unidades
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Precio por unidad: ${item.pricePerUnit.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Box>
            ))}
          </Paper>
        ))
      )}
    </Container>
  );
};

export default OrderList; 