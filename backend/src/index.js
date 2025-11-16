import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdir } from 'fs/promises';
import distributionsRouter from './routes/distributions.js';
import safeRouter from './routes/safe.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from root directory
dotenv.config({ path: join(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create necessary directories
async function initializeDirectories() {
  const dirs = [
    join(__dirname, '../uploads'),
    join(__dirname, '../data')
  ];

  for (const dir of dirs) {
    try {
      await mkdir(dir, { recursive: true });
    } catch (error) {
      console.error(`Failed to create directory ${dir}:`, error);
    }
  }
}

// Routes
app.use('/api/distributions', distributionsRouter);
app.use('/api/safe', safeRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'LoopDrop Distribution API'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    error: error.message || 'Internal server error'
  });
});

// Start server
async function start() {
  try {
    await initializeDirectories();

    app.listen(PORT, () => {
      console.log(`🚀 LoopDrop Distribution API running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📡 API endpoints:`);
      console.log(`   - POST /api/distributions/upload-csv`);
      console.log(`   - POST /api/distributions/create`);
      console.log(`   - GET  /api/distributions`);
      console.log(`   - GET  /api/distributions/:id`);
      console.log(`   - POST /api/distributions/:id/propose`);
      console.log(`   - GET  /api/safe/info`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

export default app;
