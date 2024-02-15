import Layout from '@/components/layouts/admin';
import RoleCreateForm from '@/components/roles/role-form';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

export default function CreateCustomerPage() {
  const { t } = useTranslation();
  const { query, locale } = useRouter();
  const slug = query.roleSlug;

  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('common:create-new-role')}
        </h1>
      </div>
      <RoleCreateForm />
    </>
  );
}
CreateCustomerPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'form', 'common'])),
  },
});
