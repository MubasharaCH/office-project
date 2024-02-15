import * as yup from 'yup';

export const tagValidationSchema = yup.object().shape({
  title: yup.string().required('form:error-title-required'),
  type: yup.object().nullable().required('form:error-type-required'),
});
