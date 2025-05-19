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
  IconButton,
  Typography,
  Box,
  Alert,
  TextField,
  ButtonGroup
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const MINIMUM_PURCHASE = 300000;

const Cart = ({ open, onClose, cart, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const handleQuantityChange = (item, event) => {
    const newValue = event.target.value;
    
    // Permitir campo vacío para que el usuario pueda borrar
    if (newValue === '') {
      onUpdateQuantity(item, 0);
      return;
    }

    // Convertir a número
    const value = parseInt(newValue, 10);
    
    // Si no es un número válido, retornar
    if (isNaN(value)) return;

    // Actualizar aunque no sea múltiplo para permitir escritura
    onUpdateQuantity(item, value);
  };

  const handleIncrement = (item) => {
    onUpdateQuantity(item, item.quantity + item.bulkQuantity);
  };

  const handleDecrement = (item) => {
    if (item.quantity - item.bulkQuantity >= 0) {
      onUpdateQuantity(item, item.quantity - item.bulkQuantity);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const pricePerUnit = (item.price * 1000 * 0.44);
      const itemTotal = pricePerUnit * item.quantity;
      return total + itemTotal;
    }, 0);
  };

  const total = calculateTotal();
  const isbelowMinimum = total < MINIMUM_PURCHASE;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Carrito de Compras</DialogTitle>
      <DialogContent>
        {cart.length === 0 ? (
          <Typography>El carrito está vacío</Typography>
        ) : (
          <>
            {cart.map((item) => {
              const pricePerUnit = (item.price * 1000 * 0.44);
              const itemTotal = pricePerUnit * item.quantity;
              const bulkPrice = pricePerUnit * item.bulkQuantity;
              
              return (
                <Box key={item.code} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Código: {item.code}
                  </Typography>
                  <Typography variant="body1">
                    Precio por unidad: ${pricePerUnit.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                  <Typography variant="body1">
                    Precio por bulto: ${bulkPrice.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                    <Typography>Cantidad:</Typography>
                    <ButtonGroup variant="outlined" size="small">
                      <Button onClick={() => onUpdateQuantity(item, item.quantity - item.bulkQuantity)}>-</Button>
                      <Button disabled>{item.quantity}</Button>
                      <Button onClick={() => onUpdateQuantity(item, item.quantity + item.bulkQuantity)}>+</Button>
                    </ButtonGroup>
                    <Typography>
                      Subtotal: ${itemTotal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                    <IconButton onClick={() => onRemoveItem(item)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              );
            })}
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="h6">
                Total: ${total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
              {isbelowMinimum && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  El monto mínimo de compra es de ${MINIMUM_PURCHASE.toLocaleString('es-AR')}
                </Alert>
              )}
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
        <Button 
          onClick={onCheckout}
          variant="contained" 
          color="primary"
          disabled={cart.length === 0 || isbelowMinimum}
        >
          Finalizar Compra
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Cart; 