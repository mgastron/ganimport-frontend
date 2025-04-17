import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Header from './components/Header';
import Login from './components/Login';
import Marketplace from './components/Marketplace';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import UserOrders from './components/UserOrders';
import MyOrders from './components/MyOrders';
import AdminOrders from './components/AdminOrders';
import './index.css';
import './styles/main.css';

function App() {
  const isLoginPage = window.location.pathname === '/';
  const isAdmin = localStorage.getItem('username') === 'admin';

  return (
    <Router>
      <div className="app-container" style={{ minHeight: '100vh', position: 'relative' }}>
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route 
            path="/my-orders" 
            element={isAdmin ? <AdminOrders /> : <MyOrders />} 
          />
          <Route path="/orders" element={<UserOrders />} />
        </Routes>
        {!isLoginPage && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000
          }}>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App; 