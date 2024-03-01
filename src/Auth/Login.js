import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    type: ''
  });
  const [alert, setAlert] = useState(null);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); 

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', formData);
      console.log(response.data);
      setFormData({
        email: '',
        password: '',
        type: ''
      });
      setAlert({ type: 'success', message: 'Login Successful!' });
      console.log("Attempting Login");
      setTimeout(() => {
        if (response.data.usertype === 'delivery') {
          navigate('/delivery');
        } else if (response.data.usertype === 'inventory') {
          navigate('/inventory');
        }
        else if(response.data.usertype==='admin'){
          navigate('/admin');
        }
      }, 3000);
    } catch (error) {
      console.error('Error logging in:', error);
      setAlert({ type: 'error', message: 'Invalid Login Credentials' });
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-heading">Login</h2>
      {alert && <div className={`alert ${alert.type}`}>{alert.message}</div>}
      <div className="login-input">
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>
      </div>
      <div className="login-input">
        <label>
          Password:
          <div className="password-input-wrapper">
            <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password}  style={{ 
    fontSize: '16pxx', 
    padding: '8px',   
    width: '100%'    
  }}  onChange={handleChange} />
            <span className="password-toggle" onClick={togglePasswordVisibility}>
              {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
            </span>
          </div>
        </label>
      </div>
      <div className="login-input">
        <label>
          Type:
        <input type="radio" name="type" value="delivery" checked={formData.type === 'delivery'} onChange={handleChange} /> Delivery
        <input type="radio" name="type" value="inventory" checked={formData.type === 'inventory'} onChange={handleChange} /> Inventory
        <input type="radio" name="type" value="admin" checked={formData.type === 'admin'} onChange={handleChange} /> Admin
      </label>
      </div>
      <div>
        <button className="login-button" onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;
