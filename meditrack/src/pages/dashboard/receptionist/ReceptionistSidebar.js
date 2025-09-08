import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaUserPlus, 
  FaUsers, 
  FaFileInvoiceDollar, 
  FaChartBar, 
  FaCog 
} from 'react-icons/fa';

export default function ReceptionistSidebar() {
  const location = useLocation();
  
  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard/receptionist', 
      icon: <FaChartBar className="mr-3" /> 
    },
    { 
      name: 'Appointments', 
      path: '/dashboard/receptionist/appointments', 
      icon: <FaCalendarAlt className="mr-3" /> 
    },
    { 
      name: 'Add Patient', 
      path: '/dashboard/receptionist/add-patient', 
      icon: <FaUserPlus className="mr-3" /> 
    },
    { 
      name: 'Patient List', 
      path: '/dashboard/receptionist/patients', 
      icon: <FaUsers className="mr-3" /> 
    },
    { 
      name: 'Billing', 
      path: '/dashboard/receptionist/billing', 
      icon: <FaFileInvoiceDollar className="mr-3" /> 
    },
    { 
      name: 'Settings', 
      path: '/dashboard/receptionist/settings', 
      icon: <FaCog className="mr-3" /> 
    },
  ];

  return (
    <div className="bg-white w-64 min-h-screen shadow-lg">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Receptionist Panel</h2>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 ${
              location.pathname === item.path ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
