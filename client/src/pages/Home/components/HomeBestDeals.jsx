import React from "react";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import "../styles/HomeCategorySection.css";
import { ProductItemSmall } from "./ProductItemSmall";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';

export const HomeBestDeals = (props) => {
    const user = props.user;
    // console.log(user);
    const products = props.products  ? props.products : [];
    const productItemSmall = products.slice(0, 8).map((product, index) => (
        <ProductItemSmall key={index} user={user} product={product} />
    ));
    return (    
        <section className="HomeBestDeals">
            <div className="frame">
                <div className="frame-title-wrap">
                    <h3 className="frame-title feautered-products">
                        Featured Products
                        <span className="view-all">
                            <Link to="/category">View all <FontAwesomeIcon icon={faArrowAltCircleRight}/></Link>
                        </span>
                    </h3>
                </div>
                <div className="products-wrap">
                    <div className="product-grid">{productItemSmall}</div>
                </div>
            </div>
        </section>

    );
}