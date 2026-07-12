import { useEffect, useState } from "react";
import useAuth from "../customHooks/useAuth";
import "./AllUsers.css";

function AllUsers() {
    const { getAllUsers } = useAuth();

    const [users, setUsers] = useState([]);
    const [menuOpen, setMenuOpen] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await getAllUsers();
                setUsers(usersData);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="all-users">

            <h1>All Users</h1>

            <table className="users-table">

                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {users.map((user) => (

                        <tr key={user.id}>

                            <td>{user.id}</td>

                            <td>{user.fullName}</td>

                            <td>{user.email}</td>

                            <td>{user.phone}</td>

                            <td>{user.role}</td>

                            <td>
                                <span className={`status ${user.status.toLowerCase()}`}>
                                    {user.status}
                                </span>
                            </td>

                            <td>
                                {new Date(user.createdAt).toLocaleDateString()}
                            </td>

                            <td>
                                {new Date(user.updatedAt).toLocaleDateString()}
                            </td>

                            <td className="action-cell">

                                <button
                                    className="menu-btn"
                                    onClick={() =>
                                        setMenuOpen(
                                            user.id === menuOpen ? null : user.id
                                        )
                                    }
                                >
                                    ⋮
                                </button>

                                {menuOpen === user.id && (

                                    <div className="action-menu">

                                        {user.status === "PENDING" && (
                                            <>
                                                <button>Approve</button>
                                                <button>Reject</button>
                                            </>
                                        )}

                                        {user.status === "APPROVED" && (
                                            <>
                                                <button>View</button>
                                                <button>Edit</button>
                                                <button>Block</button>
                                            </>
                                        )}

                                        {user.status === "BLOCKED" && (
                                            <>
                                                <button>View</button>
                                                <button>Unblock</button>
                                            </>
                                        )}

                                        {user.status === "REJECTED" && (
                                            <>
                                                <button>View</button>
                                                <button>Approve</button>
                                            </>
                                        )}

                                    </div>

                                )}

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default AllUsers;