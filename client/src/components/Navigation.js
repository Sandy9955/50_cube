import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingBagIcon, 
  ChartBarIcon, 
  CogIcon, 
  UserIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

const Navigation = ({ user, isAdmin }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const NavLink = ({ to, children, icon: Icon, className = "" }) => (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive(to)
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      } ${className}`}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </Link>
  );

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and main nav */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">50</span>
              </div>
              <span className="font-bold text-gray-900">50Cube</span>
            </Link>
            
            <div className="ml-8 flex items-center space-x-1">
              <NavLink to="/dashboard" icon={HomeIcon}>
                Dashboard
              </NavLink>
              
              <NavLink to="/merch" icon={ShoppingBagIcon}>
                Merch Store
              </NavLink>
            </div>
          </div>

          {/* Right side - Admin nav and user menu */}
          <div className="flex items-center space-x-4">
            {isAdmin && (
              <div className="flex items-center space-x-1">
                <NavLink to="/admin/metrics" icon={ChartBarIcon}>
                  Metrics
                </NavLink>
                <NavLink to="/admin/lanes" icon={CogIcon}>
                  Lanes
                </NavLink>
                <NavLink to="/admin" icon={CogIcon}>
                  Admin
                </NavLink>
              </div>
            )}
            
            {user && (
              <div className="flex items-center space-x-1">
                <NavLink to="/profile" icon={UserIcon}>
                  Profile
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 