import React, { useState } from 'react';
import { format, startOfWeek, addDays, isSameDay, isBefore, isAfter } from 'date-fns';
import { FiRefreshCw, FiSearch, FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaRegCalendarAlt, FaRegClock, FaRegUser, FaRegHospital, FaRegStickyNote, FaFilePdf } from 'react-icons/fa';

const AppointmentsPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showPast, setShowPast] = useState(false);
  const [pendingOnly, setPendingOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [view, setView] = useState('week'); // 'day', 'week', 'month'

  // Sample data - replace with API calls
  const appointments = [
    {
      id: 1,
      patient: 'Juan Dela Cruz',
      start: new Date(2025, 5, 9, 9, 0),
      end: new Date(2025, 5, 9, 10, 0),
      service: 'Consultation',
      status: 'confirmed',
      notes: 'Frequent dizziness',
      branch: 'Elida Clinic',
      attachments: ['cbc.pdf']
    },
    {
      id: 2,
      patient: 'Maria Santos',
      start: new Date(2025, 5, 9, 11, 0),
      end: new Date(2025, 5, 9, 12, 0),
      service: 'Follow-up',
      status: 'cancelled',
      notes: 'Annual checkup',
      branch: 'Elida Clinic',
      attachments: []
    },
    // Add more sample appointments as needed
  ];

  // Filter appointments based on search and filters
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = 
      apt.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      format(apt.start, 'MMMM d, yyyy').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !pendingOnly || apt.status === 'pending';
    const isInFuture = showPast || isAfter(apt.start, new Date()) || isSameDay(apt.start, new Date());
    
    return matchesSearch && matchesStatus && isInFuture;
  });

  // Get week days for the week view
  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Get appointments for a specific day
  const getAppointmentsForDay = (day) => {
    return filteredAppointments.filter(apt => isSameDay(apt.start, day));
  };

  // Navigation functions
  const goToToday = () => setCurrentDate(new Date());
  const goToPrevWeek = () => setCurrentDate(prev => addDays(prev, -7));
  const goToNextWeek = () => setCurrentDate(prev => addDays(prev, 7));

  // Render appointment status badge
  const renderStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { color: 'bg-blue-100 text-blue-800', text: 'Confirmed' },
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelled' },
      available: { color: 'bg-green-100 text-green-800', text: 'Available' }
    };
    
    const config = statusConfig[status] || statusConfig.available;
    return (
      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            📅 My Schedule for: {format(currentDate, 'MMMM yyyy')}
          </h1>
          <div className="flex items-center space-x-3">
            <button 
              onClick={goToToday}
              className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 flex items-center"
            >
              <FiRefreshCw className="mr-1.5" />
              <span>Refresh</span>
            </button>
            
            <div className="relative">
              <button className="px-3 py-1.5 border rounded-md flex items-center">
                <span>Filter</span>
                <span className="ml-1.5">▼</span>
              </button>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="mt-4 flex justify-between items-center">
          <div className="flex space-x-2">
            <button 
              onClick={() => setView('day')}
              className={`px-3 py-1 rounded-md ${view === 'day' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
            >
              Day
            </button>
            <button 
              onClick={() => setView('week')}
              className={`px-3 py-1 rounded-md ${view === 'week' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
            >
              Week
            </button>
            <button 
              onClick={() => setView('month')}
              className={`px-3 py-1 rounded-md ${view === 'month' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
            >
              Month
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search patient or date..."
                className="pl-10 pr-4 py-2 border rounded-md w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Toggle Filters */}
        <div className="mt-3 flex items-center space-x-4 text-sm">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showPast}
              onChange={() => setShowPast(!showPast)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Show Past</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={pendingOnly}
              onChange={() => setPendingOnly(!pendingOnly)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Pending Only</span>
          </label>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Calendar View */}
        <div className="w-1/3 border-r bg-white p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={goToPrevWeek}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-medium">
              {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
            </span>
            <button 
              onClick={goToNextWeek}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {weekDays.map((day, index) => {
              const dayAppointments = getAppointmentsForDay(day);
              const isToday = isSameDay(day, new Date());
              
              return (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg border ${isToday ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}
                >
                  <div className="font-medium mb-2">
                    {format(day, 'EEE, MMM d')}
                    {isToday && <span className="ml-2 text-sm text-blue-600">(Today)</span>}
                  </div>
                  
                  {dayAppointments.length > 0 ? (
                    <div className="space-y-2">
                      {dayAppointments.map(apt => (
                        <div 
                          key={apt.id}
                          className="p-2 text-sm border-l-4 border-blue-400 bg-white rounded-r shadow-sm cursor-pointer hover:bg-blue-50"
                          onClick={() => setSelectedAppointment(apt)}
                        >
                          <div className="font-medium">{apt.patient}</div>
                          <div className="text-xs text-gray-500">{format(apt.start, 'h:mm a')} - {format(apt.end, 'h:mm a')}</div>
                          {renderStatusBadge(apt.status)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 italic">No appointments</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Appointment Details */}
        <div className="flex-1 p-6 overflow-y-auto">
          {selectedAppointment ? (
            <div className="bg-white rounded-lg shadow-sm border p-6 max-w-2xl mx-auto">
              <h2 className="text-xl font-bold mb-6">Appointment Details</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <FaRegUser className="text-gray-400 mt-1 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Patient</div>
                    <div className="font-medium">{selectedAppointment.patient}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaRegHospital className="text-gray-400 mt-1 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Branch</div>
                    <div>{selectedAppointment.branch}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaRegCalendarAlt className="text-gray-400 mt-1 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Date</div>
                    <div>{format(selectedAppointment.start, 'MMMM d, yyyy')}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaRegClock className="text-gray-400 mt-1 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Time</div>
                    <div>{format(selectedAppointment.start, 'h:mm a')} - {format(selectedAppointment.end, 'h:mm a')}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaRegStickyNote className="text-gray-400 mt-1 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Notes</div>
                    <div className="whitespace-pre-line">
                      {selectedAppointment.notes || 'No notes provided'}
                    </div>
                  </div>
                </div>
                
                {selectedAppointment.attachments && selectedAppointment.attachments.length > 0 && (
                  <div className="pt-2">
                    <div className="text-sm font-medium text-gray-700 mb-2">Attachments</div>
                    <div className="space-y-2">
                      {selectedAppointment.attachments.map((file, index) => (
                        <div key={index} className="flex items-center text-blue-600 hover:text-blue-800">
                          <FaFilePdf className="mr-2" />
                          <a href={`#${file}`} className="text-sm hover:underline">{file}</a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-8 pt-4 border-t flex justify-end space-x-3">
                <button 
                  onClick={() => setSelectedAppointment(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center">
                  <FaRegStickyNote className="mr-2" />
                  Add SOAP Note
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  Mark as Completed
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <FaRegCalendarAlt className="mx-auto h-12 w-12 mb-4" />
                <p>Select an appointment to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white border-t p-3 flex justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
          <span>Available</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          <span>Confirmed</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
          <span>Pending</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
          <span>Cancelled</span>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;