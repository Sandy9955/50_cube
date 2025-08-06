import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, ArrowTrendingUpIcon, UsersIcon, ShoppingCartIcon, GiftIcon, UserPlusIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { sampleMetrics, filterMetricsByDate } from '../data/sampleMetrics';
import api, { authService } from '../services/api';

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

const Input = ({ id, type = "text", value, onChange, className = "", ...props }) => (
  <input
    id={id}
    type={type}
    value={value}
    onChange={onChange}
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Label = ({ htmlFor, children, className = "" }) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
    {children}
  </label>
);

export default function AdminMetricsPage() {
  const [metrics, setMetrics] = useState(sampleMetrics);
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState("");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchMetrics();
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAdmin(userData?.isAdmin);
    } catch {
      setUser(null);
      setIsAdmin(false);
    }
  };

  const fetchMetrics = async (since) => {
    setLoading(true);
    setError(null);
    try {
      const url = since ? `/admin/metrics?since=${since}` : '/admin/metrics';
      const response = await api.get(url);
      setMetrics(response.data);
      setLastUpdated(new Date());
    } catch (error) {
      setError("Failed to fetch metrics from server. Showing demo data.");
      if (since) {
        setMetrics(filterMetricsByDate(sampleMetrics, since));
      } else {
        setMetrics(sampleMetrics);
      }
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = () => {
    if (dateFilter) {
      const isoDate = new Date(dateFilter).toISOString();
      fetchMetrics(isoDate);
    } else {
      fetchMetrics();
    }
  };

  const handleClearFilter = () => {
    setDateFilter("");
    fetchMetrics();
  };

  const refreshMetrics = () => {
    fetchMetrics(dateFilter ? new Date(dateFilter).toISOString() : null);
  };

  const metricCards = [
    {
      title: "Bursts",
      value: metrics?.bursts || 0,
      icon: ArrowTrendingUpIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Wins",
      value: metrics?.wins || 0,
      icon: UsersIcon,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Purchases",
      value: metrics?.purchases || 0,
      icon: ShoppingCartIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Redemptions",
      value: metrics?.redemptions || 0,
      icon: GiftIcon,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Referrals",
      value: metrics?.referrals || 0,
      icon: UserPlusIcon,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
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
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">M17 - Admin Metrics</h1>
            <p className="text-gray-600">
              Platform KPI dashboard
              <span className="text-xs text-gray-500 ml-2">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="date-filter" className="text-sm">
              Since:
            </Label>
            <Input
              id="date-filter"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-40 rounded-md"
            />
            <Button onClick={handleDateFilter} variant="outline" className="rounded-md">
              Filter
            </Button>
            {dateFilter && (
              <Button onClick={handleClearFilter} variant="secondary" className="rounded-md">
                Clear
              </Button>
            )}
            <Button onClick={refreshMetrics} variant="outline" className="rounded-md">
              Refresh
            </Button>
          </div>
        </header>

        {/* Read-only banner for non-admins */}
        {!isAdmin && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md flex items-center gap-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-blue-400" />
            <span className="text-blue-800 font-medium">Read-only demo mode: Sign in as an admin to see live metrics.</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Tiles - Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              {metricCards.map((metric) => {
                const Icon = metric.icon;
                return (
                  <Card key={metric.title} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <CardDescription className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                          <Icon className={`h-4 w-4 ${metric.color}`} />
                        </div>
                        {metric.title}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{metric.value.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Chart */}
            {metrics?.chartData && (
              <Card>
                <CardHeader>
                  <CardTitle>Platform Activity Trends</CardTitle>
                  <CardDescription>
                    Daily metrics over the last 30 days
                    {dateFilter && ` (Filtered from ${dateFilter})`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metrics.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                          }}
                        />
                        <YAxis />
                        <Tooltip 
                          labelFormatter={(value) => {
                            const date = new Date(value);
                            return date.toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            });
                          }}
                          formatter={(value, name) => [
                            value.toLocaleString(), 
                            name.charAt(0).toUpperCase() + name.slice(1)
                          ]}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="bursts" 
                          stroke="#2563eb" 
                          strokeWidth={2}
                          dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="wins" 
                          stroke="#16a34a" 
                          strokeWidth={2}
                          dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="purchases" 
                          stroke="#9333ea" 
                          strokeWidth={2}
                          dot={{ fill: '#9333ea', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="redemptions" 
                          stroke="#ea580c" 
                          strokeWidth={2}
                          dot={{ fill: '#ea580c', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="referrals" 
                          stroke="#db2777" 
                          strokeWidth={2}
                          dot={{ fill: '#db2777', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
