import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box
} from '@mui/material';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get('/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'REALIZADO': 'PAGADO',
      'PAGADO': 'ENVIADO',
      'ENVIADO': 'RECIBIDO'
    };
    return statusFlow[currentStatus];
  };

  const handleAdvanceStatus = async (orderId, currentStatus) => {
    const nextStatus = getNextStatus(currentStatus);
    if (!nextStatus) return;

    try {
      await axiosInstance.put(
        `/api/orders/${orderId}/status`,
        nextStatus,
        {
          headers: {
            'Content-Type': 'text/plain'
          }
        }
      );
      await fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Administrar Pedidos
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Número de Pedido</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Productos</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>{order.user.username}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Box sx={{ 
                    display: 'inline-block',
                    padding: '6px 16px',
                    borderRadius: '4px',
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2'
                  }}>
                    {order.status}
                  </Box>
                </TableCell>
                <TableCell>${order.total}</TableCell>
                <TableCell>
                  {order.items.map(item => (
                    <div key={item.id}>
                      {item.productName} x {item.quantity}
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  {order.status !== 'RECIBIDO' && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAdvanceStatus(order.id, order.status)}
                    >
                      Avanzar Estado
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminOrders; 