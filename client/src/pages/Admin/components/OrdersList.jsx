import React, { useState, useEffect } from 'react';
import "../styles/adminLists.css"
import { AdminSidebar } from "./AdminSidebar";
import axios from 'axios';

export const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('https://gog-backend-t01u.onrender.com/api/admin/orders/');
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching Orders:', error);
            }
        };
        fetchOrders();
    }, []);

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
    };

    let serialNumber = 1;

    // Filter orders based on search query
    const filteredOrders = orders.filter(order =>
        order.items.some(item =>
            item.title.toLowerCase().includes(searchQuery) ||
            item.productCode.toLowerCase().includes(searchQuery)
        )
    );

    return (
        <div>
            <AdminSidebar activeLink="orderslist" />
            <section className="orders-section">
                <div className="orders-content">
                    <h2 className="orders-heading">Orders List:</h2>
                    <div className="search-bar search-margin">
                        <input
                            type="text"
                            placeholder="Search by product name or product code"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                    <br />
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th><b>S.No</b></th>
                                <th><b>Product Code</b></th>
                                <th><b>Product Image</b></th>
                                <th><b>Product Name</b></th>
                                <th><b>Quantity</b></th>
                                <th><b>Price</b></th>
                                <th><b>Order Placed</b></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders && filteredOrders.length > 0 ? (
                                filteredOrders.map((checkout, index) => (
                                    checkout.items.map((item, itemIndex) => (
                                        <tr key={itemIndex} className="orders-row">
                                            <td>{serialNumber++}</td>
                                            <td>{item.productCode}</td>
                                            <td>
                                                <img src={`${item.imagePath}`} alt="Product" className="product-image" />
                                            </td>
                                            <td>{item.title}</td>
                                            <td>{item.qty}</td>
                                            <td>{item.price}</td>
                                            <td>{formatDate(checkout.createdAt)}</td>
                                        </tr>
                                    ))
                                ))
                            ) : (
                                orders.map((checkout, index) => (
                                    checkout.items.map((item, itemIndex) => (
                                        <tr key={itemIndex} className="orders-row">
                                            <td>{serialNumber++}</td>
                                            <td>{item.productCode}</td>
                                            <td>
                                                <img src={`${item.imagePath}`} alt="Product" className="product-image" />
                                            </td>
                                            <td>{item.title}</td>
                                            <td>{item.qty}</td>
                                            <td>{item.price}</td>
                                            <td>{formatDate(checkout.createdAt)}</td>
                                        </tr>
                                    ))
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};
