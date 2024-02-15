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
} from '@/services/Service';
import { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import Label from '@/components/ui/label';
import React from 'react';
import { selectStyles } from '@/components/ui/select/select.styles';
import Select from 'react-select';
import { RxCross1 } from 'react-icons/rx';
type BannerInput = {
  title: string;
  description: string;
  image: AttachmentInput;
};

type FormValues = {
  name?: string | null;
  slug?: string | null;
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
  slug: '',
  description: '',
};
type IProps = {
  initialValues?: Category | undefined;
};
export default function CreateOrUpdateTypeForm(initialValues: any) {
  const router = useRouter();
  const { t } = useTranslation();
  const [creatingLoading, setCreatingLoading] = useState(false);
  // const [value, setValue] = React.useState<any>(false);

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
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    //@ts-ignore

    defaultValues: initialValues.initialValues
      ? {
          ...initialValues.initialValues,
        }
      : defaultValues,
  });
  console.log(initialValues)


  const [imageFile, setImageFile] = useState<any>();
  const [path, setPath] = useState<string>('');


  useEffect(() => {
    if (initialValues?.initialValues) {
      setCategoryId(initialValues?.initialValues.id);
      if (initialValues?.image) {
        setIsImage(true);
      }
    }
    if (initialValues?.initialValues) {
      setValue('slug', initialValues?.initialValues?.slug);
      setValue('name', initialValues?.initialValues?.name);
      setValue('description', initialValues?.initialValues?.description);
      setPath(initialValues?.initialValues?.image || '');
    }
  }, [initialValues]);

  useEffect(() => {
    if (imageFile) {
      setPath(URL.createObjectURL(imageFile));
    }
  }, [imageFile]);

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
    form.append('slug', values.slug);
    values.description && form.append('description', values.description);
    form.append('image', imageFile);
    if (initialValues.initialValues) {
      let ID = initialValues.initialValues.id;
      setCreatingLoading(true);
      UpdatingFunction('/blog-category/', form, ID).then((result) => {
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
      AddingFunction('/blog-category', form).then((result) => {
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

  const handleNameInputChange = (event) => {
    if(Object.entries(initialValues).length === 0){
    const nameValue = event.target.value;
    const slugValue = nameValue.toLowerCase().replace(/\s+/g, '_');
    setValue('slug', slugValue);
    }
  };


  const onRemoveImageAddCase = () => {
    if (initialValues?.initialValues && isImage) {
      DashboardGetFun('/delete-blog-category-image/' + categoryId).then((result) => {
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
            onChange={handleNameInputChange}
            variant="outline"
            className="mb-5"
          
          />
          
          <Input
            label={t('form:input-label-slug')}
            {...register('slug')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
            disabled={Object.keys(initialValues).length > 0?true:false}
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
            ? t('form:button-label-update-blog-category')
            : t('form:button-label-add-blog-categories')}
        </Button>
      </div>
    </form>
  );
}
