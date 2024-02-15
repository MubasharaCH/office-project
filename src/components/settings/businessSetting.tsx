import Input from '@/components/ui/input';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Select from 'react-select';
import { selectStyles } from '../ui/select/select.styles';
import {
  ContactDetailsInput,
  Shipping,
  ShopSocialInput,
  Tax,
  AttachmentInput,
  Settings,
} from '@/types';
import FormData from 'form-data';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import Label from '@/components/ui/label';
import { CURRENCY } from './currency';
import { siteSettings } from '@/settings/site.settings';
import ValidationError from '@/components/ui/form-validation-error';
import { useUpdateSettingsMutation } from '@/data/settings';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { settingsValidationSchema } from './settings-validation-schema';
import FileInput from '@/components/ui/file-input';
import SelectInput from '@/components/ui/select-input';
import TextArea from '@/components/ui/text-area';
import Alert from '@/components/ui/alert';
import { getIcon } from '@/utils/get-icon';
import * as socialIcons from '@/components/icons/social';
import GooglePlacesAutocomplete from '@/components/form/google-places-autocomplete';
import omit from 'lodash/omit';
import SwitchInput from '@/components/ui/switch-input';
import router, { useRouter } from 'next/router';
import { Config } from '@/config';
import { TIMEZONE } from './timeZone';
import { useEffect, useState, useMemo } from 'react';
import Loader from '@/components/ui/loader/loader';
import {
  AddingFunction,
  GetFunctionBDetail,
  UpdatingBusiness,
  UpdatingBusinessSetting,
  UpdatingFunction,
  UpdatingProduct,
  DashboardGetFun,
} from '@/services/Service';
import { toast } from 'react-toastify';
import React from 'react';
import { conforms } from 'lodash';

type FormValues = {
  siteTitle: string;
  name: any;
  tax_number_1: any;
  tax_label_1: any;
  logo: any;
  currency: any;
  time_zone: any;
};

const socialIcon = [
  {
    value: 'FacebookIcon',
    label: 'Facebook',
  },
  {
    value: 'InstagramIcon',
    label: 'Instagram',
  },
  {
    value: 'TwitterIcon',
    label: 'Twitter',
  },
  {
    value: 'YouTubeIcon',
    label: 'Youtube',
  },
];

export const updatedIcons = socialIcon.map((item: any) => {
  item.label = (
    <div className="flex items-center text-body space-s-4">
      <span className="flex h-4 w-4 items-center justify-center">
        {getIcon({
          iconList: socialIcons,
          iconName: item.value,
          className: 'w-4 h-4',
        })}
      </span>
      <span>{item.label}</span>
    </div>
  );
  return item;
});

