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


export default function IgnitePluginPage() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [loadingData, setloadingData] = useState(false);
  const [ListData, setListData] = useState([]);


  React.useEffect(() => {
    setloadingData(true);
    GetFunction('/storefront').then((result) => {
      if(result){
        setListData(result.data);
      
        setloadingData(false);
      }
     
    });
  }, []);
  
  if (loadingData) return <Loader text={t('common:text-loading')} />;

  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('common:store-setting')}
        </h1>
      </div>
      <IgnitePlugin data={ListData}/>
    </>
  );
}

IgnitePluginPage.Layout = AdminLayout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
