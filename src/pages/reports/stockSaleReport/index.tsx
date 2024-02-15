import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/Newearch';
import TypeList from '@/components/group/group-list';
import ErrorMessage from '@/components/ui/error-message';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import { SortOrder } from '@/types';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { useTypesQuery } from '@/data/brand';
import { Routes } from '@/config/routes';
import { useRouter } from 'next/router';
import { adminOnly } from '@/utils/auth-utils';
import { Config } from '@/config';
//import SalesReportList from '@/components/reportSales/reportSale-list';
import StockSaleList from '@/components/stockSaleReport/stockSale-list';
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
import { ArrowDown } from '@/components/icons/arrow-down';
import { ArrowUp } from '@/components/icons/arrow-up';
import { Select } from '@/components/ui/select/select';
import { selectStyles } from '@/components/ui/select/select.styles';
import Button from '@/components/ui/button';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function TypesPage() {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [BusinesDetails, setBusinesDetails] = useState<any>('');
  const [loadingData, setloadingData] = useState(true);
  const [ListData, setListData] = useState([]);
  const [newArr, setNewArr] = useState<any>([]);

  const [startDate, setStartDate] = useState<any>('');
  const [endDate, setEndDate] = useState<any>('');
  const [TableLoader, setTableLoader] = useState(false);
  const [dummyArr, setDummyArr] = useState([]);
  const [showCalander, setShowCalander] = useState(false);
  const [metaData, setMetaData] = useState<any>();
  const [downloadExcel, setDownExcel] = useState<any>([]);
  const [downloadPdf, setDownPdf] = useState<any>([]);
  const [visible, setVisible] = useState(false);
  const [locationArray, setLocationArray] = useState([]);
  const [locatiioinId, setLocatiioinId] = useState('');
  const [listPerPage, setListPerPage] = useState(10);
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
  React.useEffect(() => {
    GetFunction(
      '/stock-sales-report?start_date=' +
        startDate +
        '&end_date=' +
        endDate +
        '&per_page=' +
        listPerPage +
        '&location_id=' +
        locatiioinId
    ).then((result) => {
      if (result) {
        // console.log(result?.data,'per result');

        setListData(result?.data);
        setNewArr(result?.data);
        setMetaData(result?.data?.products);
        if (listPerPage === -1) {
          excelExportData(startDate, endDate, -1);
        } else {
          excelExportData(startDate, endDate, result?.data?.products?.total);
        }
      }
    });
  }, [listPerPage]);

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const tableRef = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: 'Excel File',
    sheet: 'Users',
  });

  React.useEffect(() => {
    let businessDetails: any = localStorage.getItem('business_details');
    setBusinesDetails(JSON.parse(businessDetails));
  }, []);

  React.useEffect(() => {
    let sDate = moment(new Date()).format('YYYY-MM-DD');
    let eDate = moment(new Date()).format('YYYY-MM-DD');
    setStartDate(sDate);
    setEndDate(eDate);
    GetFunction(
      '/stock-sales-report?start_date=' +
        sDate +
        '&end_date=' +
        eDate +
        '&per_page=' +
        listPerPage
    ).then((result) => {
      setListData(result?.data);
      setNewArr(result?.data);
      setMetaData(result?.data?.products);
      if (listPerPage === -1) {
        excelExportData(sDate, eDate, -1);
      } else {
        excelExportData(sDate, eDate, result?.data?.products?.total);
      }
    });
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
      setStartDate(NewStart);
      setEndDate(NewEend);
      setTableLoader(true);
      GetFunction(
        '/stock-sales-report?start_date=' +
          NewStart +
          '&end_date=' +
          NewEend +
          '&per_page=' +
          listPerPage
      ).then((result) => {
        // console.log(result.data, 'this is data');

        setDummyArr(result.data);
        setNewArr(result.data);
        setMetaData(result?.data?.products);
        excelExportData(NewStart, NewEend, result?.data?.products.total);
        // let newProductList = result?.data?.products?.data.map((item: any) => {
        //   return {
        //     Sku: item?.sku,
        //     Product: item?.product,
        //     Location: item?.location_name,
        //     Stock: item?.stock,
        //     Unit: item?.total_sold,
        //     Total: Number(item?.total_unit_sold_amount).toFixed(2),
        //   };
        // });
        // setDownExcel(newProductList);

        setTableLoader(false);
      });
      setStartDate(NewStart);
      setEndDate(NewEend);
      // onhowCalannder();
    }
  };

  const excelExportData = (NewStart, NewEend, total) => {
    GetFunction(
      '/stock-sales-report?start_date=' +
        NewStart +
        '&end_date=' +
        NewEend +
        '&per_page=' +
        total
    ).then((result) => {
      setDownPdf(result?.data?.products?.data);
      let newProductList = result?.data?.products?.data.map((item: any) => {
        return {
          Sku: item?.sku,
          Product: item?.product,
          Location: item?.location_name,
          Stock: item?.stock,
          Unit: item?.total_sold,
          Total: Number(item?.total_unit_sold_amount).toFixed(2),
        };
      });
      setDownExcel(newProductList);
    });
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

  const ChangePagination = (current) => {
    setloadingData(true);

    GetFunction(
      '/stock-sales-report?location_id=' +
        locatiioinId +
        '&page=' +
        current +
        '&per_page=' +
        listPerPage
    ).then((result) => {
      setListData(result?.data);
      setNewArr(result?.data);
      setMetaData(result.data.products);
      setloadingData(false);
    });
  };

  const onChangeCustomerFilter = (e) => {
    setLocatiioinId(e.id);
    setTableLoader(true);
    GetFunction(
      '/stock-sales-report?location_id=' + e.id + '&per_page=' + listPerPage
    ).then((result) => {
      setListData(result?.data);
      setNewArr(result?.data);
      setMetaData(result.data.products);
      setTableLoader(false);
    });
  };
  const toggleVisible = () => {
    setVisible((v) => !v);
  };
  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value);
    setListPerPage(newSize);
    // setCurrentPage(1); // Reset to the first page when changing page size
  };

  // Function to generate PDF from table data

  // Create a new PDF instance

  // Save the PDF file

  const generatePDF = async () => {
    try {
      const doc: any = new jsPDF();
      const columnStyles = {
        0: { columnWidth: 20 },
        1: { columnWidth: 30 },
        2: { columnWidth: 30 },
        3: { columnWidth: 30 },
        4: { columnWidth: 30 },
        5: { columnWidth: 40 },
      };

      const headerStyles = {
        fillColor: [0, 0, 0],
        textColor: 255,
      };

      doc.setFont('helvetica'); // Replace 'helvetica' with your desired font family
      doc.setFontSize(12); // Replace 12 with your desired font size

      const headers = [
        [
          'SKU',
          'Product',
          'Location',
          'Current Stock',
          'Unit Sold',
          'Total Amount',
        ],
      ];
      const rows = downloadPdf?.map((row) => [
        row.sku,
        row.product + ' - ' + row.variation_name,
        row.location_name,
        Number(row.stock).toFixed(2) + ' ' + row.unit,
        Number(row.total_sold).toFixed(2) + ' ' + row.unit,
        BusinesDetails.symbol +
          ' ' +
          Number(row.total_unit_sold_amount).toLocaleString(),
      ]);

      await doc.addFont(
        '@/components/fonts/Tajawal-Regular.ttf',
        'ArabicFont',
        'normal'
      );
      doc.setFont('ArabicFont');

      doc.autoTable({
        head: headers,
        body: rows,
        startY: 10,
        startX: 10,
        columnStyles: columnStyles,
        headerStyles: headerStyles,
      });

      doc.save('table.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
  // const handleDownloadPDF = async () => {
  //   const table: any = document.getElementById('tableId');
  //   const tableRows = table.querySelectorAll('tr');
  //   const totalPages = Math.ceil(tableRows.length / 25); // Assuming 25 rows per page

  //   const pdf = new jsPDF('l', 'in', 'tabloid');
  //   const pageHeight = pdf.internal.pageSize.height;

  //   // Before adding new content
  //   let y = 500; // Height position of new content
  //   if (y >= pageHeight) {
  //     pdf.addPage();
  //     y = 0; // Restart height position
  //   }
  //   pdf.setLanguage('ar');

  //   for (let pageNumber = 0; pageNumber < totalPages; pageNumber++) {
  //     const canvas = await html2canvas(table, {
  //       y: tableRows[pageNumber * 25].offsetTop,
  //       scrollY: -window.scrollY,
  //     });

  //     const imgData = canvas.toDataURL('image/png');
  //     if (pageNumber > 0) {
  //       pdf.addPage();
  //     }
  //     pdf.addImage(imgData, 'PNG', 0, 0, 0, 0);
  //   }

  //   pdf.save('table.pdf');
  // };
  const options = {
    orientation: 'landscape',
  };
  if (loadingData) return <Loader text={t('common:text-loading')} />;

  return (
    <>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:w-1/4 xl:mb-0">
            <h1 className="text-xl font-semibold text-heading">
              {t('table:table-item-stock-sale-report')}
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
                          filename="Stock Sales Report"
                          extension=".csv"
                          datas={downloadExcel}
                          text={t('form:export-to-csv')}
                        />
                      </button>

                      <ExportCSV
                        csvData={downloadExcel}
                        fileName="Stock Sales Report"
                      />
                      {/* </DownloadTableExcel> */}

                      {/* <button
                        className={classNames(
                          'flex w-full items-center space-x-3 px-5 py-2.5 text-sm font-semibold capitalize transition duration-200 focus:outline-none rtl:space-x-reverse',
                          active ? 'text-accent' : 'text-body'
                        )}
                      >
                        <DownloadIcon className="w-5 shrink-0" />

                        <Pdf
                          targetRef={tableRef.current}
                          filename="Stock Sales Report.pdf"
                          options={options}
                        >
                          {({ toPdf }) => (
                            <button onClick={toPdf}>Export to pdf</button>
                          )}
                        </Pdf>
                      </button> */}


                      <button
                      className={classNames(
                        'flex w-full items-center space-x-3 px-5 py-2.5 text-sm font-semibold capitalize transition duration-200 focus:outline-none rtl:space-x-reverse',
                        active ? 'text-accent' : 'text-body'
                      )}
                    >
                      <DownloadIcon className="w-5 shrink-0" />
                      <Pdf
                        targetRef={tableRef.current}
                        filename="Sales_Report.pdf"
                        options={options}
                      >
                        {({ toPdf }) => (
                          <button
                            onClick={async () => {
                              await toPdf();
                            }}
                          >
                            Export to PDF
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
                <Label>{t('form:filter-by-locatiion')}</Label>
                <Select
                  styles={selectStyles}
                  options={locationArray}
                  onChange={(e) => onChangeCustomerFilter(e)}
                />
              </div>
              <div className="w-full"></div>
            </div>
          </div>
        </div>
      </Card>
      <div className="mb-3 mr-2 flex justify-end">
        <label htmlFor="entries" className="pr-3 pt-1 text-sm">
          {t('form:form-show')}
        </label>
        <select
          id="entries"
          value={listPerPage}
          onChange={handlePageSizeChange}
          className="rounded border p-1 text-sm"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="-1">All</option>
        </select>
        <label htmlFor="entries" className="pl-3 pt-1 text-sm">
          {t('form:form-entries')}
        </label>
      </div>
      <StockSaleList
        tbId="tableId"
        metaData={metaData}
        tableRef={tableRef}
        loading={TableLoader}
        list={newArr}
        BusinesDetails={BusinesDetails}
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
