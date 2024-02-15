import AdminLayout from '@/components/layouts/admin';

import {
  GetFunction,
  GetFunctionBDetail,
  UpdateUserFunction,
  AddShipping,
  AddingFunction,
  AddingUserFunction,
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

type FormValues = {
  sender_id: string;
  template_for: string;
  sms_body: string;
  email_body: string;
  auto_send_sms: string;
};

const defaultValues = {
  sender_id: '',
  template_for: '',
  sms_body: '',
  email_body: '',
  auto_send_sms: '',
};

export default function CreateOrUpdateTypeForm(initialValues: any) {
  const { t } = useTranslation();
  const [smsHandle, setSmsHandle] = useState(false);
  const [templateFor, setTemplateFor] = useState('');
  const [creatingLoading, setCreatingLoading] = useState(false);
  const [SenderId, setSenderId] = useState<any>('');
  const [emailHandle, setEmailHandle] = useState(false);

  const handleSMS = () => {
    setSmsHandle(!smsHandle);
  };
  const handleEmail = () => {
    setEmailHandle(!emailHandle);
  };
  const TemplateFor = [
    {
      key: '1',
      label: 'Shipping Status',
      value: 'shipping_status',
    },
    {
      key: '1',
      label: 'Payment Status',
      value: 'payment_received',
    },
    {
      key: '1',
      label: 'New Sale',
      value: 'new_sale',
    },
  ];
  const selectedOption = TemplateFor.find(
    (option) => option.value === initialValues?.initialValues?.template_for
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

  useEffect(() => {
    let aa = initialValues?.initialValues?.auto_send_sms == 1 ? true : false;
    setSmsHandle(aa);
  }, []);

  const onChangeTemplateFor = (e: any) => {
    setTemplateFor(e.value);
  };

  const onSubmit = (values: FormValues) => {
    let obj = {
      template_for: templateFor,
      sms_body: values.sms_body,
      email_body: values.email_body,
      sender_id: router.query.sender_id,
      auto_send_sms: router.query.sms_handle,
      auto_send: router.query.email_handle,
    };

    if (initialValues.initialValues) {
      let ID = initialValues.initialValues.id;
      setCreatingLoading(true);

      AddingUserFunction('/sms-configuration/update/' + ID, obj).then(
        (result) => {
          if (result.success == true) {
            toast.success(t('Role updated successfully!'));
            setCreatingLoading(false);
            router.back();
          } else {
            toast.error(result.message);
            setCreatingLoading(false);
          }
        }
      );
    } else {
      setCreatingLoading(true);

      AddingUserFunction('/sms-configuration', obj).then((result) => {
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

  const onChangeSenderID = (e: any) => {
    setSenderId(e.target.value);
  };
  //   if (loadingData) return <Loader text={t('common:text-loading')} />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('Notificatoins')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mt-5">
            <Label>Template for</Label>
            <div>
              <Select
                styles={selectStyles}
                options={TemplateFor}
                onChange={onChangeTemplateFor}
                value={selectedOption}
              />
            </div>
            <div className="flex mt-5 justify-between w-full">
              <Label>SMS Notification</Label>
              <div className="ml-32">
                <Switch
                  checked={smsHandle}
                  onChange={handleSMS}
                  className={`${
                    smsHandle ? 'bg-accent' : 'bg-gray-300'
                  } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
                  dir="ltr"
                >
                  <span className="sr-only">Enable </span>
                  <span
                    className={`${
                      smsHandle ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
                  />
                </Switch>
              </div>
            </div>
            {smsHandle && (
              <div className="mt-3">
                <div className="flex justify-between w-full">
                  <Input
                    label="Sender Id"
                    name=""
                    value={SenderId}
                    onChange={onChangeSenderID}
                    className="w-full"
                  />
                </div>
                <div className="mt-3">
                  <TextArea {...register('sms_body')} label="SMS Body" />
                </div>
              </div>
            )}
            <div className="flex justify-between w-full mt-5">
              <Label>Email Notification</Label>
              <div className="ml-32">
                <Switch
                  checked={emailHandle}
                  onChange={handleEmail}
                  className={`${
                    emailHandle ? 'bg-accent' : 'bg-gray-300'
                  } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
                  dir="ltr"
                >
                  <span className="sr-only">Enable </span>
                  <span
                    className={`${
                      emailHandle ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
                  />
                </Switch>
              </div>
            </div>
            {emailHandle && (
              <div className="mt-3">
                <TextArea {...register('email_body')} label="Email Body" />
              </div>
            )}
          </div>
        </Card>
      </div>
      <div className="text-end mb-4">
        <Button loading={creatingLoading}>
          {initialValues.initialValues
            ? t('Update Notification')
            : t('Add Notification')}
        </Button>
      </div>
    </form>
  );
}
