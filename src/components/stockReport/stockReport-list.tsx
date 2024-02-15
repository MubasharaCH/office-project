import { Table } from '@/components/ui/table';
import { SortOrder, Type, BrandList } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useEffect, useState } from 'react';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Pagination from '@/components/ui/pagination';
import Loader from '@/components/ui/loader/loader';

const StockList = (list: any) => {
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(10);

  const [CurrentStock, setCurrentStock] = useState(0);
  const [UnitSold, setUnitSold] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const lastItemIndex = currentPage * listPerPage;
  const firstItemIndex = lastItemIndex - listPerPage;
  const currentList = list?.list?.products?.data;

  let newCurrentList = list?.list?.products?.data;

  // useEffect(() => {
  //   const stock = currentList?.reduce(
  //     (acc, o) => acc + parseInt(o.stock || 0),
  //     0
  //   );
  //   setCurrentStock(stock);
  //   const unit = currentList?.reduce(
  //     (acc, o) => acc + parseInt(o.total_sold || 0),
  //     0
  //   );
  //   setUnitSold(unit);

  //   const total = currentList?.reduce(
  //     (acc, o) => acc + parseInt(o?.total_unit_sold_amount || 0),
  //     0
  //   );
  //   setTotalAmount(total);
  // }, [currentList]);

  // if (currentList?.length! - 0) {
  //   const newRow = {
  //     key: currentList?.length + 1,
  //     sku: 'Total',
  //     stock: CurrentStock,
  //     total_sold: UnitSold,
  //     total_unit_sold_amount: totalAmount /* payment_methods:"cash" */,
  //     unit: currentList[0].unit,
  //   };
  //   newCurrentList = [...currentList, newRow];
  // }

  const columns = [
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>{t('form:product-name')}</span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'product_name',
      key: 'name',
      align: alignLeft,
      // onHeaderCell: () => onHeaderClick('name'),
      render: (name: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {name}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('form:input-label-sku')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'sku',
      key: 'name',
      align: alignLeft,
      // onHeaderCell: () => onHeaderClick('name'),
      render: (sku: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {sku}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>{t('common:variation')}</span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'variationName',
      key: 'name',
      align: alignLeft,
      // onHeaderCell: () => onHeaderClick('name'),
      render: (sku: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {sku}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-location')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'location_name',
      key: 'name',
      align: 'center',
      // onHeaderCell: () => onHeaderClick('name'),
      render: (location_name: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {location_name}
          {/* {NetSales && list.BusinesDetails.symbol + Number(NetSales).toLocaleString()} */}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-current-stock')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'qty_available',
      key: 'values',
      align: 'center',
      render: (qty_available: any, row: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {qty_available}
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
      dataIndex: 'sell_price_inc_tax',
      key: 'name',
      align: 'center',
      render: (total_unit_sold_amount: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {list.BusinesDetails.symbol +
            ' ' +
            Number(total_unit_sold_amount).toLocaleString()}
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
            data={list.list}
            rowKey="id"
            // rowRef={list.tableref}
            scroll={{ x: 380 }}
          />
        </div>
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
    </>
  );
};

export default StockList;
