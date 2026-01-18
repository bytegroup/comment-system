import React, { useEffect, useState } from 'react';
import { useComments } from '../context/CommentContext';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';

type SortOption = 'newest' | 'oldest' | 'most_liked' | 'most_disliked';

export const CommentList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});

  const { comments, isLoading, error, pagination, fetchComments } = useComments();

  useEffect(() => {
    loadComments();
  }, [currentPage, sortBy]);

  const loadComments = () => {
    fetchComments({
      page: currentPage,
      limit: 10,
      sort: sortBy,
      parentComment: null, // Only top-level comments
    });
  };

  const loadReplies = async (commentId: string) => {
    // Toggle replies visibility
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  if (isLoading && comments.length === 0) {
    return (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-600">Loading comments...</div>
        </div>
    );
  }

  return (
      <div className="space-y-6">
        {/* Comment Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Add a Comment</h3>
          <CommentForm onSuccess={loadComments} />
        </div>

        {/* Sort Options */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Comments {pagination?.total ? `(${pagination.total})` : ''}
          </h3>
          <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as SortOption);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="most_liked">Most Liked</option>
            <option value="most_disliked">Most Disliked</option>
          </select>
        </div>

        {/* Error Message */}
        {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No comments yet. Be the first to comment!</p>
              </div>
          ) : (
              comments.map((comment) => (
                  <CommentItem
                      key={comment._id}
                      comment={comment}
                      onReply={() => loadComments()}
                  />
              ))
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 pt-6">
              <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={!pagination.hasPrev}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-gray-700">
            Page {pagination.page} of {pagination.totalPages}
          </span>
              <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={!pagination.hasNext}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
        )}
      </div>
  );
};