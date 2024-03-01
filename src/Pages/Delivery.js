import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Delivery.css';
const Delivery = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const[successMessage,setSuccessMessage] = useState(null);
  const[errorMessage,setErrorMessage]  = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    productsPerPage: 5
  });
  const [cartOverlay, setCartOverlay] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const[delivery,setDelivery] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const[person,setPerson] = useState('');
  const[remarks,setRemarks] = useState('');
  const navigate = useNavigate();
  const[phoneno,setPhoneno] = useState(0);

  useEffect(() => {
    setTotalPages(Math.ceil(cartProducts.length / pagination.productsPerPage));
  }, [cartProducts, pagination.productsPerPage]);

  const indexOfLastProduct = pagination.currentPage * pagination.productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - pagination.productsPerPage;
  const currentProducts = cartProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const handlePageChange = (pageNumber) => {
    setPagination({ ...pagination, currentPage: pageNumber });
  };

  const fetchCartProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/cartProducts');
      setCartProducts(response.data);
    } catch (error) {
      console.error('Error fetching cart products:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  useEffect(() => {
    fetchCartProducts();
  }, []);

  const handleLogout = () => {
    window.location.href = '/login';
  };

  const handleViewOrders = () => {
    navigate("/orders");
  };

  const callApiWithOverlayDetails = async () => {
    if (!selectedProduct || !delivery || !selectedStatus || !person || !remarks) {
      setErrorMessage('Please fill in all fields.');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/makeorders', {
        Cart_ID: selectedProduct.Cart_ID,
        Product_Name: selectedProduct.Product_Name,
        Seller : selectedProduct.Seller,
        Quantity : selectedProduct.Quantity,
        Price : selectedProduct.Price,
        Delivery_Date : selectedProduct.Delivery_Date,
        Actual_Delivery_Date: delivery,
        person : person,
        phone : parseInt(phoneno),
        status: selectedStatus,
        remarks: remarks
      });
      console.log('API response:', response.data);
      setSuccessMessage('Update successful');
      setTimeout(() => {
        setSuccessMessage(null); 
        window.location.reload();
      }, 3000);
      setCartOverlay(false); 
    } catch (error) {
      console.error('Error updating status:', error);
      setErrorMessage('Failed to update status');
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleUpdateStatus = (product) => {
    setSelectedProduct(product);
    setCartOverlay(true);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  return (
    <div className='table-container'>
      <div className='top'><button className='button' onClick={handleViewOrders}>View Orders</button></div>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      <h2>Cart Products</h2>
      <h2>Delivery</h2>
      <table>
        <thead>
          <tr>
            <th>Cart ID</th>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Seller</th>
            <th>Price Per Product</th>
            <th>Quantity</th>
            <th>To</th>
            <th>Delivery Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map(product => (
            <tr key={product.Cart_ID}>
              <td>{product.Cart_ID}</td>
              <td>{product.Product_ID}</td>
              <td>{product.Product_Name}</td>
              <td>{product.Seller}</td>
              <td>{product.Price}</td>
              <td>{product.Quantity}</td>
              <td>{product.To}</td>
              <td>{formatDate(product.Delivery_Date)}</td>
              <td><button className='button' onClick={()=> handleUpdateStatus(product)}>Update Status</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={pagination.currentPage === 1}>
          Previous
        </button>
        <span>{pagination.currentPage}</span>
        <button onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={pagination.currentPage === totalPages}>
          Next
        </button>
      </div>
      {cartOverlay && selectedProduct && (
        <div className="overlay">
          <div className="overlay-content">
            <h3>Delivery Details</h3>
            <p>Cart ID: <b>{selectedProduct.Cart_ID}</b></p>
            <p>Product ID: <b>{selectedProduct.Product_ID}</b></p>
            <p>Product Name: <b>{selectedProduct.Product_Name}</b></p>
            <p>Seller: <b>{selectedProduct.Seller}</b></p>
            <p>Price Per Product: <b>{selectedProduct.Price}</b></p>
            <p>Quantity: <b>{selectedProduct.Quantity}</b></p>
            <p>To: <b>{selectedProduct.To}</b></p>
            <p> Expected Delivery Date: <b>{formatDate(selectedProduct.Delivery_Date)}</b></p>
            <p>Person-In-Charge: <input type='text' name='person' value={person || ""} onChange={(e) => setPerson(e.target.value)} /></p>
            <p>Phone Number: <input type='text' name='phoneno' maxLength={10}  value={phoneno|| " "} onChange={(e) => setPhoneno(e.target.value)} /></p>
            <p>Delivered-Date: <input type="date" id="delivery" value={delivery || new Date().toISOString().split('T')[0]} min={new Date().toISOString().split('T')[0]} onChange={(e) => setDelivery(e.target.value)} required /></p>
            <p>Status: <select value={selectedStatus} onChange={handleStatusChange}>
                  <option value="">Select Status</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Call Not Picked">Call Not Picked</option>
                  <option value="Returned">Returned</option>
                </select></p>
            <p>Remarks: </p><textarea rows="4" cols="50" name='remarks' value={remarks || ""} onChange={(e) => setRemarks(e.target.value)}></textarea>
            <br/>
            <button className='button'  onClick={callApiWithOverlayDetails}>Update Status</button>
            <button className='button' onClick={() => setCartOverlay(false)}>Close</button>
          </div>
        </div>
      )}
       {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default Delivery;
