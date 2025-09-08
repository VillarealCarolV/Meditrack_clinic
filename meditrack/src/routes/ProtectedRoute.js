import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles }) {
  // Get user data from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  let role = user?.role;

  // Normalize role (lowercase and trim)
  role = role?.toLowerCase()?.trim();

  // Map backend roles to effective frontend roles
  const roleMap = {
    admin: 'admin',
    owner: 'admin',
    receptionist: 'receptionist',
    doctor: 'doctor',
    nurse: 'nurse',
    patient: 'patient',
    staff: 'receptionist'  // Map staff to receptionist
  };

  const effectiveRole = roleMap[role] || role;

  console.log("🔐 ProtectedRoute Debug:", { 
    storedUser: user,
    originalRole: user?.role,
    normalizedRole: role,
    effectiveRole,
    allowedRoles,
    localStorageUser: localStorage.getItem('user')
  });

  if (!effectiveRole || !allowedRoles.includes(effectiveRole)) {
    console.warn("⛔ Unauthorized access for role:", effectiveRole, "Allowed roles:", allowedRoles);
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
