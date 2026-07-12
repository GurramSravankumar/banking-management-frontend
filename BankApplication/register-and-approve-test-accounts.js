import axios from "axios";
import { execSync } from "child_process";

const users = [
    {
        fullName: "Sravan Kumar",
        email: "gurramsravankr@gmail.com",
        phone: "9999999991",
        aadhaarNumber: "999999999991",
        password: "password123",
        dateOfBirth: "1995-01-01",
        gender: "MALE",
        occupation: "Developer",
        annualIncome: 80000,
        nationality: "Indian",
        houseNo: "456",
        street: "Main Rd",
        city: "Kadapa",
        district: "Kadapa",
        state: "Andhra Pradesh",
        country: "India",
        pincode: "516001"
    },
    {
        fullName: "Admin Tester",
        email: "admintest@skbank.com",
        phone: "9999999999",
        aadhaarNumber: "999999999990",
        password: "password123",
        dateOfBirth: "1980-01-01",
        gender: "MALE",
        occupation: "Banker",
        annualIncome: 120000,
        nationality: "Indian",
        houseNo: "Suite 1",
        street: "Central Blvd",
        city: "Kadapa",
        district: "Kadapa",
        state: "Andhra Pradesh",
        country: "India",
        pincode: "516001"
    },
    {
        fullName: "Gurram Lakshmi",
        email: "gsravankumarjmd@gmail.com",
        phone: "9999999993",
        aadhaarNumber: "999999999993",
        password: "password123",
        dateOfBirth: "1985-05-05",
        gender: "FEMALE",
        occupation: "Manager",
        annualIncome: 150000,
        nationality: "Indian",
        houseNo: "789",
        street: "Park Ave",
        city: "Kadapa",
        district: "Kadapa",
        state: "Andhra Pradesh",
        country: "India",
        pincode: "516001"
    }
];

async function run() {
    console.log("=== REGISTRIES START ===");
    for (const u of users) {
        try {
            console.log(`Registering ${u.email}...`);
            await axios.post("http://localhost:8080/auth/register", u);
            console.log(`Successfully registered ${u.email}`);
        } catch (e) {
            console.log(`Registration info for ${u.email}:`, e.response?.data || e.message);
        }
    }

    console.log("\n=== RUNNING SQL UPGRADE QUERIES IN DATABASE ===");
    try {
        const sqlCmd = `mysql -u root -p939854 -h 127.0.0.1 -D bankdb -e "UPDATE users SET status = 'APPROVED' WHERE email IN ('gurramsravankr@gmail.com', 'admintest@skbank.com', 'gsravankumarjmd@gmail.com'); UPDATE users SET role = 'ADMIN' WHERE email IN ('admintest@skbank.com', 'gsravankumarjmd@gmail.com'); SELECT id, email, role, status FROM users;"`;
        const res = execSync(sqlCmd).toString();
        console.log("SQL Results:\n", res);
        console.log("=== SEEDING COMPLETED successfully ===");
    } catch (err) {
        console.error("SQL execution failed:", err.message);
    }
}

run();
