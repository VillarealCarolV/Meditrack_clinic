import React from 'react';
import { 
  FaUsers, 
  FaUserMd, 
  FaUserNurse, 
  FaUserInjured, 
  FaDollarSign,
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt
} from 'react-icons/fa';

const StatCard = ({ icon, title, value, change, isPositive, color = 'blue' }) => {
  const colors = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
    green: { bg: 'bg-green-50', text: 'text-green-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
    red: { bg: 'bg-red-50', text: 'text-red-600' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  };

  const colorSet = colors[color] || colors.blue;

  return (
    <div className="stat-card group">
      <div className={`stat-icon ${colorSet.bg} ${colorSet.text}`}>
        {icon}
      </div>
      <div className="stat-info">
        <p className="stat-value">{value}</p>
        <p className="stat-label">{title}</p>
      </div>
      {change !== undefined && (
        <div className={`text-sm flex items-center mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
          {change}%
        </div>
      )}
    </div>
  );
};

export default function StatsOverview({ stats }) {
  return (
    <div className="stats-grid">
      <StatCard 
        icon={<FaUsers className="text-lg" />}
        title="Total Users"
        value={stats.totalUsers || 0}
        change={12.5}
        isPositive={true}
        color="blue"
      />
      
      <StatCard 
        icon={<FaUserMd className="text-lg" />}
        title="Active Doctors"
        value={stats.activeDoctors || 0}
        change={5.2}
        isPositive={true}
        color="green"
      />
      
      <StatCard 
        icon={<FaUserNurse className="text-lg" />}
        title="Active Nurses"
        value={stats.activeNurses || 0}
        change={-2.1}
        isPositive={false}
        color="purple"
      />
      
      <StatCard 
        icon={<FaDollarSign className="text-lg" />}
        title="Monthly Revenue"
        value={`$${stats.monthlyRevenue ? stats.monthlyRevenue.toLocaleString() : '0'}`}
        change={18.7}
        isPositive={true}
        color="amber"
      />
      
      <StatCard 
        icon={<FaUserInjured className="text-lg" />}
        title="Active Patients"
        value={stats.activePatients || 0}
        change={8.3}
        isPositive={true}
        color="emerald"
      />
      
      <StatCard 
        icon={<FaCalendarAlt className="text-lg" />}
        title="Monthly Appointments"
        value={stats.monthlyAppointments || 0}
        change={-1.2}
        isPositive={false}
        color="red"
      />
    </div>
  );
}
