import { Table } from '@/components/ui/table';
import { SortOrder, Type, BrandList } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Pagination from '@/components/ui/pagination';
import { Fragment, useState } from 'react';
import Loader from '@/components/ui/loader/loader';
import Badge from '@/components/ui/badge/badge';
import { useRouter } from 'next/router';
import ActionButtons from '@/components/common/action-buttons';
import Select from '../ui/select/select';
import { Menu, Transition } from '@headlessui/react';
import LinkButton from '../ui/link-button';
import Link from '@/components/ui/link';
import Drawer from '../ui/drawer';
import DrawerWrapper from '../ui/drawer-wrapper';
import Card from '../common/card';
import Input from '../ui/input';
import Button from '../ui/button';
import Label from '../ui/label';
import { ShareOrder, site_url } from '@/services/Service';
import useClipboard from 'react-use-clipboard';
import { Routes } from '@/config/routes';
import { IoReload } from 'react-icons/io5';

export type IProps = {
  listOfBrands: BrandList[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const TypeList = (list: any) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(10);
  const [model, setModel] = useState(false);
  const [ShareURL, setShareURL] = useState<any>('');
  const [isCopied, setCopied] = useClipboard(ShareURL);
  const [closeDialog, setCloseDialog] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const {
    query: { shop },
  } = useRouter();

  if (list.loading) return <Loader text={t('common:text-loading')} />;

  let actionArray = [
    { label: 'one', key: 'one' },
    { label: 'two', key: 'two' },
  ];

  const closeFunction = () => {
    setModel(false);
  };

  const handleRowClick = (record) => {
    router.push(`../order/${record.id}`);
  };
  const columns = [
    {
      title: t('table:table-item-customer-name'),
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      width: 120,
      onCell: (record, index) => {
        return {
          onClick: () => {
            handleRowClick(record);
          },
          className: 'cursor-pointer',
        };
      },
      render: (name: any, row: any) => (
        <span className="whitespace-nowrap cursor-pointer">
          {row.contact.name}
        </span>
      ),
    },
    {
      title: t('table:table-item-date'),
      className: 'cursor-pointer',
      dataIndex: 'transaction_date',
      key: 'name',
      align: alignLeft,
      width: 150,
      onCell: (record, index) => {
        return {
          onClick: () => {
            handleRowClick(record);
          },
          className: 'cursor-pointer',
        };
      },
      render: (transaction_date: any, row: any) => (
        <span className="whitespace-nowrap cursor-pointer">
          {transaction_date}
        </span>
      ),
    },
    {
      title: t('table:table-item-invoice-no'),
      className: 'cursor-pointer',
      dataIndex: 'invoice_no',
      key: 'name',
      width: 200,
      align: alignRight,
      onCell: (record, index) => {
        return {
          onClick: () => {
            handleRowClick(record);
          },
          className: 'cursor-pointer',
        };
      },
      render: function Render(id: any, row: any) {
        let neww = row.sell_lines.map((a) => a.quantity_returned > 0);
        return (
          <div className="flex justify between cursor-pointer">
            <span className="whitespace-nowrap">{row.invoice_no}</span>
            <span className="pt-1 pl-2">
              {' '}
              {neww.includes(true) && <IoReload width={10} height={10} />}
            </span>
          </div>
        );
      },
    },
    {
      title: t('table:table-item-payment-status'),
      className: 'cursor-pointer',
      dataIndex: 'payment_status',
      key: 'name',
      align: 'center',
      width: 120,
      onCell: (record, index) => {
        return {
          onClick: () => {
            handleRowClick(record);
          },
          className: 'cursor-pointer',
        };
      },
      render: (payment_status: any, row: any) =>
        // <span className="whitespace-nowrap">{payment_status}</span>
        payment_status && (
          <div className="cursor-pointer">
            <Badge
              text={payment_status}
              color={
                payment_status == 'paid'
                  ? 'bg-accent'
                  : payment_status == 'due'
                  ? 'bg-yellow-400'
                  : 'bg-fuchsia-700'
              }
            />
          </div>
        ),
    },
    {
      title: t('table:table-item-payment-method'),
      className: 'cursor-pointer',
      dataIndex: 'payment_lines',
      key: 'name',
      align: 'center',
      width: 120,
      onCell: (record, index) => {
        return {
          onClick: () => {
            handleRowClick(record);
          },
          className: 'cursor-pointer',
        };
      },
      render: (row: any) => (
        <span className="whitespace-nowrap cursor-pointer">
          {row?.[0]?.method && row?.[0]?.method}
        </span>
      ),
    },
    {
      title: t('table:table-item-total-amount'),
      className: 'cursor-pointer',
      dataIndex: 'final_total',
      key: 'name',
      align: alignRight,
      width: 120,
      onCell: (record, index) => {
        return {
          onClick: () => {
            handleRowClick(record);
          },
          className: 'cursor-pointer',
        };
      },
      render: (final_total: any, row: any) => (
        <span className="whitespace-nowrap cursor-pointer">
          {final_total &&
            list.BusinesDetails.symbol + Number(final_total).toLocaleString()}
        </span>
      ),
    },
    {
      title: t('table:table-item-total-paid'),
      className: 'cursor-pointer',
      dataIndex: 'payment_lines',
      key: 'name',
      align: alignRight,
      width: 120,
      onCell: (record, index) => {
        return {
          onClick: () => {
            handleRowClick(record);
          },
          className: 'cursor-pointer',
        };
      },
      render: (row: any) => (
        <span className="whitespace-nowrap cursor-pointer">
          {row?.[0]?.amount &&
            list.BusinesDetails.symbol +
              Number(row?.[0]?.amount).toLocaleString()}
        </span>
      ),
    },
    {
      title: t('table:table-item-shipping-status'),
      className: 'cursor-pointer',
      dataIndex: 'shipping_status',
      key: 'name',
      align: 'center',
      width: 120,
      onCell: (record, index) => {
        return {
          onClick: () => {
            handleRowClick(record);
          },
          className: 'cursor-pointer',
        };
      },
      render: (shipping_status: any, row: any) =>
        shipping_status && (
          <div className="cursor-pointer">
            <Badge
              text={shipping_status}
              color={
                shipping_status == 'Completed' ? 'bg-accent' : 'bg-yellow-400'
              }
            />
          </div>
        ),
    },
    {
      title: t('form:order-source'),
      className: 'cursor-pointer',
      dataIndex: 'order_source',
      key: 'name',
      align: 'center',
      width: 120,
      onCell: (record, index) => {
        return {
          onClick: () => {
            handleRowClick(record);
          },
          className: 'cursor-pointer',
        };
      },
      render: (sell_due: any, row: any) => (
        <span className="whitespace-nowrap cursor-pointer">{sell_due}</span>
      ),
    },
    {
      title: t('table:table-item-total-item'),
      className: 'cursor-pointer',
      dataIndex: 'sell_due',
      key: 'name',
      align: 'center',
      width: 120,
      onCell: (record, index) => {
        return {
          onClick: () => {
            handleRowClick(record);
          },
          className: 'cursor-pointer',
        };
      },
      render: (sell_due: any, row: any) => (
        <span className="whitespace-nowrap cursor-pointer">
          {row.sell_lines.length}
        </span>
      ),
    },
    {
      title: t('table:table-item-status'),
      className: 'cursor-pointer',
      dataIndex: 'status',
      key: 'name',
      align: 'center',
      width: 120,
      onCell: (record, index) => {
        return {
          onClick: () => {
            handleRowClick(record);
          },
          className: 'cursor-pointer',
        };
      },
      render: (status: any, row: any) => (
        <span className="whitespace-nowrap cursor-pointer">{status}</span>
      ),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'id',
      align: alignRight,
      width: 200,
      render: function Render(id: any, row: any) {
        let share_url;
        function onShareModel() {
          let token = row?.invoice_token;
          let obJData = {
            url: site_url + '/invoice/' + token,
          };
          ShareOrder(obJData).then((res) => {
            setCloseDialog(true);
            if (res?.short) {
              setCloseDialog(false);
              share_url = res?.short;
              setShareURL(res?.short);
              setModel(true);
            }
          });
        }

        function onPrintClick() {
          let token = row?.invoice_token;
          let obJData = {
            url: site_url + '/invoice/' + token,
          };
          ShareOrder(obJData).then((res) => {
            setCloseDialog(true);
            if (res?.short) {
              window.open(res?.short, '_blank');
            }
          });
        }

        return (
          <div>
            <Menu
              style={{ width: 160 }}
              as="div"
              className="relative inline-block text-left"
            >
              <div>
                <Menu.Button className="inline-flex w-full justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-light text-white hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                {t('form:action')}
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
                  <div className="px-1 py-1 ">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href={`../order/${row.id}`}
                          className={`${
                            active ? 'bg-accent text-white' : 'text-gray-900'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-white`}
                        >
                        {t('form:veiw')}
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          passHref
                          href={`/sales/invoices/${row.id}`}
                          className={`${
                            active ? 'bg-accent text-white' : 'text-gray-900'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-white`}
                        >
                         {t('form:sell-return')}
                        </Link>
                      )}
                    </Menu.Item>
                    {row?.status == 'draft' && (
                      <Menu.Item>
                        <LanguageSwitcher
                          isProductList={false}
                          slug={id}
                          record={row}
                          deleteModalView="DELETE_TYPE"
                          routes={Routes?.editInvoice}
                          isUpdate={list.isUpdate}
                          isView={list.isView}
                          editText={true}
                        />
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={onShareModel}
                          className={`${
                            active ? 'bg-accent text-white' : 'text-gray-900'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-white`}
                        >
                        {t('form:share')}
                          {closeDialog && (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-t-2 border-transparent ms-2" />
                          )}
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={onPrintClick}
                          // href={ShareURL}
                          className={`${
                            active ? ' text-white' : 'text-gray-900'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-white`}
                        >
                        {t('form:print-invoice')}
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        );
      },
    },
  ];

  const lastItemIndex = currentPage * listPerPage;
  const firstItemIndex = lastItemIndex - listPerPage;
  const currentList = list?.list?.slice(firstItemIndex, lastItemIndex);

  const tableProps: any = {
    columns: columns,
    emptyText: t('table:empty-table-data'),
    data: currentList,
    rowKey: 'id',
    scroll: { x: 380 },
    // onRow: (record, index) => {
    //   return {
    //     className: 'cursor-pointer',
    //   };
    // },
  };

  return (
    <>
      <div className="mb-8 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          {...tableProps}
        />
      </div>

      <Drawer open={model} onClose={closeFunction} variant="right">
        <DrawerWrapper onClose={closeFunction} hideTopBar={false}>
          <div className="m-auto rounded bg-light sm:w-[28rem]">
            <Card className="mt-4">
              <Label className="mb-0">Copy Link</Label>
              <div className="flex w-full">
                <Input
                  name="credit_limit"
                  variant="outline"
                  className="w-full"
                  value={ShareURL}
                  disabled
                />
                <Button onClick={setCopied} className="mt-3">
                  {isCopied ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </Card>
          </div>
        </DrawerWrapper>
      </Drawer>

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
