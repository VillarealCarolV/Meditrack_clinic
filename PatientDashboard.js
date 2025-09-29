import React from 'react';
import { mockPatientAppointments as mockAppointments } from '../../../data/mockPatientData';
import { mockPrescriptions } from '../../../data/mockDoctorData';
import TopBar from '../../../components/TopBar';
import RoleBasedHelpBot from '../../../components/RoleBasedHelpBot';
import PatientPrescriptions from './Prescriptions';
import BookAppointment from './Appointment';
import Notifications from './Notifications';
import DoctorDirectory from './Doctor_Directory';

export default function PatientDashboard() {
  const patientName = 'John Doe';
  const greeting = React.useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Tabs: dashboard | book | appointments | notifications | doctors | details
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [appointments, setAppointments] = React.useState(() => {
    // Normalize mock appointments into a consistent shape
    return (mockAppointments || []).map((a, idx) => ({
      id: a.id || `APT-${idx + 1}`,
      doctor: a.doctor || a.doctorName || 'Dr. Unknown',
      doctorSpecialty: a.specialty || a.doctorSpecialty || 'General Medicine',
      date: a.date || new Date().toISOString(),
      time: a.time || '10:00 AM',
      status: (a.status || 'scheduled').toLowerCase(),
      type: (a.type || 'in-person').toLowerCase(),
      location: a.location || 'Main Clinic',
      reason: a.reason || '',
      notes: a.notes || '',
    }));
  });
  const [notifications, setNotifications] = React.useState([
    {
      id: 'N1',
      type: 'reminder',
      title: 'Appointment Reminder',
      message: 'You have an appointment tomorrow at 2:00 PM',
      timestamp: new Date().toISOString(),
      read: false,
    },
  ]);

  // Booking component state and other UI state
  const [preselectedDoctor, setPreselectedDoctor] = React.useState(null);
  const [bookInitialStep, setBookInitialStep] = React.useState(1);
  const [selectedAppointment, setSelectedAppointment] = React.useState(null);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [rxDetailsOpen, setRxDetailsOpen] = React.useState(false);
  const [appointmentsFilter, setAppointmentsFilter] = React.useState('upcoming');
  const [appointmentsSearch, setAppointmentsSearch] = React.useState('');
  const [appointmentsSort, setAppointmentsSort] = React.useState('date_asc'); // date_asc | date_desc | status

  const doctors = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiology',  available: true, locations: ['Main Clinic'] },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Dermatology',  available: true, locations: ['Main Clinic'] },
    { id: 3, name: 'Dr. Emily Wilson', specialty: 'Pediatrics',  available: false, locations: ['Main Health'] },
  ];
  const timeSlots = ['09:00 AM','10:00 AM','11:00 AM','01:00 PM','02:00 PM','03:00 PM'];
  
  
  // Confirm handler from booking component
  const handleBookConfirm = (appt) => {
    const newAppt = {
      id: `APT-${appointments.length + 1}`,
      ...appt,
    };
    setAppointments([newAppt, ...appointments]);
    setNotifications([{ id: `N-${Date.now()}`, type: 'reminder', title: 'Appointment Confirmed', message: `With ${newAppt.doctor} on ${new Date(newAppt.date).toLocaleDateString()} at ${newAppt.time}`, timestamp: new Date().toISOString(), read: false }, ...notifications]);
    setActiveTab('appointments');
    setPreselectedDoctor(null);
    setBookInitialStep(1);
  };

  const upcoming = appointments.filter(a => ['scheduled','confirmed','pending'].includes(a.status));
  const past = appointments.filter(a => ['completed','cancelled','missed'].includes(a.status));

  const filteredByStatus = React.useMemo(() => {
    switch (appointmentsFilter) {
      case 'upcoming':
        return upcoming;
      case 'past':
        return appointments.filter(a => ['completed','cancelled'].includes(a.status));
      case 'missed':
        return appointments.filter(a => a.status === 'missed');
      default:
        return upcoming;
    }
  }, [appointments, appointmentsFilter]);

  const visibleAppointments = React.useMemo(() => {
    // Text search by doctor, specialty, location, reason
    const term = appointmentsSearch.trim().toLowerCase();
    let list = filteredByStatus.filter(a => {
      if (!term) return true;
      return (
        (a.doctor || '').toLowerCase().includes(term) ||
        (a.doctorSpecialty || '').toLowerCase().includes(term) ||
        (a.location || '').toLowerCase().includes(term) ||
        (a.reason || '').toLowerCase().includes(term)
      );
    });
    // Sorting
    const parseTime = (t) => {
      const [time, mer] = (t || '00:00 AM').split(' ');
      let [h, m] = (time || '00:00').split(':').map(Number);
      if ((mer || '').toLowerCase() === 'pm' && h !== 12) h += 12;
      if ((mer || '').toLowerCase() === 'am' && h === 12) h = 0;
      return h * 60 + (m || 0);
    };
    list.sort((a, b) => {
      if (appointmentsSort === 'status') {
        return (a.status || '').localeCompare(b.status || '');
      }
      const ad = new Date(a.date);
      const bd = new Date(b.date);
      const cmp = ad - bd;
      if (cmp !== 0) return appointmentsSort === 'date_asc' ? cmp : -cmp;
      const at = parseTime(a.time);
      const bt = parseTime(b.time);
      return appointmentsSort === 'date_asc' ? at - bt : bt - at;
    });
    return list;
  }, [filteredByStatus, appointmentsSearch, appointmentsSort]);

  // Helpers to show recent items on dashboard
  const nextAppointment = React.useMemo(() => {
    const parseTime = (t) => {
      // t like "10:00 AM"
      const [time, mer] = t.split(' ');
      let [h, m] = time.split(':').map(Number);
      if (mer?.toLowerCase() === 'pm' && h !== 12) h += 12;
      if (mer?.toLowerCase() === 'am' && h === 12) h = 0;
      return { h, m };
    };
    const upcomingList = appointments.filter(a => ['scheduled','confirmed','pending'].includes(a.status));
    if (upcomingList.length === 0) return null;
    const sorted = [...upcomingList].sort((a,b) => {
      const ad = new Date(a.date);
      const bd = new Date(b.date);
      if (ad.toDateString() !== bd.toDateString()) return ad - bd;
      const at = parseTime(a.time || '00:00 AM');
      const bt = parseTime(b.time || '00:00 AM');
      return (at.h*60+at.m) - (bt.h*60+bt.m);
    });
    return sorted[0];
  }, [appointments]);

  const currentPrescription = React.useMemo(() => {
    return (mockPrescriptions || []).find(p => p.status === 'active') || null;
  }, []);

  const handleCancel = (id) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
  };

  const SidebarLink = ({ id, icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-2 text-left py-2 px-2 rounded ${activeTab === id ? 'text-green-700 bg-green-50' : 'text-gray-700 hover:text-green-600'}`}
    >
      <span role="img" aria-label={label}>{icon}</span> {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - hidden on mobile, visible md+ */}
      <aside className="hidden md:flex flex-col justify-between bg-white w-64 h-screen shadow px-4 py-6 sticky top-0 left-0 z-20">
        <nav className="flex-1">
          <div className="mb-8">
            <div className="text-xl font-bold mb-6 flex items-center gap-2">
              <span role="img" aria-label="portal">🧍‍♂️</span> Patient Portal
            </div>
            <div className="space-y-1">
              <SidebarLink id="dashboard" icon="🏠" label="Home" />
              {/**<SidebarLink id="notifications" icon="🔔" label="Notifications" />**/}
              <SidebarLink id="appointments" icon="📅" label="Appointments" />
              <SidebarLink id="prescriptions" icon="💊" label="Prescriptions" />
              <SidebarLink id="doctors" icon="👨‍⚕️" label="Doctor Directory" />
              
            </div>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <TopBar name={patientName} />
        <div className="max-w-7xl mx-auto px-6 pt-6 space-y-6">
          {/* Greeting banner (dashboard only) */}
          {activeTab === 'dashboard' && (
            <div className="bg-white rounded-lg shadow p-6 md:p-7 flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{greeting}, {patientName}!</h1>
                <p className="text-base text-gray-600 mt-1">Here’s your patient portal. Manage your appointments and health records with ease.</p>
              </div>
            </div>
          )}

      {/* Prescription Details Modal */}
      {rxDetailsOpen && currentPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={()=> setRxDetailsOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-lg p-6 md:p-8 w-[96vw] max-w-2xl">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl md:text-3xl font-bold">Prescription Details</h2>
              <button
                aria-label="Close"
                title="Close"
                onClick={()=> setRxDetailsOpen(false)}
                className="inline-flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 shadow-sm"
              >
                <span className="text-xl md:text-2xl leading-none">×</span>
              </button>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <div className="text-sm text-gray-500 mb-2">Prescription Details</div>
                <div className="border-t border-gray-200 mb-4"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Medicine</div>
                    <div className="font-medium">{currentPrescription.genericName || currentPrescription.medication || '—'}{currentPrescription.brandName ? ` (${currentPrescription.brandName})` : ''}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Dosage</div>
                    <div className="font-medium">{currentPrescription.dosage || '—'}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Route</div>
                    <div className="font-medium">{currentPrescription.route || '—'}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Frequency / Schedule</div>
                    <div className="font-medium">{currentPrescription.frequency || '—'}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Duration</div>
                    <div className="font-medium">{currentPrescription.duration || '—'}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Start – End</div>
                    <div className="font-medium">{currentPrescription.startDate ? new Date(currentPrescription.startDate).toLocaleDateString() : '—'} – {currentPrescription.endDate ? new Date(currentPrescription.endDate).toLocaleDateString() : '—'}</div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="text-gray-600">Prescribing Doctor</div>
                    <div className="font-medium">Dr. {currentPrescription.doctorName || '—'} {currentPrescription.specialty ? `(${currentPrescription.specialty})` : ''}</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-2">Instructions / Notes</div>
                <div className="border-t border-gray-200 mb-4"></div>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-gray-600">Special Instructions</div>
                    <div className="font-medium">{currentPrescription.instructions || '—'}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Allergy Alerts</div>
                    <div className="font-medium">{currentPrescription.allergyAlerts || currentPrescription.allergies || '—'}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Possible Side Effects</div>
                    <div className="font-medium">{currentPrescription.sideEffects || '—'}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={()=> setRxDetailsOpen(false)} className="px-4 py-2 border rounded">Close</button>
            </div>
          </div>
        </div>
      )}

          {/* Main sections */}
          {/* Dashboard/Home */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-wrap gap-3 justify-end">
                  <button onClick={() => setActiveTab('appointments')} className="inline-flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-50">
                    📅 My Appointments
                  </button>
                  <button onClick={() => setActiveTab('notifications')} className="inline-flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-50">
                    🔔 Notifications
                  </button>
                </div>
              </div>

              {/* Recent items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg shadow p-6 md:p-7">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Next Appointment</h3>
                  {nextAppointment?.reason && (
                    <div className="flex justify-start mb-3">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-yellow-50 text-yellow-800 text-sm font-semibold">📝 Reason: {nextAppointment.reason}</span>
                    </div>
                  )}
                  {nextAppointment ? (
                    <div>
                      <div className="font-semibold text-gray-900">{nextAppointment.doctor} <span className="text-gray-500">• {nextAppointment.doctorSpecialty}</span></div>
                      <div className="text-sm text-gray-600 mt-1">{new Date(nextAppointment.date).toLocaleDateString()} • {nextAppointment.time} • {nextAppointment.type === 'telemedicine' ? 'Telemedicine' : nextAppointment.location}</div>
                      <div className="text-xs mt-1">Status: <span className="capitalize font-medium">{nextAppointment.status}</span></div>
                      <div className="mt-3 flex gap-2">
                        <button onClick={()=>{ setSelectedAppointment(nextAppointment); setDetailsOpen(true); }} className="px-3 py-1 border rounded text-sm">View</button>
                        <button onClick={()=>{ const doc = doctors.find(d => d.name === nextAppointment.doctor) || null; setPreselectedDoctor(doc); setSelectedAppointment(nextAppointment); setBookInitialStep(2); setActiveTab('book'); }} className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm">Reschedule</button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">No upcoming appointment. Book one now.</div>
                  )}
                </div>
                <div className="bg-white rounded-lg shadow p-6 md:p-7">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Active Prescription</h3>
                  {currentPrescription ? (
                    <div>
                      <div className="font-semibold text-gray-900">{currentPrescription.medication} <span className="text-gray-500">• {currentPrescription.dosage}</span></div>
                      <div className="text-sm text-gray-600 mt-1">{currentPrescription.frequency}</div>
                      <div className="text-xs text-gray-500 mt-1">Valid: {new Date(currentPrescription.startDate).toLocaleDateString()} - {new Date(currentPrescription.endDate).toLocaleDateString()}</div>
                      <div className="mt-3">
                        <button onClick={()=>setRxDetailsOpen(true)} className="px-3 py-1 border rounded text-sm">View Prescriptions</button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">No active prescription.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Book New Appointment - Wizard */}
          {activeTab === 'book' && (
            <BookAppointment
              doctors={doctors}
              timeSlots={timeSlots}
              preselectedDoctor={preselectedDoctor}
              initialStep={bookInitialStep}
              onConfirm={handleBookConfirm}
              onCancel={() => { setPreselectedDoctor(null); setBookInitialStep(1); setActiveTab('dashboard'); }}
            />
          )}

          {/* My Appointments */}
          {activeTab === 'appointments' && (
            <div className="bg-white rounded-lg shadow p-6 md:p-7">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">My Appointments</h2>
                <div className="flex flex-wrap items-center justify-between gap-3 mt-[60px]">
                  <div className="flex-1 min-w-[220px]">
                    <input
                      value={appointmentsSearch}
                      onChange={(e)=>setAppointmentsSearch(e.target.value)}
                      placeholder="Search by doctor, specialty, reason..."
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={()=>setAppointmentsFilter('upcoming')} className={`px-3 py-1.5 rounded border text-sm ${appointmentsFilter==='upcoming' ? 'bg-gray-500 text-white border-gray-600' : 'bg-white text-gray-700 border-gray-300'}`}>Upcoming</button>
                    <button onClick={()=>setAppointmentsFilter('past')} className={`px-3 py-1.5 rounded border text-sm ${appointmentsFilter==='past' ? 'bg-gray-500 text-white border-gray-600' : 'bg-white text-gray-700 border-gray-300'}`}>Past</button>
                    <button onClick={()=>setAppointmentsFilter('missed')} className={`px-3 py-1.5 rounded border text-sm ${appointmentsFilter==='missed' ? 'bg-gray-500 text-white border-gray-600' : 'bg-white text-gray-700 border-gray-300'}`}>Missed</button>
                    <button onClick={()=>{ setPreselectedDoctor(null); setBookInitialStep(1); setActiveTab('book'); }} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">➕ Book New</button>
                  </div>
                </div>
              </div>
              {/* Divider between controls and list */}
              <div className="mt-4 mb-2 border-t border-gray-200" />

              <div className="mt-2 divide-y">
                {visibleAppointments.length === 0 && (
                  <div className="p-4 text-gray-500">No {appointmentsFilter} appointments.</div>
                )}
                {visibleAppointments.map(a => (
                  <div key={a.id} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{a.doctor} <span className="text-gray-500">• {a.doctorSpecialty}</span></div>
                      <div className="text-sm text-gray-600">{new Date(a.date).toLocaleDateString()} • {a.time} • {a.type === 'telemedicine' ? 'Telemedicine' : a.location}</div>
                      {a.reason && (
                        <div className="mt-1">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-50 text-yellow-800 text-xs font-medium">📝 Reason: {a.reason}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={()=>{ setSelectedAppointment(a); setDetailsOpen(true); }} className="px-3 py-1 border rounded text-sm">View</button>
                      {['scheduled','confirmed','pending'].includes(a.status) && (
                        <>
                          <button onClick={()=>{ 
                            const doc = doctors.find(d => d.name === a.doctor) || null;
                            setPreselectedDoctor(doc);
                            setSelectedAppointment(a);
                            setBookInitialStep(2);
                            setActiveTab('book');
                          }} className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm">Reschedule</button>
                          <button onClick={()=>handleCancel(a.id)} className="px-3 py-1 bg-red-50 text-red-700 rounded text-sm">Cancel</button>
                        </>
                      )}
                      {a.status === 'missed' && (
                        <button onClick={()=>{ 
                          const doc = doctors.find(d => d.name === a.doctor) || null;
                          setPreselectedDoctor(doc);
                          setSelectedAppointment(a);
                          setBookInitialStep(2);
                          setActiveTab('book');
                        }} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Rebook</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <Notifications
              notifications={notifications}
              onMarkAllAsRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
            />
          )}

          {/* Doctor Directory */}
          {activeTab === 'doctors' && (
            <DoctorDirectory
              doctors={doctors}
              onBook={(d)=>{ setPreselectedDoctor(d); setBookInitialStep(2); setActiveTab('book'); }}
              onViewProfile={(d)=>{ setPreselectedDoctor(d); setBookInitialStep(1); setActiveTab('book'); }}
            />
          )}

          {/* Prescriptions (patient-only page) */}
          {activeTab === 'prescriptions' && (
            <PatientPrescriptions prescriptions={mockPrescriptions} />
          )}

          {/* Appointment Details */}
          {activeTab === 'details' && selectedAppointment && (
            <div className="bg-white rounded shadow p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold">Appointment Details</h2>
                <button onClick={()=>setActiveTab('appointments')} className="text-sm text-gray-600">Close</button>
              </div>
              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-gray-600">Doctor</div>
                  <div className="font-medium">{selectedAppointment.doctor}</div>
                  <div className="text-sm text-gray-600">{selectedAppointment.doctorSpecialty}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-600">Date & Time</div>
                  <div className="font-medium">{new Date(selectedAppointment.date).toLocaleDateString()} • {selectedAppointment.time}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-600">Mode</div>
                  <div className="font-medium capitalize">{selectedAppointment.type}</div>
                  {selectedAppointment.type === 'in-person' && (
                    <div className="text-sm text-gray-600">Location: {selectedAppointment.location}</div>
                  )}
                  {selectedAppointment.type === 'telemedicine' && (
                    <div className="text-sm text-gray-600">Video link available 15 minutes before appointment</div>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-600">Status</div>
                  <div className="font-medium capitalize">{selectedAppointment.status}</div>
                </div>
              </div>
              <div className="mt-6">
                <div className="text-sm text-gray-600">Reason for visit</div>
                <div className="font-medium">{selectedAppointment.reason || '—'}</div>
              </div>
            </div>
          )}
        </div>
      </div>
      <RoleBasedHelpBot role="patient" />

      {/* Details Modal */}
      {detailsOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={()=>{ setDetailsOpen(false); setSelectedAppointment(null); }} />
          <div className="relative bg-white rounded-lg shadow-lg p-6 md:p-8 w-[96vw] max-w-2xl">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl md:text-3xl font-bold">Appointment Details</h2>
            </div>
            <div className="mt-6 grid sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="text-sm text-gray-600">Doctor</div>
                <div className="font-medium">{selectedAppointment.doctor}</div>
                <div className="text-sm text-gray-600">{selectedAppointment.doctorSpecialty}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-600">Date & Time</div>
                <div className="font-medium">{new Date(selectedAppointment.date).toLocaleDateString()} • {selectedAppointment.time}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-600">Mode</div>
                <div className="font-medium capitalize">{selectedAppointment.type}</div>
                {selectedAppointment.type === 'in-person' && (
                  <div className="text-sm text-gray-600">Location: {selectedAppointment.location}</div>
                )}
                {selectedAppointment.type === 'telemedicine' && (
                  <div className="text-sm text-gray-600">Video link available 15 minutes before appointment</div>
                )}
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-600">Status</div>
                <div className="font-medium capitalize">{selectedAppointment.status}</div>
              </div>
            </div>
            <div className="mt-6">
              <div className="text-sm text-gray-600">Reason for visit</div>
              <div className="font-medium">{selectedAppointment.reason || '—'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
