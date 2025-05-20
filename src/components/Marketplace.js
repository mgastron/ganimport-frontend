import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api.js';
import axiosInstance from '../utils/axios.js';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Snackbar,
  Alert,
  Badge,
  Pagination,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Cart from './Cart';
import OrderConfirmation from './OrderConfirmation';
import ProductImageModal from './ProductImageModal';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

// Definimos las constantes de colores al inicio del archivo
const theme = {
  primary: '#E8DCC4', // Beige
  secondary: '#000000', // Negro
  hover: '#F2E8D9', // Beige más claro para hover
  background: '#FAF6F0', // Beige muy claro para el fondo
};

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const productsPerPage = 36; // Aumentamos a 36 productos por página para que coincida con la paginación original
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearch, setActiveSearch] = useState(''); // Este es el término que realmente usamos para filtrar
  const [selectedCategory, setSelectedCategory] = useState('');
  const categories = ['Bazar', 'Regaleria', 'Baño', 'Ferreteria'];
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const isLoggedIn = !!localStorage.getItem('username');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Usando axiosInstance que ya tiene configurado los headers necesarios
        const response = await axiosInstance.get('/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Calcular productos para la página actual
  const getCurrentPageProducts = () => {
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0); // Scroll al inicio cuando cambia la página
  };

  const addToCart = (product) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.code === product.code);
      if (existingItem) {
        return currentCart.map(item =>
          item.code === product.code
            ? { ...item, quantity: item.quantity + product.bulkQuantity }
            : item
        );
      }
      return [...currentCart, { ...product, quantity: product.bulkQuantity }];
    });
    setSnackbar({
      open: true,
      message: `${product.name} agregado al carrito`,
      severity: 'success'
    });
  };

  const updateCartItemQuantity = (item, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(currentCart =>
      currentCart.map(cartItem =>
        cartItem.code === item.code
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      )
    );
  };

  const removeFromCart = (item) => {
    setCart(currentCart => currentCart.filter(cartItem => cartItem.code !== item.code));
  };

  const handleCheckout = () => {
    const total = cart.reduce((sum, item) => {
      const pricePerUnit = (item.price * 1000 * 0.44);
      return sum + (pricePerUnit * item.quantity);
    }, 0);

    if (total < 300000) {
      setSnackbar({
        open: true,
        message: 'El monto mínimo de compra es de $300.000',
        severity: 'error'
      });
      return;
    }

    setCartOpen(false);
    setConfirmationOpen(true);
  };

  const handleConfirmOrder = async () => {
    const total = cart.reduce((sum, item) => {
      const pricePerUnit = (item.price * 1000 * 0.44);
      return sum + (pricePerUnit * item.quantity);
    }, 0);

    if (total < 300000) {
      setSnackbar({
        open: true,
        message: 'El monto mínimo de compra es de $300.000',
        severity: 'error'
      });
      return;
    }

    try {
      // Usando axiosInstance que ya tiene configurado los headers necesarios
      await axiosInstance.post('/api/order', {
        items: cart,
        email: 'matiasgastron@gmail.com'
      });
      
      setCart([]);
      setConfirmationOpen(false);
      setSnackbar({
        open: true,
        message: '¡Tu pedido ha sido realizado con éxito! Pronto nos contactaremos contigo.',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al procesar el pedido',
        severity: 'error'
      });
    }
  };

  const filteredProducts = products.filter(product => {
    if (!product) return false;
    
    // Filtro por búsqueda
    const matchesSearch = !activeSearch || (
      (product.name && product.name.toLowerCase().includes(activeSearch.toLowerCase())) ||
      (product.code && product.code.toString().toLowerCase().includes(activeSearch.toLowerCase()))
    );

    // Filtro por categoría
    const matchesCategory = !selectedCategory || 
      (product.categories && product.categories.includes(selectedCategory));

    return matchesSearch && matchesCategory;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Término de búsqueda:', searchTerm);
    console.log('Productos disponibles:', products);
    setActiveSearch(searchTerm);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setActiveSearch('');
    setSelectedCategory('');
    setPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
    setPage(1);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#fff'
        }}
      >
        <img
          src="/images/LogoGani.jpeg"
          alt="Logo"
          style={{
            width: '300px', // Ajusta este valor según necesites
            height: 'auto',
            marginBottom: '20px'
          }}
        />
        <CircularProgress 
          sx={{ 
            color: theme.primary,
            marginTop: '20px'
          }} 
        />
      </Box>
    );
  }

  if (error) return <div>{error}</div>;

  return (
    <Container>
      <Box sx={{ mb: 4, mt: 4 }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '16px' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClearSearch}
                    edge="end"
                    sx={{ 
                      '&:hover': { 
                        backgroundColor: 'rgba(0, 0, 0, 0.04)' 
                      }
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: 'white',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: theme.primary,
                },
                '&:hover fieldset': {
                  borderColor: theme.primary,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.primary,
                },
              },
            }}
          />
          <Button 
            variant="contained" 
            onClick={handleSearch}
            sx={{ 
              minWidth: '120px',
              height: '56px',
              backgroundColor: theme.primary,
              color: theme.secondary,
              '&:hover': {
                backgroundColor: theme.hover,
              }
            }}
          >
            Buscar
          </Button>
        </form>
        
        {/* Botones de categoría */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mt: 2,
          flexWrap: 'wrap',
          justifyContent: 'center', // Centra los botones horizontalmente
          width: '100%' // Asegura que el Box ocupe todo el ancho disponible
        }}>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "contained" : "outlined"}
              onClick={() => handleCategoryChange(category)}
              sx={{
                borderColor: theme.primary,
                '&:hover': {
                  borderColor: theme.primary,
                  backgroundColor: selectedCategory === category ? theme.primary : 'rgba(232, 220, 196, 0.1)',
                },
                color: theme.secondary,
                backgroundColor: selectedCategory === category ? theme.primary : 'transparent',
                minWidth: '120px',
              }}
            >
              {category}
            </Button>
          ))}
        </Box>
      </Box>

      {activeSearch && filteredProducts.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No se encontraron productos que coincidan con la búsqueda
          </Typography>
        </Box>
      ) : (
        <>
          <Button
            color="primary"
            onClick={() => setCartOpen(true)}
            style={{ 
              position: 'fixed', 
              bottom: 20,
              right: 20,
              zIndex: 1000,
              backgroundColor: theme.primary,
              color: theme.secondary,
              padding: '12px',
              minWidth: 'unset',
              borderRadius: '50%',
              boxShadow: '0 3px 5px 2px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Badge badgeContent={cart.length} color="error">
              <ShoppingCartIcon />
            </Badge>
          </Button>

          <Grid container spacing={2} sx={{ minHeight: '100vh' }}>
            {getCurrentPageProducts().map((product) => {
              console.log('-------- Producto:', product.name, '--------');
              console.log('Precio original:', product.price);
              console.log('Precio * 0.44:', product.price * 0.44);
              console.log('Cantidad por bulto:', product.bulkQuantity);
              console.log('Precio por unidad:', (product.price * 0.44 / product.bulkQuantity));
              
              return (
                <Grid item xs={12} sm={6} md={4} key={product.code} sx={{ 
                  display: 'flex',
                  '@media (min-width: 960px)': { // md breakpoint
                    maxWidth: '33.33%', // Hace que en pantallas grandes ocupe 1/3 del espacio
                    flexBasis: '33.33%'
                  }
                }}>
                  <Card sx={{ 
                    width: '100%', // Asegura que la card ocupe todo el ancho disponible
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    '& .MuiButton-contained': {
                      backgroundColor: theme.primary,
                      color: theme.secondary,
                      '&:hover': {
                        backgroundColor: theme.hover,
                      }
                    }
                  }}>
                    <CardMedia
                      component="img"
                      height="260"
                      image={product.imageUrl}
                      alt={product.name}
                      sx={{ 
                        objectFit: 'contain',
                        backgroundColor: '#f5f5f5',
                        padding: '12px',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        }
                      }}
                      onClick={() => {
                        setSelectedProduct(product);
                        setImageModalOpen(true);
                      }}
                    />
                    <CardContent sx={{ 
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: '16px', // Ajustamos el padding del contenido
                    }}>
                      <Typography gutterBottom variant="h6">
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Código: {product.code || 'N/A'}
                      </Typography>
                      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isLoggedIn
                          ? `$${((product.price * 1000 * 0.44)).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          : <span style={{ color: '#aaa' }}>Inicia sesión para ver precios</span>
                        }
                        <span style={{ 
                          color: 'rgba(0, 0, 0, 0.7)', 
                          fontSize: '0.8em',
                          fontWeight: 'normal' 
                        }}>
                          por unidad
                        </span>
                      </Typography>
                      <Typography variant="body2">
                        Bulto: {product.bulkQuantity} unidades
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {isLoggedIn
                          ? `Precio por bulto: $${(product.price * 1000 * 0.44 * product.bulkQuantity).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          : <span style={{ color: '#aaa' }}>Inicia sesión para ver precios</span>
                        }
                      </Typography>
                      {product.dimensions && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Dimensiones: {product.dimensions}
                        </Typography>
                      )}
                    </CardContent>
                    {isLoggedIn && !isAdmin && (
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => addToCart(product)}
                        sx={{ 
                          mt: 'auto',
                          mx: 0, // Quitamos el margen horizontal
                          borderRadius: 0, // Quitamos el border radius del botón
                          height: '48px', // Altura fija para el botón
                        }}
                      >
                        Agregar al Carrito
                      </Button>
                    )}
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Paginación */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 4, 
            mb: 4,
            '& .MuiPagination-ul': { // Estilo para los números de página
              gap: '8px'
            },
            '& .MuiPaginationItem-root': {
              color: theme.primary,
              '&.Mui-selected': {
                backgroundColor: theme.primary,
                color: theme.secondary,
                '&:hover': {
                  backgroundColor: theme.hover,
                }
              }
            }
          }}>
            <Pagination 
              count={Math.ceil(filteredProducts.length / productsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              siblingCount={1} // Reduce el número de páginas mostradas a los lados
              boundaryCount={1} // Reduce el número de páginas mostradas en los extremos
            />
          </Box>

          <ProductImageModal
            open={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
            product={selectedProduct}
          />

          <Cart
            open={cartOpen}
            onClose={() => setCartOpen(false)}
            cart={cart}
            onUpdateQuantity={updateCartItemQuantity}
            onRemoveItem={removeFromCart}
            onCheckout={handleCheckout}
          />

          <OrderConfirmation
            open={confirmationOpen}
            onClose={() => setConfirmationOpen(false)}
            cart={cart}
            onConfirm={handleConfirmOrder}
          />

          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </>
      )}
    </Container>
  );
};

export default Marketplace; 