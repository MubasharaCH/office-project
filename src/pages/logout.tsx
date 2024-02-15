import { useEffect } from 'react';
import Loader from '@/components/ui/loader/loader';
import { useLogoutMutation } from '@/data/user';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import Cookies from 'js-cookie';
import { AUTH_CRED } from '@/utils/constants';
import { Routes } from '@/config/routes';
import { toast } from 'react-toastify';

function SignOut() {
  const { t } = useTranslation();
  const router = useRouter();

  // const { mutate: logout } = useLogoutMutation();

  useEffect(() => {

    Cookies.remove(AUTH_CRED);
    localStorage.removeItem("user_token")
    localStorage.clear()
    router.replace(Routes.login);
    toast.success(t('common:successfully-logout'));
  }, []);

  return <Loader text={t('common:signing-out-text')} />;
}

export default SignOut;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});
