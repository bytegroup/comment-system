import bcrypt from 'bcryptjs';
import { UserRepository } from '@/user/repositories/user.repository';
import { TokenUtil } from '@/utils/token.util';
import { AppError } from '@/middleware/error-handler.middleware';
import { ErrorMessages } from '@/constants/error-messages';
import { HttpStatus } from '@/constants/http-status';
import {AuthResponseDto, LoginDto, RegisterDto} from "@/auth/dto/auth.dto";

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Register new user
   */
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { username, email, password } = registerDto;

    // Check if email exists
    const emailExists = await this.userRepository.emailExists(email);
    if (emailExists) {
      throw new AppError(ErrorMessages.EMAIL_ALREADY_EXISTS, HttpStatus.CONFLICT);
    }

    // Check if username exists
    const usernameExists = await this.userRepository.usernameExists(username);
    if (usernameExists) {
      throw new AppError('Username already exists', HttpStatus.CONFLICT);
    }

    // Create user
    const user = await this.userRepository.create({
      username,
      email,
      password,
      role: 'user',
      isActive: true,
    });

    // Generate tokens
    const accessToken = TokenUtil.generateAccessToken(user._id.toString());
    const refreshToken = TokenUtil.generateRefreshToken(user._id.toString());

    // Save refresh token
    await this.userRepository.updateRefreshToken(user._id.toString(), refreshToken);

    return {
      user: {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Login user
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Find user with password
    const user = await this.userRepository.findByEmail(email, true);

    if (!user) {
      throw new AppError(ErrorMessages.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }

    // Check if account is active
    if (!user.isActive) {
      throw new AppError(ErrorMessages.ACCOUNT_DEACTIVATED, HttpStatus.FORBIDDEN);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(ErrorMessages.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }

    // Generate tokens
    const accessToken = TokenUtil.generateAccessToken(user._id.toString());
    const refreshToken = TokenUtil.generateRefreshToken(user._id.toString());

    // Save refresh token
    await this.userRepository.updateRefreshToken(user._id.toString(), refreshToken);

    return {
      user: {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    // Verify refresh token
    const decoded = TokenUtil.verifyRefreshToken(refreshToken);

    if (!decoded) {
      throw new AppError(ErrorMessages.TOKEN_INVALID, HttpStatus.UNAUTHORIZED);
    }

    // Find user
    const user = await this.userRepository.findById(decoded.userId);

    if (!user || !user.isActive) {
      throw new AppError(ErrorMessages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    // Generate new access token
    const accessToken = TokenUtil.generateAccessToken(user._id.toString());

    return { accessToken };
  }

  /**
   * Logout user
   */
  async logout(userId: string): Promise<void> {
    await this.userRepository.clearRefreshToken(userId);
  }
}