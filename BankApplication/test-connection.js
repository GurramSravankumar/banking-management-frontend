import axios from "axios";

const API_URL = "http://localhost:8080";

async function runTests() {
    console.log("=== STARTING BACKEND INTEGRATION API TESTS ===");
    const randomSuffix = Math.floor(Math.random() * 1000000);
    const email = `testuser${randomSuffix}@skbank.com`;
    const password = "password123";

    try {
        // 1. Register User
        console.log(`\n1. Registering user. Email: ${email}`);
        const regRes = await axios.post(`${API_URL}/auth/register`, {
            email: email,
            password: password,
            fullName: "Automated Integration Tester",
            phone: `99900${Math.floor(10000 + Math.random() * 90000)}`,
            occupation: "Software Engineer",
            annualIncome: 750000,
            nationality: "Indian",
            houseNo: "Block-4B",
            street: "Silicon St",
            city: "Tech Bangalore",
            district: "East Dist",
            state: "Karnataka",
            country: "India",
            pincode: "560001"
        });
        console.log("Registration Response (Raw):", regRes.data);

        // 2. Login User
        console.log("\n2. Logging in with user credentials...");
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: email,
            password: password
        });
        const token = loginRes.data.token || loginRes.data;
        console.log("Login Success! Token snippet:", String(token).substring(0, 30) + "...");

        const headers = { Authorization: `Bearer ${token}` };

        // 3. Retrieve User Profile
        console.log("\n3. Fetching User Profile...");
        const profileRes = await axios.get(`${API_URL}/api/user/profile`, { headers });
        console.log("Profile details fetched:", {
            id: profileRes.data.id,
            fullName: profileRes.data.fullName,
            customerId: profileRes.data.customerId,
            userStatus: profileRes.data.userStatus,
            kycStatus: profileRes.data.kycStatus
        });

        // 4. Attempt to open a savings account
        console.log("\n4. Attempting to open savings account...");
        try {
            const accRes = await axios.post(`${API_URL}/api/user/accounts`, {
                accountType: "SAVINGS",
                branchName: "East Kadapa Branch",
                initialDeposit: 5000
            }, { headers });
            console.log("Account Creation Response:", accRes.data);
        } catch (err) {
            console.log("Account Creation failed (Expected if KYC is not yet approved):", err.response?.data?.message || err.message);
        }

        console.log("\n=== API INTEGRATION TESTS COMPLETED SUCCESSFULLY ===");
    } catch (error) {
        console.error("Test failed with error:", error.response?.data || error.message);
    }
}

runTests();
