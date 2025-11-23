# Investment Tracker - Backend Server

Node.js/Express backend API for the Investment Tracker application.

## Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Create `.env` file**:
   - Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   - Edit `.env` and add your credentials:
   ```
   PORT=5000
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
   ```

3. **Run the server**:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm run build
npm start
```

## Environment Variables

The `.env` file should be located in the `server/` directory (same level as `package.json`).

Required variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `ALPHA_VANTAGE_API_KEY` - Your Alpha Vantage API key (for stock prices)
- `PORT` - Server port (default: 5000)

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/investments` - Get all investments
- `POST /api/investments` - Create investment
- `PUT /api/investments/:id` - Update investment
- `DELETE /api/investments/:id` - Delete investment
- `POST /api/investments/bulk` - Bulk update investments
- `GET /api/prices/crypto/:symbol` - Get crypto price
- `GET /api/prices/stock/:symbol` - Get stock price
- `GET /api/prices/gold` - Get gold price

