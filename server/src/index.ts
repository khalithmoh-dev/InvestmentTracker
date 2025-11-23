import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import investmentsRouter from './routes/investments';
import pricesRouter from './routes/prices';

// Load .env file from server root directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Check if required environment variables are set
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.warn('⚠️  Warning: Supabase credentials not found in .env file');
  console.warn('   Please create a .env file in the server/ directory with:');
  console.warn('   SUPABASE_URL=your_supabase_url');
  console.warn('   SUPABASE_ANON_KEY=your_supabase_key');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/investments', investmentsRouter);
app.use('/api/prices', pricesRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Investment Tracker API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

