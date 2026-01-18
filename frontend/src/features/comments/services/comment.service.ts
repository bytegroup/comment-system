import { axiosInstance } from '../../../core/api/axios.config';
import { API_ENDPOINTS } from '../../../core/api/endpoints';
import { Comment, CreateCommentDto, UpdateCommentDto, CommentQueryParams } from '../types/comment.types';
import { PaginatedResponse, ApiResponse } from '../../../shared/types/common.types';

export class CommentService {
  async getComments(params: CommentQueryParams): Promise<PaginatedResponse<Comment>> {
    const response = await axiosInstance.get<PaginatedResponse<Comment>>(
      API_ENDPOINTS.COMMENTS.LIST,
      { params }
    );
    return response.data;
  }

  async getComment(id: string): Promise<Comment> {
    const response = await axiosInstance.get<ApiResponse<Comment>>(
      API_ENDPOINTS.COMMENTS.GET(id)
    );
    return response.data.data!;
  }

  async createComment(data: CreateCommentDto): Promise<Comment> {
    const response = await axiosInstance.post<ApiResponse<Comment>>(
      API_ENDPOINTS.COMMENTS.CREATE,
      data
    );
    return response.data.data!;
  }

  async updateComment(id: string, data: UpdateCommentDto): Promise<Comment> {
    const response = await axiosInstance.put<ApiResponse<Comment>>(
      API_ENDPOINTS.COMMENTS.UPDATE(id),
      data
    );
    return response.data.data!;
  }

  async deleteComment(id: string): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.COMMENTS.DELETE(id));
  }

  async likeComment(id: string): Promise<Comment> {
    const response = await axiosInstance.post<ApiResponse<Comment>>(
      API_ENDPOINTS.COMMENTS.LIKE(id)
    );
    return response.data.data!;
  }

  async dislikeComment(id: string): Promise<Comment> {
    const response = await axiosInstance.post<ApiResponse<Comment>>(
      API_ENDPOINTS.COMMENTS.DISLIKE(id)
    );
    return response.data.data!;
  }
}