import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import axiosInstance from '../../utils/axiosConfig';

const UserManagement = () => {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    nombre: '',
    apellido: '',
    nombreNegocio: '',
    direccion: '',
    email: '',
    telefono: '',
    puestoEmpresa: ''
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/admin/users', userData);
      setSnackbar({
        open: true,
        message: 'Usuario creado exitosamente',
        severity: 'success'
      });
      // Limpiar el formulario
      setUserData({
        username: '',
        password: '',
        nombre: '',
        apellido: '',
        nombreNegocio: '',
        direccion: '',
        email: '',
        telefono: '',
        puestoEmpresa: ''
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al crear el usuario',
        severity: 'error'
      });
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Crear Nuevo Usuario
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="username"
                label="Nombre de Usuario"
                value={userData.username}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                value={userData.password}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="nombre"
                label="Nombre"
                value={userData.nombre}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="apellido"
                label="Apellido"
                value={userData.apellido}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="nombreNegocio"
                label="Nombre del Negocio"
                value={userData.nombreNegocio}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="direccion"
                label="Dirección"
                value={userData.direccion}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="email"
                label="Email"
                type="email"
                value={userData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="telefono"
                label="Teléfono"
                value={userData.telefono}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Puesto en la Empresa</InputLabel>
                <Select
                  name="puestoEmpresa"
                  value={userData.puestoEmpresa}
                  onChange={handleChange}
                >
                  <MenuItem value="">Ninguno</MenuItem>
                  <MenuItem value="dueño">Dueño</MenuItem>
                  <MenuItem value="empleado">Empleado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
              >
                Crear Usuario
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserManagement; 