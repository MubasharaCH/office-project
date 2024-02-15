import { Table } from '@/components/ui/table';
import { SortOrder, Type, BrandList } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Pagination from '@/components/ui/pagination';
import { useState } from 'react';
import Loader from '@/components/ui/loader/loader';
import Badge from '@/components/ui/badge/badge';

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
  if (list.loading) return <Loader text={t('common:text-loading')} />;

  const columns = [
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>{t('Notifications')}</span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'template_for',
      key: 'name',
      align: alignLeft,
      width: 120,
      render: (name: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {name}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>{t('form:sms-body')}</span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'sms_body',
      key: 'name',
      width: 120,
      align: alignLeft,
      render: (amount: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {amount}
        </span>
      ),
    },
    {
      title: <span style={{ fontFamily: 'poppins' }}>{t('Email body')}</span>,
      className: 'cursor-pointer',
      dataIndex: 'email_body',
      key: 'name',
      width: 120,
      align: alignLeft,
      render: (amount: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {amount}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-actions')}
        </span>
      ),
      dataIndex: 'id',
      key: 'actions',
      align: alignRight,
      render: (slug: string, record: Type) => (
        <LanguageSwitcher
          isProductList={false}
          slug={slug}
          record={record}
          deleteModalView="DELETE_TYPE"
          routes={Routes?.sms}
          isUpdate={list?.isUpdate}
          isView={list.isView}
        />
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
    </>
  );
};

export default TypeList;
