// src/features/scheduling/api/scheduleApi.ts
import axios from 'axios';
import { ScheduleChangeRequest } from '../types/schedule';

export const getPendingRequests = async (): Promise<ScheduleChangeRequest[]> => {
  const { data } = await axios.get('/api/schedule/requests');
  return data;
};

export const updateRequestStatus = async (
  id: string,
  status: 'APPROVED' | 'REJECTED',
  notes?: string
): Promise<void> => {
  await axios.put(`/api/schedule/requests/${id}`, { status, notes });
};

export const requestScheduleChange = async (
  request: Omit<ScheduleChangeRequest, 'id' | 'status'>
): Promise<ScheduleChangeRequest> => {
  const { data } = await axios.post('/api/schedule/requests', request);
  return data;
};