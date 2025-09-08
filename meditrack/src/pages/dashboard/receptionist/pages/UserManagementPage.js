import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReceptionistSidebar from '../ReceptionistSidebar';
import UserManagementTable from '../UserManagementTable';

export default function UserManagementPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <ReceptionistSidebar activePage="user-management" />
      <div className="ml-64 p-6">
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
