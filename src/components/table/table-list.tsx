import { Table } from '@/components/ui/table';
import { SortOrder, Type, BrandList } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Pagination from '@/components/ui/pagination';
import { Fragment, useEffect, useRef, useState } from 'react';
import Loader from '@/components/ui/loader/loader';
import Badge from '@/components/ui/badge/badge';
import { Menu, Transition } from '@headlessui/react';
import Link from '../ui/link';
import Modal from '../ui/modal/modal';
import Card from '../common/card';
import html2canvas from 'html2canvas';
import QRCode from 'react-qr-code';
import Button from '../ui/NewButton';

export type IProps = {
  listOfBrands: BrandList[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const TableList = (list: any) => {
  // {console.log(list)}
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(10);
  const [tableId, setTableId] = useState('');
  const [openDialog, setOpenDialog] = useState<any>(false);
  const [isUpdated, setIsUpdate] = useState<boolean>(false);

  // useEffect(() => {
  //   setIsUpdate(true);
  // },[])
  const onClickQr = (id) => {
    setOpenDialog(true);
    setTableId(id);
  };

  const qrCodeRef: any = useRef(null);
  const downloadQRCode = (e) => {
    e.preventDefault();

    if (qrCodeRef.current) {
      html2canvas(qrCodeRef.current, { scale: 2 }).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'qr-code.png';
        link.click();
      });
    }
  };
  const businessDetail = JSON.parse(
    localStorage.getItem('user_business_details')!
  );
  console.log('====================================');
  // console.log(businessDetail);
  console.log('====================================');

  if (list.loading) return <Loader text={t('common:text-loading')} />;

  const columns = [
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-name')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      // width: 120,
      render: (name: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {name}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-no-person')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'no_person',
      key: 'name',
      // width: 120,
      align: alignLeft,
      render: (p: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {p}
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
      // width: 120,
      align: alignLeft,
      render: (status: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {status == 1 ? 'Active' : 'InActive'}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-location')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'status',
      key: 'name',
      // width: 120,
      align: alignLeft,
      render: (status: any, row: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {row?.location?.name}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-actions')}
        </span>
      ),
      key: 'actions',
      align: 'center',
      render: function Render(value: any, row: any) {
        return (
          <div style={{ fontFamily: 'poppins' }}>
            <Menu
              style={{}}
              as="div"
              className="relative inline-block text-left"
            >
              <div>
                <Menu.Button className="inline-flex w-24 justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-light text-white hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                  {t('table:table-item-colum-action')}
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="relative right-0 z-10 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1 ">
                    {list.isUpdate && (
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href={`table/${row.id}/edit`}
                            className={`${
                              active ? 'bg-accent text-white' : 'text-gray-900'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-white`}
                          >
                            {t('Edit')}
                          </Link>
                        )}
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      {({ active }) => (
                        <div
                          onClick={() => onClickQr(row.id)}
                          className={`${
                            active ? 'bg-accent text-white' : 'text-gray-900'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-white`}
                        >
                          {t('Scan QR')}
                        </div>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        );
      },
      // render: (slug: string, record: Type) => (
      //   <LanguageSwitcher
      //     isProductList={false}
      //     slug={slug}
      //     record={record}
      //     deleteModalView="DELETE_TYPE"
      //     routes={Routes?.table}
      //     isUpdate={list?.isUpdate}
      //     isView={list.isView}
      //   />
      // ),
    },
  ];

  const lastItemIndex = currentPage * listPerPage;
  const firstItemIndex = lastItemIndex - listPerPage;
  const currentList = list?.list?.slice(firstItemIndex, lastItemIndex);
  if (list.loading) return <Loader text={t('common:text-loading')} />;

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
      <Modal
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        style={{ width: '45%' }}
      >
        <Card className="mt-4">
          <div className="m-auto w-full">
            <div className=" justify-center">
              <div className="h-40 w-40" ref={qrCodeRef}>
                <QRCode
                  size={56}
                  style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                  value={
                    `https://${businessDetail.store_front.domain}.dev.myignite.site/my-account/orders/invoice?id=` +
                    tableId
                  }
                />
              </div>
              <Button className="mt-5 w-40" onClick={downloadQRCode}>
                Download
              </Button>
            </div>
          </div>
        </Card>
      </Modal>
    </>
  );
};

export default TableList;
