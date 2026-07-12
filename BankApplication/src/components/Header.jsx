import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../customHooks/useAuth";
import "../styles/Header.css";

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const rawToken = localStorage.getItem("token");
    const token = rawToken && rawToken !== "undefined" && rawToken !== "null" ? rawToken : null;
    const role = localStorage.getItem("role");

    const currentPath = location.pathname;
    const currentViewMode = (currentPath === "/dashboard") ? "user" : "admin";

    const dashboardPath = role === "ADMIN"
        ? (currentViewMode === "admin" ? "/admin" : "/dashboard")
        : "/dashboard";

    const handleToggleView = () => {
        if (currentViewMode === "admin") {
            navigate("/dashboard");
        } else {
            navigate("/admin");
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="header">
            <div className="logo">
                <Link to="/">
                    <h2>SK Bank</h2>
                </Link>
                <Link to="/">
                    <button className="btn home-btn">Home</button>
                </Link>
            </div>
            <nav className="nav-links">
                {token ? (
                    <>
                        {role === "ADMIN" && (
                            <div className="dashboard-toggle-container">
                                <span className={`toggle-label user-label ${currentViewMode === "user" ? "active" : ""}`}>User</span>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={currentViewMode === "admin"}
                                        onChange={handleToggleView}
                                    />
                                    <span className="slider round"></span>
                                </label>
                                <span className={`toggle-label admin-label ${currentViewMode === "admin" ? "active" : ""}`}>Admin</span>
                            </div>
                        )}
                        <Link to={dashboardPath}>
                            <button className="btn profile-btn">Dashboard</button>
                        </Link>
                        <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">
                            <button className="btn login-btn">Login</button>
                        </Link>
                        <Link to="/register">
                            <button className="btn register-btn">Register</button>
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Header;
