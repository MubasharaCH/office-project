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
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-license-code')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'licence_code',
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
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-last-invoice-no')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'last_invoice_no',
      key: 'name',
      align: alignLeft,
      width: 100,
      render: (last_invoice_no: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {last_invoice_no}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-invoice-sequence')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'invoice_sequence',
      key: 'name',
      align: alignLeft,
      width: 130,
      render: (invoice_sequence: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {invoice_sequence}
        </span>
      ),
    },
    // {
    //   title: 'Status',
    //   className: 'cursor-pointer',
    //   dataIndex: 'status',
    //   key: 'name',
    //   align: alignLeft,
    //   width: 130,
    //   render: (status: any) => (
    //     <span className="whitespace-nowrap">{status}</span>
    //   ),
    // },
    // {
    //   title: 'Action',
    //   className: 'cursor-pointer',
    //   dataIndex: 'status',
    //   key: 'id',
    //   align: alignLeft,
    //   width: 130,
    //   render: function Render(status: any, ids: any) {
    //     const [valueToggle, setValueRToggle] = useState(status);
    //     function handleOnClick() {
    //       let id = ids;

    //       let value = { status: 'Inactive' };

    //       UpdateIsActive('/device-update', id.id, value).then((result) => {
    //         toast.success('Updated Successfully');
    //         window.location.reload();
    //       });
    //     }

    //     return (
    //       <>
    //         {status === 'Active' && (
    //           <span
    //             onClick={() => {
    //               if (confirm('Do you REALLY want to Inactive this device?')) {
    //                 handleOnClick();
    //               }
    //             }}
    //             className="cursor-pointer whitespace-nowrap"
    //           >
    //             <DotsIcons />
    //           </span>
    //         )}
    //       </>
    //     );
    //   },
    //   /*  render: (status: any,ids: any) =>
    //     status === 'Active' && (
    //       <span
    //         onClick={() => {
    //           if (confirm('Do you REALLY want this?')) {
    //             UpdateIsActive('/device-update', id.id, value).then((result) => {
    //                 toast.success('Updated Successfully');
    //                 setValueRToggle(valueToggle === 'Active' ? 'Inactive' : 'Active');
    //               });
    //           }
    //         }}
    //         className="cursor-pointer whitespace-nowrap"
    //       >
    //         <DotsIcons />
    //       </span>
    //     ), */
    // },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-status')}
        </span>
      ),
      dataIndex: 'status',
      key: 'id',
      align: 'left',
      width: 180,

      render: function Render(status: any, ids: any) {
        const [valueToggle, setValueRToggle] = useState(status);
        function handleOnClick() {
          let id = ids;

          let value = {};
          value = { status: status === 'Active' ? 'Inactive' : 'Active' };

          UpdateIsActive('/device-update', id.id, value).then((result) => {
            toast.success('Updated Successfully');
            setValueRToggle(valueToggle === 'Active' ? 'Inactive' : 'Active');
          });
        }

        return (
          <>
            <Switch
              checked={valueToggle}
              onChange={handleOnClick}
              className={`${
                valueToggle === 'Active' ? 'bg-accent' : 'bg-gray-300'
              } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
              dir="ltr"
            >
              <span className="sr-only">Enable</span>
              <span
                className={`${
                  valueToggle === 'Active' ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-light`}
                style={{ fontFamily: 'poppins' }}
              />
            </Switch>
          </>
        );
      },
    },
    //   {
    //   title: t('table:table-item-actions'),
    //   dataIndex: 'id',
    //   key: 'actions',
    //   align: alignRight,
    //   render: (slug: string, record: Type) => {
    //     return (
    //       <LanguageSwitcher
    //         slug={slug}
    //         isView={false}
    //         isUpdate={true}
    //         record={record}
    //         deleteModalView="DELETE_TYPE"
    //         routes={Routes?.devices}
    //       />
    //     );
    //   },
    // },
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

      {/* 
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
      )} */}
    </>
  );
};

export default ProductList;
