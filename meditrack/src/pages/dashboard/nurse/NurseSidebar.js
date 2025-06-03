import React from 'react';

export default function NurseSidebar() {
  return (
    <aside className="w-60 h-screen bg-white shadow p-6 fixed left-0 top-0 space-y-6 z-30 hidden md:block">
      <div className="text-xl font-bold">EMR</div>
      <nav className="text-gray-700 space-y-3 mt-8">
        <a href="#records" className="block hover:text-blue-600">📄 Medical Records</a>
        <a href="#vitals" className="block hover:text-blue-600">💉 Vitals & Observations</a>
        <a href="#notes" className="block hover:text-blue-600">📝 Nurse Notes</a>
        <a href="#medications" className="block hover:text-blue-600">💊 Medications</a>
        <a href="#flags" className="block hover:text-blue-600">🚩 Critical Flags</a>
        <a href="/logout" className="block text-red-500">🚪 Logout</a>
      </nav>
    </aside>
  );
}
