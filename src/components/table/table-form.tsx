import AdminLayout from '@/components/layouts/admin';

import {
  GetFunction,
  GetFunctionBDetail,
  UpdateUserFunction,
  AddShipping,
  AddingFunction,
  AddingUserFunction,
  UpdateCustomFunction,
  UpdateFunction,
} from '@/services/Service';
import { adminOnly } from '@/utils/auth-utils';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Router, { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useState } from 'react';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import Button from '@/components/ui/button';
import { toast } from 'react-toastify';
import Label from '@/components/ui/label';
import Select from 'react-select';
import { Switch } from '@headlessui/react';
import Input from '@/components/ui/input';
import { selectStyles } from '@/components/ui/select/select.styles';
import TextArea from '../ui/text-area';
import { useForm } from 'react-hook-form';
import Loader from '../ui/loader/loader';

type FormValues = {
  name: string;
  description: string;
  no_person: string;
  location_id: string;
  max_capacity: string;
  min_capacity: string;
  priority: string;
  status: string;
};

const defaultValues = {
  name: '',
  description: '',
  no_person: '',
  location_id: '',
  max_capacity: '',
  min_capacity: '',
  priority: '',
  status: '',
};

export default function CreateOrUpdateTablleForm(initialValues: any) {
  const { t } = useTranslation();
  const [smsHandle, setSmsHandle] = useState(false);
  const [templateFor, setTemplateFor] = useState('');
  const [locationArray, setLocationArray] = useState([]);
  const [locationId, setLocationId] = useState('');
  const [creatingLoading, setCreatingLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [status, setStatus] = useState<any>(false);

  useEffect(() => {
    GetFunction('/business-location').then((result) => {
      let ordersData = result.data.map((data, i) => {
        return {
          key: i,
          id: data.id,
          value: data.name,
          label: data.name,
        };
      });
      setLocationArray(ordersData);
      setLoadingData(false);
      if (initialValues.initialValues) {
        setLocationId(initialValues.initialValues.id);
        // let s =initialValues.initialValues.status ==1?true
        setStatus(initialValues.initialValues.status);
      }
    });
  }, []);

  const onChangeStatus = (e: any) => {
    setStatus((status: any) => !status);
  };

  const selectedOption = locationArray?.find(
    (option: any) => option.id === initialValues?.initialValues?.location_id
  );
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    //@ts-ignore
    defaultValues: initialValues.initialValues
      ? {
          ...initialValues.initialValues,
        }
      : defaultValues,
  });
  const router = useRouter();

  const onChangeLocation = (e: any) => {
    setLocationId(e.id);
  };

  const onSubmit = (values: FormValues) => {
    if (values.name === '') {
      return toast.error('Please Add Name');
    }
    if (locationId === '') {
      return toast.error('Please Select Location');
    }
    let obj = {
      name: values.name,
      description: values.description,
      no_person: values.no_person,
      location_id: locationId,
      max_capacity: values.max_capacity,
      min_capacity: values.min_capacity,
      priority: values.priority,
      status: status,
    };

    if (initialValues.initialValues) {
      let ID = initialValues.initialValues.id;
      setCreatingLoading(true);
      UpdateFunction('/table/', obj, ID).then((result) => {
        if (result.success == true) {
          toast.success(t('Table updated successfully!'));
          setCreatingLoading(false);
          router.back();
        } else {
          toast.error(result.message);
          setCreatingLoading(false);
        }
      });
    } else {
      setCreatingLoading(true);
      AddingUserFunction('/table', obj).then((result) => {
        if (result.success == true) {
          toast.success(t('common:successfully-created'));
          setCreatingLoading(false);
          router.back();
        } else {
          toast.error(result.message);
          setCreatingLoading(false);
        }
      });
    }
  };

  if (loadingData) return <Loader text={t('common:text-loading')} />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('table')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mt-5">
            <Input
              label={t('form:input-label-name')}
              {...register('name')}
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
            <Input
              label={t('form:input-label-no-person')}
              {...register('no_person')}
              error={t(errors.no_person?.message!)}
              variant="outline"
              className="mb-5"
              type="number"
            />
            {/* <Input
              label={t('form:input-label-max-capacity')}
              {...register('max_capacity')}
              error={t(errors.max_capacity?.message!)}
              variant="outline"
              className="mb-5"
            />
            <Input
              label={t('form:input-label-min-capacity')}
              {...register('min_capacity')}
              error={t(errors.min_capacity?.message!)}
              variant="outline"
              className="mb-5"
            />
            <Input
              label={t('form:input-label-priority')}
              {...register('priority')}
              error={t(errors.priority?.message!)}
              variant="outline"
              className="mb-5"
            /> */}
            {/* <Input
              label={t('form:input-label-status')}
              {...register('status')}
              error={t(errors.status?.message!)}
              variant="outline"
              className="mb-5"
            /> */}
            <div className="flex justify-between">
              <Label>{t('form:input-label-status')}</Label>
              <Switch
                name="status"
                checked={status}
                onChange={onChangeStatus}
                value={status ? 'active' : 'inactive'}
                className={`${
                  status ? 'bg-accent' : 'bg-gray-300'
                } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
                dir="ltr"
              >
                <span className="sr-only">Enable </span>
                <span
                  className={`${
                    status ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
                />
              </Switch>
            </div>
          </div>
          <div className="mt-5">
            <Label>Location</Label>
            <div>
              <Select
                styles={selectStyles}
                options={locationArray}
                onChange={onChangeLocation}
                value={selectedOption}
              />
            </div>
          </div>
        </Card>
      </div>
      <div className="mb-4 text-end">
        <Button loading={creatingLoading}>
          {initialValues.initialValues ? t('Update Table') : t('Add Table')}
        </Button>
      </div>
    </form>
  );
}
