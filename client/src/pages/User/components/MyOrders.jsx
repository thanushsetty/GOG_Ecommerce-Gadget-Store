import { Header } from "../../CommonComponents/components/Header";
import "../styles/Cart.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { MyOrdersComponent } from "./MyOrdersComponent";
import { UserNavLinks } from "./UserNavLinks";

export const MyOrders = ({ user }) => {
  return (
    <div className="myAccount">
      <div className="back-drop"></div>
      <UserNavLinks activeLink="MyOrders" />
      <MyOrdersComponent user={user} />
    </div>
  );
};
