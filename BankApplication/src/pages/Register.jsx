import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../customHooks/useAuth";
import "./Auth.css";

function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        aadhaarNumber: '',
        password: '',
        dateOfBirth: '',
        gender: '',
        occupation: '',
        annualIncome: '',
        nationality: '',
        houseNo: '',
        street: '',
        city: '',
        district: '',
        state: '',
        country: '',
        pincode: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.fullName.trim()) return "Full Name is required.";
        if (!formData.email.trim()) return "Email is required.";

        
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            return "Phone number must be exactly 10 digits.";
        }

        
        const aadhaarRegex = /^\d{12}$/;
        if (!aadhaarRegex.test(formData.aadhaarNumber)) {
            return "Aadhaar Number must be exactly 12 digits.";
        }

        if (!formData.password) return "Password is required.";
        if (formData.password.length < 6) return "Password must be at least 6 characters long.";

        if (!formData.dateOfBirth) return "Date of Birth is required.";
        const dobDate = new Date(formData.dateOfBirth);
        if (dobDate > new Date()) {
            return "Date of Birth cannot be in the future.";
        }

        if (!formData.gender) return "Gender is required.";
        if (!formData.occupation.trim()) return "Occupation is required.";

        if (!formData.annualIncome || Number(formData.annualIncome) <= 0) {
            return "Annual Income must be a positive number.";
        }

        if (!formData.nationality.trim()) return "Nationality is required.";
        if (!formData.houseNo.trim()) return "House Number is required.";
        if (!formData.street.trim()) return "Street is required.";
        if (!formData.city.trim()) return "City is required.";
        if (!formData.district.trim()) return "District is required.";
        if (!formData.state.trim()) return "State is required.";
        if (!formData.country.trim()) return "Country is required.";

        
        const pincodeRegex = /^\d{6}$/;
        if (!pincodeRegex.test(formData.pincode)) {
            return "Pincode must be exactly 6 digits.";
        }

        return null; 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        
        const validationError = validateForm();
        if (validationError) {
            setMessage(validationError);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        setLoading(true);

        try {
            const data = await register(formData);
            setMessage(data.message || "Registration successful.");
            setTimeout(() => navigate("/login"), 1200);
        } catch (error) {
            setMessage(error.response?.data?.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <form className="auth-card wide" onSubmit={handleSubmit}>
                <h1>Register</h1>
                <p>Create a customer profile, then login and upload KYC documents.</p>

                {message && <div className="form-message" style={{ color: "var(--danger, #e74c3c)", backgroundColor: "rgba(231,76,60,0.1)", padding: "10px", borderRadius: "4px", marginBottom: "15px", border: "1px solid var(--danger, #e74c3c)" }}>{message}</div>}

                <label>Full Name *</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />

                <label>Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                <label>Phone * (10 digits)</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required placeholder="e.g. 9876543210" />

                <label>Aadhaar Number * (12 digits)</label>
                <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} required placeholder="e.g. 123456789012" />

                <label>Password * (min 6 chars)</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />

                <label>Date Of Birth *</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />

                <label>Gender *</label>
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                </select>

                <label>Occupation *</label>
                <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} required />

                <label>Annual Income * (Rs)</label>
                <input type="number" name="annualIncome" value={formData.annualIncome} onChange={handleChange} required min="1" />

                <label>Nationality *</label>
                <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} required />

                <label>House No *</label>
                <input type="text" name="houseNo" value={formData.houseNo} onChange={handleChange} required />

                <label>Street *</label>
                <input type="text" name="street" value={formData.street} onChange={handleChange} required />

                <label>City *</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} required />

                <label>District *</label>
                <input type="text" name="district" value={formData.district} onChange={handleChange} required />

                <label>State *</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} required />

                <label>Country *</label>
                <input type="text" name="country" value={formData.country} onChange={handleChange} required />

                <label>Pincode * (6 digits)</label>
                <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required placeholder="e.g. 560001" />

                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>

                <span>
                    Already registered? <Link to="/login">Login</Link>
                </span>

            </form>
        </main>
    );
}

export default Register;
