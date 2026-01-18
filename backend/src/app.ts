import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { config } from '@config/env.config';
import { initializePassport } from '@config/passport.config';
import authRoutes from './auth/routes/auth.routes.js';
import userRoutes from './user/routes/user.routes.js';
import {rateLimiter} from "@/middleware/rate-limiter.middleware";
import {errorHandler} from "@/middleware/error-handler.middleware";
import {mongoSanitizeMiddleware} from "@/middleware/mongodb-sanitize.middleware";
import commentRoutes from "@/comment/routes/comment.routes";

const app: Application = express();

// Security Middleware
app.use(helmet()); // Set security headers
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(mongoSanitizeMiddleware({ replaceWith: "_" })); // Sanitize data against NoSQL injection

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression Middleware
app.use(compression());

// Logging Middleware
if (config.isDevelopment) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Initialize Passport
app.use(initializePassport());

// Rate Limiting
app.use('/api', rateLimiter);

// Health Check Route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
const apiVersion = config.apiVersion;
app.use(`/api/${apiVersion}/auth`, authRoutes);
app.use(`/api/${apiVersion}/users`, userRoutes);
app.use(`/api/${apiVersion}/comments`, commentRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error Handler Middleware (must be last)
app.use(errorHandler);

export default app;