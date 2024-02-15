import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/Newearch';
import TypeList from '@/components/group/group-list';
import ErrorMessage from '@/components/ui/error-message';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import { SortOrder } from '@/types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { useTypesQuery } from '@/data/brand';
import { Routes } from '@/config/routes';
import { useRouter } from 'next/router';
import { adminOnly } from '@/utils/auth-utils';
import { Config } from '@/config';
import LocationList from '@/components/location/location-list';
import { GetFunction } from '@/services/Service';
import React from 'react';
import { toast } from 'react-toastify';
import LinkDiv from '@/components/ui/link-div';
import Router from 'next/router';

export default function TypesPage() {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const [dummyArr, setDummyArr] = useState([]);
  const [newArr, setNewArr] = useState([]);
  const [metaData, setMetaData] = useState<any>();
  const [loadingData, setloadingData] = useState(false);
  const [packageDetail, setPackageDetail] = useState<any>({});

  useEffect(() => {
    setloadingData(true);
    const businessDetail = JSON.parse(
      localStorage.getItem('user_business_details')!
    );
    if (businessDetail) {
      setPackageDetail(businessDetail?.subscriptions[0]?.package_details);
    }

    GetFunction('/business-location').then((result) => {
      setDummyArr(result.data);
      setNewArr(result.data);
      setloadingData(false);
    });
  }, []);

  if (loadingData) return <Loader text={t('common:text-loading')} />;

  const filterBySearch = (event) => {
    const query = event.target.value;
    var updatedList = [...dummyArr];
    updatedList = updatedList.filter((item: any) => {
      return (
        item.payment_status?.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    });
    setNewArr(updatedList);
  };
  const onAddClick = () => {
    if (
      packageDetail?.location_count == 0 ||
      newArr.length < packageDetail?.location_count
    ) {
      Router.push(Routes.location.create);
    } else {
      toast.error('Please update your subscription');
      Router.push('/settings/subscription');
    }
  };

  return (
    <>
      <Card className="mb-8 flex flex-col items-center xl:flex-row">
        <div className="mb-4 md:w-1/4 xl:mb-0">
          <h1 className="text-xl font-semibold text-heading">
            {t('common:location')}
          </h1>
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
          <Search onChangeearchVal={filterBySearch} />
          <LinkDiv
            onClick={onAddClick}
            // href={Routes.location.create}
            className="flex h-12 w-full cursor-pointer md:w-auto md:ms-6"
          >
            <span className="block md:hidden xl:block w-36">
              + {t('common:add-location')}
            </span>
            <span className="hidden md:block xl:hidden">
              + {t('form:button-label-add')}
            </span>
          </LinkDiv>
          {/* {packageDetail?.location_count == 0 ? (
            <LinkButton
              href={Routes.location.create}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span className="block md:hidden xl:block">
                + {t('common:add-location')}
              </span>
              <span className="hidden md:block xl:hidden">
                + {t('form:button-label-add')}
              </span>
            </LinkButton>
          ) : newArr.length < packageDetail?.location_count ? (
            <LinkButton
              href={Routes.location.create}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span className="block md:hidden xl:block">
                + {t('common:add-location')}
              </span>
              <span className="hidden md:block xl:hidden">
                + {t('form:button-label-add')}
              </span>
            </LinkButton>
          ) : null} */}
        </div>
      </Card>
      <LocationList list={newArr} />
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
