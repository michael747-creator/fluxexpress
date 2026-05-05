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
            setError("Please enter a tracking code.");
            return;
        }
        setError("");
        navigate(`/track/${trimmed}`);
    };

    const fillSample = (code) => {
        setTrackingCode(code);
        setError("");
    };

    // Get up to 3 sample codes from current packages
    const samplePackages = packages ? packages.slice(0, 3) : [];

    return (
        <div className="tracking-form-inner">
            <form className="tracking-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="tracking-input-modern"
                    placeholder="Enter your tracking code (e.g. FX-2026-001)"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                />
                <button type="submit" className="btn-primary-glow">
                    Track Now
                </button>
            </form>
            {error && <p className="tracking-error">⚠️ {error}</p>}
        </div>
    );
}

export default TrackingForm;
