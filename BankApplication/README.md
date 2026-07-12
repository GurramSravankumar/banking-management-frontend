# 🏦 SecureBank: Modern Banking Management System

<div align="center">
  <img src="https://img.shields.io/badge/Live_Demo-Visit_Now-brightgreen?style=for-the-badge&logo=vercel" alt="Live Demo" />
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Bank_Security-RSA-orange?style=for-the-badge&logo=letsencrypt" alt="Security" />
  <img src="https://img.shields.io/badge/Vite-4.0-purple?style=for-the-badge&logo=vite" alt="Vite" />
</div>

<br/>

A comprehensive financial management dashboard developed for both bank customers and administrative staff. Customers can view transaction histories, manage their profile, and execute transfers, while Administrators have sweeping controls over KYC approvals and systemic auditing.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **🛡️ Two-Tier Dashboards** | Separate, protected routing environments for Users and Administrators based on JWT claims. |
| **💳 Seamless Transactions** | Real-time state management ensuring instantaneous visual updates for account transfers and limits. |
| **🔐 KYC Approval Workflow** | Comprehensive Admin interface allowing operators to review, approve, or reject pending KYC documents. |
| **📡 Axios interceptors** | Secure API communication layer automatically attaching authorization bearers to every request. |
| **🗂️ Hash Routing** | Flawless SPA deployment to Github Pages ignoring cache mismatches via native hash routing constraints. |

---

## 🛠️ Tech Stack

**Frontend Architecture:**
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

---

## 🌐 Deployment

| Component | Platform | URL |
| :--- | :--- | :--- |
| **Frontend Web App** | GitHub Pages | [Access Dashboard](https://gurramsravankumar.github.io/banking-management-frontend/#/login) |
| **Security Layer** | JWT Roles | Stateless Token Auth |

---

## 🚀 Run Locally

**Prerequisites:**
* Node.js 18+
* Web Browser (Chrome/Edge/Firefox)

**Execution Commands:**
```bash
git clone https://github.com/GurramSravankumar/banking-management-frontend.git
cd banking-management-frontend
npm install
npm run dev
```
*(Runs securely on `http://localhost:5173` locally)*

---

## 📁 Project Structure

```text
BankApplication/
├── src/
│   ├── admin/                     # Administrator Protected Pages
│   │   ├── AdminDashboard.jsx
│   │   └── PendingKycPanel.jsx    # Admin KYC control systems
│   │
│   ├── components/                # Reusable UI Architecture
│   │   ├── DataTable.jsx          # Sortable Financial Tables
│   │   ├── Header.jsx             # Navigation & Branding
│   │   └── UserDashboard/         # Modular user sub-panels
│   │
│   ├── customHooks/               # React Custom logic encapsulation
│   │   └── useAuth.jsx            # Token validations
│   │
│   ├── pages/                     # Primary Routed Interfaces
│   │   ├── Home.jsx               # Landing Platform
│   │   ├── Login.jsx              # Secured Entry Point
│   │   ├── Register.jsx           # Account Creation
│   │   └── UserDashboard.jsx      # Financial Overview
│   │
│   ├── App.jsx                    # Routing configuration wrapper
│   └── main.jsx                   # Vite Entry (HashRouter mounted)
└── package.json                   # Dependency & Build scripts
```

---

## 🔮 Future Improvements
* **WebSocket Live Markets:** Implementing live stock and exchange rate tickers connected via WSS.
* **Biometric Auth:** Introducing WebAuthn passkey specifications allowing FaceID and Windows Hello logins.
* **Financial Data Export:** Allow users to instantly generate localized PDF and CSV tax reports natively entirely on the client side using `.blob()` architecture.
