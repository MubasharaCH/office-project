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
import { AddingSellReturnFunction, GetFunction } from '@/services/Service';
import Input from '@/components/ui/input';
import { toast } from 'react-toastify';

export default function OrderDetailsPage() {
  const { t } = useTranslation();
  const { query, locale } = useRouter();
  const { alignLeft, alignRight, isRTL } = useIsRTL();
  const [DataArr, setDataArr] = useState<any>([]);
  const [renderData, setRenderData] = useState<any>();
  const [renderPaymentData, setRenderPaymentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sabTotal, setSabTotal] = useState<any>('');
  const [QtyValue, setQtyValue] = useState<any>('');
  const [totalValue, settotalValue] = useState<any>([]);
  const [creatingLoading, setCreatingLoading] = useState(false);
  const [DisableBtn, setDisableBtn] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    GetFunction(('/sell/' + query.invoiceId) as string).then((result) => {
      setDataArr(result.data[0]?.sell_lines);
      setRenderData(result.data[0]);
      setRenderPaymentData(result.data[0]?.payment_lines);
      setLoading(false);
    });
  }, []);

  const onBlurQty = (id, newid) => {
    let unitPrice = id.unit_price_inc_tax;
    let subtotal = unitPrice * QtyValue?.[newid];
    setSabTotal({ ...sabTotal, [newid]: subtotal });

    function sum(obj) {
      var sum = 0;
      for (var el in obj) {
        if (obj.hasOwnProperty(el)) {
          sum += parseFloat(obj[el]);
        }
      }
      return sum;
    }
    var summed = sum({ ...sabTotal, [newid]: subtotal });
    settotalValue(summed);
  };

  const onchnageQty = (e, row) => {
    if (
      e.target.value > row.quantity ||
      e.target.value > row.quantity - row.quantity_returned
    ) {
      toast.error('Add a Valid Quantity');
    } else {
      setQtyValue({ ...QtyValue, [row.id]: e.target.value });
      setDisableBtn(false);
    }
  };

  const columns = [
    {
      title: t('form:product-name'),
      dataIndex: 'product',
      key: 'name',
      align: alignLeft,
      render: (product: any) => <span>{product?.name}</span>,
    },
    {
      title: t('table:table-item-unit-price'),
      dataIndex: 'unit_price_inc_tax',
      key: 'name',
      align: alignLeft,
      render: (unit_price_inc_tax: any) => <span>{unit_price_inc_tax}</span>,
    },
    {
      title: t('form:sell-quantity'),
      dataIndex: 'quantity',
      key: 'name',
      align: alignLeft,
      render: (quantity: any) => <span>{quantity}</span>,
    },
    {
      title: t('form:return-quantity'),
      dataIndex: 'quantity',
      key: 'id',
      width: 30,
      align: alignLeft,
      render: function Render(id: any, row: any) {
        return (
          <div>
            <Input
              value={QtyValue?.[row.id]}
              onChange={(e) => onchnageQty(e, row)}
              onBlur={() => onBlurQty(row, row.id)}
              name=""
            />
          </div>
        );
      },
    },
    {
      title: t('table:table-item-subtotal'),
      dataIndex: 'unit_price_inc_tax',
      key: 'id',
      align: alignRight,
      render: function Render(id: any, row: any) {
        return <span>{sabTotal?.[row.id]}</span>;
      },
    },
  ];

  const onSaveButton = () => {
    setCreatingLoading(true);
    let productDetails = DataArr.map((res: any) => {
      return {
        quantity: QtyValue?.[res.id] == '' ? 0 : QtyValue?.[res.id],
        unit_price_inc_tax: res.unit_price_inc_tax,
        sell_line_id: res.id,
        product_id: res.product_id,
        variation_id: res.variation_id,
      };
    });

    let formData = {
      transaction_id: DataArr[0].transaction_id,
      invoice_no: renderData?.invoice_no,
      transaction_date: renderData?.transaction_date,
      products: productDetails,
      discount_type: 'fixed',
      discount_amount: '0',
    };

    AddingSellReturnFunction('/add-return', formData).then((result) => {
      if (result.success) {
        toast.success(result.msg);
        setCreatingLoading(false);
        router.back();
      } else {
        toast.error(result.msg);
        setCreatingLoading(false);
      }
    });
  };

  if (loading) return <Loader text={t('common:text-loading')} />;

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
      </div>

      <div className="flex justify-end">
        <p>
          {t('form:return-total')}: {totalValue}
        </p>
      </div>
      <div className="flex justify-end">
        <Button
          disabled={DisableBtn}
          loading={creatingLoading}
          className="mt-5"
          onClick={onSaveButton}
        >
          {t('form:save')}
        </Button>
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
