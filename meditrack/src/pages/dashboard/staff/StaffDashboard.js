import React from 'react';
import StaffSidebar from './StaffSidebar';
import ReportsAnalyticsSection from './ReportsAnalyticsSection';
import UserManagementTable from './UserManagementTable';
import AppointmentManagementPanel from './AppointmentManagementPanel';
import { mockReports, mockUsers, mockAppointments } from '../../../data/mockStaffData';


export default function StaffDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar (fixed, desktop only) */}
      <StaffSidebar />
      {/* Main Dashboard Area */}
      <div className="ml-0 md:ml-60 p-6">
        <h1 className="text-2xl font-bold mb-6">Clinic Staff Dashboard</h1>
        <ReportsAnalyticsSection />
        <UserManagementTable />
        <AppointmentManagementPanel />
      </div>
    </div>
  );
}
