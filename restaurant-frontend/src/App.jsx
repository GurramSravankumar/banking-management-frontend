import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import MyReservations from './pages/MyReservations'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const email = localStorage.getItem('email')
    const role = localStorage.getItem('role')
    const name = localStorage.getItem('name')

    if (token && email && role && name) {
      setUser({ token, email, role, name })
    }
  }, [])

  const loginUser = (authResponse) => {
    localStorage.setItem('token', authResponse.token)
    localStorage.setItem('email', authResponse.email)
    localStorage.setItem('role', authResponse.role)
    localStorage.setItem('name', authResponse.name)

    const newUser = {
      token: authResponse.token,
      email: authResponse.email,
      role: authResponse.role,
      name: authResponse.name
    }
    setUser(newUser)

    if (authResponse.role === 'ADMIN') {
      navigate('/admin/dashboard')
    } else {
      navigate('/')
    }
  }

  const logoutUser = () => {
    localStorage.clear()
    setUser(null)
    navigate('/login')
  }

  const PrivateRoute = ({ children, allowedRoles }) => {
    if (!user) {
      return <Navigate to="/login" replace />
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />
    }
    return children
  }

  return (
    <div className="app-container">
      <Navbar user={user} onLogout={logoutUser} />
      <main className="main-content">
        <Routes>
          <Route
            path="/login"
            element={!user ? <Login onLogin={loginUser} /> : <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/'} replace />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/" replace />}
          />

          <Route
            path="/"
            element={
              <PrivateRoute allowedRoles={['USER']}>
                <Home user={user} />
              </PrivateRoute>
            }
          />
          <Route
            path="/reservations/my"
            element={
              <PrivateRoute allowedRoles={['USER', 'ADMIN']}>
                <MyReservations user={user} />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute allowedRoles={['ADMIN']}>
                <AdminDashboard user={user} />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to={user ? (user.role === 'ADMIN' ? '/admin/dashboard' : '/') : '/login'} replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
