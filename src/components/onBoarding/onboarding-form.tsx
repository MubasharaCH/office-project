import Input from '@/components/ui/input';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Select from 'react-select';
import {
  ContactDetailsInput,
  Shipping,
  ShopSocialInput,
  Tax,
  AttachmentInput,
  Settings,
} from '@/types';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useTranslation } from 'next-i18next';
import router, { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { AddingFunction, UpdatingStoreSetting,UpdateUserFunction,GetFunctionBDetail } from '@/services/Service';
import { toast } from 'react-toastify';
import React from 'react';
import { convertToHTML } from 'draft-convert';
import { convertFromHTML, EditorState } from 'draft-js';
import dynamic from 'next/dynamic';
import { ContentState, convertToRaw } from 'draft-js';
import { EditorProps } from 'react-draft-wysiwyg';
import facebookPixel from '../../../public/image/facebook-pixel.png';
import googleAnalytic from '../../../public/image/google-analytic.png';
import freshChat from '../../../public/image/freshChat.jpg';
import hotjar from '../../../public/image/hotjar.png';
import intercom from '../../../public/image/intercom.png';
import liveChat from '../../../public/image/liveChat.png';
import tawk from '../../../public/image/tawk.png';
import tidio from '../../../public/image/tidio.png';
import trengo from '../../../public/image/trengo.png';
import zendesk from '../../../public/image/zendesk.jpg';
import drift from '../../../public/image/drift.png';
import adroll from '../../../public/image/adroll.png';
import amaze from '../../../public/image/amaze.png';
import tabbyImg from '../../../public/image/tabby.svg';
import clarity from '../../../public/image/clarity.png';
// install @types/draft-js @types/react-draft-wysiwyg and @types/draft-js @types/react-draft-wysiwyg for types

const Editor = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
);
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Image from 'next/image';
import Label from '../ui/label';
import { Switch } from '@headlessui/react';
import { selectStyles } from '../ui/select/select.styles';
import { Routes } from '@/config/routes';

type FormValues = {
  csr_type: any;
  otp: any;
  commonName: any;
  CountryCode: any;
  District: any;
  BuildingNumber: any;
  ZipCode: any;
  CountrySubEntity: any;
  CountryIso2: any;
  City: any;
  serialNumber: any;
  organizationVat: any;
  organizationUnit: any;
  organizationName: any;
  countryName: any;
  invoiceType: any;
  businessCategory: any;
  location: any;
};

type IProps = {
  settings?: Settings | null;
  taxClasses: Tax[] | undefined | null;
  shippingClasses: Shipping[] | undefined | null;
};
const defaultValues = {
  csr_type: '',
  otp: '',
  commonName: '',
  serialNumber: '',
  organizationVat: '',
  organizationUnit: '',
  organizationName: '',
  countryName: '',
  invoiceType: '',
  businessCategory: '',
  location: '',
};


export default function IgnitePlugin(initialValues: any,locationID :any) {
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
    defaultValues: initialValues.data
      ? {
          ...initialValues.data,
        }
      : defaultValues,
  });
  const { query, locale } = useRouter();
  let form = new FormData();
  const { t } = useTranslation();
  const [creatingLoading, setCreatingLoading] = useState(false);
  const [eInvoicing, seteInvoicing] = useState(false);
  const [csrExist, setCsr] = useState(false);
  const [eInvoiceSetting, setEInvoiceSetting] = useState<any>({});
  const [documentType, setDocumentType] = useState<any>('');
  const location_id:any = query?.id;

  useEffect(() => {}, [initialValues]);
  // const[customScript,setCustomScript]=useState<any>()
  const onChangeMsgAlert = (value) => {
    seteInvoicing((value: any) => !value);
  };
  let TypeArray = [
    { label: '1000 (B2B)', key: '1000' },
    { label: '0100 (B2C)', key: '0100' },
    { label: '1100 (Both)', key: '1100' },
  ];
  const OnChangeDocumentType = (e) => {
    setDocumentType(e.key);
  };
  const handleInvoiceSetting = (event, index) => {
    // if (index == 'zipcode' || index == 'tin_no' || index == 'city') {
    //   index == 'zipcode' ? setZipCode(event.target.value) : '';
    //   index == 'tin_no' ? setTinNo(event.target.value) : '';
    //   index == 'city' ? setCity(event.target.value) : '';
    //   return;
    // }
    setEInvoiceSetting({});
    let invoiceSetting = { ...eInvoiceSetting };
    invoiceSetting[index] =
      index == 'location_id' ? event.id : event.target.value;
    var location_id = index == 'location_id' ? event.id : event.target.value;
    setEInvoiceSetting(invoiceSetting);
    // if (index == 'location_id') {
    //   fetchEinvoiceSetting(location_id);
    // }
  };
  const onSubmit = (values: FormValues) => {
    let form = {
      csr_type: 'developer',
      otp: values.otp,
      commonName: values.commonName,
      serialNumber: values.serialNumber,
      organizationVat: values.organizationVat,
      organizationUnit: values.organizationUnit,
      organizationName: values.organizationName,
      countryName: values.countryName,
      invoiceType: documentType,
      businessCategory: values.businessCategory,
      address: values.location,
      enable_einvoice:eInvoicing,
      einvoice_settings: eInvoiceSetting,
      location_id:location_id
    };
    setCreatingLoading(true);
   
    UpdateUserFunction('/onboarding/csrRequest', form).then((result) => {
      if (result.status == true) {
        toast.success(t('common:successfully-created'));
        setCreatingLoading(false);
        setTimeout(() => {
          router.back();
        }, 1000);
      } else {
        if (typeof result.message === 'string') {
          toast.error(t(result.message));
        } else if (typeof result.message === 'object') {
          // Handle object messages, e.g., display specific fields of the object
          // or iterate through the object and display each error.
          // Example:
          for (const key in result.message) {
            toast.error(t(result.message[key]));
          }
        } else {
          toast.error(t('common:unknown-error'));
        }
        setCreatingLoading(false);
      }
      
    });
  };
  let token: any = localStorage.getItem('user_token');
