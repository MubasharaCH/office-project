import Layout from '@/components/layouts/admin';
import { useRouter } from 'next/router';
import CreateOrUpdateTypeForm from '@/components/supplier/supplier-form';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTypeQuery } from '@/data/type';
import { Config } from '@/config';
import React, { useEffect, useState } from 'react';
import {
  DashboardGetFun,
  GetFunctionBDetail,
  GetSpecificFunction,
  SuperAdmin,
} from '@/services/Service';
import Card from '@/components/common/card';
import Image from 'next/image';
import { Table } from '@/components/ui/table';
import { useIsRTL } from '@/utils/locals';
import Button from '@/components/ui/button';
import { toast } from 'react-toastify';

export default function UpdateTypePage() {
  const [businessData, setBusinessData] = useState<any>('');
  const [loadingData, setloadingData] = useState(false);
  const [loginLoadingData, setLoginLoadingData] = useState(false);
  const [curentId, setCurentId] = useState('');
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const router = useRouter();

  useEffect(() => {
    setloadingData(true);
    SuperAdmin(
      ('connector/api/superadmin/get-business-detail/' +
        query.superAdminSlug) as string
    ).then((result) => {
      if (result.success) {
        setBusinessData(result.business);
        setloadingData(false);
      } else {
        setloadingData(false);
      }
      if (result.error) {
        toast.error(result.error);
      }
    });
  }, []);

  const locationColumns = [
    {
      title: t('form:input-label-name'),
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      width: 200,
      render: (name: any) => <span className="whitespace-nowrap">{name}</span>,
    },
    {
      title: t('form:location-id'),
      className: 'cursor-pointer',
      dataIndex: 'location_id',
      key: 'name',
      align: alignLeft,
      width: 200,
      render: (location_id: any) => (
        <span className="whitespace-nowrap">{location_id}</span>
      ),
    },
    {
      title: t('form:input-label-country'),
      className: 'cursor-pointer',
      dataIndex: 'country',
      key: 'name',
      align: alignLeft,
      width: 150,
      render: (country: any) => (
        <span className="whitespace-nowrap">{country}</span>
      ),
    },
    {
      title: t('form:input-label-city'),
      className: 'cursor-pointer',
      dataIndex: 'city',
      key: 'name',
      align: alignLeft,
      width: 150,
      render: (city: any) => <span className="whitespace-nowrap">{city}</span>,
    },
    {
      title: t('form:input-label-state'),
      className: 'cursor-pointer',
      dataIndex: 'state',
      key: 'name',
      align: alignLeft,
      width: 150,
      render: (state: any) => (
        <span className="whitespace-nowrap">{state}</span>
      ),
    },
  ];
  const subscriptionColumns = [
    {
      title: t('form:input-label-name'),
      className: 'cursor-pointer',
      dataIndex: 'package_details',
      key: 'name',
      align: alignLeft,
      width: 200,
      render: (package_details: any) => (
        <span className="whitespace-nowrap">{package_details?.name}</span>
      ),
    },
    {
      title: t('form:form-item-start-date'),
      className: 'cursor-pointer',
      dataIndex: 'start_date',
      key: 'name',
      align: alignLeft,
      width: 200,
      render: (start_date: any) => (
        <span className="whitespace-nowrap">{start_date}</span>
      ),
    },
    {
      title: t('form:form-item-end-date'),
      className: 'cursor-pointer',
      dataIndex: 'end_date',
      key: 'name',
      align: alignLeft,
      width: 150,
      render: (end_date: any) => (
        <span className="whitespace-nowrap">{end_date}</span>
      ),
    },
    {
      title: t('form:paid-via'),
      className: 'cursor-pointer',
      dataIndex: 'paid_via',
      key: 'name',
      align: alignLeft,
      width: 150,
      render: (paid_via: any) => (
        <span className="whitespace-nowrap">{paid_via}</span>
      ),
    },
    {
      title: t('form:payment-transaction-id'),
      className: 'cursor-pointer',
      dataIndex: 'payment_transaction_id',
      key: 'name',
      align: alignLeft,
      width: 150,
      render: (payment_transaction_id: any) => (
        <span className="whitespace-nowrap">{payment_transaction_id}</span>
      ),
    },
  ];
  const userColumns = [
    {
      title: t('form:input-label-name'),
      className: 'cursor-pointer',
      dataIndex: 'first_name',
      key: 'users',
      align: alignLeft,
      width: 200,
      render: (first_name: any, row) => (
        <span className="whitespace-nowrap">
          {row.first_name} {row.last_name}
        </span>
      ),
    },
    {
      title: t('form:user-name'),
      className: 'cursor-pointer',
      dataIndex: 'username',
      key: 'name',
      align: alignLeft,
      width: 200,
      render: (username: any) => (
        <span className="whitespace-nowrap">{username}</span>
      ),
    },
    {
      title: t('form:input-label-email'),
      className: 'cursor-pointer',
      dataIndex: 'email',
      key: 'name',
      align: alignLeft,
      width: 150,
      render: (email: any) => (
        <span className="whitespace-nowrap">{email}</span>
      ),
    },
    {
      title: t('table:table-item-colum-action'),
      className: 'cursor-pointer',
      dataIndex: 'state',
      key: 'id',
      align: alignLeft,
      width: 150,
      render: function Render(id: any, row: any) {
        return (
          <div>
            <Button
              loading={curentId == row.id ? loginLoadingData : false}
              onClick={() => onLoginClick(row.id)}
            >
              Login
            </Button>
          </div>
        );
      },
    },
  ];
  const onLoginClick = (id) => {
    setCurentId(id);
    setLoginLoadingData(true);
    DashboardGetFun('/multiple-login/' + id).then((result) => {
      if (result.token) {
        loggedInUser(result.token, id);
        getBusinessDetails(result.token, id);
      }
    });
  };

  const loggedInUser = (token, id) => {
    GetFunctionBDetail('/user/loggedin', token).then((result1) => {
      localStorage.setItem('user_detail', JSON.stringify(result1.data));
      localStorage.setItem('user_token', token);
    });
  };
  const getBusinessDetails = (token, id) => {
    GetFunctionBDetail('/business-details', token).then((result) => {
      localStorage.setItem(
        'business_details',
        JSON.stringify(result.data.currency)
      );

      localStorage.setItem(
        'user_business_details',
        JSON.stringify(result.data)
      );
      localStorage.setItem('business_name', result.data.name);
      setLoginLoadingData(false);
      router.push('/');
    });
  };

  if (loadingData) return <Loader text={t('common:text-loading')} />;

  return (
    <>
      <div className="">
        <div className=" border-b border-dashed border-border-base py-5 sm:py-8">
          <div className="flex justify-between w-full">
            <Card className="w-full mr-2 flex justify-between">
              <div className="">
                <div>
                  <h1 className="font-bold text-sm">
                    {t('form:input-label-business-name')}
                  </h1>
                  <h1 className="font-semibold text-sm text-gray-600">
                    {businessData?.name}
                  </h1>
                </div>
                <div className="mt-3">
                  <h1 className="font-bold text-sm">
                    {t('form:input-label-currency')}
                  </h1>
                  <h1 className="font-semibold text-sm text-gray-600">
                    {businessData?.currency?.currency}
                  </h1>
                </div>
              </div>
              <div>{/* <Image src={businessData.loggo} /> */}</div>
            </Card>
            <Card className="w-full ml-2">
              <div>
                <h1 className="font-bold text-sm">{t('form:time-zone')}</h1>
                <h1 className="font-semibold text-sm text-gray-600">
                  {businessData?.time_zone}
                </h1>
              </div>
              <div className="mt-3">
                <h1 className="font-bold text-sm">{t('form:owner')}</h1>
                <h1 className="font-semibold text-sm text-gray-600">
                  {t('form:undefined')}
                  {/* {businessData?.owner?.first_name +
                    ' ' +
                    (businessData?.owner?.last_name == null
                      ? ''
                      : businessData?.owner?.last_name)} */}
                </h1>
              </div>
            </Card>
          </div>
        </div>
        <div className="mt-5 mb-5">
          <h1 className="font-bold text-sm mb-5">
            {t('form:business-location')}
          </h1>
          <div className="mb-8 overflow-hidden rounded shadow">
            <Table
              //@ts-ignore
              columns={locationColumns}
              emptyText={t('table:empty-table-data')}
              data={businessData?.locations}
              rowKey="id"
              scroll={{ x: 380 }}
            />
          </div>
        </div>
        <div className="mt-5 mb-5">
          <h1 className="font-bold text-sm mb-5">
            {t('form:package-subsciption')}
          </h1>
          <div className="mb-8 overflow-hidden rounded shadow">
            <Table
              //@ts-ignore
              columns={subscriptionColumns}
              emptyText={t('table:empty-table-data')}
              data={businessData?.subscriptions}
              rowKey="id"
              scroll={{ x: 380 }}
            />
          </div>
        </div>
        <div className="mt-5 mb-5">
          <h1 className="font-bold text-sm mb-5">
            {t('common:sidebar-nav-item-users')}
          </h1>
          <div className="mb-8 overflow-hidden rounded shadow">
            <Table
              //@ts-ignore
              columns={userColumns}
              emptyText={t('table:empty-table-data')}
              data={businessData?.users}
              rowKey="id"
              scroll={{ x: 380 }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
UpdateTypePage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
