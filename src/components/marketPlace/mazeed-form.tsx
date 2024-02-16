import { useForm } from 'react-hook-form';
import { AttachmentInput, Category, Type, TypeSettingsInput } from '@/types';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import Card from '../common/card';
import { AiOutlineInbox } from 'react-icons/ai';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { BiDetail } from 'react-icons/bi';
import { MdOutlineDashboardCustomize } from 'react-icons/md';
import { AiOutlineDollarCircle } from 'react-icons/ai';
import { GiPoolTriangle } from 'react-icons/gi';
import { IoIosArrowUp } from 'react-icons/io';
import { ExpandLessIcon } from '@/components/icons/expand-less-icon';
import { ExpandMoreIcon } from '@/components/icons/expand-more-icon';
import logo from '../../../public/ignite-logo.png';
import { selectStyles } from '../ui/select/select.styles';
import Select, { createFilter } from 'react-select';
import Image from 'next/image';
import Description from '@/components/ui/description';
import woocommerce from '../../../public/image/woocom.png';
import shopify from '../../../public/image/shopify.png';
import Input from '@/components/ui/input';
import { Switch } from '@headlessui/react';
import Button from '@/components/ui/button';
import { AddShipping } from '@/services/Service';

import {
  AddingCouponsFunction,
  AddingFunction,
  UpdateUserFunction,
  GetFunction
} from '@/services/Service';
import { toast } from 'react-toastify';

export default function CreateOrUpdateTypeForm() {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const [section, setSection] = useState();
  const [updateLoader, setUpdateLoader] = useState(false);
  const [loadingData, setloadingData] = useState(false);
  const [locationID, setLocationID] = useState<any>();
  const [ListData, setListData] = useState([]);
  const [creatingLoading, setCreatingLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState({});
  const [locationDataArray, setLocationDataArray] = React.useState<any>([]);

  const [formData, setFormData] = useState({
  shopify: {
      id: '',
      provider: 'shopify',
      app_id: '',
      store_url:'',
      app_secret: '',
      callback_url: '',
      status: true,
    },
    woocommerce:{
      id:'',
      provider:'woocommerce',
      woocommerce_consumer_key:'',
      woocommerce_app_url:'',
      woocommerce_consumer_secret:'',
     // location_id:'',
      status: true,
    },
   
  });
  const items = [
    {
      title:'f-first-title',
      content:'f-first-content',
    },
    {
      title:'f-second-title',
      content: 'f-second-content'
        ,
    },
    {
      title:'f-third-title' ,
      content:'f-third-content'
        ,
    },
    {
      title:'f-fourth-title'
        ,
      content:'f-fourth-content'
        ,
    },
    {
      title: 'f-fifth-title',
      content:'f-fifth-content'
      ,
    },
  ];
  let expandIcon;
  if (Array.isArray(items) && items.length) {
    expandIcon = !isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />;
  }
  const handleFAQ = (e) => {
    setSection(e);
    setOpen(!isOpen);
  };
  React.useEffect(() => {
    setloadingData(true);
    GetFunction('/integrations').then((result) => {
      if (result) {
        const updatedFormData = { ...formData };

        // Iterate through the result.data array and update the formData state
        result.data.forEach((item) => {
          const { provider, credentials } = item;
          if (provider in updatedFormData) {
            if(provider == 'shopify'){
              updatedFormData[provider] = {
                ...updatedFormData[provider],
                store_url: credentials?.store_url,
                app_id: credentials?.app_id,
                app_secret: credentials?.app_secret,
                callback_url: credentials?.callback_url,
                status: item.status === 1,
                id: item.id,
              };
            }
          }
        });

        // Set the updated state
        setFormData(updatedFormData);

        setListData(result.data);
        setloadingData(false);
      }
    });

    GetFunction('/business-location').then((result) => {
      if(result){
        let ordersData = result.data.map((data, i) => {
          return {
            key: i,
            id: data.id,
            value: data.name,
            label: data.name,
          };
        });

        setLocationDataArray(ordersData);
      }
    })
  }, []);

  const handleIntegrationToggle = (section) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        status: !prevData[section].status,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUpdateLoader(true);
    // JSON-encode only the "credentials" part of the data
    const combinedFormData: any = {
      shopify: {
        id: formData.shopify.id,
        provider: formData.shopify.provider,
        credentials: JSON.stringify({
          store_url: formData.shopify.store_url,
          app_id: formData.shopify.app_id,
          app_secret: formData.shopify.app_secret,
          callback_url: formData.shopify.callback_url,
        }),
        status: formData.shopify.status ? 1 : 0,
      },
      woocommerce:{
        id:formData.woocommerce.id,
        provider:formData.woocommerce.provider,
        credentials: JSON.stringify({
        woocommerce_consumer_key:formData.woocommerce.woocommerce_consumer_key,
        woocommerce_app_url:formData.woocommerce.woocommerce_app_url,
        woocommerce_consumer_secret:formData.woocommerce.woocommerce_consumer_secret,
      //  location_id:formData.woocommerce.location_id
      }),
      status:formData.woocommerce.status ? 1:0,
    },

    };

    UpdateUserFunction(
      '/handle-integration-credentials',
      combinedFormData
    ).then((result) => {
      if (result.success) {
        setUpdateLoader(false);
        toast.success(result.message);
        if(result.redirectUrl){
          window.location.href = result.redirectUrl;
        }
      } else {
        toast.error(result.message);
        setUpdateLoader(false);
      }
    });
  };
  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [name]: value,
      },
    }));
  };

  const handleShopifyProduct = (event) => {
    event.preventDefault();
    setCreatingLoading(true);
    // setUpdateLoader(true);
    const data = {
     
    };

    AddShipping('/sync-products-to-shopify', data).then((result) => {
    //  console.log(result); return;
      if (result.status) {
        toast.success(result.message);

        // router.reload();  
      } else {
        toast.error(result.message);
      }
     setCreatingLoading(false);
    });
  };

  //button loading function
  
  const handleButtonClick=(e,action)=>{
   e.preventDefault()
    setButtonLoading((preState) => ({
      ...preState,
      [action]: true,
    }));
    const data = {
     
    };

    AddShipping('/sync-products-to-shopify', data).then((result) => {
      if (result.status) {
        toast.success(result.message);

        // router.reload();  
      } else {
        toast.error(result.message);
      }
     setButtonLoading({action:false})
    });
  }
  

  const OnChangeLocation = (e) => {
   // setProfitReport([]);
    setLocationID(e.label);
    console.log(e)
   
  };
  //console.log(formData.woocommerce)
 
  return (
    <>
      <form>

     <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('Shopify')}
            // details={t('form:domain-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

<Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="grid grid-cols-8 gap-4 mb-2">
              <div className="col-span-2 flex r items-center">
                <Image width={50} height={50} src={shopify} alt="" />
              </div>
              <div className="col-span-6">
                <div style={{ float: 'right' }}>
                  <Switch
                    checked={formData.shopify.status}
                    onChange={() => handleIntegrationToggle('shopify')}
                    className={`${
                      formData.shopify.status ? 'bg-accent' : 'bg-gray-300'
                    } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
                    dir="ltr"
                  >
                    <span className="sr-only">Enable </span>
                    <span
                      className={`${
                        formData.shopify.status ? 'translate-x-6' : 'translate-x-1'

                      } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
                    />
                  </Switch>
                </div>
                {/* {Google ? (
                <button
                  type="button"
                  className="bg-accent text-white p-2 rounded"
                  onClick={() => setGoogle('')}
                >
                  {t('common:uninstall-plugin')}
                </button>
              ) : (
               
              )} */}
              </div>
            </div>

            <Input
              name="store_url"
              placeholder="Enter Store Url"
              variant="outline"
              className="mb-5"
              value={formData.shopify.store_url}
              onInput={(e) => handleInputChange(e, 'shopify')}
            />
           
            <Input
              // label={t('form:input-label-google-analytic-id')}
              // {...register('google_analytics_id')}
              name="app_id"
              placeholder="Enter App Id"
              variant="outline"
              className="mb-5"
              value={formData.shopify.app_id}
              onInput={(e) => handleInputChange(e, 'shopify')}
              // value={googleCode}
            />
            <Input
              // label={t('form:input-label-google-analytic-id')}
              // {...register('google_analytics_id')}
              name="app_secret"
              placeholder="Enter Secret Key"
              variant="outline"
              className="mb-5"
              value={formData.shopify.app_secret}
              onInput={(e) => handleInputChange(e, 'shopify')}
              // value={googleCode}
            />
            <Input
              // label={t('form:input-label-google-analytic-id')}
              // {...register('google_analytics_id')}
              name="callback_url"
              placeholder="Enter Callback Url"
              variant="outline"
              className="mb-5"
              value={formData.shopify.callback_url}
              onInput={(e) => handleInputChange(e, 'shopify')}
              // value={formData.xero.callback_url}
              // onChange={(e) => handleInputChange(e, 'xero')}
              // value={googleCode}
              
            />
             {formData.shopify.status ? (
              <span style={{ float: 'right' }}>
                <Button
                
                  loading={creatingLoading}
                  className="rounded bg-accent p-2 text-white"
                  onClick={handleShopifyProduct}
                >
                  {t('common:sync-products')}
                </Button>
              </span>
            ) : (
              ''
            )}
        </Card>
        
          </div>
          <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('Woocommerce')}
            // details={t('form:domain-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

      <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="grid grid-cols-8 gap-4 mb-2">
              <div className="col-span-2 flex r items-center">
                <Image width={50} height={50} src={woocommerce} alt="" />
              </div>
              <div className="col-span-6">
                <div style={{ float: 'right' }}>
                  <Switch
                    checked={formData.shopify.status}
                    onChange={() => handleIntegrationToggle('shopify')}
                    className={`${
                      formData.shopify.status ? 'bg-accent' : 'bg-gray-300'
                    } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
                    dir="ltr"
                  >
                    <span className="sr-only">Enable </span>
                    <span
                      className={`${
                        formData.shopify.status ? 'translate-x-6' : 'translate-x-1'

                      } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
                    />
                  </Switch>
                </div>
                {/* {Google ? (
                <button
                  type="button"
                  className="bg-accent text-white p-2 rounded"
                  onClick={() => setGoogle('')}
                >
                  {t('common:uninstall-plugin')}
                </button>
              ) : (
               
              )} */}
              </div>
            </div>

            <Input
              name="woocommerce_app_url"
              placeholder="Enter App Url"
              variant="outline"
              className="mb-5"
              value={formData.woocommerce.woocommerce_app_url}
              onInput={(e) => handleInputChange(e, 'woocommerce')} 
            />
           
            <Input
              // label={t('form:input-label-google-analytic-id')}
              // {...register('google_analytics_id')}
              name="woocommerce_consumer_key"
              placeholder="Enter App Key"
              variant="outline"
              className="mb-5"
             value={formData.woocommerce.woocommerce_consumer_key}
             onInput={(e) => handleInputChange(e, 'woocommerce')}
              // value={googleCode}
            />
            <Input
              // label={t('form:input-label-google-analytic-id')}
              // {...register('google_analytics_id')}
              name="woocommerce_consumer_secret"
              placeholder="Enter Secret Key"
              variant="outline"
              className="mb-5"
              role='combobox'
              type='combobox'
              aria-haspopup='true'
              value={formData.woocommerce.woocommerce_consumer_secret}
              onInput={(e) => handleInputChange(e, 'woocommerce')}
              // value={googleCode}
            />
           <Select className='mb-5' name='location_id'   
            onChange={OnChangeLocation}
            getOptionLabel={(option: any) => option.label}
            getOptionValue={(option: any) => option.id}
            styles={selectStyles}
            options={locationDataArray}
            defaultValue={locationDataArray[0]} 
            // onChange={OnChangeLocation}
          
          />
            
             { formData.woocommerce.status ?  (
              <span style={{ float: 'right' }}>
                 <Button
                loading={buttonLoading['syncCategories']}
                className="rounded bg-accent p-2 text-white "
                onClick={(e) => handleButtonClick(e,'syncCategories')}
                style={{marginRight:3}}
              >
                {t('common:Sync-Categories')}
              </Button>
                <Button
                
                  loading={buttonLoading['syncProducts']}
                  className="rounded bg-accent p-2 text-white px-5 "
                  onClick={(e)=>handleButtonClick(e,'syncProducts')}
                  style={{marginRight:3}}
                >
                  {t('common:sync-products')}
                </Button>
                <Button
                
                loading={buttonLoading['syncOrders']}
                className="rounded bg-accent p-2 text-white"
                onClick={(e) => handleButtonClick(e,'syncOrders')}

              >
                {t('common:Sync-Order')}
              </Button>
              </span>
            ) : (
              ''
            )}
        </Card>
          </div>
          <div className="mb-4 text-end">
          <Button loading={updateLoader} onClick={handleSubmit}>
            {t('form:button-label-update')}
          </Button>
        </div>
          </form>
      {/* <Card className="mt-3">
        <h3 className=" font-semibold text-heading">
          {t('common:f-a-q')}
        </h3>
        <div>
          {items.map((item, index) => (
            <>
              <div className="my-2 ">
                <button
                  className="flex w-full rounded-t bg-slate-200 p-2 items-center border-0 text-base outline-none text-start  focus:ring-0"
                  onClick={() => {
                    handleFAQ(index);
                  }}
                >
                  <p className="flex-1 text-black">{t(`common:${item.title}`)}</p>
                  <span className='text-black'>{expandIcon}</span>
                </button>

                {isOpen && section === index && (
                  <div className="bg-stone-100 p-2 rounded-b ">
                    <section >{t(`common:${item.content}`)}</section>
                  </div>
                )}
              </div>
            </>
          ))}
        </div>
      </Card> */}
      {/* <Card className="mt-3">
        <h1 className="font-semibold">
          {t('common:ignite-setting-customization')}
          
        </h1>
      </Card> */}
    </>
  );
}
