import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon, ChartBarIcon, CogIcon, ArrowLeftIcon, UserIcon } from '@heroicons/react/24/outline';
import { authService } from '../services/api';

const Card = ({ children, className = "", ...props }) => (
  <div className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`p-6 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = "" }) => (
  <p className={`text-sm text-gray-600 ${className}`}>
    {children}
  </p>
);

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      // User is not logged in
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authService.signout();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            50Cube Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Interactive learning platform with gamified systems
          </p>
          {user && (
            <p className="text-blue-600 font-medium">
              Welcome back, {user.firstName} {user.lastName}! 👋
            </p>
          )}
        </div>

        {/* Feature Cards - Matching the image layout */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Card 1: Merchandise Store */}
          <Link to="/merch" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <ShoppingBagIcon className="h-8 w-8 text-blue-600" />
                  <div>
                    <CardTitle>Merchandise Store</CardTitle>
                    <CardDescription>Credit-based merchandise redemption</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Apply credits to redeem physical merchandise with partial cash payments.
                </p>
                {user && (
                  <div className="mt-3 p-2 bg-blue-50 rounded-md">
                    <p className="text-xs text-blue-700">
                      Available Credits: <span className="font-semibold">{user.credits?.toLocaleString() || 0}</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>

          {/* Card 2: Analytics Dashboard */}
          {user?.isAdmin ? (
            <Link to="/admin/metrics" className="block">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer focus:ring-2 focus:ring-green-500 focus:ring-offset-2 h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <ChartBarIcon className="h-8 w-8 text-blue-600" />
                    <div>
                      <CardTitle>Analytics Dashboard</CardTitle>
                      <CardDescription>Platform KPI dashboard</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    View platform metrics including bursts, wins, purchases, and more.
                  </p>
                </CardContent>
              </Card>
            </Link>
          ) : (
            <Card className="opacity-60 cursor-not-allowed h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <ChartBarIcon className="h-8 w-8 text-gray-400" />
                  <div>
                    <CardTitle className="text-gray-500">Analytics Dashboard</CardTitle>
                    <CardDescription className="text-gray-400">Platform KPI dashboard</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Admin access required to view platform metrics and analytics.
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Please sign in as an admin to access this feature.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Card 3: Impact Console */}
          {user?.isAdmin ? (
            <Link to="/admin/lanes" className="block">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <CogIcon className="h-8 w-8 text-blue-600" />
                    <div>
                      <CardTitle>Impact Console</CardTitle>
                      <CardDescription>Content lane management</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Evaluate content lanes and manage their states and impact scores.
                  </p>
                </CardContent>
              </Card>
            </Link>
          ) : (
            <Card className="opacity-60 cursor-not-allowed h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CogIcon className="h-8 w-8 text-gray-400" />
                  <div>
                    <CardTitle className="text-gray-500">Impact Console</CardTitle>
                    <CardDescription className="text-gray-400">Content lane management</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Admin access required to manage content lanes and impact scores.
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Please sign in as an admin to access this feature.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* User Actions */}
        {user && (
          <div className="mt-12 text-center">
            <div className="flex gap-4 justify-center">
              <Link 
                to="/profile" 
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md transition-colors flex items-center gap-2"
              >
                <UserIcon className="h-4 w-4" />
                {user.firstName || 'Profile'}
              </Link>
              {user.isAdmin && (
                <Link 
                  to="/admin" 
                  className="px-4 py-2 text-purple-600 hover:text-purple-700 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-md transition-colors flex items-center gap-2"
                >
                  <CogIcon className="h-4 w-4" />
                  Admin Panel
                </Link>
              )}
              <button 
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
