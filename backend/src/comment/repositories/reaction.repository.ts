import {IReaction, Reaction} from "@/comment/models/reaction.model";


export class ReactionRepository {
  /**
   * Find user's reaction to a comment
   */
  async findByUserAndComment(userId: string, commentId: string): Promise<IReaction | null> {
    return Reaction.findOne({ user: userId, comment: commentId });
  }

  /**
   * Create a new reaction
   */
  async create(reactionData: Partial<IReaction>): Promise<IReaction> {
    const reaction = new Reaction(reactionData);
    return reaction.save();
  }

  /**
   * Update reaction type
   */
  async updateType(reactionId: string, type: 'like' | 'dislike'): Promise<IReaction | null> {
    return Reaction.findByIdAndUpdate(reactionId, { type }, { new: true });
  }

  /**
   * Delete reaction
   */
  async delete(reactionId: string): Promise<void> {
    await Reaction.findByIdAndDelete(reactionId);
  }

  /**
   * Get user reactions for multiple comments
   */
  async getUserReactionsForComments(
    userId: string,
    commentIds: string[]
  ): Promise<Map<string, 'like' | 'dislike'>> {
    const reactions = await Reaction.find({
      user: userId,
      comment: { $in: commentIds },
    });

    const reactionMap = new Map<string, 'like' | 'dislike'>();
    reactions.forEach((reaction) => {
      reactionMap.set(reaction.comment.toString(), reaction.type);
    });

    return reactionMap;
  }

  /**
   * Delete all reactions for a comment
   */
  async deleteByComment(commentId: string): Promise<void> {
    await Reaction.deleteMany({ comment: commentId });
  }
}