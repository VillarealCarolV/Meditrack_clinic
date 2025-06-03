import React from 'react';

export default function AppointmentsList({ appointments }) {
  return (
    <div className="bg-white rounded shadow p-4 mt-6">
      <h2 className="text-lg font-semibold mb-2">Upcoming Appointments</h2>
      <ul className="divide-y">
        {appointments.map((a, i) => (
          <li key={i} className="py-3">
            <span role="img" aria-label="calendar">📅</span> {a.date} @ {a.time} with Dr. {a.doctor}
          </li>
        ))}
      </ul>
    </div>
  );
}
