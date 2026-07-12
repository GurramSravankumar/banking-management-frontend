# 🏦 SecureBank: Enterprise Front-End Architecture

A production-grade, highly-secured React Single Page Application (SPA) providing financial clients and bank administrators with a seamless, resilient, and instantly responsive banking dashboard. Engineered for 100% decoupling from the backend, the application relies on deeply integrated JWT inspection, client-side HashRouting algorithms, and Axios request interceptors to enforce granular access privileges dynamically at runtime.

<div align="center">
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Vite-4.0-purple?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Deployment-GitHub_Pages-green?style=for-the-badge&logo=githubpages" alt="GitHub Pages" />
  <img src="https://img.shields.io/badge/Router-HashRouter-red?style=for-the-badge&logo=reactrouter" alt="Router" />
</div>

---

## 🌐 Live Demo

* **Frontend Client:** [Launch Secure Dashboard](https://gurramsravankumar.github.io/banking-management-frontend/#/)
* **Backend Origin:** [Render Cluster API](https://banking-management-system.onrender.com)
* **API Base URL:** `https://banking-management-system.onrender.com/api`

---

## 📖 Project Overview

Modern financial applications require extreme resilience on the client side while mitigating CSRF and XSS injection vectors. Traditional server-side rendering introduces unnecessary overhead for administrative table manipulation. 

**SecureBank Frontend** solves this by establishing strict isolation through the `useAuth` hook and `<ProtectedRoute>` component wrappers. Administrators can instantly approve KYC documents natively in their browser, triggering asynchronous Axios background commits (via interceptors), while customers experience fluid `HashRouter` transitions without triggering continuous browser reloads or 404 cache misses typical of native GitHub Pages deployments.

---

## ✨ Features

**Authentication & Authorization**
* ✅ Centralized local-storage state mapping containing decoded structural JWT claims.
* ✅ Automated Axios bearer injection intercepting every outbound `HTTP` request natively.
* ✅ Absolute Route separation strictly guarding `/admin` URIs from standard User identities.

**Customer Features**
* ✅ Dynamic Profile Dashboard rendering real-time synchronized account metrics.
* ✅ Seamless internal financial transfer simulations executing client-side limitation validations organically.
* ✅ Localized KYC submission panels allowing dynamic `.blob` tracking uploads.

**Admin Features**
* ✅ Master `PendingKycPanel` grid filtering unstructured data streams asynchronously.
* ✅ Forceful account approval and rejection switches firing mapped `PUT` override requests.
* ✅ Universal analytical charts breaking down real-time active system thresholds.

**Performance & Deployment**
* ✅ Vite Hot-Module Replacement (HMR) pushing sub-millisecond compilation pipelines.
* ✅ Native Github Pages deploy scripting utilizing cache-resistant Hash routing `#` limits avoiding complex proxy overrides.

---

## 📸 Screenshots

*(Visuals of active deployments render beneath)*

* **Home & Landing Portal:** `<!-- Insert URL Here -->`
* **Secure Registration:** `<!-- Insert URL Here -->`
* **Customer Dashboard:** `<!-- Insert URL Here -->`
* **Admin Verification Interface:** `<!-- Insert URL Here -->`
* **Transfer Executions:** `<!-- Insert URL Here -->`

---

## 🛠️ Technology Stack

| Architecture Layer | Core Technology | Purpose |
| :--- | :--- | :--- |
| **Component Engine** | React 18 | Declarative Functional execution |
| **Bundler & Tooling**| Vite | Unbundled native ESM environment |
| **Network Client** | Axios | Configurable HTTP Promise abstractions |
| **Routing Protocol** | React Hash Router | Isolated native client-side navigation |
| **Package Manager** | NPM | Ecosystem dependency isolation |
| **Design Language** | Vanilla CSS3 / Tailwind | Cascading structural style layouts |

---

## 🧠 System Architecture

**1. The Component Flow:**
Initial HTTP rendering points directly towards `main.jsx` where the `<HashRouter>` mounts. The React virtual DOM establishes `<App />` and inherently filters pathways explicitly routing Users matching the active JWT configuration context.

**2. Axios Interceptors:**
To strictly prevent unprotected REST executions, every component utilizing network activity references a singleton Axios instance. 
Before making a request to the Java backend, the interceptor natively parses `localStorage.getItem("token")` and attaches `Authorization: Bearer <token>` to the outbound header. If 401 Unauthorized returns, the interceptor automatically forces a redirect to `/login`.

**3. The Role Guard:**
`<ProtectedRoute>` components mathematically check the target requirement (e.g. `role="ADMIN"`) directly against the local claims string. Violations push a generic React `<Navigate to="/" replace />` action instantly clearing the threat vector.

---

## 📁 Project Structure

```text
SecureBank/
├── src/
│   ├── admin/                     # Administrator Restricted Pages
│   │   ├── AdminDashboard.jsx     # Master control UI
│   │   └── PendingKycPanel.jsx    # Real-time data tables
│   │
│   ├── components/                # Application Wide Components
│   │   ├── Header.jsx             # Active stateless navigation
│   │   ├── DataTable.jsx          # Sortable scalable data grids
│   │   └── UserDashboard/         # Componentized customer views
│   │       └── ProfilePanel.jsx   # Encapsulated state panels
│   │
│   ├── pages/                     # Public routing paths
│   │   ├── Home.jsx               # Entry-point advertisement
│   │   ├── Login.jsx              # Token verification trigger
│   │   └── Register.jsx           # Spring API User generator
│   │
│   ├── customHooks/               # Modular logic encapsulations
│   │   └── useAuth.jsx            # Token inspection logic
│   │
│   ├── App.jsx                    # Routing configuration wrapper
│   └── main.jsx                   # Vite ROOT Mount (HashRouter)
└── package.json                   # Dependency & GitHub deploy scripts
```

---

## 🚨 Security & Validation

* **Token Interception:** Statically injecting tokens natively completely shields API payloads from brute force access without physical DOM context limits.
* **Component-Level Checking:** Invalid configurations physically fail to mount to the DOM, limiting generic users from observing the native XML payload of an administrative portal natively rendering null trees.
* **Client Validation:** Pre-verifying transfer limitations (e.g., stopping users from requesting amounts > localized account balance) eliminating wasted, unnecessary Java processing network round-trips entirely.

---

## 🖥️ Local Installation Guide

**Prerequisite System Checks:**
1. Git CLI installed
2. Node 18+ runtime architecture active
3. Web Browser

**Initial Checkout:**
```bash
git clone https://github.com/GurramSravankumar/banking-management-frontend.git
cd banking-management-frontend
```

**Boot Engine:**
```bash
npm install
npm run dev
```

---

## 🔮 Future Enhancements

* **State Management via Redux Toolkit:** Transitioning localized prop drilling explicitly towards a centralized persistent Redux node architecture dynamically caching complex KYC payloads natively.
* **Biometric Auth Integration:** Invoking the Web Authentication API allowing native Windows Hello and Apple FaceID passkey integrations explicitly generating local keystore asymmetric logins directly onto the bank server endpoints.

---

## 💼 Author

**[Your Name]** 
* Java Full Stack Developer
* 🏢 **LinkedIn:** [Insert Link]
* 🐙 **GitHub:** [@GurramSravankumar](https://github.com/GurramSravankumar)

## 📄 License
MIT Open Source Configuration.
