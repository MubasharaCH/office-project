import { Table } from '@/components/ui/table';
import { SortOrder, Type, BrandList } from '@/types';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { TrashIcon } from '@/components/icons/trash';
import { useEffect, useState } from 'react';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Pagination from '@/components/ui/pagination';
import Badge from '../ui/badge/badge';
// import { site_url } from '@/services/Service';
import defaultImg from '@/assets/images/default.png'
import { useRouter } from 'next/router';
import ActionButtons from '../common/action-buttons';
import Link from 'next/link';
import { EditIcon } from '../icons/edit';
import { RiDeleteBin6Line } from "react-icons/ri";
import Modal from '@/components/ui/modal/modal';
import Button from '@/components/ui/button';
import { toast } from 'react-toastify';
import Card from '@/components/common/card';
import { DeleteFunction, DeleteFunctionWithUrl } from '@/services/Service';
import cn from 'classnames';
import { render } from '@headlessui/react/dist/utils/render';

type Props = {
  id: any;
  editModalView?: string | any;
  deleteModalView?: string | any;
  editUrl?: string;
  detailsUrl?: string;
  isUserActive?: boolean;
  userStatus?: boolean;
  isShopActive?: boolean;
  approveButton?: boolean;
  showAddWalletPoints?: boolean;
  changeRefundStatus?: boolean;
  showMakeAdminButton?: boolean;
  showReplyQuestion?: boolean;
  customLocale?: string;
  isUpdate?: boolean;
  isView?: boolean;
  isDelete?: boolean;
  editText?: boolean;
  deleteAPIendPoint?: any;
  deleteWithUrl?: boolean;
};

export type IProps = {
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const TypeList = (list: any) => {
  const [show, setshow] = useState<any>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<any>(false);
  const [listPerPage, setListPerPage] = useState(10);
  const { t } = useTranslation();
  const [openDialog, setOpenDialog] = useState<any>(false);
  const { alignLeft, alignRight } = useIsRTL();
  const { locale,query } = useRouter();
  const [id, setid] = useState(null);
  const [sortingObj, setSortingObj] = useState<{
    
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });
  const router = useRouter();
  function handleDelete(slug) {
    setOpenDialog(true);
 setid(slug)

  }
 
  const onDeletePress = () => {
    setLoading(true);
    let form = { 
      slug: id,
    };
    DeleteFunctionWithUrl(`/custom-field/delete/${id}`).then((result) => {
      if (result.success) {
        toast.success(t('common:successfully-deleted'));
        setLoading(false);
        setOpenDialog(false);
        router.reload();
      } else {
        toast.error(t(result.message
));
        setLoading(false);
      }
    })
  };
  const columns = [
 
    {
      title:<span style={{fontFamily:"poppins"}}>{t('table:table-item-tittle')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'title',
      key: 'name',
      align: alignLeft,
      render: (title: any) => <span className="whitespace-nowrap" style={{fontFamily:"poppins"}}>{title}</span>,
    },

    {
      title:<span style={{fontFamily:"poppins"}}>{t('table:table-item-value')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'values',
      key: 'name',
      align: alignLeft,
      render: (values: any) => <span className="whitespace-nowrap" style={{fontFamily:"poppins"}}>{values}</span>,
    },
    {
      title:<span style={{fontFamily:"poppins"}}>{t('table:table-item-data')}</span> ,
      className: 'cursor-pointer',
      dataIndex: 'data_type',
      key: 'name',
      align: alignLeft,
      render: (data_type: any) => <span className="whitespace-nowrap" style={{fontFamily:"poppins"}}>{data_type}</span>,
    },
    {
      title:<span style={{fontFamily:"poppins"}}>{t('table:table-item-actions')}</span> ,
      dataIndex: 'id',
      key: 'actions',
      align: alignRight,
      render: (slug: string, record: Type) => (
        <div> 
        <Link 
          href={`/catalog/customFeild/${slug}/edit`}  
        >
            <EditIcon style={{right:40,position:'absolute' ,width:16}}  className="text-sm transition duration-200  hover:text-white"  />
        </Link>

        <button
              onClick={() => handleDelete(slug)}
          className="text-red-500 transition duration-200 hover:text-red-600 focus:outline-none"
          title={t('common:text-delete')}
        >
          <TrashIcon  width={16} />
        </button>
          <Modal
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        style={{  width: '45%'  }}
      >
        <Card className="mt-4" style={{ width: 400 }}>
          <div className="m-auto w-full">
            <div className="h-full w-full text-center">
              <div className="flex h-full flex-col justify-between">
                <TrashIcon className="m-auto mt-4 h-12 w-12 text-accent" />
                <p className="mt-4 text-xl font-bold text-heading">Delete</p>
                <p className="py-2 px-6 leading-relaxed text-body-dark dark:text-muted">
                  Are you sure, you want to delete?
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
                      Cancel
                    </Button>
                  </div>
                  <div className="w-1/2">
                    <Button
                    
                      onClick={onDeletePress}
                      loading={loading}
                      variant="custom"
                      className={cn(
                        'w-full rounded bg-red-600 py-2 px-4 text-center text-base font-semibold text-light shadow-md transition duration-200 ease-in hover:bg-red-700 focus:bg-red-700 focus:outline-none'
                      )}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Modal>

        </div>
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
 
    setCurrentPage(1); 
  };
  return (
    <>
     {/* <div className="flex justify-end mb-3 mr-2">
        <label htmlFor="entries" className="text-sm pr-3 pt-1">
          Show
        </label>
        <select
          id="entries"
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
          Entries
        </label>
      </div> */}
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

export default TypeList;
