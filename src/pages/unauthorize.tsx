import Layout from '@/components/layouts/app';
import ProfileUpdateFrom from '@/components/auth/profile-update-form';
import ChangePasswordForm from '@/components/auth/change-password-from';

import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
// import { useMeQuery } from '@/data/user';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import { GetFunction } from '@/services/Service';
import Link from 'next/link';
import Button from '@/components/ui/button';
export default function ProfilePage() {
  const { t } = useTranslation();
  const [userData, setUserData] = useState<any>({});
  const [loadingData, setloadingData] = useState(false);

  useEffect(() => {
    setloadingData(true);
    GetFunction('/user/loggedin').then((result) => {
      setUserData(result.data);
      setloadingData(false);
    });
  }, []);

  if (loadingData) return <Loader text={t('common:text-loading')} />;

  return (
    <>
      <div className="flex justify-center border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-2xl font-bold body text-body  flex ">
          401
        </h1>
      </div>
      <div className="flex flex-col py-5 justify-center items-center">
        <h1 className='text-heading text-lg font-semibold py-2'>YOUR REQUEST IS UNAUTHORIZED</h1>
        {/* <p className='text-body py-2'>Please Upgrade Your Subscription</p> */}
        <Link href={'/'} >
        <Button className="py-2">Back to Dashboard</Button>
        </Link>
       
      </div>
      {/* <ProfileUpdateFrom data={userData} />
      <ChangePasswordForm /> */}
    </>
  );
}
ProfilePage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
