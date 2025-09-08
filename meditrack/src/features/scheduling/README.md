# Schedule Management System

This module handles all scheduling-related functionality, including doctor availability, appointment scheduling, and schedule change requests.

## Components

### 1. ScheduleRequestForm
- **Used by**: Doctors
- **Purpose**: Submit schedule change requests (time off, unavailable times, etc.)
- **Features**:
  - Request different types of schedule changes
  - Specify date/time ranges
  - Add optional notes

### 2. ScheduleApprovalList
- **Used by**: Staff/Admin
- **Purpose**: Review and approve/reject schedule change requests
- **Features**:
  - View all pending requests
  - See request details
  - Approve or reject with optional notes
  - View request history

## Workflow

1. **Doctor Requests Change**
   - Doctor submits a schedule change request through the form
   - Request is marked as PENDING

2. **Staff Reviews**
   - Staff sees the request in their approval queue
   - Staff can view request details and any conflicts
   - Staff approves or rejects with optional notes

3. **System Updates**
   - If approved, the schedule is automatically updated
   - If rejected, the doctor is notified with the reason

## API Endpoints

- `POST /api/schedule/requests` - Submit a new schedule change request
- `GET /api/schedule/requests/pending` - Get all pending requests (staff only)
- `PATCH /api/schedule/requests/:id` - Update request status (approve/reject)
- `GET /api/schedule/doctors/:id/slots` - Get available time slots for a doctor

## Types

### ScheduleChangeRequest
```typescript
{
  id: string;
  doctorId: string;
  requestType: 'UNAVAILABLE' | 'TIME_OFF' | 'APPOINTMENT_CHANGE';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedBy: 'DOCTOR' | 'STAFF';
  startTime: Date;
  endTime: Date;
  reason?: string;
  conflictResolution?: 'RESCHEDULE' | 'CANCEL' | 'KEEP_AS_IS';
  createdAt: Date;
  updatedAt: Date;
}
```

### ScheduleSlot
```typescript
{
  id: string;
  doctorId: string;
  startTime: Date;
  endTime: Date;
  status: 'AVAILABLE' | 'BOOKED' | 'UNAVAILABLE';
  appointmentId?: string;
  changeRequestId?: string;
}
```

## Usage Example

### Doctor Requesting Time Off
```jsx
<ScheduleRequestForm 
  doctorId="doc_123" 
  onSuccess={() => alert('Request submitted!')} 
/>
```

### Staff Reviewing Requests
```jsx
<ScheduleApprovalList />
```
