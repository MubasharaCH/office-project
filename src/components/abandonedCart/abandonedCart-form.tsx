import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
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
import {
  AddingCouponsFunction,
  AddingFunction,
  UpdateAlertFunction,
  UpdatingCouponFunction,
  UpdatingFunction,
} from '@/services/Service';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Switch } from '@headlessui/react';
import Label from '../ui/label';
import TextArea from '../ui/text-area';
import React from 'react';

type FormValues = {
  name?: string | null;
  message?: string | null;
  sending_time?: string | null;
  email_alert?: string | null;
  text_alert?: string | null;
};
const defaultValues = {
  name: '',
  message: '',
  sending_time: '',
  email_alert: '',
  text_alert: '',
};
type IProps = {
  initialValues?: Type | null;
};
export default function CreateOrUpdateTypeForm(initialValues: any) {
  const [creatingLoading, setCreatingLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();
  const [showCalander, setShowCalander] = useState(false);
  const [Dates, setDate] = useState<any>();
  const [emailAlert, setEmailAlert] = useState<any>(false);
  const [msgAlert, setMsgAlert] = useState<any>(false);
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

  React.useEffect(()=>{
    setEmailAlert(initialValues?.initialValues?.email_alert)
    setMsgAlert(initialValues?.initialValues?.text_alert)
  },[])

  const onSubmit = (values: FormValues) => {
    let ID = initialValues?.initialValues?.id;

    let form = {
      name: values.name,
      message: values.message,
      sending_time: values.sending_time,
      email_alert: emailAlert,
      text_alert: msgAlert,
    };
    let UpdateForm = {
      id: ID,
      name: values.name,
      message: values.message,
      sending_time: values.sending_time,
      email_alert: emailAlert,
      text_alert: msgAlert,
    };
    if (initialValues.initialValues) {
      setCreatingLoading(true);
      UpdateAlertFunction('/alert/' + ID, UpdateForm).then((result) => {
        if (result.success) {
          toast.success(t('common:successfully-created'));
          setCreatingLoading(false);
          router.back();
        } else {
          toast.error('Something Went Wrong');
          setCreatingLoading(false);
        }
      });
    } else {
      setCreatingLoading(true);
      AddingCouponsFunction('/alert', form).then((result) => {
        if (result.success) {
          toast.success(t('common:successfully-created'));
          setCreatingLoading(false);
          router.back();
        } else {
          toast.error('Something Went Wrong');
          setCreatingLoading(false);
        }
      });
    }
  };

  const onChangeEmailAlert = (value) => {
    setEmailAlert((value: any) => !value);
  };
  const onChangeMsgAlert = (value) => {
    setMsgAlert((value: any) => !value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('common:desccription')}
          // details={t('Add New Description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:alert-name')}
            {...register('name')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:sending-time')}
            {...register('sending_time')}
            error={t(errors.sending_time?.message!)}
            variant="outline"
            type="number"
            className="mb-5"
          />
          <TextArea
            label={t('form:message-text')}
            {...register('message')}
            error={t(errors.message?.message!)}
            variant="outline"
            className="mb-5"
          />
          <div>
            <Label>{t('form:email-alert')}</Label>
            <Switch
              checked={emailAlert}
              {...register('email_alert')}
              onChange={onChangeEmailAlert}
              className={`${
                emailAlert ? 'bg-accent' : 'bg-gray-300'
              } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
              dir="ltr"
            >
              <span className="sr-only">Enable </span>
              <span
                className={`${
                  emailAlert ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
              />
            </Switch>
          </div>
          <div className="pt-4">
            <Label>{t('form:message-alert')}</Label>
            <Switch
              checked={msgAlert}
              {...register('text_alert')}
              onChange={onChangeMsgAlert}
              className={`${
                msgAlert ? 'bg-accent' : 'bg-gray-300'
              } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
              dir="ltr"
            >
              <span className="sr-only">Enable </span>
              <span
                className={`${
                  msgAlert ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
              />
            </Switch>
          </div>
        </Card>
      </div>

      <div className="mb-4 text-end">
        <Button loading={creatingLoading}>
          {initialValues.initialValues ? t('form:button-update-alert') : t('form:button-add-alert')}
        </Button>
      </div>
    </form>
  );
}
