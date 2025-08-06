import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBagIcon, 
  ChartBarIcon, 
  CogIcon,
  XMarkIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

const QuickAccess = ({ user, isAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);

  const QuickAccessButton = ({ to, icon: Icon, label, color, className = "" }) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 transform hover:scale-105 ${color} ${className}`}
      onClick={() => setIsOpen(false)}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </Link>
  );

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Quick Access Menu */}
      {isOpen && (
        <div className="mb-4 space-y-3">
          {/* Merch Store */}
          <QuickAccessButton
            to="/merch"
            icon={ShoppingBagIcon}
            label="Merch Store"
            color="hover:bg-green-50 text-green-700 hover:text-green-800"
          />
          
          {/* Admin Metrics (if admin) */}
          {isAdmin && (
            <QuickAccessButton
              to="/admin/metrics"
              icon={ChartBarIcon}
              label="Admin Metrics"
              color="hover:bg-purple-50 text-purple-700 hover:text-purple-800"
            />
          )}
          
          {/* Admin Lanes (if admin) */}
          {isAdmin && (
            <QuickAccessButton
              to="/admin/lanes"
              icon={CogIcon}
              label="Impact Console"
              color="hover:bg-orange-50 text-orange-700 hover:text-orange-800"
            />
          )}
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg border-2 border-white transition-all duration-200 transform hover:scale-110 ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6 text-white mx-auto" />
        ) : (
          <ChevronUpIcon className="h-6 w-6 text-white mx-auto" />
        )}
      </button>

      {/* Tooltip */}
      {!isOpen && (
        <div className="absolute bottom-16 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Quick Access
        </div>
      )}
    </div>
  );
};

export default QuickAccess; 