import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useRouter } from 'next/router';
import { AttachmentInput, Type, TypeSettingsInput } from '@/types';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { typeValidationSchema } from './brand-validation-schema';
import FileInput from '@/components/ui/file-input';
import Router from 'next/router';
import { Routes } from '@/config/routes';
import { Config } from '@/config';
import TextArea from '@/components/ui/text-area';
import { toast } from 'react-toastify';
import {
  AddingFunction,
  DashboardGetFun,
  UpdatingFunction,
} from '../../services/Service';
import { useEffect, useState } from 'react';
import FormData from 'form-data';
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
  image: any;
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
  initialValues?: Type | null;
};
export default function CreateOrUpdateTypeForm(initialValues: any) {
  const [creatingLoading, setCreatingLoading] = useState(false);
  var form = new FormData();
  const router = useRouter();
  const { t } = useTranslation();
  const {
    register,
    control,
    handleSubmit,
    watch,
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
  const [path, setPath] = useState<string>();
  const [brandId, setBrandId] = useState<any>(null);
  const [isImage, setIsImage] = useState(false);

  useEffect(() => {
    if (initialValues?.initialValues) {
      setBrandId(initialValues?.initialValues.id);
      setPath(getValues('image'));
      if (getValues('image')) {
        setIsImage(true);
      }
    }
  }, [initialValues]);

  useEffect(() => {
    if (imageFile) {
      setPath(URL.createObjectURL(imageFile));
    }
  }, [imageFile]);
  const onSubmit = (values: FormValues) => {
    form.append('name', values.name);
    form.append('arabic_name', values.arabic_name);
    form.append('description', values.description);
    form.append('image', imageFile);

    /*  let formVal = {
      name: values.name,
      description: values.description,
    }; */
    if (initialValues.initialValues) {
      let ID = initialValues.initialValues.id;
      setCreatingLoading(true);
      UpdatingFunction('/brand-update/', form, ID).then((result) => {
        if (result.success) {
          toast.success(t('common:successfully-updated'));
          setCreatingLoading(false);

          router.back();
        } else {
          toast.error(t(result.msg));
          setCreatingLoading(false);
        }
      });
    } else {
      setCreatingLoading(true);

      AddingFunction('/brand', form).then((result) => {
        if (result.success) {
          toast.success(t('common:successfully-created'));
          setCreatingLoading(false);
          router.back();
        } else {
          toast.error(t(result.msg));
          setCreatingLoading(false);
        }
      });
    }
  };
  const onRemoveImageAddCase = () => {
    if (initialValues?.initialValues && isImage) {
      DashboardGetFun('/brand-image-delete/' + brandId).then((result) => {
        if (result.success == true) {
          setPath('');
          setImageFile('');
          toast.success(result.msg);
          setIsImage(false);
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
          // details={t('Add New Brand Description')}
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
          title={t('form:brand-image')}
          // details={t('Upload Brand Image')}
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
            ? t('form:form-title-update-brand')
            : t('common:add-brand')}
        </Button>
      </div>
    </form>
  );
}
