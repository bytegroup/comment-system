import React, { useState } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { useComments } from '../context/CommentContext';

interface CommentFormProps {
  parentCommentId?: string;
  onSuccess?: () => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({ parentCommentId, onSuccess }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { isAuthenticated } = useAuth();
  const { createComment } = useComments();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      await createComment({
        content: content.trim(),
        parentComment: parentCommentId,
      });
      setContent('');
      onSuccess?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-gray-600">Please sign in to comment</p>
        </div>
    );
  }

  return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
        )}
        <div>
        <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={parentCommentId ? 'Write a reply...' : 'Write a comment...'}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows={3}
            maxLength={1000}
            disabled={isSubmitting}
        />
          <div className="mt-1 text-sm text-gray-500 text-right">
            {content.length}/1000
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit"
              disabled={isSubmitting || !content.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Posting...' : parentCommentId ? 'Reply' : 'Post Comment'}
          </button>
        </div>
      </form>
  );
};