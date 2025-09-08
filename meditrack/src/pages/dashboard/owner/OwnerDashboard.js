import React, { useState, useEffect } from 'react';
import { 
  FaUserMd, 
  FaUserNurse, 
  FaCalendarAlt, 
  FaBell,
  FaPlus
} from 'react-icons/fa';
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
  const [stats, setStats] = useState(mockStats);
  const [activity, setActivity] = useState(recentActivity);

  // Fetch real data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with actual API calls:
        // const res = await fetch('/api/owner/stats');
        // const data = await res.json();
        // setStats(data);
        
        // const activityRes = await fetch('/api/owner/activity');
        // const activityData = await activityRes.json();
        // setActivity(activityData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setLoading(false);
      }
    };
    fetchData();
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
            <div className="mt-4 md:mt-0">
              <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                <FaBell className="mr-2" />
                Notifications
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {[].length > 0 ? (
                <p>Appointments will appear here</p>
              ) : (
                <div className="text-center py-8">
                  <FaCalendarAlt className="mx-auto text-gray-300 text-3xl mb-3" />
                  <h3 className="text-gray-500 font-medium">No appointments today</h3>
                  <p className="text-sm text-gray-400 mt-1">Schedule new appointments to see them here</p>
                  <button className="btn btn-primary mt-4 text-sm">
                    <FaPlus className="mr-2" />
                    New Appointment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <RoleBasedHelpBot role="owner" />
    </div>
  );
}
