import React, { useState } from 'react'
import axios from 'axios'
import { API_BASE } from '../config'

function Login({ onLogin }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await axios.post(`${API_BASE}/auth/login`, {
                email,
                password
            })
            onLogin(response.data)
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message)
            } else if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error)
            } else {
                setError('Login failed. Please check your credentials or server connection.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="card auth-card">
                <div className="auth-header">
                    <h2>Welcome Back</h2>
                    <p className="text-secondary">Please sign in to place/manage table reservations</p>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            className="form-control"
                            placeholder="e.g. customer@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="form-control"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary mb-4" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/register">Register here</Link>
                </div>
            </div>
        </div>
    )
}

export default Login
