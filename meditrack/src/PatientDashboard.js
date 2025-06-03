import React from 'react';

const mockPrescriptions = [
  { id: 1, name: 'Amoxicillin', dosage: '500mg', frequency: '2x/day' },
  { id: 2, name: 'Ibuprofen', dosage: '200mg', frequency: 'as needed' },
];
const mockAppointments = [
  { id: 1, date: '2025-06-05', doctor: 'Dr. Smith', status: 'Upcoming' },
  { id: 2, date: '2025-05-28', doctor: 'Dr. Lee', status: 'Completed' },
];

export default function PatientDashboard() {
  return (
    <div>
      <h2>Patient Dashboard</h2>
      <section>
        <h3>Prescriptions</h3>
        <ul>
          {mockPrescriptions.map(p => (
            <li key={p.id}>{p.name} - {p.dosage} ({p.frequency})</li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Appointments</h3>
        <ul>
          {mockAppointments.map(a => (
            <li key={a.id}>{a.date} with {a.doctor} ({a.status})</li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Upcoming Scheduling Info</h3>
        <ul>
          {mockAppointments.filter(a => a.status === 'Upcoming').map(a => (
            <li key={a.id}>{a.date} with {a.doctor}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
