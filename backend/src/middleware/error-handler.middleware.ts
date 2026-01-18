import {Request, Response, NextFunction, RequestHandler} from 'express';
import { Logger } from '@/utils/logger.util';
import { ErrorMessages } from '@/constants/error-messages';
import { HttpStatus } from '@/constants/http-status';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
  let message = err.message || ErrorMessages.INTERNAL_SERVER_ERROR;

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = HttpStatus.BAD_REQUEST;
    message = Object.values(err.errors)
      .map((e: any) => e.message)
      .join(', ');
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = HttpStatus.CONFLICT;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field} already exists`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = HttpStatus.UNAUTHORIZED;
    message = ErrorMessages.TOKEN_INVALID;
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = HttpStatus.UNAUTHORIZED;
    message = ErrorMessages.TOKEN_EXPIRED;
  }

  Logger.error(`Error: ${message}`, err);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const asyncHandler =
    (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };