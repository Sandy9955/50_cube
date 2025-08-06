import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, FunnelIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
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

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    destructive: "bg-red-100 text-red-800",
    outline: "border border-gray-300 bg-white text-gray-700"
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Select = ({ value, onValueChange, children, className = "" }) => (
  <select 
    value={value} 
    onChange={(e) => onValueChange(e.target.value)}
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  >
    {children}
  </select>
);

const Table = ({ children, className = "" }) => (
  <div className={`w-full overflow-auto ${className}`}>
    <table className="w-full caption-bottom text-sm">
      {children}
    </table>
  </div>
);

const TableHeader = ({ children }) => <thead className="[&_tr]:border-b">{children}</thead>;
const TableBody = ({ children }) => <tbody className="[&_tr:last-child]:border-0">{children}</tbody>;
const TableRow = ({ children, className = "" }) => (
  <tr className={`border-b transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-50 ${className}`}>
    {children}
  </tr>
);
const TableHead = ({ children, className = "" }) => (
  <th className={`h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 ${className}`}>
    {children}
  </th>
);
const TableCell = ({ children, className = "" }) => (
  <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}>
    {children}
  </td>
);

const stateColors = {
  ok: "bg-green-100 text-green-800",
  watchlist: "bg-yellow-100 text-yellow-800",
  save: "bg-blue-100 text-blue-800",
  archive: "bg-gray-100 text-gray-800",
};

const stateLabels = {
  ok: "OK",
  watchlist: "Watchlist",
  save: "Save",
  archive: "Archive",
};

const sampleLanes = [
  {
    id: "1",
    name: "JavaScript Fundamentals",
    category: "Programming",
    impactScore: 85,
    state: "ok",
    metrics: { views: 12450, completions: 8930, engagement: 72 },
    lastUpdated: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    name: "React Basics",
    category: "Frontend",
    impactScore: 78,
    state: "ok",
    metrics: { views: 9870, completions: 6540, engagement: 66 },
    lastUpdated: "2024-01-14T14:20:00Z"
  },
  {
    id: "3",
    name: "Database Design",
    category: "Backend",
    impactScore: 45,
    state: "watchlist",
    metrics: { views: 3420, completions: 1230, engagement: 36 },
    lastUpdated: "2024-01-13T09:15:00Z"
  },
  {
    id: "4",
    name: "Advanced CSS",
    category: "Frontend",
    impactScore: 92,
    state: "save",
    metrics: { views: 15670, completions: 12340, engagement: 79 },
    lastUpdated: "2024-01-12T16:45:00Z"
  },
  {
    id: "5",
    name: "Python for Beginners",
    category: "Programming",
    impactScore: 88,
    state: "ok",
    metrics: { views: 18920, completions: 14560, engagement: 77 },
    lastUpdated: "2024-01-11T11:30:00Z"
  }
];

export default function AdminLanesPage() {
  const [lanes, setLanes] = useState([]);
  const [filteredLanes, setFilteredLanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState("all");
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchLanes();
  }, []);

  useEffect(() => {
    if (stateFilter === "all") {
      setFilteredLanes(lanes);
    } else {
      setFilteredLanes(lanes.filter((lane) => lane.state === stateFilter));
    }
  }, [lanes, stateFilter]);

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

  const fetchLanes = async () => {
    setLoading(true);
    try {
      if (isAdmin) {
        const response = await api.get('/admin/lanes');
        setLanes(response.data.lanes.map(lane => ({
          ...lane,
          id: lane._id || lane.id,
          lastUpdated: lane.updatedAt || lane.lastUpdated
        })));
      } else {
        setLanes(sampleLanes);
      }
    } catch (error) {
      setLanes(sampleLanes);
    } finally {
      setLoading(false);
    }
  };

  const updateLaneState = async (laneId, newState) => {
    if (!isAdmin) return; // Only allow for admins
    try {
      const response = await api.put(`/admin/lanes/${laneId}/state`, {
        state: newState,
      });
      if (response.status === 200) {
        setLanes(
          lanes.map((lane) =>
            lane.id === laneId
              ? { ...lane, state: newState, lastUpdated: new Date().toISOString() }
              : lane,
          ),
        );
      }
    } catch (error) {
      // No-op for demo
    }
  };

  const getImpactScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

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
            <h1 className="text-3xl font-bold text-gray-900">M18 - Impact Score & Rotation Console</h1>
            <p className="text-gray-600">Evaluate and manage content lanes</p>
          </div>
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-4 w-4 text-gray-500" />
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <option value="all">All States</option>
              <option value="ok">OK</option>
              <option value="watchlist">Watchlist</option>
              <option value="save">Save</option>
              <option value="archive">Archive</option>
            </Select>
          </div>
        </header>

        {/* Read-only banner for non-admins */}
        {!isAdmin && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md flex items-center gap-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-blue-400" />
            <span className="text-blue-800 font-medium">Read-only demo mode: Sign in as an admin to manage lanes.</span>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Content Lanes</CardTitle>
            <CardDescription>
              Showing {filteredLanes.length} of {lanes.length} lanes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-12 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lane Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Impact Score</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Completions</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Last Updated</TableHead>
                    {isAdmin && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLanes.map((lane) => (
                    <TableRow key={lane.id}>
                      <TableCell className="font-medium">{lane.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{lane.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`font-bold ${getImpactScoreColor(lane.impactScore)}`}>{lane.impactScore}</span>
                      </TableCell>
                      <TableCell>{lane.metrics.views.toLocaleString()}</TableCell>
                      <TableCell>{lane.metrics.completions.toLocaleString()}</TableCell>
                      <TableCell>{lane.metrics.engagement}%</TableCell>
                      <TableCell>
                        <Badge className={stateColors[lane.state]}>{stateLabels[lane.state]}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(lane.lastUpdated).toLocaleDateString()}
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <Select 
                            value={lane.state} 
                            onValueChange={(value) => updateLaneState(lane.id, value)}
                            className="w-32"
                          >
                            <option value="ok">OK</option>
                            <option value="watchlist">Watchlist</option>
                            <option value="save">Save</option>
                            <option value="archive">Archive</option>
                          </Select>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
