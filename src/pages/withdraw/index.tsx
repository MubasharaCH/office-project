import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import TaxList from '@/components/tax/tax-list';
import ErrorMessage from '@/components/ui/error-message';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import { useTaxesQuery } from '@/data/tax';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Routes } from '@/config/routes';
import { SortOrder } from '@/types';
import { adminOnly } from '@/utils/auth-utils';
import WithDrawList from '@/components/WithDrawMoney/withdraw-list';
import React from 'react';
import { GetFunction, WalletApi } from '@/services/Service';
import { useRouter } from 'next/router';

export default function TaxesPage() {
  const { t } = useTranslation();
  const userData: any = localStorage.getItem('user_detail');
  const userDetail: any = JSON.parse(userData);
  const [data, setData] = useState();
  const router = useRouter();

  const {
    query,
    query: { Uid },
  } = router;

  React.useEffect(() => {
    WalletApi(Uid, 'get-banks').then((result) => {
      if (result?.success?.status == 200) {
        setData(result?.success?.payoutSettings);
      }
    });
  }, []);

  return (
    <>
      <WithDrawList data={data} />
    </>
  );
}

TaxesPage.authenticate = {
  permissions: adminOnly,
};
TaxesPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
