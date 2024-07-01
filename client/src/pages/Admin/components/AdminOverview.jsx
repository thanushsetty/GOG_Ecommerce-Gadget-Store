import "../styles/admin.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Cards from "./Cards";
import SalesCard from "./SalesCard";
import RevenueCard from "./RevenueCards";

export const AdminOverview = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://gog-backend-t01u.onrender.com/api/user/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("https://gog-backend-t01u.onrender.com/api/user/checkouts");
        const data = await response.data.checkouts;
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);
  
  return (
    <div className="cards-container">
      <Cards users={users}/>
      <SalesCard orders = {orders}/>
      <RevenueCard  orders={orders}/>
    </div>
  );
};
