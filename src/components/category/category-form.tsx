import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useRouter } from 'next/router';
import { AttachmentInput, Category, Type, TypeSettingsInput } from '@/types';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { typeValidationSchema } from './category-validation-schema';
import FileInput from '@/components/ui/file-input';
import Router from 'next/router';
import { Routes } from '@/config/routes';
import { Config } from '@/config';
import TextArea from '@/components/ui/text-area';
import { toast } from 'react-toastify';
import FormData from 'form-data';
import {
  AddingFunction,
  DashboardGetFun,
  GetFunction,
  UpdatingFunction,
} from '../../services/Service';
import { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import Label from '../ui/label';
import React from 'react';
import { selectStyles } from '../ui/select/select.styles';
import Select from 'react-select';
import { RxCross1 } from 'react-icons/rx';
type BannerInput = {
  title: string;
  description: string;
  image: AttachmentInput;
};

type FormValues = {
  name?: string | null;
  arabic_name?: string | null;
  icon?: any;
  promotional_sliders: AttachmentInput[];
  banners: BannerInput[];
  settings: TypeSettingsInput;
  description: string | null;
  short_code: string | null;
  cat_image: any;
};
const defaultValues = {
  image: [],
  name: '',
  arabic_name: '',
  details: '',
  parent: '',
  icon: '',
  type: '',
  description: '',
  short_code: '',
};
type IProps = {
  initialValues?: Category | undefined;
};
export default function CreateOrUpdateTypeForm(initialValues: any) {
  const router = useRouter();
  const { t } = useTranslation();
  const [creatingLoading, setCreatingLoading] = useState(false);
  const [value, setValue] = React.useState<any>(false);
  const [CatDataArray, setCatDataArray] = React.useState<any[]>([]);
  const [catDropId, setcatDropId] = useState();
  const [categoryId, setCategoryId] = useState<any>(null);
  const [isImage, setIsImage] = useState(false);
  var form = new FormData();
  const [isStorefront, setIsStorefront] = React.useState<any>(true);

  const [packageDetail, setPackageDetail] = useState<any>({});

  useEffect(() => {
    const businessDetail = JSON.parse(
      localStorage.getItem('user_business_details')!
    );
    if (businessDetail) {
      setPackageDetail(businessDetail?.subscriptions[0]?.package_details);
    }
  }, []);

  const {
    register,
    handleSubmit,
    control,
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

  const [imageFile, setImageFile] = useState<any>();
  const [path, setPath] = useState<string>(getValues('cat_image'));

  useEffect(() => {
    if (initialValues?.initialValues) {
      setCategoryId(initialValues?.initialValues.id);
      if (getValues('cat_image')) {
        setIsImage(true);
      }
    }
    if (initialValues?.initialValues) {
      if (initialValues?.initialValues?.show_on_storefront == 1) {
        setIsStorefront(true);
      } else {
        setIsStorefront(false);
      }
    }
  }, [initialValues]);

  useEffect(() => {
    if (imageFile) {
      setPath(URL.createObjectURL(imageFile));
    }
  }, [imageFile]);

  React.useEffect(() => {
    GetFunction('/taxonomy').then((result) => {
      let ordersData = result.data.map((data, i) => {
        return {
          key: i,
          id: data.id,
          value: data.name,
          label: data.name,
        };
      });
      setCatDataArray(ordersData);
    });
    if (initialValues.initialValues?.parent_id) {
      setcatDropId(initialValues.initialValues?.parent_id);
      setValue(true);
    }
  }, []);
  const categoryDefaultArray = [
    {
      label: initialValues.initialValues?.category?.name,
    },
  ];

  const onChangeStorefront = (e: any) => {
    setIsStorefront(!isStorefront);
  };

  const onSubmit = (values: FormValues) => {
    form.append('name', values.name);
    form.append('arabic_name', values.arabic_name);
    values.description && form.append('description', values.description);
    values.short_code && form.append('short_code', values.short_code);
    form.append('cat_image', imageFile);
    form.append('parent_id', catDropId);
    form.append('show_on_storefront', isStorefront == true ? 1 : 0);
    form.append('add_as_sub_cat', initialValues?.initialValues?.id ? 1 : 0);

    if (initialValues.initialValues) {
      let ID = initialValues.initialValues.id;
      setCreatingLoading(true);
      UpdatingFunction('/category-update/', form, ID).then((result) => {
        if (result.success) {
          setCreatingLoading(false);

          toast.success(t('common:successfully-created'));

          router.back();
        } else {
          toast.error(result.msg);
          setCreatingLoading(false);
        }
      });
    } else {
      setCreatingLoading(true);
      AddingFunction('/taxonomy/create', form).then((result) => {
        if (result.success) {
          setCreatingLoading(false);

          toast.success(t('common:successfully-created'));
          router.back();
        } else {
          setCreatingLoading(false);

          toast.error(result.msg);
        }
      });
    }
  };
  const onChange = (e: any) => {
    if (packageDetail?.name.toLowerCase() === 'free package') {
      toast.error('Please update your subscription');
    } else {
      setValue((value: any) => !value);
    }
  };
  const catOnChange = (e) => {
    setcatDropId(e.id);
  };
  const onRemoveImageAddCase = () => {
    if (initialValues?.initialValues && isImage) {
      DashboardGetFun('/category-image-delete/' + categoryId).then((result) => {
        if (result.success == true) {
          setPath('');
          setImageFile('');
          setIsImage(false);
          toast.success(result.msg);
        } else {
          toast.error(result.msg);
        }
      });
    } else {
      setPath('');
      setImageFile('');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:item-description')}
          details={t('form:category-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-name')}
            {...register('name')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-alter-name')}
            {...register('arabic_name')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-category-code')}
            {...register('short_code')}
            variant="outline"
            className="mb-5"
          />
          <TextArea
            label={t('form:input-description')}
            {...register('description')}
            error={t(errors.description?.message!)}
            variant="outline"
            className="mb-5"
          />
        </Card>
      </div>

      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:input-label-sub-category')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-5">
            <Label>{t('form:input-label-add-sub-category')}</Label>
            <Switch
              checked={value}
              onChange={onChange}
              className={`${
                value ? 'bg-accent' : 'bg-gray-300'
              } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
              dir="ltr"
            >
              <span className="sr-only">Enable </span>
              <span
                className={`${
                  value ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
              />
            </Switch>
          </div>
          {value && (
            <div className="mb-3">
              <Label>{t('form:input-label-category')}</Label>
              <Select
                getOptionLabel={(option: any) => option.label}
                getOptionValue={(option: any) => option.id}
                styles={selectStyles}
                options={CatDataArray}
                defaultValue={categoryDefaultArray}
                onChange={catOnChange}
              />
            </div>
          )}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:form-label-storefront')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-5">
            <Label>{t('form:form-label-storefront')}</Label>
            <Switch
              checked={isStorefront}
              // {...register('show_in_market_place')}
              onChange={onChangeStorefront}
              className={`${
                isStorefront ? 'bg-accent' : 'bg-gray-300'
              } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
              dir="ltr"
            >
              <span className="sr-only">Enable </span>
              <span
                className={`${
                  isStorefront ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
              />
            </Switch>
          </div>
        </Card>
      </div>

      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:input-label-category-image')}
          details={t('form:upload-category-image')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput
            name="promotional_sliders"
            control={control}
            setImageFile={setImageFile}
            multiple={false}
          />
          {path && (
            <div className="flex flex-row mt-1">
              <span className="w-fit">
                <img
                  style={{ width: '50px', height: '50px', marginTop: '1rem' }}
                  src={path}
                  alt="cate-image"
                  className="object-contain"
                />
              </span>

              <div className="bg-slate-200 rounded-full h-5 p-1">
                <RxCross1
                  onClick={onRemoveImageAddCase}
                  className="w-3 h-3 justify-end flex cursor-pointer"
                />
              </div>
            </div>
          )}
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
          {initialValues.initialValues
            ? t('form:button-label-update-category')
            : t('form:button-label-add-categories')}
        </Button>
      </div>
    </form>
  );
}
