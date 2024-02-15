import Layout from '@/components/layouts/admin';
import AuthorCreateOrUpdateForm from '@/components/variant/author-form';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminOnly } from '@/utils/auth-utils';
import { GetStaticProps } from 'next';
import { useAuthorQuery } from '@/data/author';
import { Config } from '@/config';
import { useEffect, useState } from 'react';
import { GetSpecificFunction, GetVariation } from '@/services/Service';

export default function UpdateAuthorPage() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  const { author, loading, error } = useAuthorQuery({
    slug: query.authorSlug as string,
    language:
      query.action!.toString() === 'edit' ? locale! : Config.defaultLanguage,
  });
  const [loadingData, setloadingData] = useState(false);
  const [ListData, setListData] = useState([]);
  useEffect(() => {
    setloadingData(true);
    GetVariation('/get_variations/', query.variantSlug).then((result) => {
      if (result) {
        setListData(result.data);
        setloadingData(false);
      }
    });
  }, []);
  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('common:add-variant')}
        </h1>
      </div>
      <AuthorCreateOrUpdateForm initialValues={ListData} />
    </>
  );
}
UpdateAuthorPage.authenticate = {
  permissions: adminOnly,
};
UpdateAuthorPage.Layout = Layout;

export const getServerSideProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['form', 'common'])),
  },
});
