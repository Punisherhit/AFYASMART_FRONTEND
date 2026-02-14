import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Baby, HeartPulse } from "lucide-react";
import { FlowPatient, patientFlowApi, stageLabel } from "@/services/patientFlow";

const MaternityDashboard = () => {
  const navigate = useNavigate();
  const [flowPatients, setFlowPatients] = useState<FlowPatient[]>([]);

  useEffect(() => {
    const sync = () => setFlowPatients(patientFlowApi.getAll());
    sync();
    const unsubscribe = patientFlowApi.subscribe(sync);
    return unsubscribe;
  }, []);

  const maternityPatients = flowPatients.filter((p) => p.currentStage === "maternity");

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/")}><ArrowLeft className="h-4 w-4 mr-1" />Back</Button>
            <div>
              <h1 className="text-3xl font-bold">Maternity Dashboard</h1>
              <p className="text-muted-foreground">Track antenatal, delivery, and postnatal care transitions.</p>
            </div>
          </div>
          <Badge variant="outline">Maternity</Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Baby className="h-5 w-5" />Maternity Queue</CardTitle>
            <CardDescription>Patients routed from consultation or emergency care.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {maternityPatients.map((patient) => (
              <div key={patient.id} className="rounded-md border p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">{patient.name}</p>
                  <p className="text-xs text-muted-foreground">Stage: {stageLabel[patient.currentStage]}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => patientFlowApi.moveStage(patient.id, "lab", "Maternity requested follow-up lab tests")}>Order Lab</Button>
                  <Button size="sm" onClick={() => patientFlowApi.moveStage(patient.id, "billing", "Maternity care completed and sent for billing")}>Complete & Bill</Button>
                </div>
              </div>
            ))}
            {maternityPatients.length === 0 && <p className="text-sm text-muted-foreground">No maternity patients in queue at the moment.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><HeartPulse className="h-5 w-5" />Recent Maternity Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {maternityPatients.flatMap((p) => p.history.slice(0, 2).map((h, i) => ({ id: `${p.id}-${i}`, n: p.name, h }))).slice(0, 8).map((entry) => (
              <p key={entry.id} className="text-xs text-muted-foreground">{entry.n}: {entry.h.action}{entry.h.notes ? ` (${entry.h.notes})` : ""}</p>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaternityDashboard;
