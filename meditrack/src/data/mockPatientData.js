export const mockPatients = [
  {
    id: 'pat1',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1985-05-15',
    gender: 'male',
    email: 'john.doe@example.com',
    phone: '+1 (555) 987-6543',
    address: '123 Main St, Anytown, USA',
    bloodType: 'A+',
    allergies: ['Penicillin', 'Peanuts'],
    conditions: ['Hypertension'],
    medications: ['Lisinopril 10mg daily'],
    primaryCarePhysician: 'doc1',
    lastVisit: '2023-03-15',
    nextAppointment: '2023-06-20',
    status: 'active'
  },
  {
    id: 'pat2',
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: '1990-08-22',
    gender: 'female',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 876-5432',
    address: '456 Oak Ave, Somewhere, USA',
    bloodType: 'O-',
    allergies: [],
    conditions: ['Asthma', 'Seasonal Allergies'],
    medications: ['Albuterol inhaler', 'Fluticasone nasal spray'],
    primaryCarePhysician: 'doc1',
    lastVisit: '2023-04-01',
    nextAppointment: '2023-07-10',
    status: 'active'
  },
  {
    id: 'pat3',
    firstName: 'Robert',
    lastName: 'Johnson',
    dateOfBirth: '1978-11-30',
    gender: 'male',
    email: 'robert.j@example.com',
    phone: '+1 (555) 765-4321',
    address: '789 Pine Rd, Nowhere, USA',
    bloodType: 'B+',
    allergies: ['Sulfa drugs'],
    conditions: ['Type 2 Diabetes', 'High Cholesterol'],
    medications: ['Metformin 1000mg BID', 'Atorvastatin 20mg daily'],
    primaryCarePhysician: 'doc1',
    lastVisit: '2023-02-28',
    nextAppointment: '2023-05-15',
    status: 'active'
  },
  {
    id: 'pat4',
    firstName: 'Sarah',
    lastName: 'Williams',
    dateOfBirth: '1995-03-10',
    gender: 'female',
    email: 'sarah.w@example.com',
    phone: '+1 (555) 654-3210',
    address: '321 Elm St, Anywhere, USA',
    bloodType: 'AB+',
    allergies: ['Latex', 'Shellfish'],
    conditions: ['Migraine'],
    medications: ['Sumatriptan 50mg PRN'],
    primaryCarePhysician: 'doc2',
    lastVisit: '2023-03-20',
    nextAppointment: '2023-06-25',
    status: 'active'
  },
  {
    id: 'pat5',
    firstName: 'Michael',
    lastName: 'Brown',
    dateOfBirth: '1982-07-18',
    gender: 'male',
    email: 'michael.b@example.com',
    phone: '+1 (555) 543-2109',
    address: '159 Maple Dr, Somewhere, USA',
    bloodType: 'O+',
    allergies: ['Ibuprofen'],
    conditions: ['Anxiety', 'Insomnia'],
    medications: ['Sertraline 50mg daily', 'Trazodone 50mg PRN'],
    primaryCarePhysician: 'doc2',
    lastVisit: '2023-04-05',
    nextAppointment: '2023-07-12',
    status: 'active'
  }
];

export const mockPatientRecords = [
  {
    id: 'rec1',
    patientId: 'pat1',
    date: '2023-03-15',
    doctorId: 'doc1',
    diagnosis: 'Essential (primary) hypertension',
    notes: 'Patient reports occasional headaches. BP slightly elevated.',
    vitals: {
      bloodPressure: '138/88',
      heartRate: 78,
      temperature: 98.6,
      weight: 185,
      height: 70
    },
    treatment: 'Continue current medication, monitor BP, follow up in 3 months'
  },
  {
    id: 'rec2',
    patientId: 'pat2',
    date: '2023-04-01',
    doctorId: 'doc1',
    diagnosis: 'Mild persistent asthma',
    notes: 'Patient reports using albuterol 2-3 times per week. No nighttime symptoms.',
    vitals: {
      bloodPressure: '122/78',
      heartRate: 72,
      temperature: 98.4,
      weight: 132,
      height: 65
    },
    treatment: 'Continue current inhaler regimen, follow up in 6 months'
  }
];

export const mockPatientAppointments = [
  {
    id: 'appt1',
    patientId: 'pat1',
    doctorId: 'doc1',
    date: '2023-06-20',
    time: '10:00',
    status: 'scheduled',
    reason: 'Follow-up for hypertension',
    notes: ''
  },
  {
    id: 'appt2',
    patientId: 'pat2',
    doctorId: 'doc1',
    date: '2023-07-10',
    time: '14:30',
    status: 'scheduled',
    reason: 'Asthma check-up',
    notes: 'Bring inhaler'
  }
];
