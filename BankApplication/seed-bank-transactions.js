import axios from "axios";
import crypto from "crypto";

async function executeSeeding() {
    try {
        console.log("=== STARTING BANK TRANSACTION DATABASE SEEDING ===");

        const users = [
            { id: 5, email: "gsravankumarjmd@gmail.com", name: "Gurram Lakshmi Devi", password: "password123", role: "ADMIN", token: "", account: null, beneficiaries: [] },
            { id: 6, email: "gurramsravankr@gmail.com", name: "Gurram Sravankumar", password: "password123", role: "USER", token: "", account: null, beneficiaries: [] },
            { id: 7, email: "admintest@skbank.com", name: "Admin Tester", password: "password123", role: "ADMIN", token: "", account: null, beneficiaries: [] }
        ];

        // 1. Authenticate users
        for (const user of users) {
            console.log(`\nLogging in as ${user.name} (${user.email})...`);
            const loginRes = await axios.post("http://localhost:8080/auth/login", {
                email: user.email,
                password: user.password
            });
            user.token = loginRes.data.token || loginRes.data;
            console.log("Login Success!");
        }

        const adminToken = users.find(u => u.email === "admintest@skbank.com").token;

        // 2. Open Accounts for those who don't have one
        for (const user of users) {
            const headers = { Authorization: `Bearer ${user.token}` };
            console.log(`\nChecking accounts for ${user.name}...`);
            let accountsRes = await axios.get("http://localhost:8080/api/user/accounts", { headers });

            if (accountsRes.data.length === 0) {
                console.log(`No account found for ${user.name}. Opening new SAVINGS account...`);
                await axios.post("http://localhost:8080/api/user/accounts/open", {
                    accountType: "SAVINGS",
                    initialDeposit: 1000
                }, { headers });

                // Fetch list again
                accountsRes = await axios.get("http://localhost:8080/api/user/accounts", { headers });
            }

            user.account = accountsRes.data[0];
            console.log(`Active Account: ID=${user.account.accountId}, Number=${user.account.accountNumber}, Balance=${user.account.balance}`);
        }

        // 3. Admin deposits money into all accounts to ensure ample balance
        console.log("\n=== SEEDING ACCOUNT BALANCES VIA ADMIN DEPOSIT ===");
        const adminHeaders = { Authorization: `Bearer ${adminToken}` };
        for (const user of users) {
            console.log(`Admin depositing 100,000 INR into Account ID ${user.account.accountId} (${user.name})...`);
            await axios.post(`http://localhost:8080/api/admin/accounts/${user.account.accountId}/deposit`, {
                amount: 100000,
                remarks: "Initial Admin Seeding Deposit"
            }, { headers: adminHeaders });

            // Reload user account balance
            const userHeaders = { Authorization: `Bearer ${user.token}` };
            const checkRes = await axios.get("http://localhost:8080/api/user/accounts", { headers: userHeaders });
            user.account = checkRes.data[0];
            console.log(`New balance for ${user.name}: ${user.account.balance}`);
        }

        // 4. Register beneficiaries cross-account
        console.log("\n=== LINKING CROSS-ACCOUNT BENEFICIARIES ===");
        for (let i = 0; i < users.length; i++) {
            const sender = users[i];
            const senderHeaders = { Authorization: `Bearer ${sender.token}` };

            // Get current beneficiaries
            const benRes = await axios.get("http://localhost:8080/api/user/beneficiaries", { headers: senderHeaders });
            const existingBens = benRes.data;

            for (let j = 0; j < users.length; j++) {
                if (i === j) continue;
                const receiver = users[j];

                const alreadyLinked = existingBens.some(b => b.accountNumber === receiver.account.accountNumber);
                if (!alreadyLinked) {
                    console.log(`Registering ${receiver.name} (AC: ${receiver.account.accountNumber}) as beneficiary for ${sender.name}...`);
                    await axios.post("http://localhost:8080/api/user/beneficiaries", {
                        beneficiaryName: receiver.name,
                        nickname: receiver.name.split(" ")[0],
                        accountNumber: receiver.account.accountNumber,
                        ifscCode: "GSKA0009398", // default bank ifsc code
                        bankName: "SK Bank"
                    }, { headers: senderHeaders });
                }
            }

            // Fetch finalized beneficiaries list
            const finalBenRes = await axios.get("http://localhost:8080/api/user/beneficiaries", { headers: senderHeaders });
            sender.beneficiaries = finalBenRes.data;
            console.log(`${sender.name} Beneficiaries:`, sender.beneficiaries.map(b => `${b.beneficiaryName} (ID: ${b.id})`));
        }

        // 5. Execute cross-account transfers
        console.log("\n=== SIMULATING ONLINE TRANSFERS ===");
        const transfers = [
            // { fromIdx: 0, toIdx: 1, amount: 5000, remarks: "Seeding transfer: Dev to Sravan" },
            // { fromIdx: 0, toIdx: 2, amount: 2500, remarks: "Seeding transfer: Dev to Admin" },
            // { fromIdx: 1, toIdx: 0, amount: 8000, remarks: "Seeding transfer: Sravan to Dev" },
            // { fromIdx: 2, toIdx: 1, amount: 10000, remarks: "Seeding transfer: Admin to Sravan" }
            { fromIndex: 1, toIndex: 0, amount: 5000, remarks: "Sravan to Lakshmi" },
            { fromIndex: 1, toIndex: 2, amount: 2500, remarks: "Sravan to Admin" },
            { fromIndex: 0, toIndex: 1, amount: 8000, remarks: "Lakshmi to Sravan" },
            { fromIndex: 2, toIndex: 1, amount: 10000, remarks: "Admin to Sravan" }
        ];

        for (const t of transfers) {
            const sender = users[t.fromIndex];
            const receiver = users[t.toIndex];
            const senderHeaders = { Authorization: `Bearer ${sender.token}` };

            // Find receiver in sender's beneficiary list
            const beneficiary = sender.beneficiaries.find(b => b.accountNumber === receiver.account.accountNumber);
            if (!beneficiary) {
                console.error(`Error: Beneficiary record not found for ${receiver.name} in ${sender.name}'s list.`);
                continue;
            }

            console.log(`Transferring ${t.amount} INR from ${sender.name} to ${receiver.name} (Beneficiary ID: ${beneficiary.id})...`);

            const transferPayload = {
                accountId: sender.account.accountId,
                beneficiaryId: beneficiary.id,
                amount: t.amount,
                remarks: t.remarks,
                requestId: crypto.randomUUID()
            };

            const transferRes = await axios.post("http://localhost:8080/api/user/transfer", transferPayload, { headers: senderHeaders });
            console.log("Response:", transferRes.data);
        }

        console.log("\n=== DATABASE SEEDING COMPLETED SUCCESSFULLY ===");

    } catch (err) {
        console.error("Seeding operation failed:", err.response?.data || err.message);
    }
}

executeSeeding();
