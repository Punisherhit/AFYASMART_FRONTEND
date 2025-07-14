import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, CreditCard, FileText, Calculator, TrendingUp, AlertCircle } from "lucide-react";

const BillingDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Billing & Accounts</h1>
          <Badge variant="outline" className="text-sm">Finance Department</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,450</div>
              <p className="text-xs text-muted-foreground">+18% from yesterday</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$8,920</div>
              <p className="text-xs text-muted-foreground">23 outstanding bills</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Insurance Claims</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">Processed today</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Target</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">$340K / $400K</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="invoicing" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="invoicing">Invoicing</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="insurance">Insurance</TabsTrigger>
            <TabsTrigger value="reports">Financial Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="invoicing" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Generate Patient Invoice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Patient ID or Name" />
                  <Button>
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Bill
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Current Billing Items</h4>
                  {[
                    { service: "Doctor Consultation", amount: 150, category: "Medical Services" },
                    { service: "Lab Tests (CBC, Lipid Panel)", amount: 120, category: "Laboratory" },
                    { service: "Chest X-Ray", amount: 80, category: "Radiology" },
                    { service: "Medications", amount: 45, category: "Pharmacy" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <div className="font-medium">{item.service}</div>
                        <div className="text-sm text-muted-foreground">{item.category}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${item.amount}</div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span>Total Amount:</span>
                      <span>$395</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button className="flex-1">Generate Invoice</Button>
                    <Button variant="outline" className="flex-1">Save Draft</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Payment Processing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex-col">
                      <CreditCard className="h-6 w-6 mb-2" />
                      Card Payment
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <DollarSign className="h-6 w-6 mb-2" />
                      Cash Payment
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Input placeholder="Payment Amount" />
                    <Input placeholder="Patient ID" />
                    <Button className="w-full">Process Payment</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Recent Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { patient: "John Smith", amount: 245, method: "Card", time: "10:30 AM", status: "Completed" },
                      { patient: "Maria Garcia", amount: 180, method: "Insurance", time: "10:15 AM", status: "Pending" },
                      { patient: "David Wilson", amount: 95, method: "Cash", time: "10:00 AM", status: "Completed" },
                    ].map((payment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <div className="font-medium">{payment.patient}</div>
                          <div className="text-sm text-muted-foreground">{payment.method} - {payment.time}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">${payment.amount}</div>
                          <Badge variant={payment.status === "Completed" ? "default" : "secondary"}>
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insurance" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Insurance Claims Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-green-500/10 border border-green-500/20">
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">32</div>
                          <div className="text-sm text-muted-foreground">Approved Claims</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-yellow-500/10 border border-yellow-500/20">
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">8</div>
                          <div className="text-sm text-muted-foreground">Pending Review</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-red-500/10 border border-red-500/20">
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">3</div>
                          <div className="text-sm text-muted-foreground">Rejected Claims</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    {[
                      { patient: "Alice Johnson", provider: "Blue Cross", amount: 850, status: "Approved", date: "Today" },
                      { patient: "Bob Miller", provider: "Aetna", amount: 420, status: "Pending", date: "Yesterday" },
                      { patient: "Carol Davis", provider: "Cigna", amount: 290, status: "Under Review", date: "2 days ago" },
                    ].map((claim, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div>
                          <div className="font-medium">{claim.patient}</div>
                          <div className="text-sm text-muted-foreground">{claim.provider} - {claim.date}</div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="font-bold">${claim.amount}</div>
                          </div>
                          <Badge variant={claim.status === "Approved" ? "default" : 
                                         claim.status === "Pending" || claim.status === "Under Review" ? "secondary" : "destructive"}>
                            {claim.status}
                          </Badge>
                          <Button size="sm" variant="outline">View</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Revenue Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Today's Revenue:</span>
                      <span className="font-bold">$12,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span>This Week:</span>
                      <span className="font-bold">$78,320</span>
                    </div>
                    <div className="flex justify-between">
                      <span>This Month:</span>
                      <span className="font-bold">$340,150</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Outstanding:</span>
                      <span className="font-bold text-yellow-600">$8,920</span>
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Financial Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Department Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { department: "Emergency", revenue: 4200, percentage: 34 },
                      { department: "Surgery", revenue: 3100, percentage: 25 },
                      { department: "Radiology", revenue: 2400, percentage: 19 },
                      { department: "Laboratory", revenue: 1800, percentage: 14 },
                      { department: "Pharmacy", revenue: 950, percentage: 8 },
                    ].map((dept, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{dept.department}</span>
                          <span className="text-sm font-bold">${dept.revenue}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all" 
                            style={{ width: `${dept.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BillingDashboard;