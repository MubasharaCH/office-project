import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useRouter } from 'next/router';
import { AttachmentInput, Type, TypeSettingsInput } from '@/types';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import FileInput from '@/components/ui/file-input';
import Router from 'next/router';
import { Routes } from '@/config/routes';
import { Config } from '@/config';
import TextArea from '@/components/ui/text-area';
import { toast } from 'react-toastify';
import SelectInput from '../ui/select-input';
import Label from '../ui/label';
import { Chips } from 'primereact/chips';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { AddingFunction, AddingVariationFunction } from '@/services/Service';

type BannerInput = {
  title: string;
  description: string;
  image: AttachmentInput;
};
const defaultValues = {
  name: '',
};
type FormValues = {
  id?: any;
  name?: string | null;
  icon?: any;
  promotional_sliders: AttachmentInput[];
  banners: BannerInput[];
  settings: TypeSettingsInput;
  des: string | null;
};
const customChip = (item: any) => {
  return (
    <div>
      <span>{item} - (active) </span>
      <i className="pi pi-user-plus" style={{ fontSize: '14px' }}></i>
    </div>
  );
};
type IProps = {
  initialValues?: any;
};

export default function CreateOrUpdateTypeForm({ initialValues }: IProps) {
  const router = useRouter();
  const [values2, setValues2] = useState<any>([]);
  const [creatingLoading, setCreatingLoading] = useState(false);
  const [variantName, setName] = useState<any>();

  const { t } = useTranslation();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    //@ts-ignore
    defaultValues: initialValues
      ? {
          ...initialValues,
        }
      : defaultValues,
  });
  useEffect(() => {
    if (initialValues?.name) {
      setName(initialValues?.name);
    }
    if (Array.isArray(initialValues?.values)) {
      let locationData = initialValues.values.map((data, i) => {
        return data.name;
      });
      setValues2(locationData);
    }
  }, [initialValues]);

  const onChange = (e) => {
    setName(e.target.value);
  };
  const onSubmit = (values: FormValues) => {
    let formVal = {
      id: initialValues?.id,
      name: variantName,
      variation_values: values2,
    };

    setCreatingLoading(true);
    AddingVariationFunction('/variation/create', formVal).then((result) => {
      if (result.success) {
        setCreatingLoading(false);
        toast.success(t('common:successfully-created'));
        router.back();
      } else {
        setCreatingLoading(false);
        toast.error(t('Something Went Wrong'));
      }
    });
  };

  return (
    <>
      <Helmet>
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/primeicons/primeicons.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/primereact/resources/themes/lara-light-indigo/theme.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/primereact/resources/primereact.min.css"
        />
      </Helmet>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-5 flex flex-wrap sm:my-8">
          <Description
            title={t('form:item-description')}
            details={t('form:customer-form-info-help-tesst')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t('form:input-label-name')}
              {...register('name')}
              error={t(errors.name?.message!)}
              variant="outline"
              className="mb-5"
              value={variantName}
              onChange={onChange}
            />
            <Label>{t('common:variant-value')}</Label>
            <Chips
              addOnBlur={true}
              value={values2}
              onChange={(e) => setValues2(e.value)}
              separator=","
              width={700}
              className="chipscss"
              style={{
                border: '1px solid black',
              
               
              }}
            />
          </Card>
        </div>

        <div className="mb-4 text-end">
          {initialValues && (
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
            {initialValues
              ? t('common:update-variation')
              : t('common:add-variation')}
          </Button>
        </div>
      </form>
    </>
  );
}
