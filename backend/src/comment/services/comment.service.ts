import { AppError } from '@/middleware/error-handler.middleware';
import { ErrorMessages } from '@/constants/error-messages';
import { HttpStatus } from '@/constants/http-status';

import {CommentRepository} from "@/comment/repositories/comment.repository";
import {ReactionRepository} from "@/comment/repositories/reaction.repository";
import {CommentQueryDto, CommentResponseDto, CreateCommentDto, UpdateCommentDto} from "@/comment/dto/comment.dto";

export class CommentService {
  private commentRepository: CommentRepository;
  private reactionRepository: ReactionRepository;

  constructor() {
    this.commentRepository = new CommentRepository();
    this.reactionRepository = new ReactionRepository();
  }

  /**
   * Create a new comment
   */
  async createComment(
    userId: string,
    createCommentDto: CreateCommentDto
  ): Promise<CommentResponseDto> {
    const { content, parentComment } = createCommentDto;

    // If it's a reply, verify parent comment exists
    if (parentComment) {
      const parent = await this.commentRepository.findById(parentComment);
      if (!parent) {
        throw new AppError('Parent comment not found', HttpStatus.NOT_FOUND);
      }
    }
      console.log("Creating comment:", userId);
    const comment = await this.commentRepository.create({
      content,
      author: userId as any,
      parentComment: parentComment as any,
    });
      console.log("Creating comment 2:", userId);
    const populatedComment = await this.commentRepository.findById(comment._id);
      console.log("Creating comment 3:", userId);
    return this.mapToResponseDto(populatedComment!, null);
  }

  /**
   * Get comments with pagination and sorting
   */
  async getComments(
    query: CommentQueryDto,
    userId?: string
  ): Promise<{ comments: CommentResponseDto[]; pagination: any }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const sortOption = query.sort || 'newest';

    // Build filters
    const filters: any = {};
    if (query.parentComment === null || query.parentComment === 'null') {
      filters.parentComment = null; // Top-level comments only
    } else if (query.parentComment) {
      filters.parentComment = query.parentComment;
    }

    // Build sort
    let sort: any = {};
    switch (sortOption) {
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'most_liked':
        sort = { likesCount: -1, createdAt: -1 };
        break;
      case 'most_disliked':
        sort = { dislikesCount: -1, createdAt: -1 };
        break;
      case 'newest':
      default:
        sort = { createdAt: -1 };
        break;
    }

    const { comments, total } = await this.commentRepository.findWithPagination(
      filters,
      page,
      limit,
      sort
    );

    // Get user reactions if authenticated
    let userReactionsMap: Map<string, 'like' | 'dislike'> | null = null;
    if (userId) {
      const commentIds = comments.map((c) => c._id.toString());
      userReactionsMap = await this.reactionRepository.getUserReactionsForComments(
        userId,
        commentIds
      );
    }

    // Map to response DTOs
    const commentDtos = await Promise.all(
      comments.map(async (comment) => {
        const userReaction = userReactionsMap?.get(comment._id.toString()) || null;
        const repliesCount = await this.commentRepository.countReplies(comment._id.toString());
        return this.mapToResponseDto(comment, userReaction, repliesCount);
      })
    );

    const totalPages = Math.ceil(total / limit);

