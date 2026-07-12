import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../customHooks/useAuth";
import "./Auth.css";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [showCredentialsHelp, setShowCredentialsHelp] = useState(false);
    const [copiedText, setCopiedText] = useState("");


    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCopy = (email, label) => {
        navigator.clipboard.writeText(email);
        setCopiedText(label);
        setTimeout(() => {
            setCopiedText("");
        }, 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await login(credentials);
            if (data.role === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            if (error.message === "Network Error" || !error.response) {
                alert("🔌 Connectivity Error:\n\nCannot connect to the bank server at http://localhost:8080.\nPlease verify that your Spring Boot application is running and online.");
            } else if (error.response?.status === 401) {
                alert("❌ Invalid Login:\n\nThe email or password you entered is incorrect. Please verify your credentials.");
            } else {
                alert("❌ Login failed:\n\n" + (error.response?.data?.message || "Check your credentials and try again."));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h1>Login</h1>
                <p>Access your SK Bank account.</p>

                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>

                <span>
                    New customer? <Link to="/register">Create an account</Link>
                </span>

                <div style={{ marginTop: "1rem", borderTop: "1px solid #e2e8f0", paddingTop: "1rem", gridColumn: "1 / -1" }}>
                    <button
                        type="button"
                        onClick={() => setShowCredentialsHelp(!showCredentialsHelp)}
                        style={{
                            background: "transparent",
                            color: "#2563eb",
                            border: "none",
                            fontSize: "0.85rem",
                            cursor: "pointer",
                            padding: 0,
                            fontWeight: "500",
                            display: "block",
                            margin: "0 auto"
                        }}
                    >
                        {showCredentialsHelp ? "Hide Registered Accounts ▴" : "Show Registered Accounts ▾"}
                    </button>
                    {showCredentialsHelp && (
                        <div style={{
                            marginTop: "0.75rem",
                            padding: "0.75rem",
                            background: "#f8fafc",
                            border: "1px dashed #cbd5e1",
                            borderRadius: "6px",
                            fontSize: "0.8rem",
                            color: "#334155"
                        }}>
                            {copiedText ? (
                                <p style={{ margin: "0 0 0.5rem 0", fontWeight: "600", color: "#16a34a", textAlign: "center" }}>
                                    ✓ Copied {copiedText} to clipboard!
                                </p>
                            ) : (
                                <p style={{ margin: "0 0 0.5rem 0", fontWeight: "600", color: "#1e293b", textAlign: "center" }}>Click to copy:</p>
                            )}
                            <div style={{ display: "grid", gap: "0.5rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span
                                        style={{ cursor: "pointer", textDecoration: "underline", color: "#2563eb" }}
                                        onClick={() => handleCopy("gurramsravankr@gmail.com", "User Email")}
                                    >
                                        gurramsravankr@gmail.com (User)
                                    </span>
                                    <span>pass: password123</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span
                                        style={{ cursor: "pointer", textDecoration: "underline", color: "#2563eb" }}
                                        onClick={() => handleCopy("admintest@skbank.com", "Admin Email")}
                                    >
                                        admintest@skbank.com (Admin)
                                    </span>
                                    <span>pass: password123</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span
                                        style={{ cursor: "pointer", textDecoration: "underline", color: "#2563eb" }}
                                        onClick={() => handleCopy("gsravankumarjmd@gmail.com", "Admin Email")}
                                    >
                                        gsravankumarjmd@gmail.com (Admin)
                                    </span>
                                    <span>pass: password123</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </form>
        </main>
    );
}

export default Login;
