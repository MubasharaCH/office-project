import Input from '@/components/ui/input';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import { Shipping, Tax, Settings } from '@/types';
import { Switch } from '@headlessui/react';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import Label from '@/components/ui/label';
import { useTranslation } from 'next-i18next';
import { getIcon } from '@/utils/get-icon';
import * as socialIcons from '@/components/icons/social';
import router, { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import React from 'react';
import dynamic from 'next/dynamic';
import { EditorProps } from 'react-draft-wysiwyg';
import { RiVisaLine } from 'react-icons/ri';
import Image from 'next/image';
import mada from '../../../public/image/mada.png';
import visa from '../../../public/image/visa.png';
import master from '../../../public/image/master.png';
import kent from '../../../public/image/knet.png';
import sadad from '../../../public/image/sadad.png';
import amarican from '../../../public/image/amrican.png';
import { AiOutlineBank } from 'react-icons/ai';
import { GrTransaction } from 'react-icons/gr';
import { AddShipping } from '@/services/Service';

export default function BusinessSettingsForm(initialValues: any) {
  const [status, setStatus] = useState<any>(
    initialValues?.data?.store_payment_methods?.cod
  );
  const [ignitePayment, setIgnitePayment] = useState<any>(
    initialValues?.data?.store_payment_methods?.ignitepay
  );
  const { t } = useTranslation();
  const { locale } = useRouter();

  const onChangeStatus = (e) => {
    setStatus((value: any) => !value);
    let form = {
      ignitepay: ignitePayment,
      cod: e,
    };
    AddShipping('/enable-payment-method', form).then((result) => {
      if (result.status) {
        toast.success(t(result.message));
      } else {
        toast.error(t(result.message));
      }
    });
  };
  const onChangeignitePayment = (e) => {
    setIgnitePayment((value: any) => !value);
    let form = {
      ignitepay: e,
      cod: status,
    };
    AddShipping('/enable-payment-method', form).then((result) => {
      if (result.status) {
        toast.success(t(result.message));
      } else {
        toast.error(t(result.message));
      }
    });
  };

  // @ts-ignore
  // @ts-ignore
  return (
    <form>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:label-cod')}
          details={t('form:enable-cod')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="flex justify-between">
            <span>{t('form:label-cod')}</span>
            <div className="mb-5">
              <Switch
                checked={status}
                className={`${
                  status ? 'bg-accent' : 'bg-gray-300'
                } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
                dir="ltr"
                name=""
                onChange={onChangeStatus}
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
          <span style={{ color: '#4B5563' }}>
            {t('form:cod-description')}
           
          </span>
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:ignite-pay')}
          details={t('form:ignite-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="flex justify-between">
            <span>{t('form:ignite-description')}</span>
            <div className="mb-5">
              <Switch
                checked={ignitePayment}
                className={`${
                  ignitePayment ? 'bg-accent' : 'bg-gray-300'
                } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
                dir="ltr"
                name=""
                onChange={onChangeignitePayment}
              >
                <span className="sr-only">Enable </span>
                <span
                  className={`${
                    ignitePayment ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
                />
              </Switch>
            </div>
          </div>

          <div className="mt-3 w-full flex">
            <div className="">
              <Image
                className="w-30 h-30 ml-3"
                width={40}
                height={25}
                src={master}
              />
            </div>
            <div className="ml-3">
              <Image
                className="w-30 h-30 ml-3"
                width={60}
                height={25}
                src={visa}
              />
            </div>
            <div className="ml-3">
              <Image
                className="w-30 h-30 ml-3"
                width={60}
                height={25}
                src={mada}
              />
            </div>
            <div className="ml-3">
              <Image
                className="w-30 h-30 ml-3"
                width={45}
                height={28}
                src={kent}
              />
            </div>
            <div className="ml-3">
              <Image
                className="w-30 h-30 ml-3"
                width={45}
                height={28}
                src={sadad}
              />
            </div>
            <div className="ml-3">
              <Image
                className="w-30 h-30 ml-3"
                width={50}
                height={40}
                src={amarican}
              />
            </div>
          </div>
        </Card>
        <Description
          title={t('')}
          details={t('')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="mt-5 w-full sm:w-8/12 md:w-2/3">
          <div className="flex" style={{ color: '#4B5563' }}>
            <AiOutlineBank
              color="black"
              className="h-5 w-5"
              width={20}
              height={20}
            />
            <span className="pl-2">{t('form:bank-payment')}</span>
          </div>
          <div className="flex mt-3" style={{ color: '#4B5563' }}>
            <span className="pl-7">{t('form:bank-payment-description')}</span>
          </div>
        </Card>
        <Description
          title={t('')}
          details={t('')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="mt-5 w-full sm:w-8/12 md:w-2/3">
          <div className="flex" style={{ color: '#4B5563' }}>
            <GrTransaction
              color="black"
              className="h-5 w-5"
              width={20}
              height={20}
            />
            <span className="pl-2">{t('form:transaction-rate')}</span>
          </div>
          <div
            className="flex mt-3 justify-between"
            style={{ color: '#4B5563' }}
          >
            <div className="pl-7">{t('form:credit-debit')}</div>
            <div className="">3% + {t('form:from-vat')}</div>
          </div>
        </Card>
      </div>
    </form>
  );
}
