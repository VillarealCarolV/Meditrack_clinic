export const mockReceptionistAccount = {
  id: 'receptionist1',
  employeeId: 'REC-00456',
  username: 'receptionist.smith',
  email: 'receptionist.smith@meditrack.com',
  password: 'receptionist123', // In a real app, this should be hashed
  firstName: 'Emily',
  lastName: 'Smith',
  role: 'receptionist',
  department: 'Front Desk',
  phone: '+1 (555) 987-6543',
  address: '789 Front St, MedCity, USA',
  hireDate: '2023-01-10',
  shift: 'Morning',
  status: 'active',
  permissions: [
    'manage_appointments',
    'register_patients',
    'view_patient_info',
    'schedule_appointments',
    'process_payments',
    'answer_phone_calls'
  ],
  lastLogin: new Date().toISOString(),
  accountStatus: 'active',
  createdAt: '2023-01-10T09:00:00.000Z',
  updatedAt: new Date().toISOString()
};

export const mockReceptionistTasks = [
  {
    id: 'task1',
    receptionistId: 'receptionist1',
    type: 'appointment',
    description: 'Schedule follow-up for John Doe',
    status: 'pending',
    dueDate: '2023-06-20',
    priority: 'high',
    notes: 'Patient requested morning appointment'
  },
  {
    id: 'task2',
    receptionistId: 'receptionist1',
    type: 'registration',
    description: 'Register new patient - Jane Wilson',
    status: 'in_progress',
    dueDate: '2023-06-20',
    priority: 'medium',
    notes: 'Waiting for insurance verification'
  },
  {
    id: 'task3',
    receptionistId: 'receptionist1',
    type: 'billing',
    description: 'Process payment for invoice #INV-2023-1001',
    status: 'pending',
    dueDate: '2023-06-21',
    priority: 'low',
    notes: 'Patient will pay by credit card'
  }
];

export const mockReceptionistSchedule = [
  {
    id: 'sched1',
    receptionistId: 'receptionist1',
    day: 'Monday',
    startTime: '08:00',
    endTime: '17:00',
    status: 'scheduled'
  },
  {
    id: 'sched2',
    receptionistId: 'receptionist1',
    day: 'Tuesday',
    startTime: '08:00',
    endTime: '17:00',
    status: 'scheduled'
  },
  {
    id: 'sched3',
    receptionistId: 'receptionist1',
    day: 'Wednesday',
    startTime: '08:00',
    endTime: '17:00',
    status: 'scheduled'
  },
  {
    id: 'sched4',
    receptionistId: 'receptionist1',
    day: 'Thursday',
    startTime: '08:00',
    endTime: '17:00',
    status: 'scheduled'
  },
  {
    id: 'sched5',
    receptionistId: 'receptionist1',
    day: 'Friday',
    startTime: '08:00',
    endTime: '17:00',
    status: 'scheduled'
  }
];
