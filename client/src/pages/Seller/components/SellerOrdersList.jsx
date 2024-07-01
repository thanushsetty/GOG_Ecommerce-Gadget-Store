import React, { useState, useEffect } from "react";
import { SellerSidebar } from "./SellerSidebar";
import axios from "axios";

export const SellerOrdersList = ({ seller }) => {

    const [recentSales, setRecentSales] = useState([]);
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`https://gog-backend-t01u.onrender.com/api/seller/checkouts/${seller._id}`);
                const data = await response.data.checkouts;
                const sortedOrders = data.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                // console.log(latestOrders);
                const ordersWithUserDetails = await Promise.all(
                    sortedOrders.map(async (order) => {
                        const userResponse = await axios.get(
                            `https://gog-backend-t01u.onrender.com/api/user/users/${order.user}`
                        );
                        const userData = userResponse.data;
                        return {
                            ...order,
                            user: userData.name,
                        };
                    })
                );
                setRecentSales(ordersWithUserDetails);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div>
            <SellerSidebar activeLink="orderslist" />
            <section className="orders-section">
                <div className="orders-content">
                    <h2 className="orders-heading">Order Details:</h2>
                    <br />
                    { recentSales.length > 0 ? (
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>
                                    <b>Customer</b>
                                </th>
                                <th width="40%">
                                    <b>Item</b>
                                </th>
                                <th>
                                    <b>Quantity</b>
                                </th>
                                <th>
                                    <b>Price</b>
                                </th>
                                <th>
                                    <b>Order Placed</b>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            { recentSales.map((order) =>
                                order.items.map((item) => (
                                    <tr key={ item._id } className="orders-row">
                                        <td>{ order.user }</td>
                                        <td>{ item.title }</td>
                                        <td>{ item.qty }</td>
                                        <td>{ item.price }</td>
                                        <td>{ formatDate(order.createdAt) }</td>
                                    </tr>
                                ))
                            ) }
                        </tbody>
                    </table>
                    ) : (
                        <>
                        <h3>No Orders Yet!</h3>
                        </>
                    ) }
                </div>
            </section>
        </div>
    );
}