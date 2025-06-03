import React from 'react';

const mockRecords = [
  { id: 1, patient: 'Alice', notes: 'Recovering well.' },
];
const mockVitals = [
  { id: 1, patient: 'Alice', bp: '120/80', temp: '36.8°C' },
];
const mockNotes = [
  { id: 1, note: 'Patient reported mild headache.' },
];
const mockMedLogs = [
  { id: 1, patient: 'Alice', med: 'Ibuprofen', time: '08:00' },
];
const mockIntake = [
  { id: 1, patient: 'Bob', status: 'Waiting' },
];
const mockFlags = [
  { id: 1, patient: 'Bob', issue: 'High BP', flaggedFor: 'doctor' },
];

export default function NurseDashboard() {
  return (
    <div>
      <h2>Nurse Dashboard</h2>
      <section>
        <h3>Patient Medical Records</h3>
        <ul>
          {mockRecords.map(r => (
            <li key={r.id}>{r.patient}: {r.notes}</li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Vitals & Observations</h3>
        <ul>
          {mockVitals.map(v => (
            <li key={v.id}>{v.patient}: BP {v.bp}, Temp {v.temp}</li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Nurse Notes</h3>
        <ul>
          {mockNotes.map(n => (
            <li key={n.id}>{n.note}</li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Medication Administration Log</h3>
        <ul>
          {mockMedLogs.map(m => (
            <li key={m.id}>{m.patient}: {m.med} at {m.time}</li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Intake Process</h3>
        <ul>
          {mockIntake.map(i => (
            <li key={i.id}>{i.patient}: {i.status}</li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Flagged Critical Issues</h3>
        <ul>
          {mockFlags.map(f => (
            <li key={f.id}>{f.patient}: {f.issue} (Flagged for {f.flaggedFor})</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
