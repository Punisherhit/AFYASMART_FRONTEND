// src/pages/TriageDashboard.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, Thermometer, Activity, Clock, AlertTriangle, Users, Scale, Ruler, ArrowLeft, User, Settings, Lock } from "lucide-react";
import { triageApi } from '@/services/triageApi';
import DashboardSettingsDialog from "@/components/DashboardSettingsDialog";
import { FlowPatient, patientFlowApi } from "@/services/patientFlow";

type Priority = 'Critical' | 'Urgent' | 'Stable';

interface Patient {
  id: string;
  name: string;
  priority: Priority;
  symptoms: string;
  addedTime: Date;
  vitals: {
    heartRate: number;
    temperature: number;
    bloodPressure: string;
    weight: number;
    height: number;
    oxygenLevel?: number;
  };
  notes?: string;
}

export default function TriageDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    criticalCount: 0,
    urgentCount: 0,
    stableCount: 0,
    totalCount: 0
  });
  const [vitalSigns, setVitalSigns] = useState({
    heartRate: 78,
    temperature: 98.6,
    bloodPressure: "120/80"
  });
  const [currentPatient, setCurrentPatient] = useState<Partial<Patient> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newPatient, setNewPatient] = useState<Partial<Patient>>({
    priority: 'Stable',
    vitals: {
      heartRate: 0,
      temperature: 0,
      bloodPressure: '',
      weight: 0,
      height: 0,
      oxygenLevel: 0
    }
  });
  const [queue, setQueue] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [flowPatients, setFlowPatients] = useState<FlowPatient[]>([]);
  const [triageAssignments, setTriageAssignments] = useState<Record<string, string>>({});

  useEffect(() => {
    const sync = () => setFlowPatients(patientFlowApi.getAll());
    sync();
    const unsubscribe = patientFlowApi.subscribe(sync);
    return unsubscribe;
  }, []);


  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [queueResponse, statsResponse] = await Promise.all([
          triageApi.getQueue(),
          triageApi.getStats()
        ]);
        
        setQueue(queueResponse.data.map((patient: any) => ({
          ...patient,
          addedTime: new Date(patient.addedTime)
        })));
        
        setStats({
          criticalCount: statsResponse.data.criticalCount,
          urgentCount: statsResponse.data.urgentCount,
          stableCount: statsResponse.data.stableCount,
          totalCount: statsResponse.data.totalCount
        });
        
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Set up polling for real-time updates
    const intervalId = setInterval(fetchData, 30000);
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 60000);
    
    return () => {
      clearInterval(intervalId);
      clearInterval(timeInterval);
    };
  }, []);

  // Generate vitals based on priority
  const generateVitals = (priority: Priority) => {
    if (priority === "Critical") {
      return {
        heartRate: Math.floor(Math.random() * 40) + 100,
        temperature: Math.random() * 2 + 99.5,
        bloodPressure: `${Math.floor(Math.random() * 40) + 140}/${Math.floor(Math.random() * 20) + 90}`,
        weight: Math.floor(Math.random() * 50) + 50,
        height: Math.floor(Math.random() * 50) + 150,
        oxygenLevel: Math.floor(Math.random() * 15) + 85
      };
    } else if (priority === "Urgent") {
      return {
        heartRate: Math.floor(Math.random() * 30) + 80,
        temperature: Math.random() * 1.5 + 98.5,
        bloodPressure: `${Math.floor(Math.random() * 30) + 120}/${Math.floor(Math.random() * 15) + 80}`,
        weight: Math.floor(Math.random() * 60) + 40,
        height: Math.floor(Math.random() * 60) + 140,
        oxygenLevel: Math.floor(Math.random() * 10) + 90
      };
    } else {
      return {
        heartRate: Math.floor(Math.random() * 30) + 60,
        temperature: Math.random() * 1.5 + 97.5,
        bloodPressure: `${Math.floor(Math.random() * 20) + 100}/${Math.floor(Math.random() * 15) + 65}`,
        weight: Math.floor(Math.random() * 70) + 30,
        height: Math.floor(Math.random() * 70) + 130,
        oxygenLevel: Math.floor(Math.random() * 5) + 95
      };
    }
  };

  // Add patient to queue
  const addPatient = async (priority: Priority, manualData?: Partial<Patient>) => {
    try {
      const patientData = manualData || {
        priority,
        name: `Patient ${Math.floor(Math.random() * 1000)}`,
        symptoms: priority === 'Critical' ? 'Emergency condition' : 
                 priority === 'Urgent' ? 'Urgent condition' : 'Routine check',
        vitals: generateVitals(priority)
      };
      
      const response = await triageApi.addPatient(patientData);
      
      setQueue(prevQueue => [...prevQueue, {
        ...response.data,
        addedTime: new Date(response.data.addedTime)
      }]);
      
      setStats(prev => ({
        ...prev,
        [`${priority.toLowerCase()}Count`]: prev[`${priority.toLowerCase()}Count`] + 1,
        totalCount: prev.totalCount + 1
      }));
      
      return response.data;
    } catch (err) {
      console.error('Error adding patient:', err);
      throw err;
    }
  };

  // Handle manual patient addition
  const handleAddPatient = async () => {
    if (!newPatient.name || !newPatient.symptoms) return;
    
    try {
      await addPatient(newPatient.priority || 'Stable', newPatient);
      setNewPatient({
        priority: 'Stable',
        vitals: {
          heartRate: 0,
          temperature: 0,
          bloodPressure: '',
          weight: 0,
          height: 0,
          oxygenLevel: 0
        }
      });
    } catch (err) {
      console.error('Failed to add patient:', err);
    }
  };

  // Assess patient (remove from queue)
  const assessPatient = async (id: string) => {
    try {
      await triageApi.assessPatient(id);
      const patient = queue.find(p => p.id === id);
      if (!patient) return;
      
      setQueue(queue.filter(p => p.id !== id));
      setStats(prev => ({
        ...prev,
        [`${patient.priority.toLowerCase()}Count`]: prev[`${patient.priority.toLowerCase()}Count`] - 1,
        totalCount: prev.totalCount - 1
      }));
    } catch (err) {
      console.error('Error assessing patient:', err);
    }
  };

  // Save edited patient
  const saveEditedPatient = async () => {
    if (!currentPatient) return;
    
    try {
      const response = await triageApi.updatePatient(currentPatient.id!, currentPatient);
      setQueue(queue.map(p => 
        p.id === currentPatient.id ? { 
          ...p, 
          ...response.data,
          addedTime: new Date(response.data.addedTime)
        } : p
      ));
      setIsEditing(false);
      setCurrentPatient(null);
    } catch (err) {
      console.error('Error updating patient:', err);
    }
  };

  // Helper functions
  const getWaitingTime = (addedTime: Date) => {
    const diff = (currentTime.getTime() - addedTime.getTime()) / 60000;
    return diff < 1 ? "just now" : `${Math.floor(diff)} min`;
  };

  const calculateBMI = (weight: number, height: number) => {
    if (weight <= 0 || height <= 0) return 'N/A';
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const generateRandomVitals = () => {
    setVitalSigns({
      heartRate: Math.floor(Math.random() * 40) + 60,
      temperature: Math.random() * 3 + 97.5,
      bloodPressure: `${Math.floor(Math.random() * 40) + 100}/${Math.floor(Math.random() * 20) + 70}`
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('afya-token');
    localStorage.removeItem('afya-user');
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading triage dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-red-500">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
          <p className="text-xl font-medium mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

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
                    <AvatarImage src="/avatars/nurse.png" />
                    <AvatarFallback>N</AvatarFallback>
                  </Avatar>
                  <span>Nurse</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => alert("Profile tools are coming soon")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
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

      <DashboardSettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        storageKey="triage"
        title="Triage Settings"
        description="Control triage queue preferences, alerts and interface behavior."
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Cross-Department Triage Routing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {flowPatients.filter((p) => p.currentStage === "triage").map((patient) => (
              <div key={patient.id} className="border rounded-md p-3 flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
                <div>
                  <p className="font-medium">{patient.name}</p>
                  <p className="text-xs text-muted-foreground">Assign to consultation department</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="flex h-9 rounded-md border border-input bg-background px-3 text-sm"
                    value={triageAssignments[patient.id] || ""}
                    onChange={(e) => setTriageAssignments((prev) => ({ ...prev, [patient.id]: e.target.value }))}
                  >
                    <option value="">Select department</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                  </select>
                  <Button
                    size="sm"
                    onClick={() => {
                      const dept = triageAssignments[patient.id];
                      if (!dept) return;
                      patientFlowApi.assignConsultationDepartment(patient.id, dept);
                    }}
                  >
                    Assign
                  </Button>
                </div>
              </div>
            ))}
            {flowPatients.filter((p) => p.currentStage === "triage").length === 0 && (
              <p className="text-sm text-muted-foreground">No patients currently waiting for triage assignment.</p>
            )}
          </CardContent>
        </Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Triage Dashboard</h1>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-sm">Nursing Station</Badge>
            
            {/* Add New Patient Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" size="sm">
                  Add New Patient
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>New Patient Assessment</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Patient Name</Label>
                      <Input
                        id="name"
                        value={newPatient.name || ''}
                        onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <select
                        id="priority"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={newPatient.priority}
                        onChange={(e) => setNewPatient({...newPatient, priority: e.target.value as Priority})}
                      >
                        <option value="Stable">Stable</option>
                        <option value="Urgent">Urgent</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="symptoms">Symptoms</Label>
                    <Input
                      id="symptoms"
                      value={newPatient.symptoms || ''}
                      onChange={(e) => setNewPatient({...newPatient, symptoms: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Vital Signs</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <Label htmlFor="heartRate" className="text-xs">Heart Rate (BPM)</Label>
                        <Input
                          id="heartRate"
                          type="number"
                          value={newPatient.vitals?.heartRate || ''}
                          onChange={(e) => setNewPatient({
                            ...newPatient, 
                            vitals: {...newPatient.vitals, heartRate: parseInt(e.target.value) || 0}
                          })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="temperature" className="text-xs">Temp (°F)</Label>
                        <Input
                          id="temperature"
                          type="number"
                          step="0.1"
                          value={newPatient.vitals?.temperature || ''}
                          onChange={(e) => setNewPatient({
                            ...newPatient, 
                            vitals: {...newPatient.vitals, temperature: parseFloat(e.target.value) || 0}
                          })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="bloodPressure" className="text-xs">BP (mmHg)</Label>
                        <Input
                          id="bloodPressure"
                          placeholder="120/80"
                          value={newPatient.vitals?.bloodPressure || ''}
                          onChange={(e) => setNewPatient({
                            ...newPatient, 
                            vitals: {...newPatient.vitals, bloodPressure: e.target.value}
                          })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="weight" className="text-xs">Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          value={newPatient.vitals?.weight || ''}
                          onChange={(e) => setNewPatient({
                            ...newPatient, 
                            vitals: {...newPatient.vitals, weight: parseInt(e.target.value) || 0}
                          })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="height" className="text-xs">Height (cm)</Label>
                        <Input
                          id="height"
                          type="number"
                          value={newPatient.vitals?.height || ''}
                          onChange={(e) => setNewPatient({
                            ...newPatient, 
                            vitals: {...newPatient.vitals, height: parseInt(e.target.value) || 0}
                          })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="oxygenLevel" className="text-xs">O₂ Sat (%)</Label>
                        <Input
                          id="oxygenLevel"
                          type="number"
                          min="0"
                          max="100"
                          value={newPatient.vitals?.oxygenLevel || ''}
                          onChange={(e) => setNewPatient({
                            ...newPatient, 
                            vitals: {...newPatient.vitals, oxygenLevel: parseInt(e.target.value) || 0}
                          })}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                      id="notes"
                      value={newPatient.notes || ''}
                      onChange={(e) => setNewPatient({...newPatient, notes: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleAddPatient}>Add Patient</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card/50 backdrop-blur border-l-4 border-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{stats.criticalCount}</div>
              <p className="text-xs text-muted-foreground">Immediate attention</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-l-4 border-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgent</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{stats.urgentCount}</div>
              <p className="text-xs text-muted-foreground">Within 30 minutes</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-l-4 border-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stable</CardTitle>
              <Heart className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{stats.stableCount}</div>
              <p className="text-xs text-muted-foreground">Standard care</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCount}</div>
              <p className="text-xs text-muted-foreground">In triage queue</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Vital Signs Monitor</CardTitle>
                <Button size="sm" variant="outline" onClick={generateRandomVitals}>
                  Simulate New Reading
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Heart Rate</span>
                  </div>
                  <span className="font-mono">{vitalSigns.heartRate} BPM</span>
                </div>
                <Progress 
                  value={vitalSigns.heartRate} 
                  max={150}
                  className="h-2" 
                  indicatorColor={
                    vitalSigns.heartRate > 100 ? "bg-red-500" : 
                    vitalSigns.heartRate > 85 ? "bg-yellow-500" : "bg-green-500"
                  }
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Temperature</span>
                  </div>
                  <span className="font-mono">{vitalSigns.temperature.toFixed(1)}°F</span>
                </div>
                <Progress 
                  value={vitalSigns.temperature} 
                  min={97}
                  max={103}
                  className="h-2" 
                  indicatorColor={
                    vitalSigns.temperature > 100.4 ? "bg-red-500" : 
                    vitalSigns.temperature > 99.5 ? "bg-yellow-500" : "bg-blue-500"
                  }
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Blood Pressure</span>
                  </div>
                  <span className="font-mono">{vitalSigns.bloodPressure}</span>
                </div>
                <Progress 
                  value={parseInt(vitalSigns.bloodPressure.split('/')[0])} 
                  max={180}
                  className="h-2" 
                  indicatorColor={
                    parseInt(vitalSigns.bloodPressure.split('/')[0]) > 140 ? "bg-red-500" : 
                    parseInt(vitalSigns.bloodPressure.split('/')[0]) > 120 ? "bg-yellow-500" : "bg-green-500"
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Quick Assessment</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col"
                onClick={() => addPatient("Critical")}
              >
                <AlertTriangle className="h-6 w-6 mb-2 text-red-500" />
                Emergency
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col"
                onClick={() => addPatient("Urgent")}
              >
                <Clock className="h-6 w-6 mb-2 text-yellow-500" />
                Urgent Care
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col"
                onClick={() => addPatient("Stable")}
              >
                <Heart className="h-6 w-6 mb-2 text-green-500" />
                Routine
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col"
                onClick={() => addPatient("Stable")}
              >
                <Activity className="h-6 w-6 mb-2" />
                Follow-up
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Current Triage Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {queue.map((patient) => {
                const borderColor = patient.priority === 'Critical' ? 'border-red-500' : 
                                   patient.priority === 'Urgent' ? 'border-yellow-500' : 'border-green-500';
                                   
                const badgeVariant = patient.priority === "Critical" ? "destructive" : 
                                    patient.priority === "Urgent" ? "default" : "secondary";
                
                return (
                  <div 
                    key={patient.id} 
                    className={`flex items-center justify-between p-4 rounded-lg bg-muted/50 border-l-4 ${borderColor}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-muted-foreground">{patient.symptoms}</div>
                        {patient.notes && (
                          <div className="text-xs text-muted-foreground mt-1">{patient.notes}</div>
                        )}
                      </div>
                      <Badge variant="secondary">{patient.id}</Badge>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-mono">
                          HR: {patient.vitals.heartRate} | BP: {patient.vitals.bloodPressure} | 
                          O₂: {patient.vitals.oxygenLevel}%
                        </div>
                        <div className="text-xs font-mono">
                          <Scale className="inline h-3 w-3 mr-1" />
                          {patient.vitals.weight}kg | 
                          <Ruler className="inline h-3 w-3 mx-1" />
                          {patient.vitals.height}cm | BMI: {calculateBMI(patient.vitals.weight, patient.vitals.height)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Waiting {getWaitingTime(patient.addedTime)}
                        </div>
                      </div>
                      <Badge variant={badgeVariant}>
                        {patient.priority}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setCurrentPatient(patient);
                            setIsEditing(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => assessPatient(patient.id)}
                          className="bg-primary hover:bg-primary/90 text-white"
                        >
                          Assess
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Patient Dialog */}
      {isEditing && currentPatient && (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Patient: {currentPatient.name}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Patient Name</Label>
                  <Input
                    id="edit-name"
                    value={currentPatient.name || ''}
                    onChange={(e) => setCurrentPatient({...currentPatient, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-priority">Priority</Label>
                  <select
                    id="edit-priority"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={currentPatient.priority}
                    onChange={(e) => setCurrentPatient({...currentPatient, priority: e.target.value as Priority})}
                  >
                    <option value="Stable">Stable</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-symptoms">Symptoms</Label>
                <Input
                  id="edit-symptoms"
                  value={currentPatient.symptoms || ''}
                  onChange={(e) => setCurrentPatient({...currentPatient, symptoms: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Vital Signs</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="edit-heartRate" className="text-xs">Heart Rate (BPM)</Label>
                    <Input
                      id="edit-heartRate"
                      type="number"
                      value={currentPatient.vitals?.heartRate || ''}
                      onChange={(e) => setCurrentPatient({
                        ...currentPatient, 
                        vitals: {...currentPatient.vitals, heartRate: parseInt(e.target.value) || 0}
                      })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="edit-temperature" className="text-xs">Temp (°F)</Label>
                    <Input
                      id="edit-temperature"
                      type="number"
                      step="0.1"
                      value={currentPatient.vitals?.temperature || ''}
                      onChange={(e) => setCurrentPatient({
                        ...currentPatient, 
                        vitals: {...currentPatient.vitals, temperature: parseFloat(e.target.value) || 0}
                      })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="edit-bloodPressure" className="text-xs">BP (mmHg)</Label>
                    <Input
                      id="edit-bloodPressure"
                      placeholder="120/80"
                      value={currentPatient.vitals?.bloodPressure || ''}
                      onChange={(e) => setCurrentPatient({
                        ...currentPatient, 
                        vitals: {...currentPatient.vitals, bloodPressure: e.target.value}
                      })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="edit-weight" className="text-xs">Weight (kg)</Label>
                    <Input
                      id="edit-weight"
                      type="number"
                      value={currentPatient.vitals?.weight || ''}
                      onChange={(e) => setCurrentPatient({
                        ...currentPatient, 
                        vitals: {...currentPatient.vitals, weight: parseInt(e.target.value) || 0}
                      })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="edit-height" className="text-xs">Height (cm)</Label>
                    <Input
                      id="edit-height"
                      type="number"
                      value={currentPatient.vitals?.height || ''}
                      onChange={(e) => setCurrentPatient({
                        ...currentPatient, 
                        vitals: {...currentPatient.vitals, height: parseInt(e.target.value) || 0}
                      })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="edit-oxygenLevel" className="text-xs">O₂ Sat (%)</Label>
                    <Input
                      id="edit-oxygenLevel"
                      type="number"
                      min="0"
                      max="100"
                      value={currentPatient.vitals?.oxygenLevel || ''}
                      onChange={(e) => setCurrentPatient({
                        ...currentPatient, 
                        vitals: {...currentPatient.vitals, oxygenLevel: parseInt(e.target.value) || 0}
                      })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Input
                  id="edit-notes"
                  value={currentPatient.notes || ''}
                  onChange={(e) => setCurrentPatient({...currentPatient, notes: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={saveEditedPatient}>
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}