import { Table } from '@/components/ui/table';
import { SortOrder, Type, BrandList } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Pagination from '@/components/ui/pagination';

export type IProps = {
  listOfBrands: BrandList[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const TypeList = (list: any) => {
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(10);

  const columns = [
    {
      title: 'Customer Name',
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      render: (name: any) => <span className="whitespace-nowrap">{name}</span>,
    },
    {
      title: 'Contact Number',
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      render: (name: any) => <span className="whitespace-nowrap"></span>,
    },
    {
      title: 'Date',
      className: 'cursor-pointer',
      dataIndex: 'transaction_date',
      key: 'name',
      align: alignLeft,
      render: (transaction_date: any) => (
        <span className="whitespace-nowrap">{transaction_date}</span>
      ),
    },
    {
      title: 'Reference No.',
      className: 'cursor-pointer',
      dataIndex: 'ref_no',
      key: 'name',
      align: alignLeft,
      render: (ref_no: any) => (
        <span className="whitespace-nowrap">{ref_no}</span>
      ),
    },
    {
      title: 'Location',
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      render: (name: any) => <span className="whitespace-nowrap"></span>,
    },
    {
      title: 'Total Items',
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      render: (name: any) => <span className="whitespace-nowrap"></span>,
    },
    {
      title: 'Total Amount',
      className: 'cursor-pointer',
      dataIndex: 'total_amount_recovered',
      key: 'name',
      align: alignLeft,
      render: (total_amount_recovered: any) => (
        <span className="whitespace-nowrap">{total_amount_recovered}</span>
      ),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'slug',
      key: 'actions',
      align: alignRight,
      render: (slug: string, record: Type) => (
        <LanguageSwitcher
          isProductList={false}
          slug={slug}
          record={record}
          deleteModalView="DELETE_TYPE"
          routes={Routes?.draft} isUpdate={false} isView={false}        />
      ),
    },
  ];

  const lastItemIndex = currentPage * listPerPage;
  const firstItemIndex = lastItemIndex - listPerPage;
  const currentList = list?.list?.slice(firstItemIndex, lastItemIndex);

  return (
    <>
      <div className="mb-8 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={currentList}
          rowKey="id"
          scroll={{ x: 380 }}
        />
      </div>

      {list?.list.length > 10 && (
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

export default TypeList;
