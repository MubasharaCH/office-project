import Layout from '@/components/layouts/admin';
import { useRouter } from 'next/router';
import CreateOrUpdateTypeForm from '@/components/invoiceLayout/invoiceLayout-form'
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTypeQuery } from '@/data/type';
import { Config } from '@/config';
import { useEffect, useState } from 'react';
import { GetFunction } from '@/services/Service';

export default function UpdateTypePage() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  // console.log(query)
  const[invoiceLayout,setInvoiceLayout]=useState<any>([])
  const[isLoading,setIsLoading]=useState(false)
  const {
    data,
    // isLoading: loading,
    error,
  } = useTypeQuery({
    slug: query.groupSlug as string,
    language:
      query.action!.toString() === 'edit' ? locale! : Config.defaultLanguage,
  });

useEffect(()=>{
  setIsLoading(true)
  let userDetail: any = localStorage.getItem('user_business_details');
  let parsingUserDetail = JSON.parse(userDetail);
  GetFunction('/invoice-layouts?business_id=' + parsingUserDetail?.id).then(
    (result) => {
      let invoiceLayout=result?.data.filter((item)=>{
        
        if(item.id==query?.InvoiceLayoutSlug){
          return item
        }
      })
    //  console.log(invoiceLayout,'dlfdsjlfjld')
     setInvoiceLayout(invoiceLayout)
     setIsLoading(false)
    }
  );
},[])


  if (isLoading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-edit-location')}
        </h1>
      </div>
      <CreateOrUpdateTypeForm initialValues={invoiceLayout[0]} />
    </>
  );
}
UpdateTypePage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
