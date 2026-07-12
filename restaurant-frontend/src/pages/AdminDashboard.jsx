import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE } from '../config'

function AdminDashboard({ user }) {
    const [activeTab, setActiveTab] = useState('reservations')

    const [reservations, setReservations] = useState([])
    const [filterDate, setFilterDate] = useState('')
    const [resLoading, setResLoading] = useState(false)
    const [resError, setResError] = useState('')

    const [tables, setTables] = useState([])
    const [tablesLoading, setTablesLoading] = useState(false)
    const [tablesError, setTablesError] = useState('')
    const [newTableNo, setNewTableNo] = useState('')
    const [newCapacity, setNewCapacity] = useState(2)
    const [successMsg, setSuccessMsg] = useState('')

    const [editingRes, setEditingRes] = useState(null)
    const [editDate, setEditDate] = useState('')
    const [editSlot, setEditSlot] = useState('')
    const [editGuests, setEditGuests] = useState(2)
    const [editError, setEditError] = useState('')

    const slots = [
        '12:00 PM', '1:00 PM', '2:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'
    ]

    const fetchAllReservations = async () => {
        setResLoading(true)
        setResError('')
        try {
            let endpoint = `${API_BASE}/api/admin/reservations`
            if (filterDate) {
                endpoint = `${API_BASE}/api/admin/reservations/date?date=${filterDate}`
            }
            const response = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${user.token}` }
            })
            const sorted = response.data.sort((a, b) => b.id - a.id)
            setReservations(sorted)
        } catch (err) {
            setResError('Failed to fetch reservations.')
        } finally {
            setResLoading(false)
        }
    }

    const handleCancelReservation = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this reservation?')) {
            return
        }
        setResError('')
        setSuccessMsg('')
        try {
            await axios.post(`${API_BASE}/api/admin/reservations/${id}/cancel`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            })
            setSuccessMsg('Reservation cancelled by admin.')
            fetchAllReservations()
        } catch (err) {
            setResError(err.response?.data?.error || 'Failed to cancel reservation.')
        }
    }

    const fetchTables = async () => {
        setTablesLoading(true)
        setTablesError('')
        try {
            const response = await axios.get(`${API_BASE}/api/tables`, {
                headers: { Authorization: `Bearer ${user.token}` }
            })
            setTables(response.data.sort((a, b) => a.tableNumber.localeCompare(b.tableNumber)))
        } catch (err) {
            setTablesError('Failed to load tables.')
        } finally {
            setTablesLoading(false)
        }
    }

    const handleCreateTable = async (e) => {
        e.preventDefault()
        setTablesError('')
        setSuccessMsg('')
        try {
            await axios.post(
                `${API_BASE}/api/tables`,
                { tableNumber: newTableNo, capacity: newCapacity },
                { headers: { Authorization: `Bearer ${user.token}` } }
            )
            setSuccessMsg(`Table T-${newTableNo} added successfully.`)
            setNewTableNo('')
            setNewCapacity(2)
            fetchTables()
        } catch (err) {
            setTablesError(err.response?.data || err.response?.data?.error || 'Failed to create table. Table number might already exist.')
        }
    }

    const handleDeleteTable = async (id) => {
        if (!window.confirm('Delete this table? Future reservations on this table might be affected.')) {
            return
        }
        setTablesError('')
        setSuccessMsg('')
        try {
            await axios.delete(`${API_BASE}/api/tables/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            })
            setSuccessMsg('Table deleted successfully.')
            fetchTables()
        } catch (err) {
            setTablesError(err.response?.data || 'Failed to delete table.')
        }
    }

    const openEditModal = (res) => {
        setEditingRes(res)
        setEditDate(res.reservationDate)
        setEditSlot(res.timeSlot)
        setEditGuests(res.guests)
        setEditError('')
    }

    const handleUpdateReservation = async (e) => {
        e.preventDefault()
        setEditError('')
        try {
            await axios.put(
                `${API_BASE}/api/admin/reservations/${editingRes.id}`,
                {
                    reservationDate: editDate,
                    timeSlot: editSlot,
                    guests: editGuests
                },
                { headers: { Authorization: `Bearer ${user.token}` } }
            )
            // Wait, we need API_BASE for update too:
            // let's write it:
            setSuccessMsg('Reservation updated successfully!')
            setEditingRes(null)
            fetchAllReservations()
        } catch (err) {
            setEditError(err.response?.data?.error || err.response?.data?.message || 'Failed to update reservation.')
        }
    }

    useEffect(() => {
        if (activeTab === 'reservations') {
            fetchAllReservations()
        } else {
            fetchTables()
        }
    }, [activeTab, filterDate])

    return (
        <div>
            <div className="mb-6 flex-between">
                <div>
                    <h2>Admin Dashboard</h2>
                    <p className="text-secondary">Administrative portal for reservations and table configurations.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        className={`btn ${activeTab === 'reservations' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab('reservations')}
                        style={{ width: 'auto' }}
                    >
                        📋 Reservations List
                    </button>
                    <button
                        className={`btn ${activeTab === 'tables' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab('tables')}
                        style={{ width: 'auto' }}
                    >
                        🪑 Seating Tables
                    </button>
                </div>
            </div>

            {successMsg && <div className="alert alert-success">{successMsg}</div>}

            {activeTab === 'reservations' && (
                <div className="card">
                    <div className="flex-between mb-4" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                        <h3 className="card-title" style={{ marginBottom: 0 }}>Review Bookings</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <label htmlFor="filterDate" className="form-label" style={{ marginBottom: 0 }}>Filter Date:</label>
                            <input
                                id="filterDate"
                                type="date"
                                className="form-control"
                                style={{ width: '180px', padding: '0.4rem 0.8rem' }}
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                            />
                            {filterDate && (
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setFilterDate('')}
                                    style={{ width: 'auto', padding: '0.4rem 0.8rem' }}
                                >
                                    Clear Filter
                                </button>
                            )}
                        </div>
                    </div>

                    {resError && <div className="alert alert-danger">{resError}</div>}

                    {resLoading ? (
                        <div className="loading">Updating reservations...</div>
                    ) : reservations.length === 0 ? (
                        <div className="empty-state">
                            <h3>No bookings found</h3>
                            <p>There are no bookings registered for the selected date filter.</p>
                        </div>
                    ) : (
                        <div className="table-container" style={{ marginTop: 0 }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Customer</th>
                                        <th>Date</th>
                                        <th>Time Slot</th>
                                        <th>Guests</th>
                                        <th>Assigned Table</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservations.map(res => (
                                        <tr key={res.id}>
                                            <td>
                                                <strong>{res.user?.name}</strong>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{res.user?.email}</div>
                                            </td>
                                            <td>{res.reservationDate}</td>
                                            <td>{res.timeSlot}</td>
                                            <td>{res.guests} pax</td>
                                            <td>
                                                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>T-{res.table?.tableNumber}</span>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '0.4rem' }}>
                                                    (cap: {res.table?.capacity})
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status status-${res.status.toLowerCase()}`}>
                                                    {res.status}
                                                </span>
                                            </td>
                                            <td>
                                                {res.status === 'BOOKED' ? (
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <button
                                                            onClick={() => openEditModal(res)}
                                                            className="btn btn-primary"
                                                            style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleCancelReservation(res.id)}
                                                            className="btn btn-danger"
                                                            style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
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
            )}

            {activeTab === 'tables' && (
                <div className="grid-2">
                    <div className="card">
                        <h3 className="card-title">Add Seating Table</h3>
                        {tablesError && <div className="alert alert-danger">{tablesError}</div>}

                        <form onSubmit={handleCreateTable}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="tableNo">Table Number / Label</label>
                                <input
                                    id="tableNo"
                                    type="text"
                                    placeholder="e.g. 101"
                                    className="form-control"
                                    value={newTableNo}
                                    onChange={(e) => setNewTableNo(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="tableCap">Seating Capacity</label>
                                <input
                                    id="tableCap"
                                    type="number"
                                    min="1"
                                    max="30"
                                    className="form-control"
                                    value={newCapacity}
                                    onChange={(e) => setNewCapacity(parseInt(e.target.value))}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-accent">
                                ➕ Register Table
                            </button>
                        </form>
                    </div>

                    <div className="card">
                        <h3 className="card-title">Current Restaurant Configuration</h3>
                        {tablesLoading ? (
                            <div className="loading">Updating tables list...</div>
                        ) : tables.length === 0 ? (
                            <div className="empty-state">
                                <h3>No Seating Configured</h3>
                                <p>Register tables using the layout creator to receive reservations.</p>
                            </div>
                        ) : (
                            <div className="table-container" style={{ marginTop: 0 }}>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Table Name</th>
                                            <th>Max Cap</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tables.map(tbl => (
                                            <tr key={tbl.id}>
                                                <td style={{ fontWeight: 600 }}>T-{tbl.tableNumber}</td>
                                                <td>{tbl.capacity} guests max</td>
                                                <td>
                                                    <button
                                                        onClick={() => handleDeleteTable(tbl.id)}
                                                        className="btn btn-danger"
                                                        style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem', width: 'auto' }}
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {editingRes && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="card-title">Modify Reservation #{editingRes.id}</h3>
                        {editError && <div className="alert alert-danger">{editError}</div>}

                        <form onSubmit={handleUpdateReservation}>
                            <div className="form-group">
                                <label className="form-label">Client Details</label>
                                <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' }}>
                                    <strong>{editingRes.user?.name}</strong> ({editingRes.user?.email})
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="editDate">Reservation Date</label>
                                <input
                                    id="editDate"
                                    type="date"
                                    className="form-control"
                                    value={editDate}
                                    onChange={(e) => setEditDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="editSlot">Time Slot</label>
                                <select
                                    id="editSlot"
                                    className="form-control"
                                    value={editSlot}
                                    onChange={(e) => setEditSlot(e.target.value)}
                                    required
                                >
                                    {slots.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="editGuests">Guests</label>
                                <input
                                    id="editGuests"
                                    type="number"
                                    min="1"
                                    className="form-control"
                                    value={editGuests}
                                    onChange={(e) => setEditGuests(parseInt(e.target.value))}
                                    required
                                />
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setEditingRes(null)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminDashboard
