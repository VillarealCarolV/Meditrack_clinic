import React, { useState } from 'react';
import { FaPills, FaFileMedical, FaUserMd, FaCalendarAlt, FaDownload } from 'react-icons/fa';

export default function PatientPrescriptions({ prescriptions = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRx, setSelectedRx] = useState(null);
  
  const filters = [
    { id: 'all', label: 'All Prescriptions' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
    { id: 'refill', label: 'Needs Refill' },
  ];

  const filteredPrescriptions = prescriptions.filter(prescription => {
    // Safely handle undefined or null values
    const patientName = prescription.patientName || '';
    const medication = prescription.medication || '';
    const searchTermLower = searchTerm.toLowerCase();
    
    const matchesSearch = 
      patientName.toLowerCase().includes(searchTermLower) ||
      medication.toLowerCase().includes(searchTermLower);
    
    if (currentFilter === 'all') return matchesSearch;
    if (currentFilter === 'active') return matchesSearch && prescription.status === 'active';
    if (currentFilter === 'completed') return matchesSearch && prescription.status === 'completed';
    if (currentFilter === 'refill') return matchesSearch && (prescription.refillsRemaining || 0) === 0;
    
    return matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Active</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">Completed</span>;
      case 'expired':
        return <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">Expired</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">Pending</span>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 pt-6 pb-5">
        <div className="flex items-center gap-2">
          <FaPills className="text-green-600 text-2xl" />
          <h2 className="text-2xl font-bold m-0 leading-none">My Prescription</h2>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6">
          <div className="flex-1 min-w-[220px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search prescriptions..."
                className="px-4 py-2 border border-gray-300 rounded w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {filters.map(f => (
              <button
                key={f.id}
                onClick={() => setCurrentFilter(f.id)}
                className={`px-3 py-1.5 rounded border text-sm ${currentFilter === f.id ? 'bg-gray-500 text-white border-gray-600' : 'bg-white text-gray-700 border-gray-300'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6 mb-2 border-t border-gray-200" />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prescription</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prescribed By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPrescriptions.length > 0 ? (
              filteredPrescriptions.map((rx) => (
                <tr key={rx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{rx.medication}</div>
                      <div className="text-sm text-gray-500">{rx.dosage} • {rx.frequency}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaUserMd className="text-gray-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Dr. {rx.doctorName}</p>
                        <p className="text-xs text-gray-500">{rx.specialty}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-900">{formatDate(rx.datePrescribed)}</div>
                        <div className="text-xs text-gray-500">{rx.refillsRemaining} refills remaining</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(rx.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                        onClick={() => { setSelectedRx(rx); setShowDetails(true); }}
                      >
                        <FaFileMedical size={18} />
                      </button>
                      <button className="text-gray-500 hover:text-gray-700" title="Download"><FaDownload size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center">
                  <FaPills className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No prescriptions found</h3>
                  <p className="mt-1 text-sm text-gray-500">{searchTerm || currentFilter !== 'all' ? 'No prescriptions match your search criteria.' : 'No prescriptions yet.'}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showDetails && selectedRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setShowDetails(false); setSelectedRx(null); }} />
          <div className="relative bg-white w-full max-w-2xl mx-4 rounded-lg shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Prescription Details</h3>
              <button className="text-gray-600" onClick={() => { setShowDetails(false); setSelectedRx(null); }}>✕</button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <div className="text-sm text-gray-500 mb-2">Prescription Details</div>
                <div className="border-t border-gray-200 mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Medicine</div>
                    <div className="font-medium">{(selectedRx.genericName || selectedRx.medication || '—')}{selectedRx.brandName ? ` (${selectedRx.brandName})` : ''}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Dosage</div>
                    <div className="font-medium">{selectedRx.dosage || '—'}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Route</div>
                    <div className="font-medium">{selectedRx.route || '—'}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Frequency / Schedule</div>
                    <div className="font-medium">{selectedRx.frequency || '—'}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Duration</div>
                    <div className="font-medium">{selectedRx.duration || '—'}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Start – End</div>
                    <div className="font-medium">{selectedRx.startDate ? formatDate(selectedRx.startDate) : '—'} – {selectedRx.endDate ? formatDate(selectedRx.endDate) : '—'}</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-gray-600">Prescribing Doctor</div>
                    <div className="font-medium">Dr. {selectedRx.doctorName || '—'} {selectedRx.specialty ? `(${selectedRx.specialty})` : ''}</div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="text-sm text-gray-500 mb-2">Instructions / Notes</div>
                <div className="border-t border-gray-200 mb-4"></div>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-gray-600">Special Instructions</div>
                    <div className="font-medium">{selectedRx.instructions || '—'}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Allergy Alerts</div>
                    <div className="font-medium">{selectedRx.allergyAlerts || selectedRx.allergies || '—'}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Possible Side Effects</div>
                    <div className="font-medium">{selectedRx.sideEffects || '—'}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
              <button className="px-4 py-2 border rounded" onClick={() => { setShowDetails(false); setSelectedRx(null); }}>Close</button>
              <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => window.print()}>Print</button>
            </div>
          </div>
        </div>
      )}

      {/* Optional footer can go here */}
    </div>
  );
}
