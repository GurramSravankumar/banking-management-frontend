import axios from "axios";

async function verify() {
    try {
        const credentials = [
            { email: "admintest@skbank.com", password: "password123" },
            { email: "admintest@skbank.com", password: "password" }
        ];

        let token = "";
        for (const cred of credentials) {
            try {
                console.log(`Trying login with ${cred.email} / ${cred.password}...`);
                const response = await axios.post("http://localhost:8080/auth/login", cred);
                token = response.data.token || response.data;
                console.log("Login Success!");
                break;
            } catch (err) {
                console.log(`Login failed with ${cred.password}:`, err.response?.data?.message || err.message);
            }
        }

        if (!token) {
            console.error("Could not obtain admin JWT token. Exiting.");
            return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        // Test Endpoint 1: Customers list
        console.log("\n--- Querying Customers ---");
        const customersRes = await axios.get("http://localhost:8080/api/admin/customers", { headers });
        console.log("Customers Status:", customersRes.status);
        console.log("Total Customers:", customersRes.data.length);
        const testUser = customersRes.data.find(u => u.role === "ADMIN" || u.id === 5);
        if (testUser) {
            console.log("Found target test user:", testUser.fullName, "(ID:", testUser.id, ")");
        } else {
            console.log("No test user found in list.");
        }

        // Test Endpoint 2: Accounts list (Verify ByteBuddy proxy serialization is fixed)
        console.log("\n--- Querying Accounts ---");
        const accountsRes = await axios.get("http://localhost:8080/api/admin/accounts", { headers });
        console.log("Accounts Status:", accountsRes.status);
        console.log("Total Accounts:", accountsRes.data.length);
        if (accountsRes.data.length > 0) {
            console.log("First Account Info:", {
                id: accountsRes.data[0].id,
                accountNumber: accountsRes.data[0].accountNumber,
                branch: accountsRes.data[0].branchName,
                user: accountsRes.data[0].user?.fullName
            });
        }

        // Test Endpoint 3: Update Customer details
        if (testUser) {
            console.log("\n--- Updating Target Customer Profile ---");
            const updatePayload = {
                fullName: testUser.fullName,
                email: testUser.email,
                phone: testUser.phone,
                occupation: "Senior Officer",
                annualIncome: 999999,
                nationality: "Indian",
                pincode: "516434",
                role: "ADMIN",
                status: "APPROVED"
            };

            const updateRes = await axios.put(`http://localhost:8080/api/admin/customers/${testUser.id}`, updatePayload, { headers });
            console.log("Update Status:", updateRes.status);
            console.log("Updated Customer Profile details:", {
                fullName: updateRes.data.fullName,
                occupation: updateRes.data.occupation,
                annualIncome: updateRes.data.annualIncome,
                status: updateRes.data.status
            });

            // Double check updated user via customers list
            console.log("\n--- Re-Querying Customers list to verify persistence ---");
            const recheckRes = await axios.get("http://localhost:8080/api/admin/customers", { headers });
            const recheckedUser = recheckRes.data.find(u => u.id === testUser.id);
            console.log("Persisted customer occupation in database:", recheckedUser?.occupation);
        }

    } catch (e) {
        console.error("Verification failed:", e.response?.data || e.message);
    }
}

verify();
