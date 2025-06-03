import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles, children }) {
  // Get user object from localStorage (set by backend login)
  const user = JSON.parse(localStorage.getItem('user'));
  let role = user?.role;

  // Map backend roles to effective frontend roles for access control
  const roleMap = {
    admin: 'staff',
    owner: 'owner',
    staff: 'staff',
    doctor: 'doctor',
    nurse: 'nurse',
    patient: 'patient'
  };

  const effectiveRole = roleMap[role];

  if (!effectiveRole || !allowedRoles.includes(effectiveRole)) {
    return <Navigate to="/unauthorized" />;
  }
  return children;
}
