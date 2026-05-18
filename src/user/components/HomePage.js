import React, { useEffect } from "react";
import Navbar from "./Navbar";
import TrackingForm from "./TrackingForm";
import heroImg from "../../assets/hero_delivery_van_1776969785767.png";
import globalImg from "../../assets/global_logistics_cargo_1776970313351.png";
import secureImg from "../../assets/secure_package_handling_1776970338819.png";
import avatar1 from "../../assets/customer_avatar_1_1776970646643.png";
import avatar2 from "../../assets/customer_avatar_2_1776970670664.png";
import "../styles/user.css";

function HomePage({ packages }) {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.section-reveal').forEach(el => observer.observe(el));
    }, []);

    return (
        <div className="home-page">
            <Navbar />
            
            <header className="hero-section center-hero">
                {/* Hero Background Animation Elements */}
                <div className="hero-bg-anim">
                    <div className="bg-circle circle-1"></div>
                    <div className="bg-circle circle-2"></div>
                </div>

                <div className="hero-content">
                    <span className="hero-badge reveal">Global Logistics Excellence</span>
                    <h1 className="hero-title reveal">Reliable. Precise. <span>Global.</span></h1>
                    <p className="hero-subtitle reveal">
                        Empowering global commerce with state-of-the-art logistics solutions. Track your assets across continents with millisecond precision and absolute transparency.
                    </p>
                    
                    <div className="tracking-card-premium reveal">
                        <TrackingForm packages={packages} />
                    </div>
                </div>
            </header>

            <section className="premium-stats section-reveal">
                <div className="stat-box">
                    <span className="stat-number">25M+</span>
                    <span className="stat-label">Units Delivered</span>
                </div>
                <div className="stat-box">
                    <span className="stat-number">195+</span>
                    <span className="stat-label">Nations Served</span>
                </div>
                <div className="stat-box">
                    <span className="stat-number">99.98%</span>
                    <span className="stat-label">On-Time Arrival</span>
                </div>
            </section>

            <section id="features" className="services-section">
                <span className="section-tag section-reveal">Our Core Capabilities</span>
                <h2 className="section-title section-reveal">Supply Chain Solutions for Modern Enterprise</h2>
                
                <div className="services-grid">
                    <div className="service-card-luxury section-reveal">
                        <div className="service-image">
                            <img src={globalImg} alt="Global Shipping" />
                        </div>
                        <div className="service-info">
                            <h3>International Freight</h3>
                            <p>Seamless air and maritime cargo solutions with integrated customs brokerage and last-mile connectivity.</p>
                        </div>
                    </div>

                    <div className="service-card-luxury section-reveal">
                        <div className="service-image">
                            <img src={heroImg} alt="Express Delivery" />
                        </div>
                        <div className="service-info">
                            <h3>Priority Express</h3>
                            <p>Mission-critical delivery services for high-priority documents and assets, ensuring same-day global transit.</p>
                        </div>
                    </div>

                    <div className="service-card-luxury section-reveal">
                        <div className="service-image">
                            <img src={secureImg} alt="Secure Handling" />
                        </div>
                        <div className="service-info">
                            <h3>Asset Protection</h3>
                            <p>Specialized handling for sensitive, fragile, or high-value inventory with real-time environmental monitoring.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="reviews-section">
                <span className="section-tag section-reveal">Global Trust</span>
                <h2 className="section-title section-reveal">Preferred by Industry Leaders</h2>
                
                <div className="reviews-grid">
                    <div className="review-card section-reveal">
                        <div className="stars">★★★★★</div>
                        <p className="review-text">
                            "FluxExpress has fundamentally optimized our distribution network. Their transparency and reliability are unmatched in the sector."
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
                            "The accuracy of their tracking system and the responsiveness of their support team make them our primary logistics partner."
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
                            "Transitioning to FluxExpress reduced our transit delays by 40%. They truly understand the demands of global trade."
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

            <footer id="contact" className="user-footer">
                <div className="footer-grid">
                    <div className="footer-about">
                        <h2>Flux<span>Express</span></h2>
                        <p>Leading the future of global logistics with innovation, technology, and a commitment to excellence in every shipment.</p>
                    </div>
                    <div className="footer-col">
                        <h4>Solutions</h4>
                        <ul>
                            <li><a href="#">Express Delivery</a></li>
                            <li><a href="#">Freight Management</a></li>
                            <li><a href="#">Smart Warehousing</a></li>
                            <li><a href="#">E-commerce Logistics</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Corporate</h4>
                        <ul>
                            <li><a href="#">About FluxExpress</a></li>
                            <li><a href="#">Global Network</a></li>
                            <li><a href="#">Sustainability</a></li>
                            <li><a href="#">Investor Relations</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Support</h4>
                        <ul>
                            <li><a href="#">Track a Shipment</a></li>
                            <li><a href="#">Service Guide</a></li>
                            <li><a href="#">Contact Support</a></li>
                            <li><a href="#">Developer API</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2026 FluxExpress Logistics International. All rights reserved. Registered ISO 9001:2015.</p>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;
