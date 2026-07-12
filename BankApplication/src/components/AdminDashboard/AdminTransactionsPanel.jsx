import React, { useState } from "react";
import DataTable from "../DataTable";
import { sortSearchResults } from "../../utils/searchSorter";

function AdminTransactionsPanel({
    transactions,
    activeTransactionReversal,
    setActiveTransactionReversal,
    reversalReason,
    setReversalReason,
    handleReverseTransactionSubmit,
    loading,
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchType, setSearchType] = useState("all");

    const filteredTransactions = (transactions || []).filter((tx) => {
        if (!searchQuery) return true;
        const q = searchQuery.trim().toLowerCase();
        if (searchType === "referenceNumber") {
            return (tx.referenceNumber || "").toLowerCase().includes(q);
        }
        if (searchType === "remarks") {
            return (tx.remarks || "").toLowerCase().includes(q);
        }
        return (
            (tx.referenceNumber || "").toLowerCase().includes(q) ||
            (tx.remarks || "").toLowerCase().includes(q)
        );
    });

    const sortedTransactions = sortSearchResults(filteredTransactions, searchQuery, (tx) => {
        if (searchType === "referenceNumber") return tx.referenceNumber;
        if (searchType === "remarks") return tx.remarks;
        const qStr = searchQuery.trim().toLowerCase();
        if ((tx.referenceNumber || "").toLowerCase().includes(qStr)) return tx.referenceNumber;
        return tx.remarks;
    });

    return (
        <div className="panel animate-fade-in">
            <h2>User Transactions</h2>

            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", alignItems: "center" }}>
                <div className="search-bar-wrapper" style={{ display: "flex", flex: 1, border: "1px solid #444", borderRadius: "4px", overflow: "hidden", background: "#222" }}>
                    <input
                        type="text"
                        placeholder="Search transactions here..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ flex: 1, padding: "0.5rem", border: "none", outline: "none", background: "transparent", color: "#fff" }}
                    />
                    <span style={{ padding: "0.5rem", color: "#888" }}>🔍</span>
                </div>
                <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #444", background: "#222", color: "#fff", cursor: "pointer" }}
                >
                    <option value="all">🔍 Search Type (All fields)</option>
                    <option value="referenceNumber">📄 Ref Number</option>
                    <option value="remarks">✏️ Remarks Only</option>
                </select>
            </div>

            <DataTable
                rows={sortedTransactions}
                columns={["id", "referenceNumber", "amount", "transactionType", "transactionMode", "status", "remarks", "transactionTime"]}
                renderExtra={(row) => (
                    row.status === "SUCCESS" && (
                        <button className="danger" onClick={() => setActiveTransactionReversal({ referenceNumber: row.referenceNumber })}>Reverse</button>
                    )
                )}
            />

            {activeTransactionReversal.referenceNumber && (
                <form onSubmit={handleReverseTransactionSubmit} className="admin-card form-grid" style={{ marginTop: "2rem", padding: "1.5rem" }}>
                    <h3>Reverse Transaction (Ref: {activeTransactionReversal.referenceNumber})</h3>
                    <label>Reason for Reversal</label>
                    <input
                        type="text"
                        value={reversalReason}
                        onChange={(e) => setReversalReason(e.target.value)}
                        required
                    />
                    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                        <button type="submit" disabled={loading}>Submit Reversal</button>
                        <button type="button" className="danger" onClick={() => setActiveTransactionReversal({ referenceNumber: null })}>Cancel</button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default AdminTransactionsPanel;
