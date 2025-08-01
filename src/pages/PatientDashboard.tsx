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
import {
  Calendar,
  Heart,
  Activity,
  FileText,
  User,
  ArrowLeft,
  Plus,
  Eye,
  CreditCard,
  Stethoscope,
  Edit,
  Save,
  X,
  MapPin,
  Users,
  Phone,
  Mail,
  Home,
  Briefcase,
  Shield
} from "lucide-react";

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  // Patient Profile State
  const [patientProfile, setPatientProfile] = useState({
    fullName: "John Doe",
    email: "john.doe@email.com",
    phone: "+254 700 123 456",
    dateOfBirth: "1990-01-15",
    bloodType: "O+",
    gender: "Male",
    nationalId: "12345678",
    address: {
      street: "123 Main Street",
      city: "Nairobi",
      county: "Nairobi County",
      postalCode: "00100"
    },
    emergencyContact: {
      name: "Jane Doe",
      relationship: "Wife",
      phone: "+254 700 123 457",
      email: "jane.doe@email.com"
    },
    nextOfKin: {
      name: "Robert Doe",
      relationship: "Father",
      phone: "+254 700 123 458",
      address: "456 Oak Avenue, Nairobi"
    },
    occupation: "Software Engineer",
    employer: "Tech Solutions Ltd",
    insurance: {
      provider: "AAR Insurance",
      policyNumber: "AAR123456789",
      validUntil: "2024-12-31"
    },
    allergies: ["Penicillin", "Shellfish"],
    chronicConditions: ["Hypertension"],
    height: "175 cm",
    weight: "70 kg"
  });

  const [tempProfile, setTempProfile] = useState(patientProfile);

  const [appointmentForm, setAppointmentForm] = useState({
    doctor: "",
    department: "",
    date: "",
    time: "",
    reason: "",
    type: "outpatient",
  });

  const departments = ["Cardiology", "Neurology", "Pediatrics", "Orthopedics", "Oncology", "Gastroenterology", "Emergency", "Radiology", "Lab"];
  
  const availableDoctors = [
    { id: 1, name: "Dr. Sarah Johnson", specialization: "Cardiology", department: "Cardiology" },
    { id: 2, name: "Dr. Michael Chen", specialization: "Neurology", department: "Neurology" },
    { id: 3, name: "Dr. Emily Brown", specialization: "Pediatrics", department: "Pediatrics" },
    { id: 4, name: "Dr. James Wilson", specialization: "Orthopedics", department: "Orthopedics" },
    { id: 5, name: "Dr. Lisa Wong", specialization: "Oncology", department: "Oncology" },
    { id: 6, name: "Dr. David Kim", specialization: "Gastroenterology", department: "Gastroenterology" },
  ];

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      department: "Cardiology",
      date: "2024-01-20",
      time: "10:00 AM",
      status: "Scheduled",
      reason: "Regular checkup",
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      department: "Neurology",
      date: "2024-01-15",
      time: "2:00 PM",
      status: "Completed",
      reason: "Headache consultation",
    },
  ]);

  const [medicalRecords, setMedicalRecords] = useState([
    {
      id: 1,
      date: "2024-01-15",
      doctor: "Dr. Michael Chen",
      type: "Diagnosis",
      description: "Tension headache - prescribed medication",
      prescription: "Ibuprofen 400mg, twice daily",
    },
    {
      id: 2,
      date: "2024-01-10",
      doctor: "Dr. Sarah Johnson",
      type: "Lab Result",
      description: "Blood work results - all normal",
      details: "Cholesterol: 180mg/dL, Blood Sugar: 95mg/dL",
    },
  ]);

  const billingInfo = [
    {
      id: 1,
      date: "2024-01-15",
      service: "Consultation - Neurology",
      amount: 2500,
      status: "Paid",
      paymentMethod: "Card",
    },
    {
      id: 2,
      date: "2024-01-10",
      service: "Lab Tests - Blood Work",
      amount: 1800,
      status: "Paid",
      paymentMethod: "MPESA",
    },
  ];

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    
    const appointmentDate = new Date(appointmentForm.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
    
    // Check if appointment date is in the past
    if (appointmentDate < today) {
      alert("Cannot book appointments for past dates. Please select a future date.");
      return;
    }
    
    const hasAppointmentOnDate = appointments.some(
      (apt) => apt.date === appointmentForm.date && apt.status !== "Cancelled"
    );

    if (hasAppointmentOnDate) {
      alert("You already have an appointment scheduled for this date. Please choose another date.");
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    const selectedDoctor = availableDoctors.find((doc) => doc.id.toString() === appointmentForm.doctor);
    const newAppointment = {
      id: Date.now(),
      doctor: selectedDoctor?.name || "",
      department: appointmentForm.department,
      date: appointmentForm.date,
      time: appointmentForm.time,
      status: "Scheduled",
      reason: appointmentForm.reason,
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    setIsBookingDialogOpen(false);
    setAppointmentForm({
      doctor: "",
      department: "",
      date: "",
      time: "",
      reason: "",
      type: "outpatient",
    });
  };

  const handleSaveProfile = () => {
    setPatientProfile(tempProfile);
    setEditingProfile(false);
  };

  const handleCancelProfileEdit = () => {
    setTempProfile(patientProfile);
    setEditingProfile(false);
  };

  const handleEditAppointment = (appointment) => {
    setEditingAppointment({ ...appointment });
  };

  const handleSaveAppointment = () => {
    const appointmentDate = new Date(editingAppointment.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
    
    // Check if appointment date is in the past
    if (appointmentDate < today) {
      alert("Cannot schedule appointments for past dates. Please select a future date.");
      return;
    }
    
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === editingAppointment.id ? editingAppointment : apt
      )
    );
    setEditingAppointment(null);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Patient Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {patientProfile.fullName}</p>
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
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select
                    value={appointmentForm.department}
                    onValueChange={(value) => setAppointmentForm((prev) => ({ ...prev, department: value, doctor: "" }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Doctor</Label>
                  <Select
                    value={appointmentForm.doctor}
                    onValueChange={(value) => setAppointmentForm((prev) => ({ ...prev, doctor: value }))}
                    disabled={!appointmentForm.department}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDoctors
                        .filter((doc) => doc.department === appointmentForm.department)
                        .map((doctor) => (
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
                      onChange={(e) => setAppointmentForm((prev) => ({ ...prev, date: e.target.value }))}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Select
                      value={appointmentForm.time}
                      onValueChange={(value) => setAppointmentForm((prev) => ({ ...prev, time: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"].map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={appointmentForm.type}
                    onValueChange={(value) => setAppointmentForm((prev) => ({ ...prev, type: value }))}
                  >
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
                    onChange={(e) => setAppointmentForm((prev) => ({ ...prev, reason: e.target.value }))}
                    rows={3}
                  />
                </div>

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
                    {appointments
                      .filter((apt) => apt.status === "Scheduled")
                      .slice(0, 2)
                      .map((appointment) => (
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
                    {medicalRecords.slice(0, 2).map((record) => (
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
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      {editingAppointment?.id === appointment.id ? (
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label className="text-xs">Date</Label>
                            <Input
                              type="date"
                              value={editingAppointment.date}
                              onChange={(e) => setEditingAppointment({...editingAppointment, date: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Time</Label>
                            <Input
                              value={editingAppointment.time}
                              onChange={(e) => setEditingAppointment({...editingAppointment, time: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Reason</Label>
                            <Input
                              value={editingAppointment.reason}
                              onChange={(e) => setEditingAppointment({...editingAppointment, reason: e.target.value})}
                            />
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" onClick={handleSaveAppointment}>
                              <Save className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingAppointment(null)}>
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
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
                            <Badge variant={appointment.status === "Completed" ? "outline" : "secondary"}>
                              {appointment.status}
                            </Badge>
                            <Button variant="outline" size="sm" onClick={() => handleEditAppointment(appointment)}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </>
                      )}
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
                <CardDescription>Your health history, diagnoses, and test results (Read-only for patients)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medicalRecords.map((record) => (
                    <div key={record.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{record.type}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{record.date}</span>
                          <Badge variant="outline" className="text-xs">
                            Doctor Only
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{record.doctor}</p>
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
                      <div className="mt-3 pt-3 border-t border-muted">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          Medical records can only be edited by healthcare professionals
                        </p>
                      </div>
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
                  {billingInfo.map((bill) => (
                    <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{bill.service}</h3>
                        <p className="text-sm text-muted-foreground">{bill.date}</p>
                        <p className="text-sm text-muted-foreground">Payment: {bill.paymentMethod}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">KSh {bill.amount.toLocaleString()}</div>
                        <Badge variant={bill.status === "Paid" ? "default" : "destructive"}>{bill.status}</Badge>
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
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </div>
                  {!editingProfile ? (
                    <Button onClick={() => setEditingProfile(true)} variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile} size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={handleCancelProfileEdit} variant="outline" size="sm">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardTitle>
                <CardDescription>Your account details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Full Name</Label>
                      <Input 
                        value={editingProfile ? tempProfile.fullName : patientProfile.fullName}
                        onChange={(e) => editingProfile && setTempProfile({...tempProfile, fullName: e.target.value})}
                        readOnly={!editingProfile}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">National ID</Label>
                      <Input 
                        value={editingProfile ? tempProfile.nationalId : patientProfile.nationalId}
                        onChange={(e) => editingProfile && setTempProfile({...tempProfile, nationalId: e.target.value})}
                        readOnly={!editingProfile}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Date of Birth</Label>
                      <Input 
                        type="date"
                        value={editingProfile ? tempProfile.dateOfBirth : patientProfile.dateOfBirth}
                        onChange={(e) => editingProfile && setTempProfile({...tempProfile, dateOfBirth: e.target.value})}
                        readOnly={!editingProfile}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Gender</Label>
                      {editingProfile ? (
                        <Select 
                          value={tempProfile.gender} 
                          onValueChange={(value) => setTempProfile({...tempProfile, gender: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input value={patientProfile.gender} readOnly />
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <Input 
                        type="email"
                        value={editingProfile ? tempProfile.email : patientProfile.email}
                        onChange={(e) => editingProfile && setTempProfile({...tempProfile, email: e.target.value})}
                        readOnly={!editingProfile}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Phone</Label>
                      <Input 
                        value={editingProfile ? tempProfile.phone : patientProfile.phone}
                        onChange={(e) => editingProfile && setTempProfile({...tempProfile, phone: e.target.value})}
                        readOnly={!editingProfile}
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Street Address</Label>
                      <Input 
                        value={editingProfile ? tempProfile.address.street : patientProfile.address.street}
                        onChange={(e) => editingProfile && setTempProfile({
                          ...tempProfile, 
                          address: {...tempProfile.address, street: e.target.value}
                        })}
                        readOnly={!editingProfile}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">City</Label>
                      <Input 
                        value={editingProfile ? tempProfile.address.city : patientProfile.address.city}
                        onChange={(e) => editingProfile && setTempProfile({
                          ...tempProfile, 
                          address: {...tempProfile.address, city: e.target.value}
                        })}
                        readOnly={!editingProfile}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">County</Label>
                      <Input 
                        value={editingProfile ? tempProfile.address.county : patientProfile.address.county}
                        onChange={(e) => editingProfile && setTempProfile({
                          ...tempProfile, 
                          address: {...tempProfile.address, county: e.target.value}
                        })}
                        readOnly={!editingProfile}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Postal Code</Label>
                      <Input 
                        value={editingProfile ? tempProfile.address.postalCode : patientProfile.address.postalCode}
                        onChange={(e) => editingProfile && setTempProfile({
                          ...tempProfile, 
                          address: {...tempProfile.address, postalCode: e.target.value}
                        })}
                        readOnly={!editingProfile}
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Name</Label>
                      <Input 
                        value={editingProfile ? tempProfile.emergencyContact.name : patientProfile.emergencyContact.name}
                        onChange={(e) => editingProfile && setTempProfile({
                          ...tempProfile, 
                          emergencyContact: {...tempProfile.emergencyContact, name: e.target.value}
                        })}
                        readOnly={!editingProfile}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Relationship</Label>
                      <Input 
                        value={editingProfile ? tempProfile.emergencyContact.relationship : patientProfile.emergencyContact.relationship}
                        onChange={(e) => editingProfile && setTempProfile({
                          ...tempProfile, 
                          emergencyContact: {...tempProfile.emergencyContact, relationship: e.target.value}
                        })}
                        readOnly={!editingProfile}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Phone</Label>
                      <Input 
                        value={editingProfile ? tempProfile.emergencyContact.phone : patientProfile.emergencyContact.phone}
                        onChange={(e) => editingProfile && setTempProfile({
                          ...tempProfile, 
                          emergencyContact: {...tempProfile.emergencyContact, phone: e.target.value}
                        })}
                        readOnly={!editingProfile}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <Input 
                        type="email"
                        value={editingProfile ? tempProfile.emergencyContact.email : patientProfile.emergencyContact.email}
                        onChange={(e) => editingProfile && setTempProfile({
                          ...tempProfile, 
                          emergencyContact: {...tempProfile.emergencyContact, email: e.target.value}
                        })}
                        readOnly={!editingProfile}
                      />
                    </div>
                  </div>
                </div>

                {/* Next of Kin */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Next of Kin
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Name</Label>
                      <Input 
                        value={editingProfile ? tempProfile.nextOfKin.name : patientProfile.nextOfKin.name}
                        onChange={(e) => editingProfile && setTempProfile({
                          ...tempProfile, 
                          nextOfKin: {...tempProfile.nextOfKin, name: e.target.value}
                        })}
                        readOnly={!editingProfile}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Relationship</Label>
                      <Input 
                        value={editingProfile ? tempProfile.nextOfKin.relationship : patientProfile.nextOfKin.relationship}
                        onChange={(e) => editingProfile && setTempProfile({
                          ...tempProfile, 
                          nextOfKin: {...tempProfile.nextOfKin, relationship: e.target.value}
                        })}
                        readOnly={!editingProfile}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Phone</Label>
                      <Input 
                        value={editingProfile ? tempProfile.nextOfKin.phone : patientProfile.nextOfKin.phone}
                        onChange={(e) => editingProfile && setTempProfile({
                          ...tempProfile, 
                          nextOfKin: {...tempProfile.nextOfKin, phone: e.target.value}
                        })}
                        readOnly={!editingProfile}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium">Address</Label>
                      <Input 
                        value={editingProfile ? tempProfile.nextOfKin.address : patientProfile.nextOfKin.address}
                        onChange={(e) => editingProfile && setTempProfile({
                          ...tempProfile, 
                          nextOfKin: {...tempProfile.nextOfKin, address: e.target.value}
                        })}
                        readOnly={!editingProfile}
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Professional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Occupation</Label>
                      <Input 
                        value={editingProfile ? tempProfile.occupation : patientProfile.occupation}
                        onChange={(e) => editingProfile && setTempProfile({...tempProfile, occupation: e.target.value})}
                        readOnly={!editingProfile}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Employer</Label>
                      <Input 
                        value={editingProfile ? tempProfile.employer : patientProfile.employer}
                        onChange={(e) => editingProfile && setTempProfile({...tempProfile, employer: e.target.value})}
                        readOnly={!editingProfile}
                      />
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Medical Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Blood Type</Label>
                      {editingProfile ? (
                        <Select 
                          value={tempProfile.bloodType} 
                          onValueChange={(value) => setTempProfile({...tempProfile, bloodType: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input value={patientProfile.bloodType} readOnly />
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Height</Label>
                      <Input 
                        value={editingProfile ? tempProfile.height : patientProfile.height}
                        onChange={(e) => editingProfile && setTempProfile({...tempProfile, height: e.target.value})}
                        readOnly={!editingProfile}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Weight</Label>
                      <Input 
                        value={editingProfile ? tempProfile.weight : patientProfile.weight}
                        onChange={(e) => editingProfile && setTempProfile({...tempProfile, weight: e.target.value})}
                        readOnly={!editingProfile}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Allergies</Label>
                      <Input 
                        value={editingProfile ? tempProfile.allergies.join(', ') : patientProfile.allergies.join(', ')}
                        onChange={(e) => editingProfile && setTempProfile({
                          ...tempProfile, 
                          allergies: e.target.value.split(',').map(item => item.trim())
                        })}
                        readOnly={!editingProfile}
                        placeholder="Separate multiple allergies with commas"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium">Chronic Conditions</Label>
                      <Input 
                        value={editingProfile ? tempProfile.chronicConditions.join(', ') : patientProfile.chronicConditions.join(', ')}
                        onChange={(e) => editingProfile && setTempProfile({
                          ...tempProfile, 
                          chronicConditions: e.target.value.split(',').map(item => item.trim())
                        })}
                        readOnly={!editingProfile}
                        placeholder="Separate multiple conditions with commas"
                      />
                    </div>
                  </div>
                </div>

                {/* Insurance Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Insurance Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Insurance Provider</Label>
                      <Input 
                        value={editingProfile ? tempProfile.insurance.provider : patientProfile.insurance.provider}
                        onChange={(e) => editingProfile && setTempProfile({
                          ...tempProfile, 
                          insurance: {...tempProfile.insurance, provider: e.target.value}
                        })}
                        readOnly={!editingProfile}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Policy Number</Label>
                      <Input 
                        value={editingProfile ? tempProfile.insurance.policyNumber : patientProfile.insurance.policyNumber}
                        onChange={(e) => editingProfile && setTempProfile({
                          ...tempProfile, 
                          insurance: {...tempProfile.insurance, policyNumber: e.target.value}
                        })}
                        readOnly={!editingProfile}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Valid Until</Label>
                      <Input 
                        type="date"
                        value={editingProfile ? tempProfile.insurance.validUntil : patientProfile.insurance.validUntil}
                        onChange={(e) => editingProfile && setTempProfile({
                          ...tempProfile, 
                          insurance: {...tempProfile.insurance, validUntil: e.target.value}
                        })}
                        readOnly={!editingProfile}
                      />
                    </div>
                  </div>
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