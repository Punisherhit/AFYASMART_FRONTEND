import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Users, AlertTriangle, CheckCircle, Scissors, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SurgeryDashboard = () => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    todaySurgeries: { total: 8, completed: 5, scheduled: 3 },
    operatingRooms: { active: 4, total: 6 },
    emergencyCases: 2,
    averageDuration: "2.5h",
    surgeries: [
      {
        patient: "John Smith",
        procedure: "Appendectomy",
        surgeon: "Dr. Johnson",
        room: "OR-1",
        time: "08:00 - 10:00",
        status: "Completed",
        priority: "Emergency"
      },
      {
        patient: "Maria Garcia",
        procedure: "Gallbladder Removal",
        surgeon: "Dr. Williams",
        room: "OR-2",
        time: "10:30 - 12:30",
        status: "In Progress",
        priority: "Scheduled"
      },
      {
        patient: "Robert Brown",
        procedure: "Knee Replacement",
        surgeon: "Dr. Davis",
        room: "OR-3",
        time: "14:00 - 17:00",
        status: "Scheduled",
        priority: "Elective"
      },
      {
        patient: "Lisa Wilson",
        procedure: "Cardiac Bypass",
        surgeon: "Dr. Miller",
        room: "OR-4",
        time: "15:30 - 19:30",
        status: "Prep",
        priority: "Emergency"
      },
    ],
    rooms: [
      { name: "OR-1", status: "Available", nextSurgery: "16:00", currentProcedure: null, surgeon: null },
      { name: "OR-2", status: "In Use", nextSurgery: "14:30", currentProcedure: "Gallbladder Surgery", surgeon: "Dr. Williams" },
      { name: "OR-3", status: "Setup", nextSurgery: "14:00", currentProcedure: "Knee Replacement Prep", surgeon: "Dr. Davis" },
      { name: "OR-4", status: "In Use", nextSurgery: "20:00", currentProcedure: "Cardiac Surgery", surgeon: "Dr. Miller" },
      { name: "OR-5", status: "Cleaning", nextSurgery: "Tomorrow 08:00", currentProcedure: null, surgeon: null },
      { name: "OR-6", status: "Maintenance", nextSurgery: "Tomorrow 10:00", currentProcedure: null, surgeon: null },
    ],
    surgeons: [
      { name: "Dr. Johnson", specialty: "General Surgery", status: "Available", currentOR: null },
      { name: "Dr. Williams", specialty: "Laparoscopic", status: "In Surgery", currentOR: "OR-2" },
      { name: "Dr. Davis", specialty: "Orthopedic", status: "Prep", currentOR: "OR-3" },
      { name: "Dr. Miller", specialty: "Cardiac", status: "In Surgery", currentOR: "OR-4" },
    ],
    staff: [
      { name: "Sarah Wilson", role: "OR Nurse", status: "OR-2", shift: "Day Shift" },
      { name: "Mike Johnson", role: "Anesthesiologist", status: "OR-4", shift: "Day Shift" },
      { name: "Emma Davis", role: "Surgical Tech", status: "Available", shift: "Day Shift" },
      { name: "Chris Brown", role: "OR Nurse", status: "Break", shift: "Day Shift" },
    ],
    equipment: [
      { name: "Surgical Laser", status: "Operational", location: "OR-1", maintenance: "Due in 30 days" },
      { name: "Anesthesia Machine #1", status: "In Use", location: "OR-2", maintenance: "Good" },
      { name: "C-Arm Fluoroscopy", status: "Available", location: "OR-3", maintenance: "Good" },
      { name: "Surgical Robot", status: "Maintenance", location: "Service Bay", maintenance: "Scheduled today" },
      { name: "Electrocautery Unit", status: "Operational", location: "OR-4", maintenance: "Good" },
      { name: "Ventilator #3", status: "Available", location: "Equipment Room", maintenance: "Due in 15 days" },
    ]
  });

  const handleInputChange = (section, index, field, value) => {
    const newData = {...dashboardData};
    if (index !== undefined) {
      newData[section][index][field] = value;
    } else {
      newData[section][field] = value;
    }
    setDashboardData(newData);
  };

  const handleAddSurgery = () => {
    setDashboardData({
      ...dashboardData,
      surgeries: [
        ...dashboardData.surgeries,
        {
          patient: "New Patient",
          procedure: "New Procedure",
          surgeon: "Dr. New",
          room: "OR-1",
          time: "00:00 - 00:00",
          status: "Scheduled",
          priority: "Elective"
        }
      ]
    });
  };

  const handleRemoveSurgery = (index) => {
    const newSurgeries = [...dashboardData.surgeries];
    newSurgeries.splice(index, 1);
    setDashboardData({...dashboardData, surgeries: newSurgeries});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Surgery Department</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-sm">Operating Theater</Badge>
            <Button onClick={() => setEditMode(!editMode)}>
              {editMode ? 'View Mode' : 'Edit Mode'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Surgeries</CardTitle>
              <Scissors className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {editMode ? (
                <div className="space-y-2">
                  <Input 
                    type="number" 
                    value={dashboardData.todaySurgeries.total} 
                    onChange={(e) => handleInputChange('todaySurgeries', undefined, 'total', e.target.value)}
                  />
                  <div className="flex space-x-2">
                    <Input 
                      type="number" 
                      value={dashboardData.todaySurgeries.completed} 
                      onChange={(e) => handleInputChange('todaySurgeries', undefined, 'completed', e.target.value)}
                    />
                    <Input 
                      type="number" 
                      value={dashboardData.todaySurgeries.scheduled} 
                      onChange={(e) => handleInputChange('todaySurgeries', undefined, 'scheduled', e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{dashboardData.todaySurgeries.total}</div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardData.todaySurgeries.completed} completed, {dashboardData.todaySurgeries.scheduled} scheduled
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Operating Rooms</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {editMode ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="number" 
                      value={dashboardData.operatingRooms.active} 
                      onChange={(e) => handleInputChange('operatingRooms', undefined, 'active', e.target.value)}
                    />
                    <span>/</span>
                    <Input 
                      type="number" 
                      value={dashboardData.operatingRooms.total} 
                      onChange={(e) => handleInputChange('operatingRooms', undefined, 'total', e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{dashboardData.operatingRooms.active}/{dashboardData.operatingRooms.total}</div>
                  <p className="text-xs text-muted-foreground">Active rooms</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Emergency Cases</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              {editMode ? (
                <Input 
                  type="number" 
                  value={dashboardData.emergencyCases} 
                  onChange={(e) => handleInputChange('emergencyCases', undefined, '', e.target.value)}
                />
              ) : (
                <>
                  <div className="text-2xl font-bold">{dashboardData.emergencyCases}</div>
                  <p className="text-xs text-muted-foreground">Awaiting OR</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {editMode ? (
                <Input 
                  value={dashboardData.averageDuration} 
                  onChange={(e) => setDashboardData({...dashboardData, averageDuration: e.target.value})}
                />
              ) : (
                <>
                  <div className="text-2xl font-bold">{dashboardData.averageDuration}</div>
                  <p className="text-xs text-muted-foreground">Today's average</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="schedule" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="schedule">Surgery Schedule</TabsTrigger>
            <TabsTrigger value="rooms">OR Status</TabsTrigger>
            <TabsTrigger value="staff">Surgical Team</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader className="flex justify-between items-center">
                <CardTitle>Today's Surgery Schedule</CardTitle>
                {editMode && (
                  <Button size="sm" onClick={handleAddSurgery}>
                    Add Surgery
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.surgeries.map((surgery, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border-l-4"
                         style={{borderLeftColor: surgery.priority === 'Emergency' ? '#ef4444' : 
                                                  surgery.priority === 'Scheduled' ? '#3b82f6' : '#22c55e'}}>
                      <div className="flex items-center space-x-4">
                        <div className="space-y-2">
                          {editMode ? (
                            <>
                              <Input 
                                value={surgery.patient} 
                                onChange={(e) => handleInputChange('surgeries', index, 'patient', e.target.value)}
                              />
                              <Input 
                                value={surgery.procedure} 
                                onChange={(e) => handleInputChange('surgeries', index, 'procedure', e.target.value)}
                              />
                              <div className="flex space-x-2">
                                <Input 
                                  value={surgery.surgeon} 
                                  onChange={(e) => handleInputChange('surgeries', index, 'surgeon', e.target.value)}
                                />
                                <Input 
                                  value={surgery.room} 
                                  onChange={(e) => handleInputChange('surgeries', index, 'room', e.target.value)}
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="font-medium">{surgery.patient}</div>
                              <div className="text-sm text-muted-foreground">{surgery.procedure}</div>
                              <div className="text-xs text-muted-foreground">
                                {surgery.surgeon} • {surgery.room}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right space-y-2">
                          {editMode ? (
                            <>
                              <Input 
                                value={surgery.time} 
                                onChange={(e) => handleInputChange('surgeries', index, 'time', e.target.value)}
                              />
                              <Select 
                                value={surgery.priority}
                                onValueChange={(value) => handleInputChange('surgeries', index, 'priority', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Emergency">Emergency</SelectItem>
                                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                                  <SelectItem value="Elective">Elective</SelectItem>
                                </SelectContent>
                              </Select>
                            </>
                          ) : (
                            <>
                              <div className="text-sm font-medium">{surgery.time}</div>
                              <Badge variant={surgery.priority === "Emergency" ? "destructive" : 
                                             surgery.priority === "Scheduled" ? "default" : "secondary"}>
                                {surgery.priority}
                              </Badge>
                            </>
                          )}
                        </div>
                        {editMode ? (
                          <div className="flex flex-col space-y-2">
                            <Select 
                              value={surgery.status}
                              onValueChange={(value) => handleInputChange('surgeries', index, 'status', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Scheduled">Scheduled</SelectItem>
                                <SelectItem value="Prep">Prep</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleRemoveSurgery(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Badge variant={surgery.status === "Completed" ? "default" : 
                                           surgery.status === "In Progress" ? "secondary" : "outline"}>
                              {surgery.status}
                            </Badge>
                            <Button size="sm" variant="outline">Details</Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rooms" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.rooms.map((room, index) => (
                <Card key={index} className="bg-card/50 backdrop-blur">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      {editMode ? (
                        <Input 
                          value={room.name} 
                          onChange={(e) => handleInputChange('rooms', index, 'name', e.target.value)}
                        />
                      ) : (
                        <CardTitle className="text-lg">{room.name}</CardTitle>
                      )}
                      {editMode ? (
                        <Select 
                          value={room.status}
                          onValueChange={(value) => handleInputChange('rooms', index, 'status', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Available">Available</SelectItem>
                            <SelectItem value="In Use">In Use</SelectItem>
                            <SelectItem value="Setup">Setup</SelectItem>
                            <SelectItem value="Cleaning">Cleaning</SelectItem>
                            <SelectItem value="Maintenance">Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant={room.status === "Available" ? "secondary" : 
                                       room.status === "In Use" ? "default" : 
                                       room.status === "Setup" ? "outline" : "destructive"}>
                          {room.status}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {editMode ? (
                      <>
                        <Input 
                          value={room.currentProcedure || ''} 
                          onChange={(e) => handleInputChange('rooms', index, 'currentProcedure', e.target.value)}
                          placeholder="Current procedure"
                        />
                        <Input 
                          value={room.surgeon || ''} 
                          onChange={(e) => handleInputChange('rooms', index, 'surgeon', e.target.value)}
                          placeholder="Surgeon"
                        />
                        <Input 
                          value={room.nextSurgery} 
                          onChange={(e) => handleInputChange('rooms', index, 'nextSurgery', e.target.value)}
                          placeholder="Next surgery"
                        />
                      </>
                    ) : (
                      <>
                        {room.currentProcedure && (
                          <div>
                            <div className="text-sm font-medium">{room.currentProcedure}</div>
                            <div className="text-xs text-muted-foreground">{room.surgeon}</div>
                          </div>
                        )}
                        <div className="text-sm">
                          <span className="text-muted-foreground">Next: </span>
                          <span className="font-medium">{room.nextSurgery}</span>
                        </div>
                        {room.status === "Available" && (
                          <Button size="sm" className="w-full">Book Room</Button>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="staff" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>On-Duty Surgeons</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.surgeons.map((surgeon, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          {editMode ? (
                            <div className="space-y-2">
                              <Input 
                                value={surgeon.name} 
                                onChange={(e) => handleInputChange('surgeons', index, 'name', e.target.value)}
                              />
                              <Input 
                                value={surgeon.specialty} 
                                onChange={(e) => handleInputChange('surgeons', index, 'specialty', e.target.value)}
                              />
                            </div>
                          ) : (
                            <>
                              <div className="font-medium">{surgeon.name}</div>
                              <div className="text-sm text-muted-foreground">{surgeon.specialty}</div>
                            </>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {editMode ? (
                            <div className="space-y-2">
                              <Input 
                                value={surgeon.currentOR || ''} 
                                onChange={(e) => handleInputChange('surgeons', index, 'currentOR', e.target.value)}
                                placeholder="Current OR"
                              />
                              <Select 
                                value={surgeon.status}
                                onValueChange={(value) => handleInputChange('surgeons', index, 'status', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Available">Available</SelectItem>
                                  <SelectItem value="In Surgery">In Surgery</SelectItem>
                                  <SelectItem value="Prep">Prep</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          ) : (
                            <>
                              {surgeon.currentOR && (
                                <Badge variant="outline">{surgeon.currentOR}</Badge>
                              )}
                              <Badge variant={surgeon.status === "Available" ? "secondary" : "default"}>
                                {surgeon.status}
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Surgical Support Staff</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.staff.map((staff, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          {editMode ? (
                            <div className="space-y-2">
                              <Input 
                                value={staff.name} 
                                onChange={(e) => handleInputChange('staff', index, 'name', e.target.value)}
                              />
                              <Select 
                                value={staff.role}
                                onValueChange={(value) => handleInputChange('staff', index, 'role', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="OR Nurse">OR Nurse</SelectItem>
                                  <SelectItem value="Anesthesiologist">Anesthesiologist</SelectItem>
                                  <SelectItem value="Surgical Tech">Surgical Tech</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          ) : (
                            <>
                              <div className="font-medium">{staff.name}</div>
                              <div className="text-sm text-muted-foreground">{staff.role}</div>
                            </>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {editMode ? (
                            <div className="space-y-2">
                              <Select 
                                value={staff.shift}
                                onValueChange={(value) => handleInputChange('staff', index, 'shift', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Shift" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Day Shift">Day Shift</SelectItem>
                                  <SelectItem value="Night Shift">Night Shift</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input 
                                value={staff.status} 
                                onChange={(e) => handleInputChange('staff', index, 'status', e.target.value)}
                                placeholder="Status"
                              />
                            </div>
                          ) : (
                            <>
                              <span className="text-sm text-muted-foreground">{staff.shift}</span>
                              <Badge variant={staff.status === "Available" ? "secondary" : "outline"}>
                                {staff.status}
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="equipment" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.equipment.map((equipment, index) => (
                <Card key={index} className="bg-card/50 backdrop-blur">
                  <CardHeader className="pb-3">
                    {editMode ? (
                      <Input 
                        value={equipment.name} 
                        onChange={(e) => handleInputChange('equipment', index, 'name', e.target.value)}
                      />
                    ) : (
                      <CardTitle className="text-base">{equipment.name}</CardTitle>
                    )}
                    {editMode ? (
                      <Select 
                        value={equipment.status}
                        onValueChange={(value) => handleInputChange('equipment', index, 'status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Operational">Operational</SelectItem>
                          <SelectItem value="In Use">In Use</SelectItem>
                          <SelectItem value="Available">Available</SelectItem>
                          <SelectItem value="Maintenance">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant={equipment.status === "Operational" || equipment.status === "Available" ? "secondary" : 
                                     equipment.status === "In Use" ? "default" : "destructive"}>
                        {equipment.status}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {editMode ? (
                      <>
                        <Input 
                          value={equipment.location} 
                          onChange={(e) => handleInputChange('equipment', index, 'location', e.target.value)}
                          placeholder="Location"
                        />
                        <Input 
                          value={equipment.maintenance} 
                          onChange={(e) => handleInputChange('equipment', index, 'maintenance', e.target.value)}
                          placeholder="Maintenance"
                        />
                      </>
                    ) : (
                      <>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Location: </span>
                          <span className="font-medium">{equipment.location}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Maintenance: </span>
                          <span className="font-medium">{equipment.maintenance}</span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SurgeryDashboard;