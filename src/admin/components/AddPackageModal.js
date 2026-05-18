import React from 'react';
import '../../admin/styles/admin.css';

const AddPackageModal = ({
    isOpen,
    isEditing = false,
    packageData = null,
    formData,
    onChange,
    onSubmit,
    onClose
}) => {
    if (!isOpen) return null;

    const title = isEditing
        ? `Modify Shipment: ${packageData?.trackingCode}`
        : 'Register New Shipment';

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(e);
    };

    const selectedFiles = formData?.mediaFiles || [];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="add-package-form" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="modal-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-grid">
                            <div className="form-group-light full-width">
                                <label>Package Description</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Electronics, Documents, Personal Effects"
                                    value={formData.description}
                                    onChange={(e) => onChange({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="form-group-light">
                                <label>Weight (kg)</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. 5.5"
                                    value={formData.weight}
                                    onChange={(e) => onChange({ ...formData, weight: e.target.value })}
                                />
                            </div>
                            <div className="form-group-light">
                                <label>Estimated Delivery Date</label>
                                <input
                                    type="text"
                                    placeholder="e.g. May 25, 2024"
                                    value={formData.estimatedDelivery}
                                    onChange={(e) => onChange({ ...formData, estimatedDelivery: e.target.value })}
                                />
                            </div>
                        </div>

                        <div
                            className="full-width"
                            style={{
                                marginTop: '1rem',
                                borderBottom: '1px solid var(--gray-100)',
                                paddingBottom: '0.5rem',
                            }}
                        >
                            <h3
                                style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 700,
                                    margin: 0,
                                    color: 'var(--primary)',
                                }}
                            >
                                SENDER DETAILS
                            </h3>
                        </div>
                        <div className="form-grid">
                            <div className="form-group-light">
                                <label>Sender Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Full Name"
                                    value={formData.senderName}
                                    onChange={(e) => onChange({ ...formData, senderName: e.target.value })}
                                />
                            </div>
                            <div className="form-group-light full-width">
                                <label>Sender Address</label>
                                <textarea
                                    required
                                    placeholder="Complete Address"
                                    value={formData.senderAddress}
                                    onChange={(e) => onChange({ ...formData, senderAddress: e.target.value })}
                                    rows="2"
                                />
                            </div>
                        </div>

                        <div
                            className="full-width"
                            style={{
                                marginTop: '1rem',
                                borderBottom: '1px solid var(--gray-100)',
                                paddingBottom: '0.5rem',
                            }}
                        >
                            <h3
                                style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 700,
                                    margin: 0,
                                    color: 'var(--primary)',
                                }}
                            >
                                RECIPIENT DETAILS
                            </h3>
                        </div>
                        <div className="form-grid">
                            <div className="form-group-light">
                                <label>Recipient Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Full Name"
                                    value={formData.recipientName}
                                    onChange={(e) => onChange({ ...formData, recipientName: e.target.value })}
                                />
                            </div>
                            <div className="form-group-light">
                                <label>Recipient Phone</label>
                                <input
                                    type="text"
                                    placeholder="+1 (555) 000-0000"
                                    value={formData.recipientPhone}
                                    onChange={(e) => onChange({ ...formData, recipientPhone: e.target.value })}
                                />
                            </div>
                            <div className="form-group-light full-width">
                                <label>Recipient Address</label>
                                <textarea
                                    required
                                    placeholder="Full Delivery Address"
                                    value={formData.recipientAddress}
                                    onChange={(e) => onChange({ ...formData, recipientAddress: e.target.value })}
                                    rows="2"
                                />
                            </div>
                        </div>

                        <div
                            className="full-width"
                            style={{
                                marginTop: '1rem',
                                borderBottom: '1px solid var(--gray-100)',
                                paddingBottom: '0.5rem',
                            }}
                        >
                            <h3
                                style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 700,
                                    margin: 0,
                                    color: 'var(--primary)',
                                }}
                            >
                                PACKAGE MEDIA
                            </h3>
                        </div>

                        <div className="form-group-light full-width">
                            <label>Upload pictures/videos (optional)</label>
                            <input
                                type="file"
                                accept="image/*,video/*"
                                multiple
                                onChange={(e) => {
                                    const files = Array.from(e.target.files || []);
                                    onChange({ ...formData, mediaFiles: files });
                                }}
                            />
                            {selectedFiles.length > 0 && (
                                <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    Selected: <strong>{selectedFiles.length}</strong>
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {isEditing ? 'Update Shipment' : 'Register Shipment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPackageModal;

