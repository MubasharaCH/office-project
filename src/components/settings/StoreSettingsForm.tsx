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
import { Switch } from '@headlessui/react';
import Description from '@/components/ui/description';
import ColorPicker from '@/components/ui/color-picker/color-picker';
import DisplayColorCode from '@/components/ui/color-picker/display-color-code';
import Card from '@/components/common/card';
import Label from '@/components/ui/label';
import { CURRENCY } from './currency';
import { siteSettings } from '@/settings/site.settings';
import ValidationError from '@/components/ui/form-validation-error';
import { useUpdateSettingsMutation } from '@/data/settings';
import { useTranslation } from 'next-i18next';
import { selectStyles } from '../ui/select/select.styles';
import { yupResolver } from '@hookform/resolvers/yup';
import { settingsValidationSchema } from './settings-validation-schema';
import FileInput from '@/components/ui/file-input';
import FileInputStoreFront from '../ui/file-input-storefront';
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
import { useState, useEffect, useRef } from 'react';
import {
  AddingFunction,
  DashboardGetFun,
  GetFunction,
  UpdatingFunction,
  UpdatingProduct,
  UpdatingStoreSetting,
} from '@/services/Service';
import { toast } from 'react-toastify';
import React from 'react';
import parse from 'html-react-parser';
import { convertToHTML } from 'draft-convert';
import { convertFromHTML, EditorState } from 'draft-js';
import dynamic from 'next/dynamic';
import { ContentState, convertToRaw } from 'draft-js';
import { EditorProps } from 'react-draft-wysiwyg';
import { InputText } from 'primereact/inputtext';
import facebookPixel from '../../../public/image/facebook-pixel.png';
import googleAnalytic from '../../../public/image/google-analytic.png';
// install @types/draft-js @types/react-draft-wysiwyg and @types/draft-js @types/react-draft-wysiwyg for types
import { RxCross1 } from 'react-icons/rx';
import { AiFillDelete } from 'react-icons/ai';
import Loader from '@/components/ui/loader/loader';
import QRCode from 'react-qr-code';
import download from 'downloadjs';
import html2canvas from 'html2canvas';

const Editor = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
);
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Image from 'next/image';
import Modal from '../ui/modal/modal';
import Router from 'next/router';
import RadioCard from '../ui/radio-card/radio-card';

