import { Router } from 'express';
import { body } from 'express-validator';
import {UserController} from "@/user/controllers/user.controller";
import {validate} from "@/middleware/validator.middleware";
import {authenticate} from "@/middleware/auth.middleware";
import {asyncHandler} from "@/middleware/error-handler.middleware";

const router = Router();
const userController = new UserController();

const updateProfileValidation = [
  body('username').optional().trim().isLength({ min: 3, max: 30 }),
  body('email').optional().isEmail().normalizeEmail(),
  validate,
];

// All user routes are private - use authenticate middleware
router.get('/profile', authenticate, asyncHandler(userController.getProfile.bind(userController)));
router.put('/profile', authenticate, updateProfileValidation, asyncHandler(userController.updateProfile.bind(userController)));
router.put('/deactivate', authenticate, asyncHandler(userController.deactivateAccount.bind(userController)));
router.delete('/account', authenticate, asyncHandler(userController.deleteAccount.bind(userController)));

export default router;