import React, { useState } from 'react';
import { IosArrowDown } from '@/components/icons/ios-arrow-down';
import { IosArrowUp } from '@/components/icons/ios-arrow-up';
import { useTranslation } from 'next-i18next';
import DashboardInner from './DashboardInnerCmp';
import { DollarIcon } from '../icons/shops/dollar';
import { RightIcon } from '../icons/shops/Right';
import { TickIcon } from '../icons/shops/tickIco';
import { CopyIcon } from '../icons/shops/copyIcon';
import { IoCopy } from 'react-icons/io5';
import {
  MdContentCopy,
  MdPayment,
  MdOutlineDone,
  MdOnlinePrediction,
} from 'react-icons/md';
import { IoIosAdd } from 'react-icons/io';
import { RiProductHuntLine, RiUserFollowLine } from 'react-icons/ri';
import { BsArrowRight } from 'react-icons/bs';
import Router from 'next/router';
import { Routes } from '@/config/routes';
import { FaBusinessTime, FaShippingFast } from 'react-icons/fa';
import { BiCategory } from 'react-icons/bi';
import { TbReceiptTax } from 'react-icons/tb';
import { AddingUserFunction } from '@/services/Service';
import { toast } from 'react-toastify';

const DashboardSetUp = ({
  titleTransKey,
  data,
  callinggAPI,
  setloadingData,
}: any) => {
  const onActionPress = (pathName) => {
    Router.push(pathName);
  };
  const onMarkDone = (name) => {
    setloadingData(true);
    let obj = {
      [name]: true,
    };

    AddingUserFunction('/enable-business-setup', obj).then((result) => {
      if (result.success) {
        callinggAPI();
        setloadingData(true);
      } else {
        toast.error(result.message);
        setloadingData(true);
      }
    });
  };
  const { t } = useTranslation('common');
  return (
    <>
      {data?.business_setup?.managebusiness &&
      data?.business_setup?.setupstore &&
      data?.business_setup?.setuppayment &&
      data?.business_setup?.setupshiping &&
      data?.business_setup?.setupcategory &&
      data?.business_setup?.setuptax &&
      data?.business_setup?.setupproduct ? (
        ''
      ) : (
        <div className="flex h-full w-full flex-col rounded bg-light p-7">
          <div className="mb-auto flex w-full justify-between pb-8">
            <div className="flex flex-col">
              <span className="mb-1 text-base font-semibold text-heading">
                {titleTransKey}
              </span>
            </div>
          </div>
          <div>
            <DashboardInner
              onPress={() => onActionPress('/settings/businessSettings')}
              onMarkDone={() => onMarkDone('managebusiness')}
              icon={<FaBusinessTime color="#B5B5C3" className="h-6 w-6" />}
              rightIcon={<BsArrowRight className="h-7 w-7" color="#B5B5C3" />}
              tickIcon={<MdOutlineDone className="h-7 w-7" color="#fff" />}
              iconBgStyle={{ backgroundColor: '#fff' }}
              tickIconBgStyle={{ backgroundColor: '#3699FF' }}
              rightIconBgStyle={{ backgroundColor: '#B5B5C3' }}
              comText={t('common:review-business-setting')}
              comTextTitle={t('common:fill-business-setting')}
              changeIcon={
                data?.business_setup?.managebusiness == false ? false : true
              }
            />
          </div>
          <div className="mt-5">
            <DashboardInner
              onMarkDone={() => onMarkDone('setupstore')}
              onPress={() => onActionPress('/settings/storesSettings')}
              icon={<MdOnlinePrediction className="h-7 w-7" color="#B5B5C3" />}
              rightIcon={<BsArrowRight className="h-7 w-7" color="#B5B5C3" />}
              tickIcon={<MdOutlineDone className="h-7 w-7" color="#fff" />}
              iconBgStyle={{ backgroundColor: '#fff' }}
              tickIconBgStyle={{ backgroundColor: '#3699FF' }}
              rightIconBgStyle={{ backgroundColor: '#B5B5C3' }}
              comText={t('common:setup-online-storefront')}
              comTextTitle={t('common:web-mobile-more')}
              changeIcon={
                data?.business_setup?.setupstore == false ? false : true
              }
            />
          </div>
          <div className="mt-5">
            <DashboardInner
              onMarkDone={() => onMarkDone('setuppayment')}
              onPress={() => onActionPress('/settings/payment')}
              icon={<MdPayment className="h-7 w-7" color="#B5B5C3" />}
              rightIcon={<BsArrowRight className="h-7 w-7" color="#B5B5C3" />}
              tickIcon={<MdOutlineDone className="h-7 w-7" color="#fff" />}
              iconBgStyle={{ backgroundColor: '#fff' }}
              tickIconBgStyle={{ backgroundColor: '#3699FF' }}
              rightIconBgStyle={{ backgroundColor: '#B5B5C3' }}
              comText={t('common:payment-setup')}
              comTextTitle={t('common:accept-payment')}
              changeIcon={
                data?.business_setup?.setuppayment == false ? false : true
              }
            />
          </div>
          <div className="mt-5">
            <DashboardInner
              onMarkDone={() => onMarkDone('setupshiping')}
              onPress={() => onActionPress('/settings/igniteShip')}
              icon={<FaShippingFast className="h-7 w-7" color="#B5B5C3" />}
              rightIcon={<BsArrowRight className="h-7 w-7" color="#B5B5C3" />}
              tickIcon={<MdOutlineDone className="h-7 w-7" color="#fff" />}
              iconBgStyle={{ backgroundColor: '#fff' }}
              tickIconBgStyle={{ backgroundColor: '#3699FF' }}
              rightIconBgStyle={{ backgroundColor: '#B5B5C3' }}
              comText={t('common:setup-shipping')}
              comTextTitle={t('common:shipping-method')}
              changeIcon={
                data?.business_setup?.setupshiping == false ? false : true
              }
            />
          </div>
          <div className="mt-5">
            <DashboardInner
              onMarkDone={() => onMarkDone('setupcategory')}
              onPress={() => onActionPress('/catalog/categories')}
              icon={<BiCategory className="h-7 w-7" color="#B5B5C3" />}
              rightIcon={<BsArrowRight className="h-7 w-7" color="#B5B5C3" />}
              tickIcon={<MdOutlineDone className="h-7 w-7" color="#fff" />}
              iconBgStyle={{ backgroundColor: '#fff' }}
              tickIconBgStyle={{ backgroundColor: '#3699FF' }}
              rightIconBgStyle={{ backgroundColor: '#B5B5C3' }}
              comText={t('common:setup-category')}
              comTextTitle={t('common:setup-product-category')}
              changeIcon={
                data?.business_setup?.setupcategory == false ? false : true
              }
            />
          </div>
          <div className="mt-5">
            <DashboardInner
              onMarkDone={() => onMarkDone('setuptax')}
              onPress={() => onActionPress('/settings/tax')}
              icon={<TbReceiptTax className="h-7 w-7" color="#B5B5C3" />}
              rightIcon={<BsArrowRight className="h-7 w-7" color="#B5B5C3" />}
              tickIcon={<MdOutlineDone className="h-7 w-7" color="#fff" />}
              iconBgStyle={{ backgroundColor: '#fff' }}
              tickIconBgStyle={{ backgroundColor: '#3699FF' }}
              rightIconBgStyle={{ backgroundColor: '#B5B5C3' }}
              comText={t('common:setup-tax')}
              comTextTitle={t('common:setup-tax-here')}
              changeIcon={
                data?.business_setup?.setuptax == false ? false : true
              }
            />
          </div>
          <div className="mt-5">
            <DashboardInner
              onMarkDone={() => onMarkDone('setupproduct')}
              onPress={() => onActionPress('/catalog/products')}
              icon={<RiProductHuntLine className="h-7 w-7" color="#B5B5C3" />}
              rightIcon={<BsArrowRight className="h-7 w-7" color="#B5B5C3" />}
              tickIcon={<MdOutlineDone className="h-7 w-7" color="#fff" />}
              iconBgStyle={{ backgroundColor: '#fff' }}
              tickIconBgStyle={{ backgroundColor: '#3699FF' }}
              rightIconBgStyle={{ backgroundColor: '#B5B5C3' }}
              comText={t('common:add-first-product')}
              comTextTitle={t('common:adding-name-product')}
              changeIcon={
                data?.business_setup?.setupproduct == false ? false : true
              }
            />
          </div>

          {/* <div className="mt-5">
            <DashboardInner
              onPress={() => onActionPress('/sales/invoice')}
              icon={<DollarIcon className="h-7 w-7" color="#B5B5C3" />}
              rightIcon={<BsArrowRight className="h-7 w-7" color="#B5B5C3" />}
              tickIcon={<MdOutlineDone className="h-7 w-7" color="#fff" />}
              iconBgStyle={{ backgroundColor: '#fff' }}
              tickIconBgStyle={{ backgroundColor: '#3699FF' }}
              rightIconBgStyle={{ backgroundColor: '#B5B5C3' }}
              comText="Make your first sale!"
              comTextTitle="hip your first sale and product to your customers."
              changeIcon={InvoiceLenght == 0 ? false : true}
            />
          </div> */}
        </div>
      )}
    </>
  );
};

export default DashboardSetUp;
