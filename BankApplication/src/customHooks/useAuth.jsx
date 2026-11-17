import axios from "axios";
import initialUsers from "../data/users.json";
import initialAccounts from "../data/accounts.json";
import initialTransactions from "../data/transactions.json";
import initialBeneficiaries from "../data/beneficiaries.json";
import initialLoans from "../data/loans.json";
import initialAdminData from "../data/adminData.json";

const api = axios.create({
    baseURL: "https://banking-management-system-8xwa.onrender.com",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("status");
            localStorage.removeItem("kycStatus");
            localStorage.removeItem("customerId");
            window.location.href = import.meta.env.BASE_URL + "login";
        }
        return Promise.reject(error);
    }
);

// Helpers for Mock LocalStorage State
function getStored(key, fallback) {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    } catch {
        return fallback;
    }
}

function setStored(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error("Storage error:", e);
    }
}

function useAuth() {
    const register = async (userData) => {
        try {
            const payload = {
                ...userData,
                annualIncome: userData.annualIncome ? Number(userData.annualIncome) : null,
            };
            const response = await api.post("/auth/register", payload);
            return response.data;
        } catch {
            // Local fallback registration
            const users = getStored("bank_users", initialUsers);
            const newUser = {
                id: Date.now(),
                ...userData,
                customerId: "CUST-" + Math.floor(100000 + Math.random() * 900000),
                role: "USER",
                status: "ACTIVE",
                userStatus: "ACTIVE",
                kycStatus: "APPROVED",
                profilePhotoPath: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
            };
            users.push(newUser);
            setStored("bank_users", users);
            return { message: "Registration successful! You can now log in." };
        }
    };

    const login = async (credentials) => {
        const users = getStored("bank_users", initialUsers);
        const email = (credentials.email || "").trim().toLowerCase();
        const enteredPassword = credentials.password || "";

        // First check mock JSON data
        const matchedUser = users.find((u) => u.email.toLowerCase() === email);

        if (matchedUser) {
            if (matchedUser.password && matchedUser.password !== enteredPassword) {
                const err = new Error("Invalid password");
                err.response = { status: 401, data: { message: "Invalid email or password." } };
                throw err;
            }

            const token = "mock-jwt-token-" + matchedUser.id + "-" + Date.now();
            localStorage.setItem("token", token);
            localStorage.setItem("role", matchedUser.role);
            localStorage.setItem("status", matchedUser.status || "ACTIVE");
            localStorage.setItem("kycStatus", matchedUser.kycStatus || "APPROVED");
            localStorage.setItem("customerId", matchedUser.customerId || "CUST-939854");
            localStorage.setItem("currentUserEmail", matchedUser.email);

            return {
                token,
                role: matchedUser.role,
                status: matchedUser.status || "ACTIVE",
                kycStatus: matchedUser.kycStatus || "APPROVED",
                customerId: matchedUser.customerId || "CUST-939854",
            };
        }

        // Otherwise try remote API call
        try {
            const response = await api.post("/auth/login", credentials);
            const data = response.data;

            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.role);
                localStorage.setItem("status", data.status);
                localStorage.setItem("kycStatus", data.kycStatus);
                localStorage.setItem("customerId", data.customerId || "");
                localStorage.setItem("currentUserEmail", credentials.email);
            }
            return data;
        } catch (error) {
            // Fallback for default test user
            if (email === "gurramsravankr@gmail.com" && enteredPassword === "Sravan@9398") {
                const defaultUser = initialUsers[0];
                const token = "mock-jwt-token-sravan-" + Date.now();
                localStorage.setItem("token", token);
                localStorage.setItem("role", defaultUser.role);
                localStorage.setItem("status", defaultUser.status);
                localStorage.setItem("kycStatus", defaultUser.kycStatus);
                localStorage.setItem("customerId", defaultUser.customerId);
                localStorage.setItem("currentUserEmail", defaultUser.email);
                return {
                    token,
                    role: defaultUser.role,
                    status: defaultUser.status,
                    kycStatus: defaultUser.kycStatus,
                    customerId: defaultUser.customerId,
                };
            }
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("status");
        localStorage.removeItem("kycStatus");
        localStorage.removeItem("customerId");
        localStorage.removeItem("currentUserEmail");
    };

    const getProfile = async () => {
        try {
            const response = await api.get("/api/user/profile");
            return response.data;
        } catch {
            const users = getStored("bank_users", initialUsers);
            const currentEmail = localStorage.getItem("currentUserEmail") || "gurramsravankr@gmail.com";
            const user = users.find((u) => u.email.toLowerCase() === currentEmail.toLowerCase()) || users[0];
            return { ...user };
        }
    };

    const uploadKyc = async () => {
        const users = getStored("bank_users", initialUsers);
        const currentEmail = localStorage.getItem("currentUserEmail") || "gurramsravankr@gmail.com";
        const updated = users.map((u) =>
            u.email.toLowerCase() === currentEmail.toLowerCase() ? { ...u, kycStatus: "APPROVED" } : u
        );
        setStored("bank_users", updated);
        localStorage.setItem("kycStatus", "APPROVED");
        return { message: "KYC documents uploaded and verified successfully!" };
    };

    const getBeneficiaries = async () => {
        try {
            const response = await api.get("/api/user/beneficiaries");
            return response.data;
        } catch {
            return getStored("bank_beneficiaries", initialBeneficiaries);
        }
    };

    const addBeneficiary = async (beneficiary) => {
        try {
            const response = await api.post("/api/user/beneficiaries", beneficiary);
            return response.data;
        } catch {
            const list = getStored("bank_beneficiaries", initialBeneficiaries);
            const newBen = { id: Date.now(), ...beneficiary };
            const updated = [newBen, ...list];
            setStored("bank_beneficiaries", updated);
            return newBen;
        }
    };

    const deleteBeneficiary = async (beneficiaryId) => {
        try {
            const response = await api.delete(`/api/user/beneficiaries/${beneficiaryId}`);
            return response.data;
        } catch {
            const list = getStored("bank_beneficiaries", initialBeneficiaries);
            const updated = list.filter((b) => b.id !== Number(beneficiaryId));
            setStored("bank_beneficiaries", updated);
            return { message: "Beneficiary deleted successfully." };
        }
    };

    const transferMoney = async (transfer) => {
        try {
            const response = await api.post("/api/user/transfer", {
                ...transfer,
                accountId: Number(transfer.accountId),
                beneficiaryId: Number(transfer.beneficiaryId),
                amount: Number(transfer.amount),
            });
            return response.data;
        } catch {
            const accounts = getStored("bank_accounts", initialAccounts);
            const beneficiaries = getStored("bank_beneficiaries", initialBeneficiaries);
            const transactions = getStored("bank_transactions", initialTransactions);

            const amt = Number(transfer.amount);
            const accIndex = accounts.findIndex((a) => a.id === Number(transfer.accountId));
            const beneficiary = beneficiaries.find((b) => b.id === Number(transfer.beneficiaryId));

            if (accIndex !== -1 && accounts[accIndex].balance < amt) {
                const err = new Error("Insufficient funds");
                err.response = { data: { message: "Insufficient balance in selected account." } };
                throw err;
            }

            if (accIndex !== -1) {
                accounts[accIndex].balance -= amt;
                setStored("bank_accounts", accounts);
            }

            const ref = "TXN" + Date.now().toString().slice(-8);
            const newTxn = {
                id: Date.now(),
                referenceNumber: ref,
                transactionTitle: "Transfer to " + (beneficiary ? beneficiary.nickname : "Beneficiary"),
                fromAccountNumber: accIndex !== -1 ? accounts[accIndex].accountNumber : "SB939800101",
                toAccountNumber: beneficiary ? beneficiary.accountNumber : "BEN-987654321",
                beneficiaryNickname: beneficiary ? beneficiary.nickname : "Transfer Recipient",
                amount: amt,
                transactionType: "DEBIT",
                status: "SUCCESS",
                remarks: transfer.remarks || "Fund transfer",
                transactionTime: new Date().toISOString(),
                balanceAfter: accIndex !== -1 ? accounts[accIndex].balance : 150000,
            };

            setStored("bank_transactions", [newTxn, ...transactions]);
            return { message: `Transfer of Rs. ${amt.toLocaleString()} successful! Ref: ${ref}` };
        }
    };

    const getTransactions = async () => {
        try {
            const response = await api.get("/api/user/transactions");
            return response.data;
        } catch {
            return getStored("bank_transactions", initialTransactions);
        }
    };

    const getReceipt = async (referenceNumber) => {
        try {
            const response = await api.get(`/api/user/transactions/${referenceNumber}/receipt`);
            return response.data;
        } catch {
            const transactions = getStored("bank_transactions", initialTransactions);
            const txn = transactions.find((t) => t.referenceNumber === referenceNumber) || transactions[0];
            return {
                referenceNumber: txn.referenceNumber,
                transactionTitle: txn.transactionTitle || "Fund Transfer",
                fromAccountNumber: txn.fromAccountNumber,
                toAccountNumber: txn.toAccountNumber,
                amount: `Rs. ${Number(txn.amount).toLocaleString()}`,
                transactionType: txn.transactionType,
                status: txn.status,
                transactionTime: new Date(txn.transactionTime).toLocaleString(),
                remarks: txn.remarks || "Completed",
            };
        }
    };

    const getMiniStatement = async (accountId) => {
        try {
            const response = await api.get(`/api/user/accounts/${accountId}/statement`);
            return response.data;
        } catch {
            const accounts = getStored("bank_accounts", initialAccounts);
            const targetAcc = accounts.find((a) => a.id === Number(accountId)) || accounts[0];
            const transactions = getStored("bank_transactions", initialTransactions);
            return transactions.filter(
                (t) => t.fromAccountNumber === targetAcc.accountNumber || t.toAccountNumber === targetAcc.accountNumber
            );
        }
    };

    const getMyAccounts = async () => {
        try {
            const response = await api.get("/api/user/accounts");
            return response.data;
        } catch {
            return getStored("bank_accounts", initialAccounts);
        }
    };

    const openAccount = async (accountData) => {
        try {
            const response = await api.post("/api/user/accounts/open", accountData);
            return response.data;
        } catch {
            const accounts = getStored("bank_accounts", initialAccounts);
            const prefix = accountData.accountType === "CURRENT" ? "CA9398" : "SB9398";
            const newAcc = {
                id: Date.now(),
                accountNumber: prefix + Math.floor(10000 + Math.random() * 90000),
                accountType: accountData.accountType || "SAVINGS",
                balance: Number(accountData.initialDeposit) || 1000,
                branchName: accountData.branchName || "Banjara Hills Branch",
                status: "ACTIVE",
                createdAt: new Date().toISOString(),
            };
            const updated = [...accounts, newAcc];
            setStored("bank_accounts", updated);
            return newAcc;
        }
    };

    const getAccountDetails = async (accountId) => {
        try {
            const response = await api.get(`/api/user/accounts/${accountId}`);
            return response.data;
        } catch {
            const accounts = getStored("bank_accounts", initialAccounts);
            return accounts.find((a) => a.id === Number(accountId)) || accounts[0];
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await api.put("/api/user/profile", profileData);
            return response.data;
        } catch {
            const users = getStored("bank_users", initialUsers);
            const currentEmail = localStorage.getItem("currentUserEmail") || "gurramsravankr@gmail.com";
            const updated = users.map((u) =>
                u.email.toLowerCase() === currentEmail.toLowerCase() ? { ...u, ...profileData } : u
            );
            setStored("bank_users", updated);
            return { ...users[0], ...profileData };
        }
    };

    const applyForLoan = async (loanData) => {
        try {
            const response = await api.post("/api/user/loans/apply", loanData);
            return response.data;
        } catch {
            const loans = getStored("bank_loans", initialLoans);
            const amt = Number(loanData.amount);
            const months = Number(loanData.termMonths) || 12;
            const rate = loanData.loanType === "HOME_LOAN" ? 8.5 : 11.5;
            const emi = Math.round((amt * (1 + rate / 100)) / months);

            const newLoan = {
                id: Date.now(),
                loanId: "LN-2026-" + Math.floor(100000 + Math.random() * 900000),
                loanType: loanData.loanType || "PERSONAL",
                amount: amt,
                interestRate: rate,
                termMonths: months,
                emiAmount: emi,
                outstandingBalance: amt,
                status: "APPROVED",
                createdAt: new Date().toISOString(),
                approvedAt: new Date().toISOString(),
            };
            setStored("bank_loans", [newLoan, ...loans]);
            return newLoan;
        }
    };

    const getMyLoans = async () => {
        try {
            const response = await api.get("/api/user/loans");
            return response.data;
        } catch {
            return getStored("bank_loans", initialLoans);
        }
    };

    const payEmi = async (loanId, accountId) => {
        try {
            const response = await api.post(`/api/user/loans/${loanId}/pay-emi?accountId=${accountId}`);
            return response.data;
        } catch {
            const loans = getStored("bank_loans", initialLoans);
            const accounts = getStored("bank_accounts", initialAccounts);
            const loan = loans.find((l) => l.loanId === loanId || l.id === Number(loanId));
            const acc = accounts.find((a) => a.id === Number(accountId));

            if (loan && acc) {
                acc.balance -= loan.emiAmount;
                loan.outstandingBalance = Math.max(0, loan.outstandingBalance - loan.emiAmount);
                setStored("bank_accounts", accounts);
                setStored("bank_loans", loans);
            }
            return { message: "EMI payment processed successfully!" };
        }
    };

    // Admin Operations
    const getPendingKyc = async () => {
        try {
            const response = await api.get("/api/admin/kyc/pending");
            return response.data;
        } catch {
            return getStored("admin_pending_kyc", initialAdminData.pendingKyc);
        }
    };

    const approveKyc = async (userId) => {
        try {
            const response = await api.put(`/api/admin/kyc/${userId}/approve`);
            return response.data;
        } catch {
            const list = getStored("admin_pending_kyc", initialAdminData.pendingKyc);
            const updated = list.filter((u) => u.id !== Number(userId));
            setStored("admin_pending_kyc", updated);
            return { message: "KYC approved successfully." };
        }
    };

    const rejectKyc = async (userId) => {
        try {
            const response = await api.put(`/api/admin/kyc/${userId}/reject`);
            return response.data;
        } catch {
            const list = getStored("admin_pending_kyc", initialAdminData.pendingKyc);
            const updated = list.filter((u) => u.id !== Number(userId));
            setStored("admin_pending_kyc", updated);
            return { message: "KYC rejected." };
        }
    };

    const getAllCustomers = async () => {
        try {
            const response = await api.get("/api/admin/customers");
            return response.data;
        } catch {
            return getStored("admin_customers", initialAdminData.customers);
        }
    };

    const getAllAccounts = async () => {
        try {
            const response = await api.get("/api/admin/accounts");
            return response.data;
        } catch {
            return getStored("admin_accounts", initialAdminData.accounts);
        }
    };

    const getAllTransactions = async () => {
        try {
            const response = await api.get("/api/admin/transactions");
            return response.data;
        } catch {
            return getStored("admin_transactions", initialAdminData.transactions);
        }
    };

    const freezeAccount = async (accountId) => {
        try {
            const response = await api.put(`/api/admin/accounts/${accountId}/freeze`);
            return response.data;
        } catch {
            const accounts = getStored("admin_accounts", initialAdminData.accounts);
            const updated = accounts.map((a) => (a.id === Number(accountId) ? { ...a, status: "FROZEN" } : a));
            setStored("admin_accounts", updated);
            return { message: "Account frozen successfully." };
        }
    };

    const unfreezeAccount = async (accountId) => {
        try {
            const response = await api.put(`/api/admin/accounts/${accountId}/unfreeze`);
            return response.data;
        } catch {
            const accounts = getStored("admin_accounts", initialAdminData.accounts);
            const updated = accounts.map((a) => (a.id === Number(accountId) ? { ...a, status: "ACTIVE" } : a));
            setStored("admin_accounts", updated);
            return { message: "Account unfrozen successfully." };
        }
    };

    const adminDeposit = async (accountId, depositData) => {
        try {
            const response = await api.post(`/api/admin/accounts/${accountId}/deposit`, depositData);
            return response.data;
        } catch {
            const accounts = getStored("admin_accounts", initialAdminData.accounts);
            const updated = accounts.map((a) =>
                a.id === Number(accountId) ? { ...a, balance: a.balance + Number(depositData.amount) } : a
            );
            setStored("admin_accounts", updated);
            return { message: `Deposit of Rs. ${depositData.amount} successful.` };
        }
    };

    const adminWithdraw = async (accountId, withdrawData) => {
        try {
            const response = await api.post(`/api/admin/accounts/${accountId}/withdraw`, withdrawData);
            return response.data;
        } catch {
            const accounts = getStored("admin_accounts", initialAdminData.accounts);
            const updated = accounts.map((a) =>
                a.id === Number(accountId) ? { ...a, balance: Math.max(0, a.balance - Number(withdrawData.amount)) } : a
            );
            setStored("admin_accounts", updated);
            return { message: `Withdrawal of Rs. ${withdrawData.amount} successful.` };
        }
    };

    const getAuditLogs = async () => {
        try {
            const response = await api.get("/api/admin/audit-logs");
            return response.data;
        } catch {
            return getStored("admin_audit_logs", initialAdminData.auditLogs);
        }
    };

    const reverseTransaction = async (reversalData) => {
        try {
            const response = await api.post("/api/admin/transactions/reverse", reversalData);
            return response.data;
        } catch {
            return { message: `Transaction ${reversalData.referenceNumber} reversed successfully.` };
        }
    };

    const adminUpdateCustomer = async (userId, customerData) => {
        try {
            const response = await api.put(`/api/admin/customers/${userId}`, customerData);
            return response.data;
        } catch {
            const customers = getStored("admin_customers", initialAdminData.customers);
            const updated = customers.map((c) => (c.id === Number(userId) ? { ...c, ...customerData } : c));
            setStored("admin_customers", updated);
            return { message: "Customer updated successfully." };
        }
    };

    const getAllLoans = async () => {
        try {
            const response = await api.get("/api/admin/loans");
            return response.data;
        } catch {
            return getStored("admin_loans", initialAdminData.loans);
        }
    };

    const updateLoanStatus = async (loanId, status) => {
        try {
            const response = await api.post(`/api/admin/loans/${loanId}/status?status=${status}`);
            return response.data;
        } catch {
            const loans = getStored("admin_loans", initialAdminData.loans);
            const updated = loans.map((l) => (l.loanId === loanId || l.id === Number(loanId) ? { ...l, status } : l));
            setStored("admin_loans", updated);
            return { message: `Loan status updated to ${status}.` };
        }
    };

    const postSavingsInterest = async () => {
        try {
            const response = await api.post("/api/admin/batch/post-interest");
            return response.data;
        } catch {
            return { message: "Interest batch calculation processed for all accounts." };
        }
    };

    return {
        register,
        login,
        logout,
        getProfile,
        uploadKyc,
        getBeneficiaries,
        addBeneficiary,
        deleteBeneficiary,
        transferMoney,
        getTransactions,
        getReceipt,
        getMiniStatement,
        getPendingKyc,
        approveKyc,
        rejectKyc,
        getAllCustomers,
        getAllUsers: getAllCustomers,
        getAllAccounts,
        getAllTransactions,
        getMyAccounts,
        openAccount,
        getAccountDetails,
        updateProfile,
        freezeAccount,
        unfreezeAccount,
        adminDeposit,
        adminWithdraw,
        getAuditLogs,
        reverseTransaction,
        adminUpdateCustomer,
        applyForLoan,
        getMyLoans,
        payEmi,
        getAllLoans,
        updateLoanStatus,
        postSavingsInterest,
    };
}

export default useAuth;
