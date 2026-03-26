import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import cloudinary from './config/cloudinary.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import uploadRoutes from './routes/upload.js';
import seedRoutes from './routes/seed.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Application = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Test Cloudinary connection (non-blocking)
setTimeout(() => {
  cloudinary.api.ping()
    .then(() => console.log('✅ Cloudinary connected successfully'))
    .catch((err) => console.error('❌ Cloudinary connection failed:', err.message));
}, 1000);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/seed', seedRoutes);

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'BridAfriPride Design API is running',
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get('/api', (_req: Request, res: Response) => {
  res.json({
    name: 'BridAfriPride Design API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      products: '/api/products',
      upload: '/api/upload',
    },
  });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response) => {
  console.error('Error:', err.stack);

  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.path} not found`,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 BridAfriPride Design API Server                      ║
║                                                           ║
║   Environment: ${process.env.NODE_ENV || 'development'}                                    
║   Port: ${PORT}                                             
║   Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}                
║                                                           ║
║   API Endpoints:                                          ║
║   - GET  /api/health                                      ║
║   - POST /api/auth/login                                  ║
║   - POST /api/auth/logout                                 ║
║   - GET  /api/products                                    ║
║   - POST /api/products                                    ║
║   - PUT  /api/products/:id                                ║
║   - DELETE /api/products/:id                              ║
║   - PATCH /api/products/:id/featured                      ║
║   - POST /api/upload                                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
