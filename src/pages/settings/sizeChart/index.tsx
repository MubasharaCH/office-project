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
import DevicesList from '@/components/sizeChart/sizeChart-list';
import React from 'react';

import {
  GetDevices,
  GetFunction,
  AddingDeviceFunction,
} from '@/services/Service';
import { toast } from 'react-toastify';
import LinkDiv from '@/components/ui/link-div';
import Router from 'next/router';

export default function TypesPage() {
  // const { locale } = useRouter();
  const { t } = useTranslation();
  // const [orderBy, setOrder] = useState('created_at');
  // const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  //const [searchTerm, setSearchTerm] = useState('');
  const [ListData, setListData] = useState([]);
  const [deviceList, setDeviceList] = useState([]);
  const [BusinesDetails, setBusinesDetails] = useState<any>();
  // const [metaData, setMetaData] = useState<any>();
  const [loadingData, setloadingData] = useState(true);
  const [packageDetail, setPackageDetail] = useState<any>({});
  const [isCreate, setIsCreate] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const userData: any = localStorage.getItem('user_detail');
  const userDetail: any = JSON.parse(userData);
  const permissionList = userDetail?.all_permissions;

  React.useEffect(() => {
    const businessDetail = JSON.parse(
      localStorage.getItem('user_business_details')!
    );
    if (businessDetail) {
      const { size_charts } = businessDetail?.subscriptions[0]?.package;
      if (size_charts === 1) {
        if (businessDetail?.subscriptions[0]?.enable_size_chart !== 1) {
          toast.error(t('common:enable_addon_desc'));
          Router.push('/');
          // return;
        }
      } else {
        toast.error(t('common:enable_addon'));
        Router.push('/');
        // return;
      }
      setPackageDetail(businessDetail?.subscriptions[0]?.package_details);
    }

    let businessDetails: any = localStorage.getItem('user_business_details');
    setBusinesDetails(JSON.parse(businessDetails));

    permissionList?.filter((item) => {
      if (item.toLocaleLowerCase().includes('size_chart.create')) {
        setIsCreate(true);
      }
      if (item.toLocaleLowerCase().includes('size_chart.update')) {
        setIsUpdate(true);
      }
      if (item.toLocaleLowerCase().includes('size_chart.delete')) {
        setIsDelete(true);
      }
      // if (item.toLocaleLowerCase().includes('roles.view')) {
      //   setIsView(true);
      // }
    });
  }, []);

  React.useEffect(() => {
    GetFunction('/size-chart').then((result) => {
      setDeviceList(result.data);
      setloadingData(false);
    });
  }, []);

  if (loadingData) return <Loader text={t('common:text-loading')} />;

  const addDevice = () => {
    // if (
    //   packageDetail?.device_count == 0 ||
    //   deviceList.length < packageDetail?.device_count
    // ) {
    //   AddingDeviceFunction('/create-device').then((result) => {
    //     if (result?.success === 'true') {
    //       toast.success(result.message);
    //       router.back();
    //     }
    //     toast.error(result.message);
    //   });
    // } else {
    //   toast.error('Please update your subscription');
    //   Router.push('/settings/subscription');
    // }
  };

  return (
    <>
      <Card className="mb-8 flex flex-col items-center justify-between md:flex-row xl:flex-row">
        <div className="flex w-full justify-between">
          <div className="mb-4  ">
            <h1 className="text-xl font-semibold text-heading">
              {t('Size Chart')}
            </h1>
          </div>
          {isCreate && (
            <div className="flex  items-center space-y-4 ms-auto ">
              <LinkButton
                className="h-12 w-full cursor-pointer rounded bg-accent py-2 px-4 text-white md:w-auto md:ms-6"
                href={Routes.sizeChart.create}
              >
                + {t('Add Size Chart')}
              </LinkButton>
            </div>
          )}
        </div>
      </Card>
      <DevicesList list={deviceList} />
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
