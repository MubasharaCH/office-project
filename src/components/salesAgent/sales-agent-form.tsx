import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import PasswordInput from '@/components/ui/password-input';
import { useForm, FormProvider } from 'react-hook-form';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { useRegisterMutation } from '@/data/user';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { Permission } from '@/types';
import Label from '../ui/label';
import { Switch } from '@headlessui/react';
import React from 'react';
import { AddingUserFunction, GetFunction } from '../../services/Service';
import Select from 'react-select';
import { selectStyles } from '../ui/select/select.styles';
import { toast } from 'react-toastify';
import {
  AddingFunction,
  UpdatingCustomerFunction,
  UpdateUserFunction,
} from '@/services/Service';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Loader from '../ui/loader/loader';
import TextArea from '../ui/text-area';

type FormValues = {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  contact_no: string;
  status: string;
  role_id: string;
  access_all_locations: string;
  password: string;
  allow_login: string;
  address: string;
  cmmsn_percent: string;
};

const defaultValues = {
  email: '',
  password: '',
};

export default function UserCreateForm(initialValues: any) {
  const [loader, setLoader] = React.useState<any>(false);

  React.useEffect(() => {}, []);

  const router = useRouter();
  const [creatingLoading, setCreatingLoading] = useState(false);
  const { t } = useTranslation();

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

  const onSubmit = (values: FormValues) => {
    let form: any = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      contact_no: values.contact_no,
      cmmsn_percent: values.cmmsn_percent,
      address: values.address,
    };

    let updateform: any = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      contact_no: values.contact_no,
      cmmsn_percent: values.cmmsn_percent,
      address: values.address,
    };

    if (initialValues.initialValues) {
      setCreatingLoading(true);
      UpdateUserFunction('/sales-commission-agent/'+initialValues?.initialValues?.id, updateform).then((result) => {
        if (result.success == true) {
          toast.success(t(result.msg));
          setCreatingLoading(false);
          router.back();
        } else {
          toast.error(result.message);
          setCreatingLoading(false);
        }
      });
    } else {
      setCreatingLoading(true);
      AddingUserFunction('/sales-commission-agent', form).then((result) => {
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

  if (loader) return <Loader text={t('common:text-loading')} />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:form-title-information')}
          details={t('form:add-your-information')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:first-name')}
            {...register('first_name')}
            type="text"
            variant="outline"
            className="mb-4"
          />

          <Input
            label={t('form:last-name')}
            {...register('last_name')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.last_name?.message!)}
          />
          <Input
            label={t('form:input-label-email')}
            {...register('email')}
            type="email"
            variant="outline"
            className="mb-4"
            error={t(errors.email?.message!)}
          />
          <Input
            label={t('form:input-label-phone')}
            {...register('contact_no')}
            type="number"
            variant="outline"
            className="mb-4"
          />
          <Input
            label={t('form:commission-percent')}
            {...register('cmmsn_percent')}
            type="number"
            variant="outline"
            className="mb-4"
          />
          <TextArea
            {...register('address')}
            label={t('form:address')}
            variant="outline"
            className="mb-4"
          />
        </Card>
      </div>

      <div className="mb-4 text-end">
        <Button loading={creatingLoading}>
          {initialValues.initialValues
            ? t('form:button-update-sale-agent')
            : t('form:button-add-sale-agent')}
        </Button>
      </div>
    </form>
  );
}
