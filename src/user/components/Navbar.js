import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../components/Logo";
import "../styles/user.css";

function Navbar() {
    return (
        <nav className="user-navbar">
            <Link to="/" className="navbar-brand">
                <Logo size={40} showText={true} textColor="#ffffff" />
            </Link>

            <button
                className="navbar-hamburger"
                type="button"
                aria-label="Open menu"
                onClick={() => {
                    document.body.classList.toggle('mobile-nav-open');
                }}
            >
                ☰
            </button>

            <ul className="navbar-links">
                <li>
                    <Link
                        to="/"
                        onClick={() => document.body.classList.remove('mobile-nav-open')}
                    >
                        Home
                    </Link>
                </li>
                <li>
                    <a
                        href="#features"
                        onClick={() => document.body.classList.remove('mobile-nav-open')}
                    >
                        Solutions
                    </a>
                </li>
                <li>
                    <a
                        href="#contact"
                        onClick={() => document.body.classList.remove('mobile-nav-open')}
                    >
                        Contact
                    </a>
                </li>
                <li>
                    <Link
                        to="/"
                        className="navbar-track-btn"
                        onClick={() => document.body.classList.remove('mobile-nav-open')}
                    >
                        Track Shipment
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;

