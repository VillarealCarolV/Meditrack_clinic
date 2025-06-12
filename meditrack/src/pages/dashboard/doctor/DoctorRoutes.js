import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import DoctorSidebar from './DoctorSidebar';
import DoctorDashboard from './DoctorDashboard';
import PatientsPage from './pages/PatientsPage';
import ReportsPage from './pages/ReportsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import PrescriptionsPage from './pages/PrescriptionsPage';

// Main layout component that includes the sidebar and content area
function DoctorLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DoctorSidebar />
      <main className="flex-1 overflow-y-auto p-6 ml-60">
        <Outlet />
      </main>
    </div>
  );
}


function DoctorRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <DoctorLayout>
            <Outlet />
          </DoctorLayout>
        }
      >
        <Route path="dashboard" element={<DoctorDashboard />} />  
        <Route path="patients" element={<PatientsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="prescriptions" element={<PrescriptionsPage />} />
      </Route>
    </Routes>
  );
}

export default DoctorRoutes;

