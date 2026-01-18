import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Comment, CreateCommentDto, CommentQueryParams } from '../types/comment.types';
import { CommentService } from '../services/comment.service';

interface CommentContextType {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  pagination: any;
  fetchComments: (params: CommentQueryParams) => Promise<void>;
  createComment: (data: CreateCommentDto) => Promise<void>;
  updateComment: (id: string, content: string) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  likeComment: (id: string) => Promise<void>;
  dislikeComment: (id: string) => Promise<void>;
  refreshComments: () => Promise<void>;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

const commentService = new CommentService();

export const CommentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [lastParams, setLastParams] = useState<CommentQueryParams>({});

  const fetchComments = async (params: CommentQueryParams) => {
    try {
      setIsLoading(true);
      setError(null);
      setLastParams(params);
      const response = await commentService.getComments(params);
      setComments(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch comments');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshComments = async () => {
    await fetchComments(lastParams);
  };

  const createComment = async (data: CreateCommentDto) => {
    try {
      await commentService.createComment(data);
      await refreshComments();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create comment');
    }
  };

  const updateComment = async (id: string, content: string) => {
    try {
      const updatedComment = await commentService.updateComment(id, { content });
      setComments((prev) =>
          prev.map((comment) => (comment._id === id ? updatedComment : comment))
      );
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update comment');
    }
  };

  const deleteComment = async (id: string) => {
    try {
      await commentService.deleteComment(id);
      setComments((prev) => prev.filter((comment) => comment._id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  const likeComment = async (id: string) => {
    try {
      const updatedComment = await commentService.likeComment(id);
      setComments((prev) =>
          prev.map((comment) => (comment._id === id ? updatedComment : comment))
      );
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to like comment');
    }
  };

  const dislikeComment = async (id: string) => {
    try {
      const updatedComment = await commentService.dislikeComment(id);
      setComments((prev) =>
          prev.map((comment) => (comment._id === id ? updatedComment : comment))
      );
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to dislike comment');
    }
  };

  return (
      <CommentContext.Provider
          value={{
            comments,
            isLoading,
            error,
            pagination,
            fetchComments,
            createComment,
            updateComment,
            deleteComment,
            likeComment,
            dislikeComment,
            refreshComments,
          }}
      >
        {children}
      </CommentContext.Provider>
  );
};

export const useComments = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error('useComments must be used within CommentProvider');
  }
  return context;
};