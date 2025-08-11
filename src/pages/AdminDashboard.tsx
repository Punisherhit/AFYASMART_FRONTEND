import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, UserPlus, Stethoscope, Building2, ArrowLeft, Plus, Eye, Edit, ChevronDown, 
  Check, X, Activity, Clock, Pill, Calendar, User, Mail, Phone, Home, MapPin, 
  ClipboardList, HeartPulse, BookUser, BadgeInfo, BriefcaseMedical, AlertCircle,
  BarChart2, Settings, Bell, Search, Filter, Download, Upload, Trash2, MoreVertical,
  Shield, Lock, Unlock, RotateCw, PieChart, TrendingUp, AlertTriangle, ClipboardCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

// Types for our data
type Doctor = {
  _id: string;
  name: string;
  specialization: string;
  department: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive";
  lastActive: string;
  licenseNumber: string;
  yearsOfExperience: number;
};

type Patient = {
  _id: string;
  name: string;
  age: number;
  phone: string;
  email: string;
  status: "Active" | "Inactive";
  lastVisit: string;
  bloodGroup: string;
  allergies: string;
  medicalHistory: string;
};

type Department = {
  _id: string;
  name: string;
  assignedDoctor: string;
  status: "Active" | "Inactive";
  patientCount: number;
};

type User = {
  _id: string;
  name: string;
  email: string;
  role: "Admin" | "Doctor" | "Reception" | "Lab" | "Pharmacy";
  status: "Active" | "Inactive";
  lastLogin: string;
};

type Appointment = {
  _id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: "Confirmed" | "Pending" | "Cancelled";
  notes: string;
};

