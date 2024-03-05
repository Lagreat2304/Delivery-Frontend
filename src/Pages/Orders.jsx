import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const Navigate = useNavigate();
  const[logout,setLogout] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('https://delivery-backend-1qwx.onrender.com/getorders');
      const formattedOrders = response.data.map(order => ({
        ...order,
        Expected_Delivery_Date: formatDate(order.Expected_Delivery_Date),
        Actual_Delivery_Date: formatDate(order.Actual_Delivery_Date)
      }));
      setOrders(formattedOrders);
      setFilteredOrders(formattedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error('Invalid date string:', dateString);
      return 'Invalid Date';
    }
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month < 10 ? '0' + month : month}-${year}`;
  };

  const generateInvoice = order => {
    let invoiceContent = '<div style="text-align: center; margin-top: 50px;"><h2>Invoice Details</h2></div>';
    invoiceContent += '<table style="border-collapse: collapse; width: 100%;">';
    Object.entries(order).forEach(([key, value]) => {
      invoiceContent += `
        <tr>
          <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight: bold;">${key}</td>
          <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${value}</td>
        </tr>
      `;
    });
    invoiceContent += '</table>';
    return invoiceContent;
  };

  const downloadInvoice = order => {
    const invoiceContent = generateInvoice(order);
    if (!invoiceContent) {
      console.error('Error generating invoice: Order is undefined');
      return;
    }
    const invoiceWindow = window.open('', '_blank');
    invoiceWindow.document.body.innerHTML = invoiceContent;
    invoiceWindow.print();
  };

  const handleFilterChange = event => {
    setStatusFilter(event.target.value);
    if (event.target.value === '') {
      setFilteredOrders(orders);
    } else {
      // Filter logic moved to backend
      fetchFilteredOrders(event.target.value);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('orders');
    setLogout(true);
  }

  React.useEffect(() => { if (!localStorage.getItem('orders'))  Navigate('/login'); },[logout]);
  const fetchFilteredOrders = async status => {
    try {
      const response = await axios.get(`https://delivery-backend-1qwx.onrender.com/filteredorders?status=${status}`);
      const formattedOrders = response.data.map(order => ({
        ...order,
        Expected_Delivery_Date: formatDate(order.Expected_Delivery_Date),
        Actual_Delivery_Date: formatDate(order.Actual_Delivery_Date)
      }));
      setFilteredOrders(formattedOrders);
    } catch (error) {
      console.error('Error fetching filtered orders:', error);
    }
  };

  const resetFilter = () => {
    setStatusFilter('');
    setFilteredOrders(orders);
  };

  const buttonStyle = {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    marginRight: '10px'
  };

  return (
    <div className="table-container" style={{marginLeft: '200px'}}>
      <button style={buttonStyle} onClick={handleLogout}>
        Back to Delivery Page
      </button>
      <h2>Orders</h2>
      <div style={{ marginBottom: '20px' }}>
      <label htmlFor="statusFilter" style={{ marginRight: '10px' }}>Filter by Status:</label>
      <select id="statusFilter" value={statusFilter} onChange={handleFilterChange} style={{ marginRight: '10px' }}>
        <option value="">All</option>
        <option value="Delivered">Delivered</option>
        <option value="Call Not Picked">Call Not Picked</option>
        <option value="Returned">Returned</option>
      </select>
      <button style={buttonStyle} onClick={resetFilter}>Reset Filter</button>
    </div>
      <table>
        <thead>
          <tr>
            <th>Cart ID</th>
            <th>Product Name</th>
            <th>Seller</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Delivery Date</th>
            <th>Actual Delivery Date</th>
            <th>Person</th>
            <th>PhoneNo</th>
            <th>Status</th>
            <th>Remarks</th>
            <th>Invoice</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <tr key={order.Cart_ID}>
              <td>{order.Cart_ID}</td>
              <td>{order.Product_Name}</td>
              <td>{order.Seller}</td>
              <td>{order.Quantity}</td>
              <td>{order.Price}</td>
              <td>{order.Expected_Delivery_Date}</td>
              <td>{order.Actual_Delivery_Date}</td>
              <td>{order.Person}</td>
              <td>{order.PhoneNo}</td>
              <td>{order.Status}</td>
              <td>{order.Remarks}</td>
              <td>
                <button
                  style={{ backgroundColor: '#FF6666', color: 'white', cursor: 'pointer' }}
                  onClick={() => downloadInvoice(order)}
                >
                  Generate Invoice
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
