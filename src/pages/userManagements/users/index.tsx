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
import UserList from '@/components/users/user-list';
import { GetFunction } from '@/services/Service';
import React from 'react';
import LinkDiv from '@/components/ui/link-div';
import { toast } from 'react-toastify';
import Router from 'next/router';

export default function TypesPage() {
  const { t } = useTranslation();
  const [loadingData, setloadingData] = useState(false);
  const [ListData, setListData] = useState([]);
  const [newArr, setNewArr] = useState([]);
  const [metaData, setMetaData] = useState<any>();
  const [isCreate, setIsCreate] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isView, setIsView] = useState(false);
  const [RoleDataArray, setRoleDataArray] = React.useState<any[]>([]);
  const [packageDetail, setPackageDetail] = useState<any>({});

  React.useEffect(() => {
    setloadingData(true);

    const userData: any = localStorage.getItem('user_detail');
    const userDetail: any = JSON.parse(userData);
    const permissionList = userDetail?.all_permissions;
    const businessDetail = JSON.parse(
      localStorage.getItem('user_business_details')!
    );
    if (businessDetail) {
      setPackageDetail(businessDetail?.subscriptions[0]?.package_details);
    }

    GetFunction('/user').then((result) => {
      setMetaData(result);
    });
    permissionList?.filter((item) => {
      if (item?.toLocaleLowerCase().includes('user.create')) {
        setIsCreate(true);
      }

      if (item?.toLocaleLowerCase().includes('user.update')) {
        setIsUpdate(true);
      }
      if (item?.toLocaleLowerCase().includes('user.view')) {
        setIsView(true);
      }
    });
  }, []);

  React.useEffect(() => {
    if (metaData != undefined) {
      setloadingData(true);
      GetFunction('/user').then((result) => {
        setMetaData(result?.meta);
        setListData(result?.data);
        setNewArr(result?.data);
        setloadingData(false);
      });
    }
  }, [metaData != undefined]);

  const filterBySearch = (event) => {
    const query = event.target.value;
    var updatedList = [...ListData];
    let searchLower = query.toLowerCase();
    let filtered = updatedList.filter((list: any) => {
      if (list.username.toLowerCase().includes(searchLower)) {
        return true;
      }
      if (list.email.toLowerCase().includes(searchLower)) {
        return true;
      }
    });

    setNewArr(filtered);
  };

  const onAddCLick = () => {
    if (
      packageDetail?.user_count == 0 ||
      newArr.length < packageDetail?.user_count ||
      packageDetail.name != 'Free package'
    ) {
      Router.push(Routes.user.create);
    } else {
      toast.error('Please update your subscription');
      Router.push('/settings/subscription');
    }
  };
  if (loadingData) return <Loader text={t('common:text-loading')} />;

  // console.log(packageDetail,)
  // console.log(newArr,'dslfkjsdlfj')
  return (
    <>
      <Card className="mb-8 flex flex-col items-center xl:flex-row">
        <div className="mb-4 md:w-1/4 xl:mb-0">
          <h1 className="text-xl font-semibold text-heading">
            {t('common:users')}
          </h1>
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
          <Search onChangeearchVal={filterBySearch} />
          <LinkDiv
            onClick={onAddCLick}
            className="h-12 w-full md:w-auto md:ms-6 cursor-pointer"
          >
            <span className="block md:hidden xl:block w-24">
              + {t('common:add-user')}
            </span>
            <span className="hidden md:block xl:hidden">
              + {t('form:button-label-add')}
            </span>
          </LinkDiv>
          {/* {packageDetail?.user_count == 0 ? (
            <LinkButton
              href={Routes.user.create}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span className="block md:hidden xl:block">
                + {t('common:add-user')}
              </span>
              <span className="hidden md:block xl:hidden">
                + {t('form:button-label-add')}
              </span>
            </LinkButton>
          ) : newArr.length < packageDetail?.user_count ? (
            <LinkButton
              href={Routes.user.create}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span className="block md:hidden xl:block">
                + {t('common:add-user')}
              </span>
              <span className="hidden md:block xl:hidden">
                + {t('form:button-label-add')}
              </span>
            </LinkButton>
          ) : null} */}
          {/* {newArr.length<packageDetail?.user_count ?
            <LinkButton
              href={Routes.user.create}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span className="block md:hidden xl:block">
                + {t('common:add-user')}
              </span>
              <span className="hidden md:block xl:hidden">
                + {t('form:button-label-add')}
              </span>
            </LinkButton> : null} */}
        </div>
      </Card>
      <UserList list={newArr} isUpdate={isUpdate} isView={isView} />
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
