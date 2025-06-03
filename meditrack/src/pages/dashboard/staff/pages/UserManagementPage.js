import React from 'react';
import { useNavigate } from 'react-router-dom';
import StaffSidebar from '../StaffSidebar';
import UserManagementTable from '../UserManagementTable';

export default function UserManagementPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <StaffSidebar activePage="user-management" />
      <div className="ml-0 md:ml-60 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <UserManagementTable />
        </div>
      </div>
    </div>
  );
}
