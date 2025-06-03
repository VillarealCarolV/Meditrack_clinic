import React, { useEffect, useState } from 'react';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not logged in');
      return;
    }
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch profile');
        return res.json();
      })
      .then(data => setProfile(data))
      .catch(() => setError('Could not load profile'));
  }, []);

  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!profile) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto bg-white shadow rounded p-8 mt-10">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <div className="mb-2"><strong>ID:</strong> {profile.id}</div>
      <div className="mb-2"><strong>Email:</strong> {profile.email || profile.user?.email}</div>
      <div className="mb-2"><strong>Role:</strong> {profile.role || profile.user?.role}</div>
      {/* Add more fields as needed */}
    </div>
  );
}
