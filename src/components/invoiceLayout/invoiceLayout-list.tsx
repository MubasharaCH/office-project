import { Table } from '@/components/ui/table';
import { SortOrder, Type, BrandList } from '@/types';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useEffect, useState } from 'react';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Pagination from '@/components/ui/pagination';
import Badge from '../ui/badge/badge';
import { Switch } from '@headlessui/react';

export type IProps = {
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const TypeList = (list: any) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(10);

  console.log(list)
  // const [dummyArr, setDummyArr] = useState([]);
  // function filter(array: any, text: any) {
  //   const getNodes = (result: any, object: any) => {
  //     if (object.name.toLowerCase().includes(text)) {
  //       result.push(object);
  //       return result;
  //     }
  //     return result;
  //   };
  //   return array.reduce(getNodes, []);
  // }

  // useEffect(() => {
  //   GetFunction("/brand").then((result) => {
  //     setDummyArr(result.data);
  //   });
  // }, []);

  // const onearchhandle = (e: any) => {
  //   let val = e.target.value.toLowerCase();
  //   let filteredArray = filter(dummyArr, val);
  //   setDummyArr(filteredArray);
  // };

  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();

  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const columns = [
    {
      title:<span style={{fontFamily:'poppins'}}>{t('table:table-item-name')}</span>,
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      render: (name: any) => <span className="whitespace-nowrap" style={{fontFamily:'poppins'}}>{name}</span>,
    },
    {
      title:<span style={{fontFamily:'poppins'}}>{t('table:table-item-design')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'design',
      key: 'name',
      align: alignLeft,
      render: (design: any) => (
        <span className="whitespace-nowrap" style={{fontFamily:'poppins'}}>{design==='detailed'?'Standard':design==='slim'?'Simplified tax invoice':design==='tax_invoice'?'Tax invoice':design}</span>
      ),
    },
    {
      title:<span style={{fontFamily:'poppins'}}>{t('table:table-item-show-logo')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'show_logo',
      key: 'name',
      align: alignLeft,
      render: (show_logo: any) => (
        <span className="whitespace-nowrap" style={{fontFamily:'poppins'}}>
          {show_logo == 0 ? 'false' : 'true'}
        </span>
      ),
    },
    {
      title:<span style={{fontFamily:'poppins'}}>{t('table:table-item-show-qr')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'show_barcode',
      key: 'name',
      align: alignLeft,
      render: (show_barcode: any) => (
        <span className="whitespace-nowrap" style={{fontFamily:'poppins'}}>
          {show_barcode == 0 ? 'false' : 'true'}
        </span>
      ),
    },
    {
      title:<span style={{fontFamily:'poppins'}}>{t('table:table-item-actions')}</span> ,
      dataIndex: 'id',
      key: 'actions',
      align: alignRight,
      render: (slug: string, record: Type) => (
        <LanguageSwitcher
          isProductList={false}
          slug={slug}
          record={record}
          deleteModalView="DELETE_TYPE"
          routes={Routes?.invoiceLayout}
          isView={false}
          isUpdate={true}
        />
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

      {list?.list.length > 10 && (
        <div className="flex items-center justify-end">
          <Pagination
            total={list?.list?.length}
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

export default TypeList;
