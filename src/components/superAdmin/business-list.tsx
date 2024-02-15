import { Table } from '@/components/ui/table';
import { SortOrder, Type, BrandList } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Badge from '../ui/badge/badge';
import { useState } from 'react';
import Pagination from '@/components/ui/pagination';
import ActionButtons from '../common/action-buttons';
import Loader from '../ui/loader/loader';
import { useRouter } from 'next/router';

export type IProps = {
  listOfBrands: BrandList[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const CustomerList = (list: any) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { alignLeft, alignRight } = useIsRTL();
  const handleRowClick = (record) => {
    router.push(`${router.asPath}/${record.id}`);
  };

  const columns = [
    {
      title: t('table:table-item-title'),
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      width: 200,
      onCell: (record, index) => {
        return {
          onClick: () => {
            handleRowClick(record);
          },
          className: 'cursor-pointer',
        };
      },
      render: (name: any) => <span className="whitespace-nowrap">{name}</span>,
    },
    {
      title: t('table:table-item-address'),
      className: 'cursor-pointer',
      dataIndex: 'adress',
      key: 'name',
      align: alignLeft,
      width: 200,
      render: (adress: any) => (
        <span className="whitespace-nowrap">{adress}</span>
      ),
    },
    {
      title: t('table:table-item-registration-date'),
      className: 'cursor-pointer',
      dataIndex: 'start_date',
      key: 'name',
      align: alignLeft,
      width: 150,
      render: (created_at: any) => (
        <span className="whitespace-nowrap">{created_at}</span>
      ),
    },
  ];
  if (list.loader) return <Loader text={t('common:text-loading')} />;

  return (
    <>
      <div className="mb-8 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={list?.list}
          rowKey="id"
          scroll={{ x: 380 }}
        />
      </div>
      {!!list?.metaData?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={list?.metaData.total}
            current={list?.metaData.current_page}
            pageSize={list?.metaData.per_page}
            onChange={list?.paginationChange}
            showLessItems
          />
        </div>
      )}
    </>
  );
};

export default CustomerList;
