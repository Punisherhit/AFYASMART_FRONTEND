export type FlowStage = "reception" | "triage" | "consultation" | "lab" | "billing" | "pharmacy" | "completed";

export type FlowEvent = {
  stage: FlowStage;
  action: string;
  timestamp: string;
  notes?: string;
};

export type FlowPatient = {
  id: string;
  name: string;
  email?: string;
  currentStage: FlowStage;
  consultationDepartment?: string;
  assignedDoctor?: string;
  tests: string[];
  prescriptions: string[];
  history: FlowEvent[];
};

const STORAGE_KEY = "afya-patient-flow";
const UPDATE_EVENT = "afya-flow-updated";

const readFlow = (): FlowPatient[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as FlowPatient[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeFlow = (patients: FlowPatient[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
};

const updatePatient = (patientId: string, updater: (patient: FlowPatient) => FlowPatient) => {
  const patients = readFlow();
  const updated = patients.map((p) => (p.id === patientId ? updater(p) : p));
  writeFlow(updated);
};

export const patientFlowApi = {
  subscribe: (callback: () => void) => {
    const handler = () => callback();
    window.addEventListener(UPDATE_EVENT, handler);
    window.addEventListener("storage", handler);

    return () => {
      window.removeEventListener(UPDATE_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  },

  getAll: () => readFlow(),

  registerAtReception: (payload: { name: string; email?: string }) => {
    const patients = readFlow();
    const now = new Date().toISOString();

    const newPatient: FlowPatient = {
      id: `PF-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      currentStage: "reception",
      tests: [],
      prescriptions: [],
      history: [
        {
          stage: "reception",
          action: "Registered at reception",
          timestamp: now
        }
      ]
    };

    writeFlow([newPatient, ...patients]);
    return newPatient;
  },

  moveStage: (patientId: string, stage: FlowStage, action: string, notes?: string) => {
    updatePatient(patientId, (patient) => ({
      ...patient,
      currentStage: stage,
      history: [
        {
          stage,
          action,
          timestamp: new Date().toISOString(),
          notes
        },
        ...patient.history
      ]
    }));
  },

  assignConsultationDepartment: (patientId: string, department: string) => {
    updatePatient(patientId, (patient) => ({
      ...patient,
      consultationDepartment: department,
      currentStage: "consultation",
      history: [
        {
          stage: "consultation",
          action: "Assigned to consultation department",
          timestamp: new Date().toISOString(),
          notes: department
        },
        ...patient.history
      ]
    }));
  },

  addTestResult: (patientId: string, result: string) => {
    updatePatient(patientId, (patient) => ({
      ...patient,
      tests: [result, ...patient.tests],
      history: [
        {
          stage: "lab",
          action: "Lab result added",
          timestamp: new Date().toISOString(),
          notes: result
        },
        ...patient.history
      ]
    }));
  },

  addPrescription: (patientId: string, prescription: string) => {
    updatePatient(patientId, (patient) => ({
      ...patient,
      prescriptions: [prescription, ...patient.prescriptions],
      history: [
        {
          stage: "consultation",
          action: "Prescription added",
          timestamp: new Date().toISOString(),
          notes: prescription
        },
        ...patient.history
      ]
    }));
  }
};

export const stageLabel: Record<FlowStage, string> = {
  reception: "Reception",
  triage: "Triage",
  consultation: "Consultation",
  lab: "Laboratory",
  billing: "Billing",
  pharmacy: "Pharmacy",
  completed: "Completed"
};
