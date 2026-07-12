import React from "react";

function StatementFilters({
    filters,
    handleFilterChange,
    handleResetFilters,
    handleExportCsv,
    hasRows,
}) {
    return (
        <div style={{ border: "1px solid #444", padding: "1rem", borderRadius: "8px", background: "#222", marginBottom: "1.5rem" }}>
            <h4 style={{ margin: "0 0 1.25rem 0", color: "#61dafb" }}>Filter & Search Transactions</h4>

            <div className="form-grid compact" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                <div>
                    <label style={{ fontSize: "0.8rem", color: "#aaa" }}>Search Text</label>
                    <input
                        type="text"
                        name="searchQuery"
                        placeholder="Keyword..."
                        value={filters.searchQuery}
                        onChange={handleFilterChange}
                        style={{ width: "100%", padding: "0.4rem", border: "1px solid #444", borderRadius: "4px", background: "#333", color: "#fff" }}
                    />
                </div>

                <div>
                    <label style={{ fontSize: "0.8rem", color: "#aaa" }}>Search By</label>
                    <select
                        name="searchType"
                        value={filters.searchType}
                        onChange={handleFilterChange}
                        style={{ width: "100%", padding: "0.4rem", border: "1px solid #444", borderRadius: "4px", background: "#333", color: "#fff" }}
                    >
                        <option value="all">Remarks & Reference</option>
                        <option value="referenceNumber">Reference Number Only</option>
                        <option value="remarks">Remarks Only</option>
                    </select>
                </div>

                <div>
                    <label style={{ fontSize: "0.8rem", color: "#aaa" }}>Transaction Type</label>
                    <select
                        name="typeFilter"
                        value={filters.typeFilter}
                        onChange={handleFilterChange}
                        style={{ width: "100%", padding: "0.4rem", border: "1px solid #444", borderRadius: "4px", background: "#333", color: "#fff" }}
                    >
                        <option value="">All Transactions</option>
                        <option value="CREDIT">CREDIT ONLY</option>
                        <option value="DEBIT">DEBIT ONLY</option>
                    </select>
                </div>

                <div>
                    <label style={{ fontSize: "0.8rem", color: "#aaa" }}>Min Amount (Rs)</label>
                    <input
                        type="number"
                        name="minAmount"
                        placeholder="Min Amount"
                        value={filters.minAmount}
                        onChange={handleFilterChange}
                        style={{ width: "100%", padding: "0.4rem", border: "1px solid #444", borderRadius: "4px", background: "#333", color: "#fff" }}
                    />
                </div>

                <div>
                    <label style={{ fontSize: "0.8rem", color: "#aaa" }}>Max Amount (Rs)</label>
                    <input
                        type="number"
                        name="maxAmount"
                        placeholder="Max Amount"
                        value={filters.maxAmount}
                        onChange={handleFilterChange}
                        style={{ width: "100%", padding: "0.4rem", border: "1px solid #444", borderRadius: "4px", background: "#333", color: "#fff" }}
                    />
                </div>

                <div>
                    <label style={{ fontSize: "0.8rem", color: "#aaa" }}>Start Date</label>
                    <input
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                        style={{ width: "100%", padding: "0.4rem", border: "1px solid #444", borderRadius: "4px", background: "#333", color: "#fff" }}
                    />
                </div>

                <div>
                    <label style={{ fontSize: "0.8rem", color: "#aaa" }}>End Date</label>
                    <input
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                        style={{ width: "100%", padding: "0.4rem", border: "1px solid #444", borderRadius: "4px", background: "#333", color: "#fff" }}
                    />
                </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", flexWrap: "wrap" }}>
                <button
                    type="button"
                    onClick={handleResetFilters}
                    style={{ background: "#444", border: "1px solid #555", color: "#fff", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                >
                    Reset Filters
                </button>
                <button
                    type="button"
                    onClick={handleExportCsv}
                    disabled={!hasRows}
                    style={{ background: "#4caf50", color: "#fff", padding: "0.5rem 1rem", border: "none", borderRadius: "4px", cursor: hasRows ? "pointer" : "not-allowed", fontSize: "12px" }}
                >
                    📥 Export Filtered Ledger (CSV)
                </button>
            </div>
        </div>
    );
}

export default StatementFilters;
