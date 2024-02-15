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
      title:<span style={{fontFamily:'poppins'}}>{t('table:table-item-tax-name')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      render: (name: any) => <span className="whitespace-nowrap" style={{fontFamily:'poppins'}}>{name}</span>,
    },
    {
      title: <span style={{fontFamily:'poppins'}}>{t('table:table-item-tax-rate')}</span>,
      className: 'cursor-pointer',
      dataIndex: 'amount',
      key: 'tax',
      align: alignLeft,

      render: (tax: any) => (
        <span className="whitespace-nowrap" style={{fontFamily:'poppins'}}>
          {tax && Number(tax).toLocaleString() + '%'}
        </span>
      ),
    },
    {
      title:<span style={{fontFamily:'poppins'}}>{t('table:table-item-taxable-sales')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'taxableSale',
      key: 'name',
      align: 'center',
      render: (taxableSale: any) => (
        <span className="whitespace-nowrap" style={{fontFamily:'poppins'}}>
          {taxableSale &&
            list.BusinesDetails.symbol + Number(taxableSale).toLocaleString()}
        </span>
      ),
    },
    {
      title:<span style={{fontFamily:'poppins'}}>{t('table:table-item-tax-amount')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'tax',
      key: 'name',
      align: 'center',
      render: (amount: any) => (
        <span className="whitespace-nowrap" style={{fontFamily:'poppins'}}>
          {amount &&
            list.BusinesDetails.symbol + Number(amount).toLocaleString()}
        </span>
      ),
    },
  ];

  const lastItemIndex = currentPage * listPerPage;
  const firstItemIndex = lastItemIndex - listPerPage;
  const currentList = list?.list?.slice(firstItemIndex, lastItemIndex);
  const newList = currentList?.filter((listItem: any) => {
    if (listItem.name != null) {
      return listItem;
    }
  });
  const handlePageSizeChange = (event) => { 
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
        <div ref={list.tableref}>
          <Table
            //@ts-ignore
            columns={columns}
            emptyText={t('table:empty-table-data')}
            data={newList}
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
