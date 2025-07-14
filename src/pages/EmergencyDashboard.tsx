import { useState } from "react";
import { ArrowLeft, Ambulance, MapPin, Phone, AlertTriangle, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const EmergencyDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const menuItems = [
    { id: "overview", label: "Overview", icon: AlertTriangle },
    { id: "ambulances", label: "Ambulance Fleet", icon: Ambulance },
    { id: "dispatch", label: "Dispatch", icon: Phone },
    { id: "tracking", label: "Live Tracking", icon: MapPin },
    { id: "alerts", label: "Emergency Alerts", icon: AlertTriangle },
  ];

  const activeAmbulances = [
    { id: "AMB001", status: "En Route", patient: "John Doe", location: "Downtown", eta: "5 mins", priority: "Critical" },
    { id: "AMB002", status: "On Scene", patient: "Jane Smith", location: "Hospital Street", eta: "10 mins", priority: "Urgent" },
    { id: "AMB003", status: "Available", patient: null, location: "Station A", eta: null, priority: null },
  ];

  const emergencyAlerts = [
    { id: 1, type: "Cardiac Arrest", location: "123 Main St", time: "14:25", status: "Active", priority: "Critical" },
    { id: 2, type: "Car Accident", location: "Highway 101", time: "14:15", status: "Dispatched", priority: "Urgent" },
    { id: 3, type: "Medical Emergency", location: "Park Avenue", time: "14:10", status: "Resolved", priority: "Normal" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Critical": return "destructive";
      case "Urgent": return "default";
      case "Active": return "destructive";
      case "Dispatched": return "default";
      case "En Route": return "default";
      case "Available": return "secondary";
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
              <h1 className="text-2xl font-bold text-foreground">Emergency Dashboard</h1>
              <p className="text-muted-foreground">Emergency Services & Ambulance Dispatch</p>
            </div>
          </div>
          <Badge variant="destructive">Emergency</Badge>
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
                    <CardTitle className="text-sm font-medium">Active Emergencies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-destructive">3</div>
                    <p className="text-muted-foreground">Ongoing incidents</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Available Ambulances</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5</div>
                    <p className="text-muted-foreground">Ready for dispatch</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">En Route</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2</div>
                    <p className="text-muted-foreground">Ambulances dispatched</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Average Response</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8 min</div>
                    <p className="text-muted-foreground">Response time</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Ambulances</CardTitle>
                    <CardDescription>Current ambulance fleet status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeAmbulances.map((ambulance) => (
                        <div key={ambulance.id} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{ambulance.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {ambulance.patient || "No patient assigned"}
                            </p>
                            <p className="text-xs text-muted-foreground">{ambulance.location}</p>
                          </div>
                          <div className="text-right space-y-1">
                            <Badge variant={getStatusColor(ambulance.status) as "default" | "destructive" | "secondary" | "outline"}>
                              {ambulance.status}
                            </Badge>
                            {ambulance.eta && (
                              <p className="text-sm text-muted-foreground">ETA: {ambulance.eta}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Emergency Alerts</CardTitle>
                    <CardDescription>Recent emergency incidents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {emergencyAlerts.map((alert) => (
                        <div key={alert.id} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{alert.type}</p>
                            <p className="text-sm text-muted-foreground">{alert.location}</p>
                            <p className="text-xs text-muted-foreground">Time: {alert.time}</p>
                          </div>
                          <div className="text-right space-y-1">
                            <Badge variant={getStatusColor(alert.priority) as "default" | "destructive" | "secondary" | "outline"}>
                              {alert.priority}
                            </Badge>
                            <p className="text-sm text-muted-foreground">{alert.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Emergency Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Actions</CardTitle>
                  <CardDescription>Quick response and dispatch controls</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="destructive" className="h-20 flex-col">
                      <Phone className="h-6 w-6 mb-2" />
                      Emergency Call
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Ambulance className="h-6 w-6 mb-2" />
                      Dispatch Ambulance
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Navigation className="h-6 w-6 mb-2" />
                      Track Units
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <MapPin className="h-6 w-6 mb-2" />
                      View Map
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "ambulances" && (
            <Card>
              <CardHeader>
                <CardTitle>Ambulance Fleet</CardTitle>
                <CardDescription>Manage ambulance fleet and assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Ambulance fleet management will be implemented here.</p>
              </CardContent>
            </Card>
          )}

          {activeTab === "dispatch" && (
            <Card>
              <CardHeader>
                <CardTitle>Dispatch Center</CardTitle>
                <CardDescription>Emergency dispatch and coordination</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Dispatch interface will be implemented here.</p>
              </CardContent>
            </Card>
          )}

          {activeTab === "tracking" && (
            <Card>
              <CardHeader>
                <CardTitle>Live Tracking</CardTitle>
                <CardDescription>Real-time ambulance tracking and GPS</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Live tracking system will be implemented here.</p>
              </CardContent>
            </Card>
          )}

          {activeTab === "alerts" && (
            <Card>
              <CardHeader>
                <CardTitle>Emergency Alerts</CardTitle>
                <CardDescription>Manage emergency alerts and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Alert management will be implemented here.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyDashboard;