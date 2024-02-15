import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import PasswordInput from '@/components/ui/password-input';
import { useForm } from 'react-hook-form';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { useRegisterMutation } from '@/data/user';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { customerValidationSchema } from './user-validation-schema';
import { Permission } from '@/types';
import { toast } from 'react-toastify';
import { AddingFunction, UpdatingCustomerFunction, UpdatingFunction } from '@/services/Service';
import { useState } from 'react';
import { useRouter } from 'next/router';

type FormValues = {
  surename: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  role_id: string;
  access_all_locations: string;
  name: string;
  password: any;
};

const defaultValues = {
  email: '',
  password: '',
};


const CustomerCreateForm = (initialValues:any) => {
  const router = useRouter();
  const [creatingLoading, setCreatingLoading] = useState(false);
  const { t } = useTranslation();
  const { mutate: registerUser, isLoading: loading } = useRegisterMutation();

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
    let formVal = {
      surename: values.surename,
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      status: values.status,
      role_id: values.role_id,
      access_all_locations: values.access_all_locations
    };

    if (initialValues.initialValues) {
      let ID = initialValues.initialValues.id;
      setCreatingLoading(true);
      UpdatingCustomerFunction('/create-business-user/', formVal, ID).then((result) => {
        if (!result.exception) {
          toast.success(t('common:successfully-created'));
          setCreatingLoading(false);

          router.back();
        } else {
          toast.error("Something went Wrong");
          setCreatingLoading(false);
        }
      });
    } else {
      setCreatingLoading(true);

      AddingFunction('/create-business-user', formVal).then((result) => {
        if (result) {
          toast.success(t('common:successfully-created'));
          setCreatingLoading(false);
          router.back();
        } else {
          toast.error("Somethink went wrong");
          setCreatingLoading(false);
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:form-title-information')}
          details={t('form:customer-form-info-help-text')}
          className="sm:pe-4 md:pe-5 w-full px-0 pb-5 sm:w-4/12 sm:py-8 md:w-1/3"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-name')}
            {...register('name')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.name?.message!)}
          />
          <Input
            label={t('form:input-label-email')}
            {...register('email')}
            type="email"
            variant="outline"
            className="mb-4"
            error={t(errors.email?.message!)}
          />
          <PasswordInput
            label={t('form:input-label-password')}
            {...register('password')}
            error={t(errors.password?.message!)}
            variant="outline"
            className="mb-4"
          />
        </Card>
      </div>

      <div className="text-end mb-4">
        <Button loading={loading} disabled={loading}>
          {t('form:button-label-create-customer')}
        </Button>
      </div>
    </form>
  );
};

export default CustomerCreateForm;
