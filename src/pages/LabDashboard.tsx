import { useEffect, useState } from "react";
import { 
  ArrowLeft, TestTube, Upload, Clock, CheckCircle, FileText, 
  Edit, Trash2, Download, Eye, PlusCircle, Image as ImageIcon,
  Hourglass, RotateCw, AlertCircle, ClipboardCheck, Filter,
  XCircle, Check, Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dropzone } from "@/components/ui/dropzone";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FlowPatient, patientFlowApi } from "@/services/patientFlow";

type TestStatus = "pending" | "waiting" | "processing" | "completed" | "cancelled";

type Test = {
  id: number;
  patient: string;
  test: string;
  doctor?: string;
  priority?: "Normal" | "High" | "Urgent";
  date: string;
  result?: "Normal" | "Abnormal" | "Critical";
  status: TestStatus;
  images?: string[];
  notes?: string;
  collectedAt?: string;
  processedAt?: string;
  completedAt?: string;
};

const statusOptions: { value: TestStatus; label: string; icon: React.ReactNode; color: string }[] = [
  { value: "pending", label: "Pending", icon: <Hourglass className="h-4 w-4" />, color: "bg-gray-100 text-gray-800" },
  { value: "waiting", label: "Waiting", icon: <Clock className="h-4 w-4" />, color: "bg-yellow-100 text-yellow-800" },
  { value: "processing", label: "Processing", icon: <RotateCw className="h-4 w-4" />, color: "bg-blue-100 text-blue-800" },
  { value: "completed", label: "Completed", icon: <CheckCircle className="h-4 w-4" />, color: "bg-green-100 text-green-800" },
  { value: "cancelled", label: "Cancelled", icon: <AlertCircle className="h-4 w-4" />, color: "bg-red-100 text-red-800" },
];

const priorityOptions: { value: Test["priority"]; label: string; color: string }[] = [
  { value: "Normal", label: "Normal", color: "bg-gray-100 text-gray-800" },
  { value: "High", label: "High", color: "bg-orange-100 text-orange-800" },
  { value: "Urgent", label: "Urgent", color: "bg-red-100 text-red-800" },
];

const resultOptions: { value: Test["result"]; label: string; color: string }[] = [
  { value: "Normal", label: "Normal", color: "bg-green-100 text-green-800" },
  { value: "Abnormal", label: "Abnormal", color: "bg-yellow-100 text-yellow-800" },
  { value: "Critical", label: "Critical", color: "bg-red-100 text-red-800" },
];

const LabDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [newTest, setNewTest] = useState<Omit<Test, "id" | "status">>({
    patient: "",
    test: "",
    doctor: "",
    priority: "Normal",
    date: new Date().toISOString().split('T')[0],
    notes: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<Test["priority"] | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<TestStatus | "all">("all");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  const [flowPatients, setFlowPatients] = useState<FlowPatient[]>([]);
  const [labResults, setLabResults] = useState<Record<string, string>>({});

  useEffect(() => {
    const sync = () => setFlowPatients(patientFlowApi.getAll());
    sync();
    const unsubscribe = patientFlowApi.subscribe(sync);
    return unsubscribe;
  }, []);

  const [tests, setTests] = useState<Test[]>([
    { 
      id: 1, 
      patient: "John Doe", 
      test: "Complete Blood Count", 
      doctor: "Dr. Sarah Johnson", 
      priority: "Normal", 
      date: "2024-02-20",
      status: "pending",
      notes: "Fasting required",
      collectedAt: ""
    },
    { 
      id: 2, 
      patient: "Jane Smith", 
      test: "Urinalysis", 
      doctor: "Dr. Michael Brown", 
      priority: "Urgent", 
      date: "2024-02-20",
      status: "waiting",
      notes: "Collect first morning void",
      collectedAt: "2024-02-20 08:15"
    },
    { 
      id: 3, 
      patient: "Mike Johnson", 
      test: "Lipid Profile", 
      doctor: "Dr. Sarah Johnson", 
      priority: "High", 
      date: "2024-02-19",
      status: "processing",
      notes: "Patient has history of hyperlipidemia",
      collectedAt: "2024-02-19 14:30",
      processedAt: "2024-02-20 09:45"
    },
    { 
      id: 4, 
      patient: "Alice Brown", 
      test: "Liver Function Test", 
      doctor: "Dr. Emily Wilson", 
      priority: "Normal", 
      date: "2024-02-18",
      status: "completed",
      result: "Normal",
      notes: "All values within reference range",
      collectedAt: "2024-02-18 10:20",
      processedAt: "2024-02-18 15:10",
      completedAt: "2024-02-19 11:00",
      images: ["lft-report-44521.pdf"]
    },
    { 
      id: 5, 
      patient: "Robert Wilson", 
      test: "Glucose Tolerance Test", 
      doctor: "Dr. Michael Brown", 
      priority: "High", 
      date: "2024-02-17",
      status: "completed",
      result: "Abnormal",
      notes: "Elevated 2-hour glucose level",
      collectedAt: "2024-02-17 08:00",
      processedAt: "2024-02-17 12:45",
      completedAt: "2024-02-18 09:30",
      images: ["gtt-results-77893.pdf", "gtt-chart-77893.png"]
    },
    { 
      id: 6, 
      patient: "Emily Davis", 
      test: "Thyroid Panel", 
      doctor: "Dr. Emily Wilson", 
      priority: "Normal", 
      date: "2024-02-20",
      status: "cancelled",
      notes: "Patient cancelled appointment",
      collectedAt: ""
    }
  ]);

  // Filter tests based on search, status and priority
  const filteredTests = tests.filter(test => {
    const matchesSearch = test.patient.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         test.test.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = selectedPriority === "all" || test.priority === selectedPriority;
    const matchesStatus = selectedStatus === "all" || test.status === selectedStatus;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const updateTestStatus = (testId: number, newStatus: TestStatus) => {
    const now = new Date().toISOString();
    setTests(tests.map(test => {
      if (test.id !== testId) return test;
      
      const updatedTest = { ...test, status: newStatus };
      
      // Update timestamps based on status change
      if (newStatus === "waiting" && !test.collectedAt) {
        updatedTest.collectedAt = now;
      } else if (newStatus === "processing" && !test.processedAt) {
        updatedTest.processedAt = now;
      } else if (newStatus === "completed" && !test.completedAt) {
        updatedTest.completedAt = now;
      }
      
      return updatedTest;
    }));
  };

  const handleStatusChange = (testId: number, value: TestStatus) => {
    updateTestStatus(testId, value);
  };

  const handleEditTest = (test: Test) => {
    setEditingTest(test);
  };

  const handleSaveTest = () => {
    if (editingTest) {
      setTests(tests.map(t => t.id === editingTest.id ? editingTest : t));
      setEditingTest(null);
    }
  };

  const handleAddTest = () => {
    const newId = Math.max(0, ...tests.map(t => t.id)) + 1;
    setTests([
      ...tests, 
      { 
        ...newTest, 
        id: newId, 
        status: "pending",
        images: []
      }
    ]);
    setNewTest({
      patient: "",
      test: "",
      doctor: "",
      priority: "Normal",
      date: new Date().toISOString().split('T')[0],
      notes: ""
    });
  };

  const handleDeleteTest = (id: number) => {
    setTests(tests.filter(test => test.id !== id));
  };

  const handleClearTest = (id: number) => {
    setTests(tests.filter(test => test.id !== id));
  };

  const handleUploadImages = (files: File[]) => {
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    
    if (editingTest) {
      const newImageNames = files.map(file => file.name);
      setEditingTest({
        ...editingTest,
        images: [...(editingTest.images || []), ...newImageNames]
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    if (editingTest) {
      const updatedImages = [...(editingTest.images || [])];
      updatedImages.splice(index, 1);
      setEditingTest({
        ...editingTest,
        images: updatedImages
      });
    }
  };

  const getStatusColor = (status: TestStatus) => {
    return statusOptions.find(opt => opt.value === status)?.color || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority: Test["priority"]) => {
    return priorityOptions.find(opt => opt.value === priority)?.color || "bg-gray-100 text-gray-800";
  };

  const getResultColor = (result: Test["result"]) => {
    return resultOptions.find(opt => opt.value === result)?.color || "bg-gray-100 text-gray-800";
  };

  const pendingTests = tests.filter(test => test.status === "pending");
  const waitingTests = tests.filter(test => test.status === "waiting");
  const processingTests = tests.filter(test => test.status === "processing");
  const completedTests = tests.filter(test => test.status === "completed");
  const cancelledTests = tests.filter(test => test.status === "cancelled");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <Card>
          <CardHeader>
            <CardTitle>Cross-Department Lab Queue</CardTitle>
            <CardDescription>Receive doctor requests, publish test results, and return patients for billing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {flowPatients.filter((p) => p.currentStage === "lab").map((patient) => (
              <div key={patient.id} className="rounded-md border p-3 flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
                <div>
                  <p className="font-medium">{patient.name}</p>
                  <p className="text-xs text-muted-foreground">Add results then move to billing</p>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Test result summary"
                    value={labResults[patient.id] || ""}
                    onChange={(e) => setLabResults((prev) => ({ ...prev, [patient.id]: e.target.value }))}
                    className="min-w-[220px]"
                  />
                  <Button size="sm" variant="outline" onClick={() => {
                    const result = (labResults[patient.id] || "").trim();
                    if (!result) return;
                    patientFlowApi.addTestResult(patient.id, result);
                    setLabResults((prev) => ({ ...prev, [patient.id]: "" }));
                  }}>Save Result</Button>
                  <Button size="sm" onClick={() => patientFlowApi.moveStage(patient.id, "billing", "Lab tests completed and sent to billing")}>To Billing</Button>
                </div>
              </div>
            ))}
            {flowPatients.filter((p) => p.currentStage === "lab").length === 0 && (
              <p className="text-sm text-muted-foreground">No patients currently waiting for laboratory tests.</p>
            )}
          </CardContent>
        </Card>
      </div>
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
              <h1 className="text-2xl font-bold text-foreground">Laboratory Dashboard</h1>
              <p className="text-muted-foreground">Test tracking and results reporting</p>
            </div>
          </div>
          <Badge variant="outline">Technician</Badge>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-border bg-card h-[calc(100vh-73px)] sticky top-0">
          <nav className="p-4 space-y-2">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("overview")}
            >
              <TestTube className="h-4 w-4 mr-2" />
              Overview
            </Button>
            <Button
              variant={activeTab === "all-tests" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("all-tests")}
            >
              <FileText className="h-4 w-4 mr-2" />
              All Tests
            </Button>
            {statusOptions.map((item) => (
              <Button
                key={item.value}
                variant={activeTab === item.value ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab(item.value)}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Button>
            ))}
            <Button
              variant={activeTab === "new-test" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("new-test")}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              New Test
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Overview Dashboard */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Status Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {statusOptions.map((status) => (
                  <Card key={status.value} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        {status.icon}
                        {status.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {tests.filter(t => t.status === status.value).length}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => setActiveTab(status.value)}
                      >
                        View All
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common laboratory tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-20 flex-col">
                      <TestTube className="h-6 w-6 mb-2" />
                      Process Tests
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col"
                      onClick={() => setActiveTab("results")}
                    >
                      <Upload className="h-6 w-6 mb-2" />
                      Upload Results
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col"
                      onClick={() => setActiveTab("pending")}
                    >
                      <Clock className="h-6 w-6 mb-2" />
                      View Pending
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col"
                      onClick={() => setActiveTab("completed")}
                    >
                      <CheckCircle className="h-6 w-6 mb-2" />
                      View Completed
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest test updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Test</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tests.slice(0, 5).map((test) => (
                        <TableRow key={test.id}>
                          <TableCell className="font-medium">{test.patient}</TableCell>
                          <TableCell>{test.test}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusColor(test.status)}>
                              {statusOptions.find(s => s.value === test.status)?.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getPriorityColor(test.priority)}>
                              {test.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>{test.date}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Select
                                value={test.status}
                                onValueChange={(value) => handleStatusChange(test.id, value as TestStatus)}
                              >
                                <SelectTrigger className="w-[120px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {statusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      <div className="flex items-center gap-2">
                                        {option.icon}
                                        {option.label}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEditTest(test)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleClearTest(test.id)}
                              >
                                <XCircle className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* All Tests View */}
          {activeTab === "all-tests" && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>All Laboratory Tests</CardTitle>
                    <CardDescription>Complete test history and management</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Search tests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-[200px]"
                    />
                    <Select
                      value={selectedStatus}
                      onValueChange={(value) => setSelectedStatus(value as TestStatus | "all")}
                    >
                      <SelectTrigger className="w-[120px]">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <SelectValue placeholder="Status" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              {option.icon}
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={selectedPriority}
                      onValueChange={(value) => setSelectedPriority(value as Test["priority"] | "all")}
                    >
                      <SelectTrigger className="w-[120px]">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <SelectValue placeholder="Priority" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        {priorityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <span className={option.color}>{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Test</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTests.map((test) => (
                      <TableRow key={test.id}>
                        <TableCell className="font-medium">{test.patient}</TableCell>
                        <TableCell>{test.test}</TableCell>
                        <TableCell>{test.doctor || "-"}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(test.status)}>
                            {statusOptions.find(s => s.value === test.status)?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getPriorityColor(test.priority)}>
                            {test.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>{test.date}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Select
                              value={test.status}
                              onValueChange={(value) => handleStatusChange(test.id, value as TestStatus)}
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {statusOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    <div className="flex items-center gap-2">
                                      {option.icon}
                                      {option.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditTest(test)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleClearTest(test.id)}
                            >
                              <XCircle className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Status-specific views */}
          {statusOptions.map((status) => (
            activeTab === status.value && (
              <Card key={status.value}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{status.label} Tests</CardTitle>
                      <CardDescription>
                        {tests.filter(t => t.status === status.value).length} tests currently {status.label.toLowerCase()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Search tests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-[200px]"
                      />
                      <Select
                        value={selectedPriority}
                        onValueChange={(value) => setSelectedPriority(value as Test["priority"] | "all")}
                      >
                        <SelectTrigger className="w-[120px]">
                          <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            <SelectValue placeholder="Priority" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Priorities</SelectItem>
                          {priorityOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <span className={option.color}>{option.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Test</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="w-[200px]">Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTests
                        .filter(test => test.status === status.value)
                        .map((test) => (
                          <TableRow key={test.id}>
                            <TableCell className="font-medium">{test.patient}</TableCell>
                            <TableCell>{test.test}</TableCell>
                            <TableCell>{test.doctor || "-"}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getPriorityColor(test.priority)}>
                                {test.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>{test.date}</TableCell>
                            <TableCell>
                              <Select
                                value={test.status}
                                onValueChange={(value) => handleStatusChange(test.id, value as TestStatus)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {statusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      <div className="flex items-center gap-2">
                                        {option.icon}
                                        {option.label}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleEditTest(test)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleClearTest(test.id)}
                                >
                                  <XCircle className="h-4 w-4 text-destructive" />
                                </Button>
                                {status.value === "completed" && (
                                  <Button variant="outline" size="sm">
                                    <ClipboardCheck className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )
          ))}

          {/* New Test Form */}
          {activeTab === "new-test" && (
            <Card>
              <CardHeader>
                <CardTitle>Create New Test</CardTitle>
                <CardDescription>Add a new laboratory test request</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Patient Name</label>
                    <Input 
                      value={newTest.patient}
                      onChange={e => setNewTest({...newTest, patient: e.target.value})}
                      placeholder="Enter patient name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Test Type</label>
                    <Input 
                      value={newTest.test}
                      onChange={e => setNewTest({...newTest, test: e.target.value})}
                      placeholder="Enter test type"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ordering Doctor</label>
                    <Input 
                      value={newTest.doctor}
                      onChange={e => setNewTest({...newTest, doctor: e.target.value})}
                      placeholder="Enter doctor's name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <Select
                      value={newTest.priority}
                      onValueChange={(value) => setNewTest({...newTest, priority: value as Test["priority"]})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <span className={option.color}>{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Input 
                      type="date"
                      value={newTest.date}
                      onChange={e => setNewTest({...newTest, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Notes</label>
                    <Textarea 
                      value={newTest.notes}
                      onChange={e => setNewTest({...newTest, notes: e.target.value})}
                      placeholder="Additional notes or instructions"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setActiveTab("overview")}>
                  Cancel
                </Button>
                <Button onClick={handleAddTest}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Test
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Upload Results View */}
          {activeTab === "results" && (
            <Card>
              <CardHeader>
                <CardTitle>Upload Results</CardTitle>
                <CardDescription>Upload test results and reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Select Test to Upload Results</h3>
                    <select className="w-full p-2 border rounded-md">
                      <option>Select a test...</option>
                      {pendingTests.concat(waitingTests, processingTests).map(test => (
                        <option key={test.id} value={test.id}>
                          {test.patient} - {test.test} ({test.date})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Upload Result Files</h3>
                    <Dropzone 
                      onDrop={handleUploadImages}
                      accept={{'image/*': ['.png', '.jpg', '.jpeg', '.gif']}}
                      className="border-dashed border-2 rounded-lg p-8 text-center cursor-pointer"
                    >
                      <div className="flex flex-col items-center justify-center gap-4">
                        <Upload className="h-8 w-8 text-gray-500" />
                        <div>
                          <p className="font-medium">Drag & drop files here</p>
                          <p className="text-sm text-muted-foreground">
                            Supported formats: JPG, PNG, PDF (max 10MB)
                          </p>
                        </div>
                        <Button variant="outline">Select Files</Button>
                      </div>
                    </Dropzone>
                  </div>

                  {imagePreviews.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Selected Files</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <img 
                              src={preview} 
                              alt={`Preview ${index}`}
                              className="rounded-md border h-32 w-full object-cover"
                            />
                            <Button 
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6"
                              onClick={() => {
                                URL.revokeObjectURL(preview);
                                setImagePreviews(prev => prev.filter((_, i) => i !== index));
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="font-medium mb-2">Result Notes</h3>
                    <Textarea 
                      placeholder="Enter test results and observations"
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Results
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>

      {/* Edit Test Dialog */}
      <Dialog open={!!editingTest} onOpenChange={() => setEditingTest(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Edit Test - {editingTest?.patient}
            </DialogTitle>
          </DialogHeader>
          
          {editingTest && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Patient Name</label>
                  <Input 
                    value={editingTest.patient}
                    onChange={e => setEditingTest({...editingTest, patient: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Test Type</label>
                  <Input 
                    value={editingTest.test}
                    onChange={e => setEditingTest({...editingTest, test: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Doctor</label>
                  <Input 
                    value={editingTest.doctor || ""}
                    onChange={e => setEditingTest({...editingTest, doctor: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select
                    value={editingTest.priority}
                    onValueChange={(value) => setEditingTest({...editingTest, priority: value as Test["priority"]})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <span className={option.color}>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input 
                    type="date"
                    value={editingTest.date}
                    onChange={e => setEditingTest({...editingTest, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={editingTest.status}
                    onValueChange={(value) => setEditingTest({...editingTest, status: value as TestStatus})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            {option.icon}
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {editingTest.status === "completed" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Result</label>
                    <Select
                      value={editingTest.result}
                      onValueChange={(value) => setEditingTest({...editingTest, result: value as Test["result"]})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select result" />
                      </SelectTrigger>
                      <SelectContent>
                        {resultOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <span className={option.color}>{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea 
                  value={editingTest.notes || ""}
                  onChange={e => setEditingTest({...editingTest, notes: e.target.value})}
                  rows={3}
                />
              </div>

              {editingTest.status === "completed" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Attached Reports</label>
                  <div className="border rounded-lg p-4">
                    {editingTest.images && editingTest.images.length > 0 ? (
                      <div className="grid grid-cols-3 gap-4">
                        {editingTest.images.map((img, index) => (
                          <div key={index} className="border rounded-md p-2 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm truncate">{img}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="ml-auto h-6 w-6"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No reports attached
                      </div>
                    )}
                    <Button variant="outline" className="mt-4">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Report
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    handleDeleteTest(editingTest.id);
                    setEditingTest(null);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Test
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setEditingTest(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveTest}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image View Dialog */}
      <Dialog open={!!viewingImage} onOpenChange={() => setViewingImage(null)}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Report Preview</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            {viewingImage && (
              <img 
                src={viewingImage} 
                alt="Report preview"
                className="max-h-[70vh] object-contain"
              />
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setViewingImage(null)}>
              Close
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LabDashboard;