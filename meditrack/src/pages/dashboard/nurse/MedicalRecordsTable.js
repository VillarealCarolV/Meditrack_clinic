import React from 'react';

export default function MedicalRecordsTable() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Patient Medical Records</h2>
      <table className="w-full table-auto text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Patient</th>
            <th className="px-4 py-2">Age</th>
            <th className="px-4 py-2">Condition</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="px-4 py-2">John Doe</td>
            <td className="px-4 py-2">45</td>
            <td className="px-4 py-2">Hypertension</td>
            <td className="px-4 py-2">
              <button className="text-blue-500 mr-2">👁 View</button>
              <button className="text-green-600">🩺 Add Vitals</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
