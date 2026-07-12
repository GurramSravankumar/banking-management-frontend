import React from "react";

function ApplyLoanForm({
    applyLoanForm,
    handleApplyLoanChange,
    submitApplyLoan,
    loading,
}) {
    const getInterestRate = (type) => {
        switch (type) {
            case "HOME": return 8.5;
            case "CAR": return 10.0;
            case "EDUCATION": return 9.0;
            case "PERSONAL":
            default:
                return 12.0;
        }
    };

    const calculateEstimatedEmi = () => {
        const amt = parseFloat(applyLoanForm.amount);
        const term = parseInt(applyLoanForm.termMonths);
        const type = applyLoanForm.loanType;

        if (isNaN(amt) || amt <= 0 || isNaN(term) || term <= 0) return 0;

        const rate = (getInterestRate(type) / 12.0) / 100.0;
        if (rate === 0) return (amt / term).toFixed(2);

        const emi = (amt * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
        return isNaN(emi) ? 0 : emi.toFixed(2);
    };

    return (
        <form className="form-grid" onSubmit={submitApplyLoan} style={{ borderTop: "1px solid #444", paddingTop: "1.5rem" }}>
            <h3>Apply for a New Loan</h3>

            <label>Loan Purpose / Type</label>
            <select
                name="loanType"
                value={applyLoanForm.loanType}
                onChange={handleApplyLoanChange}
            >
                <option value="PERSONAL">Personal Loan (12% Rate)</option>
                <option value="HOME">Home Loan (8.5% Rate)</option>
                <option value="CAR">Car Loan (10% Rate)</option>
                <option value="EDUCATION">Education Loan (9% Rate)</option>
            </select>

            <label>Loan Term Duration</label>
            <select
                name="termMonths"
                value={applyLoanForm.termMonths}
                onChange={handleApplyLoanChange}
            >
                <option value="12">12 Months (1 Year)</option>
                <option value="24">24 Months (2 Years)</option>
                <option value="36">36 Months (3 Years)</option>
                <option value="48">48 Months (4 Years)</option>
                <option value="60">60 Months (5 Years)</option>
            </select>

            <label>Borrow Principal Amount (Rs)</label>
            <input
                name="amount"
                type="number"
                min="1000"
                value={applyLoanForm.amount}
                onChange={handleApplyLoanChange}
                placeholder="Enter Principal Amount"
                required
            />

            <div className="status-grid" style={{ gridColumn: "span 2", marginTop: "1rem", marginBottom: "1rem" }}>
                <div className="status-card" style={{ padding: "0.75rem", background: "rgba(255,255,255,0.05)" }}>
                    <span>Applicable Rate</span>
                    <strong style={{ fontSize: "1.2rem", color: "#61dafb" }}>{getInterestRate(applyLoanForm.loanType)}% per annum</strong>
                </div>
                <div className="status-card" style={{ padding: "0.75rem", background: "rgba(255,255,255,0.05)" }}>
                    <span>Estimated Monthly Installment</span>
                    <strong style={{ fontSize: "1.2rem", color: "#4caf50" }}>Rs. {Number(calculateEstimatedEmi()).toLocaleString()} /mo</strong>
                </div>
            </div>

            <button type="submit" disabled={loading} style={{ gridColumn: "span 2" }}>
                {loading ? "Submitting Application..." : "Submit Loan Application"}
            </button>
        </form>
    );
}

export default ApplyLoanForm;
