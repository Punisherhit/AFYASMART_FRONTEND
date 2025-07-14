import { useState } from "react";
import { ArrowLeft, Users, FileText, Stethoscope, AlertTriangle, Pill, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const menuItems = [
    { id: "overview", label: "Overview", icon: Stethoscope },
    { id: "patients", label: "My Patients", icon: Users },
    { id: "prescriptions", label: "Prescriptions", icon: Pill },
    { id: "referrals", label: "Referrals", icon: FileText },
    { id: "emergency", label: "Emergency", icon: AlertTriangle },
  ];

  const todayPatients = [
    { id: 1, name: "John Doe", time: "9:00 AM", type: "Consultation", urgency: "Normal" },
    { id: 2, name: "Jane Smith", time: "10:30 AM", type: "Follow-up", urgency: "Critical" },
    { id: 3, name: "Mike Johnson", time: "2:00 PM", type: "Check-up", urgency: "Normal" },
  ];

  const recentPrescriptions = [
    { id: 1, patient: "John Doe", medication: "Amoxicillin 500mg", date: "2024-01-10", status: "Active" },
    { id: 2, patient: "Jane Smith", medication: "Ibuprofen 200mg", date: "2024-01-09", status: "Completed" },
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Critical": return "destructive";
      case "Urgent": return "default";
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
              <h1 className="text-2xl font-bold text-foreground">Doctor Dashboard</h1>
              <p className="text-muted-foreground">Dr. Sarah Johnson - Cardiology</p>
            </div>
          </div>
          <Badge variant="default">Doctor</Badge>
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
                    <CardTitle className="text-sm font-medium">Today's Patients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-muted-foreground">Scheduled appointments</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Pending Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5</div>
                    <p className="text-muted-foreground">Lab/Radiology reports</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-muted-foreground">Current medications</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Critical Patients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-destructive">2</div>
                    <p className="text-muted-foreground">Require attention</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Today's Schedule</CardTitle>
                    <CardDescription>Your patients for today</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {todayPatients.map((patient) => (
                        <div key={patient.id} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{patient.name}</p>
                            <p className="text-sm text-muted-foreground">{patient.type}</p>
                          </div>
                          <div className="text-right space-y-1">
                            <p className="text-sm font-medium">{patient.time}</p>
                            <Badge variant={getUrgencyColor(patient.urgency) as "default" | "secondary" | "destructive"}>
                              {patient.urgency}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Prescriptions</CardTitle>
                    <CardDescription>Latest prescriptions issued</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentPrescriptions.map((prescription) => (
                        <div key={prescription.id} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{prescription.patient}</p>
                            <p className="text-sm text-muted-foreground">{prescription.medication}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant={prescription.status === "Active" ? "default" : "secondary"}>
                              {prescription.status}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-1">{prescription.date}</p>
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
                  <CardDescription>Common tasks and emergency functions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-20 flex-col">
                      <Users className="h-6 w-6 mb-2" />
                      View Patients
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Pill className="h-6 w-6 mb-2" />
                      New Prescription
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <FileText className="h-6 w-6 mb-2" />
                      Lab Referral
                    </Button>
                    <Button variant="destructive" className="h-20 flex-col">
                      <Phone className="h-6 w-6 mb-2" />
                      Call Ambulance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "patients" && (
            <Card>
              <CardHeader>
                <CardTitle>Patient Management</CardTitle>
                <CardDescription>Manage your assigned patients</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Patient management interface will be implemented here.</p>
              </CardContent>
            </Card>
          )}

          {activeTab === "prescriptions" && (
            <Card>
              <CardHeader>
                <CardTitle>Prescriptions</CardTitle>
                <CardDescription>Create and manage patient prescriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Prescription management will be implemented here.</p>
              </CardContent>
            </Card>
          )}

          {activeTab === "referrals" && (
            <Card>
              <CardHeader>
                <CardTitle>Referrals</CardTitle>
                <CardDescription>Refer patients to lab and radiology</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Referral system will be implemented here.</p>
              </CardContent>
            </Card>
          )}

          {activeTab === "emergency" && (
            <Card>
              <CardHeader>
                <CardTitle>Emergency Actions</CardTitle>
                <CardDescription>Emergency procedures and ambulance dispatch</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Emergency system will be implemented here.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;