import Layout from '@/components/layouts/app';
import ProfileUpdateFrom from '@/components/auth/profile-update-form';
import ChangePasswordForm from '@/components/auth/change-password-from';
import Image from 'next/image';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
// import { useMeQuery } from '@/data/user';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import { GetFunction } from '@/services/Service';
import Link from 'next/link';
import Button from '@/components/ui/button';
// import playStore from '../assets/playstore (2).jpg';
import appleStore from '../assets/images/both2.png';
import Router from 'next/router';
import Navbar from '@/components/layouts/navigation/top-navbar';

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
      <Navbar />

      {/* flex justify-center  border-dashed border-border-base py-5 sm:py-8 */}
      <div className="flex justify-center flex-col lg:px-9 xl:px-9 2xl:px-9 md:px-9 py-16 lg:m-9 xl:m-9 2xl:m-9 md:m-9">
        <div className="flex justify-center items-center flex-col">
          <div className="flex justify-center">
            <p className="text-xl body text-body lg:w-2/4 xl:w-2/4 2xl:w-2/4 md:w-2/4 w-4/5 text-center">
              Upgrade your package to access Ignite console. Download the mobile
              app to manage your business.
            </p>
          </div>
          <div className="mt-4">
            <Button
              className="w-44"
              onClick={() => {
                Router.push('/reviewSubscription');
              }}
            >
              Update Package
            </Button>
          </div>
        </div>

        <div className="flex justify-center mt-3">
          <a
            href="https://play.google.com/store/apps/details?id=com.ignitehq.app"
            target="_blank"
            className="flex items-center justify-center mr-2"
            rel="noreferrer"
          >
            <img
              src='/image/playstore (2).jpg'
              alt="no image"
              className="object-contain"
              width={100}
              height={35}
            />
          </a>

          <a
            href="https://apps.apple.com/us/app/ignite-%D8%A7%D8%AC%D9%86%D8%A7%D9%8A%D8%AA/id1641743448"
            target="_blank"
            className="flex items-center justify-center ml-2"
            rel="noreferrer"
          >
            <Image src={appleStore} alt="no image" width={100} height={35} />
          </a>
        </div>
      </div>
      {/* <div className="flex flex-col py-5 justify-center items-center">
                <h1 className='text-heading text-lg font-semibold py-2'>YOUR REQUEST IS UNAUTHORIZED</h1>
                {/* <p className='text-body py-2'>Please Upgrade Your Subscription</p> 
                <Link href={'/'} >
                    <Button className="py-2">Back to Dashboard</Button>
                </Link>

            </div> */}
      {/* <ProfileUpdateFrom data={userData} />
      <ChangePasswordForm /> */}
    </>
  );
}
// ProfilePage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
