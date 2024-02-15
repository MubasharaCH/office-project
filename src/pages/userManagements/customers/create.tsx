import Layout from '@/components/layouts/admin';
import CreateOrUpdateTypeForm from '@/components/customers/customer-form';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import React, { useState } from 'react';
import Loader from '@/components/ui/loader/loader';

export default function CreateTypePage() {
  const { t } = useTranslation();
  const [countryInfo,setCountryInfo]=useState<any>(null)
  const [loadingData, setloadingData] = useState(false);
  React.useEffect(() => {
    setloadingData(true);
    fetch('https://api.ipregistry.co/?key=7qsumd6hmu9lk9ns')
      .then(function (response) {
        return response.json();
      })
      .then(function (payload) {
        setCountryInfo(payload?.location.country);
        setloadingData(false);
       
      });
  }, []);
  if (loadingData) return <Loader text={t('common:text-loading')} />;

  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-create-customers')}
        </h1>
      </div>
      <CreateOrUpdateTypeForm countryInfo={countryInfo} />
    </>
  );
}
CreateTypePage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
