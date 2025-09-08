export const mockDoctors = [
  {
    id: 'doc1',
    name: 'Dr. Maria Santos',
    specialty: 'Cardiology',
    email: 'maria.santos@example.com',
    phone: '+1 (555) 123-4567',
    status: 'active',
    schedule: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '17:00' },
      saturday: 'off',
      sunday: 'off'
    },
    patients: ['pat1', 'pat2', 'pat3']
  },
  {
    id: 'doc2',
    name: 'Dr. James Wilson',
    specialty: 'Neurology',
    email: 'james.wilson@example.com',
    phone: '+1 (555) 234-5678',
    status: 'active',
    schedule: {
      monday: { start: '10:00', end: '18:00' },
      tuesday: { start: '10:00', end: '18:00' },
      wednesday: 'off',
      thursday: { start: '10:00', end: '18:00' },
      friday: { start: '10:00', end: '18:00' },
      saturday: { start: '09:00', end: '13:00' },
      sunday: 'off'
    },
    patients: ['pat4', 'pat5']
  }
];

export const mockPrescriptions = [
  {
    id: 'rx1',
    patientId: 'pat1',
    doctorId: 'doc1',
    medication: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    startDate: '2023-06-01',
    endDate: '2023-12-31',
    status: 'active'
  },
  {
    id: 'rx2',
    patientId: 'pat2',
    doctorId: 'doc1',
    medication: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    startDate: '2023-05-15',
    endDate: '2023-11-15',
    status: 'active'
  }
];

export const mockSchedule = [
  {
    id: 'sched1',
    doctorId: 'doc1',
    patientId: 'pat1',
    date: '2023-06-20',
    time: '10:00',
    status: 'scheduled',
    reason: 'Follow-up visit'
  },
  {
    id: 'sched2',
    doctorId: 'doc2',
    patientId: 'pat4',
    date: '2023-06-21',
    time: '14:30',
    status: 'scheduled',
    reason: 'Initial consultation'
  }
];
