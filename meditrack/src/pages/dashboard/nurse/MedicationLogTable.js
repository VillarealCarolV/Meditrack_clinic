import React from 'react';

export default function MedicationLogTable() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Medication Log</h2>
      <table className="w-full table-auto text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Patient</th>
            <th className="px-4 py-2">Medication</th>
            <th className="px-4 py-2">Dose</th>
            <th className="px-4 py-2">Time</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="px-4 py-2">John Doe</td>
            <td className="px-4 py-2">Paracetamol</td>
            <td className="px-4 py-2">500mg</td>
            <td className="px-4 py-2">10:00 AM</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
