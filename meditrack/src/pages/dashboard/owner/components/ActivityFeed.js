import React from 'react';
import { 
  FaUserPlus, 
  FaUserMd, 
  FaFileAlt, 
  FaCalendarAlt,
  FaUserCheck,
  FaArrowRight
} from 'react-icons/fa';

const ActivityItem = ({ type, message, time, user }) => {
  const getActivityIcon = () => {
    const iconClass = 'text-lg';
    
    switch (type) {
      case 'new_user':
        return <FaUserPlus className="text-blue-500" />;
      case 'doctor_assigned':
        return <FaUserMd className="text-green-500" />;
      case 'new_record':
        return <FaFileAlt className="text-amber-500" />;
      case 'appointment':
        return <FaCalendarAlt className="text-purple-500" />;
      case 'approval':
        return <FaUserCheck className="text-emerald-500" />;
      default:
        return <div className="w-8 h-8 rounded-full bg-gray-200"></div>;
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="activity-item">
      <div className="activity-avatar bg-blue-50 text-blue-600">
        {user?.avatar ? (
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="font-medium text-sm">
            {getInitials(user?.name || 'U')}
          </span>
        )}
      </div>
      <div className="activity-content">
        <p className="activity-title">
          {message}
          {type === 'new_user' && (
            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              New
            </span>
          )}
        </p>
        <p className="activity-desc">
          {time} • {type ? type.replace('_', ' ').replace(/^\w/, c => c.toUpperCase()) : 'Activity'}
        </p>
      </div>
      <div className="activity-time">
        {time}
      </div>
    </div>
  );
};

export default function ActivityFeed({ activities }) {
  // Sample data if no activities provided
  const sampleActivities = activities && activities.length > 0 ? activities : [
    {
      id: 1,
      type: 'new_user',
      message: 'New staff member registered and pending approval',
      time: '2 min ago',
      user: { 
        name: 'John Doe', 
        role: 'Doctor',
        avatar: null
      }
    },
    {
      id: 2,
      type: 'appointment',
      message: 'New appointment scheduled with Dr. Smith',
      time: '1 hour ago',
      user: { 
        name: 'Sarah Johnson', 
        role: 'Patient',
        avatar: null
      }
    },
    {
      id: 3,
      type: 'new_record',
      message: 'Medical record updated for Robert Chen',
      time: '3 hours ago',
      user: { 
        name: 'Dr. Emily Wilson', 
        role: 'Doctor',
        avatar: null
      }
    },
    {
      id: 4,
      type: 'doctor_assigned',
      message: 'Dr. Wilson assigned to follow-up with Maria Garcia',
      time: '5 hours ago',
      user: { 
        name: 'System', 
        role: 'Admin',
        avatar: null
      }
    }
  ];

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="section-title">Recent Activity</h2>
          <p className="text-sm text-gray-500">Latest actions in your clinic</p>
        </div>
        <button className="btn btn-outline text-sm py-1 px-3">
          View All
        </button>
      </div>
      
      <div className="activity-feed">
        {sampleActivities.map((activity) => (
          <ActivityItem key={activity.id} {...activity} />
        ))}
      </div>
    </div>
  );
}
