// src/features/patients/types/patientFormData.ts
export interface PatientFormData {
  fullName: string;
  dob: string;
  gender: 'male' | 'female' | 'other' | 'unknown';
  contactInfo: string;
  address?: string;
  medicalRecordNumber?: string;
}