//   useEffect(() => {
//   GetFunctionBDetail('/business-details', token)
//   .then((result) => {
//     if (result?.data?.enabled_modules) {
//       const isInvoicingEnabled = result?.data?.enabled_modules?.some(
//         (value) => value === 'enable_einvoice'
//       );
//       seteInvoicing(isInvoicingEnabled);
//     }
//     if(result.data.csr){
//       setCsr(true); 
//     }
//   })
//   .catch((error) => {
//     console.error(error);
//     // setLoadingData(false);
//   });
// }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('onBoarding')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid gap-4 mb-2">
            <Label>{t('Enable e-invoicing')}</Label>
            <Switch
              checked={eInvoicing}
              onChange={onChangeMsgAlert}
              className={`${
                eInvoicing ? 'bg-accent' : 'bg-gray-300'
              } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
              dir="ltr"
            >
              <span className="sr-only">Enable </span>
              <span
                className={`${
                  eInvoicing ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
              />
            </Switch>
          </div>
          {eInvoicing &&  (
            <>
              <div className="grid gap-4 mb-2 mt-4">
                <Input {...register('otp')} label="OTP" name="otp" />
              </div>
              <div className="grid gap-4 mb-2 mt-3">
                <Input
                  {...register('commonName')}
                  label="Common Name"
                  name="commonName"
                />
              </div>
              <div className="grid gap-4 mb-2 mt-3">
                <Input
                  {...register('CountryCode')}
                  onChange={(e) => handleInvoiceSetting(e, 'country_code')}
                  label="Country Code"
                  name="Country Code"
                />
              </div>
              <div className="grid gap-4 mb-2 mt-3">
                <Input {...register('City')} label="City" name="City" />
              </div>
              <div className="grid gap-4 mb-2 mt-3">
                <Input
                  {...register('CountryIso2')}
                  onChange={(e) => handleInvoiceSetting(e, 'country_iso2')}
                  label="Country Iso2"
                  name="Country Iso2"
                />
              </div>
              <div className="grid gap-4 mb-2 mt-3">
                <Input
                  {...register('CountrySubEntity')}
                  onChange={(e) => handleInvoiceSetting(e, 'country_subentity')}
                  label="Country SubEntity"
                  name="Country SubEntity"
                />
              </div>
              <div className="grid gap-4 mb-2 mt-3">
                <Input
                  {...register('ZipCode')}
                  onChange={(e) => handleInvoiceSetting(e, 'zipcode')}
                  label="Zip Code"
                  name="Zip Code"
                />
              </div>
              <div className="grid gap-4 mb-2 mt-3">
                <Input
                  {...register('BuildingNumber')}
                  onChange={(e) => handleInvoiceSetting(e, 'building_no')}
                  label="Building Number"
                  name="Building Number"
                />
              </div>
              <div className="grid gap-4 mb-2 mt-3">
                <Input
                  {...register('District')}
                  onChange={(e) => handleInvoiceSetting(e, 'district')}
                  label="District"
                  name="Common Name"
                />
              </div>
              <div className="grid gap-4 mb-2 mt-3">
                <Input
                  {...register('serialNumber')}
                  label="Serial Number"
                  name="serialNumber"
                />
              </div>
              <div className="grid gap-4 mb-2 mt-3">
                <Input
                  {...register('organizationVat')}
                  label="Organization Vat"
                  name="organizationVat"
                />
              </div>
              <div className="grid gap-4 mb-2 mt-3">
                <Input
                  {...register('organizationUnit')}
                  label="Organization Unit"
                  name="organizationUnit"
                />
              </div>
              <div className="grid gap-4 mb-2 mt-3">
                <Input
                  {...register('organizationName')}
                  label="Organization Name"
                  name="organizationName"
                />
              </div>
              <div className="grid gap-4 mb-2 mt-3">
                <Input
                  {...register('countryName')}
                  label="country Name"
                  name="countryName"
                />
              </div>
              <div className="grid gap-4 mb-2 mt-3">
              <Label>{t('form:input-label-document-type')}</Label>
                <Select
                  getOptionLabel={(option: any) => option.label}
                  getOptionValue={(option: any) => option.key}
                  styles={selectStyles}
                  options={TypeArray}
                  onChange={OnChangeDocumentType}
                />
                
              </div>
              <div className="grid gap-4 mb-2 mt-3">
                <Input
                  {...register('businessCategory')}
                  label="Business Category"
                  name="businessCategory"
                />
              </div>
              <div className="grid gap-4 mb-2 mt-3">
                <Input
                  {...register('location')}
                  label="Address"
                  name="location"
                />
              </div>
             
            </>
          )}
        </Card>
      </div>

      <div className="mb-4 text-end">
        <Button type="submit" loading={creatingLoading}>
          {t('form:button-label-save')}
        </Button>
      </div>
    </form>
  );
}
