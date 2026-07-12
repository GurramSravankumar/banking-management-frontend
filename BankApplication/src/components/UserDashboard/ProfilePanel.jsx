import React from "react";
import EditProfileForm from "./EditProfileForm";

function ProfilePanel({
    profile,
    loading,
    isEditingProfile,
    setIsEditingProfile,
    profileForm,
    handleProfileFormChange,
    submitProfileUpdate,
    transactions = [],
}) {
    if (!profile) {
        return <p>Loading profile...</p>;
    }

    return (
        <div className="panel animate-fade-in">
            <h2>Profile</h2>
            {isEditingProfile ? (
                <EditProfileForm
                    profileForm={profileForm}
                    handleProfileFormChange={handleProfileFormChange}
                    submitProfileUpdate={submitProfileUpdate}
                    loading={loading}
                    onCancel={() => setIsEditingProfile(false)}
                />
            ) : (
                <>
                    <div className="detail-grid">
                        {Object.entries(profile).map(([key, value]) => {
                            if (key === "profilePhotoPath") {
                                return (
                                    <div key={key} className="profile-photo-row" style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
                                        <span style={{ fontWeight: 600, color: "#64748b" }}>Profile Photo</span>
                                        <div className="profile-photo-container" style={{ width: "120px", height: "120px", borderRadius: "50%", overflow: "hidden", border: "2px solid #cbd5e1", background: "#f1f5f9", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            {value ? (
                                                <img
                                                    src={`http://localhost:8080/${value.replace(/\\/g, '/')}`}
                                                    alt="Profile Preview"
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                    onError={(e) => {
                                                        e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200";
                                                    }}
                                                />
                                            ) : (
                                                <span style={{ fontSize: "12px", color: "#64748b" }}>No Photo</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            }
                            if (key === "aadhaarDocumentPath" || key === "panDocumentPath") {
                                return (
                                    <p key={key}>
                                        <span style={{ textTransform: "capitalize" }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                                        {value ? (
                                            <a href={`http://localhost:8080/${value.replace(/\\/g, '/')}`} target="_blank" rel="noreferrer" style={{ color: "#2563eb", textDecoration: "underline", fontWeight: 600 }}>
                                                View Document
                                            </a>
                                        ) : "-"}
                                    </p>
                                );
                            }
                            return (
                                <p key={key}>
                                    <span style={{ textTransform: "capitalize" }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                                    {String(value ?? "-")}
                                </p>
                            );
                        })}
                    </div>
                    <div className="button-group" style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                        <button onClick={() => setIsEditingProfile(true)}>Edit Profile</button>
                    </div>
                </>
            )}

            {!isEditingProfile && transactions.length > 0 && (() => {
                const totalCredits = transactions
                    .filter(t => t.transactionType === "CREDIT" && t.status === "SUCCESS")
                    .reduce((sum, t) => sum + (t.amount || 0), 0);
                const totalDebits = transactions
                    .filter(t => t.transactionType === "DEBIT" && t.status === "SUCCESS")
                    .reduce((sum, t) => sum + (t.amount || 0), 0);

                const totalVolume = totalCredits + totalDebits;
                const creditPercent = totalVolume > 0 ? (totalCredits / totalVolume) * 100 : 50;
                const debitPercent = totalVolume > 0 ? (totalDebits / totalVolume) * 100 : 50;

                return (
                    <div style={{ marginTop: "2rem", borderTop: "1px solid #444", paddingTop: "1.5rem" }}>
                        <h3>Cashflow Analytics</h3>
                        <div className="status-grid" style={{ marginBottom: "1.5rem" }}>
                            <div className="status-card" style={{ background: "rgba(76, 175, 80, 0.05)", borderLeft: "4px solid #4caf50" }}>
                                <span>Total Credits (Inflow)</span>
                                <strong style={{ color: "#4caf50" }}>Rs. {totalCredits.toLocaleString()}</strong>
                            </div>
                            <div className="status-card" style={{ background: "rgba(244, 67, 54, 0.05)", borderLeft: "4px solid #f44336" }}>
                                <span>Total Debits (Outflow)</span>
                                <strong style={{ color: "#f44336" }}>Rs. {totalDebits.toLocaleString()}</strong>
                            </div>
                        </div>

                        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #444", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <span style={{ fontSize: "0.9rem", color: "#aaa", marginBottom: "1rem" }}>Inflow vs Outflow Visual Balance</span>
                            <svg width="200" height="200" viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)" }}>
                                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f44336" strokeWidth="4" />
                                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#4caf50" strokeWidth="4"
                                    strokeDasharray={`${creditPercent} ${debitPercent}`}
                                    strokeDashoffset="0" />
                            </svg>
                            <div style={{ display: "flex", gap: "1.5rem", marginTop: "1rem", fontSize: "0.85rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <span style={{ width: "12px", height: "12px", background: "#4caf50", borderRadius: "50%" }}></span>
                                    <span>Credits ({creditPercent.toFixed(1)}%)</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <span style={{ width: "12px", height: "12px", background: "#f44336", borderRadius: "50%" }}></span>
                                    <span>Debits ({debitPercent.toFixed(1)}%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}


        </div>
    );
}

export default ProfilePanel;
