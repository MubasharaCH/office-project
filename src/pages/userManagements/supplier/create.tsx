import Layout from '@/components/layouts/admin';
import CreateOrUpdateTypeForm from '@/components/supplier/supplier-form';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export default function CreateTypePage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-create-supplier')}
        </h1>
      </div>
      <CreateOrUpdateTypeForm />
    </>
  );
}
CreateTypePage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
