export type RequestType = 'timeChange' | 'dayOff' | 'swap' | 'leave' | 'overtime';

export interface ScheduleChangeRequest {
  id: string;
  doctorId: string;
  requestType: RequestType;
  date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'denied';
  startTime?: string;
  endTime?: string;
  requestedBy?: string;
  reviewedBy?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
