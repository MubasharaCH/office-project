import { Table } from '@/components/ui/table';
import { SortOrder, Type, BrandList } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Badge from '../ui/badge/badge';
import { useState } from 'react';
import Pagination from '@/components/ui/pagination';

export type IProps = {
  listOfBrands: BrandList[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const RoleList = (list: any) => {
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(10);
  const columns = [
    {
      title: t('common:roles'),
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      width: 200,
      render: (name: any) => <span className="whitespace-nowrap">{name}</span>,
    },
    
    {
    
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: alignRight,
      showHeader:false,
      // className: 'invisible',
      render: (slug: string, record: Type ) => (
        (record.name != 'manager' ?(
           <LanguageSwitcher
          isProductList={false}
          slug={slug}
          record={record}
          deleteModalView="DELETE_TYPE"
          routes={Routes?.role}
          isUpdate={list.isUpdate}
          isView={list.isView}
        />
        ):'' )
        
       
      ),
    },
  ];

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
                            <span key={key}>{value[key].toString()}</span>
                          ))}
                        </span>
                      );
                    }
                  } else {
                    return (
                      <span style={{ fontFamily: 'poppins' }}>
                        {typeof text === 'undefined' ? '' : text.toString()}
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

export default RoleList;
