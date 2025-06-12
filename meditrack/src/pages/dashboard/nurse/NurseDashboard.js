import React from 'react';
import NurseSidebar from './NurseSidebar';
import MedicalRecordsTable from './MedicalRecordsTable';
import VitalsObservationsForm from './VitalsObservationsForm';
import NurseNotesPanel from './NurseNotesPanel';
import MedicationLogTable from './MedicationLogTable';
import CriticalFlagPanel from './CriticalFlagPanel';
import { mockRecords, mockVitals, mockNotes, mockMedLogs, mockIntake, mockFlags } from '../../../data/mockNurseData';
import RoleBasedHelpBot from '../../../components/RoleBasedHelpBot';

export default function NurseDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar (fixed, desktop only) */}
      <NurseSidebar />
      {/* Main Panel */}
      <div className="ml-0 md:ml-60 p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-4">Nurse Dashboard</h1>
        <section id="records"><MedicalRecordsTable records={mockRecords} /></section>
        <section id="vitals"><VitalsObservationsForm vitals={mockVitals} /></section>
        <section id="notes"><NurseNotesPanel notes={mockNotes} /></section>
        <section id="medications"><MedicationLogTable medLogs={mockMedLogs} /></section>
        <section id="flags"><CriticalFlagPanel flags={mockFlags} /></section>
      </div>
      <RoleBasedHelpBot role="nurse" />
    </div>
  );
}
