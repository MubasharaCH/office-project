import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/Newearch';
import TypeList from '@/components/group/group-list';
import ErrorMessage from '@/components/ui/error-message';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import { SortOrder } from '@/types';
import { Fragment, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { useTypesQuery } from '@/data/brand';
import { Routes } from '@/config/routes';
import { useRouter } from 'next/router';
import { adminOnly } from '@/utils/auth-utils';
import { Config } from '@/config';

import EmployeeSales from '@/components/employeeSales/EmployeeSales';
import React from 'react';
import { GetFunction } from '@/services/Service';
import Label from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import moment from 'moment';
import cn from 'classnames';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Input from '@/components/ui/input';
import { Menu, Transition } from '@headlessui/react';
import { DownloadIcon } from '@/components/icons/download-icon';
import classNames from 'classnames';
import {
  DownloadTableExcel,
  useDownloadExcel,
} from 'react-export-table-to-excel';
import CsvDownloader from 'react-csv-downloader';
import ReactToPrint from 'react-to-print';
import { MoreIcon } from '@/components/icons/more-icon';
import Pdf from 'react-to-pdf';
import { ExportCSV } from '@/components/stockSaleReport/export';
import { useEffect } from 'react';
import Button from '@/components/ui/button';
export default function TypesPage() {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [BusinesDetails, setBusinesDetails] = useState('');
  const [loadingData, setloadingData] = useState(false);
  const [ListData, setListData] = useState([]);
  const [newArr, setNewArr] = useState([]);

  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();
  const [TableLoader, setTableLoader] = useState(false);
  const [dummyArr, setDummyArr] = useState([]);
  const [showCalander, setShowCalander] = useState(false);
  const tableRef = useRef(null);
  const [exportData, setExportData] = useState<any>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const handleDocumentClick = (event: MouseEvent) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(event.target as Node) &&
      datePickerRef.current &&
      !datePickerRef.current.contains(event.target as Node)
    ) {
      setShowCalander(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  React.useEffect(() => {
    let businessDetails: any = localStorage.getItem('business_details');
    setBusinesDetails(JSON.parse(businessDetails));
    let sDate = moment(new Date()).format('YYYY-MM-DD');
    let eDate = moment(new Date()).format('YYYY-MM-DD');
    setStartDate(sDate);
    setEndDate(eDate);
    setloadingData(true);
    GetFunction(
      '/sales-Employee-report?start_date=' + sDate + '&end_date=' + eDate
    ).then((result) => {
      setListData(result.tableData);
      setNewArr(result.tableData);
      let newProductList = result?.tableData?.map((item: any) => {
        return {
          Name: item?.username,
          Gross_Sales: item?.GrossSales,
          Refund_Sales: item?.RefundSales,
          Discount_Sales: item?.DiscountSales,
          Net_Sales: item?.NetSales,
          Receipts: item?.receipts,
        };
      });
      setExportData(newProductList);
      setloadingData(false);
    });
  }, []);

  const onChange = (item) => {
    setState([item.selection]);
    let start = moment(state[0].startDate).format('YYYY-MM-DD');
    let end = moment(state[0].endDate).format('YYYY-MM-DD');

    if (start && end != 'Invalid date') {
      let NewStart = moment(item.selection.startDate).format('YYYY-MM-DD');
      let NewEend = moment(item.selection.endDate).format('YYYY-MM-DD');
      setTableLoader(true);
      GetFunction(
        '/sales-Employee-report?start_date=' + NewStart + '&end_date=' + NewEend
      ).then((result) => {
        setDummyArr(result.tableData);
        setNewArr(result.tableData);
        let newProductList = result?.tableData?.map((item: any) => {
          return {
            Name: item?.username,
            Gross_Sales: item?.GrossSales,
            Refund_Sales: item?.RefundSales,
            Discount_Sales: item?.DiscountSales,
            Net_Sales: item?.NetSales,
            Receipts: item?.receipts,
          };
        });
        setExportData(newProductList);
        setTableLoader(false);
      });
      setStartDate(NewStart);
      setEndDate(NewEend);
      // onhowCalannder();
    }
  };

  const onhowCalannder = () => {
    setShowCalander(!showCalander);
    setState([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
      },
    ]);
  };

  const options = {
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  };

  if (loadingData) return <Loader text={t('common:text-loading')} />;

  return (
    <>
      <Card className="mb-8 flex flex-col items-center xl:flex-row">
        <div className="mb-4 md:w-1/4 xl:mb-0">
          <h1 className="text-xl font-semibold text-heading">
            {t('table:table-item-sales-employee')}
          </h1>
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
          <div className=" w-full p-0  ">
            <Label>{t('table:table-item-select-date')}</Label>
            <div onClick={onhowCalannder} ref={inputRef}>
              <Input
                name="credit_limit"
                variant="outline"
                className="mb-4"
                value={startDate + ' - ' + endDate}
              />
            </div>
            {showCalander && (
              <div
                style={{ position: 'absolute', zIndex: 999 }}
                ref={datePickerRef}
              >
                <DateRange
                  onChange={(e) => {
                    onChange(e);
                  }}
                  moveRangeOnFirstSelection={false}
                  ranges={state}
                  rangeColors="bg-accent"
                  color="bg-accent"
                />
                <div className="position-relative rdr-buttons-position bg-white pb-3 text-right">
                  <Button
                    className="btn btn-transparent rounded-0 mr-2 px-4 text-sm"
                    onClick={onhowCalannder}
                  >
                    Done
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <Menu
          as="div"
          className="relative inline-block ltr:text-left rtl:text-right"
        >
          <Menu.Button className="group p-2">
            <MoreIcon className="w-3.5 text-body" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              as="ul"
              className={classNames(
                'shadow-700 absolute z-50 mt-2 w-52 overflow-hidden rounded border border-border-200 bg-light py-2 focus:outline-none ltr:right-0 ltr:origin-top-right rtl:left-0 rtl:origin-top-left'
              )}
            >
              <Menu.Item>
                {({ active }) => (
                  <div>
                    <button
                      className={classNames(
                        'flex w-full items-center space-x-3 px-5 py-2.5 text-sm font-semibold capitalize transition duration-200 focus:outline-none rtl:space-x-reverse',
                        active ? 'text-accent' : 'text-body'
                      )}
                    >
                      <DownloadIcon className="w-5 shrink-0" />
                      <CsvDownloader
                        filename="Employee Sales Report"
                        extension=".csv"
                        datas={exportData}
                        text={t('form:export-to-csv')}
                      />
                    </button>
                    <ExportCSV
                      csvData={exportData}
                      fileName="Employee Sales Report"
                    />

                    <button
                      className={classNames(
                        'flex w-full items-center space-x-3 px-5 py-2.5 text-sm font-semibold capitalize transition duration-200 focus:outline-none rtl:space-x-reverse',
                        active ? 'text-accent' : 'text-body'
                      )}
                    >
                      <DownloadIcon className="w-5 shrink-0" />
                      <Pdf targetRef={tableRef.current} options=
                      {options} filename="employeeSales.pdf">
                        {({ toPdf }) => (
                          <button onClick={toPdf}>Export to pdf</button>
                        )}
                      </Pdf>
                    </button>

                    <button
                      className={classNames(
                        'flex w-full items-center space-x-3 px-5 py-2.5 text-sm font-semibold capitalize transition duration-200 focus:outline-none rtl:space-x-reverse',
                        active ? 'text-accent' : 'text-body'
                      )}
                    >
                      <DownloadIcon className="w-5 shrink-0" />
                      <ReactToPrint
                        trigger={() => <button>{t('form:print')}</button>}
                        content={() => tableRef.current}
                      />
                    </button>
                  </div>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </Card>
      <EmployeeSales
        tableref={tableRef}
        loading={TableLoader}
        list={newArr}
        BusinesDetails={BusinesDetails}
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
