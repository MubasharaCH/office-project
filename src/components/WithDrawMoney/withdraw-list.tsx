import { Table } from '@/components/ui/table';
import { SortOrder, Type, BrandList } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Badge from '../ui/badge/badge';
import { useState } from 'react';
import Pagination from '@/components/ui/pagination';

export type IProps = {
  listOfBrands: BrandList[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const RoleList = (list: any) => {
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(10);
  const columns = [
    {
      title: t('Bank Name'),
      className: 'cursor-pointer',
      dataIndex: 'bank_name',
      key: 'name',
      align: alignLeft,
      width: 200,
      render: (bank_name: any) => (
        <span className="whitespace-nowrap">{bank_name}</span>
      ),
    },
    {
      title: t('Account Name'),
      className: 'cursor-pointer',
      dataIndex: 'account_name',
      key: 'account_name',
      align: alignLeft,
      width: 200,
      render: (account_name: any) => (
        <span className="whitespace-nowrap">{account_name}</span>
      ),
    },
    {
      title: t('Account Number'),
      className: 'cursor-pointer',
      dataIndex: 'account_number',
      key: 'account_number',
      align: alignLeft,
      width: 200,
      render: (account_number: any) => (
        <span className="whitespace-nowrap">{account_number}</span>
      ),
    },
  ];

  return (
    <>
      <div className="mb-8 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={list.data}
          rowKey="id"
          scroll={{ x: 380 }}
        />
      </div>
    </>
  );
};

export default RoleList;
