import React from 'react';

export default function TopBar({ name }) {
  return (
    <div className="flex flex-wrap justify-between items-center bg-white px-6 py-4 shadow sticky top-0 z-10">
      <h1 className="text-xl font-semibold mb-2 md:mb-0">Welcome, {name}</h1>
      <div className="flex items-center gap-4 w-full md:w-auto">
        <input
          type="text"
          placeholder="Search..."
          className="border px-3 py-1 rounded-md w-full md:w-64 mb-2 md:mb-0"
        />
        <button title="Notifications" className="text-xl">🔔</button>
        <button title="Messages" className="text-xl">💬</button>
        <button title="Settings" className="text-xl">⚙</button>
        <img src="/user.jpg" alt="Profile" className="w-10 h-10 rounded-full border" />
      </div>
    </div>
  );
}
