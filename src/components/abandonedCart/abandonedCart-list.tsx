import { Table } from '@/components/ui/table';
import { SortOrder, Type, BrandList } from '@/types';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Badge from '@/components/ui/badge/badge';
import Pagination from '@/components/ui/pagination';
import { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';
import { UpdateIsActive } from '@/services/Service';
import { toast } from 'react-toastify';
import { DotsIcons } from '../icons/sidebar';
import ActionButtons from '../common/action-buttons';

export type IProps = {
  listOfBrands: BrandList[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const List = (list: any) => {
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(10);
  const [currency, setCurrency] = useState<any>();

  useEffect(() => {
    let businessDetails: any = localStorage.getItem('business_details');
    setCurrency(JSON.parse(businessDetails));
  }, []);

  const columns = [
    {
      title:<span style={{fontFamily:'poppins'}}>{t('common:customer-name')}</span> ,
      dataIndex: 'contacts',
      key: 'image',
      align: alignLeft,
      render: (row: any) => (
        <span className="whitespace-nowrap" style={{fontFamily:'poppins'}}>
          {row.first_name + ' ' + row.last_name}
        </span>
      ),
    },
    {
      title:<span style={{fontFamily:'poppins'}}>{t('common:created-at')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'created_at',
      key: 'name',
      align: alignLeft,
      render: (created_at: any) => (
        <span className="whitespace-nowrap" style={{fontFamily:'poppins'}}>{created_at}</span>
      ),
    },

    {
      title: <span style={{fontFamily:'poppins'}}>{t('common:edit-date')}</span>,
      className: 'cursor-pointer',
      dataIndex: 'updated_at',
      key: 'name',
      align: alignLeft,
      render: (updated_at: any) => (
        <span className="whitespace-nowrap" style={{fontFamily:'poppins'}}>{updated_at}</span>
      ),
    },
    {
      title:<span style={{fontFamily:'poppins'}}>{t('common:cart-price')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'final_amount',
      key: 'name',
      align: alignLeft,
      render: (final_amount: any) => (
        <span className="whitespace-nowrap" style={{fontFamily:'poppins'}}>
          {final_amount + currency?.symbol}
        </span>
      ),
    },
    {
      title:<span style={{fontFamily:'poppins'}}>{t('common:purchase-status')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'shipping_status',
      key: 'name',
      align: alignLeft,
      render: (shipping_status: any) => (
        <span className="whitespace-nowrap" style={{fontFamily:'poppins'}}>{shipping_status}</span>
      ),
    },
    {
      title:<span style={{fontFamily:'poppins'}}>{t('common:product-quantity')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'cart_detail',
      key: 'name',
      align: alignLeft,
      render: (account: any, row: any) => (
        <span className="whitespace-nowrap" style={{fontFamily:'poppins'}}>{account[0]?.quantity}</span>
      ),
    },
    {
      title:<span style={{fontFamily:'poppins'}}>{t('table:table-item-actions')}</span> ,
      dataIndex: 'id',
      key: 'actions',
      align: alignRight,
      render: (slug: string, record: Type) => (
        <ActionButtons
          id={slug}
          detailsUrl={`${'adandonedCartView'}/${slug}`}
          isUpdate={false}
          isView={true}
        />
      ),
    },
  ];

  const lastItemIndex = currentPage * listPerPage;
  const firstItemIndex = lastItemIndex - listPerPage;
  const currentList = list?.list?.data?.slice(firstItemIndex, lastItemIndex);

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

export default List;
