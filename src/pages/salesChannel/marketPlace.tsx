import Layout from '@/components/layouts/admin';
import MazeedForm from '@/components/marketPlace/mazeed-form'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import Router from 'next/router';

export default function CreateCategoriesPage() {
  const { t } = useTranslation();
useEffect(() => {
    let user_business_details: any = localStorage.getItem(
      'user_business_details'
    );
    const user_business_id = JSON.parse(user_business_details);
if(user_business_id){
  const { shopify } = user_business_id?.subscriptions[0]?.package;
  if (shopify === 1) {
    if (user_business_id?.subscriptions[0]?.shopify !== 1) {
      toast.error(t('common:enable_addon_desc'));
      Router.push('/');
      // return;
    }
  } else {
    toast.error(t('common:enable_addon'));
    Router.push('/');
    // return;
  }
}
   
  }, []);
  return (
    <>
      
      <MazeedForm />
    </>
  );
}

CreateCategoriesPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
