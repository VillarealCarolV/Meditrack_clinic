import React from 'react';
import { FaUserClock, FaUserCheck, FaUserTimes, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Sample pending approvals data
const sampleApprovals = [
  {
    id: 1,
    name: 'Dr. Robert Chen',
    role: 'Doctor',
    email: 'robert.chen@example.com',
    status: 'pending',
    date: '2 hours ago'
  },
  {
    id: 2,
    name: 'Nurse Sarah Johnson',
    role: 'Nurse',
    email: 'sarah.j@example.com',
    status: 'pending',
    date: '5 hours ago'
  },
  {
    id: 3,
    name: 'Dr. Michael Brown',
    role: 'Doctor',
    email: 'michael.b@example.com',
    status: 'pending',
    date: '1 day ago'
  }
];

export default function PendingApprovals({ count = sampleApprovals.length }) {
  const handleApprove = (id) => {
    // Handle approval logic
    console.log(`Approved user ${id}`);
  };

  const handleReject = (id) => {
    // Handle rejection logic
    console.log(`Rejected user ${id}`);
  };

  return (
    <div className="card h-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="section-title">Pending Approvals</h2>
          <p className="text-sm text-gray-500">
            {count > 0 
              ? `${count} staff ${count === 1 ? 'member' : 'members'} awaiting approval`
              : 'No pending approvals'}
          </p>
        </div>
        {count > 0 && (
          <Link 
            to="/dashboard/owner/receptionists/pending" 
            className="text-sm text-blue-600 hover:underline flex items-center"
          >
            View all <FaArrowRight className="ml-1 text-xs" />
          </Link>
        )}
      </div>

      {count === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <FaUserCheck className="text-green-500 text-xl" />
          </div>
          <h3 className="text-gray-900 font-medium">All caught up!</h3>
          <p className="text-sm text-gray-500 mt-1">No pending approvals at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sampleApprovals.slice(0, 3).map((approval) => (
            <div key={approval.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{approval.name}</h4>
                  <p className="text-sm text-gray-500">{approval.role}</p>
                  <p className="text-xs text-gray-400 mt-1">{approval.email}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                  Pending
                </span>
              </div>
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-400">{approval.date}</span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleReject(approval.id)}
                    className="text-xs px-3 py-1 border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleApprove(approval.id)}
                    className="text-xs px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {count > 3 && (
            <div className="text-center mt-2">
              <Link 
                to="/dashboard/owner/receptionists/pending" 
                className="text-sm text-blue-600 hover:underline inline-flex items-center"
              >
                View all {count} pending approvals <FaArrowRight className="ml-1 text-xs" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
