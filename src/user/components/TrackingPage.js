import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "./Navbar";
import TrackingForm from "./TrackingForm";
import TrackingDisplay from "./TrackingDisplay";
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
            <div className="tracking-page" style={{ minHeight: '100vh', background: '#ffffff' }}>
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
        <div className="tracking-page" style={{ minHeight: '100vh', background: '#020617', paddingBottom: '4rem' }}>
            <Navbar />

            {showWarning && (
                <div className="customs-overlay" onClick={() => setShowWarning(false)}>
                    <div className="customs-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="customs-modal-header">
                            <div className="customs-icon">⚠️</div>
                            <div>
                                <p className="customs-modal-tag">Customs Alert</p>
                                <h2>Action Required for Customs Clearance</h2>
                            </div>
                        </div>
                        <div className="customs-message-box">
                            <p>
                                {pkg.customsWarning || "Your shipment is currently undergoing mandatory regulatory inspection by Customs. This may require additional documentation or duty payments to facilitate release."}
                            </p>
                        </div>
                        <div className="customs-actions">
                            <button
                                className="customs-button"
                                onClick={() => {
                                    window.dispatchEvent(new Event("openSupportChat"));
                                    setShowWarning(false);
                                }}
                            >
                                Contact Customer Support
                            </button>
                            <p className="customs-note">
                                The support chat will open so you can connect with our agent immediately.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <TrackingDisplay
                trackingId={pkg.trackingCode}
                status={pkg.currentStatus}
                stages={pkg.events}
                description={pkg.description}
                consignment={{
                    sender: pkg.sender,
                    recipient: pkg.recipient,
                    weight: pkg.weight,
                    estimatedDelivery: pkg.estimatedDelivery,
                    service: pkg.service,
                    dimensions: pkg.dimensions,
                    reference: pkg.reference,
                    contact: pkg.recipient?.phone,
                }}
            />

            <div className="tracking-search-cta mx-auto mt-10 max-w-4xl rounded-[28px] border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/30 sm:p-8" style={{ marginTop: '2rem' }}>
                <h3 className="text-xl font-semibold text-slate-100">Track another consignment?</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">Enter another tracking code below to pull live shipment status immediately.</p>
                <div className="mt-6">
                    <TrackingForm packages={packages} />
                </div>
            </div>
        </div>
    );
}

export default TrackingPage;
