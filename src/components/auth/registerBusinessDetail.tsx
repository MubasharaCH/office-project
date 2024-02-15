import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import PasswordInput from '@/components/ui/password-input';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Routes } from '@/config/routes';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import Link from '@/components/ui/link';
import { allowedRoles, setAuthCredentials } from '@/utils/auth-utils';
import { Permission } from '@/types';
import { useRegisterMutation } from '@/data/user';
import Label from '../ui/label';
import Select from 'react-select';
import { selectStyles } from '../ui/select/select.styles';
import { CURRENCY, TIMEZONE } from './currency';
import { GetFunction, GetFunctionBDetail } from '@/services/Service';
import Router from 'next/router';
import { log } from 'console';
import React from 'react';
import Loader from '@/components/ui/loader/loader';
import img from '../../../public/image/countryImages/pak.png';
import Image from 'next/image';
import { GrStatusGood } from 'react-icons/gr';
import { HiCheckCircle } from 'react-icons/hi2';
import { AiFillCloseCircle } from 'react-icons/ai';

type FormValues = {
  firstName: any;
  lastName: any;
  email: any;
  name: any;
  business_category: any;
  currency_id: any;
  time_zone: any;
  password: any;
  business_category_name: any;
  storeUrl: any;
};
const registrationFormSchema = yup.object().shape({
  name: yup.string().required('form:error-name-required'),
  email: yup
    .string()
    .email('form:error-email-format')
    .required('form:error-email-required'),
  password: yup.string().required('form:error-password-required'),
  permission: yup.string().default('store_owner').oneOf(['store_owner']),
});
const RegistrationForm = (list: any) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate: registerUser, isLoading: loading } = useRegisterMutation();
  const [CurrencyType, setCurrencyType] = useState<any>();
  const [TimeZone, setTimeZone] = useState<any>();
  const [BType, setBtypeZone] = useState<any>();
  const [BTypeName, setBtypeNameZone] = useState<any>();
  const [domainUrl, setDomainUrl] = useState<any>();
  const [loadingData, setloadingData] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [isDisable, setIsDisable] = useState(false);
  const [country, setCountry] = useState<any>('');
  const [isUrlExist, setIsUrlExist] = useState(false);
  const [newLoader, setNewLoader] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues,
  } = useForm<FormValues>({});
  const router = useRouter();
  const { t } = useTranslation();
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
    toast.success(t('Registration Successful'));
    setTimeout(() => {
      Router.push(Routes.dashboard);
    }, 1000);
    // Router.push(Routes.dashboard);
  };

  useEffect(() => {
    if (!BTypeName) {
      setIsDisable(true);
    } else if (!CurrencyType) {
      setIsDisable(true);
    } else if (!TimeZone) {
      setIsDisable(true);
    } else if (isUrlExist) {
      setIsDisable(true);
    } else if (!domainUrl) {
      setIsDisable(true);
    } else if (!country) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
    // else if (!businessName) {
    //   setIsDisable(true)
    // }
  });

  // const customStyles = {
  //   option: (provided: any, state: any) => ({
  //     ...provided,
  //     display: 'flex',
  //     alignItems: 'center',
  //     justifyContent: 'flex-start',
  //     lineHeight: '1.2rem',
  //     padding: '0.25rem',
  //     backgroundColor: state.isSelected ? '#f0f0f0' : 'transparent',
  //     color: state.isSelected ? '#333' : '#666',
  //     cursor: 'pointer',
  //   }),
  //   singleValue: (provided: any, state: any) => ({
  //     ...provided,
  //     display: 'flex',
  //     alignItems: 'center',
  //     justifyContent: 'flex-start',
  //     padding: '0.25rem',
  //     lineHeight: '1.2rem',
  //   }),
  // };

  // const formatOptionLabel = ({ value, label }: CountryOption) => (
  //   <div style={{ display: 'flex', alignItems: 'center' }}>
  //     <span
  //       style={{ marginRight: '0.5rem' }}
  //       role="img"
  //       aria-label={`Flag for ${label}`}
  //     >
  //       {value}
  //     </span>
  //     <span>{label}</span>
  //   </div>
  // );

  const handleChange = (event) => {
    setSelectedCurrency(event.target.value);
  };

  const CurrencyOnChange = (e) => {
    setCurrencyType(e.key);
  };
  const countryOnChange = (e) => {
    setCountry(e.country);
  };
  const TimeZoneOnChange = (e) => {
    setTimeZone(e.name);
  };
  const BTypeOnChange = (e) => {
    setBtypeZone(e.id);
    setBtypeNameZone(e.name);
  };

  const onChangeStoreUrl = (e) => {
    setDomainUrl(e.target.value);
  };

  const [timeZoneName, setTimeZoneName] = useState<any>([]);
  const [timeCurrencyName, setTCurrencyName] = useState<any>([]);
  const [CountryName, setCountryName] = useState<any>([]);
  const [showAction, setShowAction] = useState(false);
  const [showActionDiv, setShowActionDiv] = useState(false);

  React.useEffect(() => {
    setloadingData(true);
    fetch('https://api.ipregistry.co/?key=7qsumd6hmu9lk9ns')
      .then(function (response) {
        return response.json();
      })
      .then(function (payload) {
        let TimeZoneData = {
          key: payload.time_zone.id,
          name: payload.time_zone.id,
        };
        let CurrencyData = {
          key: payload.time_zone.id,
          name: payload.time_zone.id,
        };
        setTimeZoneName([TimeZoneData]);
        const found = CURRENCY.find(
          (element) => element?.code == payload?.currency.code
        );
        const foundCountry = CURRENCY.find(
          (element) => element?.country == payload?.location?.country?.name
        );
        setTCurrencyName([found]);
        setCountryName([foundCountry]);
        setCountry(payload?.location?.country?.name);
        setTimeZone(payload?.time_zone?.id);
        setCurrencyType(found?.key);
        setloadingData(false);
      });
  }, []);

  async function onSubmit({
    firstName,
    lastName,
    email,
    name,
    business_category,
    currency_id,
    time_zone,
    password,
    business_category_name,
    storeUrl,
  }: FormValues) {
    registerUser(
      {
        firstName,
        lastName,
        email,
        name: name,
        business_category: BType,
        currency_id: CurrencyType,
        time_zone: TimeZone,
        password: password,
        business_category_name: BTypeName,
        storeUrl: domainUrl,
        country: country,
      },

      {
        onSuccess: (data: any) => {
          setErrorMessage(null);
          if (data.status == false) {
            let newError = data.message.map((e: any) => {
              return e;
            });
            setErrorMessage(newError);
            toast.error('Something Went Wrong');
          }
          if (data?.token.access_token) {
            localStorage.setItem('user_token', data?.token.access_token);
            setAuthCredentials(data?.token.access_token);
            getBusinessDetails(data?.token.access_token);
          }
        },
      }
    );
  }

  const onBackClick = () => {
    router.push(Routes.businessDetail);
  };

  const handleBlur = () => {
    // Call API when the input field is unfocused
    GetFunction(`/validate-record?domain=${domainUrl}`).then((result) => {
      if (result?.success == true) {
        setErrorMessage(result.message);
        setIsUrlExist(true);
      } else {
        setIsUrlExist(false);
        setErrorMessage('');
      }
    });
  };
  const onChangeDomain = (e) => {
    // Get the input value
    const inputValue = e.target.value;

    // Define a regex pattern for alphanumeric characters
    const alphanumericPattern = /^[a-zA-Z0-9]*$/;

    // Check if the input value matches the pattern
    if (alphanumericPattern.test(inputValue)) {
      // If it matches, update the state with the new value
      setNewLoader(true);
      setShowActionDiv(true);
      if (e.target.value.length == 0) {
        setShowActionDiv(false);
      }
      setDomainUrl(e.target.value);
      GetFunction(`/validate-record?domain=${e.target.value}`).then(
        (result) => {
          if (result.success) {
            setShowAction(true);
            setNewLoader(false);
          } else {
            setShowAction(false);
            setNewLoader(false);
          }
        }
      );
    }
  };

  if (loadingData) return <Loader text={t('common:text-loading')} />;

  return (
    <>
      <form noValidate>
        <div className="flex">
          <div className="mr-3 w-full">
            <Input
              label={t('form:input-label-business-name')}
              {...register('name')}
              variant="outline"
              className="mb-4"
            />
            <div className="mb-3">
              <Label>{t('form:input-label-currency')}</Label>
              {/* <select value={selectedCurrency} onChange={handleChange}>
        {CURRENCY.map((currency) => (
          <option key={currency.code} value={currency.code}>
           <CurrencyFlags currency={currency.code} width={30} /> {currency.name}
          </option>
        ))}
      </select> */}
              <Select
                getOptionLabel={(option: any) => option.code}
                // getOptionLabel={e => (
                //   <div style={{ display: 'flex', alignItems: 'center' }}>
                //     <img width={20} height={20} src={e.flag} />
                //     <span style={{ marginLeft: 5 }}>{e.code}</span>
                //   </div>
                // )}
                getOptionValue={(option: any) => option.key}
                options={CURRENCY}
                styles={selectStyles}
                defaultValue={timeCurrencyName}
                onChange={CurrencyOnChange}
              />
            </div>
            {/* <label
              className="block mb-3 text-sm font-semibold leading-none text-body-dark"
            >
              Store URL
            </label>
            <div className="input-container mb-4">

              <input
                type="text"
                value={storeUrl}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={onChangeStoreUrl}
                className="rounded border-inherit p-3"
              />
              {isLoading ? <div className="loader"></div> : <div className="tick"></div>}

            </div>
            {storeUrl && (
              <div className="text-sm text-slate-400 mb-2">
                https://{storeUrl}.myignite.site
              </div>
            )} */}

            <div className="relative mb-3">
              <Input
                label={t('form:store-url')}
                name={'StoreUrl'}
                onChange={onChangeDomain}
                value={domainUrl}
                variant="outline"
                className="mb-0"
                onBlur={handleBlur}
              />
              {/* {showAction ? (
                <div style={{ position: 'absolute', top: 40, right: 0 }}>
                  <AiFillCloseCircle color="#FF0000" className="h-5 w-9" />
                </div>
              ) : (
                <div style={{ position: 'absolute', top: 40, right: 0 }}>
                  <HiCheckCircle color="#009F7F" className="h-5 w-9" />
                </div>
              )} */}

              {newLoader == true ? (
                <div
                  style={{ position: 'absolute', top: 40, right: 0 }}
                  role="status"
                >
                  <svg
                    aria-hidden="true"
                    className="mr-2 h-5 w-9 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <div>
                  {showActionDiv && (
                    <div>
                      {showAction && (
                        <div
                          style={{ position: 'absolute', top: 40, right: 0 }}
                        >
                          <AiFillCloseCircle
                            color="#FF0000"
                            className="h-5 w-9"
                          />
                        </div>
                      )}
                      {!showAction && (
                        <div
                          style={{ position: 'absolute', top: 40, right: 0 }}
                        >
                          <HiCheckCircle color="#009F7F" className="h-5 w-9" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {domainUrl && (
                <div className="text-sm text-slate-400">
                  https://{domainUrl}.myignite.site
                </div>
              )}
            </div>
          </div>

          <div className="ml-3 w-full">
            <div className="mb-3">
              <Label>{t('form:input-label-country')}</Label>

              <Select
                getOptionLabel={(option: any) => option.country}
                // getOptionLabel={e => (
                //   <div style={{ display: 'flex', alignItems: 'center' }}>
                //     {/* <Image width={20} height={20} src={e.flag}/>  */}
                //     <img width={20} height={20} src={e.flag} />
                //     <span style={{ marginLeft: 5 }}>{e.country}</span>
                //   </div>
                // )}
                getOptionValue={(option: any) => option.key}
                options={CURRENCY}
                styles={selectStyles}
                defaultValue={CountryName}
                onChange={countryOnChange}
              />
            </div>
            <div className="mb-3">
              <Label>{t('form:business-type')}</Label>
              <Select
                getOptionLabel={(option: any) => option.name}
                getOptionValue={(option: any) => option.id}
                options={list.list}
                styles={selectStyles}
                onChange={BTypeOnChange}
              />
            </div>
            <div className="mb-3">
              <Label>{t('form:input-label-time-zone')}</Label>
              <Select
                getOptionLabel={(option: any) => option.name}
                getOptionValue={(option: any) => option.key}
                options={TIMEZONE}
                styles={selectStyles}
                onChange={TimeZoneOnChange}
                defaultValue={timeZoneName}
              />
            </div>
          </div>
        </div>
      </form>
      <div className="flex">
        <div className="mr-3 w-full">
          <Button onClick={onBackClick}>{t('form:button-label-back')}</Button>
        </div>
        <div className="ml-3 w-full">
          <Button
            onClick={handleSubmit(onSubmit)}
            className="float-right"
            loading={loading}
            disabled={isDisable}
          >
            {t('form:text-register')}
          </Button>
        </div>
      </div>
      {errorMessage ? (
        <Alert
          message={t(errorMessage)}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}
    </>
  );
};

export default RegistrationForm;
