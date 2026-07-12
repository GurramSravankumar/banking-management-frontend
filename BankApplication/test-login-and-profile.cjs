const axios = require('axios');
const API_URL = "http://localhost:8080";
async function test() {
    try {
        console.log("Attempting login...");
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: "gurramsravankr@gmail.com",
            password: "password123"
        });
        console.log("Login Success! Response data:", loginRes.data);
        const token = loginRes.data.token;
        const headers = { Authorization: `Bearer ${token}` };

        // Test Profile
        try {
            console.log("\nFetching profile...");
            const profileRes = await axios.get(`${API_URL}/api/user/profile`, { headers });
            console.log("Profile Success! Data:", Object.keys(profileRes.data));
        } catch (e) {
            console.error("Profile Failed:", e.response?.status, e.response?.data || e.message);
        }

        // Test Accounts
        try {
            console.log("\nFetching accounts...");
            const accRes = await axios.get(`${API_URL}/api/user/accounts`, { headers });
            console.log("Accounts Success! Count:", accRes.data.length);
        } catch (e) {
            console.error("Accounts Failed:", e.response?.status, e.response?.data || e.message);
        }

        // Test Beneficiaries
        try {
            console.log("\nFetching beneficiaries...");
            const benRes = await axios.get(`${API_URL}/api/user/beneficiaries`, { headers });
            console.log("Beneficiaries Success! Count:", benRes.data.length);
        } catch (e) {
            console.error("Beneficiaries Failed:", e.response?.status, e.response?.data || e.message);
        }

        // Test Transactions
        try {
            console.log("\nFetching transactions...");
            const txRes = await axios.get(`${API_URL}/api/user/transactions`, { headers });
            console.log("Transactions Success! Count:", txRes.data.length);
        } catch (e) {
            console.error("Transactions Failed:", e.response?.status, e.response?.data || e.message);
        }

        // Test Loans
        try {
            console.log("\nFetching loans...");
            const loanRes = await axios.get(`${API_URL}/api/user/loans`, { headers });
            console.log("Loans Success! Count:", loanRes.data.length);
        } catch (e) {
            console.error("Loans Failed:", e.response?.status, e.response?.data || e.message);
        }

    } catch (e) {
        console.error("Test login failed:", e.response?.status, e.response?.data || e.message);
    }
}
test();
