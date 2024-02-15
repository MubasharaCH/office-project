import AuthPageLayout from '@/components/layouts/auth-layout';
import { Routes } from '@/config/routes';
import { GetFunctionBDetail, SendOTP } from '@/services/Service';
import { setAuthCredentials } from '@/utils/auth-utils';
import moment from 'moment';
import Router, { useRouter } from 'next/router';
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
import { useEffect, useState } from 'react';

export default function Otp() {
  const [timer, setTimer] = useState(
    parseInt(localStorage.getItem('timer') || '600')
  );
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [otp, setOtp] = useState('');
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [newLoading, setNewLoading] = useState(false);

  const {
    query,
    query: { email },
  } = router;

  const handleResendClick = () => {
    setIsTimerRunning(true);
    setTimer(600);
    let obj = {
      email: email,
      type: 'login',
    };
    SendOTP('/send-otp-email', obj).then((result) => {
      if (result.status == true) {
        toast.success(result.message);
        setNewLoading(false);
        // setTimeout(() => {
        //   router.push({
        //     pathname: Routes.otp,
        //     query: { email: email },
        //   });
        // }, 2000);
      } else {
        toast.success(result.message);
        setNewLoading(false);
      }
    });
  };

  useEffect(() => {
    let intervalId;

    if (isTimerRunning && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((timer) => timer - 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isTimerRunning, timer]);

  useEffect(() => {
    localStorage.setItem('timer', timer.toString());
  }, [timer]);

  const getBusinessDetails = (token) => {
    // let business: any = {};
    GetFunctionBDetail('/business-details', token).then((result) => {
      // business = result?.data;
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

      if (result?.data) {
        setTimeout(() => {
          if (
            result?.data?.subscriptions[0]?.package_details?.name.toLowerCase() ===
            'free package'
          ) {
            Router.push('/updateSubscription');
          } else {
            Router.push(Routes.dashboard);
          }
        }, 1000);
      }
    });
    GetFunctionBDetail('/product', token).then((result) => {
      localStorage.setItem('product_list', JSON.stringify(result.data));
    });
    GetFunctionBDetail('/user/loggedin', token).then((result) => {
      localStorage.setItem('user_detail', JSON.stringify(result.data));
    });
    toast.success('Login Successfully');
  };

  const onChnageOtp = (otp) => {
    setOtp(otp);
    if (otp.length === 4) {
      setLoading(true);
      let emailBeforeHash = email?.toString().split('#')[0];

      let obj = {
        email: emailBeforeHash,
        otp: otp,
      };
      SendOTP('/verify-otp-email', obj).then((result) => {
        if (result.status) {
          localStorage.setItem('user_token', result?.token.access_token);
          if (result.user.length > 1) {
            const route = {
              pathname: Routes.selectUser,
              query: { data: JSON.stringify(result.user) }, // Convert the data to a string and pass it as a query parameter
            };

            router.push(route); // Navigate to the route with the data
          } else {
            setAuthCredentials(result?.token.access_token);
            getBusinessDetails(result?.token.access_token);
          }
        } else {
          if (result.status_code == 422) {
            router.push({
              pathname: Routes.businessDetail,
              query: { email: email },
            });
            toast.error(result.message);
            setLoading(false);
          } else {
            toast.error(result.message);
            setLoading(false);
          }
        }
      });
    }
  };
  const onBackClick = () => {
    setTimer(600);
    router.back();
  };
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
  const secondsStr = seconds < 10 ? `0${seconds}` : seconds;
  if (loading) return <Loader text={t('common:text-loading')} />;

  return (
    <AuthPageLayout>
      <h3 className="mb-1 mt-2 text-center text-base text-body">
        {t('form:we-have-sent-otp')}
      </h3>
      <h4 className="mt-1 ml-2 text-center text-sm text-gray-400">
        {email?.toString().split('#')[0]}
      </h4>
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

      <p className="text-center">
        {timer > 0 ? (
          <>
            {t('form:otp-expired')} {minutesStr}:{secondsStr}
          </>
        ) : (
          <button onClick={handleResendClick}>{t('Resend otp')}</button>
        )}
      </p>

      <div className="relative mt-6 mb-6 flex flex-col items-center justify-center text-sm text-heading sm:mt-6 sm:mb-6">
        <hr className="w-full" />
        <span className="absolute -top-2.5 bg-light px-2 -ms-4 start-2/4"></span>
      </div>
      {/* <div className="mt-3 mb-5 text-center text-sm text-body sm:text-base">
        {t('form:text-no-account')}{' '}
        <Link
          href={Routes.businessDetail}
          className="font-semibold text-accent underline transition-colors duration-200 ms-1 hover:text-accent-hover hover:no-underline focus:text-accent-700 focus:no-underline focus:outline-none"
        >
          {t('Register')}
        </Link>
      </div> */}
      {/* <div className="mt-3 flex justify-between">
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
      </div> */}

      <Button onClick={onBackClick} className="mb-5 w-full">
        {t('form:button-label-back')}
      </Button>
    </AuthPageLayout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['table', 'common', 'form'])),
  },
});
