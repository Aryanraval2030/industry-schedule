import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedProductsIfNeeded } from './seed/seeder.js';
import productRoutes from './routes/productRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow local development and deployed frontend
const allowedOrigins = [
  'https://industry-schedule.vercel.app',
];

// Enable CORS
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

// Request logging in development
if (process.env.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'E-commerce API server is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);

// Catch-all 404 handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use(errorHandler);

// Start server after connecting to database
const startServer = async () => {
  try {
    await connectDB();
    await seedProductsIfNeeded();

    app.listen(PORT, () => {
      console.log('\n======================================================');
      console.log(`🚀 E-Commerce Server is running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📦 Product API: http://localhost:${PORT}/api/products`);
      console.log(`💳 Payment API: http://localhost:${PORT}/api/payment/config`);
      console.log('======================================================\n');
    });
  } catch (err) {
    console.error('Fatal Server Boot Error:', err.message);
    process.exit(1);
  }
};

startServer();

export default app;