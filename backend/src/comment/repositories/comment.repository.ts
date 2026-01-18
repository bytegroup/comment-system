import {Comment, IComment} from "@/comment/models/comment.model";
import {Types} from "mongoose";

export class CommentRepository {
  /**
   * Create a new comment
   */
  async create(commentData: Partial<IComment>): Promise<IComment> {
    const comment = new Comment(commentData);
    return comment.save();
  }

  /**
   * Find comment by ID
   */
  async findById(id: Types.ObjectId | string): Promise<IComment | null> {
    console.log("Finding comment by ID:", id);
    return Comment.findById(id).populate('author', 'username email');
  }

  /**
   * Find comments with pagination and sorting
   */
  async findWithPagination(
    filters: any,
    page: number,
    limit: number,
    sort: any
  ): Promise<{ comments: IComment[]; total: number }> {
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      Comment.find(filters)
        .populate('author', 'username email')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Comment.countDocuments(filters),
    ]);

    return { comments: comments as IComment[], total };
  }

  /**
   * Update comment
   */
  async update(id: string, updateData: Partial<IComment>): Promise<IComment | null> {
    return Comment.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('author', 'username email');
  }

  /**
   * Delete comment
   */
  async delete(id: string): Promise<IComment | null> {
    return Comment.findByIdAndDelete(id);
  }

  /**
   * Count replies for a comment
   */
  async countReplies(commentId: string): Promise<number> {
    return Comment.countDocuments({ parentComment: commentId });
  }

  /**
   * Delete all replies of a comment
   */
  async deleteReplies(commentId: string): Promise<void> {
    await Comment.deleteMany({ parentComment: commentId });
  }

  /**
   * Increment like count
   */
  async incrementLikes(commentId: string): Promise<void> {
    await Comment.findByIdAndUpdate(commentId, {
      $inc: { likesCount: 1 },
    });
  }

  /**
   * Decrement like count
   */
  async decrementLikes(commentId: string): Promise<void> {
    await Comment.findByIdAndUpdate(commentId, {
      $inc: { likesCount: -1 },
    });
  }

  /**
   * Increment dislike count
   */
  async incrementDislikes(commentId: string): Promise<void> {
    await Comment.findByIdAndUpdate(commentId, {
      $inc: { dislikesCount: 1 },
    });
  }

  /**
   * Decrement dislike count
   */
  async decrementDislikes(commentId: string): Promise<void> {
    await Comment.findByIdAndUpdate(commentId, {
      $inc: { dislikesCount: -1 },
    });
  }

  /**
   * Check if user is author
   */
  async isAuthor(commentId: string, userId: string): Promise<boolean> {
    const comment = await Comment.findById(commentId);
    return comment?.author.toString() === userId;
  }
}