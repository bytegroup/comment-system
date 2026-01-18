export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  user: {
    _id: string;
    username: string;
    email: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}