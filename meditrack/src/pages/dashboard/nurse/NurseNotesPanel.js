import React from 'react';

export default function NurseNotesPanel() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Nurse Notes</h2>
      <textarea rows="4" className="w-full border px-3 py-2 rounded" placeholder="Document today's notes..."></textarea>
      <button className="bg-green-500 text-white px-4 py-2 rounded mt-2">Save Note</button>
    </div>
  );
}
