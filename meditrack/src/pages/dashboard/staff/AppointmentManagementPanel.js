import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import StaffSidebar from './StaffSidebar';

import { 
  Search, Filter, Calendar as CalendarIcon, List, Plus, Edit, Trash2, Check, X, Clock, User, Phone, Mail, Info, AlertCircle 
} from 'react-feather';

const localizer = momentLocalizer(moment);

// Mock data - replace with API calls in production
const mockDoctors = [
  { id: 1, name: 'Dr. Cruz', specialty: 'Cardiology' },
  { id: 2, name: 'Dr. Reyes', specialty: 'Pediatrics' },
  { id: 3, name: 'Dr. Santos', specialty: 'Dermatology' },
];

console.log("✅ AppointmentManagementPanel rendered");

const mockAppointments = [
  {
    id: 1,
    patient: { id: 1, name: 'Juan Dela Cruz', phone: '09123456789', email: 'juan@example.com' },
    doctor: { id: 1, name: 'Dr. Cruz' },
    date: '2025-06-15',
    time: '10:00',
    status: 'pending',
    reason: 'Routine checkup',
    notes: 'Patient feels dizzy every morning.'
  },
  {
    id: 2,
    patient: { id: 2, name: 'Anna Lim', phone: '09123456788', email: 'anna@example.com' },
    doctor: { id: 2, name: 'Dr. Reyes' },
    date: '2025-06-10',
    time: '14:30',
    status: 'confirmed',
    reason: 'Follow-up',
    notes: 'Annual physical examination'
  },
];

