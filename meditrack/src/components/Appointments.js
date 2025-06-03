import React from 'react';

export default function Appointments({ appointments }) {
  return (
    <div className="bg-white rounded shadow p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Appointments</h2>
        <button className="text-green-600">See All</button>
      </div>
      <ul className="divide-y">
        {appointments.map((a, i) => (
          <li key={i} className="py-2">
            {a.status === 'Upcoming' ? '📅' : '✅'} {a.date} – Dr. {a.doctor} ({a.status})
          </li>
        ))}
      </ul>
    </div>
  );
}
