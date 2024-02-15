import Layout from '@/components/layouts/admin';
import SalesChannelForm from '@/components/salesChannel/salesChannel-from';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export default function CreateCategoriesPage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
      <h1 className="text-lg font-semibold text-heading">{t('common:text-sell-anywhere')}</h1>
      </div>
      <SalesChannelForm />
    </>
  );
}

CreateCategoriesPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
