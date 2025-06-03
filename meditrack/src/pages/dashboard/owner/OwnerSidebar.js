import React from 'react';

export default function OwnerSidebar() {
  return (
    <aside className="w-60 h-screen bg-white shadow p-6 fixed left-0 top-0 space-y-6 z-30 hidden md:block">
      <div className="text-xl font-bold">EMR</div>
      <nav className="text-gray-700 space-y-3 mt-8">
        <a href="/dashboard/owner/users" className="block hover:text-blue-600">👥 User Management</a>
        <a href="/logout" className="block text-red-500">🚪 Logout</a>
      </nav>
    </aside>
  );
}
