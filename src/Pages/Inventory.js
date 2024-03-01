import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Inventory.css';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    productsPerPage: 5 // Change this value according to your requirement
  });
  const [filterOptions, setFilterOptions] = useState({
    Product_ID: '',
    Product_Name: '',
    Seller: ''
  });
  const [formData, setFormData] = useState({
    Product_ID: '',
    Product_Name: '',
    Seller: '',
    Price: '',
    Quantity: '',
    To : ''
  });
  const [cartOverlay, setCartOverlay] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantityToAdd, setQuantityToAdd] = useState(null);
  const [alert, setAlert] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const[to,setTo] = useState(null);
  const[delivery,setDelivery] = useState(null);
  const [filterOverlay, setFilterOverlay] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddToCartAndInventory = async () => {
    try {
      console.log(selectedProduct.Quantity,quantityToAdd);
      if (!quantityToAdd || parseInt(quantityToAdd, 10) === 0 || parseInt(quantityToAdd, 10) > parseInt(selectedProduct.Quantity, 10) || !to) {
        setAlert('Invalid input. Please enter a valid quantity and destination.');
        setTimeout(() => {
          setAlert(null);
        }, 3000);
        return;
      } else {
        await axios.put('http://localhost:5000/delivery', {
          product: selectedProduct,
          quantityToAdd,
          to: to,
          date : delivery
        });
        console.log(selectedProduct);
        setCartOverlay(false);
        fetchProducts();
        setSuccessMessage("Product successfully added to Delivery!");
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
        setQuantityToAdd(null);
        setTo(null);
      }
    } catch (error) {
      console.error('Error adding to cart or inventory:', error);
      setErrorMessage('An error occurred while adding to cart or inventory');
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };  

  const addToCart = (product) => {
    setSelectedProduct(product);
    setCartOverlay(true);
  };

  const handleFilterChange = (e) => {
    setFilterOptions({ ...filterOptions, [e.target.name]: e.target.value });
  };

  const applyFilters = async () => {
    try {
      const response = await axios.get('http://localhost:5000/products/filter', {
        params: filterOptions
      });
      console.log(response.data);
      const mappedProducts = response.data.map((item) => ({
        Product_ID: item.Product_Id, 
        Product_Name: item.Product_Name,
        Seller: item.Seller,
        Price : item.Price,
        Quantity : item.Quantity
      }));
      setProducts(mappedProducts);
      setFilterOverlay(false);
    } catch (error) {
      console.error('Error filtering products:', error);
    }
  };


  const resetFilters = () => {
    setFilterOptions({
      Product_ID: '',
      Product_Name: '',
      Seller: ''
    });
    setProducts([]);
    setFilterOverlay(false);
  };

  const indexOfLastProduct = pagination.currentPage * pagination.productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - pagination.productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const handlePageChange = (pageNumber) => {
    setPagination({ ...pagination, currentPage: pageNumber });
  };
  useEffect(() => {
    setTotalPages(Math.ceil(products.length / pagination.productsPerPage));
  }, [products, pagination.productsPerPage]);

  const handleResetFilters = () => {
    resetFilters();
    fetchProducts();
  };

  const handleLogout = () => {
    window.location.href = '/login';
  };

  return (
    <div className="inventory-container">
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      {filterOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <h3>Filter Products</h3>
            <label>
              <br/>
              Product ID:
              <input type="text" name="Product_ID" value={filterOptions.Product_ID} onChange={handleFilterChange} />
            </label>
            <br/>
            <label>
              Product Name:
              <input type="text" name="Product_Name" value={filterOptions.Product_Name} onChange={handleFilterChange} />
            </label>
            <br/>
            <label>
              Seller:
              <input type="text" name="Seller" value={filterOptions.Seller} onChange={handleFilterChange} />
            </label>
            <br/>
            <button onClick={applyFilters}>Apply Filters</button>
            <button onClick={() => setFilterOverlay(false)}>Cancel</button>
          </div>
        </div>
      )}
      <div className="alert-container" style={{ marginTop: '5px', marginBottom: '5px' }}>
        {successMessage && <p className="alert success">{successMessage}</p>}
        {errorMessage && <p className="alert error">{errorMessage}</p>}
        {alert && <p className="alert error">{alert}</p>}
      </div>
      <h2>Inventory</h2>
      <button className='button' onClick={() => setFilterOverlay(true)}>Filter</button>
    <button className='button' onClick={handleResetFilters}>Reset Filters</button>
      {cartOverlay && selectedProduct && (
        <div className="overlay">
          <div className="overlay-content">
            <h3>Add to Cart</h3>
            <p>Product ID: {selectedProduct.Product_ID}</p>
            <p>Product Name: {selectedProduct.Product_Name}</p>
            <p>Seller: {selectedProduct.Seller}</p>
            <p>Price: {selectedProduct.Price}</p>
            <p>Quantity: {selectedProduct.Quantity}</p>
          <p><b>Enter the number you want to add</b></p>
          <input type="number" id="quantityToAdd" value={quantityToAdd || ''} onChange={(e) => setQuantityToAdd(e.target.value)} /> 
          <p><b>To</b></p>
          <input type="text" id="to" value={to || ''} onChange={(e) => setTo(e.target.value)} required />
          <p><b>Delivery By</b></p>
          <input type="date" id="delivery" value={delivery || new Date().toISOString().split('T')[0]} min={new Date().toISOString().split('T')[0]} onChange={(e) => setDelivery(e.target.value)} required />
            <br/>
            <button onClick={handleAddToCartAndInventory}>Add to Cart</button>
            <button onClick={() => setCartOverlay(false)}>Close</button>
          </div>
        </div>
      )}
      <h3>Product List</h3>
      <table>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Seller</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Add to Cart</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((Product) => (
            <tr key={Product.Product_ID}>
              <td>{Product.Product_ID}</td>
              <td>{Product.Product_Name}</td>
              <td>{Product.Seller}</td>
              <td>{Product.Price}</td>
              <td>{Product.Quantity}</td>
              <td><button className='button' onClick={() => addToCart(Product)}>Add to Cart</button></td>
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
    </div>
  );
};

export default Inventory;
