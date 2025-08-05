import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  ChartBarIcon, 
  CogIcon, 
  CubeIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  DocumentTextIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

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

const Button = ({ children, variant = "default", size = "default", className = "", onClick, disabled, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200"
  };
  
  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3",
    lg: "h-11 px-8",
    icon: "h-10 w-10"
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const AdminFeatureCard = ({ title, description, icon: Icon, href, stats, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    green: "bg-green-50 text-green-600 hover:bg-green-100",
    purple: "bg-purple-50 text-purple-600 hover:bg-purple-100",
    orange: "bg-orange-50 text-orange-600 hover:bg-orange-100",
    red: "bg-red-50 text-red-600 hover:bg-red-100",
    indigo: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
  };

  return (
    <Link to={href} className="block">
      <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer">
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle>{title}</CardTitle>
              </div>
              <CardDescription>{description}</CardDescription>
              {stats && (
                <div className="mt-4 flex items-center gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="text-gray-400">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default function AdminDashboardPage() {
  const adminFeatures = [
    {
      title: "Product Management",
      description: "Add, edit, and manage your product catalog",
      icon: ShoppingBagIcon,
      href: "/admin/products",
      color: "blue",
      stats: [
        { value: "15", label: "Products" },
        { value: "4", label: "Categories" }
      ]
    },
    {
      title: "Analytics & Metrics",
      description: "View detailed analytics and performance metrics",
      icon: ChartBarIcon,
      href: "/admin/metrics",
      color: "green",
      stats: [
        { value: "2.4K", label: "Views" },
        { value: "156", label: "Redemptions" }
      ]
    },
    {
      title: "Lane Management",
      description: "Manage learning lanes and content organization",
      icon: CogIcon,
      href: "/admin/lanes",
      color: "purple",
      stats: [
        { value: "8", label: "Active Lanes" },
        { value: "24", label: "Total Items" }
      ]
    },
    {
      title: "User Management",
      description: "Manage user accounts and permissions",
      icon: UserGroupIcon,
      href: "/admin/users",
      color: "orange",
      stats: [
        { value: "1.2K", label: "Users" },
        { value: "89", label: "Active" }
      ]
    },
    {
      title: "Content Management",
      description: "Manage educational content and resources",
      icon: DocumentTextIcon,
      href: "/admin/content",
      color: "indigo",
      stats: [
        { value: "156", label: "Articles" },
        { value: "45", label: "Videos" }
      ]
    },
    {
      title: "System Settings",
      description: "Configure system settings and preferences",
      icon: Cog6ToothIcon,
      href: "/admin/settings",
      color: "red",
      stats: [
        { value: "12", label: "Settings" },
        { value: "3", label: "Updates" }
      ]
    }
  ];

  const quickStats = [
    { label: "Total Products", value: "15", change: "+2", changeType: "positive" },
    { label: "Active Users", value: "1,234", change: "+12%", changeType: "positive" },
    { label: "Monthly Redemptions", value: "89", change: "+5", changeType: "positive" },
    { label: "Revenue", value: "$12,450", change: "+8.2%", changeType: "positive" }
  ];

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="icon">
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your platform and monitor performance</p>
          </div>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index}>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Admin Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminFeatures.map((feature, index) => (
            <AdminFeatureCard key={index} {...feature} />
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions and updates in your system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New product added</p>
                    <p className="text-xs text-gray-500">Wireless Headphones was added to the catalog</p>
                  </div>
                  <span className="text-xs text-gray-500">2 min ago</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">User registration</p>
                    <p className="text-xs text-gray-500">New user john.doe@example.com registered</p>
                  </div>
                  <span className="text-xs text-gray-500">15 min ago</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Product redemption</p>
                    <p className="text-xs text-gray-500">User redeemed Mechanical Keyboard for 150 credits</p>
                  </div>
                  <span className="text-xs text-gray-500">1 hour ago</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">System update</p>
                    <p className="text-xs text-gray-500">Platform updated to version 2.1.0</p>
                  </div>
                  <span className="text-xs text-gray-500">3 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 