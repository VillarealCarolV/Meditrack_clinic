import { PatientFormData } from './patientFormData';

export interface Patient extends PatientFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
}
