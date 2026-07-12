# 🍽️ DineEase: Restaurant Reservation System

<div align="center">
  <img src="https://img.shields.io/badge/Live_Demo-Visit_Now-brightgreen?style=for-the-badge&logo=vercel" alt="Live Demo" />
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Spring_Boot-3.5-brightgreen?style=for-the-badge&logo=spring" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/MySQL-8.0-orange?style=for-the-badge&logo=mysql" alt="MySQL" />
</div>

<br/>

A modern full-stack web application designed for smooth dining experiences. Customers can seamlessly browse availability, book tables, and avoid double-reservations using auto-merge technology. Administrators can manage floor plans, adjust capacities, and oversee active reservations.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **🛡️ Role-Based Auth** | Secure stateless JWT sessions enforcing Customer and Admin boundaries. |
| **🪑 Dynamic Seating** | Smart "Best-Fit Algorithm" allocates the smallest available table fitting the party. |
| **🔄 Auto-Merge Logic** | Double bookings gracefully merge guests to a bigger table to prevent duplicate rows. |
| **👨‍💼 Admin Dashboard** | Filter reservations by date, forcefully cancel bookings, and expand physical floor plans. |
| **🚫 Conflict Prevention** | Real-time database locks ensure no two groups can secure the same table simultaneously. |

---

## 🛠️ Tech Stack

**Frontend:**
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

**Backend:**
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=spring-security&logoColor=white)
![Hibernate](https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=Hibernate&logoColor=white)

**Database & Deployment:**
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=for-the-badge&logo=GitHub-Pages&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

---

## 🌐 Deployment

| Service | Platform | URL |
| :--- | :--- | :--- |
| **Frontend** | GitHub Pages | [DineEase Platform](https://gurramsravankumar.github.io/restaurant-reservation-frontend) |
| **Backend** | Render | [API Service](https://restaurant-reservation-system-iqjj.onrender.com) |
| **Database** | MySQL local/Cloud | Localhost mapped configuration |

---

## 🚀 Run Locally

**Prerequisites:**
* Java 21+
* Node.js 18+
* MySQL 8.0+

**Backend (API Server):**
```bash
git clone https://github.com/GurramSravankumar/restaurant-reservation-system.git
cd restaurant-reservation-system
./mvnw spring-boot:run
```
*(Make sure to provision the `restaurant_db` schema in MySQL before running)*

**Frontend (React Client):**
```bash
cd restaurant-frontend
npm install
npm run dev
```

---

## 📁 Project Structure

```text
Restaurant-Reservation-System/
├── backend/                       # Spring Boot REST API
│   └── src/main/java/com/sk/restaurant/
│       ├── config/                # Security Configs & CORS
│       ├── controller/            # API Endpoints (Auth, Table, Reserve)
│       ├── dto/                   # Data transfer protocols
│       ├── entity/                # ORM Database Models
│       ├── exception/             # ControllerAdvice Error Handling
│       └── service/               # Auto-merge and seating algorithms
│
└── frontend/                      # React SPA
    └── src/
        ├── components/            # Reusable Navbar, Modals, Cards
        ├── pages/                 # Home, Admin Dashboard, Login, My Bookings
        ├── index.css              # Custom design system with variables
        └── config.js              # Environment & API routing fallbacks
```

---

## 🔮 Future Improvements
* **Automated Table Combinations:** Adjoining isolated smaller tables dynamically for massive groups (10+ people) failing to fit one standard table.
* **Email Confirmations:** SMTP implementation delivering digital PDF receipts upon booking.
* **WebSocket Holds:** Real-time UX locking a table while the user is typing their reservation parameters.
