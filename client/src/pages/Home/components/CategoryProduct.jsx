import { useState, useEffect } from "react";
import favorite from "../assets/favorite.png";
import "../styles/ProductItemSmall.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar, faStarHalfAlt as halfStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export const CategoryProduct = (props) =>{
    const maxRating = 5;
    const solidStars = Math.floor(props.product.rating);
    const hasHalfStar = props.product.rating % 1 !== 0;

    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
        if (i <= solidStars) {
            stars.push(
                <FontAwesomeIcon key={ i } icon={ solidStar } className="solid-star" />
            );
        } else if (hasHalfStar && i === solidStars + 1) {
            stars.push(
                <FontAwesomeIcon key={ i } icon={ halfStar } className="half-star" />
            );
        } else {
            stars.push(
                <FontAwesomeIcon key={ i } icon={ regularStar } className="regular-star" />
            );
        }
    }


    return (
        <div className="product-item-s product-category-s">
            <div className="product-thumbnail">
                <img src={ props.product.imagePath }
                    alt="product-thumbnail"
                    className="deal-image"
                />
            </div>
            <div className="product-content">
                <div className="product-title-wrap">
                    <Link to={ `/product/${props.product._id}` } className="product-link">
                        <h3 className="product-title">{ props.product.title }</h3>
                    </Link>
                </div>
                <div className="product-rating">
                    <div className="rating-stars">
                        <p>
                            <span>{ stars }</span> ({ props.product.rating })
                        </p>
                    </div>
                </div>
                <div className="product-price">
                    <span className="text-span">INR. { props.product.price }</span>
                    <span className="text-cancel">INR. { props.product.mrp }</span>
                </div>
            </div>
        </div>
    );
}

