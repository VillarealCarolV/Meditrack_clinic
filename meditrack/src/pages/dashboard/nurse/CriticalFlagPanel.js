import React from 'react';

export default function CriticalFlagPanel() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Flag Critical Issue</h2>
      <textarea className="w-full border px-3 py-2 rounded" placeholder="Describe critical observation..."></textarea>
      <button className="bg-red-500 text-white px-4 py-2 rounded mt-2">Flag for Doctor Review</button>
    </div>
  );
}
