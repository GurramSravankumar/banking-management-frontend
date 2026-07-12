import React from "react";
import DataTable from "../DataTable";

function AccountsPanel({
    accounts,
    newAccountForm,
    handleNewAccountChange,
    submitNewAccount,
    loading,
}) {
    return (
        <div className="panel animate-fade-in">
            <h2>My Bank Accounts</h2>
            <DataTable
                rows={accounts}
                columns={["id", "accountNumber", "accountType", "accountStatus", "balance", "branchName", "ifscCode"]}
            />

            <form className="form-grid" onSubmit={submitNewAccount} style={{ marginTop: "2rem" }}>
                <h3>Open a New Account</h3>
                <label>Account Type</label>
                <select name="accountType" value={newAccountForm.accountType} onChange={handleNewAccountChange}>
                    <option value="SAVINGS">Savings Account</option>
                    <option value="CHECKING">Checking Account</option>
                </select>

                <label>Branch Name</label>
                <input name="branchName" value={newAccountForm.branchName} onChange={handleNewAccountChange} required />

                <label>Initial Deposit (Rs)</label>
                <input name="initialDeposit" type="number" min="0" value={newAccountForm.initialDeposit} onChange={handleNewAccountChange} required />

                <button disabled={loading}>{loading ? "Opening..." : "Open Account"}</button>
            </form>
        </div>
    );
}

export default AccountsPanel;
