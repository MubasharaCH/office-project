// import Card from '@/components/common/card';
// import Layout from '@/components/layouts/admin';
// import Search from '@/components/common/search';
// import NewSearch from '@/components/common/Newearch';
// import TypeList from '@/components/group/group-list';
// import ErrorMessage from '@/components/ui/error-message';
// import LinkButton from '@/components/ui/link-button';
// import Loader from '@/components/ui/loader/loader';
// import { SortOrder, Type } from '@/types';
// import { useEffect, useState } from 'react';
// import { useTranslation } from 'next-i18next';
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// import { GetStaticProps } from 'next';
// import { useTypesQuery } from '@/data/brand';
// import { Routes } from '@/config/routes';
// import { useRouter } from 'next/router';
// import { adminOnly } from '@/utils/auth-utils';
// import { Config } from '@/config';
// import BrandList from '@/components/brand/brand-list';
// import { GetFunction } from '@/services/Service';
// import React from 'react';

// export type IProps = {
//   types: Type[] | undefined;
// };

// export default function TypesPage() {
//   const { locale } = useRouter();
//   const { t } = useTranslation();
//   const [loadingData, setloadingData] = useState(false);
//   const [ListData, setListData] = useState([]);

//   const LBW = 'earched val';

//   function filter(array: any, text: any) {
//     const getNodes = (result: any, object: any) => {
//       if (object.name.toLowerCase().includes(text)) {
//         result.push(object);
//         return result;
//       }
//       return result;
//     };

//     return array.reduce(getNodes, []);
//   }

//   const onearchhandle = (e: any) => {
//     let val = e.target.value.toLowerCase();
//     let filteredArray = filter(ListData, val);
//     setListData(filteredArray);
//   };

//   React.useEffect(() => {
//     setloadingData(true);
//     GetFunction('/brand').then((result) => {

//       setListData(result.data);
//       setloadingData(false);
//     });
//   }, []);

//   if (loadingData) return <Loader text={t('common:text-loading')} />;
//   return (
//     <>
//       <Card className="mb-8 flex flex-col items-center xl:flex-row">
//         <div className="mb-4 md:w-1/4 xl:mb-0">
//           <h1 className="text-xl font-semibold text-heading">
//             {t('common:sidebar-nav-item-brands')}
//           </h1>
//         </div>

//         <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
//           <NewSearch onSearch={onearchhandle} />

//           {locale === Config.defaultLanguage && (
//             <LinkButton
//               href={Routes.brands.create}
//               className="h-12 w-full md:w-auto md:ms-6"
//             >
//               <span className="block md:hidden xl:block">
//                 + {t('form:button-label-add-brand')}
//               </span>
//               <span className="hidden md:block xl:hidden">
//                 + {t('form:button-label-add')}
//               </span>
//             </LinkButton>
//           )}
//         </div>
//       </Card>
//       <BrandList list={ListData} />
//     </>
//   );
// }

// TypesPage.authenticate = {
//   permissions: adminOnly,
// };

// TypesPage.Layout = Layout;

// export const getStaticProps: GetStaticProps = async ({ locale }) => ({
//   props: {
//     ...(await serverSideTranslations(locale!, ['table', 'common', 'form'])),
//   },
// });

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
import { GetStaticProps } from 'next';
import { useTypesQuery } from '@/data/brand';
import { Routes } from '@/config/routes';
import { useRouter } from 'next/router';
import { adminOnly } from '@/utils/auth-utils';
import { Config } from '@/config';
import BrandList from '@/components/brand/brand-list';
import { GetFunction } from '@/services/Service';

export type IProps = {
  types: Type[] | undefined;
};

export default function TypesPage() {
  const { locale } = useRouter();
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
    GetFunction('/brand?order_by_name=asc').then((result) => {
      setDummyArr(result.data);
      setNewArr(result.data);
    });

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
            {t('common:sidebar-nav-item-brands')}
          </h1>
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
          <Search onChangeearchVal={filterBySearch} />
          {isCreate ? (
            <LinkButton
              href={Routes.brands.create}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span className="block md:hidden xl:block">
                + {t('form:button-label-add-brand')}
              </span>
              <span className="hidden md:block xl:hidden">
                + {t('form:button-label-add')}
              </span>
            </LinkButton>
          ) : null}
        </div>
      </Card>
      <BrandList list={newArr} isUpdate={isUpdate} isView={isView} />
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
