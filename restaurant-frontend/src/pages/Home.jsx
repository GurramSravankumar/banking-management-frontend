import React, { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { API_BASE } from '../config'

function Home({ user }) {
    const [reservationDate, setReservationDate] = useState('')
    const [timeSlot, setTimeSlot] = useState('7:00 PM')
    const [guests, setGuests] = useState(2)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const slots = [
        '12:00 PM', '1:00 PM', '2:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'
    ]

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        try {
            const response = await axios.post(
                `${API_BASE}/api/reservations`,
                {
                    reservationDate,
                    timeSlot,
                    guests
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            )

            setSuccess(`Table reserved successfully! Table assigned: ${response.data.table.tableNumber}`)
            setReservationDate('')
            setTimeSlot('7:00 PM')
            setGuests(2)
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error)
            } else if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message)
            } else {
                setError('Booking failed. No tables available matching description on selected slots.')
            }
        } finally {
            setLoading(false)
        }
    }

    const getTodayString = () => {
        const today = new Date()
        const dd = String(today.getDate()).padStart(2, '0')
        const mm = String(today.getMonth() + 1).padStart(2, '0')
        const yyyy = today.getFullYear()
        return `${yyyy}-${mm}-${dd}`
    }

    return (
        <div>
            <div className="mb-6 flex-between" style={{ alignItems: 'flex-start', flexDirection: 'column', gap: '0.5rem' }}>
                <h2>Welcome to DineEase, {user.name}</h2>
                <p className="text-secondary">Choose your preferred date, time slot, and guest count below to reserve a table.</p>
            </div>

            <div className="grid-2">
                <div className="card">
                    <h3 className="card-title">Book a New Table</h3>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="date">Reservation Date</label>
                            <input
                                id="date"
                                type="date"
                                className="form-control"
                                min={getTodayString()}
                                value={reservationDate}
                                onChange={(e) => setReservationDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="timeSlot">Time Slot</label>
                            <select
                                id="timeSlot"
                                className="form-control"
                                value={timeSlot}
                                onChange={(e) => setTimeSlot(e.target.value)}
                                required
                            >
                                {slots.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="guests">Number of Guests</label>
                            <input
                                id="guests"
                                type="number"
                                min="1"
                                max="20"
                                className="form-control"
                                value={guests}
                                onChange={(e) => setGuests(parseInt(e.target.value))}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Securing reservation...' : 'Reserve Table'}
                        </button>
                    </form>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h3 className="card-title text-primary-color">Reservation Rules</h3>
                    <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', display: 'grid', gap: '1rem' }}>
                        <li>
                            <strong>Overlapping Slots Checks:</strong> DineEase automatically validates table bookings to prevent double-booking the same table for identical date/time slots.
                        </li>
                        <li>
                            <strong>Automatic Merging:</strong> If you book another reservation for the exact same date and time, DineEase will automatically merge your guests into a single larger table, if available!
                        </li>
                        <li>
                            <strong>Capacity Checks:</strong> The best-fit optimization allocates the smallest table capable of hosting your guest count to save larger spaces for bigger parties.
                        </li>
                        <li>
                            <strong>Cancellations:</strong> You can cancel your reservations at any time directly through the
                            <Link to="/reservations/my" style={{ color: 'var(--primary)', marginLeft: '0.25rem', fontWeight: 600 }}>My Bookings</Link> dashboard.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Home
