import React from 'react';

const mockReports = [
  { id: 1, title: 'Total Appointments', value: 120 },
];
const mockUsers = [
  { id: 1, name: 'Alice', role: 'patient', status: 'active' },
  { id: 2, name: 'Bob', role: 'doctor', status: 'inactive' },
];
const mockAppointments = [
  { id: 1, patient: 'Alice', date: '2025-06-05', status: 'Scheduled' },
];

export default function StaffDashboard() {
  return (
    <div>
      <h2>Clinic Staff Dashboard</h2>
      <section>
        <h3>Reports & Analytics</h3>
        <ul>
          {mockReports.map(r => (
            <li key={r.id}>{r.title}: {r.value}</li>
          ))}
        </ul>
      </section>
      <section>
        <h3>User Management</h3>
        <ul>
          {mockUsers.map(u => (
            <li key={u.id}>{u.name} ({u.role}) - {u.status}</li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Appointments</h3>
        <ul>
          {mockAppointments.map(a => (
            <li key={a.id}>{a.patient}: {a.date} ({a.status})</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
