import { Table } from '@/components/ui/table';
import { SortOrder, Type, BrandList } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Pagination from '@/components/ui/pagination';
import Loader from '@/components/ui/loader/loader';
import { add, result } from 'lodash';
import { useDownloadExcel } from 'react-export-table-to-excel';
import CsvDownloader from 'react-csv-downloader';
import ReactToPrint from 'react-to-print';
import { selectStyles } from '../ui/select/select.styles';
import Select from 'react-select';
import Button from '../ui/button';
import React from 'react';
import Pdf from 'react-to-pdf';
import { Menu, Transition } from '@headlessui/react';
import { DownloadIcon } from '../icons/download-icon';
import { MoreIcon } from '../icons/more-icon';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import Card from '@/components/common/card';
import { GetFunction } from '@/services/Service';
import Label from '../ui/label';
import Input from '@/components/ui/input';
import moment from 'moment';
import { DateRange } from 'react-date-range';
import { Tab } from '@headlessui/react';
import 'react-tabs/style/react-tabs.css';
import ProfitList from '@/components/profitLossReport/profit-list';
import ProfitListDay from '@/components/profitLossReport/profit-list-day';
import Search from '@/components/common/Newearch';
import { ExportCSV } from '@/components/stockSaleReport/export';

const UnitList = (list: any) => {
  const symbol = list.BusinesDetails.symbol;
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(10);
  const [TableLoader, setTableLoader] = useState(false);
  const [totalBefore_tax, setTotalBeforeTax] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const lastItemIndex = currentPage * listPerPage;
  const firstItemIndex = lastItemIndex - listPerPage;
  const currentList = list?.list?.slice(firstItemIndex, lastItemIndex);
  let newCurrentList = list?.list?.slice(firstItemIndex, lastItemIndex);
  const [loading, setLoading] = useState(true);
  const [locationDataArray, setLocationDataArray] = React.useState<any>([]);
  const [profitReport, setProfitReport] = React.useState<any>([]);
  const [locationID, setLocationID] = useState<any>();
  const [showCalander, setShowCalander] = useState(false);
  const [showCalander1, setShowCalander1] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputRef1 = useRef<HTMLInputElement>(null);
  const [startDate, setStartDate] = useState<any>('');
  const [startDate1, setStartDate1] = useState<any>();
  const [endDate, setEndDate] = useState<any>('');
  const [endDate1, setEndDate1] = useState<any>('');
  const [currentTab, setTab] = useState<any>('product');
  const router = useRouter();
  const datePickerRef = useRef<HTMLDivElement>(null);
  const datePickerRef1 = useRef<HTMLDivElement>(null);
  const [loadingData, setloadingData] = useState(false);
  const [ListData, setListData] = useState<any>([]);
  const printContentRef = useRef(null);
  const tableRef = useRef(null);
  const tableRefs = useRef(null);
  const [exportData, setExportData] = useState<any>([]);
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  const [state1, setState1] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  const [metaData, setMetaData] = useState<any>();
  const [newArr, setNewArr] = React.useState<any>([]);
  const [profitDayReport, setProfitDayReport] = React.useState<any>([]);
  useEffect(() => {
    let sDate = moment(new Date()).format('YYYY-MM-DD');
    let eDate = moment(new Date()).format('YYYY-MM-DD');
    setStartDate(sDate);
    setStartDate1(sDate);
    setEndDate(eDate);
    setEndDate1(eDate);
  }, []);
  useEffect(() => {
    if (startDate1 && endDate1) {
      GetFunction(
        '/get-profit/' +
          currentTab +
          '?start_date=' +
          startDate1 +
          '&end_date=' +
          endDate1
      ).then((result) => {
        if (currentTab == 'day') {
          let newProductList1 = result.map((item: any) => {
            return {
              days: item.day,
              Gross_Profit: item?.amount,
            };
          });
          setExportData(newProductList1);
        } else {
          let newProductList = result?.data?.map((item: any) => {
            return {
              [currentTab == 'invoice'
                ? 'invoice_no'
                : currentTab == 'date'
                ? 'transaction_date'
                : currentTab]:
                currentTab == 'invoice'
                  ? item?.['invoice_no']
                  : currentTab == 'date'
                  ? item?.['transaction_date']
                  : item?.[currentTab],
              Gross_Profit: item?.gross_profit,
            };
          });
          setExportData(newProductList);
        }
        if (currentTab == 'day') {
          setProfitDayReport(result);
          setMetaData([]);
          setListData([]);
          setNewArr([]);
        } else {
          setMetaData(result.meta);
          setListData(result.data);
          setNewArr(result.data);
          setloadingData(false);
        }
        // if (currentTab != 'day') {
        setMetaData(result.meta);
        setListData(result.data);
        setNewArr(result.data);
        setloadingData(false);
      });
    }
  }, [currentTab, startDate1, endDate1]);
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
  const handleDocumentClick1 = (event: MouseEvent) => {
    if (
      inputRef1.current &&
      !inputRef1.current.contains(event.target as Node) &&
      datePickerRef1.current &&
      !datePickerRef1.current.contains(event.target as Node)
    ) {
      setShowCalander1(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('click', handleDocumentClick1);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('click', handleDocumentClick1);
    };
  }, []);

  const fetchProfitReport = async (
    NewStart = null,
    NewEend = null,
    location_id = ''
  ) => {
    setLoading(true);
    const url =
      '/profit-loss-report' +
      (location_id !== undefined
        ? `?location_id=${location_id}`
        : '?location_id=') +
      (NewStart && NewEend !== 'Invalid date'
        ? `&start_date=${NewStart}&end_date=${NewEend}`
        : '');
    try {
      const result = await GetFunction(url);
      if (result) {
        setProfitReport(result.data);
      }
    } catch (error) {
      // Handle error
    }
    setLoading(false);
  };
  useEffect(() => {
    GetFunction('/business-location').then((result) => {
      let ordersData = result.data.map((data, i) => {
        return {
          key: i,
          id: data.id,
          value: data.name,
          label: data.name,
        };
      });
      // Add all locations at the start of the options array
      // const allLocationsOption = {
      //   key: 'all',
      //   id: 'all',
      //   value: 'All Locations',
      //   label: 'All Locations',
      // };
      // ordersData.unshift(allLocationsOption);

      setLocationDataArray(ordersData);
      setLoading(false);
    });

    fetchProfitReport();
  }, []);

  const OnChangeLocation = (e) => {
    setProfitReport([]);
    setLocationID(e.id);
    let start: any = moment(startDate).format('YYYY-MM-DD');
    let end: any = moment(endDate).format('YYYY-MM-DD');
    fetchProfitReport(start, end, e.id);
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
  const onhowOneCalannder = () => {
    setShowCalander1(!showCalander1);
    setState1([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
      },
    ]);
  };

  const onChange = (item) => {
    setState([item.selection]);
    let start = moment(state[0].startDate).format('YYYY-MM-DD');
    let end = moment(state[0].endDate).format('YYYY-MM-DD');
    if (start && end != 'Invalid date') {
      let NewStart: any = moment(item.selection.startDate).format('YYYY-MM-DD');
      let NewEend: any = moment(item.selection.endDate).format('YYYY-MM-DD');
      setStartDate(NewStart);
      setEndDate(NewEend);
      fetchProfitReport(NewStart, NewEend, locationID);
    }
  };
  const onChange1 = (item) => {
    setState1([item.selection]);
    let start = moment(state1[0].startDate).format('YYYY-MM-DD');
    let end = moment(state1[0].endDate).format('YYYY-MM-DD');

    if (start && end != 'Invalid date') {
      let NewStart1: any = moment(item.selection.startDate).format(
        'YYYY-MM-DD'
      );
      let NewEend1: any = moment(item.selection.endDate).format('YYYY-MM-DD');
      setStartDate1(NewStart1);
      setEndDate1(NewEend1);
      // fetchProfitReport(NewStart, NewEend);
    }
  };
  const printRef = useRef(null);

  interface Category {
    status: string;
    key: string;
  }

  // Define the type for the categories object
  interface Categories {
    [key: string]: Category[];
  }

  // Assuming the initial value of categories is of type Categories
  const [categories, setCategories]: [Categories, any] = useState({
    Profit_product: [
      {
        status: t('form:profit-by-products'),
        key: t('form:title-product'),
      },
    ],
    Profit_category: [
      {
        status: t('form:profit-by-categories'),
        key: t('form:input-label-category'),
      },
    ],
    Profit_brand: [
      {
        status: t('form:profit-by-brands'),
        key: t('form:input-label-brand'),
      },
    ],
    Profit_location: [
      {
        status: t('form:profit-by-locations'),
        key: t('form:input-label-location'),
      },
    ],
    Profit_invoice: [
      {
        status: t('form:profit-by-invoice'),
        key: t('form:invoice'),
      },
    ],
    Profit_date: [
      {
        status: t('form:profit-by-date'),
        key: t('form:form-title-date'),
      },
    ],
    Profit_customer: [
      {
        status: t('form:profit-by-customer'),
        key: t('form:text-customer'),
      },
    ],
    Profit_day: [
      {
        status: t('form:profit-by-day'),
        key: t('form:day'),
      },
    ],
  });

  const handleTabClick = (index: any) => {
    setNewArr([]);
    const selectedKey = Object.values(categories)[index][0]?.key;
    setTab(selectedKey);
  };
  const filterBySearch = (event) => {
    const query = event.target.value;
    var updatedList = [...ListData];
    let searchLower = query.toLowerCase();
    let filtered: any = updatedList.filter((list: any) => {
      if (currentTab == 'product') {
        if (
          list?.product != null &&
          list.product.toLowerCase().includes(searchLower)
        ) {
          return true;
        }
      } else if (currentTab == 'category') {
        if (
          list?.category != null &&
          list?.category.toLowerCase().includes(searchLower)
        ) {
          return true;
        }
      } else if (currentTab == 'brand') {
        if (
          list?.brand != null &&
          list?.brand.toLowerCase().includes(searchLower)
        ) {
          return true;
        }
      } else if (currentTab == 'location') {
        if (
          list?.location != null &&
          list?.location.toLowerCase().includes(searchLower)
        ) {
          return true;
        }
      } else if (currentTab == 'invoice') {
        if (
          list?.invoice_no != null &&
          list?.invoice_no.toLowerCase().includes(searchLower)
        ) {
          return true;
        }
      } else if (currentTab == 'customer') {
        if (
          list?.customer != null &&
          list?.customer.toLowerCase().includes(searchLower)
        ) {
          return true;
        }
      } else if (currentTab == 'date') {
        if (
          list?.transaction_date != null &&
          list?.transaction_date.toLowerCase().includes(searchLower)
        ) {
          return true;
        }
      }
    });
    setNewArr(filtered);
  };

  const handleRowClick = (record) => {};
  // console.log(currentList,'current');
  //console.log(list.list,"list");

  const columns = [
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-title')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      onCell: (record, index) => {
        return {
          onClick: () => {
            handleRowClick(record);
          },
          className: 'cursor-pointer',
        };
      },
      // onHeaderCell: () => onHeaderClick('name'),
      render: (name: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {name}
        </span>
      ),
      /*   footer: (data: any) => {
          let total = 0;
          data.forEach((item: any) => {
            total += item.name;
          });
          return <div>{`Total: ${total}`}</div>;
        }, */
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-invoice-no')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'invoice_no',
      key: 'name',
      align: alignLeft,
      onCell: (record, index) => {
        return {
          onClick: () => {
            handleRowClick(record);
          },
          className: 'cursor-pointer',
        };
      },
      // render: (GrossSales: any) => {
      //  console.log("yoo bout",Number(GrossSales).toFixed(2));
      // },
      render: (invoice_no: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {invoice_no}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-gross-amount')}
        </span>
      ),
      className: 'cursor-pointer',
      Footer: 'Total',
      dataIndex: 'total_before_tax',
      key: 'name',
      align: 'center',
      onCell: (record, index) => {
        return {
          onClick: () => {
            handleRowClick(record);
          },
          className: 'cursor-pointer',
        };
      },
      // onHeaderCell: () => onHeaderClick('name'),
      render: (total_before_tax: any) => (
        // <span className="whitespace-nowrap">{total_before_tax}</span>

        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {total_before_tax &&
            list.BusinesDetails.symbol +
              Number(total_before_tax).toLocaleString()}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-tax')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'tax_amount',
      key: 'name',
      align: 'center',
      onCell: (record, index) => {
        return {
          onClick: () => {
            handleRowClick(record);
          },
          className: 'cursor-pointer',
        };
      },
      // onHeaderCell: () => onHeaderClick('name'),
      render: (tax_amount: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {tax_amount &&
            list.BusinesDetails.symbol + Number(tax_amount).toLocaleString()}
        </span>
      ),
    },

    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-total-amount')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'final_total',
      key: 'name',
      align: 'center',
      onCell: (record, index) => {
        return {
          onClick: () => {
            handleRowClick(record);
          },
          className: 'cursor-pointer',
        };
      },
      // onHeaderCell: () => onHeaderClick('name'),
      render: (final_total: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {final_total &&
            list.BusinesDetails.symbol + Number(final_total).toLocaleString()}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-date')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'transaction_date',
      key: 'name',
      align: 'center',
      onCell: (record, index) => {
        return {
          onClick: () => {
            handleRowClick(record);
          },
          className: 'cursor-pointer',
        };
      },
      // onHeaderCell: () => onHeaderClick('name'),
      render: (transaction_date: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {transaction_date}
        </span>
        //   <span className="whitespace-nowrap">
        //     {DiscountSales &&
        //       list.BusinesDetails.symbol + Number(DiscountSales).toLocaleString()}
        //   </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-payment-method')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'payment_methods',
      key: 'name',
      align: 'center',
      onCell: (record, index) => {
        return {
          onClick: () => {
            handleRowClick(record);
          },
          className: 'cursor-pointer',
        };
      },
      // onHeaderCell: () => onHeaderClick('name'),
      render: (payment_methods: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {payment_methods}
        </span>
      ),
    },
  ];

  let downloadDrop = [
    { label: 'Export to csv' },
    { label: 'Export to Excel' },
    { label: 'Print' },
  ];


  const options = {
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  };

  return (
    <>
      <div className="flex">
        <div className="w-4/12 pb-3">
          <Label>{t('common:title-select-Location')}</Label>
          <Select
            getOptionLabel={(option: any) => option.label}
            getOptionValue={(option: any) => option.key}
            styles={selectStyles}
            onChange={OnChangeLocation}
            options={locationDataArray}
            defaultValue={locationDataArray[0]} // Set the defaultValue to the first option (All Locations)
          />
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
                  startDatePlaceholderText="Check In"
                  endDatePlaceholderText="Check Out"
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
      </div>
      {!profitReport || Object.keys(profitReport).length === 0 ? (
        <Loader text={t('common:text-loading')} />
      ) : (
        <div>
          <div id="print-content" ref={tableRef}>
            <div className="flex">
              <Card className="mt-5 mb-3 mr-3 sm:w-8/12 md:w-2/3">
                <div
                  className="flex p-3"
                  style={{ backgroundColor: '#fafafc' }}
                >
                  <div className=" sm:w-8/12 md:w-2/3">
                    <p>{t('form:opening-stock')}</p>
                    <p style={{ fontSize: '10px' }}>
                      ({t('form:by-purchase-price')}):{' '}
                    </p>
                  </div>
                  <div className="sm:w-8/12 md:w-2/3">
                    <p style={{ float: 'right' }}>
                      {parseFloat(profitReport.opening_stock).toFixed(2) +
                        symbol}
                    </p>
                  </div>
                </div>
                <div
                  className="mt-2 flex p-3"
                  style={{ backgroundColor: '#fafafc' }}
                >
                  <div className=" sm:w-8/12 md:w-2/3">
                    <p>{t('form:opening-stock')}</p>
                    <p style={{ fontSize: '10px' }}>
                      ({t('form:by-sale-price')}):{' '}
                    </p>
                  </div>
                  <div className="sm:w-8/12 md:w-2/3">
                    <p style={{ float: 'right' }}>
                      {parseFloat(profitReport.opening_stock_by_sp).toFixed(2) +
                        symbol}
                    </p>
                  </div>
                </div>

                <div
                  className="mt-2 flex p-3"
                  style={{ backgroundColor: '#fafafc' }}
                >
                  <div className=" sm:w-8/12 md:w-2/3">
                    <p>{t('form:total-purchase')}:</p>
                    <p style={{ fontSize: '10px' }}>
                      ({t('form:exc.-tax,-discount')}){' '}
                    </p>
                  </div>
                  <div className="sm:w-8/12 md:w-2/3">
                    <p style={{ float: 'right' }}>
                      {parseFloat(profitReport.total_purchase).toFixed(2) +
                        symbol}
                    </p>
                  </div>
                </div>
                <div
                  className="mt-2 flex p-3"
                  style={{ backgroundColor: '#fafafc' }}
                >
                  <div className=" sm:w-8/12 md:w-2/3">
                    <p>{t('form:total-stock-adjustment')}:</p>
                  </div>
                  <div className="sm:w-8/12 md:w-2/3">
                    <p style={{ float: 'right' }}>
                      {parseFloat(profitReport.total_adjustment).toFixed(2) +
                        symbol}
                    </p>
                  </div>
                </div>
                <div
                  className="mt-2 flex p-3"
                  style={{ backgroundColor: '#fafafc' }}
                >
                  <div className=" sm:w-8/12 md:w-2/3">
                    <p>{t('form:total-expense')}:</p>
                  </div>
                  <div className="sm:w-8/12 md:w-2/3">
                    <p style={{ float: 'right' }}>
                      {parseFloat(profitReport.total_expense).toFixed(2) +
                        symbol}
                    </p>
                  </div>
                </div>
                <div
                  className="mt-2 flex p-3"
                  style={{ backgroundColor: '#fafafc' }}
                >
                  <div className=" sm:w-8/12 md:w-2/3">
                    <p>{t('form:total-purchase-shipping-charge')}: </p>
                  </div>
                  <div className="sm:w-8/12 md:w-2/3">
                    <p style={{ float: 'right' }}>
                      {parseFloat(
                        profitReport.total_purchase_shipping_charge
                      ).toFixed(2) + symbol}
                    </p>
                  </div>
                </div>
                <div
                  className="mt-2 flex p-3"
                  style={{ backgroundColor: '#fafafc' }}
                >
                  <div className=" sm:w-8/12 md:w-2/3">
                    <p>{t('form:total-transfer-shipping-charge')}: </p>
                  </div>
                  <div className="sm:w-8/12 md:w-2/3">
                    <p style={{ float: 'right' }}>
                      {parseFloat(
                        profitReport.total_transfer_shipping_charges
                      ).toFixed(2) + symbol}
                    </p>
                  </div>
                </div>
                <div
                  className="mt-2 flex p-3"
                  style={{ backgroundColor: '#fafafc' }}
                >
                  <div className=" sm:w-8/12 md:w-2/3">
                    <p>{t('form:total-sell-discount')}: </p>
                  </div>
                  <div className="sm:w-8/12 md:w-2/3">
                    <p style={{ float: 'right' }}>
                      {parseFloat(profitReport.total_sell_discount).toFixed(2) +
                        symbol}
                    </p>
                  </div>
                </div>
                <div
                  className="mt-2 flex p-3"
                  style={{ backgroundColor: '#fafafc' }}
                >
                  <div className=" sm:w-8/12 md:w-2/3">
                    <p>{t('form:total-customer-reward')}: </p>
                  </div>
                  <div className="sm:w-8/12 md:w-2/3">
                    <p style={{ float: 'right' }}>
                      {parseFloat(profitReport.total_reward_amount).toFixed(2) +
                        symbol}
                    </p>
                  </div>
                </div>
                <div
                  className="mt-2 flex p-3"
                  style={{ backgroundColor: '#fafafc' }}
                >
                  <div className=" sm:w-8/12 md:w-2/3">
                    <p>{t('form:total-Sell-return')}: </p>
                  </div>
                  <div className="sm:w-8/12 md:w-2/3">
                    <p style={{ float: 'right' }}>
                      {parseFloat(profitReport.total_sell_return).toFixed(2) +
                        symbol}
                    </p>
                  </div>
                </div>

                {profitReport?.left_side_module_data?.map((item, index) => (
                  <div
                    key={index}
                    className="mt-2 flex p-3"
                    style={{ backgroundColor: '#fafafc' }}
                  >
                    <div className=" sm:w-8/12 md:w-2/3">
                      <p>{t('form:total-production-cost')} </p>
                    </div>
                    <div className="sm:w-8/12 md:w-2/3">
                      <p style={{ float: 'right' }}>{item.value + symbol}</p>
                    </div>
                  </div>
                ))}
              </Card>
              <Card className="mt-5 mb-3 sm:w-8/12 md:w-2/3">
                <div
                  className="flex p-3"
                  style={{ backgroundColor: '#fafafc' }}
                >
                  <div className=" sm:w-8/12 md:w-2/3">
                    <p>{t('form:closing-stock')}</p>
                    <p style={{ fontSize: '10px' }}>
                      ({t('form:by-purchase-price')}):{' '}
                    </p>
                  </div>
                  <div className="sm:w-8/12 md:w-2/3">
                    <p style={{ float: 'right' }}>
                      {parseFloat(profitReport.closing_stock).toFixed(2) +
                        symbol}
                    </p>
                  </div>
                </div>
                <div
                  className="mt-2 flex p-3"
                  style={{ backgroundColor: '#fafafc' }}
                >
                  <div className=" sm:w-8/12 md:w-2/3">
                    <p>{t('form:closing-stock')}</p>
                    <p style={{ fontSize: '10px' }}>
                      ({t('form:by-sale-price')}):{' '}
                    </p>
                  </div>
                  <div className="sm:w-8/12 md:w-2/3">
                    <p style={{ float: 'right' }}>
                      {parseFloat(profitReport.closing_stock_by_sp).toFixed(2) +
                        symbol}
                    </p>
                  </div>
                </div>

                <div
                  className="mt-2 flex p-3"
                  style={{ backgroundColor: '#fafafc' }}
                >
                  <div className=" sm:w-8/12 md:w-2/3">
                    <p>{t('form:total-sales')}:</p>
                    <p style={{ fontSize: '10px' }}>
                      ({t('form:exc.-tax,-discount')}){' '}
                    </p>
                  </div>
                  <div className="sm:w-8/12 md:w-2/3">
                    <p style={{ float: 'right' }}>
                      {parseFloat(profitReport.total_sell).toFixed(2) + symbol}
                    </p>
                  </div>
                </div>
                <div
                  className="mt-2 flex p-3"
                  style={{ backgroundColor: '#fafafc' }}
                >
                  <div className=" sm:w-8/12 md:w-2/3">
                    <p>{t('form:total-sell-shipping-charge')}:</p>
                  </div>
                  <div className="sm:w-8/12 md:w-2/3">
                    <p style={{ float: 'right' }}>
                      {parseFloat(
                        profitReport.total_sell_shipping_charge
                      ).toFixed(2) + symbol}
                    </p>
                  </div>
                </div>
                <div
                  className="mt-2 flex p-3"
                  style={{ backgroundColor: '#fafafc' }}
                >
                  <div className=" sm:w-8/12 md:w-2/3">
                    <p>T{t('form:total-stock-recovered')}:</p>
                  </div>
                  <div className="sm:w-8/12 md:w-2/3">
                    <p style={{ float: 'right' }}>
                      {parseFloat(profitReport.total_recovered).toFixed(2) +
                        symbol}
                    </p>
                  </div>
                </div>
                <div
                  className="mt-2 flex p-3"
                  style={{ backgroundColor: '#fafafc' }}
                >
                  <div className=" sm:w-8/12 md:w-2/3">
                    <p>{t('form:total-purchase-return')}: </p>
                  </div>
                  <div className="sm:w-8/12 md:w-2/3">
                    <p style={{ float: 'right' }}>
                      {parseFloat(profitReport.total_purchase_return).toFixed(
                        2
                      ) + symbol}
                    </p>
                  </div>
                </div>
                <div
                  className="mt-2 flex p-3"
                  style={{ backgroundColor: '#fafafc' }}
                >
                  <div className=" sm:w-8/12 md:w-2/3">
                    <p>{t('form:total-purchase-discount')}: </p>
                  </div>
                  <div className="sm:w-8/12 md:w-2/3">
                    <p style={{ float: 'right' }}>
                      {parseFloat(profitReport.total_purchase_discount).toFixed(
                        2
                      ) + symbol}
                    </p>
                  </div>
                </div>
                <div
                  className="mt-2 flex p-3"
                  style={{ backgroundColor: '#fafafc' }}
                >
                  <div className=" sm:w-8/12 md:w-2/3">
                    <p>{t('form:total-sell-round-off')}: </p>
                  </div>
                  <div className="sm:w-8/12 md:w-2/3">
                    <p style={{ float: 'right' }}>
                      {parseFloat(profitReport.total_sell_round_off).toFixed(
                        2
                      ) + symbol}
                    </p>
                  </div>
                </div>
                {profitReport?.right_side_module_data?.map((item, index) => (
                  <div
                    key={index}
                    className="mt-2 flex p-3"
                    style={{ backgroundColor: '#fafafc' }}
                  >
                    <div className=" sm:w-8/12 md:w-2/3">
                      <p>{item.label} </p>
                    </div>
                    <div className="sm:w-8/12 md:w-2/3">
                      <p style={{ float: 'right' }}>{item.value + symbol}</p>
                    </div>
                  </div>
                ))}
              </Card>
            </div>
            <Card className="full-width mb-2">
              <div className="flex p-3" style={{ backgroundColor: '#fafafc' }}>
                <div className=" sm:w-8/12 md:w-2/3">
                  <p>{t('form:gross-profit')}:</p>
                  <p style={{ fontSize: '10px' }}>
                    ({t('form:total-sell-price-total-purchase-price')}){' '}
                  </p>
                </div>
                <div className="sm:w-8/12 md:w-2/3">
                  <p>
                    {parseFloat(profitReport.gross_profit).toFixed(2) + symbol}
                  </p>
                </div>
              </div>
              <div className="flex p-3" style={{ backgroundColor: '#fafafc' }}>
                <div className=" sm:w-8/12 md:w-2/3">
                  <p>{t('form:net-profit')}:</p>
                  <p style={{ fontSize: '10px' }}>
                    {t(
                      'form:gross-profit-total-sell-shipping-charge-total-stock'
                    )}
                  </p>
                </div>
                <div className="sm:w-8/12 md:w-2/3">
                  <p>
                    {parseFloat(profitReport.net_profit).toFixed(2) + symbol}
                  </p>
                </div>
              </div>
            </Card>
          </div>
          <div className="flex justify-end">
            <div className="sm:w-8/12 md:w-2/3">
              <Button
                variant="outline"
                style={{ float: 'right' }}
                // onClick={handlePrint}
                className="me-4"
                type="button"
              >
                <ReactToPrint
                  trigger={() => <button>{t('form:print')}</button>}
                  content={() => tableRef.current}
                />
              </Button>
            </div>
          </div>

          {/* <div className='flex'>
        <div className=" sm:w-8/12 md:w-2/3"> */}

          {/* </div>
        </div> */}
        </div>
      )}

      <div className="mt-5">
        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
          <div className=" w-full p-0  ">
            <Label>{t('table:table-item-select-date')}</Label>
            <div onClick={onhowOneCalannder} ref={inputRef1}>
              <Input
                name="credit_limit"
                variant="outline"
                className="mb-4"
                value={startDate1 + ' - ' + endDate1}
              />
            </div>
            {showCalander1 && (
              <div
                style={{ position: 'absolute', zIndex: 999 }}
                ref={datePickerRef1}
              >
                <DateRange
                  onChange={(e) => {
                    onChange1(e);
                  }}
                  moveRangeOnFirstSelection={false}
                  ranges={state1}
                  rangeColors="bg-accent"
                  color="bg-accent"
                  startDatePlaceholderText="Check In"
                  endDatePlaceholderText="Check Out"
                />
                <div className="position-relative rdr-buttons-position bg-white pb-3 text-right">
                  <Button
                    className="btn btn-transparent rounded-0 mr-2 px-4 text-sm"
                    onClick={onhowOneCalannder}
                  >
                    Done
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <Tab.Group onChange={handleTabClick}>
          <Tab.List
            className="flex space-x-1 rounded-xl p-1"
            style={{ background: '#fafafc' }}
          >
            {Object.values(categories).map((category: any) => (
              <Tab
                key={category[0]?.key}
                className={({ selected }) =>
                  classNames(
                    'm-3 w-auto rounded-lg p-2 py-2.5 pr-2 text-sm font-medium leading-5 text-blue-700',
                    'ring-white ring-opacity-60 ring-offset-1 ring-offset-blue-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white shadow ring-2'
                      : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                  )
                }
              >
                <b>{category[0]?.status}</b>
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-2">
            {Object.values(categories).map((posts: any, idx) => (
              <Tab.Panel
                key={idx}
                className={classNames(
                  'rounded-xl bg-white p-3',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                )}
              >
                <div className="mb-2 flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/4">
                  {currentTab == 'day' ? (
                    ''
                  ) : (
                    <Search onChangeearchVal={filterBySearch} />
                  )}
                  <Menu
                    style={{ marginLeft: 'auto' }}
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
                                  filename="Proft Loss Report"
                                  extension=".csv"
                                  datas={exportData}
                                  text="Export to csv"
                                />
                              </button>
                              <ExportCSV
                                csvData={exportData}
                                fileName="Profit Loss Report"
                              />

                              <button
                                className={classNames(
                                  'flex w-full items-center space-x-3 px-5 py-2.5 text-sm font-semibold capitalize transition duration-200 focus:outline-none rtl:space-x-reverse',
                                  active ? 'text-accent' : 'text-body'
                                )}
                              >
                                <DownloadIcon className="w-5 shrink-0" />
                                <Pdf
                                  targetRef={tableRef.current}
                                  filename="profitLossReport.pdf"
                                  options={options}
                                >
                                  {({ toPdf }) => (
                                    <button onClick={toPdf}>
                                      Export to pdf
                                    </button>
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
                                  trigger={() => <button>Print</button>}
                                  content={() => tableRefs.current}
                                />
                              </button>
                            </div>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
                <ul>
                  {!newArr && posts[0]?.key != 'day' ? (
                    <Loader text={t('common:text-loading')} />
                  ) : posts[0]?.key === currentTab && posts[0]?.key != 'day' ? (
                    <li>
                      <ProfitList
                        tablerefs={tableRefs}
                        BusinesDetails={list.BusinesDetails}
                        loading={TableLoader}
                        list={newArr}
                        tab={currentTab}
                        // isUpdate={true}
                        // isView={true}
                      />
                    </li>
                  ) : (
                    <li>
                      <ProfitListDay
                        tablerefs={tableRefs}
                        BusinesDetails={list.BusinesDetails}
                        loading={TableLoader}
                        list={profitDayReport}
                        tab={currentTab}
                        // isUpdate={true}
                        // isView={true}
                      />
                    </li>
                  )}
                </ul>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  );
};

export default UnitList;
