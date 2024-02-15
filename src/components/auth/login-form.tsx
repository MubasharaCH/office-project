import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import PasswordInput from '@/components/ui/password-input';
import { useTranslation } from 'next-i18next';
import * as yup from 'yup';
import Link from '@/components/ui/link';
import Form from '@/components/ui/forms/form';
import { Routes } from '@/config/routes';
import { useLogin } from '@/data/user';
import type { LoginInput } from '@/types';
import { useEffect, useState } from 'react';
import Alert from '@/components/ui/alert';
import Router, { useRouter } from 'next/router';
import { allowedRoles, setAuthCredentials } from '@/utils/auth-utils';
import { GetFunctionBDetail } from '@/services/Service';
import { toast } from 'react-toastify';
import moment from 'moment';
import SocialLogin from './social-login';
import playStore from '../../assets/images/both1.png';
import appleStore from '../../assets/images/both2.png';
import huaweiImg from '../../assets/images/huawei.png';
import Image from 'next/image';
import { SendOTP } from '@/services/Service';

const loginFormSchema = yup.object().shape({
  email: yup
    .string()
    .email('form:error-email-format')
    .required('form:error-email-required'),
  password: yup.string().required('form:error-password-required'),
});

const LoginForm = () => {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate: login, isLoading, error } = useLogin();
  const [newLoading, setNewLoading] = useState(false);

  useEffect(() => {}, []);

  useEffect(() => {
    localStorage.setItem('timer', '600');
    // Cleanup function to clear timer on unmount
    return () => {
      localStorage.removeItem('timer');
    };
  }, []);

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
  const router = useRouter();
  function onSubmit({ email, password }: LoginInput) {
    setNewLoading(true);
    // const emailBeforeHash = emailString.split('#')[0];

    let obj = {
      email: email,
      type: 'login',
    };
    SendOTP('/send-otp-email', obj).then((result) => {
      if (result.status == true) {
        toast.success(result.message);
        setNewLoading(false);
        setTimeout(() => {
          router.push({
            pathname: Routes.otp,
            query: { email: email },
          });
        }, 2000);
      } else {
        localStorage.setItem('userEmail', email);
        toast.success(result.message);
        setNewLoading(false);
      }
    });

    // login(
    //   {
    //     email,
    //     password,
    //   },
    //   {
    //     onSuccess: (data: any) => {
    //       if (data?.access_token) {
    //         localStorage.setItem('user_token', data?.access_token);
    //         setAuthCredentials(data?.access_token);
    //         getBusinessDetails(data?.access_token);
    //         return;
    //       } else {
    //         setErrorMessage('form:error-credential-wrong');
    //       }
    //     },
    //     onError: () => {},
    //   }
    // );
  }

  return (
    <>
      <Form<LoginInput> onSubmit={onSubmit}>
        {({ register, formState: { errors } }) => (
          <>
            <Input
              label={t('form:input-label-email')}
              {...register('email')}
              type="email"
              variant="outline"
              className="mb-4"
              error={t(errors?.email?.message!)}
            />
            {/* <PasswordInput
              label={t('form:input-label-password')}
              forgotPassHelpText={t('form:input-forgot-password-label')}
              {...register('password')}
              error={t(errors?.password?.message!)}
              variant="outline"
              className="mb-4"
              forgotPageLink={Routes.forgotPassword}
            /> */}
            <Button
              className="w-full"
              loading={newLoading}
              disabled={newLoading}
            >
              {t('form:send-otp')}
            </Button>

            <div className="w-full">
              <SocialLogin />
            </div>

            {/* <div className="relative mt-6 mb-6 flex flex-col items-center justify-center text-sm text-heading sm:mt-6 sm:mb-6">
              <hr className="w-full" />
              <span className="absolute -top-2.5 bg-light px-2 -ms-4 start-2/4">
                {t('common:text-or')}
              </span>
            </div> */}

            <div className="mt-3 flex h-16">
              <a
                href="https://play.google.com/store/apps/details?id=com.ignitehq.app"
                target="_blank"
                className="flex-1 mx-1"
                rel="noreferrer"
              >
                <Image src={playStore} alt="no image" height={230} />
              </a>

              <a
                href="https://apps.apple.com/us/app/ignite-%D8%A7%D8%AC%D9%86%D8%A7%D9%8A%D8%AA/id1641743448"
                target="_blank"
                className="flex-1 mx-1"
                rel="noreferrer"
              >
                <Image src={appleStore} alt="no image" height={250} />
              </a>

              <a
                href="https://appgallery.huawei.com/app/C107602025"
                target="_blank"
                className="flex-1 mx-1"
                rel="noreferrer"
              >
                <Image src={huaweiImg} alt="no image" height={130} />
              </a>
            </div>

            {/* <div className="text-center text-sm text-body sm:text-base">
              {t('form:text-no-account')}{' '}
              <Link
                href={Routes.businessDetail}
                className="font-semibold text-accent underline transition-colors duration-200 ms-1 hover:text-accent-hover hover:no-underline focus:text-accent-700 focus:no-underline focus:outline-none"
              >
                {t('Register')}
              </Link>
            </div> */}
          </>
        )}
      </Form>
      {/* <div className='grid grid-cols-12 gap-1'>
              <div className="col-span-4">  <img src={pImg} alt="no image" className='h-20' /></div>
              <div className="col-span-4"> <img src='../../assets/images/both2.png' alt="no image" className='h-20' /></div>
              <div className="col-span-4">  <img src='../../assets/images/huawei.png' alt="no image" className='h-20' /></div>
            </div> */}
      {errorMessage ? (
        <Alert
          message={t(errorMessage)}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}
    </>
  );
};

export default LoginForm;
