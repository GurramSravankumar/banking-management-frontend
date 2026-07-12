import axios from "axios";

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

function useAuth() {
    const register = async (userData) => {
        const payload = {
            ...userData,
            annualIncome: userData.annualIncome ? Number(userData.annualIncome) : null,
        };

        const response = await api.post("/auth/register", payload);
        return response.data;
    };

    const login = async (credentials) => {
        const response = await api.post("/auth/login", credentials);
        const data = response.data;

        if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("status", data.status);
            localStorage.setItem("kycStatus", data.kycStatus);
            localStorage.setItem("customerId", data.customerId || "");
        }

        return data;
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("status");
        localStorage.removeItem("kycStatus");
        localStorage.removeItem("customerId");
    };

    const getProfile = async () => {
        const response = await api.get("/api/user/profile");
        return response.data;
    };

    const uploadKyc = async (files) => {
        const formData = new FormData();
        formData.append("aadhaarDocument", files.aadhaarDocument);
        formData.append("panDocument", files.panDocument);
        formData.append("profilePhoto", files.profilePhoto);

        const response = await api.post("/user/kyc/upload", formData);
        return response.data;
    };

    const getBeneficiaries = async () => {
        const response = await api.get("/api/user/beneficiaries");
        return response.data;
    };

    const addBeneficiary = async (beneficiary) => {
        const response = await api.post("/api/user/beneficiaries", beneficiary);
        return response.data;
    };

    const deleteBeneficiary = async (beneficiaryId) => {
        const response = await api.delete(`/api/user/beneficiaries/${beneficiaryId}`);
        return response.data;
    };

    const transferMoney = async (transfer) => {
        const response = await api.post("/api/user/transfer", {
            ...transfer,
            accountId: Number(transfer.accountId),
            beneficiaryId: Number(transfer.beneficiaryId),
            amount: Number(transfer.amount),
        });
        return response.data;
    };

    const getTransactions = async () => {
        const response = await api.get("/api/user/transactions");
        return response.data;
    };

    const getReceipt = async (referenceNumber) => {
        const response = await api.get(`/api/user/transactions/${referenceNumber}/receipt`);
        return response.data;
    };

    const getMiniStatement = async (accountId) => {
        const response = await api.get(`/api/user/accounts/${accountId}/statement`);
        return response.data;
    };

    const getPendingKyc = async () => {
        const response = await api.get("/api/admin/kyc/pending");
        return response.data;
    };

    const approveKyc = async (userId) => {
        const response = await api.put(`/api/admin/kyc/${userId}/approve`);
        return response.data;
    };

    const rejectKyc = async (userId) => {
        const response = await api.put(`/api/admin/kyc/${userId}/reject`);
        return response.data;
    };

    const getAllCustomers = async () => {
        const response = await api.get("/api/admin/customers");
        return response.data;
    };

    const getAllAccounts = async () => {
        const response = await api.get("/api/admin/accounts");
        return response.data;
    };

    const getAllTransactions = async () => {
        const response = await api.get("/api/admin/transactions");
        return response.data;
    };

    const getMyAccounts = async () => {
        const response = await api.get("/api/user/accounts");
        return response.data;
    };

    const openAccount = async (accountData) => {
        const response = await api.post("/api/user/accounts/open", accountData);
        return response.data;
    };

    const getAccountDetails = async (accountId) => {
        const response = await api.get(`/api/user/accounts/${accountId}`);
        return response.data;
    };

    const updateProfile = async (profileData) => {
        const response = await api.put("/api/user/profile", profileData);
        return response.data;
    };



    const freezeAccount = async (accountId) => {
        const response = await api.put(`/api/admin/accounts/${accountId}/freeze`);
        return response.data;
    };

    const unfreezeAccount = async (accountId) => {
        const response = await api.put(`/api/admin/accounts/${accountId}/unfreeze`);
        return response.data;
    };

    const adminDeposit = async (accountId, depositData) => {
        const response = await api.post(`/api/admin/accounts/${accountId}/deposit`, depositData);
        return response.data;
    };

    const adminWithdraw = async (accountId, withdrawData) => {
        const response = await api.post(`/api/admin/accounts/${accountId}/withdraw`, withdrawData);
        return response.data;
    };

    const getAuditLogs = async () => {
        const response = await api.get("/api/admin/audit-logs");
        return response.data;
    };

    const reverseTransaction = async (reversalData) => {
        const response = await api.post("/api/admin/transactions/reverse", reversalData);
        return response.data;
    };

    const adminUpdateCustomer = async (userId, customerData) => {
        const response = await api.put(`/api/admin/customers/${userId}`, customerData);
        return response.data;
    };

    const applyForLoan = async (loanData) => {
        const response = await api.post("/api/user/loans/apply", loanData);
        return response.data;
    };

    const getMyLoans = async () => {
        const response = await api.get("/api/user/loans");
        return response.data;
    };

    const payEmi = async (loanId, accountId) => {
        const response = await api.post(`/api/user/loans/${loanId}/pay-emi?accountId=${accountId}`);
        return response.data;
    };

    const getAllLoans = async () => {
        const response = await api.get("/api/admin/loans");
        return response.data;
    };

    const updateLoanStatus = async (loanId, status) => {
        const response = await api.post(`/api/admin/loans/${loanId}/status?status=${status}`);
        return response.data;
    };

    const postSavingsInterest = async () => {
        const response = await api.post("/api/admin/batch/post-interest");
        return response.data;
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


