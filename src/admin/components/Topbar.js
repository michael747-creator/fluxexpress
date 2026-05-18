import React from 'react';
import '../../admin/styles/admin.css';

const Topbar = ({
    onToggleSidebar,
    onAddShipment,
    userName = "Admin User"
}) => {
    return (
        <header className="admin-topbar">
            <div className="topbar-left">
                <button
                    className="hamburger-btn"
                    onClick={onToggleSidebar}
                    aria-label="Menu"
                    style={{ display: 'flex' }}
                >
                    ☰
                </button>
                <h1>Operations Control</h1>
            </div>

            <div className="admin-topbar-right">
                <button className="add-package-btn" onClick={onAddShipment}>
                    <span>➕</span>
                    <span>New Shipment</span>
                </button>
                
                <div className="admin-user-badge">
                    <div className="admin-user-avatar">
                        {userName.charAt(0)}
                    </div>
                    <span>{userName}</span>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
