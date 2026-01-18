import { Router } from 'express';
import { body } from 'express-validator';
import {validate} from "@/middleware/validator.middleware";
import {AuthController} from "@/auth/controllers/auth.controller";
import {asyncHandler} from "@/middleware/error-handler.middleware";
import {authRateLimiter} from "@/middleware/rate-limiter.middleware";
import {authenticate} from "@/middleware/auth.middleware";


const router = Router();
const authController = new AuthController();

const registerValidation = [
  body('username').trim().isLength({ min: 3, max: 30 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  validate,
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validate,
];

// Public routes
router.post('/register', registerValidation, authRateLimiter, asyncHandler(authController.register.bind(authController)));
router.post('/login', loginValidation, authRateLimiter, asyncHandler(authController.login.bind(authController)));
router.post('/refresh', asyncHandler(authController.refreshToken.bind(authController)));

// Private routes (use authenticate middleware)
router.post('/logout', authenticate, asyncHandler(authController.logout.bind(authController)));
router.get('/me', authenticate, asyncHandler(authController.getCurrentUser.bind(authController)));

export default router;