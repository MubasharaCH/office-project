import { Table } from '@/components/ui/table';
import { SortOrder, Type, SubsciptionData } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { Routes } from '@/config/routes';
import { useState } from 'react';
import React from 'react';
import { AddingBillingFunction, GetFunction } from '@/services/Service';
import PackageIcon from '../../assets/images/4730393.png';
import Image from 'next/image';
import { log } from 'console';
import { toast } from 'react-toastify';
import Description from '../ui/description';
import Input from '../ui/input';
import Card from '../common/card';
import Button from '../ui/button';

export type IProps = {
  listOfBrands: SubsciptionData[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const PackageList = (list: any) => {
  const [createLoading, setCreateLoading] = useState<any>(false);
  const [btnIndex, setBtnIndex] = useState<any>(false);
  const { t } = useTranslation();

  const subcribePackage = (e, index) => {
    setBtnIndex(index);
    setCreateLoading(true);
    var form = new FormData();
    // console.log(e);
    form.append('plan_id', e?.id);
    AddingBillingFunction('/pabbly/create-subscription', form).then(
      (result) => {
        //  window.location.reload();
        if (result?.success == true) {
          toast.success(result.message);
          setCreateLoading(false);
          // window.location.reload()
        } else {
          toast.error(result.message);
          setCreateLoading(false);
        }
      }
    );
  };

  // console.log(list.list)

  return (
    <>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:form-label-plans')}
          details={t('form:form-label-subscribe-plan')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="py-2 font-bold">Plan Details</div>
          <div className="p-4 border-t border-b grid grid-cols-3 gap-8">
            <div className="font-bold">Plan Name</div>
            <div className="font-bold">Price</div>
          </div>
          {list?.list?.map((plan: any, index: any) => (
            <div
              className="p-4 border-t border-b grid grid-cols-3 gap-8"
              key={index}
            >
              <div className="flex flex-col">
                <span className="text-sm text-white bg-accent rounded w-fit p-1">
                  {plan?.plan_active === 'true' ? 'Active' : 'InActive'}
                </span>
                <span className="py-2 font-bold">{plan?.plan_name}</span>
              </div>
              <div className="flex flex-col">
                <span className="">
                  {plan?.currency_symbol + plan?.price.toFixed(2)}
                </span>
                <span className="py-1 text-sm font-bold">
                  {plan?.plan_name}
                </span>
                {/* <span className="py-1 text-sm font-bold">{plan?.plan_type}</span> */}
              </div>
              <div className="flex flex-col">
                <Button
                  id={index}
                  loading={index == btnIndex ? createLoading : ''}
                  onClick={() => {
                    subcribePackage(plan, index);
                  }}
                  className="group flex h-7 w-auto items-center justify-between rounded bg-gray-100 text-xs  transition-colors hover:border-accent hover:bg-accent hover:text-light focus:border-accent  focus:outline-none md:h-9 md:text-sm"
                >
                  <span className="flex-1">{t('Subscribe')}</span>
                </Button>
              </div>
            </div>
          ))}
        </Card>
      </div>
      {/* <div style={{ marginBottom: '10px' }}>
        <h1 className="text-xl font-semibold text-heading">{t('common:packages')}</h1>
      </div>
      <div className="mb-8 overflow-hidden rounded shadow">
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {list?.list?.map((item, index) => (
            <div key={index} className="cart-type-neon h-full overflow-hidden rounded border border-border-200 bg-light shadow-sm transition-all duration-200 hover:shadow-md">

              <div className="relative flex h-30 w-auto items-center justify-center sm:h-60">
                <span className="sr-only">{t('text-product-image')}</span>
                <img alt='img' src={PackageIcon.src} style={{ margin: '0 auto', minHeight: '55%' }}
                  className="product-image" />
                <div className="end-3 md:end-4 absolute top-3 rounded bg-accent px-1.5 text-xs font-semibold leading-6 text-light sm:px-2 md:top-4 md:px-2.5">
                  <span>  {item.price != '0.0000' ? item.price+" " +item.currency_symbol : ''}</span>
                  <span style={{ fontSize: '9px' }}>{item.price != '0.0000' ? item.interval : ''}</span>
                </div>
              </div>

              <header className="p-3 md:p-6">
                <div className="mb-2 ">
                  <span className="text-sm  font-semibold text-heading md:text-base">
                    {item.plan_name}
                  </span>

                </div>
                <h3 className="mb-4 truncate text-xs text-body md:text-sm ">{item.description}</h3>
                <ol style={{ marginLeft: '15px', listStyle: 'inside' }}>
                  <li className="mb-4 truncate text-xs text-body md:text-sm">{item.location_count == 0 ? 'Unlimited' : item.location_count} Business Locations</li>
                  <li className="mb-4 truncate text-xs text-body md:text-sm">{item.user_count == 0 ? 'Unlimited' : item.user_count} Users</li>
                  <li className="mb-4 truncate text-xs text-body md:text-sm">{item.product_count == 0 ? 'Unlimited' : item.product_count} Products</li>
                  <li className="mb-4 truncate text-xs text-body md:text-sm">{item.invoice_count == 0 ? 'Unlimited' : item.invoice_count} Invoices</li>
                  {item.trial_days != 0 ? <li className="mb-4 truncate text-xs text-body md:text-sm">{item.trial_days}  Trial Days</li> : ''}
          </ol> 
                <button
                  onClick={()=>{subcribePackage(item)}}
                  className="group flex h-7 w-full items-center justify-between rounded bg-gray-100 text-xs text-body-dark transition-colors hover:border-accent hover:bg-accent hover:text-light focus:border-accent focus:bg-accent focus:text-light focus:outline-none md:h-9 md:text-sm"
                >
                  <span className="flex-1">{t('Subscribe')}</span>
                </button>
              </header>
            </div>
          )
          )}
        </div>
      </div> */}
    </>
  );
};

export default PackageList;
