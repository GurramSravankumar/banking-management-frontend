import React from "react";

function KycPanel({ loading, submitKyc, handleKycFile }) {
    return (
        <form className="panel form-grid form-card" onSubmit={submitKyc}>
            <h2>Upload Verification Documents</h2>
            <p className="section-note">Documents are processed using background machine-learning optical text checks.</p>

            <label>Aadhaar Front/Back Document</label>
            <input type="file" name="aadhaarDocument" onChange={handleKycFile} required />

            <label>PAN Verification Card</label>
            <input type="file" name="panDocument" onChange={handleKycFile} required />

            <label>Passport Photo (JPEG/PNG)</label>
            <input type="file" name="profilePhoto" onChange={handleKycFile} required />

            <button className="submit-btn" disabled={loading}>
                {loading ? "Uploading files..." : "Upload Document Package"}
            </button>
        </form>
    );
}

export default KycPanel;
