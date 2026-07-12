import React, { useState, useMemo } from "react";
import { sortSearchResults } from "../../utils/searchSorter";

function TransferPanel({
    accounts,
    beneficiaries,
    transferForm,
    handleTransferChange,
    submitTransfer,
    loading,
}) {
    const [benSearchQuery, setBenSearchQuery] = useState("");
    const [benSearchType, setBenSearchType] = useState("all");

    const filteredAndSortedBeneficiaries = useMemo(() => {
        if (!beneficiaries || !Array.isArray(beneficiaries)) return [];
        let items = beneficiaries;

        if (benSearchQuery) {
            const q = benSearchQuery.trim().toLowerCase();
            items = items.filter((b) => {
                if (benSearchType === "nickname") {
                    return (b.nickname || "").toLowerCase().includes(q);
                }
                if (benSearchType === "beneficiaryName") {
                    return (b.beneficiaryName || "").toLowerCase().includes(q);
                }
                if (benSearchType === "accountNumber") {
                    return (b.accountNumber || "").toLowerCase().includes(q);
                }
                return (
                    (b.nickname || "").toLowerCase().includes(q) ||
                    (b.beneficiaryName || "").toLowerCase().includes(q) ||
                    (b.accountNumber || "").toLowerCase().includes(q)
                );
            });

            items = sortSearchResults(items, benSearchQuery, (b) => {
                if (benSearchType === "nickname") return b.nickname || "";
                if (benSearchType === "beneficiaryName") return b.beneficiaryName || "";
                if (benSearchType === "accountNumber") return b.accountNumber || "";
                const qStr = benSearchQuery.toLowerCase();
                const nick = b.nickname || "";
                const name = b.beneficiaryName || "";
                if (nick.toLowerCase().includes(qStr)) return nick;
                if (name.toLowerCase().includes(qStr)) return name;
                return b.accountNumber || "";
            });
        }
        return items;
    }, [beneficiaries, benSearchQuery, benSearchType]);

    return (
        <form className="panel form-grid animate-fade-in" onSubmit={submitTransfer}>
            <h2>Transfer Money</h2>
            <label>From Account</label>
            <select name="accountId" value={transferForm.accountId} onChange={handleTransferChange} required>
                <option value="">Select account</option>
                {accounts.map((acc) => (
                    <option key={acc.accountId || acc.id} value={acc.accountId || acc.id}>
                        {acc.accountNumber} ({acc.accountType}) - Rs {acc.balance}
                    </option>
                ))}
            </select>

            <label>Search Beneficiary</label>
            <div style={{ display: "flex", gap: "0.25rem", marginBottom: "0.5rem" }}>
                <input
                    type="text"
                    placeholder="Enter name, nickname or account number..."
                    value={benSearchQuery}
                    onChange={(e) => setBenSearchQuery(e.target.value)}
                    style={{ flex: 1, padding: "0.5rem", borderRadius: "4px", border: "1px solid #444", background: "#222", color: "#fff" }}
                />
                <select
                    value={benSearchType}
                    onChange={(e) => setBenSearchType(e.target.value)}
                    style={{ width: "120px", padding: "0.5rem", borderRadius: "4px", border: "1px solid #444", background: "#222", color: "#fff", cursor: "pointer" }}
                >
                    <option value="all">Dropdown ▾</option>
                    <option value="nickname">Nickname</option>
                    <option value="beneficiaryName">Full Name</option>
                    <option value="accountNumber">Account No</option>
                </select>
            </div>

            <label>To Beneficiary</label>
            <select name="beneficiaryId" value={transferForm.beneficiaryId} onChange={handleTransferChange} required style={{ marginBottom: "1rem" }}>
                <option value="">Select beneficiary</option>
                {filteredAndSortedBeneficiaries.map((beneficiary) => (
                    <option key={beneficiary.id} value={beneficiary.id}>
                        {beneficiary.nickname ? `${beneficiary.nickname} (${beneficiary.beneficiaryName})` : beneficiary.beneficiaryName} - AC: {beneficiary.accountNumber}
                    </option>
                ))}
            </select>
            <label>Amount (Rs)</label>
            <input name="amount" type="number" placeholder="Amount" value={transferForm.amount} onChange={handleTransferChange} required />
            <label>Remarks</label>
            <input name="remarks" placeholder="Remarks" value={transferForm.remarks} onChange={handleTransferChange} />
            <button disabled={loading}>{loading ? "Transferring..." : "Transfer"}</button>
        </form>
    );
}

export default TransferPanel;
