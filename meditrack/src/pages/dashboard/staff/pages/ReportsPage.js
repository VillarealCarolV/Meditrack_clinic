import React from 'react';
import { useNavigate } from 'react-router-dom';
import StaffSidebar from '../StaffSidebar';

export default function ReportsPage() {
  const navigate = useNavigate();
  
  // Mock data - replace with actual data fetching
  const stats = [
    { title: 'Total Users', value: '45', change: '+12%', trend: 'up' },
    { title: 'Appointments Today', value: '12', change: '+3', trend: 'up' },
    { title: 'Pending Approvals', value: '3', change: '-1', trend: 'down' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <StaffSidebar activePage="reports" />
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
              <div className="flex items-baseline mt-2">
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className={`ml-2 text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Add more report components here */}
      </div>
  );
}
