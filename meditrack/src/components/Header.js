import React from 'react';

export default function Header({ name, onLogout, logo }) {
  return (
    <div className="w-full bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center gap-3">
        {logo && <img src={logo} alt="Logo" className="h-8 w-8" />}
        <h1 className="text-xl font-semibold">Welcome, {name}</h1>
      </div>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        onClick={onLogout}
      >
        Logout
      </button>
    </div>
  );
}
