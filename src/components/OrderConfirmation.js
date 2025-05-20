import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';

const OrderConfirmation = ({ open, onClose, cart, onConfirm }) => {
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const pricePerUnit = (item.price * 1000 * 0.44);
      const itemTotal = pricePerUnit * item.quantity;
      return total + itemTotal;
    }, 0);
  };

  const handleConfirm = async () => {
    try {
      const username = localStorage.getItem('username');
      console.log('Username from localStorage:', username); // Para debug

      const orderData = {
        items: cart.map(item => ({
          productName: item.name,
          productCode: item.code,
          quantity: item.quantity,
          bulkQuantity: item.bulkQuantity,
          pricePerUnit: (item.price * 1000 * 0.44),
          total: (item.price * 1000 * 0.44) * item.quantity
        })),
        total: calculateTotal()
      };

      const response = await axiosInstance.post('/api/orders', orderData);
      
      if (response.data) {
        onConfirm();
        navigate('/my-orders', { 
          state: { 
            highlightOrder: response.data.orderNumber,
            message: `Pedido ${response.data.orderNumber} creado exitosamente` 
          } 
        });
      }
    } catch (error) {
      console.error('Error detallado:', error.response?.data || error.message);
      alert(error.response?.data || 'Error al procesar el pedido');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Confirmar Pedido</DialogTitle>
      <DialogContent>
        <List>
          {cart.map((item) => {
            const pricePerUnit = (item.price * 1000 * 0.44);
            const itemTotal = pricePerUnit * item.quantity;
            const bulkPrice = pricePerUnit * item.bulkQuantity;
            const numberOfBulks = item.quantity / item.bulkQuantity;

            return (
              <ListItem key={item.code} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Código: {item.code}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Typography>
                    Cantidad: {item.quantity} unidades ({numberOfBulks} bultos de {item.bulkQuantity})
                  </Typography>
                  <Typography>
                    Precio por unidad: ${pricePerUnit.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                  <Typography>
                    Precio por bulto: ${bulkPrice.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Subtotal: ${itemTotal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                </Box>
              </ListItem>
            );
          })}
        </List>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Total del Pedido: ${calculateTotal().toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          Confirmar Pedido
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderConfirmation; 