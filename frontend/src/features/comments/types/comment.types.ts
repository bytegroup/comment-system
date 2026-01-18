export interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
  };
  parentComment?: string;
  likesCount: number;
  dislikesCount: number;
  isEdited: boolean;
  userReaction?: 'like' | 'dislike' | null;
  repliesCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentDto {
  content: string;
  parentComment?: string;
}

export interface UpdateCommentDto {
  content: string;
}

export interface CommentQueryParams {
  page?: number;
  limit?: number;
  sort?: 'newest' | 'oldest' | 'most_liked' | 'most_disliked';
  parentComment?: string | null;
}