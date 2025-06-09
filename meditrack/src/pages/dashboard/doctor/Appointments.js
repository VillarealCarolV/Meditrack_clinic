import { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import DoctorSidebar from './DoctorSidebar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const Appointment = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [view, setView] = useState('week');
  const [showPast, setShowPast] = useState(false);
  const [pendingOnly, setPendingOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data - replace with actual API calls
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      title: 'Juan Dela Cruz',
      start: new Date(2025, 5, 9, 9, 0),
      end: new Date(2025, 5, 9, 10, 0),
      service: 'Consultation',
      status: 'confirmed',
      notes: 'Frequent dizziness',
      branch: 'Elida Clinic',
      attachments: ['cbc.pdf']
    },
    // Add more sample appointments as needed
  ]);

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      moment(apt.start).format('MMMM D, YYYY').toLowerCase().includes(searchQuery.toLowerCase());
    const isPending = pendingOnly ? apt.status === 'pending' : true;
    const isPast = showPast ? true : moment(apt.start).isSameOrAfter(moment().startOf('day'));
    
    return matchesSearch && isPending && isPast;
  });

  const handleSelectEvent = (event) => {
    setSelectedAppointment(event);
    setShowModal(true);
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = '';
    switch (event.status) {
      case 'confirmed':
        backgroundColor = '#3b82f6'; // blue
        break;
      case 'pending':
        backgroundColor = '#f59e0b'; // amber
        break;
      case 'cancelled':
        backgroundColor = '#ef4444'; // red
        break;
      default:
        backgroundColor = '#10b981'; // green for available
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
        margin: '2px 0',
        fontSize: '0.8rem',
      },
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DoctorSidebar />
      <div className="flex-1 ml-60 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📅 My Schedule: {moment(selectedDate).format('MMMM YYYY')}</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            🔄 Refresh
          </button>
          <select 
            className="px-4 py-2 border rounded"
            value={view}
            onChange={(e) => setView(e.target.value)}
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>
      </div>

      <div className="flex space-x-4 mb-4">
        <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="showPast" 
            checked={showPast}
            onChange={() => setShowPast(!showPast)}
            className="h-4 w-4"
          />
          <label htmlFor="showPast">Show Past</label>
        </div>
        <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="pendingOnly" 
            checked={pendingOnly}
            onChange={() => setPendingOnly(!pendingOnly)}
            className="h-4 w-4"
          />
          <label htmlFor="pendingOnly">Pending Only</label>
        </div>
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by patient or date..."
            className="w-full px-4 py-2 border rounded"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Calendar
          localizer={localizer}
          events={filteredAppointments}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          view={view}
          onView={setView}
          date={selectedDate}
          onNavigate={setSelectedDate}
          selectable
          defaultView="week"
        />
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 mr-2 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 mr-2 rounded"></div>
          <span>Confirmed</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-amber-500 mr-2 rounded"></div>
          <span>Pending</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 mr-2 rounded"></div>
          <span>Cancelled</span>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {showModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Appointment Details</h2>
            <div className="space-y-3">
              <p><span className="font-semibold">👤 Patient:</span> {selectedAppointment.title}</p>
              <p><span className="font-semibold">🏥 Branch:</span> {selectedAppointment.branch || 'N/A'}</p>
              <p><span className="font-semibold">📅 Date:</span> {moment(selectedAppointment.start).format('MMMM D, YYYY')}</p>
              <p><span className="font-semibold">🕒 Time:</span> {moment(selectedAppointment.start).format('h:mm A')} - {moment(selectedAppointment.end).format('h:mm A')}</p>
              <p><span className="font-semibold">🩺 Service:</span> {selectedAppointment.service || 'N/A'}</p>
              <p><span className="font-semibold">📋 Notes:</span> {selectedAppointment.notes || 'No notes'}</p>
              {selectedAppointment.attachments && selectedAppointment.attachments.length > 0 && (
                <div>
                  <span className="font-semibold">📄 Attachments:</span>
                  <ul className="list-disc pl-5 mt-1">
                    {selectedAppointment.attachments.map((file, index) => (
                      <li key={index} className="text-blue-600 hover:underline cursor-pointer">
                        {file}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                Back
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                📝 Add SOAP Note
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Mark as Completed
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Appointment;