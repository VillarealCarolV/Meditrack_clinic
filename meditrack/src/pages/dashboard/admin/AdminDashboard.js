import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import { FiMenu, FiBell, FiSearch, FiUser } from 'react-icons/fi';
import './styles/admin-dashboard.css'; // Updated path to local styles directory

// Sample stats data
const stats = [
  { title: 'Total Patients', value: '1,234', change: '+12%', isPositive: true },
  { title: 'Active Doctors', value: '42', change: '+5%', isPositive: true },
  { title: 'Pending Appointments', value: '28', change: '-3%', isPositive: false },
  { title: 'Monthly Revenue', value: '$48,500', change: '+18%', isPositive: true },
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Close sidebar on mobile when navigating
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <div className="admin-container">
      {/* Mobile sidebar toggle */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md lg:hidden"
      >
        <FiMenu className="w-6 h-6 text-gray-600" />
      </button>

      {/* Sidebar */}
      <div className={` ${sidebarOpen ? 'open' : ''}`}>
        <AdminSidebar />
      </div>

      {/* Main content */}
      <main className="main-content">
        {/* Top navigation */}
        <header className="bg-white shadow-sm mb-6 p-4 rounded-lg sticky top-0 z-40">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
            
            <div className="flex items-center space-x-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-500 w-full md:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </form>
              
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
                <FiBell className="w-5 h-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <FiUser className="text-green-600" />
                </div>
                <span className="hidden md:inline text-sm font-medium">Admin User</span>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Overview */}
        <section className="mb-8">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className={`stat-box ${index % 3 === 1 ? 'yellow' : index % 3 === 2 ? 'blue' : ''}`}>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl font-bold">{stat.value}</span>
                  <span className={`text-sm ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Page Content */}
        <div className="space-y-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
