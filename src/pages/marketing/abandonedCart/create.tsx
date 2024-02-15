import Layout from '@/components/layouts/admin';
import CreateAlerts from '@/components/abandonedCart/abandonedCart-form';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export default function CreateDevicePage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:add-new-alert')}
        </h1>
      </div>
      
      <CreateAlerts />
    </>
  );
}
CreateDevicePage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
