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

export default function OrderDetailsPage() {
  const { t } = useTranslation();
  const { query, locale } = useRouter();
  const { alignLeft, alignRight, isRTL } = useIsRTL();
  const [DataArr, setDataArr] = useState([]);
  const [renderData, setRenderData] = useState<any>();
  const [renderPaymentData, setRenderPaymentData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    GetFunction(('/sell/' + query.invoiceId) as string).then((result) => {
      setDataArr(result.data[0]?.sell_lines);
      setRenderData(result.data[0]);
      setRenderPaymentData(result.data[0]?.payment_lines);
      setLoading(false);
    });
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

  if (loading) return <Loader text={t('common:text-loading')} />;
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
      title: 'Name',
      dataIndex: 'product',
      key: 'name',
      align: alignLeft,
      render: (product: any) => <span>{product?.name}</span>,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'name',
      align: alignLeft,
      render: (quantity: any) => <span>{quantity}</span>,
    },
    {
      title: 'Unit Price',
      dataIndex: 'unit_price',
      key: 'name',
      align: alignLeft,
      render: (unit_price: any) => <span>{unit_price}</span>,
    },
    {
      title: 'Discount',
      dataIndex: 'line_discount_amount',
      key: 'name',
      align: alignLeft,
      render: (line_discount_amount: any) => (
        <span>{line_discount_amount}</span>
      ),
    },
    {
      title: 'Tax',
      dataIndex: 'item_tax',
      key: 'name',
      align: alignLeft,
      render: (item_tax: any) => <span>{item_tax}</span>,
    },
    {
      title: 'Price inc.tax',
      dataIndex: 'unit_price_inc_tax',
      key: 'name',
      align: alignLeft,
      render: (unit_price_inc_tax: any) => <span>{unit_price_inc_tax}</span>,
    },
    {
      title: 'Subtotal',
      dataIndex: 'unit_price_inc_tax',
      key: 'price',
      align: alignRight,
      render: (unit_price_inc_tax: any) => <span>{unit_price_inc_tax}</span>,
    },
  ];
  const paymentColumns = [
    {
      title: 'Date',
      dataIndex: 'paid_on',
      key: 'name',
      align: alignLeft,
      render: (paid_on: any) => <span>{paid_on}</span>,
    },
    {
      title: 'Reference No',
      dataIndex: 'payment_ref_no',
      key: 'name',
      align: alignLeft,
      render: (payment_ref_no: any) => <span>{payment_ref_no}</span>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'name',
      align: alignLeft,
      render: (amount: any) => <span>{amount}</span>,
    },
    {
      title: 'Payment Mode',
      dataIndex: 'method',
      key: 'name',
      align: alignLeft,
      render: (method: any) => <span>{method}</span>,
    },
  ];

  return (
    <Card>
      <div className="flex flex-col items-center lg:flex-row">
        <h3 className="mb-8 w-full whitespace-nowrap text-center text-2xl font-semibold text-heading lg:mb-10 lg:w-1/3 lg:text-start">
          {'Invoice Number'} - {renderData?.invoice_no}
        </h3>
      </div>

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
              <span>{t('Subtotal')}</span>
              <span>{renderData?.total_before_tax}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-body">
              <span>{t('Tax')}</span>
              <span>{renderData?.tax_amount}</span>
            </div>
            {renderData?.shipping_charges && (
              <div className="flex items-center justify-between text-sm text-body">
                <span>{t('common:order-delivery-fee')}</span>
                <span>{renderData?.shipping_charges}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm text-body">
              <span>{t('common:order-discount')}</span>
              <span>{renderData?.discount_amount}</span>
            </div>
            <div className="flex items-center justify-between text-base font-semibold text-heading">
              <span>{t('common:order-total')}</span>
              <span>{renderData?.final_total}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
        <div className="mb-10 w-full sm:mb-0 sm:w-1/2 sm:pe-8">
          <h3 className="mb-3 border-b border-border-200 pb-2 font-semibold text-heading">
            {'Billing Adress'}
          </h3>

          <div className="flex flex-col items-start space-y-1 text-sm text-body">
            <span>{'Customer Name'}</span>
            {/* <span>{'order.billing_address'}</span> */}
          </div>
        </div>

        {/* <div className="w-full sm:w-1/2 sm:ps-8">
          <h3 className="mb-3 border-b border-border-200 pb-2 font-semibold text-heading text-start sm:text-end">
            {'Shipping Address'}
          </h3>

          <div className="flex flex-col items-start space-y-1 text-sm text-body text-start sm:items-end sm:text-end">
            <span>{'Customer Name'}</span>
            
          </div>
        </div> */}
      </div>
    </Card>
  );
}
OrderDetailsPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'form', 'table'])),
  },
});
