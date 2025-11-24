# Investracker - Investment Tracker App

A comprehensive investment tracking application built with a **Node.js/Express backend** and a **React (Vite) frontend**. Track Gold, Stocks, Crypto, and Cash investments with live market data in INR.

## Architecture
- **Backend**: Node.js + Express + TypeScript + Mongoose
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Database**: MongoDB Atlas (cloud)
- **APIs**: CoinGecko, Alpha Vantage, metals.live

## Features
- 📊 Track multiple investment types (Gold, Stocks, Crypto, Cash)
- 💰 Real-time price updates in INR
- 📈 Portfolio dashboard with totals and profit/loss
- ✏️ Add, edit, delete investments
- ☁️ Cloud storage via MongoDB Atlas (access anywhere)

## Free APIs Used
- **Crypto**: CoinGecko (no API key)
- **Stocks**: Alpha Vantage (free API key, supports NSE/BSE)
- **Gold**: metals.live + CoinGecko PAX Gold

## Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB Atlas (free tier)
- Alpha Vantage API key (free)

## Setup Instructions

### 1. MongoDB Atlas (Free)
1. Visit [mongodb.com/atlas](https://www.mongodb.com/atlas) → Create account → Free shared cluster (M0)
2. Create DB user (username/password)
3. Allow network access (0.0.0.0/0 or your IP)
4. Get connection string (`mongodb+srv://...`)

### 2. Backend (server)
```bash
cd server
npm install
cp .env.example .env
```
Edit `server/.env`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=super_secret_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
```

Optional check:
```bash
npm run check-env
```

Run backend:
```bash
npm run dev
```
Server runs on `http://localhost:5000`

### 3. Frontend (client)
```bash
cd client
npm install
npm run dev
```
Frontend runs on `http://localhost:3000`

## Project Structure
```
investracker/
├── server/          # Express API
│   ├── src/
│   │   ├── index.ts         # app entry
│   │   ├── routes/          # REST endpoints
│   │   ├── services/        # price fetching logic
│   │   ├── config/          # Mongo connection
│   │   └── models/          # Mongoose schemas
│   └── package.json
├── client/          # React SPA
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   ├── api/
│   │   ├── utils/
│   │   └── types/
│   └── package.json
└── README.md
```

## API Endpoints (backend)
- `GET    /api/investments` — list investments
- `POST   /api/investments` — create investment
- `PUT    /api/investments/:id` — update investment
- `DELETE /api/investments/:id` — delete investment
- `POST   /api/investments/bulk` — bulk save (after price update)
- `GET    /api/prices/crypto/:symbol` — latest crypto price (INR)
- `GET    /api/prices/stock/:symbol` — latest stock price (INR)
- `GET    /api/prices/gold` — latest gold price (₹/gram)

## Usage
1. Start backend and frontend
2. Open `http://localhost:3000`
3. Click **Add Investment** (choose type, name, symbol, etc.)
4. Click **Update Prices** to fetch current market data
5. View dashboard totals and individual cards (edit/delete via icons)

## Technologies
- Backend: Node.js, Express, TypeScript, Mongoose, Axios
- Frontend: React 18, Vite, TypeScript, Tailwind CSS, Axios
- Database: MongoDB Atlas

## License
MIT
