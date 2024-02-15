import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Image from 'next/image';
import { Table } from '@/components/ui/table';
import ProgressBox from '@/components/ui/progress-box/progress-box';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import ErrorMessage from '@/components/ui/error-message';
import { siteSettings } from '@/settings/site.settings';
import usePrice from '@/utils/use-price';
import { formatAddress } from '@/utils/format-address';
import Loader from '@/components/ui/loader/loader';
import ValidationError from '@/components/ui/form-validation-error';
import { Attachment } from '@/types';
import { useDownloadInvoiceMutation, useOrderQuery } from '@/data/order';
import { useUpdateOrderMutation } from '@/data/order';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SelectInput from '@/components/ui/select-input';
import { useIsRTL } from '@/utils/locals';
import { DownloadIcon } from '@/components/icons/download-icon';
import { useCart } from '@/contexts/quick-cart/cart.context';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { clearCheckoutAtom } from '@/contexts/checkout';
import { useOrderStatusesQuery } from '@/data/order-status';
import { AddShipping, GetFunction, GetFunctionOto } from '@/services/Service';
import DrawerWrapper from '@/components/ui/drawer-wrapper';
import Drawer from '@/components/ui/drawer';
import React from 'react';
import Label from '@/components/ui/label';
import TextArea from '@/components/ui/text-area';
import { toLower, xor } from 'lodash';
import { toast } from 'react-toastify';
import { MdOutlineLocalShipping } from 'react-icons/md';
import { FaShippingFast } from 'react-icons/fa';
import Input from '@/components/ui/input';

import Select from '@/components/ui/select/select';
import defaultImg from '@/assets/images/default.png';

