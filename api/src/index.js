import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import enquiriesRouter from './routes/enquiries.js';
import r2Router from './routes/r2.js';
import statsRouter from './routes/stats.js';
import settingsRouter from './routes/settings.js';
import { initSchema } from './db/schema.js';
import { initR2Bucket } from './services/r2.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Mad Bespoke API',
    timestamp: new Date().toISOString(),
    env: {
      turso: Boolean(process.env.TURSO_DATABASE_URL),
      r2: Boolean(process.env.R2_ACCESS_KEY_ID),
    },
  });
});

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/enquiries', enquiriesRouter);
app.use('/api', r2Router); // Mounts /api/upload, /api/r2/presign, /api/media/*
app.use('/api/stats', statsRouter);
app.use('/api/settings', settingsRouter);

// Initialize DB schema & R2 bucket on startup
initSchema().catch((err) => console.error('[API Startup] DB schema init error:', err));
initR2Bucket().catch((err) => console.error('[API Startup] R2 bucket init note:', err.message));

app.listen(PORT, () => {
  console.log(`[Mad Bespoke API] Running on http://localhost:${PORT}`);
});
