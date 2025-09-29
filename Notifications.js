import React from 'react';

export default function Notifications({ notifications = [], onMarkAllAsRead }) {
  return (
    <div className="bg-white rounded shadow">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-2xl font-bold">Notifications & Reminders</h2>
        <button
          onClick={onMarkAllAsRead}
          className="text-sm text-green-700"
        >
          Mark all as read
        </button>
      </div>
      <div className="divide-y">
        {notifications.length === 0 && (
          <div className="p-4 text-gray-500">No notifications.</div>
        )}
        {notifications.map((n) => (
          <div key={n.id} className={`p-4 ${n.read ? '' : 'bg-green-50'}`}>
            <div className="font-medium">{n.title}</div>
            <div className="text-sm text-gray-600">{n.message}</div>
            <div className="text-xs text-gray-500 mt-1">{new Date(n.timestamp).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

