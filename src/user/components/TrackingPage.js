import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "./Navbar";
import TrackingForm from "./TrackingForm";
import TrackingTimeline from "./TrackingTimeline";
import { statusLabels, statusColors } from "../../data/packages";
import "../styles/user.css";

function TrackingPage({ packages }) {
    const { code } = useParams();
    const [showWarning, setShowWarning] = useState(false);

    const pkg = packages.find(
        (p) => p.trackingCode.toLowerCase() === code.toLowerCase()
    );

    useEffect(() => {
        if (pkg && pkg.currentStatus === 'custom_clearance') {
            setShowWarning(true);
        } else {
            setShowWarning(false);
        }
    }, [pkg]);

    if (!pkg) {
        return (
            <div className="tracking-page" style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
                <Navbar />
                <div className="tracking-content" style={{ marginTop: '6rem', display: 'flex', justifyContent: 'center' }}>
                    <div className="not-found-card" style={{
                        background: 'rgba(15, 23, 42, 0.6)',
                        padding: '4rem',
                        borderRadius: '24px',
                        border: '1px solid var(--glass-border)',
                        textAlign: 'center',
                        maxWidth: '500px'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🔍</div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>No Shipment Found</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>We couldn't locate any shipment with tracking ID: <strong style={{ color: '#fff' }}>{code}</strong>. Please verify the number and try again.</p>
                        <Link to="/" className="btn-primary-glow" style={{ textDecoration: 'none', display: 'inline-block' }}>Return to Home</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="tracking-page" style={{ minHeight: '100vh', background: 'var(--bg-dark)', paddingBottom: '4rem' }}>
            <Navbar />

            {showWarning && (
                <div className="customs-overlay" onClick={() => setShowWarning(false)}>
                    <div className="customs-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="customs-icon">⚠️</div>
                        <h2>Customs Action Required</h2>
                        <p className="customs-message">
                            {pkg.customsWarning || "Your shipment is currently undergoing mandatory regulatory inspection by Customs. This may require additional documentation or duty payments to facilitate release."}
                        </p>
                        <div className="customs-actions">
                            <button className="btn-primary-glow" onClick={() => setShowWarning(false)}>I Understand</button>
                            <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                Need help? Contact our <Link to="/" style={{ color: 'var(--primary)', fontWeight: 600 }}>support team</Link> immediately.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="tracking-page-header" style={{
                padding: '4rem 2rem',
                textAlign: 'center',
                background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.8), transparent)'
            }}>
                <span className="hero-badge">Shipment Tracking</span>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#ef4444' }}>Active Consignment</h1>
                <p style={{ color: 'var(--text-muted)' }}>Live monitoring of your package through our global network.</p>
                <div style={{
                    marginTop: '2rem',
                    display: 'inline-block',
                    padding: '0.75rem 1.5rem',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    border: '1px solid var(--glass-border)',
                    fontFamily: 'monospace',
                    fontSize: '1.25rem',
                    letterSpacing: '2px',
                    color: '#6366f1'
                }}>
                    {pkg.trackingCode}
                </div>
            </div>

            <div className="tracking-content" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem' }}>
                <div className="package-info-card" style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    borderRadius: '24px',
                    border: '1px solid var(--glass-border)',
                    padding: '2.5rem',
                    marginBottom: '2.5rem'
                }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span>📋</span> Consignment Overview
                    </h2>

                    <div className="package-info-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                        <div className="info-item">
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Current Status</label>
                            <span
                                className="status-badge"
                                style={{
                                    display: 'inline-block',
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                    backgroundColor: `${statusColors[pkg.currentStatus]}20`,
                                    color: statusColors[pkg.currentStatus],
                                    border: `1px solid ${statusColors[pkg.currentStatus]}40`
                                }}
                            >
                                {statusLabels[pkg.currentStatus]}
                            </span>
                        </div>
                        <div className="info-item">
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Description</label>
                            <p style={{ margin: 0, fontWeight: 600 }}>{pkg.description}</p>
                        </div>
                        <div className="info-item">
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Weight</label>
                            <p style={{ margin: 0, fontWeight: 600 }}>{pkg.weight}</p>
                        </div>
                        <div className="info-item">
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Delivery Estimate</label>
                            <p style={{ margin: 0, fontWeight: 600, color: '#4ade80' }}>{pkg.estimatedDelivery}</p>
                        </div>
                    </div>

                    <div className="package-info-grid" style={{
                        marginTop: '2.5rem',
                        paddingTop: '2.5rem',
                        borderTop: '1px solid var(--glass-border)',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '3rem'
                    }}>
                        <div className="info-item">
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>Dispatch Location</label>
                            <p style={{ margin: 0, fontWeight: 700 }}>{pkg.sender.name}</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: 1.5 }}>{pkg.sender.address}</p>
                        </div>
                        <div className="info-item">
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>Destination</label>
                            <p style={{ margin: 0, fontWeight: 700 }}>{pkg.recipient.name}</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: 1.5 }}>{pkg.recipient.address}</p>
                        </div>
                    </div>
                </div>

                {pkg.media?.imageUrls?.length > 0 && (
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                            📸 Package Pictures
                        </h2>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                gap: '1rem',
                            }}
                        >
                            {pkg.media.imageUrls.map((url, idx) => (
                                <div
                                    key={url + idx}
                                    style={{
                                        background: 'rgba(15, 23, 42, 0.4)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <img
                                        src={url}
                                        alt={`Package image ${idx + 1}`}
                                        style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {pkg.media?.videoUrls?.length > 0 && (
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                            🎥 Package Videos
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                            {pkg.media.videoUrls.map((url, idx) => (
                                <div
                                    key={url + idx}
                                    style={{
                                        background: 'rgba(15, 23, 42, 0.4)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '16px',
                                        padding: '0.75rem',
                                    }}
                                >
                                    <video
                                        controls
                                        src={url}
                                        style={{ width: '100%', maxHeight: '420px', borderRadius: '12px', background: '#000' }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <TrackingTimeline events={pkg.events} currentStatus={pkg.currentStatus} />

                <div className="search-again-card" style={{
                    marginTop: '3rem',
                    background: 'rgba(15, 23, 42, 0.4)',
                    padding: '2rem',
                    borderRadius: '24px',
                    border: '1px solid var(--glass-border)',
                    textAlign: 'center'
                }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Track another consignment?</h3>
                    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                        <TrackingForm packages={packages} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TrackingPage;
