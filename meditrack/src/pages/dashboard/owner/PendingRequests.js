import React from 'react';

export default function PendingRequests() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Pending User Change Requests</h2>
      <table className="w-full text-sm border table-auto">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2">Requested Role</th>
            <th className="px-4 py-2">Current Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="px-4 py-2">Jane Smith</td>
            <td className="px-4 py-2">Doctor</td>
            <td className="px-4 py-2 text-yellow-500">Pending</td>
            <td className="px-4 py-2">
              <button className="bg-green-500 text-white px-3 py-1 rounded mr-2">✅ Approve</button>
              <button className="bg-red-500 text-white px-3 py-1 rounded">❌ Reject</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