const API_BASE_URL = "http://localhost:5000/api/v1";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [registerType, setRegisterType] = useState<"doctor" | "patient" | "department" | "user">("doctor");
  const [isEditing, setIsEditing] = useState<{type: string, id: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New patient registration", description: "John Doe registered today", time: "10 min ago", read: false },
    { id: 2, title: "System update available", description: "Version 2.3.0 ready to install", time: "1 hour ago", read: false },
    { id: 3, title: "Appointment reminder", description: "5 upcoming appointments today", time: "2 hours ago", read: true }
  ]);

  // State for all our data
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    patientsToday: 0,
    patientsChange: 0,
    activeStaff: 0,
    onlineStaff: 0,
    systemUptime: 0,
    prescriptions: 0,
    prescriptionsChange: 0,
    appointmentsToday: 0,
    labTests: 0,
    criticalAlerts: 0,
    revenue: 0
  });

  // Form states
  const [doctorForm, setDoctorForm] = useState<Omit<Doctor, '_id' | 'lastActive'>>({
    name: "",
    specialization: "",
    department: "",
    email: "",
    phone: "",
    status: "Active",
    licenseNumber: "",
    yearsOfExperience: 0
  });

  const [patientForm, setPatientForm] = useState<Omit<Patient, '_id' | 'lastVisit'>>({
    name: "",
    age: 0,
    phone: "",
    email: "",
    status: "Active",
    bloodGroup: "",
    allergies: "",
    medicalHistory: ""
  });

  const [departmentForm, setDepartmentForm] = useState<Omit<Department, '_id' | 'patientCount'>>({
    name: "",
    assignedDoctor: "",
    status: "Active"
  });

  const [userForm, setUserForm] = useState<Omit<User, '_id' | 'lastLogin'>>({
    name: "",
    email: "",
    role: "Doctor",
    status: "Active"
  });

  const [appointmentForm, setAppointmentForm] = useState<Omit<Appointment, '_id'>>({
    patientName: "",
    doctorName: "",
    date: new Date().toISOString().split('T')[0],
    time: "",
    status: "Pending",
    notes: ""
  });

 const handleLogout = () => {
    localStorage.removeItem('afya-token');
    localStorage.removeItem('afya-user');
    navigate('/');
  };

  // Fetch all data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all data in parallel
      const [doctorsRes, patientsRes, departmentsRes, usersRes, appointmentsRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/doctors`),
        axios.get(`${API_BASE_URL}/patient`),
        axios.get(`${API_BASE_URL}/departments`),
        axios.get(`${API_BASE_URL}/users`),
        axios.get(`${API_BASE_URL}/patient/appointments`),
        axios.get(`${API_BASE_URL}/dashboard/stats`)
      ]);

      setDoctors(doctorsRes.data);
      setPatients(patientsRes.data);
      setDepartments(departmentsRes.data);
      setUsers(usersRes.data);
      setAppointments(appointmentsRes.data);
      setDashboardStats(statsRes.data);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // View details handler
  const handleViewDetails = (type: string, id: string) => {
    let item;
    switch(type) {
      case 'doctor':
        item = doctors.find(d => d._id === id);
        break;
      case 'patient':
        item = patients.find(p => p._id === id);
        break;
      case 'department':
        item = departments.find(d => d._id === id);
        break;
      case 'user':
        item = users.find(u => u._id === id);
        break;
      case 'appointment':
        item = appointments.find(a => a._id === id);
        break;
      default:
        item = null;
    }

    if (item) {
      toast({
        title: `Viewing ${type} details`,
        description: (
          <div className="mt-2 space-y-2">
            {Object.entries(item).map(([key, value]) => (
              <div key={key} className="flex">
                <span className="font-medium w-1/3 capitalize">{key}:</span>
                <span className="flex-1">{value}</span>
              </div>
            ))}
          </div>
        )
      });
    }
  };

  // Edit handler - loads data into form
  const handleEdit = (type: string, id: string) => {
    switch(type) {
      case 'doctor':
        const doctorToEdit = doctors.find(d => d._id === id);
        if (doctorToEdit) {
          const { _id, lastActive, ...rest } = doctorToEdit;
          setDoctorForm(rest);
          setIsEditing({ type, id });
        }
        break;
      case 'patient':
        const patientToEdit = patients.find(p => p._id === id);
        if (patientToEdit) {
          const { _id, lastVisit, ...rest } = patientToEdit;
          setPatientForm(rest);
          setIsEditing({ type, id });
        }
        break;
      case 'department':
        const deptToEdit = departments.find(d => d._id === id);
        if (deptToEdit) {
          const { _id, patientCount, ...rest } = deptToEdit;
          setDepartmentForm(rest);
          setIsEditing({ type, id });
        }
        break;
      case 'user':
        const userToEdit = users.find(u => u._id === id);
        if (userToEdit) {
          const { _id, lastLogin, ...rest } = userToEdit;
          setUserForm(rest);
          setIsEditing({ type, id });
        }
        break;
      case 'appointment':
        const appointmentToEdit = appointments.find(a => a._id === id);
        if (appointmentToEdit) {
          const { _id, ...rest } = appointmentToEdit;
          setAppointmentForm(rest);
          setIsEditing({ type, id });
        }
        break;
    }
  };

  // Save edit handler
  const handleSaveEdit = async () => {
    if (!isEditing) return;

    try {
      let response;
      switch(isEditing.type) {
        case 'doctor':
          response = await axios.put(`${API_BASE_URL}/doctors/${isEditing.id}`, doctorForm);
          setDoctors(doctors.map(d => d._id === isEditing.id ? response.data : d));
          break;
        case 'patient':
          response = await axios.put(`${API_BASE_URL}/patients/${isEditing.id}`, patientForm);
          setPatients(patients.map(p => p._id === isEditing.id ? response.data : p));
          break;
        case 'department':
          response = await axios.put(`${API_BASE_URL}/departments/${isEditing.id}`, departmentForm);
          setDepartments(departments.map(d => d._id === isEditing.id ? response.data : d));
          break;
        case 'user':
          response = await axios.put(`${API_BASE_URL}/users/${isEditing.id}`, userForm);
          setUsers(users.map(u => u._id === isEditing.id ? response.data : u));
          break;
        case 'appointment':
          response = await axios.put(`${API_BASE_URL}/appointments/${isEditing.id}`, appointmentForm);
          setAppointments(appointments.map(a => a._id === isEditing.id ? response.data : a));
          break;
      }

      toast({
        title: "Changes saved",
        description: `${isEditing.type} updated successfully`
      });
      setIsEditing(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive"
      });
    }
  };

  // Create new item handler
  const handleCreate = async (type: string) => {
    try {
      let response;
      switch(type) {
        case 'doctor':
          response = await axios.post(`${API_BASE_URL}/doctors`, doctorForm);
          setDoctors([...doctors, response.data]);
          setDoctorForm({
            name: "",
            specialization: "",
            department: "",
            email: "",
            phone: "",
            status: "Active",
            licenseNumber: "",
            yearsOfExperience: 0
          });
          break;
        case 'patient':
          response = await axios.post(`${API_BASE_URL}/patients`, patientForm);
          setPatients([...patients, response.data]);
          setPatientForm({
            name: "",
            age: 0,
            phone: "",
            email: "",
            status: "Active",
            bloodGroup: "",
            allergies: "",
            medicalHistory: ""
          });
          break;
        case 'department':
          response = await axios.post(`${API_BASE_URL}/departments`, departmentForm);
          setDepartments([...departments, response.data]);
          setDepartmentForm({
            name: "",
            assignedDoctor: "",
            status: "Active"
          });
          break;
        case 'user':
          response = await axios.post(`${API_BASE_URL}/users`, userForm);
          setUsers([...users, response.data]);
          setUserForm({
            name: "",
            email: "",
            role: "Doctor",
            status: "Active"
          });
          break;
        case 'appointment':
          response = await axios.post(`${API_BASE_URL}/appointments`, appointmentForm);
          setAppointments([...appointments, response.data]);
          setAppointmentForm({
            patientName: "",
            doctorName: "",
            date: new Date().toISOString().split('T')[0],
            time: "",
            status: "Pending",
            notes: ""
          });
          break;
      }

      toast({
        title: "Success",
        description: `New ${type} created successfully`
      });
      setIsRegisterDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to create new ${type}`,
        variant: "destructive"
      });
    }
  };

  // Delete handler
  const handleDelete = async (type: string, id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/${type}/${id}`);
      
      switch(type) {
        case 'doctor':
          setDoctors(doctors.filter(d => d._id !== id));
          break;
        case 'patient':
          setPatients(patients.filter(p => p._id !== id));
          break;
        case 'department':
          setDepartments(departments.filter(d => d._id !== id));
          break;
        case 'user':
          setUsers(users.filter(u => u._id !== id));
          break;
        case 'appointment':
          setAppointments(appointments.filter(a => a._id !== id));
          break;
      }

      toast({
        title: "Success",
        description: `${type} deleted successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete ${type}`,
        variant: "destructive"
      });
    }
  };

  // Toggle status handler
  const handleToggleStatus = async (type: string, id: string) => {
    try {
      const item = 
        type === 'doctor' ? doctors.find(d => d._id === id) :
        type === 'patient' ? patients.find(p => p._id === id) :
        type === 'department' ? departments.find(d => d._id === id) :
        type === 'user' ? users.find(u => u._id === id) :
        appointments.find(a => a._id === id);
      
      if (!item) return;

      const newStatus = 
        type === 'appointment' ? 
          (item.status === "Confirmed" ? "Cancelled" : "Confirmed") :
          (item.status === "Active" ? "Inactive" : "Active");

      const response = await axios.patch(`${API_BASE_URL}/${type}/${id}/status`, { status: newStatus });

      switch(type) {
        case 'doctor':
          setDoctors(doctors.map(d => d._id === id ? response.data : d));
          break;
        case 'patient':
          setPatients(patients.map(p => p._id === id ? response.data : p));
          break;
        case 'department':
          setDepartments(departments.map(d => d._id === id ? response.data : d));
          break;
        case 'user':
          setUsers(users.map(u => u._id === id ? response.data : u));
          break;
        case 'appointment':
          setAppointments(appointments.map(a => a._id === id ? response.data : a));
          break;
      }

      toast({
        title: "Status updated",
        description: `${type} status has been changed`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update ${type} status`,
        variant: "destructive"
      });
    }
  };

  // Mark notification as read
  const handleNotificationRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // Filtered data based on search term
  const filteredData = (data: any[], type: string) => {
    if (!searchTerm) return data;
    
    return data.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      
      if (type === 'doctors') {
        return (
          item.name.toLowerCase().includes(searchLower) || 
          item.specialization.toLowerCase().includes(searchLower) ||
          item.department.toLowerCase().includes(searchLower) ||
          item.email.toLowerCase().includes(searchLower)
        );
      } else if (type === 'patients') {
        return (
          item.name.toLowerCase().includes(searchLower) || 
          item.email.toLowerCase().includes(searchLower) ||
          item.phone.toLowerCase().includes(searchLower)
        );
      } else if (type === 'departments') {
        return (
          item.name.toLowerCase().includes(searchLower) || 
          item.assignedDoctor.toLowerCase().includes(searchLower)
        );
      } else if (type === 'users') {
        return (
          item.name.toLowerCase().includes(searchLower) || 
          item.role.toLowerCase().includes(searchLower) ||
          item.email.toLowerCase().includes(searchLower)
        );
      } else if (type === 'appointments') {
        return (
          item.patientName.toLowerCase().includes(searchLower) || 
          item.doctorName.toLowerCase().includes(searchLower) ||
          item.status.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  };

  // Get available doctors for department assignment
  const availableDoctors = doctors.filter(d => d.status === "Active");

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="border-b">
        <div className="flex h-16 items-center px-6 justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-6 w-6 text-primary" />
            <span className="font-bold">AfyaConnect</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-10 w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[350px] p-0">
                <div className="p-2 border-b">
                  <p className="font-medium">Notifications</p>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.map(notification => (
                    <DropdownMenuItem 
                      key={notification.id} 
                      className={`py-3 px-4 ${!notification.read ? 'bg-muted/50' : ''}`}
                      onClick={() => handleNotificationRead(notification.id)}
                    >
                      <div className="flex gap-3 w-full">
                        <div className="mt-1">
                          <div className={`h-2 w-2 rounded-full ${!notification.read ? 'bg-primary' : 'bg-transparent'}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <div className="p-2 border-t text-center">
                  <Button variant="ghost" size="sm">View all notifications</Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/admin.png" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <span>Admin</span>
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
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Patients Today</CardTitle>
                  <User className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-[100px]" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{dashboardStats.patientsToday.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                        {dashboardStats.patientsChange >= 0 ? '+' : ''}{dashboardStats.patientsChange}% from yesterday
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
                  <Activity className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-[100px]" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{dashboardStats.activeStaff}</div>
                      <p className="text-xs text-muted-foreground">
                        {dashboardStats.onlineStaff} online now
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                  <Clock className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-[100px]" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{dashboardStats.systemUptime}%</div>
                      <p className="text-xs text-muted-foreground">
                        Last 30 days
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <PieChart className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-[100px]" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">${dashboardStats.revenue.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">
                        Today's revenue
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Charts and Additional Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Patient Admissions</CardTitle>
                  <CardDescription>Last 30 days patient admissions trend</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded">
                    <BarChart2 className="h-12 w-12 text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Patient admissions chart</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>Current system status and alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Server Load</span>
                      <span className="text-sm text-muted-foreground">42%</span>
                    </div>
                    <Progress value={42} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Database Usage</span>
                      <span className="text-sm text-muted-foreground">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-red-500">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Critical Alerts</span>
                    </div>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                        <span className="text-sm">High server temperature</span>
                        <Button variant="ghost" size="sm" className="h-6 text-red-500">View</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system events and user actions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                        <TableCell>New patient registration</TableCell>
                        <TableCell>Dr. Alice Johnson</TableCell>
                        <TableCell>10 minutes ago</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Prescription approved</TableCell>
                      <TableCell>Mary Brown</TableCell>
                      <TableCell>25 minutes ago</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Lab test completed</TableCell>
                      <TableCell>Jane Smith</TableCell>
                      <TableCell>1 hour ago</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}

        {/* Tabs Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="doctors">Doctors</TabsTrigger>
              <TabsTrigger value="patients">Patients</TabsTrigger>
              <TabsTrigger value="departments">Departments</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2" onClick={() => setRegisterType(activeTab.slice(0, -1) as any)}>
                    <Plus className="h-4 w-4" />
                    Add New
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New {registerType.charAt(0).toUpperCase() + registerType.slice(1)}</DialogTitle>
                  </DialogHeader>
                  
                  {registerType === "doctor" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input
                            value={doctorForm.name}
                            onChange={(e) => setDoctorForm({...doctorForm, name: e.target.value})}
                            placeholder="Dr. Full Name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Specialization</Label>
                          <Select
                            value={doctorForm.specialization}
                            onValueChange={(value) => setDoctorForm({...doctorForm, specialization: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select specialization" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Cardiology">Cardiology</SelectItem>
                              <SelectItem value="Neurology">Neurology</SelectItem>
                              <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                              <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Department</Label>
                          <Input
                            value={doctorForm.department}
                            onChange={(e) => setDoctorForm({...doctorForm, department: e.target.value})}
                            placeholder="Department"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Status</Label>
                          <Select
                            value={doctorForm.status}
                            onValueChange={(value) => setDoctorForm({...doctorForm, status: value as "Active" | "Inactive"})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={doctorForm.email}
                            onChange={(e) => setDoctorForm({...doctorForm, email: e.target.value})}
                            placeholder="doctor@hospital.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input
                            value={doctorForm.phone}
                            onChange={(e) => setDoctorForm({...doctorForm, phone: e.target.value})}
                            placeholder="+254700000000"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>License Number</Label>
                          <Input
                            value={doctorForm.licenseNumber}
                            onChange={(e) => setDoctorForm({...doctorForm, licenseNumber: e.target.value})}
                            placeholder="MD-12345"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Years of Experience</Label>
                          <Input
                            type="number"
                            value={doctorForm.yearsOfExperience}
                            onChange={(e) => setDoctorForm({...doctorForm, yearsOfExperience: parseInt(e.target.value) || 0})}
                            placeholder="5"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {registerType === "patient" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input
                            value={patientForm.name}
                            onChange={(e) => setPatientForm({...patientForm, name: e.target.value})}
                            placeholder="Full Name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Age</Label>
                          <Input
                            type="number"
                            value={patientForm.age}
                            onChange={(e) => setPatientForm({...patientForm, age: parseInt(e.target.value) || 0})}
                            placeholder="30"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={patientForm.email}
                            onChange={(e) => setPatientForm({...patientForm, email: e.target.value})}
                            placeholder="patient@email.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input
                            value={patientForm.phone}
                            onChange={(e) => setPatientForm({...patientForm, phone: e.target.value})}
                            placeholder="+254700000000"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Blood Group</Label>
                          <Select
                            value={patientForm.bloodGroup}
                            onValueChange={(value) => setPatientForm({...patientForm, bloodGroup: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select blood group" />
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
                        </div>
                        <div className="space-y-2">
                          <Label>Status</Label>
                          <Select
                            value={patientForm.status}
                            onValueChange={(value) => setPatientForm({...patientForm, status: value as "Active" | "Inactive"})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Allergies</Label>
                        <Input
                          value={patientForm.allergies}
                          onChange={(e) => setPatientForm({...patientForm, allergies: e.target.value})}
                          placeholder="List any allergies"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Medical History</Label>
                        <Textarea
                          value={patientForm.medicalHistory}
                          onChange={(e) => setPatientForm({...patientForm, medicalHistory: e.target.value})}
                          placeholder="Patient's medical history"
                          rows={3}
                        />
                      </div>
                    </div>
                  )}
                  
                  {registerType === "department" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Department Name</Label>
                        <Input
                          value={departmentForm.name}
                          onChange={(e) => setDepartmentForm({...departmentForm, name: e.target.value})}
                          placeholder="Cardiology"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Assigned Doctor</Label>
                        <Select
                          value={departmentForm.assignedDoctor}
                          onValueChange={(value) => setDepartmentForm({...departmentForm, assignedDoctor: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select doctor" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableDoctors.map(doctor => (
                              <SelectItem key={doctor._id} value={doctor.name}>{doctor.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select
                          value={departmentForm.status}
                          onValueChange={(value) => setDepartmentForm({...departmentForm, status: value as "Active" | "Inactive"})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  
                  {registerType === "user" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input
                            value={userForm.name}
                            onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                            placeholder="Full Name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={userForm.email}
                            onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                            placeholder="user@afyaconnect.com"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Role</Label>
                          <Select
                            value={userForm.role}
                            onValueChange={(value) => setUserForm({...userForm, role: value as any})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Admin">Admin</SelectItem>
                              <SelectItem value="Doctor">Doctor</SelectItem>
                              <SelectItem value="Reception">Reception</SelectItem>
                              <SelectItem value="Lab">Lab</SelectItem>
                              <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Status</Label>
                          <Select
                            value={userForm.status}
                            onValueChange={(value) => setUserForm({...userForm, status: value as "Active" | "Inactive"})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={() => handleCreate(registerType)}>Create {registerType.charAt(0).toUpperCase() + registerType.slice(1)}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Doctors Tab */}
          <TabsContent value="doctors">
            <Card>
              <CardHeader>
                <CardTitle>Doctors</CardTitle>
                <CardDescription>Manage doctor accounts and specializations</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Specialization</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData(doctors, 'doctors').map(doctor => (
                        <TableRow key={doctor._id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={`/avatars/doctor-${doctor._id}.jpg`} />
                                <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              {isEditing?.type === 'doctor' && isEditing?.id === doctor._id ? (
                                <Input
                                  value={doctorForm.name}
                                  onChange={(e) => setDoctorForm({...doctorForm, name: e.target.value})}
                                />
                              ) : (
                                doctor.name
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {isEditing?.type === 'doctor' && isEditing?.id === doctor._id ? (
                              <Select
                                value={doctorForm.specialization}
                                onValueChange={(value) => setDoctorForm({...doctorForm, specialization: value})}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                                  <SelectItem value="Neurology">Neurology</SelectItem>
                                  <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                                  <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              doctor.specialization
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditing?.type === 'doctor' && isEditing?.id === doctor._id ? (
                              <Input
                                value={doctorForm.department}
                                onChange={(e) => setDoctorForm({...doctorForm, department: e.target.value})}
                              />
                            ) : (
                              doctor.department
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditing?.type === 'doctor' && isEditing?.id === doctor._id ? (
                              <Select
                                value={doctorForm.status}
                                onValueChange={(value) => setDoctorForm({...doctorForm, status: value as "Active" | "Inactive"})}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Active">Active</SelectItem>
                                  <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <Badge variant={doctor.status === "Active" ? "default" : "secondary"}>
                                {doctor.status}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>{doctor.lastActive}</TableCell>
                          <TableCell className="text-right">
                            {isEditing?.type === 'doctor' && isEditing?.id === doctor._id ? (
                              <div className="flex gap-2 justify-end">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => setIsEditing(null)}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Cancel
                                </Button>
                                <Button 
                                  variant="default" 
                                  size="sm" 
                                  onClick={handleSaveEdit}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Save
                                </Button>
                              </div>
                            ) : (
                              <div className="flex gap-2 justify-end">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleViewDetails('doctor', doctor._id)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleEdit('doctor', doctor._id)}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleToggleStatus('doctor', doctor._id)}>
                                      {doctor.status === "Active" ? (
                                        <>
                                          <Unlock className="mr-2 h-4 w-4" />
                                          Deactivate
                                        </>
                                      ) : (
                                        <>
                                          <Lock className="mr-2 h-4 w-4" />
                                          Activate
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete('doctor', doctor._id)}>
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing <strong>{doctors.length}</strong> of <strong>{doctors.length}</strong> doctors
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>Patients</CardTitle>
                <CardDescription>Manage patient accounts and information</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Visit</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData(patients, 'patients').map(patient => (
                        <TableRow key={patient._id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={`/avatars/patient-${patient._id}.jpg`} />
                                <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              {isEditing?.type === 'patient' && isEditing?.id === patient._id ? (
                                <Input
                                  value={patientForm.name}
                                  onChange={(e) => setPatientForm({...patientForm, name: e.target.value})}
                                />
                              ) : (
                                patient.name
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {isEditing?.type === 'patient' && isEditing?.id === patient._id ? (
                              <Input
                                type="number"
                                value={patientForm.age}
                                onChange={(e) => setPatientForm({...patientForm, age: parseInt(e.target.value) || 0})}
                              />
                            ) : (
                              patient.age
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              {isEditing?.type === 'patient' && isEditing?.id === patient._id ? (
                                <>
                                  <Input
                                    type="email"
                                    value={patientForm.email}
                                    onChange={(e) => setPatientForm({...patientForm, email: e.target.value})}
                                    className="mb-2"
                                  />
                                  <Input
                                    value={patientForm.phone}
                                    onChange={(e) => setPatientForm({...patientForm, phone: e.target.value})}
                                  />
                                </>
                              ) : (
                                <>
                                  <span>{patient.email}</span>
                                  <span className="text-muted-foreground text-sm">{patient.phone}</span>
                                </>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {isEditing?.type === 'patient' && isEditing?.id === patient._id ? (
                              <Select
                                value={patientForm.status}
                                onValueChange={(value) => setPatientForm({...patientForm, status: value as "Active" | "Inactive"})}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Active">Active</SelectItem>
                                  <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <Badge variant={patient.status === "Active" ? "default" : "secondary"}>
                                {patient.status}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>{patient.lastVisit}</TableCell>
                          <TableCell className="text-right">
                            {isEditing?.type === 'patient' && isEditing?.id === patient._id ? (
                              <div className="flex gap-2 justify-end">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => setIsEditing(null)}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Cancel
                                </Button>
                                <Button 
                                  variant="default" 
                                  size="sm" 
                                  onClick={handleSaveEdit}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Save
                                </Button>
                              </div>
                            ) : (
                              <div className="flex gap-2 justify-end">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleViewDetails('patient', patient._id)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleEdit('patient', patient._id)}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleToggleStatus('patient', patient._id)}>
                                      {patient.status === "Active" ? (
                                        <>
                                          <Unlock className="mr-2 h-4 w-4" />
                                          Deactivate
                                        </>
                                      ) : (
                                        <>
                                          <Lock className="mr-2 h-4 w-4" />
                                          Activate
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete('patient', patient._id)}>
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing <strong>{patients.length}</strong> of <strong>{patients.length}</strong> patients
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments">
            <Card>
              <CardHeader>
                <CardTitle>Departments</CardTitle>
                <CardDescription>Manage hospital departments and assigned staff</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Assigned Doctor</TableHead>
                        <TableHead>Patients</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData(departments, 'departments').map(dept => (
                        <TableRow key={dept._id}>
                          <TableCell className="font-medium">
                            {isEditing?.type === 'department' && isEditing?.id === dept._id ? (
                              <Input
                                value={departmentForm.name}
                                onChange={(e) => setDepartmentForm({...departmentForm, name: e.target.value})}
                              />
                            ) : (
                              dept.name
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditing?.type === 'department' && isEditing?.id === dept._id ? (
                              <Select
                                value={departmentForm.assignedDoctor}
                                onValueChange={(value) => setDepartmentForm({...departmentForm, assignedDoctor: value})}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableDoctors.map(doctor => (
                                    <SelectItem key={doctor._id} value={doctor.name}>{doctor.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              dept.assignedDoctor
                            )}
                          </TableCell>
                          <TableCell>{dept.patientCount}</TableCell>
                          <TableCell>
                            {isEditing?.type === 'department' && isEditing?.id === dept._id ? (
                              <Select
                                value={departmentForm.status}
                                onValueChange={(value) => setDepartmentForm({...departmentForm, status: value as "Active" | "Inactive"})}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Active">Active</SelectItem>
                                  <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <Badge variant={dept.status === "Active" ? "default" : "secondary"}>
                                {dept.status}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {isEditing?.type === 'department' && isEditing?.id === dept._id ? (
                              <div className="flex gap-2 justify-end">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => setIsEditing(null)}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Cancel
                                </Button>
                                <Button 
                                  variant="default" 
                                  size="sm" 
                                  onClick={handleSaveEdit}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Save
                                </Button>
                              </div>
                            ) : (
                              <div className="flex gap-2 justify-end">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleViewDetails('department', dept._id)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleEdit('department', dept._id)}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleToggleStatus('department', dept._id)}>
                                      {dept.status === "Active" ? (
                                        <>
                                          <Unlock className="mr-2 h-4 w-4" />
                                          Deactivate
                                        </>
                                      ) : (
                                        <>
                                          <Lock className="mr-2 h-4 w-4" />
                                          Activate
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete('department', dept._id)}>
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing <strong>{departments.length}</strong> of <strong>{departments.length}</strong> departments
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage system users and their permissions</CardDescription>
                  </div>
                  <Button 
                    className="gap-2"
                    onClick={() => {
                      setRegisterType("user");
                      setIsRegisterDialogOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData(users, 'users').map(user => (
                        <TableRow key={user._id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={`/avatars/user-${user._id}.jpg`} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              {isEditing?.type === 'user' && isEditing?.id === user._id ? (
                                <Input
                                  value={userForm.name}
                                  onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                                />
                              ) : (
                                user.name
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {isEditing?.type === 'user' && isEditing?.id === user._id ? (
                              <Input
                                type="email"
                                value={userForm.email}
                                onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                              />
                            ) : (
                              user.email
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditing?.type === 'user' && isEditing?.id === user._id ? (
                              <Select
                                value={userForm.role}
                                onValueChange={(value) => setUserForm({...userForm, role: value as any})}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Admin">Admin</SelectItem>
                                  <SelectItem value="Doctor">Doctor</SelectItem>
                                  <SelectItem value="Reception">Reception</SelectItem>
                                  <SelectItem value="Lab">Lab</SelectItem>
                                  <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <Badge variant="outline">{user.role}</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditing?.type === 'user' && isEditing?.id === user._id ? (
                              <Select
                                value={userForm.status}
                                onValueChange={(value) => setUserForm({...userForm, status: value as "Active" | "Inactive"})}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Active">Active</SelectItem>
                                  <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                                {user.status}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>{user.lastLogin}</TableCell>
                          <TableCell className="text-right">
                            {isEditing?.type === 'user' && isEditing?.id === user._id ? (
                              <div className="flex gap-2 justify-end">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => setIsEditing(null)}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Cancel
                                </Button>
                                <Button 
                                  variant="default" 
                                  size="sm" 
                                  onClick={handleSaveEdit}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Save
                                </Button>
                              </div>
                            ) : (
                              <div className="flex gap-2 justify-end">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleViewDetails('user', user._id)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleEdit('user', user._id)}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleToggleStatus('user', user._id)}>
                                      {user.status === "Active" ? (
                                        <>
                                          <Unlock className="mr-2 h-4 w-4" />
                                          Deactivate
                                        </>
                                      ) : (
                                        <>
                                          <Lock className="mr-2 h-4 w-4" />
                                          Activate
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete('user', user._id)}>
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing <strong>{users.length}</strong> of <strong>{users.length}</strong> users
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>Manage and track patient appointments</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData(appointments, 'appointments').map(appointment => (
                        <TableRow key={appointment._id}>
                          <TableCell className="font-medium">
                            {isEditing?.type === 'appointment' && isEditing?.id === appointment._id ? (
                              <Input
                                value={appointmentForm.patientName}
                                onChange={(e) => setAppointmentForm({...appointmentForm, patientName: e.target.value})}
                              />
                            ) : (
                              appointment.patientName
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditing?.type === 'appointment' && isEditing?.id === appointment._id ? (
                              <Input
                                value={appointmentForm.doctorName}
                                onChange={(e) => setAppointmentForm({...appointmentForm, doctorName: e.target.value})}
                              />
                            ) : (
                              appointment.doctorName
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditing?.type === 'appointment' && isEditing?.id === appointment._id ? (
                              <Input
                                type="date"
                                value={appointmentForm.date}
                                onChange={(e) => setAppointmentForm({...appointmentForm, date: e.target.value})}
                              />
                            ) : (
                              appointment.date
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditing?.type === 'appointment' && isEditing?.id === appointment._id ? (
                              <Input
                                value={appointmentForm.time}
                                onChange={(e) => setAppointmentForm({...appointmentForm, time: e.target.value})}
                              />
                            ) : (
                              appointment.time
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditing?.type === 'appointment' && isEditing?.id === appointment._id ? (
                              <Select
                                value={appointmentForm.status}
                                onValueChange={(value) => setAppointmentForm({...appointmentForm, status: value as any})}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                                  <SelectItem value="Pending">Pending</SelectItem>
                                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <Badge 
                                variant={
                                  appointment.status === "Confirmed" ? "default" : 
                                  appointment.status === "Pending" ? "secondary" : "destructive"
                                }
                              >
                                {appointment.status}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {isEditing?.type === 'appointment' && isEditing?.id === appointment._id ? (
                              <div className="flex gap-2 justify-end">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => setIsEditing(null)}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Cancel
                                </Button>
                                <Button 
                                  variant="default" 
                                  size="sm" 
                                  onClick={handleSaveEdit}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Save
                                </Button>
                              </div>
                            ) : (
                              <div className="flex gap-2 justify-end">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleViewDetails('appointment', appointment._id)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleEdit('appointment', appointment._id)}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleToggleStatus('appointment', appointment._id)}>
                                      {appointment.status === "Confirmed" ? (
                                        <>
                                          <X className="mr-2 h-4 w-4" />
                                          Cancel
                                        </>
                                      ) : (
                                        <>
                                          <Check className="mr-2 h-4 w-4" />
                                          Confirm
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete('appointment', appointment._id)}>
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing <strong>{appointments.length}</strong> of <strong>{appointments.length}</strong> appointments
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;