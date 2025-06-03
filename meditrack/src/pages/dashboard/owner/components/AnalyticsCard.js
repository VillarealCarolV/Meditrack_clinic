import React from 'react';

export default function AnalyticsCard({ title, value, icon, trend, trendText, bgColor = 'bg-white' }) {
  return (
    <div className={`${bgColor} p-6 rounded-lg shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-800">{value}</p>
          {trend && (
            <div className={`mt-2 flex items-center ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              <span className="text-sm font-medium">{trend}</span>
              <span className="ml-1 text-xs">{trendText}</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  );
}
