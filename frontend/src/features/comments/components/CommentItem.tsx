import React, { useState } from 'react';
import { Comment } from '../types/comment.types';
import { useAuth } from '../../auth/context/AuthContext';
import { useComments } from '../context/CommentContext';
import { CommentForm } from './CommentForm';

interface CommentItemProps {
  comment: Comment;
  onReply?: () => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, onReply }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [error, setError] = useState('');

  const { user, isAuthenticated } = useAuth();
  const { updateComment, deleteComment, likeComment, dislikeComment } = useComments();

  const isAuthor = user?._id === comment.author._id;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await updateComment(comment._id, editContent);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(comment._id);
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleLike = async () => {
    try {
      await likeComment(comment._id);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDislike = async () => {
    try {
      await dislikeComment(comment._id);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
              {comment.author.username[0].toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{comment.author.username}</p>
              <p className="text-xs text-gray-500">
                {formatDate(comment.createdAt)}
                {comment.isEdited && ' (edited)'}
              </p>
            </div>
          </div>
          {isAuthor && !isEditing && (
              <div className="flex space-x-2">
                <button
                    onClick={() => setIsEditing(true)}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Edit
                </button>
                <button
                    onClick={handleDelete}
                    className="text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
          )}
        </div>

        {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-2">
              {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                    {error}
                  </div>
              )}
              <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  maxLength={1000}
              />
              <div className="flex justify-end space-x-2">
                <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(comment.content);
                      setError('');
                    }}
                    className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                    type="submit"
                    className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            </form>
        ) : (
            <p className="text-gray-800 whitespace-pre-wrap">{comment.content}</p>
        )}

        <div className="flex items-center space-x-4 pt-2 border-t border-gray-100">
          <button
              onClick={handleLike}
              disabled={!isAuthenticated}
              className={`flex items-center space-x-1 text-sm ${
                  comment.userReaction === 'like'
                      ? 'text-indigo-600 font-semibold'
                      : 'text-gray-600 hover:text-indigo-600'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span>👍</span>
            <span>{comment.likesCount}</span>
          </button>

          <button
              onClick={handleDislike}
              disabled={!isAuthenticated}
              className={`flex items-center space-x-1 text-sm ${
                  comment.userReaction === 'dislike'
                      ? 'text-red-600 font-semibold'
                      : 'text-gray-600 hover:text-red-600'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span>👎</span>
            <span>{comment.dislikesCount}</span>
          </button>

          {isAuthenticated && (
              <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="text-sm text-gray-600 hover:text-indigo-600"
              >
                💬 Reply {comment.repliesCount ? `(${comment.repliesCount})` : ''}
              </button>
          )}
        </div>

        {showReplyForm && (
            <div className="mt-4 pl-4 border-l-2 border-indigo-200">
              <CommentForm
                  parentCommentId={comment._id}
                  onSuccess={() => {
                    setShowReplyForm(false);
                    onReply?.();
                  }}
              />
            </div>
        )}
      </div>
  );
};