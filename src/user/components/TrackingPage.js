import React from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "./Navbar";
import TrackingTimeline from "./TrackingTimeline";
import { getPackageByTrackingCode, statusLabels, statusColors } from "../../data/packages";
import "../styles/user.css";

function TrackingPage({ packages }) {
    const { code } = useParams();
    const pkg = packages.find(
        (p) => p.trackingCode.toLowerCase() === code.toLowerCase()
    );

    if (!pkg) {
        return (
            <div className="tracking-page">
                <Navbar />
                <div className="tracking-content" style={{ marginTop: '4rem' }}>
                    <div className="not-found-card">
                        <div className="not-found-icon">🕵️‍♂️</div>
                        <h2>No Package Found</h2>
                        <p>We couldn't find any package with tracking code: <strong>{code}</strong>. Please check the code and try again.</p>
                        <Link to="/" className="back-btn">← Back to Tracking</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="tracking-page">
            <Navbar />
            <div className="tracking-page-header">
                <h1>Track Your Shipment</h1>
                <p>Real-time updates on your package status and location.</p>
                <span className="tracking-code-badge">{pkg.trackingCode}</span>
            </div>

            <div className="tracking-content">
                <div className="package-info-card">
                    <h2>📦 Package Details</h2>
                    <div className="package-info-grid">
                        <div className="info-item">
                            <label>Status</label>
                            <span 
                                className="status-badge"
                                style={{ 
                                    backgroundColor: statusColors[pkg.currentStatus] + '20',
                                    color: statusColors[pkg.currentStatus],
                                    border: `1px solid ${statusColors[pkg.currentStatus]}50`
                                }}
                            >
                                {statusLabels[pkg.currentStatus]}
                            </span>
                        </div>
                        <div className="info-item">
                            <label>Description</label>
                            <p>{pkg.description}</p>
                        </div>
                        <div className="info-item">
                            <label>Weight</label>
                            <p>{pkg.weight}</p>
                        </div>
                        <div className="info-item">
                            <label>Est. Delivery</label>
                            <p>{pkg.estimatedDelivery}</p>
                        </div>
                    </div>
                    
                    <div className="package-info-grid" style={{ marginTop: '2rem', borderTop: '1px solid #f0f2f5', paddingTop: '1.5rem' }}>
                        <div className="info-item">
                            <label>From</label>
                            <p><strong>{pkg.sender.name}</strong></p>
                            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>{pkg.sender.address}</p>
                        </div>
                        <div className="info-item">
                            <label>To</label>
                            <p><strong>{pkg.recipient.name}</strong></p>
                            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>{pkg.recipient.address}</p>
                        </div>
                    </div>
                </div>

                <TrackingTimeline events={pkg.events} currentStatus={pkg.currentStatus} />
                
                <div className="search-again-card">
                    <h3>Track another package?</h3>
                    <form className="search-again-form" onSubmit={(e) => {
                        e.preventDefault();
                        const newCode = e.target.elements.trackingCode.value;
                        if (newCode) window.location.href = `/track/${newCode}`;
                    }}>
                        <input name="trackingCode" type="text" className="search-again-input" placeholder="Enter tracking code..." />
                        <button type="submit" className="search-again-btn">Track Now</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default TrackingPage;
