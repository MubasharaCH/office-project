import SelectInput from '@/components/ui/select-input';
import Label from '@/components/ui/label';
import { useFormContext } from 'react-hook-form';
import Card from '@/components/common/card';
import ValidationError from '@/components/ui/form-validation-error';
import { ProductType } from '@/types';
import { useTranslation } from 'next-i18next';

const productType = [
  { name: 'Simple', value: ProductType.Simple },
  { name: 'Variable', value: ProductType.Variable },
];

const ProductTypeInput = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation();

  return (
      <div className="mb-5">
        <Label>{t('form:form-title-product-type')}</Label>
        <SelectInput
          name="product_type"
          control={control}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.value}
          options={productType}
        />
        <ValidationError message="" />
      </div>
  );
};

export default ProductTypeInput;
