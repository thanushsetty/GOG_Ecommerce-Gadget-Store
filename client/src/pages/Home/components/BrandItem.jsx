// import React from "react";
import "../styles/BrandItem.css";

export const BrandItem = () => {
    return (
        <div className="brand-single-item">
            <div className="brand-thumbnail">
                <img
                    src="https://uploads-ssl.webflow.com/63e857eaeaf853471d5335ff/63e8c4e560afc2c49da53521_brand%20(3)-min.png"
                    alt="brand"
                    className="brand-image"
                />
            </div>
            <div className="brand-content">
                <h3 className="brand-title">Staples</h3>
                <div className="delivery-time">Delivery within 24 hours</div>
            </div>
        </div>
    );
}