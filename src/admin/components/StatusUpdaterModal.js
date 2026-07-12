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
        // Update only local form state; persist to Firestore on Save Update.
        onStatusFormChange({ ...statusForm, status });
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
                        <div className="form-group-light">
                            <label>Next Milestone</label>
                            <input
                                type="text"
                                placeholder="e.g., Out for Delivery"
                                value={statusForm.nextMilestone || ''}
                                onChange={(e) => onStatusFormChange({ ...statusForm, nextMilestone: e.target.value })}
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
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', width: '100%', marginTop: '2rem' }}>
                        <button
                            onClick={async () => {
                                // Persist to Firestore on Save Update.
                                // status is stored in statusForm.status after clicking a card.
                                await onStatusUpdate(
                                    pkg.id,
                                    pkg.firestoreId,
                                    statusForm.status,
                                    statusForm.location,
                                    statusForm.description,
                                    statusForm.nextMilestone
                                );
                                onClose();
                            }}
                            style={{
                                background: '#7c3aed',
                                color: '#fff',
                                padding: '0.8rem 1.5rem',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}
                        >
                            Save Update
                        </button>
                        <button className="btn btn-secondary" onClick={onClose} style={{ background: '#6b7280', color: '#fff', padding: '0.8rem 1.5rem', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                            Close
                        </button>
                    </div>
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