export default function OrderDetailsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { query, locale } = useRouter();
  const { alignLeft, alignRight, isRTL } = useIsRTL();
  const [DataArr, setDataArr] = useState([]);
  const [renderData, setRenderData] = useState<any>('');
  const [renderPaymentData, setRenderPaymentData] = useState([]);
  const [renderActivityData, setRenderActivityData] = useState([]);
  const [deliveryCompany, setDeliveryCompany] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaderApproveIn, setLoaderApproveIn] = useState(false);
  const [currency, setCurrency] = React.useState<any>();
  const [DisVal, setDisVal] = React.useState<any>();
  const [logo, setLogo] = useState<any>('');
  const [BusinessDetail, setBusinessDetail] = useState<any>('');
  const [BusinessData, setBusinessData] = useState<any>('');
  const [businesslocationName, setLocationName] = useState('');
  const [businesslocationId, setLocationId] = useState('');
  const [isYetToPush, setIsYetToPush] = useState(false);
  const [shipLooader, setShipLooader] = useState(false);
  const [shipModal, setShipModal] = useState(false);
  const [deliveryStatusDiv, setDeliveryStatusDiv] = useState(true);
  const [trackingInfoBtn, setTrackingInfoBtn] = useState(false);
  const [igniteShipsSelect, setIgniteShipsSelect] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState('');
  const [doneBtnLoading, setDoneBtnLoading] = useState(false);
  const [doneBtnShipLoading, setDoneBtnShipLoading] = useState(false);
  const [shipLooaderReject, setShipLooaderReject] = useState(false);
  const [permissionData, setPermissionData] = useState([]);
  const [deliveryData, setDeliveryData] = useState<any>('');
  const [errorMesg, setErrorMesg] = useState<any>('');
  const [statusVal, setStatusVal] = useState<any>('');
  const [customFiieldsData, setCustomFiieldsData] = useState<any>('');
  const [updateLoader, setUpdateLoader] = useState(false);
  const [pluginDrawer, setPluginDrawer] = useState<any>(false);
  const [likeCardData, setLikeCardData] = useState<any>('');
  const [subscriptionsDetail, setSubscriptionsDetail] = useState<any>({});
  useEffect(() => {
    let businessDetail: any = localStorage.getItem('user_business_details');
    let logo = JSON.parse(businessDetail);
    if (businessDetail) {
      setSubscriptionsDetail(logo?.subscriptions[0]); //
    }

    setLogo(logo?.logo);
    setBusinessDetail(logo);

    GetFunction(('/sell/' + query.invoiceId) as string).then((result) => {
      if (result.data[0].einvoicing_status === 'yet_to_be_pushed') {
        setIsYetToPush(true);
      }

      setDataArr(result.data[0]?.sell_lines);
      let value: any = 0;
      result.data[0]?.sell_lines.map((res) => {
        let unitValue = res.line_discount_amount;
        value = value + Number(unitValue);
        setDisVal(value);
      });

      setRenderData(result.data[0]);
      GetFunction('/business-location').then((locationResult) => {
        let locationName = locationResult.data.find(
          (x) => x.id == result.data[0].location_id
        );
        setLocationName(locationName?.name);
        setLocationId(locationName?.id);
        setLoading(false);
      });
      setRenderPaymentData(result.data[0]?.payment_lines);
      setRenderActivityData(result.data[0]?.activity_log);
      let obj = {
        transaction_id: result.data[0].id,
      };
      AddShipping('/tryoto/check-oto-fee', obj).then((resultTryto) => {
        if (resultTryto.success) {
          let dataArr = resultTryto.deliveryCompany.map((res, i) => {
            return {
              key: i,
              id: res.deliveryOptionId,
              amount: res.price,
              value: res.deliveryCompanyName,
              label: res.deliveryCompanyName,
            };
          });
          setDeliveryCompany(dataArr);
        } else {
          setErrorMesg(resultTryto.message);
        }
      });
    });
    GetFunction('/business-details').then((result) => {
      setBusinessData(result.data);
      setCustomFiieldsData(result?.data?.custom_labels?.sell);
    });
    GetFunction('/user/loggedin').then((result) => {
      setPermissionData(result?.data?.all_permissions);
      localStorage.setItem('user_detail', JSON.stringify(result.data));
    });
  }, []);

  // const userDetail: any = localStorage.getItem('user_detail');
  // const userData: any = JSON.parse(userDetail);
  // const permissionList = userData?.all_permissions;

  React.useEffect(() => {
    let businessDetails: any = localStorage.getItem('business_details');
    setCurrency(JSON.parse(businessDetails));
  }, []);

  const closeFunctionPluginDrawer = () => {
    setPluginDrawer(false);
    setLikeCardData('');
  };
  const getLikeCardBySellLineId = (id) => {
    const { likecard } = subscriptionsDetail?.package;
    if (likecard === 1) {
      if (subscriptionsDetail?.likecard === 1) {
        GetFunction('/get-likecard-sell-line/' + id).then((result) => {
          if (result?.success) {
            if (result?.data[0]?.reason != null) {
              toast.error(t(result?.data[0]?.reason));
            } else {
              console.log(result?.data[0]);
              setLikeCardData(result?.data[0]);
              setPluginDrawer(true);
            }
          } else {
            toast.error(result.message);
          }
        });
      } else {
        toast.error(t('common:enable_addon_desc'));
        return;
      }
    } else {
      toast.error(t('common:enable_addon'));
      return;
    }
  };

  const handleReportInvoice = () => {
    setUpdateLoader(true);
    const data = {
      transaction_id: query.invoiceId,
      business_id: BusinessData.id,
      location_id: businesslocationId,
    };

    AddShipping('/report-invoice-to-zatca', data).then((result) => {
      if (result.status) {
        toast.success(result.message);
        router.reload();
      } else {
        toast.error(result.message);
      }
      setUpdateLoader(false);
    });
  };

  const onInvoiceApprove = () => {
    setLoaderApproveIn(true);
    GetFunction('/invoice-approve/' + renderData?.id).then((result) => {
      if (result?.success == true) {
        setLoaderApproveIn(false);
        toast.success(result.msg);
        router.reload();
      } else {
        setLoaderApproveIn(false);
        toast.error(result.msg);
      }
    });
  };

  const onShipClose = () => {
    setDeliveryStatusDiv(true);
    setTrackingInfoBtn(false);
    setIgniteShipsSelect(false);
    setShipModal(false);
  };

  const onSelfShipiing = () => {
    setDeliveryStatusDiv(false);
    setTrackingInfoBtn(true);
    setIgniteShipsSelect(false);
  };
  const onIgniteShipMethod = () => {
    setDeliveryStatusDiv(false);
    setTrackingInfoBtn(false);
    setIgniteShipsSelect(true);
  };
  const onTrackingInfoChange = (e) => {
    setTrackingInfo(e.target.value);
  };

  const onDoneClick = () => {
    setDoneBtnLoading(true);
    apiCallingFunction(statusVal);
    setShipModal(false);
  };

  const onDoneClickIgnite = () => {
    setDoneBtnShipLoading(true);
    apiCallingFunctionDelivery();
  };

  function onIgniteShipReject() {
    apiCallingFunctionReject();
  }

  const onChangeDelivery = (e) => {
    setDeliveryData(e);
  };

  const apiCallingFunctionDelivery = () => {
    GetFunctionOto(
      '/tryoto/create-order?transaction_id=' +
        renderData.id +
        '&delivery_option=' +
        deliveryData.id +
        '&amount=' +
        deliveryData.amount
    ).then((result) => {
      if (result.success) {
        setShipModal(false);
        setDoneBtnShipLoading(false);

        router.reload();
      } else {
        setDoneBtnShipLoading(false);
        setShipModal(true);

        toast.error(result.message);
      }
    });
  };

  const shippingStatusArr: any = [];

  if (toLower(renderData.order_type) === toLower('Pickup')) {
    shippingStatusArr.push(
      { value: 'Accepted', label: 'Accept Order' },
      { value: 'Ready', label: 'Accepted' },
      { value: 'Completed', label: 'Picked Up' },
      { value: 'Rejected', label: 'Rejecte Order' },
      { value: 'Cancelled', label: 'Cancel' },
      { value: 'Failed', label: 'Failed' }
    );
  } else if (toLower(renderData.order_type) === toLower('Delivery')) {
    shippingStatusArr.push(
      { value: 'Accepted', label: 'Accept Order' },
      { value: 'awaiting pickup', label: 'Shipped' },
      { value: 'Shipped', label: 'Accepted' },
      { value: 'Completed', label: 'Delivered' },
      { value: 'Rejected', label: 'Rejecte Order' },
      { value: 'Cancelled', label: 'Cancel' },
      { value: 'awaiting pickup', label: 'on hold' }
    );
  }
  const onChnageShippingStatus = (e) => {
    setStatusVal(e.value);
    onIgniteShip(e.value);
  };

  const apiCallingFunction = (e) => {
    setShipLooader(true);
    // let status = '';

    // if (
    //   toLower(renderData?.shipping_status) == toLower('Pending') &&
    //   toLower(renderData.order_type) == toLower('Pickup')
    // ) {
    //   status = 'Accepted';
    // } else if (
    //   toLower(renderData?.shipping_status) == toLower('Accepted') &&
    //   toLower(renderData?.order_type) == toLower('Pickup')
    // ) {
    //   status = 'Ready';
    // } else if (
    //   toLower(renderData?.shipping_status) == toLower('Ready') &&
    //   toLower(renderData?.order_type) == toLower('Pickup')
    // ) {
    //   status = 'Completed';
    // } else if (
    //   toLower(renderData?.shipping_status) == toLower('pending') &&
    //   toLower(renderData?.order_type) == toLower('Delivery')
    // ) {
    //   status = 'Accepted';
    // } else if (
    //   toLower(renderData?.shipping_status) == toLower('Accepted') &&
    //   toLower(renderData?.order_type) == toLower('Delivery')
    // ) {
    //   status = 'Shipped';
    // } else if (
    //   toLower(renderData?.shipping_status) == toLower('awaiting pickup') &&
    //   toLower(renderData?.order_type) == toLower('Delivery')
    // ) {
    //   status = 'Completed';
    // } else if (
    //   toLower(renderData?.shipping_status) == toLower('Shipped') &&
    //   toLower(renderData?.order_type) == toLower('Delivery')
    // ) {
    //   status = 'Completed';
    // }

    let obj: any = {
      id: renderData?.id,
      shipping_status: e,
    };

    if (trackingInfo) {
      obj['shipping_tracking_id'] = trackingInfo;
      obj['shipping_type'] = renderData.order_type;
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

  // const subtotal = Number(renderData.total_before_tax) || 0;
  // const tax = Number(renderData.tax_amount) || 0;
  // const shippingCharges = Number(renderData.shipping_charges) || 0;
  // const discount = Number(renderData.discount_amount) || 0;
  // const total = subtotal + tax + shippingCharges - discount;

  const apiCallingFunctionReject = () => {
    setShipLooaderReject(true);
    let status = '';

    if (
      toLower(renderData?.shipping_status) == toLower('pending') &&
      toLower(renderData?.order_type) == toLower('Pickup')
    ) {
      status = 'Rejected';
    } else if (
      toLower(renderData?.shipping_status) == toLower('Accepted') &&
      toLower(renderData?.order_type) == toLower('Pickup')
    ) {
      status = 'Cancelled';
    } else if (
      toLower(renderData?.shipping_status) == toLower('Ready') &&
      toLower(renderData?.order_type) == toLower('Pickup')
    ) {
      status = 'Failed';
    } else if (
      toLower(renderData?.shipping_status) == toLower('pending') &&
      toLower(renderData?.order_type) == toLower('Delivery')
    ) {
      status = 'Rejected';
    } else if (
      toLower(renderData?.shipping_status) == toLower('Accepted') &&
      toLower(renderData?.order_type) == toLower('Delivery')
    ) {
      status = 'Cancelled';
    } else if (
      toLower(renderData?.shipping_status) == toLower('awaiting pickup') &&
      toLower(renderData?.order_type) == toLower('Delivery')
    ) {
      status = 'on hold';
    } else if (
      toLower(renderData?.shipping_status) == toLower('Shipped') &&
      toLower(renderData?.order_type) == toLower('Delivery')
    ) {
      status = 'Failed';
    }

    let obj: any = {
      id: renderData?.id,
      shipping_status: status,
    };

    if (trackingInfo) {
      obj['shipping_tracking_id'] = trackingInfo;
      obj['shipping_type'] = renderData?.order_type;
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

  function onIgniteShip(e) {
    if (
      renderData.shipping_status == 'Accepted' &&
      renderData.order_type == 'Delivery' &&
      e.label == 'Shipped'
    ) {
      setShipModal(true);
    } else {
      apiCallingFunction(e);
    }
  }

  const columns = [
    {
      title: t('form:input-label-image'),
      dataIndex: 'product',
      key: 'name',
      align: alignLeft,
      render: (img: any, row: any) => (
        <>
          {row?.product?.image_url ? (
            <Image
              src={row?.product?.image_url}
              alt="product"
              loader={() => row?.product?.image_url}
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
      title: t('table:table-item-title'),
      dataIndex: 'product',
      key: 'name',
      align: alignLeft,
      render: function Redender(id: any, row: any) {
        const data =
          row?.custom_field != null || ('' && JSON.parse(row?.custom_field));
        const formattedString = Object.entries(data)
          .filter(([_, value]) => value !== null && value !== '')
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
        return (
          <div>
            <div>
              {row?.product?.sku == 'IS-OP-SKU'
                ? row?.sell_line_note
                : row?.product_name}
            </div>
            <div>{formattedString}</div>
          </div>
        );
      },
    },
    {
      title: t('table:table-item-quantity'),
      dataIndex: 'quantity',
      key: 'name',
      align: alignLeft,
      render: (quantity: any) => <span>{quantity}</span>,
    },
    {
      title: t('table:table-item-unit-price'),
      dataIndex: 'unit_price',
      key: 'name',
      align: alignLeft,
      render: (unit_price: any) => (
        <span>{Number(unit_price).toFixed(2) + currency?.symbol}</span>
      ),
    },
    {
      title: t('table:table-item-discount'),
      dataIndex: 'line_discount_amount',
      key: 'name',
      align: alignLeft,
      render: (line_discount_amount: any) => (
        <span>
          {Number(line_discount_amount).toFixed(2) + currency?.symbol}
        </span>
      ),
    },
    {
      title: t('table:table-item-tax'),
      dataIndex: 'item_tax',
      key: 'name',
      align: alignLeft,
      render: (item_tax: any) => (
        <span>{Number(item_tax).toFixed(2) + currency?.symbol}</span>
      ),
    },
    {
      title: t('table:table-item-price-inc'),
      dataIndex: 'unit_price_inc_tax',
      key: 'name',
      align: alignLeft,
      render: (unit_price_before_discount: any) => (
        <span>
          {Number(unit_price_before_discount).toFixed(2) + currency?.symbol}
        </span>
      ),
    },
    {
      title: t('table:table-item-subtotal'),
      dataIndex: 'unit_price_inc_tax',
      key: 'price',
      align: alignRight,
      render: (unit_price_inc_tax: any) => (
        <span>{Number(unit_price_inc_tax).toFixed(2) + currency?.symbol}</span>
      ),
    },
    {
      title: t('form:input-label-likeCard'),
      dataIndex: 'product',
      key: 'name',
      align: alignLeft,
      render: (img: any, row: any) => (
        <>
          {row?.product?.likecard_product_id != null && (
            <div onClick={() => getLikeCardBySellLineId(row?.id)}>
              <Image
                src="/image/likecardapp_logo.jpg"
                alt="product"
                layout="fixed"
                width={42}
                height={42}
                className="cursor-pointer overflow-hidden rounded"
              />
            </div>
          )}
        </>
      ),
    },
  ];

  const listOfColumns = () => {
    const { likecard } = subscriptionsDetail?.package;
    
    // Clone the 'columns' array to avoid mutating the original array
    const clonedColumns = [...columns];
  
    if (likecard === 1) {
      if (subscriptionsDetail?.likecard !== 1) {
        // Remove the last element from the cloned array
        clonedColumns.pop();
      }
    } else {
      // Remove the last element from the cloned array
      clonedColumns.pop();
    }
  
    return clonedColumns;
  };

  const paymentColumns = [
    {
      title: t('table:table-item-date'),
      dataIndex: 'paid_on',
      key: 'name',
      align: alignLeft,
      render: (paid_on: any) => <span>{paid_on}</span>,
    },
    {
      title: t('table:table-item-reference-no'),
      dataIndex: 'payment_ref_no',
      key: 'name',
      align: alignLeft,
      render: (payment_ref_no: any) => <span>{payment_ref_no}</span>,
    },
    {
      title: t('form:input-label-amount'),
      dataIndex: 'amount',
      key: 'name',
      align: alignLeft,
      render: (amount: any, row) => (
        <span>
          {Number(amount).toFixed(2) + currency?.symbol}
          {row.is_return == 1 ? ' (Return)' : ''}
        </span>
      ),
    },
    {
      title: t('table:table-item-payment-method'),
      dataIndex: 'method',
      key: 'name',
      align: alignLeft,
      render: (method: any, row: any) => (
        <span>
          {method} {row.card_type && <>({row.card_type})</>}{' '}
        </span>
      ),
    },
  ];
  const activityColumns = [
    {
      title: t('table:table-item-date'),
      dataIndex: 'created_at',
      key: 'name',
      align: alignLeft,
      render: (created_at: any) => <span>{created_at}</span>,
    },
    {
      title: t('table:table-item-colum-action'),
      dataIndex: 'description',
      key: 'name',
      align: alignLeft,
      render: function Redender(id: any, row: any) {
        if (row.description == 'edited') {
          return <>Edited</>;
        } else if (
          row.description == 'update_shipping_status' ||
          row.description == 'shipping_status_edit'
        ) {
          return <>Shipping Edited</>;
        }
      },
    },
    {
      title: t('common:text-by'),
      dataIndex: 'amount',
      key: 'name',
      align: alignLeft,
      render: (amount: any, row) => (
        <span>
          {row?.causer != null &&
            row?.causer?.first_name + ' ' + row?.causer?.last_name}
        </span>
      ),
    },
    // {
    //   title: t('Total'),
    //   dataIndex: 'method',
    //   key: 'name',
    //   align: alignLeft,
    //   render: (method: any, row: any) => (
    //     <span>
    //       {Number(row.subject.final_total).toFixed(2) + currency?.symbol}
    //     </span>
    //   ),
    // },
    {
      title: t('table:table-item-colum-action'),
      dataIndex: 'shipment_aggregator_status',
      key: 'name',
      align: alignLeft,
      render: function Render(id: any, row: any) {
        return (
          <div>
            {row.description == 'edited' && (
              <div>
                <p>
                  <span className="font-bold">Status: </span>
                  {row.properties.attributes.status}
                </p>
                <p>
                  <span className="font-bold">Total: </span>
                  {Number(row.subject.final_total).toFixed(2) +
                    currency?.symbol}
                </p>
              </div>
            )}
            {row.description == 'shipping_status_edit' && (
              <div>
                <p>
                  <span className="font-bold">Shipping Status </span>
                  {row.properties.attributes.shipping_status}
                </p>
                <p>
                  {row.properties.attributes.shipment_aggregator_status && (
                    <div>
                      <p className="font-bold">Aggregate Status: </p>
                      {row.properties.attributes.shipment_aggregator_status}
                    </div>
                  )}
                </p>
              </div>
            )}

            {row.description == 'shipping_edited' && (
              <div>
                <p>
                  <span className="font-bold">Shipping Status</span>
                  {row.properties.attributes.shipping_status}
                </p>
              </div>
            )}

            {row.description == 'update_shipping_status' && (
              <div>
                <p>
                  <span className="font-bold">Shipping Status: </span>
                  {row.properties.attributes.shipping_status}
                </p>
              </div>
            )}
          </div>
        );
      },
    },
    // {
    //   title: t('Aggregator Status'),
    //   dataIndex: 'shipment_aggregator_status',
    //   key: 'name',
    //   align: alignLeft,
    //   render: (shipment_aggregator_status: any, row: any) => (
    //     <span>{row.subject.shipment_aggregator_status}</span>
    //   ),
    // },
    // {
    //   title: t('Shipping Status'),
    //   dataIndex: 'shipping_status',
    //   key: 'name',
    //   align: alignLeft,
    //   render: (shipping_status: any, row: any) => (
    //     <span>{row.subject.shipping_status}</span>
    //   ),
    // },
  ];
  const subtotal = Number(renderData.total_before_tax) || 0;
  const tax = Number(renderData.tax_amount) || 0;
  const shippingCharges = Number(renderData.shipping_charges) || 0;
  const discount = Number(renderData.discount_amount) || 0;
  const total = subtotal + tax + shippingCharges - discount;

  if (loading) return <Loader text={t('common:text-loading')} />;

  return (
    <Card>
      <div className="flex w-full justify-between">
        <span>{t('common:invoice-number')}</span>
        <div>
          <span>
            {isYetToPush &&
              renderData?.status === 'final' &&
              BusinessDetail &&
              BusinessDetail.enabled_modules.includes('enable_einvoice') && (
                <Button
                  loading={updateLoader}
                  className="rounded bg-accent p-2 text-white"
                  onClick={handleReportInvoice}
                >
                  {t('common:report-to-zatca')}
                </Button>
              )}
          </span>
          <span className="ml-3">
            {permissionData?.map((item: any, i: any) => {
              if (
                item.toLocaleLowerCase().includes('create_approve_invoice') &&
                renderData?.status !== 'final'
              ) {
                return (
                  <Button
                    key={i}
                    loading={loaderApproveIn}
                    className="rounded bg-accent p-2 text-white"
                    onClick={onInvoiceApprove}
                  >
                    {t('form:approve-invoice')}
                  </Button>
                );
              }
              return null;
            })}
          </span>
        </div>
      </div>
      <div className="mt-5 flex justify-end ">
        <div className=" w-full">
          {renderData?.contact?.first_name && (
            <div className="flex w-full">
              <Label className="w-5/12">{t('form:text-customer')}</Label>
              <Label className="ml-3 w-full border-l-2 pl-2">
                {renderData?.contact?.first_name +
                  ' ' +
                  renderData?.contact?.last_name}
              </Label>
            </div>
          )}
          {renderData?.contact?.mobile && (
            <div className="mt-3 flex w-full">
              <Label className="w-5/12">{t('form:customer-phone')}</Label>
              <Label className="ml-3 w-full border-l-2 pl-2">
                {renderData?.contact?.mobile}
              </Label>
            </div>
          )}
          <div className="mt-3 flex w-full">
            <Label className="w-5/12">{t('form:invoice-number')}</Label>
            <Label className="ml-3 w-full border-l-2 pl-2">
              {renderData?.invoice_no}
            </Label>
          </div>
          {renderData?.created_at && (
            <div className="mt-3 flex w-full">
              <Label className="w-5/12">{t('form:form-title-date')}</Label>
              <Label className="ml-3 w-full border-l-2 pl-2">
                {renderData?.created_at}
              </Label>
            </div>
          )}
          {renderData?.status && (
            <div className="mt-3 flex w-full">
              <Label className="w-5/12">{t('form:input-label-status')}</Label>
              <Label className="ml-3 w-full border-l-2 pl-2">
                {renderData?.status}
              </Label>
            </div>
          )}
          {renderData?.payment_status && (
            <div className="mt-3 flex w-full">
              <Label className="w-5/12">
                {t('form:input-label-payment-status')}
              </Label>
              <Label className="ml-3 w-full border-l-2 pl-2">
                {renderData?.payment_status}
              </Label>
            </div>
          )}
          {renderData?.flextock_status && (
            <div className="mt-3 flex w-full">
              <Label className="w-5/12">Flextock Status</Label>
              <Label className="ml-3 w-full border-l-2 pl-2">
                {renderData?.flextock_status}
              </Label>
            </div>
          )}
          {renderData?.shipping_status && (
            <div className="mt-3 flex w-full">
              <Label className="w-5/12 pt-3">
                {t('table:table-item-shipping-status')}
              </Label>
              <div className="ml-3 w-full border-l-2 pl-2">
                {/* {renderData?.shipping_status} */}
                <Select
                  defaultValue={{ label: renderData?.shipping_status }}
                  options={shippingStatusArr}
                  onChange={onChnageShippingStatus}
                  className="w-44"
                />
              </div>
            </div>
          )}
          {renderData?.order_type && (
            <div className="mt-3 flex w-full">
              <Label className="w-5/12">{t('Order Type')}</Label>
              <Label className="ml-3 w-full border-l-2 pl-2">
                {renderData?.order_type}
              </Label>
            </div>
          )}
          {renderData?.payment_method && (
            <div className="mt-3 flex w-full">
              <Label className="w-5/12">Payment Method</Label>
              <Label className="ml-3 w-full border-l-2 pl-2">
                {renderData?.payment_method}
              </Label>
            </div>
          )}
          {renderData?.shipping_address && (
            <div className="mt-3 flex w-full">
              <Label className="w-5/12">Shipping Address</Label>
              <Label className="ml-3 w-full border-l-2 pl-2">
                {renderData?.shipping_address}
              </Label>
            </div>
          )}
          {renderData?.custom_field_4 && (
            <div className="mt-3 flex w-full">
              <Label className="w-5/12">Tracing info</Label>
              <Label className="ml-3 w-full border-l-2 pl-2">
                {renderData?.custom_field_4}
              </Label>
            </div>
          )}
          {renderData?.custom_field_1 && (
            <div className="mt-3 flex w-full">
              <Label className="w-5/12">
                {customFiieldsData.custom_field_1}
              </Label>
              <Label className="ml-3 w-full border-l-2 pl-2">
                {renderData?.custom_field_1}
              </Label>
            </div>
          )}
          {renderData?.custom_field_2 && (
            <div className="mt-3 flex w-full">
              <Label className="w-5/12">
                {customFiieldsData.custom_field_2}
              </Label>
              <Label className="ml-3 w-full border-l-2 pl-2">
                {renderData?.custom_field_2}
              </Label>
            </div>
          )}
          {renderData?.custom_field_3 && (
            <div className="mt-3 flex w-full">
              <Label className="w-5/12">
                {customFiieldsData.custom_field_3}
              </Label>
              <Label className="ml-3 w-full border-l-2 pl-2">
                {renderData?.custom_field_3}
              </Label>
            </div>
          )}
          {renderData?.custom_field_4 && (
            <div className="mt-3 flex w-full">
              <Label className="w-5/12">
                {customFiieldsData.custom_field_4}
              </Label>
              <Label className="ml-3 w-full border-l-2 pl-2">
                {renderData?.custom_field_4}
              </Label>
            </div>
          )}
        </div>
        <div className="flex w-full justify-end">
          <div>
            {logo && (
              <Image
                className="flex justify-end"
                width={200}
                height={100}
                loader={() => logo}
                src={logo}
                alt={'img'}
              />
            )}

            <div className="mt-3 flex justify-end">
              {BusinessDetail && BusinessDetail.name}
            </div>
            <Label className="mt-5 flex justify-end text-xs">
              {BusinessData.tax_number_1 == 'null'
                ? ''
                : 'Tin: ' + BusinessData?.tax_number_1}
            </Label>
            {businesslocationName && (
              <div className="mt-3 flex justify-end text-xs ">
                <Label className=" text-xs">Location:</Label>
                <Label className=" ml-1 text-xs">{businesslocationName}</Label>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className=" mt-5">
        <div className="mb-5">{t('common:text-products')}</div>

        <Table
          //@ts-ignore
          columns={listOfColumns()}
          emptyText={t('table:empty-table-data')}
          data={DataArr}
          rowKey="id"
          scroll={{ x: 300 }}
        />
      </div>
      <div className=" mt-5">
        <div className="mb-5">{t('common:payments')}</div>
        <Table
          //@ts-ignore
          columns={paymentColumns}
          emptyText={t('table:empty-table-data')}
          data={renderPaymentData}
          rowKey="id"
          scroll={{ x: 300 }}
        />
      </div>
      {}

      {permissionData?.map((item: any, index) => {
        if (item.toLocaleLowerCase().includes('show_activity_log')) {
          return (
            <div key={index} className=" mt-5">
              <div className="mb-5">{t('form:activities')}</div>
              <Table
                //@ts-ignore
                columns={activityColumns}
                emptyText={t('table:empty-table-data')}
                data={renderActivityData}
                rowKey="id"
                scroll={{ x: 300 }}
              />
            </div>
          );
        }
        return null;
      })}

      <div className="xl-flow-row mt-5 flex flex-col md:flex-row lg:flex-row">
        <div className="w-9/12">
          <div className="mb-5">{t('common:invoice-notes')}</div>
          <TextArea
            value={renderData?.additional_notes}
            name=""
            variant="outline"
            disabled
            className="mb-5"
          />
        </div>
        <div className="ml-5 mt-3 w-3/12">
          <div className="flex flex-col border-t-4  border-b-4  border-double border-border-200 py-4 ms-auto lg:col-span-1">
            <div className="flex items-center justify-between text-sm text-body">
              <span>{t('table:table-item-subtotal')}</span>
              <span>{renderData?.total_before_tax + currency?.symbol}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-body">
              <span>{t('table:table-item-tax')}</span>
              <span>{renderData?.tax_amount + currency?.symbol}</span>
            </div>
            {renderData?.shipping_charges && (
              <div className="flex items-center justify-between text-sm text-body">
                <span>{t('common:shipping-charges')}</span>
                <span>{renderData?.shipping_charges + currency?.symbol}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm text-body">
              <span>{t('common:order-discount')}</span>
              <span>
                {Number(renderData?.discount_amount) +
                  DisVal +
                  currency?.symbol}
              </span>
            </div>
            <div className="flex items-center justify-between text-base font-semibold text-heading">
              <span>{t('common:order-total')}</span>
              <span>{total.toFixed(2) + currency?.symbol}</span>
            </div>
          </div>
        </div>
      </div>

      {/* {renderData.shipping_status == 'Completed' ||
      renderData.shipping_status == 'Rejected' ||
      renderData.shipping_status == 'Cancelled' ||
      renderData.shipping_status == 'Failed' ? (
        ''
      ) : (
        <div className="flex justify-end">
          <Button
            loading={shipLooaderReject}
            onClick={onIgniteShipReject}
            className="border border-black bg-white text-black hover:bg-accent-hover hover:text-light"
          >
            <span>
              {toLower(renderData?.shipping_status) == toLower('pending') &&
                renderData?.order_type == 'Pickup' &&
                'Rejecte Order'}
              {toLower(renderData?.shipping_status) == toLower('Accepted') &&
                toLower(renderData?.order_type) == toLower('Pickup') &&
                'Cancel'}
              {toLower(renderData?.shipping_status) == toLower('Ready') &&
                toLower(renderData?.order_type) == toLower('Pickup') &&
                'Failed'}
              {toLower(renderData?.shipping_status) == toLower('pending') &&
                toLower(renderData?.order_type) == toLower('Delivery') &&
                'Rejecte Order'}
              {toLower(renderData?.shipping_status) == toLower('Accepted') &&
                toLower(renderData?.order_type) == toLower('Delivery') &&
                'Cancel'}
              {toLower(renderData?.shipping_status) == toLower('Shipped') &&
                toLower(renderData?.order_type) == toLower('Delivery') &&
                'Failed'}
              {toLower(renderData?.shipping_status) ==
                toLower('awaiting pickup') &&
                toLower(renderData?.order_type) == toLower('Delivery') &&
                'On Hold'}
            </span>
          </Button>

          <Button loading={shipLooader} className="ml-3" onClick={onIgniteShip}>
            <span>
              {toLower(renderData?.shipping_status) == toLower('pending') &&
                toLower(renderData?.order_type) == toLower('Pickup') &&
                'Accept Order'}
              {toLower(renderData?.shipping_status) == toLower('Accepted') &&
                toLower(renderData?.order_type) == toLower('Pickup') &&
                'Ready'}
              {toLower(renderData?.shipping_status) == toLower('Ready') &&
                toLower(renderData?.order_type) == toLower('Pickup') &&
                'Picked Up'}
              {toLower(renderData?.shipping_status) == toLower('pending') &&
                toLower(renderData?.order_type) == toLower('Delivery') &&
                'Accept Order'}
              {toLower(renderData?.shipping_status) == toLower('Accepted') &&
                toLower(renderData?.order_type) == toLower('Delivery') &&
                'Shipped'}
              {toLower(renderData?.shipping_status) == toLower('Shipped') &&
                toLower(renderData?.order_type) == toLower('Delivery') &&
                'Delivered'}
              {toLower(renderData?.shipping_status) ==
                toLower('awaiting pickup') &&
                toLower(renderData?.order_type) == toLower('Delivery') &&
                'Delivered'}
            </span>
          </Button>
        </div>
      )} */}

      <Drawer open={shipModal} onClose={() => setShipModal(true)}>
        <div className="mt-4 p-5">
          {deliveryStatusDiv && (
            <div className="">
              <div className="pb-3">Shipping Method</div>
              <div
                onClick={onSelfShipiing}
                className="flex cursor-pointer rounded bg-gray-300 p-3"
              >
                <MdOutlineLocalShipping className="mt-1 mr-3 h-5 w-5" />
                <span>Self Shipping</span>
              </div>
              <div
                onClick={onIgniteShipMethod}
                className="mt-3  flex cursor-pointer rounded bg-gray-300 p-3"
              >
                <FaShippingFast className="mt-1 mr-3 h-5 w-5" />
                <span>Ignite Shipping</span>
              </div>
            </div>
          )}
          {trackingInfoBtn && (
            <div>
              <Input
                name=""
                label="Tracking Info"
                onChange={onTrackingInfoChange}
              />
            </div>
          )}
          {igniteShipsSelect && (
            <div>
              <Label>Select Delivery Company</Label>
              {errorMesg ? (
                <span className="text-red-600">{errorMesg}</span>
              ) : (
                <Select options={deliveryCompany} onChange={onChangeDelivery} />
              )}
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button onClick={onShipClose} className="rounded-md border p-2">
              {t('form:form-button-close')}
            </button>
            {}
            {trackingInfoBtn && (
              <Button
                loading={doneBtnLoading}
                onClick={onDoneClick}
                className="ml-2 rounded-md border p-2"
              >
                Done
              </Button>
            )}
            {igniteShipsSelect && !errorMesg && (
              <div>
                <Button
                  loading={doneBtnShipLoading}
                  onClick={onDoneClickIgnite}
                  className="ml-2 rounded-md border p-2"
                >
                  Done
                </Button>
              </div>
            )}
          </div>
        </div>
      </Drawer>
      <Drawer
        open={pluginDrawer}
        onClose={closeFunctionPluginDrawer}
        variant="right"
      >
        <DrawerWrapper onClose={closeFunctionPluginDrawer} hideTopBar={false}>
          <div className="m-auto mb-2 mt-2  rounded bg-light p-4 sm:w-[28rem]">
            {likeCardData && (
              <>
                <div className="grid grid-cols-8 gap-4">
                  <div className="col-span-2 flex items-center justify-center">
                   {console.log(likeCardData?.likecard_payload?.productImage)}
                    <Image
                      width={100}
                      height={100}
                      src={likeCardData?.likecard_payload?.productImage}
                      alt={likeCardData?.likecard_payload?.productName}
                    />
                  </div>
                  <div className="col-span-6">
                    <h3 className="font-semibold">
                      {likeCardData?.likecard_payload?.productName}
                    </h3>
                  </div>
                </div>

                <p className="">{t('form:input-label-reference-no')}</p>
                <Input
                  name="phone"
                  value={
                    likeCardData?.likecard_payload?.serials[0]?.serialNumber
                  }
                  // placeholder="Enter Phone Number"
                  variant="outline"
                  className="mb-5"
                  disabled={true}
                />
              </>
            )}
          </div>
        </DrawerWrapper>
      </Drawer>
    </Card>
  );
}
OrderDetailsPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'form', 'table'])),
  },
});
