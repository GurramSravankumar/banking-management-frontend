import axios from "axios";

async function run() {
    try {
        const email = "admintest@skbank.com";
        const password = "password123";
        console.log("Logging in as admin: ", email);
        const loginRes = await axios.post("http://localhost:8080/auth/login", { email, password });
        const token = loginRes.data.token || loginRes.data;
        console.log("Login Success! Token: ", token.substring(0, 20) + "...");

        const headers = { Authorization: `Bearer ${token}` };

        const endpoints = [
            "/api/admin/kyc/pending",
            "/api/admin/customers",
            "/api/admin/accounts",
            "/api/admin/transactions",
            "/api/admin/audit-logs"
        ];

        for (const ep of endpoints) {
            try {
                const res = await axios.get(`http://localhost:8080${ep}`, { headers });
                console.log(`\n=== Endpoint: ${ep} ===`);
                console.log("Status:", res.status);
                console.log("Type of response.data:", typeof res.data);
                console.log("Is array:", Array.isArray(res.data));

                if (typeof res.data === "string") {
                    console.log("Response text length:", res.data.length);
                    console.log("Snippet:", res.data.substring(0, 300));
                } else if (Array.isArray(res.data)) {
                    console.log("Array length:", res.data.length);
                    if (res.data.length > 0) {
                        console.log("First item:", JSON.stringify(res.data[0], null, 2));
                    }
                } else {
                    console.log("Keys:", Object.keys(res.data));
                }
            } catch (err) {
                console.log(`\nError fetching ${ep}:`, err.response?.status, err.response?.data || err.message);
            }
        }

    } catch (e) {
        console.error("Test execution failed:", e.message);
    }
}
run();
