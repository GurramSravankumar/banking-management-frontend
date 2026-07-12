const axios = require("axios");

const BASE_URL = "http://localhost:8080";

async function runLoanTests() {
    console.log("=== STARTING LOAN SYSTEM INTEGRATION TESTS ===");

    // Step 1: Login
    let token = "";
    try {
        console.log("Logging in as Admin User...");
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: "admintest@skbank.com",
            password: "password123"
        });
        token = loginRes.data.token;
        console.log("Logged in successfully. Token length:", token.length);
    } catch (e) {
        console.error("Login failed:", e.response?.data || e.message);
        return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    // Step 2: Open account if none exists, or fetch active accounts
    let accountId = null;
    let balanceBefore = 0;
    try {
        console.log("Fetching bank accounts...");
        const accsRes = await axios.get(`${BASE_URL}/api/user/accounts`, { headers });
        const accounts = accsRes.data;
        if (accounts.length === 0) {
            console.log("No accounts found. Opening SAVINGS account...");
            const openRes = await axios.post(`${BASE_URL}/api/user/accounts`, {
                accountType: "SAVINGS",
                branchName: "Main Branch",
                initialDeposit: 50000
            }, { headers });
            console.log("Open Account Result:", openRes.data);
            const freshAccs = await axios.get(`${BASE_URL}/api/user/accounts`, { headers });
            accountId = freshAccs.data[0].accountId;
            balanceBefore = freshAccs.data[0].balance;
        } else {
            console.log("Accounts found:", accounts);
            accountId = accounts[0].accountId;
            balanceBefore = accounts[0].balance;
        }
        console.log(`Using Account ID: ${accountId}. Current Balance: Rs. ${balanceBefore}`);
    } catch (e) {
        console.error("Fetching accounts failed:", e.response?.data || e.message);
        return;
    }

    // Step 3: Apply for Loan
    let loanId = null;
    try {
        console.log("Applying for a HOME loan of Rs. 15,000 for 12 months...");
        const applyRes = await axios.post(`${BASE_URL}/api/user/loans/apply`, {
            amount: 15000,
            termMonths: 12,
            loanType: "HOME"
        }, { headers });
        const loan = applyRes.data;
        loanId = loan.loanId;
        console.log("Loan Application Response:", loan);
        console.log(`Created Loan ID: ${loanId}. Status: ${loan.status}. EMI: Rs. ${loan.emiAmount}`);
    } catch (e) {
        console.error("Loan application failed:", e.response?.data || e.message);
        return;
    }

    // Step 4: Admin list loans
    try {
        console.log("Listing all loans as Admin...");
        const allRes = await axios.get(`${BASE_URL}/api/admin/loans`, { headers });
        console.log(`Found ${allRes.data.length} total loan applications in bank system.`);
    } catch (e) {
        console.error("Listing loans failed:", e.response?.data || e.message);
        return;
    }

    // Step 5: Admin Approves Loan
    try {
        console.log(`Approving Loan ID: ${loanId}...`);
        const approveRes = await axios.post(`${BASE_URL}/api/admin/loans/${loanId}/status?status=APPROVED`, {}, { headers });
        console.log("Approval result:", approveRes.data);
    } catch (e) {
        console.error("Loan approval failed:", e.response?.data || e.message);
        return;
    }

    // Step 6: Verify Disbursal (Balance should increase by 15000)
    let balanceAfterLoan = 0;
    try {
        console.log("Verifying balances post loan approval disbursal...");
        const accsRes = await axios.get(`${BASE_URL}/api/user/accounts`, { headers });
        const acc = accsRes.data.find(a => a.accountId === accountId);
        balanceAfterLoan = acc.balance;
        console.log(`Balance after disbursal: Rs. ${balanceAfterLoan} (Before: Rs. ${balanceBefore}). Difference: Rs. ${balanceAfterLoan - balanceBefore}`);
    } catch (e) {
        console.error("Verifying balance failed:", e.response?.data || e.message);
        return;
    }

    // Step 7: Repay EMI
    try {
        console.log(`Paying EMI for Loan ID: ${loanId} from Account ID: ${accountId}...`);
        const payRes = await axios.post(`${BASE_URL}/api/user/loans/${loanId}/pay-emi?accountId=${accountId}`, {}, { headers });
        console.log("EMI payment Result:", payRes.data);

        // Fetch balances again
        const accsRes = await axios.get(`${BASE_URL}/api/user/accounts`, { headers });
        const acc = accsRes.data.find(a => a.accountId === accountId);
        const myLoansRes = await axios.get(`${BASE_URL}/api/user/loans`, { headers });
        const loan = myLoansRes.data.find(l => l.loanId === loanId);
        console.log(`New Account Balance: Rs. ${acc.balance}. Outstanding Loan Balance: Rs. ${loan.outstandingBalance}`);
    } catch (e) {
        console.error("EMI repayment failed:", e.response?.data || e.message);
        return;
    }

    console.log("=== ALL LOAN INTEGRATION TESTS COMPLETED SUCCESSFULLY ===");
}

runLoanTests();
