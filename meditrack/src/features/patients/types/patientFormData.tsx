export type PatientFormData = {
  fullName: string;
  dob: string; // keep string for <input type="date" />
  gender: 'male' | 'female' | 'other' | 'unknown';
  contactInfo: string;
  address?: string;
  medicalRecordNumber?: string;
};
