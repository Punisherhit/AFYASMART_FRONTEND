import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Pill,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  ShoppingCart,
  UserCheck,
  Plus,
  X,
  Edit,
  Trash2,
  Bell,
  ClipboardList,
  Heart,
  ArrowLeft,
  User,
  Settings,
  Lock
} from "lucide-react";

type Prescription = {
  patient: string;
  id: string;
  doctor: string;
  medications: string[];
  priority: "Standard" | "Urgent";
  time: string;
  status: "Pending" | "Processing" | "Ready" | "Completed";
  notes?: string;
};

type InventoryItem = {
  id: string;
  name: string;
  current: number;
  minimum: number;
  supplier: string;
  lastUpdated: string;
};

type FastMovingItem = {
  id: string;
  name: string;
  dispensed: number;
  stock: number;
  trend: string;
};

type Alert = {
  id: string;
  type: "stock" | "system" | "manual";
  message: string;
  priority: "low" | "medium" | "high";
  createdAt: string;
  resolved: boolean;
};

const PharmacyDashboard = () => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    { 
      patient: "John Doe", 
      id: "RX001", 
      doctor: "Dr. Smith", 
      medications: ["Amoxicillin 500mg", "Ibuprofen 200mg"], 
      priority: "Standard",
      time: "10:30 AM",
      status: "Ready"
    },
    { 
      patient: "Jane Smith", 
      id: "RX002", 
      doctor: "Dr. Johnson", 
      medications: ["Metformin 1000mg", "Lisinopril 10mg"], 
      priority: "Urgent",
      time: "11:00 AM",
      status: "Processing"
    },
    { 
      patient: "Mike Wilson", 
      id: "RX003", 
      doctor: "Dr. Brown", 
      medications: ["Omeprazole 20mg"], 
      priority: "Standard",
      time: "11:15 AM",
      status: "Pending"
    },
  ]);

  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: "INV001", name: "Amoxicillin 500mg", current: 15, minimum: 50, supplier: "MedSupply Co.", lastUpdated: new Date().toISOString() },
    { id: "INV002", name: "Insulin Glargine", current: 8, minimum: 20, supplier: "PharmCorp", lastUpdated: new Date().toISOString() },
    { id: "INV003", name: "Acetaminophen 500mg", current: 25, minimum: 100, supplier: "Generic Med", lastUpdated: new Date().toISOString() },
  ]);

  const [fastMovingItems, setFastMovingItems] = useState<FastMovingItem[]>([
    { id: "FM001", name: "Paracetamol 500mg", dispensed: 45, stock: 200, trend: "+12%" },
    { id: "FM002", name: "Ibuprofen 200mg", dispensed: 38, stock: 150, trend: "+8%" },
    { id: "FM003", name: "Omeprazole 20mg", dispensed: 32, stock: 120, trend: "+15%" },
    { id: "FM004", name: "Metformin 1000mg", dispensed: 28, stock: 180, trend: "+5%" },
  ]);

  const [alerts, setAlerts] = useState<Alert[]>([
    { id: "ALERT001", type: "stock", message: "Amoxicillin 500mg stock critically low", priority: "high", createdAt: new Date().toISOString(), resolved: false },
    { id: "ALERT002", type: "system", message: "Scheduled maintenance tonight at 11 PM", priority: "medium", createdAt: new Date().toISOString(), resolved: false },
  ]);

  const [completedPatients, setCompletedPatients] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newPrescription, setNewPrescription] = useState<Omit<Prescription, "id">>({ 
    patient: "", 
    doctor: "", 
    medications: [""], 
    priority: "Standard",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: "Pending"
  });
  const [newInventoryItem, setNewInventoryItem] = useState<Omit<InventoryItem, "id" | "lastUpdated">>({ 
    name: "", 
    current: 0, 
    minimum: 0, 
    supplier: "" 
  });
  const [newAlert, setNewAlert] = useState<Omit<Alert, "id" | "createdAt" | "resolved">>({ 
    type: "manual", 
    message: "", 
    priority: "medium" 
  });
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);
  const [activeTab, setActiveTab] = useState("prescriptions");
  const [showNewPrescriptionForm, setShowNewPrescriptionForm] = useState(false);
  const [showNewInventoryForm, setShowNewInventoryForm] = useState(false);
  const [showNewAlertForm, setShowNewAlertForm] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedCompletedPatients = localStorage.getItem("completedPatients");
    if (savedCompletedPatients) {
      setCompletedPatients(JSON.parse(savedCompletedPatients));
    }

    const savedPrescriptions = localStorage.getItem("prescriptions");
    if (savedPrescriptions) {
      setPrescriptions(JSON.parse(savedPrescriptions));
    }

    const savedInventory = localStorage.getItem("inventory");
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    }

    const savedAlerts = localStorage.getItem("alerts");
    if (savedAlerts) {
      setAlerts(JSON.parse(savedAlerts));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("prescriptions", JSON.stringify(prescriptions));
    localStorage.setItem("inventory", JSON.stringify(inventory));
    localStorage.setItem("alerts", JSON.stringify(alerts));
  }, [prescriptions, inventory, alerts]);

  const handleDispense = (prescriptionId: string) => {
    setPrescriptions(prev =>
      prev.map(p =>
        p.id === prescriptionId ? { ...p, status: "Completed" } : p
      )
    );
    
    const completedPrescription = prescriptions.find(p => p.id === prescriptionId);
    if (completedPrescription) {
      const updatedCompletedPatients = [...completedPatients, completedPrescription.patient];
      setCompletedPatients(updatedCompletedPatients);
      localStorage.setItem("completedPatients", JSON.stringify(updatedCompletedPatients));
      
      // Record the dispensing action with timestamp
      const dispensingRecord = {
        patient: completedPrescription.patient,
        prescriptionId: completedPrescription.id,
        medications: completedPrescription.medications,
        timestamp: new Date().toISOString(),
        action: "Dispensed"
      };
      
      // Save to localStorage
      const existingRecords = JSON.parse(localStorage.getItem("dispensingRecords") || "[]");
      localStorage.setItem("dispensingRecords", JSON.stringify([...existingRecords, dispensingRecord]));
      
      toast.success(`${completedPrescription.patient} has been cleared and medications dispensed`);
    }
  };

  const handleMarkDischarged = () => {
    toast.success("Patient marked as discharged and treatment completed");
  };

  const handleAddPrescription = () => {
    const newRx = {
      ...newPrescription,
      id: `RX${Math.floor(1000 + Math.random() * 9000)}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setPrescriptions([...prescriptions, newRx]);
    setNewPrescription({ 
      patient: "", 
      doctor: "", 
      medications: [""], 
      priority: "Standard",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "Pending"
    });
    setShowNewPrescriptionForm(false);
    toast.success("New prescription added successfully");
  };

  const handleAddInventoryItem = () => {
    const newItem = {
      ...newInventoryItem,
      id: `INV${Math.floor(1000 + Math.random() * 9000)}`,
      lastUpdated: new Date().toISOString()
    };
    
    setInventory([...inventory, newItem]);
    setNewInventoryItem({ name: "", current: 0, minimum: 0, supplier: "" });
    setShowNewInventoryForm(false);
    toast.success("New inventory item added successfully");
  };

  const handleAddAlert = () => {
    const newAlertItem = {
      ...newAlert,
      id: `ALERT${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      resolved: false
    };
    
    setAlerts([...alerts, newAlertItem]);
    setNewAlert({ type: "manual", message: "", priority: "medium" });
    setShowNewAlertForm(false);
    toast.success("New alert created successfully");
  };

  const handleUpdateInventory = (updatedItem: InventoryItem) => {
    setInventory(inventory.map(item => 
      item.id === updatedItem.id ? { ...updatedItem, lastUpdated: new Date().toISOString() } : item
    ));
    setEditingItem(null);
    toast.success("Inventory item updated successfully");
  };

  const handleUpdatePrescription = (updatedPrescription: Prescription) => {
    setPrescriptions(prescriptions.map(p => 
      p.id === updatedPrescription.id ? updatedPrescription : p
    ));
    setEditingPrescription(null);
    toast.success("Prescription updated successfully");
  };

  const handleDeleteInventory = (id: string) => {
    setInventory(inventory.filter(item => item.id !== id));
    toast.success("Inventory item deleted successfully");
  };

  const handleDeletePrescription = (id: string) => {
    setPrescriptions(prescriptions.filter(p => p.id !== id));
    toast.success("Prescription deleted successfully");
  };

  const handleResolveAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, resolved: true } : alert
    ));
    toast.success("Alert marked as resolved");
  };

  const handleLogout = () => {
    localStorage.removeItem('afya-token');
    localStorage.removeItem('afya-user');
    navigate('/');
  };

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.doctor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = inventory.filter(item => item.current < item.minimum);
  const pendingCount = prescriptions.filter(p => p.status !== "Completed").length;
  const dispensedToday = prescriptions.filter(p => p.status === "Completed").length;
  const activeAlerts = alerts.filter(alert => !alert.resolved);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="border-b">
        <div className="flex h-16 items-center px-6 justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="font-bold">AfyaConnect</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/pharmacist.png" />
                    <AvatarFallback>P</AvatarFallback>
                  </Avatar>
                  <span>Pharmacist</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Lock className="mr-2 h-4 w-4" />
                  <span>Privacy</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Pharmacy Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-sm">Dispensary</Badge>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setShowNewAlertForm(true)}
              className="flex items-center space-x-1"
            >
              <Bell className="h-4 w-4" />
              <span>New Alert</span>
            </Button>
          </div>
        </div>

        {/* Alerts Banner */}
        {activeAlerts.length > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <h3 className="font-medium">Active Alerts ({activeAlerts.length})</h3>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setActiveTab("alerts")}
                className="text-yellow-500 hover:bg-yellow-500/10"
              >
                View All
              </Button>
            </div>
            <div className="mt-2 space-y-2">
              {activeAlerts.slice(0, 3).map(alert => (
                <div key={alert.id} className="flex items-center justify-between text-sm">
                  <span>{alert.message}</span>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-6 px-2"
                    onClick={() => handleResolveAlert(alert.id)}
                  >
                    Resolve
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Prescriptions</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
              <p className="text-xs text-muted-foreground">Awaiting dispensing</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dispensed Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dispensedToday}</div>
              <p className="text-xs text-muted-foreground">
                {dispensedToday > 0 ? `+${Math.round((dispensedToday / pendingCount) * 100)}% from pending` : "No dispenses yet"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lowStockItems.length}</div>
              <p className="text-xs text-muted-foreground">Items need restock</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <UserCheck className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedPatients.length}</div>
              <p className="text-xs text-muted-foreground">Patients cleared</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="prescriptions" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="dispensing">Dispensing</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="prescriptions" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Prescription Queue</CardTitle>
                  <Button 
                    size="sm" 
                    onClick={() => setShowNewPrescriptionForm(true)}
                    className="flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Prescription</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showNewPrescriptionForm && (
                  <div className="mb-6 p-4 rounded-lg bg-muted/50 border">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Add New Prescription</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setShowNewPrescriptionForm(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Input
                        placeholder="Patient Name"
                        value={newPrescription.patient}
                        onChange={(e) => setNewPrescription({...newPrescription, patient: e.target.value})}
                      />
                      <Input
                        placeholder="Doctor Name"
                        value={newPrescription.doctor}
                        onChange={(e) => setNewPrescription({...newPrescription, doctor: e.target.value})}
                      />
                      <Select
                        value={newPrescription.priority}
                        onValueChange={(value) => setNewPrescription({...newPrescription, priority: value as "Standard" | "Urgent"})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Standard">Standard</SelectItem>
                          <SelectItem value="Urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={newPrescription.status}
                        onValueChange={(value) => setNewPrescription({...newPrescription, status: value as "Pending" | "Processing" | "Ready" | "Completed"})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Processing">Processing</SelectItem>
                          <SelectItem value="Ready">Ready</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Medications</h4>
                      {newPrescription.medications.map((med, index) => (
                        <div key={index} className="flex space-x-2 mb-2">
                          <Input
                            placeholder="Medication name and dosage"
                            value={med}
                            onChange={(e) => {
                              const newMeds = [...newPrescription.medications];
                              newMeds[index] = e.target.value;
                              setNewPrescription({...newPrescription, medications: newMeds});
                            }}
                          />
                          {newPrescription.medications.length > 1 && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                const newMeds = [...newPrescription.medications];
                                newMeds.splice(index, 1);
                                setNewPrescription({...newPrescription, medications: newMeds});
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => setNewPrescription({...newPrescription, medications: [...newPrescription.medications, ""]})}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Medication
                      </Button>
                    </div>
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Notes</h4>
                      <Textarea
                        placeholder="Additional notes..."
                        value={newPrescription.notes || ""}
                        onChange={(e) => setNewPrescription({...newPrescription, notes: e.target.value})}
                      />
                    </div>
                    <Button className="w-full" onClick={handleAddPrescription}>
                      Add Prescription
                    </Button>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input 
                      placeholder="Search prescriptions..." 
                      className="flex-1" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button size="icon" variant="outline">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {filteredPrescriptions.map((prescription, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center space-x-4">
                          <div>
                            <div className="font-medium">{prescription.patient}</div>
                            <div className="text-sm text-muted-foreground">
                              {prescription.medications.join(", ")}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Prescribed by {prescription.doctor}
                              {prescription.notes && (
                                <div className="mt-1 text-xs text-blue-500">Notes: {prescription.notes}</div>
                              )}
                            </div>
                          </div>
                          <Badge variant="secondary">{prescription.id}</Badge>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm">{prescription.time}</span>
                          <Badge variant={prescription.priority === "Urgent" ? "destructive" : "outline"}>
                            {prescription.priority}
                          </Badge>
                          <Badge variant={
                            prescription.status === "Ready" ? "default" : 
                            prescription.status === "Processing" ? "secondary" : 
                            prescription.status === "Completed" ? "green" : "outline"
                          }>
                            {prescription.status}
                          </Badge>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setEditingPrescription(prescription)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDeletePrescription(prescription.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => handleDispense(prescription.id)}
                              disabled={prescription.status === "Completed"}
                            >
                              <Pill className="h-4 w-4 mr-1" />
                              {prescription.status === "Completed" ? "Dispensed" : "Dispense"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Inventory Management</CardTitle>
                    <Button 
                      size="sm" 
                      onClick={() => setShowNewInventoryForm(true)}
                      className="flex items-center space-x-1"
                    >
                      <Plus className="h-4 w-4" />
                      <span>New Item</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {showNewInventoryForm && (
                    <div className="mb-6 p-4 rounded-lg bg-muted/50 border">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Add New Inventory Item</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setShowNewInventoryForm(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 gap-4 mb-4">
                        <Input
                          placeholder="Item Name"
                          value={newInventoryItem.name}
                          onChange={(e) => setNewInventoryItem({...newInventoryItem, name: e.target.value})}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            type="number"
                            placeholder="Current Stock"
                            value={newInventoryItem.current}
                            onChange={(e) => setNewInventoryItem({...newInventoryItem, current: parseInt(e.target.value) || 0})}
                          />
                          <Input
                            type="number"
                            placeholder="Minimum Required"
                            value={newInventoryItem.minimum}
                            onChange={(e) => setNewInventoryItem({...newInventoryItem, minimum: parseInt(e.target.value) || 0})}
                          />
                        </div>
                        <Input
                          placeholder="Supplier"
                          value={newInventoryItem.supplier}
                          onChange={(e) => setNewInventoryItem({...newInventoryItem, supplier: e.target.value})}
                        />
                      </div>
                      <Button className="w-full" onClick={handleAddInventoryItem}>
                        Add Inventory Item
                      </Button>
                    </div>
                  )}

                  <div className="space-y-3">
                    {inventory.map((item, index) => (
                      <div key={index} className={`p-3 rounded-lg ${item.current < item.minimum ? "bg-yellow-500/10 border border-yellow-500/20" : "bg-muted/50"}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Stock: {item.current} (Min: {item.minimum})
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Supplier: {item.supplier} • Last updated: {new Date(item.lastUpdated).toLocaleString()}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setEditingItem(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDeleteInventory(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Package className="h-4 w-4 mr-1" />
                              Reorder
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Fast-Moving Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {fastMovingItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Dispensed: {item.dispensed} | Stock: {item.stock}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-500">{item.trend}</div>
                          <div className="text-xs text-muted-foreground">vs last week</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="dispensing" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Dispensing Workflow</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-24 flex-col">
                  <Search className="h-8 w-8 mb-2" />
                  Verify Prescription
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <Package className="h-8 w-8 mb-2" />
                  Check Inventory
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <Pill className="h-8 w-8 mb-2" />
                  Prepare Medication
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <CheckCircle className="h-8 w-8 mb-2" />
                  Complete Dispensing
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Patient Counseling Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <h4 className="font-medium mb-2">Drug Interaction Alert</h4>
                    <p className="text-sm text-muted-foreground">
                      Patient taking Warfarin - advise caution with new Ibuprofen prescription. 
                      Monitor for bleeding symptoms.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <h4 className="font-medium mb-2">Counseling Points</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Take with food to reduce stomach upset</li>
                      <li>• Complete full course even if feeling better</li>
                      <li>• Report any unusual side effects immediately</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Daily Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Prescriptions:</span>
                    <span className="font-bold">{prescriptions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed Today:</span>
                    <span className="font-bold">{dispensedToday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending Dispensing:</span>
                    <span className="font-bold">{pendingCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Wait Time:</span>
                    <span className="font-bold">8 minutes</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Patient Completion</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Treatment Complete</h3>
                  <p className="text-muted-foreground mb-4">
                    Patient has received all prescribed medications and counseling
                  </p>
                  <Button className="w-full" onClick={handleMarkDischarged}>
                    Mark as Discharged
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Alerts Management</CardTitle>
                  <Button 
                    size="sm" 
                    onClick={() => setShowNewAlertForm(true)}
                    className="flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Alert</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showNewAlertForm && (
                  <div className="mb-6 p-4 rounded-lg bg-muted/50 border">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Create New Alert</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setShowNewAlertForm(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <Select
                        value={newAlert.type}
                        onValueChange={(value) => setNewAlert({...newAlert, type: value as "stock" | "system" | "manual"})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Alert Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="stock">Stock Alert</SelectItem>
                          <SelectItem value="system">System Alert</SelectItem>
                          <SelectItem value="manual">Manual Alert</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={newAlert.priority}
                        onValueChange={(value) => setNewAlert({...newAlert, priority: value as "low" | "medium" | "high"})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <Textarea
                        placeholder="Alert message..."
                        value={newAlert.message}
                        onChange={(e) => setNewAlert({...newAlert, message: e.target.value})}
                      />
                    </div>
                    <Button className="w-full" onClick={handleAddAlert}>
                      Create Alert
                    </Button>
                  </div>
                )}

                <div className="space-y-3">
                  {alerts.map((alert, index) => (
                    <div key={index} className={`p-3 rounded-lg ${alert.resolved ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{alert.message}</div>
                          <div className="text-sm text-muted-foreground">
                            {alert.type} • {alert.priority} priority • {new Date(alert.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {!alert.resolved && (
                            <Button 
                              size="sm" 
                              onClick={() => handleResolveAlert(alert.id)}
                            >
                              Resolve
                            </Button>
                          )}
                          {alert.resolved && (
                            <Badge variant="outline" className="text-green-500">
                              Resolved
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Inventory Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Edit Inventory Item</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setEditingItem(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <Input
                placeholder="Item Name"
                value={editingItem.name}
                onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Current Stock"
                  value={editingItem.current}
                  onChange={(e) => setEditingItem({...editingItem, current: parseInt(e.target.value) || 0})}
                />
                <Input
                  type="number"
                  placeholder="Minimum Required"
                  value={editingItem.minimum}
                  onChange={(e) => setEditingItem({...editingItem, minimum: parseInt(e.target.value) || 0})}
                />
              </div>
              <Input
                placeholder="Supplier"
                value={editingItem.supplier}
                onChange={(e) => setEditingItem({...editingItem, supplier: e.target.value})}
              />
            </div>
            <Button className="w-full" onClick={() => handleUpdateInventory(editingItem)}>
              Update Inventory
            </Button>
          </div>
        </div>
      )}

      {/* Edit Prescription Modal */}
      {editingPrescription && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Edit Prescription</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setEditingPrescription(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <Input
                placeholder="Patient Name"
                value={editingPrescription.patient}
                onChange={(e) => setEditingPrescription({...editingPrescription, patient: e.target.value})}
              />
              <Input
                placeholder="Doctor Name"
                value={editingPrescription.doctor}
                onChange={(e) => setEditingPrescription({...editingPrescription, doctor: e.target.value})}
              />
              <Select
                value={editingPrescription.priority}
                onValueChange={(value) => setEditingPrescription({...editingPrescription, priority: value as "Standard" | "Urgent"})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={editingPrescription.status}
                onValueChange={(value) => setEditingPrescription({...editingPrescription, status: value as "Pending" | "Processing" | "Ready" | "Completed"})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Ready">Ready</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Medications</h4>
              {editingPrescription.medications.map((med, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <Input
                    placeholder="Medication name and dosage"
                    value={med}
                    onChange={(e) => {
                      const newMeds = [...editingPrescription.medications];
                      newMeds[index] = e.target.value;
                      setEditingPrescription({...editingPrescription, medications: newMeds});
                    }}
                  />
                  {editingPrescription.medications.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newMeds = [...editingPrescription.medications];
                        newMeds.splice(index, 1);
                        setEditingPrescription({...editingPrescription, medications: newMeds});
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setEditingPrescription({...editingPrescription, medications: [...editingPrescription.medications, ""]})}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Medication
              </Button>
            </div>
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Notes</h4>
              <Textarea
                placeholder="Additional notes..."
                value={editingPrescription.notes || ""}
                onChange={(e) => setEditingPrescription({...editingPrescription, notes: e.target.value})}
              />
            </div>
            <Button className="w-full" onClick={() => handleUpdatePrescription(editingPrescription)}>
              Update Prescription
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyDashboard;