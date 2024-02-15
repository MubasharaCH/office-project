import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/Newearch';
import TypeList from '@/components/group/group-list';
import ErrorMessage from '@/components/ui/error-message';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import { SortOrder } from '@/types';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { useTypesQuery } from '@/data/brand';
import { Routes } from '@/config/routes';
import { useRouter } from 'next/router';
import { adminOnly } from '@/utils/auth-utils';
import { Config } from '@/config';
import { ArrowDown } from '@/components/icons/arrow-down';
import { ArrowUp } from '@/components/icons/arrow-up';
import { GetFunction } from '@/services/Service';
import Label from '@/components/ui/label';
import Select from 'react-select';
import { selectStyles } from '../../../components/ui/select/select.styles';
import React from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import { DatePicker } from '@/components/ui/date-picker';
import moment from 'moment';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal/modal';
import { Switch } from '@headlessui/react';
import Input from '@/components/ui/input';
import { toast } from 'react-toastify';
import TableList from '@/components/table/table-list';

export default function TypesPage() {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const [dummyArr, setDummyArr] = useState([]);
  const [newArr, setNewArr] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loadingData, setloadingData] = useState(false);
  const [TableLoader, setTableLoader] = useState(false);
  const [CustomerArray, setCustomerArray] = React.useState<any[]>([]);
  const [BusinesDetails, setBusinesDetails] = useState('');
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();
  const [SenderId, setSenderId] = useState<any>('');
  const [smsHandle, setSmsHandle] = useState(false);
  const [emailHandle, setEmailHandle] = useState(false);
  const [modalView, setModalView] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [locationArr, setLoocationArr] = useState([]);
  const userData: any = localStorage.getItem('user_detail');
  const userDetail: any = JSON.parse(userData);
  const permissionList = userDetail?.all_permissions;
  const router = useRouter();

  React.useEffect(() => {
  
    // setloadingData(true);
    GetFunction('/table').then((result) => {
      setDummyArr(result.data);
      setNewArr(result.data);
      setloadingData(false);
    });

    permissionList?.filter((item) => {
    
      if (item.toLocaleLowerCase().includes('table.create')) {
        setIsCreate(true);
      }
      if (item.toLocaleLowerCase().includes('table.update')) {
        setIsUpdate(true);
      }
      if (item.toLocaleLowerCase().includes('table.delete')) {
        setIsDelete(true);
      }
      // if (item.toLocaleLowerCase().includes('roles.view')) {
      //   setIsView(true);
      // }
    });
  }, []);

  React.useEffect(() => {
    setloadingData(true);
    GetFunction('/business-location ').then((result) => {
      let ordersData = result.data.map((data, i) => {
        return {
          key: i,
          id: data.id,
          value: data.name,
          label: data.name,
        };
      });
      setLoocationArr(ordersData);
      setloadingData(false);
    });
  }, []);

  // if (loadingData) return <Loader text={t('common:text-loading')} />;
  const filterBySearch = (event) => {
    const query = event.target.value;
    var updatedList = [...dummyArr];
    let searchLower = query.toLowerCase();
    let filtered = updatedList.filter((list: any) => {
      if (list.name.toLowerCase().includes(searchLower)) {
        return true;
      }
    });
    setNewArr(filtered);
  };

  const onAddNotificatioin = () => {
    router.push({
      pathname: Routes.table.create,
    });
  };

  const toggleVisible = () => {
    setVisible((v) => !v);
  };

  const onLocationChange = (e: any) => {
    setloadingData(true);

    GetFunction('/table?location_id=' + e.id).then((result) => {
      setDummyArr(result.data);
      setNewArr(result.data);
      setloadingData(false);
      setVisible(false);
    });
  };

  return (
    <>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <h1 className="text-lg font-semibold text-heading">{t('table')}</h1>
          </div>
          <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
            <Search onChangeearchVal={filterBySearch} />
            {isCreate && (
              <Button
                onClick={onAddNotificatioin}
                className="h-12 w-full md:w-auto md:ms-6"
              >
                <span className="block md:hidden xl:block">
                  + {t('Add Table')}
                </span>
                <span className="hidden md:block xl:hidden">
                  + {t('form:button-label-add')}
                </span>
              </Button>
            )}

            <button
              className="mt-5 flex items-center whitespace-nowrap text-base font-semibold text-accent md:mt-0 md:ms-5"
              onClick={toggleVisible}
            >
              {t('common:text-filter')}{' '}
              {visible ? (
                <ArrowUp className="ms-2" />
              ) : (
                <ArrowDown className="ms-2" />
              )}
            </button>
          </div>
        </div>
        <div
          className={cn(' w-full transition', {
            'visible h-auto': visible,
            'invisible h-0': !visible,
          })}
        >
          <div className="mt-5 flex w-full flex-col border-t border-gray-200 pt-5 md:mt-8 md:flex-row md:items-center md:pt-8">
            <div
              className={cn(
                'flex w-full flex-col space-y-5 rtl:space-x-reverse md:flex-row md:items-end md:space-x-5 md:space-y-0'
              )}
            >
              <div className="w-full">
                <Label>{t('Filter by location')}</Label>
                <Select
                  styles={selectStyles}
                  options={locationArr}
                  onChange={onLocationChange}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      <TableList
        loading={loadingData}
        list={newArr}
        isUpdate={isUpdate?true:false}
        isView={true}
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
