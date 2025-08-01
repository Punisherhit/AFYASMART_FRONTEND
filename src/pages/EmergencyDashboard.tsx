import { useState } from "react";
import { ArrowLeft, Ambulance, MapPin, Phone, AlertTriangle, Navigation, Edit, Plus, Stethoscope, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EmergencyDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  // EDITABLE STATES
  const [editingPatient, setEditingPatient] = useState(null);
  const [editingAlert, setEditingAlert] = useState(null);
  const [editingAmbulance, setEditingAmbulance] = useState(null);
  const [editingStat, setEditingStat] = useState(null);
  
  const [newPatient, setNewPatient] = useState({
    name: "",
    condition: "",
    department: "",
    priority: "Normal"
  });

  const [newAlert, setNewAlert] = useState({
    type: "",
    location: "",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: "Active",
    priority: "Normal"
  });

  const [newAmbulance, setNewAmbulance] = useState({
    id: "",
    status: "Available",
    patient: null,
    location: "",
    eta: null,
    priority: null
  });

  const [stats, setStats] = useState({
    activeEmergencies: 3,
    availableAmbulances: 5,
    enRoute: 2,
    averageResponse: 8
  });

  const [activeAmbulances, setActiveAmbulances] = useState([
    { id: "AMB001", status: "En Route", patient: "John Doe", location: "Downtown", eta: "5 mins", priority: "Critical" },
    { id: "AMB002", status: "On Scene", patient: "Jane Smith", location: "Hospital Street", eta: "10 mins", priority: "Urgent" },
    { id: "AMB003", status: "Available", patient: null, location: "Station A", eta: null, priority: null },
  ]);

  const [emergencyAlerts, setEmergencyAlerts] = useState([
    { id: 1, type: "Cardiac Arrest", location: "123 Main St", time: "14:25", status: "Active", priority: "Critical" },
    { id: 2, type: "Car Accident", location: "Highway 101", time: "14:15", status: "Dispatched", priority: "Urgent" },
    { id: 3, type: "Medical Emergency", location: "Park Avenue", time: "14:10", status: "Resolved", priority: "Normal" },
  ]);

  const departments = [
    "Cardiology",
    "Emergency",
    "Trauma",
    "Neurology",
    "Pediatrics",
    "Orthopedics"
  ];

  const menuItems = [
    { id: "overview", label: "Overview", icon: AlertTriangle },
    { id: "ambulances", label: "Ambulance Fleet", icon: Ambulance },
    { id: "dispatch", label: "Dispatch", icon: Phone },
    { id: "tracking", label: "Live Tracking", icon: MapPin },
    { id: "alerts", label: "Emergency Alerts", icon: AlertTriangle },
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

  // STATS EDITING
  const handleStatChange = (statName: string, value: number) => {
    setStats(prev => ({ ...prev, [statName]: value }));
  };

  // AMBULANCE EDITING
  const handleEditAmbulance = (ambulance) => {
    setEditingAmbulance(ambulance);
  };

  const handleSaveAmbulance = () => {
    const updatedAmbulances = activeAmbulances.map(amb => 
      amb.id === editingAmbulance.id ? editingAmbulance : amb
    );
    setActiveAmbulances(updatedAmbulances);
    setEditingAmbulance(null);
  };

  const handleAddAmbulance = () => {
    if (!newAmbulance.id) return;
    
    setActiveAmbulances(prev => [
      ...prev, 
      { ...newAmbulance }
    ]);
    
    setNewAmbulance({
      id: "",
      status: "Available",
      patient: null,
      location: "",
      eta: null,
      priority: null
    });
  };

  const handleDeleteAmbulance = (id: string) => {
    setActiveAmbulances(prev => prev.filter(amb => amb.id !== id));
  };

  // PATIENT EDITING
  const handleEditPatient = (ambulance) => {
    setEditingPatient(ambulance);
  };

  const handleSavePatient = () => {
    const updatedAmbulances = activeAmbulances.map(amb => 
      amb.id === editingPatient.id ? editingPatient : amb
    );
    setActiveAmbulances(updatedAmbulances);
    setEditingPatient(null);
  };

  const handleAddPatient = () => {
    const availableAmbulance = activeAmbulances.find(amb => amb.status === "Available");
    if (availableAmbulance) {
      const updatedAmbulance = {
        ...availableAmbulance,
        patient: newPatient.name,
        status: "En Route",
        priority: newPatient.priority,
        eta: "15 mins"
      };
      
      const updatedAmbulances = activeAmbulances.map(amb => 
        amb.id === availableAmbulance.id ? updatedAmbulance : amb
      );
      
      setActiveAmbulances(updatedAmbulances);
      setNewPatient({
        name: "",
        condition: "",
        department: "",
        priority: "Normal"
      });
    }
  };

  // ALERT EDITING
  const handleEditAlert = (alert) => {
    setEditingAlert(alert);
  };

  const handleSaveAlert = () => {
    const updatedAlerts = emergencyAlerts.map(a => 
      a.id === editingAlert.id ? editingAlert : a
    );
    setEmergencyAlerts(updatedAlerts);
    setEditingAlert(null);
  };

  const handleAddAlert = () => {
    if (!newAlert.type) return;
    
    setEmergencyAlerts(prev => [
      ...prev, 
      { 
        ...newAlert, 
        id: Date.now(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    
    setNewAlert({
      type: "",
      location: "",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "Active",
      priority: "Normal"
    });
  };

  const handleDeleteAlert = (id: number) => {
    setEmergencyAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  // REFER DEPARTMENT
  const handleReferDepartment = (ambulanceId, department) => {
    alert(`Patient in ${ambulanceId} referred to ${department}`);
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
              {/* EDITABLE STATS CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(stats).map(([key, value]) => (
                  <Card 
                    key={key} 
                    className="relative group cursor-pointer"
                    onClick={() => setEditingStat(key)}
                  >
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Edit className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        {key.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{value}</div>
                      <p className="text-muted-foreground">
                        {key === 'activeEmergencies' ? 'Ongoing incidents' : 
                         key === 'availableAmbulances' ? 'Ready for dispatch' : 
                         key === 'enRoute' ? 'Ambulances dispatched' : 
                         'Response time'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* EDITABLE AMBULANCE CARD */}
                <Card>
                  <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                      <CardTitle>Active Ambulances</CardTitle>
                      <CardDescription>Current ambulance fleet status</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Ambulance
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Ambulance</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="amb-id" className="text-right">
                                Ambulance ID
                              </Label>
                              <Input
                                id="amb-id"
                                value={newAmbulance.id}
                                onChange={(e) => setNewAmbulance({...newAmbulance, id: e.target.value})}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="amb-location" className="text-right">
                                Location
                              </Label>
                              <Input
                                id="amb-location"
                                value={newAmbulance.location}
                                onChange={(e) => setNewAmbulance({...newAmbulance, location: e.target.value})}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="amb-status" className="text-right">
                                Status
                              </Label>
                              <Select
                                value={newAmbulance.status}
                                onValueChange={(value) => setNewAmbulance({...newAmbulance, status: value})}
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Available">Available</SelectItem>
                                  <SelectItem value="En Route">En Route</SelectItem>
                                  <SelectItem value="On Scene">On Scene</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline">Cancel</Button>
                            <Button onClick={handleAddAmbulance}>Add Ambulance</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Patient
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Patient</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Name
                              </Label>
                              <Input
                                id="name"
                                value={newPatient.name}
                                onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="condition" className="text-right">
                                Condition
                              </Label>
                              <Input
                                id="condition"
                                value={newPatient.condition}
                                onChange={(e) => setNewPatient({...newPatient, condition: e.target.value})}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="department" className="text-right">
                                Department
                              </Label>
                              <Select
                                value={newPatient.department}
                                onValueChange={(value) => setNewPatient({...newPatient, department: value})}
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                  {departments.map(dept => (
                                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="priority" className="text-right">
                                Priority
                              </Label>
                              <Select
                                value={newPatient.priority}
                                onValueChange={(value) => setNewPatient({...newPatient, priority: value})}
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Normal">Normal</SelectItem>
                                  <SelectItem value="Urgent">Urgent</SelectItem>
                                  <SelectItem value="Critical">Critical</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline">Cancel</Button>
                            <Button onClick={handleAddPatient}>Save</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeAmbulances.map((ambulance) => (
                        <div key={ambulance.id} className="flex justify-between items-center p-3 border rounded-lg group">
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
                            <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 p-1"
                                onClick={() => handleEditAmbulance(ambulance)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 p-1 text-destructive"
                                onClick={() => handleDeleteAmbulance(ambulance.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                              {ambulance.patient && (
                                <>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 p-1"
                                    onClick={() => handleEditPatient(ambulance)}
                                  >
                                    <Stethoscope className="h-3 w-3" />
                                  </Button>
                                  <Select
                                    onValueChange={(value) => handleReferDepartment(ambulance.id, value)}
                                  >
                                    <SelectTrigger className="h-6 w-24">
                                      <SelectValue placeholder="Refer to" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {departments.map(dept => (
                                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* EDITABLE ALERTS CARD */}
                <Card>
                  <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                      <CardTitle>Emergency Alerts</CardTitle>
                      <CardDescription>Recent emergency incidents</CardDescription>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Plus className="h-4 w-4" />
                          Add Alert
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create New Alert</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="alert-type" className="text-right">
                              Type
                            </Label>
                            <Input
                              id="alert-type"
                              value={newAlert.type}
                              onChange={(e) => setNewAlert({...newAlert, type: e.target.value})}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="alert-location" className="text-right">
                              Location
                            </Label>
                            <Input
                              id="alert-location"
                              value={newAlert.location}
                              onChange={(e) => setNewAlert({...newAlert, location: e.target.value})}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="alert-priority" className="text-right">
                              Priority
                            </Label>
                            <Select
                              value={newAlert.priority}
                              onValueChange={(value) => setNewAlert({...newAlert, priority: value})}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Normal">Normal</SelectItem>
                                <SelectItem value="Urgent">Urgent</SelectItem>
                                <SelectItem value="Critical">Critical</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="alert-status" className="text-right">
                              Status
                            </Label>
                            <Select
                              value={newAlert.status}
                              onValueChange={(value) => setNewAlert({...newAlert, status: value})}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Dispatched">Dispatched</SelectItem>
                                <SelectItem value="Resolved">Resolved</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline">Cancel</Button>
                          <Button onClick={handleAddAlert}>Create Alert</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {emergencyAlerts.map((alert) => (
                        <div key={alert.id} className="flex justify-between items-center p-3 border rounded-lg group">
                          <div>
                            <p className="font-medium">{alert.type}</p>
                            <p className="text-sm text-muted-foreground">{alert.location}</p>
                            <p className="text-xs text-muted-foreground">Time: {alert.time}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getStatusColor(alert.priority) as "default" | "destructive" | "secondary" | "outline"}>
                              {alert.priority}
                            </Badge>
                            <p className="text-sm text-muted-foreground">{alert.status}</p>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 p-1"
                                onClick={() => handleEditAlert(alert)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 p-1 text-destructive"
                                onClick={() => handleDeleteAlert(alert.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
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

          {/* Edit Patient Dialog */}
          {editingPatient && (
            <Dialog open={true} onOpenChange={() => setEditingPatient(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Patient Details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={editingPatient.patient}
                      onChange={(e) => setEditingPatient({
                        ...editingPatient,
                        patient: e.target.value
                      })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={editingPatient.location}
                      onChange={(e) => setEditingPatient({
                        ...editingPatient,
                        location: e.target.value
                      })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="eta" className="text-right">
                      ETA
                    </Label>
                    <Input
                      id="eta"
                      value={editingPatient.eta}
                      onChange={(e) => setEditingPatient({
                        ...editingPatient,
                        eta: e.target.value
                      })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="priority" className="text-right">
                      Priority
                    </Label>
                    <Select
                      value={editingPatient.priority}
                      onValueChange={(value) => setEditingPatient({
                        ...editingPatient,
                        priority: value
                      })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Normal">Normal</SelectItem>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingPatient(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSavePatient}>
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Edit Ambulance Dialog */}
          {editingAmbulance && (
            <Dialog open={true} onOpenChange={() => setEditingAmbulance(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Ambulance Details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amb-id" className="text-right">
                      ID
                    </Label>
                    <Input
                      id="amb-id"
                      value={editingAmbulance.id}
                      onChange={(e) => setEditingAmbulance({
                        ...editingAmbulance,
                        id: e.target.value
                      })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amb-location" className="text-right">
                      Location
                    </Label>
                    <Input
                      id="amb-location"
                      value={editingAmbulance.location}
                      onChange={(e) => setEditingAmbulance({
                        ...editingAmbulance,
                        location: e.target.value
                      })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amb-status" className="text-right">
                      Status
                    </Label>
                    <Select
                      value={editingAmbulance.status}
                      onValueChange={(value) => setEditingAmbulance({
                        ...editingAmbulance,
                        status: value
                      })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="En Route">En Route</SelectItem>
                        <SelectItem value="On Scene">On Scene</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingAmbulance(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveAmbulance}>
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Edit Alert Dialog */}
          {editingAlert && (
            <Dialog open={true} onOpenChange={() => setEditingAlert(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Emergency Alert</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="alert-type" className="text-right">
                      Type
                    </Label>
                    <Input
                      id="alert-type"
                      value={editingAlert.type}
                      onChange={(e) => setEditingAlert({
                        ...editingAlert,
                        type: e.target.value
                      })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="alert-location" className="text-right">
                      Location
                    </Label>
                    <Input
                      id="alert-location"
                      value={editingAlert.location}
                      onChange={(e) => setEditingAlert({
                        ...editingAlert,
                        location: e.target.value
                      })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="alert-priority" className="text-right">
                      Priority
                    </Label>
                    <Select
                      value={editingAlert.priority}
                      onValueChange={(value) => setEditingAlert({
                        ...editingAlert,
                        priority: value
                      })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Normal">Normal</SelectItem>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="alert-status" className="text-right">
                      Status
                    </Label>
                    <Select
                      value={editingAlert.status}
                      onValueChange={(value) => setEditingAlert({
                        ...editingAlert,
                        status: value
                      })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Dispatched">Dispatched</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingAlert(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveAlert}>
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Edit Stat Dialog */}
          {editingStat && (
            <Dialog open={true} onOpenChange={() => setEditingStat(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Edit {editingStat.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="stat-value" className="text-right">
                      Value
                    </Label>
                    <Input
                      id="stat-value"
                      type="number"
                      value={stats[editingStat]}
                      onChange={(e) => handleStatChange(editingStat, parseInt(e.target.value) || 0)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingStat(null)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setEditingStat(null)}>
                    Save
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Other Tabs */}
          {activeTab === "ambulances" && (
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle>Ambulance Fleet</CardTitle>
                  <CardDescription>Manage ambulance fleet and assignments</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Ambulance
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Ambulance</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amb-id" className="text-right">
                          Ambulance ID
                        </Label>
                        <Input
                          id="amb-id"
                          value={newAmbulance.id}
                          onChange={(e) => setNewAmbulance({...newAmbulance, id: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amb-location" className="text-right">
                          Location
                        </Label>
                        <Input
                          id="amb-location"
                          value={newAmbulance.location}
                          onChange={(e) => setNewAmbulance({...newAmbulance, location: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amb-status" className="text-right">
                          Status
                        </Label>
                        <Select
                          value={newAmbulance.status}
                          onValueChange={(value) => setNewAmbulance({...newAmbulance, status: value})}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Available">Available</SelectItem>
                            <SelectItem value="En Route">En Route</SelectItem>
                            <SelectItem value="On Scene">On Scene</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button onClick={handleAddAmbulance}>Add Ambulance</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeAmbulances.map((ambulance) => (
                    <div key={ambulance.id} className="flex justify-between items-center p-3 border rounded-lg group">
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
                        <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 p-1"
                            onClick={() => handleEditAmbulance(ambulance)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 p-1 text-destructive"
                            onClick={() => handleDeleteAmbulance(ambulance.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "alerts" && (
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle>Emergency Alerts</CardTitle>
                  <CardDescription>Manage emergency alerts and notifications</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Alert
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Alert</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="alert-type" className="text-right">
                          Type
                        </Label>
                        <Input
                          id="alert-type"
                          value={newAlert.type}
                          onChange={(e) => setNewAlert({...newAlert, type: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="alert-location" className="text-right">
                          Location
                        </Label>
                        <Input
                          id="alert-location"
                          value={newAlert.location}
                          onChange={(e) => setNewAlert({...newAlert, location: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="alert-priority" className="text-right">
                          Priority
                        </Label>
                        <Select
                          value={newAlert.priority}
                          onValueChange={(value) => setNewAlert({...newAlert, priority: value})}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Normal">Normal</SelectItem>
                            <SelectItem value="Urgent">Urgent</SelectItem>
                            <SelectItem value="Critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="alert-status" className="text-right">
                          Status
                        </Label>
                        <Select
                          value={newAlert.status}
                          onValueChange={(value) => setNewAlert({...newAlert, status: value})}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Dispatched">Dispatched</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button onClick={handleAddAlert}>Create Alert</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emergencyAlerts.map((alert) => (
                    <div key={alert.id} className="flex justify-between items-center p-3 border rounded-lg group">
                      <div>
                        <p className="font-medium">{alert.type}</p>
                        <p className="text-sm text-muted-foreground">{alert.location}</p>
                        <p className="text-xs text-muted-foreground">Time: {alert.time}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(alert.priority) as "default" | "destructive" | "secondary" | "outline"}>
                          {alert.priority}
                        </Badge>
                        <p className="text-sm text-muted-foreground">{alert.status}</p>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 p-1"
                            onClick={() => handleEditAlert(alert)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 p-1 text-destructive"
                            onClick={() => handleDeleteAlert(alert.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Other tabs remain similar but with edit capabilities */}
          {activeTab === "dispatch" && (
            <Card>
              <CardHeader>
                <CardTitle>Dispatch Center</CardTitle>
                <CardDescription>Emergency dispatch and coordination</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center my-8">
                  <Button className="gap-2">
                    <Ambulance className="h-4 w-4" />
                    Dispatch New Unit
                  </Button>
                </div>
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
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96 flex items-center justify-center text-muted-foreground">
                  Map View
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyDashboard;