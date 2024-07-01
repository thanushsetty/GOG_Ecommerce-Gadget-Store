import "../styles/admin.css";
import { AdminSidebar } from "./AdminSidebar";
import { AdminOverview } from "./AdminOverview";
import { useState, useEffect } from "react";
import axios from "axios";

export const AdminDashboard = () => {
  useEffect(() => {
    localStorage.removeItem('loggedInSeller');
  }, []);
  
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const [recentSales, setRecentSales] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("https://gog-backend-t01u.onrender.com/api/user/checkouts");
        const data = await response.data.checkouts;
        const sortedOrders = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        const latestOrders = sortedOrders.slice(0, 5);
        const ordersWithUserDetails = await Promise.all(
          latestOrders.map(async (order) => {
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
      <AdminSidebar activeLink="adminDashboard" />
      <section className="seller-section">
        <div className="sidebar-button">
          <span className="dashboard">Dashboard</span>
        </div>
        <div className="home-content">
          <AdminOverview />
        </div>
        <div className="seller-dashboard-bottom">
          <div className="sellers-orders-content">
            <h2 className="orders-heading">Recent Sales</h2>
            <table className="sellers-orders-table">
              <thead className="seller-thead">
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
              <tbody className="seller-tbody">
                {recentSales.map((order) =>
                  order.items.map((item) => (
                    <tr key={item._id} className="orders-row">
                      <td>{order.user}</td>
                      <td width="40%">{item.title}</td>
                      <td>{item.qty}</td>
                      <td>{item.price}</td>
                      <td>{formatDate(order.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
