import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import TrackingForm from "./TrackingForm";
import heroImg from "../../assets/hero_delivery_van_1776969785767.png";
import globalImg from "../../assets/global_logistics_cargo_1776970313351.png";
import secureImg from "../../assets/secure_package_handling_1776970338819.png";
import avatar1 from "../../assets/customer_avatar_1_1776970646643.png";
import avatar2 from "../../assets/customer_avatar_2_1776970670664.png";
import bgImage from "../../assets/9WNcS.jpg";
import "../styles/user.css";

function HomePage({ packages }) {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal');
                }
            });
        }, { threshold: 0.12 });

        document.querySelectorAll('.section-reveal').forEach(el => observer.observe(el));
    }, []);

    const openSupportChat = (event) => {
        if (event?.preventDefault) {
            event.preventDefault();
        }

        window.dispatchEvent(new Event("openSupportChat"));
        const contactSection = document.getElementById("contact");
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="home-page">
            <Navbar />

            <header className="hero-section center-hero">
                <div className="hero-bg-anim" style={{ backgroundImage: `url(${bgImage})` }}>
                    <div className="bg-circle circle-1"></div>
                    <div className="bg-circle circle-2"></div>
                </div>

                <div className="hero-content">
                    <span className="hero-badge reveal">Trusted Global Logistics</span>
                    <motion.h1
                        className="hero-title reveal"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                        <span className="headline-powering">Powering </span>
                        <span className="headline-delivery">Worldwide Delivery </span>
                        <span className="headline-enterprise">with Enterprise-Grade </span>
                        <span className="headline-precision">Precision.</span>
                    </motion.h1>
                    <p className="hero-subtitle reveal">
                        End-to-end freight management, customs clearance, and real-time tracking for businesses that move the world.
                    </p>

                    <div className="tracking-card-premium reveal">
                        <div className="tracking-card-header">
                            <span>Track Your Shipment</span>
                            <p>Use your booking reference or airway bill number to get live status updates.</p>
                        </div>
                        <TrackingForm packages={packages} />
                    </div>
                </div>
            </header>

            <section className="premium-stats section-reveal">
                <div className="stat-box">
                    <span className="stat-number">25M+</span>
                    <span className="stat-label">Shipments Managed</span>
                </div>
                <div className="stat-box">
                    <span className="stat-number">195+</span>
                    <span className="stat-label">Global Service Locations</span>
                </div>
                <div className="stat-box">
                    <span className="stat-number">99.98%</span>
                    <span className="stat-label">On-Time Performance</span>
                </div>
            </section>

            <section id="features" className="services-section">
                <span className="section-tag section-reveal">Solutions</span>
                <h2 className="section-title section-reveal">Complete logistics solutions for every shipment type</h2>

                <div className="services-grid">
                    <div className="service-card-luxury section-reveal">
                        <div className="service-image">
                            <img src={globalImg} alt="Global Shipping" loading="lazy" width="320" height="220" />
                        </div>
                        <div className="service-info">
                            <h3>Global Freight Management</h3>
                            <p>Air, ocean and land freight solutions with customs clearance, cross-border specialist support, and end-to-end visibility.</p>
                        </div>
                    </div>

                    <div className="service-card-luxury section-reveal">
                        <div className="service-image">
                            <img src={heroImg} alt="Express Delivery" />
                        </div>
                        <div className="service-info">
                            <h3>Express Delivery</h3>
                            <p>Priority handling for urgent shipments, market-driven lanes, and guaranteed pickup and delivery routing.</p>
                        </div>
                    </div>

                    <div className="service-card-luxury section-reveal">
                        <div className="service-image">
                            <img src={secureImg} alt="Secure Handling" />
                        </div>
                        <div className="service-info">
                            <h3>Secure Cargo Handling</h3>
                            <p>Specialized handling for high-value, fragile, or regulated cargo with secure chain-of-custody monitoring.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="why-section section-reveal">
                <span className="section-tag">Why Choose FluxExpress</span>
                <h2 className="section-title">A logistics partner built for modern supply chains</h2>

                <div className="why-grid">
                    <div className="why-card">
                        <h3>Global Network</h3>
                        <p>240+ service points across 6 continents backed by customs experts and dedicated local teams.</p>
                    </div>
                    <div className="why-card">
                        <h3>Dedicated Support</h3>
                        <p>24/7 account management and proactive alerts for every shipment status change.</p>
                    </div>
                    <div className="why-card">
                        <h3>Real-Time Tracking</h3>
                        <p>Live shipment visibility from origin to destination with accurate ETAs and status updates.</p>
                    </div>
                    <div className="why-card">
                        <h3>Customs & Compliance</h3>
                        <p>Full clearance services to reduce delays and keep your cargo moving across borders.</p>
                    </div>
                </div>
            </section>

            <section className="reviews-section">
                <span className="section-tag section-reveal">Customer Reviews</span>
                <h2 className="section-title section-reveal">Trusted by industry leaders</h2>

                <div className="reviews-grid">
                    <div className="review-card section-reveal">
                        <div className="stars">★★★★★</div>
                        <p className="review-text">
                            "FluxExpress provides a professional, reliable logistics platform. The tracking updates are precise and the customer service is exceptional."
                        </p>
                        <div className="customer-info">
                            <img src={avatar1} alt="Customer" className="customer-image" />
                            <div className="customer-meta">
                                <h4>Sarah Jenkins</h4>
                                <p>VP of Operations, TechFlow Corp</p>
                            </div>
                        </div>
                    </div>

                    <div className="review-card section-reveal">
                        <div className="stars">★★★★★</div>
                        <p className="review-text">
                            "Their customs clearance expertise saved us days on a high-value shipment. FluxExpress truly understands global logistics."
                        </p>
                        <div className="customer-info">
                            <img src={avatar2} alt="Customer" className="customer-image" />
                            <div className="customer-meta">
                                <h4>Marcus Reed</h4>
                                <p>Supply Chain Lead, Global Retail Inc.</p>
                            </div>
                        </div>
                    </div>

                    <div className="review-card section-reveal">
                        <div className="stars">★★★★★</div>
                        <p className="review-text">
                            "Our transit reliability improved dramatically after switching to FluxExpress. Their network is fast and consistent."
                        </p>
                        <div className="customer-info">
                            <img src={avatar1} alt="Customer" className="customer-image" />
                            <div className="customer-meta">
                                <h4>Elena Petrov</h4>
                                <p>Director of Logistics, EuroTrans Group</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="contact" className="contact-section section-reveal">
                <div className="contact-intro">
                    <span className="section-tag">Contact</span>
                    <h2 className="section-title">Get in touch with our logistics team</h2>
                    <p>Have a shipment question or need a custom logistics plan? Our global operations team is ready to help.</p>
                </div>

                <div className="contact-grid">
                    <div className="contact-card">
                        <h3>Customer Support</h3>
                        <p>support@fluxexpress.com</p>
                        <p>+1 (800) 123-4567</p>
                        <button type="button" className="contact-action-btn" onClick={openSupportChat}>
                            Chat with customer care
                        </button>
                    </div>
                    <div className="contact-card">
                        <h3>Sales & Partnerships</h3>
                        <p>sales@fluxexpress.com</p>
                        <p>+1 (800) 987-6543</p>
                    </div>
                    <div className="contact-card">
                        <h3>Headquarters</h3>
                        <p>570 Logistics Avenue<br />San Francisco, CA 94107</p>
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <div className="footer-about">
                    <h2>Flux<span>Express</span></h2>
                    <p>Leading the future of global logistics with innovation, technology, and commitment to excellence in every shipment.</p>
                </div>
                <div className="footer-col">
                    <h4>Services</h4>
                    <ul>
                        <li><a href="#features">Freight Management</a></li>
                        <li><a href="#features">Customs Clearance</a></li>
                        <li><a href="#features">Express Pickup</a></li>
                        <li><a href="#contact" onClick={openSupportChat}>Support</a></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>Company</h4>
                    <ul>
                        <li><a href="#features">About Us</a></li>
                        <li><a href="#contact" onClick={openSupportChat}>Contact</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Compliance</a></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>Support</h4>
                    <ul>
                        <li><a href="#contact" onClick={openSupportChat}>Track Shipment</a></li>
                        <li><a href="#contact" onClick={openSupportChat}>Help Center</a></li>
                        <li><a href="mailto:support@fluxexpress.com">Email Support</a></li>
                        <li><a href="#" onClick={openSupportChat}>Live Chat</a></li>
                    </ul>
                </div>
            </section>

            <footer className="footer">
                <div className="footer-bottom">
                    <p>© 2026 FluxExpress Logistics International. All rights reserved. Registered ISO 9001:2015.</p>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;
