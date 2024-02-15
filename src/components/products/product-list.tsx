import { Table, AlignType } from '@/components/ui/table';
import { SortOrder, Type, BrandList } from '@/types';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Badge from '@/components/ui/badge/badge';
import Pagination from '@/components/ui/pagination';
import { useState, Fragment } from 'react';
import { Switch } from '@headlessui/react';
import { site_url, UpdateIsActive } from '@/services/Service';
import { toast } from 'react-toastify';
import ActionButtons from '../common/action-buttons';
import { useRouter } from 'next/router';
import { Menu, Transition } from '@headlessui/react';
import Link from '@/components/ui/link';
import Loader from '@/components/ui/loader/loader';
import defaultImg from '@/assets/images/default.png';
// import { AlignType, ColumnType } from 'rc-table/lib/interface';
import 'rc-table/assets/index.css';
export type IProps = {
  listOfBrands: BrandList[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const components = {
  header: {
    row: (props) => <tr style={{ fontFamily: 'poppins' }} {...props} />,
  },
  body: {
    row: (props) => <tr style={{ fontFamily: 'poppins' }} {...props} />,
  },
};

const ProductList = (list: any) => {

  const { t } = useTranslation();
  const router = useRouter();
  const { alignLeft, alignRight } = useIsRTL();
  const [currentPage, setCurrentPage] = useState(1);
  const [userBusinessDetail, setUserBusinessDetail] = useState<any>();
  // const [listPerPage, setListPerPage] = useState(10);

  const rowExpandable = (record: any) =>
    record?.variation_options?.length > 0 &&
    record?.variation_options[0].name != 'DUMMY';

  const columns = [
    {
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
                          href={`product/${row.id}`}
                          className={`${
                            active ? 'bg-accent text-white' : 'text-gray-900'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-white`}
                        >
                          {t('common:text-view')}
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href={`products/${row.id}/edit`}
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
                    {row?.enable_stock == '1' && (
                      <Menu.Item>
                        <Link
                          href={`products/stock/${row.id}`}
                          className={`${'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-white`}
                        >
                          {t('form:add-or-edit')}
                        </Link>
                      </Menu.Item>
                    )}
                    {/* <Menu.Item>
                      <Link
                        href={`products/sellingPrice/${row.id}`}
                        className={`${'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-white`}
                      >
                        Add or edit group price
                      </Link>
                    </Menu.Item> */}
                    <Menu.Item>
                      <Link
                        href={`products/stockHistory/${row.id}`}
                        className={`${'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-white`}
                      >
                        {t('form:product-stock-history')}
                      </Link>
                    </Menu.Item>
                     {list?.subscriptionDetail?.enable_custom_field == 1 && ( 
                      <Menu.Item>
                        <Link
                          href={`customFeild/${row.id}?value=product`}
                          className={`${'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-white`}
                        >
                          {t('common:sidebar-nav-item-custom')}
                        </Link>
                      </Menu.Item>
                   )} 
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
          {t('table:table-item-image')}
        </span>
      ),
      dataIndex: 'image_url',
      key: 'image',
      align: alignLeft,
      width: 170,
      ellipsis: true,

      render: (img: any, data: any) => (
        <>
          {img ? (
            <Image
              src={img}
              alt="product"
              loader={() => img}
              layout="fixed"
              width={42}
              height={42}
              className="overflow-hidden rounded"
            />
          ) : (
            <Image
              src={defaultImg}
              alt="product"
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
          {t('table:table-item-name')}
        </span>
      ),
      className: 'cursor-pointer ',
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      width: 200,
      ellipsis: true,

      render: (name: any) => (
        <span className="whitespace-normal" style={{ fontFamily: 'poppins' }}>
          {name}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-brand')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'brand',
      key: 'name',
      align: alignLeft,
      width: 130,
      ellipsis: true,

      render: (row: any) => (
        <span className="whitespace-normal" style={{ fontFamily: 'poppins' }}>
          {row?.name}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-category')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'category',
      key: 'name',
      align: alignLeft,
      width: 130,
      ellipsis: true,

      render: (row: any) => (
        <span className="whitespace-normal" style={{ fontFamily: 'poppins' }}>
          {row?.name}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-tax')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'product_tax',
      key: 'name',
      align: alignLeft,
      width: 130,
      ellipsis: true,

      render: (row: any) => (
        <span className="whitespace-normal" style={{ fontFamily: 'poppins' }}>
          {row?.name}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-units')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'unit',
      key: 'name',
      align: alignLeft,
      width: 130,
      ellipsis: true,

      render: (row: any) => (
        <span className="whitespace-normal" style={{ fontFamily: 'poppins' }}>
          {row?.short_name}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }} className="whitespace-normal">
          {t('table:table-item-stock-code')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'sku',
      key: 'name',
      align: alignLeft,
      width: 170,
      ellipsis: true,

      render: (sku: any) => (
        <span className="whitespace-normal" style={{ fontFamily: 'poppins' }}>
          {sku}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-price')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'product_variations',
      key: 'name',
      align: alignRight,
      width: 100,
      ellipsis: true,

      render: (row: any) => (
        <span className="whitespace-normal" style={{ fontFamily: 'poppins' }}>
          {row?.[0]?.variations[0]?.sell_price_inc_tax &&
            list.BusinesDetails.symbol +
              Number(
                row?.[0]?.variations[0]?.sell_price_inc_tax
              ).toLocaleString()}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-marketplace-status')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'show_in_market_place',
      key: 'name',
      align: 'center' as AlignType,
      width: 170,
      ellipsis: true,

      render: (row: any, list: any) => (
        <span className="whitespace-normal" style={{ fontFamily: 'poppins' }}>
          <div className="cursor-pointer">
            <Badge
              text={
                list.is_admin_approve == 1
                  ? 'Active'
                  : row == 0
                  ? 'Inactive'
                  : 'Pending'
              }
              color={
                list.is_admin_approve == 1
                  ? 'bg-green-400'
                  : row == '0'
                  ? 'bg-accent'
                  : 'bg-yellow-400'
              }
            />
          </div>
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-status')}
        </span>
      ),
      dataIndex: 'is_inactive',
      key: 'id',
      align: 'center' as AlignType,
      width: 180,
      ellipsis: true,

      render: function Render(is_inactive: any, ids: any) {
        const [valueToggle, setValueRToggle] = useState(is_inactive);
        function handleOnClick() {
          let id = ids;

          let value = {};
          value = { is_inactive: is_inactive == 0 ? 1 : 0 };

          UpdateIsActive('/products/activate', id.id, value).then((result) => {
            if (result.success == true) {
              toast.success(result.msg);
              setValueRToggle(!valueToggle);
            }
          });
        }

        return (
          <>
            <Switch
              checked={!valueToggle}
              onChange={handleOnClick}
              className={`${
                !valueToggle ? 'bg-accent' : 'bg-gray-300'
              } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
              dir="ltr"
            >
              <span className="sr-only">Enable</span>
              <span
                className={`${
                  !valueToggle ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-light`}
              />
            </Switch>
          </>
        );
      },
    },
  ];

  const expandedRowRender = (record: any) => {
    // Check if the record has variation_options
    if (record.variation_options && record.variation_options.length > 0) {
      // Render the data from the variation_options array
      return (
        <div className="w-full">
          <table>
            <tbody>
              {record.variation_options.map((option: any, index: any) => (
                <tr key={index} className="grid w-full grid-cols-12">
                  <td className="col-span-3 flex justify-end">
                    {/* Render the image */}
                    <span className="pr-[120px]">
                      {option?.media[0] ? (
                        <Image
                          src={option?.media[0]?.display_url}
                          alt="product"
                          loader={() => option?.media[0]?.display_url}
                          layout="fixed"
                          width={42}
                          height={42}
                          className="overflow-hidden rounded"
                        />
                      ) : (
                        <Image
                          src={defaultImg}
                          alt="product"
                          // loader={()=>cat_image}
                          layout="fixed"
                          width={42}
                          height={42}
                          className="overflow-hidden rounded"
                        />
                      )}
                    </span>
                  </td>
                  <td
                    className="col-span-4 flex items-center"
                    style={{ fontFamily: 'poppins' }}
                  >
                    <span className="">{option.name}</span>
                  </td>
                  <td
                    className="col-span-2 flex  items-center"
                    style={{ fontFamily: 'poppins' }}
                  >
                    <span className="w-44 pl-[120px]">{option.sub_sku}</span>
                  </td>
                  <td
                    className="col-span-3 flex items-center"
                    style={{ fontFamily: 'poppins' }}
                  >
                    <span className="w-28 pl-10">
                      {list.BusinesDetails.symbol +
                        ' ' +
                        Number(option.sell_price_inc_tax).toLocaleString()}
                    </span>
                  </td>
                  {/* Render other data fields in the expanded row */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      // Return an empty string if no variation_options
      return '';
    }
  };

  // const lastItemIndex = currentPage * listPerPage;
  // const firstItemIndex = lastItemIndex - listPerPage;
  // const currentList = list?.list?.slice(firstItemIndex, lastItemIndex);
  if (list.loader) return <Loader text={t('common:text-loading')} />;

  return (
    <>
      <div className="mb-8 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={list?.list}
          rowKey="id"
          scroll={{ x: 380 }}
          components={components}
          expandable={{
            expandedRowRender: expandedRowRender,
            rowExpandable: rowExpandable,
          }}
        />
      </div>

      {!!list?.metaData?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={list?.metaData.total}
            current={list?.metaData.current_page}
            pageSize={list?.metaData.per_page}
            onChange={list?.paginationChange}
            showLessItems
          />
        </div>
      )}
    </>
  );
};

export default ProductList;
