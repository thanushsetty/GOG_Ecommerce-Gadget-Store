// CheckoutPage.js
import React, { useState, useEffect } from "react";
import "../styles/CheckoutPage.css";
import { Header } from "../../CommonComponents/components/Header";
import { Footer } from "../../CommonComponents/components/Footer";
import axios from "axios";



import { useNavigate } from "react-router-dom";

export const CheckoutPage = ({ user }) => {

  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const navigate = useNavigate();

  const initPayment = async (data) => {
    try {
      const options = {
        key: "rzp_test_Gj1HHlsQFVyVat",
        amount: data.amount,
        currency: data.currency,
        description: "Test Transaction",
        order_id: data.id,
        handler: async (response) => {
          try {
            const verifyUrl = "https://gog-backend-t01u.onrender.com/api/payment/verify";
            const { data } = await axios.post(verifyUrl, response);
            console.log(data);
          } catch (error) {
            console.log(error);
          }
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setTimeout(async () => {
        handleCheckout();
      }, 10000);
      

      rzp.on("payment.failed", function (response) {
        console.error(response.error.description);
      });
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  };

  const handlePayment = async () => {
    try {
      console.log("Trying to initiate payment...");
      const orderUrl = "https://gog-backend-t01u.onrender.com/api/payment/orders";
      const { data } = await axios.post(orderUrl, { amount: 1.08*subtotal});
      console.log("Received order data:", data);
      initPayment(data.data);
      
    } catch (error) {
      console.error("Error in handlePayment:", error);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
  };

  // const showOrderConfirmation = () => {
  //   setOrderConfirmed(true);

  //   setTimeout(() => {
  //     setOrderConfirmed(false);
  //   }, 5000);
  // };


  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(
          `https://gog-backend-t01u.onrender.com/api/user/carts/${user._id}`
        );
        setCartItems(response.data.cartItems || []);
        calculateSubtotal(response.data.cartItems || []);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    if (user && user._id) {
      fetchCartItems();
    }
  }, [user]);
  console.log(cartItems);

  const calculateSubtotal = (items) => {
    const total = items.reduce((acc, item) => {
      const itemTotal = item.price * item.qty;
      return acc + itemTotal;
    }, 0);
    setSubtotal(total);
    const totalQty = items.reduce((acc, item) => acc + item.qty, 0);
    setTotalQuantity(totalQty);
  };


  const handleCheckout = async () => {
    try {
      const checkoutData = {
        totalQty: totalQuantity,
        totalCost: subtotal,
        items: cartItems.map((item) => ({
          _id: item._id,
          qty: item.qty,
          price: item.price,
          productId: item.productId,
          title: item.title,
          imagePath: item.imagePath,
          productCode: item.productCode,
        })),
        user: user._id,
      };
      const response = await axios.post(
        "https://gog-backend-t01u.onrender.com/api/user/checkout",
        checkoutData
      );
      console.log("Checkout successful!", response.data);
      setCartItems([]);
      setSubtotal(0);
      setTotalQuantity(0);
      navigate("/myOrders");
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <>
      <div className="checkout-container fade-in">
        <div className="checkout-form fade-in">
          <h2>Address Details</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="checkout-email checkout-li">
              <label>Email address</label>
              <input type="email" required/>
            </div>
            <div className="checkout-name checkout-li">
              <div className="checkout-fname">
                <label>First Name</label>
                <input type="text" required/>
              </div>
              <div className="checkout-lname">
                <label>Last Name</label>
                <input type="text"required/>
              </div>
            </div>
            <div className="checkout-email checkout-li">
              <label>Address</label>
              <input type="email" required/>
            </div>
            <div className="checkout-name checkout-li">
              <div className="checkout-fname">
                <label>City</label>
                <input type="text" required/>
              </div>
              <div className="checkout-lname">
                <label>State</label>
                <input type="text" required/>
              </div>
            </div>
            <div className="checkout-pin checkout-li">
              <label>Pin Code</label>
              <input type="text" required/>
            </div>
            <div className="checkout-pin checkout-li">
              <label>Phone Number</label>
              <input type="tel" required/>
            </div>
          </form>
        </div>
        <div className="checkout-summary">
          <h2>Order Summary</h2>
          <hr className="break-line" />
          <p className="checkout-items">{totalQuantity} items</p>
          <hr className="break-line" />
          <div className="checkout-products-container">
            {cartItems.map((item) => (
              <div className="checkout-products" key={item._id}>
                <div className="checkout-imagecontainer">
                  <img src={item.imagePath} alt="Product" />
                </div>
                <div className="checkout-details">
                  <p className="checkout-title">{item.title}</p>
                  <p><span className="checkout-title">Quantity: </span>{item.qty}</p>
                  <p><span className="checkout-title">Cost:</span> Rs.{item.price*item.qty}</p>
                </div>
              </div>
            ))}
          </div>
          <hr className="break-line" />
          <div className="summary-totals">
            <div className="summary-subtotals">
              <p className="summary-cost">Sub Total</p>
              <p>Rs.{subtotal}</p>
            </div>
            <div className="summary-subtotals">
              <p className="summary-cost">Gst(8%)</p>
              <p>Rs.{(0.08 * subtotal).toFixed(2)}</p>
            </div>
            <div className="summary-subtotals ttotal">
              <p className="summary-cost">Total</p>
              <p>Rs.{(1.08 * subtotal).toFixed(2)}</p>
            </div>
          </div>
          <div className="final-button">
            <button className="place-order-button" onClick={handlePayment}>
              Place Order
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};