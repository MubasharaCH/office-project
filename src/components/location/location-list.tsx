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

export type IProps = {
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const TypeList = (list: any) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(10);

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

  const { t } = useTranslation('table');
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
      title:<span style={{fontFamily:'poppins'}}>{ t('table:table-item-name')}</span>,
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      render: (name: any) => <span className="whitespace-nowrap" style={{fontFamily:'poppins'}}>{name}</span>,
    },
    {
      title:<span style={{fontFamily:'poppins'}}>{ t('table:table-item-city')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'city',
      key: 'name',
      align: alignLeft,
      render: (city: any) => <span className="whitespace-nowrap" style={{fontFamily:'poppins'}}>{city}</span>,
    },
    {
      title:<span style={{fontFamily:'poppins'}}>{t('table:table-item-state')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'state',
      key: 'name',
      align: alignLeft,
      render: (state: any) => (
        <span className="whitespace-nowrap" style={{fontFamily:'poppins'}}>{state}</span>
      ),
    },
    {
      title:<span style={{fontFamily:'poppins'}}>{t('table:table-item-country')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'country',
      key: 'name',
      align: alignLeft,
      render: (county: any) => (
        <span className="whitespace-nowrap" style={{fontFamily:'poppins'}}>{county}</span>
      ),
    },
    // {
    //   title: t('table:table-item-ignite-pay-marchant'),
    //   className: 'cursor-pointer',
    //   dataIndex: 'custom_field3',
    //   key: 'name',
    //   align: alignLeft,
    //   render: (custom_field3: any) => <span className="whitespace-nowrap">{custom_field3}</span>,
    // },
    // {
    //   title: t('table:table-item-feature-product'),
    //   className: 'cursor-pointer',
    //   dataIndex: 'featured_products',
    //   key: 'name',
    //   align: alignLeft,
    //   render: (featured_products: any) =>  <span className="whitespace-nowrap grid grid-cols-1">
    //   {featured_products?.map((item:any)=>(
    //   <span className="text-clip">
    //     {item?.label}
    //     </span>
    //   ))}
    // </span>,
    // },
    {
      title:<span style={{fontFamily:'poppins'}}>{t('table:table-item-payment-method')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'payment_methods',
      key: 'name',
      align: alignLeft,

      render: (payment_methods: any) => (
        <span className="whitespace-nowrap grid grid-cols-1" style={{fontFamily:'poppins'}}>
          {payment_methods?.map((item: any, i) => (
            <span key={i} className="text-clip">
              {item?.label?.toLowerCase().includes('custom')
                ? null
                : item?.label}
              {/* {item?.label} */}
            </span>
          ))}
        </span>
      ),
    },
    // {
    //   title: t('table:table-item-status'),
    //   dataIndex: 'name',
    //   key: 'status',
    //   align: 'left',
    //   width: 80,
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
    {
      title:<span style={{fontFamily:'poppins'}}>{t('table:table-item-actions')}</span>,
      dataIndex: 'id',
      key: 'actions',
      align: alignRight,
      render: (slug: string, record: Type) => (
        <LanguageSwitcher
          isProductList={false}
          slug={slug}
          record={record}
          deleteModalView="DELETE_TYPE"
          routes={Routes?.location}
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

export default TypeList;
