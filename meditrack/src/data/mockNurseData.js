export const mockNurses = [
  {
    id: 'nur1',
    firstName: 'Jennifer',
    lastName: 'Lopez',
    email: 'jennifer.lopez@example.com',
    phone: '+1 (555) 111-2233',
    licenseNumber: 'RN12345678',
    department: 'Emergency',
    specialization: 'Emergency Care',
    shift: 'Day',
    status: 'active',
    hireDate: '2020-05-15',
    assignedDoctors: ['doc1'],
    patients: ['pat1', 'pat2', 'pat3']
  },
  {
    id: 'nur2',
    firstName: 'Robert',
    lastName: 'Taylor',
    email: 'robert.taylor@example.com',
    phone: '+1 (555) 222-3344',
    licenseNumber: 'RN23456789',
    department: 'Pediatrics',
    specialization: 'Pediatric Care',
    shift: 'Evening',
    status: 'active',
    hireDate: '2019-11-22',
    assignedDoctors: ['doc2'],
    patients: ['pat4', 'pat5']
  },
  {
    id: 'nur3',
    firstName: 'Lisa',
    lastName: 'Garcia',
    email: 'lisa.garcia@example.com',
    phone: '+1 (555) 333-4455',
    licenseNumber: 'RN34567890',
    department: 'Surgery',
    specialization: 'Surgical Care',
    shift: 'Night',
    status: 'on_leave',
    hireDate: '2021-03-10',
    assignedDoctors: ['doc1', 'doc2'],
    patients: []
  },
  {
    id: 'nur4',
    firstName: 'David',
    lastName: 'Kim',
    email: 'david.kim@example.com',
    phone: '+1 (555) 444-5566',
    licenseNumber: 'RN45678901',
    department: 'Intensive Care Unit',
    specialization: 'Critical Care',
    shift: 'Night',
    status: 'active',
    hireDate: '2018-07-18',
    assignedDoctors: ['doc2'],
    patients: ['pat5']
  },
  {
    id: 'nur5',
    firstName: 'Amanda',
    lastName: 'Wilson',
    email: 'amanda.wilson@example.com',
    phone: '+1 (555) 555-6677',
    licenseNumber: 'RN56789012',
    department: 'Maternity',
    specialization: 'Neonatal Care',
    shift: 'Day',
    status: 'active',
    hireDate: '2022-01-05',
    assignedDoctors: [],
    patients: []
  }
];

export const mockVitalSigns = [
  {
    id: 'vs1',
    patientId: 'pat1',
    dateTime: '2023-06-15T09:30:00Z',
    temperature: 98.6,
    bloodPressure: '120/80',
    heartRate: 75,
    respiratoryRate: 16,
    oxygenSaturation: 98,
    height: 70, // in inches
    weight: 185, // in lbs
    bmi: 26.5,
    notes: 'Patient reports feeling well, no complaints.'
  },
  {
    id: 'vs2',
    patientId: 'pat2',
    dateTime: '2023-06-15T10:15:00Z',
    temperature: 98.4,
    bloodPressure: '118/76',
    heartRate: 72,
    respiratoryRate: 18,
    oxygenSaturation: 99,
    height: 65,
    weight: 132,
    bmi: 22.0,
    notes: 'Patient reports occasional shortness of breath during exercise.'
  }
];

export const mockNursingNotes = [
  {
    id: 'note1',
    patientId: 'pat1',
    nurseId: 'nur1',
    dateTime: '2023-06-15T09:45:00Z',
    note: 'Patient reports good medication compliance. No side effects reported. BP well-controlled.',
    category: 'progress',
    priority: 'routine'
  },
  {
    id: 'note2',
    patientId: 'pat2',
    nurseId: 'nur2',
    dateTime: '2023-06-15T10:30:00Z',
    note: 'Patient demonstrates proper inhaler technique. Reports using albuterol 2-3 times per week, mostly before exercise.',
    category: 'education',
    priority: 'normal'
  }
];

export const mockMedicationAdministration = [
  {
    id: 'med1',
    patientId: 'pat1',
    nurseId: 'nur1',
    medication: 'Lisinopril 10mg',
    dosage: '1 tablet',
    route: 'oral',
    time: '2023-06-15T09:00:00Z',
    status: 'given',
    notes: 'No issues, patient tolerated well.'
  },
  {
    id: 'med2',
    patientId: 'pat2',
    nurseId: 'nur2',
    medication: 'Albuterol inhaler',
    dosage: '2 puffs',
    route: 'inhalation',
    time: '2023-06-15T10:15:00Z',
    status: 'given',
    notes: 'Patient demonstrated proper technique.'
  }
];
