// import React from "react";
import "../styles/HomeCategorySection.css";
import { ProductItemSmall } from "./ProductItemSmall";

export const HomeCategorySection = (props) => {
    const products = props.products && props.products.products ? props.products.products : [];
    const productItemSmall = Array.from({ length: products.length}, (_, index) => (
        <ProductItemSmall key={index} title={products[index].title} imagePath={products[index].imagePath}/>
    ));
    return (
        <section className="category-section">
            <div className="frame">
                <div className="section-title-wrap"><h3 className="section-title">Categories</h3></div>
                <div className="products-container">
                    <div className="category-options">
                        <div className="button-wrap">
                            <div className="secondary-button">
                                <div className="button-content">
                                    Mobiles
                                </div>
                            </div>
                        </div>
                        <div className="button-wrap">
                            <div className="secondary-button">
                                <div className="button-content">
                                    Laptops
                                </div>
                            </div>
                        </div>
                        <div className="button-wrap">
                            <div className="secondary-button">
                                <div className="button-content">
                                    Home Devices
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="products-wrap">
                        <div className="product-grid">{productItemSmall}</div>
                    </div>
                </div>
            </div>
        </section>
    );
}