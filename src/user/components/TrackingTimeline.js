import React from "react";
import "../styles/user.css";

const statusIcons = {
    order_placed: "📊",
    picked_up: "📦",
    in_transit: "🚚",
    on_hold: "🛑",
    custom_clearance: "🛂",
    out_for_delivery: "🛵",
    delivered: "✅",
};

function TrackingTimeline({ events, currentStatus }) {
    const majorSteps = [
        { status: 'picked_up', label: 'Collected', icon: '📦' },
        { status: 'in_transit', label: 'In Transit', icon: '🌐' },
        { status: 'out_for_delivery', label: 'In Delivery', icon: '🚚' },
        { status: 'delivered', label: 'Completed', icon: '✨' }
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
            {/* Speedef Style Horizontal Progress */}
            <div className="speed-progress-bar-container" style={{ 
                background: 'rgba(15, 23, 42, 0.4)', 
                border: '1px solid var(--glass-border)',
                borderRadius: '24px',
                padding: '2.5rem 1.5rem',
                marginBottom: '2.5rem',
                position: 'relative'
            }}>
                <div className="speed-progress-bar">
                    {majorSteps.map((step, idx) => {
                        const state = getStatusState(step.status);
                        return (
                            <React.Fragment key={step.status}>
                                <div className={`speed-step ${state}`}>
                                    <div className="speed-step-icon">
                                        {step.icon}
                                        {state === 'active' && <div className="dot-pulse"></div>}
                                    </div>
                                    <div className="speed-step-label">{step.label}</div>
                                </div>
                                {idx < majorSteps.length - 1 && (
                                    <div className="speed-step-line" style={{ 
                                        flex: 1, 
                                        height: '2px', 
                                        marginTop: '25px',
                                        marginRight: '-20px',
                                        marginLeft: '-20px'
                                    }}></div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* Detailed History Log (Speedef Style) */}
            <div className="timeline-card">
                <h2>
                    <span style={{ color: 'var(--primary)' }}>●</span> 
                    Consignment Travel History
                </h2>
                
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
                                <p className="timeline-description">{event.description}</p>
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
