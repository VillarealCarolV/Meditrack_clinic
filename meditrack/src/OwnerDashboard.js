import React from 'react';

const mockUsers = [
  { id: 1, name: 'Alice', role: 'patient', change: 'Role change requested: nurse', status: 'pending' },
  { id: 2, name: 'Bob', role: 'doctor', change: 'Edit profile info', status: 'pending' },
];

export default function OwnerDashboard() {
  return (
    <div>
      <h2>Clinic Owner Dashboard</h2>
      <section>
        <h3>User Management (Approve/Reject Changes)</h3>
        <ul>
          {mockUsers.map(u => (
            <li key={u.id}>
              {u.name} ({u.role}) - {u.change} [{u.status}]
              <button style={{marginLeft: 8}}>Approve</button>
              <button style={{marginLeft: 4}}>Reject</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
