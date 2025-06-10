import React, { useCallback, useMemo } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/dashboard/doctor', icon: '📊', label: 'Dashboard', id: 'dashboard' },
  { to: '/dashboard/doctor/patients', icon: '👥', label: 'Patients', id: 'patients' },
  { to: '/dashboard/doctor/reports', icon: '📈', label: 'Reports', id: 'reports' },
  { to: '/dashboard/doctor/appointments', icon: '📅', label: 'Appointments', id: 'appointments' },
  { to: '/dashboard/doctor/prescriptions', icon: '💊', label: 'Prescriptions', id: 'prescriptions' },
];

const DoctorSidebar = React.memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = useCallback(() => {
    // Clear user session
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login page
    navigate('/login');
  }, [navigate]);

  const isActive = useCallback((path) => {
    return location.pathname === path || 
           (path !== '/dashboard/doctor' && location.pathname.startsWith(path));
  }, [location.pathname]);

  const memoizedNavItems = useMemo(() => (
    navItems.map((item) => (
      <NavLink
        key={item.id}
        to={item.to}
        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
          isActive(item.to)
            ? 'bg-blue-50 text-blue-600 font-medium'
            : 'hover:bg-gray-100 text-gray-700'
        }`}
      >
        <span className="text-lg">{item.icon}</span>
        <span>{item.label}</span>
      </NavLink>
    ))
  ), [isActive]);

  return (
    <aside className="fixed top-0 left-0 z-30 w-60 h-full bg-white shadow-lg p-6 space-y-6 overflow-y-auto">
      <div className="text-xl font-bold text-blue-600 mb-8">MediTrack</div>
      <nav className="space-y-2 text-gray-700">
        {memoizedNavItems}
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
});

export default DoctorSidebar;
