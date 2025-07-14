import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Thermometer, Activity, Clock, AlertTriangle, Users } from "lucide-react";

const TriageDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Triage Dashboard</h1>
          <Badge variant="outline" className="text-sm">Nursing Station</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card/50 backdrop-blur border-l-4 border-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">3</div>
              <p className="text-xs text-muted-foreground">Immediate attention</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-l-4 border-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgent</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">12</div>
              <p className="text-xs text-muted-foreground">Within 30 minutes</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-l-4 border-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stable</CardTitle>
              <Heart className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">28</div>
              <p className="text-xs text-muted-foreground">Standard care</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">43</div>
              <p className="text-xs text-muted-foreground">In triage queue</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Vital Signs Monitor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Heart Rate</span>
                  </div>
                  <span className="font-mono">78 BPM</span>
                </div>
                <Progress value={78} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Temperature</span>
                  </div>
                  <span className="font-mono">98.6°F</span>
                </div>
                <Progress value={65} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Blood Pressure</span>
                  </div>
                  <span className="font-mono">120/80</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Quick Assessment</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <AlertTriangle className="h-6 w-6 mb-2 text-red-500" />
                Emergency
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Clock className="h-6 w-6 mb-2 text-yellow-500" />
                Urgent Care
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Heart className="h-6 w-6 mb-2 text-green-500" />
                Routine
              </Button>
              <Button variant="outline" className="h-20 flex-col">
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
              {[
                { name: "Sarah Wilson", id: "T001", priority: "Critical", symptoms: "Chest pain", time: "5 min", vitals: "HR: 95, BP: 140/90" },
                { name: "Robert Brown", id: "T002", priority: "Urgent", symptoms: "Severe headache", time: "15 min", vitals: "HR: 82, BP: 130/85" },
                { name: "Emma Davis", id: "T003", priority: "Stable", symptoms: "Minor cut", time: "25 min", vitals: "HR: 72, BP: 110/70" },
                { name: "David Miller", id: "T004", priority: "Stable", symptoms: "Cold symptoms", time: "35 min", vitals: "HR: 68, BP: 105/65" },
              ].map((patient, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border-l-4" 
                     style={{borderLeftColor: patient.priority === 'Critical' ? '#ef4444' : 
                                             patient.priority === 'Urgent' ? '#eab308' : '#22c55e'}}>
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-muted-foreground">{patient.symptoms}</div>
                    </div>
                    <Badge variant="secondary">{patient.id}</Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-mono">{patient.vitals}</div>
                      <div className="text-xs text-muted-foreground">Waiting {patient.time}</div>
                    </div>
                    <Badge variant={patient.priority === "Critical" ? "destructive" : 
                                   patient.priority === "Urgent" ? "default" : "secondary"}>
                      {patient.priority}
                    </Badge>
                    <Button size="sm">Assess</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TriageDashboard;