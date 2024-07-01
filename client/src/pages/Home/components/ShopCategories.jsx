import React from "react";
import "../styles/ShopCategories.css";

export const ShopCategories = () => {
    return (
        <section className="shop-category">
            <div className="frame">
                <div className="frame-title">
                    <h3>Shop Our Top Categories</h3>
                </div>
                <div className="category-container">
                    <div className="category-card">
                        <img src="https://uploads-ssl.webflow.com/63e857eaeaf853471d5335ff/63e8c4e570738029a725e686_Furniture-min.png"
                            alt="category img"
                            className="category-image"
                        />
                        <h3 className="category-title">Furniture</h3>
                    </div>
                    <div className="category-card">
                        <img src="https://uploads-ssl.webflow.com/63e857eaeaf853471d5335ff/63e8c4e71eb4ad6d07e7568f_travel-min.png"
                            alt="category img"
                            className="category-image"
                        />
                        <h3 className="category-title">Travel</h3>
                    </div>
                    <div className="category-card">
                        <img src="https://uploads-ssl.webflow.com/63e857eaeaf853471d5335ff/63e8c4e52d6553668075697e_hand%20bag-min.png"
                            alt="category img"
                            className="category-image"
                        />
                        <h3 className="category-title">Hand Bag</h3>
                    </div>
                    <div className="category-card">
                        <img src="https://uploads-ssl.webflow.com/63e857eaeaf853471d5335ff/63e8c4e460afc22b7ea53520_books-min.png"
                            alt="category img"
                            className="category-image"
                        />
                        <h3 className="category-title">Books</h3>
                    </div>
                    <div className="category-card">
                        <img src="https://uploads-ssl.webflow.com/63e857eaeaf853471d5335ff/63e8c4e754ac2e32897cb53b_tech-min.png"
                            alt="category img"
                            className="category-image"
                        />
                        <h3 className="category-title">Tech</h3>
                    </div>
                    <div className="category-card">
                        <img src="https://uploads-ssl.webflow.com/63e857eaeaf853471d5335ff/63e8c4e64b769118272f244f_sneakers-min.png"
                            alt="category img"
                            className="category-image"
                        />
                        <h3 className="category-title">Sneakers</h3>
                    </div>
                </div>
            </div>
        </section>
    );
}