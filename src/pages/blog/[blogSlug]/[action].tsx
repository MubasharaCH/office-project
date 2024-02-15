import Layout from '@/components/layouts/admin';
import CreateOrUpdateCategoriesForm from '@/components/blog/blog/blog-form';
import { useRouter } from 'next/router';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useCategoryQuery } from '@/data/category';
import { Config } from '@/config';
import { useEffect, useState } from 'react';
import { GetSpecificFunction } from '@/services/Service';

export default function UpdateCategoriesPage() {
  const [ListData, setListData] = useState([]);
  const [loadingData, setloadingData] = useState(false);

  const { query, locale } = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    setloadingData(true);
  
    GetSpecificFunction('/get-blog',query.blogSlug as string).then(
      (result) => {
        if (result) {
         console.log(result)
          setListData(result.data);
          setloadingData(false);
        }
      }
    );
  }, []);
  if (loadingData) return <Loader text={t('common:text-loading')} />;
  // if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-edit-blog-category')}
        </h1>
      </div>

      <CreateOrUpdateCategoriesForm initialValues={ListData} />
    </>
  );
}

UpdateCategoriesPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
