import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/Newearch';
import TypeList from '@/components/group/group-list';
import ErrorMessage from '@/components/ui/error-message';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import { SortOrder } from '@/types';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { useTypesQuery } from '@/data/brand';
import { Routes } from '@/config/routes';
import router, { useRouter } from 'next/router';
import { adminOnly } from '@/utils/auth-utils';
import { Config } from '@/config';
import CouponsList from '@/components/coupons/coupon-list';
import React from 'react';
import {
  GetDevices,
  GetFunction,
  AddingDeviceFunction,
} from '@/services/Service';

export default function TypesPage() {
  const { t } = useTranslation();
  const [deviceList, setDeviceList] = useState([]);
  const [loadingData, setloadingData] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isView, setIsView] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const userData: any = localStorage.getItem('user_detail');
  const userDetail: any = JSON.parse(userData);
  const permissionList = userDetail?.all_permissions;
  React.useEffect(() => {
    setloadingData(true);
    GetFunction('/get-coupons').then((result) => {
      setDeviceList(result);
      permissionList?.filter((item) => {
        if (item.toLocaleLowerCase().includes('coupons.create')) {
          setIsCreate(true);
        }
        if (item.toLocaleLowerCase().includes('coupons.update')) {
          setIsUpdate(true);
        }
        if (item.toLocaleLowerCase().includes('coupons.view')) {
          setIsView(true);
        }
        if (item.toLocaleLowerCase().includes('coupons.delete')) {
          setIsDelete(true);
        }
      });
      setloadingData(false);
    });
  }, []);

  if (loadingData) return <Loader text={t('common:text-loading')} />;

  const addDevice = () => {};

  return (
    <>
      <Card className="mb-8 flex flex-col items-center justify-between md:flex-row xl:flex-row">
        <div className="flex w-full justify-between">
          <div className="mb-4  ">
            <h1 className="text-xl font-semibold text-heading">
              {t('common:coupon-list')}
            </h1>
          </div>
          {isCreate && (
            <div className="flex  items-center space-y-4 ms-auto ">
              <LinkButton
                href={Routes.coupons.create}
                className="h-12 w-full md:w-auto md:ms-6"
              >
                <span className="block md:hidden xl:block">
                  + {t('common:add-coupon')}
                </span>
                <span className="hidden md:block xl:hidden">
                  + {t('form:button-label-add')}
                </span>
              </LinkButton>
            </div>
          )}
        </div>
      </Card>
      {isView && (
        <CouponsList
          list={deviceList}
          isUpdate={isUpdate}
          isDelete={isDelete}
        />
      )}
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