export default function AppointmentManagementPanel() {
  const [view, setView] = useState('list'); // 'list' or 'calendar'
  const [appointments, setAppointments] = useState([...mockAppointments]);
const [filteredAppointments, setFilteredAppointments] = useState([...mockAppointments]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    doctor: '',
    date: '',
    status: '',
    search: ''
  });

  const [newAppointment, setNewAppointment] = useState({
    patient: { name: '', phone: '', email: '' },
    doctor: '',
    date: '',
    time: '',
    reason: '',
    notes: ''
  });

  // Apply filters
  useEffect(() => {
    const result = mockAppointments.filter(apt => {
      if (filters.doctor && !apt.doctor.name.toLowerCase().includes(filters.doctor.toLowerCase())) {
        return false;
      }
      if (filters.date && apt.date !== filters.date) {
        return false;
      }
      if (filters.status && apt.status !== filters.status) {
        return false;
      }
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        if (
          !apt.patient.name.toLowerCase().includes(searchTerm) &&
          !apt.doctor.name.toLowerCase().includes(searchTerm) &&
          !apt.reason.toLowerCase().includes(searchTerm)
        ) {
          return false;
        }
      }
      return true;
    });
  
    setFilteredAppointments(result);
  }, [filters]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleStatusUpdate = (appointmentId, newStatus) => {
    const updated = appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: newStatus } : apt
    );
    setAppointments(updated);
    setShowModal(false);
  };

  const handleCreateAppointment = (e) => {
    e.preventDefault();
    const newApt = {
      ...newAppointment,
      id: Math.max(...appointments.map(a => a.id), 0) + 1,
      status: 'confirmed',
      patient: { ...newAppointment.patient }
    };
    
    const updatedAppointments = [...appointments, newApt];
    setAppointments(updatedAppointments);
    setFilteredAppointments(updatedAppointments); // Update filtered appointments too
    setShowCreateModal(false);
    // Reset form
    setNewAppointment({
      patient: { name: '', phone: '', email: '' },
      doctor: '',
      date: '',
      time: '',
      reason: '',
      notes: ''
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status] || 'bg-gray-100'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const events = appointments.map(apt => ({
    title: `${apt.patient.name} - ${apt.doctor.name}`,
    start: new Date(`${apt.date}T${apt.time}`),
    end: moment(`${apt.date}T${apt.time}`).add(30, 'minutes').toDate(),
    allDay: false,
    resource: apt
  }));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <StaffSidebar activePage="appointments" />
        <div className="bg-white p-6 rounded-lg shadow h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Appointment Management</h2>

            <div className="flex space-x-2">
              <button 
                onClick={() => setView('list')} 
                className={`flex items-center px-4 py-2 rounded-lg ${view === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
              >
                <List size={16} className="mr-2" /> List View
              </button>
              <button 
                onClick={() => setView('calendar')} 
                className={`flex items-center px-4 py-2 rounded-lg ${view === 'calendar' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
              >
                <CalendarIcon size={16} className="mr-2" /> Calendar View
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={filters.doctor}
                  onChange={(e) => handleFilterChange('doctor', e.target.value)}
                >
                  <option value="">All Doctors</option>
                  {mockDoctors.map(doctor => (
                    <option key={doctor.id} value={doctor.name}>{doctor.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" 
                  className="w-full p-2 border rounded-md"
                  value={filters.date}
                  onChange={(e) => handleFilterChange('date', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 p-2 border rounded-md"
                placeholder="Search by patient, doctor, or reason..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500">
          Showing {filteredAppointments.length} of {appointments.length} appointments
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={16} className="mr-2" /> Add New Appointment
        </button>
      </div>

      {/* Appointments List View */}
      {view === 'list' && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map(appointment => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{appointment.patient.name}</div>
                    <div className="text-sm text-gray-500">{appointment.patient.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{appointment.doctor.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {moment(appointment.date).format('MMM D, YYYY')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {moment(appointment.time, 'HH:mm').format('h:mm A')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{appointment.reason}</div>
                    {appointment.notes && (
                      <div className="text-xs text-gray-500 truncate max-w-xs">
                        <Info size={12} className="inline mr-1" /> {appointment.notes}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(appointment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => {
                        // Implement edit functionality
                      }}
                      className="text-yellow-600 hover:text-yellow-900 mr-3"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAppointments.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No appointments found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Calendar View */}
      {view === 'calendar' && (
        <div className="h-[600px] mt-4">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            onSelectEvent={(event) => {
              setSelectedAppointment(event.resource);
              setShowModal(true);
            }}
            views={['month', 'week', 'day', 'agenda']}
            defaultView="week"
            selectable
            onSelectSlot={({ start, end }) => {
              // Handle slot selection for new appointment
              setNewAppointment(prev => ({
                ...prev,
                date: moment(start).format('YYYY-MM-DD'),
                time: moment(start).format('HH:mm')
              }));
              setShowCreateModal(true);
            }}
          />
        </div>
      )}

      {/* Appointment Detail Modal */}
      {showModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Appointment Details</h3>
                  <p className="text-sm text-gray-500">ID: {selectedAppointment.id}</p>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-start">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Patient</div>
                  <div className="w-2/3">
                    <div className="font-medium">{selectedAppointment.patient.name}</div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Phone size={14} className="mr-1" /> {selectedAppointment.patient.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail size={14} className="mr-1" /> {selectedAppointment.patient.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Doctor</div>
                  <div className="w-2/3">
                    <div className="font-medium">{selectedAppointment.doctor.name}</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Date & Time</div>
                  <div className="w-2/3">
                    <div className="font-medium">
                      {moment(selectedAppointment.date).format('dddd, MMMM D, YYYY')}
                    </div>
                    <div className="text-gray-500">
                      {moment(selectedAppointment.time, 'HH:mm').format('h:mm A')}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Reason</div>
                  <div className="w-2/3">
                    <div className="font-medium">{selectedAppointment.reason}</div>
                  </div>
                </div>

                {selectedAppointment.notes && (
                  <div className="flex items-start">
                    <div className="w-1/3 text-sm font-medium text-gray-500">Notes</div>
                    <div className="w-2/3 text-gray-700">
                      {selectedAppointment.notes}
                    </div>
                  </div>
                )}

                <div className="flex items-start">
                  <div className="w-1/3 text-sm font-medium text-gray-500">Status</div>
                  <div className="w-2/3">
                    {getStatusBadge(selectedAppointment.status)}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between">
                <div>
                  {selectedAppointment.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleStatusUpdate(selectedAppointment.id, 'confirmed')}
                        className="mr-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <Check size={16} className="mr-1" /> Confirm
                      </button>
                      <button className="mr-2 inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <Clock size={16} className="mr-1" /> Reschedule
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => handleStatusUpdate(selectedAppointment.id, 'cancelled')}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <X size={16} className="mr-1" /> Cancel Appointment
                  </button>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Appointment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900">Create New Appointment</h3>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleCreateAppointment} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full p-2 border rounded-md"
                      value={newAppointment.patient.name}
                      onChange={(e) => setNewAppointment({
                        ...newAppointment,
                        patient: { ...newAppointment.patient, name: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      className="w-full p-2 border rounded-md"
                      value={newAppointment.patient.phone}
                      onChange={(e) => setNewAppointment({
                        ...newAppointment,
                        patient: { ...newAppointment.patient, phone: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full p-2 border rounded-md"
                      value={newAppointment.patient.email}
                      onChange={(e) => setNewAppointment({
                        ...newAppointment,
                        patient: { ...newAppointment.patient, email: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Doctor *</label>
                    <select
                      required
                      className="w-full p-2 border rounded-md"
                      value={newAppointment.doctor}
                      onChange={(e) => setNewAppointment({
                        ...newAppointment,
                        doctor: e.target.value
                      })}
                    >
                      <option value="">Select Doctor</option>
                      {mockDoctors.map(doctor => (
                        <option key={doctor.id} value={doctor.name}>
                          {doctor.name} ({doctor.specialty})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                    <input
                      type="date"
                      required
                      className="w-full p-2 border rounded-md"
                      value={newAppointment.date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setNewAppointment({
                        ...newAppointment,
                        date: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                    <input
                      type="time"
                      required
                      className="w-full p-2 border rounded-md"
                      value={newAppointment.time}
                      onChange={(e) => setNewAppointment({
                        ...newAppointment,
                        time: e.target.value
                      })}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit *</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border rounded-md"
                    placeholder="E.g., Routine checkup, follow-up, etc."
                    value={newAppointment.reason}
                    onChange={(e) => setNewAppointment({
                      ...newAppointment,
                      reason: e.target.value
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                  <textarea
                    rows="3"
                    className="w-full p-2 border rounded-md"
                    placeholder="Any additional notes or instructions..."
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment({
                      ...newAppointment,
                      notes: e.target.value
                    })}
                  />
                </div>
                
                <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>   

  );
}