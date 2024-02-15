import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { adminOnly } from '@/utils/auth-utils';
import React, { useEffect, useState } from 'react';
import AddonsCard from '@/components/addons/card';
import { GetFunction } from '@/services/Service';
import CartCounterButton from '@/components/cart/cart-counter-button';
import Drawer from '@/components/ui/drawer';
import DrawerWrapper from '@/components/ui/drawer-wrapper';
import AddonsCart from '@/components/cart/addons-cart';
import Loader from '@/components/ui/loader/loader';

export default function TypesPage() {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const [loadingData, setloadingData] = useState(true);
  const [displayCartSidebar, setdisplayCartSidebar] = useState(false);
  const [packegeData, setPackegeData] = useState([]);

  useEffect(() => {
    GetFunction('/packages').then((result: any) => {
      if (result.data) {
        const oneTimePackages = result.data.filter(
          (item) => item.interval === 'one-time'
        );
        setPackegeData(oneTimePackages);
        setloadingData(false);
      }
    });
  }, []);

  const inDrawerClick = () => {
    setdisplayCartSidebar(true);
  };

  if (loadingData) return <Loader text={t('common:text-loading')} />;

  return (
    <>
      {packegeData?.map((addon: any, index: any) => (
        <AddonsCard key={index} item={addon} />
      ))}
      <div onClick={inDrawerClick}>
        <CartCounterButton />
      </div>
      <Drawer
        open={displayCartSidebar}
        onClose={() => setdisplayCartSidebar(false)}
        variant="right"
      >
        <DrawerWrapper hideTopBar={true}>
          <AddonsCart />
        </DrawerWrapper>
      </Drawer>
    </>
  );
}

TypesPage.authenticate = {
  permissions: adminOnly,
};

TypesPage.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['table', 'common', 'form'])),
  },
});
