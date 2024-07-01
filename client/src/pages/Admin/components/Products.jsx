import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { deleteProduct } from '../store/actions/productActions';
import { AdminSidebar } from "./AdminSidebar";
import "../styles/adminLists.css";
import axios from 'axios';

export const Products = () => {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('https://gog-backend-t01u.onrender.com/api/user/products');
                setProducts(response.data.products);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchProducts();
    }, []);

    const [filteredProducts, setFilteredProducts] = useState(products);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = products.filter(product =>
            product.title.toLowerCase().includes(query) ||
            product.productCode.toLowerCase().includes(query) ||
            product.brand.toLowerCase().includes(query)
        );
        setFilteredProducts(filtered);
    };

    let serialNumber = 1;

    return (
        <div>
            <AdminSidebar activeLink="productslist" />
            <section className="orders-section">
                <div className="orders-content marginn">
                    <h2 className="orders-heading">Product Details:</h2>
                    <div className="search-bar search-margin">
                        <input
                            type="text"
                            placeholder="Search by product name, code, or brand"
                            value={ searchQuery }
                            onChange={ handleSearch }
                        />
                    </div>
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th><b>S.No</b></th>
                                <th><b>Product Image</b></th>
                                <th><b>Product Code</b></th>
                                <th><b>Product Name</b></th>
                                <th><b>Brand</b></th>
                                <th><b>Sold</b></th>
                                <th><b>Available</b></th>
                                <th><b>MRP</b></th>
                                <th><b>Current Price</b></th>
                                {/* <th><b>Action</b></th> */}
                            </tr>
                        </thead>
                        <tbody>
                            { filteredProducts && filteredProducts.length > 0 ? filteredProducts.map((product) => (
                                <tr key={ product._id } className="orders-row">
                                <td>{serialNumber++}</td>
                                    <td>
                                        <img src={ `${product.imagePath}` } alt="Product" className="product-image" />
                                    </td>
                                    <td>{ product.productCode }</td>
                                    <td>{ product.title }</td>
                                    <td>{ product.brand }</td>
                                    <td>{ product.sold }</td>
                                    <td>{ product.stock }</td>
                                    <td>{ product.mrp }</td>
                                    <td>{ product.price }</td>
                                    {/* <td>
                                        <a href={ `/admin/deleteProduct/${product._id}` }>
                                            <button className="delete-button" type="submit">Delete</button>
                                        </a>
                                    </td> */}
                                </tr>
                            )) : products.map((product) => (
                                <tr key={ product._id } className="orders-row">
                                    <td>{serialNumber++}</td>
                                    <td>
                                        <img src={ `${product.imagePath}` } alt="Product" className="product-image" />
                                    </td>
                                    <td>{ product.productCode }</td>
                                    <td>{ product.title }</td>
                                    <td>{ product.brand }</td>
                                    <td>{ product.sold }</td>
                                    <td>{ product.stock }</td>
                                    <td>{ product.mrp }</td>
                                    <td>{ product.price }</td>
                                    {/* <td>
                                        <a href={ `/admin/deleteProduct/${product._id}` }>
                                            <button className="delete-button" type="submit">Delete</button>
                                        </a>
                                    </td> */}
                                </tr>
                            )) }
                        </tbody>

                    </table>
                </div>
            </section>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        products: state.products.products,
        // other mapped state properties
    };
};

export default connect(mapStateToProps, { deleteProduct })(Products);
