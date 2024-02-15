import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/Newearch';
import TypeList from '@/components/group/group-list';
import ErrorMessage from '@/components/ui/error-message';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import { SortOrder } from '@/types';
import cn from 'classnames';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { useTypesQuery } from '@/data/brand';
import { Routes } from '@/config/routes';
import Router, { useRouter } from 'next/router';
import { adminOnly } from '@/utils/auth-utils';
import { Config } from '@/config';
import { ArrowDown } from '@/components/icons/arrow-down';
import { ArrowUp } from '@/components/icons/arrow-up';
import PurchaseList from '@/components/purchase/purchase-list';
import { GetFunction } from '@/services/Service';
import Label from '@/components/ui/label';
import Select from 'react-select';
import { selectStyles } from '../../../components/ui/select/select.styles';
import React from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Input from '@/components/ui/input';
import moment from 'moment';
import { toast } from 'react-toastify';
import LinkDiv from '@/components/ui/link-div';
import Button from '@/components/ui/button';
import { Menu, Transition } from '@headlessui/react';
import { MoreIcon } from '@/components/icons/more-icon';
import classNames from 'classnames';
import { DownloadIcon } from '@/components/icons/download-icon';
import CsvDownloader from 'react-csv-downloader';
import { ExportCSV } from '@/components/stockSaleReport/export';
import ReactToPrint from 'react-to-print';
import Pdf from 'react-to-pdf';

