import React, { useState } from "react";
import DataTable from "../DataTable";
import ApplyLoanForm from "./ApplyLoanForm";

function LoansPanel({
    loans,
    accounts,
    applyLoanForm,
    handleApplyLoanChange,
    submitApplyLoan,
    handlePayEmi,
    loading,
}) {
    const [selectedEmiPayment, setSelectedEmiPayment] = useState({ loanId: "", accountId: "" });

    const handlePayEmiClick = (e) => {
        e.preventDefault();
        if (!selectedEmiPayment.loanId || !selectedEmiPayment.accountId) return;
        handlePayEmi(selectedEmiPayment.loanId, selectedEmiPayment.accountId);
        setSelectedEmiPayment(prev => ({ ...prev, loanId: "" }));
    };

    const activeApprovedLoans = loans.filter((l) => l.status === "APPROVED");

    const customRenderers = {
        amount: (val) => `Rs. ${val.toLocaleString()}`,
        emiAmount: (val) => `Rs. ${val.toLocaleString()}`,
        outstandingBalance: (val) => `Rs. ${val.toLocaleString()}`,
        interestRate: (val) => `${val}%`,
        createdAt: (val) => val ? new Date(val).toLocaleDateString() : "-",
        approvedAt: (val) => val ? new Date(val).toLocaleDateString() : "-",
    };

    return (
        <div className="panel animate-fade-in">
            <h2>Loans Management</h2>

            <div style={{ marginBottom: "2rem" }}>
                <h3>My Active & Applied Loans</h3>
                {loans.length === 0 ? (
                    <p style={{ color: "#aaa" }}>No current loan portfolios found.</p>
                ) : (
                    <DataTable
                        rows={loans}
                        columns={["loanId", "loanType", "amount", "interestRate", "termMonths", "emiAmount", "outstandingBalance", "status", "createdAt"]}
                        customRenderers={customRenderers}
                    />
                )}
            </div>

            {activeApprovedLoans.length > 0 && (
                <form className="form-grid" onSubmit={handlePayEmiClick} style={{ marginBottom: "2rem", borderTop: "1px solid #444", paddingTop: "1.5rem" }}>
                    <h3>Repay Outstanding Loan EMI</h3>

                    <label>Select Loan Account</label>
                    <select
                        value={selectedEmiPayment.loanId}
                        onChange={(e) => setSelectedEmiPayment({ ...selectedEmiPayment, loanId: e.target.value })}
                        required
                    >
                        <option value="">-- Choose Approved Loan --</option>
                        {activeApprovedLoans.map((l) => (
                            <option key={l.loanId} value={l.loanId}>
                                {l.loanType} - Rs. {l.outstandingBalance.toLocaleString()} Outstanding (EMI: Rs. {l.emiAmount})
                            </option>
                        ))}
                    </select>

                    <label>Debit Bank Account</label>
                    <select
                        value={selectedEmiPayment.accountId}
                        onChange={(e) => setSelectedEmiPayment({ ...selectedEmiPayment, accountId: e.target.value })}
                        required
                    >
                        <option value="">-- Choose Account to Debit --</option>
                        {accounts.map((a) => (
                            <option key={a.accountId} value={a.accountId}>
                                {a.accountNumber} ({a.accountType}) - Balance: Rs. {a.balance.toLocaleString()}
                            </option>
                        ))}
                    </select>

                    <button type="submit" disabled={loading || !selectedEmiPayment.loanId || !selectedEmiPayment.accountId}>
                        {loading ? "Processing Repayment..." : "Pay Monthly EMI Now"}
                    </button>
                </form>
            )}

            <ApplyLoanForm
                applyLoanForm={applyLoanForm}
                handleApplyLoanChange={handleApplyLoanChange}
                submitApplyLoan={submitApplyLoan}
                loading={loading}
            />
        </div>
    );
}

export default LoansPanel;
