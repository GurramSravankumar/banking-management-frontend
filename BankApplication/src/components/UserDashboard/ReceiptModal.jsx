import React from "react";

function ReceiptModal({ receipt, onClose }) {
    if (!receipt) return null;

    return (
        <div className="receipt-overlay animate-fade-in">
            <div className="receipt-box">
                <h3>📊 OFFICIAL TRANSACTION RECEIPT</h3>
                <div className="receipt-divider" />
                <div className="receipt-grid">
                    {Object.entries(receipt).map(([key, value]) => (
                        <p key={key} className="receipt-row">
                            <span className="receipt-key">{key.replace(/([A-Z])/g, ' $1')}</span>
                            <strong className="receipt-value">{String(value ?? "-")}</strong>
                        </p>
                    ))}
                </div>
                <button className="close-btn" onClick={onClose}>Dismiss Receipt</button>
            </div>
        </div>
    );
}

export default ReceiptModal;
