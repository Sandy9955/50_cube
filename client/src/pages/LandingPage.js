import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBagIcon, 
  ChartBarIcon, 
  CogIcon, 
  UserIcon,
  ArrowRightIcon,
  StarIcon,
  CheckCircleIcon
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

export default function LandingPage() {
  console.log('LandingPage component is rendering');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('API URL:', process.env.REACT_APP_API_URL);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            50Cube Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Interactive learning platform with bite-sized modules and a points-based system
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
            <Link to="/signin">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Module Showcase */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* M16 - Merch Store */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ShoppingBagIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle>M16 - Merch Store</CardTitle>
                  <CardDescription>Credit Redemption System</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span>12 Demo Products</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span>Credit Quote Calculator</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span>Secure Payment Processing</span>
                </div>
                <div className="pt-4">
                  <Link to="/merch">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <ShoppingBagIcon className="h-4 w-4 mr-2" />
                      Visit Merch Store
                      <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* M17 - Admin Metrics */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ChartBarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle>M17 - Admin Metrics</CardTitle>
                  <CardDescription>Platform KPI Dashboard</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span>Real-time Metrics</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span>Interactive Charts</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span>Date Filtering</span>
                </div>
                <div className="pt-4">
                  <Link to="/admin/metrics">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      <ChartBarIcon className="h-4 w-4 mr-2" />
                      View Admin Metrics
                      <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Modules */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* M18 - Impact Score & Rotation */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <CogIcon className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <CardTitle>M18 - Impact Score</CardTitle>
                  <CardDescription>Lane Management Console</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span>8 Demo Lanes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span>State Management</span>
                </div>
                <div className="pt-4">
                  <Link to="/admin/lanes">
                    <Button variant="outline" className="w-full">
                      <CogIcon className="h-4 w-4 mr-2" />
                      Manage Lanes
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Dashboard */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <UserIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>User Dashboard</CardTitle>
                  <CardDescription>Personal Learning Hub</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span>Progress Tracking</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span>Credit Management</span>
                </div>
                <div className="pt-4">
                  <Link to="/dashboard">
                    <Button variant="outline" className="w-full">
                      <UserIcon className="h-4 w-4 mr-2" />
                      Go to Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Panel */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <CogIcon className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <CardTitle>Admin Panel</CardTitle>
                  <CardDescription>Platform Management</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span>Product Management</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span>User Management</span>
                </div>
                <div className="pt-4">
                  <Link to="/admin">
                    <Button variant="outline" className="w-full">
                      <CogIcon className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Platform Features</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <StarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Interactive Modules</h3>
              <p className="text-sm text-gray-600">Bite-sized learning experiences</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ShoppingBagIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Credit System</h3>
              <p className="text-sm text-gray-600">Points-based rewards and redemption</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
              <p className="text-sm text-gray-600">Real-time metrics and insights</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CogIcon className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Management</h3>
              <p className="text-sm text-gray-600">Comprehensive admin tools</p>
            </div>
          </div>
        </div>

        {/* Environment Info */}
        <div className="mt-16 text-center text-sm text-gray-500">
          <p>Environment: {process.env.NODE_ENV}</p>
          <p>API URL: {process.env.REACT_APP_API_URL}</p>
        </div>
      </div>
    </div>
  );
} 