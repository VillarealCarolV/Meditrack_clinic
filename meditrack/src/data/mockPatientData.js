export const mockPatients = [
  {
    id: '1',
    name: 'John Doe',
    age: 35,
    gender: 'Male',
    lastVisit: '2025-05-20',
    nextAppointment: '2025-06-15',
    status: 'Active',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, City, Country',
    medicalHistory: 'Hypertension, Allergic to Penicillin'
  },
  {
    id: '2',
    name: 'Jane Smith',
    age: 28,
    gender: 'Female',
    lastVisit: '2025-05-15',
    nextAppointment: '',
    status: 'Inactive',
    email: 'jane.smith@example.com',
    phone: '(555) 987-6543',
    address: '456 Oak Ave, Town, Country',
    medicalHistory: 'Asthma'
  },
  {
    id: '3',
    name: 'Robert Johnson',
    age: 42,
    gender: 'Male',
    lastVisit: '2025-05-10',
    nextAppointment: '2025-06-05',
    status: 'Active',
    email: 'robert.j@example.com',
    phone: '(555) 456-7890',
    address: '789 Pine Rd, Village, Country',
    medicalHistory: 'Type 2 Diabetes'
  }
];

export const mockPrescriptions = [
  { id: 1, name: 'Amoxicillin', dosage: '500mg', frequency: '2x/day' },
  { id: 2, name: 'Ibuprofen', dosage: '200mg', frequency: 'as needed' },
];

export const mockAppointments = [
  { id: 1, date: '2025-06-05', doctor: 'Dr. Smith', status: 'Upcoming' },
  { id: 2, date: '2025-05-28', doctor: 'Dr. Lee', status: 'Completed' },
];
