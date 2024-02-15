import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import { useRouter } from 'next/router';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Label from '@/components/ui/label';
import { useEffect, useState } from 'react';
import {
  GetBusinessDetail,
  GetFunction,
  GetFunctionBDetail,
} from '@/services/Service';
import React from 'react';

export default function OrderDetailsPage() {
  const [PackagesList, setPackagesList] = useState<any>([]);
  const [loadingData, setloadingData] = useState(true);
  const [currency, setCurrency] = useState<any>(true);
  const [totalAmount, setTotalAmount] = useState();
  const { t } = useTranslation();

  useEffect(() => {
    setloadingData(true);
    GetFunction('/pabbly/get-client-urls').then((result) => {
      if (result?.data?.client_protal_url) {
        const url = result?.data?.client_protal_url;
        if (url) {
          setloadingData(true);
          GetFunction('/pabbly/subscriptions-and-related-addons').then(
            (result) => {
              //  console.log(result);

              setPackagesList(result?.data.customer_subscriptions);
              let total = 0;
              result?.data.customer_subscriptions[0].addons?.map(
                (item: any) => {
                  total += item.price;
                }
              );

              let newTotal =
                total + result?.data.customer_subscriptions[0].plan.price;
              setTotalAmount(newTotal);

              setloadingData(false);
            }
          );
        }
      }
    });
    // setTimeout(() => {

    // }, 3000);
  }, []);

  React.useEffect(() => {
    let businessDetails: any = localStorage.getItem('business_details');
    setCurrency(JSON.parse(businessDetails));
  }, []);

  const businessNameItem = PackagesList[0]?.custom_fields?.find(
    (item) => item.name === 'business_name'
  );
  if (loadingData) return <Loader text={t('common:text-loading')} />;
  return (
    <>
      <Card>
        {businessNameItem && (
          <Label className="text-lg ">{businessNameItem.value}</Label>
        )}

        <div className="text-sm text-slate-600">
          {PackagesList[0]?.email_id}
        </div>
      </Card>
      <div className="lg:grid lg:grid-cols-12 lg:gap-2 py-2">
        <div className="flex lg:col-span-8">
          <Card className="mt-5 w-full ">
            <Label>{t('common:subscription-information')}</Label>
            <div className="flex justify-between border-t-2 border-dashed pt-3 pb-3">
              <div className=" text-sm text-slate-600">
                {' '}
                {PackagesList[0]?.plan?.plan_name}
              </div>
              <div className="text-sm flex  text-slate-600 ">
                {' '}
                {PackagesList[0]?.plan?.price} {currency?.symbol}
              </div>
            </div>
            {PackagesList &&
              PackagesList[0]?.addons?.map((res, i) => {
                return (
                  <div
                    key={i}
                    className="flex justify-between border-t-2 border-dashed pt-3 pb-3"
                  >
                    <div className="text-sm text-slate-600">
                      {res.quantity} x {res.name}
                    </div>
                    <div className="text-sm text-slate-600">
                      {res.price} {currency?.symbol}
                    </div>
                  </div>
                );
              })}
            <div className="flex justify-between border-t-2 border-dashed pt-3 pb-3">
              <div className="text-md font-semibold text-accent-600">
                {t('common:subscription-amount')}:
              </div>
              <div className="text-md font-semibold text-accent-600">
                {totalAmount} {currency?.symbol}
              </div>
            </div>
          </Card>
        </div>
        <div className="lg:col-span-4">
          <Card className="mt-5">
            <Label>{t('common:plan-description')}</Label>
            <div className="col-span-9 text-sm text-slate-600">
              {' '}
              <div
                dangerouslySetInnerHTML={{
                  __html: `${PackagesList[0]?.plan?.plan_description}`,
                }}
              />{' '}
            </div>
          </Card>
        </div>
      </div>
      {/* <Card className="mt-5">
        <div>
          <Label>Subscription Information</Label>
          <div className="grid grid-cols-12 justify-between border-t-2 border-dashed pt-3 pb-3">

            <div className="col-span-2 text-sm text-slate-600"> {PackagesList[0]?.plan?.plan_name}</div>
            <div className="col-span-9 text-sm text-slate-600">   <div
              dangerouslySetInnerHTML={{ __html: `${PackagesList[0]?.plan?.plan_description}` }}
            /> </div>


            <div className="text-sm flex justify-end text-slate-600 col-span-1"> {PackagesList[0]?.plan?.price} {currency?.symbol}</div>
          </div>
          {PackagesList &&
            PackagesList[0]?.addons?.map((res, i) => {
              return (
                <div key={i} className="flex justify-between border-t-2 border-dashed pt-3 pb-3">
                  <div className="text-sm text-slate-600">{res.quantity} x {res.name}</div>
                  <div className="text-sm text-slate-600">{res.calculated_amount} {currency?.symbol}</div>
                </div>
              );
            })}
          <div className="flex justify-between border-t-2 border-dashed pt-3 pb-3">
            <div className="text-md font-semibold text-accent-600">Subscription Amount:</div>
            <div className="text-md font-semibold text-accent-600">{totalAmount} {currency?.symbol}</div>
          </div>
        </div>
      </Card> */}
    </>
  );
}
OrderDetailsPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'form', 'table'])),
  },
});
