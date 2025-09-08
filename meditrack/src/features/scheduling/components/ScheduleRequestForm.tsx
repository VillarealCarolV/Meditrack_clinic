import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { requestScheduleChange } from '../api/scheduleApi';
import { RequestType } from '../types/schedule';

interface ScheduleRequestFormProps {
  doctorId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

type FormData = {
  requestType: RequestType;
  startTime: string;
  endTime: string;
  reason: string;
  date: string;
};

export const ScheduleRequestForm: React.FC<ScheduleRequestFormProps> = ({
  doctorId,
  onSuccess,
  onCancel,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      await requestScheduleChange({
        doctorId,
        requestType: data.requestType,
        reason: data.reason,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime
      });

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          {...register('date', { required: 'Date is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.date?.message && (
          <p className="mt-1 text-sm text-red-600">
            {String(errors.date.message)}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Request Type</label>
        <select
          {...register('requestType', { required: 'Request type is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="timeOff">Request Time Off</option>
          <option value="swap">Request Shift Swap</option>
        </select>
        {errors.requestType?.message && (
          <p className="mt-1 text-sm text-red-600">
            {String(errors.requestType.message)}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Reason</label>
        <textarea
          {...register('reason', { 
            required: 'Please provide a reason for your request',
            minLength: { 
              value: 10, 
              message: 'Reason should be at least 10 characters' 
            }
          })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Please explain the reason for your request..."
        />
        {errors.reason?.message && (
          <p className="mt-1 text-sm text-red-600">
            {String(errors.reason.message)}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
    </form>
  );
};

export default ScheduleRequestForm;
