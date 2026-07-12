const axios = require('axios');
const API_URL = "http://localhost:8080";
async function test() {
    try {
        console.log("Attempting admin login...");
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: "gsravankumarjmd@gmail.com",
            password: "password123"
        });
        console.log("Admin Login Success! Response data:", loginRes.data);
        const token = loginRes.data.token;
        const headers = { Authorization: `Bearer ${token}` };

        const endpoints = [
            ["Pending KYC", "/api/admin/kyc/pending"],
            ["Customers", "/api/admin/customers"],
            ["Accounts", "/api/admin/accounts"],
            ["Transactions", "/api/admin/transactions"],
            ["Audit Logs", "/api/admin/audit-logs"],
            ["Loans", "/api/admin/loans"]
        ];

        for (const [name, path] of endpoints) {
            try {
                console.log(`\nFetching ${name}...`);
                const res = await axios.get(`${API_URL}${path}`, { headers });
                console.log(`${name} Success! Count: ${Array.isArray(res.data) ? res.data.length : 'Object'}`);
            } catch (e) {
                console.error(`${name} Failed:`, e.response?.status, e.response?.data || e.message);
            }
        }

    } catch (e) {
        console.error("Test admin login failed:", e.response?.status, e.response?.data || e.message);
    }
}
test();
