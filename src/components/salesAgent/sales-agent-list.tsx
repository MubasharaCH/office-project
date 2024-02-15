import { Table } from '@/components/ui/table';
import { SortOrder, Type, BrandList } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import { useState } from 'react';
import Pagination from '@/components/ui/pagination';

export type IProps = {
  listOfBrands: BrandList[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const AgentList = (list: any) => {
  // console.log("listlist",list);

  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(10);

  const columns = [
    {
      title: t('table:table-item-email'),
      className: 'cursor-pointer',
      dataIndex: 'email',
      key: 'name',
      align: alignLeft,
      width: 150,
      render: (email: any) => (
        <span className="whitespace-nowrap">{email}</span>
      ),
    },

    {
      title: t('table:table-item-phone-no'),
      className: 'cursor-pointer',
      dataIndex: 'contact_no',
      key: 'name',
      align: alignLeft,
      width: 150,
      render: (email: any) => (
        <span className="whitespace-nowrap">{email}</span>
      ),
    },

    {
      title: t('table:table-item-commission'),
      className: 'cursor-pointer',
      dataIndex: 'cmmsn_percent',
      key: 'name',
      align: alignLeft,
      width: 200,
      render: (cmmsn_percent: any, row: any) => <div>{cmmsn_percent}</div>,
    },
    {
      title: t('table:table-item-status'),
      className: 'cursor-pointer',
      dataIndex: 'status',
      key: 'name',
      align: alignLeft,
      width: 200,
      render: (status: any, row: any) => <div>{status}</div>,
    },

    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: alignRight,
      render: (slug: string, record: Type) => (
        <LanguageSwitcher
          slug={slug}
          record={record}
          deleteModalView="DELETE_TYPE"
          routes={Routes?.salesAgent}
          isUpdate={list?.isUpdate}
          isView={list?.isView}
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

      {/* {list?.list.length > 10 && (
        <div className="flex items-center justify-end">
          <Pagination
            total={list?.list.length}
            current={currentPage}
            pageSize={listPerPage}
            onChange={(val) => setCurrentPage(val)}
            showLessItems
          />
        </div>
      )} */}
    </>
  );
};

export default AgentList;
