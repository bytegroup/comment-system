import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../features/auth/context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="text-xl font-bold text-indigo-600">
                  Comment System
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                    <>
                      <span className="text-gray-700">Welcome, {user?.username}!</span>
                      <button
                          onClick={handleLogout}
                          className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                      >
                        Logout
                      </button>
                    </>
                ) : (
                    <>
                      <Link
                          to="/login"
                          className="px-4 py-2 text-sm text-gray-700 hover:text-indigo-600"
                      >
                        Login
                      </Link>
                      <Link
                          to="/register"
                          className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                      >
                        Register
                      </Link>
                    </>
                )}
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      </div>
  );
};