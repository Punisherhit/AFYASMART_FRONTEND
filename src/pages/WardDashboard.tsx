import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BedDouble, ClipboardCheck } from "lucide-react";
import { FlowPatient, patientFlowApi, stageLabel } from "@/services/patientFlow";

const WardDashboard = () => {
  const navigate = useNavigate();
  const [flowPatients, setFlowPatients] = useState<FlowPatient[]>([]);

  useEffect(() => {
    const sync = () => setFlowPatients(patientFlowApi.getAll());
    sync();
    const unsubscribe = patientFlowApi.subscribe(sync);
    return unsubscribe;
  }, []);

  const wardPatients = flowPatients.filter((p) => p.currentStage === "ward" || p.currentStage === "icu");

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/")}><ArrowLeft className="h-4 w-4 mr-1" />Back</Button>
            <div>
              <h1 className="text-3xl font-bold">Ward & Inpatient Dashboard</h1>
              <p className="text-muted-foreground">Manage admitted patients and inpatient transitions.</p>
            </div>
          </div>
          <Badge variant="outline">Inpatient</Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BedDouble className="h-5 w-5" />Ward / ICU Queue</CardTitle>
            <CardDescription>Patients admitted from consultation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {wardPatients.map((patient) => (
              <div key={patient.id} className="rounded-md border p-3 space-y-2">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-xs text-muted-foreground">Current stage: {stageLabel[patient.currentStage]}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => patientFlowApi.moveStage(patient.id, "nutrition", "Ward referred patient to nutrition support")}>To Nutrition</Button>
                    <Button size="sm" onClick={() => patientFlowApi.moveStage(patient.id, "billing", "Ward discharged patient for billing clearance")}>Discharge to Billing</Button>
                  </div>
                </div>
                <p className="text-xs"><span className="font-medium">Latest prescription:</span> {patient.prescriptions[0] || "No prescription yet"}</p>
              </div>
            ))}
            {wardPatients.length === 0 && <p className="text-sm text-muted-foreground">No admitted patients in ward/ICU currently.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ClipboardCheck className="h-5 w-5" />Recently Completed Inpatient Cases</CardTitle>
          </CardHeader>
          <CardContent>
            {flowPatients.filter((p) => p.currentStage === "completed").slice(0, 5).map((patient) => (
              <p key={patient.id} className="text-sm py-1">{patient.name}</p>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WardDashboard;
