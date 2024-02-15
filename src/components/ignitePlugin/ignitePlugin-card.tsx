import Input from '@/components/ui/input';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
// import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@/components/ui/button';
import { TrashIcon } from '@/components/icons/trash';
import Select from 'react-select';
import moment from 'moment';
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
import { UpdatingStoreSetting,AddingFunction, GetFunctionBDetail, GetFunction } from '@/services/Service';
import { toast } from 'react-toastify';
import React from 'react';
import { convertToHTML } from 'draft-convert';
import { convertFromHTML, EditorState } from 'draft-js';
import dynamic from 'next/dynamic';
import DrawerWrapper from '@/components/ui/drawer-wrapper';
import Drawer from '@/components/ui/drawer';
import { ContentState, convertToRaw } from 'draft-js';
import { EditorProps } from 'react-draft-wysiwyg';
import facebookPixel from '../../../public/image/facebook-pixel.png';
import googleAnalytic from '../../../public/image/google-analytic.png';
// import freshChat from '../../../public/image/freshChat.jpg';
import hotjar from '../../../public/image/hotjar.png';
import intercom from '../../../public/image/intercom.png';
import liveChat from '../../../public/image/liveChat.png';
import tawk from '../../../public/image/tawk.png';
import tidio from '../../../public/image/tidio.png';
import trengo from '../../../public/image/trengo.png';
// import zendesk from '../../../public/image/zendesk.jpg';
import drift from '../../../public/image/drift.png';
import adroll from '../../../public/image/adroll.png';
import amaze from '../../../public/image/amaze.png';
import tabbyImg from '../../../public/image/tabby.svg';
import clarityImg from '../../../public/image/clarity.png';
import Modal from '@/components/ui/modal/modal';
import cn from 'classnames';
import Label from '../ui/label';
// install @types/draft-js @types/react-draft-wysiwyg and @types/draft-js @types/react-draft-wysiwyg for types

const Editor = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
);
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Image from 'next/image';

