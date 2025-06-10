// In Navbar.js
import React, { useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const roles = ['patient', 'doctor', 'nurse', 'staff', 'owner'];

const roleToDashboard = {
  patient: '/dashboard/patient',
  doctor: '/dashboard/doctor',
  nurse: '/dashboard/nurse',
  staff: '/dashboard/staff',
  owner: '/dashboard/owner',
};

const Navbar = () => {
  const { user: contextUser, loginAsRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isDev = process.env.NODE_ENV === 'development';

  // Memoize the user to prevent unnecessary re-renders
  const user = useMemo(() => 
    contextUser || JSON.parse(localStorage.getItem('user') || 'null'),
    [contextUser]
  );

  // Only navigate if we're not already on the target page
  useEffect(() => {
    if (user?.role && roleToDashboard[user.role] && 
        !location.pathname.startsWith(roleToDashboard[user.role])) {
      navigate(roleToDashboard[user.role]);
    }
  }, [user, navigate, location.pathname]);

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
      <div>Meditrack (Dev)</div>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: 12 }}>
              <strong>{user.name || user.email}</strong> ({user.email})
            </span>
            <span style={{ marginRight: 12 }}>Role: {user.role}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <span>Not logged in</span>
        )}
      </div>
    </nav>
  );
};

export default React.memo(Navbar);