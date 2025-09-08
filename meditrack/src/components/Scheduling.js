import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { 
  FaCalendarAlt, 
  FaUserMd, 
  FaUserInjured, 
  FaCalendarPlus, 
  FaSearch, 
  FaFilter,
  FaPlus,
  FaClock,
  FaMapMarkerAlt
} from 'react-icons/fa';

// Setup the localizer by providing the moment Object
const localizer = momentLocalizer(moment);

const Scheduling = () => {
  const [view, setView] = useState('week');
  const [date, setDate] = useState(new Date());
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Mock data for appointments
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      title: 'John Doe - Routine Checkup',
      start: new Date(2023, 5, 1, 10, 0),
      end: new Date(2023, 5, 1, 10, 30),
      doctor: 'Dr. Smith',
      patient: 'John Doe',
      type: 'checkup',
      status: 'scheduled',
      notes: 'Annual physical examination'
    },
    {
      id: 2,
      title: 'Jane Smith - Follow-up',
      start: new Date(2023, 5, 1, 14, 0),
      end: new Date(2023, 5, 1, 15, 0),
      doctor: 'Dr. Johnson',
      patient: 'Jane Smith',
      type: 'follow-up',
      status: 'scheduled',
      notes: 'Post-surgery follow-up'
    },
    {
      id: 3,
      title: 'Mike Wilson - Consultation',
      start: new Date(2023, 5, 2, 9, 30),
      end: new Date(2023, 5, 2, 10, 15),
      doctor: 'Dr. Williams',
      patient: 'Mike Wilson',
      type: 'consultation',
      status: 'confirmed',
      notes: 'Initial consultation for back pain'
    },
    {
      id: 4,
      title: 'Sarah Johnson - Treatment',
      start: new Date(2023, 5, 2, 11, 0),
      end: new Date(2023, 5, 2, 12, 0),
      doctor: 'Dr. Smith',
      patient: 'Sarah Johnson',
      type: 'treatment',
      status: 'scheduled',
      notes: 'Physical therapy session'
    },
    {
      id: 5,
      title: 'David Brown - Checkup',
      start: new Date(2023, 5, 3, 13, 0),
      end: new Date(2023, 5, 3, 13, 30),
      doctor: 'Dr. Johnson',
      patient: 'David Brown',
      type: 'checkup',
      status: 'confirmed',
      notes: 'Blood pressure check'
    }
  ]);

  const handleSelectSlot = (slotInfo) => {
    console.log('Selected slot:', slotInfo);
    setShowNewAppointment(true);
  };

  const handleSelectEvent = (event) => {
    console.log('Selected event:', event);
    // Handle event click (e.g., show details or edit)
  };

  const handleNavigate = (newDate) => {
    setDate(newDate);
  };

  const handleView = (newView) => {
    setView(newView);
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && appointment.status === filter;
  });

  const eventStyleGetter = (event) => {
    let backgroundColor = '';
    switch (event.status) {
      case 'scheduled':
        backgroundColor = '#3b82f6'; // blue-500
        break;
      case 'confirmed':
        backgroundColor = '#10b981'; // emerald-500
        break;
      case 'completed':
        backgroundColor = '#6b7280'; // gray-500
        break;
      case 'cancelled':
        backgroundColor = '#ef4444'; // red-500
        break;
      default:
        backgroundColor = '#3b82f6'; // default blue
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
        padding: '2px 8px',
        fontSize: '0.875rem',
      },
    };
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <FaCalendarAlt className="text-blue-500 text-2xl mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Appointment Scheduling</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search appointments..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                className="appearance-none pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Appointments</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setShowNewAppointment(true)}
            >
              <FaPlus className="mr-2" />
              New Appointment
            </button>
          </div>
        </div>
        
        <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => setView('day')}
            className={`px-3 py-1 text-sm rounded-md ${
              view === 'day' 
                ? 'bg-blue-100 text-blue-700 font-medium' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Day
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-3 py-1 text-sm rounded-md ${
              view === 'week' 
                ? 'bg-blue-100 text-blue-700 font-medium' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setView('month')}
            className={`px-3 py-1 text-sm rounded-md ${
              view === 'month' 
                ? 'bg-blue-100 text-blue-700 font-medium' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setView('agenda')}
            className={`px-3 py-1 text-sm rounded-md ${
              view === 'agenda' 
                ? 'bg-blue-100 text-blue-700 font-medium' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Agenda
          </button>
        </div>
      </div>

      <div className="h-[600px] p-4">
        <Calendar
          localizer={localizer}
          events={filteredAppointments}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          view={view}
          onView={handleView}
          date={date}
          onNavigate={handleNavigate}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          defaultView="week"
          views={['day', 'week', 'month', 'agenda']}
          step={15}
          timeslots={4}
        />
      </div>

      {/* New Appointment Modal */}
      {showNewAppointment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">New Appointment</h3>
              <button
                onClick={() => setShowNewAppointment(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="patient" className="block text-sm font-medium text-gray-700">Patient</label>
                <select
                  id="patient"
                  name="patient"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  defaultValue=""
                >
                  <option value="">Select a patient</option>
                  <option value="1">John Doe</option>
                  <option value="2">Jane Smith</option>
                  <option value="3">Mike Wilson</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">Doctor</label>
                <select
                  id="doctor"
                  name="doctor"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  defaultValue=""
                >
                  <option value="">Select a doctor</option>
                  <option value="1">Dr. Smith</option>
                  <option value="2">Dr. Johnson</option>
                  <option value="3">Dr. Williams</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date & Time</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="datetime-local"
                    name="date"
                    id="date"
                    className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Appointment Type</label>
                <select
                  id="type"
                  name="type"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  defaultValue=""
                >
                  <option value="">Select type</option>
                  <option value="checkup">Checkup</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="consultation">Consultation</option>
                  <option value="treatment">Treatment</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                <div className="mt-1">
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                    placeholder="Any additional notes..."
                    defaultValue={''}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                onClick={() => {
                  // Handle save
                  setShowNewAppointment(false);
                }}
              >
                Schedule Appointment
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                onClick={() => setShowNewAppointment(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scheduling;
