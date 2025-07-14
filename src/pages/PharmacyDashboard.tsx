import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pill, Package, AlertTriangle, CheckCircle, Clock, Search, ShoppingCart } from "lucide-react";

const PharmacyDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Pharmacy Dashboard</h1>
          <Badge variant="outline" className="text-sm">Dispensary</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Prescriptions</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">Awaiting dispensing</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dispensed Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">+23% from yesterday</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Items need restock</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,450</div>
              <p className="text-xs text-muted-foreground">Medication sales</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="prescriptions" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="dispensing">Dispensing</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="prescriptions" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Prescription Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input placeholder="Search prescriptions..." className="flex-1" />
                    <Button size="icon" variant="outline">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { 
                        patient: "John Doe", 
                        id: "RX001", 
                        doctor: "Dr. Smith", 
                        medications: ["Amoxicillin 500mg", "Ibuprofen 200mg"], 
                        priority: "Standard",
                        time: "10:30 AM",
                        status: "Ready"
                      },
                      { 
                        patient: "Jane Smith", 
                        id: "RX002", 
                        doctor: "Dr. Johnson", 
                        medications: ["Metformin 1000mg", "Lisinopril 10mg"], 
                        priority: "Urgent",
                        time: "11:00 AM",
                        status: "Processing"
                      },
                      { 
                        patient: "Mike Wilson", 
                        id: "RX003", 
                        doctor: "Dr. Brown", 
                        medications: ["Omeprazole 20mg"], 
                        priority: "Standard",
                        time: "11:15 AM",
                        status: "Pending"
                      },
                    ].map((prescription, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center space-x-4">
                          <div>
                            <div className="font-medium">{prescription.patient}</div>
                            <div className="text-sm text-muted-foreground">
                              {prescription.medications.join(", ")}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Prescribed by {prescription.doctor}
                            </div>
                          </div>
                          <Badge variant="secondary">{prescription.id}</Badge>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm">{prescription.time}</span>
                          <Badge variant={prescription.priority === "Urgent" ? "destructive" : "outline"}>
                            {prescription.priority}
                          </Badge>
                          <Badge variant={prescription.status === "Ready" ? "default" : 
                                         prescription.status === "Processing" ? "secondary" : "outline"}>
                            {prescription.status}
                          </Badge>
                          <Button size="sm">
                            <Pill className="h-4 w-4 mr-1" />
                            Dispense
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Low Stock Alert</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Amoxicillin 500mg", current: 15, minimum: 50, supplier: "MedSupply Co." },
                      { name: "Insulin Glargine", current: 8, minimum: 20, supplier: "PharmCorp" },
                      { name: "Acetaminophen 500mg", current: 25, minimum: 100, supplier: "Generic Med" },
                    ].map((item, index) => (
                      <div key={index} className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">Stock: {item.current} (Min: {item.minimum})</div>
                            <div className="text-xs text-muted-foreground">{item.supplier}</div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Package className="h-4 w-4 mr-1" />
                            Reorder
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Fast-Moving Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Paracetamol 500mg", dispensed: 45, stock: 200, trend: "+12%" },
                      { name: "Ibuprofen 200mg", dispensed: 38, stock: 150, trend: "+8%" },
                      { name: "Omeprazole 20mg", dispensed: 32, stock: 120, trend: "+15%" },
                      { name: "Metformin 1000mg", dispensed: 28, stock: 180, trend: "+5%" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Dispensed: {item.dispensed} | Stock: {item.stock}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-500">{item.trend}</div>
                          <div className="text-xs text-muted-foreground">vs last week</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="dispensing" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Dispensing Workflow</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-24 flex-col">
                  <Search className="h-8 w-8 mb-2" />
                  Verify Prescription
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <Package className="h-8 w-8 mb-2" />
                  Check Inventory
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <Pill className="h-8 w-8 mb-2" />
                  Prepare Medication
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <CheckCircle className="h-8 w-8 mb-2" />
                  Complete Dispensing
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Patient Counseling Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <h4 className="font-medium mb-2">Drug Interaction Alert</h4>
                    <p className="text-sm text-muted-foreground">
                      Patient taking Warfarin - advise caution with new Ibuprofen prescription. 
                      Monitor for bleeding symptoms.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <h4 className="font-medium mb-2">Counseling Points</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Take with food to reduce stomach upset</li>
                      <li>• Complete full course even if feeling better</li>
                      <li>• Report any unusual side effects immediately</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Daily Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Prescriptions:</span>
                    <span className="font-bold">127</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue:</span>
                    <span className="font-bold">$2,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Items Dispensed:</span>
                    <span className="font-bold">245</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Wait Time:</span>
                    <span className="font-bold">8 minutes</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Patient Completion</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Treatment Complete</h3>
                  <p className="text-muted-foreground mb-4">
                    Patient has received all prescribed medications and counseling
                  </p>
                  <Button className="w-full">Mark as Discharged</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PharmacyDashboard;