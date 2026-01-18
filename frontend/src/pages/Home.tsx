import React from 'react';
import { Layout } from '../shared/components/layout/Layout';
import { CommentList } from '../features/comments/components/CommentList';
import { CommentProvider } from '../features/comments/context/CommentContext';

export const Home: React.FC = () => {
  return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Discussion Board</h1>
            <p className="text-gray-600">Share your thoughts and engage with the community</p>
          </div>
          <CommentProvider>
            <CommentList />
          </CommentProvider>
        </div>
      </Layout>
  );
};