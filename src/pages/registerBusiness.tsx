import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import RegistrationForm from '@/components/auth/registration-form';
import { useRouter } from 'next/router';
import { getAuthCredentials, isAuthenticated } from '@/utils/auth-utils';
import { Routes } from '@/config/routes';
import RegisterBusPageLayout from '@/components/layouts/registerBusiness-layout';
import RegistrationBusinessForm from '@/components/auth/registerBusinessDetail';
import React, { useState } from 'react';
import { GetFunction } from '@/services/Service';
import Loader from '@/components/ui/loader/loader';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['common', 'form'])),
  },
});

export default function RegisterPage() {
  const router = useRouter();
  const { token } = getAuthCredentials();
  const [loadingData, setloadingData] = useState(false);
  const [ListData, setListData] = useState([]);
  const { t } = useTranslation();

  React.useEffect(() => {
    setloadingData(true);
    GetFunction('/business-category').then((result) => {
      setListData(result);
      setloadingData(false);
    });
  }, []);

  if (loadingData) return <Loader text={t('common:text-loading')} />;

  if (isAuthenticated({ token })) {
    router.replace(Routes.dashboard);
  }
  return (
    <RegisterBusPageLayout>
      <h3 className="mb-6 mt-4 text-center text-base text-gray-500">
       {t('form:enter-your-business')}
      </h3>
      <RegistrationBusinessForm list={ListData}/>
    </RegisterBusPageLayout>
  );
}
