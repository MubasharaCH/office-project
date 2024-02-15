import OnBoarding from '@/components/onBoarding/onboarding-form';
import AdminLayout from '@/components/layouts/admin';
import StoreSettingsForm from '@/components/settings/StoreSettingsForm';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useSettingsQuery } from '@/data/settings';
import { useShippingClassesQuery } from '@/data/shipping';
import { useTaxesQuery } from '@/data/tax';
import { GetFunction, GetFunctionBDetail } from '@/services/Service';
import { adminOnly } from '@/utils/auth-utils';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React from 'react';
import { useState, useEffect } from 'react';
import { GetStaticPaths } from 'next';

export default function IgnitePluginPage() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [loadingData, setloadingData] = useState(false);
  const [ListData, setListData] = useState([]);
  const [BusinesDetails, setBusinesDetails] = useState<any>([]);
  const [tableLoader, setTableLoader] = useState(false);

  React.useEffect(() => {
    let token: any = localStorage.getItem('user_token');
    GetFunctionBDetail('/business-details', token).then((result) => {
      setloadingData(true);
      if (result) {
        const dataArray: any = Array.from(result.data.locations); // Convert to array
        console.log('data', dataArray);
        setListData(dataArray); // Set as an array in the state
        setloadingData(false);
      }
    });
  }, []);

  if (loadingData) return <Loader text={t('common:text-loading')} />;

  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('OnBoarding List')}
        </h1>
      </div>
      <OnBoarding Onboard={ListData} />
    </>
  );
}

IgnitePluginPage.Layout = AdminLayout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: 'blocking' };
};
