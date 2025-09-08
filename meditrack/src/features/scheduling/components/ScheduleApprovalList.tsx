import React, { useState, useEffect } from 'react';
import { getPendingRequests, updateRequestStatus } from '../api/scheduleApi';
import { ScheduleChangeRequest } from '../types/schedule';

export const ScheduleApprovalList: React.FC = () => {
  const [requests, setRequests] = useState<ScheduleChangeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ScheduleChangeRequest | null>(null);
  const [notes, setNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setIsLoading(true);
        const data = await getPendingRequests();
        setRequests(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load requests');
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, []);

  const handleApprove = async (request: ScheduleChangeRequest) => {
    try {
      setIsUpdating(true);
      await updateRequestStatus(request.id, 'APPROVED', notes);
      setRequests(prev => prev.filter(req => req.id !== request.id));
      setSelectedRequest(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve request');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async (request: ScheduleChangeRequest) => {
    try {
      setIsUpdating(true);
      await updateRequestStatus(request.id, 'REJECTED', notes);
      setRequests(prev => prev.filter(req => req.id !== request.id));
      setSelectedRequest(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject request');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading requests...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        {error}
      </div>
    );
  }

  if (requests.length === 0) {
    return <div className="text-center py-4 text-gray-500">No pending requests</div>;
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Doctor
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Type
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Date/Time
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  Dr. {request.doctorId.split('-')[0]}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {request.requestType.replace('_', ' ')}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {request.startTime && request.endTime ? (
                    <>
                      {new Date(request.startTime).toLocaleString()} - {new Date(request.endTime).toLocaleTimeString()}
                    </>
                  ) : 'No time specified'}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {request.status}
                  </span>
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Review Schedule Change Request
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Request Details</h4>
                <div className="mt-2 text-sm text-gray-700 space-y-1">
                  <p><span className="font-medium">Type:</span> {selectedRequest.requestType.replace('_', ' ')}</p>
                  {selectedRequest.startTime && selectedRequest.endTime ? (
                    <>
                      <p><span className="font-medium">Date:</span> {new Date(selectedRequest.startTime).toLocaleDateString()}</p>
                      <p><span className="font-medium">Time:</span> {new Date(selectedRequest.startTime).toLocaleTimeString()} - {new Date(selectedRequest.endTime).toLocaleTimeString()}</p>
                    </>
                  ) : (
                    <p><span className="font-medium">Time:</span> No time specified</p>
                  )}
                  {selectedRequest.reason && (
                    <p><span className="font-medium">Reason:</span> {selectedRequest.reason}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes (Optional)
                </label>
                <div className="mt-1">
                  <textarea
                    id="notes"
                    rows={3}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Add any notes about this decision..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setSelectedRequest(null)}
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  onClick={() => handleReject(selectedRequest)}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Processing...' : 'Reject'}
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  onClick={() => handleApprove(selectedRequest)}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Processing...' : 'Approve'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleApprovalList;
