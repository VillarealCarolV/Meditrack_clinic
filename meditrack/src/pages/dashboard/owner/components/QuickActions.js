import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFileAlt, 
  FaChartLine, 
  FaUserPlus, 
  FaCalendarPlus,
  FaUserMd,
  FaClipboardList,
  FaArrowRight
} from 'react-icons/fa';

const quickActions = [
  { 
    title: 'New Appointment', 
    icon: <FaCalendarPlus className="text-blue-500" />, 
    link: '/dashboard/owner/appointments/new',
    description: 'Schedule a new patient appointment',
    color: 'bg-blue-50',
    textColor: 'text-blue-600'
  },
  { 
    title: 'Add Patient', 
    icon: <FaUserPlus className="text-green-500" />, 
    link: '/dashboard/owner/patients/new',
    description: 'Register a new patient',
    color: 'bg-green-50',
    textColor: 'text-green-600'
  },
  { 
    title: 'Generate Report', 
    icon: <FaFileAlt className="text-purple-500" />, 
    link: '/dashboard/owner/reports/generate',
    description: 'Create clinic reports',
    color: 'bg-purple-50',
    textColor: 'text-purple-600'
  },
  { 
    title: 'Quick Stats', 
    icon: <FaChartLine className="text-amber-500" />, 
    link: '/dashboard/owner/analytics/quick',
    description: 'View key metrics',
    color: 'bg-amber-50',
    textColor: 'text-amber-600'
  }
];

export default function QuickActions() {
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="section-title">Quick Actions</h2>
          <p className="text-sm text-gray-500">Quickly access common tasks</p>
        </div>
        <Link 
          to="/dashboard/owner/activities" 
          className="text-sm text-blue-600 hover:underline flex items-center"
        >
          View all activities <FaArrowRight className="ml-1 text-xs" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className={`group block p-4 rounded-xl transition-all duration-200 hover:shadow-md ${action.color} hover:translate-y-[-2px]`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${action.color} ${action.textColor}`}>
              <span className="text-lg">{action.icon}</span>
            </div>
            <h3 className="font-medium text-gray-900 group-hover:text-gray-700">
              {action.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {action.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
