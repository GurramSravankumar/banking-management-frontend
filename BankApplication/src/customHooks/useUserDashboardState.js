import { useState, useEffect, useMemo } from "react";
import useAuth from "./useAuth";

const emptyBeneficiary = {
    beneficiaryName: "",
    nickname: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
};

const emptyTransfer = {
    accountId: "",
    beneficiaryId: "",
    amount: "",
    remarks: "",
};

const emptyNewAccount = {
    accountType: "SAVINGS",
    branchName: "Main Branch",
    initialDeposit: "1000",
};

const emptyApplyLoan = {
    amount: "",
    termMonths: "12",
    loanType: "PERSONAL",
};

const emptyProfileForm = {
    fullName: "",
    phone: "",
    occupation: "",
    annualIncome: "",
    nationality: "",
    houseNo: "",
    street: "",
    city: "",
    district: "",
    state: "",
    country: "",
    pincode: "",
};

export function useUserDashboardState() {
    const {
        addBeneficiary,
        deleteBeneficiary,
        getBeneficiaries,
        getMiniStatement,
        getProfile,
        getReceipt,
        getTransactions,
        transferMoney,
        uploadKyc,
        getMyAccounts,
        openAccount,
        updateProfile,
        applyForLoan,
        getMyLoans,
        payEmi,
    } = useAuth();

    const [activeTab, setActiveTab] = useState("profile");
    const [profile, setProfile] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [statement, setStatement] = useState([]);
    const [receipt, setReceipt] = useState(null);
    const [loans, setLoans] = useState([]);
    const [applyLoanForm, setApplyLoanForm] = useState(emptyApplyLoan);
    const [beneficiaryForm, setBeneficiaryForm] = useState(emptyBeneficiary);
    const [transferForm, setTransferForm] = useState(emptyTransfer);
    const [statementAccountId, setStatementAccountId] = useState("");
    const [kycFiles, setKycFiles] = useState({});
    const [newAccountForm, setNewAccountForm] = useState(emptyNewAccount);
    const [profileForm, setProfileForm] = useState(emptyProfileForm);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const statusCards = useMemo(() => [
        ["Customer ID", profile?.customerId || localStorage.getItem("customerId") || "Not created"],
        ["User Status", profile?.userStatus || localStorage.getItem("status") || "-"],
        ["KYC Status", profile?.kycStatus || localStorage.getItem("kycStatus") || "-"],
    ], [profile]);

    const userBio = useMemo(() => {
        if (!profile) return "Retail Banking Customer | Wealth Management Member";
        const occupation = profile.occupation || "Retail Banking Customer";
        const income = profile.annualIncome || 0;
        const incomeClass = income > 500000 ? "Privilege Wealth Member" : "Core Banking Partner";
        return `${occupation} | ${incomeClass} | SK Bank Gold`;
    }, [profile]);

    const loadProfile = async () => {
        try {
            const data = await getProfile();
            setProfile(data);
            setProfileForm({
                fullName: data.fullName || "",
                phone: data.phone || "",
                occupation: data.occupation || "",
                annualIncome: data.annualIncome || "",
                nationality: data.nationality || "",
                houseNo: data.houseNo || "",
                street: data.street || "",
                city: data.city || "",
                district: data.district || "",
                state: data.state || "",
                country: data.country || "",
                pincode: data.pincode || "",
            });
        } catch (error) {
            setMessage(error.response?.data?.message || "Unable to load profile.");
        }
    };

    const loadAccounts = async () => {
        try {
            const data = await getMyAccounts();
            setAccounts(data);
            if (data.length > 0) {
                setTransferForm(prev => ({
                    ...prev,
                    accountId: prev.accountId || String(data[0].accountId || data[0].id)
                }));
                setStatementAccountId(prev => prev || String(data[0].accountId || data[0].id));
            }
        } catch (error) {
            console.error("Unable to load accounts:", error);
        }
    };

    const loadBeneficiaries = async () => {
        try {
            setBeneficiaries(await getBeneficiaries());
        } catch (error) {
            setMessage(error.response?.data?.message || "Unable to load beneficiaries.");
        }
    };

    const loadTransactions = async () => {
        try {
            setTransactions(await getTransactions());
        } catch (error) {
            setMessage(error.response?.data?.message || "Unable to load transactions.");
        }
    };

    const loadLoans = async () => {
        try {
            const data = await getMyLoans();
            setLoans(data);
        } catch (error) {
            console.error("Unable to load loans:", error);
        }
    };

    useEffect(() => {
        loadProfile();
        loadAccounts();
        loadBeneficiaries();
        loadTransactions();
        loadLoans();
    }, []);

    const handleBeneficiaryChange = (e) => {
        setBeneficiaryForm({ ...beneficiaryForm, [e.target.name]: e.target.value });
    };

    const handleTransferChange = (e) => {
        setTransferForm({ ...transferForm, [e.target.name]: e.target.value });
    };

    const handleNewAccountChange = (e) => {
        setNewAccountForm({ ...newAccountForm, [e.target.name]: e.target.value });
    };

    const handleApplyLoanChange = (e) => {
        setApplyLoanForm({ ...applyLoanForm, [e.target.name]: e.target.value });
    };

    const handleProfileFormChange = (e) => {
        setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    };

    const handleKycFile = (e) => {
        setKycFiles({ ...kycFiles, [e.target.name]: e.target.files[0] });
    };

    const submitKyc = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const data = await uploadKyc(kycFiles);
            setMessage(data.message);
            await loadProfile();
        } catch (error) {
            setMessage(error.response?.data?.message || "KYC upload failed.");
        } finally {
            setLoading(false);
        }
    };

    const submitBeneficiary = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const data = await addBeneficiary(beneficiaryForm);
            setMessage(data);
            setBeneficiaryForm(emptyBeneficiary);
            await loadBeneficiaries();
        } catch (error) {
            setMessage(error.response?.data?.message || "Could not add beneficiary.");
        } finally {
            setLoading(false);
        }
    };

    const removeBeneficiary = async (id) => {
        setMessage("");
        try {
            setMessage(await deleteBeneficiary(id));
            await loadBeneficiaries();
        } catch (error) {
            setMessage(error.response?.data?.message || "Could not delete beneficiary.");
        }
    };

    const submitTransfer = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            setMessage(await transferMoney(transferForm));
            setTransferForm(emptyTransfer);
            await loadTransactions();
            await loadAccounts();
        } catch (error) {
            setMessage(error.response?.data?.message || "Transfer failed.");
        } finally {
            setLoading(false);
        }
    };

    const submitApplyLoan = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const payload = {
                ...applyLoanForm,
                amount: Number(applyLoanForm.amount),
                termMonths: Number(applyLoanForm.termMonths),
            };
            await applyForLoan(payload);
            setMessage("Loan application submitted successfully!");
            setApplyLoanForm(emptyApplyLoan);
            await loadLoans();
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to submit loan application.");
        } finally {
            setLoading(false);
        }
    };

    const handlePayEmi = async (loanId, bankAccountId) => {
        setLoading(true);
        setMessage("");
        try {
            const res = await payEmi(Number(loanId), Number(bankAccountId));
            setMessage(res);
            await loadLoans();
            await loadAccounts();
            await loadTransactions();
        } catch (error) {
            setMessage(error.response?.data?.message || "EMI payment failed.");
        } finally {
            setLoading(false);
        }
    };

    const loadStatement = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            setStatement(await getMiniStatement(statementAccountId));
        } catch (error) {
            setMessage(error.response?.data?.message || "Could not load statement.");
        }
    };

    const openReceipt = async (referenceNumber) => {
        try {
            setReceipt(await getReceipt(referenceNumber));
        } catch (error) {
            setMessage(error.response?.data?.message || "Could not load receipt.");
        }
    };

    const submitNewAccount = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const res = await openAccount({
                ...newAccountForm,
                initialDeposit: Number(newAccountForm.initialDeposit),
            });
            setMessage(res);
            setNewAccountForm(emptyNewAccount);
            await loadAccounts();
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to open account.");
        } finally {
            setLoading(false);
        }
    };

    const submitProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const updated = await updateProfile({
                ...profileForm,
                annualIncome: profileForm.annualIncome ? Number(profileForm.annualIncome) : null,
            });
            setMessage("Profile updated successfully!");
            setProfile(updated);
            setIsEditingProfile(false);
        } catch (error) {
            setMessage(error.response?.data?.message || "Profile update failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("status");
        localStorage.removeItem("kycStatus");
        localStorage.removeItem("customerId");
        window.location.href = import.meta.env.BASE_URL + "login";
    };

    return {
        activeTab,
        setActiveTab,
        profile,
        accounts,
        beneficiaries,
        transactions,
        statement,
        receipt,
        setReceipt,
        loans,
        applyLoanForm,
        beneficiaryForm,
        transferForm,
        statementAccountId,
        setStatementAccountId,
        newAccountForm,
        profileForm,
        isEditingProfile,
        setIsEditingProfile,
        message,
        loading,
        statusCards,
        userBio,
        handleBeneficiaryChange,
        handleTransferChange,
        handleNewAccountChange,
        handleApplyLoanChange,
        handleProfileFormChange,
        handleKycFile,
        submitKyc,
        submitBeneficiary,
        removeBeneficiary,
        submitTransfer,
        submitApplyLoan,
        handlePayEmi,
        loadStatement,
        openReceipt,
        submitNewAccount,
        submitProfileUpdate,
        handleLogout,
    };
}
