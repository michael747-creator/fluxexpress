import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/user.css";

function TrackingForm({ packages }) {
    const [trackingCode, setTrackingCode] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = trackingCode.trim();
        if (!trimmed) {
            setError("Please enter a valid tracking number.");
            return;
        }
        setError("");
        navigate(`/track/${trimmed}`);
    };

    return (
        <div className="tracking-form-inner" style={{ width: '100%' }}>
            <form className="tracking-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="tracking-input-modern"
                    placeholder="Enter Tracking ID (e.g. FX-2026-001)"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                />
                <button type="submit" className="btn-primary-glow">
                    Search Now
                </button>
            </form>
            {error && <p className="tracking-error" style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '0.75rem', fontWeight: '600' }}>⚠️ {error}</p>}
        </div>
    );
}

export default TrackingForm;
