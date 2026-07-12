# Restaurant Reservation Management System

A full-stack table booking system designed with a secure Spring Boot REST API backend and a responsive Vite React frontend setup.

## 🏗️ Technology Stack
*   **Frontend**: React, React Router 6, Axios, HSL-themed Vanilla CSS.
*   **Backend**: Spring Boot 3.2.5, Spring Security, JWT (JJWT), Spring Data JPA.
*   **Database**: MySQL 8.x.

---

## 🚀 Setup Instructions

### 1. Backend Setup
1.  Open **Spring Tool Suite (STS)**.
2.  Import the Maven project from `d:\spring\restaurant-backend`.
3.  Ensure local MySQL is running. Create the database:
    ```sql
    CREATE DATABASE restaurant_db;
    ```
4.  Verify database credentials in `src/main/resources/application.properties`:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/restaurant_db?createDatabaseIfNotExist=true
    spring.datasource.username=root
    spring.datasource.password=939854
    ```
5.  Run the application as a **Spring Boot App** (runs on port `8080`).

### 2. Frontend Setup
1.  Navigate to `d:\react\restaurant-frontend` in your terminal.
2.  Install dependencies (if not done yet):
    ```bash
    npm install
    ```
3.  Launch the Vite developer server:
    ```bash
    npm run dev
    ```
4.  Open the web browser at `http://localhost:5173/`.

---

## 🧠 Core System Design & Concepts

### 1. Reservation Conflict & Overlapping Rules
*   **Zero Double-Booking**: During reservation requests, the service checks if a table has an active `BOOKED` slot for the selected date and time slot.
*   **Best-Fit Matching**: Seats are not assigned arbitrarily. The system selects the table with the smallest seating capacity that safely fits the party size. This leaves larger tables open for larger group bookings.
*   **Graceful Fails**: If no tables fit the capacity, or if all suitable tables are booked, an descriptive error message is returned.

### 2. Role-Based Access Control
*   **JWT Tokens**: Secure endpoints are shielded via Spring Security using stateless JWT verification filters.
*   **User Routing**:
    *   **Customer (USER)**: Access to create bookings on `/` and monitor reservations on `/reservations/my`.
    *   **Admin (ADMIN)**: Access to the Admin Dashboard (`/admin/dashboard`) to view/filter bookings, edit dates/slots/guests, and create/manage restaurant seating tables.
    *   Client routes are secure on the client side using `<PrivateRoute>` wrappers in `App.jsx` and on the API side using `.requestMatchers("/api/admin/**").hasRole("ADMIN")`.

---

## ⚠️ Known Limitations & Future Improvements
1.  **Fixed Time Slots**: Time slots are currently statically defined (e.g., "7:00 PM"). Custom durations or fine-grained timestamps could be implemented.
2.  **No Table Merging**: The system does not combine adjacent tables for very large groups.
3.  **Real-Time Sync**: Add WebSocket support for instant table status updates across administrators.
