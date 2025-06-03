import React from 'react';

export default function ReportsAnalyticsSection() {
  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">Reports & Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded">📊 Total Users: 45</div>
        <div className="bg-green-100 p-4 rounded">📅 Appointments Today: 12</div>
        <div className="bg-yellow-100 p-4 rounded">🧾 Pending Approvals: 3</div>
      </div>
    </div>
  );
}
