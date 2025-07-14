import { useState } from "react";
import { ArrowLeft, TestTube, Upload, Clock, CheckCircle, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const LabDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const menuItems = [
    { id: "overview", label: "Overview", icon: TestTube },
    { id: "tests", label: "Assigned Tests", icon: FileText },
    { id: "results", label: "Upload Results", icon: Upload },
    { id: "pending", label: "Pending Tests", icon: Clock },
    { id: "completed", label: "Completed", icon: CheckCircle },
  ];

  const pendingTests = [
    { id: 1, patient: "John Doe", test: "Blood Test", doctor: "Dr. Sarah Johnson", priority: "Normal", date: "2024-01-15" },
    { id: 2, patient: "Jane Smith", test: "Urine Analysis", doctor: "Dr. Michael Brown", priority: "Urgent", date: "2024-01-15" },
    { id: 3, patient: "Mike Johnson", test: "Lipid Profile", doctor: "Dr. Sarah Johnson", priority: "Normal", date: "2024-01-16" },
  ];

  const completedTests = [
    { id: 1, patient: "Alice Brown", test: "CBC", result: "Normal", date: "2024-01-14" },
    { id: 2, patient: "Bob Wilson", test: "Liver Function", result: "Abnormal", date: "2024-01-13" },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return "destructive";
      case "High": return "default";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Lab Dashboard</h1>
              <p className="text-muted-foreground">Laboratory Department</p>
            </div>
          </div>
          <Badge variant="outline">Lab Staff</Badge>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-border bg-card h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Pending Tests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-muted-foreground">Awaiting processing</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Urgent Tests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-destructive">3</div>
                    <p className="text-muted-foreground">High priority</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-muted-foreground">Results ready</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Pending Upload</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5</div>
                    <p className="text-muted-foreground">Results to upload</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Tests</CardTitle>
                    <CardDescription>Tests awaiting processing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingTests.map((test) => (
                        <div key={test.id} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{test.patient}</p>
                            <p className="text-sm text-muted-foreground">{test.test}</p>
                            <p className="text-xs text-muted-foreground">Ordered by: {test.doctor}</p>
                          </div>
                          <div className="text-right space-y-1">
                            <Badge variant={getPriorityColor(test.priority) as "default" | "secondary" | "destructive" | "outline"}>
                              {test.priority}
                            </Badge>
                            <p className="text-sm text-muted-foreground">{test.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Completed Tests</CardTitle>
                    <CardDescription>Recently completed tests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {completedTests.map((test) => (
                        <div key={test.id} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{test.patient}</p>
                            <p className="text-sm text-muted-foreground">{test.test}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant={test.result === "Normal" ? "secondary" : "destructive"}>
                              {test.result}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-1">{test.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common laboratory tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-20 flex-col">
                      <TestTube className="h-6 w-6 mb-2" />
                      Process Tests
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Upload className="h-6 w-6 mb-2" />
                      Upload Results
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Clock className="h-6 w-6 mb-2" />
                      View Pending
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <CheckCircle className="h-6 w-6 mb-2" />
                      Mark Complete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "tests" && (
            <Card>
              <CardHeader>
                <CardTitle>Assigned Tests</CardTitle>
                <CardDescription>All tests assigned to the laboratory</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Test management interface will be implemented here.</p>
              </CardContent>
            </Card>
          )}

          {activeTab === "results" && (
            <Card>
              <CardHeader>
                <CardTitle>Upload Results</CardTitle>
                <CardDescription>Upload and manage test results</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Result upload interface will be implemented here.</p>
              </CardContent>
            </Card>
          )}

          {activeTab === "pending" && (
            <Card>
              <CardHeader>
                <CardTitle>Pending Tests</CardTitle>
                <CardDescription>Tests awaiting processing</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Pending tests will be displayed here.</p>
              </CardContent>
            </Card>
          )}

          {activeTab === "completed" && (
            <Card>
              <CardHeader>
                <CardTitle>Completed Tests</CardTitle>
                <CardDescription>All completed tests and results</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Completed tests will be shown here.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabDashboard;