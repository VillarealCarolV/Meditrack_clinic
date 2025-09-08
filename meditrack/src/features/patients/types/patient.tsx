export interface Patient {
  id?: string;
  fullName: string;
  dob: string;
  gender: 'male' | 'female' | 'other' | 'unknown';
  contactInfo: string;
  address?: string;
  medicalRecordNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}
