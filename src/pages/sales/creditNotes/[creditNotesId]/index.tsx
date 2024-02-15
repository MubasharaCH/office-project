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

export default function OrderDetailsPage() {
  const { t } = useTranslation();
  const { query, locale } = useRouter();
  const { alignLeft, alignRight, isRTL } = useIsRTL();
  const [DataArr, setDataArr] = useState([]);
  const [renderData, setRenderData] = useState<any>();
  const [renderPaymentData, setRenderPaymentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [metaData, setMetaData] = useState<any>();

  useEffect(() => {
    setLoading(true);
    GetFunction('/list-sell-return?order_by=asc').then((result) => {
      setMetaData(result.meta);
      setLoading(false);
    });
  }, []);

  React.useEffect(() => {
    if (metaData != undefined) {
      setLoading(true);
      GetFunction(
        '/list-sell-return?order_by=asc&&per_page=' + metaData?.total
      ).then((result) => {
        setMetaData(result.meta);
        const found = result.data.find(
          (element) => element.id == query.creditNotesId
        );
        setRenderData(found);
        setDataArr(found.sell_return_sell_line);
        setRenderPaymentData(found.payment_lines);
        setLoading(false);
      });
    }
  }, [metaData != undefined]);

  if (loading) return <Loader text={t('common:text-loading')} />;
  const columns = [
    {
      title: t('table:table-item-title'),
      dataIndex: 'product',
      key: 'name',
      align: alignLeft,
      render: (product: any) => <span>{product?.name}</span>,
    },
    {
      title: t('table:table-item-unit-price'),
      dataIndex: 'unit_price',
      key: 'name',
      align: alignLeft,
      render: (unit_price: any) => <span>{unit_price}</span>,
    },
    {
      title: t('table:table-item-quantity'),
      dataIndex: 'quantity',
      key: 'name',
      align: alignLeft,
      render: (quantity: any) => <span>{quantity}</span>,
    },
    {
      title: t('table:table-item-return-quantity'),
      dataIndex: 'quantity_returned',
      key: 'name',
      align: alignLeft,
      render: (quantity_returned: any) => (
        <span>{Number(quantity_returned)}</span>
      ),
    },
    {
      title: t('table:table-item-subtotal-return'),
      dataIndex: 'id',
      key: 'id',
      align: alignRight,
      render: function Render(id: any, row: any) {
        return <span>{row.unit_price * Number(row.quantity_returned)}</span>;
      },
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
      render: (amount: any) => <span>{amount}</span>,
    },
    {
      title: t('table:table-item-payment-method'),
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
          {t('table:table-item-invoice-no')} - {renderData?.invoice_no}
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
              <span>{t('table:table-item-subtotal')}</span>
              <span>{renderData?.total_before_tax}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-body">
              <span>{t('table:table-item-tax')}</span>
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
            {t('table:table-item-billing-address')}
          </h3>

          <div className="flex flex-col items-start space-y-1 text-sm text-body">
            <span>{t('table:table-item-customer-name')}</span>
            {/* <span>{'order.billing_address'}</span> */}
          </div>
        </div>
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
