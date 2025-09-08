import React from 'react';
import { FaBell, FaUserCircle, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function TopBar({ onMenuClick }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};

  return (
    <header className="bg-white shadow-sm py-3 px-6 flex items-center justify-between fixed top-0 right-0 left-0 z-40">
      <div className="flex items-center">
        <button 
          onClick={onMenuClick}
          className="text-gray-600 hover:text-gray-800 mr-4 md:hidden"
        >
          <FaBars size={20} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">MediTrack Clinic</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="text-gray-600 hover:text-gray-800 relative">
          <FaBell size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            3
          </span>
        </button>
        
        <div className="relative group">
          <button className="flex items-center space-x-2 focus:outline-none">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-gray-700">
                {user.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user.role || 'Role'}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name || 'User'} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <FaUserCircle className="text-gray-500 text-2xl" />
              )}
            </div>
          </button>
          
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault();
                navigate('/profile');
              }}
            >
              Your Profile
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Settings
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault();
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                navigate('/login');
              }}
            >
              Sign out
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
