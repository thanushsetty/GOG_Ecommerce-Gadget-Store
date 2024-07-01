import "../styles/seller.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Cards from "./Cards";
import SalesCard from "./SalesCard";
import RevenueCard from "./RevenueCards";
import "../styles/Cards.css";

export const SellerOverview = ({ seller }) => {
  const [recentSales, setRecentSales] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
        try {
            const response = await axios.get(`https://gog-backend-t01u.onrender.com/api/seller/checkouts/${seller._id}`);
            const data = await response.data.checkouts;
            const sortedOrders = data.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
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

//   console.log(recentSales);
  return (
    <div className="cards-container">
      <Cards  sales ={recentSales}/>
      <SalesCard sales ={recentSales} />
      <RevenueCard  sales ={recentSales}/>
    </div>
  );
};
