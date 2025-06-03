import React from 'react';

export default function SchedulingPanel() {
  return (
    <div className="bg-white rounded shadow p-4 mt-6">
      <h2 className="text-lg font-semibold mb-2">Scheduling Info</h2>
      <p>To reschedule or book a new appointment, use the options below:</p>
      <div className="mt-4 flex flex-wrap gap-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto hover:bg-blue-600 transition">Book Appointment</button>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded w-full md:w-auto hover:bg-yellow-600 transition">Reschedule</button>
      </div>
    </div>
  );
}
