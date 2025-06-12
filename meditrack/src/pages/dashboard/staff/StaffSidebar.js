import React, { useCallback } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/dashboard/staff', icon: '📊', label: 'Dashboard', id: 'dashboard' },
  { to: '/dashboard/staff/appointments', icon: '📅', label: 'Appointments', id: 'appointments' },
  { to: '/dashboard/staff/reports', icon: '📈', label: 'Reports', id: 'reports' },
  { to: '/dashboard/staff/user-management', icon: '👥', label: 'User Management', id: 'user-management' },
  { to: '/dashboard/staff/settings', icon: '⚙️', label: 'Settings', id: 'settings' },
];

function StaffSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = useCallback(() => {
    // Clear user session
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login page
    navigate('/login', { replace: true });
  }, [navigate]);

  // Memoize the isActive function
  const isActive = useCallback((path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  }, [location.pathname]);

  return (
    <aside className="fixed top-0 left-0 z-30 w-60 h-full bg-white shadow-lg overflow-y-auto">
      <div className="p-6">
        <div className="text-xl font-bold text-blue-600 mb-8">Staff Portal</div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.to}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive(item.to)
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
          
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 rounded-lg text-left text-red-600 hover:bg-red-50 mt-4"
          >
            <span className="text-lg">🚪</span>
            <span className="text-sm font-medium">Log out</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}

export default React.memo(StaffSidebar);
