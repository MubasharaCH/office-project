import AdminLayout from '@/components/layouts/admin';
import StoreSettingsForm from '@/components/settings/StoreSettingsForm';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useSettingsQuery } from '@/data/settings';
import { useShippingClassesQuery } from '@/data/shipping';
import { useTaxesQuery } from '@/data/tax';

import {
  GetFunction,
  AddingFunction,
  GetFunctionBDetail,
  UpdateUserFunction,
  AddShipping,
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
import { selectStyles } from '../../components/ui/select/select.styles';
import { Switch } from '@headlessui/react';
import Input from '@/components/ui/input';

export default function Settings() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [loadingData, setLoadingData] = useState(true);
  const [updateLoader, setUpdateLoader] = useState(false);
  const [enableRock, setEnableRock] = useState(false);
  const [enableLot, setEnableLot] = useState(false);
  const [enableRow, setEnableRow] = useState(false);
  const [enablePosition, setEnablePosition] = useState(false);
  const [enableBrand, setEnableBrand] = useState(true);
  const [enableCategory, setEnableCategory] = useState(true);
  const [salesCommission, setSalesCommission] = useState<any>({});
  const [orderTypeVal, setOrderTypeVal] = useState<any>([]);
  const [orderTypeValDef, setOrderTypeValDef] = useState<any>([]);
  const [packageDetail, setPackageDetail] = useState<any>({});
  const [flextTockData, setFlexTockData] = useState<any>({});
  const [eInvoiceSetting, setEInvoiceSetting] = useState<any>({});
  const [isInvoicing, setIsInvoicing] = useState(false);
  const [isEnableFlextock, setIsEnableFlextock] = useState(false);
  const [tinNo, setTinNo] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isWeight, setIsWeight] = useState(false);
  const [BusinessData, setBusinessData] = useState<any>('');
  const [creatingLoading, setCreatingLoading] = useState(false);
  const [locationDataArray, setLocationDataArray] = React.useState<any>([]);
  const [locationID, setLocationID] = useState<any>();
  const [selectedOption, setSelectedOption] = useState(null);
  const [legalRegistrationName, setLegalRegistrationName] = useState<any>(null);
  let locations: any = [];
  let form = new FormData();

  const [customFields, setCustomFields] = useState<any>({
    custom_field_1: '',
    custom_field_2: '',
    custom_field_3: '',
    custom_field_4: '',
  });
  const PointList = [
    {
      key: 1,
      id: 1,
      value: '',
      label: 'Disable',
    },
    {
      key: 4,
      id: 4,
      value: 'cmsn_agnt',
      label: "Select from commission agent's list",
    },
  ];
  const OrderList = [
    {
      key: 1,
      value: 'Pickup',
      label: 'Pickup',
    },
    {
      key: 2,
      value: 'Delivery',
      label: 'Delivery',
    },
    {
      key: 3,
      value: 'DineIn',
      label: 'DineIn',
    },
  ];
  const handleCustomChange = (e, fieldName) => {
    const { name, value, checked } = e.target;
    let file_name =
      name === 'is_' + fieldName + '_required'
        ? 'is_' + fieldName + '_required'
        : fieldName;

    setCustomFields((prevFields) => {
      if (!checked && value === 'on') {
        // Create a copy of the previous state and remove the specific key
        const newState = { ...prevFields };
        delete newState[file_name];
        return newState;
      }

      return {
        ...prevFields,
        [file_name]: name === 'is_' + fieldName + '_required' ? checked : value,
      };
    });
  };

  let token: any = localStorage.getItem('user_token');
  let user_detail: any = localStorage.getItem('user_detail');
  const userData: any = JSON.parse(user_detail);

  useEffect(() => {
    const businessDetail = JSON.parse(
      localStorage.getItem('user_business_details')!
    );
    if (businessDetail) {
      setPackageDetail(businessDetail?.subscriptions[0]?.package_details);
      setLegalRegistrationName(businessDetail?.legal_registration_name);
    }
    let token = localStorage.getItem('user_token');

    GetFunctionBDetail('/business-location', token)
      .then((result) => {
        const locations = result.data.map((data, i) => ({
          key: i,
          id: data.id,
          value: data.name,
          label: data.name,
        }));

        let ordersData = result.data.map((data, i) => ({
          key: i,
          id: data.id,
          value: data.name,
          label: data.name,
        }));

        setLocationDataArray(ordersData);
        fetchEinvoiceSetting(ordersData[0]['id']);

        GetFunctionBDetail('/business-details', token)
          .then((result) => {
            setBusinessData(result.data);
            setEnableRock(result?.data.enable_racks);
            setEnableRow(result?.data.enable_row);
            setEnablePosition(result?.data.enable_position);
            setEnableLot(result?.data.enable_lot_number);
            setIsWeight(result?.data.enable_weight);
            setIsEnableFlextock(result?.data.enable_flextock?.enable);
            setTinNo(result?.data.tax_number_1);
            // setEInvoiceSetting(result?.data?.einvoice_settings);
            let order = result?.data?.order_type?.map((e, i) => {
              return {
                key: i,
                value: e,
                label: e,
              };
            });
            setOrderTypeVal(result?.data?.order_type);
            setOrderTypeValDef(order);
            const matchedOption = locations[0];
            setSelectedOption(matchedOption);
            setFlexTockData(result.data.enable_flextock);
            if (result?.data?.enabled_modules) {
              const isInvoicingEnabled = result?.data?.enabled_modules?.some(
                (value) => value === 'enable_einvoice'
              );
              setIsInvoicing(isInvoicingEnabled);
            }
            PointList.map((item) => {
              if (item.value === result?.data.sales_cmsn_agnt) {
                setSalesCommission(item);
              }
            });
            setLoadingData(false);
          })
          .catch((error) => {
            console.error(error);
            setLoadingData(false);
          });
      })
      .catch((error) => {
        console.error(error);
        setLoadingData(false);
      });
  }, []);
  const getBusinessDetail = () => {
    let token = localStorage.getItem('user_token');
    GetFunctionBDetail('/business-details', token).then((result) => {
      localStorage.setItem(
        'user_business_details',
        JSON.stringify(result.data)
      );
      localStorage.setItem('business_name', result.data.name);
      window.location.reload();
    });
  };

  const OnChangeLocation = (e) => {
    setLocationID(e.id);
  };

  const handleSubmit = () => {
    setUpdateLoader(true);
    let UpdateForm = {
      enable_racks: enableRock ? 1 : 0,
      enable_row: enableRow ? 1 : 0,
      enable_position: enablePosition ? 1 : 0,
      enable_brand: enableBrand ? 1 : 0,
      enable_category: enableCategory ? 1 : 0,
      enable_lot_number: enableLot ? 1 : 0,
      enable_weight: isWeight ? 1 : 0,
      enable_einvoice: isInvoicing,
      enable_flextock: flextTockData,
      einvoice_settings: eInvoiceSetting,
      legal_registration_name: legalRegistrationName,
      tax_number_1: tinNo,
      city: city,
      zip_code: zipCode,
      sales_cmsn_agnt:
        salesCommission.value === '' ? 'null' : salesCommission.value,
      order_type: orderTypeVal,
      sell: customFields,
    };

    // Check if the einvoice_settings object and location_id property exist
    if (eInvoiceSetting && !eInvoiceSetting.hasOwnProperty('location_id')) {
      // If location_id exists, include it in the UpdateForm object
      UpdateForm.einvoice_settings = {
        ...UpdateForm.einvoice_settings,
        location_id: locationDataArray ? locationDataArray[0]['id'] : '',
      };
    }

    UpdateUserFunction('/update-product-settings', UpdateForm).then(
      (result) => {
        if (result.success == true) {
          toast.success(result.msg);
          getBusinessDetail();
        } else {
          toast.error(result.msg);
        }
        setUpdateLoader(false);
      }
    );
  };

  const onChnagePurchases = () => {
    if (packageDetail.name == 'Free package') {
      toast.error('Please update your subscription');
      Router.push('/settings/subscription');
    } else {
      setEnableLot(!enableLot);
    }
  };
  const rockChange = () => {
    if (packageDetail.name == 'Free package') {
      toast.error('Please update your subscription');
      Router.push('/settings/subscription');
    } else {
      setEnableRock(!enableRock);
    }
  };
  const rowChange = () => {
    if (packageDetail.name == 'Free package') {
      toast.error('Please update your subscription');
      Router.push('/settings/subscription');
    } else {
      setEnableRow(!enableRow);
    }
  };
  const positionChange = () => {
    if (packageDetail.name == 'Free package') {
      toast.error('Please update your subscription');
      Router.push('/settings/subscription');
    } else {
      setEnablePosition(!enablePosition);
    }
  };
  const handleInvoicing = () => {
    setIsInvoicing(!isInvoicing);
  };
  const handleInvoiceSetting = (event, index) => {
    if (index == 'zipcode' || index == 'tin_no' || index == 'city') {
      index == 'zipcode' ? setZipCode(event.target.value) : '';
      index == 'tin_no' ? setTinNo(event.target.value) : '';
      index == 'city' ? setCity(event.target.value) : '';
      return;
    }
    setEInvoiceSetting({});
    let invoiceSetting = { ...eInvoiceSetting };
    invoiceSetting[index] =
      index == 'location_id' ? event.id : event.target.value;
    var location_id = index == 'location_id' ? event.id : event.target.value;
    setEInvoiceSetting(invoiceSetting);
    if (index == 'location_id') {
      fetchEinvoiceSetting(location_id);
    }
  };
  const fetchEinvoiceSetting = (location_id) => {
    setEInvoiceSetting({});
    GetFunction('/business-einvoice-details?location_id=' + location_id).then(
      (result) => {
        let invoiceSetting = { ...eInvoiceSetting };
        setZipCode(result?.zip_code);
        setCity(result?.city);
        if (result?.einvoice_settings) {
          setEInvoiceSetting(result?.einvoice_settings);
        } else {
          // Loop through all the properties of invoiceSetting and set them to an empty string
          for (let key in invoiceSetting) {
            if (key != 'location_id') {
              invoiceSetting[key] = '';
            }
          }
          invoiceSetting['location_id'] = location_id;
          setEInvoiceSetting(invoiceSetting);
        }
      }
    );
  };
  const handleLegalRegistrationName = (event) => {
    var value = event.target.value;
    setLegalRegistrationName(value);
  };
  const handleFlextock = (e, index) => {
    let value;

    // if (typeof e === 'object' && e.target) {
    //   value = e.target.value;
    // } else {
    //   value = e;
    // }

    if (index === 'enable') {
      value = e == true ? 1 : 0;
    } else {
      value = e.target.value;
    }

    // Assuming you have an object to store the data

    // Assuming you have an object to store the data
    const flextock = { ...flextTockData };

    // Update the value directly in the object
    flextock[index] = value;

    setFlexTockData(flextock);

    if (index === 'enable') {
      setIsEnableFlextock(!isEnableFlextock);
    }
  };

  const handleWeight = () => {
    setIsWeight(!isWeight);
  };

  if (loadingData) return <Loader text={t('common:text-loading')} />;

  const OnChangeValue = (e: any) => {
    setSalesCommission(e);
  };

  const OnChangeOrderTypeValue = (e: any) => {
    const valuesArray = e.map((item) => item.value);
    setOrderTypeVal(valuesArray);
  };

  const handleFlextockProduct = () => {
    setCreatingLoading(true);
    const data = {
      // transaction_id:query.invoiceId,
      business_id: BusinessData.id,
    };

    AddShipping('/sync-products-to-flextock', data).then((result) => {
      if (result.success) {
        toast.success(result.message);
        // router.reload()
      } else {
        if (Array.isArray(result.message)) {
          result.message.forEach((messages) => {
            const { sku_code, message } = messages;
            const toastMessage = `SKU code: ${sku_code} - ${message}`;
            toast.error(toastMessage);
          });
        } else {
          toast.error(result.message);
        }
      }
      setCreatingLoading(false);
    });
  };
  const handleOnboarding = () => {
    setCreatingLoading(true);
    form.append('location_id', eInvoiceSetting?.location_id);
    form.append('business_id', BusinessData.id);
    AddingFunction('/businesses/onboarding', form).then((result) => {
      if (result.success) {
        setCreatingLoading(false);
        toast.success(result.message);
      } else {
        toast.error(result.message);
        setCreatingLoading(false);
      }
    });
  };
  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:product-setting')}
        </h1>
      </div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:title-product')}
          //  details={t('common:add-role-permission')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="w-full " style={{ marginTop: '10px' }}>
            <div className="w-full grid-cols-2 lg:grid lg:grid-cols-6  lg:gap-3 xl:grid-cols-2">
              <div className="flex custom:my-2">
                <input
                  style={{
                    fontStyle: 'normal',
                    accentColor: 'rgb(33, 33, 33)',
                  }}
                  type="checkbox"
                  id="brand"
                  className="mr-5 h-6 w-6 rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                  // value={t('form:input-label-enable-rock')}
                  //checked={PermissionDataArray.includes(innerItem.name) ? true : false}
                  checked={enableBrand}
                  // onChange={handleSelect}
                />
                <label htmlFor={'brand'}>
                  {t('form:input-label-enable-brand')}
                </label>
              </div>
              <div className="flex custom:my-2">
                <input
                  style={{
                    fontStyle: 'normal',
                    accentColor: 'rgb(33, 33, 33)',
                  }}
                  type="checkbox"
                  id="category"
                  className="bg-accent-100  mr-5 h-6 w-6 rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                  // value={t('form:input-label-enable-row')}
                  //checked={PermissionDataArray.includes(innerItem.name) ? true : false}
                  checked={enableCategory}
                  // onChange={handleSelect}
                />
                <label htmlFor={'category'}>
                  {t('form:input-label-enable-category')}
                </label>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:title-product-position')}
          //  details={t('common:add-role-permission')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="w-full " style={{ marginTop: '10px' }}>
            <div className="w-full grid-cols-3 lg:grid lg:grid-cols-6  lg:gap-3 xl:grid-cols-3">
              <div className="flex custom:my-2">
                <input
                  style={{
                    fontStyle: 'normal',
                    accentColor: 'rgb(33, 33, 33)',
                  }}
                  type="checkbox"
                  id="rocks"
                  className="bg-accent-100  mr-5 h-6 w-6 rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                  checked={enableRock}
                  // checked={item.isAdded}

                  onChange={rockChange}
                />
                <label htmlFor={'rocks'}>
                  {t('form:input-label-enable-rack')}
                </label>
              </div>
              <div className="flex custom:my-2">
                <input
                  style={{
                    fontStyle: 'normal',
                    accentColor: 'rgb(33, 33, 33)',
                  }}
                  type="checkbox"
                  id="row"
                  className="bg-accent-100  mr-5 h-6 w-6 rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                  // value={t('form:input-label-enable-row')}
                  //checked={PermissionDataArray.includes(innerItem.name) ? true : false}
                  checked={enableRow}
                  onChange={rowChange}
                />
                <label htmlFor={'row'}>
                  {t('form:input-label-enable-row')}
                </label>
              </div>
              <div className="flex custom:my-2">
                <input
                  style={{
                    fontStyle: 'normal',
                    accentColor: 'rgb(33, 33, 33)',
                  }}
                  type="checkbox"
                  id="position"
                  className="checked:bg-red  mr-5 h-6 w-6 rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                  // value={t('form:input-label-enable-rock')}
                  //checked={PermissionDataArray.includes(innerItem.name) ? true : false}
                  checked={enablePosition}
                  onChange={positionChange}
                />
                <label htmlFor={'position'}>
                  {t('form:input-label-enable-position')}
                </label>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:input-label-enable-purchases')}
          //  details={t('common:add-role-permission')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="w-full " style={{ marginTop: '10px' }}>
            <div className="grid w-full  grid-cols-1 gap-3 xl:grid-cols-3">
              <div className="flex">
                <input
                  style={{
                    fontStyle: 'normal',
                    accentColor: 'rgb(33, 33, 33)',
                  }}
                  type="checkbox"
                  id="rocks"
                  className="bg-accent-100  mr-5 h-6 w-6 rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                  checked={enableLot}
                  // checked={item.isAdded}
                  onChange={onChnagePurchases}
                />
                <label htmlFor={'rocks'}>{t('Enable Lot')}</label>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('Sales')}
          //  details={t('common:add-role-permission')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="w-full " style={{ marginTop: '10px' }}>
            <div className=" pb-3">
              <Label>{t('form:input-label-sale-commission-agent')}</Label>
              <Select
                getOptionLabel={(option: any) => option.label}
                getOptionValue={(option: any) => option.key}
                styles={selectStyles}
                options={PointList}
                onChange={OnChangeValue}
                defaultValue={salesCommission}
              />
            </div>
          </div>
          <div className="w-full " style={{ marginTop: '10px' }}>
            <div className=" pb-3">
              <Label>{t('Order Type')}</Label>
              <Select
                isMulti
                getOptionLabel={(option: any) => option.label}
                styles={selectStyles}
                options={OrderList}
                onChange={OnChangeOrderTypeValue}
                defaultValue={orderTypeValDef}
              />
            </div>
          </div>
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:input-label-enable-weight')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="w-full " style={{ marginTop: '10px' }}>
            <div className="grid w-full  grid-cols-1 gap-3 xl:grid-cols-3">
              <div className="flex">
                <input
                  style={{
                    fontStyle: 'normal',
                    accentColor: 'rgb(33, 33, 33)',
                  }}
                  type="checkbox"
                  id="rocks"
                  className="bg-accent-100  mr-5 h-6 w-6 rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                  checked={isWeight}
                  // checked={item.isAdded}
                  onChange={handleWeight}
                />
                <label htmlFor={'rocks'}>
                  {t('form:input-label-enable-weight')}
                </label>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:input-label-e-invoicing')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-5">
            <Label>{t('form:input-label-e-invoicing')}</Label>
            <Switch
              checked={isInvoicing}
              onChange={handleInvoicing}
              className={`${
                isInvoicing ? 'bg-accent' : 'bg-gray-300'
              } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
              dir="ltr"
            >
              <span className="sr-only">Enable </span>
              <span
                className={`${
                  isInvoicing ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
              />
            </Switch>
          
          </div>
        </Card>
      </div>

      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:input-label-flextock')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-5">
            <Label>{t('form:input-label-flextock')}</Label>
            <Switch
              checked={isEnableFlextock}
              onChange={(e) => handleFlextock(e, 'enable')}
              className={`${
                isEnableFlextock ? 'bg-accent' : 'bg-gray-300'
              } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
              dir="ltr"
            >
              <span className="sr-only">Enable </span>
              <span
                className={`${
                  isEnableFlextock ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
              />
            </Switch>
            {isEnableFlextock ? (
              <span style={{ float: 'right' }}>
                <Button
                  loading={creatingLoading}
                  className="rounded bg-accent p-2 text-white"
                  onClick={handleFlextockProduct}
                >
                  {t('common:sync-product-to-flextock')}
                </Button>
              </span>
            ) : (
              ''
            )}
          </div>
          {isEnableFlextock ? (
            <div>
              <div className=" w-full ">
                <Label className="text-left">
                  {t('form:input-label-username')}
                </Label>
                <Input
                  name="flextock_username"
                  onChange={(e) => handleFlextock(e, 'username')}
                  value={flextTockData?.username ? flextTockData?.username : ''}
                  // onChange={(e) => changeTaxInputs(e, 'name')}
                  // error={t(errors.name?.message!)}
                  variant="outline"
                  className="mb-5"
                />
              </div>
              <div className=" w-full ">
                <Label className="text-left">
                  {t('form:input-label-password')}
                </Label>
                <Input
                  name="flextock_password"
                  onChange={(e) => handleFlextock(e, 'password')}
                  value={flextTockData?.password ? flextTockData?.password : ''}
                  // value={flextTockData['password'] ?  flextTockData['password'] : ''}

                  // error={t(errors.name?.message!)}
                  variant="outline"
                  className="mb-5"
                />
              </div>
              <div className=" w-full ">
                <Label className="text-left">
                  {t('form:input-label-apikey')}
                </Label>
                <Input
                  name="flextock_apikey"
                  onChange={(e) => handleFlextock(e, 'apikey')}
                  value={flextTockData?.apikey ? flextTockData?.apikey : ''}
                  // onChange={(e) => changeTaxInputs(e, 'name')}
                  // error={t(errors.name?.message!)}
                  variant="outline"
                  className="mb-5"
                />
              </div>
            </div>
          ) : (
            ''
          )}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('Labels for sell custom fields')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="flex">
            <div className="w-full flex mr-3">
              <Input
                onChange={(e) => handleCustomChange(e, 'custom_field_1')}
                name="custom_field_1"
                label={'Custom Field 1'}
                value={customFields.custom_field_1}
                className="w-full"
              />
              <div className="border flex justify-start w-full mt-6 rounded-md ml-2">
                <div className="flex ml-2">
                  <input
                    type="checkbox"
                    name="is_custom_field_1_required"
                    onChange={(e) => handleCustomChange(e, 'custom_field_1')}
                    checked={customFields.is_custom_field_1_required}
                  />
                  <Label className="pt-4 mr-5 pl-2">Is requried</Label>
                </div>
              </div>
            </div>
            <div className="w-full flex">
              <Input
                onChange={(e) => handleCustomChange(e, 'custom_field_2')}
                name="custom_field_2"
                label="Custom Field 2"
                value={customFields.custom_field_2}
                className="w-full"
              />
              <div className="border flex justify-start w-full mt-6 rounded-md ml-2">
                <div className="flex ml-2">
                  <input
                    type="checkbox"
                    name="is_custom_field_2_required"
                    onChange={(e) => handleCustomChange(e, 'custom_field_2')}
                    checked={customFields.is_custom_field_2_required}
                  />
                  <Label className="pt-4 mr-5 pl-2">Is requried</Label>
                </div>
              </div>
            </div>
          </div>
          <div className="flex mt-3">
            <div className="w-full mr-3 flex">
              <Input
                onChange={(e) => handleCustomChange(e, 'custom_field_3')}
                name="custom_field_3"
                label="Custom Field3"
                value={customFields.custom_field_3}
                className="w-full"
              />
              <div className="border flex justify-start w-full mt-6 rounded-md ml-2">
                <div className="flex ml-2">
                  <input
                    type="checkbox"
                    name="is_custom_field_3_required"
                    onChange={(e) => handleCustomChange(e, 'custom_field_3')}
                    checked={customFields.is_custom_field_3_required}
                  />
                  <Label className="pt-4 mr-5 pl-2">Is requried</Label>
                </div>
              </div>
            </div>
            <div className="w-full flex">
              <Input
                onChange={(e) => handleCustomChange(e, 'custom_field_4')}
                name="custom_field_4"
                label="Custom Field4"
                value={customFields.custom_field_4}
                className="w-full bg-transparent"
              />
              <div className="border flex justify-start w-full mt-6 rounded-md ml-2">
                <div className="flex ml-2">
                  <input
                    type="checkbox"
                    name="is_custom_field_4_required"
                    onChange={(e) => handleCustomChange(e, 'custom_field_4')}
                    checked={customFields.is_custom_field_4_required}
                  />
                  <Label className="pt-4 mr-5 pl-2">Is requried</Label>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="mb-4 text-end">
        <Button loading={updateLoader} onClick={handleSubmit}>
          {t('form:button-label-update')}
        </Button>
      </div>
    </>
  );
}
Settings.authenticate = {
  permissions: adminOnly,
};
Settings.Layout = AdminLayout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
