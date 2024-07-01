import React from "react";
import "../styles/BrandSection.css";
import { BrandItem } from "./BrandItem";

export const BrandSection = () => {
    const brandItems = Array.from({ length: 8 }, (_, index) => (
        <BrandItem key={index} />
    ));
    return (
        <section className="choose-brand-section">
            <div className="container">
                <div className="section-title-wrap">
                    <h3 className="section-title">Choose By Brand</h3>
                </div>
                <div className="choose-brant-item-wrap"> {brandItems} </div>
            </div>
        </section>
    );
}