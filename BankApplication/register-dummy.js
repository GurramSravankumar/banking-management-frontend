import axios from "axios";

async function reg() {
    try {
        const response = await axios.post("http://localhost:8080/auth/register", {
            fullName: "Dummy User",
            email: "dummy@example.com",
            phone: "9999999992",
            aadhaarNumber: "999999999992",
            password: "password123",
            dateOfBirth: "1990-01-01",
            gender: "MALE",
            occupation: "Developer",
            annualIncome: 50000,
            nationality: "Indian",
            houseNo: "123",
            street: "Test St",
            city: "Test City",
            district: "Test Dist",
            state: "Test State",
            country: "India",
            pincode: "123456"
        });
        console.log("REGISTER SUCCESS:", response.data);
    } catch (e) {
        console.log("REGISTER FAILED:", e.response?.data || e.message);
    }
}

reg();
