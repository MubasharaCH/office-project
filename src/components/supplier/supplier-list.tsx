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

export type IProps = {
  listOfBrands: BrandList[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const CustomerList = (list: any) => {
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(10);

  const columns = [
    {
      title: t('table:table-item-customers'),
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      width: 200,
      render: (name: any) => <span className="whitespace-nowrap">{name}</span>,
    },
    {
      title: t('table:table-item-email'),
      className: 'cursor-pointer',
      dataIndex: 'email',
      key: 'name',
      align: alignLeft,
      width: 200,
      render: (email: any) => (
        <span className="whitespace-nowrap">{email}</span>
      ),
    },
    {
      title: t('table:table-item-registration-date'),
      className: 'cursor-pointer',
      dataIndex: 'created_at',
      key: 'name',
      align: alignLeft,
      width: 150,
      render: (created_at: any) => (
        <span className="whitespace-nowrap">{created_at}</span>
      ),
    },
    /*    {
      title: 'Order',
      className: 'cursor-pointer',
      dataIndex: 'order',
      key: 'name',
      align: alignLeft,
      width: 150,
      render: (order: any) => (
        <span className="whitespace-nowrap">{order}</span>
      ),
    },
    {
      title: 'Spend',
      className: 'cursor-pointer',
      dataIndex: 'spend',
      key: 'name',
      align: alignLeft,
      width: 150,
      render: (spend: any) => (
        <span className="whitespace-nowrap">{spend}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'contact_status',
      align: 'left',
      width: 180,
      render: (status: any) => (
        <Badge
          text={status}
          color={
            status != null
              ? status.toLocaleLowerCase() === 'active'
                ? 'bg-yellow-400'
                : 'bg-accent'
              : 'bg-inherit'
          }
        />
      ),
    }, */
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: alignRight,
      render: (slug: string, record: Type) => (
        <ActionButtons
          id={slug}
          editUrl={Routes?.supplier.editWithoutLang(slug)}
          //deleteModalView={deleteModalView}
          //  detailsUrl={routes.details(slug)}
          //   detailsUrl={`${'customer'}/${slug}`}
          isUpdate={list.isUpdate}
          //   isView={list.isView}
        />
        /*  <LanguageSwitcher
          isProductList={true}
          slug={slug}
          record={record}
          deleteModalView="DELETE_TYPE"
          routes={Routes?.customer}
        /> */
      ),
    },
  ];
  if (list.loader) return <Loader text={t('common:text-loading')} />;

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
