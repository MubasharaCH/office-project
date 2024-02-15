import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/Newearch';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { Routes } from '@/config/routes';
import { adminOnly } from '@/utils/auth-utils';
import List from '@/components/superAdmin/business-list';
import { AddingDeviceFunction, GetFunction } from '@/services/Service';
import React from 'react';

export default function TypesPage() {
  const { t } = useTranslation();
  const [loadingData, setloadingData] = useState(true);
  const [ListData, setListData] = useState([]);
  const [newArr, setNewArr] = useState([]);
  const [metaData, setMetaData] = useState<any>();
  const [isCreate, setIsCreate] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isView, setIsView] = useState(false);
  const userData: any = localStorage.getItem('user_detail');
  const userDetail: any = JSON.parse(userData);
  const permissionList = userDetail?.all_permissions;
  const [tableLoader, setTableLoader] = useState(false);
  const [listPerPage, setListPerPage] = useState(10);
  React.useEffect(() => {
    AddingDeviceFunction('/get-businesses'+ '?per_page=' + listPerPage).then((result) => {
      setMetaData(result.meta);
      setListData(result.data);
      setNewArr(result.data);
      setloadingData(false);
    });
  }, []);
  React.useEffect(() => {
    setTableLoader(true);
    AddingDeviceFunction('/get-businesses' + '?per_page=' + listPerPage).then((result) => {
      if (result) {
        setMetaData(result.meta);
        setListData(result.data);
        setNewArr(result.data);
        setTableLoader(false);
      }
    });
  }, [listPerPage]);

  const ChangePagination = (current) => {
    setTableLoader(true);
    AddingDeviceFunction('/get-businesses?page=' + current + '&per_page=' + listPerPage).then((result) => {
      setMetaData(result.meta);
      setListData(result.data);
      setNewArr(result.data);
      setTableLoader(false);
    });
  };

  const filterBySearch = (event) => {
    const query = event.target.value;
    AddingDeviceFunction('/get-businesses?name=' + query + '&per_page=' + listPerPage).then((result) => {
      if (result) {
        setMetaData(result.meta);
        setNewArr(result.data);
        setListData(result.data);
      }
    });
  };
  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value);
    setListPerPage(newSize);
    // setCurrentPage(1); // Reset to the first page when changing page size
  };

  if (loadingData) return <Loader text={t('common:text-loading')} />;

  return (
    <>
      <Card className="mb-8 flex flex-col items-center xl:flex-row">
        <div className="mb-4 md:w-1/4 xl:mb-0">
          <h1 className="text-xl font-semibold text-heading">
            {t('common:businesses')}
          </h1>
        </div>
        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
          <Search onChangeearchVal={filterBySearch} />
        </div>
      </Card>
      <div className="flex justify-end mb-3 mr-2">
        <label htmlFor="entries" className="text-sm pr-3 pt-1">
        {t('form:form-show')}
        </label>
        <select
          id="entries"
          value={listPerPage}
          onChange={handlePageSizeChange}
          className="border rounded text-sm p-1"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="-1">All</option>
        </select>
        <label htmlFor="entries" className="text-sm pl-3 pt-1">
        {t('form:form-entries')}
        </label>
      </div>
      <List
        metaData={metaData}
        list={newArr}
        isUpdate={isUpdate}
        isView={isView}
        loader={tableLoader}
        paginationChange={(current) => ChangePagination(current)}
      />
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
