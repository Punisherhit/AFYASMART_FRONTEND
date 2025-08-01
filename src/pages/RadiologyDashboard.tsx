import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, Download, Eye, Scan, Image, Camera, Monitor, 
  Edit, Save, X, Send, User, ArrowRight, Check, ClipboardList
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Types
type PatientScan = {
  id: string;
  patient: string;
  type: string;
  priority: string;
  time: string;
  status: string;
  completed?: boolean;
};

type Equipment = {
  id: string;
  name: string;
  status: string;
  utilization: number;
  nextAvailable: string;
};

type Report = {
  id: string;
  patient: string;
  scan: string;
  date: string;
  radiologist: string;
  status: string;
};

type Department = 'Cardiology' | 'Orthopedics' | 'Neurology' | 'Oncology' | 'General' | 'Radiology';

type StatCard = {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  editable?: boolean;
  field?: string;
};

const RadiologyDashboard = () => {
  // States
  const [queue, setQueue] = useState<PatientScan[]>([
    { id: "R001", patient: "John Smith", type: "Chest X-Ray", priority: "Urgent", time: "10:30 AM", status: "In Progress" },
    { id: "R002", patient: "Maria Garcia", type: "Brain MRI", priority: "Standard", time: "11:00 AM", status: "Scheduled" },
    { id: "R003", patient: "James Wilson", type: "Abdominal CT", priority: "Standard", time: "11:30 AM", status: "Waiting" },
    { id: "R004", patient: "Lisa Johnson", type: "Knee X-Ray", priority: "Routine", time: "12:00 PM", status: "Scheduled" },
    { id: "R005", patient: "Robert Brown", type: "Spine X-Ray", priority: "Urgent", time: "12:30 PM", status: "Waiting", completed: true },
  ]);

  const [equipment, setEquipment] = useState<Equipment[]>([
    { id: "E001", name: "X-Ray Machine #1", status: "Active", utilization: 85, nextAvailable: "11:45 AM" },
    { id: "E002", name: "MRI Scanner", status: "In Use", utilization: 92, nextAvailable: "2:30 PM" },
    { id: "E003", name: "CT Scanner #1", status: "Available", utilization: 45, nextAvailable: "Now" },
    { id: "E004", name: "CT Scanner #2", status: "Maintenance", utilization: 0, nextAvailable: "Tomorrow" },
    { id: "E005", name: "Ultrasound #1", status: "Active", utilization: 67, nextAvailable: "12:15 PM" },
    { id: "E006", name: "X-Ray Machine #2", status: "Available", utilization: 23, nextAvailable: "Now" },
  ]);

  const [reports, setReports] = useState<Report[]>([
    { id: "REP001", patient: "Anna Brown", scan: "Chest X-Ray", date: "Today 9:30 AM", radiologist: "Dr. Smith", status: "Completed" },
    { id: "REP002", patient: "Tom Wilson", scan: "Brain MRI", date: "Today 8:45 AM", radiologist: "Dr. Johnson", status: "Under Review" },
    { id: "REP003", patient: "Sarah Davis", scan: "Knee CT", date: "Yesterday 4:20 PM", radiologist: "Dr. Smith", status: "Completed" },
  ]);

  const [stats, setStats] = useState<StatCard[]>([
    { title: "Pending Scans", value: 15, description: "Awaiting imaging", icon: <Scan className="h-4 w-4 text-muted-foreground" />, editable: true, field: "pendingScans" },
    { title: "X-Rays Today", value: 32, description: "+8 from yesterday", icon: <Image className="h-4 w-4 text-muted-foreground" />, editable: true, field: "xraysToday" },
    { title: "MRI Scans", value: 8, description: "Scheduled today", icon: <Monitor className="h-4 w-4 text-muted-foreground" />, editable: true, field: "mriScans" },
    { title: "Reports Ready", value: 23, description: "Awaiting review", icon: <Upload className="h-4 w-4 text-muted-foreground" />, editable: true, field: "reportsReady" },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PatientScan>>({});
  const [editingEquipmentId, setEditingEquipmentId] = useState<string | null>(null);
  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  const [editingStatIndex, setEditingStatIndex] = useState<number | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department>('Cardiology');
  
  // Departments for transfer
  const departments: Department[] = ['Cardiology', 'Orthopedics', 'Neurology', 'Oncology', 'General'];

  // Handlers
  const handleStartScan = (id: string) => {
    setQueue(queue.map(scan => 
      scan.id === id ? { ...scan, status: "In Progress" } : scan
    ));
  };

  const handleCompleteScan = (id: string) => {
    setQueue(queue.map(scan => 
      scan.id === id ? { ...scan, status: "Completed", completed: true } : scan
    ));
  };

  const handleEdit = (id: string) => {
    const patient = queue.find(p => p.id === id);
    if (patient) {
      setEditingId(id);
      setEditForm({ ...patient });
    }
  };

  const handleEditEquipment = (id: string) => {
    const equip = equipment.find(e => e.id === id);
    if (equip) {
      setEditingEquipmentId(id);
      setEditForm({ ...equip });
    }
  };

  const handleEditReport = (id: string) => {
    const report = reports.find(r => r.id === id);
    if (report) {
      setEditingReportId(id);
      setEditForm({ ...report });
    }
  };

  const handleEditStat = (index: number) => {
    setEditingStatIndex(index);
  };

  const handleSave = (type: 'patient' | 'equipment' | 'report' | 'stat') => {
    switch(type) {
      case 'patient':
        setQueue(queue.map(item => 
          item.id === editingId ? { ...item, ...editForm } : item
        ));
        setEditingId(null);
        break;
      case 'equipment':
        setEquipment(equipment.map(item => 
          item.id === editingEquipmentId ? { ...item, ...editForm } : item
        ));
        setEditingEquipmentId(null);
        break;
      case 'report':
        setReports(reports.map(item => 
          item.id === editingReportId ? { ...item, ...editForm } : item
        ));
        setEditingReportId(null);
        break;
      case 'stat':
        if (editingStatIndex !== null) {
          const newStats = [...stats];
          newStats[editingStatIndex] = { 
            ...newStats[editingStatIndex], 
            value: editForm.value as number 
          };
          setStats(newStats);
          setEditingStatIndex(null);
        }
        break;
    }
    setEditForm({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingEquipmentId(null);
    setEditingReportId(null);
    setEditingStatIndex(null);
    setEditForm({});
  };

  const handleInputChange = (field: string, value: string | number) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSendToDepartment = (id: string) => {
    setSendingId(id);
  };

  const confirmTransfer = () => {
    if (sendingId) {
      // In a real app, this would send data to backend
      alert(`Patient ${sendingId} sent to ${selectedDepartment} department`);
      setQueue(queue.filter(scan => scan.id !== sendingId));
      setSendingId(null);
    }
  };

  const cancelTransfer = () => {
    setSendingId(null);
  };

  // Calculate dynamic stats based on actual data
  const calculatedStats = [
    { ...stats[0], value: queue.filter(s => !s.completed).length },
    { ...stats[1], value: queue.filter(s => s.type.includes('X-Ray')).length },
    { ...stats[2], value: queue.filter(s => s.type.includes('MRI')).length },
    { ...stats[3], value: reports.filter(r => r.status === 'Completed').length }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Radiology Dashboard</h1>
          <Badge variant="outline" className="text-sm">Imaging Department</Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {calculatedStats.map((stat, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className="flex items-center gap-2">
                  {stat.icon}
                  {stat.editable && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4"
                      onClick={() => handleEditStat(index)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {editingStatIndex === index ? (
                  <div className="flex flex-col gap-2">
                    <Input 
                      type="number" 
                      value={editForm.value !== undefined ? editForm.value : stat.value}
                      onChange={(e) => handleInputChange('value', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={handleCancel}>
                        <X className="h-3 w-3" />
                      </Button>
                      <Button size="sm" onClick={() => handleSave('stat')}>
                        <Save className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="queue" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="queue">Imaging Queue</TabsTrigger>
            <TabsTrigger value="equipment">Equipment Status</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="archive">Archive</TabsTrigger>
          </TabsList>

          {/* Imaging Queue Tab */}
          <TabsContent value="queue" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Imaging Queue</CardTitle>
                  <Badge variant="outline">
                    {queue.filter(s => !s.completed).length} Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {queue.map((scan) => (
                    <div 
                      key={scan.id} 
                      className={`flex items-center justify-between p-4 rounded-lg ${scan.completed ? 'bg-green-500/10' : 'bg-muted/50'}`}
                    >
                      {editingId === scan.id ? (
                        // Edit Mode
                        <div className="flex flex-col w-full gap-3">
                          <div className="flex gap-2 items-center">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <Input 
                              value={editForm.patient || ''} 
                              onChange={(e) => handleInputChange('patient', e.target.value)}
                              className="w-full"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <Select 
                              value={editForm.type || ''}
                              onValueChange={(value) => handleInputChange('type', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Scan Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Chest X-Ray">Chest X-Ray</SelectItem>
                                <SelectItem value="Brain MRI">Brain MRI</SelectItem>
                                <SelectItem value="Abdominal CT">Abdominal CT</SelectItem>
                                <SelectItem value="Knee X-Ray">Knee X-Ray</SelectItem>
                                <SelectItem value="Spine X-Ray">Spine X-Ray</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <Select 
                              value={editForm.priority || ''}
                              onValueChange={(value) => handleInputChange('priority', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Urgent">Urgent</SelectItem>
                                <SelectItem value="Standard">Standard</SelectItem>
                                <SelectItem value="Routine">Routine</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <Input 
                              value={editForm.time || ''} 
                              onChange={(e) => handleInputChange('time', e.target.value)}
                              placeholder="Time"
                            />
                            
                            <Select 
                              value={editForm.status || ''}
                              onValueChange={(value) => handleInputChange('status', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Scheduled">Scheduled</SelectItem>
                                <SelectItem value="Waiting">Waiting</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex justify-end gap-2 mt-2">
                            <Button variant="outline" onClick={handleCancel}>
                              <X className="h-4 w-4 mr-1" /> Cancel
                            </Button>
                            <Button onClick={() => handleSave('patient')}>
                              <Save className="h-4 w-4 mr-1" /> Save
                            </Button>
                          </div>
                        </div>
                      ) : sendingId === scan.id ? (
                        // Send to Department Mode
                        <div className="flex flex-col w-full gap-3">
                          <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">{scan.patient}</span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <Select 
                              value={selectedDepartment}
                              onValueChange={(value) => setSelectedDepartment(value as Department)}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                              <SelectContent>
                                {departments.map(dept => (
                                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="text-sm text-muted-foreground pl-7">
                            Transferring from Radiology
                          </div>
                          
                          <div className="flex justify-end gap-2 mt-2">
                            <Button variant="outline" onClick={cancelTransfer}>
                              <X className="h-4 w-4 mr-1" /> Cancel
                            </Button>
                            <Button onClick={confirmTransfer}>
                              <Send className="h-4 w-4 mr-1" /> Confirm Transfer
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <>
                          <div className="flex items-center space-x-4">
                            <div>
                              <div className="font-medium">{scan.patient}</div>
                              <div className="text-sm text-muted-foreground">{scan.type}</div>
                            </div>
                            <Badge variant="secondary">{scan.id}</Badge>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm">{scan.time}</span>
                            <Badge variant={scan.priority === "Urgent" ? "destructive" : "outline"}>
                              {scan.priority}
                            </Badge>
                            <Badge variant={
                              scan.status === "In Progress" ? "default" : 
                              scan.status === "Completed" ? "secondary" : "outline"
                            }>
                              {scan.status}
                            </Badge>
                            
                            <div className="flex gap-1">
                              {scan.status === "In Progress" && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleCompleteScan(scan.id)}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Complete
                                </Button>
                              )}
                              
                              {scan.status !== "In Progress" && scan.status !== "Completed" && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleStartScan(scan.id)}
                                >
                                  <Camera className="h-4 w-4 mr-1" />
                                  Start
                                </Button>
                              )}
                              
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEdit(scan.id)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              
                              {!scan.completed && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleSendToDepartment(scan.id)}
                                >
                                  <Send className="h-4 w-4 mr-1" />
                                  Transfer
                                </Button>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Equipment Status Tab */}
          <TabsContent value="equipment" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipment.map((equip) => (
                <Card key={equip.id} className="bg-card/50 backdrop-blur">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">{equip.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          equip.status === "Available" ? "secondary" : 
                          equip.status === "Active" || equip.status === "In Use" ? "default" : "destructive"
                        }>
                          {equip.status}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-4 w-4"
                          onClick={() => handleEditEquipment(equip.id)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {editingEquipmentId === equip.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <Select 
                            value={editForm.status || equip.status}
                            onValueChange={(value) => handleInputChange('status', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Available">Available</SelectItem>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="In Use">In Use</SelectItem>
                              <SelectItem value="Maintenance">Maintenance</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Input 
                            type="number"
                            value={editForm.utilization !== undefined ? editForm.utilization : equip.utilization}
                            onChange={(e) => handleInputChange('utilization', parseInt(e.target.value))}
                            placeholder="Utilization %"
                          />
                        </div>
                        
                        <Input 
                          value={editForm.nextAvailable || equip.nextAvailable}
                          onChange={(e) => handleInputChange('nextAvailable', e.target.value)}
                          placeholder="Next Available"
                        />
                        
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={handleCancel}>
                            <X className="h-3 w-3 mr-1" /> Cancel
                          </Button>
                          <Button size="sm" onClick={() => handleSave('equipment')}>
                            <Save className="h-3 w-3 mr-1" /> Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Utilization: </span>
                          <span className="font-medium">{equip.utilization}%</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Next Available: </span>
                          <span className="font-medium">{equip.nextAvailable}</span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Reports Ready for Review</CardTitle>
                  <Badge variant="outline">
                    {reports.length} Total Reports
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      {editingReportId === report.id ? (
                        // Edit Report Mode
                        <div className="flex flex-col w-full gap-3">
                          <div className="grid grid-cols-2 gap-2">
                            <Input 
                              value={editForm.patient || report.patient}
                              onChange={(e) => handleInputChange('patient', e.target.value)}
                              placeholder="Patient Name"
                            />
                            
                            <Input 
                              value={editForm.scan || report.scan}
                              onChange={(e) => handleInputChange('scan', e.target.value)}
                              placeholder="Scan Type"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <Input 
                              value={editForm.date || report.date}
                              onChange={(e) => handleInputChange('date', e.target.value)}
                              placeholder="Date"
                            />
                            
                            <Input 
                              value={editForm.radiologist || report.radiologist}
                              onChange={(e) => handleInputChange('radiologist', e.target.value)}
                              placeholder="Radiologist"
                            />
                          </div>
                          
                          <Select 
                            value={editForm.status || report.status}
                            onValueChange={(value) => handleInputChange('status', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Completed">Completed</SelectItem>
                              <SelectItem value="Under Review">Under Review</SelectItem>
                              <SelectItem value="Pending">Pending</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <div className="flex justify-end gap-2 mt-2">
                            <Button variant="outline" onClick={handleCancel}>
                              <X className="h-4 w-4 mr-1" /> Cancel
                            </Button>
                            <Button onClick={() => handleSave('report')}>
                              <Save className="h-4 w-4 mr-1" /> Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // View Report Mode
                        <>
                          <div className="flex items-center space-x-4">
                            <div>
                              <div className="font-medium">{report.patient}</div>
                              <div className="text-sm text-muted-foreground">{report.scan} - {report.date}</div>
                              <div className="text-sm text-muted-foreground">Radiologist: {report.radiologist}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge variant={report.status === "Completed" ? "default" : "secondary"}>
                              {report.status}
                            </Badge>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Send
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditReport(report.id)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
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

          {/* Archive Tab */}
          <TabsContent value="archive" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Image Archive</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Monitor className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">PACS Integration</h3>
                  <p className="text-muted-foreground mb-4">Picture Archiving and Communication System</p>
                  <div className="flex justify-center gap-4">
                    <Button>
                      <ClipboardList className="h-4 w-4 mr-2" />
                      View Archive
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Records
                    </Button>
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

export default RadiologyDashboard;