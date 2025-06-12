import React from 'react';
import { mockPrescriptions, mockAppointments } from '../../../data/mockPatientData';
import TopBar from '../../../components/TopBar';
import Appointments from '../../../components/Appointments';
import Prescriptions from '../../../components/Prescriptions';
import Scheduling from '../../../components/Scheduling';
import RoleBasedHelpBot from '../../../components/RoleBasedHelpBot';

export default function PatientDashboard() {
  const patientName = 'John Doe';
  const nextAppt = mockAppointments.find(a => a.status === 'Upcoming');
  const handleLogout = () => {
    // TODO: Implement logout logic
    alert('Logged out!');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - hidden on mobile, visible md+ */}
      <aside className="hidden md:flex flex-col justify-between bg-white w-60 h-screen shadow px-4 py-6 sticky top-0 left-0 z-20">
        <nav className="flex-1">
          <div className="mb-8">
            <div className="text-xl font-bold mb-8 flex items-center gap-2">
              <span role="img" aria-label="portal">🧍‍♂️</span> Patient Portal
            </div>
            <a href="#appointments" className="flex items-center gap-2 text-gray-700 hover:text-green-600 py-2">
              <span role="img" aria-label="appointments">📅</span> Appointments
            </a>
            <a href="#prescriptions" className="flex items-center gap-2 text-gray-700 hover:text-green-600 py-2">
              <span role="img" aria-label="prescriptions">💊</span> Prescriptions
            </a>
            <a href="#scheduling" className="flex items-center gap-2 text-gray-700 hover:text-green-600 py-2">
              <span role="img" aria-label="schedule">🗓️</span> Scheduling
            </a>
          </div>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-2 text-gray-700 hover:text-red-500 py-2 font-semibold">
          <span role="img" aria-label="logout">🚪</span> Log Out
        </button>
      </aside>
      {/* Main content */}
      <div className="flex-1 min-w-0">
        <TopBar name={patientName} />
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          <section id="appointments">
            <Appointments appointments={mockAppointments} />
          </section>
          <section id="prescriptions">
            <Prescriptions prescriptions={mockPrescriptions} />
          </section>
          <section id="scheduling">
            <Scheduling nextAppt={nextAppt} />
          </section>
        </div>
      </div>
      <RoleBasedHelpBot role="patient" />
    </div>
  );
}
