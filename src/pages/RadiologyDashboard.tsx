import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Download, Eye, Scan, Image, Camera, Monitor } from "lucide-react";

const RadiologyDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Radiology Dashboard</h1>
          <Badge variant="outline" className="text-sm">Imaging Department</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Scans</CardTitle>
              <Scan className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">Awaiting imaging</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">X-Rays Today</CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32</div>
              <p className="text-xs text-muted-foreground">+8 from yesterday</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">MRI Scans</CardTitle>
              <Monitor className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Scheduled today</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reports Ready</CardTitle>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="queue" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="queue">Imaging Queue</TabsTrigger>
            <TabsTrigger value="equipment">Equipment Status</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="archive">Archive</TabsTrigger>
          </TabsList>

          <TabsContent value="queue" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Imaging Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { patient: "John Smith", id: "R001", type: "Chest X-Ray", priority: "Urgent", time: "10:30 AM", status: "In Progress" },
                    { patient: "Maria Garcia", id: "R002", type: "Brain MRI", priority: "Standard", time: "11:00 AM", status: "Scheduled" },
                    { patient: "James Wilson", id: "R003", type: "Abdominal CT", priority: "Standard", time: "11:30 AM", status: "Waiting" },
                    { patient: "Lisa Johnson", id: "R004", type: "Knee X-Ray", priority: "Routine", time: "12:00 PM", status: "Scheduled" },
                  ].map((scan, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="font-medium">{scan.patient}</div>
                          <div className="text-sm text-muted-foreground">{scan.type}</div>
                        </div>
                        <Badge variant="secondary">{scan.id}</Badge>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm">{scan.time}</span>
                        <Badge variant={scan.priority === "Urgent" ? "destructive" : "outline"}>
                          {scan.priority}
                        </Badge>
                        <Badge variant={scan.status === "In Progress" ? "default" : "secondary"}>
                          {scan.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Camera className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="equipment" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "X-Ray Machine #1", status: "Active", utilization: 85, nextAvailable: "11:45 AM" },
                { name: "MRI Scanner", status: "In Use", utilization: 92, nextAvailable: "2:30 PM" },
                { name: "CT Scanner #1", status: "Available", utilization: 45, nextAvailable: "Now" },
                { name: "CT Scanner #2", status: "Maintenance", utilization: 0, nextAvailable: "Tomorrow" },
                { name: "Ultrasound #1", status: "Active", utilization: 67, nextAvailable: "12:15 PM" },
                { name: "X-Ray Machine #2", status: "Available", utilization: 23, nextAvailable: "Now" },
              ].map((equipment, index) => (
                <Card key={index} className="bg-card/50 backdrop-blur">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{equipment.name}</CardTitle>
                    <Badge variant={equipment.status === "Available" ? "secondary" : 
                                   equipment.status === "Active" || equipment.status === "In Use" ? "default" : "destructive"}>
                      {equipment.status}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Utilization: </span>
                      <span className="font-medium">{equipment.utilization}%</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Next Available: </span>
                      <span className="font-medium">{equipment.nextAvailable}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Reports Ready for Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { patient: "Anna Brown", scan: "Chest X-Ray", date: "Today 9:30 AM", radiologist: "Dr. Smith", status: "Completed" },
                    { patient: "Tom Wilson", scan: "Brain MRI", date: "Today 8:45 AM", radiologist: "Dr. Johnson", status: "Under Review" },
                    { patient: "Sarah Davis", scan: "Knee CT", date: "Yesterday 4:20 PM", radiologist: "Dr. Smith", status: "Completed" },
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
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
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

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
                  <Button>Access Archive</Button>
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