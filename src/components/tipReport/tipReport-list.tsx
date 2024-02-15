import { Table } from '@/components/ui/table';
import { SortOrder, Type, BrandList } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useEffect, useState } from 'react';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Pagination from '@/components/ui/pagination';
import Loader from '@/components/ui/loader/loader';
import { ExportCSV } from './export';

const TipReportList = (list: any) => {
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(10);

  const [CurrentStock, setCurrentStock] = useState(0);
  const [UnitSold, setUnitSold] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const lastItemIndex = currentPage * listPerPage;
  const firstItemIndex = lastItemIndex - listPerPage;

  let newCurrentList = list?.list;


 

  const columns = [
    {
      title: <span style={{ fontFamily: 'poppins' }}>{t('table:table-item-invoice-no')}</span>,
      className: 'cursor-pointer',
      dataIndex: 'invoice_no',
      key: 'name',
      align: alignLeft,
      // onHeaderCell: () => onHeaderClick('name'),
      render: (no: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {no}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-tip')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'tip',
      key: 'name',
      align: alignLeft,
      render: (tip: any, row: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
         {tip}
        </span>
      ),
    },
  ];

  // const handlePageSizeChange = (event) => {
  //   console.log(event.target.value,'value value');

  //   if(event.target.value=="All"){
  //     setListPerPage(list?.list.length);
  //   }else{
  //     const newSize = parseInt(event.target.value);
  //     setListPerPage(newSize);
  //   }

  //   setCurrentPage(1); // Reset to the first page when changing page size
  // };

  if (list.loading) return <Loader text={t('common:text-loading')} />;
  // console.log(list.tbId);

  return (
    <>
      {/* <div className="flex justify-end mb-3 mr-2">
        <label htmlFor="entries" className="text-sm pr-3 pt-1">
          Show
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
          <option value="All">All</option>
        </select>
        <label htmlFor="entries" className="text-sm pl-3 pt-1">
          Entries
        </label>
      </div> */}
      <div className="mb-8 overflow-hidden rounded shadow" ref={list.tableRef}>
        <div>
          <Table
            //@ts-ignore
            columns={columns}
            emptyText={t('table:empty-table-data')}
            id={list.tbId}
            data={newCurrentList}
            rowKey="id"
            // rowRef={list.tableref}
            scroll={{ x: 380 }}
          />
        </div>
      </div>

      {!!list?.metaData?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={list.metaData.total}
            current={list.metaData.current_page}
            pageSize={list?.metaData.per_page}
            onChange={list?.paginationChange}
            showLessItems
          />
        </div>
      )}
    </>
  );
};

export default TipReportList;
