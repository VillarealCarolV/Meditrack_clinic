import React from 'react';

export default function AppointmentCard({ appointment }) {
  const statusColor = appointment.status === 'Upcoming' ? '#4caf50' : '#888';
  return (
    <div style={{border: '1px solid #eee', borderRadius: 6, padding: 10, marginBottom: 8, background: '#fafbfc'}}>
      <div><b>Date:</b> {appointment.date}</div>
      <div><b>Doctor:</b> {appointment.doctor}</div>
      <div><b>Status:</b> <span style={{color: statusColor}}>{appointment.status}</span></div>
    </div>
  );
}
