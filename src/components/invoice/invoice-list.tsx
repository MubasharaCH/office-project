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
import { AddingSellFunction, ShareOrder, site_url } from '@/services/Service';
import makeRequest from '@/services/test';
import useClipboard from 'react-use-clipboard';
import { Routes } from '@/config/routes';
import { DateRange } from 'react-date-range';
import { Calendar } from 'react-date-range';

import { IoReload } from 'react-icons/io5';
import {
  GetFunction,
  GetFunctionBDetail,
  AddShipping,
} from '@/services/Service';
import { useEffect, useRef } from 'react';
import React from 'react';
import { toast } from 'react-toastify';
import Modal from '../ui/modal/modal';
import { MdOutlineLocalShipping } from 'react-icons/md';
import { FaShippingFast } from 'react-icons/fa';
import { toLower } from 'lodash';
import { FiCopy } from 'react-icons/fi';
import TextArea from '../ui/text-area';
import moment from 'moment';
import { selectStyles } from '../ui/select/select.styles';

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
  const [shipModal, setShipModal] = useState(false);
  const [doneBtnLoading, setDoneBtnLoading] = useState(false);
  const [rowData, setRowData] = useState('');
  const [deliveryStatusDiv, setDeliveryStatusDiv] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isInvoicing, setIsInvoicing] = useState<any>(list.isInvoice);
  const [shipLooader, setShipLooader] = useState(false);
  const [payloader, setPayloader] = useState(false);
  const [shipLooaderReject, setShipLooaderReject] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [locationDataArray, setLocationDataArray] = useState([]);
  const [trackingInfo, setTrackingInfo] = useState('');
  const [LoocationId, setLoocationId] = useState(0);
  const [customerID, setCustmerId] = useState('');
  const [showCalander, setShowCalander] = useState(false);
  const [providerStatus, setProviderStatus] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [date, setDate] = useState<any>('');
  const [ammountVal, setAmmountVal] = useState<any>();
  const [transactionId, setTransactionId] = useState<any>();
  const [paymentNotes, setPaymentNotes] = useState<any>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [listofCredits, setListofCredits] = useState<any>(false);
  const [creditNotesArray, setCreditNotesArray] = React.useState<any>([]);
  const [amountid, setAmountid] = useState<any>('');

  const onReloadClick = () => {
    router.push('/sales/creditNotes');
  };

  const onShipClose = () => {
    setShipModal(false);
    setDeliveryStatusDiv(false);
  };

  const {
    query: { shop },
  } = useRouter();

  let actionArray = [
    { label: 'one', key: 'one' },
    { label: 'two', key: 'two' },
  ];
  const providerStatuses = {
    xero: false, // Default status for Xero is false
    quickbooks: false, // Default status for QuickBooks is false
    // Add more providers and their default statuses as needed
  };

  useEffect(() => {
    let aa = moment(new Date(), 'MM/DD/YYYY HH:mm').format('MM/DD/YYYY HH:mm');
    setDate(aa);
  }, []);
  list?.integrations?.forEach((item) => {
    const { provider, status } = item;
    if (provider in providerStatuses && status === 1) {
      providerStatuses[provider] = true;
    }
  });

  const closeFunction = () => {
    setModel(false);
  };

  const handleRowClick = (record) => {
    router.push(`${router.asPath}/${record.id}`);
  };

  const onTrackingInfoChange = (e) => {
    setTrackingInfo(e.target.value);
  };

  useEffect(() => {
    GetFunction(
      '/list-sell-return?order_by=asc&per_page=-1&contact_id=' + customerID
    ).then((result) => {
      let businessDetails: any = localStorage.getItem('business_details');
      let con = JSON.parse(businessDetails);
      if (result?.data) {
        // Filter and map the data within the if block
        let ordersData = result.data
          .filter((data) => data.payment_status === 'due')
          .map((data, i) => ({
            key: i,
            id: data.id,
            value: Number(data.final_total).toFixed(),
            label:
              data.id +
              ' (' +
              con.symbol +
              Number(data.final_total).toFixed() +
              ')',
          }));
        setCreditNotesArray(ordersData);
      }
    });
  }, [customerID]);

  const OnChangeCreditPayment = (e) => {
    setAmmountVal(e.value);
    setAmountid(e.id);
  };

  const apiCallingFunction = (row) => {
    setShipLooader(true);
    let status = '';
    if (
      toLower(row.shipping_status) == toLower('pending') &&
      toLower(row.order_type) == toLower('Pickup')
    ) {
      status = 'Accepted';
    } else if (
      toLower(row.shipping_status) == toLower('Accepted') &&
      toLower(row.order_type) == toLower('Pickup')
    ) {
      status = 'Ready';
    } else if (
      toLower(row.shipping_status) == toLower('Ready') &&
      toLower(row.order_type) == toLower('Pickup')
    ) {
      status = 'Completed';
    } else if (
      toLower(row.shipping_status) == toLower('pending') &&
      toLower(row.order_type) == toLower('Delivery')
    ) {
      status = 'Accepted';
    } else if (
      toLower(row.shipping_status) == toLower('Accepted') &&
      toLower(row.order_type) == toLower('Delivery')
    ) {
      status = 'Shipped';
    } else if (
      toLower(row.shipping_status) == toLower('Shipped') &&
      toLower(row.order_type) == toLower('Delivery')
    ) {
      status = 'Completed';
    }

    let obj: any = {
      id: row?.id,
      shipping_status: status,
    };

    if (trackingInfo) {
      obj['shipping_tracking_id'] = trackingInfo;
      obj['shipping_type'] = row.order_type;
    }

    AddShipping('/update-shipping-status', obj).then((result) => {
      if (result.success == 1) {
        toast.success(result.msg);
        router.reload();
        setShipLooader(false);
        setDoneBtnLoading(false);
      } else {
        toast.error(result.msg);
        setShipLooader(false);
        setDoneBtnLoading(false);
      }
    });
  };
  const apiCallingFunctionReject = (row) => {
    setShipLooaderReject(true);
    let status = '';

    if (
      toLower(row.shipping_status) == toLower('pending') &&
      toLower(row.order_type) == toLower('Pickup')
    ) {
      status = 'Rejected';
    } else if (
      toLower(row.shipping_status) == toLower('Accepted') &&
      toLower(row.order_type) == toLower('Pickup')
    ) {
      status = 'Cancelled';
    } else if (
      toLower(row.shipping_status) == toLower('Ready') &&
      toLower(row.order_type) == toLower('Pickup')
    ) {
      status = 'Failed';
    } else if (
      toLower(row.shipping_status) == toLower('pending') &&
      toLower(row.order_type) == toLower('Delivery')
    ) {
      status = 'Rejected';
    } else if (
      toLower(row.shipping_status) == toLower('Accepted') &&
      toLower(row.order_type) == toLower('Delivery')
    ) {
      status = 'Cancelled';
    } else if (
      toLower(row.shipping_status) == toLower('Shipped') &&
      toLower(row.order_type) == toLower('Delivery')
    ) {
      status = 'Failed';
    }

    let obj: any = {
      id: row.id,
      shipping_status: status,
    };

    if (trackingInfo) {
      obj['shipping_tracking_id'] = trackingInfo;
      obj['shipping_type'] = row.order_type;
    }

    AddShipping('/update-shipping-status', obj).then((result) => {
      if (result.success == 1) {
        toast.success(result.msg);
        router.reload();
        setShipLooader(false);
        setDoneBtnLoading(false);
      } else {
        toast.error(result.msg);
        setShipLooader(false);
        setDoneBtnLoading(false);
      }
    });
  };
  const onDoneClick = () => {
    setDoneBtnLoading(true);
    apiCallingFunction(rowData);
    setShipModal(false);
  };

  const onPaymentClick = (row) => {
    setPaymentModal(true);
    const totalAmount = row.payment_lines.reduce((sum, line) => {
      return sum + parseFloat(line.amount);
    }, 0);

    setLoocationId(row.location_id);
    const totleAmount1 =
      parseFloat(row.final_total) + parseFloat(row?.shipping_charges);
    setAmmountVal(totleAmount1 - totalAmount);
    setCustmerId(row.contact.id);
    setTransactionId(row.id);
  };

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

      setLocationDataArray(ordersData);
    });
  }, [LoocationId]);

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
      cn_transaction_id: amountid,
    };
    AddingSellFunction('/add-invoive-payment', formData).then((result) => {
      if (result.success) {
        toast.success(result.message);
        setPayloader(false);
        setPaymentModal(false);
        router.reload();
      } else {
        toast.error(result.message);
        setPayloader(false);
        setPaymentModal(false);
      }
    });
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
        let share_url;
        function onShareModel() {
          let token = row?.invoice_token;
          let obJData = {
            url: site_url + 'invoice/' + token,
          };
          ShareOrder(obJData).then((res) => {
            setCloseDialog(true);
            if (res?.short) {
              setCloseDialog(false);
              share_url = res?.short;
              setShareURL(res?.short + '?wm=0');
              setModel(true);
            }
          });
        }

        function onPrintClick() {
          let token = row?.invoice_token;
          let obJData = {
            url: site_url + 'invoice/' + token,
          };
          makeRequest(site_url + 'invoice/' + token).then((res) => {
            setCloseDialog(true);
            if (res?.short) {
              window.open(res?.short + '?wm=1', '_blank');
            }
          });
        }
        function onClickZatca() {
          const url = site_url + `pdf/${row.invoice_uuid}/${row.file_name}`;

          // const url = `/sales/invoices/${row.id}`;
          window.open(url, '_blank'); // Open the URL in a new tab
        }
        function onClickXmlUrl() {
          var originalFileName = row.file_name;

          // Replace '.pdf' with '.xml'
          var newFileName = originalFileName.replace('.pdf', '.xml');

          const url = site_url + `xml/${newFileName}`;

          fetch(url)
            .then((response) => response.blob())
            .then((blob) => {
              // Create a temporary <a> element to trigger the download
              const a = document.createElement('a');
              a.style.display = 'none';
              document.body.appendChild(a);

              const url = window.URL.createObjectURL(blob);
              a.href = url;
              a.download = newFileName;

              // Trigger a click event on the <a> element
              a.click();

              // Clean up
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        }

        function onPushOrder() {
          const data = {
            transaction_id: row?.id,
            business_id: row.business_id,
          };

          AddShipping('/sync-order-to-flextock', data).then((result) => {
            if (result.success) {
              toast.success(result.message);
              router.reload();
            } else {
              toast.error(result.message);
            }
          });
        }
        function onPushXeroOrder() {
          const data = {
            transaction_id: row?.id,
            business_id: row.business_id,
          };

          AddShipping('/create-xero-invoice', data).then((result) => {
            console.log('result', result);
            if (result.success) {
              toast.success(result.message);
              router.reload();
            } else {
              toast.error(result.message);
            }
          });
        }

        function onIgniteShip() {
          setRowData(row);
          if (
            toLower(row.shipping_status) == toLower('Accepted') &&
            toLower(row.order_type) == toLower('Delivery')
          ) {
            setShipModal(true);
          } else {
            apiCallingFunction(row);
          }
        }
        function onIgniteShipReject() {
          setRowData(row);
          apiCallingFunctionReject(row);
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
                          href={`${router.asPath}/${row?.id}`}
                          className={`${
                            active ? 'bg-accent text-white' : 'text-gray-900'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-white`}
                        >
                          {t('table:table-item-view')}
                        </Link>
                      )}
                    </Menu.Item>
                    {row.status == 'final' && (
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            passHref
                            href={`/sales/invoices/${row?.id}`}
                            className={`${
                              active ? 'bg-accent text-white' : 'text-gray-900'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-white`}
                          >
                            {t('table:table-item-sell-return')}
                          </Link>
                        )}
                      </Menu.Item>
                    )}
                    {row?.status == 'final' &&
                      (row?.payment_status == 'due' ||
                        row?.payment_status == 'partial') && (
                        <Menu.Item>
                          {({ active }) => (
                            <div
                              onClick={() => onPaymentClick(row)}
                              className={`${
                                active
                                  ? 'bg-accent text-white'
                                  : 'text-gray-900'
                              } group  flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-white`}
                            >
                              Payment
                            </div>
                          )}
                        </Menu.Item>
                      )}
                    {row?.invoice_uuid && (
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => onClickZatca()}
                            className={`${
                              active ? 'bg-accent text-white' : 'text-gray-900'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-white`}
                          >
                            {t('Zatca Invoice Url')}
                          </button>
                        )}
                      </Menu.Item>
                    )}
                    {/* {row?.invoice_uuid && (
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => onClickXmlUrl()}
                            className={`${active ? 'bg-accent text-white' : 'text-gray-900'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-white`}
                          >
                            {t('Download Xml')}
                          </button>
                        )}
                      </Menu.Item>
                    )} */}
                    {row?.status == 'draft' && (
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            // href={`${router.asPath}/${row.id}/edit`}
                            href={`editInvoice/${row?.id}/edit`}
                            className={`${
                              active ? 'bg-accent text-white' : 'text-gray-900'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-white`}
                          >
                            Edit
                          </Link>
                        )}
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
                          {t('table:table-item-share')}

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
                          {t('table:table-item-printInvoice')}
                        </button>
                      )}
                    </Menu.Item>
                    {row?.status == 'final' &&
                      row?.sync_status == '0' &&
                      list.enableFlextock &&
                      list.enableFlextock?.enable == 1 && (
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={onPushOrder}
                              // href={ShareURL}
                              className={`${
                                active ? ' text-white' : 'text-gray-900'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-white`}
                            >
                              {t('table:table-item-push-flextock')}
                            </button>
                          )}
                        </Menu.Item>
                      )}
                    {row?.status == 'final' &&
                      row?.xero_status == '0' &&
                      providerStatuses?.xero == true && (
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={onPushXeroOrder}
                              // href={ShareURL}
                              className={`${
                                active ? ' text-white' : 'text-gray-900'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-white`}
                            >
                              {t('table:table-item-push-xero')}
                            </button>
                          )}
                        </Menu.Item>
                      )}
                    {/* <>
                      {toLower(row.shipping_status) == toLower('Completed') ||
                      toLower(row.shipping_status) == toLower('Rejected') ||
                      toLower(row.shipping_status) == toLower('Cancelled') ||
                      toLower(row.shipping_status) == toLower('Failed') ||
                      toLower(row.shipping_status) == null ? (
                        ''
                      ) : (
                        <Menu.Item>
                          {({ active }) => (
                            <>
                              {shipLooader ? (
                                <div className="text-center">
                                  <div role="status">
                                    <svg
                                      aria-hidden="true"
                                      className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                      viewBox="0 0 100 101"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                      />
                                      <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                      />
                                    </svg>
                                    <span className="sr-only">Loading...</span>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={onIgniteShip}
                                  className={`${
                                    active ? ' text-white' : 'text-gray-900'
                                  } group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-white`}
                                >
                                  <span>
                                    {toLower(row.shipping_status) ==
                                      toLower('pending') &&
                                      toLower(row.order_type) ==
                                        toLower('Pickup') &&
                                      'Accept Order'}
                                    {toLower(row.shipping_status) ==
                                      toLower('Accepted') &&
                                      toLower(row.order_type) ==
                                        toLower('Pickup') &&
                                      'Ready'}
                                    {toLower(row.shipping_status) ==
                                      toLower('Ready') &&
                                      toLower(row.order_type) ==
                                        toLower('Pickup') &&
                                      'Picked Up'}
                                    {toLower(row.shipping_status) ==
                                      toLower('pending') &&
                                      toLower(row.order_type) ==
                                        toLower('Delivery') &&
                                      'Accept Order'}
                                    {toLower(row.shipping_status) ==
                                      toLower('Accepted') &&
                                      toLower(row.order_type) ==
                                        toLower('Delivery') &&
                                      'Shipped'}
                                    {toLower(row.shipping_status) ==
                                      toLower('Shipped') &&
                                      toLower(row.order_type) ==
                                        toLower('Delivery') &&
                                      'Delivered'}
                                  </span>
                                </button>
                              )}
                            </>
                          )}
                        </Menu.Item>
                      )}
                      {toLower(row.shipping_status) == toLower('Completed') ||
                      toLower(row.shipping_status) == toLower('Rejected') ||
                      toLower(row.shipping_status) == toLower('Cancelled') ||
                      toLower(row.shipping_status) == toLower('Failed') ||
                      toLower(row.shipping_status) == null ? (
                        ''
                      ) : (
                        <Menu.Item>
                          {({ active }) => (
                            <>
                              {shipLooaderReject ? (
                                <div className="text-center">
                                  <div role="status">
                                    <svg
                                      aria-hidden="true"
                                      className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                      viewBox="0 0 100 101"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                      />
                                      <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                      />
                                    </svg>
                                    <span className="sr-only">Loading...</span>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={onIgniteShipReject}
                                  className={`${
                                    active ? ' text-white' : 'text-gray-900'
                                  } group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-white`}
                                >
                                  <span>
                                    {toLower(row.shipping_status) ==
                                      toLower('pending') &&
                                      toLower(row.order_type) ==
                                        toLower('Pickup') &&
                                      'Rejecte Order'}
                                    {toLower(row.shipping_status) ==
                                      toLower('Accepted') &&
                                      toLower(row.order_type) ==
                                        toLower('Pickup') &&
                                      'Cancel'}
                                    {toLower(row.shipping_status) ==
                                      toLower('Ready') &&
                                      toLower(row.order_type) ==
                                        toLower('Pickup') &&
                                      'Failed'}
                                    {toLower(row.shipping_status) ==
                                      toLower('pending') &&
                                      toLower(row.order_type) ==
                                        toLower('Delivery') &&
                                      'Rejecte Order'}
                                    {toLower(row.shipping_status) ==
                                      toLower('Accepted') &&
                                      toLower(row.order_type) ==
                                        toLower('Delivery') &&
                                      'Cancel'}
                                    {toLower(row.shipping_status) ==
                                      toLower('Shipped') &&
                                      toLower(row.order_type) ==
                                        toLower('Delivery') &&
                                      'Failed'}
                                  </span>
                                </button>
                              )}
                            </>
                          )}
                        </Menu.Item>
                      )}
                    </> */}
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
        <span
          className="cursor-pointer whitespace-nowrap"
          style={{ fontFamily: 'poppins' }}
        >
          {row.contact.name}
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
        <span
          className="cursor-pointer whitespace-nowrap"
          style={{ fontFamily: 'poppins' }}
        >
          {transaction_date}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-invoice-no')}
        </span>
      ),
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
          <div
            className="justify between flex cursor-pointer"
            style={{ fontFamily: 'poppins' }}
          >
            <span className="whitespace-nowrap">{row.invoice_no}</span>
            <span className="pt-1 pl-2">
              {' '}
              {neww.includes(true) && (
                <IoReload
                  className="bg-white hover:bg-white"
                  onClick={onReloadClick}
                  width={10}
                  height={10}
                />
              )}
            </span>
          </div>
        );
      },
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-payment-status')}
        </span>
      ),
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
        payment_status && (
          <div className="cursor-pointer" style={{ fontFamily: 'poppins' }}>
            <Badge
              text={payment_status}
              className={`bg-${
                payment_status === 'paid'
                  ? 'green-400'
                  : payment_status === 'due'
                  ? 'orange-500'
                  : 'blackd'
              }`}
            />
          </div>
        ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-payment-method')}
        </span>
      ),
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
      // render: (row: any) => (
      //   <span
      //     className="cursor-pointer whitespace-nowrap"
      //     style={{ fontFamily: 'poppins' }}
      //   >
      //     {row?.length > 1 ? 'multiple' : row?.[0]?.method}
      //   </span>
      // ),
      render: (row: any) => {
        const filteredData = row.filter((item) => item.is_return !== 1);

        // Check if the length is greater than 1
        const resultText =
          filteredData.length > 1 ? 'multiple' : row?.[0]?.method;
        return (
          <span
            className="cursor-pointer whitespace-nowrap"
            style={{ fontFamily: 'poppins' }}
          >
            {resultText}
          </span>
        );
      },
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-total-amount')}{' '}
        </span>
      ),
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
        <span
          className="cursor-pointer whitespace-nowrap"
          style={{ fontFamily: 'poppins' }}
        >
          {final_total &&
            list.BusinesDetails.symbol + Number(final_total).toLocaleString()}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-total-paid')}
        </span>
      ),
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
      render: (payment_lines: any, row: any) => (
        <span
          className="cursor-pointer whitespace-nowrap"
          style={{ fontFamily: 'poppins' }}
        >
          {list.BusinesDetails.symbol +
            (Number(row?.final_total) + Number(row?.shipping_charges))}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-shipping-status')}
        </span>
      ),
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
          <div className="cursor-pointer" style={{ fontFamily: 'poppins' }}>
            <Badge
              text={shipping_status}
              className={`bg-${
                shipping_status === 'Completed'
                  ? 'blue-500'
                  : shipping_status === 'pending'
                  ? 'yellow-500'
                  : shipping_status === 'Rejected'
                  ? 'red-400'
                  : shipping_status === 'Accepted'
                  ? 'green-400'
                  : shipping_status === 'Cancelled'
                  ? 'gray-400'
                  : shipping_status === 'Ready'
                  ? 'indigo-500'
                  : shipping_status === 'Shipped'
                  ? 'indigo-600'
                  : shipping_status === 'Failed'
                  ? 'red-600'
                  : shipping_status === 'Awaiting pickup'
                  ? 'yellow-500'
                  : 'black'
              }`}
            />
          </div>
        ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-order-source')}
        </span>
      ),
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
        <span
          className="cursor-pointer whitespace-nowrap"
          style={{ fontFamily: 'poppins' }}
        >
          {sell_due}
        </span>
      ),
    },
    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-total-item')}
        </span>
      ),
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
        <span
          className="cursor-pointer whitespace-nowrap"
          style={{ fontFamily: 'poppins' }}
        >
          {row.sell_lines.length}
        </span>
      ),
    },

    {
      title: (
        <span style={{ fontFamily: 'poppins' }}>
          {t('table:table-item-status')}
        </span>
      ),
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
        <span
          className="cursor-pointer whitespace-nowrap"
          style={{ fontFamily: 'poppins' }}
        >
          <Badge
            text={status}
            color={status == 'final' ? 'bg-blue-500' : 'bg-yellow-500'}
          />
        </span>
      ),
    },
    ...(isInvoicing
      ? [
          {
            title: (
              <span style={{ fontFamily: 'poppins' }}>
                {t('table:table-item-zatca-status')}
              </span>
            ),
            className: 'cursor-pointer',
            dataIndex: 'einvoicing_status',
            key: 'name',
            align: 'center',
            width: 120,
            // onCell: (einvoicing_status, index) => {
            //   return {
            //     onClick: () => {
            //       handleRowClick(record);
            //     },
            //     className: 'cursor-pointer',
            //   };
            // },
            render: (einvoicing_status: any, row: any) => {
              const formattedText = einvoicing_status.replace(/_/g, ' ');
              return (
                <span
                  className="cursor-pointer whitespace-nowrap"
                  style={{ fontFamily: 'poppins' }}
                >
                  <Badge
                    text={formattedText}
                    color={
                      formattedText === 'yet to be pushed'
                        ? 'bg-red-400'
                        : formattedText === 'push initiated'
                        ? 'bg-yellow-400'
                        : 'bg-green-400'
                    }
                  />
                </span>
              );
            },
          },
        ]
      : []),
  ];

  const lastItemIndex = currentPage * listPerPage;
  const firstItemIndex = lastItemIndex - listPerPage;
  const currentList = list?.list?.slice(firstItemIndex, lastItemIndex);

  const tableProps: any = {
    columns: columns,
    emptyText: t('table:empty-table-data'),
    data: list?.list,
    rowKey: 'id',
    scroll: { x: 380 },
    // onRow: (record, index) => {
    //   return {
    //     className: 'cursor-pointer',
    //   };
    // },
  };
  const onSelfShipiing = () => {
    setDeliveryStatusDiv(true);
  };
  const handleSelect = (date) => {
    let aa = moment(date, 'MM/DD/YYYY HH:mm').format('MM/DD/YYYY HH:mm');
    setDate(aa); // native Date object
    setShowCalander(false);
  };

  const onhowCalannder = () => {
    setShowCalander(!showCalander);
  };

  const onChangePaymentNotes = (e) => {
    setPaymentNotes(e.target.value);
  };
  const onSelectPayment = (e) => {
    setSelectedMethod(e.value);

    if (e.value == 'credit_note') {
      setListofCredits(true);
    } else {
      setListofCredits(false);
    }
  };

  const onCustomAmountChange = (e) => {
    setAmmountVal(e.target.value);
  };

  if (list.loading) return <Loader text={t('common:text-loading')} />;

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

      <Drawer open={shipModal} onClose={() => setShipModal(true)}>
        <div className="mt-4 p-5">
          {deliveryStatusDiv == false ? (
            <div className="">
              <div className="pb-3">Shipping Method</div>
              <div
                onClick={onSelfShipiing}
                className="flex cursor-pointer rounded bg-gray-300 p-3"
              >
                <MdOutlineLocalShipping className="mt-1 mr-3 h-5 w-5" />
                <span>Self Shipping</span>
              </div>
              <div className="mt-3 flex rounded bg-gray-300 p-3">
                <FaShippingFast className="mt-1 mr-3 h-5 w-5" />
                <span>Ignite Shipping</span>
              </div>
            </div>
          ) : (
            <div>
              <Input
                name=""
                label="Tracking Info"
                onChange={onTrackingInfoChange}
              />
            </div>
          )}
          <div className="mt-8 flex justify-end">
            <button onClick={onShipClose} className="rounded-md border p-2">
              {t('form:form-button-close')}
            </button>
            {deliveryStatusDiv && (
              <Button
                loading={doneBtnLoading}
                onClick={onDoneClick}
                className="ml-2 rounded-md border p-2"
              >
                Done
              </Button>
            )}
          </div>
        </div>
      </Drawer>

      {!!list?.metaData?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={list.metaData.total}
            current={list?.metaData.current_page}
            pageSize={list?.metaData.per_page}
            onChange={list?.paginationChange}
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
      <Drawer open={paymentModal} onClose={() => setPaymentModal(true)}>
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
          {listofCredits && (
            <div className="mt-3">
              <Label>{t('Select Credit note')}</Label>
              <Select
                styles={selectStyles}
                options={creditNotesArray}
                onChange={OnChangeCreditPayment}
              />
            </div>
          )}
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
              onClick={() => setPaymentModal(false)}
              className="rounded-md border p-2"
            >
              {t('form:form-button-close')}
            </button>
            <Button loading={payloader} onClick={onPayClick} className="mt-3">
              Pay
            </Button>
          </div>
        </Card>
      </Drawer>
    </>
  );
};

export default TypeList;
