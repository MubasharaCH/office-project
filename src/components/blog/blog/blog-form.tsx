import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import Label from '@/components/ui/label';
import Select, { createFilter } from 'react-select';
import { selectStyles } from '@/components/ui/select/select.styles';
import { useRouter } from 'next/router';
import { AttachmentInput, Type, TypeSettingsInput } from '@/types';
import { useTranslation } from 'next-i18next';
import Router from 'next/router';
import { Routes } from '@/config/routes';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import FormData from 'form-data';
import moment from 'moment';
import { Calendar } from 'react-date-range';
import FileInput from '@/components/ui/file-input';
import { Switch } from '@headlessui/react';
import {
  AddingCouponsFunction,
  AddingFunction,
  UpdatingCouponFunction,
  UpdatingFunction,
  GetFunction,
  DashboardGetFun,
} from '@/services/Service';

import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import TextArea from '@/components/ui/text-area';
import { RxCross1 } from 'react-icons/rx';
type FormValues = {
  name?: string | null;
  slug?: string | null;
  blog_category_id?: any;
  author: string | null;
  datetime: string | null;
  is_featured: string | null;
  description: string | null;
  blog_image: string | null;
  blog_thumbnail: string | any;
};
const defaultValues = {
  name: '',
  slug: '',
  description: '',
  author: '',
  blog_category_id: '',
  datetime: '',
  is_featured: false,
  blog_image: '',
  blog_thumbnail: '',
};
type IProps = {
  initialValues?: Type | null;
};
export default function CreateOrUpdateTypeForm(initialValues: any) {
  const {
    register,
    control,
    handleSubmit,
    watch,
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
  const [creatingLoading, setCreatingLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();
  const [showCalander, setShowCalander] = useState(false);
  const [showCalanderEnd, setShowCalanderEnd] = useState(false);
  const [Dates, setDate] = useState<any>();
  const [isImage, setIsImage] = useState(false);
  const [isImage1, setIsImage1] = useState(false);
  const [imageFile, setImageFile] = useState<any>();
  const [imageFile1, setImageFile1] = useState<any>();

  const [path, setPath] = useState<string>('');
  const [path1, setPath1] = useState<string>('');
  const [is_featured, setIsFeatured] = useState<any>(
    initialValues?.data?.is_featured || false
  );

  const [valueType, setValueType] = useState<any>([]);
  const [selectedValueType, setSelectedValueType] = useState<any>([]);
  const [blogId, setBlogId] = useState<any>(null);
  useEffect(() => {
    setPath(getValues('blog_image') || '');
    setPath1(getValues('blog_thumbnail') || '');
  }, [getValues]);


  useEffect(() => {
    GetFunction('/blog-categories').then((result) => {
      if (result.success) {
        const data = result?.data?.map((item, i) => ({
          key: i,
          id: item?.id,
          value: item?.name,
          label: item?.name,
        }));
        if (initialValues?.initialValues?.blog_category_id) {
          const CategoryData = data?.filter(
            (item) => item.id === initialValues?.initialValues?.blog_category_id
          );
          setSelectedValueType(CategoryData[0]);
        }else{
          setSelectedValueType(data[0])
        }
        setValueType(data);
      }
    });
  }, []);

  useEffect(() => {
    if (imageFile) {
      setPath(URL.createObjectURL(imageFile));
    }
  }, [imageFile]);
  useEffect(() => {
    if (imageFile1) {
      setPath1(URL.createObjectURL(imageFile1));
    }
  }, [imageFile1]);



  const onRemoveImageAddCase = () => {
    if (initialValues?.initialValues && isImage) {
      DashboardGetFun('/delete-blog-image/' + blogId).then((result) => {
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
  const onRemoveImageAddCase1 = () => {
    if (initialValues?.initialValues && isImage1) {
      DashboardGetFun('/delete-blog-thumbnail/' + blogId).then((result) => {
        if (result.success == true) {
          setPath1('');
          setImageFile1('');
          setIsImage1(false);
          toast.success(result.msg);
        } else {
          toast.error(result.msg);
        }
      });
    } else {
      setPath1('');
      setImageFile1('');
    }
  };

  var form = new FormData();
  let currentDate = moment(new Date()).format('YYYY-MM-DD');
  useEffect(() => {
    if (initialValues?.initialValues) {
      setDate(initialValues?.initialValues?.datetime);
    }
  }, [initialValues.initialValues]);

  useEffect(() => {
    if (initialValues?.initialValues) {
      setBlogId(initialValues?.initialValues.id);
      if (getValues('blog_image')) {
        setIsImage(true);
      }
      if (getValues('blog_thumbnail')) {
        setIsImage1(true);
      }
    }
    if (initialValues?.initialValues) {
      setValue('slug', initialValues?.initialValues?.slug);
      setValue('name', initialValues?.initialValues?.name);
      setValue('description', initialValues?.initialValues?.description);
      setIsFeatured(
        initialValues?.initialValues?.is_featured == 1 ? true : false
      );
    }
  }, [initialValues]);

  const onChangeEnableIsFeatured = (e: any) => {
    setIsFeatured((value: any) => !value);
  };
  const handleNameInputChange = (event) => {
    if (Object.entries(initialValues).length === 0) {
      const nameValue = event.target.value;
      const slugValue = nameValue.toLowerCase().replace(/\s+/g, '_');
      setValue('slug', slugValue);
    }
  };

  const onSubmit = (values: FormValues) => {
    form.append('name', values.name);
    form.append('slug', values.slug);
    values.description && form.append('description', values.description);
   if( values.name && selectedValueType)

    form.append('blog_category_id', selectedValueType.id);
    values.author && form.append('author', values.author);
    form.append('datetime', Dates);
    form.append('is_featured', is_featured == true ? 1 : 0);
    form.append('blog_image', imageFile);
    form.append('blog_thumbnail', imageFile1);

    if (initialValues.initialValues) {
      let ID = initialValues.initialValues.id;
      setCreatingLoading(true);
      UpdatingFunction('/blog/', form, ID).then((result) => {
        if (result.success) {
          setCreatingLoading(false);

          toast.success(t('common:successfully-created'));

          router.back();
        } else {
          toast.error(result.message);
          setCreatingLoading(false);
        }
      });
    } else {
      setCreatingLoading(true);
      AddingFunction('/blog', form).then((result) => {
        if (result.success) {
          setCreatingLoading(false);

          toast.success(t('common:successfully-created'));
          router.back();
        } else {
          setCreatingLoading(false);
          toast.error(result.message);
        }
      });
    }
  };

  const OnChangeValueType = (e) => {
    setSelectedValueType(e);
  };

  const onhowCalannder = () => {
    setShowCalander(!showCalander);
  };

  const handleSelect = (date) => {
    let dates = moment(date).format('YYYY-MM-DD');
    setDate(dates);
    setShowCalander(!showCalander);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('common:desccription')}
          // details={t('common:add-new-blog')}
          details={initialValues.initialValues
            ? t('common:edit-exist-blog')
            : t('common:add-new-blog')}
          
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
            disabled={Object.keys(initialValues).length > 0 ? true : false}
          />

          <TextArea
            label={t('form:input-description')}
            {...register('description')}
            error={t(errors.description?.message!)}
            variant="outline"
            className="mb-5"
          />

          <Input
            label={t('common:Auther')}
            {...register('author')}
            error={t(errors.author?.message!)}
            variant="outline"
            className="mb-5"
          />

          <div className="mb-5 w-full ">
            <div onClick={onhowCalannder}>
              <Input
                // {...register('date')}
                label={t('form:form-item-date-time')}
                name="datetime"
                variant="outline"
                value={Dates}
              />
            </div>
            {showCalander && (
              <div style={{ zIndex: 999 }}>
                <Calendar
                  color="bg-accent"
                  date={new Date()}
                  onChange={handleSelect}
                />
              </div>
            )}
          </div>

          <div className="mb-5 w-full ">
            <Label>{t('form:form-item-select-category')}</Label>
            <Select
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.key}
              options={valueType}
              value={selectedValueType} // Set the default value
              onChange={OnChangeValueType}
            />
          </div>
        </Card>
      </div>

      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('Enable Feature')}
          details={t('Enable feature option')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="flex justify-between">
            {/* <div className="flex justify-between"> */}
            <Label>{t('common:online-enable-featured')}</Label>
            <div className="mb-5">
              <Switch
                checked={is_featured}
                className={`${
                  is_featured ? 'bg-accent' : 'bg-gray-300'
                } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
                dir="ltr"
                name=""
                onChange={onChangeEnableIsFeatured}
              >
                <span className="sr-only">Enable </span>
                <span
                  className={`${
                    is_featured ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
                />
              </Switch>
            </div>
          </div>
        </Card>
      </div>

      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:input-label-blog-image')}
          details={t('form:upload-Blog-image')}
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
            <div className="mt-1 flex flex-row">
              <span className="w-fit">
                <img
                  style={{ width: '50px', height: '50px', marginTop: '1rem' }}
                  src={path}
                  alt="cate-image"
                  className="object-contain"
                />
              </span>

              <div className="h-5 rounded-full bg-slate-200 p-1">
                <RxCross1
                  onClick={onRemoveImageAddCase}
                  className="flex h-3 w-3 cursor-pointer justify-end"
                />
              </div>
            </div>
          )}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:input-label-blog-thumbnail')}
          details={t('form:upload-Blog-thumbnail-image')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput
            name="promotional_sliders"
            control={control}
            setImageFile={setImageFile1}
            multiple={false}
          />
          {path1 && (
            <div className="mt-1 flex flex-row">
              <span className="w-fit">
                <img
                  style={{ width: '50px', height: '50px', marginTop: '1rem' }}
                  src={path1}
                  alt="cate-image"
                  className="object-contain"
                />
              </span>

              <div className="h-5 rounded-full bg-slate-200 p-1">
                <RxCross1
                  onClick={onRemoveImageAddCase1}
                  className="flex h-3 w-3 cursor-pointer justify-end"
                />
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className="mb-4 text-end">
        <Button loading={creatingLoading}>
          {initialValues.initialValues
            ? t('common:button-label-update-blog')
            : t('common:button-label-add-blog')}
        </Button>
      </div>
    </form>
  );
}
