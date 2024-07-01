import React from "react";
import "../styles/Brands.css";
import oppo from "../assets/oppo.png";
import samsung from "../assets/samsung.png";
import asus from "../assets/asus.png";

export const Brands =() =>{
    return(
        <div className="brands">
                    <div className="container-brand">
                        <div className="wrapper-brand">
                            <div className="item-brand">
                                <a href="#">
                                    <img src={oppo} alt=""/>
                                </a>
                            </div>
                            <div className="item-brand">
                                <a href="#">
                                    <img src={samsung} alt=""/>
                                </a>
                            </div>
                            <div className="item-brand">
                                <a href="#">
                                    <img src={asus} alt=""/>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
    )
}