import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.sass";
import logo from "../../assets/logo.png";

const Navbar = () => {
    return (
        <div className="navbar-container">
            <div className="navbar">
                <img src={logo} className="navbar-logo" alt="logo" />
                <Link to="/post" className="navbar-link">
                    <button className="navbar-button">Post a job</button>
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
