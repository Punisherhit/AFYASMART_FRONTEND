import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Activity, TrendingUp, Users, AlertCircle, ArrowLeft, RefreshCw, Search, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

type DiseaseEntry = {
  name: string;
  cases: number;
  percentage: number;
  trend: "up" | "down" | "stable";
  status: "High" | "Medium" | "Low";
};

const MOCK_DISEASES: DiseaseEntry[] = [
  { name: "Malaria", cases: 1320, percentage: 34.8, trend: "up", status: "High" },
  { name: "Typhoid", cases: 820, percentage: 21.6, trend: "stable", status: "Medium" },
  { name: "Flu", cases: 760, percentage: 20.1, trend: "down", status: "Low" },
  { name: "Pneumonia", cases: 540, percentage: 14.2, trend: "up", status: "High" },
  { name: "Diarrhea", cases: 350, percentage: 9.3, trend: "down", status: "Low" }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [diseaseData, setDiseaseData] = useState<DiseaseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState<"all" | "High" | "Medium" | "Low">("all");
  const [newDisease, setNewDisease] = useState({ name: "", cases: 0, status: "Medium" as "High" | "Medium" | "Low" });
  const [stats, setStats] = useState({
    totalCases: 0,
    mostCommon: "",
    patientsMonitored: 0,
    criticalCases: 0
  });

  const setComputedState = (diseases: DiseaseEntry[]) => {
    const totalCases = diseases.reduce((sum, d) => sum + d.cases, 0);
    const sorted = [...diseases].sort((a, b) => b.cases - a.cases);
    const enriched = sorted.map((d) => ({ ...d, percentage: totalCases ? (d.cases / totalCases) * 100 : 0 }));

    setDiseaseData(enriched);
    setStats({
      totalCases,
      mostCommon: enriched[0]?.name || "N/A",
      patientsMonitored: Math.round(totalCases * 0.62),
      criticalCases: enriched.filter((d) => d.status === "High").length
    });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const api = axios.create({
        baseURL: "http://localhost:5000/api/v1",
        timeout: 6000,
        headers: {
          "Content-Type": "application/json"
        }
      });

      const [diseasesRes, statsRes] = await Promise.all([
        api.get("/diseases?limit=100"),
        api.get("/diseases/stats")
      ]);

      const diseases = (diseasesRes.data?.data || diseasesRes.data?.docs || diseasesRes.data || []) as DiseaseEntry[];
      const statsData = statsRes.data?.data || statsRes.data || {};

      if (!Array.isArray(diseases) || diseases.length === 0) {
        throw new Error("No disease records returned");
      }

      const totalCases = diseases.reduce((sum, d) => sum + (d.cases || 0), 0);
      const prepared = diseases.map((d) => ({
        ...d,
        trend: d.trend || "stable",
        status: d.status || "Medium",
        percentage: d.percentage || (totalCases ? (d.cases / totalCases) * 100 : 0)
      })) as DiseaseEntry[];

      setDiseaseData(prepared);
      setStats({
        totalCases: statsData.totalCases || totalCases,
        mostCommon: statsData.mostCommon || (prepared[0]?.name || "N/A"),
        patientsMonitored: statsData.patientsMonitored || Math.round(totalCases * 0.62),
        criticalCases: statsData.criticalCases || prepared.filter((d) => d.status === "High").length
      });
    } catch (err) {
      setError("Live backend unavailable - displaying local dataset.");
      setComputedState(MOCK_DISEASES);
      toast({
        title: "Switched to offline mode",
        description: "Dashboard is now using local sample data so you can continue working."
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredDiseases = useMemo(() => {
    return diseaseData.filter((d) => {
      const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = riskFilter === "all" || d.status === riskFilter;
      return matchesSearch && matchesRisk;
    });
  }, [diseaseData, searchTerm, riskFilter]);

  const addDiseaseReport = () => {
    if (!newDisease.name.trim() || newDisease.cases <= 0) {
      toast({ title: "Invalid report", description: "Add a disease name and a positive case count.", variant: "destructive" });
      return;
    }

    const trend: DiseaseEntry["trend"] = newDisease.status === "High" ? "up" : "stable";
    const merged = [...diseaseData, { ...newDisease, trend, percentage: 0 }];
    setComputedState(merged);
    setNewDisease({ name: "", cases: 0, status: "Medium" });
    toast({ title: "Report added", description: "New disease report has been included in analytics." });
  };

  const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(204 73% 62%)", "hsl(145 53% 53%)", "hsl(204 73% 35%)", "hsl(145 53% 35%)"];

  if (loading) {
    return <div className="min-h-screen bg-background p-6 flex items-center justify-center"><RefreshCw className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Disease Analytics Dashboard</h1>
              <p className="text-muted-foreground">Real-time disease monitoring</p>
              {error && <p className="text-xs text-amber-600 mt-1">{error}</p>}
            </div>
          </div>
          <Button variant="outline" onClick={fetchData} className="flex items-center gap-2"><RefreshCw className="h-4 w-4" />Refresh</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Cases</CardTitle><Activity className="h-4 w-4 text-primary" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.totalCases.toLocaleString()}</div></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Most Common</CardTitle><TrendingUp className="h-4 w-4 text-accent" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.mostCommon}</div></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Patients Monitored</CardTitle><Users className="h-4 w-4 text-primary" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.patientsMonitored.toLocaleString()}</div></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Critical Cases</CardTitle><AlertCircle className="h-4 w-4 text-destructive" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.criticalCases.toLocaleString()}</div></CardContent></Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Action Center</CardTitle>
            <CardDescription>Filter data and submit a quick disease report.</CardDescription>
          </CardHeader>
          <CardContent className="grid lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <LabelRow label="Search disease" />
              <div className="relative"><Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" /><Input className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by disease name" /></div>
              <LabelRow label="Risk status" />
              <Select value={riskFilter} onValueChange={(value: "all" | "High" | "Medium" | "Low") => setRiskFilter(value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <LabelRow label="Add disease report" />
              <Input value={newDisease.name} onChange={(e) => setNewDisease((p) => ({ ...p, name: e.target.value }))} placeholder="Disease name" />
              <Input type="number" min={1} value={newDisease.cases || ""} onChange={(e) => setNewDisease((p) => ({ ...p, cases: Number(e.target.value) }))} placeholder="Number of cases" />
              <Select value={newDisease.status} onValueChange={(value: "High" | "Medium" | "Low") => setNewDisease((p) => ({ ...p, status: value }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addDiseaseReport} className="w-full"><PlusCircle className="h-4 w-4 mr-2" />Add report</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card><CardHeader><CardTitle>Cases by Disease</CardTitle></CardHeader><CardContent className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={filteredDiseases}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="cases" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle>Case Distribution</CardTitle></CardHeader><CardContent className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={filteredDiseases} dataKey="percentage" nameKey="name" cx="50%" cy="50%" outerRadius={80}>{filteredDiseases.map((entry, index) => <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip formatter={(value) => [`${Number(value).toFixed(2)}%`, "Percentage"]} /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Detailed Statistics</CardTitle><CardDescription>{filteredDiseases.length} matching disease records</CardDescription></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b"><th className="text-left p-4">Disease</th><th className="text-left p-4">Cases</th><th className="text-left p-4">Percentage</th><th className="text-left p-4">Trend</th><th className="text-left p-4">Status</th></tr></thead>
                <tbody>
                  {filteredDiseases.map((disease) => (
                    <tr key={disease.name} className="border-b hover:bg-muted/50">
                      <td className="p-4 font-medium">{disease.name}</td>
                      <td className="p-4">{disease.cases.toLocaleString()}</td>
                      <td className="p-4">{disease.percentage.toFixed(2)}%</td>
                      <td className="p-4">{disease.trend === "up" ? "↗ Increasing" : disease.trend === "down" ? "↘ Decreasing" : "→ Stable"}</td>
                      <td className="p-4">{disease.status}</td>
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

const LabelRow = ({ label }: { label: string }) => <p className="text-sm font-medium">{label}</p>;

export default Dashboard;
