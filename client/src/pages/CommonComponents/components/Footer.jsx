import React from "react";
import "../styles/Footer.css";
import { Link } from "react-router-dom";


export const Footer = () => {
    return (
        <div className="footer">
            <div className="frame-3">
                <div className="frame-4">
                    <div className="frame-5">
                        <div className="frame-5">
                        <div className="text-wrapper-2">Subscribe</div>
                        </div>
                        <p className="text-wrapper-3">Get 10% off your first order</p>
                    </div>
                </div>
                <div className="frame-5">
                    <div className="text-wrapper-4">Support</div>
                    <div className="frame-4">
                        <p className="frame-address">IIIT Sricity, Andhra Pradesh, India.</p>
                        <div className="text-wrapper-3">gog@gmail.com</div>
                        <div className="text-wrapper-3">+91 9988776655</div>
                    </div>
                </div>
                <div className="frame-5">
                    <div className="text-wrapper-4">Account</div>
                    <div className="frame-4">
                        <div className="text-wrapper-5">My Account</div>
                        <div className="text-wrapper-3">Login / Register</div>
                        <div className="text-wrapper-3">Cart</div>
                        <div className="text-wrapper-3">Wishlist</div>
                        <div className="text-wrapper-3">Shop</div>
                    </div>
                </div>
                <div className="frame-5">
                    <div className="text-wrapper-4">Quick Link</div>
                    <div className="frame-4">
                        <Link to="/Aboutus"><div className="text-wrapper-3">About Us</div></Link>
                        <div className="text-wrapper-5">Privacy Policy</div>
                        <div className="text-wrapper-3">Terms Of Use</div>
                        <div className="text-wrapper-3">FAQ</div>
                        <Link to="/Contactus"><div className="text-wrapper-3">Contact</div></Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
