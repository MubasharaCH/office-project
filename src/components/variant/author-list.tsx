import { Table, AlignType } from '@/components/ui/table';
import { useTranslation } from 'next-i18next';
import { useEffect, useState, Fragment } from 'react';
import { useRouter } from 'next/router';
import { Author, MappedPaginatorInfo } from '@/types';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Pagination from '@/components/ui/pagination';
import { Menu, Transition } from '@headlessui/react';
import Link from '@/components/ui/link';
import Modal from '@/components/ui/modal/modal';
import Card from '@/components/common/card';
import cn from 'classnames';
import { DeleteFunction } from '@/services/Service';
import Button from '@/components/ui/button';
import { TrashIcon } from '@/components/icons/trash';
import { toast } from 'react-toastify';
const AuthorList = (list: any) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState<any>(false);
  const [deleteId, setDeleteId] = useState<any>('');
  const [loading, setLoading] = useState<any>(false);
  let columns = [
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('common:variant-type')}
        </span>
      ),
      dataIndex: 'name',
      key: 'name',
      width: 200,
      align: 'center' as AlignType,
      ellipsis: true,
      render: (name: any) => (
        <span
          className="truncate whitespace-nowrap"
          style={{ fontFamily: 'poppins' }}
        >
          {name}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('common:variant-value')}
        </span>
      ),
      dataIndex: 'values',
      key: 'name',
      align: 'left' as AlignType,

      ellipsis: true,
      render: (row: any) => (
        <ul style={{ columnCount: 8, fontFamily: 'poppins' }}>
          {row.map((resss: any, index: number) => (
            <li key={index}>{resss.name},</li>
          ))}
        </ul>
      ),
    },
  ];
  if (list.isUpdate || list.isDelete) {
    columns.unshift({
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-actions')}
        </span>
      ),
      dataIndex: 'id',
      key: 'actions',
      align: 'center' as AlignType,
      width: 200,
      ellipsis: true,

      render: (value: any) => {
        return (
          <div className="whitespace-normal ">
            <Menu
              style={{ width: 160 }}
              as="div"
              className="relative inline-block text-left"
            >
              <div className="flex justify-center">
                <Menu.Button className="inline-flex w-24 justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-light text-white hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                  {t('common:action')}
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
                  <div className="px-1 py-1 " style={{ fontFamily: 'poppins' }}>
                    {list.isUpdate && (
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href={`variant/${value}/edit`}
                            className={`${
                              active ? 'bg-accent text-white' : 'text-gray-900'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-white`}
                          >
                            Edit
                          </Link>
                        )}
                        {/* <div className="text-gray-900 hover:bg-accent hover:text-white">
                      <LanguageSwitcher
                        isProductList={false}
                        slug={id}
                        record={row}
                        deleteModalView="DELETE_TYPE"
                        routes={Routes?.product}
                        isUpdate={list.isUpdate}
                        isView={list.isView}
                        editText={true}
                      />
                    </div> */}
                      </Menu.Item>
                    )}
                         {list.isDelete===null && (
                      <Menu.Item>
                     
                        <div
                          onClick={() => {
                            setOpenDialog(true);
                            setDeleteId(value);
                          }}
                          className={`${'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-white`}
                        >
                          Delete
                        </div>
                   
                      </Menu.Item>
                    )}
                  
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        );
      },
    });
  }


  const onDeletePress = () => {
    setLoading(true);
    DeleteFunction('/del-coupon', { coupon_id: deleteId }).then((result) => {
      if (result.success) {
        toast.success(t('common:successfully-deleted'));
        setLoading(false);
        setOpenDialog(false);
        setDeleteId('');
        router.reload();
      } else {
        toast.error(t(result.msg));
        setDeleteId('');
        setLoading(false);
      }
    });
  };

  const lastItemIndex = currentPage * listPerPage;
  const firstItemIndex = lastItemIndex - listPerPage;
  const currentList = list?.list?.slice(firstItemIndex, lastItemIndex);
  const handlePageSizeChange = (event) => {
    if (event.target.value == 'All') {
      setListPerPage(list?.list.length);
    } else {
      const newSize = parseInt(event.target.value);
      setListPerPage(newSize);
    }

    setCurrentPage(1); // Reset to the first page when changing page size
  };

  return (
    <>
      <div className="mb-3 mr-2 flex justify-end">
        <label htmlFor="entries" className="pr-3 pt-1 text-sm">
          {t('form:form-show')}
        </label>
        <select
          id="entries"
          // value={listPerPage}
          onChange={handlePageSizeChange}
          className="rounded border p-1 text-sm"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="All">All</option>
        </select>
        <label htmlFor="entries" className="pl-3 pt-1 text-sm">
          {t('form:form-entries')}
        </label>
      </div>
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

<Modal
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        style={{ width: '45%' }}
      >
        <Card className="mt-4" style={{ width: 400 }}>
          <div className="m-auto w-full">
            <div className="h-full w-full text-center">
              <div className="flex h-full flex-col justify-between">
                <TrashIcon className="m-auto mt-4 h-12 w-12 text-accent" />
                <p className="mt-4 text-xl font-bold text-heading">Delete</p>
                <p className="py-2 px-6 leading-relaxed text-body-dark dark:text-muted">
                  {t('common:delete-item-confirm')}
                </p>
                <div className="mt-8 flex w-full items-center justify-between space-s-4">
                  <div className="w-1/2">
                    <Button
                      onClick={() => setOpenDialog(false)}
                      variant="custom"
                      className={cn(
                        'w-full rounded bg-accent py-2 px-4 text-center text-base font-semibold text-light shadow-md transition duration-200 ease-in hover:bg-accent-hover focus:bg-accent-hover focus:outline-none'
                      )}
                    >
                      {t('common:button-cancel')}
                    </Button>
                  </div>
                  <div className="w-1/2">
                    <Button
                      onClick={onDeletePress}
                      loading={loading}
                      variant="custom"
                      className={cn(
                        'w-full rounded bg-red-600 py-2 px-4 text-center text-base font-semibold text-light shadow-md transition duration-200 ease-in hover:bg-red-700 focus:bg-red-700 focus:outline-none'
                        // deleteBtnClassName
                      )}
                    >
                      {t('common:button-delete')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Modal>
    </>
  );
};

export default AuthorList;
