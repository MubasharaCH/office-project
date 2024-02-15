import { useForm } from 'react-hook-form';
import Description from '@/components/ui/description';
import { AttachmentInput, Category, Type, TypeSettingsInput } from '@/types';
import { useTranslation } from 'next-i18next';
import SalesChannelCard from './salesChannel-card';
import { useState, useEffect } from 'react';
import React from 'react';
import { Routes } from '@/config/routes';
import { pos_url } from '@/services/Service';

type BannerInput = {
  title: string;
  description: string;
  image: AttachmentInput;
};

type FormValues = {
  name?: string | null;
  icon?: any;
  promotional_sliders: AttachmentInput[];
  banners: BannerInput[];
  settings: TypeSettingsInput;
  description: string | null;
  short_code: string | null;
  cat_image: any;
};

export default function CreateOrUpdateTypeForm() {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    control,
    getValues,

    formState: { errors },
  } = useForm<FormValues>({
    //@ts-ignore
  });

  return (
    <>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('common:text-sell-on-storeFront')}
          details={t('common:sell-on-website-description')
          }
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <SalesChannelCard
          src={
            'https://app.shopiroller.com/assets/media/images/rocket_multi.png'
          }
          title={t('common:text-storefront')}
          description={t('common:website-description')
          }
          buttonName={t('common:button-text-manage')}
          disabled={false}
          href={'../settings/storesSettings'}
        />
      </div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('common:text-point-of-sale')}
          details={t('common:point-of-sale-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <SalesChannelCard
          src={
            'data:image/png;base64,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'
          }
          title={t('common:text-point-of-sale')}
          description={t('common:point-of-sale-description')}
          buttonName={t('common:button-text-start')}
          disabled={false}
          href= {pos_url}
        />
      </div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('common:text-get-paid-link')}
          details={t('common:get-link-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <SalesChannelCard
          src={'https://app.shopiroller.com/assets/media/images/link_multi.png'}
          title={t('common:text-pay-link')}
          description={t('common:link-description')}
          buttonName={t('common:button-text-start')}
          disabled={false}
          href={'sales/' + Routes.invoice.create}
        />
      </div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('common:text-sell-on-mobile')}
          details={t('common:sell-mobile-description')
          }
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <SalesChannelCard
          src={
            'https://app.shopiroller.com/assets/media/images/mobile_multi.png'
          }
          title={t('common:text-android-ios')}
          description={t('common:android-description')
          }
          buttonName={t('common:button-text-manage')}
          disabled={false}
          href={'/mobileApp'}
        />
      </div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('')}
          details={t('')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <SalesChannelCard
          src={
            'https://app.shopiroller.com/assets/media/images/mobile_sdk_multi.png'
          }
          title={t('common:text-sdk-integration')}
          description={t('common:sdk-description')
          }
          buttonName={t('common:button-text-coming-soon')}
          disabled={true}
          href={'#'}
        />
      </div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('common:text-sell-on-socialmedia')}
          details={t('common:social-media-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <SalesChannelCard
          src={'https://app.shopiroller.com/assets/media/images/facebook.png'}
          title={t('common:text-facebook-shop')}
          description={t('common:facebook-description')
          }
          buttonName={t('common:button-text-coming-soon')}
          disabled={true}
          href={'#'}
        />
      </div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('')}
          details={t('')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <SalesChannelCard
          src={'https://app.shopiroller.com/assets/media/images/instagram.png'}
          title={t('common:text-instagram-shopping')}
          description={t('common:instagram-description')
          }
          buttonName={t('common:button-text-coming-soon')}
          disabled={true}
          href={'#'}
        />
      </div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('')}
          details={t('')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <SalesChannelCard
          src={
            'data:image/jpeg;base64,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'
          }
          title={t('common:text-whatsapp')}
          description={t('common:whatsapp-description')

          }
          buttonName={t('common:button-text-coming-soon')}
          disabled={true}
          href={'#'}
        />
      </div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('')}
          details={t('')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <SalesChannelCard
          src={
            'https://static.vecteezy.com/system/resources/previews/006/057/996/original/tiktok-logo-on-transparent-background-free-vector.jpg'
          }
          title={t('common:text-tiktok')}
          description={t('common:tiktok-description')
          }
          buttonName={t('common:button-text-coming-soon')}
          disabled={true}
          href={'#'}
        />
      </div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('common:text-sell-on-online-markete')}
          details={t('common:marketplace-description')
          }
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <SalesChannelCard
          src={'https://app.shopiroller.com/assets/media/images/google.png'}
          title={t('common:text-google-shopping')}
          description={t('common:google-description')
          }
          buttonName={t('common:button-text-coming-soon')}
          disabled={true}
          href={'#'}
        />
      </div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('')}
          details={t('')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <SalesChannelCard
          src={'https://app.shopiroller.com/assets/media/images/amazon.png'}
          title={t('common:text-amazon')}
          description={t('common:amazon-description')
          }
          buttonName={t('common:button-text-coming-soon')}
          disabled={true}
          href={'#'}
        />
      </div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('')}
          details={t('')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <SalesChannelCard
          src={
            'data:image/png;base64,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'
          }
          title={t('common:text-etsy')}
          description={t('common:etsy-description')
          }
          buttonName={t('common:button-text-coming-soon')}
          disabled={true}
          href={'#'}
        />
      </div>

      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('')}
          details={t('')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <SalesChannelCard
          src={
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStOzdxbI5JMma6iR-dNxVOo6ms2FU7dBTIr-qjDio&usqp=CAU'
          }
          title={t('common:text-ebay')}
          description={t('common:ebay-description')
          }
          buttonName={t('common:button-text-coming-soon')}
          disabled={true}
          href={'#'}
        />
      </div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('')}
          details={t('')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <SalesChannelCard
          src={
            'https://1000logos.net/wp-content/uploads/2021/07/Daraz-Logo.jpg'
          }
          title={t('common:text-daraz')}
          description={t('common:daraz-description')

          }
          buttonName={t('common:button-text-coming-soon')}
          disabled={true}
          href={'#'}
        />
      </div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('')}
          details={t('')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <SalesChannelCard
          src={
            'https://www.absolutegeeks.com/wp-content/uploads/2016/11/noon-logo-horizontal-yellow.png'
          }
          title={t('common:text-noon')}
          description={t('common:noon-description')

          }
          buttonName={t('common:button-text-coming-soon')}
          disabled={true}
          href={'#'}
        />
      </div>
    </>
  );
}
