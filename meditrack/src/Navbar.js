import React, { useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

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
  const isDev = process.env.NODE_ENV === 'development';

  // Try to get user from localStorage if context is null
  const user = contextUser || JSON.parse(localStorage.getItem('user'));

  // Auto-navigate by role
  useEffect(() => {
    if (user && user.role && roleToDashboard[user.role]) {
      navigate(roleToDashboard[user.role]);
    }
  }, [user, navigate]);

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

export default Navbar;
