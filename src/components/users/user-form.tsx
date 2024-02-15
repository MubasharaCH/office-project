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
};

const defaultValues = {
  email: '',
  password: '',
};

export default function UserCreateForm(initialValues: any) {
  const [value, setValue] = React.useState<any>(false);
  const [loader, setLoader] = React.useState<any>(false);
  const [status, setStatus] = React.useState<any>(true);
  const [RoleDataArray, setRoleDataArray] = React.useState<any[]>([]);
  const [roleDropId, setRoleDropId] = useState<any>();
  const [locationDropId, setLocationDropId] = useState<any>([]);
  const [LocationDataArray, setLocationDataArray] = useState<any>([]);

  React.useEffect(() => {
    setLoader(true);
    GetFunction('/get-roles').then((result) => {
      let dataa = result.data;
      let keys = Object.keys(dataa);
      let ordersData = keys.map((data, i) => {
        return {
          key: data,
          id: data,
          value: data,
          label: dataa[data],
        };
      });
      setRoleDataArray(ordersData);
    });
    GetFunction('/business-location').then((result) => {
      let ordersData = result.data.map((data, i) => {
        return {
          key: i,
          id: data.id,
          value: data.name,
          label: data.name,
        };
      });
      setLocationDataArray(ordersData);

      const aaa = initialValues.initialValues?.all_permissions.filter((item) =>
        item.startsWith('location.')
      );
      const indexes = aaa?.map((item) => item.split('.')[1]);

      const matchedObjects: any = [];

      for (let i = 0; i < ordersData.length; i++) {
        const id = ordersData[i].id.toString();
        if (indexes?.includes(id)) {
          matchedObjects.push(ordersData[i]);
        }
      }
      setLocationDropId(matchedObjects);

      setLoader(false);
    });
    if (initialValues.initialValues?.status == 'active') {
      setStatus((status: any) => true);
    } else {
      setStatus((status: any) => false);
    }
    if (initialValues.initialValues?.allow_login == '1') {
      setValue(true);
    } else {
      setValue(false);
    }

    // let aaaa = [
    //   "location.1118",
    //   "location.1112",
    //   "location.1113",
    // ]
  }, []);

  const roleDefaultArray = [
    {
      label: initialValues.initialValues?.role_id.split('#')[0],
    },
  ];
  const locationDefaultArray = [
    {
      label: initialValues.initialValues?.all_permissions[0],
    },
  ];

  const onChange = (e: any) => {
    setValue((value: any) => !value);
  };

  const onChangeStatus = (e: any) => {
    setStatus((status: any) => !status);
  };

  const RoleOnChange = (e) => {
    setRoleDropId(e.id);
  };

  const LocationOnChange = (e) => {
    setLocationDropId(e);
  };

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
    const paymentDetails = locationDropId.map((res) => {
      return `location.${res.id}`;
    });

    let form: any = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      contact_no: values.contact_no,
      status: status ? 'active' : 'inactive',
      role_id: roleDropId ? roleDropId : '',
      allow_login: value ? '1' : '0',
    };

    if (paymentDetails.length == 0) {
      form.access_all_locations = 'access_all_locations';
    } else {
      form.location_permissions = paymentDetails;
    }

    let updateform: any = {
      user_id: initialValues?.initialValues?.id,
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      contact_no: values.contact_no,
      status: status ? 'active' : 'inactive',
      role_id: roleDropId ? roleDropId : '',
      allow_login: value ? '1' : '0',
    };

    if (paymentDetails.length == 0) {
      updateform.access_all_locations = 'access_all_locations';
    } else {
      updateform.location_permissions = paymentDetails;
    }

    if (initialValues.initialValues) {
      setCreatingLoading(true);
      UpdateUserFunction('/update-business-user', updateform).then((result) => {
        if (result.success == true) {
          toast.success(t(result.message));
          setCreatingLoading(false);
          router.back();
        } else {
          toast.error(result.message);
          setCreatingLoading(false);
        }
      });
    } else {
      setCreatingLoading(true);
      AddingUserFunction('/create-business-user', form).then((result) => {
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
          details={t('form:customer-form-info-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-Fname')}
            {...register('first_name')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.last_name?.message!)}
          />

          <Input
            label={t('form:input-label-Lname')}
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
          <Label>{t('form:is-active')}?</Label>
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
        </Card>
      </div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:form-title-information')}
          details={t('form:customer-form-info-help-test')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-5">
            <Label>{t('form:allow-login')}</Label>
            <Switch
              name="allow_login"
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
          {/* {value && (
            <div>
              <Input
                label={t('form:username')}
                {...register('username')}
                type="text"
                variant="outline"
                className="input-group mb-4"
                error={t(errors.email?.message!)}
              />
              <PasswordInput
                label={t('form:password')}
                {...register('password')}
                error={t(errors.password?.message!)}
                variant="outline"
                className="mb-4"
              />
            </div>
          )} */}
          <div className="mb-3">
            <Label>{t('common:role')}</Label>
            <Select
              name="role_id"
              getOptionLabel={(option: any) => option.label}
              getOptionValue={(option: any) => option.id}
              styles={selectStyles}
              defaultValue={roleDefaultArray}
              options={RoleDataArray}
              onChange={RoleOnChange}
            />
          </div>
          <div className="mb-3">
            <Label>{t('form:input-label-location')}</Label>
            <Select
              name="role_id"
              getOptionLabel={(option: any) => option.label}
              getOptionValue={(option: any) => option.id}
              styles={selectStyles}
              defaultValue={locationDropId}
              options={LocationDataArray}
              onChange={LocationOnChange}
              isMulti
            />
          </div>
        </Card>
      </div>

      <div className="mb-4 text-end">
        <Button loading={creatingLoading}>
          {initialValues.initialValues
            ? t('common:update-user')
            : t('common:add-user')}
        </Button>
      </div>
    </form>
  );
}
