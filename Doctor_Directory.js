import React from 'react';

export default function DoctorDirectory({ doctors = [], onBook, onViewProfile }) {
  const [search, setSearch] = React.useState('');
  const [specialtyFilter, setSpecialtyFilter] = React.useState('All');

  const specialties = React.useMemo(() => {
    const set = new Set(['All']);
    doctors.forEach(d => d?.specialty && set.add(d.specialty));
    return Array.from(set);
  }, [doctors]);

  const filteredDoctors = React.useMemo(() => {
    const term = search.toLowerCase();
    return doctors.filter(d => {
      const matchesSearch = `${d.name} ${d.specialty} ${(d.locations || []).join(' ')}`
        .toLowerCase()
        .includes(term);
      const matchesSpec = specialtyFilter === 'All' || d.specialty === specialtyFilter;
      return matchesSearch && matchesSpec;
    });
  }, [doctors, search, specialtyFilter]);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 pt-6 pb-5">
        <h2 className="text-2xl font-bold m-0 leading-none">Doctor Directory</h2>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-6">
          <div className="flex-1 min-w-[220px]">
            <input
              value={search}
              onChange={e=>setSearch(e.target.value)}
              placeholder="Search doctor, specialty or branch"
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <select
              value={specialtyFilter}
              onChange={e=>setSpecialtyFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded text-sm"
            >
              {specialties.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 mb-2 border-t border-gray-200" />
      </div>

      <div className="px-6 pb-6 grid sm:grid-cols-2 gap-4">
        {filteredDoctors.map(d => (
          <div key={d.id} className="bg-white rounded shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{d.name}</div>
                <div className="text-sm text-gray-600">{d.specialty}</div>
                <div className="text-xs text-gray-500">{(d.locations || []).join(', ')}</div>
              </div>
              {d.fee && <div className="text-green-700 font-semibold">₱{d.fee}</div>}
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={()=> onBook && onBook(d)}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Book
              </button>
              <button
                onClick={()=> onViewProfile && onViewProfile(d)}
                className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
        {filteredDoctors.length === 0 && (
          <div className="col-span-full text-sm text-gray-500">No doctors match your search.</div>
        )}
      </div>
    </div>
  );
}

