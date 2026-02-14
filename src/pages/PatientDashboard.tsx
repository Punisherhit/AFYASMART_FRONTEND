import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
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
  Shield,
  Loader2
} from "lucide-react";
import { FlowPatient, patientFlowApi, stageLabel } from "@/services/patientFlow";

const BACKEND_URL = "http://localhost:5000";

interface Address {
  street: string;
  city: string;
  county: string;
  postalCode: string;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

interface NextOfKin {
  name: string;
  relationship: string;
  phone: string;
  address: string;
}

interface Insurance {
  provider: string;
  policyNumber: string;
  validUntil: string;
}

interface PatientProfile {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  bloodType: string;
  gender: string;
  nationalId: string;
  address: Address;
  emergencyContact: EmergencyContact;
  nextOfKin: NextOfKin;
  occupation: string;
  employer: string;
  insurance: Insurance;
  allergies: string[];
  chronicConditions: string[];
  height: string;
  weight: string;
}

interface Appointment {
  id: string;
  doctor: string;
  doctorId: string;
  department: string;
  date: string;
  time: string;
  status: string;
  reason: string;
  type: string;
}

interface MedicalRecord {
  id: string;
  date: string;
  doctor: string;
  type: string;
  description: string;
  prescription?: string;
  details?: string;
}

interface BillingInfo {
  id: string;
  date: string;
  service: string;
  amount: number;
  status: string;
  paymentMethod: string;
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  department: string;
}

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [patientProfile, setPatientProfile] = useState<PatientProfile>({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    bloodType: "",
    gender: "",
    nationalId: "",
    address: {
      street: "",
      city: "",
      county: "",
      postalCode: ""
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
      email: ""
    },
    nextOfKin: {
      name: "",
      relationship: "",
      phone: "",
      address: ""
    },
    occupation: "",
    employer: "",
    insurance: {
      provider: "",
      policyNumber: "",
      validUntil: ""
    },
    allergies: [],
    chronicConditions: [],
    height: "",
    weight: ""
  });

