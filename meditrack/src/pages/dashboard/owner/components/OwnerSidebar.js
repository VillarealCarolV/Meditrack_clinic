import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaUserMd, 
  FaUserNurse, 
  FaUserFriends, 
  FaCalendarAlt, 
  FaFileAlt, 
  FaChartLine, 
  FaCog, 
  FaSignOutAlt,
  FaUserShield,
  FaClipboardList
} from 'react-icons/fa';

const menuItems = [
  { name: 'Dashboard', icon: <FaHome className="mr-3" />, path: '/dashboard/owner' },
  { name: 'Appointments', icon: <FaCalendarAlt className="mr-3" />, path: '/dashboard/owner/appointments' },
  { name: 'Receptionists', icon: <FaUserFriends className="mr-3" />, path: '/dashboard/owner/receptionists' },
  { name: 'Doctors', icon: <FaUserMd className="mr-3" />, path: '/dashboard/owner/doctors' },
  { name: 'Nurses', icon: <FaUserNurse className="mr-3" />, path: '/dashboard/owner/nurses' },
  { name: 'Patients', icon: <FaUserFriends className="mr-3" />, path: '/dashboard/owner/patients' },
  { name: 'Medical Records', icon: <FaClipboardList className="mr-3" />, path: '/dashboard/owner/records' },
  { name: 'Reports', icon: <FaFileAlt className="mr-3" />, path: '/dashboard/owner/reports' },
  { name: 'Analytics', icon: <FaChartLine className="mr-3" />, path: '/dashboard/owner/analytics' },
  { name: 'Settings', icon: <FaCog className="mr-3" />, path: '/dashboard/owner/settings' },
];

export default function OwnerSidebar() {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = React.useState({});

  const toggleMenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    // Handle logout logic here
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="h-screen bg-gray-800 text-white w-64 fixed left-0 top-0 overflow-y-auto transition-all duration-300">
      <div className="p-4">
        <div className="flex items-center justify-between mb-8 pt-4">
          <h1 className="text-xl font-bold">MediTrack</h1>
        </div>
        
        <div className="space-y-2 mt-8">
          {menuItems.map((item) => (
            <div key={item.name}>
              <div 
                onClick={() => item.subItems ? toggleMenu(item.name) : null}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${isActive(item.path) ? 'bg-blue-700' : 'hover:bg-gray-700'}`}
              >
                <Link 
                  to={item.path} 
                  className="flex items-center flex-1"
                  onClick={(e) => item.subItems && e.preventDefault()}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="ml-2">{item.name}</span>
                </Link>
                {item.subItems && (
                  <span className={`transition-transform ${expandedMenus[item.name] ? 'transform rotate-180' : ''}`}>
                    ▼
                  </span>
                )}
              </div>
              
              {item.subItems && expandedMenus[item.name] && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.name}
                      to={subItem.path}
                      className={`block p-2 text-sm rounded hover:bg-gray-700 ${isActive(subItem.path) ? 'text-blue-300' : 'text-gray-300'}`}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center p-2 text-red-400 hover:bg-gray-700 rounded-lg"
        >
          <FaSignOutAlt className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}
