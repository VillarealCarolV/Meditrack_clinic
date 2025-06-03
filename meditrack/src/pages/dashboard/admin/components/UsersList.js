import React from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

const UsersList = ({ users = [] }) => {
  // Sample data - replace with actual data from props
  const userData = users.length > 0 ? users : [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Admin',
      status: 'active',
      lastLogin: '2 hours ago'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Doctor',
      status: 'pending',
      lastLogin: '1 day ago'
    },
    {
      id: 3,
      name: 'Robert Johnson',
      email: 'robert.j@example.com',
      role: 'Nurse',
      status: 'active',
      lastLogin: '5 hours ago'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.d@example.com',
      role: 'Patient',
      status: 'inactive',
      lastLogin: '1 week ago'
    }
  ];

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Users Management</h2>
        <Link to="/dashboard/admin/users/new" className="btn btn-primary">
          Add New User
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Name</th>
              <th className="text-left">Email</th>
              <th className="text-left">Role</th>
              <th className="text-left">Status</th>
              <th className="text-left">Last Login</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-sm text-gray-500">{user.email}</td>
                <td className="py-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </td>
                <td className="py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-4 text-sm text-gray-500">{user.lastLogin}</td>
                <td className="py-4 text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button 
                      className="text-blue-600 hover:text-blue-900"
                      title="View"
                    >
                      <FiEye className="w-5 h-5" />
                    </button>
                    <button 
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edit"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of <span className="font-medium">24</span> results
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 border rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50">
            Previous
          </button>
          <button className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-gray-100">
            1
          </button>
          <button className="px-4 py-2 border rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50">
            2
          </button>
          <button className="px-4 py-2 border rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersList;