  const [tempProfile, setTempProfile] = useState<PatientProfile>({...patientProfile});
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [billingInfo, setBillingInfo] = useState<BillingInfo[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [availableDoctors, setAvailableDoctors] = useState<Doctor[]>([]);
  const [flowPatients, setFlowPatients] = useState<FlowPatient[]>([]);
  
  const [appointmentForm, setAppointmentForm] = useState({
    doctor: "",
    department: "",
    date: "",
    time: "",
    reason: "",
    type: "outpatient",
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('afya-token');
    
    if (!token) {
      console.error('No authentication token found');
      localStorage.removeItem('afya-user');
      navigate('/login');
      throw new Error('Authentication required');
    }

    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...options.headers
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('afya-token');
        localStorage.removeItem('afya-user');
        navigate('/login');
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Request failed');
      }

      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setIsLoading(true);
        
        const token = localStorage.getItem('afya-token');
        if (!token) {
          navigate('/login');
          return;
        }

        const [profileRes, appointmentsRes, recordsRes, billingRes, deptRes, doctorsRes] = await Promise.all([
          fetchWithAuth(`${BACKEND_URL}/api/v1/patient/`),
          fetchWithAuth(`${BACKEND_URL}/api/v1/patient/appointments`),
          fetchWithAuth(`${BACKEND_URL}/api/v1/patient/medical-records`),
          fetchWithAuth(`${BACKEND_URL}/api/v1/patient/billing`),
          fetchWithAuth(`${BACKEND_URL}/api/v1/departments`),
          fetchWithAuth(`${BACKEND_URL}/api/v1/doctors`)
        ]);

        const [
          profileData,
          appointmentsData,
          recordsData,
          billingData,
          deptData,
          doctorsData
        ] = await Promise.all([
          profileRes.json(),
          appointmentsRes.json(),
          recordsRes.json(),
          billingRes.json(),
          deptRes.json(),
          doctorsRes.json()
        ]);

        setPatientProfile(profileData);
        setTempProfile(profileData);
        setAppointments(appointmentsData);
        setMedicalRecords(recordsData);
        setBillingInfo(billingData);
        setDepartments(deptData);
        setAvailableDoctors(doctorsData);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch data";
        setError(errorMessage);
        
        if (errorMessage.includes('Session expired') || errorMessage.includes('Unauthorized')) {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, [navigate]);

  useEffect(() => {
    const sync = () => setFlowPatients(patientFlowApi.getAll());
    sync();
    const unsubscribe = patientFlowApi.subscribe(sync);
    return unsubscribe;
  }, []);

  const sessionUser = JSON.parse(localStorage.getItem("afya-user") || "{}") as { email?: string; name?: string };
  const linkedFlowRecords = flowPatients.filter((p) =>
    (sessionUser.email && p.email && p.email.toLowerCase() === sessionUser.email.toLowerCase()) ||
    (p.name && patientProfile.fullName && p.name.toLowerCase() === patientProfile.fullName.toLowerCase())
  );

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const selectedDoctor = availableDoctors.find(doc => doc.id === appointmentForm.doctor);
      if (!selectedDoctor) throw new Error("Please select a doctor");

      const response = await fetchWithAuth(`${BACKEND_URL}/api/v1/appointments`, {
        method: 'POST',
        body: JSON.stringify({
          doctorId: appointmentForm.doctor,
          department: appointmentForm.department,
          date: appointmentForm.date,
          time: appointmentForm.time,
          reason: appointmentForm.reason,
          type: appointmentForm.type,
          patientId: patientProfile.id
        })
      });

      const newAppointment = await response.json();
      setAppointments(prev => [newAppointment, ...prev]);
      
      setIsBookingDialogOpen(false);
      setAppointmentForm({
        doctor: "",
        department: "",
        date: "",
        time: "",
        reason: "",
        type: "outpatient",
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to book appointment";
      alert(errorMessage);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetchWithAuth(`${BACKEND_URL}/api/v1/patient/profile`, {
        method: 'PUT',
        body: JSON.stringify(tempProfile)
      });

      const updatedProfile = await response.json();
      setPatientProfile(updatedProfile);
      setTempProfile(updatedProfile);
      setEditingProfile(false);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile";
      alert(errorMessage);
    }
  };

  const handleCancelProfileEdit = () => {
    setTempProfile(patientProfile);
    setEditingProfile(false);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment({ ...appointment });
  };

  const handleSaveAppointment = async () => {
    if (!editingAppointment) return;

    try {
      const response = await fetchWithAuth(`${BACKEND_URL}/api/v1/appointments/${editingAppointment.id}`, {
        method: 'PUT',
        body: JSON.stringify(editingAppointment)
      });

      const updatedAppointment = await response.json();
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === updatedAppointment.id ? updatedAppointment : apt
        )
      );
      setEditingAppointment(null);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update appointment";
      alert(errorMessage);
    }
  };