    return {
      comments: commentDtos,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Get single comment by ID
   */
  async getCommentById(commentId: string, userId?: string): Promise<CommentResponseDto> {
    const comment = await this.commentRepository.findById(commentId);

    if (!comment) {
      throw new AppError(ErrorMessages.COMMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    let userReaction: 'like' | 'dislike' | null = null;
    if (userId) {
      const reaction = await this.reactionRepository.findByUserAndComment(userId, commentId);
      userReaction = reaction?.type || null;
    }

    const repliesCount = await this.commentRepository.countReplies(commentId);

    return this.mapToResponseDto(comment, userReaction, repliesCount);
  }

  /**
   * Update comment
   */
  async updateComment(
    commentId: string,
    userId: string,
    updateCommentDto: UpdateCommentDto
  ): Promise<CommentResponseDto> {
    const comment = await this.commentRepository.findById(commentId);

    if (!comment) {
      throw new AppError(ErrorMessages.COMMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    // Check if user is the author
    if (comment.author._id.toString() !== userId) {
      throw new AppError(
        ErrorMessages.UNAUTHORIZED_COMMENT_ACTION,
        HttpStatus.FORBIDDEN
      );
    }

    const updatedComment = await this.commentRepository.update(commentId, {
      content: updateCommentDto.content,
      isEdited: true,
    });

    return this.mapToResponseDto(updatedComment!, null);
  }

  /**
   * Delete comment
   */
  async deleteComment(commentId: string, userId: string): Promise<void> {
    const comment = await this.commentRepository.findById(commentId);

    if (!comment) {
      throw new AppError(ErrorMessages.COMMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    // Check if user is the author
    if (comment.author._id.toString() !== userId) {
      throw new AppError(
        ErrorMessages.UNAUTHORIZED_COMMENT_ACTION,
        HttpStatus.FORBIDDEN
      );
    }

    // Delete all replies
    await this.commentRepository.deleteReplies(commentId);

    // Delete all reactions
    await this.reactionRepository.deleteByComment(commentId);

    // Delete the comment
    await this.commentRepository.delete(commentId);
  }

  /**
   * Like a comment
   */
  async likeComment(commentId: string, userId: string): Promise<CommentResponseDto> {
    const comment = await this.commentRepository.findById(commentId);

    if (!comment) {
      throw new AppError(ErrorMessages.COMMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const existingReaction = await this.reactionRepository.findByUserAndComment(
      userId,
      commentId
    );

    if (existingReaction) {
      if (existingReaction.type === 'like') {
        // Already liked - remove the like
        await this.reactionRepository.delete(existingReaction._id.toString());
        await this.commentRepository.decrementLikes(commentId);
      } else {
        // Was dislike - change to like
        await this.reactionRepository.updateType(existingReaction._id.toString(), 'like');
        await this.commentRepository.decrementDislikes(commentId);
        await this.commentRepository.incrementLikes(commentId);
      }
    } else {
      // New like
      await this.reactionRepository.create({
        user: userId as any,
        comment: commentId as any,
        type: 'like',
      });
      await this.commentRepository.incrementLikes(commentId);
    }

    return this.getCommentById(commentId, userId);
  }

  /**
   * Dislike a comment
   */
  async dislikeComment(commentId: string, userId: string): Promise<CommentResponseDto> {
    const comment = await this.commentRepository.findById(commentId);

    if (!comment) {
      throw new AppError(ErrorMessages.COMMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const existingReaction = await this.reactionRepository.findByUserAndComment(
      userId,
      commentId
    );

    if (existingReaction) {
      if (existingReaction.type === 'dislike') {
        // Already disliked - remove the dislike
        await this.reactionRepository.delete(existingReaction._id.toString());
        await this.commentRepository.decrementDislikes(commentId);
      } else {
        // Was like - change to dislike
        await this.reactionRepository.updateType(existingReaction._id.toString(), 'dislike');
        await this.commentRepository.decrementLikes(commentId);
        await this.commentRepository.incrementDislikes(commentId);
      }
    } else {
      // New dislike
      await this.reactionRepository.create({
        user: userId as any,
        comment: commentId as any,
        type: 'dislike',
      });
      await this.commentRepository.incrementDislikes(commentId);
    }

    return this.getCommentById(commentId, userId);
  }

  /**
   * Map comment to response DTO
   */
  private mapToResponseDto(
    comment: any,
    userReaction: 'like' | 'dislike' | null,
    repliesCount?: number
  ): CommentResponseDto {
    return {
      _id: comment._id.toString(),
      content: comment.content,
      author: {
        _id: comment.author._id.toString(),
        username: comment.author.username,
      },
      parentComment: comment.parentComment?.toString() || undefined,
      likesCount: comment.likesCount,
      dislikesCount: comment.dislikesCount,
      isEdited: comment.isEdited,
      userReaction,
      repliesCount,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}