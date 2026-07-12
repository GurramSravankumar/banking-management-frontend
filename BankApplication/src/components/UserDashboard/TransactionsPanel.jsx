import React, { useState, useMemo } from "react";
import DataTable from "../DataTable";
import ReceiptModal from "./ReceiptModal";

function TransactionsPanel({ transactions, receipt, openReceipt, setReceipt }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const filteredTransactions = useMemo(() => {
        if (!transactions) return [];
        return transactions.filter((row) => {
            const query = searchQuery.toLowerCase().trim();
            if (query) {
                const ref = (row.referenceNumber || "").toLowerCase();
                const title = (row.transactionTitle || "").toLowerCase();
                const nick = (row.beneficiaryNickname || "").toLowerCase();
                const rem = (row.remarks || "").toLowerCase();
                const fromAcc = (row.fromAccountNumber || "").toLowerCase();
                const toAcc = (row.toAccountNumber || "").toLowerCase();

                if (
                    !ref.includes(query) &&
                    !title.includes(query) &&
                    !nick.includes(query) &&
                    !rem.includes(query) &&
                    !fromAcc.includes(query) &&
                    !toAcc.includes(query)
                ) {
                    return false;
                }
            }

            if (row.transactionTime) {
                const rowTime = new Date(row.transactionTime).getTime();
                if (startDate) {
                    const startLimit = new Date(startDate).getTime();
                    if (rowTime < startLimit) return false;
                }
                if (endDate) {
                    const endLimit = new Date(endDate).setHours(23, 59, 59, 999);
                    if (rowTime > endLimit) return false;
                }
            }

            return true;
        });
    }, [transactions, searchQuery, startDate, endDate]);

    return (
        <div className="panel data-panel animate-fade-in">
            <h2>Real-time Transaction Journal</h2>

            <div style={{ border: "1px solid #cbd5e1", padding: "1rem", borderRadius: "8px", background: "#ffffff", marginBottom: "1.5rem" }}>
                <h4 style={{ margin: "0 0 1rem 0", color: "var(--text-primary)" }}>Filter & Search Transactions</h4>
                <div className="form-grid compact" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
                    <div>
                        <input
                            type="text"
                            placeholder="Search name, ref, or account..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: "100%", padding: "0.4rem", border: "1px solid var(--border-color)", borderRadius: "4px" }}
                        />
                    </div>
                    <div>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            style={{ width: "100%", padding: "0.4rem", border: "1px solid var(--border-color)", borderRadius: "4px" }}
                        />
                    </div>
                    <div>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            style={{ width: "100%", padding: "0.4rem", border: "1px solid var(--border-color)", borderRadius: "4px" }}
                        />
                    </div>
                </div>
                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                    <button
                        type="button"
                        onClick={() => {
                            setSearchQuery("");
                            setStartDate("");
                            setEndDate("");
                        }}
                        style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", color: "var(--text-primary)", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                    >
                        Reset Filters
                    </button>
                    {(searchQuery || startDate || endDate) && (
                        <span style={{ fontSize: "12px", color: "var(--text-secondary)", alignSelf: "center" }}>
                            Showing {filteredTransactions.length} of {transactions.length} entries
                        </span>
                    )}
                </div>
            </div>

            <DataTable
                rows={filteredTransactions}
                columns={["referenceNumber", "beneficiaryNickname", "transactionType", "amount", "remarks", "transactionTime"]}
                customRenderers={{
                    amount: (val) => `Rs. ${val.toLocaleString()}`,
                    transactionTime: (val) => val ? new Date(val).toLocaleString() : "-",
                }}
                action={(row) => (
                    <button
                        className="neutral-btn"
                        onClick={() => openReceipt(row.referenceNumber)}
                        style={{
                            padding: "6px 12px",
                            fontSize: "12px",
                            fontWeight: "750",
                            background: "var(--gradient-btn)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer"
                        }}
                    >
                        View Details
                    </button>
                )}
                emptyText="No transactions found."
            />

            <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />
        </div>
    );
}

export default TransactionsPanel;
