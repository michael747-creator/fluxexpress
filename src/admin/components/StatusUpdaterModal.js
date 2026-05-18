import React from 'react';
import { statusLabels, statusColors } from '../../data/packages';
import '../../admin/styles/admin.css';

const StatusUpdaterModal = ({
    pkg,
    statusForm,
    onStatusFormChange,
    onStatusUpdate,
    onClose
}) => {
    if (!pkg) return null;

    const handleStatusSelect = (status) => {
        onStatusFormChange({ ...statusForm, status });
        // Call parent update directly if location is already set or just to pick the status
        onStatusUpdate(pkg.id, pkg.firestoreId, status, statusForm.location, statusForm.description);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="status-updater" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Update Status: {pkg.trackingCode}</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="modal-body">
                    <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', background: 'var(--gray-50)', borderRadius: 'var(--border-radius)' }}>
                        <div style={{ fontSize: '2rem' }}>📍</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase' }}>Current Progress</div>
                            <div style={{ fontWeight: 600 }}>{statusLabels[pkg.currentStatus]}</div>
                        </div>
                    </div>

                    <div className="form-grid" style={{ marginBottom: '2rem' }}>
                        <div className="form-group-light">
                            <label>Checkpoint Location</label>
                            <input
                                type="text"
                                placeholder="e.g. Dubai Central Hub"
                                value={statusForm.location}
                                onChange={(e) => onStatusFormChange({ ...statusForm, location: e.target.value })}
                            />
                        </div>
                        <div className="form-group-light">
                            <label>Internal Note (Optional)</label>
                            <input
                                type="text"
                                placeholder="e.g. Cleared for export"
                                value={statusForm.description}
                                onChange={(e) => onStatusFormChange({ ...statusForm, description: e.target.value })}
                            />
                        </div>
                    </div>

                    <label style={{ fontSize: '0.875rem', fontWeight: 700, display: 'block', marginBottom: '1rem' }}>SELECT NEW OPERATIONAL STATUS</label>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
                        gap: '1rem' 
                    }}>
                        {Object.entries(statusLabels).map(([key, label]) => (
                            <button
                                key={key}
                                className={`status-selection-card ${pkg.currentStatus === key ? 'current' : ''}`}
                                onClick={() => handleStatusSelect(key)}
                                style={{
                                    padding: '1rem',
                                    borderRadius: 'var(--border-radius)',
                                    border: '2px solid var(--gray-200)',
                                    background: 'var(--white)',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'var(--transition)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.5rem',
                                    borderColor: pkg.currentStatus === key ? statusColors[key] : 'var(--gray-200)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {pkg.currentStatus === key && (
                                    <div style={{ 
                                        position: 'absolute', 
                                        top: 0, 
                                        right: 0, 
                                        background: statusColors[key], 
                                        color: 'white', 
                                        fontSize: '0.625rem', 
                                        padding: '2px 8px', 
                                        borderBottomLeftRadius: '8px',
                                        fontWeight: 800
                                    }}>CURRENT</div>
                                )}
                                <div style={{ 
                                    width: '8px', 
                                    height: '8px', 
                                    borderRadius: '50%', 
                                    background: statusColors[key] 
                                }}></div>
                                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{label}</div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Close</button>
                </div>
            </div>
            <style>
                {`
                .status-selection-card:hover {
                    border-color: var(--primary) !important;
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-md);
                }
                .status-selection-card.current {
                    background: var(--gray-50) !important;
                }
                `}
            </style>
        </div>
    );
};

export default StatusUpdaterModal;
