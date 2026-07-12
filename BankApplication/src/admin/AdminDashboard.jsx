import { useEffect, useState, useMemo } from "react";
import useAuth from "../customHooks/useAuth";
import DataTable from "../components/DataTable";
import PendingKycPanel from "../components/AdminDashboard/PendingKycPanel";
import AdminAccountsPanel from "../components/AdminDashboard/AdminAccountsPanel";
import AdminTransactionsPanel from "../components/AdminDashboard/AdminTransactionsPanel";
import AdminAuditLogsPanel from "../components/AdminDashboard/AdminAuditLogsPanel";
import "./AdminDashboard.css";
import { sortSearchResults } from "../utils/searchSorter";


const tabs = [
    ["overview", "Overview"],
    ["pendingKyc", "Pending KYC"],
    ["customers", "Customers"],
    ["accounts", "Accounts"],
    ["transactions", "Transactions"],
    ["auditLogs", "Audit Logs"],
    ["loans", "Loans Management"],
    ["batch", "Batch Operations"],
];

function AdminDashboard() {
    const {
        approveKyc,
        getAllAccounts,
        getAllCustomers,
        getAllTransactions,
        getPendingKyc,
        rejectKyc,
        freezeAccount,
        unfreezeAccount,
        adminDeposit,
        adminWithdraw,
        getAuditLogs,
        reverseTransaction,
        adminUpdateCustomer,
        getAllLoans,
        updateLoanStatus,
        postSavingsInterest,
    } = useAuth();

    const [activeTab, setActiveTab] = useState("overview");
    const [pendingKyc, setPendingKyc] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [adminLoans, setAdminLoans] = useState([]);

    const [customerSearchQuery, setCustomerSearchQuery] = useState("");
    const [customerSearchType, setCustomerSearchType] = useState("all");


    const [activeAccountAction, setActiveAccountAction] = useState({ type: "", accountId: null });
    const [amountForm, setAmountForm] = useState({ amount: "", remarks: "" });
    const [activeTransactionReversal, setActiveTransactionReversal] = useState({ referenceNumber: null });
    const [reversalReason, setReversalReason] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [viewingCustomer, setViewingCustomer] = useState(null);
    const [modalTransact, setModalTransact] = useState({ accountId: "", type: "deposit", amount: "", remarks: "" });

    const handleModalTransactionSubmit = async (e) => {
        e.preventDefault();
        if (!modalTransact.accountId) {
            window.alert("Please select an active account.");
            return;
        }
        setLoading(true);
        setMessage("");
        try {
            const payload = {
                amount: Number(modalTransact.amount),
                remarks: modalTransact.remarks,
            };
            const res = modalTransact.type === "deposit"
                ? await adminDeposit(Number(modalTransact.accountId), payload)
                : await adminWithdraw(Number(modalTransact.accountId), payload);
            setMessage(res);
            setModalTransact({ accountId: "", type: "deposit", amount: "", remarks: "" });
            setViewingCustomer(null);
            await loadAdminData();
        } catch (error) {
            setMessage(error.response?.data?.message || "Operation failed.");
        } finally {
            setLoading(false);
        }
    };

    const selectAccountForTransaction = (account) => {
        setModalTransact({
            accountId: String(account.id),
            type: "deposit",
            amount: "",
            remarks: "",
        });
    };

    const loadAdminData = async () => {
        try {
            const [kycData, customerData, accountData, transactionData, auditData, loanData] = await Promise.all([
                getPendingKyc(),
                getAllCustomers(),
                getAllAccounts(),
                getAllTransactions(),
                getAuditLogs(),
                getAllLoans(),
            ]);

            const sanitizeData = (data) => {
                if (!data) return [];
                if (typeof data === "string") {
                    try {
                        const parsed = JSON.parse(data);
                        return Array.isArray(parsed) ? parsed : [];
                    } catch (e) {
                        console.error("Failed to parse response data:", e);
                        return [];
                    }
                }
                return Array.isArray(data) ? data : [];
            };

            setPendingKyc(sanitizeData(kycData));
            setCustomers(sanitizeData(customerData));
            setAccounts(sanitizeData(accountData));
            setTransactions(sanitizeData(transactionData));
            setAuditLogs(sanitizeData(auditData));
            setAdminLoans(sanitizeData(loanData));
        } catch (error) {
            setMessage(error.response?.data?.message || "Unable to load admin data. Check admin token and backend.");
        }
    };

    useEffect(() => {
        loadAdminData();
    }, []);

    const handleKycAction = async (userId, action) => {
        setMessage("");

        try {
            const response = action === "approve" ? await approveKyc(userId) : await rejectKyc(userId);
            setMessage(response);
            await loadAdminData();
        } catch (error) {
            setMessage(error.response?.data?.message || error.response?.data || "KYC action failed.");
        }
    };

    const handleFreezeAccount = async (accountId) => {
        setMessage("");
        try {
            const res = await freezeAccount(accountId);
            setMessage(res);
            await loadAdminData();
        } catch (error) {
            setMessage(error.response?.data?.message || "Freeze failed.");
        }
    };

    const handleUnfreezeAccount = async (accountId) => {
        setMessage("");
        try {
            const res = await unfreezeAccount(accountId);
            setMessage(res);
            await loadAdminData();
        } catch (error) {
            setMessage(error.response?.data?.message || "Unfreeze failed.");
        }
    };

    const handleAmountActionSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const payload = {
                amount: Number(amountForm.amount),
                remarks: amountForm.remarks,
            };
            const res = activeAccountAction.type === "deposit"
                ? await adminDeposit(activeAccountAction.accountId, payload)
                : await adminWithdraw(activeAccountAction.accountId, payload);
            setMessage(res);
            setActiveAccountAction({ type: "", accountId: null });
            setAmountForm({ amount: "", remarks: "" });
            await loadAdminData();
        } catch (error) {
            setMessage(error.response?.data?.message || "Operation failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleReverseTransactionSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const res = await reverseTransaction({
                referenceNumber: activeTransactionReversal.referenceNumber,
                reason: reversalReason,
            });
            setMessage(res);
            setActiveTransactionReversal({ referenceNumber: null });
            setReversalReason("");
            await loadAdminData();
        } catch (error) {
            setMessage(error.response?.data?.message || "Reversal failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateLoanStatus = async (loanId, status) => {
        setLoading(true);
        setMessage("");
        try {
            const res = await updateLoanStatus(Number(loanId), status);
            setMessage(res);
            await loadAdminData();
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to update loan status.");
        } finally {
            setLoading(false);
        }
    };

    const handleTriggerInterest = async () => {
        setLoading(true);
        setMessage("");
        try {
            const res = await postSavingsInterest();
            setMessage(res);
            await loadAdminData();
        } catch (error) {
            setMessage(error.response?.data?.message || "Interest accrual process failed.");
        } finally {
            setLoading(false);
        }
    };


    const customerRenderers = {
        action: (val, row) => (
            <div style={{ display: "flex", gap: "0.5rem" }}>
                <button className="view-doc-link-btn" onClick={() => setViewingCustomer(row)}>
                    View Details
                </button>
                <button className="view-doc-link-btn" onClick={() => setEditingCustomer(row)}>
                    Edit
                </button>
            </div>
        )
    };


    useEffect(() => {
        if (editingCustomer) {
            setEditForm({
                fullName: editingCustomer.fullName || "",
                email: editingCustomer.email || "",
                phone: editingCustomer.phone || "",
                occupation: editingCustomer.occupation || "",
                annualIncome: editingCustomer.annualIncome || "",
                nationality: editingCustomer.nationality || "",
                houseNo: editingCustomer.houseNo || "",
                street: editingCustomer.street || "",
                city: editingCustomer.city || "",
                district: editingCustomer.district || "",
                state: editingCustomer.state || "",
                country: editingCustomer.country || "",
                pincode: editingCustomer.pincode || "",
                dateOfBirth: editingCustomer.dateOfBirth || "",
                gender: editingCustomer.gender || "MALE",
                aadhaarNumber: editingCustomer.aadhaarNumber || "",
                panNumber: editingCustomer.panNumber || "",
                role: editingCustomer.role || "USER",
                status: editingCustomer.status || "PENDING",
            });
        } else {
            setEditForm({});
        }
    }, [editingCustomer]);

    const handleCustomerUpdateSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const payload = {
                ...editForm,
                annualIncome: editForm.annualIncome ? Number(editForm.annualIncome) : null,
            };
            await adminUpdateCustomer(editingCustomer.id, payload);
            setMessage("Customer profile updated successfully!");
            setEditingCustomer(null);
            await loadAdminData();
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to update customer details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="admin-page animate-fade-in">
            <aside className="admin-nav">
                <h2>Admin</h2>
                {tabs.map(([key, label]) => (
                    <button
                        key={key}
                        className={activeTab === key ? "active" : ""}
                        onClick={() => setActiveTab(key)}
                    >
                        {label}
                    </button>
                ))}
            </aside>

            <section className="admin-main">
                <h1>Admin Dashboard</h1>
                {message && <div className="admin-notice">{message}</div>}

                {activeTab === "overview" && (
                    <div className="admin-stats">
                        <Stat label="Pending KYC" value={pendingKyc.length} />
                        <Stat label="Customers" value={customers.length} />
                        <Stat label="Accounts" value={accounts.length} />
                        <Stat label="Transactions" value={transactions.length} />
                    </div>
                )}

                {activeTab === "pendingKyc" && (
                    <PendingKycPanel
                        pendingKyc={pendingKyc}
                        handleKycAction={handleKycAction}
                    />
                )}

                {activeTab === "customers" && (() => {
                    const filteredCustomers = customers.filter(c => {
                        if (!customerSearchQuery) return true;
                        const q = customerSearchQuery.trim().toLowerCase();
                        if (customerSearchType === "fullName") return (c.fullName || "").toLowerCase().includes(q);
                        if (customerSearchType === "email") return (c.email || "").toLowerCase().includes(q);
                        if (customerSearchType === "customerId") return (c.customerId || "").toLowerCase().includes(q);
                        return (
                            (c.fullName || "").toLowerCase().includes(q) ||
                            (c.email || "").toLowerCase().includes(q) ||
                            (c.customerId || "").toLowerCase().includes(q)
                        );
                    });

                    const sortedCustomers = sortSearchResults(filteredCustomers, customerSearchQuery, c => {
                        if (customerSearchType === "fullName") return c.fullName;
                        if (customerSearchType === "email") return c.email;
                        if (customerSearchType === "customerId") return c.customerId;
                        
                        const qStr = customerSearchQuery.trim().toLowerCase();
                        if ((c.fullName || "").toLowerCase().includes(qStr)) return c.fullName;
                        if ((c.email || "").toLowerCase().includes(qStr)) return c.email;
                        return c.customerId;
                    });

                    return (
                        <div className="panel">
                            <h2>Customers List</h2>
                            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", alignItems: "center" }}>
                                <div className="search-bar-wrapper" style={{ display: "flex", flex: 1, border: "1px solid #444", borderRadius: "4px", overflow: "hidden", background: "#222" }}>
                                    <input
                                        type="text"
                                        placeholder="Search customer here..."
                                        value={customerSearchQuery}
                                        onChange={(e) => setCustomerSearchQuery(e.target.value)}
                                        style={{ flex: 1, padding: "0.5rem", border: "none", outline: "none", background: "transparent", color: "#fff" }}
                                    />
                                    <span style={{ padding: "0.5rem", color: "#888" }}>🔍</span>
                                </div>
                                <select
                                    value={customerSearchType}
                                    onChange={(e) => setCustomerSearchType(e.target.value)}
                                    style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #444", background: "#222", color: "#fff", cursor: "pointer" }}
                                >
                                    <option value="all">🔍 Search Type (All fields)</option>
                                    <option value="fullName">👤 Name Only</option>
                                    <option value="email">📧 Email Only</option>
                                    <option value="customerId">💳 Customer ID Only</option>
                                </select>
                            </div>
                            <DataTable
                                rows={sortedCustomers}
                                columns={["id", "customerId", "fullName", "email", "phone", "role", "status", "action"]}
                                customRenderers={customerRenderers}
                            />
                        </div>
                    );
                })()}

                {activeTab === "accounts" && (
                    <AdminAccountsPanel
                        accounts={accounts}
                        handleFreezeAccount={handleFreezeAccount}
                        handleUnfreezeAccount={handleUnfreezeAccount}
                        setActiveAccountAction={setActiveAccountAction}
                        activeAccountAction={activeAccountAction}
                        amountForm={amountForm}
                        setAmountForm={setAmountForm}
                        handleAmountActionSubmit={handleAmountActionSubmit}
                        loading={loading}
                    />
                )}

                {activeTab === "transactions" && (
                    <AdminTransactionsPanel
                        transactions={transactions}
                        activeTransactionReversal={activeTransactionReversal}
                        setActiveTransactionReversal={setActiveTransactionReversal}
                        reversalReason={reversalReason}
                        setReversalReason={setReversalReason}
                        handleReverseTransactionSubmit={handleReverseTransactionSubmit}
                        loading={loading}
                    />
                )}

                {activeTab === "auditLogs" && (
                    <AdminAuditLogsPanel
                        auditLogs={auditLogs}
                    />
                )}

                {activeTab === "loans" && (
                    <div className="panel">
                        <h2>Loans Applications</h2>
                        {adminLoans.length === 0 ? (
                            <p style={{ color: "#aaa" }}>No loan applications found.</p>
                        ) : (
                            <DataTable
                                rows={adminLoans}
                                columns={["loanId", "applicantName", "applicantEmail", "loanType", "amount", "interestRate", "termMonths", "emiAmount", "outstandingBalance", "status", "action"]}
                                customRenderers={{
                                    amount: (val) => `Rs. ${val.toLocaleString()}`,
                                    emiAmount: (val) => `Rs. ${val.toLocaleString()}`,
                                    outstandingBalance: (val) => `Rs. ${val.toLocaleString()}`,
                                    interestRate: (val) => `${val}%`,
                                    action: (val, row) => (
                                        row.status === "PENDING" ? (
                                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                                <button
                                                    className="btn-submit"
                                                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem" }}
                                                    onClick={() => handleUpdateLoanStatus(row.loanId, "APPROVED")}
                                                    disabled={loading}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className="btn-cancel"
                                                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem" }}
                                                    onClick={() => handleUpdateLoanStatus(row.loanId, "REJECTED")}
                                                    disabled={loading}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: "0.85rem", color: row.status === "APPROVED" ? "#4caf50" : row.status === "PAID" ? "#2196f3" : "#f44336" }}>
                                                Completed ({row.status})
                                            </span>
                                        )
                                    )
                                }}
                            />
                        )}
                    </div>
                )}

                {activeTab === "batch" && (
                    <div className="panel select-card-wrapper animate-fade-in" style={{ padding: "2rem" }}>
                        <h2>Automated Batch Processing</h2>
                        <p style={{ color: "#aaa", marginBottom: "1.5rem" }}>
                            Trigger end-of-month and daily system processing tasks.
                        </p>

                        <div style={{ border: "1px solid #444", padding: "1.5rem", borderRadius: "8px", background: "rgba(255,255,255,0.02)" }}>
                            <h3>Simulate Savings Interest Accrual</h3>
                            <p style={{ fontSize: "0.95rem", color: "#bbb", marginBottom: "1.5rem" }}>
                                Calculates monthly savings interest (annual rate of 3.0%, divided by 12 months) for every active savings account in the system, posts transaction ledger credits, and records system audit logging tags.
                            </p>
                            <button
                                className="btn-submit"
                                onClick={handleTriggerInterest}
                                disabled={loading}
                                style={{ padding: "0.75rem 1.5rem" }}
                            >
                                {loading ? "Running Interest Accrual Batch..." : "Run Monthly Interest Accrual Now"}
                            </button>
                        </div>
                    </div>
                )}
            </section>

            {editingCustomer && (
                <div className="doc-modal-overlay" onClick={() => setEditingCustomer(null)}>
                    <div className="doc-modal-content edit-customer-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setEditingCustomer(null)}>&times;</button>
                        <h2>Edit Customer Profile</h2>
                        <form onSubmit={handleCustomerUpdateSubmit} className="edit-customer-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        value={editForm.fullName || ""}
                                        onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={editForm.email || ""}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input
                                        type="text"
                                        value={editForm.phone || ""}
                                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Date of Birth</label>
                                    <input
                                        type="date"
                                        value={editForm.dateOfBirth || ""}
                                        onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Gender</label>
                                    <select
                                        value={editForm.gender || ""}
                                        onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                                    >
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Occupation</label>
                                    <input
                                        type="text"
                                        value={editForm.occupation || ""}
                                        onChange={(e) => setEditForm({ ...editForm, occupation: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Annual Income (INR)</label>
                                    <input
                                        type="number"
                                        value={editForm.annualIncome || ""}
                                        onChange={(e) => setEditForm({ ...editForm, annualIncome: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Nationality</label>
                                    <input
                                        type="text"
                                        value={editForm.nationality || ""}
                                        onChange={(e) => setEditForm({ ...editForm, nationality: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>House Number</label>
                                    <input
                                        type="text"
                                        value={editForm.houseNo || ""}
                                        onChange={(e) => setEditForm({ ...editForm, houseNo: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Street</label>
                                    <input
                                        type="text"
                                        value={editForm.street || ""}
                                        onChange={(e) => setEditForm({ ...editForm, street: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>City</label>
                                    <input
                                        type="text"
                                        value={editForm.city || ""}
                                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>District</label>
                                    <input
                                        type="text"
                                        value={editForm.district || ""}
                                        onChange={(e) => setEditForm({ ...editForm, district: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>State</label>
                                    <input
                                        type="text"
                                        value={editForm.state || ""}
                                        onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Country</label>
                                    <input
                                        type="text"
                                        value={editForm.country || ""}
                                        onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Pincode</label>
                                    <input
                                        type="text"
                                        value={editForm.pincode || ""}
                                        onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Aadhaar Number</label>
                                    <input
                                        type="text"
                                        value={editForm.aadhaarNumber || ""}
                                        onChange={(e) => setEditForm({ ...editForm, aadhaarNumber: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>PAN Number</label>
                                    <input
                                        type="text"
                                        value={editForm.panNumber || ""}
                                        onChange={(e) => setEditForm({ ...editForm, panNumber: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Role</label>
                                    <select
                                        value={editForm.role || ""}
                                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                    >
                                        <option value="USER">User</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <select
                                        value={editForm.status || ""}
                                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="APPROVED">Approved</option>
                                        <option value="REJECTED">Rejected</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn-cancel" onClick={() => setEditingCustomer(null)}>Cancel</button>
                                <button type="submit" className="btn-submit" disabled={loading}>
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {viewingCustomer && (
                <div className="doc-modal-overlay" onClick={() => setViewingCustomer(null)}>
                    <div className="doc-modal-content customer-details-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setViewingCustomer(null)}>&times;</button>
                        <h2>Customer Profile: {viewingCustomer.fullName}</h2>

                        {}
                        <div className="detail-section">
                            <h3>Personal Information</h3>
                            <div className="detail-grid">
                                <p><span>Customer ID:</span> {viewingCustomer.customerId || "-"}</p>
                                <p><span>Email:</span> {viewingCustomer.email}</p>
                                <p><span>Phone:</span> {viewingCustomer.phone}</p>
                                <p><span>Gender:</span> {viewingCustomer.gender || "-"}</p>
                                <p><span>Date of Birth:</span> {viewingCustomer.dateOfBirth || "-"}</p>
                                <p><span>Occupation:</span> {viewingCustomer.occupation || "-"}</p>
                                <p><span>Annual Income:</span> {viewingCustomer.annualIncome ? `Rs. ${viewingCustomer.annualIncome.toLocaleString()}` : "-"}</p>
                                <p><span>Nationality:</span> {viewingCustomer.nationality || "-"}</p>
                                <p><span>Address:</span> {`${viewingCustomer.houseNo || ""}, ${viewingCustomer.street || ""}, ${viewingCustomer.city || ""}, ${viewingCustomer.district || ""}, ${viewingCustomer.state || ""} ${viewingCustomer.pincode || ""}`.trim() || "-"}</p>
                                <p><span>Status:</span> <strong>{viewingCustomer.status}</strong></p>
                            </div>
                        </div>

                        {}
                        <div className="detail-section">
                            <h3>Bank Accounts</h3>
                            {(() => {
                                const customerAccounts = accounts.filter(acc => acc.user?.id === viewingCustomer.id);
                                if (customerAccounts.length === 0) {
                                    return <p style={{ color: "#aaa" }}>No bank accounts found for this customer.</p>;
                                }
                                return (
                                    <DataTable
                                        rows={customerAccounts}
                                        columns={["id", "accountNumber", "accountType", "accountStatus", "balance", "branchName", "ifscCode", "currency"]}
                                        renderExtra={(row) => (
                                            <>
                                                {row.accountStatus === "ACTIVE" ? (
                                                    <button className="danger btn-small" onClick={() => handleFreezeAccount(row.id)}>Freeze</button>
                                                ) : (
                                                    <button className="btn-small" onClick={() => handleUnfreezeAccount(row.id)}>Unfreeze</button>
                                                )}
                                                <button className="btn-small" style={{ marginLeft: "0.25rem" }} onClick={() => selectAccountForTransaction(row)}>Transact</button>
                                            </>
                                        )}
                                    />
                                );
                            })()}
                        </div>

                        {}
                        <div className="detail-section">
                            <h3>Add Transaction</h3>
                            {(() => {
                                const customerAccounts = accounts.filter(acc => acc.user?.id === viewingCustomer.id && acc.accountStatus === "ACTIVE");
                                if (customerAccounts.length === 0) {
                                    return <p style={{ color: "#aaa" }}>No active accounts available to perform transactions.</p>;
                                }
                                return (
                                    <form onSubmit={handleModalTransactionSubmit} className="modal-transact-form">
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label>Select Account</label>
                                                <select
                                                    value={modalTransact.accountId}
                                                    onChange={(e) => setModalTransact({ ...modalTransact, accountId: e.target.value })}
                                                    required
                                                >
                                                    <option value="">-- Choose Account --</option>
                                                    {customerAccounts.map(acc => (
                                                        <option key={acc.id} value={acc.id}>
                                                            {acc.accountNumber} ({acc.accountType}) - Balance: Rs. {acc.balance.toLocaleString()}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Transaction Type</label>
                                                <select
                                                    value={modalTransact.type}
                                                    onChange={(e) => setModalTransact({ ...modalTransact, type: e.target.value })}
                                                    required
                                                >
                                                    <option value="deposit">Deposit</option>
                                                    <option value="withdraw">Withdraw</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Amount (Rs)</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={modalTransact.amount}
                                                    onChange={(e) => setModalTransact({ ...modalTransact, amount: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Remarks</label>
                                                <input
                                                    type="text"
                                                    value={modalTransact.remarks}
                                                    onChange={(e) => setModalTransact({ ...modalTransact, remarks: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <button type="submit" className="btn-submit" disabled={loading} style={{ marginTop: "1rem" }}>
                                            {loading ? "Processing..." : "Submit Transaction"}
                                        </button>
                                    </form>
                                );
                            })()}
                        </div>

                        {}
                        <div className="detail-section" style={{ borderBottom: "none", paddingBottom: 0 }}>
                            <h3>Transaction History</h3>
                            {(() => {
                                const customerAccounts = accounts.filter(acc => acc.user?.id === viewingCustomer.id);
                                const accountIds = customerAccounts.map(acc => acc.id);
                                const customerTransactions = transactions.filter(t =>
                                    (t.sourceAccount && accountIds.includes(t.sourceAccount.id)) ||
                                    (t.destinationAccount && accountIds.includes(t.destinationAccount.id))
                                );
                                if (customerTransactions.length === 0) {
                                    return <p style={{ color: "#aaa" }}>No transactions found for this customer.</p>;
                                }
                                return (
                                    <DataTable
                                        rows={customerTransactions}
                                        columns={["referenceNumber", "transactionType", "amount", "status", "remarks", "transactionTime"]}
                                    />
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

function Stat({ label, value }) {
    return (
        <div className="admin-stat">
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    );
}

export default AdminDashboard;
