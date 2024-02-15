import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/Newearch';
import TypeList from '@/components/group/group-list';
import ErrorMessage from '@/components/ui/error-message';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import { SortOrder } from '@/types';
import Select from 'react-select';

import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { useTypesQuery } from '@/data/brand';
import { Routes } from '@/config/routes';
import { useRouter } from 'next/router';
import { adminOnly } from '@/utils/auth-utils';
import { Config } from '@/config';
import CreditNotes from '@/components/creditNotes/creditNotes-list';
import { GetFunction } from '@/services/Service';
import React from 'react';
import { ArrowDown } from '@/components/icons/arrow-down';
import { ArrowUp } from '@/components/icons/arrow-up';
import cn from 'classnames';
import Input from '@/components/ui/input';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import moment from 'moment';
import Label from '@/components/ui/label';
import { selectStyles } from '@/components/ui/select/select.styles';

export default function TypesPage() {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const [dummyArr, setDummyArr] = useState([]);
  const [newArr, setNewArr] = useState([]);
  const [metaData, setMetaData] = useState<any>();
  const [loadingData, setloadingData] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showCalander, setShowCalander] = useState(false);
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();
  const [TableLoader, setTableLoader] = useState(false);
  const [CustomerArray, setCustomerArray] = React.useState<any[]>([]);
  const [BusinesDetails, setBusinesDetails] = useState('');

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection',
    },
  ]);
  useEffect(() => {
    setloadingData(true);
    let sDate = moment(new Date()).format('YYYY-MM-DD');
    let eDate = moment(new Date()).format('YYYY-MM-DD');
    setStartDate(sDate);
    setEndDate(eDate);

    GetFunction('/list-sell-return?order_by=asc').then((result) => {
      setMetaData(result.meta);
      setloadingData(false);
    });
  }, []);

  React.useEffect(() => {
    if (metaData != undefined) {
      setloadingData(true);
      GetFunction(
        '/list-sell-return?order_by=asc&&per_page=' + metaData?.total
      ).then((result) => {
        
        setMetaData(result.meta);
        setDummyArr(result.data);
        setNewArr(result.data);
        setloadingData(false);
      });
    }
  }, [metaData != undefined]);

  React.useEffect(() => {
    GetFunction('/contactapi').then((result) => {
      let ordersData = result.data.map((data, i) => {
        return {
          key: i,
          id: data.id,
          value: data.name,
          label: data.name,
        };
      });
      setCustomerArray(ordersData);
    });
    let businessDetails: any = localStorage.getItem('business_details');
    setBusinesDetails(JSON.parse(businessDetails));
  }, []);

  const toggleVisible = () => {
    setVisible((v) => !v);
  };
  const onhowCalannder = () => {
    setShowCalander(!showCalander);
    setState([
      {
        startDate: new Date(),
        endDate: null,
        key: 'selection',
      },
    ]);
  };
  const onChange = (item) => {
    setState([item.selection]);
    let start = moment(state[0].startDate).format('YYYY-MM-DD');
    let end = moment(state[0].endDate).format('YYYY-MM-DD');

    if (start && end != 'Invalid date') {
      let NewStart = moment(item.selection.startDate).format('YYYY-MM-DD');
      let NewEend = moment(item.selection.endDate).format('YYYY-MM-DD');
      setTableLoader(true);
      GetFunction(
        '/list-sell-return?order_by=asc&&start_date=' +
          NewStart +
          '&end_date=' +
          NewEend
      ).then((result) => {
        setDummyArr(result.data);
        setNewArr(result.data);
        setTableLoader(false);
      });
      setStartDate(NewStart);
      setEndDate(NewEend);
      onhowCalannder();
    }
  };

  if (loadingData) return <Loader text={t('common:text-loading')} />;

  const filterBySearch = (event) => {
    // const query = event.target.value;
    // var updatedList = [...dummyArr];
    // updatedList = updatedList.filter((item: any) => {
    //   return (
    //     item.payment_status?.toLowerCase().indexOf(query.toLowerCase()) !== -1
    //   );
    // });
    // setNewArr(updatedList);
    setTableLoader(true);
    const query = event.target.value;
    // setInvoiceFilter(query)
    GetFunction('/list-sell-return?invoice_no=' + query).then((result) => {
      setNewArr(result.data);
      setTableLoader(false);
      // setVisible(false);
      // var perPage=result?.meta?result?.meta.total:result.data.length
      // excelExportData(startDate, endDate, perPage);
    });
  };
  const onChangeCustomerFilter = (e) => {
    setTableLoader(true);
    GetFunction('/list-sell-return?name=' + e.value).then((result) => {
      setMetaData(result.meta);
      setDummyArr(result.data);
      setNewArr(result.data);
      setTableLoader(false);
      setVisible(false);
    });
  };

  return (
    <>
      <Card className="mb-8 flex flex-col items-center xl:flex-row">
        <div className="flex flex-col w-full ">
          <div className="flex">
            <div className="mb-4 md:w-1/4 xl:mb-0">
              <h1 className="text-xl pt-2 font-semibold text-heading">
                {t('table:table-item-credit-notes')}
              </h1>
            </div>
            <div className="flex justify-end w-full  flex-col space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
              <Search onChangeearchVal={filterBySearch} />
              <button
                className="pt-2 text-center flex whitespace-nowrap text-base font-semibold text-accent md:mt-5 md:ms-5"
                onClick={toggleVisible}
              >
                {t('common:text-filter')}{' '}
                {visible ? (
                  <ArrowUp className="ms-2 mt-2" />
                ) : (
                  <ArrowDown className="ms-2 mt-2" />
                )}
              </button>
            </div>
          </div>
          <div
            className={cn(' w-full transition', {
              'visible h-auto ': visible,
              'invisible h-0': !visible,
            })}
          >
            <div
              className={cn(
                'mt-7 flex w-full flex-col space-y-5 rtl:space-x-reverse md:flex-row md:items-end md:space-x-5 md:space-y-0  border-t pt-3  '
              )}
            >
              <div className="mb-5 w-full ">
                <div className="w-full">
                  <Label>{t('Filter by Customer')}</Label>
                  <Select
                    styles={selectStyles}
                    options={CustomerArray}
                    onChange={(e) => onChangeCustomerFilter(e)}
                  />
                </div>
              </div>
              <div className="w-full"></div>
            </div>
          </div>
        </div>
      </Card>

      <CreditNotes
        BusinesDetails={BusinesDetails}
        loading={TableLoader}
        list={newArr}
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
