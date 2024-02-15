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
import ManageStockList from '@/components/manageStock/manageStock-list';
import React from 'react';
import { GetFunction } from '@/services/Service';
import Select, { createFilter } from 'react-select';
import { selectStyles } from '@/components/ui/select/select.styles';
export default function TypesPage() {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [searchTerm, setSearchTerm] = useState('');
  const [ListData, setListData] = useState<any>([]);
  const [newArr, setNewArr] = useState<any>([]);
  const [metaData, setMetaData] = useState<any>();
  const [loadingData, setloadingData] = useState(false);
  const [tableLoader, setTableLoader] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isView, setIsView] = useState(false);
  const [packageDetail, setPackageDetail] = useState<any>({});
  const [locationID, setLocationID] = useState<any>();
  const [ locationArray,setLocationArray] = React.useState<any>([]);
  const userData: any = localStorage.getItem('user_detail');
  const userDetail: any = JSON.parse(userData);
  const permissionList = userDetail?.all_permissions;

  React.useEffect(() => {
    setloadingData(true);

      GetFunction('/business-location').then((result) => {
        let ordersData = result.data.map((data, i) => {
          return {
            key: i,
            id: data.id,
            value: data.name,
            label: data.name,
          };
        });
        setLocationArray(ordersData);
          setLocationID(ordersData[0]?.id);
        setloadingData(false);
      });
  }, []);

  const getProductFunction = (locationID) => {
    if(locationID){
      setTableLoader(true);
    GetFunction('/product?location_id=' + locationID + '&per_page=-1').then(
      (result) => {
        setNewArr(result.data);
        setTableLoader(false);
    
      }
    );
     }
  };

  React.useEffect(() => {
    getProductFunction(locationID);
  }, [locationID]);

  const OnChangeLocation = (e) => {
    setLocationID(e.id);
   };

  if (loadingData) return <Loader text={t('common:text-loading')} />;

  // const filterBySearch = (event) => {
  //   const query = event.target.value;
  //   var updatedList = [...ListData];
  //   let searchLower = query.toLowerCase();
  //   const filtered = updatedList.filter((item) => {
  //     const searchLocationFrom =
  //       item.location_from == undefined ? '' : item.location_from;
  //     const searchLocationTo =
  //       item.location_to == undefined ? '' : item.location_to;
  //     return (
  //       searchLocationFrom.toLowerCase().includes(searchLower) ||
  //       searchLocationTo.toLowerCase().includes(searchLower)
  //     );
  //   });

  //   setNewArr(filtered);
  // };





  return (
    <>
      <Card className="mb-8 flex flex-col items-center xl:flex-row">
        <div className="mb-4 md:w-1/4 xl:mb-0">
          <h1 className="text-xl font-semibold text-heading">
            {t('common:label-manage-stock')}
          </h1>
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
        <Select
            getOptionLabel={(option: any) => option.label}
            getOptionValue={(option: any) => option.key}
            styles={selectStyles}
            options={locationArray}
            onChange={OnChangeLocation}
            defaultValue={locationArray[0]}
          />
          <LinkButton
            href={Routes.manageStock.create}
            className="h-12 w-full md:w-auto md:ms-6"
          >
            <span className="block md:hidden xl:block">
              + {t('common:button-label-add-stock')}
            </span>
            <span className="hidden md:block xl:hidden">
              + {t('common:button-label-add-stock')}
            </span>
          </LinkButton>
        </div>
      </Card>
      {tableLoader ? <Loader text={t('common:text-loading')} />:
      <ManageStockList list={newArr} isUpdate={isUpdate} isView={isView}  locationID={locationID}/>
  }
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
