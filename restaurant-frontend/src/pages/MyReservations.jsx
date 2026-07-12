import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE } from '../config'

function MyReservations({ user }) {
    const [reservations, setReservations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const fetchReservations = async () => {
        setLoading(true)
        setError('')
        try {
            const endpoint = user.role === 'ADMIN'
                ? `${API_BASE}/api/admin/reservations`
                : `${API_BASE}/api/reservations/my`

            const response = await axios.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            })

            const sorted = response.data.sort((a, b) => {
                const dateCompare = new Date(b.reservationDate) - new Date(a.reservationDate)
                if (dateCompare !== 0) return dateCompare
                return b.timeSlot.localeCompare(a.timeSlot)
            })
            setReservations(sorted)
        } catch (err) {
            setError('Failed to fetch reservations from backend.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReservations()
    }, [user])

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this reservation?')) {
            return
        }

        setError('')
        setSuccess('')
        try {
            const endpoint = user.role === 'ADMIN'
                ? `${API_BASE}/api/admin/reservations/${id}/cancel`
                : `${API_BASE}/api/reservations/${id}/cancel`

            await axios.post(endpoint, {}, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            })

            setSuccess('Reservation cancelled successfully!')
            fetchReservations()
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error)
            } else {
                setError('Failed to cancel reservation.')
            }
        }
    }

    return (
        <div>
            <div className="mb-6 flex-between">
                <div>
                    <h2>{user.role === 'ADMIN' ? 'All Restaurant Reservations' : 'My Table Reservations'}</h2>
                    <p className="text-secondary">
                        {user.role === 'ADMIN'
                            ? 'Viewing bookings across all tables and customers.'
                            : 'Keep track of your active Bookings and history.'}
                    </p>
                </div>
                <button className="btn btn-secondary" onClick={fetchReservations} style={{ width: 'auto' }}>
                    🔄 Refresh
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {loading ? (
                <div className="loading">Retrieving bookings list...</div>
            ) : reservations.length === 0 ? (
                <div className="empty-state">
                    <h3>No Reservs Found</h3>
                    <p>There are no bookings recorded in the system.</p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                {user.role === 'ADMIN' && <th>Customer Email</th>}
                                {user.role === 'ADMIN' && <th>Name</th>}
                                <th>Date</th>
                                <th>Time Slot</th>
                                <th>Guests</th>
                                <th>Table No</th>
                                <th>Table Max Cap</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((res) => (
                                <tr key={res.id}>
                                    {user.role === 'ADMIN' && <td>{res.user?.email}</td>}
                                    {user.role === 'ADMIN' && <td>{res.user?.name}</td>}
                                    <td style={{ fontWeight: 500 }}>{res.reservationDate}</td>
                                    <td>{res.timeSlot}</td>
                                    <td>{res.guests} pax</td>
                                    <td style={{ color: 'var(--primary)', fontWeight: 600 }}>T-{res.table?.tableNumber}</td>
                                    <td>{res.table?.capacity} pax</td>
                                    <td>
                                        <span className={`status status-${res.status.toLowerCase()}`}>
                                            {res.status}
                                        </span>
                                    </td>
                                    <td>
                                        {res.status === 'BOOKED' ? (
                                            <button
                                                onClick={() => handleCancel(res.id)}
                                                className="btn btn-danger"
                                                style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}
                                            >
                                                Cancel Booking
                                            </button>
                                        ) : (
                                            <span className="text-secondary" style={{ fontSize: '0.85rem' }}>N/A</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default MyReservations
