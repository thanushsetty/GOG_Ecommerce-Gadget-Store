import "../styles/seller.css";
import { SellerSidebar } from "./SellerSidebar";
import { SellerOverview } from "./SellerOverview";
import { CustomerReview } from "./CustomerReview";
import { useState, useEffect } from "react";
import axios from "axios";

export const SellerDashboard = ({ seller }) => {
  useEffect(() => {
    localStorage.removeItem('loggedInUser');
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const [recentSales, setRecentSales] = useState([]);
  const [sellerRating, setSellerRating] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`https://gog-backend-t01u.onrender.com/api/seller/checkouts/${seller._id}`);
        const data = await response.data.checkouts;
        const sortedOrders = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        const latestOrders = sortedOrders.slice(0, 3);
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

  useEffect(() => {
    const fetchSellerRating = async () => {
      try {
        const response = await axios.get(`https://gog-backend-t01u.onrender.com/api/seller/sellerRating/${seller._id}`);
        if (response.status === 200) {
          setSellerRating(response.data.sellerRating);
        }
      } catch (error) {
        console.error('Error fetching seller rating:', error);
        return null;
      }
    };
    fetchSellerRating()
  }, [seller._id]);

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`https://gog-backend-t01u.onrender.com/api/seller/reviews/${seller._id}`);
        if (response.status === 200) {
          const sellerReviews = response.data.reviewsData;
          setReviews(sellerReviews);
          // console.log(sellerReviews);
        } else {
          console.error("Failed to fetch Reviews.");
        }
      } catch (error) {
        console.error("Error while fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [seller._id]);


  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    console(isSidebarOpen);
  };
  return (
    <div>
      <SellerSidebar
        activeLink="sellerDashboard"
        toggleSidebar={ toggleSidebar }
        achieve={ isSidebarOpen }
      />
      <section className="seller-section">
        <div className="sidebar-button">
          <span className="dashboard">Dashboard</span><br/>
          <span className="dashboard sellerrating"><>Seller Rating: ({ sellerRating })</></span>
        </div>
        <div className="home-content">
          <SellerOverview seller={ seller } sellerReviews={ reviews }/>
        </div>
        <div className="seller-dashboard-bottom">
          <div className="sellers-orders-content">
            <h2 className="orders-heading">Recent Sales</h2>
            {/* { recentSales.length > 0 ? ( */}
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
                  { recentSales.map((order) =>
                    order.items.map((item) => (
                      <tr key={ item._id } className="orders-row">
                        <td>{ order.user }</td>
                        <td width="40%">{ item.title }</td>
                        <td>{ item.qty }</td>
                        <td>{ item.price }</td>
                        <td>{ formatDate(order.createdAt) }</td>
                      </tr>
                    ))
                  ) }
                </tbody>
              </table>
            {/* // ) : (
            //   <h3>No Orders Yet!</h3>
            // ) } */}
          </div>
          <div className="customer-reviews">
            <CustomerReview seller={ seller } sellerReviews={ reviews } />
          </div>
        </div>
      </section>
    </div>
  );
};
