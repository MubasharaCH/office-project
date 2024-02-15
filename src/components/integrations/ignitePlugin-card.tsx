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
import { UpdatingStoreSetting } from '@/services/Service';
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

  useEffect(() => {
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
      const tabbyValue: any = initialValues?.data?.tabby;

      if (tabbyValue) {
        setTabby(JSON.parse(tabbyValue));
      }
    }
  }, [initialValues]);
  // const[customScript,setCustomScript]=useState<any>()

  const onSubmit = (values: FormValues) => {
    let ID = initialValues.data.id;

    form.append('id', ID);
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
    form.append('location_id', values.location_id ? values.location_id : '');
    form.append('tabby', JSON.stringify(Tabby));
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

  const handleFacebookPlugin = () => {
    setIsFacebook(!isFacebook);
  };
  const handleGooglePlugin = () => {
    setIsGoogle(!isGoogle);
  };
  const handleAdroll = () => {
    setIsAdroll(!isAdroll);
  };
  const handleAmaze = () => {
    setIsAmaze(!isAmaze);
  };
  const handleDrift = () => {
    setIsDrift(!isDrift);
  };
  const handleFreshChat = () => {
    setIsFreshChat(!isFreshChat);
  };
  const handleHotJar = () => {
    setIsHotjar(!isHotjar);
  };
  const handleIntercom = () => {
    setIsIntercom(!isIntercom);
  };
  const handleLiveChat = () => {
    setIsLiveChat(!isLiveChat);
  };
  const handleTawk = () => {
    setIsTawk(!isTawk);
  };
  const handleTidio = () => {
    setIsTidio(!isTidio);
  };
  const handleTrengo = () => {
    setIsTrengo(!isTrengo);
  };
  const handleTabby = () => {
    setIsTabby(!isTabby);
  };
  const handleZendesk = () => {
    setIsZendesk(!isZendesk);
  };
  const handleTabbyInput = (event) => {
    const { name, value } = event.target;

    setTabby((prevTabby) => ({
      ...prevTabby,
      [name]: value,
    }));
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-google-analytic-id')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid grid-cols-8 gap-4 mb-2">
            <div className="col-span-2 flex justify-center items-center">
              <Image width={100} height={100} src={googleAnalytic} alt="" />
            </div>
            <div className="col-span-6">
              <h3 className="font-semibold">{t('common:google-analytic')}</h3>
              <p className="">{t('common:google-analytic-description')}</p>
              {Google ? (
                <button
                  type="button"
                  className="bg-accent text-white p-2 rounded"
                  onClick={() => setGoogle('')}
                >
                  {t('common:uninstall-plugin')}
                </button>
              ) : (
                <button
                  type="button"
                  className="bg-accent text-white p-2 rounded"
                  onClick={handleGooglePlugin}
                >
                  {t('common:install-plugin')}
                </button>
              )}
            </div>
          </div>
          {(isGoogle || initialValues?.data.google_analytics_id) && (
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
          )}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-facebook-pixel-id')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid grid-cols-8 gap-4 mb-2">
            <div className="col-span-2 flex justify-center items-center ">
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
              {Facebook ? (
                <button
                  type="button"
                  className="bg-accent text-white p-2 rounded"
                  onClick={() => setFacebook('')}
                >
                  {t('common:uninstall-plugin')}
                </button>
              ) : (
                <button
                  type="button"
                  className="bg-accent text-white p-2 rounded"
                  onClick={handleFacebookPlugin}
                >
                  {t('common:install-plugin')}
                </button>
              )}
            </div>
          </div>
          {(isFacebook || initialValues?.data.fb_tracking_pixel_id) && (
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
          )}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-intercom-live-chat')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid grid-cols-8 gap-4 mb-2">
            <div className="col-span-2 flex justify-center items-center ">
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
              {Intercom ? (
                <button
                  type="button"
                  className="bg-accent text-white p-2 rounded"
                  onClick={() => setIntercom('')}
                >
                  {t('common:uninstall-plugin')}
                </button>
              ) : (
                <button
                  type="button"
                  className="bg-accent text-white p-2 rounded"
                  onClick={handleIntercom}
                >
                  {t('common:install-plugin')}
                </button>
              )}
            </div>
          </div>
          {(isIntercom || initialValues?.data.intercom_live_chat) && (
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
          )}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-drift-live-chat')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid grid-cols-8 gap-4 mb-2">
            <div className="col-span-2 flex justify-center items-center ">
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
              {Drift ? (
                <button
                  type="button"
                  className="bg-accent text-white p-2 rounded"
                  onClick={() => setDrift('')}
                >
                  {t('common:uninstall-plugin')}
                </button>
              ) : (
                <button
                  type="button"
                  className="bg-accent text-white p-2 rounded"
                  onClick={handleDrift}
                >
                  {t('common:install-plugin')}
                </button>
              )}
            </div>
          </div>
          {(isDrift || initialValues?.data.drift_live_chat) && (
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
          )}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-tawk-live-chat')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid grid-cols-8 gap-4 mb-2">
            <div className="col-span-2 flex justify-center items-center ">
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
              {Tawk ? (
                <button
                  type="button"
                  className="bg-accent text-white p-2 rounded"
                  onClick={() => setTawk('')}
                >
                  {t('common:uninstall-plugin')}
                </button>
              ) : (
                <button
                  type="button"
                  className="bg-accent text-white p-2 rounded"
                  onClick={handleTawk}
                >
                  {t('common:install-plugin')}
                </button>
              )}
            </div>
          </div>
          {(isTawk || initialValues?.data.tawk_To_live_chat) && (
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
          )}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-tidio-live-chat')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid grid-cols-8 gap-4 mb-2">
            <div className="col-span-2 flex justify-center items-center ">
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
              {Tidio ? (
                <button
                  type="button"
                  className="bg-accent text-white p-2 rounded"
                  onClick={() => setTidio('')}
                >
                  {t('common:uninstall-plugin')}
                </button>
              ) : (
                <button
                  type="button"
                  className="bg-accent text-white p-2 rounded"
                  onClick={handleTidio}
                >
                  {t('common:install-plugin')}
                </button>
              )}
            </div>
          </div>
          {(isTidio || initialValues?.data.tidio_live_chat) && (
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
          )}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-adroll')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid grid-cols-8 gap-4 mb-2">
            <div className="col-span-2 flex justify-center items-center ">
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
              {Adroll ? (
                <button
                  type="button"
                  className="bg-accent text-white p-2 rounded"
                  onClick={() => setAdroll('')}
                >
                  {t('common:uninstall-plugin')}
                </button>
              ) : (
                <button
                  type="button"
                  className="bg-accent text-white p-2 rounded"
                  onClick={handleAdroll}
                >
                  {t('common:install-plugin')}
                </button>
              )}
            </div>
          </div>
          {(isAdroll || initialValues?.data.adroll) && (
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
          )}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-hotjar')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid grid-cols-8 gap-4 mb-2">
            <div className="col-span-2 flex justify-center items-center ">
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
              {Hotjar ? (
                <button
                  type="button"
                  className="bg-accent text-white p-2 rounded"
                  onClick={() => setHotjar('')}
                >
                  {t('common:uninstall-plugin')}
                </button>
              ) : (
                <button
                  type="button"
                  className="bg-accent text-white p-2 rounded"
                  onClick={handleHotJar}
                >
                  {t('common:install-plugin')}
                </button>
              )}
            </div>
          </div>
          {(isHotjar || initialValues?.data.hotjar) && (
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
          )}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-amaze')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid grid-cols-8 gap-4 mb-2">
            <div className="col-span-2 flex justify-center items-center ">
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
              {Amaze ? (
                <button
                  type="button"
                  className="bg-accent text-white p-2 rounded"
                  onClick={() => setAmaze('')}
                >
                  {t('common:uninstall-plugin')}
                </button>
              ) : (
                <button
                  type="button"
                  className="bg-accent text-white p-2 rounded"
                  onClick={handleAmaze}
                >
                  {t('common:install-plugin')}
                </button>
              )}
            </div>
          </div>
          {(isAmaze || initialValues?.data.re_amaze) && (
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
          )}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-zendesk-chat')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid grid-cols-8 gap-4 mb-2">
            <div className="col-span-2 flex justify-center items-center ">
              <Image
                width={100}
                height={100}
                src={zendesk}
                className="rounded"
                alt=""
              />
            </div>
            <div className="col-span-6">
              <h3 className="font-semibold">{t('common:zendesk')}</h3>
              <p className="">{t('common:zendesk-chat-description')}</p>
              {Zendesk ? (
                <button
                  type="button"
                  className="bg-accent text-white p-2 rounded"
                  onClick={() => setZendesk('')}
                >
                  {t('common:uninstall-plugin')}
                </button>
              ) : (
                <button
                  type="button"
                  className="bg-accent text-white p-2 rounded"
                  onClick={handleZendesk}
                >
                  {t('common:install-plugin')}
                </button>
              )}
            </div>
          </div>
          {(isZendesk || initialValues?.data.zendesk_chat) && (
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
          )}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-fresh-chat')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid grid-cols-8 gap-4 mb-2">
            <div className="col-span-2 flex justify-center items-center ">
              <Image
                width={100}
                height={100}
                src={freshChat}
                className="rounded"
                alt=""
              />
            </div>
            <div className="col-span-6">
              <h3 className="font-semibold"> {t('common:fresh')}</h3>
              <p className="">{t('common:fresh-chat-description')}</p>
              {FreshChat ? (
                <button
                  type="button"
                  className="bg-accent text-white p-2 rounded"
                  onClick={() => setFreshChat('')}
                >
                  {t('common:uninstall-plugin')}
                </button>
              ) : (
                <button
                  type="button"
                  className="bg-accent text-white p-2 rounded"
                  onClick={handleFreshChat}
                >
                  {t('common:install-plugin')}
                </button>
              )}
            </div>
          </div>
          {(isFreshChat || initialValues?.data.fresh_chat) && (
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
          )}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-live-chat')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid grid-cols-8 gap-4 mb-2">
            <div className="col-span-2 flex justify-center items-center ">
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
              {LiveChat ? (
                <button
                  type="button"
                  className="bg-accent text-white p-2 rounded"
                  onClick={() => setLiveChat('')}
                >
                  {t('common:uninstall-plugin')}
                </button>
              ) : (
                <button
                  type="button"
                  className="bg-accent text-white p-2 rounded"
                  onClick={handleLiveChat}
                >
                  {t('common:install-plugin')}
                </button>
              )}
            </div>
          </div>
          {(isLiveChat || initialValues?.data.live_chat) && (
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
          )}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-trengo')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid grid-cols-8 gap-4 mb-2">
            <div className="col-span-2 flex justify-center items-center ">
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
              {Trengo ? (
                <button
                  type="button"
                  className="bg-accent text-white p-2 rounded"
                  onClick={() => setTrengo('')}
                >
                  {t('common:uninstall-plugin')}
                </button>
              ) : (
                <button
                  type="button"
                  className="bg-accent text-white p-2 rounded"
                  onClick={handleTrengo}
                >
                  {t('common:install-plugin')}
                </button>
              )}
            </div>
          </div>
          {(isTrengo || initialValues?.data.trengo) && (
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
          )}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('form:input-label-tabby')}
          details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="grid grid-cols-8 gap-4 mb-2">
            <div className="col-span-2 flex justify-center items-center ">
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
              {Tabby?.merchant_code || Tabby?.public_key ? (
                <button
                  type="button"
                  className="bg-accent text-white p-2 rounded"
                  onClick={() =>
                    setTabby({ merchant_code: '', public_key: '' })
                  }
                >
                  {t('common:uninstall-plugin')}
                </button>
              ) : (
                <button
                  type="button"
                  className="bg-accent text-white p-2 rounded"
                  onClick={handleTabby}
                >
                  {t('common:install-plugin')}
                </button>
              )}
            </div>
          </div>
          {(isTabby || Tabby?.merchant_code || Tabby?.public_key) && (
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
