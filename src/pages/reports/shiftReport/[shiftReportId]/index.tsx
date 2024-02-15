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
import { useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { clearCheckoutAtom } from '@/contexts/checkout';
import { useOrderStatusesQuery } from '@/data/order-status';
import { GetFunction } from '@/services/Service';
import ReactToPrint from 'react-to-print';

export default function OrderDetailsPage() {
  const { t } = useTranslation();
  const { query, locale } = useRouter();
  const { alignLeft, alignRight, isRTL } = useIsRTL();
  const [methods, setMethods] = useState<any>({});
  const [renderData, setRenderData] = useState<any>();
  const [shift, setShift] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    GetFunction(('/shift-detail/' + query.shiftReportId) as string).then(
      (result) => {
        setMethods(result?.methods);
        setShift(result?.shift);
        //   setDataArr(result.data[0]?.sell_lines);
        //   setRenderData(result.data[0]);
        //   setRenderPaymentData(result.data[0]?.payment_lines);
        setLoading(false);
      }
    );
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
  const tableRef = useRef(null);

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

  return (
    <Card>
      {/* <div className="flex flex-col items-center lg:flex-row"> */}
      <div className="p-2">
        <div className="flex justify-end">
          <ReactToPrint
            trigger={() => <Button className="right-px">{t('form:print')}</Button>}
            content={() => tableRef.current}
          />
        </div>
        <div ref={tableRef} className="pt-5">
          <div className="flex justify-between">
            <div className="flex flex-col">
              {' '}
              <span className="text-sm text-body">{t('form:opening-amount')}</span>{' '}
              <span className="flex justify-center">
                {Number(shift?.opening_amount).toFixed(2)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-body">{t('form:closing-amounts')}</span>{' '}
              <span className="flex justify-center">
                {Number(shift?.closing_amount).toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex justify-between mt-5 mb-5">
            <div className="flex flex-col">
              {' '}
              <span className="text-sm text-body">{t('form:opening-date')}</span>{' '}
              <span className="flex justify-center">{shift?.created_at}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-body">{t('form:closing-date')}</span>{' '}
              <span className="flex justify-center">{shift?.closed_at}</span>
            </div>
          </div>
          <div className="p-2">
            <h3 className="flex justify-center font-bold">
           {t('form:payment-type-report')}
            </h3>
            <div className="flex justify-between p-2 ">
              <div className="flex flex-col">
                <div>{t('form:payment-type')}</div>
              </div>
              <div className="flex flex-col">
                <div>{t('form:input-label-amount')}</div>
              </div>
            </div>
            <div className="flex justify-between  border-b p-2">
              {methods?.total_advance != 0 && (
                <>
                  <div className="flex flex-col">
                    <div>Advance</div>{' '}
                  </div>
                  <div className="flex flex-col">
                    <div>{methods?.total_advance}</div>
                  </div>
                </>
              )}
              {methods?.total_card != 0 && (
                <>
                  <div className="flex flex-col">
                    <div>Card</div>{' '}
                  </div>
                  <div className="flex flex-col">
                    <div>{methods?.total_card}</div>
                  </div>
                </>
              )}
              {methods?.total_bank_transfer != 0 && (
                <>
                  <div className="flex flex-col">
                    <div>Bank Transfer</div>{' '}
                  </div>
                  <div className="flex flex-col">
                    <div>{methods?.total_bank_transfer}</div>
                  </div>
                </>
              )}
              {methods?.total_cash != 0 && (
                <>
                  <div className="flex flex-col">
                    <div>Cash</div>{' '}
                  </div>
                  <div className="flex flex-col">
                    <div>{methods?.total_cash}</div>
                  </div>
                </>
              )}
              {methods?.total_cheque != 0 && (
                <>
                  <div className="flex flex-col">
                    <div>Cheque</div>{' '}
                  </div>
                  <div className="flex flex-col">
                    <div>{methods?.total_cheque}</div>
                  </div>
                </>
              )}
              {methods?.total_custom_pay_1 != 0 && (
                <>
                  <div className="flex flex-col">
                    <div>Custom Pay1</div>{' '}
                  </div>
                  <div className="flex flex-col">
                    <div>{methods?.total_custom_pay_1}</div>
                  </div>
                </>
              )}
              {methods?.total_custom_pay_2 != 0 && (
                <>
                  <div className="flex flex-col">
                    <div>Custom Pay2</div>{' '}
                  </div>
                  <div className="flex flex-col">
                    <div>{methods?.total_custom_pay_2}</div>
                  </div>
                </>
              )}
              {methods?.total_custom_pay_3 != 0 && (
                <>
                  <div className="flex flex-col">
                    <div>Custom Pay3</div>{' '}
                  </div>
                  <div className="flex flex-col">
                    <div>{methods?.total_custom_pay_3}</div>
                  </div>
                </>
              )}
              {methods?.total_custom_pay_4 != 0 && (
                <>
                  <div className="flex flex-col">
                    <div>Custom Pay4</div>{' '}
                  </div>
                  <div className="flex flex-col">
                    <div>{methods?.total_custom_pay_4}</div>
                  </div>
                </>
              )}
              {methods?.total_custom_pay_5 != 0 && (
                <>
                  <div className="flex flex-col">
                    <div>Custom Pay5</div>{' '}
                  </div>
                  <div className="flex flex-col">
                    <div>{methods?.total_custom_pay_5}</div>
                  </div>
                </>
              )}
              {methods?.total_custom_pay_6 != 0 && (
                <>
                  <div className="flex flex-col">
                    <div>Custom Pay6</div>{' '}
                  </div>
                  <div className="flex flex-col">
                    <div>{methods?.total_custom_pay_6}</div>
                  </div>
                </>
              )}
              {methods?.total_custom_pay_7 != 0 && (
                <>
                  <div className="flex flex-col">
                    <div>Custom Pay7</div>{' '}
                  </div>
                  <div className="flex flex-col">
                    <div>{methods?.total_custom_pay_7}</div>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-between  border-b p-2">
              <div className="flex flex-col">
                <div className="font-bold">{t('form:input-label-total')}</div>{' '}
              </div>
              <div className="flex flex-col">
                <div>{methods?.total_sale}</div>
              </div>
            </div>
            <div className="flex justify-between  border-b p-2">
              <div className="flex flex-col">
                <div className="font-bold">{t('form:credit-note')}</div>{' '}
              </div>
              <div className="flex flex-col">
                <div>{Number(methods?.total_refund)}</div>{' '}
              </div>
            </div>
            <div className="flex justify-between  border-b p-2">
              <div className="flex flex-col">
                <div className="font-bold">{t('form:net-total')}</div>{' '}
              </div>
              <div className="flex flex-col">
                <div>{methods?.total_sale - methods?.total_refund}</div>
              </div>
            </div>
          </div>
          <div className="p-2">
            <h3 className="flex justify-center font-bold">{t('form:detail-report')}</h3>
            <div className="flex justify-between p-2 ">
              <div className="flex flex-col">
                <div className="font-bold">{t('form:invoice')}#</div>
              </div>
              <div className="flex flex-col">
                <div className="font-bold">{t('form:input-label-amount')}</div>
              </div>
            </div>
            <div>
              {shift?.cash_register_transactions?.map((item: any, index: any) =>
                item?.transaction_type === 'sell' && item?.type === 'credit' ? (
                  <div
                    key={index}
                    className="flex justify-between  border-b p-2"
                  >
                    <div className="flex flex-col">
                      <div>{item?.invoice_no}</div>{' '}
                    </div>
                    <div className="flex flex-col">
                      <div>{Number(item?.final_total).toFixed(2)}</div>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>
      </div>

      {/* </div> */}
    </Card>
  );
}
OrderDetailsPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'form', 'table'])),
  },
});
