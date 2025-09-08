export const mockNurseAccount = {
  id: 'nurse1',
  employeeId: 'NUR-00123',
  username: 'nurse.johnson',
  email: 'nurse.johnson@meditrack.com',
  password: 'nurse123', // In a real app, this should be hashed
  firstName: 'Sarah',
  lastName: 'Johnson',
  role: 'nurse',
  department: 'Emergency',
  specialization: 'Emergency Care',
  licenseNumber: 'RN12345678',
  phone: '+1 (555) 123-4567',
  address: '456 Health St, MedCity, USA',
  hireDate: '2022-03-15',
  shift: 'Day',
  status: 'active',
  assignedPatients: ['pat1', 'pat2', 'pat3'],
  assignedDoctors: ['doc1', 'doc2'],
  permissions: [
    'view_patient_records',
    'update_vital_signs',
    'add_nursing_notes',
    'administer_medication',
    'view_schedule'
  ],
  lastLogin: new Date().toISOString(),
  accountStatus: 'active',
  createdAt: '2022-03-15T09:00:00.000Z',
  updatedAt: new Date().toISOString()
};

export const mockNurseSchedule = [
  {
    id: 'sched1',
    nurseId: 'nurse1',
    date: '2023-06-20',
    shift: 'Day',
    startTime: '07:00',
    endTime: '19:00',
    status: 'scheduled',
    notes: 'Regular shift'
  },
  {
    id: 'sched2',
    nurseId: 'nurse1',
    date: '2023-06-21',
    shift: 'Day',
    startTime: '07:00',
    endTime: '19:00',
    status: 'scheduled',
    notes: 'Regular shift'
  },
  {
    id: 'sched3',
    nurseId: 'nurse1',
    date: '2023-06-22',
    shift: 'Day',
    startTime: '07:00',
    endTime: '19:00',
    status: 'day_off',
    notes: 'Day off'
  }
];

export const mockNurseTasks = [
  {
    id: 'task1',
    nurseId: 'nurse1',
    patientId: 'pat1',
    task: 'Administer medication - Lisinopril 10mg',
    status: 'pending',
    dueTime: '2023-06-20T10:00:00.000Z',
    priority: 'high',
    notes: 'Patient may experience dizziness'
  },
  {
    id: 'task2',
    nurseId: 'nurse1',
    patientId: 'pat2',
    task: 'Check blood pressure and temperature',
    status: 'pending',
    dueTime: '2023-06-20T11:30:00.000Z',
    priority: 'medium',
    notes: 'Monitor for any signs of fever'
  }
];