  const handleCancelAppointmentEdit = () => {
    setEditingAppointment(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('afya-token');
    localStorage.removeItem('afya-user');
    
    fetch(`${BACKEND_URL}/api/v1/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders()
    }).catch(console.error);
    
    navigate('/login');
  };

  const nextAppointment = appointments.find(apt => 
    new Date(apt.date) >= new Date() && apt.status === "Scheduled"
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-8">
          <CardTitle>Error</CardTitle>
          <CardDescription className="text-destructive mb-4">{error}</CardDescription>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Patient Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {patientProfile.fullName}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
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
                      onValueChange={(value) => setAppointmentForm(prev => ({ ...prev, department: value, doctor: "" }))}
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
                      onValueChange={(value) => setAppointmentForm(prev => ({ ...prev, doctor: value }))}
                      disabled={!appointmentForm.department}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDoctors
                          .filter((doc) => doc.department === appointmentForm.department)
                          .map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id}>
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
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Select
                        value={appointmentForm.time}
                        onValueChange={(value) => setAppointmentForm(prev => ({ ...prev, time: value }))}
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
                      onValueChange={(value) => setAppointmentForm(prev => ({ ...prev, type: value }))}
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
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {nextAppointment ? new Date(nextAppointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "None"}
              </div>
              <p className="text-xs text-muted-foreground">
                {nextAppointment ? nextAppointment.doctor : "No upcoming appointments"}
              </p>
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
              <div className="text-2xl font-bold">
                {medicalRecords.filter(record => record.prescription).length}
              </div>
              <p className="text-xs text-muted-foreground">Current medications</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding Bills</CardTitle>
              <CreditCard className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                KSh {billingInfo.filter(bill => bill.status !== "Paid").reduce((sum, bill) => sum + bill.amount, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {billingInfo.some(bill => bill.status !== "Paid") ? "Payment due" : "All paid up"}
              </p>
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
                      .filter(apt => new Date(apt.date) >= new Date() && apt.status === "Scheduled")
                      .slice(0, 2)
                      .map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h3 className="font-medium">{appointment.doctor}</h3>
                            <p className="text-sm text-muted-foreground">{appointment.department}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {new Date(appointment.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </p>
                            <p className="text-sm text-muted-foreground">{appointment.time}</p>
                          </div>
                        </div>
                      ))}
                    {appointments.filter(apt => new Date(apt.date) >= new Date() && apt.status === "Scheduled").length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No upcoming appointments</p>
                    )}
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
                          <p className="text-sm font-medium">
                            {new Date(record.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                          <Badge variant="secondary">New</Badge>
                        </div>
                      </div>
                    ))}
                    {medicalRecords.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No recent medical records</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>My Department Journey</CardTitle>
                  <CardDescription>Track your real-time movement across departments, tests, and prescriptions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {linkedFlowRecords.length === 0 && (
                    <p className="text-sm text-muted-foreground">No linked journey yet. Ensure reception captured your account email.</p>
                  )}
                  {linkedFlowRecords.map((record) => (
                    <div key={record.id} className="rounded-lg border p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{record.name}</p>
                        <Badge variant="outline">{stageLabel[record.currentStage]}</Badge>
                      </div>
                      <p className="text-xs"><span className="font-medium">Tests:</span> {record.tests.length ? record.tests.join(" | ") : "No tests yet"}</p>
                      <p className="text-xs"><span className="font-medium">Prescriptions:</span> {record.prescriptions.length ? record.prescriptions.join(", ") : "No prescriptions yet"}</p>
                      <div className="space-y-1">
                        {record.history.slice(0, 4).map((event, idx) => (
                          <p key={idx} className="text-xs text-muted-foreground">• {stageLabel[event.stage]}: {event.action}{event.notes ? ` (${event.notes})` : ""}</p>
                        ))}
                      </div>
                    </div>
                  ))}
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
                  {appointments.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No appointments found</p>
                  ) : (
                    appointments.map((appointment) => (
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
                              <Button size="sm" variant="outline" onClick={handleCancelAppointmentEdit}>
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
                                  {appointment.department} • {new Date(appointment.date).toLocaleDateString()} • {appointment.time}
                                </p>
                                <p className="text-xs text-muted-foreground">{appointment.reason}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={appointment.status === "Completed" ? "outline" : "secondary"}>
                                {appointment.status}
                              </Badge>
                              {appointment.status === "Scheduled" && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleEditAppointment(appointment)}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                              )}
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  )}
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
                  {medicalRecords.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No medical records found</p>
                  ) : (
                    medicalRecords.map((record) => (
                      <div key={record.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{record.type}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {new Date(record.date).toLocaleDateString()}
                            </span>
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
                    ))
                  )}
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
                  {billingInfo.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No billing records found</p>
                  ) : (
                    billingInfo.map((bill) => (
                      <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{bill.service}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(bill.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-muted-foreground">Payment: {bill.paymentMethod}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">KSh {bill.amount.toLocaleString()}</div>
                          <Badge variant={bill.status === "Paid" ? "default" : "destructive"}>{bill.status}</Badge>
                        </div>
                      </div>
                    ))
                  )}
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