import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar,
  Clock,
  Heart,
  Activity,
  FileText,
  User,
  Phone,
  Mail,
  ArrowLeft,
  Plus,
  Eye,
  CreditCard,
  Stethoscope
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  
  const [appointmentForm, setAppointmentForm] = useState({
    doctor: "",
    department: "",
    date: "",
    time: "",
    reason: "",
    type: "outpatient"
  });

  const departments = ["Cardiology", "Neurology", "Pediatrics", "Orthopedics", "Emergency", "Radiology", "Lab"];
  
  const availableDoctors = [
    { id: 1, name: "Dr. Sarah Johnson", specialization: "Cardiology", department: "Cardiology" },
    { id: 2, name: "Dr. Michael Chen", specialization: "Neurology", department: "Neurology" },
    { id: 3, name: "Dr. Emily Brown", specialization: "Pediatrics", department: "Pediatrics" },
    { id: 4, name: "Dr. James Wilson", specialization: "Orthopedics", department: "Orthopedics" }
  ];

  const [appointments, setAppointments] = useState([
    { 
      id: 1, 
      doctor: "Dr. Sarah Johnson", 
      department: "Cardiology", 
      date: "2024-01-20", 
      time: "10:00 AM",
      status: "Scheduled",
      reason: "Regular checkup"
    },
    { 
      id: 2, 
      doctor: "Dr. Michael Chen", 
      department: "Neurology", 
      date: "2024-01-15", 
      time: "2:00 PM",
      status: "Completed",
      reason: "Headache consultation"
    }
  ]);

  const medicalRecords = [
    {
      id: 1,
      date: "2024-01-15",
      doctor: "Dr. Michael Chen",
      type: "Diagnosis",
      description: "Tension headache - prescribed medication",
      prescription: "Ibuprofen 400mg, twice daily"
    },
    {
      id: 2,
      date: "2024-01-10",
      doctor: "Dr. Sarah Johnson",
      type: "Lab Result",
      description: "Blood work results - all normal",
      details: "Cholesterol: 180mg/dL, Blood Sugar: 95mg/dL"
    }
  ];

  const billingInfo = [
    {
      id: 1,
      date: "2024-01-15",
      service: "Consultation - Neurology",
      amount: 2500,
      status: "Paid",
      paymentMethod: "Card"
    },
    {
      id: 2,
      date: "2024-01-10",
      service: "Lab Tests - Blood Work",
      amount: 1800,
      status: "Paid",
      paymentMethod: "MPESA"
    }
  ];


  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const selectedDoctor = availableDoctors.find(doc => doc.id.toString() === appointmentForm.doctor);
      const newAppointment = {
        id: Date.now(),
        doctor: selectedDoctor?.name || "",
        department: appointmentForm.department,
        date: appointmentForm.date,
        time: appointmentForm.time,
        status: "Scheduled",
        reason: appointmentForm.reason
      };

      setAppointments(prev => [newAppointment, ...prev]);
      
      toast({
        title: "Appointment Booked",
        description: `Your appointment with ${selectedDoctor?.name} has been scheduled`
      });

      setIsBookingDialogOpen(false);
      setAppointmentForm({
        doctor: "",
        department: "",
        date: "",
        time: "",
        reason: "",
        type: "outpatient"
      });
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Unable to book appointment. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
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
          <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Book Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Book New Appointment</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleBookAppointment} className="space-y-4">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select value={appointmentForm.department} onValueChange={(value) => setAppointmentForm(prev => ({ ...prev, department: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Doctor</Label>
                  <Select 
                    value={appointmentForm.doctor} 
                    onValueChange={(value) => setAppointmentForm(prev => ({ ...prev, doctor: value }))}
                    disabled={!appointmentForm.department}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDoctors
                        .filter(doc => !appointmentForm.department || doc.department === appointmentForm.department)
                        .map(doctor => (
                          <SelectItem key={doctor.id} value={doctor.id.toString()}>
                            {doctor.name} - {doctor.specialization}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={appointmentForm.date}
                      onChange={(e) => setAppointmentForm(prev => ({ ...prev, date: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Select value={appointmentForm.time} onValueChange={(value) => setAppointmentForm(prev => ({ ...prev, time: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"].map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={appointmentForm.type} onValueChange={(value) => setAppointmentForm(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="outpatient">Outpatient</SelectItem>
                      <SelectItem value="inpatient">Inpatient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Reason for Visit</Label>
                  <Textarea
                    placeholder="Describe your symptoms or reason for visit"
                    value={appointmentForm.reason}
                    onChange={(e) => setAppointmentForm(prev => ({ ...prev, reason: e.target.value }))}
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Book Appointment
                </Button>
              </form>
            </DialogContent>
          </Dialog>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Patient Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, John Doe</p>
            </div>
          </div>
          <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Book Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Book New Appointment</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleBookAppointment} className="space-y-4">
                <Button type="submit" className="w-full">
                  Book Appointment
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Jan 20</div>
              <p className="text-xs text-muted-foreground">Dr. Sarah Johnson</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Health Score</CardTitle>
              <Heart className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">Good health</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Current medications</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding Bills</CardTitle>
              <CreditCard className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KSh 0</div>
              <p className="text-xs text-muted-foreground">All paid up</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="records">Medical Records</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>Your next scheduled visits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appointments.filter(apt => apt.status === 'Scheduled').slice(0, 2).map(appointment => (
                      <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{appointment.doctor}</h3>
                          <p className="text-sm text-muted-foreground">{appointment.department}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{appointment.date}</p>
                          <p className="text-sm text-muted-foreground">{appointment.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest medical interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {medicalRecords.slice(0, 2).map(record => (
                      <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{record.type}</h3>
                          <p className="text-sm text-muted-foreground">{record.doctor}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{record.date}</p>
                          <Badge variant="secondary">New</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  My Appointments
                </CardTitle>
                <CardDescription>Your scheduled and past medical appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map(appointment => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Stethoscope className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{appointment.doctor}</h3>
                          <p className="text-sm text-muted-foreground">
                            {appointment.department} • {appointment.date} • {appointment.time}
                          </p>
                          <p className="text-xs text-muted-foreground">{appointment.reason}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={appointment.status === 'Completed' ? 'outline' : 'secondary'}>
                          {appointment.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="records" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Medical Records
                </CardTitle>
                <CardDescription>Your health history, diagnoses, and test results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medicalRecords.map(record => (
                    <div key={record.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{record.type}</h3>
                        <span className="text-sm text-muted-foreground">{record.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Dr. {record.doctor}</p>
                      <p className="text-sm mb-2">{record.description}</p>
                      {record.prescription && (
                        <div className="bg-accent/10 p-2 rounded text-sm">
                          <span className="font-medium">Prescription:</span> {record.prescription}
                        </div>
                      )}
                      {record.details && (
                        <div className="bg-primary/10 p-2 rounded text-sm">
                          <span className="font-medium">Details:</span> {record.details}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Billing & Payments
                </CardTitle>
                <CardDescription>Your payment history and invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {billingInfo.map(bill => (
                    <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{bill.service}</h3>
                        <p className="text-sm text-muted-foreground">{bill.date}</p>
                        <p className="text-sm text-muted-foreground">Payment: {bill.paymentMethod}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">KSh {bill.amount.toLocaleString()}</div>
                        <Badge variant={bill.status === 'Paid' ? 'default' : 'destructive'}>
                          {bill.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Your account details and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Full Name</Label>
                      <Input value="John Doe" readOnly />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <Input value="john.doe@email.com" readOnly />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Phone</Label>
                      <Input value="+254 700 123 456" readOnly />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Date of Birth</Label>
                      <Input value="January 15, 1990" readOnly />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Blood Type</Label>
                      <Input value="O+" readOnly />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Emergency Contact</Label>
                      <Input value="Jane Doe - +254 700 123 457" readOnly />
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Button>Edit Profile</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientDashboard;