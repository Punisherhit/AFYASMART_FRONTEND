import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Activity, TrendingUp, Users, AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [diseaseData, setDiseaseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalCases: 0,
    mostCommon: "",
    patientsMonitored: 0,
    criticalCases: 0
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 1. First check if backend is reachable
      try {
        await axios.get('http://localhost:5000/api/v1/health', { timeout: 3000 });
      } catch (healthErr) {
        throw new Error("Backend server is not responding");
      }

      // 2. Fetch data with proper error handling
      const api = axios.create({
        baseURL: 'http://localhost:5000/api/v1',
        timeout: 8000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const [diseasesRes, statsRes] = await Promise.all([
        api.get('/diseases?limit=100'), // Get all records
        api.get('/diseases/stats')
      ]);

      // Handle different possible response structures
      const diseases = diseasesRes.data?.data || diseasesRes.data?.docs || diseasesRes.data || [];
      const statsData = statsRes.data?.data || statsRes.data || {};

      if (!Array.isArray(diseases)) {
        throw new Error("Invalid disease data format from server");
      }

      // Calculate fallback values
      const totalCases = diseases.reduce((sum, d) => sum + (d.cases || 0), 0);
      const criticalCases = diseases.filter(d => d.status === 'High').length;

      setDiseaseData(diseases);
      setStats({
        totalCases: statsData.totalCases || totalCases,
        mostCommon: statsData.mostCommon || (diseases[0]?.name || "N/A"),
        patientsMonitored: statsData.patientsMonitored || 0,
        criticalCases: statsData.criticalCases || criticalCases
      });

    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err.response?.data?.message || 
        err.message || 
        "Network error. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const COLORS = [
    "hsl(var(--primary))",
    "hsl(var(--accent))",
    "hsl(204 73% 62%)",
    "hsl(145 53% 53%)",
    "hsl(204 73% 35%)",
    "hsl(145 53% 35%)"
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading dashboard data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-destructive">Data Loading Failed</h3>
              <p className="text-muted-foreground max-w-md">{error}</p>
              <div className="pt-4 flex gap-2 justify-center">
                <Button 
                  variant="default" 
                  onClick={fetchData}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate("/")}
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Disease Analytics Dashboard</h1>
              <p className="text-muted-foreground">Real-time disease monitoring</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={fetchData}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCases.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All recorded cases</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Most Common</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.mostCommon}</div>
              <p className="text-xs text-muted-foreground">
                {diseaseData.find(d => d.name === stats.mostCommon)?.percentage?.toFixed(2) || 0}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Patients Monitored</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.patientsMonitored.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Active cases</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Critical Cases</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.criticalCases.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Requiring attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Cases by Disease</CardTitle>
              <CardDescription>Distribution across disease types</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={diseaseData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [value.toLocaleString(), 'Cases']}
                    labelFormatter={(label) => `Disease: ${label}`}
                  />
                  <Bar 
                    dataKey="cases" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]} 
                    name="Cases"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Case Distribution</CardTitle>
              <CardDescription>Percentage breakdown</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={diseaseData}
                    dataKey="percentage"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percentage }) => `${name}: ${percentage?.toFixed(2)}%`}
                  >
                    {diseaseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value?.toFixed(2)}%`, 'Percentage']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Disease Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Statistics</CardTitle>
            <CardDescription>Complete disease metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Disease</th>
                    <th className="text-left p-4">Cases</th>
                    <th className="text-left p-4">Percentage</th>
                    <th className="text-left p-4">Trend</th>
                    <th className="text-left p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {diseaseData.map((disease) => (
                    <tr key={disease.name} className="border-b hover:bg-muted/50">
                      <td className="p-4 font-medium">{disease.name}</td>
                      <td className="p-4">{disease.cases?.toLocaleString()}</td>
                      <td className="p-4">{disease.percentage?.toFixed(2)}%</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          disease.trend === 'up' ? 'bg-destructive/10 text-destructive' :
                          disease.trend === 'down' ? 'bg-accent/10 text-accent' :
                          'bg-muted'
                        }`}>
                          {disease.trend === 'up' ? '↗ Increasing' : 
                           disease.trend === 'down' ? '↘ Decreasing' : '→ Stable'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          disease.status === 'High' ? 'bg-destructive/10 text-destructive' :
                          disease.status === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-accent/10 text-accent'
                        }`}>
                          {disease.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;