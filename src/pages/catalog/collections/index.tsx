import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import LinkButton from '@/components/ui/link-button';
import { useState } from 'react';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CollectionList from '@/components/collection/collection-list';
import { adminOnly } from '@/utils/auth-utils';
import { SortOrder } from '@/types';
import { Routes } from '@/config/routes';
import { useTagsQuery } from '@/data/tag';
import { useRouter } from 'next/router';
import { Config } from '@/config';
import { GetFunction } from '@/services/Service';
import React from 'react';

export default function Collections() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [loadingData, setloadingData] = useState(false);
  const [ListData, setListData] = useState([]);
  const {
    tags,
    loading: loading,
    paginatorInfo,
    error,
  } = useTagsQuery({
    limit: 10,
    orderBy,
    sortedBy,
    name: searchTerm,
    page,
    language: locale,
  });


  const userDetail = JSON.parse(localStorage.getItem('user_detail')!);
  const permissionList = userDetail?.all_permissions;
  const collectionPermission = {
    view: false,
    create: false,
    update: false,
    delete: false,
  };
  
  permissionList?.forEach((item) => {
    const lowercaseItem = item.toLowerCase();
  
    if (lowercaseItem.includes('collection.view')) {
      collectionPermission.view = true;
    }
    if (lowercaseItem.includes('collection.create')) {
      collectionPermission.create = true;
    }
    if (lowercaseItem.includes('collection.update')) {
      collectionPermission.update = true;
    }
    if (lowercaseItem.includes('collection.delete')) {
      collectionPermission.delete = true;
    }
  });



  const GetStoreFront=()=>{
    setloadingData(true);
      GetFunction('/collections').then((result) => {
        if(result){
          setListData(result.data);
          setloadingData(false);
        }
       
      });
  }
    React.useEffect(() => {
    GetStoreFront();
    }, []);
    

  


  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
  }

  function handlePagination(current: any) {
    setPage(current);
  }

  return (
    <>
      <Card className="mb-8 flex flex-col items-center xl:flex-row">
        <div className="mb-4 md:w-1/4 xl:mb-0">
          <h1 className="text-xl font-semibold text-heading">
            {t('common:sidebar-nav-item-collections')}
          </h1>
        </div>

        <div className="ms-auto flex w-full flex-col items-center space-y-4 md:flex-row md:space-y-0 xl:w-1/2">
          <Search onSearch={handleSearch} />
{collectionPermission.create===true && 
          locale === Config.defaultLanguage && (
            <LinkButton
              href={`/catalog${Routes.collection.create}`}
              className="md:ms-6 h-12 w-full md:w-auto"
            >
              <span className="block md:hidden xl:block">
                + {t('form:button-label-add-collection')}
              </span>
              <span className="hidden md:block xl:hidden">
                + {t('form:button-label-add')}
              </span>
            </LinkButton>
          )
        }
        </div>
      </Card>

      <CollectionList
        tags={ListData}
        collectionPermission={collectionPermission}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
        paginatorInfo={paginatorInfo}
      />
    </>
  );
}
Collections.authenticate = {
  permissions: adminOnly,
};
Collections.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
