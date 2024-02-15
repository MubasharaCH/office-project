import { Table } from '@/components/ui/table';
import { BrandList } from '@/types';
import { useTranslation } from 'next-i18next';
import { Fragment, useEffect, useRef, useState } from 'react';
import Pagination from '@/components/ui/pagination';
import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';
import { useRouter } from 'next/router';
import ActionButtons from '../common/action-buttons';
import Loader from '../ui/loader/loader';
import { Menu, Transition } from '@headlessui/react';
import { useIsRTL } from '@/utils/locals';
import { AddingSellFunction, GetFunction, site_url } from '@/services/Service';
import Drawer from '../ui/drawer';
import DrawerWrapper from '../ui/drawer-wrapper';
import Input from '../ui/input';
import Button from '../ui/button';
import Card from '../common/card';
import Label from '../ui/label';
import moment from 'moment';
import Modal from '../ui/modal/modal';
import { Calendar } from 'react-date-range';
import Select from '../ui/select/select';
import TextArea from '../ui/text-area';
import { toast } from 'react-toastify';

export type IProps = {
  listOfBrands: BrandList[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const TypeList = (list: any) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(10);
  const [discountModal, setdiscountModal] = useState(false);
  const router = useRouter();
  const { alignLeft, alignRight } = useIsRTL();
  const inputRef = useRef<HTMLInputElement>(null);
  const [showCalander, setShowCalander] = useState(false);
  const [date, setDate] = useState<any>('');
  const [ammountVal, setAmmountVal] = useState<any>();
  const [locationDataArray, setLocationDataArray] = useState([]);
  const [LoocationId, setLoocationId] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [paymentNotes, setPaymentNotes] = useState<any>('');
  const [payloader, setPayloader] = useState(false);
  const [transactionId, setTransactionId] = useState<any>();

  useEffect(() => {
    GetFunction('/business-location/' + LoocationId).then((result) => {
      let ordersData = result?.data[0]?.payment_methods?.map((data, i) => {
        return {
          key: i,
          id: data.id,
          value: data.name,
          label: data.label,
        };
      });

      // Filter out credit notes
      ordersData = ordersData?.filter(
        (order) => order.label !== 'Credit Notes'
      );
      ordersData = ordersData?.filter((order) => order.label !== 'On Account');
      setLocationDataArray(ordersData);
    });
  }, [LoocationId]);

  const onPaymentClick = (row) => {
    setdiscountModal(true);

    const amounts = row.payment_lines.reduce((sum, line) => {
      return sum + parseFloat(line.amount);
  }, 0);
    setLoocationId(row.location_id);
    setAmmountVal(row.final_total - amounts);
    setTransactionId(row.id);
  };

  const columns = [
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-actions')}
        </span>
      ),
      dataIndex: 'id',
      key: 'id',
      align: alignLeft,
      width: 200,
      render: function Render(id: any, row: any) {
        function onPrintClick() {
          window.open(site_url + 'sell-return-invoice/print/' + row.id);
        }
        return (
          <div style={{ fontFamily: 'poppins' }}>
            <Menu
              style={{ width: 160 }}
              as="div"
              className="relative inline-block text-left"
            >
              <div>
                <Menu.Button className="inline-flex w-24 justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-light text-white hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                  {t('table:table-item-colum-action')}
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
                          href={`${router.asPath}/${row.id}`}
                          className={`${active ? 'bg-accent text-white' : 'text-gray-900'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-white`}
                        >
                          {t('table:table-item-view')}
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={onPrintClick}
                          // href={ShareURL}
                          className={`${active ? ' text-white' : 'text-gray-900'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-white`}
                        >
                          {t('Print Credit Note')}
                        </button>
                      )}
                    </Menu.Item>
                    {row.payment_status !== "paid" && (


                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => onPaymentClick(row)}
                            // href={ShareURL}
                            className={`${active ? ' text-white' : 'text-gray-900'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-white`}
                          >
                            {t('Pay credit note')}
                          </button>
                        )}
                      </Menu.Item>)}
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
          {t('table:table-item-customer-name')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'contact',
      key: 'name',
      align: 'center',
      render: (contact: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {contact.name}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-parent-sale')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'return_parent_sell',
      key: 'id',
      align: 'center',
      render: (row: any) => (
        <Link passHref href={`/sales/invoice/${row?.id}`}>
          <span
            style={{ color: 'blue', cursor: 'pointer', fontFamily: 'poppins' }}
            className="whitespace-nowrap"
          >
            {row?.invoice_no}
          </span>
        </Link>
      ),
    },

    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-credit-note-no')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'invoice_no',
      key: 'name',
      align: 'center',
      render: (invoice_no: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {invoice_no}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-date')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'transaction_date',
      key: 'name',
      align: 'center',
      render: (transaction_date: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {transaction_date}
        </span>
      ),
    },

    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-total-amount')}
        </span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'final_total',
      key: 'name',
      align: 'center',
      render: (final_total: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {list.BusinesDetails.symbol + Number(final_total).toFixed(2)}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>{t('Payment Status')}</span>
      ),
      className: 'cursor-pointer',
      dataIndex: 'payment_status',
      key: 'name',
      align: 'center',
      render: (payment_status: any) => (
        <span className="whitespace-nowrap" style={{ fontFamily: 'poppins' }}>
          {payment_status}
        </span>
      ),
    },

    // {
    //   title: (
    //     <span style={{ fontFamily: 'poppins' }}>
    //       {t('table:table-item-actions')}
    //     </span>
    //   ),
    //   className: 'cursor-pointer',
    //   dataIndex: 'id',
    //   key: 'name',
    //   align: 'center',
    //   render: (slug: any) => (
    //     <ActionButtons
    //       id={slug}
    //       detailsUrl={`/sales/creditNotes/${slug}`}
    //       isView={true}
    //     />
    //   ),
    // },
  ];
  const onhowCalannder = () => {
    setShowCalander(!showCalander);
  };

  useEffect(() => {
    let aa = moment(new Date(), 'MM/DD/YYYY HH:mm').format('MM/DD/YYYY HH:mm');
    setDate(aa);
  }, []);

  const handleSelect = (date) => {
    let aa = moment(date, 'MM/DD/YYYY HH:mm').format('MM/DD/YYYY HH:mm');
    setDate(aa); // native Date object
    setShowCalander(false);
  };

  const onCustomAmountChange = (e) => {
    setAmmountVal(e.target.value);
  };

  const onSelectPayment = (e) => {
    setSelectedMethod(e.value);
  };

  const onChangePaymentNotes = (e) => {
    setPaymentNotes(e.target.value);
  };

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

  const onPayClick = () => {
    if (ammountVal.length == 0 || selectedMethod.length == 0) {
      toast.error('Requried field is missing');
      return;
    }

    setPayloader(true);

    let formData = {
      transaction_id: transactionId,
      amount: ammountVal,
      paid_on: date,
      method: selectedMethod,
      note: paymentNotes,
    };
    AddingSellFunction('/add-invoive-payment', formData).then((result) => {
      if (result.success) {
        toast.success(result.message);
        setPayloader(false);
        setdiscountModal(false);
        router.reload();
      } else {
        toast.error(result.message);
        setPayloader(false);
        setdiscountModal(false);
      }
    });
  };

  if (list.loading) return <Loader text={t('common:text-loading')} />;

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
      <Modal open={showCalander} onClose={() => setShowCalander(true)}>
        {showCalander && (
          <div>
            <Calendar className="postion-absolute" onChange={handleSelect} />
          </div>
        )}
      </Modal>
      <Drawer
        open={discountModal}
        onClose={() => setdiscountModal(true)}
        variant="right"
      >
        <DrawerWrapper
          onClose={() => setdiscountModal(false)}
          hideTopBar={false}
        >
          <Card className="mt-4">
            <div>
              <div onClick={onhowCalannder} ref={inputRef}>
                <Label className="float-left mb-3">Date*</Label>
                <Input
                  name="credit_limit"
                  variant="outline"
                  className="mb-4"
                  value={date}
                />
              </div>
            </div>

            <div className="">
              <Label className="float-left mb-3">Amount*</Label>
              <Input
                value={ammountVal}
                name="credit_limit"
                variant="outline"
                className="w-full"
                onChange={onCustomAmountChange}
              />
            </div>

            <div className="mt-5 w-full">
              <Label className="">Select Payment*</Label>
              <Select
                className="w-full"
                options={locationDataArray}
                onChange={onSelectPayment}
              />
            </div>

            <div className="mt-5">
              <Label className="float-left "> Payment Note</Label>
              <TextArea
                onChange={onChangePaymentNotes}
                value={paymentNotes}
                name={''}
              />
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setdiscountModal(false)}
                className="rounded-md border p-2"
              >
                {t('form:form-button-close')}
              </button>
              <Button loading={payloader} onClick={onPayClick} className="mt-3">
                Pay
              </Button>
            </div>
          </Card>
        </DrawerWrapper>
      </Drawer>
    </>
  );
};

export default TypeList;
