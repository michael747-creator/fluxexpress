import React from 'react';
import Logo from '../../components/Logo';
import { statusLabels, statusColors } from '../../data/packages';
import '../../admin/styles/admin.css';

const ProfessionalShipmentReceipt = ({ pkg, onClose }) => {
    if (!pkg) return null;

    const handlePrint = () => {
        window.print();
    };

    const formatAddress = (address) => {
        if (!address) return 'N/A';
        return address.split(',').map((line, index) => (
            <div key={index}>{line.trim()}</div>
        ));
    };

    const generateBarcodePattern = (code) => {
        // Simulated barcode
        const chars = code.replace(/[^A-Z0-9]/g, '').toUpperCase();
        let pattern = '';
        for (let char of chars) {
            const val = char.charCodeAt(0) % 8;
            pattern += '█'.repeat(val + 1) + ' ';
        }
        return pattern.substring(0, 60);
    };

    const companyInfo = {
        name: 'FluxExpress Global Logistics',
        address: '123 Logistics Plaza, Tech Hub, NY 10001',
        phone: '+1 (800) 555-FLUX',
        email: 'logistics@fluxexpress.com',
        website: 'www.fluxexpress.com'
    };

    return (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.85)', padding: '1rem' }}>
            <div className="no-print" style={{ 
                position: 'fixed', 
                top: '20px', 
                right: '20px', 
                zIndex: 4000,
                display: 'flex',
                gap: '10px'
            }}>
                <button className="btn btn-primary" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>🖨️</span> Print Receipt
                </button>
                <button className="btn btn-secondary" onClick={onClose} style={{ minWidth: '40px' }}>
                    ✕
                </button>
            </div>

            <div className="professional-receipt-container" style={{
                background: 'white',
                width: '100%',
                maxWidth: '850px',
                margin: '0 auto',
                padding: '3rem',
                borderRadius: '4px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                color: '#1a1a1a',
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
            }}>
                {/* Header Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '2rem' }}>
                    <div>
                        <Logo size={48} showText={true} textColor="#1a1a1a" />
                        <div style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
                            {companyInfo.address}<br />
                            {companyInfo.phone} | {companyInfo.email}
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, letterSpacing: '2px', color: '#1e293b' }}>WAYBILL / RECEIPT</h1>
                        <div style={{ marginTop: '0.5rem' }}>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>TRACKING NUMBER</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#6366f1' }}>{pkg.trackingCode}</div>
                        </div>
                        <div style={{ marginTop: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                            Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                </div>

                {/* Sender/Recipient Section */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                    <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #64748b' }}>
                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>From (Sender)</h3>
                        <div style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>{pkg.sender?.name}</div>
                        <div style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#475569' }}>
                            {formatAddress(pkg.sender?.address)}
                        </div>
                    </div>
                    <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #6366f1' }}>
                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>To (Recipient)</h3>
                        <div style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>{pkg.recipient?.name}</div>
                        <div style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#475569', marginBottom: '0.5rem' }}>
                            {formatAddress(pkg.recipient?.address)}
                        </div>
                        {pkg.recipient?.phone && (
                            <div style={{ fontSize: '0.875rem', color: '#6366f1', fontWeight: 600 }}>
                                Phone: {pkg.recipient.phone}
                            </div>
                        )}
                    </div>
                </div>

                {/* Package Info */}
                <div style={{ marginBottom: '3rem' }}>
                    <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem', fontSize: '1rem', fontWeight: 700 }}>Package Details</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: '#64748b' }}>DESCRIPTION</th>
                                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: '#64748b' }}>WEIGHT</th>
                                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: '#64748b' }}>EST. DELIVERY</th>
                                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: '#64748b' }}>SERVICE</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', fontWeight: 600 }}>{pkg.description}</td>
                                <td style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9' }}>{pkg.weight}</td>
                                <td style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9' }}>{pkg.estimatedDelivery}</td>
                                <td style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9' }}>Express Global</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Recent Activity */}
                {pkg.events && pkg.events.length > 0 && (
                    <div style={{ marginBottom: '3rem' }}>
                        <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem', fontSize: '1rem', fontWeight: 700 }}>Shipping Progress</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {pkg.events.slice(-3).reverse().map((event, index) => (
                                <div key={index} style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
                                    <div style={{ color: '#64748b', whiteSpace: 'nowrap', width: '150px' }}>{event.timestamp}</div>
                                    <div style={{ color: statusColors[event.status] || '#6366f1', fontWeight: 700, width: '150px' }}>{statusLabels[event.status]}</div>
                                    <div style={{ color: '#1e293b' }}>{event.description} - <span style={{ color: '#64748b' }}>{event.location}</span></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '2px solid #f1f5f9', paddingTop: '2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                            fontFamily: 'monospace', 
                            fontSize: '2rem', 
                            letterSpacing: '-2px', 
                            lineHeight: 1,
                            marginBottom: '0.5rem'
                        }}>
                            {generateBarcodePattern(pkg.trackingCode)}
                        </div>
                        <div style={{ fontWeight: 700, letterSpacing: '4px', fontSize: '0.875rem' }}>{pkg.trackingCode}</div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#94a3b8', maxWidth: '300px' }}>
                        This is a computer generated waybill for tracking purposes. Subject to terms and conditions of carriage. 
                        Scan at any FluxExpress terminal to update status.
                        <div style={{ marginTop: '1rem', color: '#1e293b', fontWeight: 700 }}>© 2024 FluxExpress Logistics International</div>
                    </div>
                </div>
            </div>

            <style>
                {`
                @media print {
                    body * { visibility: hidden; }
                    .professional-receipt-container, .professional-receipt-container * { visibility: visible; }
                    .professional-receipt-container { 
                        position: absolute; 
                        left: 0; 
                        top: 0; 
                        width: 100%;
                        max-width: 100% !important;
                        box-shadow: none !important;
                        margin: 0 !important;
                        padding: 1cm !important;
                    }
                    .no-print { display: none !important; }
                }
                `}
            </style>
        </div>
    );
};

export default ProfessionalShipmentReceipt;
