import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { SellerSidebar } from "./SellerSidebar";
import axios from "axios";

export const SellerProducts = ({ seller }) => {
    const [productData, setProductData] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // console.log(seller._id);
                const response = await axios.get(`https://gog-backend-t01u.onrender.com/api/seller/products/${seller._id}`);
                if (response.status === 200) {
                    const sellerProducts = response.data.products;
                    setProductData(sellerProducts);
                } else {
                    console.error("Failed to fetch products.");
                }
            } catch (error) {
                console.error("Error while fetching products:", error);
            }
        };
        fetchProducts();
    }, []);

    const deleteProduct = async (productId) => {
        try {
            const response = await axios.delete(`https://gog-backend-t01u.onrender.com/api/seller/deleteProduct/${productId}`);
            window.alert(response.data.product);
            setProductData(productData.filter(product => product._id !== productId));
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    return (
        <div>
            <SellerSidebar activeLink="productslist" />
            <section className="orders-section">
                <div className="orders-content marginn">
                    <h2 className="orders-heading">Product Details:</h2>
                    <br />
                    { productData.length > 0 ? (
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th><b>Product Image</b></th>
                                    <th><b>Product Code</b></th>
                                    <th><b>Product Name</b></th>
                                    <th><b>Brand</b></th>
                                    <th><b>Sold</b></th>
                                    <th><b>Available</b></th>
                                    <th><b>MRP</b></th>
                                    <th><b>Current Price</b></th>
                                    <th><b>Action</b></th>
                                </tr>
                            </thead>
                            <tbody>
                                { productData.map((product) => (
                                    <tr key={ product._id } className="orders-row">
                                        <td>
                                            <img src={ `${product.imagePath}` } alt="Product" className="product-image" />
                                        </td>
                                        <td>{ product.productCode }</td>
                                        <td>{product.title}</td>
                                        <td>{ product.brand }</td>
                                        <td>{ product.sold }</td>
                                        <td>{ product.stock }</td>
                                        <td>{ product.mrp }</td>
                                        <td>{ product.price }</td>
                                        <td>
                                            <button className="delete-button" onClick={ () => deleteProduct(product._id) }>Delete</button>
                                        </td>
                                    </tr>
                                )) }
                            </tbody>
                        </table>
                    ) : (
                        <>
                        <h3>No products added</h3>
                        <Link to="/seller/addproduct"><button className="delete-button" >Add Products</button></Link>
                        </>
                    ) }
                </div>
            </section>
        </div>
    );
};
