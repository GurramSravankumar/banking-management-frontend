import "./Sidebar.css";
import {useState} from "react";
import {
    FaTachometerAlt,
    FaUsers,
    FaUniversity,
    FaExchangeAlt
} from "react-icons/fa";
function Sidebar({setSelectedPage}) {
    const [showUsers,setshowUsers] = useState(false);   
    const [showAccounts,setshowAccounts] = useState(false);
    const [showTransactions,setshowTransactions] = useState(false); 
    return (
        <aside className="sidebar">
            <button>
                <FaTachometerAlt />
                <span>Dashboard</span>
                        </button>

            <button onClick={() => setshowUsers(!showUsers)}>
                <FaUsers />
                <span>Users</span>
            </button>
            {showUsers && (
                <div className="sub-menu">
                    <button onClick={() => setSelectedPage("pendingUsers")}>
                        Pending Users
                    </button>
                    <button onClick={() => setSelectedPage("approvedUsers")}>
                        Approved Users
                    </button>
                    <button onClick={() => setSelectedPage("rejectedUsers")}>
                        Rejected Users
                    </button>
                    <button onClick={() => setSelectedPage("blockedUsers")}>
                        Blocked Users
                    </button>
                    <button onClick={() => setSelectedPage("allUsers")}>
                        All Users
                    </button>
                </div>
            )}

            <button onClick={() => setshowAccounts(!showAccounts)}>
                <FaUniversity />
                <span>Accounts</span>
            </button>
            {showAccounts && (
                <div className="sub-menu">
                    <button onClick={() => setSelectedPage("allAccounts")}>
                        All Accounts
                    </button>
                    <button onClick={() => setSelectedPage("savingsAccounts")}>
                        Savings Accounts
                    </button>
                    <button onClick={() => setSelectedPage("loanAccounts")}>
                        Loan Accounts
                    </button>
                    <button onClick={() => setSelectedPage("fixedDepositAccounts")}>
                        Fixed Deposit Accounts
                    </button>
                </div>
            )}

            <button onClick={() => setshowTransactions(!showTransactions)}>
                <FaExchangeAlt />
                <span>Transactions</span>
            </button>
            {showTransactions && (
                <div className="sub-menu">
                    <button onClick={() => setSelectedPage("allTransactions")}>
                        All Transactions
                    </button>
                    <button onClick={() => setSelectedPage("completedTransactions")}>
                        Completed Transactions
                    </button>
                    <button onClick={() => setSelectedPage("pendingTransactions")}>
                        Pending Transactions
                    </button>
                    <button onClick={() => setSelectedPage("failedTransactions")}>
                        Failed Transactions
                    </button>
                </div>
            )}
        </aside>
    );
}

export default Sidebar;