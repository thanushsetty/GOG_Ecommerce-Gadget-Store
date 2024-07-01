// import React from "react";
import "../styles/MyAccount.css";

export const UserNavLinks = ({ activeLink }) => {

    const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
    };
    return (
        <div className="sidebar">
            <a href="/">
                <div className="logo-details">
                    <i className='bx bxs-home-smile'></i>
                    <span className="logo_name">GOG</span>
                </div>
            </a>
            <ul className="nav-links">
                <li>
                    <a href="/myAccount"
                    className={activeLink === "MyProfile" ? "active" : ""}
                    >
                        <i className='bx bx-user-circle'></i>
                        <span className="links_name">My Profile</span>
                    </a>
                </li>
                <li>
                    <a href="/editProfile"
                    className={activeLink === "EditProfile" ? "active" : ""}
                    >
                        <i className='bx bx-box'></i>
                        <span className="links_name">Edit Profile</span>
                    </a>
                </li>
                <li>
                    <a href="/myOrders"
                    className={activeLink === "MyOrders" ? "active" : ""}
                    >
                        <i className='bx bx-list-ul'></i>
                        <span className="links_name">My Orders</span>
                    </a>
                </li>
                <li>
                    <a href="/wishlist" className={activeLink === "Wishlist" ? "active" : ""}>
                        <i className='bx bx-book-alt'></i>
                        <span className="links_name">Favourites</span>
                    </a>
                </li>
                <li className="log_out">
                    <a href="/" onClick={handleLogout}>
                        <i className='bx bx-log-out'></i>
                        <span className="links_name">Log out</span>
                    </a>
                </li>
            </ul>
        </div>
    );
}