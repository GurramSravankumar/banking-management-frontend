import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
    const rawToken = localStorage.getItem("token");
    const token = rawToken && rawToken !== "undefined" && rawToken !== "null" ? rawToken : null;
    const role = localStorage.getItem("role");
    const dashboardPath = role === "ADMIN" ? "/admin" : "/dashboard";

    return (
        <main className="home-page">
            <section className="home-hero">
                <div>
                    <h1>SK Bank</h1>
                    <p>Register, complete KYC, manage beneficiaries, and transfer money from one React frontend connected to your Spring Boot API.</p>
                    <div className="hero-actions">
                        {token ? (
                            <Link to={dashboardPath}>Open Dashboard</Link>
                        ) : (
                            <>
                                <Link to="/login">Login</Link>
                                <Link className="secondary" to="/register">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Home;
