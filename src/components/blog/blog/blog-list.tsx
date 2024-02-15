import { Table } from '@/components/ui/table';
import { SortOrder, Type, ListData } from '@/types';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useEffect, useState } from 'react';
import { Fragment } from 'react';
import { AlignType, ColumnType } from 'rc-table/lib/interface';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Pagination from '@/components/ui/pagination';
import { site_url } from '@/services/Service';
import { Menu, Transition } from '@headlessui/react';
import defaultImg from '@/assets/images/default.png';
import { toast } from 'react-toastify';
import Link from '@/components/ui/link';
export type IProps = {
  listOfBrands: ListData[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const BlogList = (list: any) => {
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(10);
  const rowExpandable = (record: any) => record?.children?.length;
  const columns = [
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-actions')}
        </span>
      ),
      dataIndex: 'id',
      key: 'actions',
      align: 'left' as AlignType,
      width: 100,
  

      render: (id: any, row: any) => {
        return (
          <div className="whitespace-normal ">
            <Menu
              style={{ width: 160 }}
              as="div"
              className="relative inline-block text-left"
            >
              <div className="flex">
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
                    <Menu.Item>
                      {/* <div className="text-gray-900 hover:bg-accent hover:text-white">
                        <LanguageSwitcher
                          isProductList={false}
                          slug={id}
                          record={row}
                          deleteModalView="DELETE_TYPE"
                          routes={Routes?.category}
                          isUpdate={list.isUpdate}
                          isView={list.isView}
                          editText={true}
                        />
                      </div> */}
                      {({ active }) => (
                        <Link
                          // href={`${router.asPath}/${row.id}/edit`}
                          // href={`editInvoice/${row.id}/edit`}
                          href={`blog/${row.slug}/edit`}
                          className={`${
                            active ? 'bg-accent text-white' : 'text-gray-900'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-white`}
                        >
                          Edit
                        </Link>
                      )}
                    </Menu.Item>
                    {/* {list.businessDetail.includes('custom_fields') && (
                      <Menu.Item>
                        <Link
                          href={`customFeild/${row.id}?value=category`}
                          className={`${'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-white`}
                        >
                          {t('common:sidebar-nav-item-custom')}
                        </Link>
                      </Menu.Item>
                    )} */}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        );
      },
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-name')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      align: alignLeft,
      // onHeaderCell: () => onHeaderClick('name'),
      render: (name: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {name}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-image')}
        </span>
      ),
      dataIndex: 'blog_image',
      key: 'blog_image',
      align: 'left' as AlignType,
      width: 74,
      render: (blog_image: any, { name }: { name: string }) => (
        <>
          {blog_image ? (
            <Image
              src={blog_image}
              alt={name}
              loader={() => blog_image}
              layout="fixed"
              width={42}
              height={42}
              className="overflow-hidden rounded"
            />
          ) : (
            <Image
              src={defaultImg}
              alt={name}
              // loader={()=>cat_image}
              layout="fixed"
              width={42}
              height={42}
              className="overflow-hidden rounded"
            />
          )}
        </>
      ),
    },
  
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-description')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'description',
      width: 200,
      align: alignLeft,
      // onHeaderCell: () => onHeaderClick('name'),
      render: (name: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {name}
        </span>
      ),
    },
    // {
    //   title: 'Sub Category Total',
    //   className: 'cursor-pointer',
    //   dataIndex: 'sub_category_total',
    //   key: 'name',
    //   width: 100,
    //   align: alignRight,

    //   // onHeaderCell: () => onHeaderClick('name'),
    //   render: (sub_category_total: any) => (
    //     <span className="whitespace-nowrap">{sub_category_total}</span>
    //   ),
    // },
    // {
    //   title: t('table:table-item-status'),
    //   dataIndex: 'name',
    //   key: 'status',
    //   align: 'left',
    //   width: 180,

    //   render: (status: string, record: any) => (
    //     <div
    //       className={`flex justify-start ${
    //         record?.quantity > 0 && record?.quantity < 10
    //           ? 'flex-col items-baseline space-y-3 3xl:flex-row 3xl:space-x-3 3xl:space-y-0 rtl:3xl:space-x-reverse'
    //           : 'items-center space-x-3 rtl:space-x-reverse'
    //       }`}
    //     >
    //       <Badge
    //         text="Active"
    //         color={
    //           status.toLocaleLowerCase() === 'draft'
    //             ? 'bg-yellow-400'
    //             : 'bg-accent'
    //         }
    //       />
    //       {record?.quantity > 0 && record?.quantity < 10 && (
    //         <Badge
    //           text={t('common:text-low-quantity')}
    //           color="bg-red-600"
    //           animate={true}
    //         />
    //       )}
    //     </div>
    //   ),
    // },
    // {
    //   title:<span style={{fontFamily:"poppins"}}>{t('table:table-item-actions')}</span> ,
    //   dataIndex: 'id',
    //   key: 'actions',
    //   align: alignRight,
    //   render: (slug: string, record: Type) => (
    //     <LanguageSwitcher
    //       isProductList={false}
    //       slug={slug}
    //       record={record}
    //       deleteModalView="DELETE_TYPE"
    //       routes={Routes?.category}
    //       isUpdate={list.isUpdate}
    //       isView={list.isView}
    //     />
    //   ),
    // },
  ];
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
      <div className="flex justify-end mb-3 mr-2">
        <label htmlFor="entries" className="text-sm pr-3 pt-1">
          {t('form:form-show')}
        </label>
        <select
          id="entries"
          // value={listPerPage}
          onChange={handlePageSizeChange}
          className="border rounded text-sm p-1"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="All">All</option>
        </select>
        <label htmlFor="entries" className="text-sm pl-3 pt-1">
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
          expandable={{
            expandedRowRender: () => '',
            rowExpandable: rowExpandable,
          }}
        />
      </div>

      {list?.list?.length > 10 && (
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

export default BlogList;
