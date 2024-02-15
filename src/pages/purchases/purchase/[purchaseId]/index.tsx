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
import { GetFunction } from '@/services/Service';
import React from 'react';
import Label from '@/components/ui/label';
import TextArea from '@/components/ui/text-area';

export default function OrderDetailsPage() {
  const { t } = useTranslation();
  const { query, locale } = useRouter();
  const { alignLeft, alignRight, isRTL } = useIsRTL();
  const [DataArr, setDataArr] = useState([]);
  const [renderData, setRenderData] = useState<any>();
  const [renderPaymentData, setRenderPaymentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = React.useState<any>();
  const [DisVal, setDisVal] = React.useState<any>();
  const [logo, setLogo] = useState<any>('');
  const [BusinessDetail, setBusinessDetail] = useState<any>('');
  const [BusinessData, setBusinessData] = useState<any>('');

  useEffect(() => {
    setLoading(true);
    let businessDetail: any = localStorage.getItem('user_business_details');
    let logo = JSON.parse(businessDetail);

    setLogo(logo?.logo);
    setBusinessDetail(logo);

    GetFunction(('/sell/' + query.invoiceId) as string).then((result) => {
      setDataArr(result.data[0]?.sell_lines);
      let value: any = 0;
      result.data[0]?.sell_lines.map((res) => {
        let unitValue = res.line_discount_amount;
        value = value + Number(unitValue);
        setDisVal(value);
      });
      setRenderData(result.data[0]);
      setRenderPaymentData(result.data[0]?.payment_lines);
      setLoading(false);
    });
    GetFunction('/business-details').then((result) => {
      setBusinessData(result.data);
    });
  }, []);
  React.useEffect(() => {
    let businessDetails: any = localStorage.getItem('business_details');
    setCurrency(JSON.parse(businessDetails));
  }, []);
  // const { refetch } = useDownloadInvoiceMutation(
  //   {
  //     order_id: query.orderId as string,
  //     isRTL,
  //     language: locale!,
  //   },
  //   { enabled: false }
  // );

  // const ChangeStatus = ({ order_status }: FormValues) => {
  //   updateOrder({
  //     id: order?.id as string,
  //     status: order_status?.id as string,
  //   });
  // };
  // const { price: subtotal } = usePrice(
  //   order && {
  //     amount: order?.amount!,
  //   }
  // );

  // const { price: total } = usePrice(
  //   order && {
  //     amount: order?.paid_total!,
  //   }
  // );
  // const { price: discount } = usePrice(
  //   order && {
  //     amount: order?.discount!,
  //   }
  // );
  // const { price: delivery_fee } = usePrice(
  //   order && {
  //     amount: order?.delivery_fee!,
  //   }
  // );
  // const { price: sales_tax } = usePrice(
  //   order && {
  //     amount: order?.sales_tax!,
  //   }
  // );

  // if (error) return <ErrorMessage message={error.message} />;

  // async function handleDownloadInvoice() {
  //   const { data } = await refetch();

  //   if (data) {
  //     const a = document.createElement('a');
  //     a.href = data;
  //     a.setAttribute('download', 'order-invoice');
  //     a.click();
  //   }
  // }

  const columns = [
    {
      title: t('table:table-item-title'),
      dataIndex: 'product',
      key: 'name',
      align: alignLeft,
      render: (product: any, row: any) => (
        <span>
          {product?.sku == 'IS-OP-SKU' ? row?.sell_line_note : product?.name}
        </span>
      ),
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
      render: (unit_price: any) => <span>{unit_price + currency?.symbol}</span>,
    },
    {
      title: t('table:table-item-discount'),
      dataIndex: 'line_discount_amount',
      key: 'name',
      align: alignLeft,
      render: (line_discount_amount: any) => (
        <span>{line_discount_amount + currency?.symbol}</span>
      ),
    },
    {
      title: t('table:table-item-tax'),
      dataIndex: 'item_tax',
      key: 'name',
      align: alignLeft,
      render: (item_tax: any) => <span>{item_tax + currency?.symbol}</span>,
    },
    {
      title: t('table:table-item-price-inc'),
      dataIndex: 'unit_price_inc_tax',
      key: 'name',
      align: alignLeft,
      render: (unit_price_before_discount: any) => (
        <span>{unit_price_before_discount + currency?.symbol}</span>
      ),
    },
    {
      title: t('table:table-item-subtotal'),
      dataIndex: 'unit_price_inc_tax',
      key: 'price',
      align: alignRight,
      render: (unit_price_inc_tax: any) => (
        <span>{unit_price_inc_tax + currency?.symbol}</span>
      ),
    },
  ];
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
      title: t('table:table-item-amount'),
      dataIndex: 'amount',
      key: 'name',
      align: alignLeft,
      render: (amount: any) => <span>{amount + currency?.symbol}</span>,
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

  if (loading) return <Loader text={t('common:text-loading')} />;

  return (
    <Card>
      <div className="w-full ml-20">{t('common:invoice-number')}</div>
      <div className="flex justify-end mt-5 ml-20 mr-20">
        <div className=" w-full">
          {renderData?.contact?.first_name && (
            <div className="flex w-full">
              <Label className="w-5/12">Customer</Label>
              <Label className="w-full pl-2 ml-3 border-l-2">
                {renderData?.contact?.first_name +
                  ' ' +
                  renderData?.contact?.last_name}
              </Label>
            </div>
          )}
          {renderData?.contact?.mobile && (
            <div className="flex w-full mt-3">
              <Label className="w-5/12">Customer Phone</Label>
              <Label className="w-full pl-2 ml-3 border-l-2">
                {renderData?.contact?.mobile}
              </Label>
            </div>
          )}
          <div className="flex w-full mt-3">
            <Label className="w-5/12">Invoice Number</Label>
            <Label className="w-full pl-2 ml-3 border-l-2">
              {renderData?.invoice_no}
            </Label>
          </div>
          {renderData?.created_at && (
            <div className="flex w-full mt-3">
              <Label className="w-5/12">Date</Label>
              <Label className="w-full pl-2 ml-3 border-l-2">
                {renderData?.created_at}
              </Label>
            </div>
          )}
          {renderData?.status && (
            <div className="flex w-full mt-3">
              <Label className="w-5/12">Status</Label>
              <Label className="w-full pl-2 ml-3 border-l-2">
                {renderData?.status}
              </Label>
            </div>
          )}
          {renderData?.payment_status && (
            <div className="flex w-full mt-3">
              <Label className="w-5/12">Payment Status</Label>
              <Label className="w-full pl-2 ml-3 border-l-2">
                {renderData?.payment_status}
              </Label>
            </div>
          )}
          {renderData?.shipping_status && (
            <div className="flex w-full mt-3">
              <Label className="w-5/12">Shipping Status</Label>
              <Label className="w-full pl-2 ml-3 border-l-2">
                {renderData?.shipping_status}
              </Label>
            </div>
          )}
          {renderData?.shipping_address && (
            <div className="flex w-full mt-3">
              <Label className="w-5/12">Shipping Address</Label>
              <Label className="w-full pl-2 ml-3 border-l-2">
                {renderData?.shipping_address}
              </Label>
            </div>
          )}
          {renderData?.custom_field_4 && (
            <div className="flex w-full mt-3">
              <Label className="w-5/12">Tracing info</Label>
              <Label className="w-full pl-2 ml-3 border-l-2">
                {renderData?.custom_field_4}
              </Label>
            </div>
          )}
        </div>
        <div className="w-full flex justify-end">
          <div>
            {logo && (
              <Image
                className="flex justify-end"
                width={200}
                height={150}
                loader={() => logo}
                src={logo}
              />
            )}

            <div className="flex justify-end mt-3">
              {BusinessDetail && BusinessDetail.name}
            </div>
            <Label className="flex justify-end mt-5 text-xs">
              Tin: {BusinessData?.tax_number_1}
            </Label>
          </div>
        </div>
      </div>
      <div className="ml-20 mr-20 mt-5">
        <div className="mb-5">{t('common:text-products')}</div>
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={DataArr}
          rowKey="id"
          scroll={{ x: 300 }}
        />
      </div>
      <div className="ml-20 mr-20 mt-5">
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
      <div className="flex ml-20 mr-20 mt-5">
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
        <div className="w-3/12 ml-5 mt-3">
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
                <span>{t('common:order-delivery-fee')}</span>
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
              <span>{renderData?.final_total + currency?.symbol}</span>
            </div>
          </div>
        </div>
      </div>

      {/* <Card className="flex justify-between">
        <div className="flex-col items-center lg:flex-row">
          <Label>
            {t('table:table-item-invoice-no')}:
            <span className="text-slate-500"> {renderData?.invoice_no}</span>
          </Label>
          <Label>
            {t('Status')}:
            <span className="text-slate-500"> {renderData?.status}</span>
          </Label>
        </div>
        <div>
          <Label>
            {t('Payment Status')}:
            <span className="text-slate-500">
              {' '}
              {renderData?.payment_status}
            </span>
          </Label>
          <Label>
            {t('Shipping Status')}:
            <span className="text-slate-500">
              {' '}
              {renderData?.shipping_status}
            </span>
          </Label>
        </div>
      </Card>
      <Card className="mt-5">
        <div className="mb-10">
          <Table
            //@ts-ignore
            columns={columns}
            emptyText={t('table:empty-table-data')}
            data={DataArr}
            rowKey="id"
            scroll={{ x: 300 }}
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="w-auto overflow-hidden lg:col-span-2">
              <Table
                //@ts-ignore
                columns={paymentColumns}
                emptyText={t('table:empty-table-data')}
                data={renderPaymentData}
                rowKey="id"
                scroll={{ x: 300 }}
              />
            </div>
            <div className="flex w-full flex-col border-t-4  border-double border-border-200 py-4 ms-auto lg:col-span-1">
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
                  <span>{t('common:order-delivery-fee')}</span>
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
                <span>{renderData?.final_total + currency?.symbol}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div className="mb-10 w-full sm:mb-0 sm:w-1/2 sm:pe-8">
            <h3 className="mb-3 border-b border-border-200 pb-2 font-semibold text-heading">
              {t('table:table-item-billing-address')}
            </h3>

            <div className="flex flex-col items-start space-y-1 text-sm text-body">
              <span>{t('table:table-item-customer-name')}</span>
            </div>
          </div>
        </div>
      </Card> */}
    </Card>
  );
}
OrderDetailsPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'form', 'table'])),
  },
});
