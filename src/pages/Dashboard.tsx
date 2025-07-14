import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from "recharts";
import { Activity, TrendingUp, Users, AlertCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [diseaseData, setDiseaseData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration - replace with actual API call
  useEffect(() => {
    const mockData = [
      { name: "Hypertension", cases: 45, percentage: 23, trend: "up" },
      { name: "Diabetes", cases: 38, percentage: 19, trend: "stable" },
      { name: "COVID-19", cases: 22, percentage: 11, trend: "down" },
      { name: "Malaria", cases: 35, percentage: 18, trend: "up" },
      { name: "Pneumonia", cases: 28, percentage: 14, trend: "down" },
      { name: "Others", cases: 32, percentage: 15, trend: "stable" }
    ];
    
    setTimeout(() => {
      setDiseaseData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const chartConfig = {
    cases: {
      label: "Cases",
      color: "hsl(var(--primary))"
    },
    percentage: {
      label: "Percentage",
      color: "hsl(var(--accent))"
    }
  };

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
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  const totalCases = diseaseData.reduce((sum, disease) => sum + disease.cases, 0);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                console.log("Back button clicked");
                navigate("/");
              }}
              className="flex items-center gap-2 hover:bg-accent-light"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Disease Analytics Dashboard</h1>
              <p className="text-muted-foreground">Monitor disease rates and health trends in real-time</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalCases}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Common</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">Hypertension</div>
              <p className="text-xs text-muted-foreground">23% of total cases</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patients Monitored</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">1,247</div>
              <p className="text-xs text-muted-foreground">Active patients</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Cases</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">8</div>
              <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle>Disease Cases by Type</CardTitle>
              <CardDescription>Current distribution of cases across different diseases</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64">
                <BarChart data={diseaseData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="cases" fill="var(--color-cases)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle>Disease Distribution</CardTitle>
              <CardDescription>Percentage breakdown of all recorded cases</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64">
                <PieChart>
                  <Pie
                    data={diseaseData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="percentage"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {diseaseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Disease Details Table */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle>Detailed Disease Statistics</CardTitle>
            <CardDescription>Comprehensive view of all disease metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-medium">Disease</th>
                    <th className="text-left p-4 font-medium">Cases</th>
                    <th className="text-left p-4 font-medium">Percentage</th>
                    <th className="text-left p-4 font-medium">Trend</th>
                    <th className="text-left p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {diseaseData.map((disease, index) => (
                    <tr key={index} className="border-b border-border/50 hover:bg-muted/50">
                      <td className="p-4 font-medium">{disease.name}</td>
                      <td className="p-4">{disease.cases}</td>
                      <td className="p-4">{disease.percentage}%</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          disease.trend === 'up' ? 'bg-destructive/10 text-destructive' :
                          disease.trend === 'down' ? 'bg-accent/10 text-accent' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {disease.trend === 'up' ? '↗' : disease.trend === 'down' ? '↘' : '→'} {disease.trend}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          disease.cases > 40 ? 'bg-destructive/10 text-destructive' :
                          disease.cases > 25 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-accent/10 text-accent'
                        }`}>
                          {disease.cases > 40 ? 'High' : disease.cases > 25 ? 'Medium' : 'Low'}
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