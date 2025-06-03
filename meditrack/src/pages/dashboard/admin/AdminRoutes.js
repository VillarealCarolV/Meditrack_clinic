import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import UsersList from './components/UsersList';

// Import other admin components as they are created
// import AppointmentsList from './components/AppointmentsList';
// import Reports from './components/Reports';
// import Settings from './components/Settings';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />}>
        <Route index element={<DashboardHome />} />
        <Route path="users" element={<UsersList />} />
        {/* Uncomment and add routes as components are created */}
        {/* <Route path="appointments" element={<AppointmentsList />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} /> */}
        
        {/* Catch all other routes and redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard/admin" replace />} />
      </Route>
    </Routes>
  );
};

// Dashboard home component that shows when no sub-route is matched
const DashboardHome = () => (
  <div className="space-y-6">
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Welcome to Admin Dashboard</h2>
      <p className="text-gray-600">
        Use the sidebar to navigate through different sections of the admin panel.
      </p>
    </div>
    
    {/* Quick Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="card">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Total Users</h3>
        <p className="text-2xl font-bold">1,234</p>
        <p className="text-sm text-green-600 mt-1">+12% from last month</p>
      </div>
      
      <div className="card">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Active Sessions</h3>
        <p className="text-2xl font-bold">42</p>
        <p className="text-sm text-green-600 mt-1">+5% from yesterday</p>
      </div>
      
      <div className="card">
        <h3 className="text-sm font-medium text-gray-500 mb-2">System Status</h3>
        <div className="flex items-center">
          <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
          <span className="text-2xl font-bold">All Systems Operational</span>
        </div>
      </div>
    </div>
    
    {/* Recent Activity */}
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
      </div>
      
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-medium">U</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium">New user registered</p>
              <p className="text-sm text-gray-500">John Doe registered as a new patient</p>
              <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AdminRoutes;
