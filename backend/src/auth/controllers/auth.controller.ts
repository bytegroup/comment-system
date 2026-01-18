import { Request, Response, NextFunction } from 'express';
import {AuthService} from "@/auth/services/auth.service";
import {Public} from "@/decorators/public.decorator";
import {cookieConfig} from "@config/jwt.config";
import {ResponseUtil} from "@/utils/response.util";
import {HttpStatus} from "@/constants/http-status";
import {Private} from "@/decorators/private.decorator";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Register new user
   * @route POST /api/v1/auth/register
   * @access Public
   */
  //@Public()
  async register(req: Request, res: Response, next: NextFunction) {
    const { username, email, password } = req.body;

    const result = await this.authService.register({ username, email, password });

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, cookieConfig);

    return ResponseUtil.success(
        res,
        'User registered successfully',
        {
          user: result.user,
          accessToken: result.accessToken,
        },
        HttpStatus.CREATED
    );
  }

  /**
   * Login user
   * @route POST /api/v1/auth/login
   * @access Public
   */
  //@Public()
  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    const result = await this.authService.login({ email, password });

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, cookieConfig);

    return ResponseUtil.success(res, 'Login successful', {
      user: result.user,
      accessToken: result.accessToken,
    });
  }

  /**
   * Refresh access token
   * @route POST /api/v1/auth/refresh
   * @access Public
   */
  //@Public()
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return ResponseUtil.error(res, 'Refresh token not provided', HttpStatus.UNAUTHORIZED);
    }

    const result = await this.authService.refreshToken(refreshToken);

    return ResponseUtil.success(res, 'Token refreshed successfully', result);
  }

  /**
   * Logout user
   * @route POST /api/v1/auth/logout
   * @access Private
   */
  //@Private()
  async logout(req: Request, res: Response, next: NextFunction) {
    const userId = req.user!._id.toString();

    await this.authService.logout(userId);

    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    return ResponseUtil.success(res, 'Logout successful');
  }

  /**
   * Get current authenticated user
   * @route GET /api/v1/auth/me
   * @access Private
   */
  //@Private()
  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    const user = req.user!;

    return ResponseUtil.success(res, 'User retrieved successfully', {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  }
}