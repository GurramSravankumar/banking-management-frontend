import axios from "axios";

async function run() {
    try {
        const email = "admintest@skbank.com";
        const password = "password123";
        console.log("Registering admin user...");
        const res = await axios.post("http://localhost:8080/auth/register", {
            email: email,
            password: password,
            fullName: "Admin Tester",
            phone: "9999999999",
            occupation: "Banker",
            annualIncome: 1200000,
            nationality: "Indian",
            houseNo: "Admin Suite 1",
            street: "Central Blvd",
            city: "Kadapa",
            district: "Kadapa",
            state: "Andhra Pradesh",
            country: "India",
            dateOfBirth: "1980-01-01",
            pincode: "516001"
        });
        console.log("Result:", res.data);
    } catch (e) {
        console.log("Error or already exists:", e.response?.data || e.message);
    }
}
run();
