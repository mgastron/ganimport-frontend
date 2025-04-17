import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem
} from '@mui/material';
import CreateUser from './CreateUser';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [searchOrderId, setSearchOrderId] = useState('');
  const [createUserOpen, setCreateUserOpen] = useState(false);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/admin/orders/${orderId}/status`, { status: newStatus });
      // Actualizar la lista de pedidos
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={() => setCreateUserOpen(true)}
          >
            Crear Usuario
          </Button>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Buscar Pedido</Typography>
            <TextField
              label="Número de Pedido"
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
            />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Pedidos</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nº Pedido</TableCell>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.user.username}</TableCell>
                    <TableCell>{new Date(order.fecha).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Select
                        value={order.estado}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        <MenuItem value="Realizado">Realizado</MenuItem>
                        <MenuItem value="Pagado">Pagado</MenuItem>
                        <MenuItem value="Enviado">Enviado</MenuItem>
                        <MenuItem value="Recibido">Recibido</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => generatePDF(order)}>
                        Descargar PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>

      <CreateUser
        open={createUserOpen}
        onClose={() => setCreateUserOpen(false)}
      />
    </Container>
  );
};

export default AdminDashboard; 