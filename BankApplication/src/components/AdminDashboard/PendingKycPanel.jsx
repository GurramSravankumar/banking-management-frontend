import React, { useState } from "react";
import DataTable from "../DataTable";

function PendingKycPanel({ pendingKyc, handleKycAction }) {
    const [selectedDoc, setSelectedDoc] = useState(null); 

    return (
        <div className="panel animate-fade-in">
            <h2>Pending KYC Requests</h2>
            <DataTable
                rows={pendingKyc}
                columns={["id", "kycStatus", "emailVerified", "mobileVerified", "aadhaarVerified", "panVerified", "aadhaarDocumentPath", "panDocumentPath", "profilePhotoPath"]}
                customRenderers={{
                    aadhaarDocumentPath: (val, row) => val ? (
                        <button className="view-doc-link-btn" onClick={() => setSelectedDoc({ path: val, label: "Aadhaar Document", row })}>
                            View Document
                        </button>
                    ) : "-",
                    panDocumentPath: (val, row) => val ? (
                        <button className="view-doc-link-btn" onClick={() => setSelectedDoc({ path: val, label: "PAN Document", row })}>
                            View Document
                        </button>
                    ) : "-",
                    profilePhotoPath: (val, row) => val ? (
                        <button className="view-doc-link-btn" onClick={() => setSelectedDoc({ path: val, label: "Profile Photo", row })}>
                            View Photo
                        </button>
                    ) : "-"
                }}
                renderExtra={(row) => (
                    <>
                        <button onClick={() => handleKycAction(row.user?.id, "approve")}>Approve</button>
                        <button className="danger" onClick={() => handleKycAction(row.user?.id, "reject")}>Reject</button>
                    </>
                )}
            />

            {selectedDoc && (
                <div className="doc-modal-overlay" onClick={() => setSelectedDoc(null)}>
                    <div className="doc-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="doc-modal-close" onClick={() => setSelectedDoc(null)}>&times;</button>
                        <div className="doc-modal-body">
                            {}
                            <div className="doc-modal-left">
                                <h3>{selectedDoc.label}</h3>
                                <div className="doc-img-container">
                                    <img
                                        src={`http://localhost:8080/${selectedDoc.path.replace(/\\/g, "/")}`}
                                        alt={selectedDoc.label}
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/400x300?text=Document+Image+Not+Found";
                                        }}
                                    />
                                </div>
                            </div>
                            {}
                            <div className="doc-modal-right">
                                <h3>User Details</h3>
                                <div className="doc-user-details-list">
                                    <p><strong>Full Name:</strong> {selectedDoc.row.user?.fullName || "-"}</p>
                                    <p><strong>Email:</strong> {selectedDoc.row.user?.email || "-"}</p>
                                    <p><strong>Phone:</strong> {selectedDoc.row.user?.phone || "-"}</p>
                                    <p><strong>Gender:</strong> {selectedDoc.row.user?.gender || "-"}</p>
                                    <p><strong>Date of Birth:</strong> {selectedDoc.row.user?.dateOfBirth || "-"}</p>
                                    <p><strong>Occupation:</strong> {selectedDoc.row.user?.occupation || "-"}</p>
                                    <p><strong>Annual Income:</strong> {selectedDoc.row.user?.annualIncome ? `Rs. ${selectedDoc.row.user.annualIncome}` : "-"}</p>
                                    <p><strong>Nationality:</strong> {selectedDoc.row.user?.nationality || "-"}</p>
                                    <p><strong>Address:</strong> {`
                                        ${selectedDoc.row.user?.houseNo || ""}, 
                                        ${selectedDoc.row.user?.street || ""}, 
                                        ${selectedDoc.row.user?.city || ""}, 
                                        ${selectedDoc.row.user?.district || ""}, 
                                        ${selectedDoc.row.user?.state || ""} 
                                        ${selectedDoc.row.user?.pincode || ""}
                                    `.trim().replace(/\s+/g, ' ')}</p>
                                    <hr />
                                    <p><strong>Aadhaar Number:</strong> {selectedDoc.row.aadhaarNumber || selectedDoc.row.user?.aadhaarNumber || "-"}</p>
                                    <p><strong>PAN Number:</strong> {selectedDoc.row.panNumber || "-"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PendingKycPanel;
