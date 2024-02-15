import { ProductType } from '@/types';
import * as yup from 'yup';

export const productValidationSchema = yup.object().shape({
 


  variation_options: yup.array().of(
    yup.object().shape({
      // sell_price_inc_tax: yup
      //   .number()
      //   .typeError('form:error-price-must-number')
      //   .positive('form:error-price-must-positive')
      //   .required('form:error-price-required'),
    
        default_sell_price: yup
        .mixed()
        .typeError('form:error-price-must-be-any-type')
        .required('form:error-price-required'),
      // stock: yup
      //   .number()
      //   .typeError('form:error-quantity-must-number')
      //   .positive('form:error-quantity-must-positive')
      //   .integer('form:error-quantity-must-integer')
      //   .required('form:error-quantity-required'),
        // sub_sku: yup.string().required('form:error-sku-required'),
      digital_file_input: yup.mixed().when('is_digital', (isDigital) => {
        if (isDigital) {
          return yup
            .object()
            .test(
              'check-digital-file',
              'form:error-digital-file-input-required',
              (file) => file && file?.original
            );
        }
        return yup.string().nullable();
      }),
    })
  ),
  digital_file_input: yup.mixed().when('is_digital', (isDigital) => {
    if (isDigital) {
      return yup
        .object()
        .test(
          'check-digital-file',
          'form:error-digital-file-input-required',
          (file) => file && file?.original
        );
    }
    return yup.string().nullable();
  }),
});
