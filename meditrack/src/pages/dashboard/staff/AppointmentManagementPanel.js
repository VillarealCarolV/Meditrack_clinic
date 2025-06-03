import React from 'react';

export default function AppointmentManagementPanel() {
  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">Manage Appointments</h2>
      <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4">+ Add Appointment</button>
      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Time</th>
            <th className="px-4 py-2">Patient</th>
            <th className="px-4 py-2">Doctor</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="px-4 py-2">2025-06-10</td>
            <td className="px-4 py-2">10:00 AM</td>
            <td className="px-4 py-2">John Doe</td>
            <td className="px-4 py-2">Dr. Smith</td>
            <td className="px-4 py-2">
              <button className="text-yellow-500 mr-2">✏️ Edit</button>
              <button className="text-red-500">🗑 Cancel</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
