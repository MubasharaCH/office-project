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
import { useRouter } from 'next/router';

const UnitList = (list: any) => {
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(10);
  const [totalBefore_tax, setTotalBeforeTax] = useState(0);
  const [total_tax, setTotalText] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const lastItemIndex = currentPage * listPerPage;
  const firstItemIndex = lastItemIndex - listPerPage;
  const currentList = list?.list?.slice(firstItemIndex, lastItemIndex);
  let newCurrentList = list?.list?.slice(firstItemIndex, lastItemIndex);

  const router = useRouter();

  useEffect(() => {
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

  if (currentList?.length! - 0) {
    const newRow = {
      key: currentList?.length + 1,
      name: 'Total',
      total_before_tax: totalBefore_tax,
      tax_amount: total_tax,
      final_total: totalAmount /* payment_methods:"cash" */,
    };
    newCurrentList = [...currentList, newRow];
  }

  const handleRowClick = (record) => {};
  // console.log(currentList,'current');
  // if (list.loading) return <Loader text={t('common:text-loading')} />;
  //console.log(list.list,"list");

  const columns = [
    {
      title:<span style={{fontFamily:"poppins"}}>{t('table:table-item-title')}</span> ,
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
      render: (name: any) => <span className="whitespace-nowrap" style={{fontFamily:"poppins"}}>{name}</span>,
      /*   footer: (data: any) => {
          console.log('>>>>>>>>>>>', data)
          let total = 0;
          data.forEach((item: any) => {
            total += item.name;
          });
          return <div>{`Total: ${total}`}</div>;
        }, */
    },
    {
      title:<span style={{fontFamily:"poppins"}}>{t('table:table-item-invoice-no')}</span> ,
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
        <span className="whitespace-nowrap" style={{fontFamily:"poppins"}}>{invoice_no}</span>
      ),
    },
    {
      title:<span style={{fontFamily:"poppins"}}>{t('table:table-item-gross-amount')}</span> ,
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

        <span className="whitespace-nowrap" style={{fontFamily:"poppins"}}>
          {total_before_tax &&
            list.BusinesDetails.symbol +
              Number(total_before_tax).toLocaleString()}
        </span>
      ),
    },
    {
      title:<span style={{fontFamily:"poppins"}}>{t('table:table-item-tax')}</span> ,
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
        <span className="whitespace-nowrap" style={{fontFamily:"poppins"}}>
          {tax_amount &&
            list.BusinesDetails.symbol + Number(tax_amount).toLocaleString()}
        </span>
      ),
    },

    {
      title:<span style={{fontFamily:"poppins"}}>{t('table:table-item-total-amount')}</span> ,
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
        <span className="whitespace-nowrap" style={{fontFamily:"poppins"}}>
          {final_total &&
            list.BusinesDetails.symbol + Number(final_total).toLocaleString()}
        </span>
      ),
    },
    {
      title:<span style={{fontFamily:"poppins"}}>{t('table:table-item-date')}</span> ,
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
        <span className="whitespace-nowrap" style={{fontFamily:"poppins"}}>{transaction_date}</span>
        //   <span className="whitespace-nowrap">
        //     {DiscountSales &&
        //       list.BusinesDetails.symbol + Number(DiscountSales).toLocaleString()}
        //   </span>
      ),
    },
    {
      title:<span style={{fontFamily:"poppins"}}>{ t('table:table-item-payment-method')}</span>,
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
        <span className="whitespace-nowrap" style={{fontFamily:"poppins"}}>{payment_methods}</span>
      ),
    },
  ];

  const handlePageSizeChange = (event) => {
    // console.log(list?.list.length,'value value');
    
    if(event.target.value=="All"){
      setListPerPage(list?.list.length);
    }else{
      const newSize = parseInt(event.target.value);
      setListPerPage(newSize);
    }
 
    setCurrentPage(1); // Reset to the first page when changing page size
  };

  return (
    <>
      <div className="flex justify-end mb-3 mr-2">
        <label htmlFor="entries" className="text-sm pr-3 pt-1">
        {t('form:form-show')}
        </label>
        <select
          id="entries"
          // value={listPerPage}
          onChange={handlePageSizeChange}
          className="border rounded text-sm p-1"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="All">All</option>
        </select>
        <label htmlFor="entries" className="text-sm pl-3 pt-1">
        {t('form:form-entries')}
        </label>
      </div>
      <div className="mb-8 overflow-hidden rounded shadow">
        <div ref={list?.tableref}>
          <Table
            //@ts-ignore
            columns={columns}
            emptyText={t('table:empty-table-data')}
            data={newCurrentList}
            rowKey="id"
            scroll={{ x: 380 }}
          />
        </div>
        {/* 
        {currentList?.length != 0 ? (
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

      {list?.list?.length > 10 && (
        <div className="flex items-center justify-end">
          <Pagination
            total={list?.list.length}
            current={currentPage}
            pageSize={listPerPage}
            onChange={(val) => setCurrentPage(val)}
            showLessItems
          />
        </div>
      )}
    </>
  );
};

export default UnitList;
