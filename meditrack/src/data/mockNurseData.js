// Example mock data for nurse dashboard
export const mockRecords = [
  { id: 1, patient: 'John Doe', age: 45, condition: 'Hypertension' },
  { id: 2, patient: 'Jane Smith', age: 38, condition: 'Diabetes' }
];

export const mockVitals = [
  { id: 1, patient: 'John Doe', bp: '120/80', temp: '36.6', heartRate: 72 },
  { id: 2, patient: 'Jane Smith', bp: '130/85', temp: '37.1', heartRate: 80 }
];

export const mockNotes = [
  { id: 1, note: 'Patient stable, no issues.' },
  { id: 2, note: 'Administered medication as scheduled.' }
];

export const mockMedLogs = [
  { id: 1, patient: 'John Doe', med: 'Paracetamol', dose: '500mg', time: '10:00 AM' },
  { id: 2, patient: 'Jane Smith', med: 'Metformin', dose: '850mg', time: '08:00 AM' }
];

export const mockIntake = [
  { id: 1, patient: 'John Doe', status: 'Completed' },
  { id: 2, patient: 'Jane Smith', status: 'Pending' }
];

export const mockFlags = [
  { id: 1, patient: 'Jane Smith', issue: 'Critical BP spike', flaggedAt: '2025-06-02 09:00' }
];
