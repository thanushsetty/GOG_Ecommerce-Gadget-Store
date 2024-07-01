import React, { useState, useEffect } from "react";
import { SellerSidebar } from "./SellerSidebar";
import axios from "axios";

export const SellerReviews = ({ seller }) => {
    const [reviews, setReviews] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`https://gog-backend-t01u.onrender.com/api/seller/reviews/${seller._id}`);
                if (response.status === 200) {
                    const sellerReviews = response.data.reviewsData;
                    const sellerProducts = response.data.productsData;
                    setReviews(sellerReviews);
                    setProducts(sellerProducts);
                    console.log(sellerReviews);
                } else {
                    console.error("Failed to fetch Reviews.");
                }
            } catch (error) {
                console.error("Error while fetching reviews:", error);
            }
        };
        fetchReviews();
    }, [seller._id]);

    return (
        <div>
            <SellerSidebar activeLink="reviews" />
            <section className="orders-section">
                <div className="orders-content">
                    <h2 className="orders-heading">Reviews:</h2>
                    <br />
                    { reviews.length > 0 ? (
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th><b>Image</b></th>
                                <th><b>Code</b></th>
                                <th><b>Product Title</b></th>
                                <th><b>Review</b></th>
                                <th><b>User Rating</b></th>
                                <th><b>Product Rating</b></th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map((review) => (
                                <tr key={review._id} className="orders-row">
                                    <td>
                                        <img src={ `${products.find(product => product._id === review.product).imagePath}` } alt="Product" className="product-image" />
                                    </td>
                                    <td>{products.find(product => product._id === review.product).productCode}</td>
                                    <td>{products.find(product => product._id === review.product).title}</td>
                                    <td>{review.reviewText || "No Review"}</td>
                                    <td>{review.reviewRating}</td>
                                    <td>{products.find(product => product._id === review.product).rating}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    ) : (
                        <>
                        <h3>No Reviews Yet!</h3>
                        </>
                    ) }
                </div>
            </section>
        </div>
    );
};
