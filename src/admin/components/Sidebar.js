import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import '../../admin/styles/admin.css';

const Sidebar = ({
    activeTab,
    onTabChange,
    isOpen,
    onToggle,
    onLogout
}) => {
    const navigate = useNavigate();

    const tabs = [
        { id: 'dashboard', icon: '📊', label: 'Dashboard' },
        { id: 'shipments', icon: '📦', label: 'All Shipments' },
        { id: 'support', icon: '💬', label: 'Support Center' },
        { id: 'settings', icon: '⚙️', label: 'Admin Settings' }
    ];

    const handleLogout = () => {
        localStorage.removeItem('fluxAdminToken');
        navigate('/admin/login');
        if (onLogout) onLogout();
    };

    const handleTabClick = (tabId) => {
        onTabChange(tabId);
        if (window.innerWidth < 1025) {
            onToggle(false);
        }
    };

    return (
        <>
            {isOpen && window.innerWidth < 1025 && (
                <div className="sidebar-overlay" onClick={() => onToggle(false)} />
            )}

            <aside className={`admin-sidebar ${isOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-brand">
                    <Logo showText={true} textColor="#ffffff" />
                    <div style={{ fontSize: '0.625rem', color: 'var(--primary-light)', fontWeight: 800, marginTop: '4px', letterSpacing: '1px' }}>ADMIN PANEL v2.0</div>
                </div>

                <nav className="sidebar-nav">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`sidebar-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => handleTabClick(tab.id)}
                        >
                            <span className="sidebar-nav-icon">{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="sidebar-logout-btn" onClick={handleLogout}>
                        <span>🚪</span>
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
