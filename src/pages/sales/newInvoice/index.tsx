import Layout from '@/components/layouts/admin';
import CreateOrUpdateTypeForm from '@/components/invoice/invoice-form-new';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export default function CreateTypePage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:create-new-invoices')}
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
