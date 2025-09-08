import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import ReceptionistSidebar from './ReceptionistSidebar';
import AppointmentManagementPanel from './AppointmentManagementPanel';
import ReportsPage from './pages/ReportsPage';
import UserManagementPage from './pages/UserManagementPage';
import SettingsPage from './pages/SettingsPage';

// Dashboard home component that shows when no sub-route is matched
function DashboardHome() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Receptionist Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Welcome to the receptionist dashboard. Select an option from the sidebar to get started.</p>
      </div>
    </div>
  );
}

// Layout component
function ReceptionistLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <ReceptionistSidebar />
      <main className="flex-1 overflow-y-auto p-6 ml-60">
        <Outlet />
      </main>
    </div>
  );
}

function ReceptionistRoutes() {
  return (
    <Routes>
      <Route element={<ReceptionistLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="appointments" element={<AppointmentManagementPanel />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="user-management" element={<UserManagementPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard/receptionist" replace />} />
      </Route>
    </Routes>
  );
}

export default ReceptionistRoutes;
