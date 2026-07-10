import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../components/Logo";
import "../styles/user.css";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);

    const handleContactClick = (event) => {
        event.preventDefault();
        setMenuOpen(false);
        window.dispatchEvent(new Event("openSupportChat"));
        window.location.hash = "#contact";
    };

    return (
        <nav className="user-navbar">
            <Link to="/" className="navbar-brand" onClick={closeMenu}>
                <Logo size={40} showText={true} textColor="#ffffff" />
            </Link>

            <button
                className="navbar-hamburger"
                type="button"
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((prev) => !prev)}
            >
                ☰
            </button>

            <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
                <li>
                    <Link to="/" onClick={closeMenu}>
                        Home
                    </Link>
                </li>
                <li>
                    <a href="#features" onClick={closeMenu}>
                        Solutions
                    </a>
                </li>
                <li>
                    <a href="#contact" onClick={handleContactClick}>
                        Contact
                    </a>
                </li>
                <li>
                    <Link to="/" className="navbar-track-btn" onClick={closeMenu}>
                        Track Shipment
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;

