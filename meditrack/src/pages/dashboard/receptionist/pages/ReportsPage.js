import React from 'react';
import ReceptionistSidebar from '../ReceptionistSidebar';

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ReceptionistSidebar activePage="reports" />
      <div className="ml-64 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Reports</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Report generation features will be available in future updates.</p>
        </div>
      </div>
    </div>
  );
}