type IProps = {
  settings?: Settings | null;
  taxClasses: Tax[] | undefined | null;
  shippingClasses: Shipping[] | undefined | null;
};
const defaultValues = {
  image: [],
  name: '',
  details: '',
  parent: '',
  icon: '',
  type: '',
  description: '',
  short_code: '',
};
export default function BusinessSettingsForm(initialValues: any) {
  const { t } = useTranslation();
  var form = new FormData();

  const { locale } = useRouter();
  const [creatingLoading, setCreatingLoading] = useState(false);
  const [CurrencyType, setCurrencyType] = useState();
  const [countries, setCurrencyCountry] = useState<any>();
  const [TimeZone, setTimeZone] = useState();
  const [loadingData, setloadingData] = useState(true);
  const [loading, setLoading] = useState(true);
  const [countriesLookup, setCountriesLookup] = useState({});

  let itemss =
    CURRENCY &&
    CURRENCY.find((item) => item.key == initialValues?.data?.currency_id);
  const CurrencyDataArrayDefault = [
    {
      label: itemss
        ? `${itemss.name} (${initialValues?.data?.currency?.country})`
        : '',
    },
  ];
  const currencyCountryLabel = () => {
    if (itemss) {
      const country = countriesLookup[itemss.key];

      if (country) {
        return `${itemss?.name} (${country.country})`;
      } else {
        return itemss?.name;
      }
    }
  };

  React.useEffect(() => {
    setCurrencyType(itemss?.key);
    setTimeZone(initialValues.data?.time_zone);
    setloadingData(true);
    DashboardGetFun('/currencies').then((data) => {
      const lookup = {};
      for (const country of data) {
        lookup[country.id] = country;
      }
      setCountriesLookup(lookup);
    });
    setloadingData(false);
  }, []);

  const currencyOptions = useMemo(() => {
    return CURRENCY.map((currency) => {
      const country = countriesLookup[currency.key];
      if (country) {
        const label = country
          ? `${currency.name} (${country.country})`
          : `${currency.name} (${country.country})`;
        return {
          ...currency,
          label,
        };
      }
    });
  }, [CURRENCY, countriesLookup]);

  const {
    register,
    control,
    handleSubmit,
    watch,
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
  const [imageFile, setImageFile] = useState<any>();
  const [path, setPath] = useState<string>(getValues('logo'));
  useEffect(() => {
    if (imageFile) {
      setPath(URL.createObjectURL(imageFile));
    }
  }, [imageFile]);
  const logoInformation = (
    <span>
      {t('common:logo-help-text')} <br />
      {t('form:logo-dimension-help-text')} &nbsp;
      <span className="font-bold">
        {siteSettings.logo.width}x{siteSettings.logo.height} {t('common:pixel')}
      </span>
    </span>
  );

  const TimeZoneOnChange = (e) => {
    setTimeZone(e.name);
  };
  const CurrencyOnChange = (e) => {
    setCurrencyType(e.key);
  };
  const TimeZoneDataArrayDefault = [
    {
      name: initialValues.data?.time_zone,
    },
  ];

  const getBusinessDetails = (token) => {
    GetFunctionBDetail('/business-details', token).then((result) => {
      localStorage.setItem(
        'business_details',
        JSON.stringify(result.data.currency)
      );

      localStorage.setItem(
        'user_business_details',
        JSON.stringify(result.data)
      );
      localStorage.setItem('business_name', result.data.name);
    });
    GetFunctionBDetail('/user/loggedin', token).then((result) => {
      localStorage.setItem('user_detail', JSON.stringify(result.data));
    });
  };

  if (loadingData) return <Loader text={t('common:text-loading')} />;
  const onSubmit = (values: FormValues) => {
    form.append('name', values.name);
    form.append('currency_id', CurrencyType);
    form.append('time_zone', TimeZone);
    form.append('tax_label_1', values.tax_label_1);
    form.append('tax_number_1', values.tax_number_1);
    form.append('pos_settings', '');
    form.append('logo', imageFile);
    form.append('show_barcode', '');
    form.append('default_payment_accounts', '');
    let formVal = {
      name: values.name,
      currency_id: CurrencyType,
      time_zone: TimeZone,
      tax_label_1: values.tax_label_1,
      tax_number_1: values.tax_number_1,
      pos_settings: '',
      logo: '',
      show_barcode: '',
      default_payment_accounts: '',
    };
    setCreatingLoading(true);
    UpdatingBusinessSetting('/business/settings/0', form).then((result) => {
      let tokens = localStorage.getItem('user_token');
      getBusinessDetails(tokens);

      if (result?.business) {
        setCreatingLoading(false);
        toast.success(t('Successfully Update'));
        // router.back();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(result.message);
        setCreatingLoading(false);
      }
    });
  };

  // @ts-ignore
  // @ts-ignore
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:input-label-logo')}
          details={logoInformation}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput
            name="logo"
            control={control}
            setImageFile={setImageFile}
            multiple={false}
          />
          {path && (
            <img
              style={{ width: '50px', height: '50px', marginTop: '1rem' }}
              src={path}
              alt="cate-image"
              className="object-contain"
            />
          )}
        </Card>
      </div>

      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('common:business')}
          details={t('form:site-info-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-name')}
            {...register('name')}
            variant="outline"
            className="mb-5"
          />

          <div className="mb-5">
            <Label>{t('form:input-label-currency')}</Label>
            {/* <Select
              styles={selectStyles}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.key}
              options={CURRENCY}
              defaultValue={CurrencyDataArrayDefault}
              formatOptionLabel={(option: any) => {
                const selectedCountry = CurrencyCountry.find(country => country.id === option.key);
                return `${option.name} - ${selectedCountry.name}`;
              }}
            /> */}

            <Select
              isDisabled={true}
              styles={selectStyles}
              // getOptionLabel={(option: any) => option.name}
              // getOptionValue={(option: any) => option.key}
              options={currencyOptions}
              defaultValue={CurrencyDataArrayDefault}
              onChange={CurrencyOnChange}
            />
          </div>
          <div className="mb-5">
            <Label>{t('form:input-label-time-zone')}</Label>
            <Select
              styles={selectStyles}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.key}
              options={TIMEZONE}
              defaultValue={TimeZoneDataArrayDefault}
              onChange={TimeZoneOnChange}
            />
          </div>
          <div className="mb-5">
            <Input
              label={t('form:tin')}
              {...register('tax_number_1')}
              variant="outline"
              className="mb-5"
            />
          </div>
        </Card>
      </div>
      {/* <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title="Tax"
          details={t('form:site-info-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pr-4 md:w-1/3 md:pr-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('Tax 1 Name')}
            {...register('tax_label_1')}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('Tax 1 No.')}
            {...register('tax_number_1')}
            variant="outline"
            className="mb-5"
          />
        </Card>
      </div> */}

      <div className="mb-4 text-end">
        <Button loading={creatingLoading}>
          {t('form:button-label-save-settings')}
        </Button>
      </div>
    </form>
  );
}