type FormValues = {
  name: any;
  theme_color: any;
  location_id: any;
  whatsapp_no: any;
  about_us: any;
  term_condition: any;
  privacy_policy: any;
  color: any;
  banner_images: any;
  storefront_banner: any;
  logo_url: any;
  fav_icon: any;
  meta_title: any;
  meta_description: any;
  facebook: any;
  instagram: any;
  tiktok: any;
  twitter: any;
  snapchat: any;
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

  const [status, setStatus] = useState<any>(
    initialValues.data.is_open == 'false' ? false : true
  );
  const [enable_checkout, setEnableCheckOut] = useState<any>(
    initialValues.data.enable_checkout==1?true:false
  );
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [creatingLoading, setCreatingLoading] = useState(false);
  const [LocationDataArray, setLocationDataArray] = React.useState<any[]>([]);
  const [LocationVal, setLocation] = useState<any>();
  const [theme, setTheme] = useState<any>({
    key: 1,
    id: 1,
    value: 'minimal',
    label: 'Minimal',
  });
  const [language, setLanguage] = useState<any>(null);
  const [storeTheme, setStoreTheme] = useState<any>('minimal');
  const [storeLanguage, setStoreLanguage] = useState<any>('');
  const [termCondition, setTermCondition] = useState('');
  const [aboutUs, setAboutUs] = useState('');
  const [privacy, setPrivacy] = useState('');
  const [imageFile, setImageFile] = useState<any>([]);
  const [videoFile, setVideoFile] = useState<any>([]);
  const [show_newsletter_popup,setShowNewsLetterPopup]=useState<any>(initialValues.data.show_newsletter_popup==1?true:false)
  const [path, setPath] = useState<any>([]);
  const [videoPath, setVideoPath] = useState<any>([]);
  const [imgArr, setImageArr] = useState<any>(getValues('banner_images'));
  const [videoArr, setVideoArr] = useState<any>(
       []
  );
  const [loadingData, setloadingData] = useState(true);
  const [addDomainModal, setAddDomainModal] = useState(false);
  const [domainName, setDomainName] = useState('');
  const [packageDetail, setPackageDetail] = useState<any>({});
  const [customScript, setCustomScript] = useState<any>();
  const [sliderImagesObject, setSliderImagesObject] = useState<any>(
    getValues('storefront_banner')
  );
  const [deleteImgId, setDeleteImgId] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleImgLoader, setDeleImgLoader] = useState(false);
  const [isVideo, setIsVideo] = useState(false)
  // console.log(initialValues.data);
  const themeArray = [
    {
      key: 1,
      id: 1,
      value: 'minimal',
      label: 'Minimal',
      img: '/image/storefront-layout-minimal.png',
    },
    {
      key: 2,
      id: 2,
      value: 'trendy',
      label: 'Trendy',
      img: '/image/storefront-layout-trendy.png',
    },
    {
      key: 3,
      id: 3,
      value: 'standard',
      label: 'Standard',
      img: '/image/storefront-layout-standard.png',
    },
    {
      key: 4,
      id: 4,
      value: 'modern',
      label: 'Modern',
      img: '/image/storefront-layout-modern.png',
    },
    {
      key: 5,
      id: 5,
      value: 'vintage',
      label: 'Vintage',
      img: '/image/storefront-layout-vintage.png',
    },
    {
      key: 6,
      id: 6,
      value: 'classic',
      label: 'Classic',
      img: '/image/storefront-layout-classic.png',
    },
  ];
  const languageArray = [
    {
      key: 1,
      id: 1,
      value: 'ur',
      label: 'Urdu',
    },
    {
      key: 2,
      id: 2,
      value: 'en',
      label: 'English',
    },
    {
      key: 3,
      id: 3,
      value: 'ar',
      label: 'Arabic',
    },
  ];
  // const [customScriptState, setCustomScriptState] = useState(() =>
  //   EditorState.createEmpty()
  // );

  const onChangeStatus = (e: any) => {
    setStatus((value: any) => !value);
    setCreatingLoading(true);
    form.append('is_open', e == true ? '1' : '0');
    UpdatingStoreSetting('/set-status', form).then((result) => {
      if (result.success) {
        toast.success(t('common:successfully-updated'));
        setCreatingLoading(false);
        initialValues.GetData();
        setTimeout(() => {
          // window.location.reload();
        }, 1000);
      } else {
        toast.error(t(result.message));
        setCreatingLoading(false);
      }
    });
  };
  const onChangeEnableCheckout = (e: any) => {
    setEnableCheckOut((value: any) => !value);
  };
  const onChangeEnableShowNewsletterPopUp=(e:any)=>{
    setShowNewsLetterPopup((value: any) => !value);
  }
  const [privecyEditorState, setprivecyEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const [refundEditorState, setRefundEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const [privecyConvertedContent, setPrivecyConvertedContent] =
    useState<any>(null);
  const [refundConvertedContent, setRefundConvertedContent] =
    useState<any>(null);

  useEffect(() => {
    let html = convertToHTML(privecyEditorState.getCurrentContent());
    setPrivecyConvertedContent(html);
  }, [privecyEditorState]);

  useEffect(() => {
    if (sliderImagesObject) {
      var newPath: any = [];
      for (const [key, value] of Object?.entries(sliderImagesObject)) {
        if (value) {
          newPath = [...newPath, value];
        }else{
          newPath = [...newPath, value];
        }
      }
      setPath(newPath);
      if(initialValues?.data?.banner_video){
        const valuesArray = Object.values(initialValues?.data?.banner_video);
        setVideoPath(valuesArray);
      }
     
    }
  }, [sliderImagesObject]);

  useEffect(() => {
    let vall: any =
      initialValues.data.privacy_policy == undefined
        ? ''
        : initialValues.data.privacy_policy;
    const blocksFromHTML = convertFromHTML(vall);
    setprivecyEditorState(
      EditorState.createWithContent(
        ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        )
      )
    );
    setCustomScript(initialValues?.data?.custom_script);
  }, []);

  const [termEditorState, settermEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [termConvertedContent, setTermConvertedContent] = useState<any>(null);

  useEffect(() => {
    let html = convertToHTML(termEditorState.getCurrentContent());
    setTermConvertedContent(html);
  }, [termEditorState]);

  useEffect(() => {
    let html = convertToHTML(refundEditorState.getCurrentContent());
    setRefundConvertedContent(html);
  }, [refundEditorState]);

  useEffect(() => {
    let vall: any =
      initialValues.data.term_condition == undefined
        ? ''
        : initialValues.data.term_condition;
    const blocksFromHTML = convertFromHTML(vall);
    settermEditorState(
      EditorState.createWithContent(
        ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        )
      )
    );
  }, []);





  useEffect(() => {
    let vall: any =
      initialValues.data.return_and_refund_policy == undefined
        ? ''
        : initialValues.data.return_and_refund_policy;
    const blocksFromHTML = convertFromHTML(vall);
    setRefundEditorState(
      EditorState.createWithContent(
        ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        )
      )
    );
  }, []);

  const [aboutEditorState, setaboutEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const [aboutConvertedContent, setAboutConvertedContent] = useState<any>(null);

  useEffect(() => {
    let html = convertToHTML(aboutEditorState.getCurrentContent());
    setAboutConvertedContent(html);
  }, [aboutEditorState]);

  useEffect(() => {
    let vall: any =
      initialValues.data.about_us == undefined
        ? ''
        : initialValues.data.about_us;
    const blocksFromHTML = convertFromHTML(vall);
    setaboutEditorState(
      EditorState.createWithContent(
        ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        )
      )
    );
    let dataArray = initialValues?.data?.locations?.map((res) => {
      setLocation(res.id);
    });

    initialValues?.data?.dns && setDomainName(initialValues?.data?.dns);
  }, []);
  useEffect(() => {
    const initialTheme =
      initialValues?.data?.theme &&
      (setloadingData(true),
      themeArray.find((theme) => theme.value === initialValues?.data?.theme));
    //console.log(initialTheme,'testes');
    if (initialTheme) {
      setTheme(initialTheme);
      setStoreTheme(initialTheme.value);
      setloadingData(false);
    }
    const initialLanguage =
      initialValues?.data?.primary_language &&
      (setloadingData(true),
      languageArray.find(
        (lang) => lang.value === initialValues?.data?.primary_language
      ));
    if (initialLanguage) {
      setLanguage(initialLanguage);
      setStoreLanguage(initialLanguage.value);
      setloadingData(false);
    }
  }, [initialValues]);

  const [imageFile2, setImageFile2] = useState<any>();
  const [path2, setPath2] = useState<string>(getValues('logo_url'));

  const [imageFile3, setImageFile3] = useState<any>();
  const [path3, setPath3] = useState<string>(getValues('fav_icon'));
  let form = new FormData();

  const handleThemeChange = (e) => {
    if (packageDetail?.name.toLowerCase().includes('free package')) {
      toast.error('Please update your subscription');
      Router.push('/settings/subscription');
    } else {
      setTheme({ value: e.target.value });
      setStoreTheme(e.target.value);
    }
  };
  const handleLangChange = (e) => {
    if (packageDetail?.name.toLowerCase().includes('free package')) {
      toast.error('Please update your subscription');
      Router.push('/settings/subscription');
    } else {
      setStoreLanguage(e.value);
    }
  };

  useEffect(() => {
    if (imageFile2) {
      setPath2(URL.createObjectURL(imageFile2));
    }
  }, [imageFile2]);

  useEffect(() => {
    if (imageFile3) {
      setPath3(URL.createObjectURL(imageFile3));
    }
  }, [imageFile3]);

  useEffect(() => {
    setImageFile('');
    if (imageFile) {
      imageFile.map((res) => {
        if (imgArr != undefined) {
          setImageArr((current) => [...current, res]);
        } else {
          setImageArr([res]);
        }

        if (path != undefined) {
          setPath((current) => [...current, URL.createObjectURL(res)]);
        } else {
          setPath([URL.createObjectURL(res)]);
        }
      });
    }
  }, [imageFile]);

  useEffect(() => {
    setVideoFile('');
    if (videoFile) {
      if (videoArr !== undefined) {
        setVideoArr([videoFile]);
      } else {
        setVideoArr([videoFile]);
      }
      try {
        // Check if videoFile is a Blob or File
        if (videoFile instanceof Blob || videoFile instanceof File) {
          if (videoPath !== undefined) {
            setVideoPath([URL.createObjectURL(videoFile)]);
          } else {
            setVideoPath([URL.createObjectURL(videoFile)]);
          }
        } else {
          console.error('Invalid file type for createObjectURL:', videoFile);
        }
      } catch (error) {
        console.error('Error creating object URL:', error);
      }
    }
  }, [videoFile, videoArr, videoPath]);

  React.useEffect(() => {
    setloadingData(true);
    const businessDetail = JSON.parse(
      localStorage.getItem('user_business_details')!
    );
    if (businessDetail) {
      setPackageDetail(businessDetail?.subscriptions[0]?.package_details);
    }
    GetFunction('/business-location').then((result) => {
      let ordersData = result.data.map((data, i) => {
        return {
          key: i,
          id: data.id,
          value: data.name,
          name: data.name,
        };
      });
      setLocationDataArray(ordersData);
      setloadingData(false);
    });
  }, []);
  React.useEffect(() => {}, []);

  const onSubmit = (values: FormValues) => {
    let ID = initialValues.data.id;

    form.append('id', ID);
    form.append('facebook', values?.facebook);
    form.append('instagram', values?.instagram);
    form.append('tiktok', values?.tiktok);
    form.append('twitter', values?.twitter);
    form.append('snapchat', values?.snapchat);

    values.name && form.append('name', values.name);
    form.append('location_id', LocationVal);
    form.append('theme_col', values.color);
    form.append('whatsapp_no', values.whatsapp_no);
    values.name && form.append('domain', values.name);
    privecyConvertedContent &&
      form.append('privacy_policy', privecyConvertedContent);
    refundConvertedContent &&
      form.append('return_and_refund_policy', refundConvertedContent);
    termConvertedContent && form.append('term_condition', termConvertedContent);
    aboutConvertedContent && form.append('about_us', aboutConvertedContent);
    form.append('store_logo', imageFile2);
    form.append('fav_icon', imageFile3);
    values.meta_title && form.append('meta_title', values.meta_title);
    values.meta_description &&
      form.append('meta_description', values.meta_description);
    customScript && form.append('custom_script', customScript);
    form.append('is_open', status);
    form.append('enable_checkout', enable_checkout == true ? '1' : '0');
    form.append('show_newsletter_popup', show_newsletter_popup == true ? '1' : '0');

    domainName && form.append('dns', domainName);
    form.append('theme', storeTheme);
    form.append('primary_language', storeLanguage);

    imgArr?.map((res, index) => {
      if (res.type === 'video/mp4') {
        form.append(`banner_video`, res);
      } else {
        form.append(`banner_images${index}`, res);
      }
    });

    videoArr.map((res, index) => {
      form.append(`banner_video`, res);
    });

    setCreatingLoading(true);
    UpdatingStoreSetting('/storefront', form).then((result) => {
      if (result.success) {
        toast.success(t('common:successfully-updated'));
        setCreatingLoading(false);
        initialValues.GetData();
        // router.reload();
        // setTimeout(() => {
        //   // window.location.reload();
        // }, 1000);
      } else {
        toast.error(t(result.message));
        setCreatingLoading(false);
      }
    });
  };

  const logoInformation = (
    <span>
      {t('common:logo-help-text')} <br />
      {t('form:logo-dimension-help-text')} &nbsp;
      <span className="font-bold">
        {siteSettings.logo.width}x{siteSettings.logo.height} {t('common:pixel')}
      </span>
    </span>
  );

  const locationDefaultArray = initialValues.data?.locations;
  const locationOnChange = (e) => {
    setLocation(e.id);
  };
  let HREF = 'https://' + initialValues?.data?.domain + '.myignite.site';

  const onAddBtnClick = (e) => {
    e.preventDefault();
    if (packageDetail.name == 'Free package') {
      toast.error('Please update your subscription');
      Router.push('/settings/subscription');
    } else {
      setAddDomainModal(true);
    }
  };
  const onAddCLick = (e) => {
    e.preventDefault();
    setAddDomainModal(false);
  };

  const onChnageDomain = (e) => {
    setDomainName(e.target.value);
  };

  const onRemoveImage = (id,checkVideo) => {
    // console.log(initialValues?.product_images_index);
    // console.log(id, 'idid');
    setIsVideo(checkVideo)
    setDeleteModal(true);
    setDeleteImgId(id);
  };

  const onRemoveImageAddCase = (link, index) => {
    // Create a copy of the current imagePath state
    const updatedImagePath = [...path];
    const linkExists = Object.values(sliderImagesObject).includes(link);
    if (linkExists) {
      for (const [key, value] of Object.entries(sliderImagesObject)) {
        if (value === link) {
          onRemoveImage(key,false);
          // const updatedPath = path.filter((link) => {

          //   return value !== link;
          // });

          // setPath(updatedPath);
          break; // Stop iterating once the link is found
        }
      }
    } else {
      // console.log(updatedImagePath)
      updatedImagePath.splice(index, 1);
      setPath(updatedImagePath);
    }
  };
  const onRemoveVideoAddCase = (link, index) => {
    // Create a copy of the current imagePath state
    const updatedImagePath = [...videoPath];
    const linkExists = Object.values(initialValues?.data?.banner_video).includes(link);
    if (linkExists) {
      for (const [key, value] of Object.entries(initialValues?.data?.banner_video)) {
        if (value === link) {
          onRemoveImage(key,true);

          // const updatedPath = path.filter((link) => {

          //   return value !== link;
          // });

          // setPath(updatedPath);
          break; // Stop iterating once the link is found
        }
      }
    } else {
      // console.log(updatedImagePath)
      updatedImagePath.splice(index, 1);
      setVideoPath(updatedImagePath);
      if(initialValues?.data?.banner_video){
        for (const [key, value] of Object.entries(initialValues?.data?.banner_video)) {
          onRemoveImage(key,true);
        }
      }
    }
  };
  const onConfirmDelete = () => {
    setDeleImgLoader(true);
    DashboardGetFun('/delete-storefront-banner?id=' + deleteImgId).then(
      (result) => {

        if (result.success) {
          if(isVideo){
            const updatedImages = [initialValues?.data?.banner_video];

            delete updatedImages[deleteImgId];
            setVideoPath(updatedImages);
  
            toast.success(result.message);
            setDeleImgLoader(false);
            setDeleteModal(false);
            setIsVideo(false);
            setTimeout(()=>
            router.reload()
            ,3000)
           
          }else{
          const updatedImages = { ...sliderImagesObject };

          delete updatedImages[deleteImgId];
          setSliderImagesObject(updatedImages);

          toast.success(result.message);
          setDeleImgLoader(false);
          setDeleteModal(false);
          }
        } else {
          toast.error(result.message);
          setDeleImgLoader(false);
        }
      }
    );
  };
  const qrCodeRef: any = useRef(null);
  const downloadQRCode = (e) => {
    e.preventDefault();

    if (qrCodeRef.current) {
      html2canvas(qrCodeRef.current, { scale: 2 }).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'qr-code.png';
        link.click();
      });
    }
  };

  const addBlog=(e)=>{
    router.push('/blog');
  }
  const checkBlobType = async (blobUrl) => {
    try {
      const response = await fetch(blobUrl);
      const blob = await response.blob();

      if (blob.type.startsWith('image/')) {
        return false;
        // Handle image
      } else if (blob.type.startsWith('video/')) {
        return true;
        // Handle video
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error fetching or processing the Blob:', error);
    }
  };

  if (loadingData) return <Loader text={t('common:text-loading')} />;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('common:sell-on-website')}
            details={t('common:sell-website-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="flex justify-between">
              <Label>{t('common:online-store')}</Label>
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
              {t('common:online-store-description')}
            </span>
            <br />
            <br />
            <div className="flex flex-col justify-between lg:flex-row  xl:flex-row">
              <div>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={HREF}
                  className="pt-3"
                >
                  {' '}
                  https://{initialValues?.data?.domain}.myignite.site
                </a>
              </div>

              <div className="flex justify-end custom:my-4">
                <Button onClick={onAddBtnClick}>
                  {t('form:button-map-domain')}
                </Button>
              </div>
            </div>
            {initialValues?.data?.dns && (
              <div className="flex flex-row">
                <span className="block flex items-center text-sm font-semibold leading-none text-body-dark">
                  Domain:
                </span>
                <span>{initialValues?.data?.dns}</span>
              </div>
            )}
          </Card>
        </div>
        <Modal open={addDomainModal} onClose={() => setAddDomainModal(false)}>
          <Card className="mt-4" style={{ width: 600 }}>
            <div className="w-full">
              <Label className="flex justify-start">
                {t('form:button-add-domain')}
              </Label>
              <Input
                value={domainName}
                onChange={onChnageDomain}
                className="w-full "
                name=""
                placeholder="example.com"
              />
            </div>
            <div className="flex justify-end pt-5">
              <Button onClick={onAddCLick}>Add</Button>
            </div>
          </Card>
        </Modal>
        <Description
          title={t('form:input-label-logo')}
          details={t('form:logo-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className=" w-full sm:w-8/12 md:w-2/3">
          <FileInput
            name="promotional_sliders"
            control={control}
            setImageFile={setImageFile2}
            multiple={false}
          />
          {path2 && (
            <img
              style={{ width: '50px', height: '50px', marginTop: '1rem' }}
              src={path2}
              alt="cate-image"
            />
          )}
        </Card>
        <Description
          title={t('common:favicon')}
          details={t('form:logo-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="mt-8 w-full sm:w-8/12 md:w-2/3">
          <FileInput
            name="fav_icon"
            control={control}
            setImageFile={setImageFile3}
            multiple={false}
          />
          {path3 && (
            <img
              style={{ width: '50px', height: '50px', marginTop: '1rem' }}
              src={path3}
              alt="cate-image"
            />
          )}
        </Card>
        <Description
          title={t('form:slide-management')}
          details={t('form:slide-management-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="mt-8 w-full sm:w-8/12 md:w-2/3">
          <FileInput
            name="product_images"
            setImageFile={setImageFile}
            control={control}
            multiple={true}
          />
          <div className="flex flex-wrap">
       
            {path &&
              path.map((res, index) => (
                <div className="image-container mt-6 flex" key={index}>
                  <>
                    <img
                      key={index}
                      style={{
                        paddingTop: 5,
                        marginLeft: 10,
                        width: '50px',
                        height: '50px',
                      }}
                      src={res}
                      alt="media"
                    />

                    <div className="h-5 rounded-full bg-slate-200 p-1">
                      <RxCross1
                        onClick={() => onRemoveImageAddCase(res, index)}
                        className="flex h-3 w-3 cursor-pointer justify-end"
                      />
                    </div>
                  </>
                </div>
              ))}
          </div>
          {/* <div className="flex">
            {path &&
              path.map((res, index) => (
                <img
                  key={index}
                  style={{
                    padding: 10,
                    width: '50px',
                    height: '50px',
                    marginTop: '1rem',
                  }}
                  src={res}
                  alt="cate-image"
                />
              ))}
          </div> */}
          <Modal
            open={deleteModal}
            onClose={() => setDeleteModal(true)}
            style={{ width: '45%' }}
          >
            <Card className="" style={{ width: 400 }}>
              <div className="flex">
                <AiFillDelete
                  color="red"
                  width={10}
                  height={10}
                  className="h-8 w-8"
                />
                <Label className="pt-2 text-lg">
                  Are you sure you want to delete
                </Label>
              </div>

              <div className="mt-10 flex justify-end">
                <Button onClick={() => setDeleteModal(false)}>Cancel</Button>
                <Button
                  loading={deleImgLoader}
                  className="ml-5"
                  onClick={onConfirmDelete}
                >
                  Yes
                </Button>
              </div>
            </Card>
          </Modal>
        </Card>
        <Description
          title={''}
          details={''}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="mt-8 w-full sm:w-8/12 md:w-2/3">
          <FileInputStoreFront
            name="product_images"
            setImageFile={setVideoFile}
            control={control}
            multiple={false}
          />
          <div className="flex flex-wrap">
       
            {videoPath &&
              videoPath?.map((res, index) => (
                <div className="image-container mt-6 flex" key={index}>
                  <>
                 
                    <video
                      key={index}
                      style={{
                        paddingTop: 5,
                        marginLeft: 10,
                        width: '50px',
                        height: '50px',
                      }}
                      controls
                    >
                      <source src={res} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <div className="h-5 rounded-full bg-slate-200 p-1">
                      <RxCross1
                        onClick={() => onRemoveVideoAddCase(res, index)}
                        className="flex h-3 w-3 cursor-pointer justify-end"
                      />
                    </div>
                  </>
                </div>
              ))}
          </div>
          {/* <div className="flex">
            {path &&
              path.map((res, index) => (
                <img
                  key={index}
                  style={{
                    padding: 10,
                    width: '50px',
                    height: '50px',
                    marginTop: '1rem',
                  }}
                  src={res}
                  alt="cate-image"
                />
              ))}
          </div> */}
          <Modal
            open={deleteModal}
            onClose={() => setDeleteModal(true)}
            style={{ width: '45%' }}
          >
            <Card className="" style={{ width: 400 }}>
              <div className="flex">
                <AiFillDelete
                  color="red"
                  width={10}
                  height={10}
                  className="h-8 w-8"
                />
                <Label className="pt-2 text-lg">
                  Are you sure you want to delete
                </Label>
              </div>

              <div className="mt-10 flex justify-end">
                <Button onClick={() => setDeleteModal(false)}>Cancel</Button>
                <Button
                  loading={deleImgLoader}
                  className="ml-5"
                  onClick={onConfirmDelete}
                >
                  Yes
                </Button>
              </div>
            </Card>
          </Modal>
        </Card>
      </div>

      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('QR')}
          details={t('Scan QR code')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="flex justify-between">
            <div className="h-40 w-40" ref={qrCodeRef}>
              <QRCode
                size={56}
                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                value={
                  initialValues?.data?.domain
                    ? 'https://' +
                      initialValues?.data?.domain +
                      '.myignite.site'
                    : initialValues?.data?.dns
                }
              />
            </div>
            <Button onClick={downloadQRCode}>Download</Button>
          </div>
        </Card>
      </div>


      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('Enable show news letter popup')}
          details={t('Enable show news letter popup option')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="flex justify-between">
            {/* <div className="flex justify-between"> */}
            <Label>{t('common:online-enable-show-newsletter-popup')}</Label>
            <div className="mb-5">
              <Switch
                checked={show_newsletter_popup}
                className={`${
                  show_newsletter_popup ? 'bg-accent' : 'bg-gray-300'
                } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
                dir="ltr"
                name=""
                onChange={onChangeEnableShowNewsletterPopUp}
              >
                <span className="sr-only">Enable </span>
                <span
                  className={`${
                    show_newsletter_popup ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
                />
              </Switch>
            </div>
            {/* </div> */}
          </div>
        </Card>
      </div>




      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('Enable checkout')}
          details={t('Enable checkout option')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="flex justify-between">
            {/* <div className="flex justify-between"> */}
            <Label>{t('common:online-enable-checkout')}</Label>
            <div className="mb-5">
              <Switch
                checked={enable_checkout}
                className={`${
                  enable_checkout ? 'bg-accent' : 'bg-gray-300'
                } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
                dir="ltr"
                name=""
                onChange={onChangeEnableCheckout}
              >
                <span className="sr-only">Enable </span>
                <span
                  className={`${
                    enable_checkout ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
                />
              </Switch>
            </div>
            {/* </div> */}
          </div>
        </Card>
      </div>



      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('common:Blog')}
          details={t('')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="flex justify-between">
            {/* <div className="flex justify-between"> */}
            <Label>{t('common:Blog')}</Label>
            <div className="mb-5">
            <Button onClick={addBlog}>{t('common:Blog')}</Button>
            </div>
            {/* </div> */}
          </div>
        </Card>
      </div>

  


      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-domain-name')}
          details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-domain-name')}
            {...register('name')}
            variant="outline"
            className="mb-5"
          />
        </Card>
      </div>

      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-theme')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Label>{t('form:input-label-theme')}</Label>
          {/* <Select
            getOptionLabel={(option: any) => option.label}
            styles={selectStyles}
            options={themeArray}
            onChange={handleThemeChange}
            defaultValue={theme}
          /> */}
          <div className="mt-2 grid grid-cols-3 gap-5">
            {themeArray?.map((layout, index) => {
              return (
                <RadioCard
                  key={index}
                  label={t(layout.label)}
                  value={layout.value}
                  src={layout.img}
                  id={layout?.value}
                  name={layout.label}
                  onChange={handleThemeChange}
                  checked={theme.value === layout.value}
                />
              );
            })}
          </div>
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-default-language')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Label>{t('form:input-label-default-language')}</Label>
          <Select
            getOptionLabel={(option: any) => option.label}
            styles={selectStyles}
            options={languageArray}
            onChange={handleLangChange}
            defaultValue={language}
          />
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-store-setting')}
          details={t('form:shop-settings-helper-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Label>{t('form:theme-color')}</Label>
          <ColorPicker
            label={t('form:input-label-color')}
            {...register('color')}
            className="mt-5 mb-5"
            defaultValue={initialValues?.data?.theme_color}
          >
            <DisplayColorCode
              defVal={initialValues?.data?.theme_color}
              control={control}
            />
          </ColorPicker>
          <div className="mb-3">
            <Label>{t('form:input-label-location')}</Label>
            <Select
              getOptionLabel={(option: any) => option.name}
              styles={selectStyles}
              options={LocationDataArray}
              onChange={locationOnChange}
              defaultValue={initialValues.data?.locations}
            />
          </div>
          <Input
            label={t('form:input-label-meta-tital')}
            {...register('meta_title')}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-meta-des')}
            {...register('meta_description')}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-whatsapp-no')}
            {...register('whatsapp_no')}
            variant="outline"
            className="mb-5"
          />
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-custom-script')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card
          className="w-full sm:w-8/12 md:w-2/3"
          // style={{
          //     minHeight: "14rem"
          // }}
        >
          <TextArea
            label={t('form:input-label-custom-script')}
            // {...register('name')}
            name={'customScript'}
            variant="outline"
            className=" min-h-full"
            value={customScript}
            onChange={(e) => {
              setCustomScript(e.target.value);
            }}
          />
        </Card>
      </div>

      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-about-us')}
          details={t('form:shop-settings-helper-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card
          className="w-full sm:w-8/12 md:w-2/3  "
          style={{
            minHeight: '18rem',
          }}
        >
          <Editor
            editorState={aboutEditorState}
            onEditorStateChange={setaboutEditorState}
            editorClassName="p-3"
            toolbarClassName="bg-gray-200 "
            wrapperClassName="border border-border-base focus:border-accent rounded min-h-full "
            toolbar={{
              options: [
                'inline',
                'blockType',
                'fontSize',
                'fontFamily',
                'list',
                'textAlign',
                'colorPicker',
                'link',
                'emoji',
              ],
              inline: { inDropdown: false },
              list: { inDropdown: false },
              textAlign: { inDropdown: false },
              link: { inDropdown: false },
              history: { inDropdown: false },
            }}
          />
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-term-condition')}
          details={t('form:shop-settings-helper-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card
          className="w-full sm:w-8/12 md:w-2/3"
          style={{
            minHeight: '18rem',
          }}
        >
          {/* <TextArea
            label={t('form:input-label-term-condition')}
            name="term_condition"
            value={termCondition}
            onChange={(e) => {
              setTermCondition(e.target.value);
            }}
            variant="outline"
            className="mb-5"
          /> */}
          <Editor
            editorState={termEditorState}
            onEditorStateChange={settermEditorState}
            editorClassName="p-3"
            toolbarClassName="bg-gray-200"
            wrapperClassName="border border-border-base focus:border-accent rounded min-h-full"
            toolbar={{
              options: [
                'inline',
                'blockType',
                'fontSize',
                'fontFamily',
                'list',
                'textAlign',
                'colorPicker',
                'link',
                'emoji',
              ],
              inline: { inDropdown: false },
              list: { inDropdown: false },
              textAlign: { inDropdown: false },
              link: { inDropdown: false },
              history: { inDropdown: false },
            }}
          />
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-privacy-policy')}
          details={t('form:shop-settings-helper-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card
          className="w-full sm:w-8/12 md:w-2/3"
          style={{
            minHeight: '18rem',
          }}
        >
          <Editor
            editorState={privecyEditorState}
            onEditorStateChange={setprivecyEditorState}
            editorClassName="p-3"
            toolbarClassName="bg-gray-200"
            wrapperClassName="border border-border-base focus:border-accent rounded min-h-full"
            toolbar={{
              options: [
                'inline',
                'blockType',
                'fontSize',
                'fontFamily',
                'list',
                'textAlign',
                'colorPicker',
                'link',
                'emoji',
              ],
              inline: { inDropdown: false },
              list: { inDropdown: false },
              textAlign: { inDropdown: false },
              link: { inDropdown: false },
              history: { inDropdown: false },
            }}
          />
        </Card>
      </div>

      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-privacy-return')}
          details={t('form:shop-settings-helper-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card
          className="w-full sm:w-8/12 md:w-2/3"
          style={{
            minHeight: '18rem',
          }}
        >
          <Editor
            editorState={refundEditorState}
            onEditorStateChange={setRefundEditorState}
            editorClassName="p-3"
            toolbarClassName="bg-gray-200"
            wrapperClassName="border border-border-base focus:border-accent rounded min-h-full"
            toolbar={{
              options: [
                'inline',
                'blockType',
                'fontSize',
                'fontFamily',
                'list',
                'textAlign',
                'colorPicker',
                'link',
                'emoji',
              ],
              inline: { inDropdown: false },
              list: { inDropdown: false },
              textAlign: { inDropdown: false },
              link: { inDropdown: false },
              history: { inDropdown: false },
            }}
          />
        </Card>
      </div>

      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-social-link')}
          details={t('form:shop-social-link-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-3">
            <Input
              label={t('form:input-label-facebook-link')}
              {...register('facebook')}
              variant="outline"
              className="mb-5"
            />
          </div>
          <Input
            label={t('form:input-label-instagram-link')}
            {...register('instagram')}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-tiktok-link')}
            {...register('tiktok')}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-twitter-link')}
            {...register('twitter')}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-snapchat-link')}
            {...register('snapchat')}
            variant="outline"
            className="mb-5"
          />
        </Card>
      </div>

      <div className="mb-4 text-end">
        <Button type="submit" loading={creatingLoading}>
          {t('form:button-label-save-settings')}
        </Button>
      </div>
    </form>
  );
}
