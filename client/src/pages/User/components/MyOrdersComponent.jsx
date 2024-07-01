import { Header } from "../../CommonComponents/components/Header";
import "../styles/Cart.css";
import { useState, useEffect } from "react";
import axios from "axios";

export const MyOrdersComponent = ({ user }) => {
  const [checkoutItems, setCheckoutItems] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("https://gog-backend-t01u.onrender.com/api/user/checkouts");
        const data = await response.data.checkouts;
        const userCheckoutItems = data.filter(item => item.user === user._id);
        userCheckoutItems.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
        setCheckoutItems(userCheckoutItems);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, [user._id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear().toString().slice(2);
    return `${day}/${month}/${year}`;
  };
  
  
  return (
    <>
      <div className="myorders-container">
        <h1 className="cart-head-title">My Orders</h1>
        <div className="cart">
        {checkoutItems.length === 0 ? (
          <p className="nullmessage">No Orders Yet</p>
        ) : (
          <>
            <table className="cart-table">
              <thead>
                <tr>
                  <th className="cart-image-column">Product Image</th>
                  <th className="cart-title-column">Title</th>
                  <th className="cart-price-column">Price</th>
                  <th className="cart-qty-column">Quantity</th>
                  <th className="cart-qty-column">Order Placed</th>
                </tr>
              </thead>
              <tbody>
              {checkoutItems.map((checkout, index) => (
                    checkout.items.map((item, itemIndex) => (
                      <tr key={itemIndex}>
                        <td>
                          <img
                            src={item.imagePath}
                            alt={item.title}
                            className="cart-item-image"
                          />
                        </td>
                        <td className="cart-title">{item.title}</td>
                        <td className="cart-price">Rs.{item.price}</td>
                        <td className="cart-qty">{item.qty}</td>
                        <td className="cart-qty">{formatDate(checkout.createdAt)}</td>
                      </tr>
                    ))
                  ))}
              </tbody>
            </table>
          </>
        )}
      </div>
      </div>
    </>
  );
};
