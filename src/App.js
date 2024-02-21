import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './Auth/SignUp';
import Delivery from './Pages/Delivery';
import Inventory from './Pages/Inventory';
import  Login  from './Auth/Login';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path = "*" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/inventory" element={<Inventory />} />
      </Routes>
    </Router>
  );
};

export default App;
