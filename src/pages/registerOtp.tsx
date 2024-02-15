import AuthPageLayout from '@/components/layouts/auth-layout';
import { Routes } from '@/config/routes';
import { GetFunctionBDetail, SendOTP } from '@/services/Service';
import { setAuthCredentials } from '@/utils/auth-utils';
import moment from 'moment';
import Router, { useRouter } from 'next/router';
import { useState } from 'react';
import OtpInput from 'react-otp-input';
import { toast } from 'react-toastify';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import appStorImg from '../assets/images/both1.png';
import playStorImg from '../assets/images/both2.png';
import Image from 'next/image';
import Link from '@/components/ui/link';
import Button from '@/components/ui/button';

export default function Otp() {
  const [otp, setOtp] = useState('');
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const {
    query,
    query: { email },
  } = router;

  const getBusinessDetails = (token) => {
    GetFunctionBDetail('/business-details', token).then((result) => {
      localStorage.setItem(
        'business_details',
        JSON.stringify(result.data.currency)
      );

      let currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      localStorage.setItem('login_time_stamp', currentDate);

      localStorage.setItem(
        'user_business_details',
        JSON.stringify(result.data)
      );
      localStorage.setItem('business_name', result.data.name);
    });
    GetFunctionBDetail('/product', token).then((result) => {
      localStorage.setItem('product_list', JSON.stringify(result.data));
    });
    GetFunctionBDetail('/user/loggedin', token).then((result) => {
      localStorage.setItem('user_detail', JSON.stringify(result.data));
    });
    toast.success('Login Successfully');
    setTimeout(() => {
      Router.push(Routes.dashboard);
    }, 1000);
  };

  const onChnageOtp = (otp) => {
    setOtp(otp);
    if (otp.length === 4) {
      setLoading(true);
      let obj = {
        email: email,
        otp: otp,
      };
      SendOTP('/verify-otp-email', obj).then((result) => {
        if (result.status) {
          router.push(Routes.registerBusiness);
        } else {
          toast.error(result.message);
          setLoading(false);
        }
      });
    }
  };
  const onBackClick = () => {
    router.back();
  };
  if (loading) return <Loader text={t('common:text-loading')} />;

  return (
    <AuthPageLayout>
      <h3 className="mb-1 mt-2 text-center text-base text-body">
        {t('We have sent otp at')}
      </h3>
      <h4 className="mt-5 ml-2 text-sm text-center text-gray-400">{email}</h4>
      <div className="mt-0 mb-5">
        <OtpInput
          value={otp}
          onChange={onChnageOtp}
          numInputs={4}
          //   renderSeparator={<span>-</span>}
          renderInput={(props) => <input {...props} />}
          inputStyle={{
            border: '1px solid black',
            width: '100%',
            height: '50px',
            borderRadius: '5px',
            margin: '10px',
          }}
        />
      </div>
      <div className="relative mt-6 mb-6 flex flex-col items-center justify-center text-sm text-heading sm:mt-6 sm:mb-6">
        <hr className="w-full" />
        <span className="absolute -top-2.5 bg-light px-2 -ms-4 start-2/4"></span>
      </div>
      <div className="mt-3 mb-5 text-center text-sm text-body sm:text-base">
        {t('form:text-no-account')}{' '}
        <Link
          href={Routes.businessDetail}
          className="font-semibold text-accent underline transition-colors duration-200 ms-1 hover:text-accent-hover hover:no-underline focus:text-accent-700 focus:no-underline focus:outline-none"
        >
          {t('Register')}
        </Link>
      </div>
      <div className="mt-3 flex justify-between">
        <a
          href="https://play.google.com/store/apps/details?id=com.ignitehq.app"
          target="_blank"
          className="cursor-pointer"
          rel="noreferrer"
        >
          <Image src={appStorImg} alt="no image" />
        </a>
        <a
          href="https://apps.apple.com/us/app/ignite-%D8%A7%D8%AC%D9%86%D8%A7%D9%8A%D8%AA/id1641743448"
          target="_blank"
          className="cursor-pointer"
          rel="noreferrer"
        >
          <Image src={playStorImg} alt="no image" />
        </a>
      </div>

      <Button onClick={onBackClick} className="mb-5 w-full">
        {t('Back')}
      </Button>
    </AuthPageLayout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['table', 'common', 'form'])),
  },
});
