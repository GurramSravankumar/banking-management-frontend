# 🍽️ DineEase: Enterprise Restaurant Management

A production-grade, highly-concurrent Restaurant Reservation platform engineered to seamlessly bridge the gap between hungry dining customers and active restaurant operators. Equipped with intelligent capacity-matching algorithms, this system natively blocks double-bookings while automatically grouping continuous reservations on the fly to maximize restaurant spatial efficiency.

<div align="center">
  <img src="https://img.shields.io/badge/Java-21-red?style=for-the-badge&logo=openjdk" alt="Java" />
  <img src="https://img.shields.io/badge/Spring_Boot-3.5-brightgreen?style=for-the-badge&logo=spring-boot" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/PostgreSQL_Ready-MySQL-blue?style=for-the-badge&logo=mysql" alt="Database" />
  <img src="https://img.shields.io/badge/Security-JWT_Stateless-orange?style=for-the-badge&logo=springsecurity" alt="JWT Security" />
</div>

---

## 🌐 Live Demo

* **Frontend Client:** [Launch Application](https://gurramsravankumar.github.io/restaurant-reservation-frontend)
* **Backend Origin:** [Render Active Cluster](https://restaurant-reservation-system-iqjj.onrender.com)
* **API Base URL:** `https://restaurant-reservation-system-iqjj.onrender.com`

---

## 📖 Project Overview

Modern restaurant dining floors are highly chaotic environments. Attempting to manage physical tables synchronously against real-time digital walk-ins leads to spatial fragmentation (putting a group of 2 at a table meant for 8) and catastrophic double-bookings via overlapping schedules. 

**DineEase** solves this by shifting the computing burden onto a Spring Boot logic layer. Instead of operators manually assigning slots, the API uses a `Best-Fit` seating algorithm sorting structural tables mathematically. Furthermore, it strictly isolates User states via RSA-signed JSON Web Tokens (`JWT`) to ensure strict boundaries between standard diners and restaurant administrators.

---

## ✨ Features

**Authentication & Authorization**
* ✅ Stateless JWT (JSON Web Token) Bearer issuance
* ✅ B-Crypt one-way hashing for database passwords
* ✅ Route-Level `HttpSecurity` filtering separating `/api/admin` from typical operations

**Customer Features**
* ✅ View personal reservation history dynamically filtered by `userId`.
* ✅ Automated auto-upgrades if the user books again for the exact same timeslot.
* ✅ Secure, destructive cancellations limited strictly to their own entity ID.

**Admin Features**
* ✅ Override privileges across all User accounts.
* ✅ Filter Active reservations securely by arbitrary given dates.
* ✅ Execute sweeping modifications (time/guest adjustments) to existing blocks.

**Table & Reservation Management**
* ✅ Dynamic floor-plan injections via Admin APIs (adding new Tables instantly).
* ✅ Concurrent transaction verification proactively verifying table availability.

---

## 📸 Screenshots

*(To attach visuals of the deployed application, insert media links below)*

* **Home Overview:** `<!-- [Insert URL Here] -->`
* **Secure Registration:** `<!-- [Insert URL Here] -->`
* **Customer Dashboard:** `<!-- [Insert URL Here] -->`
* **Admin Floorplan Interface:** `<!-- [Insert URL Here] -->`
* **Reservations Booking Screen:** `<!-- [Insert URL Here] -->`

---

## 🛠️ Technology Stack

| Architecture Layer | Core Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 / Vite | Component-driven UI mechanics |
| **Backend Core** | Spring Boot 3 | API routing & Dependency Injection |
| **Data Persistence** | Spring Data JPA | SQL abstration mapping |
| **Storage Unit** | MySQL / PostgreSQL | Relational Entity storage |
| **Authentication** | Spring Security 6 | HTTP Security Filter Chains |
| **Deployment Platform**| Render / GithubPages| Auto-scaling CI pipelines |
| **Build Automator** | Apache Maven | Project Object Model dependency mapping |

---

## 🧠 System Architecture

**1. The Request Flow:**
Clients make external network HTTP calls containing active JWT Strings attached to `Authorization` mapping headers. 

**2. The JWT Filter Chain:**
`JwtAuthenticationFilter.java` statically intercepts the payload, extracts the claims signature without hitting the database, parses the role context (`USER` vs `ADMIN`), and populates the `SecurityContextHolder`.

**3. Business Abstraction:**
Using strict separation of concerns, `Controllers` handle direct JSON mapping while relying entirely on `Service` beans (e.g., `ReservationServiceImpl`) to manipulate domain entities natively via active `JpaRepositories`.

---

## 📁 Project Structure

```text
src/main/java/com/sk/restaurant/
├── config/
│   ├── DatabaseSeeder.java         # Native initialization of Admin/Users/Tables
│   ├── JwtAuthenticationFilter.java# Intercepts Bearer tokens for validation
│   └── SecurityConfig.java         # Global CORS and HttpSecurity parameters
│
├── controller/
│   ├── AdminController.java        # Protected overarching DB manipulators
│   ├── AuthController.java         # Token issuance endpoints
│   ├── ReservationController.java  # Booking generation mechanisms
│   └── TableController.java        # Floorplan administration
│
├── dto/
│   ├── AuthRequest.java            # Registration payload models
│   ├── ReservationRequest.java     # Capacity logic wrappers
│   └── JwtResponse.java            # Standardized client-facing token deliveries
│
├── entity/
│   ├── Reservation.java            # Booking lifecycle entity
│   ├── Table.java                  # Physical restaurant table entity
│   └── User.java                   # Account owner entity
│
├── exception/
│   └── GlobalExceptionHandler.java # @ControllerAdvice for uniform 400s
│
├── repository/
│   ├── ReservationRepository.java  # Custom overlapping SQL verifications
│   ├── TableRepository.java        # Space availability fetching
│   └── UserRepository.java         # Email/Auth verification lookups
│
└── service/
    ├── AuthServiceImpl.java        # B-Crypt implementations
    ├── JwtService.java             # Signing logic & Expirations mechanisms
    └── ReservationServiceImpl.java # Automated conflict prevention & Seat merging
```

---

## 🗄️ Database Design

The relational mapping operates under strict one-to-many associations utilizing InnoDB paradigms for data constraint integrity:

* `User`: (Id, Name, Email, Password, Role). Enforces unique index limits on `Email` rows inherently.
* `RestaurantTable`: (Id, TableNumber, Capacity). Holds physical constraints for spatial limits.
* `Reservation`: (Id, Date, TimeSlot, GuestCount, Status). Maps inherently to `User` and `RestaurantTable` utilizing `@ManyToOne` bindings enforcing foreign-key cascade restrictions. 

---

## 🔐 Authentication & Authorization

Implemented utilizing a strictly stateless specification to allow limitless scaling without RAM session overhead.
* **Token Standard:** JWT configured with explicit 24-hr expiry windows.
* **Filter Interception:** Subclassing `OncePerRequestFilter` to forcefully test the token payload before reaching downstream controllers.
* **BCrypt Validation:** Passwords are mathematically heavily hashed via `spring-security-crypto` before ever hitting a commit trace.
* **CORS Protocol:** Cross-Origin filters explicitly deny raw-access unless originating from strict domains `*.github.io` preventing XSS script hijacking vectors.

---

## ⚙️ Core Business Logic

* **The Conflict Algorithm:** If a client requests a booking, the Repository engine executes `existsByTableIdAndReservationDateAndTimeSlot()`. If the result flags positive, it structurally abandons the physical table instance and scans the floorplan for the next viable asset mathematically capable of sustaining the GuestCount limitation.
* **Smart Booking Logic:** (Feature) If an identical User requests two conflicting reservations at the mathematically identical Time & Date slot, the `ReservationService` intercepts the duplicate object. It aggregates total `Guests`, deletes the initial Table correlation, and natively seeks a physical Table large enough to encompass the aggregated total—effectively saving a seat allocation.

---

## 📡 API Documentation

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | ❌ | Issues initial User footprint & JWT token |
| `POST` | `/auth/login` | ❌ | Validates payload against internal AuthenticationManager |
| `GET` | `/api/reservations/my`| 🟢 | Returns encapsulated reservations isolated for the active JWT |
| `POST` | `/api/reservations` | 🟢 | Emits Best-Fit Table allocations blocking simultaneous double bookings |
| `GET` | `/api/admin/reservations`| 🔴 | Returns complete universal tracking lists |
| `PUT` | `/api/admin/reservations/{id}`|🔴 | Directly overrides specific internal properties on bookings |
| `POST`| `/api/admin/tables` | 🔴 | Modifies structural active Restaurant layouts on the fly |

*(Auth keys: ❌ Public / 🟢 Valid User / 🔴 Admin Restriction)*

---

## 🚨 Error Handling

Using Spring AOP semantics, custom Exception hierarchies (i.e. `ResourceNotFoundException`, `InvalidReservationException`) automatically bubble up to `GlobalExceptionHandler.java`. Standard exceptions are immediately isolated, preventing `500 Server Errors`, instead resolving to concise JSON `400 Bad Request` mapping arrays containing standard readable instructions allowing the React Client to render visual toasts natively without exploding.

---

## 🖥️ Local Installation Guide

**Prerequisite System Checks:**
1. Git CLI installed
2. Java 21+ JVM
3. Local MySQL environment configured over `Port 3306`.

**Initial Checkout:**
```bash
git clone https://github.com/GurramSravankumar/restaurant-reservation-system.git
cd restaurant-reservation-system/restaurant-backend
```

**Generate SQL Container:**
Run the following SQL instruction set inside an active MySQL GUI (Workbench / Dbeaver):
```sql
CREATE DATABASE restaurant_db;
```

**Boot Engine:**
```bash
./mvnw spring-boot:run
```

---

## 🌐 Environment Variables

| Variable | Description | Required | Default Target |
| :--- | :--- | :--- | :--- |
| `DB_URL` | Application properties URL mapping | ✅ | `jdbc:mysql://localhost:3306/restaurant_db` |
| `DB_USERNAME` | Production MySQL Username | ✅ | `root` |
| `DB_PASSWORD` | Production MySQL Password | ✅ | Configurable |
| `JWT_SECRET` | 256-bit Hex signature Key | ✅ | Test Vector fallback string |
| `PORT` | Render listening API port | ❌ | `8080` |

---

## 🚀 Build & Deployment

* **Backend Render Integration:** This application natively integrates over standard `.jar` boot generation. Build parameters explicitly set containerization profiles mapping environmental variables visually on Render's configuration panels dynamically mapping to the `application.properties` context hooks.
* **GitHub Pages Integration:** The React SPA statically builds DOM elements executing via `<BrowserRouter basename="">` catching trailing HTTP limits universally targeting the Render instance mathematically via dynamic `VITE_API_URL` routing keys.

---

## 📊 Performance & Optimization

* **Eager Data Restrictions:** Controller boundaries deliberately restrict raw nested objects utilizing custom explicit `DTO` representations preventing infinite recursion via recursive SQL loading sequences natively.
* **Query Reductions:** Algorithms querying table capacity fetch specific conditional boundaries via SQL rather than loading all tables over un-optimized Java Memory logic processing loops, vastly limiting GC pauses dynamically on high-booking server peaks.

---

## 🔮 Future Enhancements

* **Email Push Notifications:** Extending `JavaMailSender` logic emitting graphical HTML tickets dynamically directly back to generated generic users.
* **Redis Caching Constraints:** Setting immediate expiration TTL limits against physical Tables utilizing caching protocols locking seating constraints instantly against simultaneous request traffic overlapping milliseconds dynamically before standard row insertions even fire off to PostgreSQL/MySQL instances.
* **WebSocket Streams:** Broadening Admin dashboard visuals executing continuous ping telemetry instantly reloading component grids natively when incoming bookings execute successfully completely devoid of any User refreshing interactions.

---

## 🎓 Learning Outcomes
Producing this system drastically optimized fundamental understandings relating heavily to component decoupled design. Shifting explicit monolithic constraints out of standard HTTP calls heavily towards separated abstraction boundaries implementing `@Service` constraints proved remarkably scalable. 

Implementing JWT statelessness massively improved comprehensive security knowledge revolving cleanly preventing CSRF interactions universally via strictly configured stateless CORS configurations limiting dynamic origins to static URLs.

---

## 🧑‍💻 Author

**Sravan Kumar Gurram**
* 🏢 **LinkedIn:** [Reach out dynamically]
* 🐙 **GitHub:** [@GurramSravankumar](https://github.com/GurramSravankumar)
* 💼 **Portfolio:** [Standard Link Insert]

---

## 📄 License
This project natively utilizes standard open-source conventions strictly under MIT License bounds.

