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

const UserList = (list: any) => {
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
      render: (email: any) => (
        <span className="whitespace-nowrap">{email}</span>
      ),
    },

    {
      title: t('table:table-item-role'),
      className: 'cursor-pointer',
      dataIndex: 'roles',
      key: 'name',
      align: alignLeft,
      render: (id: any, row: any) => (
        <div>
          {row?.roles?.map((res) => {
            return res?.name?.split('#')[0];
          })}
        </div>
      ),
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
          routes={Routes?.user}
          isUpdate={list?.isUpdate}
          isView={list?.isView}
        />
      ),
    },
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
          columns={columns.map((column: any) => {
            if (column.title === 'Actions') {
              return {
                ...column,
                title: (
                  <span style={{ fontFamily: 'poppins' }}>{column.title}</span>
                ),
                render: (text, record) => (
                  <span style={{ fontFamily: 'poppins' }}>
                    {column.render && typeof column.render === 'function'
                      ? column.render(text, record)
                      : ''}
                  </span>
                ),
              };
            } else {
              return {
                ...column,
                title: (
                  <span style={{ fontFamily: 'poppins' }}>
                    {column.title.props
                      ? column.title.props.children
                      : column.title}
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
                            <span key={item}>
                              {item.name.split('#')[0].toString()}
                            </span>
                          ))}
                        </span>
                      );
                    } else {
                      // Handle object data
                      return (
                        <span style={{ fontFamily: 'poppins' }}>
                          {Object.keys(value).map((key) => (
                            <span key={key}>{value[key].toString()}</span>
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

export default UserList;
