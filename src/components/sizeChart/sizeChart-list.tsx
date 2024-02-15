import { Table } from '@/components/ui/table';
import { SortOrder, Type, BrandList } from '@/types';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Badge from '@/components/ui/badge/badge';
import Pagination from '@/components/ui/pagination';
import { useState } from 'react';
import { Switch } from '@headlessui/react';
import { UpdateIsActive } from '@/services/Service';
import { toast } from 'react-toastify';
import { DotsIcons } from '../icons/sidebar';

export type IProps = {
  listOfBrands: BrandList[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const ProductList = (list: any) => {
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(10);

  const columns = [
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-name')}
        </span>
      ),
      dataIndex: 'name',
      key: 'image',
      align: alignLeft,
      width: 100,
      render: (name: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {name}
        </span>
      ),
    },
    {
      title: <span style={{ fontFamily: 'poppins' }}>{t('Link Title')}</span>,
      className: 'cursor-pointer',
      dataIndex: 'link_title',
      key: 'name',
      align: alignLeft,
      width: 200,
      render: (licence_code: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {licence_code}
        </span>
      ),
    },

    {
      title: <span style={{ fontFamily: 'poppins' }}>{t('Link Type')}</span>,
      className: 'cursor-pointer',
      dataIndex: 'link_type',
      key: 'name',
      align: alignLeft,
      width: 100,
      render: (last_invoice_no: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {last_invoice_no}
        </span>
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

export default ProductList;
