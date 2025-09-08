import * as yup from 'yup';

export const patientValidationSchema = yup.object({
  fullName: yup.string().required('Full name is required'),
  dob: yup
    .date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future'),
  gender: yup
    .string()
    .oneOf(['male', 'female', 'other', 'unknown'], 'Please select a valid gender')
    .required('Gender is required'),
  contactInfo: yup
    .string()
    .required('Contact information is required')
    .email('Please enter a valid email address'),
  address: yup.string().optional(),
  medicalRecordNumber: yup.string().optional(),
});
