# 🏢 SERVIX – Residential Service Management System

SERVIX is a **full-stack MERN application** designed to bridge the operational gap between residents and maintenance staff in large residential societies.
It integrates **AI-powered issue triage, real-time WebSocket communication, and a secure financial settlement system** to streamline maintenance workflows.

---

# 🚀 Key Features

## 🛡️ Role-Based Access Control (RBAC)

### System Admin

* Monitors platform growth through **Recharts analytics dashboards**
* Manages global **society directories and user records**
* Oversees system-wide operational metrics

### Society Manager

* Manages **society-level issue logs**
* Assigns maintenance workers to reported issues
* Monitors staff availability and performance
* Tracks financial settlements and payments

### Citizen (Resident)

* Reports maintenance issues through **AI-assisted forms**
* Uploads photos of the issue for analysis
* Tracks assigned worker **live on an interactive map**
* Pays service invoices through a **secure billing UI**

### Maintenance Worker

* Uses a **Map-first dashboard** to view nearby tasks
* Receives **real-time job notifications**
* Updates issue progress and submits resolution notes
* Manages earnings through a **digital wallet system**

---

# 🧠 AI Integration (Google Gemini & Llama 3.2)

### Smart Triage

Uses **Computer Vision** to analyze uploaded issue photos and automatically suggest:

* Issue category
* Issue title
* Maintenance type

This reduces manual input for residents and improves reporting accuracy.

### Professional Summarizer

Applies **Natural Language Processing (NLP)** to transform raw worker notes into **clean professional maintenance reports** that are sent to residents via email.

### Heuristic Insights

A **rule-based analysis engine** scans historical issue data to detect recurring **maintenance hotspots and infrastructure trends** within societies.

---

# ⚡ Real-Time Operations

### Socket.io Event Loop

Implements **bi-directional WebSocket communication** enabling:

* Instant issue status updates to residents
* Real-time task notifications to workers
* Live dashboard updates without page refresh

### Live Worker Tracking

Utilizes:

* **Browser Geolocation API**
* **WebSockets**
* **Leaflet Maps**

to stream a worker’s live coordinates directly to the resident's tracking map.

---

# 💳 Fintech & Billing

### Invoice-to-Settlement Workflow

Workers generate service invoices which go through a **secure verification pipeline** before funds are credited to the worker’s virtual wallet.

### Security Measures

* **State Idempotency** prevents duplicate payments
* **Request Ownership Validation** prevents unauthorized financial actions
* Backend verification ensures all transactions remain secure

---

# 🛠️ Tech Stack

## Frontend

* **React 18** (with Vite for fast builds)
* **Redux Toolkit** for centralized state management
* **Tailwind CSS v4** for modern UI styling
* **Leaflet.js** for geospatial maps
* **Recharts** for analytics dashboards

## Backend

* **Node.js**
* **Express.js** (MVC Architecture)
* **MongoDB**
* **Mongoose ODM**
* **Socket.io** for real-time communication
* **JWT Authentication**
* **Bcrypt.js** for password hashing

## Third-Party Services

* **Google Gemini API** – AI text and vision analysis
* **Cloudinary** – image upload and storage
* **Nodemailer** – automated email notifications
* **Nominatim API** – address to coordinate geocoding

---

# 🏗️ System Architecture

Client (React + Redux)
│
│ REST API + WebSockets
▼
Node.js / Express Backend
│
│ Mongoose ODM
▼
MongoDB Database

External Services
• Google Gemini API
• Cloudinary
• Nominatim Geocoding API
• SMTP Email Server

---

# 📂 Project Structure

SERVIX
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── validations
│   ├── middleware
│   └── utils
│
├── frontend
│   ├── components
│   ├── pages
│   ├── store
│   ├── api
│   └── hooks

---

# ⚙️ Installation & Setup

## Clone the Repository

git clone https://github.com/Fathimath-Afra/SERVIX.git
cd SERVIX

---

## Setup Backend

cd backend
npm install

# Create a .env file and add required environment variables

npm run dev

---

## Setup Frontend

cd ../frontend
npm install

npm run dev

---

## Frontend (.env)

VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

---

# 📈 Architecture Highlights

### State Strategy

* **Context API** manages stable identity state (authentication)
* **Redux Toolkit** manages high-frequency operational data such as issues, workers, and notifications

### Performance Optimizations

* **Debounced search queries** to reduce backend load
* **Multer MemoryStorage** for efficient AI image processing before upload
* Efficient React component re-rendering using memoization

### Data Integrity

Implemented **Mongoose population** to ensure relational data such as worker and society names always reflect the latest database state.

---

# 📜 License

This project is licensed under the **MIT License**.
