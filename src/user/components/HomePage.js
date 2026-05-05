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
                <div className="hero-content">
                    <span className="hero-badge reveal">Next-Gen Logistics</span>
                    <h1 className="hero-title reveal">Fast, Reliable, <span>Global</span> Logistics</h1>
                    <p className="hero-subtitle reveal">
                        Track your shipments in real-time with FluxExpress. We bridge distances with precision, speed, and absolute care for every parcel.
                    </p>
                    
                    <div className="tracking-card-premium reveal">
                        <TrackingForm packages={packages} />
                    </div>
                </div>
            </header>

            <section className="premium-stats section-reveal">
                <div className="stat-box">
                    <span className="stat-number">12M+</span>
                    <span className="stat-label">Packages Delivered</span>
                </div>
                <div className="stat-box">
                    <span className="stat-number">200+</span>
                    <span className="stat-label">Countries Active</span>
                </div>
                <div className="stat-box">
                    <span className="stat-number">99.9%</span>
                    <span className="stat-label">Success Rate</span>
                </div>
            </section>

            <section id="features" className="services-section">
                <span className="section-tag section-reveal">Our Expertise</span>
                <h2 className="section-title section-reveal">Premium Solutions for Global Trade</h2>
                
                <div className="services-grid">
                    <div className="service-card-luxury section-reveal">
                        <div className="service-image">
                            <img src={globalImg} alt="Global Shipping" />
                        </div>
                        <div className="service-info">
                            <h3>Global Cargo Logistics</h3>
                            <p>International air and sea freight with seamless customs clearance and real-time transit visibility.</p>
                        </div>
                    </div>

                    <div className="service-card-luxury section-reveal">
                        <div className="service-image">
                            <img src={heroImg} alt="Express Delivery" />
                        </div>
                        <div className="service-info">
                            <h3>Elite Express Courier</h3>
                            <p>Priority same-day and next-day delivery for urgent documents and high-value domestic shipments.</p>
                        </div>
                    </div>

                    <div className="service-card-luxury section-reveal">
                        <div className="service-image">
                            <img src={secureImg} alt="Secure Handling" />
                        </div>
                        <div className="service-info">
                            <h3>Secure & Bonded Handling</h3>
                            <p>Specialized white-glove service for fragile, high-value, and temperature-sensitive assets.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="reviews-section">
                <span className="section-tag section-reveal">Testimonials</span>
                <h2 className="section-title section-reveal">Trusted by Global Leaders</h2>
                
                <div className="reviews-grid">
                    <div className="review-card section-reveal">
                        <div className="stars">★★★★★</div>
                        <p className="review-text">
                            "FluxExpress has completely transformed our supply chain. Their real-time tracking is the most accurate we've ever used."
                        </p>
                        <div className="customer-info">
                            <img src={avatar1} alt="Customer" className="customer-image" />
                            <div className="customer-meta">
                                <h4>Sarah Jenkins</h4>
                                <p>Supply Chain Director, TechFlow</p>
                            </div>
                        </div>
                    </div>

                    <div className="review-card section-reveal">
                        <div className="stars">★★★★★</div>
                        <p className="review-text">
                            "Reliable, fast, and professional. Their customer support team actually answers the phone. Highly recommended!"
                        </p>
                        <div className="customer-info">
                            <img src={avatar2} alt="Customer" className="customer-image" />
                            <div className="customer-meta">
                                <h4>Marcus Reed</h4>
                                <p>Founder, Global Retail Inc.</p>
                            </div>
                        </div>
                    </div>

                    <div className="review-card section-reveal">
                        <div className="stars">★★★★★</div>
                        <p className="review-text">
                            "Best-in-class logistics service. We've seen a 30% reduction in delivery times since switching to FluxExpress."
                        </p>
                        <div className="customer-info">
                            <img src={avatar1} alt="Customer" className="customer-image" />
                            <div className="customer-meta">
                                <h4>Elena Petrov</h4>
                                <p>Logistics Manager, EuroTrans</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer id="contact" className="user-footer">
                <div className="footer-grid">
                    <div className="footer-about">
                        <h2>Flux<span>Express</span></h2>
                        <p>We are a global leader in logistics, providing innovative shipping solutions for businesses and individuals worldwide.</p>
                    </div>
                    <div className="footer-col">
                        <h4>Services</h4>
                        <ul>
                            <li>Express Shipping</li>
                            <li>Freight Transport</li>
                            <li>Warehousing</li>
                            <li>Last Mile Delivery</li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Company</h4>
                        <ul>
                            <li>About Us</li>
                            <li>Careers</li>
                            <li>Sustainability</li>
                            <li>Newsroom</li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Support</h4>
                        <ul>
                            <li>Tracking Help</li>
                            <li>Shipping Guide</li>
                            <li>Contact Us</li>
                            <li>Privacy Policy</li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2026 FluxExpress Logistics Group. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;