export default function TypesPage() {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const [dummyArr, setDummyArr] = useState([]);
  const [newArr, setNewArr] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loadingData, setloadingData] = useState(true);
  const [TableLoader, setTableLoader] = useState(false);
  const [CustomerArray, setCustomerArray] = React.useState<any[]>([]);
  const [LocationArray, setLocatioonArray] = React.useState<any[]>([]);
  const [BusinesDetails, setBusinesDetails] = useState('');

  const datePickerRef = useRef(null);
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();
  const [metaData, setMetaData] = useState<any>();
  const [isCreate, setIsCreate] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isView, setIsView] = useState(false);
  const userData: any = localStorage.getItem('user_detail');
  const userDetail: any = JSON.parse(userData);
  const permissionList = userDetail?.all_permissions;
  const [packageDetail, setPackageDetail] = useState<any>({});
  const [showCalander, setShowCalander] = useState(false);
  const [downloadExcel, setDownExcel] = useState<any>([]);
  const [filterData, setFilterData] = useState({
    customer_id: '',
    payment_status: '',
    shipping_status: '',
    order_source: '',
    location_id: '',
    status: '',
    startDateFilter: '',
    endDateFilter: '',
  });
  const [listPerPage, setListPerPage] = useState(10);

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection',
    },
  ]);

  React.useEffect(() => {
    let businessDetails: any = localStorage.getItem('business_details');
    setBusinesDetails(JSON.parse(businessDetails));

    const businessDetail = JSON.parse(
      localStorage.getItem('user_business_details')!
    );
    if (businessDetail) {
      const { purchase } = businessDetail?.subscriptions[0]?.package;
      if (purchase === 1) {
        if (businessDetail?.subscriptions[0]?.purchase !== 1) {
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

    let sDate = moment(new Date()).format('YYYY-MM-DD');
    let eDate = moment(new Date()).format('YYYY-MM-DD');
    // console.log(sDate, 'starty');

    setStartDate(sDate);
    setEndDate(eDate);
    permissionList?.filter((item) => {
      if (item.toLocaleLowerCase().includes('customer.create')) {
        setIsCreate(true);
      }
      if (item.toLocaleLowerCase().includes('customer.update')) {
        setIsUpdate(true);
      }
      if (item.toLocaleLowerCase().includes('customer.view')) {
        setIsView(true);
      }
    });
  }, []);
  React.useEffect(() => {
    setTableLoader(true);
    GetFunction('/purchases' + '?per_page=' + listPerPage).then((result) => {
      if (result) {
        setMetaData(result.meta);
        setDummyArr(result.data);
        setNewArr(result.data);
        setTableLoader(false);
      }
    });
  }, [listPerPage]);
  React.useEffect(() => {
    GetFunction('/purchases' + '?per_page=' + listPerPage).then((result) => {
      // console.log(result,'purchase result');

      setMetaData(result.meta);
      setDummyArr(result.data);
      setNewArr(result.data);
      setloadingData(false);
      // GetFunction('/sell?per_page=' + result.meta.total).then((result) => {
      //   let newProductList = result?.data.map((item: any) => {
      //     return {
      //       Customer_Name: item?.contact.name,
      //       Date: item?.transaction_date,
      //       Invoice_No: item?.invoice_no,
      //       Payment_Status: item?.payment_status,
      //       Payment_Method: item?.payment_lines[0]?.method,
      //       Total_Amount: Number(item?.final_total).toFixed(2),
      //       Total_Paid: item?.payment_lines[0]?.amount,
      //       Shipping_Status: item?.shipping_status,
      //       Order_Source: item?.order_source,
      //       Total_Item: item?.sell_lines?.length,
      //       Status: item?.status,
      //     };
      //   });
      //   setDownExcel(newProductList);
      // });
    });
  }, []);

  // React.useEffect(() => {
  //   GetFunction('/contactapi').then((result) => {
  //     let ordersData = result.data.map((data, i) => {
  //       return {
  //         key: i,
  //         id: data.id,
  //         value: data.name,
  //         label: data.name,
  //       };
  //     });
  //     setCustomerArray(ordersData);
  //   });
  // }, []);

  React.useEffect(() => {
    GetFunction('/business-location').then((result) => {
      let ordersData = result.data.map((data, i) => {
        return {
          key: i,
          id: data.id,
          value: data.name,
          label: data.name,
        };
      });
      setLocatioonArray(ordersData);
    });
  }, []);

  const toggleVisible = () => {
    setVisible((v) => !v);
  };

  const filterBySearch = (event) => {
    const query = event.target.value;
    var updatedList = [...dummyArr];
    let searchLower = query.toLowerCase();
    let filtered = updatedList.filter((list: any) => {
      let searchPayment =
        list.payment_lines?.[0]?.method == undefined || null
          ? ''
          : list.payment_lines?.[0]?.method;

      if (list.invoice_no.toLowerCase().includes(searchLower)) {
        return true;
      }
      if (list?.payment_status?.toLowerCase().includes(searchLower)) {
        return true;
      }
      if (searchPayment.toLowerCase().includes(searchLower)) {
        return true;
      }
    });
    setNewArr(filtered);
  };
  // const onClearFilter = () => {
  //   setFilterData({
  //     customer_id: '',
  //     payment_status: '',
  //     shipping_status: '',
  //     order_source: '',
  //     location_id: '',
  //     status: '',
  //     startDateFilter: '',
  //     endDateFilter: '',
  //   });
  // };
  // const onApplyFilter = () => {
  //   console.log(startDate);
  //   setTableLoader(true);
  //   GetFunction(
  //     '/sell?contact_id=' +
  //       filterData.customer_id +
  //       '&payment_status=' +
  //       filterData.payment_status +
  //       '&shipping_status=' +
  //       filterData.shipping_status +
  //       '&order_source=' +
  //       filterData.order_source +
  //       '&location_id=' +
  //       filterData.location_id +
  //       '&status=' +
  //       filterData.status +
  //       '&start_date=' +
  //       startDate +
  //       '&end_date=' +
  //       endDate
  //   ).then((result) => {
  //     setMetaData(result.meta);
  //     setDummyArr(result.data);
  //     setNewArr(result.data);
  //     setTableLoader(false);
  //     setVisible(false);
  //     // console.log(result,'fdlsjfalf');

  //     excelExportData(startDate, endDate, result?.meta.total);
  //   });
  // };

  const onChangeCustomerFilter = (e) => {
    setFilterData({ ...filterData, customer_id: e.id });
    // setTableLoader(true);
    // GetFunction('/sell?contact_id=' + e.id).then((result) => {
    //   setMetaData(result.meta);
    //   setDummyArr(result.data);
    //   setNewArr(result.data);
    //   setTableLoader(false);
    // });
  };

  const onChangePaymentStatusFilter = (e) => {
    setFilterData({ ...filterData, payment_status: e.label });
    // setTableLoader(true);
    // GetFunction('/sell?payment_status=' + e.label).then((result) => {
    //   setMetaData(result.meta);
    //   setDummyArr(result.data);
    //   setNewArr(result.data);
    //   setTableLoader(false);
    // });
  };
  const onChangeShippingStatusFilter = (e) => {
    setFilterData({ ...filterData, shipping_status: e.label });
    // setTableLoader(true);
    // GetFunction('/sell?shipping_status=' + e.label).then((result) => {
    //   setMetaData(result.meta);
    //   setDummyArr(result.data);
    //   setNewArr(result.data);
    //   setTableLoader(false);
    // });
  };
  const onChangeOrderSourceFilter = (e) => {
    setFilterData({ ...filterData, order_source: e.value });
    // setTableLoader(true);
    // GetFunction('/sell?order_source=' + e.value).then((result) => {
    //   setMetaData(result.meta);
    //   setDummyArr(result.data);
    //   setNewArr(result.data);
    //   setTableLoader(false);
    // });
  };

  const onChangeLocationFilter = (e) => {
    setFilterData({ ...filterData, location_id: e.id });
    // setTableLoader(true);
    // GetFunction('/sell?location_id=' + e.id).then((result) => {
    //   setMetaData(result.meta);
    //   setDummyArr(result.data);
    //   setNewArr(result.data);
    //   setTableLoader(false);
    // });
  };

  const onChangeStatusFilter = (e) => {
    setFilterData({ ...filterData, status: e.label });
    // setTableLoader(true);
    // GetFunction('/sell?status=' + e.label).then((result) => {
    //   setMetaData(result.meta);
    //   setDummyArr(result.data);
    //   setNewArr(result.data);
    //   setTableLoader(false);
    // });
  };

  const PaymenttatusArray = [
    {
      value: 'paid',
      label: 'Paid',
    },
    {
      value: 'due',
      label: 'Due',
    },
    {
      value: 'partial',
      label: 'Partial',
    },
    {
      value: 'overdue',
      label: 'Overdue',
    },
  ];
  const ShippinfStatusArray = [
    {
      value: 'pending',
      label: 'Pending',
    },
    {
      value: 'Completed',
      label: 'Completed',
    },
    {
      value: 'ordered',
      label: 'Ordered',
    },
    {
      value: 'packed',
      label: 'Packed',
    },
    {
      value: 'shipped',
      label: 'Shipped',
    },
    {
      value: 'delivered',
      label: 'Delivered',
    },
    {
      value: 'canceled',
      label: 'Canceled',
    },
    {
      value: 'rejected',
      label: 'Rejected',
    },
    {
      value: 'final',
      label: 'Final',
    },
    {
      value: 'ready',
      label: 'Ready',
    },
    {
      value: 'failed',
      label: 'Failed',
    },
    {
      value: 'rejected',
      label: 'Rejected',
    },
    {
      value: 'accepted',
      label: 'Accepted',
    },
  ];
  const OrderSourceArray = [
    {
      value: 'pos',
      label: 'POS',
    },
    {
      value: 'web',
      label: 'Web',
    },
    {
      value: 'storefront',
      label: 'Storefront',
    },
    {
      value: 'marketplace',
      label: 'Marketplace',
    },
  ];
  const StatusArray = [
    {
      value: 'final',
      label: 'Final',
    },
    {
      value: 'draft',
      label: 'Draft',
    },
  ];

  // const onChange = (item) => {
  //   setState([item.selection]);
  //   let start = moment(state[0].startDate).format('YYYY-MM-DD');
  //   let end = moment(state[0].endDate).format('YYYY-MM-DD');

  //   if (start && end != 'Invalid date') {
  //     let NewStart = moment(item.selection.startDate).format('YYYY-MM-DD');
  //     let NewEend = moment(item.selection.endDate).format('YYYY-MM-DD');
  //     console.log('dsd', NewStart);

  //     setFilterData({ ...filterData, endDateFilter: NewEend });
  //     setFilterData({ ...filterData, startDateFilter: NewEend });

  //     // setTableLoader(true);
  //     // GetFunction('/sell?start_date=' + NewStart + '&end_date=' + NewEend).then(
  //     //   (result) => {
  //     //     setMetaData(result.meta);

  //     //     setDummyArr(result.data);
  //     //     setNewArr(result.data);
  //     //     setTableLoader(false);
  //     //   }
  //     // );
  //     setStartDate(NewStart);
  //     setEndDate(NewEend);
  //     onhowCalannder();
  //   }
  // };

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
  const onAddClick = () => {
    if (
      packageDetail?.invoice_count == 0 ||
      newArr.length < packageDetail?.invoice_count
    ) {
      Router.push(Routes.purchase.create);
    } else {
      toast.error('Please update your subscription');
      Router.push('/settings/subscription');
    }
  };

  const ChangePagination = (current) => {
    // setTableLoader(true);
    // GetFunction('/sell?page=' + current).then((result) => {
    //   if (result) {
    //     setMetaData(result.meta);
    //     setDummyArr(result.data);
    //     setNewArr(result.data);
    //     setTableLoader(false);
    //   }
    // });
    setTableLoader(true);
    GetFunction(
      '/purchases?per_page=' + listPerPage +
      '&page=' +
      current
    ).then((result) => {
      setMetaData(result.meta);
      setDummyArr(result.data);
      setNewArr(result.data);
      setTableLoader(false);
    });
  };

  // const excelExportData = (NewStart, NewEend, total) => {
  //   GetFunction(
  //     '/sell?start_date=' +
  //     NewStart +
  //     '&end_date=' +
  //     NewEend +
  //     '&per_page=' +
  //     total
  //   ).then((result) => {
  //     let newProductList = result?.data.map((item: any) => {
  //       return {
  //         Customer_Name: item?.contact.name,
  //         Date: item?.transaction_date,
  //         Invoice_No: item?.invoice_no,
  //         Payment_Status: item?.payment_status,
  //         Payment_Method: item?.payment_lines[0]?.method,
  //         Total_Amount: Number(item?.final_total).toFixed(2),
  //         Total_Paid: item?.payment_lines[0]?.amount,
  //         Shipping_Status: item?.shipping_status,
  //         Order_Source: item?.order_source,
  //         Total_Item: item?.sell_lines?.length,
  //         Status: item?.status,
  //       };
  //     });
  //     setDownExcel(newProductList);
  //   });
  // };
  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value);
    setListPerPage(newSize);
    // setCurrentPage(1); // Reset to the first page when changing page size
  };

  if (loadingData) return <Loader text={t('common:text-loading')} />;

  return (
    <>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <h1 className="text-lg font-semibold text-heading">
              {t('common:purchases')}
            </h1>
          </div>

          <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
            <Search onChangeearchVal={filterBySearch} />
            <LinkDiv
              onClick={onAddClick}
              className="h-12 w-full md:w-auto md:ms-6 cursor-pointer"
            >
              <span className="block md:hidden xl:block w-32">
                + {t('common:add-purchase')}
              </span>
              <span className="hidden md:block xl:hidden">
                + {t('form:button-label-add')}
              </span>
            </LinkDiv>
          </div>
          {/* <Menu
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
                          filename="Invoice List"
                          extension=".csv"
                          datas={downloadExcel}
                          text="Export to csv"
                        />
                      </button>

                      <ExportCSV
                        csvData={downloadExcel}
                        fileName="Invoice List"
                      />
                      {/* </DownloadTableExcel> 
                      <button
                        className={classNames(
                          'flex w-full items-center space-x-3 px-5 py-2.5 text-sm font-semibold capitalize transition duration-200 focus:outline-none rtl:space-x-reverse',
                          active ? 'text-accent' : 'text-body'
                        )}
                      >
                        <DownloadIcon className="w-5 shrink-0" />
                        {/* <ReactToPrint
                        trigger={() => <button>Print</button>}
                        content={newArr}
                      /> 
                      </button>
                      <button
                        className={classNames(
                          'flex w-full items-center space-x-3 px-5 py-2.5 text-sm font-semibold capitalize transition duration-200 focus:outline-none rtl:space-x-reverse',
                          active ? 'text-accent' : 'text-body'
                        )}
                      >
                        <DownloadIcon className="w-5 shrink-0" />
                        <Pdf filename="code-example.pdf">
                          {({ toPdf }) => (
                            <button onClick={toPdf}>Generate Pdf</button>
                          )}
                        </Pdf>
                      </button>
                    </div>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu> */}

          {/* <button
            className="mt-5 flex items-center whitespace-nowrap text-base font-semibold text-accent md:mt-0 md:ms-5"
            onClick={toggleVisible}
          >
            {t('common:text-filter')}{' '}
            {visible ? (
              <ArrowUp className="ms-2" />
            ) : (
              <ArrowDown className="ms-2" />
            )}
          </button> */}
        </div>

        {/* <div
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
                <Label>{t('Filter by Customer')}</Label>
                <Select
                  styles={selectStyles}
                  options={CustomerArray}
                  onChange={(e) => onChangeCustomerFilter(e)}
                />
              </div>
              <div className="w-full">
                <Label>{t('Filter by Status')}</Label>
                <Select
                  styles={selectStyles}
                  options={StatusArray}
                  onChange={onChangeStatusFilter}
                />
              </div>
            </div>
          </div>
          <div className=" flex w-full flex-col border-gray-200 md:mt-8 md:flex-row md:items-center">
            <div
              className={cn(
                'flex w-full flex-col space-y-5 rtl:space-x-reverse md:flex-row md:items-end md:space-x-5 md:space-y-0'
              )}
            >
              <div className="w-full">
                <Label>{t('Filter by Payment Status')}</Label>
                <Select
                  styles={selectStyles}
                  options={PaymenttatusArray}
                  onChange={onChangePaymentStatusFilter}
                />
              </div>
              <div className="w-full">
                <Label>{t('Filter by Shipping Status')}</Label>
                <Select
                  styles={selectStyles}
                  options={ShippinfStatusArray}
                  onChange={onChangeShippingStatusFilter}
                />
              </div>
            </div>
          </div>
          <div
            className={cn(
              'mt-7 flex w-full flex-col space-y-5 rtl:space-x-reverse md:flex-row md:items-end md:space-x-5 md:space-y-0'
            )}
          >
            <div className="w-full ">
              <div onClick={onhowCalannder}>
                <Input
                  label="Select Date"
                  name="credit_limit"
                  variant="outline"
                  value={startDate + ' - ' + endDate}
                />
              </div>
              {showCalander && (
                <div style={{ position: 'absolute', zIndex: 999 }}>
                  <DateRange
                    onChange={onChange}
                    moveRangeOnFirstSelection={false}
                    ranges={state}
                    rangeColors="#009F7F"
                    color="#009F7F"
                  />
                </div>
              )}
            </div>
            <div className="w-full">
              <Label>{t('Filter by Order Source')}</Label>
              <Select
                styles={selectStyles}
                options={OrderSourceArray}
                onChange={onChangeOrderSourceFilter}
              />
            </div>
          </div>
          <div
            className={cn(
              'mt-7 flex w-full flex-col space-y-5 rtl:space-x-reverse md:flex-row md:items-end md:space-x-5 md:space-y-0'
            )}
          >
            <div className="w-full">
              <Label>{t('Filter by Location')}</Label>
              <Select
                styles={selectStyles}
                options={LocationArray}
                onChange={onChangeLocationFilter}
              />
            </div>
            <div className="w-full"></div>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={onApplyFilter}>Apply Filter</Button>
          </div>
        </div> */}
      </Card>
      <div className="flex justify-end mb-3 mr-2">
        <label htmlFor="entries" className="text-sm pr-3 pt-1">
        {t('form:form-show')}
        </label>
        <select
          id="entries"
          value={listPerPage}
          onChange={handlePageSizeChange}
          className="border rounded text-sm p-1"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="-1">All</option>
        </select>
        <label htmlFor="entries" className="text-sm pl-3 pt-1">
        {t('form:form-entries')}
        </label>
      </div>
      <PurchaseList
        metaData={metaData}
        BusinesDetails={BusinesDetails}
        loading={TableLoader}
        list={newArr}
        isUpdate={true}
        isView={true}
        paginationChange={(current) => ChangePagination(current)}
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
