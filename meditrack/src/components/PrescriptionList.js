import React from 'react';

export default function PrescriptionList({ prescriptions }) {
  if (!prescriptions?.length) return <p>No prescriptions found.</p>;
  return (
    <ul style={{paddingLeft: 20}}>
      {prescriptions.map(p => (
        <li key={p.id} style={{marginBottom: 4}}>
          <strong>{p.name}</strong> - {p.dosage} <span style={{color: '#888'}}>({p.frequency})</span>
        </li>
      ))}
    </ul>
  );
}
