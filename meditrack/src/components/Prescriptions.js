import React from 'react';

export default function Prescriptions({ prescriptions }) {
  return (
    <div className="bg-white rounded shadow p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Prescriptions</h2>
        <button className="text-green-600">See All</button>
      </div>
      <ul className="divide-y">
        {prescriptions.map((p, i) => (
          <li key={i} className="py-2">
            💊 {p.name} – {p.dosage}, {p.frequency}
          </li>
        ))}
      </ul>
    </div>
  );
}