type FormValues = {
  fb_tracking_pixel_id: any;
  google_analytics_id: any;
  location_id: any;
  intercom_live_chat: any;
  drift_live_chat: any;
  tawk_To_live_chat: any;
  tidio_live_chat: any;
  adroll: any;
  hotjar: any;
  re_amaze: any;
  zendesk_chat: any;
  fresh_chat: any;
  live_chat: any;
  trengo: any;
  tabby: any;
};

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
export default function IgnitePlugin(initialValues: any) {
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
  let form = new FormData();
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [creatingLoading, setCreatingLoading] = useState(false);
  const [pluginDrawer, setPluginDrawer] = useState<any>(false);
  const [amountValue, setAmountValue] = useState<any>();

  const [isFacebook, setIsFacebook] = useState(false);
  const [isGoogle, setIsGoogle] = useState(false);
  const [isIntercom, setIsIntercom] = useState(false);
  const [isDrift, setIsDrift] = useState(false);
  const [isTawk, setIsTawk] = useState(false);
  const [isTidio, setIsTidio] = useState(false);
  const [isAdroll, setIsAdroll] = useState(false);
  const [isHotjar, setIsHotjar] = useState(false);
  const [isAmaze, setIsAmaze] = useState(false);
  const [isZendesk, setIsZendesk] = useState(false);
  const [isFreshChat, setIsFreshChat] = useState(false);
  const [isLiveChat, setIsLiveChat] = useState(false);
  const [isTrengo, setIsTrengo] = useState(false);
  const [isTabby, setIsTabby] = useState(false);
  const [isClarity, setIsClarity] = useState(false);

  const [openDialog, setOpenDialog] = useState<any>(false);

  const [Facebook, setFacebook] = useState('');
  const [Google, setGoogle] = useState('');
  const [Intercom, setIntercom] = useState('');
  const [Drift, setDrift] = useState('');
  const [Tawk, setTawk] = useState('');
  const [Tidio, setTidio] = useState('');
  const [Adroll, setAdroll] = useState('');
  const [Hotjar, setHotjar] = useState('');
  const [Amaze, setAmaze] = useState('');
  const [Zendesk, setZendesk] = useState('');
  const [FreshChat, setFreshChat] = useState('');
  const [LiveChat, setLiveChat] = useState('');
  const [Trengo, setTrengo] = useState('');
  const [Tabby, setTabby] = useState<any>({});
  const [clarity, setClarity] = useState<any>('');
  const [locationId, setLocationId] = useState<any>('');
  const [id, setId] = useState<any>('');
  const [deleteClick, setDeleteClick] = useState<any>('');
  const [subscriptionsDetail, setSubscriptionsDetail] = useState<any>({});
  const [businessDetail,setBusinessDetail]= useState<any>({});
  const [subscriptionId, setSubscriptionId] = useState<any>(null);
  const [likeCardShow, setLikeCardShow] = useState(false);

  const [securityCode, setSecurityCode] = useState<any>('');
  const [password, setPassword] = useState<any>('');
  const [email, setEmail] = useState<any>('');
  const [deviceId, setDeviceId] = useState<any>('');
  const [phone, setPhone] = useState<any>('');

  const initializeValues = () => {
    if (initialValues) {
      setFacebook(initialValues?.data.fb_tracking_pixel_id);
      setGoogle(initialValues?.data.google_analytics_id);
      setIntercom(initialValues?.data.intercom_live_chat);
      setDrift(initialValues?.data.drift_live_chat);
      setTawk(initialValues?.data.tawk_To_live_chat);
      setTidio(initialValues?.data.tidio_live_chat);
      setAdroll(initialValues?.data.adroll);
      setHotjar(initialValues?.data.hotjar);
      setAmaze(initialValues?.data.re_amaze);
      setZendesk(initialValues?.data.zendesk_chat);
      setFreshChat(initialValues?.data.fresh_chat);
      setLiveChat(initialValues?.data.live_chat);
      setTrengo(initialValues?.data.trengo);
      setClarity(initialValues?.data.ms_clarity);
      setLocationId(initialValues?.data?.location_id);
      setId(initialValues?.data?.id);
      const tabbyValue: any = initialValues?.data?.tabby;
      if (tabbyValue) {
        setTabby(JSON.parse(tabbyValue));
      }
    }
  };

  useEffect(() => {
    const businessDetail = JSON.parse(
      localStorage.getItem('user_business_details')!
    );
    if (businessDetail) {
      setSubscriptionId(businessDetail?.subscriptions[0]?.id);
      setSubscriptionsDetail(businessDetail?.subscriptions[0]); //
    
      setBusinessDetail(businessDetail); 
    }
  },[]);
  useEffect(() => {
    initializeValues();
  }, [initialValues]);
  // const[customScript,setCustomScript]=useState<any>()

  // Function to check if any input is empty
  const isAnyInputEmpty = () => {
    return (
      !Google &&
      !Facebook &&
      !Intercom &&
      !Adroll &&
      !Drift &&
      !FreshChat &&
      !Hotjar &&
      !LiveChat &&
      !Amaze &&
      !Tawk &&
      !Tidio &&
      !Trengo &&
      !Zendesk &&
      !clarity &&
      !Tabby
    );
  };

  const onSubmit = (e) => {
    // let ID = initialValues.data.id;
    // console.log(locationId)
    e.preventDefault();
    form.append('id', id);
    form.append('fb_tracking_pixel_id', Facebook ? Facebook : '');
    form.append('google_analytics_id', Google ? Google : '');
    form.append('adroll', Adroll ? Adroll : '');
    form.append('drift_live_chat', Drift ? Drift : '');
    form.append('fresh_chat', FreshChat ? FreshChat : '');
    form.append('hotjar', Hotjar ? Hotjar : '');
    form.append('intercom_live_chat', Intercom ? Intercom : '');
    form.append('live_chat', LiveChat ? LiveChat : '');
    form.append('re_amaze', Amaze ? Amaze : '');
    form.append('tawk_To_live_chat', Tawk ? Tawk : '');
    form.append('tidio_live_chat', Tidio ? Tidio : '');
    form.append('trengo', Trengo ? Trengo : '');
    form.append('zendesk_chat', Zendesk ? Zendesk : '');
    form.append('location_id', locationId ? locationId : '');
    form.append('tabby', Tabby ? JSON.stringify(Tabby) : '');
    form.append('ms_clarity', clarity ? clarity : '');
    setCreatingLoading(true);
    UpdatingStoreSetting('/storefront', form).then((result) => {
      if (result.success) {
        toast.success(t('common:successfully-created'));
        setCreatingLoading(false);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(t(result.msg));
        setCreatingLoading(false);
      }
    });
  };

  const onSubmitted = (value) => {
    // e.preventDefault();

    // let ID = initialValues.data.id;
    // console.log(locationId)
    form.append('id', id);
    form.append(
      'fb_tracking_pixel_id',
      value !== 'Facebook' && Facebook ? Facebook : ''
    );
    form.append(
      'google_analytics_id',
      value !== 'Google' && Google ? Google : ''
    );
    form.append('adroll', value !== 'Adroll' && Adroll ? Adroll : '');
    form.append('drift_live_chat', value !== 'Drift' && Drift ? Drift : '');
    form.append(
      'fresh_chat',
      value !== 'FreshChat' && FreshChat ? FreshChat : ''
    );
    form.append('hotjar', value !== 'Hotjar' && Hotjar ? Hotjar : '');
    form.append(
      'intercom_live_chat',
      value !== 'Intercom' && Intercom ? Intercom : ''
    );
    form.append('live_chat', value !== 'LiveChat' && LiveChat ? LiveChat : '');
    form.append('re_amaze', value !== 'Amaze' && Amaze ? Amaze : '');
    form.append('tawk_To_live_chat', value !== 'Tawk' && Tawk ? Tawk : '');
    form.append('tidio_live_chat', value !== 'Tidio' && Tidio ? Tidio : '');
    form.append('trengo', value !== 'Trengo' && Trengo ? Trengo : '');
    form.append('zendesk_chat', value !== 'Zendesk' && Zendesk ? Zendesk : '');
    form.append('location_id', locationId ? locationId : '');
    form.append(
      'tabby',
      value !== 'Tabby' && Tabby ? JSON.stringify(Tabby) : ''
    );
    form.append('ms_clarity', value !== 'clarity' && clarity ? clarity : '');
    setCreatingLoading(true);
    UpdatingStoreSetting('/storefront', form).then((result) => {
      if (result.success) {
        toast.success(t('common:successfully-updated'));
        setCreatingLoading(false);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(t(result.msg));
        setCreatingLoading(false);
      }
    });
  };

  const onDeletePress = () => {
    // console.log(deleteClick)
    onSubmitted(deleteClick);
    setDeleteClick('');
    setOpenDialog(false);

    //     setLoading(true);
    //     let form = {
    //       slug: id,
    //     };
    //     DeleteFunctionWithUrl(`/custom-field/delete/${id}`).then((result) => {
    //       if (result.success) {
    //         toast.success(t('common:successfully-deleted'));
    //         setLoading(false);
    //         setOpenDialog(false);
    //         router.reload();
    //       } else {
    //         toast.error(t(result.message
    // ));
    //         setLoading(false);
    //       }
    //     })
  };
  // ----------------------------------------//

  const handleGooglePlugin = () => {
    setPluginDrawer(true);
    setIsGoogle(!isGoogle);
  };

  const closeFunctionPluginDrawer = () => {
    initializeValues();
    setPluginDrawer(false);
    setIsGoogle(false);
    setIsFacebook(false);
    setIsIntercom(false);
    setIsDrift(false);
    setIsTawk(false);
    setIsTidio(false);
    setIsAdroll(false);
    setIsHotjar(false);
    setIsFreshChat(false);
    setIsTrengo(false);
    setIsLiveChat(false);
    setIsTabby(false);
    setIsAmaze(false);
    setIsClarity(false);
    setIsZendesk(false);
  };

  // ----------------------------------------//

  const onChangeAmmount = (e) => {
    setAmountValue(e.target.value);
  };

  const handleFacebookPlugin = () => {
    setPluginDrawer(true);
    setIsFacebook(!isFacebook);
  };

  const handleAdroll = () => {
    setPluginDrawer(true);
    setIsAdroll(!isAdroll);
  };
  const handleAmaze = () => {
    setIsAmaze(!isAmaze);
    setPluginDrawer(true);
  };
  const handleDrift = () => {
    setIsDrift(!isDrift);
    setPluginDrawer(true);
  };

  const handleFreshChat = () => {
    setIsFreshChat(!isFreshChat);
    setPluginDrawer(true);
  };
  const handleHotJar = () => {
    setIsHotjar(!isHotjar);
    setPluginDrawer(true);
  };
  const handleIntercom = () => {
    setIsIntercom(!isIntercom);
    setPluginDrawer(true);
  };
  const handleLiveChat = () => {
    setIsLiveChat(!isLiveChat);
    setPluginDrawer(true);
  };
  const handleTawk = () => {
    setIsTawk(!isTawk);
    setPluginDrawer(true);
  };
  const handleTidio = () => {
    setIsTidio(!isTidio);
    setPluginDrawer(true);
  };
  const handleTrengo = () => {
    setIsTrengo(!isTrengo);
    setPluginDrawer(true);
  };
  const handleTabby = () => {
    setIsTabby(!isTabby);
    setPluginDrawer(true);
  };
  const handleClarity = () => {
    setIsClarity(!isClarity);
    setPluginDrawer(true);
  };
  const handleZendesk = () => {
    setIsZendesk(!isZendesk);
    setPluginDrawer(true);
  };
  const handleTabbyInput = (event) => {
    const { name, value } = event.target;

    setTabby((prevTabby) => ({
      ...prevTabby,
      [name]: value,
    }));
  };
  const handleClarityInput = (e) => {
    setClarity(e.target.value);
  };
  const Style = {
    border: '2px solid black',
    color: 'black',
    backgroundColor: 'white',
  };
  const handleEnable = (input) => {
    form.append('subscription_id',subscriptionId);
    if(input === 'shopify'){
      const { shopify } = subscriptionsDetail?.shopify;
      if(shopify===1){
        form.append('shopify','1');
        handleSubmitEnableDisable(form)
      }else{
        toast.error(t('common:upgrade-plan'));
      // router.push('/updateSubscription');
      }
    }
    else if (input === 'enable_variable_products') {
      const { variable_products } = subscriptionsDetail?.package;
    
      if(variable_products===0){
        form.append('enable_variable_products','1');
        handleSubmitEnableDisable(form)
      }else{
        // Upgrade your package to access
        toast.error(t('common:upgrade-plan'));
      router.push('/updateSubscription');
      }
    } else if (input === 'enable_discounts') {
      const { discounts } = subscriptionsDetail?.package;
      if(discounts===1){
        form.append('enable_discounts','1');
        handleSubmitEnableDisable(form)
      }else{
          toast.error(t('common:upgrade-plan'));
      // router.push('/updateSubscription');
       }
    } else if (input === 'enable_roles_management') {
      const { roles_management } = subscriptionsDetail?.package;

      if(roles_management===1){
        form.append('enable_roles_management','1');
        handleSubmitEnableDisable(form)
      }else{
          toast.error(t('common:upgrade-plan'));
      // router.push('/updateSubscription');
       }
 
    } else if (input === 'enable_sell_products_by_weight') {
      const { sell_products_by_weight } = subscriptionsDetail?.package;
      if(sell_products_by_weight===1){
        form.append('enable_sell_products_by_weight','1');
        handleSubmitEnableDisable(form)
      }else{
          toast.error(t('common:upgrade-plan'));
      // router.push('/updateSubscription');
       }
 
    } else if (input === 'enable_size_chart') {
      const { size_charts } = subscriptionsDetail?.package;
      if(size_charts===1){
        form.append('enable_size_chart','1');
        handleSubmitEnableDisable(form)
      }else{
          toast.error(t('common:upgrade-plan'));
      // router.push('/updateSubscription');
       }
 
    } else if (input === 'enable_custom_field') {
      const { custom_fields } = subscriptionsDetail?.package;
      if(custom_fields===1){
        form.append('enable_custom_field','1');
        handleSubmitEnableDisable(form)
      }else{
          toast.error(t('common:upgrade-plan'));
      // router.push('/updateSubscription');
       }
  
    } else if (input === 'enable_product_position') {
    
      const { product_position } = subscriptionsDetail?.package;
      if(product_position===1){
        form.append('enable_product_position','1');
        handleSubmitEnableDisable(form)
      }else{
          toast.error(t('common:upgrade-plan'));
      // router.push('/updateSubscription');
       }
    } else if (input === 'booking') {
    
      const { booking } = subscriptionsDetail?.package;
      if(booking===1){
        form.append('booking','1');
        handleSubmitEnableDisable(form)
      }else{
          toast.error(t('common:upgrade-plan'));
      // router.push('/updateSubscription');
       }
    } else if (input === 'likecard') {
      const { likecard } = subscriptionsDetail?.package;
      if(likecard===1){
        setLikeCardShow(true);
        setPluginDrawer(true);
      }else{
          toast.error(t('common:upgrade-plan'));
      // router.push('/updateSubscription');
       }
     
    } else if (input === 'purchase') {
      const { purchase } = subscriptionsDetail?.package;
      if(purchase===1){
        form.append('purchase','1');
        handleSubmitEnableDisable(form)
      }else{
          toast.error(t('common:upgrade-plan'));
      // router.push('/updateSubscription');
       }
    } else {
      console.log('No specific feature is enabled.');
    }
  };
  const handleDisable = (input) => {
    form.append('subscription_id',subscriptionId);
    if(input === 'shopify'){
      const { shopify } = subscriptionsDetail?.shopify;
      if(shopify===1){
        form.append('shopify','0');
        handleSubmitEnableDisable(form)
      }else{
        toast.error(t('common:upgrade-plan'));
      // router.push('/updateSubscription');
      }
    }
    else if (input === 'enable_variable_products') {
      const { variable_products } = subscriptionsDetail?.package;
      if(variable_products===1){
        form.append('enable_variable_products','0');
        handleSubmitEnableDisable(form)
      }else{
        toast.error(t('common:upgrade-plan'));
      // router.push('/updateSubscription');
      }
    } else if (input === 'enable_discounts') {
      const { discounts } = subscriptionsDetail?.package;
      if(discounts===1){
        form.append('enable_discounts','0');
        handleSubmitEnableDisable(form)
      }else{
          toast.error(t('common:upgrade-plan'));
      // router.push('/updateSubscription');
       }
    } else if (input === 'enable_roles_management') {
      const { roles_management } = subscriptionsDetail?.package;
      if(roles_management===1){
        form.append('enable_roles_management','0');
        handleSubmitEnableDisable(form)
      }else{
          toast.error(t('common:upgrade-plan'));
      // router.push('/updateSubscription');
       }
 
    } else if (input === 'enable_sell_products_by_weight') {
      const { sell_products_by_weight } = subscriptionsDetail?.package;
      if(sell_products_by_weight===1){
        form.append('enable_sell_products_by_weight','0');
        handleSubmitEnableDisable(form)
      }else{
          toast.error(t('common:upgrade-plan'));
      // router.push('/updateSubscription');
       }
 
    } else if (input === 'enable_size_chart') {
      const { size_charts } = subscriptionsDetail?.package;
      if(size_charts===1){
        form.append('enable_size_chart','0');
        handleSubmitEnableDisable(form)
      }else{
          toast.error(t('common:upgrade-plan'));
      // router.push('/updateSubscription');
       }
 
    } else if (input === 'enable_custom_field') {
      const { custom_fields } = subscriptionsDetail?.package;
      if(custom_fields===1){
        form.append('enable_custom_field','0');
        handleSubmitEnableDisable(form)
      }else{
          toast.error(t('common:upgrade-plan'));
      // router.push('/updateSubscription');
       }
  
    } else if (input === 'enable_product_position') {
    
      const { product_position } = subscriptionsDetail?.package;
      if(product_position===1){
        form.append('enable_product_position','0');
        handleSubmitEnableDisable(form)
      }else{
          toast.error(t('common:upgrade-plan'));
      // router.push('/updateSubscription');
       }
    } else if (input === 'booking') {
    
      const { booking } = subscriptionsDetail?.package;
      if(booking===1){
        form.append('booking','0');
        handleSubmitEnableDisable(form)
      }else{
          toast.error(t('common:upgrade-plan'));
      // router.push('/updateSubscription');
       }
    } else if (input === 'likecard') {
      const { likecard } = subscriptionsDetail?.package;
      if(likecard===1){
      const likeCardData =  businessDetail?.likecard;
      if(likeCardData){
        try {
          const  parseLikeCardData =JSON.parse(likeCardData);
          if(parseLikeCardData){
            setSecurityCode(parseLikeCardData?.securityCode)
            setPassword(parseLikeCardData?.password);
            setEmail(parseLikeCardData?.email);
            setDeviceId(parseLikeCardData?.deviceId);
            setPhone(parseLikeCardData?.phone);
            setLikeCardShow(true);
            setPluginDrawer(true);
          }else{
            setLikeCardShow(true);
            setPluginDrawer(true);
          }
        } catch (error) {
          console.log(error);
        }
  
      }
        // return;
        // setLikeCardShow(true);
        // setPluginDrawer(true);

      }else{
          toast.error(t('common:upgrade-plan'));
      // router.push('/updateSubscription');
       }
     
    } else if (input === 'purchase') {
      const { purchase } = subscriptionsDetail?.package;
      if(purchase===1){
        form.append('purchase','0');
        handleSubmitEnableDisable(form)
      }else{
          toast.error(t('common:upgrade-plan'));
      // router.push('/updateSubscription');
       }
    } else {
      console.log('No specific feature is enabled.');
    }
  };

  const handleSubmitEnableDisable = (form) => {
   
    setCreatingLoading(true);
    AddingFunction('/enable_subscription_addons', form).then((result) => {
      if (result.status) {
        GetFunction('/business-details',).then((result) => {
          localStorage.setItem(
            'business_details',
            JSON.stringify(result.data.currency)
          );
    
          let currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
          localStorage.setItem('login_time_stamp', currentDate);
    
          localStorage.setItem(
            'user_business_details',
            JSON.stringify(result.data)
          );
          localStorage.setItem('business_name', result.data.name);
          toast.success(t('common:successfully-updated'));
          setCreatingLoading(false);
        
         setTimeout(() => {
          // router.push(router.pathname);    
          window.location.reload();
          }, 1000); 
        });
     
      } else {
        toast.error(t(result.msg));
        setCreatingLoading(false);
      }
    });
  };

  const onSubmitLikeCard = ()=>{
    form.append('subscription_id',subscriptionId);
    const inputdate = {
      securityCode,
      password,
      email,
      deviceId,
      phone
    }
    form.append('likecard',JSON.stringify(inputdate));
 
    handleSubmitEnableDisable(form);
  }

  return (
    <>
      <form
      // onSubmit={(onSubmit)}
      >
        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('form:input-label-google-analytic-id')}
            // details={t('form:domain-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="mb-2 grid grid-cols-8 gap-4">
              <div className="col-span-2 flex items-center justify-center">
                <Image width={100} height={100} src={googleAnalytic} alt="" />
              </div>
              <div className="col-span-6">
                <h3 className="font-semibold">{t('common:google-analytic')}</h3>
                <p className="">{t('common:google-analytic-description')}</p>
                {initialValues?.data.google_analytics_id ? (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-black"
                    style={Style}
                    onClick={(e) => {
                      setDeleteClick('Google');
                      setOpenDialog(true);
                      // setGoogle('');
                      // onSubmitted(e, 'Google');
                    }}
                  >
                    {t('common:uninstall-plugin')}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    onClick={handleGooglePlugin}
                  >
                    {t('common:install-plugin')}
                  </button>
                )}
              </div>
            </div>
            {/* {(isGoogle || initialValues?.data.google_analytics_id) && (
            <Input
              // label={t('form:input-label-google-analytic-id')}
              // {...register('google_analytics_id')}
              name="googleAnalytic"
              value={Google}
              placeholder="Enter Tracking ID"
              variant="outline"
              className="mb-5"
              // value={googleCode}
              onChange={(e) => {
                setGoogle(e.target.value);
              }}
            />
          )} */}
          </Card>
        </div>
        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('form:input-label-facebook-pixel-id')}
            // details={t('form:domain-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="mb-2 grid grid-cols-8 gap-4">
              <div className="col-span-2 flex items-center justify-center ">
                <Image
                  width={100}
                  height={100}
                  src={facebookPixel}
                  className="rounded"
                  alt=""
                />
              </div>
              <div className="col-span-6">
                <h3 className="font-semibold"> {t('common:facebook-pixel')}</h3>
                <p className="">{t('common:facebook-pixel-description')}</p>
                {initialValues?.data.fb_tracking_pixel_id ? (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    style={Style}
                    onClick={(e) => {
                      setDeleteClick('Facebook');
                      setOpenDialog(true);
                      // setFacebook('');
                      // onSubmitted(e, 'Facebook');
                    }}
                  >
                    {t('common:uninstall-plugin')}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    onClick={handleFacebookPlugin}
                  >
                    {t('common:install-plugin')}
                  </button>
                )}
              </div>
            </div>
            {/* {(isFacebook || initialValues?.data.fb_tracking_pixel_id) && (
            <Input
              // label={t('form:input-label-facebook-pixel-id')}
              // {...register('fb_tracking_pixel_id')}
              name="facebookAnalytic"
              placeholder="Enter Pixel ID"
              variant="outline"
              className="mb-5"
              value={Facebook}
              onChange={(e) => {
                setFacebook(e.target.value);
              }}
            />
          )} */}
          </Card>
        </div>
        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('form:input-label-intercom-live-chat')}
            // details={t('form:domain-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="mb-2 grid grid-cols-8 gap-4">
              <div className="col-span-2 flex items-center justify-center ">
                <Image
                  width={100}
                  height={100}
                  src={intercom}
                  className="rounded"
                  alt=""
                />
              </div>
              <div className="col-span-6">
                <h3 className="font-semibold"> {t('common:intercom-chat')}</h3>
                <p className="">{t('common:intercom-chat-description')}</p>
                {initialValues?.data.intercom_live_chat ? (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    style={Style}
                    onClick={(e) => {
                      setDeleteClick('Intercom');
                      setOpenDialog(true);
                      // setIntercom('');
                      // onSubmitted(e, 'Intercom');
                    }}
                  >
                    {t('common:uninstall-plugin')}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    onClick={handleIntercom}
                  >
                    {t('common:install-plugin')}
                  </button>
                )}
              </div>
            </div>
            {/* {(isIntercom || initialValues?.data.intercom_live_chat) && (
            <Input
              // label={t('form:input-label-facebook-pixel-id')}
              // {...register('intercom_live_chat')}
              name="intercom"
              placeholder="Enter App ID"
              variant="outline"
              className="mb-5"
              value={Intercom}
              onChange={(e) => {
                setIntercom(e.target.value);
              }}
            />
          )} */}
          </Card>
        </div>
        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('form:input-label-drift-live-chat')}
            // details={t('form:domain-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="mb-2 grid grid-cols-8 gap-4">
              <div className="col-span-2 flex items-center justify-center ">
                <Image
                  width={100}
                  height={100}
                  src={drift}
                  className="rounded"
                  alt=""
                />
              </div>
              <div className="col-span-6">
                <h3 className="font-semibold"> {t('common:drift-chat')}</h3>
                <p className="">{t('common:drift-chat-description')}</p>
                {initialValues?.data.drift_live_chat ? (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    style={Style}
                    onClick={(e) => {
                      setDeleteClick('Drift');
                      setOpenDialog(true);
                      // setDrift('');
                      // onSubmitted(e, 'Drift');
                    }}
                  >
                    {t('common:uninstall-plugin')}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    onClick={handleDrift}
                  >
                    {t('common:install-plugin')}
                  </button>
                )}
              </div>
            </div>
            {/* {(isDrift || initialValues?.data.drift_live_chat) && (
            <Input
              // label={t('form:input-label-facebook-pixel-id')}
              // {...register('drift_live_chat')}
              name="drift"
              variant="outline"
              className="mb-5"
              placeholder="Enter Secret Key"
              value={Drift}
              onChange={(e) => {
                setDrift(e.target.value);
              }}
            />
          )} */}
          </Card>
        </div>
        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('form:input-label-tawk-live-chat')}
            // details={t('form:domain-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="mb-2 grid grid-cols-8 gap-4">
              <div className="col-span-2 flex items-center justify-center ">
                <Image
                  width={100}
                  height={100}
                  src={tawk}
                  className="rounded"
                  alt=""
                />
              </div>
              <div className="col-span-6">
                <h3 className="font-semibold"> {t('common:tawk-chat')}</h3>
                <p className="">{t('common:tawk-chat-description')}</p>
                {initialValues?.data.tawk_To_live_chat ? (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    style={Style}
                    onClick={(e) => {
                      setDeleteClick('Tawk');
                      setOpenDialog(true);
                      // setTawk('');
                      // onSubmitted(e, 'Tawk');
                    }}
                  >
                    {t('common:uninstall-plugin')}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    onClick={handleTawk}
                  >
                    {t('common:install-plugin')}
                  </button>
                )}
              </div>
            </div>
            {/* {(isTawk || initialValues?.data.tawk_To_live_chat) && (
            <Input
              // label={t('form:input-label-facebook-pixel-id')}
              // {...register('tawk_To_live_chat')}
              name="tawk"
              placeholder="Enter Tawk Api"
              variant="outline"
              className="mb-5"
              value={Tawk}
              onChange={(e) => {
                setTawk(e.target.value);
              }}
            />
          )} */}
          </Card>
        </div>
        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('form:input-label-tidio-live-chat')}
            // details={t('form:domain-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="mb-2 grid grid-cols-8 gap-4">
              <div className="col-span-2 flex items-center justify-center ">
                <Image
                  width={100}
                  height={100}
                  src={tidio}
                  className="rounded"
                  alt=""
                />
              </div>
              <div className="col-span-6">
                <h3 className="font-semibold">{t('common:tidio-chat')}</h3>
                <p className="">{t('common:tidio-chat-description')}</p>
                {initialValues?.data.tidio_live_chat ? (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    style={Style}
                    onClick={(e) => {
                      setDeleteClick('Tidio');
                      setOpenDialog(true);
                      // setTidio('');
                      // onSubmitted(e, 'Tidio');
                    }}
                  >
                    {t('common:uninstall-plugin')}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    onClick={handleTidio}
                  >
                    {t('common:install-plugin')}
                  </button>
                )}
              </div>
            </div>
            {/* {(isTidio || initialValues?.data.tidio_live_chat) && (
            <Input
              // label={t('form:input-label-facebook-pixel-id')}
              // {...register('tidio_live_chat')}
              name="tidio"
              placeholder="Enter Tidio code"
              variant="outline"
              className="mb-5"
              value={Tidio}
              onChange={(e) => {
                setTidio(e.target.value);
              }}
            />
          )} */}
          </Card>
        </div>
        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('form:input-label-adroll')}
            // details={t('form:domain-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="mb-2 grid grid-cols-8 gap-4">
              <div className="col-span-2 flex items-center justify-center ">
                <Image
                  width={100}
                  height={100}
                  src={adroll}
                  className="rounded"
                  alt=""
                />
              </div>
              <div className="col-span-6">
                <h3 className="font-semibold"> {t('common:adroll')}</h3>
                <p className="">{t('common:adroll-description')}</p>
                {initialValues?.data.adroll ? (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    style={Style}
                    onClick={(e) => {
                      setDeleteClick('Adroll');
                      setOpenDialog(true);
                      // setAdroll('');
                      // onSubmitted(e, 'Adroll');
                    }}
                  >
                    {t('common:uninstall-plugin')}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    onClick={handleAdroll}
                  >
                    {t('common:install-plugin')}
                  </button>
                )}
              </div>
            </div>
            {/* {(isAdroll || initialValues?.data.adroll) && (
            <Input
              // label={t('form:input-label-facebook-pixel-id')}
              // {...register('adroll')}
              name="adroll"
              placeholder="Enter Adroll Pixel Id"
              variant="outline"
              className="mb-5"
              value={Adroll}
              onChange={(e) => {
                setAdroll(e.target.value);
              }}
            />
          )} */}
          </Card>
        </div>
        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('form:input-label-hotjar')}
            // details={t('form:domain-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="mb-2 grid grid-cols-8 gap-4">
              <div className="col-span-2 flex items-center justify-center ">
                <Image
                  width={100}
                  height={100}
                  src={hotjar}
                  className="rounded"
                  alt=""
                />
              </div>
              <div className="col-span-6">
                <h3 className="font-semibold"> {t('common:hotjar')}</h3>
                <p className="">{t('common:hotjar-description')}</p>
                {initialValues?.data.hotjar ? (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    style={Style}
                    onClick={(e) => {
                      setDeleteClick('Hotjar');
                      setOpenDialog(true);
                      // setHotjar('');
                      // onSubmitted(e, 'Hotjar');
                    }}
                  >
                    {t('common:uninstall-plugin')}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    onClick={handleHotJar}
                  >
                    {t('common:install-plugin')}
                  </button>
                )}
              </div>
            </div>
            {/* {(isHotjar || initialValues?.data.hotjar) && (
            <Input
              // label={t('form:input-label-facebook-pixel-id')}
              // {...register('hotjar')}
              name="hotjar"
              placeholder="Enter Hotjar Tracking Code"
              variant="outline"
              className="mb-5"
              value={Hotjar}
              onChange={(e) => {
                setHotjar(e.target.value);
              }}
            />
          )} */}
          </Card>
        </div>
        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('form:input-label-amaze')}
            // details={t('form:domain-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="mb-2 grid grid-cols-8 gap-4">
              <div className="col-span-2 flex items-center justify-center ">
                <Image
                  width={100}
                  height={100}
                  src={amaze}
                  className="rounded"
                  alt=""
                />
              </div>
              <div className="col-span-6">
                <h3 className="font-semibold"> {t('common:amaze')}</h3>
                <p className="">{t('common:amaze-description')}</p>
                {initialValues?.data.re_amaze ? (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    style={Style}
                    onClick={(e) => {
                      setDeleteClick('Amaze');
                      setOpenDialog(true);
                      // setAmaze('');
                      // onSubmitted(e, 'Amaze');
                    }}
                  >
                    {t('common:uninstall-plugin')}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    onClick={handleAmaze}
                  >
                    {t('common:install-plugin')}
                  </button>
                )}
              </div>
            </div>
            {/* {(isAmaze || initialValues?.data.re_amaze) && (
            <Input
              // label={t('form:input-label-facebook-pixel-id')}
              // {...register('re_amaze')}
              name="amaze"
              placeholder="Enter Brand Subdomain"
              variant="outline"
              className="mb-5"
              value={Amaze}
              onChange={(e) => {
                setAmaze(e.target.value);
              }}
            />
          )} */}
          </Card>
        </div>
        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('form:input-label-zendesk-chat')}
            // details={t('form:domain-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="mb-2 grid grid-cols-8 gap-4">
              <div className="col-span-2 flex items-center justify-center ">
                <img
                  width={100}
                  height={100}
                  src="/image/zendesk.jpg"
                  className="rounded"
                  alt=""
                />
              </div>
              <div className="col-span-6">
                <h3 className="font-semibold">{t('common:zendesk')}</h3>
                <p className="">{t('common:zendesk-chat-description')}</p>
                {initialValues?.data.zendesk_chat ? (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    style={Style}
                    onClick={(e) => {
                      setDeleteClick('Zendesk');
                      setOpenDialog(true);
                      // setZendesk('');
                      // onSubmitted(e, 'Zendesk');
                    }}
                  >
                    {t('common:uninstall-plugin')}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    onClick={handleZendesk}
                  >
                    {t('common:install-plugin')}
                  </button>
                )}
              </div>
            </div>
            {/* {(isZendesk || initialValues?.data.zendesk_chat) && (
            <Input
              // label={t('form:input-label-facebook-pixel-id')}
              // {...register('zendesk_chat')}
              name="zendesk"
              placeholder="Enter Snippet Key"
              variant="outline"
              className="mb-5"
              value={Zendesk}
              onChange={(e) => {
                setZendesk(e.target.value);
              }}
            />
          )} */}
          </Card>
        </div>
        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('form:input-label-fresh-chat')}
            // details={t('form:domain-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="mb-2 grid grid-cols-8 gap-4">
              <div className="col-span-2 flex items-center justify-center ">
                <img
                  width={100}
                  height={100}
                  src="/image/freshChat.jpg"
                  className="rounded"
                  alt=""
                />
              </div>
              <div className="col-span-6">
                <h3 className="font-semibold"> {t('common:fresh')}</h3>
                <p className="">{t('common:fresh-chat-description')}</p>
                {initialValues?.data.fresh_chat ? (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    style={Style}
                    onClick={(e) => {
                      setDeleteClick('FreshChat');
                      setOpenDialog(true);
                      // setFreshChat('');
                      // onSubmitted(e, 'FreshChat');
                    }}
                  >
                    {t('common:uninstall-plugin')}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    onClick={handleFreshChat}
                  >
                    {t('common:install-plugin')}
                  </button>
                )}
              </div>
            </div>
            {/* {(isFreshChat || initialValues?.data.fresh_chat) && (
            <Input
              // label={t('form:input-label-facebook-pixel-id')}
              // {...register('fresh_chat')}
              name="freshChat"
              placeholder="Enter Unique ID"
              variant="outline"
              className="mb-5"
              value={FreshChat}
              onChange={(e) => {
                setFreshChat(e.target.value);
              }}
            />
          )} */}
          </Card>
        </div>
        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('form:input-label-live-chat')}
            // details={t('form:domain-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="mb-2 grid grid-cols-8 gap-4">
              <div className="col-span-2 flex items-center justify-center ">
                <Image
                  width={100}
                  height={100}
                  src={liveChat}
                  className="rounded"
                  alt=""
                />
              </div>
              <div className="col-span-6">
                <h3 className="font-semibold"> {t('common:live')}</h3>
                <p className="">{t('common:live-chat-description')}</p>
                {initialValues?.data.live_chat ? (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    style={Style}
                    onClick={(e) => {
                      setDeleteClick('LiveChat');
                      setOpenDialog(true);
                      // setLiveChat('');
                      // onSubmitted(e, 'LiveChat');
                    }}
                  >
                    {t('common:uninstall-plugin')}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    onClick={handleLiveChat}
                  >
                    {t('common:install-plugin')}
                  </button>
                )}
              </div>
            </div>
            {/* {(isLiveChat || initialValues?.data.live_chat) && (
            <Input
              // label={t('form:input-label-facebook-pixel-id')}
              // {...register('live_chat')}
              name="liveChat"
              placeholder="Enter License Number"
              variant="outline"
              className="mb-5"
              value={LiveChat}
              onChange={(e) => {
                setLiveChat(e.target.value);
              }}
            />
          )} */}
          </Card>
        </div>
        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('form:input-label-trengo')}
            // details={t('form:domain-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="mb-2 grid grid-cols-8 gap-4">
              <div className="col-span-2 flex items-center justify-center ">
                <Image
                  width={100}
                  height={100}
                  src={trengo}
                  className="rounded"
                  alt=""
                />
              </div>
              <div className="col-span-6">
                <h3 className="font-semibold">{t('common:rengo')}</h3>
                <p className="">{t('common:rengo-description')} </p>
                {initialValues?.data.trengo ? (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    style={Style}
                    onClick={(e) => {
                      setDeleteClick('Trengo');
                      setOpenDialog(true);
                      // setTrengo('');
                      // onSubmitted(e, 'Trengo');
                    }}
                  >
                    {t('common:uninstall-plugin')}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    onClick={handleTrengo}
                  >
                    {t('common:install-plugin')}
                  </button>
                )}
              </div>
            </div>
            {/* {(isTrengo || initialValues?.data.trengo) && (
            <Input
              // label={t('form:input-label-facebook-pixel-id')}
              // {...register('trengo')}
              name="trengo"
              placeholder="Enter Key"
              variant="outline"
              className="mb-5"
              value={Trengo}
              onChange={(e) => {
                setTrengo(e.target.value);
              }}
            />
          )} */}
          </Card>
        </div>
        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('form:input-label-tabby')}
            // details={t('form:domain-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="mb-2 grid grid-cols-8 gap-4">
              <div className="col-span-2 flex items-center justify-center ">
                <Image
                  width={100}
                  height={100}
                  src={tabbyImg}
                  className="rounded"
                  alt=""
                />
              </div>
              <div className="col-span-6">
                <h3 className="font-semibold">{t('common:tabby')}</h3>
                <p className="">{t('common:tabby-description')} </p>
                {initialValues?.data.trengo ? (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    style={Style}
                    // onClick={() =>
                    //   setTabby({ merchant_code: '', public_key: '' })
                    // }
                    onClick={(e) => {
                      setDeleteClick('Tabby');
                      setOpenDialog(true);
                      // setTabby({ merchant_code: '', public_key: '' });
                      // onSubmitted(e, 'Tabby');
                    }}
                  >
                    {t('common:uninstall-plugin')}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    onClick={handleTabby}
                  >
                    {t('common:install-plugin')}
                  </button>
                )}
              </div>
            </div>
            {/* {(isTabby || Tabby?.merchant_code || Tabby?.public_key) && (
            <>
              <Input
                // label={t('form:input-label-facebook-pixel-id')}
                // {...register('tabby.merchant_code')}
                name={'merchant_code'}
                placeholder="Merchant Code"
                variant="outline"
                className="mb-5"
                value={Tabby?.merchant_code}
                onChange={handleTabbyInput}
              />
              <Input
                // label={t('form:input-label-facebook-pixel-id')}
                // {...register('tabby.public_key')}
                name={'public_key'}
                placeholder="Public Key"
                variant="outline"
                className="mb-5"
                value={Tabby?.public_key}
                onChange={handleTabbyInput}
              />
            </>
          )} */}
          </Card>
        </div>

        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('form:input-label-clarity')}
            // details={t('form:domain-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="mb-2 grid grid-cols-8 gap-4">
              <div className="col-span-2 flex items-center justify-center ">
                <Image
                  src={clarityImg}
                  width={100}
                  height={100}
                  className="rounded"
                  alt=""
                />
              </div>
              <div className="col-span-6">
                <h3 className="font-semibold">{t('common:clarity')}</h3>
                <p className="">{t('common:clarity-description')} </p>
                {/* <h3 className="font-semibold">{t('Clarity')}</h3> */}
                {/* <p className="">
                Clarity is a free, easy-to-use tool that captures how real
                people actually use your site. Setup is easy and you will start
                getting data in minutes.
              </p> */}
                {initialValues?.data.ms_clarity ? (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    style={Style}
                    // onClick={() => setClarity('')}
                    onClick={(e) => {
                      setDeleteClick('clarity');
                      setOpenDialog(true);
                      // setClarity('');
                      // onSubmitted(e, 'clarity');
                    }}
                  >
                    {t('common:uninstall-plugin')}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    onClick={handleClarity}
                  >
                    {t('common:install-plugin')}
                  </button>
                )}
              </div>
            </div>
            {/* {isClarity && (
            <>
              <Input
                name={'ms_clarity'}
                placeholder="Clarity Key"
                variant="outline"
                className="mb-5"
                value={clarity}
                onChange={handleClarityInput}
              />
            </>
          )} */}
          </Card>
        </div>

        {/* --------------------------------- */} 
        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('form:input-label-shopify')}
            // details={t('form:domain-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="mb-2 grid grid-cols-8 gap-4">
              <div className="col-span-2 flex items-center justify-center ">
                <Image
                  src="/image/shopify.png"
                  width={100}
                  height={100}
                  className="rounded"
                  alt=""
                />
              </div>
              <div className="col-span-6">
                <h3 className="font-semibold">
                  {t('common:shopify')}
                </h3>
                <p className="">{t('common:shopify_desc')} </p>
                {/* <h3 className="font-semibold">{t('Clarity')}</h3> */}
                {/* <p className="">
                Clarity is a free, easy-to-use tool that captures how real
                people actually use your site. Setup is easy and you will start
                getting data in minutes.
              </p> */}
                {subscriptionsDetail?.shopify ? (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    style={Style}
                    // onClick={() => setClarity('')}
                    onClick={() => {
                      handleDisable('shopify');
                    }}
                  >
                    {t('common:text-disabled')}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    onClick={() => handleEnable('shopify')}
                  >
                    {t('common:text-enabled')}
                  </button>
                )}
              </div>
            </div>
            
            {/* {isClarity && (
            <>
              <Input
                name={'ms_clarity'}
                placeholder="Clarity Key"
                variant="outline"
                className="mb-5"
                value={clarity}
                onChange={handleClarityInput}
              />
            </>
          )} */}
          </Card>
        </div>
        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('form:input-label-likeCard')}
            // details={t('form:domain-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="mb-2 grid grid-cols-8 gap-4">
              <div className="col-span-2 flex items-center justify-center ">
                <Image
                  src="/image/likecardapp_logo.jpg"
                  width={100}
                  height={100}
                  className="rounded"
                  alt=""
                />
              </div>
              <div className="col-span-6">
                <h3 className="font-semibold">{t('common:likeCard')}</h3>
                <p className="">{t('common:likeCard_desc')} </p>
                {/* <h3 className="font-semibold">{t('Clarity')}</h3> */}
                {/* <p className="">
                Clarity is a free, easy-to-use tool that captures how real
                people actually use your site. Setup is easy and you will start
                getting data in minutes.
              </p> */}
                {subscriptionsDetail?.likecard ? (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    style={Style}
                    // onClick={() => setClarity('')}
                    onClick={() => {
                      handleDisable('likecard');
                    }}
                  >
                    {t('common:text-disabled')}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    onClick={() => handleEnable('likecard')}
                  >
                    {t('common:text-enabled')}
                  </button>
                )}
              </div>
            </div>
            {/* {isClarity && (
            <>
              <Input
                name={'ms_clarity'}
                placeholder="Clarity Key"
                variant="outline"
                className="mb-5"
                value={clarity}
                onChange={handleClarityInput}
              />
            </>
          )} */}
          </Card>
        </div>
        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('form:input-label-variable_product')}
            // details={t('form:domain-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="mb-2 grid grid-cols-8 gap-4">
              <div className="col-span-2 flex items-center justify-center ">
                <Image
                  src="/image/favicon.png"
                  width={100}
                  height={100}
                  className="rounded"
                  alt=""
                />
              </div>
              <div className="col-span-6">
                <h3 className="font-semibold">
                  {t('common:variable_product')}
                </h3>
                <p className="">{t('common:variable_product_desc')} </p>
                {/* <h3 className="font-semibold">{t('Clarity')}</h3> */}
                {/* <p className="">
                Clarity is a free, easy-to-use tool that captures how real
                people actually use your site. Setup is easy and you will start
                getting data in minutes.
              </p> */}
                {subscriptionsDetail?.enable_variable_products ? (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    style={Style}
                    // onClick={() => setClarity('')}
                    onClick={() => {
                      handleDisable('enable_variable_products');
                    }}
                  >
                    {t('common:text-disabled')}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    onClick={() => handleEnable('enable_variable_products')}
                  >
                    {t('common:text-enabled')}
                  </button>
                )}
              </div>
            </div>
            {/* {isClarity && (
            <>
              <Input
                name={'ms_clarity'}
                placeholder="Clarity Key"
                variant="outline"
                className="mb-5"
                value={clarity}
                onChange={handleClarityInput}
              />
            </>
          )} */}
          </Card>
        </div>
        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('form:input-label-discounts')}
            // details={t('form:domain-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="mb-2 grid grid-cols-8 gap-4">
              <div className="col-span-2 flex items-center justify-center ">
                <Image
                  src="/image/favicon.png"
                  width={100}
                  height={100}
                  className="rounded"
                  alt=""
                />
              </div>
              <div className="col-span-6">
                <h3 className="font-semibold">{t('common:discounts')}</h3>
                <p className="">{t('common:discounts_desc')} </p>
                {/* <h3 className="font-semibold">{t('Clarity')}</h3> */}
                {/* <p className="">
                Clarity is a free, easy-to-use tool that captures how real
                people actually use your site. Setup is easy and you will start
                getting data in minutes.
              </p> */}
                {subscriptionsDetail?.enable_discounts ? (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    style={Style}
                    // onClick={() => setClarity('')}
                    onClick={() => {
                      handleDisable('enable_discounts');
                    }}
                  >
                    {t('common:text-disabled')}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    onClick={() => handleEnable('enable_discounts')}
                  >
                    {t('common:text-enabled')}
                  </button>
                )}
              </div>
            </div>
            {/* {isClarity && (
            <>
              <Input
                name={'ms_clarity'}
                placeholder="Clarity Key"
                variant="outline"
                className="mb-5"
                value={clarity}
                onChange={handleClarityInput}
              />
            </>
          )} */}
          </Card>
        </div>

        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('form:input-label-role_managment')}
            // details={t('form:domain-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="mb-2 grid grid-cols-8 gap-4">
              <div className="col-span-2 flex items-center justify-center ">
                <Image
                  src="/image/favicon.png"
                  width={100}
                  height={100}
                  className="rounded"
                  alt=""
                />
              </div>
              <div className="col-span-6">
                <h3 className="font-semibold">{t('common:role_managment')}</h3>
                <p className="">{t('common:role_managment_desc')} </p>
                {/* <h3 className="font-semibold">{t('Clarity')}</h3> */}
                {/* <p className="">
                Clarity is a free, easy-to-use tool that captures how real
                people actually use your site. Setup is easy and you will start
                getting data in minutes.
              </p> */}
                {subscriptionsDetail?.enable_roles_management ? (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    style={Style}
                    // onClick={() => setClarity('')}
                    onClick={() => {
                      handleDisable('enable_roles_management');
                    }}
                  >
                    {t('common:text-disabled')}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    onClick={() => handleEnable('enable_roles_management')}
                  >
                    {t('common:text-enabled')}
                  </button>
                )}
              </div>
            </div>
            {/* {isClarity && (
            <>
              <Input
                name={'ms_clarity'}
                placeholder="Clarity Key"
                variant="outline"
                className="mb-5"
                value={clarity}
                onChange={handleClarityInput}
              />
            </>
          )} */}
          </Card>
        </div>

        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('form:input-label-sell_by_weight')}
            // details={t('form:domain-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="mb-2 grid grid-cols-8 gap-4">
              <div className="col-span-2 flex items-center justify-center ">
                <Image
                  src="/image/favicon.png"
                  width={100}
                  height={100}
                  className="rounded"
                  alt=""
                />
              </div>
              <div className="col-span-6">
                <h3 className="font-semibold">{t('common:sell_by_weight')}</h3>
                <p className="">{t('common:sell_by_weight_desc')} </p>
                {/* <h3 className="font-semibold">{t('Clarity')}</h3> */}
                {/* <p className="">
                Clarity is a free, easy-to-use tool that captures how real
                people actually use your site. Setup is easy and you will start
                getting data in minutes.
              </p> */}
                {subscriptionsDetail?.enable_sell_products_by_weight ? (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    style={Style}
                    // onClick={() => setClarity('')}
                    onClick={() => {
                      handleDisable('enable_sell_products_by_weight');
                    }}
                  >
                    {t('common:text-disabled')}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    onClick={() =>
                      handleEnable('enable_sell_products_by_weight')
                    }
                  >
                    {t('common:text-enabled')}
                  </button>
                )}
              </div>
            </div>
            {/* {isClarity && (
            <>
              <Input
                name={'ms_clarity'}
                placeholder="Clarity Key"
                variant="outline"
                className="mb-5"
                value={clarity}
                onChange={handleClarityInput}
              />
            </>
          )} */}
          </Card>
        </div>

        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('form:input-label-size_chart')}
            // details={t('form:domain-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="mb-2 grid grid-cols-8 gap-4">
              <div className="col-span-2 flex items-center justify-center ">
                <Image
                  src="/image/favicon.png"
                  width={100}
                  height={100}
                  className="rounded"
                  alt=""
                />
              </div>
              <div className="col-span-6">
                <h3 className="font-semibold">{t('common:size_chart')}</h3>
                <p className="">{t('common:size_chart_desc')} </p>
                {/* <h3 className="font-semibold">{t('Clarity')}</h3> */}
                {/* <p className="">
                Clarity is a free, easy-to-use tool that captures how real
                people actually use your site. Setup is easy and you will start
                getting data in minutes.
              </p> */}
                {subscriptionsDetail?.enable_size_chart ? (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    style={Style}
                    // onClick={() => setClarity('')}
                    onClick={() => {
                      handleDisable('enable_size_chart');
                    }}
                  >
                    {t('common:text-disabled')}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    onClick={() => handleEnable('enable_size_chart')}
                  >
                    {t('common:text-enabled')}
                  </button>
                )}
              </div>
            </div>
            {/* {isClarity && (
            <>
              <Input
                name={'ms_clarity'}
                placeholder="Clarity Key"
                variant="outline"
                className="mb-5"
                value={clarity}
                onChange={handleClarityInput}
              />
            </>
          )} */}
          </Card>
        </div>

        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('form:input-label-custom_fileds')}
            // details={t('form:domain-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="mb-2 grid grid-cols-8 gap-4">
              <div className="col-span-2 flex items-center justify-center ">
                <Image
                  src="/image/favicon.png"
                  width={100}
                  height={100}
                  className="rounded"
                  alt=""
                />
              </div>
              <div className="col-span-6">
                <h3 className="font-semibold">{t('common:custom_fileds')}</h3>
                <p className="">{t('common:custom_fileds_desc')} </p>
                {/* <h3 className="font-semibold">{t('Clarity')}</h3> */}
                {/* <p className="">
                Clarity is a free, easy-to-use tool that captures how real
                people actually use your site. Setup is easy and you will start
                getting data in minutes.
              </p> */}
                {subscriptionsDetail?.enable_custom_field ? (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    style={Style}
                    // onClick={() => setClarity('')}
                    onClick={() => {
                      handleDisable('enable_custom_field');
                    }}
                  >
                    {t('common:text-disabled')}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    onClick={() => handleEnable('enable_custom_field')}
                  >
                    {t('common:text-enabled')}
                  </button>
                )}
              </div>
            </div>
            {/* {isClarity && (
            <>
              <Input
                name={'ms_clarity'}
                placeholder="Clarity Key"
                variant="outline"
                className="mb-5"
                value={clarity}
                onChange={handleClarityInput}
              />
            </>
          )} */}
          </Card>
        </div>

        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('form:input-label-rack_row_position')}
            // details={t('form:domain-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="mb-2 grid grid-cols-8 gap-4">
              <div className="col-span-2 flex items-center justify-center ">
                <Image
                  src="/image/favicon.png"
                  width={100}
                  height={100}
                  className="rounded"
                  alt=""
                />
              </div>
              <div className="col-span-6">
                <h3 className="font-semibold">
                  {t('common:rack_row_position')}
                </h3>
                <p className="">{t('common:rack_row_position_desc')} </p>
                {/* <h3 className="font-semibold">{t('Clarity')}</h3> */}
                {/* <p className="">
                Clarity is a free, easy-to-use tool that captures how real
                people actually use your site. Setup is easy and you will start
                getting data in minutes.
              </p> */}
                {subscriptionsDetail?.enable_product_position ? (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    style={Style}
                    // onClick={() => setClarity('')}
                    onClick={() => {
                      handleDisable('enable_product_position');
                    }}
                  >
                    {t('common:text-disabled')}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    onClick={() => handleEnable('enable_product_position')}
                  >
                    {t('common:text-enabled')}
                  </button>
                )}
              </div>
            </div>
            {/* {isClarity && (
            <>
              <Input
                name={'ms_clarity'}
                placeholder="Clarity Key"
                variant="outline"
                className="mb-5"
                value={clarity}
                onChange={handleClarityInput}
              />
            </>
          )} */}
          </Card>
        </div>

        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('form:input-label-bookings')}
            // details={t('form:domain-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="mb-2 grid grid-cols-8 gap-4">
              <div className="col-span-2 flex items-center justify-center ">
                <Image
                  src="/image/favicon.png"
                  width={100}
                  height={100}
                  className="rounded"
                  alt=""
                />
              </div>
              <div className="col-span-6">
                <h3 className="font-semibold">{t('common:bookings')}</h3>
                <p className="">{t('common:bookings_desc')} </p>
                {/* <h3 className="font-semibold">{t('Clarity')}</h3> */}
                {/* <p className="">
                Clarity is a free, easy-to-use tool that captures how real
                people actually use your site. Setup is easy and you will start
                getting data in minutes.
              </p> */}
                {subscriptionsDetail?.booking ? (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    style={Style}
                    // onClick={() => setClarity('')}
                    onClick={() => {
                      handleDisable('booking');
                    }}
                  >
                    {t('common:text-disabled')}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    onClick={() => handleEnable('booking')}
                  >
                    {t('common:text-enabled')}
                  </button>
                )}
              </div>
            </div>
            {/* {isClarity && (
            <>
              <Input
                name={'ms_clarity'}
                placeholder="Clarity Key"
                variant="outline"
                className="mb-5"
                value={clarity}
                onChange={handleClarityInput}
              />
            </>
          )} */}
          </Card>
        </div>

       

        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('form:input-label-purchase')}
            // details={t('form:domain-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="mb-2 grid grid-cols-8 gap-4">
              <div className="col-span-2 flex items-center justify-center ">
                <Image
                  src="/image/favicon.png"
                  width={100}
                  height={100}
                  className="rounded"
                  alt=""
                />
              </div>
              <div className="col-span-6">
                <h3 className="font-semibold">{t('common:purchase')}</h3>
                <p className="">{t('common:purchase_desc')} </p>
                {/* <h3 className="font-semibold">{t('Clarity')}</h3> */}
                {/* <p className="">
                Clarity is a free, easy-to-use tool that captures how real
                people actually use your site. Setup is easy and you will start
                getting data in minutes.
              </p> */}
                {subscriptionsDetail?.purchase ? (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    style={Style}
                    // onClick={() => setClarity('')}
                    onClick={() => {
                      handleDisable('purchase');
                    }}
                  >
                    {t('common:text-disabled')}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded bg-accent p-2 text-white"
                    onClick={() => handleEnable('purchase')}
                  >
                    {t('common:text-enabled')}
                  </button>
                )}
              </div>
            </div>
            {/* {isClarity && (
            <>
              <Input
                name={'ms_clarity'}
                placeholder="Clarity Key"
                variant="outline"
                className="mb-5"
                value={clarity}
                onChange={handleClarityInput}
              />
            </>
          )} */}
          </Card>
        </div>
        {/* <div className="mb-4 text-end">
        <Button type="submit" loading={creatingLoading}>
          {t('form:button-label-save')}
        </Button>
      </div> */}

        <Drawer
          open={pluginDrawer}
          onClose={closeFunctionPluginDrawer}
          variant="right"
        >
          <DrawerWrapper onClose={closeFunctionPluginDrawer} hideTopBar={false}>
            <div className="m-auto mb-2 mt-2  rounded bg-light p-4 sm:w-[28rem]">
             {likeCardShow &&(
                <>
                  <div className="grid grid-cols-8 gap-4">
                    <div className="col-span-2 flex items-center justify-center">
                      <Image
                        width={100}
                        height={100}
                        src={'/image/likecardapp_logo.jpg'}
                        alt=""
                      />
                    </div>
                    <div className="col-span-6">
                      <h3 className="font-semibold">
                        {t('common:likeCard')}
                      </h3>
                      <p className="">
                        {t('common:likeCard_desc')}
                      </p>
                    </div>
                  </div>
                  <Input
                    name="securityCode"
                    value={securityCode}
                    placeholder="Enter Security Code"
                    variant="outline"
                    className="mb-5"
                    // value={googleCode}
                    onChange={(e) => {
                      setSecurityCode(e.target.value);
                    }}
                  />
                    <Input
                    name="password"
                    value={password}
                    placeholder="Enter Password"
                    variant="outline"
                    className="mb-5"
                    // value={googleCode}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                    <Input
                    name="email"
                    value={email}
                    placeholder="Enter Email"
                    variant="outline"
                    className="mb-5"
                    // value={googleCode}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                    <Input
                    name="deviceId"
                    value={deviceId}
                    placeholder="Enter Device ID"
                    variant="outline"
                    className="mb-5"
                    // value={googleCode}
                    onChange={(e) => {
                      setDeviceId(e.target.value);
                    }}
                  />
                    <Input
                    name="phone"
                    value={phone}
                    placeholder="Enter Phone Number"
                    variant="outline"
                    className="mb-5"
                    // value={googleCode}
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                  />
                  <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
                    <button
                      className="shadow-700 flex h-12 w-full justify-between rounded-full bg-accent p-1 text-sm font-bold transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-14"
                      // loading={creatingLoading}
                      onClick={onSubmitLikeCard}
                      disabled={securityCode == null || securityCode == '' &&password==null || password=='' && email==''||email==null && deviceId=='' || deviceId==null && phone=='' && phone==null? true : false}
                    >
                      <div className="flex-1 pt-3 text-center text-light">
                        {t('form:button-label-save')}
                      </div>
                    </button>
                  </footer>
                </>
              )}


              {isGoogle && (
                <>
                  <div className="grid grid-cols-8 gap-4">
                    <div className="col-span-2 flex items-center justify-center">
                      <Image
                        width={100}
                        height={100}
                        src={googleAnalytic}
                        alt=""
                      />
                    </div>
                    <div className="col-span-6">
                      <h3 className="font-semibold">
                        {t('common:google-analytic')}
                      </h3>
                      <p className="">
                        {t('common:google-analytic-description')}
                      </p>
                    </div>
                  </div>
                  <Input
                    // label={t('form:input-label-google-analytic-id')}
                    // {...register('google_analytics_id')}
                    name="googleAnalytic"
                    value={Google}
                    placeholder="Enter Tracking ID"
                    variant="outline"
                    className="mb-5"
                    // value={googleCode}
                    onChange={(e) => {
                      setGoogle(e.target.value);
                    }}
                  />
                  <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
                    <button
                      className="shadow-700 flex h-12 w-full justify-between rounded-full bg-accent p-1 text-sm font-bold transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-14"
                      // loading={creatingLoading}
                      onClick={(e) => onSubmit(e)}
                      disabled={Google == null || Google == '' ? true : false}
                    >
                      <div className="flex-1 pt-3 text-center text-light">
                        {t('form:button-label-save')}
                      </div>
                    </button>
                  </footer>
                </>
              )}

              {isFacebook && (
                <>
                  <div className="mb-2 grid grid-cols-8 gap-4">
                    <div className="col-span-2 flex items-center justify-center ">
                      <Image
                        width={100}
                        height={100}
                        src={facebookPixel}
                        className="rounded"
                        alt=""
                      />
                    </div>
                    <div className="col-span-6">
                      <h3 className="font-semibold">
                        {' '}
                        {t('common:facebook-pixel')}
                      </h3>
                      <p className="">
                        {t('common:facebook-pixel-description')}
                      </p>
                    </div>
                  </div>

                  <Input
                    // label={t('form:input-label-facebook-pixel-id')}
                    // {...register('fb_tracking_pixel_id')}
                    name="facebookAnalytic"
                    placeholder="Enter Pixel ID"
                    variant="outline"
                    className="mb-5"
                    value={Facebook}
                    onChange={(e) => {
                      setFacebook(e.target.value);
                    }}
                  />
                  <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
                    <button
                      className="shadow-700 flex h-12 w-full justify-between rounded-full bg-accent p-1 text-sm font-bold transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-14"
                      // loading={creatingLoading}
                      onClick={(e) => onSubmit(e)}
                      disabled={
                        Facebook == null || Facebook == '' ? true : false
                      }
                    >
                      <div className="flex-1 pt-3 text-center text-light">
                        {t('form:button-label-save')}
                      </div>
                    </button>
                  </footer>
                </>
              )}

              {isIntercom && (
                <>
                  <div className="mb-2 grid grid-cols-8 gap-4">
                    <div className="col-span-2 flex items-center justify-center ">
                      <Image
                        width={100}
                        height={100}
                        src={intercom}
                        className="rounded"
                        alt=""
                      />
                    </div>
                    <div className="col-span-6">
                      <h3 className="font-semibold">
                        {' '}
                        {t('common:intercom-chat')}
                      </h3>
                      <p className="">
                        {t('common:intercom-chat-description')}
                      </p>
                    </div>
                  </div>

                  <Input
                    // label={t('form:input-label-facebook-pixel-id')}
                    // {...register('intercom_live_chat')}
                    name="intercom"
                    placeholder="Enter App ID"
                    variant="outline"
                    className="mb-5"
                    value={Intercom}
                    onChange={(e) => {
                      setIntercom(e.target.value);
                    }}
                  />
                  <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
                    <button
                      className="shadow-700 flex h-12 w-full justify-between rounded-full bg-accent p-1 text-sm font-bold transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-14"
                      // loading={creatingLoading}
                      onClick={(e) => onSubmit(e)}
                      disabled={
                        Intercom == null || Intercom == '' ? true : false
                      }
                    >
                      <div className="flex-1 pt-3 text-center text-light">
                        {t('form:button-label-save')}
                      </div>
                    </button>
                  </footer>
                </>
              )}

              {isDrift && (
                <>
                  <div className="mb-2 grid grid-cols-8 gap-4">
                    <div className="col-span-2 flex items-center justify-center ">
                      <Image
                        width={100}
                        height={100}
                        src={drift}
                        className="rounded"
                        alt=""
                      />
                    </div>
                    <div className="col-span-6">
                      <h3 className="font-semibold">
                        {' '}
                        {t('common:drift-chat')}
                      </h3>
                      <p className="">{t('common:drift-chat-description')}</p>
                    </div>
                  </div>

                  <Input
                    // label={t('form:input-label-facebook-pixel-id')}
                    // {...register('drift_live_chat')}
                    name="drift"
                    variant="outline"
                    className="mb-5"
                    placeholder="Enter Secret Key"
                    value={Drift}
                    onChange={(e) => {
                      setDrift(e.target.value);
                    }}
                  />
                  <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
                    <button
                      className="shadow-700 flex h-12 w-full justify-between rounded-full bg-accent p-1 text-sm font-bold transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-14"
                      // loading={creatingLoading}
                      onClick={(e) => onSubmit(e)}
                      disabled={Drift == null || Drift == '' ? true : false}
                    >
                      <div className="flex-1 pt-3 text-center text-light">
                        {t('form:button-label-save')}
                      </div>
                    </button>
                  </footer>
                </>
              )}

              {isTawk && (
                <>
                  <div className="mb-2 grid grid-cols-8 gap-4">
                    <div className="col-span-2 flex items-center justify-center ">
                      <Image
                        width={100}
                        height={100}
                        src={tawk}
                        className="rounded"
                        alt=""
                      />
                    </div>
                    <div className="col-span-6">
                      <h3 className="font-semibold">
                        {' '}
                        {t('common:tawk-chat')}
                      </h3>
                      <p className="">{t('common:tawk-chat-description')}</p>
                    </div>
                  </div>

                  <Input
                    // label={t('form:input-label-facebook-pixel-id')}
                    // {...register('tawk_To_live_chat')}
                    name="tawk"
                    placeholder="Enter Tawk Api"
                    variant="outline"
                    className="mb-5"
                    value={Tawk}
                    onChange={(e) => {
                      setTawk(e.target.value);
                    }}
                  />
                  <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
                    <button
                      className="shadow-700 flex h-12 w-full justify-between rounded-full bg-accent p-1 text-sm font-bold transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-14"
                      // loading={creatingLoading}
                      onClick={(e) => onSubmit(e)}
                      disabled={Tawk == null || Tawk == '' ? true : false}
                    >
                      <div className="flex-1 pt-3 text-center text-light">
                        {t('form:button-label-save')}
                      </div>
                    </button>
                  </footer>
                </>
              )}

              {isTidio && (
                <>
                  <div className="mb-2 grid grid-cols-8 gap-4">
                    <div className="col-span-2 flex items-center justify-center ">
                      <Image
                        width={100}
                        height={100}
                        src={tidio}
                        className="rounded"
                        alt=""
                      />
                    </div>
                    <div className="col-span-6">
                      <h3 className="font-semibold">
                        {t('common:tidio-chat')}
                      </h3>
                      <p className="">{t('common:tidio-chat-description')}</p>
                    </div>
                  </div>

                  <Input
                    // label={t('form:input-label-facebook-pixel-id')}
                    // {...register('tidio_live_chat')}
                    name="tidio"
                    placeholder="Enter Tidio code"
                    variant="outline"
                    className="mb-5"
                    value={Tidio}
                    onChange={(e) => {
                      setTidio(e.target.value);
                    }}
                  />
                  <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
                    <button
                      className="shadow-700 flex h-12 w-full justify-between rounded-full bg-accent p-1 text-sm font-bold transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-14"
                      // loading={creatingLoading}
                      onClick={(e) => onSubmit(e)}
                      disabled={Tidio == null || Tidio == '' ? true : false}
                    >
                      <div className="flex-1 pt-3 text-center text-light">
                        {t('form:button-label-save')}
                      </div>
                    </button>
                  </footer>
                </>
              )}

              {isAdroll && (
                <>
                  <div className="mb-2 grid grid-cols-8 gap-4">
                    <div className="col-span-2 flex items-center justify-center ">
                      <Image
                        width={100}
                        height={100}
                        src={adroll}
                        className="rounded"
                        alt=""
                      />
                    </div>
                    <div className="col-span-6">
                      <h3 className="font-semibold"> {t('common:adroll')}</h3>
                      <p className="">{t('common:adroll-description')}</p>
                    </div>
                  </div>

                  <Input
                    // label={t('form:input-label-facebook-pixel-id')}
                    // {...register('adroll')}
                    name="adroll"
                    placeholder="Enter Adroll Pixel Id"
                    variant="outline"
                    className="mb-5"
                    value={Adroll}
                    onChange={(e) => {
                      setAdroll(e.target.value);
                    }}
                  />
                  <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
                    <button
                      className="shadow-700 flex h-12 w-full justify-between rounded-full bg-accent p-1 text-sm font-bold transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-14"
                      // loading={creatingLoading}
                      onClick={(e) => onSubmit(e)}
                      disabled={Adroll == null || Adroll == '' ? true : false}
                    >
                      <div className="flex-1 pt-3 text-center text-light">
                        {t('form:button-label-save')}
                      </div>
                    </button>
                  </footer>
                </>
              )}

              {isHotjar && (
                <>
                  <div className="mb-2 grid grid-cols-8 gap-4">
                    <div className="col-span-2 flex items-center justify-center ">
                      <Image
                        width={100}
                        height={100}
                        src={hotjar}
                        className="rounded"
                        alt=""
                      />
                    </div>
                    <div className="col-span-6">
                      <h3 className="font-semibold"> {t('common:hotjar')}</h3>
                      <p className="">{t('common:hotjar-description')}</p>
                    </div>
                  </div>
                  {(isAmaze || initialValues?.data.re_amaze) && (
                    <>
                      <div className="mb-2 grid grid-cols-8 gap-4">
                        <div className="col-span-2 flex items-center justify-center ">
                          <Image
                            width={100}
                            height={100}
                            src={amaze}
                            className="rounded"
                            alt=""
                          />
                        </div>
                        <div className="col-span-6">
                          <h3 className="font-semibold">
                            {' '}
                            {t('common:amaze')}
                          </h3>
                          <p className="">{t('common:amaze-description')}</p>
                        </div>
                      </div>

                      <Input
                        // label={t('form:input-label-facebook-pixel-id')}
                        // {...register('re_amaze')}
                        name="amaze"
                        placeholder="Enter Brand Subdomain"
                        variant="outline"
                        className="mb-5"
                        value={Amaze}
                        onChange={(e) => {
                          setAmaze(e.target.value);
                        }}
                      />
                      <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
                        <button
                          className="shadow-700 flex h-12 w-full justify-between rounded-full bg-accent p-1 text-sm font-bold transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-14"
                          // loading={creatingLoading}
                          onClick={(e) => onSubmit(e)}
                          disabled={Amaze == null ? true : false}
                        >
                          <div className="flex-1 pt-3 text-center text-light">
                            {t('form:button-label-save')}
                          </div>
                        </button>
                      </footer>
                    </>
                  )}

                  <Input
                    // label={t('form:input-label-facebook-pixel-id')}
                    // {...register('hotjar')}
                    name="hotjar"
                    placeholder="Enter Hotjar Tracking Code"
                    variant="outline"
                    className="mb-5"
                    value={Hotjar}
                    onChange={(e) => {
                      setHotjar(e.target.value);
                    }}
                  />
                  <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
                    <button
                      className="shadow-700 flex h-12 w-full justify-between rounded-full bg-accent p-1 text-sm font-bold transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-14"
                      // loading={creatingLoading}
                      onClick={(e) => onSubmit(e)}
                      disabled={Hotjar == null || Hotjar == '' ? true : false}
                    >
                      <div className="flex-1 pt-3 text-center text-light">
                        {t('form:button-label-save')}
                      </div>
                    </button>
                  </footer>
                </>
              )}
              {isZendesk && (
                <>
                  <div className="mb-2 grid grid-cols-8 gap-4">
                    <div className="col-span-2 flex items-center justify-center ">
                      <img
                        width={100}
                        height={100}
                        src="/image/zendesk.jpg"
                        className="rounded"
                        alt=""
                      />
                    </div>
                    <div className="col-span-6">
                      <h3 className="font-semibold">{t('common:zendesk')}</h3>
                      <p className="">{t('common:zendesk-chat-description')}</p>
                    </div>
                  </div>

                  <Input
                    // label={t('form:input-label-facebook-pixel-id')}
                    // {...register('zendesk_chat')}
                    name="zendesk"
                    placeholder="Enter Snippet Key"
                    variant="outline"
                    className="mb-5"
                    value={Zendesk}
                    onChange={(e) => {
                      setZendesk(e.target.value);
                    }}
                  />
                  <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
                    <button
                      className="shadow-700 flex h-12 w-full justify-between rounded-full bg-accent p-1 text-sm font-bold transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-14"
                      // loading={creatingLoading}
                      onClick={(e) => onSubmit(e)}
                      disabled={Zendesk == null || Zendesk == '' ? true : false}
                    >
                      <div className="flex-1 pt-3 text-center text-light">
                        {t('form:button-label-save')}
                      </div>
                    </button>
                  </footer>
                </>
              )}
              {isFreshChat && (
                <>
                  <div className="mb-2 grid grid-cols-8 gap-4">
                    <div className="col-span-2 flex items-center justify-center ">
                      <img
                        width={100}
                        height={100}
                        src="/image/freshChat.jpg"
                        className="rounded"
                        alt=""
                      />
                    </div>
                    <div className="col-span-6">
                      <h3 className="font-semibold"> {t('common:fresh')}</h3>
                      <p className="">{t('common:fresh-chat-description')}</p>
                    </div>
                  </div>
                  <Input
                    // label={t('form:input-label-facebook-pixel-id')}
                    // {...register('fresh_chat')}
                    name="freshChat"
                    placeholder="Enter Unique ID"
                    variant="outline"
                    className="mb-5"
                    value={FreshChat}
                    onChange={(e) => {
                      setFreshChat(e.target.value);
                    }}
                  />
                  <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
                    <button
                      className="shadow-700 flex h-12 w-full justify-between rounded-full bg-accent p-1 text-sm font-bold transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-14"
                      // loading={creatingLoading}
                      onClick={(e) => onSubmit(e)}
                      disabled={
                        FreshChat == null || FreshChat == '' ? true : false
                      }
                    >
                      <div className="flex-1 pt-3 text-center text-light">
                        {t('form:button-label-save')}
                      </div>
                    </button>
                  </footer>
                </>
              )}

              {isLiveChat && (
                <>
                  <div className="mb-2 grid grid-cols-8 gap-4">
                    <div className="col-span-2 flex items-center justify-center ">
                      <Image
                        width={100}
                        height={100}
                        src={liveChat}
                        className="rounded"
                        alt=""
                      />
                    </div>
                    <div className="col-span-6">
                      <h3 className="font-semibold"> {t('common:live')}</h3>
                      <p className="">{t('common:live-chat-description')}</p>
                    </div>
                  </div>

                  <Input
                    // label={t('form:input-label-facebook-pixel-id')}
                    // {...register('live_chat')}
                    name="liveChat"
                    placeholder="Enter License Number"
                    variant="outline"
                    className="mb-5"
                    value={LiveChat}
                    onChange={(e) => {
                      setLiveChat(e.target.value);
                    }}
                  />
                  <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
                    <button
                      className="shadow-700 flex h-12 w-full justify-between rounded-full bg-accent p-1 text-sm font-bold transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-14"
                      // loading={creatingLoading}
                      onClick={(e) => onSubmit(e)}
                      disabled={
                        LiveChat == null || LiveChat == '' ? true : false
                      }
                    >
                      <div className="flex-1 pt-3 text-center text-light">
                        {t('form:button-label-save')}
                      </div>
                    </button>
                  </footer>
                </>
              )}
              {isTrengo && (
                <>
                  <div className="mb-2 grid grid-cols-8 gap-4">
                    <div className="col-span-2 flex items-center justify-center ">
                      <Image
                        width={100}
                        height={100}
                        src={trengo}
                        className="rounded"
                        alt=""
                      />
                    </div>
                    <div className="col-span-6">
                      <h3 className="font-semibold">{t('common:rengo')}</h3>
                      <p className="">{t('common:rengo-description')} </p>
                    </div>
                  </div>

                  <Input
                    // label={t('form:input-label-facebook-pixel-id')}
                    // {...register('trengo')}
                    name="trengo"
                    placeholder="Enter Key"
                    variant="outline"
                    className="mb-5"
                    value={Trengo}
                    onChange={(e) => {
                      setTrengo(e.target.value);
                    }}
                  />
                  <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
                    <button
                      className="shadow-700 flex h-12 w-full justify-between rounded-full bg-accent p-1 text-sm font-bold transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-14"
                      // loading={creatingLoading}
                      onClick={(e) => onSubmit(e)}
                      disabled={Trengo == null || Trengo == '' ? true : false}
                    >
                      <div className="flex-1 pt-3 text-center text-light">
                        {t('form:button-label-save')}
                      </div>
                    </button>
                  </footer>
                </>
              )}
              {isTabby && (
                <>
                  <div className="mb-2 grid grid-cols-8 gap-4">
                    <div className="col-span-2 flex items-center justify-center ">
                      <Image
                        width={100}
                        height={100}
                        src={tabbyImg}
                        className="rounded"
                        alt=""
                      />
                    </div>
                    <div className="col-span-6">
                      <h3 className="font-semibold">{t('common:tabby')}</h3>
                      <p className="">{t('common:tabby-description')} </p>
                    </div>
                  </div>

                  <>
                    <Input
                      // label={t('form:input-label-facebook-pixel-id')}
                      // {...register('tabby.merchant_code')}
                      name={'merchant_code'}
                      placeholder="Merchant Code"
                      variant="outline"
                      className="mb-5"
                      value={Tabby?.merchant_code}
                      onChange={handleTabbyInput}
                    />
                    <Input
                      // label={t('form:input-label-facebook-pixel-id')}
                      // {...register('tabby.public_key')}
                      name={'public_key'}
                      placeholder="Public Key"
                      variant="outline"
                      className="mb-5"
                      value={Tabby?.public_key}
                      onChange={handleTabbyInput}
                    />
                  </>
                  <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
                    <button
                      className="shadow-700 flex h-12 w-full justify-between rounded-full bg-accent p-1 text-sm font-bold transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-14"
                      // loading={creatingLoading}
                      onClick={(e) => onSubmit(e)}
                      disabled={
                        ((Object.keys(Tabby).length === 0 &&
                          Tabby.constructor === Object) == true &&
                          Tabby.merchant_code == null) ||
                        Tabby.merchant_code === '' ||
                        Tabby.public_key == null ||
                        Tabby.public_key === ''
                          ? true
                          : false
                      }
                    >
                      <div className="flex-1 pt-3 text-center text-light">
                        {t('form:button-label-save')}
                      </div>
                    </button>
                  </footer>
                </>
              )}

              {isClarity === true && (
                <>
                  <div className="mb-2 grid grid-cols-8 gap-4">
                    <div className="col-span-2 flex items-center justify-center ">
                      <Image
                        src={clarityImg}
                        width={100}
                        height={100}
                        className="rounded"
                        alt=""
                      />{' '}
                      *
                    </div>
                    <div className="col-span-6">
                      <h3 className="font-semibold">{t('common:clarity')}</h3>
                      <p className="">{t('common:clarity-description')} </p>
                      {/* <h3 className="font-semibold">{t('Clarity')}</h3> */}
                      {/* <p className="">
                Clarity is a free, easy-to-use tool that captures how real
                people actually use your site. Setup is easy and you will start
                getting data in minutes.
              </p> */}
                    </div>
                  </div>

                  <Input
                    name={'ms_clarity'}
                    placeholder="Clarity Key"
                    variant="outline"
                    className="mb-5"
                    value={clarity}
                    onChange={handleClarityInput}
                  />
                  <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
                    <button
                      className="shadow-700 flex h-12 w-full justify-between rounded-full bg-accent p-1 text-sm font-bold transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-14"
                      // loading={creatingLoading}
                      onClick={(e) => onSubmit(e)}
                      disabled={clarity == null || clarity == '' ? true : false}
                    >
                      <div className="flex-1 pt-3 text-center text-light">
                        {t('form:button-label-save')}
                      </div>
                    </button>
                  </footer>
                </>
              )}

              {isAmaze && (
                <>
                  <div className="mb-2 grid grid-cols-8 gap-4">
                    <div className="col-span-2 flex items-center justify-center ">
                      <Image
                        width={100}
                        height={100}
                        src={amaze}
                        className="rounded"
                        alt=""
                      />
                    </div>
                    <div className="col-span-6">
                      <h3 className="font-semibold"> {t('common:amaze')}</h3>
                      <p className="">{t('common:amaze-description')}</p>
                    </div>
                  </div>

                  <Input
                    // label={t('form:input-label-facebook-pixel-id')}
                    // {...register('re_amaze')}
                    name="amaze"
                    placeholder="Enter Brand Subdomain"
                    variant="outline"
                    className="mb-5"
                    value={Amaze}
                    onChange={(e) => {
                      setAmaze(e.target.value);
                    }}
                  />

                  <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
                    <button
                      className="shadow-700 flex h-12 w-full justify-between rounded-full bg-accent p-1 text-sm font-bold transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-14"
                      // loading={creatingLoading}
                      onClick={(e) => onSubmit(e)}
                      disabled={Amaze == null || Amaze == '' ? true : false}
                    >
                      <div className="flex-1 pt-3 text-center text-light">
                        {t('form:button-label-save')}
                      </div>
                    </button>
                  </footer>
                </>
              )}
            </div>
          </DrawerWrapper>
        </Drawer>
      </form>

      <Modal
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        style={{ width: '45%' }}
      >
        <Card className="mt-4" style={{ width: 400 }}>
          <div className="m-auto w-full">
            <div className="h-full w-full text-center">
              <div className="flex h-full flex-col justify-between">
                <TrashIcon className="m-auto mt-4 h-12 w-12 text-accent" />
                <p className="mt-4 text-xl font-bold text-heading">uninstall</p>
                <p className="py-2 px-6 leading-relaxed text-body-dark dark:text-muted">
                  Are you sure, you want to uninstall {deleteClick} ?
                </p>
                <div className="mt-8 flex w-full items-center justify-between space-s-4">
                  <div className="w-1/2">
                    <Button
                      onClick={() => {
                        setOpenDialog(false), setDeleteClick('');
                      }}
                      variant="custom"
                      className={cn(
                        'w-full rounded bg-accent py-2 px-4 text-center text-base font-semibold text-light shadow-md transition duration-200 ease-in hover:bg-accent-hover focus:bg-accent-hover focus:outline-none'
                      )}
                    >
                      Cancel
                    </Button>
                  </div>
                  <div className="w-1/2">
                    <Button
                      onClick={onDeletePress}
                      // loading={loading}
                      variant="custom"
                      className={cn(
                        'w-full rounded bg-red-600 py-2 px-4 text-center text-base font-semibold text-light shadow-md transition duration-200 ease-in hover:bg-red-700 focus:bg-red-700 focus:outline-none'
                      )}
                    >
                      Uninstall
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Modal>
    </>
  );
}
