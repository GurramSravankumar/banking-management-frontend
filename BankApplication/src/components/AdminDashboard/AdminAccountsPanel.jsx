import React from "react";
import DataTable from "../DataTable";

function AdminAccountsPanel({
    accounts,
    handleFreezeAccount,
    handleUnfreezeAccount,
    setActiveAccountAction,
    activeAccountAction,
    amountForm,
    setAmountForm,
    handleAmountActionSubmit,
    loading,
}) {
    return (
        <div className="panel animate-fade-in">
            <h2>User Bank Accounts</h2>
            <DataTable
                rows={accounts}
                columns={["id", "accountNumber", "accountType", "accountStatus", "balance", "branchName", "ifscCode", "currency"]}
                renderExtra={(row) => (
                    <>
                        {row.accountStatus === "ACTIVE" ? (
                            <button className="danger" onClick={() => handleFreezeAccount(row.id)}>Freeze</button>
                        ) : (
                            <button onClick={() => handleUnfreezeAccount(row.id)}>Unfreeze</button>
                        )}
                        <button onClick={() => setActiveAccountAction({ type: "deposit", accountId: row.id })}>Deposit</button>
                        <button onClick={() => setActiveAccountAction({ type: "withdraw", accountId: row.id })}>Withdraw</button>
                    </>
                )}
            />

            {activeAccountAction.accountId && (
                <form onSubmit={handleAmountActionSubmit} className="admin-card form-grid" style={{ marginTop: "2rem", padding: "1.5rem" }}>
                    <h3>Account {activeAccountAction.type === "deposit" ? "Deposit" : "Withdrawal"} (Account ID: {activeAccountAction.accountId})</h3>
                    <label>Amount (Rs)</label>
                    <input
                        type="number"
                        min="1"
                        value={amountForm.amount}
                        onChange={(e) => setAmountForm({ ...amountForm, amount: e.target.value })}
                        required
                    />
                    <label>Remarks</label>
                    <input
                        type="text"
                        value={amountForm.remarks}
                        onChange={(e) => setAmountForm({ ...amountForm, remarks: e.target.value })}
                        required
                    />
                    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                        <button type="submit" disabled={loading}>Submit</button>
                        <button type="button" className="danger" onClick={() => setActiveAccountAction({ type: "", accountId: null })}>Cancel</button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default AdminAccountsPanel;
