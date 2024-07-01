import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
export const CartComponent = ({ user }) => {
    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axios.get(`https://gog-backend-t01u.onrender.com/api/user/carts/${user._id}`);
                setCartItems(response.data.cartItems || []);
                calculateSubtotal(response.data.cartItems || []);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        if (user && user._id) {
            fetchCartItems();
        }
    }, [user]);

    const deleteFromCart = async (cartItemId) => {
        try {
            await axios.delete(`https://gog-backend-t01u.onrender.com/api/user/carts/${user._id}/deleteItem/${cartItemId}`);
            setCartItems(cartItems.filter(cartItem => cartItem._id !== cartItemId));
        } catch (error) {
            console.error('Error deleting Cart Item:', error);
        }
    };

    const calculateSubtotal = (items) => {
        const total = items.reduce((acc, item) => {
            const itemTotal = item.price * item.qty;
            return acc + itemTotal;
        }, 0);
        setSubtotal(total);
        const totalQty = items.reduce((acc, item) => acc + item.qty, 0);
        setTotalQuantity(totalQty);
    };

    return (
        <div className="cart-container">
            <h1 className="cart-head-title">Cart</h1>
            <div className="cart">
                {cartItems.length === 0 ? (
                    <p className="nullmessage">No items in cart</p>
                ) : (
                    <>
                        <table className="cart-table">
                            <thead>
                                <tr>
                                    <th className="cart-image-column">Image</th>
                                    <th className="cart-title-column">Title</th>
                                    <th className="cart-price-column">Price</th>
                                    <th className="cart-qty-column">Quantity</th>
                                    <th className="cart-qty-column">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <img src={item.imagePath} alt={item.title} className="cart-item-image" />
                                        </td>
                                        <td className="cart-title">{item.title}</td>
                                        <td className="cart-price">Rs.{item.price}</td>
                                        <td className="cart-qty">{item.qty}</td>
                                        <td>
                                            <button className="delete-button" onClick={() => deleteFromCart(item._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="cart-summary">
                            <div className="summary-details">
                                <p className="subtotal">Subtotal: Rs.{subtotal}</p>
                                <p className="total-quantity">Total Quantity: {totalQuantity}</p>
                            </div>
                            <Link to="/checkout"><button className="checkout-button">Checkout</button></Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
