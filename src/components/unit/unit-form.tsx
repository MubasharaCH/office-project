import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useRouter } from 'next/router';
import { AttachmentInput, Type, TypeSettingsInput } from '@/types';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { typeValidationSchema } from './unit-validation-schema';
import FileInput from '@/components/ui/file-input';
import Router from 'next/router';
import { Routes } from '@/config/routes';
import { Config } from '@/config';
import TextArea from '@/components/ui/text-area';
import { toast } from 'react-toastify';
import SelectInput from '../ui/select-input';
import { unitDrop } from './unit-icon';
import Label from '../ui/label';
import { AddingFunction, AddingVariationFunction, UpdatingUnitFunction } from '@/services/Service';
import { useState } from 'react';

type BannerInput = {
  title: string;
  description: string;
  image: AttachmentInput;
};

type FormValues = {
  actual_name?: string | null;
  short_name?: string | null;
  icon?: any;
  shortName: string | null;
  promotional_sliders: AttachmentInput[];
  banners: BannerInput[];
  settings: TypeSettingsInput;
  des: string | null;
  isDecimal: any;
};
const defaultValues = {
  image: [],
  actual_name: '',
  short_name: '',
  details: '',
  parent: '',
  icon: '',
  type: '',
  description: '',
  short_code: '',
};
type IProps = {
  initialValues?: Type | null;
};
export default function CreateOrUpdateTypeForm(initialValues: any) {
  const [creatingLoading, setCreatingLoading] = useState(false);

  const router = useRouter();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,

    formState: { errors },
  } = useForm<FormValues>({
    //@ts-ignore
    defaultValues: initialValues.initialValues
      ? {
          ...initialValues.initialValues,
        }
      : defaultValues,
  });

  const onSubmit = (values: FormValues) => {
    let formVal = {
      actual_name: values.actual_name,
      short_name: values.short_name,
      allow_decimal: values.isDecimal?.value,
    };
    if (initialValues.initialValues) {
      let ID = initialValues.initialValues.id;
      setCreatingLoading(true);
      UpdatingUnitFunction('/unit-update/', formVal, ID).then((result) => {
        if (result.success) {
          toast.success(t('common:successfully-created'));
          setCreatingLoading(false);
          router.back();
        } else {
          setCreatingLoading(false);
          toast.error(result.msg);
        }
      });
    } else {
      setCreatingLoading(true);

      AddingVariationFunction('/unit', formVal).then((result) => {
        if (result.success) {
          setCreatingLoading(false);

          toast.success(t('common:successfully-created'));
          router.back();
        } else {
          toast.error(t('Something Went Wrong'));
          setCreatingLoading(false);
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:item-description')}
          details={t('form:unit-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-name')}
            {...register('actual_name')}
            error={t(errors.actual_name?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:form-item-short-name')}
            {...register('short_name')}
            error={t(errors.short_name?.message!)}
            variant="outline"
            className="mb-5"
          />
          <div className="mb-5">
            <Label>{t('form:form-item-allow-decimal')}</Label>
            <SelectInput
              getOptionLabel={(option: any) => option.label}
              getOptionValue={(option: any) => option.value}
              name="isDecimal"
              control={control}
              options={unitDrop}
              isClearable={true}
            />
          </div>
        </Card>
      </div>

      <div className="mb-4 text-end">
        {initialValues.initialValues && (
          <Button
            variant="outline"
            onClick={router.back}
            className="me-4"
            type="button"
          >
            {t('form:button-label-back')}
          </Button>
        )}

        <Button loading={creatingLoading}>
          {initialValues.initialValues ? t('common:edit-unit') : t('common:add-unit')}
        </Button>
      </div>
    </form>
  );
}
