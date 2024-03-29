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
import { useRouter } from 'next/router';
import { adminOnly } from '@/utils/auth-utils';
import { Config } from '@/config';
import CatagoryList from '@/components/category/category-list';
import React from 'react';
import { GetFunction } from '@/services/Service';

export default function TypesPage() {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingData, setloadingData] = useState(false);
  const [ListData, setListData] = useState([]);
  const [newArr, setNewArr] = useState([]);
  const [isCreate, setIsCreate] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isView, setIsView] = useState(false);
  const [businessDetail, setBussinessDetail] = useState<any>([]);
  const [subscriptionDetail, setSubscriptionDetail] = useState<any>({});
  const userData: any = localStorage.getItem('user_detail');
  const userDetail: any = JSON.parse(userData);
  const permissionList = userDetail?.all_permissions;
  React.useEffect(() => {
    setloadingData(true);
    GetFunction('/taxonomy').then((result) => {
      setListData(result.data);
      setNewArr(result.data);
    });
    permissionList?.filter((item) => {
      if (item.toLocaleLowerCase().includes('category.create')) {
        setIsCreate(true);
      }
      if (item.toLocaleLowerCase().includes('category.update')) {
        setIsUpdate(true);
      }
      if (item.toLocaleLowerCase().includes('category.view')) {
        setIsView(true);
      }
    });
    const businessDetail = JSON.parse(
      localStorage.getItem('user_business_details')!
    );
    if (businessDetail) {
      // console.log(businessDetail?.enabled_modules)
      setSubscriptionDetail(businessDetail?.subscriptions[0]);
      setBussinessDetail(businessDetail?.enabled_modules);
    }
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
            {t('common:categories')}
          </h1>
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
          <Search onChangeearchVal={filterBySearch} />
          {isCreate ? (
            <LinkButton
              href={Routes.category.create}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span className="block md:hidden xl:block">
                + {t('common:add-category')}
              </span>
              <span className="hidden md:block xl:hidden">
                + {t('form:button-label-add')}
              </span>
            </LinkButton>
          ) : null}
        </div>
      </Card>
      <CatagoryList
        businessDetail={businessDetail}
        subscriptionDetail={subscriptionDetail}
        list={newArr}
        isUpdate={isUpdate}
        isView={isView}
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
