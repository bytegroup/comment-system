import 'dotenv/config';
import 'reflect-metadata'; // Required for decorators
import app from './app.js';
import { connectDatabase } from '@config/db.config';
import { config } from '@config/env.config';
import { Logger } from './utils/logger.util.js';

const PORT = config.port;

// Connect to Database
connectDatabase();

// Start Server
const server = app.listen(PORT, () => {
    Logger.info(`🚀 Server running in ${config.env} mode on port ${PORT}`);
    Logger.info(`📡 API available at http://localhost:${PORT}/api/${config.apiVersion}`);
    Logger.info(`🏥 Health check at http://localhost:${PORT}/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
    Logger.error('UNHANDLED REJECTION! 💥 Shutting down...', err);
    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
    Logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', err);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    Logger.info('👋 SIGTERM received. Shutting down gracefully');
    server.close(() => {
        Logger.info('💥 Process terminated!');
    });
});

export default server;