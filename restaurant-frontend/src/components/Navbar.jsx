import React from 'react'
import { Link, NavLink } from 'react-router-dom'

function Navbar({ user, onLogout }) {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    🍽️ DineEase
                </Link>
                {user && (
                    <ul className="navbar-links">
                        {user.role === 'USER' && (
                            <>
                                <li>
                                    <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} end>
                                        New Reservation
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/reservations/my" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                        My Bookings
                                    </NavLink>
                                </li>
                            </>
                        )}
                        {user.role === 'ADMIN' && (
                            <>
                                <li>
                                    <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                        Admin Dashboard
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/reservations/my" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                        All Bookings
                                    </NavLink>
                                </li>
                            </>
                        )}
                        <li className="user-info">
                            <span className="user-badge">{user.role}</span>
                            <span style={{ fontSize: '0.9rem', color: '#9CA3AF' }}>Hi, {user.name}</span>
                            <button onClick={onLogout} className="btn-logout">
                                Logout
                            </button>
                        </li>
                    </ul>
                )}
            </div>
        </nav>
    )
}

export default Navbar
