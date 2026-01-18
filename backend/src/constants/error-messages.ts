export const ErrorMessages = {
  // Authentication
  INVALID_CREDENTIALS: 'Invalid email or password',
  UNAUTHORIZED: 'Unauthorized access',
  TOKEN_EXPIRED: 'Token has expired',
  TOKEN_INVALID: 'Invalid token',
  ACCOUNT_DEACTIVATED: 'Account is deactivated',

  // User
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already exists',
  EMAIL_ALREADY_EXISTS: 'Email already exists',

  // Comment
  COMMENT_NOT_FOUND: 'Comment not found',
  UNAUTHORIZED_COMMENT_ACTION: 'You are not authorized to perform this action',
  ALREADY_REACTED: 'You have already reacted to this comment',

  // Validation
  VALIDATION_ERROR: 'Validation error',
  INVALID_INPUT: 'Invalid input data',

  // Server
  INTERNAL_SERVER_ERROR: 'Internal server error',
  DATABASE_ERROR: 'Database operation failed',
} as const;