import { axiosInstance } from '../../../core/api/axios.config';
import { API_ENDPOINTS } from '../../../core/api/endpoints';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types/auth.types';
import { ApiResponse } from '../../../shared/types/common.types';

export class AuthService {
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.REGISTER,
      credentials
    );
    return response.data.data!;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data.data!;
  }

  async logout(): Promise<void> {
    await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
  }

  async getCurrentUser(): Promise<User> {
    const response = await axiosInstance.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.ME);
    return response.data.data!;
  }

  async refreshToken(): Promise<string> {
    const response = await axiosInstance.post<ApiResponse<{ accessToken: string }>>(
      API_ENDPOINTS.AUTH.REFRESH
    );
    return response.data.data!.accessToken;
  }
}