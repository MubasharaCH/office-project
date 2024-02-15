import { useRouter } from 'next/router';
import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/Newearch';
import LinkButton from '@/components/ui/link-button';
import { useState } from 'react';
import { LIMIT } from '@/utils/constants';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminOnly } from '@/utils/auth-utils';
import { Routes } from '@/config/routes';
import { GetStaticProps } from 'next';
import AuthorList from '@/components/variant/author-list';
import { useAuthorsQuery } from '@/data/author';
import { SortOrder } from '@/types';
import { Config } from '@/config';
import React from 'react';
import { GetFunction } from '@/services/Service';

export default function Authors() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [loadingData, setloadingData] = useState(false);
  const [ListData, setListData] = useState([]);
  const [newArr, setNewArr] = useState([]);
  const [isCreate, setIsCreate] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isView, setIsView] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const userData: any = localStorage.getItem('user_detail');
  const userDetail: any = JSON.parse(userData);
  const permissionList = userDetail?.all_permissions;
  React.useEffect(() => {
    setloadingData(true);
    GetFunction('/get_variations').then((result) => {
      setListData(result);
      setNewArr(result);
    });
    permissionList?.filter((item) => {
      if (item.toLocaleLowerCase().includes('product.create')) {
        setIsCreate(true);
      }
      if (item.toLocaleLowerCase().includes('product.update')) {
        setIsUpdate(true);
      }
      if (item.toLocaleLowerCase().includes('product.view')) {
        setIsView(true);
      }
      if (item.toLocaleLowerCase().includes('product.delete')) {
        setIsDelete(true);
      }
    });
    setloadingData(false);
  }, []);

  if (loadingData) return <Loader text={t('common:text-loading')} />;
  const filterBySearch = (event) => {
    const query = event.target.value;
    var updatedList = [...ListData];
    updatedList = updatedList.filter((item: any) => {
      return item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
    setNewArr(updatedList);
  };

  return (
    <>
      <Card className="mb-8 flex flex-col items-center xl:flex-row">
        <div className="mb-4 md:w-1/4 xl:mb-0">
          <h1 className="text-xl font-semibold text-heading">
            {t('common:variant-type')}
          </h1>
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
          <Search onChangeearchVal={filterBySearch} />
          {isCreate ? (
            <LinkButton
              href={`${Routes.variant.create}`}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span>+ {t('common:add-variation')}</span>
            </LinkButton>
          ) : null}
        </div>
      </Card>
      {isView && (
        <AuthorList list={newArr} isUpdate={isUpdate} isDelete={isDelete} />
      )}
    </>
  );
}
Authors.authenticate = {
  permissions: adminOnly,
};
Authors.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['form', 'common', 'table'])),
  },
});
