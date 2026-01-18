import {UserRepository} from "@/user/repositories/user.repository";
import {IUser} from "@/user/models/user.model";
import {AppError} from "@/middleware/error-handler.middleware";
import {ErrorMessages} from "@/constants/error-messages";
import {HttpStatus} from "@/constants/http-status";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string, includePassword = false): Promise<IUser> {
    const user = await this.userRepository.findByEmail(email, includePassword);

    if (!user) {
      throw new AppError(ErrorMessages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<IUser> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError(ErrorMessages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  /**
   * Get user profile (exclude sensitive data)
   */
  async getUserProfile(userId: string): Promise<Partial<IUser>> {
    const user = await this.getUserById(userId);

    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Update user profile
   */
  async updateUserProfile(
    userId: string,
    updateData: { username?: string; email?: string }
  ): Promise<IUser> {
    // Check if user exists
    await this.getUserById(userId);

    // Check if email is being updated and already exists
    if (updateData.email) {
      const emailExists = await this.userRepository.emailExists(updateData.email);
      if (emailExists) {
        const existingUser = await this.userRepository.findByEmail(updateData.email);
        if (existingUser && existingUser._id.toString() !== userId) {
          throw new AppError(ErrorMessages.EMAIL_ALREADY_EXISTS, HttpStatus.CONFLICT);
        }
      }
    }

    // Check if username is being updated and already exists
    if (updateData.username) {
      const usernameExists = await this.userRepository.usernameExists(updateData.username);
      if (usernameExists) {
        const existingUser = await this.userRepository.findByUsername(updateData.username);
        if (existingUser && existingUser._id.toString() !== userId) {
          throw new AppError('Username already exists', HttpStatus.CONFLICT);
        }
      }
    }

    const updatedUser = await this.userRepository.update(userId, updateData);

    if (!updatedUser) {
      throw new AppError(ErrorMessages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return updatedUser;
  }

  /**
   * Deactivate user account
   */
  async deactivateUser(userId: string): Promise<void> {
    const user = await this.getUserById(userId);

    if (!user.isActive) {
      throw new AppError('Account is already deactivated', HttpStatus.BAD_REQUEST);
    }

    await this.userRepository.update(userId, { isActive: false });
  }

  /**
   * Delete user account
   */
  async deleteUser(userId: string): Promise<void> {
    await this.getUserById(userId);
    await this.userRepository.delete(userId);
  }
}