import axios from 'axios';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Paper, Typography, Box, Button } from '@mui/material';
import { API_BASE_URL } from '../config';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
  const location = useLocation();
  const { highlightOrder, message } = location.state || {};

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    if (!isAdmin) return;
    try {
      await axios.put(`${API_BASE_URL}/api/orders/${orderId}/status`, newStatus);
      fetchOrders(); // Recargar órdenes
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = ['REALIZADO', 'PAGADO', 'ENVIADO', 'RECIBIDO'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    return currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : null;
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 4 }}>
        {isAdmin ? 'Gestión de Pedidos' : 'Mis Pedidos'}
      </Typography>
      {orders.length === 0 ? (
        <Typography>No hay pedidos para mostrar</Typography>
      ) : (
        orders.map(order => (
          <Paper 
            key={order.orderNumber || order.id}
            sx={{ 
              p: 3, 
              mb: 3,
              backgroundColor: order.orderNumber === highlightOrder ? '#f0f7ff' : 'white',
              border: order.orderNumber === highlightOrder ? '2px solid #E8DCC4' : '1px solid #ddd'
            }}
          >
            <Typography variant="h6" color="primary" gutterBottom>
              Orden #{order.orderNumber}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Fecha: {new Date(order.orderDate).toLocaleString()}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Estado: {order.status}
            </Typography>
            
            {isAdmin && getNextStatus(order.status) && (
              <Button
                variant="contained"
                onClick={() => handleStatusUpdate(order.id, getNextStatus(order.status))}
                sx={{ mt: 1 }}
              >
                Cambiar a {getNextStatus(order.status)}
              </Button>
            )}

            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Productos:
              </Typography>
              {order.items && order.items.map((item, index) => (
                <Box key={index} sx={{ ml: 2, mb: 2 }}>
                  <Typography variant="body1">
                    {item.productName} - Código: {item.productCode}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cantidad: {item.quantity} unidades
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Precio por unidad: ${item.pricePerUnit?.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Subtotal: ${item.total?.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
              ))}
            </Box>
            
            <Typography variant="h6" sx={{ mt: 2, color: 'primary.main' }}>
              Total: ${order.total?.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </Typography>
          </Paper>
        ))
      )}
    </Container>
  );
};

export default UserOrders; 