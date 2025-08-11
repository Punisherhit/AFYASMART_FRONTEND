// src/services/triageApi.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1/triage';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('afya-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const triageApi = {
  getQueue: () => api.get('/queue'),
  getStats: () => api.get('/stats'),
  addPatient: (patientData: any) => api.post('/patients', patientData),
  updatePatient: (id: string, patientData: any) => api.put(`/patients/${id}`, patientData),
  assessPatient: (id: string) => api.delete(`/patients/${id}`),
  getVitalSigns: (patientId: string) => api.get(`/vitals/${patientId}`),
  updateVitalSigns: (patientId: string, vitals: any) => api.put(`/vitals/${patientId}`, vitals),
};