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
import RoleList from '@/components/roles/role-list';
import { GetFunction } from '@/services/Service';
import React from 'react';
import LinkDiv from '@/components/ui/link-div';
import { toast } from 'react-toastify';
import Router from 'next/router';

export default function TypesPage() {
  const { t } = useTranslation();
  const [loadingData, setloadingData] = useState(false);
  const [ListData, setListData] = useState<any>([]);
  const [newArr, setNewArr] = useState<any>([]);
  const [metaData, setMetaData] = useState<any>();
  const [isCreate, setIsCreate] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isView, setIsView] = useState(false);
  const [RoleDataArray, setRoleDataArray] = React.useState<any[]>([]);
  const userData: any = localStorage.getItem('user_detail');
  const userDetail: any = JSON.parse(userData);
  const permissionList = userDetail?.all_permissions;
  const [packageDetail, setPackageDetail] = useState<any>({});

  React.useEffect(() => {
    setloadingData(true);
    const businessDetail = JSON.parse(
      localStorage.getItem('user_business_details')!
    );

    if (businessDetail) {
      const { roles_management } = businessDetail?.subscriptions[0]?.package;
      if (roles_management === 1) {
        if (businessDetail?.subscriptions[0]?.enable_roles_management !== 1) {
          toast.error(t('common:enable_addon_desc'));
          Router.push('/');
          // return;
        }
      } else {
        toast.error(t('common:enable_addon'));
        Router.push('/');
        // return;
      }
      setPackageDetail(businessDetail?.subscriptions[0]?.package_details);

    }
    GetFunction('/get-roles').then((result) => {
      let dataa = result.data;

      let keys = Object.keys(dataa);
      let ordersData = keys.map((data, i) => {
        // console.log(dataa[data]);
        return {
          id: data,
          name: dataa[data],
        };
      });

      setMetaData(ordersData);
    });
    permissionList?.filter((item) => {
      if (item.toLocaleLowerCase().includes('roles.create')) {
        setIsCreate(true);
      }
      if (item.toLocaleLowerCase().includes('roles.update')) {
        setIsUpdate(true);
      }
      if (item.toLocaleLowerCase().includes('roles.view')) {
        setIsView(true);
      }
    });
    setloadingData(false);
  }, []);

  React.useEffect(() => {
    if (metaData != undefined) {
      setloadingData(true);
      GetFunction('/get-roles').then((result) => {
        let dataa = result.data;
        let keys = Object.keys(dataa);
        let ordersData = keys.map((data, i) => {
          // console.log(dataa[data]);
          return {
            id: data,
            name: dataa[data],
          };
        });

        setMetaData(ordersData);

        setListData(ordersData);
        setNewArr(ordersData);
        setloadingData(false);
      });
    }
  }, [metaData != undefined]);

  const onAddClick = () => {
    if (packageDetail.name == 'Free package') {
      toast.error('Please update your subscription');
      Router.push('/settings/subscription');
    } else {
      Router.push(Routes.role.create);
    }
  };

  if (loadingData) return <Loader text={t('common:text-loading')} />;

  const filterBySearch = (event) => {
    const query = event.target.value;
    var updatedList = [...ListData];
    let searchLower = query.toLowerCase();
    let filtered: any = updatedList.filter((list: any) => {
      if (list.name.toLowerCase().includes(searchLower)) {
        return true;
      }
    });

    setNewArr(filtered);
  };

  return (
    <>
      <Card className="mb-8 flex flex-col items-center xl:flex-row">
        <div className="mb-4 md:w-1/4 xl:mb-0">
          <h1 className="text-xl font-semibold text-heading">
            {t('common:roles')}
          </h1>
        </div>

        {/* <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0">
          <Search onChangeearchVal={filterBySearch} />
          {isCreate ? (
            <LinkDiv
              onClick={onAddClick}
              // href={Routes.role.create}
              className="h-12 w-full rounded bg-accent py-2 px-4 text-white md:w-auto md:ms-6 cursor-pointer"
            >
              <span className="block md:hidden xl:block">
                + {t('common:add-role')}
              </span>
              <span className="hidden md:block xl:hidden">
                + {t('form:button-label-add')}
              </span>
            </LinkDiv>
          ) : null}
        </div> */}
        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
          <Search onChangeearchVal={filterBySearch} />
          <LinkDiv
            onClick={onAddClick}
            // href={Routes.location.create}
            className="flex h-12 w-full cursor-pointer md:w-auto md:ms-6"
          >
            <span className="block md:hidden xl:block w-24">
              + {t('common:add-role')}
            </span>
            <span className="hidden md:block xl:hidden">
              + {t('form:button-label-add')}
            </span>
          </LinkDiv>
        </div>
      </Card>


      <RoleList list={newArr} isUpdate={isUpdate} isView={isView} />
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
