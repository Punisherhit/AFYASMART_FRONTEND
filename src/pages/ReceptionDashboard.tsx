import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Users,
  UserPlus,
  Clock,
  CheckCircle,
  Search,
  Filter,
  CreditCard,
  Receipt,
  DollarSign,
  Pill,
  Activity,
  Stethoscope,
  ClipboardList,
  Heart,
  ArrowLeft,
  User,
  Settings,
  Lock
} from "lucide-react";
import HospitalLayout from "@/components/HospitalLayout";
import PatientFlowTracker from "@/components/PatientFlowTracker";

type Patient = {
  id: number;
  name: string;
  appointment: string;
  status: string;
  priority: string;
  department: string;
  amount: number;
  journey: {
    step: string;
    timestamp: string;
    details?: string;
  }[];
};

const ReceptionDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isBillingDialogOpen, setIsBillingDialogOpen] = useState(false);
  const [isPatientDetailsOpen, setIsPatientDetailsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [waitingPatients, setWaitingPatients] = useState<Patient[]>([
    {
      id: 1,
      name: "John Doe",
      appointment: "10:00 AM",
      status: "waiting",
      priority: "normal",
      department: "Cardiology",
      amount: 2500,
      journey: [
        { step: "Registration", timestamp: "09:45 AM", details: "Basic information collected" },
        { step: "Vitals Check", timestamp: "09:55 AM", details: "BP: 120/80, Temp: 98.6°F" },
        { step: "Doctor Consultation", timestamp: "10:20 AM", details: "Diagnosis: Hypertension" },
        { step: "Lab Tests", timestamp: "10:45 AM", details: "Blood work completed" }
      ]
    },
    {
      id: 2,
      name: "Jane Smith",
      appointment: "10:30 AM",
      status: "ready-for-billing",
      priority: "urgent",
      department: "Neurology",
      amount: 3200,
      journey: [
        { step: "Registration", timestamp: "10:15 AM", details: "Emergency case" },
        { step: "Vitals Check", timestamp: "10:20 AM", details: "BP: 140/90, Temp: 99.1°F" },
        { step: "Doctor Consultation", timestamp: "10:35 AM", details: "Referred for MRI" },
        { step: "MRI Scan", timestamp: "11:00 AM", details: "Scan completed" }
      ]
    },
    {
      id: 3,
      name: "Mike Johnson",
      appointment: "11:00 AM",
      status: "waiting",
      priority: "normal",
      department: "Orthopedics",
      amount: 1800,
      journey: [
        { step: "Registration", timestamp: "10:45 AM" },
        { step: "Vitals Check", timestamp: "10:55 AM" },
        { step: "X-Ray", timestamp: "11:15 AM", details: "Left ankle fracture confirmed" }
      ]
    }
  ]);

  const [billingForm, setBillingForm] = useState({
    consultationFee: 2500,
    labTests: 0,
    medication: 0,
    procedures: 0,
    paymentMethod: "",
    discount: 0
  });

  const paymentMethods = ["Cash", "Card", "MPESA", "Insurance"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting": return "bg-yellow-100 text-yellow-800";
      case "ready-for-billing": return "bg-orange-100 text-orange-800";
      case "completed": return "bg-green-100 text-green-800";
      case "pharmacy": return "bg-purple-100 text-purple-800";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const calculateTotalRevenue = () => {
    return waitingPatients
      .filter(p => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const handleProcessBilling = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = billingForm.consultationFee + billingForm.labTests + billingForm.medication + billingForm.procedures - billingForm.discount;
    
    setWaitingPatients(prev => 
      prev.map(patient => 
        patient.id === selectedPatient?.id 
          ? { 
              ...patient, 
              status: "pharmacy", 
              amount: totalAmount,
              journey: [
                ...patient.journey,
                { 
                  step: "Payment Completed", 
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  details: `Paid KSh ${totalAmount.toLocaleString()} via ${billingForm.paymentMethod}`
                }
              ]
            }
          : patient
      )
    );

    toast({
      title: "Payment Processed",
      description: `Successfully processed payment of KSh ${totalAmount.toLocaleString()}. Patient sent to pharmacy.`
    });

    setIsBillingDialogOpen(false);
  };

  const handleSendToPharmacy = (patientId: number) => {
    setWaitingPatients(prev => 
      prev.map(patient => 
        patient.id === patientId 
          ? { 
              ...patient, 
              status: "completed",
              journey: [
                ...patient.journey,
                { 
                  step: "Pharmacy", 
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  details: "Medication dispensed"
                }
              ]
            }
          : patient
      )
    );

    toast({
      title: "Patient Completed",
      description: "Patient has received medication from pharmacy"
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('afya-token');
    localStorage.removeItem('afya-user');
    navigate('/');
  };

  const totalAmount = billingForm.consultationFee + billingForm.labTests + billingForm.medication + billingForm.procedures - billingForm.discount;

  return (
    <HospitalLayout 
      title="Reception Dashboard" 
      subtitle="Manage patient flow, billing and payments"
      headerActions={
        <>
          <Dialog open={isBillingDialogOpen} onOpenChange={setIsBillingDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={waitingPatients.filter(p => p.status === "ready-for-billing").length === 0}>
                <CreditCard className="h-4 w-4 mr-2" />
                Process Billing
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Process Payment - {selectedPatient?.name}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleProcessBilling} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Consultation Fee</Label>
                    <Input
                      type="number"
                      value={billingForm.consultationFee}
                      onChange={(e) => setBillingForm(prev => ({ ...prev, consultationFee: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Lab Tests</Label>
                    <Input
                      type="number"
                      value={billingForm.labTests}
                      onChange={(e) => setBillingForm(prev => ({ ...prev, labTests: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Medication</Label>
                    <Input
                      type="number"
                      value={billingForm.medication}
                      onChange={(e) => setBillingForm(prev => ({ ...prev, medication: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Procedures</Label>
                    <Input
                      type="number"
                      value={billingForm.procedures}
                      onChange={(e) => setBillingForm(prev => ({ ...prev, procedures: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <Select value={billingForm.paymentMethod} onValueChange={(value) => setBillingForm(prev => ({ ...prev, paymentMethod: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map(method => (
                          <SelectItem key={method} value={method}>{method}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Discount</Label>
                    <Input
                      type="number"
                      value={billingForm.discount}
                      onChange={(e) => setBillingForm(prev => ({ ...prev, discount: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total Amount:</span>
                    <span className="text-xl text-primary">KSh {totalAmount.toLocaleString()}</span>
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Process Payment
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </>
      }
    >
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
                      <AvatarImage src="/avatars/receptionist.png" />
                      <AvatarFallback>R</AvatarFallback>
                    </Avatar>
                    <span>Receptionist</span>
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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card className="hover:shadow-hover transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Waiting Patients</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{waitingPatients.filter(p => p.status === "waiting").length}</div>
                <p className="text-xs text-muted-foreground mt-1">Average wait: 15 mins</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-hover transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ready for Billing</CardTitle>
                <Receipt className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{waitingPatients.filter(p => p.status === "ready-for-billing").length}</div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting payment</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-hover transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">At Pharmacy</CardTitle>
                <Pill className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{waitingPatients.filter(p => p.status === "pharmacy").length}</div>
                <p className="text-xs text-muted-foreground mt-1">Getting medication</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-hover transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">KSh {calculateTotalRevenue().toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {waitingPatients.filter(p => p.status === "completed").length} completed payments
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-hover transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{waitingPatients.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Today's total</p>
              </CardContent>
            </Card>
          </div>

          {/* Patient Queue */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Patient Queue</CardTitle>
                      <CardDescription>Current patients waiting for service</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {waitingPatients.map(patient => (
                      <div 
                        key={patient.id} 
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedPatient(patient);
                          setIsPatientDetailsOpen(true);
                        }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-medical rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">{patient.name.charAt(0)}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{patient.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {patient.appointment} • {patient.department}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Amount: KSh {patient.amount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusColor(patient.status)}>
                            {patient.status.replace(/-/g, " ")}
                          </Badge>
                          {patient.status === "ready-for-billing" && (
                            <Button 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPatient(patient);
                                setIsBillingDialogOpen(true);
                              }}
                            >
                              <CreditCard className="h-4 w-4 mr-1" />
                              Bill
                            </Button>
                          )}
                          {patient.status === "pharmacy" && (
                            <Button 
                              size="sm" 
                              variant="secondary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSendToPharmacy(patient.id);
                              }}
                            >
                              <Pill className="h-4 w-4 mr-1" />
                              Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <PatientFlowTracker 
                patientId={selectedPatient ? `P-2024-${selectedPatient.id.toString().padStart(3, '0')}` : "P-2024-000"} 
                currentStep={selectedPatient?.status === "pharmacy" ? "pharmacy" : selectedPatient?.status === "completed" ? "completed" : "doctor"} 
              />
              
              {selectedPatient && (
                <Dialog open={isPatientDetailsOpen} onOpenChange={setIsPatientDetailsOpen}>
                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Patient Journey - {selectedPatient.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold mb-2">Patient Information</h3>
                          <div className="space-y-2 text-sm">
                            <p><span className="text-muted-foreground">ID:</span> P-2024-{selectedPatient.id.toString().padStart(3, '0')}</p>
                            <p><span className="text-muted-foreground">Appointment:</span> {selectedPatient.appointment}</p>
                            <p><span className="text-muted-foreground">Department:</span> {selectedPatient.department}</p>
                            <p><span className="text-muted-foreground">Priority:</span> {selectedPatient.priority}</p>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Billing Information</h3>
                          <div className="space-y-2 text-sm">
                            <p><span className="text-muted-foreground">Status:</span> <Badge className={getStatusColor(selectedPatient.status)}>{selectedPatient.status.replace(/-/g, " ")}</Badge></p>
                            <p><span className="text-muted-foreground">Amount Due:</span> KSh {selectedPatient.amount.toLocaleString()}</p>
                            {selectedPatient.status === "completed" && (
                              <p className="text-green-600 font-medium">Payment completed</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-2">Patient Journey</h3>
                        <div className="space-y-4">
                          {selectedPatient.journey.map((step, index) => (
                            <div key={index} className="flex items-start">
                              <div className="flex flex-col items-center mr-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  index === selectedPatient.journey.length - 1 ? "bg-primary text-primary-foreground" : "bg-muted"
                                }`}>
                                  {step.step === "Registration" && <UserPlus className="h-4 w-4" />}
                                  {step.step === "Vitals Check" && <Activity className="h-4 w-4" />}
                                  {step.step === "Doctor Consultation" && <Stethoscope className="h-4 w-4" />}
                                  {step.step === "Lab Tests" && <ClipboardList className="h-4 w-4" />}
                                  {step.step === "Payment Completed" && <CreditCard className="h-4 w-4" />}
                                  {step.step === "Pharmacy" && <Pill className="h-4 w-4" />}
                                </div>
                                {index < selectedPatient.journey.length - 1 && (
                                  <div className="w-px h-6 bg-muted my-1"></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{step.step}</div>
                                <div className="text-sm text-muted-foreground">{step.timestamp}</div>
                                {step.details && (
                                  <div className="text-sm mt-1 p-2 bg-muted/50 rounded">{step.details}</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </div>
    </HospitalLayout>
  );
};

export default ReceptionDashboard;