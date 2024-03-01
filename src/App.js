import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignUp from './Auth/SignUp';
import Delivery from './Pages/Delivery';
import Inventory from './Pages/Inventory';
import Login from './Auth/Login';
import Orders from './Pages/Orders';
import Admin from './Auth/Admin';

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin" element={<Admin />}  />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
