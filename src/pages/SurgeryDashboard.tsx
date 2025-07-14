import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Users, AlertTriangle, CheckCircle, Scissors } from "lucide-react";

const SurgeryDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Surgery Department</h1>
          <Badge variant="outline" className="text-sm">Operating Theater</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Surgeries</CardTitle>
              <Scissors className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">5 completed, 3 scheduled</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Operating Rooms</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4/6</div>
              <p className="text-xs text-muted-foreground">Active rooms</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Emergency Cases</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Awaiting OR</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.5h</div>
              <p className="text-xs text-muted-foreground">Today's average</p>
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
              <CardHeader>
                <CardTitle>Today's Surgery Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
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
                  ].map((surgery, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border-l-4"
                         style={{borderLeftColor: surgery.priority === 'Emergency' ? '#ef4444' : 
                                                  surgery.priority === 'Scheduled' ? '#3b82f6' : '#22c55e'}}>
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="font-medium">{surgery.patient}</div>
                          <div className="text-sm text-muted-foreground">{surgery.procedure}</div>
                          <div className="text-xs text-muted-foreground">
                            {surgery.surgeon} • {surgery.room}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">{surgery.time}</div>
                          <Badge variant={surgery.priority === "Emergency" ? "destructive" : 
                                         surgery.priority === "Scheduled" ? "default" : "secondary"}>
                            {surgery.priority}
                          </Badge>
                        </div>
                        <Badge variant={surgery.status === "Completed" ? "default" : 
                                       surgery.status === "In Progress" ? "secondary" : "outline"}>
                          {surgery.status}
                        </Badge>
                        <Button size="sm" variant="outline">Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rooms" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "OR-1", status: "Available", nextSurgery: "16:00", currentProcedure: null, surgeon: null },
                { name: "OR-2", status: "In Use", nextSurgery: "14:30", currentProcedure: "Gallbladder Surgery", surgeon: "Dr. Williams" },
                { name: "OR-3", status: "Setup", nextSurgery: "14:00", currentProcedure: "Knee Replacement Prep", surgeon: "Dr. Davis" },
                { name: "OR-4", status: "In Use", nextSurgery: "20:00", currentProcedure: "Cardiac Surgery", surgeon: "Dr. Miller" },
                { name: "OR-5", status: "Cleaning", nextSurgery: "Tomorrow 08:00", currentProcedure: null, surgeon: null },
                { name: "OR-6", status: "Maintenance", nextSurgery: "Tomorrow 10:00", currentProcedure: null, surgeon: null },
              ].map((room, index) => (
                <Card key={index} className="bg-card/50 backdrop-blur">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{room.name}</CardTitle>
                      <Badge variant={room.status === "Available" ? "secondary" : 
                                     room.status === "In Use" ? "default" : 
                                     room.status === "Setup" ? "outline" : "destructive"}>
                        {room.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
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
                    {[
                      { name: "Dr. Johnson", specialty: "General Surgery", status: "Available", currentOR: null },
                      { name: "Dr. Williams", specialty: "Laparoscopic", status: "In Surgery", currentOR: "OR-2" },
                      { name: "Dr. Davis", specialty: "Orthopedic", status: "Prep", currentOR: "OR-3" },
                      { name: "Dr. Miller", specialty: "Cardiac", status: "In Surgery", currentOR: "OR-4" },
                    ].map((surgeon, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <div className="font-medium">{surgeon.name}</div>
                          <div className="text-sm text-muted-foreground">{surgeon.specialty}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {surgeon.currentOR && (
                            <Badge variant="outline">{surgeon.currentOR}</Badge>
                          )}
                          <Badge variant={surgeon.status === "Available" ? "secondary" : "default"}>
                            {surgeon.status}
                          </Badge>
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
                    {[
                      { name: "Sarah Wilson", role: "OR Nurse", status: "OR-2", shift: "Day Shift" },
                      { name: "Mike Johnson", role: "Anesthesiologist", status: "OR-4", shift: "Day Shift" },
                      { name: "Emma Davis", role: "Surgical Tech", status: "Available", shift: "Day Shift" },
                      { name: "Chris Brown", role: "OR Nurse", status: "Break", shift: "Day Shift" },
                    ].map((staff, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <div className="font-medium">{staff.name}</div>
                          <div className="text-sm text-muted-foreground">{staff.role}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">{staff.shift}</span>
                          <Badge variant={staff.status === "Available" ? "secondary" : "outline"}>
                            {staff.status}
                          </Badge>
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
              {[
                { name: "Surgical Laser", status: "Operational", location: "OR-1", maintenance: "Due in 30 days" },
                { name: "Anesthesia Machine #1", status: "In Use", location: "OR-2", maintenance: "Good" },
                { name: "C-Arm Fluoroscopy", status: "Available", location: "OR-3", maintenance: "Good" },
                { name: "Surgical Robot", status: "Maintenance", location: "Service Bay", maintenance: "Scheduled today" },
                { name: "Electrocautery Unit", status: "Operational", location: "OR-4", maintenance: "Good" },
                { name: "Ventilator #3", status: "Available", location: "Equipment Room", maintenance: "Due in 15 days" },
              ].map((equipment, index) => (
                <Card key={index} className="bg-card/50 backdrop-blur">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{equipment.name}</CardTitle>
                    <Badge variant={equipment.status === "Operational" || equipment.status === "Available" ? "secondary" : 
                                   equipment.status === "In Use" ? "default" : "destructive"}>
                      {equipment.status}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Location: </span>
                      <span className="font-medium">{equipment.location}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Maintenance: </span>
                      <span className="font-medium">{equipment.maintenance}</span>
                    </div>
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