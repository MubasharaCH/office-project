import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/Newearch';
import NewSearch from '@/components/common/Newearch';
import TypeList from '@/components/group/group-list';
import ErrorMessage from '@/components/ui/error-message';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import { SortOrder, Type } from '@/types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useTypesQuery } from '@/data/brand';
import { Routes } from '@/config/routes';
import { useRouter } from 'next/router';
import { adminOnly } from '@/utils/auth-utils';
import { Config } from '@/config';
import CustomFeildlist from '@/components/customFeild/customFeild-list';
import { GetFunction } from '@/services/Service';

export type IProps = {
  types: Type[] | undefined;
};

export default function TypesPage() {
  const { locale, query } = useRouter();
  const { t } = useTranslation();
  const [dummyArr, setDummyArr] = useState([]);
  const [newArr, setNewArr] = useState([]);
  const [loadingData, setloadingData] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isView, setIsView] = useState(false);
  const userData: any = localStorage.getItem('user_detail');
  const userDetail: any = JSON.parse(userData);
  const permissionList = userDetail?.all_permissions;
  useEffect(() => {
    setloadingData(true);
    GetFunction(
      `/custom-fields?type=${query.value}&ref_id=` + query.customId
    ).then((result) => {
      // GetFunction('/custom-fields?ref_id='+query.customId).then((result)
      setDummyArr(result.customFields.data);
      setNewArr(result.customFields.data);
    });
    // ?type=product&ref_id=product_id
    permissionList?.filter((item) => {
      if (item.toLocaleLowerCase().includes('brand.create')) {
        setIsCreate(true);
      }
      if (item.toLocaleLowerCase().includes('brand.update')) {
        setIsUpdate(true);
      }
      if (item.toLocaleLowerCase().includes('brand.view')) {
        setIsView(true);
      }
    });
    setloadingData(false);
  }, []);

  if (loadingData) return <Loader text={t('common:text-loading')} />;

  const filterBySearch = (event) => {
    const query = event.target.value;
    var updatedList = [...dummyArr];
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
            {t('common:sidebar-nav-item-custom')}
          </h1>
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
          <Search onChangeearchVal={filterBySearch} />
          {isCreate ? (
            <LinkButton
              href={`/catalog/customFeild/${query.customId}/create`}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span className="block md:hidden xl:block">
                + {t('form:button-label-add-custom')}
              </span>
              <span className="hidden md:block xl:hidden">
                + {t('form:button-label-add')}
              </span>
            </LinkButton>
          ) : null}
        </div>
      </Card>
      <CustomFeildlist list={newArr} isUpdate={isUpdate} isView={isView} />
    </>
  );
}

TypesPage.authenticate = {
  permissions: adminOnly,
};

TypesPage.Layout = Layout;

// export const getStaticProps: GetStaticProps = async ({ locale }) => ({
//   props: {
//     ...(await serverSideTranslations(locale!, ['table', 'common', 'form'])),
//   },
// });

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: 'blocking' };
};
