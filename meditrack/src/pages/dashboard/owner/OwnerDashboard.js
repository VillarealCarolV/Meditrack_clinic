import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaUserMd, 
  FaUserNurse, 
  FaUserInjured, 
  FaCalendarAlt, 
  FaDollarSign, 
  FaBell, 
  FaFileAlt, 
  FaCog, 
  FaChartLine, 
  FaUserFriends,
  FaArrowRight,
  FaPlus,
  FaUserCheck,
  FaClipboardList
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import StatsOverview from './components/StatsOverview';
import PendingApprovals from './components/PendingApprovals';
import QuickActions from './components/QuickActions';
import ActivityFeed from './components/ActivityFeed';
import OwnerSidebar from './components/OwnerSidebar';

// Mock data (replace with real API calls)
const mockStats = {
  totalUsers: 124,
  pendingApprovals: 5,
  activeDoctors: 8,
  activeNurses: 12,
  activePatients: 89,
  monthlyAppointments: 245,
  monthlyRevenue: 45230,
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
  const [activity, setActivity] = useState(recentActivity || []);

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
    <div className="dashboard-layout">
      <OwnerSidebar />
      
      <main className="main-content">
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Dashboard Overview</h1>
            <p className="dashboard-subtitle">Welcome back! Here's what's happening with your clinic today.</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-outline">
              <FaBell className="mr-2" />
              Notifications
            </button>
          </div>
        </header>
        
        <div className="content-container">

      {/* Stats Overview */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="section-title">Clinic Overview</h2>
          <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
        </div>
        
        <StatsOverview stats={stats} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
        
        {/* Pending Approvals */}
        <div>
          <PendingApprovals count={stats.pendingApprovals} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <ActivityFeed activities={activity} />
        </div>
        
        {/* Upcoming Appointments */}
        <div>
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="section-title">Today's Appointments</h2>
              <button className="btn btn-outline text-sm py-1 px-3">
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
      </div>
        </div>
      </main>
    </div>
  );
}
