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
import DevicesList from '@/components/devices/devices-list';
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
  // console.log("this is devices page index");
  // const { locale } = useRouter();
  const { t } = useTranslation();
  // const [orderBy, setOrder] = useState('created_at');
  // const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  //const [searchTerm, setSearchTerm] = useState('');
  const [ListData, setListData] = useState([]);
  const [deviceList, setDeviceList] = useState([]);
  const [BusinesDetails, setBusinesDetails] = useState<any>();
  // const [metaData, setMetaData] = useState<any>();
  const [loadingData, setloadingData] = useState(false);
  const [packageDetail, setPackageDetail] = useState<any>({});

  React.useEffect(() => {
    const user_business_details =  localStorage.getItem('user_business_details');
    
    // return;
    const businessDetail = JSON.parse(
      localStorage.getItem('user_business_details')!
    );
    
    if (businessDetail) {
      setPackageDetail(businessDetail?.subscriptions[0]?.package_details);
    }

    let businessDetails: any = localStorage.getItem('user_business_details');
    setBusinesDetails(JSON.parse(businessDetails));
  }, []);

  React.useEffect(() => {
    setloadingData(true);
    if (BusinesDetails != undefined) {
      GetDevices('/device/', BusinesDetails.id).then((result) => {
        setDeviceList(result);
        setloadingData(false);
      });
    }
  }, [BusinesDetails]);

  /*  React.useEffect(() => {
    if (metaData != undefined) {
      setloadingData(true);
      GetFunction('/product?per_page=' + metaData?.total).then((result) => {
        setMetaData(result.meta);
        setListData(result.data);
        setNewArr(result.data);
        setloadingData(false);
      });
    }
  }, [metaData != undefined]); */

  if (loadingData) return <Loader text={t('common:text-loading')} />;

  /*  const filterBySearch = (event) => {
    const query = event.target.value;
    var updatedList = [...ListData];
    let searchLower = query.toLowerCase();
    let filtered = updatedList.filter((list: any) => {
      let searchCategory =
        list?.category?.name == undefined ? '' : list?.category?.name;
      let searchBrand = list?.brand?.name == undefined ? '' : list?.brand?.name;
      let searchPrice =
        list?.product_variations[0]?.variations[0]?.sell_price_inc_tax ==
        undefined
          ? ''
          : list?.product_variations[0]?.variations[0]?.sell_price_inc_tax;
      if (list.name.toLowerCase().includes(searchLower)) {
        return true;
      }
      if (searchCategory.toLowerCase().includes(searchLower)) {
        return true;
      }
      if (searchBrand.toLowerCase().includes(searchLower)) {
        return true;
      }
      if (list.sku?.toLowerCase().includes(searchLower)) {
        return true;
      }
      if (searchPrice.toLowerCase().includes(searchLower)) {
        return true;
      }
    });

    setNewArr(filtered);
  }; */
  const addDevice = () => {
    if (
      packageDetail?.device_count == 0 ||
      deviceList.length < packageDetail?.device_count
    ) {
      AddingDeviceFunction('/create-device').then((result) => {
        if (result?.success === 'true') {
          toast.success(result.message);
          router.back();
        }
        toast.error(result.message);
      });
    } else {
      toast.error('Please update your subscription');
      Router.push('/settings/subscription');
    }
  };

  return (
    <>
      <Card className="mb-8 flex flex-col items-center justify-between md:flex-row xl:flex-row">
        <div className="flex w-full justify-between">
          <div className="mb-4  ">
            <h1 className="text-xl font-semibold text-heading">
              {t('table:table-item-devices-list')}
            </h1>
          </div>

          <div className="flex  items-center space-y-4 ms-auto ">
            <LinkDiv
              className="h-12 w-full rounded bg-accent py-2 px-4 text-white md:w-auto md:ms-6 cursor-pointer"
              onClick={addDevice}
            >
              + {t('common:add-device')}
            </LinkDiv>
            {/* {packageDetail?.device_count == 0 ? (
              
            ) : deviceList.length < packageDetail?.device_count ? (
              <button
                className="h-12 w-full rounded bg-accent py-2 px-4 text-white md:w-auto md:ms-6"
                onClick={addDevice}
              >
                + {t('form:button-label-add')}
              </button>
            ) : null} */}

            {/* <LinkButton
            href={addDevice}
            className="h-12 w-full md:w-auto md:ms-6"
          >
            {/* <span className="block md:hidden xl:block">
              + {'Add ' + t('form:input-label-products')}
            </span> 
            <span className="hidden md:block ">
              + {t('form:button-label-add')}
            </span>
          </LinkButton> */}
          </div>
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
