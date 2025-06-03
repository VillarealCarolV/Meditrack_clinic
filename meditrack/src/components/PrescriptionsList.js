import React from 'react';

export default function PrescriptionsList({ prescriptions }) {
  return (
    <div className="bg-white rounded shadow p-4 mt-6">
      <h2 className="text-lg font-semibold mb-2">Prescriptions</h2>
      <ul className="divide-y">
        {prescriptions.map((p, i) => (
          <li key={i} className="py-3">
            <span role="img" aria-label="pill">💊</span> {p.name} — {p.dosage}, {p.frequency}
            <br />
            <span role="img" aria-label="doctor">👨‍⚕️</span> Dr. {p.doctor}
          </li>
        ))}
      </ul>
    </div>
  );
}
