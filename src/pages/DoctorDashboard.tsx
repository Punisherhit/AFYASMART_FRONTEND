import { useEffect, useState } from "react";
import { ArrowLeft, Users, FileText, Stethoscope, AlertTriangle, Pill, Phone, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FlowPatient, patientFlowApi, stageLabel } from "@/services/patientFlow";

type Patient = {
  id: number;
  name: string;
  time: string;
  type: string;
  urgency: string;
  status: "waiting" | "in-progress" | "completed";
  details?: PatientDetails;
};

type PatientDetails = {
  vitals: {
    bloodPressure: string;
    temperature: string;
    heartRate: string;
    oxygenLevel: string;
  };
  symptoms: string;
  notes: string;
  diagnosis: string;
};

type Department = {
  id: string;
  name: string;
  currentWaitTime: string;
};

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientDetails, setPatientDetails] = useState<PatientDetails>({
    vitals: {
      bloodPressure: "",
      temperature: "",
      heartRate: "",
      oxygenLevel: "",
    },
    symptoms: "",
    notes: "",
    diagnosis: "",
  });
  const [referralData, setReferralData] = useState({
    departmentId: "",
    reason: "",
    priority: "routine",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [flowPatients, setFlowPatients] = useState<FlowPatient[]>([]);
  const [doctorPrescription, setDoctorPrescription] = useState<Record<string, string>>({});

  useEffect(() => {
    const sync = () => setFlowPatients(patientFlowApi.getAll());
    sync();
    const unsubscribe = patientFlowApi.subscribe(sync);
    return unsubscribe;
  }, []);


  const menuItems = [
    { id: "overview", label: "Overview", icon: Stethoscope },
    { id: "patients", label: "My Patients", icon: Users },
    { id: "prescriptions", label: "Prescriptions", icon: Pill },
    { id: "referrals", label: "Referrals", icon: FileText },
    { id: "emergency", label: "Emergency", icon: AlertTriangle },
  ];

  const departments: Department[] = [
    { id: "cardio", name: "Cardiology", currentWaitTime: "15 min" },
    { id: "radio", name: "Radiology", currentWaitTime: "30 min" },
    { id: "lab", name: "Laboratory", currentWaitTime: "20 min" },
    { id: "neuro", name: "Neurology", currentWaitTime: "45 min" },
    { id: "ortho", name: "Orthopedics", currentWaitTime: "60 min" },
  ];

  const [todayPatients, setTodayPatients] = useState<Patient[]>([
    { 
      id: 1, 
      name: "John Doe", 
      time: "9:00 AM", 
      type: "Consultation", 
      urgency: "Normal",
      status: "in-progress",
      details: {
        vitals: {
          bloodPressure: "120/80",
          temperature: "98.6°F",
          heartRate: "72 bpm",
          oxygenLevel: "98%"
        },
        symptoms: "Chest pain, shortness of breath",
        notes: "Patient reports symptoms started yesterday",
        diagnosis: "Possible angina, needs further tests"
      }
    },
    { 
      id: 2, 
      name: "Jane Smith", 
      time: "10:30 AM", 
      type: "Follow-up", 
      urgency: "Critical",
      status: "waiting"
    },
    { 
      id: 3, 
      name: "Mike Johnson", 
      time: "2:00 PM", 
      type: "Check-up", 
      urgency: "Normal",
      status: "waiting"
    },
  ]);

  const recentPrescriptions = [
    { id: 1, patient: "John Doe", medication: "Amoxicillin 500mg", date: "2024-01-10", status: "Active" },
    { id: 2, patient: "Jane Smith", medication: "Ibuprofen 200mg", date: "2024-01-09", status: "Completed" },
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Critical": return "destructive";
      case "Urgent": return "default";
      default: return "secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-progress": return "default";
      case "completed": return "secondary";
      default: return "outline";
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    if (patient.details) {
      setPatientDetails(patient.details);
    }
  };

  const handlePatientDetailsChange = (field: keyof PatientDetails, value: string) => {
    setPatientDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVitalsChange = (field: keyof PatientDetails['vitals'], value: string) => {
    setPatientDetails(prev => ({
      ...prev,
      vitals: {
        ...prev.vitals,
        [field]: value
      }
    }));
  };

  const savePatientDetails = () => {
    if (!selectedPatient) return;
    
    const updatedPatients = todayPatients.map(p => 
      p.id === selectedPatient.id 
        ? { ...p, details: patientDetails, status: "completed" } 
        : p
    );
    
    setTodayPatients(updatedPatients);
    setSelectedPatient(null);
  };

  const handleReferralSubmit = () => {
    if (!selectedPatient || !referralData.departmentId) return;
    
    alert(`Patient ${selectedPatient.name} referred to ${departments.find(d => d.id === referralData.departmentId)?.name}`);
    // In a real app, this would send data to backend
    setReferralData({ departmentId: "", reason: "", priority: "routine" });
  };

  const filteredPatients = todayPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('afya-token');
    localStorage.removeItem('afya-user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center justify-between p-4">
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
            <div>
              <h1 className="text-2xl font-bold text-foreground">Doctor Dashboard</h1>
              <p className="text-muted-foreground">Dr. Sarah Johnson - Cardiology</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="default">Doctor</Badge>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-border bg-card h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Cross-Department Consultation Queue</CardTitle>
              <CardDescription>Patients assigned from triage: decide admission, lab tests, referrals, and billing handoff.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {flowPatients.filter((p) => p.currentStage === "consultation").map((patient) => (
                <div key={patient.id} className="border rounded-md p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-xs text-muted-foreground">Department: {patient.consultationDepartment || "General"}</p>
                    </div>
                    <Badge variant="outline">{stageLabel[patient.currentStage]}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Input
                      placeholder="Prescription (e.g. Amoxicillin 500mg)"
                      value={doctorPrescription[patient.id] || ""}
                      onChange={(e) => setDoctorPrescription((prev) => ({ ...prev, [patient.id]: e.target.value }))}
                      className="max-w-xs"
                    />
                    <Button size="sm" variant="outline" onClick={() => {
                      const text = doctorPrescription[patient.id]?.trim();
                      if (!text) return;
                      patientFlowApi.addPrescription(patient.id, text);
                      setDoctorPrescription((prev) => ({ ...prev, [patient.id]: "" }));
                    }}>Add Prescription</Button>
                    <Button size="sm" onClick={() => patientFlowApi.moveStage(patient.id, "lab", "Doctor requested laboratory tests")}>Send to Lab</Button>
                    <Button size="sm" variant="outline" onClick={() => patientFlowApi.moveStage(patient.id, "billing", "Doctor completed consultation and sent to billing")}>Send to Billing</Button>
                    <Button size="sm" variant="secondary" onClick={() => patientFlowApi.moveStage(patient.id, "completed", "Patient admitted for inpatient care")}>Admit</Button>
                  </div>
                </div>
              ))}
              {flowPatients.filter((p) => p.currentStage === "consultation").length === 0 && (
                <p className="text-sm text-muted-foreground">No patients waiting for doctor consultation from triage.</p>
              )}
            </CardContent>
          </Card>
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* ... (existing overview content remains the same) ... */}
            </div>
          )}

          {activeTab === "patients" && (
            <div className="space-y-6">
              {selectedPatient ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Patient Examination</CardTitle>
                        <CardDescription>{selectedPatient.name} - {selectedPatient.type}</CardDescription>
                      </div>
                      <Badge variant={getStatusColor(selectedPatient.status)}>
                        {selectedPatient.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Vitals Section */}
                      <div className="space-y-4">
                        <h3 className="font-medium">Vital Signs</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-muted-foreground">Blood Pressure</label>
                            <Input 
                              value={patientDetails.vitals.bloodPressure}
                              onChange={(e) => handleVitalsChange('bloodPressure', e.target.value)}
                              placeholder="120/80"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Temperature</label>
                            <Input 
                              value={patientDetails.vitals.temperature}
                              onChange={(e) => handleVitalsChange('temperature', e.target.value)}
                              placeholder="98.6°F"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Heart Rate</label>
                            <Input 
                              value={patientDetails.vitals.heartRate}
                              onChange={(e) => handleVitalsChange('heartRate', e.target.value)}
                              placeholder="72 bpm"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Oxygen Level</label>
                            <Input 
                              value={patientDetails.vitals.oxygenLevel}
                              onChange={(e) => handleVitalsChange('oxygenLevel', e.target.value)}
                              placeholder="98%"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="space-y-4">
                        <h3 className="font-medium">Actions</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <Button variant="outline" className="h-20 flex-col">
                            <Pill className="h-6 w-6 mb-2" />
                            Prescribe
                          </Button>
                          <Button 
                            variant="outline" 
                            className="h-20 flex-col"
                            onClick={() => setActiveTab("referrals")}
                          >
                            <FileText className="h-6 w-6 mb-2" />
                            Refer
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Symptoms and Notes */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-muted-foreground">Symptoms</label>
                        <Textarea
                          value={patientDetails.symptoms}
                          onChange={(e) => handlePatientDetailsChange('symptoms', e.target.value)}
                          placeholder="Patient reported symptoms..."
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Diagnosis</label>
                        <Input
                          value={patientDetails.diagnosis}
                          onChange={(e) => handlePatientDetailsChange('diagnosis', e.target.value)}
                          placeholder="Preliminary diagnosis..."
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Notes</label>
                        <Textarea
                          value={patientDetails.notes}
                          onChange={(e) => handlePatientDetailsChange('notes', e.target.value)}
                          placeholder="Additional notes..."
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setSelectedPatient(null)}>
                        Cancel
                      </Button>
                      <Button onClick={savePatientDetails}>
                        Save & Complete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Patient Management</h2>
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search patients..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Today's Patients</CardTitle>
                      <CardDescription>Click on a patient to examine and enter details</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {filteredPatients.map((patient) => (
                          <div 
                            key={patient.id} 
                            className="flex justify-between items-center p-3 border rounded-lg hover:bg-accent cursor-pointer"
                            onClick={() => handlePatientSelect(patient)}
                          >
                            <div>
                              <p className="font-medium">{patient.name}</p>
                              <p className="text-sm text-muted-foreground">{patient.type}</p>
                            </div>
                            <div className="text-right space-y-1">
                              <p className="text-sm font-medium">{patient.time}</p>
                              <div className="flex gap-2 justify-end">
                                <Badge variant={getUrgencyColor(patient.urgency)}>
                                  {patient.urgency}
                                </Badge>
                                <Badge variant={getStatusColor(patient.status)}>
                                  {patient.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}

          {activeTab === "prescriptions" && (
            <Card>
              <CardHeader>
                <CardTitle>Prescriptions</CardTitle>
                <CardDescription>Create and manage patient prescriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Prescription management will be implemented here.</p>
              </CardContent>
            </Card>
          )}

          {activeTab === "referrals" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Referral</CardTitle>
                  <CardDescription>
                    {selectedPatient 
                      ? `Referring ${selectedPatient.name} to another department`
                      : "Select a patient from the Patients tab first"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedPatient ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-muted-foreground">Department</label>
                          <Select
                            value={referralData.departmentId}
                            onValueChange={(value) => setReferralData({...referralData, departmentId: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map((dept) => (
                                <SelectItem key={dept.id} value={dept.id}>
                                  <div className="flex justify-between">
                                    <span>{dept.name}</span>
                                    <span className="text-muted-foreground">{dept.currentWaitTime}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Priority</label>
                          <Select
                            value={referralData.priority}
                            onValueChange={(value) => setReferralData({...referralData, priority: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="routine">Routine</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                              <SelectItem value="emergency">Emergency</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Reason for Referral</label>
                        <Textarea
                          value={referralData.reason}
                          onChange={(e) => setReferralData({...referralData, reason: e.target.value})}
                          placeholder="Explain the reason for referral..."
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setActiveTab("patients")}>
                          Back to Patient
                        </Button>
                        <Button onClick={handleReferralSubmit}>
                          Submit Referral
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No patient selected</p>
                      <Button onClick={() => setActiveTab("patients")}>
                        <Users className="h-4 w-4 mr-2" />
                        Select Patient
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Referrals</CardTitle>
                  <CardDescription>Your recent patient referrals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 text-center">
                    <p className="text-muted-foreground">No recent referrals</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "emergency" && (
            <Card>
              <CardHeader>
                <CardTitle>Emergency Actions</CardTitle>
                <CardDescription>Emergency procedures and ambulance dispatch</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Emergency system will be implemented here.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;