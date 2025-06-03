import React from 'react';

export default function SchedulingInfo({ appointments }) {
  const upcoming = appointments.filter(a => a.status === 'Upcoming');
  if (!upcoming.length) return <p>No upcoming appointments.</p>;
  return (
    <ul style={{paddingLeft: 20}}>
      {upcoming.map(a => (
        <li key={a.id}>{a.date} with {a.doctor}</li>
      ))}
    </ul>
  );
}
