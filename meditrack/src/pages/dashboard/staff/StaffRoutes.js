import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import StaffSidebar from './StaffSidebar';
import AppointmentManagementPanel from './AppointmentManagementPanel';
import ReportsPage from './pages/ReportsPage';
import UserManagementPage from './pages/UserManagementPage';
import SettingsPage from './pages/SettingsPage';

// Dashboard home component that shows when no sub-route is matched
function DashboardHome() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Staff Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Welcome to the staff dashboard. Select an option from the sidebar to get started.</p>
      </div>
    </div>
  );
}

// Layout component
function StaffLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <StaffSidebar />
      <main className="flex-1 overflow-y-auto p-6 ml-60">
        <Outlet />
      </main>
    </div>
  );
}

function StaffRoutes() {
  return (
    <Routes>
      <Route element={<StaffLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="appointments" element={<AppointmentManagementPanel />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="user-management" element={<UserManagementPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard/staff" replace />} />
      </Route>
    </Routes>
  );
}

export default StaffRoutes;
