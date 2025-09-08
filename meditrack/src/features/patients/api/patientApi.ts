import { Patient } from '../types/patient';

const API_BASE_URL = '/api/patients';

export const createPatient = async (patient: Omit<Patient, 'id'>): Promise<Patient> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patient),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create patient');
  }

  return response.json();
};

export const updatePatient = async (id: string, patient: Partial<Patient>): Promise<Patient> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patient),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update patient');
  }

  return response.json();
};
