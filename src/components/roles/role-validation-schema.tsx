import * as yup from 'yup';

export const userValidationSchema = yup.object().shape({
  first_name: yup.string().required('Firstname filed is required'),
  last_name: yup.string().required('Lastname field is required'),
  email: yup
    .string()
    .email('form:error-email-format')
    .required('form:error-email-required'),
  password: yup.string().required('form:error-password-required'),
  role_id: yup.number().required('Role field is required'),
});
