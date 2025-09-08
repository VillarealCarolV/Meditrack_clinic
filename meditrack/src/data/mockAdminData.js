export const mockAdmin = {
  id: 'admin1',
  username: 'admin',
  email: 'admin@meditrack.com',
  password: 'admin123', // In a real app, this should be hashed
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin',
  permissions: [
    'manage_users',
    'manage_doctors',
    'manage_nurses',
    'manage_patients',
    'view_reports',
    'system_settings'
  ],
  lastLogin: new Date().toISOString(),
  accountStatus: 'active',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: new Date().toISOString()
};

export const mockAdminActivities = [
  {
    id: 'act1',
    adminId: 'admin1',
    action: 'user_created',
    description: 'Created new doctor account: Dr. Smith',
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'act2',
    adminId: 'admin1',
    action: 'user_updated',
    description: 'Updated nurse schedule for Nurse Johnson',
    timestamp: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'act3',
    adminId: 'admin1',
    action: 'settings_updated',
    description: 'Updated system settings',
    timestamp: new Date(Date.now() - 86400000).toISOString()
  }
];

export const mockSystemStats = {
  totalPatients: 156,
  activeDoctors: 12,
  activeNurses: 24,
  appointmentsToday: 42,
  availableBeds: 15,
  totalBeds: 100,
  monthlyRevenue: 125000,
  newPatientsThisMonth: 28,
  upcomingAppointments: 87
};
