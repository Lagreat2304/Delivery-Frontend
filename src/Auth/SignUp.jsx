// SignUp.js
import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    phone: '',
    type: ''
  });
  const [alert, setAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.email === '' || formData.name === '' || formData.password === '' || formData.phone === '' || formData.phone.length!==10 || formData.type === '') {
        setAlert({ type: 'error', message: 'Please fill all the fields' });
        return;
      }
      const response = await axios.post('http://localhost:5000/signup', formData);
      console.log(response.data);
      setFormData({
        email: '',
        name: '',
        password: '',
        phone: '',
        type: ''
      });
      setAlert({ type: 'success', message: 'Signup successful' });
    } catch (error) {
      console.error('Error signing up:', error);
      setAlert({ type: 'error', message: 'An error occurred while signing up' });
    }
  };

  return (
    <div className='signup-container'>
      <h2 className='signup-heading'>Sign Up</h2>
      {alert && <div className={`alert ${alert.type}`}>{alert.message}</div>}
      <div className='input-container'>
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div className='input-container'>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />
      </div>
      <div className='input-container'>
        <label>Password:</label>
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
      </div>
      <div className='input-container'>
        <label>Phone:</label>
        <input type="tel" name="phone" value={formData.phone} maxLength={10} onChange={handleChange} />
      </div>
      <div className='radio-container'>
        <label>Type:</label>
        <input type="radio" name="type" value="delivery" checked={formData.type === 'delivery'} onChange={handleChange} /> Delivery
        <input type="radio" name="type" value="inventory" checked={formData.type === 'inventory'} onChange={handleChange} /> Inventory
      </div>
      <div className='button-container'>
        <button type="submit" onClick={handleSubmit}>Sign Up</button>
      </div>
      <div className='signup-link'>
        <Link to="*">Already have an account?</Link>
      </div>
    </div>
  );
};

export default SignUp;
