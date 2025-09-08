import React, { useState, useEffect } from 'react';
import { FaUserMd, FaUserNurse, FaCalendarAlt, FaBell } from 'react-icons/fa';
import PendingApprovals from './components/PendingApprovals';
import ActivityFeed from './components/ActivityFeed';
import OwnerSidebar from './components/OwnerSidebar';
import RoleBasedHelpBot from '../../../components/RoleBasedHelpBot';

// Mock data (replace with real API calls)
const mockStats = {
  activeDoctors: 8,
  activeNurses: 12,
  appointmentsToday: 12,
  patientsPerDoctor: 11.1,
  pendingApprovals: 5,
};

const recentActivity = [
  { id: 1, action: 'New registration: Dr. Sarah Johnson (Doctor)', time: '10 mins ago' },
  { id: 2, action: 'Appointment completed: John Doe with Dr. Smith', time: '25 mins ago' },
  { id: 3, action: 'New lab result uploaded for Jane Smith', time: '1 hour ago' },
  { id: 4, action: 'Prescription refill request from Robert Wilson', time: '2 hours ago' },
];

export default function OwnerDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats] = useState(mockStats);
  const [activity] = useState(recentActivity);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-semibold text-gray-700">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <OwnerSidebar />
      
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
              <p className="text-gray-600">Welcome back! Here's what's happening with your clinic today.</p>
            </div>
            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 mt-4 md:mt-0">
              <FaBell className="mr-2" />
              Notifications
            </button>
          </div>

          {/* Stats Overview */}
          <section className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Clinic Overview</h2>
              <div className="mt-2 md:mt-0">
                <select className="w-full md:w-auto border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Today</option>
                  <option>This Week</option>
                  <option>This Month</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Active Doctors */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                    <FaUserMd className="text-xl" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Doctors</p>
                    <p className="text-2xl font-semibold">{stats.activeDoctors}</p>
                    <p className="text-xs text-gray-500">{stats.patientsPerDoctor} patients per doctor</p>
                  </div>
                </div>
              </div>

              {/* Active Nurses */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                    <FaUserNurse className="text-xl" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Nurses</p>
                    <p className="text-2xl font-semibold">{stats.activeNurses}</p>
                  </div>
                </div>
              </div>

              {/* Appointments Today */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                    <FaCalendarAlt className="text-xl" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Appointments Today</p>
                    <p className="text-2xl font-semibold">{stats.appointmentsToday}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pending Approvals and Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PendingApprovals count={stats.pendingApprovals} />
            <ActivityFeed activities={activity} />
          </div>
        </div>
      </main>
      
      <RoleBasedHelpBot role="owner" />
    </div>
  );
}
