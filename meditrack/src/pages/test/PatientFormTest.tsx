import React, { useState } from 'react';
import { PatientForm } from '../../features/patients';
import { Patient } from '../../features/patients/types/patient';
import { PatientFormData } from '../../features/patients/types/patientFormData';

const PatientFormTest = () => {
  const [showForm, setShowForm] = useState(true);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);

  const handleSuccess = (formData: PatientFormData) => {
    // Create a new patient object with the form data and additional fields
    const newPatient: Patient = {
      ...formData,
      id: `pat-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    console.log('Form submitted successfully:', newPatient);
    setCurrentPatient(newPatient);
    setShowForm(false);
  };

  const handleAddNew = () => {
    setCurrentPatient(null);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {currentPatient ? 'Patient Details' : 'Add New Patient'}
          </h1>
          <p className="text-gray-600">
            {currentPatient
              ? 'Patient information has been saved successfully.'
              : 'Please fill in the patient details below.'}
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          {showForm ? (
            <PatientForm
              initialData={currentPatient || undefined}
              onSuccess={handleSuccess}
              onCancel={currentPatient ? () => setShowForm(false) : undefined}
            />
          ) : (
            <div className="space-y-4">
              {currentPatient && (
                <div className="space-y-2">
                  <p><strong>Name:</strong> {currentPatient.fullName}</p>
                  <p><strong>Date of Birth:</strong> {currentPatient.dob}</p>
                  <p><strong>Gender:</strong> {currentPatient.gender}</p>
                  <p><strong>Contact:</strong> {currentPatient.contactInfo}</p>
                  {currentPatient.address && (
                    <p><strong>Address:</strong> {currentPatient.address}</p>
                  )}
                </div>
              )}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleAddNew}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Another Patient
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientFormTest;
