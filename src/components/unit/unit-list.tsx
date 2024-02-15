import { Table,AlignType } from '@/components/ui/table';
import { SortOrder, Type, BrandList } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useEffect, useState,Fragment } from 'react';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Pagination from '@/components/ui/pagination';
import { Menu, Transition } from '@headlessui/react';
import Link from '@/components/ui/link';
export type IProps = {
  listOfBrands: BrandList[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const UnitList = (list: any) => {
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(10);

  const columns = [
  
    
    
    {
      title: t('table:table-item-unit'),
      className: 'cursor-pointer',
      dataIndex: 'actual_name',
      key: 'name',
      align: alignLeft,
      // onHeaderCell: () => onHeaderClick('name'),
      render: (actual_name: any) => (
        <span className="whitespace-nowrap">{actual_name}</span>
      ),
    },
    {
      title: t('table:table-item-short-name'),
      className: 'cursor-pointer',
      dataIndex: 'short_name',
      key: 'name',
      align: alignLeft,
      // onHeaderCell: () => onHeaderClick('name'),
      render: (short_name: any) => (
        <span className="whitespace-nowrap">{short_name}</span>
      ),
    },
    {
      title:  t('table:table-item-allow-decimal'),
      className: 'cursor-pointer',
      dataIndex: 'allow_decimal',
      key: 'name',
      // align: "center",
      align: alignRight,

      // onHeaderCell: () => onHeaderClick('name'),
      render: (allow_decimal: any) => (
        <span className="whitespace-nowrap">{allow_decimal}</span>
      ),
    }
    
  ];

  if(list.isUpdate){
    columns.unshift({
      title: t('table:table-item-actions'),
      className: 'cursor-pointer',
      dataIndex: 'actions',
      key: 'name',
      align: 'center' as AlignType,
      // onHeaderCell: () => onHeaderClick('name'),
      render: (value:any) => {
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
                 
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href={`units/${value.id}/edit`}
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
               
                    {/* <Menu.Item>
                      <Link
                        href={`products/sellingPrice/${row.id}`}
                        className={`${'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-white`}
                      >
                        Add or edit group price
                      </Link>
                    </Menu.Item> */}
               
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        );
      },
    })
  }
  const lastItemIndex = currentPage * listPerPage;
  const firstItemIndex = lastItemIndex - listPerPage;
  const currentList = list?.list?.slice(firstItemIndex, lastItemIndex);
  const handlePageSizeChange = (event) => { 
    if(event.target.value=="All"){
      setListPerPage(list?.list.length);
    }else{
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
          columns={columns.map((column:any) => {
            if (column.title === 'Actions') {
              return {
                ...column,
                title: (
                  <span style={{ fontFamily: 'poppins' }}>
                    {column.title}
                  </span>
                ),
                render: (text, record) => (
                  
                  <span style={{ fontFamily: 'poppins' }}>
                    {column.render && typeof column.render === 'function' ? column.render(text, record) : ''}
                  </span>
                ),
              };
            } else {
              return {
                ...column,
                title: (
                  <span style={{ fontFamily: 'poppins' }}>
                    {column.title.props ? column.title.props.children : column.title}
                  </span>
                ),
                render: (text, record) => {
                  const dataIndex = column.dataIndex;
                  const value = record[dataIndex];
          
                  if (typeof value === 'object' && value !== null) {
                    if (Array.isArray(value)) {
                      // Handle array data
                      return (
                        <span style={{ fontFamily: 'poppins' }}>
                          {value.map((item) => (
                            <span key={item}>{item.toString()}</span>
                          ))}
                        </span>
                      );
                    } else {
                      // Handle object data
                      return (
                        <span style={{ fontFamily: 'poppins' }}>
                          {Object.keys(value).map((key) => (
                            <span key={key}>{value[key]?.toString()}</span>
                          ))}
                        </span>
                      );
                    }
                  } else {
                    return (
                      <span style={{ fontFamily: 'poppins' }}>
                        {typeof text === 'undefined' ? '' : text?.toString()}
                      </span>
                    );
                  }
                },
              };
            }
          })}
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

export default UnitList;
