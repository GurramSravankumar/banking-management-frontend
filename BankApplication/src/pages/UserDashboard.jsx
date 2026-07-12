import React from "react";
import { useUserDashboardState } from "../customHooks/useUserDashboardState";
import ProfilePanel from "../components/UserDashboard/ProfilePanel";
import AccountsPanel from "../components/UserDashboard/AccountsPanel";
import KycPanel from "../components/UserDashboard/KycPanel";
import TransferPanel from "../components/UserDashboard/TransferPanel";
import LoansPanel from "../components/UserDashboard/LoansPanel";
import TransactionsPanel from "../components/UserDashboard/TransactionsPanel";
import StatementPanel from "../components/UserDashboard/StatementPanel";
import DataTable from "../components/DataTable";
import "./UserDashboard.css";

function UserDashboard() {
    const {
        activeTab,
        setActiveTab,
        profile,
        accounts,
        beneficiaries,
        transactions,
        statement,
        receipt,
        setReceipt,
        loans,
        applyLoanForm,
        beneficiaryForm,
        transferForm,
        statementAccountId,
        setStatementAccountId,
        newAccountForm,
        profileForm,
        isEditingProfile,
        setIsEditingProfile,
        message,
        loading,
        statusCards,
        userBio,
        handleBeneficiaryChange,
        handleTransferChange,
        handleNewAccountChange,
        handleApplyLoanChange,
        handleProfileFormChange,
        handleKycFile,
        submitKyc,
        submitBeneficiary,
        removeBeneficiary,
        submitTransfer,
        submitApplyLoan,
        handlePayEmi,
        loadStatement,
        openReceipt,
        submitNewAccount,
        submitProfileUpdate,
        handleLogout,
    } = useUserDashboardState();

    return (
        <main className="dashboard-page">
            <section className="dashboard-layout">

                <aside className="sidebar-container">
                    <div className="profile-identity-card">
                        <div className="card-banner-bg" />
                        <div className="profile-avatar-wrapper">
                            {profile?.profilePhotoPath ? (
                                <img
                                    src={`http://localhost:8080/${profile.profilePhotoPath.replace(/\\/g, '/')}`}
                                    alt="Sravan Kumar"
                                    className="profile-avatar-img"
                                    onError={(e) => {
                                        e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200";
                                    }}
                                />
                            ) : (
                                <div className="profile-avatar-placeholder">SK</div>
                            )}
                        </div>
                        <div className="profile-info-block">
                            <h3 className="profile-fullname">{profile?.fullName || "Gurram Sravankumar"}</h3>
                            <p className="profile-designation">{userBio}</p>

                            <div className="badges-wrapper">
                                <span className={`badge-pill status-${profile?.userStatus?.toLowerCase()}`}>
                                    Status: {profile?.userStatus || "PENDING"}
                                </span>
                                <span className={`badge-pill kyc-${profile?.kycStatus?.toLowerCase()}`}>
                                    KYC: {profile?.kycStatus || "PENDING"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <nav className="services-nav-menu">
                        <div className="menu-header">MENU SERVICES</div>
                        {[
                            { id: "profile", label: "👤 Profile Details" },
                            { id: "accounts", label: "💳 My Bank Accounts" },
                            { id: "kyc", label: "📄 Upload KYC Docs" },
                            { id: "beneficiaries", label: "👥 Beneficiary List" },
                            { id: "transfer", label: "📤 Send/Transfer Funds" },
                            { id: "loans", label: "💰 Loan Services" },
                            { id: "transactions", label: "⏱ Transaction History" },
                            { id: "statement", label: "📊 Mini Statement" }
                        ].map((btn) => (
                            <button
                                key={btn.id}
                                className={`nav-menu-btn ${activeTab === btn.id ? "active" : ""}`}
                                onClick={() => setActiveTab(btn.id)}
                            >
                                {btn.label}
                            </button>
                        ))}
                        <button className="nav-menu-btn logout" onClick={handleLogout}>
                            🚪 Sign Out Account
                        </button>
                    </nav>
                </aside>

                <section className="main-content-panel">
                    <div className="header-bar">
                        <h1>Premium Retail Banking</h1>
                        <p className="header-subtitle">Verified Secure Core Banking Integration</p>
                    </div>

                    {message && <div className="notice-banner">{message}</div>}

                    <div className="overview-status-row">
                        {statusCards.map(([label, value]) => (
                            <div className="overview-card" key={label}>
                                <span className="card-label">{label}</span>
                                <strong className="card-value">{value}</strong>
                            </div>
                        ))}
                    </div>

                    <div className="tab-pane-content">
                        {activeTab === "profile" && (
                            <ProfilePanel
                                profile={profile}
                                loading={loading}
                                isEditingProfile={isEditingProfile}
                                setIsEditingProfile={setIsEditingProfile}
                                profileForm={profileForm}
                                handleProfileFormChange={handleProfileFormChange}
                                submitProfileUpdate={submitProfileUpdate}
                                transactions={transactions}
                            />
                        )}

                        {activeTab === "accounts" && (
                            <AccountsPanel
                                accounts={accounts}
                                newAccountForm={newAccountForm}
                                handleNewAccountChange={handleNewAccountChange}
                                submitNewAccount={submitNewAccount}
                                loading={loading}
                            />
                        )}

                        {activeTab === "kyc" && (
                            <KycPanel
                                loading={loading}
                                submitKyc={submitKyc}
                                handleKycFile={handleKycFile}
                            />
                        )}

                        {activeTab === "beneficiaries" && (
                            <div className="panel data-panel">
                                <h2>Manage Beneficiary Registry</h2>
                                <p className="section-note">Add recipient accounts for instant peer-to-peer bank transfers.</p>
                                <form className="form-grid compact-form" onSubmit={submitBeneficiary}>
                                    <input name="beneficiaryName" placeholder="Full Name" value={beneficiaryForm.beneficiaryName} onChange={handleBeneficiaryChange} required />
                                    <input name="nickname" placeholder="Nickname" value={beneficiaryForm.nickname} onChange={handleBeneficiaryChange} required />
                                    <input name="accountNumber" placeholder="Account Number" value={beneficiaryForm.accountNumber} onChange={handleBeneficiaryChange} required />
                                    <input name="ifscCode" placeholder="IFSC Code" value={beneficiaryForm.ifscCode} onChange={handleBeneficiaryChange} required />
                                    <input name="bankName" placeholder="Bank Name" value={beneficiaryForm.bankName} onChange={handleBeneficiaryChange} required />
                                    <button className="submit-btn compact" disabled={loading}>Register Beneficiary</button>
                                </form>
                                <DataTable
                                    rows={beneficiaries}
                                    columns={["id", "beneficiaryName", "nickname", "accountNumber", "ifscCode", "bankName"]}
                                    action={(row) => <button className="danger-btn" onClick={() => removeBeneficiary(row.id)}>Delete</button>}
                                    emptyText="No registered beneficiaries."
                                />
                            </div>
                        )}

                        {activeTab === "transfer" && (
                            <TransferPanel
                                accounts={accounts}
                                beneficiaries={beneficiaries}
                                transferForm={transferForm}
                                handleTransferChange={handleTransferChange}
                                submitTransfer={submitTransfer}
                                loading={loading}
                            />
                        )}

                        {activeTab === "loans" && (
                            <LoansPanel
                                loans={loans}
                                accounts={accounts}
                                applyLoanForm={applyLoanForm}
                                handleApplyLoanChange={handleApplyLoanChange}
                                submitApplyLoan={submitApplyLoan}
                                handlePayEmi={handlePayEmi}
                                loading={loading}
                            />
                        )}

                        {activeTab === "transactions" && (
                            <TransactionsPanel
                                transactions={transactions}
                                receipt={receipt}
                                openReceipt={openReceipt}
                                setReceipt={setReceipt}
                            />
                        )}

                        {activeTab === "statement" && (
                            <StatementPanel
                                accounts={accounts}
                                statementAccountId={statementAccountId}
                                setStatementAccountId={setStatementAccountId}
                                loadStatement={loadStatement}
                                statement={statement}
                            />
                        )}
                    </div>
                </section>
            </section>
        </main>
    );
}

export default UserDashboard;
