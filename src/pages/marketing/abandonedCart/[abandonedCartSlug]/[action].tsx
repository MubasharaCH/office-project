import Layout from '@/components/layouts/admin';
import { useRouter } from 'next/router';
import UpdateAlertForm from '@/components/abandonedCart/abandonedCart-form';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTypeQuery } from '@/data/type';
import { Config } from '@/config';
import { useEffect, useState } from 'react';
import { GetSpecificFunction } from '@/services/Service';

export default function UpdateTypePage() {
  const [ListData, setListData] = useState([]);
  const [loadingData, setloadingData] = useState(false);
  const { query, locale } = useRouter();
  const { t } = useTranslation();

  // const {
  //   data,
  //   isLoading: loading,
  //   error,
  // } = useTypeQuery({
  //   slug: query.groupSlug as string,
  //   language:
  //     query.action!.toString() === 'edit' ? locale! : Config.defaultLanguage,
  // });

  useEffect(() => {
    setloadingData(true);
    GetSpecificFunction('/get-alert', query.abandonedCartSlug as string).then(
      (result) => {
        if (result) {
          setListData(result.data);
          setloadingData(false);
        }
      }
    );
  }, []);

  if (loadingData) return <Loader text={t('common:text-loading')} />;

  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('common:edit-alert')}
        </h1>
      </div>
      <UpdateAlertForm initialValues={ListData} />
    </>
  );
}
UpdateTypePage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
