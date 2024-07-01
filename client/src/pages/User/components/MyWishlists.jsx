import {useState} from "react";
import {UserNavLinks} from "./UserNavLinks";
// import "../styles/MyAccount.css"
import "../styles/Wishlist.css"
import {WishlistComponent} from "./WishlistComponent";

export const MyWishlists = ({user}) => {
    return (
        <div className="myAccount">
            <UserNavLinks activeLink="Wishlist"/>
            <WishlistComponent user={user}/>
        </div>
    );
}