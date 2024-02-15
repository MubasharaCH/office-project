import IgnitePlugin from '@/components/ignitePlugin/ignitePlugin-card';
import AdminLayout from '@/components/layouts/admin';
import StoreSettingsForm from '@/components/settings/StoreSettingsForm';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useSettingsQuery } from '@/data/settings';
import { useShippingClassesQuery } from '@/data/shipping';
import { useTaxesQuery } from '@/data/tax';
import { GetFunction } from '@/services/Service';
import { adminOnly } from '@/utils/auth-utils';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React from 'react';
import { useState } from 'react';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import Image from 'next/image';
import xero from '../../../public/image/xero.png';
import quickbooks from '../../../public/image/quickbooks.png';
import Input from '@/components/ui/input';
import { Switch } from '@headlessui/react';
import Button from '@/components/ui/button';
import {
  AddingCouponsFunction,
  AddingFunction,
  UpdateUserFunction,
} from '@/services/Service';
import { toast } from 'react-toastify';

export default function IgnitePluginPage() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [loadingData, setloadingData] = useState(false);
  const [ListData, setListData] = useState([]);
  const [updateLoader, setUpdateLoader] = useState(false);

  const [formData, setFormData] = useState({
    xero: {
      id: '',
      provider: 'xero',
      client_id: '',
      client_secret: '',
      callback_url: '',
      status: true,
    },
    quickbooks: {
      id: '',
      provider: 'quickbooks',
      client_id: '',
      client_secret: '',
      callback_url: '',
      status: true,
    },
  });
  React.useEffect(() => {
    setloadingData(true);
    GetFunction('/integrations').then((result) => {
      if (result) {
        const updatedFormData = { ...formData };

        // Iterate through the result.data array and update the formData state
        result.data.forEach((item) => {
          const { provider, credentials } = item;
          if (provider in updatedFormData) {
            updatedFormData[provider] = {
              ...updatedFormData[provider],
              client_id: credentials.client_id,
              client_secret: credentials.client_secret,
              callback_url: credentials.callback_url,
              status: item.status === 1,
              id: item.id,
            };
          }
        });

        // Set the updated state
        setFormData(updatedFormData);

        setListData(result.data);
        setloadingData(false);
      }
    });
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
      xero: {
        id: formData.xero.id,
        provider: formData.xero.provider,
        credentials: JSON.stringify({
          client_id: formData.xero.client_id,
          client_secret: formData.xero.client_secret,
          callback_url: formData.xero.callback_url,
        }),
        status: formData.xero.status ? 1 : 0,
      },
      quickbooks: {
        id: formData.quickbooks.id,
        provider: formData.quickbooks.provider,
        credentials: JSON.stringify({
          client_id: formData.quickbooks.client_id,
          client_secret: formData.quickbooks.client_secret,
          callback_url: formData.quickbooks.callback_url,
        }),
        status: formData.quickbooks.status ? 1 : 0,
      },
    };

    UpdateUserFunction(
      '/handle-integration-credentials',
      combinedFormData
    ).then((result) => {
      if (result.success) {
        setUpdateLoader(false);
        toast.success(result.message);
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

  if (loadingData) return <Loader text={t('common:text-loading')} />;

  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('common:integrations')}
        </h1>
      </div>
      <form>
        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('Xero')}
            // details={t('form:domain-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="grid grid-cols-8 gap-4 mb-2">
              <div className="col-span-2 flex r items-center">
                <Image width={50} height={50} src={xero} alt="" />
              </div>
              <div className="col-span-6">
                <div style={{ float: 'right' }}>
                  <Switch
                    checked={formData.xero.status}
                    onChange={() => handleIntegrationToggle('xero')}
                    className={`${
                      formData.xero.status ? 'bg-accent' : 'bg-gray-300'
                    } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
                    dir="ltr"
                  >
                    <span className="sr-only">Enable </span>
                    <span
                      className={`${
                        formData.xero.status ? 'translate-x-6' : 'translate-x-1'
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
              name="client_id"
              placeholder="Enter Client ID"
              variant="outline"
              className="mb-5"
              value={formData.xero.client_id}
              onChange={(e) => handleInputChange(e, 'xero')}
            />
            <Input
              // label={t('form:input-label-google-analytic-id')}
              // {...register('google_analytics_id')}
              name="client_secret"
              placeholder="Enter Client Secret"
              variant="outline"
              className="mb-5"
              value={formData.xero.client_secret}
              onChange={(e) => handleInputChange(e, 'xero')}
              // value={googleCode}
            />
            {/* <Input
              // label={t('form:input-label-google-analytic-id')}
              // {...register('google_analytics_id')}
              name="callback_url"
              placeholder="Enter Callback Url"
              variant="outline"
              className="mb-5"
              value={formData.xero.callback_url}
              onChange={(e) => handleInputChange(e, 'xero')}
              // value={googleCode}
              
            /> */}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
        <Description
          title={t('Quickbooks')}
          // details={t('form:domain-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="grid grid-cols-8 gap-4 mb-2">
              <div className="col-span-2 flex r items-center">
                <Image width={50} height={50} src={quickbooks} alt="" />
              </div>
              <div className="col-span-6">
                <div style={{ float: 'right' }}>
                  <Switch
                    checked={formData.quickbooks.status}
                    onChange={() => handleIntegrationToggle('quickbooks')}
                    className={`${
                      formData.quickbooks.status ? 'bg-accent' : 'bg-gray-300'
                    } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
                    dir="ltr"
                  >
                    <span className="sr-only">Enable </span>
                    <span
                      className={`${
                        formData.quickbooks.status
                          ? 'translate-x-6'
                          : 'translate-x-1'
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
              // label={t('form:input-label-google-analytic-id')}
              // {...register('google_analytics_id')}
              name="client_id"
              placeholder="Enter Client ID"
              variant="outline"
              className="mb-5"
              value={formData.quickbooks.client_id}
              onChange={(e) => handleInputChange(e, 'quickbooks')}
              // value={googleCode}
            />
            <Input
              // label={t('form:input-label-google-analytic-id')}
              // {...register('google_analytics_id')}
              name="client_secret"
              placeholder="Enter Client Secret"
              variant="outline"
              className="mb-5"
              value={formData.quickbooks.client_secret}
              onChange={(e) => handleInputChange(e, 'quickbooks')}
              // value={googleCode}
            />
            <Input
              // label={t('form:input-label-google-analytic-id')}
              // {...register('google_analytics_id')}
              name="callback_url"
              placeholder="Enter Callback Url"
              variant="outline"
              className="mb-5"
              value={formData.quickbooks.callback_url}
              onChange={(e) => handleInputChange(e, 'quickbooks')}
              // value={googleCode}
            />
          </Card>
        </div>
        <div className="mb-4 text-end">
          <Button loading={updateLoader} onClick={handleSubmit}>
            {t('form:button-label-update')}
          </Button>
        </div>
      </form>
    </>
  );
}

IgnitePluginPage.Layout = AdminLayout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
