import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service.js';
import { ResponseUtil } from '@/utils/response.util';
import { HttpStatus } from '@/constants/http-status';
import { Private } from '@/decorators/private.decorator';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Get current user profile
   * @route GET /api/v1/users/profile
   * @access Private
   */
  //@Private()
  async getProfile(req: Request, res: Response, next: NextFunction) {
    const userId = req.user!._id;
    const userProfile = await this.userService.getUserProfile(userId.toString());

    return ResponseUtil.success(res, 'Profile retrieved successfully', userProfile);
  }

  /**
   * Update current user profile
   * @route PUT /api/v1/users/profile
   * @access Private
   */
  //@Private()
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    const userId = req.user!._id.toString();
    const { username, email } = req.body;

    const updatedUser = await this.userService.updateUserProfile(userId, {
      username,
      email,
    });

    return ResponseUtil.success(res, 'Profile updated successfully', updatedUser);
  }

  /**
   * Deactivate current user account
   * @route PUT /api/v1/users/deactivate
   * @access Private
   */
  //@Private()
  async deactivateAccount(req: Request, res: Response, next: NextFunction) {
    const userId = req.user!._id.toString();
    await this.userService.deactivateUser(userId);

    return ResponseUtil.success(res, 'Account deactivated successfully');
  }

  /**
   * Delete current user account
   * @route DELETE /api/v1/users/account
   * @access Private
   */
  //@Private()
  async deleteAccount(req: Request, res: Response, next: NextFunction) {
    const userId = req.user!._id.toString();
    await this.userService.deleteUser(userId);

    return ResponseUtil.success(res, 'Account deleted successfully', null, HttpStatus.NO_CONTENT);
  }
}