import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function StaffSidebar({ activePage = 'reports' }) {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Clear user session
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login page
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard/staff', icon: '📊', label: 'Reports', id: 'reports' },
    { to: '/dashboard/user-management', icon: '👥', label: 'User Management', id: 'user-management' },
    { to: '/dashboard/appointments', icon: '📅', label: 'Appointments', id: 'appointments' },
    { to: '/dashboard/settings', icon: '⚙️', label: 'Settings', id: 'settings' },
  ];

  return (
    <aside className="w-60 h-screen bg-white shadow p-6 space-y-6 fixed left-0 top-0 z-30 hidden md:block">
      <div className="text-xl font-bold text-blue-600">EMR</div>
      <nav className="space-y-2 text-gray-700 mt-8">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'hover:bg-gray-100 text-gray-700'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 p-3 rounded-lg text-left text-red-600 hover:bg-red-50 mt-4"
        >
          <span className="text-lg">🚪</span>
          <span>Log out</span>
        </button>
      </nav>
    </aside>
  );
}
