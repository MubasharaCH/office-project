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
      title: t('form:form-title-date'),
      className: 'cursor-pointer',
      dataIndex: 'created_at',
      key: 'name',
      align: alignLeft,
      width: 150,
      render: (created_at: any) => (
        <span className="whitespace-nowrap">{created_at}</span>
      ),
    },
    {
      title: t('form:debit'),
      className: 'cursor-pointer',
      dataIndex: 'amount',
      key: 'amount',
      align: alignLeft,
      width: 150,
      render: (amount: any) => (
        amount < 0 ? (amount) :''
      ),
    },
    {
      title: t('form:credit'),
      className: 'cursor-pointer',
      dataIndex: 'amount',
      key: 'amount',
      align: alignLeft,
      width: 150,
      render: (amount: any) => (
        amount > 0 ? (amount) :''

      ),
    },
    
      /*  
    {
      title: 'ACTION',
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
    }, 
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: alignRight,
      render: (slug: string, record: Type) => (
        <ActionButtons
          id={slug}
          editUrl={Routes?.customer.editWithoutLang(slug)}
          //deleteModalView={deleteModalView}
          //  detailsUrl={routes.details(slug)}
          detailsUrl={`${'customer'}/${slug}`}
        />
        /*  <LanguageSwitcher
          isProductList={true}
          slug={slug}
          record={record}
          deleteModalView="DELETE_TYPE"
          routes={Routes?.customer}
        /> 
      ),
    },
    */
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

export default CustomerList;
