import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, CreditCard, FileText, Calculator, TrendingUp, AlertCircle, Plus, Trash2, Edit, Printer, Download, User, Clock } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { FlowPatient, patientFlowApi } from "@/services/patientFlow";

// Types
type BillingItem = {
  id: number;
  service: string;
  amount: number;
  category: string;
  editable: boolean;
};

type Payment = {
  id: number;
  patientId: string;
  patientName: string;
  amount: number;
  method: string;
  time: string;
  date: string;
  status: string;
};

type InsuranceClaim = {
  id: number;
  patientId: string;
  patientName: string;
  provider: string;
  amount: number;
  status: string;
  date: string;
};

type Patient = {
  id: string;
  name: string;
  phone: string;
  email: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
};

const BillingDashboard = () => {
  // State for patients data
  const [patients, setPatients] = useState<Patient[]>([
    { id: "P1001", name: "John Smith", phone: "0712345678", email: "john@example.com", insuranceProvider: "NHIF", insuranceNumber: "NHIF-1001" },
    { id: "P1002", name: "Maria Garcia", phone: "0723456789", email: "maria@example.com", insuranceProvider: "AAR", insuranceNumber: "AAR-2002" },
    { id: "P1003", name: "David Wilson", phone: "0734567890", email: "david@example.com" },
    { id: "P1004", name: "Alice Johnson", phone: "0745678901", email: "alice@example.com", insuranceProvider: "Jubilee", insuranceNumber: "JUB-3003" },
  ]);

  // State for summary cards (auto-calculated)
  const [dashboardData, setDashboardData] = useState({
    todayRevenue: 0,
    pendingPayments: 0,
    insuranceClaims: 0,
    monthlyTarget: { current: 0, target: 4000000 }, // 4M KES target
  });

  // State for invoicing tab
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [billingItems, setBillingItems] = useState<BillingItem[]>([
    { id: 1, service: "Doctor Consultation", amount: 15000, category: "Medical Services", editable: false },
    { id: 2, service: "Lab Tests (CBC, Lipid Panel)", amount: 12000, category: "Laboratory", editable: false },
    { id: 3, service: "Chest X-Ray", amount: 8000, category: "Radiology", editable: false },
    { id: 4, service: "Medications", amount: 4500, category: "Pharmacy", editable: false },
  ]);
  const [newBillingItem, setNewBillingItem] = useState({ service: "", amount: "", category: "" });
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");

  // State for payments tab
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentPatientId, setPaymentPatientId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [patientPayments, setPatientPayments] = useState<Record<string, Payment[]>>({});

  // State for insurance tab
  const [insuranceClaims, setInsuranceClaims] = useState<InsuranceClaim[]>([]);

  // State for reports tab
  const [revenueData, setRevenueData] = useState({
    today: 0,
    week: 0,
    month: 0,
    outstanding: 0,
  });

  const [departmentRevenue, setDepartmentRevenue] = useState([
    { department: "Emergency", revenue: 0, percentage: 0 },
    { department: "Surgery", revenue: 0, percentage: 0 },
    { department: "Radiology", revenue: 0, percentage: 0 },
    { department: "Laboratory", revenue: 0, percentage: 0 },
    { department: "Pharmacy", revenue: 0, percentage: 0 },
  ]);

  const [flowPatients, setFlowPatients] = useState<FlowPatient[]>([]);

  useEffect(() => {
    const sync = () => setFlowPatients(patientFlowApi.getAll());
    sync();
    const unsubscribe = patientFlowApi.subscribe(sync);
    return unsubscribe;
  }, []);

  // Format currency in KES
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
  };

  // Generate random invoice number
  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `INV-${year}${month}${day}-${random}`;
  };

  // Calculate total amount for billing items
  const calculateTotal = () => {
    return billingItems.reduce((sum, item) => sum + item.amount, 0);
  };

  // Add new billing item
  const addBillingItem = () => {
    if (newBillingItem.service && newBillingItem.amount && newBillingItem.category) {
      const newItem = {
        id: Date.now(),
        service: newBillingItem.service,
        amount: Number(newBillingItem.amount),
        category: newBillingItem.category,
        editable: false
      };
      setBillingItems([...billingItems, newItem]);
      setNewBillingItem({ service: "", amount: "", category: "" });
    }
  };

  // Remove billing item
  const removeBillingItem = (id: number) => {
    setBillingItems(billingItems.filter(item => item.id !== id));
  };

  // Toggle edit mode for billing item
  const toggleEditBillingItem = (id: number) => {
    setBillingItems(billingItems.map(item => 
      item.id === id ? { ...item, editable: !item.editable } : item
    ));
  };

  // Update billing item
  const updateBillingItem = (id: number, field: string, value: string | number) => {
    setBillingItems(billingItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // Process payment
  const processPayment = () => {
    if (paymentAmount && paymentPatientId) {
      const patient = patients.find(p => p.id === paymentPatientId);
      const currentDate = new Date();
      
      const newPayment: Payment = {
        id: Date.now(),
        patientId: paymentPatientId,
        patientName: patient?.name || `Patient ${paymentPatientId}`,
        amount: Number(paymentAmount),
        method: paymentMethod,
        time: currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: currentDate.toLocaleDateString(),
        status: "Completed"
      };

      // Add to recent payments
      setRecentPayments([newPayment, ...recentPayments]);

      // Add to patient's payment history
      setPatientPayments(prev => ({
        ...prev,
        [paymentPatientId]: [...(prev[paymentPatientId] || []), newPayment]
      }));

      // Reset form
      setPaymentAmount("");
      setPaymentPatientId("");

      // Update dashboard data
      updateDashboardData(newPayment.amount);
    }
  };

  // Generate invoice
  const generateInvoice = () => {
    if (selectedPatient && billingItems.length > 0) {
      setInvoiceGenerated(true);
      setInvoiceNumber(generateInvoiceNumber());
      
      // Add invoice amount to pending payments (until paid)
      const totalAmount = calculateTotal();
      setRevenueData(prev => ({
        ...prev,
        outstanding: prev.outstanding + totalAmount
      }));
    }
  };

  // Update dashboard data when payments are made
  const updateDashboardData = (amount: number) => {
    const today = new Date().toLocaleDateString();
    
    setDashboardData(prev => ({
      ...prev,
      todayRevenue: prev.todayRevenue + amount,
      monthlyTarget: {
        ...prev.monthlyTarget,
        current: prev.monthlyTarget.current + amount
      }
    }));

    setRevenueData(prev => ({
      today: prev.today + amount,
      week: prev.week + amount,
      month: prev.month + amount,
      outstanding: prev.outstanding > amount ? prev.outstanding - amount : 0
    }));

    // Update department revenue (simplified example)
    updateDepartmentRevenue(amount);
  };

  // Update department revenue (simplified distribution)
  const updateDepartmentRevenue = (amount: number) => {
    const departments = ["Emergency", "Surgery", "Radiology", "Laboratory", "Pharmacy"];
    const randomDept = departments[Math.floor(Math.random() * departments.length)];
    
    setDepartmentRevenue(prev =>
      prev.map(dept =>
        dept.department === randomDept
          ? {
              ...dept,
              revenue: dept.revenue + amount,
              percentage: Math.round(((dept.revenue + amount) / dashboardData.monthlyTarget.target) * 100)
            }
          : dept
      )
    );
  };

  // Calculate percentage for monthly target
  const calculateTargetPercentage = () => {
    return Math.round((dashboardData.monthlyTarget.current / dashboardData.monthlyTarget.target) * 100);
  };

  // Load sample data on first render
  useEffect(() => {
    // Load sample payments
    const samplePayments: Payment[] = [
      {
        id: 1,
        patientId: "P1001",
        patientName: "John Smith",
        amount: 24500,
        method: "Card",
        time: "10:30 AM",
        date: new Date().toLocaleDateString(),
        status: "Completed"
      },
      {
        id: 2,
        patientId: "P1002",
        patientName: "Maria Garcia",
        amount: 18000,
        method: "Insurance",
        time: "10:15 AM",
        date: new Date().toLocaleDateString(),
        status: "Pending"
      },
      {
        id: 3,
        patientId: "P1003",
        patientName: "David Wilson",
        amount: 9500,
        method: "Cash",
        time: "10:00 AM",
        date: new Date().toLocaleDateString(),
        status: "Completed"
      }
    ];

    setRecentPayments(samplePayments);
    
    // Initialize patient payments
    const initialPatientPayments: Record<string, Payment[]> = {};
    samplePayments.forEach(payment => {
      if (!initialPatientPayments[payment.patientId]) {
        initialPatientPayments[payment.patientId] = [];
      }
      initialPatientPayments[payment.patientId].push(payment);
    });
    setPatientPayments(initialPatientPayments);

    // Load sample insurance claims
    const sampleClaims: InsuranceClaim[] = [
      {
        id: 1,
        patientId: "P1001",
        patientName: "John Smith",
        provider: "NHIF",
        amount: 85000,
        status: "Approved",
        date: "Today"
      },
      {
        id: 2,
        patientId: "P1002",
        patientName: "Maria Garcia",
        provider: "AAR",
        amount: 42000,
        status: "Pending",
        date: "Yesterday"
      },
      {
        id: 3,
        patientId: "P1004",
        patientName: "Alice Johnson",
        provider: "Jubilee",
        amount: 29000,
        status: "Under Review",
        date: "2 days ago"
      }
    ];
    setInsuranceClaims(sampleClaims);

    // Calculate initial dashboard data
    const initialTodayRevenue = samplePayments
      .filter(p => p.status === "Completed")
      .reduce((sum, p) => sum + p.amount, 0);
    
    const initialPendingPayments = samplePayments
      .filter(p => p.status === "Pending")
      .reduce((sum, p) => sum + p.amount, 0);

    setDashboardData({
      todayRevenue: initialTodayRevenue,
      pendingPayments: initialPendingPayments,
      insuranceClaims: sampleClaims.length,
      monthlyTarget: {
        current: initialTodayRevenue,
        target: 4000000
      }
    });

    setRevenueData({
      today: initialTodayRevenue,
      week: initialTodayRevenue * 3, // Sample data
      month: initialTodayRevenue * 12, // Sample data
      outstanding: initialPendingPayments
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Billing & Accounts</h1>
          <Badge variant="outline" className="text-sm">Finance Department</Badge>
        </div>

        {/* Dashboard Summary Cards (Auto-calculated) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(dashboardData.todayRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.todayRevenue > 0 ? "+" : ""}
                {Math.round((dashboardData.todayRevenue / (dashboardData.monthlyTarget.target / 30)) * 100)}% of daily target
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(dashboardData.pendingPayments)}</div>
              <p className="text-xs text-muted-foreground">
                {recentPayments.filter(p => p.status === "Pending").length} outstanding payments
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Insurance Claims</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insuranceClaims.length}</div>
              <p className="text-xs text-muted-foreground">
                {insuranceClaims.filter(c => c.status === "Approved").length} approved today
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Target</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculateTargetPercentage()}%</div>
              <div className="flex justify-between text-sm">
                <span>{formatCurrency(dashboardData.monthlyTarget.current)}</span>
                <span>/</span>
                <span>{formatCurrency(dashboardData.monthlyTarget.target)}</span>
              </div>
              <Progress value={calculateTargetPercentage()} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </div>


        <Card className="bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Linked Patient Payment Queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {flowPatients.filter((p) => p.currentStage === "billing").map((patient) => (
              <div key={patient.id} className="rounded-md border p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">{patient.name}</p>
                  <p className="text-xs text-muted-foreground">Ready for billing after consultation/tests</p>
                </div>
                <Button size="sm" onClick={() => patientFlowApi.moveStage(patient.id, "pharmacy", "Payment completed and sent to pharmacy")}>Mark Paid & Send Pharmacy</Button>
              </div>
            ))}
            {flowPatients.filter((p) => p.currentStage === "billing").length === 0 && <p className="text-sm text-muted-foreground">No linked patients awaiting payment.</p>}
          </CardContent>
        </Card>

        <Tabs defaultValue="invoicing" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="invoicing">Invoicing</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="insurance">Insurance</TabsTrigger>
            <TabsTrigger value="reports">Financial Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="invoicing" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Generate Patient Invoice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Patient</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={selectedPatient?.id || ""}
                      onChange={(e) => {
                        const patient = patients.find(p => p.id === e.target.value);
                        setSelectedPatient(patient || null);
                      }}
                    >
                      <option value="">Select patient</option>
                      {patients.map(patient => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name} ({patient.id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Input type="date" />
                  </div>
                  <Button onClick={() => setBillingItems([])}>
                    <Calculator className="h-4 w-4 mr-2" />
                    New Bill
                  </Button>
                </div>
                
                {selectedPatient && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Current Billing Items</h4>
                    
                    {/* Add new billing item form */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <Input 
                        placeholder="Service" 
                        value={newBillingItem.service}
                        onChange={(e) => setNewBillingItem({...newBillingItem, service: e.target.value})}
                      />
                      <Input 
                        placeholder="Amount (KES)" 
                        type="number"
                        value={newBillingItem.amount}
                        onChange={(e) => setNewBillingItem({...newBillingItem, amount: e.target.value})}
                      />
                      <Input 
                        placeholder="Category" 
                        value={newBillingItem.category}
                        onChange={(e) => setNewBillingItem({...newBillingItem, category: e.target.value})}
                      />
                      <Button onClick={addBillingItem}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    </div>
                    
                    {/* Billing items list */}
                    {billingItems.length > 0 ? (
                      <>
                        {billingItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex-1">
                              {item.editable ? (
                                <Input 
                                  value={item.service} 
                                  onChange={(e) => updateBillingItem(item.id, 'service', e.target.value)}
                                  className="mb-1"
                                />
                              ) : (
                                <div className="font-medium">{item.service}</div>
                              )}
                              {item.editable ? (
                                <Input 
                                  value={item.category} 
                                  onChange={(e) => updateBillingItem(item.id, 'category', e.target.value)}
                                />
                              ) : (
                                <div className="text-sm text-muted-foreground">{item.category}</div>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              {item.editable ? (
                                <Input 
                                  type="number"
                                  value={item.amount} 
                                  onChange={(e) => updateBillingItem(item.id, 'amount', Number(e.target.value))}
                                  className="w-24"
                                />
                              ) : (
                                <div className="font-bold text-right w-24">{formatCurrency(item.amount)}</div>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => toggleEditBillingItem(item.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeBillingItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        
                        <div className="border-t pt-3">
                          <div className="flex items-center justify-between text-lg font-bold">
                            <span>Total Amount:</span>
                            <span>{formatCurrency(calculateTotal())}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button className="flex-1" onClick={generateInvoice}>
                            <FileText className="h-4 w-4 mr-2" />
                            Generate Invoice
                          </Button>
                          <Button variant="outline" className="flex-1">
                            Save Draft
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No billing items added yet
                      </div>
                    )}
                  </div>
                )}
                
                {/* Generated Invoice Preview */}
                {invoiceGenerated && selectedPatient && billingItems.length > 0 && (
                  <Card className="mt-6">
                    <CardHeader className="flex flex-row justify-between items-center">
                      <div>
                        <CardTitle>Invoice #{invoiceNumber}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Generated on {new Date().toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Printer className="h-4 w-4 mr-2" />
                          Print
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="font-medium mb-2">Billed To:</h4>
                          <p className="font-medium">{selectedPatient.name}</p>
                          <p className="text-sm">ID: {selectedPatient.id}</p>
                          <p className="text-sm">{selectedPatient.phone}</p>
                          <p className="text-sm">{selectedPatient.email}</p>
                          {selectedPatient.insuranceProvider && (
                            <div className="mt-2">
                              <p className="text-sm font-medium">Insurance:</p>
                              <p className="text-sm">{selectedPatient.insuranceProvider}</p>
                              <p className="text-sm">No: {selectedPatient.insuranceNumber}</p>
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Payment Details:</h4>
                          <div className="flex justify-between py-2 border-b">
                            <span>Invoice Total:</span>
                            <span className="font-medium">{formatCurrency(calculateTotal())}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span>Status:</span>
                            <Badge variant="secondary">Unpaid</Badge>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span>Due Date:</span>
                            <span>{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Service</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Amount (KES)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {billingItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.service}</TableCell>
                              <TableCell>{item.category}</TableCell>
                              <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="font-bold">
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell className="text-right">{formatCurrency(calculateTotal())}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Payment Processing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant={paymentMethod === "Card" ? "default" : "outline"} 
                      className="h-20 flex-col"
                      onClick={() => setPaymentMethod("Card")}
                    >
                      <CreditCard className="h-6 w-6 mb-2" />
                      Card Payment
                    </Button>
                    <Button 
                      variant={paymentMethod === "Cash" ? "default" : "outline"} 
                      className="h-20 flex-col"
                      onClick={() => setPaymentMethod("Cash")}
                    >
                      <DollarSign className="h-6 w-6 mb-2" />
                      Cash Payment
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Input 
                      placeholder="Payment Amount (KES)" 
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                    />
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={paymentPatientId}
                      onChange={(e) => setPaymentPatientId(e.target.value)}
                    >
                      <option value="">Select patient</option>
                      {patients.map(patient => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name} ({patient.id})
                        </option>
                      ))}
                    </select>
                    <Button className="w-full" onClick={processPayment}>
                      Process Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Recent Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentPayments.length > 0 ? (
                      recentPayments.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div>
                            <div className="font-medium">{payment.patientName}</div>
                            <div className="text-sm text-muted-foreground">
                              {payment.method} • {payment.date} {payment.time}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{formatCurrency(payment.amount)}</div>
                            <Badge variant={payment.status === "Completed" ? "default" : "secondary"}>
                              {payment.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No recent payments found
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Patient Payment Progress */}
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Patient Payment Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    onChange={(e) => {
                      const patient = patients.find(p => p.id === e.target.value);
                      setSelectedPatient(patient || null);
                    }}
                  >
                    <option value="">Select patient to view payment history</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} ({patient.id})
                      </option>
                    ))}
                  </select>

                  {selectedPatient && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <h4 className="font-medium">{selectedPatient.name}</h4>
                          <p className="text-sm text-muted-foreground">ID: {selectedPatient.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">Total Paid:</p>
                          <p className="font-bold">
                            {formatCurrency(
                              (patientPayments[selectedPatient.id] || [])
                                .filter(p => p.status === "Completed")
                                .reduce((sum, p) => sum + p.amount, 0)
                            )}
                          </p>
                        </div>
                      </div>

                      {patientPayments[selectedPatient.id] ? (
                        <div className="space-y-2">
                          <h4 className="font-medium">Payment History</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {patientPayments[selectedPatient.id].map((payment) => (
                                <TableRow key={payment.id}>
                                  <TableCell>
                                    <div className="flex items-center">
                                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                      {payment.date} {payment.time}
                                    </div>
                                  </TableCell>
                                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                                  <TableCell>{payment.method}</TableCell>
                                  <TableCell>
                                    <Badge variant={payment.status === "Completed" ? "default" : "secondary"}>
                                      {payment.status}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No payment history found for this patient
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insurance" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Insurance Claims Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-green-500/10 border border-green-500/20">
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {insuranceClaims.filter(c => c.status === "Approved").length}
                          </div>
                          <div className="text-sm text-muted-foreground">Approved Claims</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-yellow-500/10 border border-yellow-500/20">
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">
                            {insuranceClaims.filter(c => c.status === "Pending" || c.status === "Under Review").length}
                          </div>
                          <div className="text-sm text-muted-foreground">Pending Review</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-red-500/10 border border-red-500/20">
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {insuranceClaims.filter(c => c.status === "Rejected").length}
                          </div>
                          <div className="text-sm text-muted-foreground">Rejected Claims</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    {insuranceClaims.length > 0 ? (
                      insuranceClaims.map((claim) => (
                        <div key={claim.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                          <div>
                            <div className="font-medium">{claim.patientName}</div>
                            <div className="text-sm text-muted-foreground">
                              {claim.provider} • {claim.date}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="font-bold">{formatCurrency(claim.amount)}</div>
                            </div>
                            <Badge variant={claim.status === "Approved" ? "default" : 
                                           claim.status === "Pending" || claim.status === "Under Review" ? "secondary" : "destructive"}>
                              {claim.status}
                            </Badge>
                            <Button size="sm" variant="outline">View</Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No insurance claims found
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Revenue Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Today's Revenue:</span>
                      <span className="font-bold">{formatCurrency(revenueData.today)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>This Week:</span>
                      <span className="font-bold">{formatCurrency(revenueData.week)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>This Month:</span>
                      <span className="font-bold">{formatCurrency(revenueData.month)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Outstanding:</span>
                      <span className="font-bold text-yellow-600">{formatCurrency(revenueData.outstanding)}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Financial Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Department Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {departmentRevenue.map((dept, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{dept.department}</span>
                          <span className="text-sm font-bold">{formatCurrency(dept.revenue)}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all" 
                            style={{ width: `${dept.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions Table */}
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount (KES)</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentPayments.length > 0 ? (
                      recentPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                              {payment.date}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-muted-foreground" />
                              {payment.patientName}
                            </div>
                          </TableCell>
                          <TableCell>{payment.method}</TableCell>
                          <TableCell className="text-right">{formatCurrency(payment.amount)}</TableCell>
                          <TableCell>
                            <Badge variant={payment.status === "Completed" ? "default" : "secondary"}>
                              {payment.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No recent transactions found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BillingDashboard;