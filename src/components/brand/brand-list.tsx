import { Table,AlignType } from '@/components/ui/table';
import { SortOrder, Type, BrandList } from '@/types';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useEffect, useState ,Fragment} from 'react';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Pagination from '@/components/ui/pagination';
import Badge from '../ui/badge/badge';
import { Menu, Transition } from '@headlessui/react';
import Link from '@/components/ui/link';
// import { site_url } from '@/services/Service';
import defaultImg from '@/assets/images/default.png'
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
      title:<span style={{fontFamily:"poppins"}}>{ t('table:table-item-image')}</span>,
      dataIndex: 'image',
      key: 'image',
      align: 'center',
      width: 74,
      render: (image: any, { name }: { name: string }) => (
        <>
        {image? 
          <Image
          src={
            image 
          }
          alt={name}
          loader={()=>image}
          layout="fixed"
          width={42}
          height={42}
          className="overflow-hidden rounded object-contain"
        />
      :
      <Image
      src={
        defaultImg
      }
      alt={name}
      // loader={()=>cat_image}
      layout="fixed"
      width={42}
      height={42}
      className="overflow-hidden rounded object-contain"
    />}
        
        </>
     
      ),
    },
    {
      title:<span style={{fontFamily:"poppins"}}>{t('table:table-item-brand')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      render: (name: any) => <span className="whitespace-nowrap" style={{fontFamily:"poppins"}}>{name}</span>,
    },
    {
      title:<span style={{fontFamily:"poppins"}}>{t('table:table-item-status')}</span> ,
      dataIndex: 'name',
      key: 'status',
      align: 'center',
      width: 80,
      render: (status: string, record: any) => (
        <div
          className={`flex justify-start ${
            record?.quantity > 0 && record?.quantity < 10
              ? 'flex-col items-baseline space-y-3 3xl:flex-row 3xl:space-x-3 3xl:space-y-0 rtl:3xl:space-x-reverse'
              : 'items-center space-x-3 rtl:space-x-reverse'
          }`}
          style={{fontFamily:"poppins"}}
        >
          <Badge
            text="Active"
            color={
              status.toLocaleLowerCase() === 'draft'
                ? 'bg-yellow-400'
                : 'bg-accent'
            }
          />
          {record?.quantity > 0 && record?.quantity < 10 && (
            <Badge
              text={t('common:text-low-quantity')}
              color="bg-red-600"
              animate={true}
            />
          )}
        </div>
      ),
    },
 
  ];

  if(list.isUpdate){
    columns.unshift( {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-actions')}
        </span>
      ),
      dataIndex: 'id',
      key: 'actions',
      align: 'center' as AlignType,
      width: 200,
      

      render: (id: any, row: any) => {
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
                          href={`brands/${row.id}/edit`}
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
