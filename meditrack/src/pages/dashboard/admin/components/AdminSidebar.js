import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaUserMd, 
  FaUserNurse, 
  FaUserInjured, 
  FaCalendarAlt, 
  FaFileAlt, 
  FaChartLine, 
  FaCog,
  FaSignOutAlt,
  FaUsers
} from 'react-icons/fa';

const AdminSidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);

  const menuItems = [
    { 
      title: 'Dashboard', 
      icon: <FaTachometerAlt className="icon" />, 
      path: '/dashboard/admin' 
    },
    { 
      title: 'Doctors', 
      icon: <FaUserMd className="icon" />, 
      path: '/dashboard/admin/doctors' 
    },
    { 
      title: 'Nurses', 
      icon: <FaUserNurse className="icon" />, 
      path: '/dashboard/admin/nurses' 
    },
    { 
      title: 'Patients', 
      icon: <FaUserInjured className="icon" />, 
      path: '/dashboard/admin/patients' 
    },
    { 
      title: 'Appointments', 
      icon: <FaCalendarAlt className="icon" />, 
      path: '/dashboard/admin/appointments' 
    },
    { 
      title: 'Reports', 
      icon: <FaFileAlt className="icon" />, 
      path: '/dashboard/admin/reports' 
    },
    { 
      title: 'Analytics', 
      icon: <FaChartLine className="icon" />, 
      path: '/dashboard/admin/analytics' 
    },
    { 
      title: 'User Management', 
      icon: <FaUsers className="icon" />, 
      path: '/dashboard/admin/users' 
    },
    { 
      title: 'Settings', 
      icon: <FaCog className="icon" />, 
      path: '/dashboard/admin/settings' 
    },
  ];

  return (
    <div className="admin-sidebar">
      <div className="mb-8 px-2">
        <h2 className="text-xl font-bold text-gray-800">MediTrack</h2>
        <p className="text-sm text-gray-500">Admin Panel</p>
      </div>
      
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              isActive(item.path) 
                ? 'bg-green-50 text-green-700' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
      
      <div className="mt-auto pt-4 border-t border-gray-100">
        <button className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <FaSignOutAlt className="mr-3 text-lg" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
