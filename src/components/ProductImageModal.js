import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ProductImageModal = ({ open, onClose, product }) => {
  if (!product) return null;

  // Agregamos logs cuando se abre el modal
  console.log('-------- Modal Producto:', product.name, '--------');
  console.log('Precio original:', product.price);
  console.log('Precio * 0.44:', product.price * 0.44);
  console.log('Cantidad por bulto:', product.bulkQuantity);
  console.log('Precio por unidad:', (product.price * 0.44 / product.bulkQuantity));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {product.name}
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: 'center' }}>
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{
              maxWidth: '100%',
              maxHeight: '70vh',
              objectFit: 'contain'
            }}
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" color="text.secondary">
              Código: {product.code}
            </Typography>
            {product.dimensions && (
              <Typography variant="body1" color="text.secondary">
                Dimensiones: {product.dimensions}
              </Typography>
            )}
            <Typography variant="h6" sx={{ mt: 1 }}>
              Precio por unidad: ${((product.price * 1000 * 0.44) / product.bulkQuantity).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
            <Typography variant="body1">
              Cantidad por bulto: {product.bulkQuantity} unidades
            </Typography>
            <Typography variant="body1">
              Precio por bulto: ${(product.price * 1000 * 0.44).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProductImageModal; 