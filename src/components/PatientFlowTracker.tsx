import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, ArrowRight } from "lucide-react";

interface FlowStep {
  id: string;
  name: string;
  status: "completed" | "current" | "pending";
  time?: string;
  icon: string;
}

interface PatientFlowTrackerProps {
  patientId: string;
  currentStep: string;
}

const PatientFlowTracker = ({ patientId, currentStep }: PatientFlowTrackerProps) => {
  const flowSteps: FlowStep[] = [
    { id: "reception", name: "Reception Check-in", status: "completed", time: "09:30 AM", icon: "🏥" },
    { id: "triage", name: "Triage Assessment", status: "completed", time: "09:45 AM", icon: "📋" },
    { id: "doctor", name: "Doctor Consultation", status: "current", icon: "👨‍⚕️" },
    { id: "lab", name: "Lab Tests", status: "pending", icon: "🔬" },
    { id: "billing", name: "Billing & Payment", status: "pending", icon: "💳" },
    { id: "pharmacy", name: "Pharmacy", status: "pending", icon: "💊" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-accent text-accent-foreground";
      case "current": return "bg-primary text-primary-foreground";
      case "pending": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "current": return <Clock className="h-4 w-4" />;
      default: return <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Patient Journey</span>
          <Badge variant="outline" className="text-xs">
            Patient #{patientId}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {flowSteps.map((step, index) => (
            <div key={step.id} className="relative">
              <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                  step.status === 'completed' ? 'bg-accent' :
                  step.status === 'current' ? 'bg-primary' : 'bg-muted'
                }`}>
                  <span className="text-white text-lg">{step.icon}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-medium ${
                        step.status === 'current' ? 'text-primary' : 'text-foreground'
                      }`}>
                        {step.name}
                      </h4>
                      {step.time && (
                        <p className="text-sm text-muted-foreground">{step.time}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusIcon(step.status)}
                      <Badge variant="outline" className={getStatusColor(step.status)}>
                        {step.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Connector line */}
              {index < flowSteps.length - 1 && (
                <div className="ml-5 mt-2 mb-2">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientFlowTracker;