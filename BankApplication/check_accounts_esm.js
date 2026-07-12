import axios from 'axios';
import fs from 'fs';
async function test() {
    try {
        let log = "";
        log += "Logging in...\n";
        const loginRes = await axios.post("http://localhost:8080/auth/login", {
            email: "gurrramsravankr@gmail.com",
            password: "password123"
        });
        const token = loginRes.data.token || loginRes.data;
        const headers = { Authorization: `Bearer ${token}` };

        log += "Fetching profile...\n";
        const profileRes = await axios.get("http://localhost:8080/api/user/profile", { headers });
        log += `Profile: ${JSON.stringify(profileRes.data, null, 2)}\n\n`;

        log += "Fetching accounts...\n";
        const accountsRes = await axios.get("http://localhost:8080/api/user/accounts", { headers });
        log += `Accounts status: ${accountsRes.status}\n`;
        log += `Accounts: ${JSON.stringify(accountsRes.data, null, 2)}\n`;

        fs.writeFileSync('d:\\react\\check_accounts_output.txt', log);
        console.log("Logged to check_accounts_output.txt");
    } catch (e) {
        fs.writeFileSync('d:\\react\\check_accounts_output.txt', "Error: " + (e.response?.data ? JSON.stringify(e.response.data) : e.message));
        console.error("Failed:", e.message);
    }
}
test();
