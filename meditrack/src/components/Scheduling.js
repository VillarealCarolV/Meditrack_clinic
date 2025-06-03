import React from 'react';

export default function Scheduling({ nextAppt }) {
  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-lg font-semibold mb-2">Scheduling</h2>
      <p className="mb-4">Next: {nextAppt ? `${nextAppt.date} with Dr. ${nextAppt.doctor}` : 'None'}</p>
      <div className="flex gap-4 flex-wrap">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Book New</button>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition">Reschedule</button>
      </div>
    </div>
  );
}
