import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid
} from '@mui/material';
import axiosInstance from '../../utils/axiosConfig';

const CreateUser = ({ open, onClose }) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/admin/users', userData);
      onClose();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Crear Nuevo Usuario</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Nombre de Usuario"
              value={userData.username}
              onChange={(e) => setUserData({...userData, username: e.target.value})}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="password"
              label="Contraseña"
              value={userData.password}
              onChange={(e) => setUserData({...userData, password: e.target.value})}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Nombre"
              value={userData.nombre}
              onChange={(e) => setUserData({...userData, nombre: e.target.value})}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Apellido"
              value={userData.apellido}
              onChange={(e) => setUserData({...userData, apellido: e.target.value})}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre del Negocio"
              value={userData.nombreNegocio}
              onChange={(e) => setUserData({...userData, nombreNegocio: e.target.value})}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Dirección"
              value={userData.direccion}
              onChange={(e) => setUserData({...userData, direccion: e.target.value})}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({...userData, email: e.target.value})}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Teléfono"
              value={userData.telefono}
              onChange={(e) => setUserData({...userData, telefono: e.target.value})}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Puesto en la Empresa</InputLabel>
              <Select
                value={userData.puestoEmpresa}
                onChange={(e) => setUserData({...userData, puestoEmpresa: e.target.value})}
              >
                <MenuItem value="">Ninguno</MenuItem>
                <MenuItem value="dueño">Dueño</MenuItem>
                <MenuItem value="empleado">Empleado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Crear Usuario
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUser; 