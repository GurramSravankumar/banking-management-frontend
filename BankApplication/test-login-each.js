import axios from "axios";

async function testLogins() {
    const users = [
        { id: 5, email: "gsravankumarjmd@gmail.com", password: "password" },
        { id: 6, email: "gurrramsravankr@gmail.com", password: "password" },
        { id: 7, email: "admintest@skbank.com", password: "password" }
    ];

    for (const u of users) {
        try {
            console.log(`\nLogging in as User ${u.id} (${u.email})...`);
            const res = await axios.post("http://localhost:8080/auth/login", {
                email: u.email,
                password: u.password
            });
            console.log(`SUCCESS! Status: ${res.status}, Role: ${res.data.role}, Status: ${res.data.status}`);
        } catch (e) {
            console.log(`FAILED! Status: ${e.response?.status}`);
            console.log("Response Data:", e.response?.data);
        }
    }
}

testLogins();
