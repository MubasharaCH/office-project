import { Table } from '@/components/ui/table';
import { SortOrder, Type, BrandList } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useEffect, useState } from 'react';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Pagination from '@/components/ui/pagination';
import Loader from '@/components/ui/loader/loader';

const UnitList = (list: any) => {
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(10);
  if (list.loading) return <Loader text={t('common:text-loading')} />;

  const columns = [
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-category')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'categoryName',
      key: 'name',
      align: alignLeft,
      // onHeaderCell: () => onHeaderClick('name'),
      render: (categoryName: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {categoryName}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-sold-item')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'itemsold',
      key: 'name',
      align: alignLeft,
      // render: (GrossSales: any) => {
      // },
      render: (itemsold: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {itemsold}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-net-sales')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'netsales',
      key: 'name',
      align: 'center',
      // onHeaderCell: () => onHeaderClick('name'),
      render: (netsales: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {netsales &&
            list.BusinesDetails.symbol + Number(netsales).toLocaleString()}
        </span>
      ),
    },
    /*   {
      title: 'Net Sales',
      className: 'cursor-pointer',
      dataIndex: 'netsales',
      key: 'name',
      align: 'center',
      // onHeaderCell: () => onHeaderClick('name'),
      render: (netsales: any) => (
        <span className="whitespace-nowrap">
          {netsales &&
            list.BusinesDetails.symbol + Number(netsales).toLocaleString()}
        </span>
      ),
    }, */
    /*  {
      title: 'Dsicount Sales',
      className: 'cursor-pointer',
      dataIndex: 'DiscountSales',
      key: 'name',
      align: 'center',
      // onHeaderCell: () => onHeaderClick('name'),
      render: (DiscountSales: any) => (
        <span className="whitespace-nowrap">
          {DiscountSales &&
            list.BusinesDetails.symbol + Number(DiscountSales).toLocaleString()}
        </span>
      ),
    }, */
  ];

  const lastItemIndex = currentPage * listPerPage;
  const firstItemIndex = lastItemIndex - listPerPage;
  const currentList = list?.list?.slice(firstItemIndex, lastItemIndex);
  const handlePageSizeChange = (event) => {
    if (event.target.value == 'All') {
      setListPerPage(list?.list.length);
    } else {
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
        <div ref={list.tableref}>
          <Table
            //@ts-ignore
            columns={columns}
            emptyText={t('table:empty-table-data')}
            data={currentList}
            rowKey="id"
            scroll={{ x: 380 }}
          />
        </div>
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
