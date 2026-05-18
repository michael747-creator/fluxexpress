import React from 'react';
import '../../admin/styles/admin.css';

const CustomsWarningModal = ({
    isOpen,
    customsWarning,
    tempCustomsWarning,
    onTempChange,
    onConfirm,
    onClose
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="customs-warning-popup" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header" style={{ borderBottomColor: 'rgba(245, 158, 11, 0.2)' }}>
                    <h2 style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span>⚠️</span> Customs Alert
                    </h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="modal-body">
                    <div style={{ 
                        background: 'rgba(245, 158, 11, 0.05)', 
                        border: '1px solid rgba(245, 158, 11, 0.1)', 
                        padding: '1.25rem', 
                        borderRadius: 'var(--border-radius)',
                        marginBottom: '1.5rem'
                    }}>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--gray-700)', lineHeight: 1.6 }}>
                            You are about to mark this shipment for <strong>Customs Clearance</strong>. This will trigger a notification and a special warning on the recipient's tracking page.
                        </p>
                    </div>

                    <div className="form-group-light">
                        <label>Customs Warning Message</label>
                        <textarea
                            value={tempCustomsWarning}
                            onChange={(e) => onTempChange(e.target.value)}
                            placeholder="Detail the requirements or reasons for the delay..."
                            rows="5"
                            style={{ 
                                fontFamily: 'inherit',
                                lineHeight: 1.5,
                                background: 'var(--gray-50)'
                            }}
                        />
                    </div>
                    
                    <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>ℹ️</span> This message will be saved as the default template.
                    </p>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" style={{ background: 'var(--warning)', borderColor: 'var(--warning)' }} onClick={onConfirm}>
                        Apply Customs Status
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomsWarningModal;
