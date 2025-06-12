import React, { useState, useEffect } from 'react';
import { mockPrescriptions } from '../../../../data/mockDoctorData';
import { FaSearch, FaPlus, FaPrint, FaEdit, FaTrash, FaEye, FaFilter, FaDownload } from 'react-icons/fa';

const PrescriptionsPage = () => {
  const [prescriptions, setPrescriptions] = useState(mockPrescriptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [currentPrescription, setCurrentPrescription] = useState(null);
  const [formData, setFormData] = useState({
    patient: '',
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    status: 'active',
    date: new Date().toISOString().split('T')[0]
  });

  // Filter prescriptions based on search and status
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = 
      prescription.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.medication.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || prescription.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentPrescription) {
      // Update existing prescription
      setPrescriptions(prescriptions.map(p => 
        p.id === currentPrescription.id ? { ...formData, id: currentPrescription.id } : p
      ));
    } else {
      // Add new prescription
      const newPrescription = {
        ...formData,
        id: `RX${Date.now()}`,
        date: new Date().toISOString(),
        status: formData.status || 'active', // Ensure status is set
        doctor: 'Dr. Smith' // This would come from auth context in a real app
      };
      setPrescriptions([newPrescription, ...prescriptions]);
    }
    handleCloseModal();
  };

  const handleEdit = (prescription) => {
    setCurrentPrescription(prescription);
    setFormData({
      patient: prescription.patient,
      medication: prescription.medication,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      duration: prescription.duration,
      instructions: prescription.instructions,
      status: prescription.status,
      date: prescription.date
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      setPrescriptions(prescriptions.filter(p => p.id !== id));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentPrescription(null);
    setFormData({
      patient: '',
      medication: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
      status: 'active',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const getStatusBadge = (status) => {
    // Ensure status is a string and has a default value
    const statusValue = status || 'active';
    const statusClasses = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      expired: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[statusValue] || 'bg-gray-100 text-gray-800'}`}>
        {statusValue.charAt(0).toUpperCase() + statusValue.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Prescriptions</h1>
            <p className="text-gray-600">Manage patient prescriptions and medications</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="mr-2" />
            New Prescription
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by patient or medication..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-400" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </div>

        {/* Prescriptions List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medication
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dosage
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPrescriptions.length > 0 ? (
                  filteredPrescriptions.map((prescription) => (
                    <tr key={prescription.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{prescription.patient}</div>
                        <div className="text-sm text-gray-500">ID: {String(prescription.id || '').slice(-6)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{prescription.medication}</div>
                        <div className="text-sm text-gray-500">{prescription.dosage}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{prescription.frequency}</div>
                        <div className="text-sm text-gray-500">{prescription.duration}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(prescription.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(prescription.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(prescription)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="text-green-600 hover:text-green-900 p-1"
                            title="View/Print"
                          >
                            <FaPrint />
                          </button>
                          <button
                            className="text-purple-600 hover:text-purple-900 p-1"
                            title="Download"
                          >
                            <FaDownload />
                          </button>
                          <button
                            onClick={() => handleDelete(prescription.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No prescriptions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Prescription Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {currentPrescription ? 'Edit Prescription' : 'New Prescription'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="patient" className="block text-sm font-medium text-gray-700 mb-1">
                      Patient Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="patient"
                      name="patient"
                      required
                      value={formData.patient}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter patient name"
                    />
                  </div>

                  <div>
                    <label htmlFor="medication" className="block text-sm font-medium text-gray-700 mb-1">
                      Medication <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="medication"
                      name="medication"
                      required
                      value={formData.medication}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter medication name"
                    />
                  </div>

                  <div>
                    <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-1">
                      Dosage <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="dosage"
                      name="dosage"
                      required
                      value={formData.dosage}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 500mg"
                    />
                  </div>

                  <div>
                    <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                      Frequency <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="frequency"
                      name="frequency"
                      required
                      value={formData.frequency}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Once daily"
                    />
                  </div>

                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 7 days"
                    />
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
                    Instructions
                  </label>
                  <textarea
                    id="instructions"
                    name="instructions"
                    rows="3"
                    value={formData.instructions}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter special instructions for the patient"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {currentPrescription ? 'Update Prescription' : 'Create Prescription'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionsPage;
