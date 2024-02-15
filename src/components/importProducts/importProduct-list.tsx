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

const ImportProducts = (list: any) => {
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(10);

  const columns = [
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-Number')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'id',
      key: 'name',
      align: alignLeft,
      width: 200,
      render: (id: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {id}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-status')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'status',
      key: 'name',
      align: alignLeft,
      width: 200,
      render: (email: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {email}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('form:input-label-type')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'type',
      key: 'name',
      align: alignLeft,
      width: 200,
      render: (type: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {type}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('form:input-label-type')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'type',
      key: 'name',
      align: alignLeft,
      width: 200,
      render: (type: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {type}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>{t('Reason of failure')}</span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'reason_of_failure',
      key: 'name',
      align: alignLeft,
      width: 200,
      render: (reason_of_failure: any) => {
        let displayedText = '';

        if (reason_of_failure?.length > 5) {
          let words = reason_of_failure.split(' ');
          if (words.length > 5) {
            displayedText = words.slice(0, 5).join(' ') + '...';
          } else {
            displayedText = reason_of_failure;
          }
        } else {
          displayedText = reason_of_failure;
        }

        return (
          <span
            className="whitespace-nowrap"
            style={{ fontFamily: 'poppins' }}
            title={reason_of_failure} // Set the full text as the tooltip
          >
            {displayedText}
          </span>
        );
      },
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-registration-date')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'created_at',
      key: 'name',
      align: alignLeft,
      width: 150,
      render: (created_at: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {created_at}
        </span>
      ),
    },
  ];

  const lastItemIndex = currentPage * listPerPage;
  const firstItemIndex = lastItemIndex - listPerPage;
  const currentList = list?.list?.slice(firstItemIndex, lastItemIndex);
  if (list.tableLoading) return <Loader text={t('common:text-loading')} />;

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
    </>
  );
};

export default ImportProducts;
