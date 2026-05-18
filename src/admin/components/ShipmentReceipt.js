import React from 'react';

const ShipmentReceipt = ({ pkg, onClose }) => {
  if (!pkg) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="receipt-overlay">
      <div className="receipt-container no-print">
        <div className="receipt-actions">
          <button className="print-btn" onClick={handlePrint}>🖨️ Print</button>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
      </div>


      <div className="receipt-card">

        <div className="receipt-header">
          <div className="receipt-brand">
            <h1>Flux<span>Express</span></h1>
            <p>Global Logistics & Courier Services</p>
          </div>
          <div className="receipt-meta">
            <div className="receipt-id">
              <span>TRACKING ID:</span>
              <strong>{pkg.trackingCode}</strong>
            </div>
            <div className="receipt-date">
              <span>DATE:</span>
              <strong>{new Date().toLocaleDateString()}</strong>
            </div>
          </div>
        </div>

        <div className="receipt-body">
          <div className="receipt-section">
            <h3>Shipment Details</h3>
            <div className="receipt-grid">
              <div className="receipt-item">
                <label>Description:</label>
                <span>{pkg.description}</span>
              </div>
              <div className="receipt-item">
                <label>Weight:</label>
                <span>{pkg.weight?.includes('kg') ? pkg.weight : `${pkg.weight} kg`}</span>
              </div>
              <div className="receipt-item">
                <label>Est. Delivery:</label>
                <span>{pkg.estimatedDelivery || "Standard"}</span>
              </div>
              <div className="receipt-item">
                <label>Status:</label>
                <span className="status-confirmed">Registered</span>
              </div>
            </div>
          </div>

          <div className="receipt-addresses">
            <div className="address-box">
              <h4>Sender Details</h4>
              <p><strong>{pkg.sender.name}</strong></p>
              <p>{pkg.sender.address}</p>
            </div>
            <div className="address-box">
              <h4>Recipient Details</h4>
              <p><strong>{pkg.recipient.name}</strong></p>
              <p>{pkg.recipient.address}</p>
              <p>{pkg.recipient.phone}</p>
            </div>
          </div>
        </div>

        <div className="receipt-footer">
          <div className="receipt-barcode">
            {/* Simple simulated barcode */}
            <div className="barcode-marks">
              {[...Array(40)].map((_, i) => (
                <div key={i} className="barcode-line" style={{ width: Math.random() > 0.5 ? '2px' : '4px', height: '40px', background: '#000', margin: '1px' }}></div>
              ))}
            </div>
            <span>{pkg.trackingCode}</span>
          </div>
          <div className="receipt-notice">
            <p>Thank you for choosing FluxExpress.</p>
            <p>Track your package live at: <strong>www.fluxexpress.com/track</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentReceipt;
