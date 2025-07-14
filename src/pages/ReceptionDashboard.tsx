import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Users, UserPlus, Clock, CheckCircle, Search, Filter, CreditCard, Receipt, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
};

const ReceptionDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [isBillingDialogOpen, setIsBillingDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [waitingPatients, setWaitingPatients] = useState([
    { id: 1, name: "John Doe", appointment: "10:00 AM", status: "waiting", priority: "normal", department: "Cardiology", amount: 2500 },
    { id: 2, name: "Jane Smith", appointment: "10:30 AM", status: "ready-for-billing", priority: "urgent", department: "Neurology", amount: 3200 },
    { id: 3, name: "Mike Johnson", appointment: "11:00 AM", status: "waiting", priority: "normal", department: "Orthopedics", amount: 1800 }
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
      case "completed": return "bg-accent text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const handleProcessBilling = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = billingForm.consultationFee + billingForm.labTests + billingForm.medication + billingForm.procedures - billingForm.discount;
    
    setWaitingPatients(prev => 
      prev.map(patient => 
        patient.id === selectedPatient?.id 
          ? { ...patient, status: "completed", amount: totalAmount }
          : patient
      )
    );

    toast({
      title: "Payment Processed",
      description: `Successfully processed payment of KSh ${totalAmount.toLocaleString()}`
    });

    setIsBillingDialogOpen(false);
  };

  const totalAmount = billingForm.consultationFee + billingForm.labTests + billingForm.medication + billingForm.procedures - billingForm.discount;

  return (
    <HospitalLayout 
      title="Reception Dashboard" 
      subtitle="Manage patient flow, billing and payments"
      headerActions={
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
              </div>
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
      }
    >
      <div className="space-y-6">
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
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{waitingPatients.filter(p => p.status === "completed").length}</div>
              <p className="text-xs text-muted-foreground mt-1">Discharged patients</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-hover transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">KSh {waitingPatients.filter(p => p.status === "completed").reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Processed payments</p>
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
                <CardTitle>Patient Queue</CardTitle>
                <CardDescription>Current patients waiting for service</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {waitingPatients.map(patient => (
                    <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
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
                            Est. Amount: KSh {patient.amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(patient.status)}>
                          {patient.status.replace("-", " ")}
                        </Badge>
                        {patient.status === "ready-for-billing" && (
                          <Button size="sm" onClick={() => {
                            setSelectedPatient(patient);
                            setIsBillingDialogOpen(true);
                          }}>
                            <CreditCard className="h-4 w-4 mr-1" />
                            Bill
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <PatientFlowTracker patientId="P-2024-001" currentStep="doctor" />
          </div>
        </div>
      </div>
    </HospitalLayout>
  );
};

export default ReceptionDashboard;