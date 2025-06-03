import React from 'react';

const mockReports = [
  { id: 1, title: 'Monthly Patient Visits', value: 42 },
  { id: 2, title: 'Prescriptions Written', value: 30 },
];
const mockPatients = [
  { id: 1, name: 'Alice', age: 30, condition: 'Flu' },
  { id: 2, name: 'Bob', age: 45, condition: 'Diabetes' },
];
const mockPrescriptions = [
  { id: 1, patient: 'Alice', medication: 'Amoxicillin', date: '2025-06-01' },
];
const mockSchedule = [
  { id: 1, date: '2025-06-05', patient: 'Charlie', time: '10:00 AM' },
];

export default function DoctorDashboard() {
  return (
    <div>
      <h2>Doctor Dashboard</h2>
      <section>
        <h3>Reports & Analytics</h3>
        <ul>
          {mockReports.map(r => (
            <li key={r.id}>{r.title}: {r.value}</li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Patient Medical Records</h3>
        <ul>
          {mockPatients.map(p => (
            <li key={p.id}>{p.name}, Age: {p.age}, Condition: {p.condition}</li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Prescriptions</h3>
        <ul>
          {mockPrescriptions.map(p => (
            <li key={p.id}>{p.patient}: {p.medication} ({p.date})</li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Schedule of Appointments</h3>
        <ul>
          {mockSchedule.map(s => (
            <li key={s.id}>{s.date} - {s.patient} at {s.time}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
