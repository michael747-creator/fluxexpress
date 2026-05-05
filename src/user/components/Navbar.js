import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../components/Logo";
import "../styles/user.css";

function Navbar() {
    return (
        <nav className="user-navbar">
            <Link to="/" className="navbar-brand">
                <Logo size={42} showText={true} />
            </Link>
            <ul className="navbar-links">
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <a href="#features">Services</a>
                </li>
                <li>
                    <a href="#contact">Contact</a>
                </li>
                <li>
                    <Link to="/" className="navbar-track-btn">
                        Track Package
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
