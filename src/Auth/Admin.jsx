import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [showAddUserOverlay, setShowAddUserOverlay] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    password: '',
    phone: '',
    type: ''
  });
  const [formData, setFormData] = useState({
    Product_ID: '',
    Product_Name: '',
    Seller: '',
    Price: '',
    Quantity: '',
  });
  const [formsData, setFormsData] = useState({
    Price: '',
    Quantity: '',
  });
  const[successMessage,setSuccessMessage] = useState(null);
  const[logout,setLogout] = useState(false);
  const[errorMessage,setErrorMessage]  = useState(null);
  const[products,setProducts] = useState([]);
  const[showOverlay,setShowOverlay] = useState(false);
  const[showUpdateOverlay,setShowUpdateOverlay] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://delivery-backend-1qwx.onrender.com/getemployee');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching Employees:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
    setFormData({...formData, [name]: value});
    setFormsData({...formsData,[name]: value})
  };

  const handleSubmit = async (e) => {
      try {
        const formDataToSend = {
            ...newUser,
            phone: parseInt(newUser.phone, 10)
          };
        if(newUser.email==='' || newUser.name==='' || newUser.password==='' || newUser.phone.length!==10 || newUser.type===''){
            setErrorMessage('Please fill all the details Coreectly!');
      setTimeout(() => setErrorMessage(null), 3000);
            return;
        }
        console.log(formDataToSend)
        await axios.post('https://delivery-backend-1qwx.onrender.com/addemployee', formDataToSend);
        setNewUser({
          email: '',
          name: '',
          password: '',
          phone: '',
          type: ''
        });
        setSuccessMessage('User Added successfully!');
      setTimeout(() => {
        setSuccessMessage(null); 
        window.location.reload();
      }, 3000);
      setShowAddUserOverlay(false); 
      } catch (error) {
        console.error('Error updating status:', error);
        setErrorMessage('Failed to Add User!');
      setTimeout(() => setErrorMessage(null), 3000);
      }
  };

  const handleUpdate = (product) => {
    setSelectedProduct(product);
    setShowUpdateOverlay(true);
    setFormsData({
      Price: product.Price,
      Quantity: product.Quantity,
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://delivery-backend-1qwx.onrender.com/products/${selectedProduct.Product_ID}`, formData);
      fetchProducts();
      setShowUpdateOverlay(false);
      setSuccessMessage('Product Updated Successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      setFormsData({
        Price: '',
        Quantity: '',
      });
    } catch (error) {
      console.error('Error updating product:', error);
      setErrorMessage('Failed to update product');
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };


  const handleSubmits = async (e) => {
    e.preventDefault();
    if(formData.Product_ID==='' || formData.Product_Name==='' || formData.Seller==='' || formData.Price==='' || parseInt(formData.Price)<=0 || parseInt(formData.Quantity)<=0 || formData.Quantity===''){
        setErrorMessage('Please fill all the Fields!');
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
      return;
    }
    try {
      await axios.post('https://delivery-backend-1qwx.onrender.com/addproducts', formData);
      setSuccessMessage('Product added successfully');
      fetchProducts();
      setFormData({
        Product_ID: '',
        Product_Name: '',
        Seller: '',
        Price: '',
        Quantity: '', 
        To : ''
      });
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error adding product:', error);
      setErrorMessage('An error occurred while adding the product');
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://delivery-backend-1qwx.onrender.com/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    setLogout(true);
  };

  React.useEffect(() => { if (!localStorage.getItem('admin'))  navigate('/login'); },[logout]);

  return (
    <div className='table-container'>
      <h2>Users</h2>
      <button className='button' onClick={() => setShowAddUserOverlay(true)}>Add User</button>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Password</th>
            <th>Phone</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.email}>
              <td>{user.email}</td>
              <td>{user.name}</td>
              <td>{user.password}</td>
              <td>{user.phone}</td>
              <td>{user.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showAddUserOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>Add User</h2>
            <div>
            <p> Email: <input type="email" name="email" value={newUser.email} onChange={handleInputChange} /></p>
             <p>Name: <input type="text" name="name" maxLength={30} value={newUser.name} onChange={handleInputChange} /></p>
            <label> Password: <div className="password-input-wrapper">
            <input type={showPassword ? 'text' : 'password'} name="password" value={newUser.password}  style={{ 
    fontSize: '16pxx', 
    padding: '8px',   
    width: '100%'    
  }}  onChange={handleInputChange} />
            <span className="password-toggle" onClick={togglePasswordVisibility}>
              {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
            </span>
          </div>
          </label>
              <p>PhoneNo: <input type="text" maxLength={10} name="phone" value={newUser.phone} onChange={handleInputChange}  /></p>
              <p>Type: <label>
      <input 
        type="radio" 
        name="type" 
        value="delivery" 
        checked={newUser.type === 'delivery'} 
        onChange={handleInputChange} 
      />
      Delivery
    </label>
    <label>
      <input 
        type="radio" 
        name="type" 
        value="inventory" 
        checked={newUser.type === 'inventory'} 
        onChange={handleInputChange} 
      />
      Inventory
    </label></p>
              <button type="submit" onClick={handleSubmit}>Add</button>
            <button onClick={() => setShowAddUserOverlay(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
       {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      {showOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <h3>Add Product</h3>
            <div>
              <label>
                Product Id:
                <input type="text" name="Product_ID" value={formData.Product_ID} onChange={handleInputChange} required />
              </label>
              <br />
              <label>
                Product Name:
                <input type="text" name="Product_Name" value={formData.Product_Name} onChange={handleInputChange} required />
              </label>
              <br />
              <label>
                Seller: 
                <input type="text" name="Seller" value={formData.Seller} onChange={handleInputChange} required />
              </label>
              <br />
              <label>
                Price Per Product: 
                <input type="tel" name="Price" value={formData.Price} onChange={handleInputChange} required placeholder='Range starts from 1' />
              </label>
              <br />
              <label>
                Quantity: 
                <input type="tel" name="Quantity" value={formData.Quantity} onChange={handleInputChange} required placeholder='Range starts from 1' />
              </label>
              <br />
              <button type="submit" onClick={handleSubmits}>Add Product</button>
              <button onClick={() => setShowOverlay(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <h3>Products List</h3>
      <button className='button' onClick={() => setShowOverlay(true)}>Add Product</button>
     <table>
       <thead>
         <tr>
           <th>Product ID</th>
           <th>Product Name</th>
           <th>Seller</th>
           <th>Price</th>
           <th>Quantity</th>
           <th>Update</th>
         </tr>
       </thead>
       <tbody>
         {products.map((Product) => (
           <tr key={Product.Product_ID}>
             <td>{Product.Product_ID}</td>
             <td>{Product.Product_Name}</td>
             <td>{Product.Seller}</td>
             <td>{Product.Price}</td>
             <td>{Product.Quantity}</td>
             <td>
                <button className='button' onClick={() => handleUpdate(Product)}>Update</button>
              </td>
           </tr>
         ))}
       </tbody>
     </table>
     {showUpdateOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <h3>Update Product</h3>
            <div>
              <label>
                Price:
                <input type="number" name="Price" value={formsData.Price} onChange={handleInputChange} required />
              </label>
              <br />
              <label>
                Quantity:
                <input type="number" name="Quantity" value={formsData.Quantity} onChange={handleInputChange} required />
              </label>
              <br />
              <button type="submit" onClick={handleUpdateSubmit}>Update</button>
              <button type="button" onClick={() => setShowUpdateOverlay(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
     
  );
};

export default Admin;
