// import React from "react";
import {UserNavLinks} from "./UserNavLinks";
import {EditProfileComponent} from "./EditProfileComponent";
import "../styles/MyAccount.css"

export const EditProfile = ({user}) => {
    return (
        <div className="myAccount">
            <UserNavLinks activeLink="EditProfile"/>
            <EditProfileComponent user={user}/>
        </div>
    );
}