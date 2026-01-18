export const jwtConfig = {
    secret: process.env.JWT_SECRET as string || 'your-secret-key',
    refreshSecret: process.env.JWT_REFRESH_SECRET as string || 'your-refresh-secret-key',
    expiresIn: Number(process.env.JWT_EXPIRE) || '15m',
    refreshExpiresIn: Number(process.env.JWT_REFRESH_EXPIRE) || '7d',
    algorithm: 'HS256' as const,
};

export const cookieConfig = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};