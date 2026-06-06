# Quantum Guess - Cyberpunk Number Guessing Game (MERN Stack)

A complete, high-fidelity MERN Stack (MongoDB, Express.js, React.js, Node.js) web application featuring a cyberpunk glassmorphic design system. The application includes user authentication, real-time score persistence, historical game analytics, and a global top 10 leaderboard.

---

## ⚡ Game Concept & Mechanics

1. **Number Generation**: When a user initializes a session, the server/client generates a target integer $N \in [1, 100]$.
2. **Guess & Feedback**: The user submits guesses. The game replies with:
   - `TOO HIGH!` (with orange-glowing UI feedback)
   - `TOO LOW!` (with cyan-glowing UI feedback)
   - `CORRECT GUESS!` (with green-pulsing win animation)
3. **Thermometer Closeness Gauge**: A dynamic heat bar transitions between **Cold** (cyan), **Warm** (orange), and **Hot** (pink) based on the absolute mathematical difference of the guess from the target.
4. **Scoring Mechanism**: Rewards efficiency using the following formula:
   $$\text{Score} = \max\left(10, 100 - (\text{attempts} - 1) \times 10\right)$$
   - $1$ attempt = **$100$ pts** (Maximum)
   - $5$ attempts = **$60$ pts**
   - $\ge 10$ attempts = **$10$ pts** (Minimum)

---

## 📁 Project Structure

```
number-guessing-game/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable layout components (Navbar, protected gates)
│   │   ├── pages/          # Core pages (Dashboard, Login, Register, Profile, Leaderboard)
│   │   ├── services/       # API services (Axios client setup)
│   │   ├── App.jsx         # Root router & user state context
│   │   ├── index.css       # Premium Cyberpunk Glassmorphism theme
│   │   └── main.jsx        # Frontend entry point
│   ├── index.html          # HTML Entry with Orbitron & Outfit Google fonts
│   ├── package.json        # Frontend configuration and dependencies
│   └── vite.config.js      # Vite configuration + API reverse-proxy setup
│
└── server/                 # Express Backend (NodeJS)
    ├── config/             # Database connection setups
    ├── controllers/        # Core business/endpoint logic controllers
    ├── middleware/         # Security gates (JWT verifier)
    ├── models/             # Mongoose schemas (User & Score collections)
    ├── routes/             # Express routing binders
    ├── .env                # Server credentials (Port, database URIs, JWT keys)
    ├── package.json        # Backend dependencies listing
    └── server.js           # Express main server initialization file
```

---

## ⚙️ Environment Configuration

Create a `.env` file inside the `server/` folder (we have generated one for you by default):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/guessing_game
JWT_SECRET=super_secret_cyberpunk_token_key_12345
```

- `PORT`: The local port where the Express server listens (defaults to `5000`).
- `MONGO_URI`: Connection string to the MongoDB database (defaults to a local MongoDB instance).
- `JWT_SECRET`: Crypto seed key used to encrypt and decrypt JSON Web Tokens for auth verification.

---

## 🚀 Setup & Execution Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) installed and running locally, or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) URI.

---

### Step 1: Start MongoDB
Ensure your local MongoDB service is running:
- **Windows**: Run `net start MongoDB` in an administrative command line, or ensure the service is running in Windows Services.

---

### Step 2: Initialize & Launch the Backend Server
1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Run the backend server in development mode:
   ```bash
   npm run dev
   ```
   *The server should boot on port `5000` with the log: `MongoDB Connected: localhost`.*

---

### Step 3: Initialize & Launch the Frontend Client
1. Open a new terminal instance and navigate to the `client/` directory:
   ```bash
   cd client
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Boot the Vite development server:
   ```bash
   npm run dev
   ```
   *The client will boot on port `3000`. Navigate to `http://localhost:3000` in your web browser to play!*

---

## 🔌 API Documentation

All request bodies and responses are in **JSON** format.

### 1. Authentication Router (`/api/auth`)

#### ➔ Register New Node
- **Endpoint**: `POST /api/auth/register`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "name": "Keanu",
    "email": "keanu@matrix.com",
    "password": "secretpassword"
  }
  ```
- **Success Response (Code 201)**:
  ```json
  {
    "success": true,
    "_id": "64817a0b5f549221dc912a21",
    "name": "Keanu",
    "email": "keanu@matrix.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

#### ➔ Login Session
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "keanu@matrix.com",
    "password": "secretpassword"
  }
  ```
- **Success Response (Code 200)**:
  ```json
  {
    "success": true,
    "_id": "64817a0b5f549221dc912a21",
    "name": "Keanu",
    "email": "keanu@matrix.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

---

### 2. Scores & Leaderboard Router (`/api/scores`)

*Note: All endpoints below (except Leaderboard) require the header `Authorization: Bearer <token>`.*

#### ➔ Submit Game Score
- **Endpoint**: `POST /api/scores`
- **Access**: Private (Authenticated)
- **Request Body**:
  ```json
  {
    "score": 80,
    "attempts": 3
  }
  ```
- **Success Response (Code 201)**:
  ```json
  {
    "success": true,
    "data": {
      "userId": "64817a0b5f549221dc912a21",
      "score": 80,
      "attempts": 3,
      "_id": "64817d235f549221dc912a2a",
      "playedAt": "2026-06-06T05:22:42.000Z",
      "__v": 0
    }
  }
  ```

#### ➔ Retrieve Global Leaderboard
- **Endpoint**: `GET /api/scores/leaderboard`
- **Access**: Public
- **Success Response (Code 200)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "64817d235f549221dc912a2a",
        "userId": {
          "_id": "64817a0b5f549221dc912a21",
          "name": "Keanu"
        },
        "score": 100,
        "attempts": 1,
        "playedAt": "2026-06-06T05:22:42.000Z"
      }
    ]
  }
  ```

#### ➔ Retrieve User Run History
- **Endpoint**: `GET /api/scores/history`
- **Access**: Private (Authenticated)
- **Success Response (Code 200)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "64817d235f549221dc912a2a",
        "userId": "64817a0b5f549221dc912a21",
        "score": 80,
        "attempts": 3,
        "playedAt": "2026-06-06T05:22:42.000Z"
      }
    ]
  }
  ```
