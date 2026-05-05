import React from "react";
import "../styles/user.css";

const statusIcons = {
    order_placed: "📋",
    picked_up: "📦",
    in_transit: "🚚",
    out_for_delivery: "🏃",
    delivered: "✅",
};

function TrackingTimeline({ events, currentStatus }) {
    const majorSteps = [
        { status: 'picked_up', label: 'Registered', icon: '📋' },
        { status: 'in_transit', label: 'In Transit', icon: '🚚' },
        { status: 'out_for_delivery', label: 'Out for Delivery', icon: '🏃' },
        { status: 'delivered', label: 'Delivered', icon: '✅' }
    ];

    const statusOrder = ['picked_up', 'in_transit', 'on_hold', 'custom_clearance', 'out_for_delivery', 'delivered'];
    const currentIdx = statusOrder.indexOf(currentStatus);

    const getStatusState = (status) => {
        const stepIdx = statusOrder.indexOf(status);
        if (stepIdx === -1) return 'pending';
        if (status === currentStatus) return 'active';
        if (stepIdx < currentIdx) return 'completed';
        return 'pending';
    };

    return (
        <div className="speed-tracking-container">
            {/* Horizontal Progress Bar */}
            <div className="speed-progress-bar">
                {majorSteps.map((step, idx) => {
                    const state = getStatusState(step.status);
                    return (
                        <div key={step.status} className={`speed-step ${state}`}>
                            <div className="speed-step-icon">{step.icon}</div>
                            <div className="speed-step-label">{step.label}</div>
                            {idx < majorSteps.length - 1 && <div className="speed-step-line"></div>}
                        </div>
                    );
                })}
            </div>

            {/* Vertical Detailed Timeline */}
            <div className="timeline-card">
                <h2>📍 Detailed Tracking History</h2>
                <div className="timeline">
                    {[...events].reverse().map((event, index) => (
                        <div key={index} className={`timeline-item ${index === 0 ? 'active' : 'completed'}`}>
                            <div className="timeline-dot">
                                {statusIcons[event.status] || "📍"}
                                {index === 0 && <div className="dot-pulse"></div>}
                            </div>
                            <div className="timeline-content">
                                <div className="timeline-header">
                                    <span className="timeline-label">{event.label}</span>
                                    {event.timestamp && <span className="timeline-time">{event.timestamp}</span>}
                                </div>
                                <div className="timeline-description">{event.description}</div>
                                {event.location && (
                                    <div className="timeline-location">
                                        <span className="loc-icon">🌐</span> {event.location}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TrackingTimeline;
