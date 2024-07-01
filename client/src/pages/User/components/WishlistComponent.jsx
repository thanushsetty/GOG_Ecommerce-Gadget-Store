import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export const WishlistComponent = ({ user }) => {
    const navigate = useNavigate();
    const [wishlists, setWishlists] = useState([]);

    useEffect(() => {
        const fetchWishlists = async () => {
            try {
                const response = await axios.get(`https://gog-backend-t01u.onrender.com/api/user/wishlists/${user._id}`);
                setWishlists(response.data.wishlists || []);
            } catch (error) {
                console.error('Error fetching wishlists:', error);
            }
        };

        fetchWishlists();
    }, [user._id]);

    const addToCart = async (item) => {
        try {
            const response = await axios.post(`https://gog-backend-t01u.onrender.com/api/user/carts/addToCart`, {
                productId: item.productId,
                userId: user._id,
            });
            if (response.status === 200) {
                window.alert("Product added to cart successfully")
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };

    const removeFromWishlist = async (item, wishlistId) => {
        try {
            // console.log(wishlistId, item._id);
            const response = await axios.delete(`https://gog-backend-t01u.onrender.com/api/user/wishlists/${wishlistId}/removeProduct/${item._id}`);
            if (response.status === 200) {
                setWishlists(prevWishlists => {
                    const updatedWishlists = prevWishlists.map(wishlist => {
                        if (wishlist._id === item.wishlistId) {
                            const updatedItems = wishlist.items.filter(product => product._id !== item._id);
                            return { ...wishlist, items: updatedItems };
                        }
                        return wishlist;
                    });
                    return updatedWishlists;
                });
                window.alert("Product removed from wishlist successfully!");
            }
        } catch (error) {
            console.error('Error removing product from wishlist:', error);
        }
    };

    return (
        <div className="wishlist-container">
            <div className="wishlist-content">
                <h1>Wishlists</h1>
                { wishlists.length === 0 ? (
                    <p>No wishlists found</p>
                ) : (
                    <div>
                        { Array.isArray(wishlists) && wishlists.map((wishlist) => (
                            <div key={ wishlist._id } className="wishlist-item">
                                <h3>{ wishlist.name }</h3>
                                <ul className="wishlist-items">
                                    <li className="wishlist-header">
                                        <span className="headerimage" >Image</span>
                                        <span className="headertitle">Title</span>
                                        <span className="headerprice">Price</span>
                                        <span className="headeractions">Actions</span>
                                    </li>
                                    { Array.isArray(wishlist.items) && wishlist.items.map((item) => (
                                        <li key={item.productId} className="wishlist-product">
                                            <img src={item.imagePath} alt={item.title} className="wishlist-image" />
                                            <span className="wishlist-title">{item.title}</span>
                                            <span className="wishlist-price">{item.price}</span>
                                            <div className="wishlist-actions">
                                                <button onClick={() => addToCart(item)}>Add to Cart</button>
                                                <button onClick={() => removeFromWishlist(item, wishlist._id)}>Remove</button>
                                            </div>
                                        </li>
                                    )) }
                                </ul>
                            </div>
                        )) }
                    </div>
                ) }
            </div>
        </div>
    );
}