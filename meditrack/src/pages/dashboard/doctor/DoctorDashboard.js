import React from 'react';
import { mockReports, mockPatients, mockPrescriptions, mockSchedule } from '../../../data/mockDoctorData';
import DoctorSidebar from './DoctorSidebar';
import RoleBasedHelpBot from '../../../components/RoleBasedHelpBot';

export default function DoctorDashboard() {
  // Mock overview stats
  const totalPatients = mockPatients.length;
  const upcomingAppointments = mockSchedule.length;
  const completedThisWeek = 12; // placeholder

  return (
    <div className="min-h-screen bg-gray-50 flex">
        <DoctorSidebar />
        {/* Main Content */}
        <main className="flex-1 ml-60 p-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
            <div className="bg-blue-100 p-4 rounded shadow text-center">
              <div className="text-lg font-bold">Total Patients</div>
              <div className="text-2xl">{totalPatients}</div>
            </div>
            <div className="bg-green-100 p-4 rounded shadow text-center">
              <div className="text-lg font-bold">Upcoming Appointments</div>
              <div className="text-2xl">{upcomingAppointments}</div>
            </div>
            <div className="bg-yellow-100 p-4 rounded shadow text-center">
              <div className="text-lg font-bold">Completed This Week</div>
              <div className="text-2xl">{completedThisWeek}</div>
            </div>
          </div>

          {/* Appointments Section */}
          <div className="bg-white rounded shadow p-4 mb-6">
            <h2 className="text-lg font-semibold mb-2">Upcoming Appointments</h2>
            <ul className="space-y-2">
              {mockSchedule.map((a, i) => (
                <li key={i} className="border-b py-2 last:border-b-0">
                  {a.date} at {a.time} with {a.patient} <span className="text-green-600">(Upcoming)</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Patient Medical Records Section */}
          <div className="bg-white rounded shadow p-4 mb-6">
            <h2 className="text-lg font-semibold mb-2">Patient Medical Records</h2>
            <table className="w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Patient</th>
                  <th className="px-4 py-2">Age</th>
                  <th className="px-4 py-2">Condition</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockPatients.map((p, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-2">{p.name}</td>
                    <td className="px-4 py-2">{p.age}</td>
                    <td className="px-4 py-2">{p.condition}</td>
                    <td className="px-4 py-2">
                      <button className="text-blue-500 hover:underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Prescriptions Management Section */}
          <div className="bg-white rounded shadow p-4 mb-6">
            <h2 className="text-lg font-semibold mb-2">Prescriptions</h2>
            <ul className="space-y-2">
              {mockPrescriptions.map((p, i) => (
                <li key={i} className="border-b py-2 last:border-b-0">
                  {p.patient}: {p.medication}, <span className="font-mono">{p.date}</span>
                </li>
              ))}
            </ul>
            <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Add Prescription</button>
          </div>

          {/* Reports & Analytics Section */}
          <div className="bg-white rounded shadow p-4 mb-6">
            <h2 className="text-lg font-semibold mb-2">Analytics</h2>
            <p>Coming soon: patient activity chart, diagnosis stats, etc.</p>
          </div>
        </main>
        
      <RoleBasedHelpBot role="doctor" />
    </div>
      
      
  );
}
