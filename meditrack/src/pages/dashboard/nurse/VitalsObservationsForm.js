import React from 'react';

export default function VitalsObservationsForm() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Add Vitals & Observations</h2>
      <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input type="text" placeholder="Blood Pressure" className="border px-3 py-2 rounded" />
        <input type="text" placeholder="Temperature" className="border px-3 py-2 rounded" />
        <input type="text" placeholder="Heart Rate" className="border px-3 py-2 rounded" />
        <textarea placeholder="Observations..." className="col-span-3 border px-3 py-2 rounded mt-2"></textarea>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded col-span-1 mt-4">Submit</button>
      </form>
    </div>
  );
}
