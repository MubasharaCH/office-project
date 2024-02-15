// import React, { useEffect } from 'react';

// export default function loginFromMobile() {
//   useEffect(() => {
//     // or custom event listener
//     window.addEventListener(
//       'myCustomEvent',
//       (event: any) => {
//       },
//       false
//     );
//   }, []);
//   return <div>Login From Mobile Page</div>;
// }
import Router from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { adminOnly, setAuthCredentials } from '@/utils/auth-utils';
import React, { useEffect, useState } from 'react';
import { GetFunctionBDetail } from '@/services/Service';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { Routes } from '@/config/routes';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import moment from 'moment';

export default function TypesPage() {
  const { t } = useTranslation();

  const getBusinessDetails = (token) => {
    // let business: any = {};
    GetFunctionBDetail('/business-details', token).then((result) => {
      // business = result?.data;
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

      if (result?.data) {
        setTimeout(() => {
          if (
            result?.data?.subscriptions[0]?.package_details?.name.toLowerCase() ===
            'free package'
          ) {
            Router.push('/updateSubscription');
          } else {
            Router.push(Routes.dashboard);
          }
        }, 1000);
      }
    });
    GetFunctionBDetail('/product', token).then((result) => {
      localStorage.setItem('product_list', JSON.stringify(result.data));
    });
    GetFunctionBDetail('/user/loggedin', token).then((result) => {
      localStorage.setItem('user_detail', JSON.stringify(result.data));
    });
    toast.success('Login Successfully');
  };
  window.addEventListener('flutterInAppWebViewPlatformReady', function (event) {
    // call flutter handler with name 'mySum' and pass one or more arguments
    (window as any).flutter_inappwebview
      .callHandler('mySum')
      .then(function (result) {
        localStorage.setItem('user_token', result);
        getBusinessDetails(result);
        setAuthCredentials(result);
      });
  });

  return (
    <>
      <Loader text={t('common:text-loading')} />
    </>
  );
}

// TypesPage.authenticate = {
//   permissions: adminOnly,
// };

// TypesPage.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['table', 'common', 'form'])),
  },
});
