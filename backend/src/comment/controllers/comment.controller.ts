import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '@/utils/response.util';
import { HttpStatus } from '@/constants/http-status';
import {CommentService} from "@/comment/services/comment.service";
import {CommentQueryDto} from "@/comment/dto/comment.dto";

export class CommentController {
  private commentService: CommentService;

  constructor() {
    this.commentService = new CommentService();
  }

  /**
   * Create a new comment
   * @route POST /api/v1/comments
   * @access Private
   */
  async createComment(req: Request, res: Response, next: NextFunction) {
      console.log('req.body', req.body);
    const userId = req.user!._id.toString();
    const { content, parentComment } = req.body;

    const comment = await this.commentService.createComment(userId, {
      content,
      parentComment,
    });

      console.log('comment created', comment);

    return ResponseUtil.success(
      res,
      'Comment created successfully',
      comment,
      HttpStatus.CREATED
    );
  }

  /**
   * Get comments with pagination
   * @route GET /api/v1/comments
   * @access Public
   */
  async getComments(req: Request, res: Response, next: NextFunction) {
    const query: CommentQueryDto = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      sort: (req.query.sort as any) || 'newest',
      parentComment: req.query.parentComment as string,
    };

    const userId = req.user?._id.toString();

    const result = await this.commentService.getComments(query, userId);

    return res.status(200).json({
      success: true,
      data: result.comments,
      pagination: result.pagination,
    });
  }

  /**
   * Get single comment
   * @route GET /api/v1/comments/:id
   * @access Public
   */
  async getComment(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const userId = req.user?._id.toString();

    const comment = await this.commentService.getCommentById(id, userId);

    return ResponseUtil.success(res, 'Comment retrieved successfully', comment);
  }

  /**
   * Update comment
   * @route PUT /api/v1/comments/:id
   * @access Private
   */
  async updateComment(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const userId = req.user!._id.toString();
    const { content } = req.body;

    const comment = await this.commentService.updateComment(id, userId, { content });

    return ResponseUtil.success(res, 'Comment updated successfully', comment);
  }

  /**
   * Delete comment
   * @route DELETE /api/v1/comments/:id
   * @access Private
   */
  async deleteComment(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const userId = req.user!._id.toString();

    await this.commentService.deleteComment(id, userId);

    return ResponseUtil.success(res, 'Comment deleted successfully', null, HttpStatus.NO_CONTENT);
  }

  /**
   * Like a comment
   * @route POST /api/v1/comments/:id/like
   * @access Private
   */
  async likeComment(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const userId = req.user!._id.toString();

    const comment = await this.commentService.likeComment(id, userId);

    return ResponseUtil.success(res, 'Comment reaction updated', comment);
  }

  /**
   * Dislike a comment
   * @route POST /api/v1/comments/:id/dislike
   * @access Private
   */
  async dislikeComment(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const userId = req.user!._id.toString();

    const comment = await this.commentService.dislikeComment(id, userId);

    return ResponseUtil.success(res, 'Comment reaction updated', comment);
  }
}