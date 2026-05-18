import React from 'react';
import { statusLabels, statusColors } from '../../data/packages';
import '../../admin/styles/admin.css';

const ShipmentsTable = ({
    packages = [],
    searchTerm,
    onSearchChange,
    onEdit,
    onStatus,
    onReceipt,
    onDelete
}) => {
    const filteredPackages = packages.filter(pkg =>
        pkg.trackingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.recipient?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalShipments = packages.length;
    const activeDeliveries = packages.filter(p => p.currentStatus !== 'delivered').length;
    const completed = packages.filter(p => p.currentStatus === 'delivered').length;

    return (
        <div className="shipments-view">
            {/* Stats Cards */}
            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-card-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>📦</div>
                    <div className="stat-card-info">
                        <h3>{totalShipments}</h3>
                        <p>Total Shipments</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>🚚</div>
                    <div className="stat-card-info">
                        <h3>{activeDeliveries}</h3>
                        <p>Active Shipments</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>✅</div>
                    <div className="stat-card-info">
                        <h3>{completed}</h3>
                        <p>Delivered</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="table-card">
                <div className="table-card-header">
                    <h2>Shipment Registry</h2>
                    <input
                        type="text"
                        className="table-search"
                        placeholder="Search by ID or Recipient..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                <div className="table-responsive">
                    <table className="packages-table">
                        <thead>
                            <tr>
                                <th>Tracking ID</th>
                                <th>Recipient</th>
                                <th>Status</th>
                                <th>Destination</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPackages.length > 0 ? (
                                filteredPackages.map(pkg => (
                                    <tr key={pkg.id}>
                                        <td className="tracking-code-cell">{pkg.trackingCode}</td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{pkg.recipient?.name || 'N/A'}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{pkg.recipient?.phone}</div>
                                        </td>
                                        <td>
                                            <span
                                                className="status-badge"
                                                style={{
                                                    backgroundColor: `${statusColors[pkg.currentStatus] || '#64748b'}15`,
                                                    color: statusColors[pkg.currentStatus] || '#64748b',
                                                    border: `1px solid ${statusColors[pkg.currentStatus] || '#64748b'}30`
                                                }}
                                            >
                                                {statusLabels[pkg.currentStatus] || 'Unknown'}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '0.875rem' }}>{pkg.recipient?.address?.split(',').slice(-2).join(', ') || 'Global'}</div>
                                        </td>
                                        <td className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                                            <button 
                                                className="table-action-btn" 
                                                onClick={() => onEdit(pkg)}
                                                title="Edit Shipment"
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                className="table-action-btn" 
                                                onClick={() => onReceipt(pkg)}
                                                title="View Receipt"
                                            >
                                                📄
                                            </button>
                                            <button 
                                                className="table-action-btn" 
                                                onClick={() => onStatus(pkg)}
                                                title="Update Status"
                                            >
                                                🔃
                                            </button>
                                            <button 
                                                className="table-action-btn delete-btn" 
                                                onClick={() => onDelete(pkg.firestoreId, pkg.trackingCode)}
                                                title="Delete Shipment"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }}>
                                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
                                        No shipments found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ShipmentsTable;
