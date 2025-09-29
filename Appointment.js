import React from 'react';

export default function BookAppointment({
  doctors = [],
  timeSlots = [],
  onConfirm,
  onCancel,
  preselectedDoctor = null,
  initialStep = 1,
}) {
  const specialties = React.useMemo(() => ['All', ...Array.from(new Set(doctors.map(d => d.specialty)))], [doctors]);
  const [step, setStep] = React.useState(initialStep);
  const [search, setSearch] = React.useState('');
  const [specialtyFilter, setSpecialtyFilter] = React.useState('All');
  const [selectedDoctor, setSelectedDoctor] = React.useState(preselectedDoctor);
  const [selectedDate, setSelectedDate] = React.useState('');
  const [selectedTime, setSelectedTime] = React.useState('');
  const [consultationType, setConsultationType] = React.useState('in-person');
  const [reason, setReason] = React.useState('');
  const [error, setError] = React.useState('');
  // Calendar month being viewed (first day of month)
  const [currentMonthDate, setCurrentMonthDate] = React.useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  React.useEffect(() => {
    setSelectedDoctor(preselectedDoctor || null);
    if (preselectedDoctor && step === 1) setStep(2);
  }, [preselectedDoctor]);

  const filteredDoctors = React.useMemo(() => {
    return doctors.filter(d => {
      const matchesSearch = `${d.name} ${d.specialty} ${(d.locations||[]).join(' ')}`.toLowerCase().includes(search.toLowerCase());
      const matchesSpec = specialtyFilter === 'All' || d.specialty === specialtyFilter;
      return matchesSearch && matchesSpec;
    });
  }, [doctors, search, specialtyFilter]);

  const today = new Date();
  const stepTitles = ['Choose Doctor', 'Pick Date & Time', 'Appointment Details', 'Confirm'];
  const progressPct = ((step - 1) / (stepTitles.length - 1)) * 100;

  // Month label for the date grid
  const currentMonthLabel = React.useMemo(() => {
    return currentMonthDate.toLocaleString(undefined, { month: 'long', year: 'numeric' });
  }, [currentMonthDate]);

  // Build current month days and leading blanks (Monday as first day)
  const calendarMeta = React.useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const startOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startWeekday = (startOfMonth.getDay() + 6) % 7; // Mon=0..Sun=6
    const days = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
    return { startWeekday, days };
  }, [currentMonthDate]);

  const reset = () => {
    setStep(1);
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedTime('');
    setConsultationType('in-person');
    setReason('');
    setError('');
  };

  const handleConfirm = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      setError('Please select a doctor, date and time before confirming.');
      return;
    }
    const appt = {
      doctor: selectedDoctor.name,
      doctorSpecialty: selectedDoctor.specialty,
      date: selectedDate,
      time: selectedTime,
      type: consultationType,
      location: consultationType === 'in-person' ? (selectedDoctor.locations?.[0] || 'Main Clinic') : 'Telemedicine',
      reason,
      fee: selectedDoctor.fee,
    };
    onConfirm?.(appt);
    reset();
  };

  return (
    <div className="mt-[50px] bg-white rounded-lg shadow p-6 md:p-7">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Book New Appointment</h2>
        <div className="text-sm text-gray-600">Step {step} of {stepTitles.length}</div>
      </div>
      {/* Stepper */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
          {stepTitles.map((t) => (
            <div key={t} className="flex-1 text-center">
              <span className={`${stepTitles.indexOf(t) < step ? 'text-green-700' : ''}`}>{t}</span>
            </div>
          ))}
        </div>
        <div className="h-2 w-full bg-gray-200 rounded">
          <div className="h-2 bg-green-600 rounded transition-all" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* Step 1: Choose Doctor */}
      {step === 1 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, specialty or branch" className="flex-1 min-w-[220px] p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none" />
            <select value={specialtyFilter} onChange={(e) => setSpecialtyFilter(e.target.value)} className="p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none w-40 md:w-56">
              {specialties.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          {filteredDoctors.length === 0 ? (
            <div className="p-6 border border-dashed rounded text-center text-gray-500">No doctors matched your filters.</div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {filteredDoctors.map((d) => (
                <div key={d.id} className={`p-4 border rounded-lg hover:shadow transition ${selectedDoctor?.id === d.id ? 'border-green-600 bg-green-50' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-semibold">
                      {d.name?.split(' ').map(p=>p[0]).slice(0,2).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{d.name}</div>
                      <div className="text-sm text-gray-600">{d.specialty}</div>
                      {typeof d.fee !== 'undefined' && (
                        <div className="text-sm text-green-700 font-medium mt-1">₱{d.fee}</div>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-600">
                        {(d.locations||[]).slice(0,2).map(loc => (<span key={loc} className="px-2 py-0.5 bg-gray-100 rounded-full">{loc}</span>))}
                        <span className={`px-2 py-0.5 rounded-full ${d.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{d.available ? 'Available' : 'Full'}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => { setSelectedDoctor(d); setStep(2); }} className="mt-3 w-full py-2 bg-green-600 text-white rounded hover:bg-green-700">Select</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Date & Time */}
      {step === 2 && (
        <div>
          {selectedDoctor && (
            <div className="mb-6 p-3 md:p-4 bg-green-50 rounded border border-green-100">
              <div className="text-xs text-gray-600 mb-1">Selected doctor</div>
              <div className="text-lg md:text-xl font-semibold text-gray-900">{selectedDoctor.name} <span className="text-gray-500">• {selectedDoctor.specialty}</span></div>
            </div>
          )}
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">{currentMonthLabel}</div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
              >
                ← Prev
              </button>
              <button
                onClick={() => setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
              >
                Next →
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-3 mb-4 mt-2">
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
              <div key={d} className="text-xs text-gray-500 text-center uppercase tracking-wide">{d}</div>
            ))}
            {Array.from({ length: calendarMeta.startWeekday }).map((_, i) => (
              <div key={`blank-${i}`} />
            ))}
            {calendarMeta.days.map((d) => {
              const key = d.toISOString().split('T')[0];
              const isSelected = selectedDate && new Date(selectedDate).toDateString() === d.toDateString();
              const todayStart = new Date(); todayStart.setHours(0,0,0,0);
              const dateStart = new Date(d); dateStart.setHours(0,0,0,0);
              const isToday = dateStart.getTime() === todayStart.getTime();
              const isPast = dateStart.getTime() < todayStart.getTime();
              const baseClasses = 'p-3 md:p-4 border rounded-lg text-sm text-center transition outline-none';
              const stateClasses = isSelected
                ? 'bg-green-100 border-green-600 ring-2 ring-green-200 font-semibold'
                : isPast
                  ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  : 'hover:bg-gray-50 focus:ring-2 focus:ring-green-500';
              return (
                <button
                  key={key}
                  onClick={() => { if (!isPast) setSelectedDate(d.toISOString()); }}
                  disabled={isPast}
                  className={`${baseClasses} ${stateClasses}`}
                >
                  <div className={`text-gray-600 ${isPast ? 'text-gray-400' : ''}`}>{d.toLocaleDateString(undefined, { weekday: 'short' })}</div>
                  <div className={`font-semibold text-base md:text-lg inline-flex items-center gap-1 ${isPast ? 'text-gray-400' : ''}`}>
                    {d.getDate()}
                    {isToday && !isSelected && <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-green-500 align-middle" />}
                  </div>
                </button>
              );
            })}
          </div>
          {selectedDate && (
            <div className="mb-6 -mt-1">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                Selected Date: {new Date(selectedDate).toLocaleDateString()}
              </span>
            </div>
          )}
          <div>
            <div className="font-medium mb-3">Available Time Slots</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {timeSlots.map((t) => (
                <button key={t} onClick={() => { setSelectedTime(t); setStep(3); }} className={`p-2.5 md:p-3 border rounded-full text-sm text-center focus:ring-2 focus:ring-green-500 outline-none transition ${selectedTime === t ? 'bg-green-100 border-green-600 ring-2 ring-green-200 font-semibold' : 'hover:bg-gray-50'}`}>{t}</button>
              ))}
            </div>
            {selectedTime && (
              <div className="mt-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                  Selected Time: {selectedTime}
                </span>
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-between">
            <button onClick={() => setStep(1)} className="px-4 py-2 border rounded">Back</button>
            <button onClick={() => { setSelectedDate(''); setSelectedTime(''); }} className="px-4 py-2 border rounded">Clear</button>
          </div>
        </div>
      )}

      {/* Step 3: Details */}
      {step === 3 && (
        <div className="space-y-7">
          <div>
            <label className="block text-sm font-medium mb-2">Reason for Visit <span className="text-red-500">*</span></label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
            >
              <option value="">Select a reason</option>
              <option value="checkup">General Check-up</option>
              <option value="followup">Follow-up Visit</option>
              <option value="lab">Lab Results Discussion</option>
              <option value="others">Others</option>
            </select>
            {!reason && <div className="text-xs text-red-600 mt-2">Please select a reason to continue.</div>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-3">Mode of Consultation</label>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setConsultationType('in-person')}
                className={`px-4 py-2 rounded-full border ${consultationType==='in-person' ? 'bg-green-100 text-green-800 border-green-400' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              >
                In-Person
              </button>
            </div>
          </div>
          <div className="bg-gray-50 p-4 md:p-5 rounded-lg border border-gray-200">
            <div className="font-semibold mb-3">Summary</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-gray-600 min-w-[90px]">Doctor</span>
                <div className="font-medium text-gray-900">{selectedDoctor?.name} <span className="text-gray-500">({selectedDoctor?.specialty})</span></div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-600 min-w-[90px]">Date</span>
                <div className="font-medium">{selectedDate ? new Date(selectedDate).toLocaleDateString() : '—'}</div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-600 min-w-[90px]">Time</span>
                <div className="font-medium">{selectedTime || '—'}</div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-600 min-w-[90px]">Type</span>
                <div className="font-medium">{consultationType === 'in-person' ? 'In-Person' : 'Telemedicine'}</div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <button onClick={() => setStep(2)} className="px-4 py-2 border rounded">Back</button>
            <button
              disabled={!reason}
              onClick={() => setStep(4)}
              className={`px-6 py-2 rounded-lg text-white ${reason ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'}`}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirm */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="text-xl font-semibold">Confirm your appointment</div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div className="bg-gray-50 p-4 md:p-5 rounded-lg border border-gray-200">
            <div className="font-semibold mb-3">Summary</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-gray-600 min-w-[110px]">Doctor</span>
                <div className="font-medium text-gray-900">{selectedDoctor?.name} <span className="text-gray-500">({selectedDoctor?.specialty})</span></div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-600 min-w-[110px]">Date</span>
                <div className="font-medium">{selectedDate ? new Date(selectedDate).toLocaleDateString() : '—'}</div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-600 min-w-[110px]">Time</span>
                <div className="font-medium">{selectedTime || '—'}</div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-600 min-w-[110px]">Type</span>
                <div className="font-medium">{consultationType === 'in-person' ? 'In-Person' : 'Telemedicine'}</div>
              </div>
              {typeof selectedDoctor?.fee !== 'undefined' && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-600 min-w-[110px]">Fee</span>
                  <div className="font-medium">₱{selectedDoctor?.fee}</div>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <button onClick={() => setStep(3)} className="px-4 py-2 border rounded">Back</button>
            <div className="flex gap-3">
              <button onClick={() => { reset(); onCancel?.(); }} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleConfirm} className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

