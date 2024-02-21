import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Inventory.css';
const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    Product_ID: '',
    Product_Name: '',
    Seller: '',
    Price: '',
    Quantity: ''
  });
  const [showOverlay, setShowOverlay] = useState(false);
  const [cartOverlay, setCartOverlay] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/addproducts', formData);
      alert('Product added successfully');
      fetchProducts();
      setFormData({
        Product_ID: '',
        Product_Name: '',
        Seller: '',
        Price: '',
        Quantity: ''
      });
    } catch (error) {
      console.error('Error adding product:', error);
      alert('An error occurred while adding the product');
    }
  };

  const addToCart = (product) => {
    setSelectedProduct(product);
    setCartOverlay(true);
  };

  return (
    <div className="inventory-container" >
      <h2>Inventory</h2>
      <button onClick={() => setShowOverlay(true)}>Add Product</button>
      {showOverlay && (
        <div className="overlay">
        <div className="overlay-content">
          <h3>Add Product</h3>
          <div>
          <label>
              Product Id:
              <input type="text" name="Product_Id" value={formData.Product_Id} onChange={handleChange} required />
            </label>
            <br />
            <label>
              Product Name:
              <input type="text" name="Product_Name" value={formData.Product_Name} onChange={handleChange} required />
            </label>
            <br />
            <label>
              Seller:
              <input type="text" name="Seller" value={formData.Seller} onChange={handleChange} required />
            </label>
            <br />
            <label>
              Price:
              <input type="tel" name="Price" value={formData.Price} onChange={handleChange} required />
            </label>
            <br />
            <label>
              Quantity:
              <input type="tel" name="Quantity" value={formData.Quantity} onChange={handleChange} required />
            </label>
            <br />
            <button type="submit" onClick={handleSubmit}>Add Product</button>
            <button onClick={() => setShowOverlay(false)}>Cancel</button>
          </div>
        </div>
        </div>
      )}
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
            <p><input type="tel" id="add"></input></p>
            <button>Add</button>
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
            <th>Book</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.Product_ID}>
              <td>{product.Product_ID}</td>
              <td>{product.Product_Name}</td>
              <td>{product.Seller}</td>
              <td>{product.Price}</td>
              <td>{product.Quantity}</td>
              <td><button onClick={() => addToCart(product)}>Add to Cart</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;
