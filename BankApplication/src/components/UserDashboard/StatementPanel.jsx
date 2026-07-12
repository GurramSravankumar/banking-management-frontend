import React, { useState, useMemo } from "react";
import DataTable from "../DataTable";
import { sortSearchResults } from "../../utils/searchSorter";
import StatementFilters from "./StatementFilters";
import ReceiptModal from "./ReceiptModal";

function StatementPanel({
    accounts,
    statementAccountId,
    setStatementAccountId,
    loadStatement,
    statement,
}) {
    const [selectedTxn, setSelectedTxn] = useState(null);
    const [filters, setFilters] = useState({
        searchQuery: "",
        searchType: "all",
        typeFilter: "",
        minAmount: "",
        maxAmount: "",
        startDate: "",
        endDate: "",
    });

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleResetFilters = () => {
        setFilters({
            searchQuery: "",
            searchType: "all",
            typeFilter: "",
            minAmount: "",
            maxAmount: "",
            startDate: "",
            endDate: "",
        });
    };

    const filteredStatement = useMemo(() => {
        if (!statement || !Array.isArray(statement)) return [];
        let items = statement.filter((row) => {
            const remarks = (row.remarks || "").toLowerCase();
            const ref = (row.transactionReferenceNumber || row.referenceNumber || "").toLowerCase();
            const query = filters.searchQuery.toLowerCase();
            if (query) {
                if (filters.searchType === "referenceNumber") {
                    if (!ref.includes(query)) return false;
                } else if (filters.searchType === "remarks") {
                    if (!remarks.includes(query)) return false;
                } else {
                    if (!remarks.includes(query) && !ref.includes(query)) return false;
                }
            }

            if (filters.typeFilter && row.transactionType !== filters.typeFilter) return false;

            const amt = row.amount || 0;
            if (filters.minAmount && amt < parseFloat(filters.minAmount)) return false;
            if (filters.maxAmount && amt > parseFloat(filters.maxAmount)) return false;

            if (row.transactionTime) {
                const rowTime = new Date(row.transactionTime).getTime();
                if (filters.startDate) {
                    const startLimit = new Date(filters.startDate).getTime();
                    if (rowTime < startLimit) return false;
                }
                if (filters.endDate) {
                    const endLimit = new Date(filters.endDate).setHours(23, 59, 59, 999);
                    if (rowTime > endLimit) return false;
                }
            }

            return true;
        });

        if (filters.searchQuery) {
            items = sortSearchResults(items, filters.searchQuery, (row) => {
                if (filters.searchType === "referenceNumber") {
                    return row.transactionReferenceNumber || row.referenceNumber || "";
                }
                if (filters.searchType === "remarks") {
                    return row.remarks || "";
                }
                const qStr = filters.searchQuery.toLowerCase();
                const refVal = row.transactionReferenceNumber || row.referenceNumber || "";
                if (refVal.toLowerCase().includes(qStr)) return refVal;
                return row.remarks || "";
            });
        }

        return items;
    }, [statement, filters]);

    const handleExportCsv = () => {
        if (filteredStatement.length === 0) return;
        const headers = "Reference Number,Transaction Type,Amount,Balance After,Remarks,Date/Time\n";
        const rows = filteredStatement
            .map((r) => {
                const ref = r.transactionReferenceNumber || r.referenceNumber || "";
                const type = r.transactionType || "";
                const amount = r.amount || 0;
                const bal = r.balanceAfter || 0;
                const remarks = (r.remarks || "").replace(/"/g, '""');
                const time = r.transactionTime || "";
                return `"${ref}","${type}",${amount},${bal},"${remarks}","${time}"`;
            })
            .join("\n");

        const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `statement_account_${statementAccountId}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="panel animate-fade-in">
            <h2>Mini Statement</h2>
            <form className="inline-form" onSubmit={loadStatement} style={{ marginBottom: "1.5rem" }}>
                <select
                    value={statementAccountId}
                    onChange={(e) => setStatementAccountId(e.target.value)}
                    required
                    style={{ marginRight: "1rem", flex: 1, padding: "0.5rem", borderRadius: "4px", border: "1px solid #444", background: "#222", color: "#fff" }}
                >
                    <option value="">Select account</option>
                    {accounts.map((acc) => (
                        <option key={acc.accountId || acc.id} value={acc.accountId || acc.id}>
                            {acc.accountNumber} ({acc.accountType})
                        </option>
                    ))}
                </select>
                <button type="submit">Load Statement</button>
            </form>

            {statement && statement.length > 0 && (
                <StatementFilters
                    filters={filters}
                    handleFilterChange={handleFilterChange}
                    handleResetFilters={handleResetFilters}
                    handleExportCsv={handleExportCsv}
                    hasRows={filteredStatement.length > 0}
                />
            )}

            <DataTable
                rows={filteredStatement}
                columns={["transactionReferenceNumber", "transactionType", "amount", "balanceAfter", "remarks", "transactionTime"]}
                customRenderers={{
                    amount: (val) => `Rs. ${val.toLocaleString()}`,
                    balanceAfter: (val) => `Rs. ${val.toLocaleString()}`,
                    transactionTime: (val) => val ? new Date(val).toLocaleString() : "-",
                }}
                action={(row) => (
                    <button
                        type="button"
                        onClick={() => setSelectedTxn(row)}
                        style={{
                            padding: "6px 12px",
                            fontSize: "12px",
                            fontWeight: "700",
                            background: "var(--gradient-btn)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer"
                        }}
                    >
                        View Receipt
                    </button>
                )}
            />

            <ReceiptModal receipt={selectedTxn} onClose={() => setSelectedTxn(null)} />
        </div>
    );
}

export default StatementPanel;
