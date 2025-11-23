# Investracker - Investment Tracker App

A comprehensive investment tracking application built with **Node.js/Express backend** and **React frontend**.

## Architecture

- **Backend**: Node.js + Express + TypeScript (REST API)
- **Frontend**: React + Vite + TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS

## Features

- 📊 Track multiple investment types: Gold, Stocks, Crypto, and Cash
- 💰 Real-time price updates using free APIs (all prices in Indian Rupees - ₹)
- 📈 Calculate profit/loss for each investment
- 📅 Track purchase dates and prices
- 💵 View total portfolio value and overall P&L
- ☁️ Cloud database storage with Supabase
- 🏅 Gold tracking in grams (no symbol required)

## Free APIs Used

- **Crypto**: CoinGecko API (free, no API key required) - prices converted to INR
- **Stocks**: Alpha Vantage API (free tier: 5 calls/min, 500 calls/day) - **Supports NSE and BSE symbols**
- **Gold**: Multiple fallback APIs including CoinGecko PAX Gold and metals.live - prices per gram in INR

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A free Supabase account

## Setup Instructions

### Step 1: Set Up Supabase (Free)

1. **Create a Supabase account**:
   - Visit [supabase.com](https://supabase.com)
   - Sign up (takes 1 minute)

2. **Create a new project**:
   - Click "New Project"
   - Choose a name, set password, choose region
   - Wait 2-3 minutes for setup

3. **Get your API credentials**:
   - Go to Project Settings → API
   - Copy your **Project URL**
   - Copy your **anon/public key**

4. **Set up the database**:
   - Go to SQL Editor
   - Copy and paste the contents of `supabase-setup.sql`
   - Click "Run"

### Step 2: Set Up Backend

1. **Navigate to server directory**:
```bash
cd server
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment variables**:
   - Copy the example file:
   ```bash
   cp .env.example .env
   ```
   - Edit `.env` file (located in `server/` directory) and add your credentials:
   ```
   PORT=5000
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
   ```

4. **Verify .env configuration** (optional):
```bash
npm run check-env
```

5. **Run the backend server**:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

**Important**: The `.env` file must be in the `server/` directory (same level as `package.json`).

### Step 3: Set Up Frontend

1. **Open a new terminal and navigate to client directory**:
```bash
cd client
```

2. **Install dependencies**:
```bash
npm install
```

3. **Run the frontend**:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Project Structure

```
investracker/
├── server/                 # Node.js/Express backend
│   ├── src/
│   │   ├── index.ts       # Express server entry point
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic (price fetching)
│   │   └── config/        # Configuration (Supabase)
│   └── package.json
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.tsx        # Main React component
│   │   ├── components/    # React components
│   │   ├── api/           # API client functions
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript types
│   └── package.json
└── supabase-setup.sql     # Database schema
```

## API Endpoints

### Investments
- `GET /api/investments` - Get all investments
- `POST /api/investments` - Create new investment
- `PUT /api/investments/:id` - Update investment
- `DELETE /api/investments/:id` - Delete investment
- `POST /api/investments/bulk` - Bulk update investments

### Prices
- `GET /api/prices/crypto/:symbol` - Get crypto price
- `GET /api/prices/stock/:symbol` - Get stock price
- `GET /api/prices/gold` - Get gold price

## Getting Alpha Vantage API Key

1. Visit [alphavantage.co/support/#api-key](https://www.alphavantage.co/support/#api-key)
2. Fill in the form (takes less than 20 seconds)
3. Copy your API key
4. Add it to `server/.env` file

## Usage

1. **Add Investment**: Click "Add Investment" and fill in details
2. **Update Prices**: Click "Update Prices" to fetch current market prices
3. **View Portfolio**: See all investments with current values and P&L
4. **Edit/Delete**: Use the edit (✎) or delete (×) buttons on each card

## Technologies Used

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: React, Vite, TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **APIs**: CoinGecko, Alpha Vantage

## License

MIT
