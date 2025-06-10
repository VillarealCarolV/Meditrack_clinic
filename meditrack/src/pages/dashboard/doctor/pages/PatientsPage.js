import React, { useState } from 'react';
import { mockPatients } from '../../../../data/mockPatientData';
import { FiSearch, FiFilter, FiCalendar, FiPhone, FiMail, FiMapPin, FiChevronDown, FiChevronUp } from 'react-icons/fi';

function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedPatient, setExpandedPatient] = useState(null);

  const togglePatientDetails = (patientId) => {
    setExpandedPatient(expandedPatient === patientId ? null : patientId);
  };

  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800">Patient Management</h1>
      <div className="flex space-x-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">
          <FiFilter className="mr-2" />
          Filter
        </button>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredPatients.map((patient) => (
      <React.Fragment key={patient.id}>
      <tr 
        className="hover:bg-gray-50 cursor-pointer"
        onClick={() => togglePatientDetails(patient.id)}
      >
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-medium">
                {patient.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">{patient.name}</div>
              <div className="text-sm text-gray-500">{patient.gender}, {patient.age} years</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{patient.email}</div>
          <div className="text-sm text-gray-500">{patient.phone}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <FiCalendar className="text-gray-400 mr-2" />
            <span className="text-sm text-gray-900">
              {new Date(patient.lastVisit).toLocaleDateString()}
            </span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${patient.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {patient.status}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <span className="ml-4 inline-block">
            {expandedPatient === patient.id ? <FiChevronUp /> : <FiChevronDown />}
          </span>
        </td>
      </tr>
      {expandedPatient === patient.id && (
        <tr className="bg-gray-50">
          <td colSpan="5" className="px-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h4>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 flex items-center">
                    <FiMail className="mr-2" /> {patient.email}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <FiPhone className="mr-2" /> {patient.phone}
                  </p>
                  <p className="text-sm text-gray-600 flex items-start">
                    <FiMapPin className="mr-2 mt-1 flex-shrink-0" />
                    <span>{patient.address}</span>
                  </p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Medical Information</h4>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Last Visit:</span> {new Date(patient.lastVisit).toLocaleDateString()}
                  </p>
                  {patient.nextAppointment && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Next Appointment:</span> {new Date(patient.nextAppointment).toLocaleDateString()}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Medical History:</span> {patient.medicalHistory}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50">
                View Full Profile
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Schedule Appointment
              </button>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
    ))}
  </tbody>
</table>
</div>

{filteredPatients.length === 0 && (
  <div className="text-center py-12">
    <p className="text-gray-500">No patients found matching your search.</p>
  </div>
)}

<div className="mt-6 flex justify-between items-center">
  <p className="text-sm text-gray-600">
    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredPatients.length}</span> of{' '}
    <span className="font-medium">{mockPatients.length}</span> patients
  </p>
  <div className="flex space-x-2">
    <button className="px-3 py-1 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
      Previous
    </button>
    <button className="px-3 py-1 border rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
      1
    </button>
    <button className="px-3 py-1 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
      Next
    </button>
  </div>
</div>
</div>
  );
}

export default PatientsPage;
