import {IUser, User} from "@/user/models/user.model";


export class UserRepository {
    /**
     * Find user by ID
     */
    async findById(id: string): Promise<IUser | null> {
        return User.findById(id);
    }

    /**
     * Find user by email
     */
    async findByEmail(email: string, includePassword = false): Promise<IUser | null> {
        const query = User.findOne({ email });
        if (includePassword) {
            query.select('+password');
        }
        return query;
    }

    /**
     * Find user by username
     */
    async findByUsername(username: string): Promise<IUser | null> {
        return User.findOne({ username });
    }

    /**
     * Create new user
     */
    async create(userData: Partial<IUser>): Promise<IUser> {
        const user = new User(userData);
        return user.save();
    }

    /**
     * Update user
     */
    async update(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
        return User.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });
    }

    /**
     * Delete user
     */
    async delete(id: string): Promise<IUser | null> {
        return User.findByIdAndDelete(id);
    }

    /**
     * Check if email exists
     */
    async emailExists(email: string): Promise<boolean> {
        const user = await User.findOne({ email });
        return !!user;
    }

    /**
     * Check if username exists
     */
    async usernameExists(username: string): Promise<boolean> {
        const user = await User.findOne({ username });
        return !!user;
    }

    /**
     * Update refresh token
     */
    async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
        await User.findByIdAndUpdate(userId, { refreshToken });
    }

    /**
     * Clear refresh token
     */
    async clearRefreshToken(userId: string): Promise<void> {
        await User.findByIdAndUpdate(userId, { refreshToken: null });
    }
}