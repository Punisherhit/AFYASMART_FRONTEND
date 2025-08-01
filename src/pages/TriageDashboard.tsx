import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Thermometer, Activity, Clock, AlertTriangle, Users, Scale, Ruler, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  // State for patient counts
  const [criticalCount, setCriticalCount] = useState(3);
  const [urgentCount, setUrgentCount] = useState(12);
  const [stableCount, setStableCount] = useState(28);
  const totalCount = criticalCount + urgentCount + stableCount;
  
  // State for vital signs monitor
  const [vitalSigns, setVitalSigns] = useState({
    heartRate: 78,
    temperature: 98.6,
    bloodPressure: "120/80"
  });
  
  // State for current patient being edited
  const [currentPatient, setCurrentPatient] = useState<Partial<Patient> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // State for new patient form
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

  // State for patient queue
  const [queue, setQueue] = useState<Patient[]>([
    { 
      id: "T001", 
      name: "Sarah Wilson", 
      priority: "Critical", 
      symptoms: "Chest pain", 
      addedTime: new Date(Date.now() - 5 * 60000), 
      vitals: { 
        heartRate: 95, 
        temperature: 99.2, 
        bloodPressure: "140/90",
        weight: 68,
        height: 165,
        oxygenLevel: 92
      },
      notes: "History of heart disease"
    },
    { 
      id: "T002", 
      name: "Robert Brown", 
      priority: "Urgent", 
      symptoms: "Severe headache", 
      addedTime: new Date(Date.now() - 15 * 60000), 
      vitals: { 
        heartRate: 82, 
        temperature: 98.8, 
        bloodPressure: "130/85",
        weight: 85,
        height: 180,
        oxygenLevel: 97
      } 
    },
    { 
      id: "T003", 
      name: "Emma Davis", 
      priority: "Stable", 
      symptoms: "Minor cut", 
      addedTime: new Date(Date.now() - 25 * 60000), 
      vitals: { 
        heartRate: 72, 
        temperature: 98.6, 
        bloodPressure: "110/70",
        weight: 62,
        height: 170,
        oxygenLevel: 98
      } 
    },
    { 
      id: "T004", 
      name: "David Miller", 
      priority: "Stable", 
      symptoms: "Cold symptoms", 
      addedTime: new Date(Date.now() - 35 * 60000), 
      vitals: { 
        heartRate: 68, 
        temperature: 98.4, 
        bloodPressure: "105/65",
        weight: 90,
        height: 185,
        oxygenLevel: 99
      } 
    },
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());
  const nextIdRef = useRef(5);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Generate random vital signs based on priority
  const generateVitals = (priority: Priority) => {
    if (priority === "Critical") {
      return {
        heartRate: Math.floor(Math.random() * 40) + 100, // 100-140
        temperature: Math.random() * 2 + 99.5, // 99.5-101.5
        bloodPressure: `${Math.floor(Math.random() * 40) + 140}/${Math.floor(Math.random() * 20) + 90}`, // 140/90-180/110
        weight: Math.floor(Math.random() * 50) + 50, // 50-100kg
        height: Math.floor(Math.random() * 50) + 150, // 150-200cm
        oxygenLevel: Math.floor(Math.random() * 15) + 85 // 85-100%
      };
    } else if (priority === "Urgent") {
      return {
        heartRate: Math.floor(Math.random() * 30) + 80, // 80-110
        temperature: Math.random() * 1.5 + 98.5, // 98.5-100
        bloodPressure: `${Math.floor(Math.random() * 30) + 120}/${Math.floor(Math.random() * 15) + 80}`, // 120/80-150/95
        weight: Math.floor(Math.random() * 60) + 40, // 40-100kg
        height: Math.floor(Math.random() * 60) + 140, // 140-200cm
        oxygenLevel: Math.floor(Math.random() * 10) + 90 // 90-100%
      };
    } else {
      return {
        heartRate: Math.floor(Math.random() * 30) + 60, // 60-90
        temperature: Math.random() * 1.5 + 97.5, // 97.5-99
        bloodPressure: `${Math.floor(Math.random() * 20) + 100}/${Math.floor(Math.random() * 15) + 65}`, // 100/65-120/80
        weight: Math.floor(Math.random() * 70) + 30, // 30-100kg
        height: Math.floor(Math.random() * 70) + 130, // 130-200cm
        oxygenLevel: Math.floor(Math.random() * 5) + 95 // 95-100%
      };
    }
  };

  // Add a new patient to the queue (manual or quick)
  const addPatient = (priority: Priority, manualData?: Partial<Patient>) => {
    const names = [
      "James Taylor", "Olivia Garcia", "William Lee", "Sophia Martinez", 
      "Benjamin Clark", "Isabella Rodriguez", "Lucas Hernandez", "Mia Lopez",
      "Henry Walker", "Charlotte Perez", "Alexander Hall", "Amelia Young"
    ];
    
    const symptomsMap = {
      Critical: ["Chest pain", "Difficulty breathing", "Severe bleeding", "Unconsciousness"],
      Urgent: ["Broken bone", "High fever", "Severe abdominal pain", "Head injury"],
      Stable: ["Rash", "Mild fever", "Sore throat", "Minor cut"]
    };

    const newPatient: Patient = manualData ? {
      id: `T${nextIdRef.current.toString().padStart(3, '0')}`,
      name: manualData.name || names[Math.floor(Math.random() * names.length)],
      priority: manualData.priority || priority,
      symptoms: manualData.symptoms || symptomsMap[priority][Math.floor(Math.random() * symptomsMap[priority].length)],
      addedTime: new Date(),
      vitals: {
        heartRate: manualData.vitals?.heartRate || generateVitals(priority).heartRate,
        temperature: manualData.vitals?.temperature || generateVitals(priority).temperature,
        bloodPressure: manualData.vitals?.bloodPressure || generateVitals(priority).bloodPressure,
        weight: manualData.vitals?.weight || generateVitals(priority).weight,
        height: manualData.vitals?.height || generateVitals(priority).height,
        oxygenLevel: manualData.vitals?.oxygenLevel || generateVitals(priority).oxygenLevel
      },
      notes: manualData.notes
    } : {
      id: `T${nextIdRef.current.toString().padStart(3, '0')}`,
      name: names[Math.floor(Math.random() * names.length)],
      priority,
      symptoms: symptomsMap[priority][Math.floor(Math.random() * symptomsMap[priority].length)],
      addedTime: new Date(),
      vitals: generateVitals(priority)
    };
    
    setQueue([...queue, newPatient]);
    
    // Update counts
    if (priority === "Critical") setCriticalCount(c => c + 1);
    else if (priority === "Urgent") setUrgentCount(c => c + 1);
    else setStableCount(c => c + 1);
    
    nextIdRef.current++;
  };

  // Handle manual patient addition
  const handleAddPatient = () => {
    if (!newPatient.name || !newPatient.symptoms) return;
    addPatient(newPatient.priority || 'Stable', newPatient);
    
    // Reset form
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
  };

  // Assess a patient (remove from queue)
  const assessPatient = (id: string) => {
    const patient = queue.find(p => p.id === id);
    if (!patient) return;
    
    setQueue(queue.filter(p => p.id !== id));
    
    // Update counts
    if (patient.priority === "Critical") setCriticalCount(c => c - 1);
    else if (patient.priority === "Urgent") setUrgentCount(c => c - 1);
    else setStableCount(c => c - 1);
  };

  // Edit patient data
  const editPatient = (patient: Patient) => {
    setCurrentPatient(patient);
    setIsEditing(true);
  };

  // Save edited patient data
  const saveEditedPatient = () => {
    if (!currentPatient) return;
    
    setQueue(queue.map(p => 
      p.id === currentPatient.id ? { ...p, ...currentPatient } as Patient : p
    ));
    
    setIsEditing(false);
    setCurrentPatient(null);
  };

  // Calculate waiting time in minutes
  const getWaitingTime = (addedTime: Date) => {
    const diff = (currentTime.getTime() - addedTime.getTime()) / 60000;
    return diff < 1 ? "just now" : `${Math.floor(diff)} min`;
  };

  // Calculate BMI
  const calculateBMI = (weight: number, height: number) => {
    if (weight <= 0 || height <= 0) return 'N/A';
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    return bmi;
  };

  // Generate random vital signs for the monitor
  const generateRandomVitals = () => {
    setVitalSigns({
      heartRate: Math.floor(Math.random() * 40) + 60, // 60-100
      temperature: Math.random() * 3 + 97.5, // 97.5-100.5
      bloodPressure: `${Math.floor(Math.random() * 40) + 100}/${Math.floor(Math.random() * 20) + 70}` // 100/70-140/90
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
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
              <div className="text-2xl font-bold text-red-500">{criticalCount}</div>
              <p className="text-xs text-muted-foreground">Immediate attention</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-l-4 border-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgent</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{urgentCount}</div>
              <p className="text-xs text-muted-foreground">Within 30 minutes</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-l-4 border-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stable</CardTitle>
              <Heart className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{stableCount}</div>
              <p className="text-xs text-muted-foreground">Standard care</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCount}</div>
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
                          onClick={() => editPatient(patient)}
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