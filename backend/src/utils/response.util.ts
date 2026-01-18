import { Response } from 'express';
import { IApiResponse, IPaginatedResponse } from '@/interfaces/common.interface';

export class ResponseUtil {
  static success<T>(res: Response, message: string, data?: T, statusCode = 200): Response {
    const response: IApiResponse<T> = {
      success: true,
      message,
      data,
    };
    return res.status(statusCode).json(response);
  }

  static error(res: Response, message: string, statusCode = 500, errors?: any): Response {
    const response: IApiResponse = {
      success: false,
      message,
      errors,
    };
    return res.status(statusCode).json(response);
  }

  static paginated<T>(
    res: Response,
    data: T[],
    page: number,
    limit: number,
    total: number
  ): Response {
    const totalPages = Math.ceil(total / limit);
    const response: IPaginatedResponse<T> = {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
    return res.status(200).json(response);
  }
}