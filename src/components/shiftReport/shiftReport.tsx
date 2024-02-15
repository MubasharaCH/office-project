import { Table } from '@/components/ui/table';
import { SortOrder, Type, BrandList } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Pagination from '@/components/ui/pagination';
import Loader from '@/components/ui/loader/loader';
import { add } from 'lodash';
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

const UnitList = (list: any) => {
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(10);
  const [totalBefore_tax, setTotalBeforeTax] = useState(0);
  const [total_tax, setTotalText] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [cashTotal, setCashTotal] = useState(0);
  const [visaTotal, setVisaTotal] = useState(0);
  const [masterTotal, setMasterTotal] = useState(0);
  const lastItemIndex = currentPage * listPerPage;
  const firstItemIndex = lastItemIndex - listPerPage;
  const currentList = list?.list?.slice(firstItemIndex, lastItemIndex);

  const uniqueArray = Array.from(
    new Set(currentList.map((item) => item.payment_methods))
  );

  const tableRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: 'Users table',
    sheet: 'Users',
  });

  useEffect(() => {
    let cash_total = 0;
    let master_total = 0;
    let visa_total = 0;
    currentList.map((item) => {
      if (item.payment_methods == 'Cash') {
        cash_total += Math.round(item.final_total);
      }
      if (item.payment == 'Master Card') {
        master_total += Math.round(item.final_total);
      }
      if (item.payment == 'Visa Card') {
        visa_total += Math.round(item.final_total);
      }
    });
    setCashTotal(cash_total);
    setVisaTotal(visa_total);
    setMasterTotal(master_total);

    const beforeTaxSum = currentList?.reduce(
      (acc, o) => acc + parseInt(o.total_before_tax),
      0
    );
    setTotalBeforeTax(beforeTaxSum);
    const totalAmount = currentList?.reduce(
      (acc, o) => acc + parseInt(o.final_total),
      0
    );
    setTotalAmount(totalAmount);
    const totalTax = currentList?.reduce(
      (acc, o) => acc + parseInt(o.tax_amount),
      0
    );
    setTotalText(totalTax);
  }, [currentList]);

  if (list.loading) return <Loader text={t('common:text-loading')} />;
  //console.log(list.list,"list");

  const columns = [
    {
      title:<span style={{fontFamily:'poppins'}}>{t('table:table-item-status')}</span>,
      className: 'cursor-pointer',
      dataIndex: 'status',
      key: 'name',
      align: alignLeft,
      // onHeaderCell: () => onHeaderClick('name'),
      render: (status: any) => (
        <span className="whitespace-nowrap" style={{fontFamily:'poppins'}}>{status}</span>
      ),
      /*   footer: (data: any) => {
          console.log('>>>>>>>>>>>', data)
          let total = 0;
          data.forEach((item: any) => {
            total += item.name;
          });
          return <div>{`Total: ${total}`}</div>;
        }, */
    },
    // {
    //   title:  t('table:table-item-invoice-no'),
    //   className: 'cursor-pointer',
    //   dataIndex: 'invoice_no',
    //   key: 'name',
    //   align: alignLeft,
    //   // render: (GrossSales: any) => {
    //   //  console.log("yoo bout",Number(GrossSales).toFixed(2));
    //   // },
    //   render: (invoice_no: any) => (
    //     <span className="whitespace-nowrap">{invoice_no}</span>
    //   ),
    // },
    // {
    //   title: t('table:table-item-gross-amount'),
    //   className: 'cursor-pointer',
    //   Footer: 'Total',
    //   dataIndex: 'total_before_tax',
    //   key: 'name',
    //   align: 'center',
    //   // onHeaderCell: () => onHeaderClick('name'),
    //   render: (total_before_tax: any) => (
    //     // <span className="whitespace-nowrap">{total_before_tax}</span>

    //     <span className="whitespace-nowrap">
    //       {total_before_tax &&
    //         list.BusinesDetails.symbol +
    //           Number(total_before_tax).toLocaleString()}
    //     </span>
    //   ),
    // },
    // {
    //   title:  t('table:table-item-tax'),
    //   className: 'cursor-pointer',
    //   dataIndex: 'tax_amount',
    //   key: 'name',
    //   align: 'center',
    //   // onHeaderCell: () => onHeaderClick('name'),
    //   render: (tax_amount: any) => (
    //     <span className="whitespace-nowrap">
    //       {tax_amount &&
    //         list.BusinesDetails.symbol + Number(tax_amount).toLocaleString()}
    //     </span>
    //   ),
    // },

    // {
    //   title:  t('table:table-item-total-amount'),
    //   className: 'cursor-pointer',
    //   dataIndex: 'final_total',
    //   key: 'name',
    //   align: 'center',
    //   // onHeaderCell: () => onHeaderClick('name'),
    //   render: (final_total: any) => (
    //     <span className="whitespace-nowrap">
    //       {final_total &&
    //         list.BusinesDetails.symbol + Number(final_total).toLocaleString()}
    //     </span>
    //   ),
    // },
    {
      title:<span style={{fontFamily:'poppins'}}>{t('table:table-item-open-date')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'created_at',
      key: 'name',
      align: 'center',
      // onHeaderCell: () => onHeaderClick('name'),
      render: (created_at: any) => (
        <span className="whitespace-nowrap" style={{fontFamily:'poppins'}}>{created_at}</span>
        //   <span className="whitespace-nowrap">
        //     {DiscountSales &&
        //       list.BusinesDetails.symbol + Number(DiscountSales).toLocaleString()}
        //   </span>
      ),
    },
    {
      title:<span style={{fontFamily:'poppins'}}>{t('table:table-item-close-date')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'closed_at',
      key: 'name',
      align: 'center',
      // onHeaderCell: () => onHeaderClick('name'),
      render: (closed_at: any) => (
        <span className="whitespace-nowrap" style={{fontFamily:'poppins'}}>{closed_at}</span>
        //   <span className="whitespace-nowrap">
        //     {DiscountSales &&
        //       list.BusinesDetails.symbol + Number(DiscountSales).toLocaleString()}
        //   </span>
      ),
    },
    {
      title:<span style={{fontFamily:'poppins'}}>{t('table:table-item-total-amount')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'payment_methods',
      key: 'name',
      align: 'center',
      // onHeaderCell: () => onHeaderClick('name'),
      render: (payment_methods: any) => (
        <span className="whitespace-nowrap" style={{fontFamily:'poppins'}}>{payment_methods}</span>
      ),
    },
    {
      title:<span style={{fontFamily:'poppins'}}>{t('table:table-item-actions')}</span> ,
      dataIndex: 'id',
      key: 'actions',
      align: alignRight,
      showHeader: false,
      // className: 'invisible',
      render: (id: string, record: Type) => (
        <LanguageSwitcher
          isProductList={true}
          slug={id}
          record={record}
          deleteModalView="DELETE_TYPE"
          routes={Routes?.shiftReports}
          isUpdate={list.isUpdate}
          isView={list.isView}
        />
      ),
    },
  ];

  let downloadDrop = [
    { label: 'Export to csv' },
    { label: 'Export to Excel' },
    { label: 'Print' },
  ];

  if (list.loading) return <Loader text={t('common:text-loading')} />;

  return (
    <>
      <div className="mb-8 overflow-hidden rounded shadow">
        <div ref={list?.tableref}>
          <Table
            //@ts-ignore
            columns={columns}
            emptyText={t('table:empty-table-data')}
            data={list.list}
            rowKey="id"
            scroll={{ x: 380 }}
          />
        </div>

        {/* {currentList.length != 0 ? (
          <div className="border-1 grid  grid-cols-12 p-1 text-sm font-bold">
            <span className="col-span-3 p-1">Total</span>
            <span className="col-span-2 flex justify-center  p-1">
              {list?.BusinesDetails.symbol}
              {totalBefore_tax}
            </span>
            <span className="col-span-2 flex justify-center  p-1">
              {list?.BusinesDetails.symbol}
              {total_tax}
            </span>
            <span className="col-span-2 flex justify-center  p-1">
              {list?.BusinesDetails.symbol}
              {totalAmount}
            </span>
            <span className="col-span-3 flex justify-end  p-1">
              <div className="flex flex-col">
                {cashTotal != 0 ? <span>Cash: {cashTotal}</span> : null}
                {visaTotal != 0 ? (
                  <span>Visa Card: {visaTotal}</span>
                ) : null}{' '}
                {masterTotal != 0 ? (
                  <span>MasterTotal: {masterTotal}</span>
                ) : null}
              </div>
            </span>
          </div>
        ) : null} */}
      </div>
      {!!list?.metaData?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={list?.metaData?.total}
            current={list?.metaData?.current_page}
            pageSize={list?.metaData?.per_page}
            onChange={list?.paginationChange}
            showLessItems
          />
        </div>
      )}
      {/* {list?.list?.length > 10 && (
        <div className="flex items-center justify-end">
          <Pagination
            total={list?.list.length}
            current={currentPage}
            pageSize={listPerPage}
            onChange={(val) => setCurrentPage(val)}
            showLessItems
          />
        </div>
      )} */}
    </>
  );
};

export default UnitList;
