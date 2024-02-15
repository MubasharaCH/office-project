import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import RegistrationForm from '@/components/auth/registration-form';
import { Router, useRouter } from 'next/router';
import { getAuthCredentials, isAuthenticated } from '@/utils/auth-utils';
import { Routes } from '@/config/routes';
import AuthPageLayout from '@/components/layouts/auth-layout';
import RegistrationBusinessForm from '@/components/auth/registerBusinessDetail';
import Link from '@/components/ui/link';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import PasswordInput from '@/components/ui/password-input';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Alert from '@/components/ui/alert';
import { GetFunction, SendOTP } from '@/services/Service';
import { toast } from 'react-toastify';
import LanguageSwitcher from '@/components/layouts/navigation/language-switer';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['common', 'form'])),
  },
});

type FormValues = {
  Fname: string;
  Lname: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValues>({});

  const router = useRouter();
  const { token } = getAuthCredentials();

  const [name, setName] = useState<any>();
  const [lastName, setLastName] = useState<any>();
  const [email, setEmail] = useState<any>();
  const [password, setPassword] = useState<any>();
  const [errorNew, seterrorNew] = useState<any>();
  const [isDisable, setIsDisable] = useState(true);
  const [isEmailExist, setIsEmailExist] = useState(false);
  const [validEmail, setValidEmail] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [NewLoading, setNewLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleEmailFocus = () => {
    setIsLoading(true);

    // Simulate an API call with a setTimeout
    // setTimeout(() => {
    //   setIsLoading(false);
    // }, 2000);
  };

  const { query, locale } = useRouter();

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    let fname = localStorage.getItem('userFName');
    let lname = localStorage.getItem('userLName');
    let email = localStorage.getItem('userEmail');
    setName(fname);
    setLastName(lname);
    setEmail(email);
    if (email || query.email) {
      let url_email = email ? email : query.email;
      onChangeEmail(url_email);
    }
    if (query.email) {
      setEmail(query.email);
    }
  }, []);

  // useEffect(() => {
  //   if (!name) {
  //     // seterrorNew('All Field is Requried');
  //     setIsDisable(true);
  //   } else if (!lastName) {
  //     // seterrorNew('This Field is Requried');
  //     setIsDisable(true);
  //   } else if (isEmailExist) {
  //     // seterrorNew('Email is invalid');
  //     setIsDisable(true);
  //   } else if (!isValidEmail(email)) {
  //     // seterrorNew('This Field is Requried');
  //     setIsDisable(true);
  //   } else {
  //     setIsDisable(false);
  //   }
  // });

  if (isAuthenticated({ token })) {
    router.replace(Routes.dashboard);
  }

  const { t } = useTranslation('common');

  const onChangeName = (e) => {
    setName(e.target.value);
    seterrorNew('');
  };
  const onChangeLastName = (e) => {
    setLastName(e.target.value);
    seterrorNew('');
  };
  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }
  const onChangeEmail = (e) => {
    var email = e.target?.value ? e.target.value : e;
    GetFunction(`/validate-record?email=${email}`).then((result) => {
      if (result?.success == true) {
        seterrorNew(result.message);
        setIsEmailExist(true);
        setIsLoading(false);
      } else {
        setIsEmailExist(false);
        setIsLoading(false);
      }
    });

    if (!isValidEmail(email)) {
      setEmail(email);
      setValidEmail(false);
      seterrorNew('Email is invalid');
    } else {
      setEmail(email);
      setIsDisable(false);
      seterrorNew('');
    }
  };
  const onChangePassword = (e) => {
    setPassword(e.target.value);
    seterrorNew('');
  };

  const NewBtn = () => {
    if (!name) {
      seterrorNew('All Field is Requried');
    } else if (!lastName) {
      seterrorNew('This Field is Requried');
    } else if (!email) {
      seterrorNew('Email is invalid');
    } else {
      localStorage.setItem('userFName', name);
      localStorage.setItem('userLName', lastName);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userPassword', password);
      router.push(Routes.registerBusiness);
    }
    setNewLoading(true);
    let obj = {
      email: email,
      type: 'register',
    };
    // SendOTP('/send-otp-email', obj).then((result) => {
    //   if (result.status == true) {
    //     toast.success(result.message);
    //     setNewLoading(false);
    //     localStorage.setItem('userFName', name);
    //     localStorage.setItem('userLName', lastName);
    //     localStorage.setItem('userEmail', email);

    //     setTimeout(() => {

    //       router.push({
    //         pathname: Routes.registerOtp,
    //         query: { email: email },
    //       });
    //     }, 2000);

    //   }else{
    //     toast.success(result.message);
    //     setNewLoading(false);
    //     router.push({
    //       pathname: Routes.businessDetail,
    //     });
    //   }
    //   // if (result.status) {

    //   // }
    // });
  };
  const handleBlur = () => {
    // Call API when the input field is unfocused
    GetFunction(`/validate-record?email=${email}`).then((result) => {
      if (result?.success == true) {
        seterrorNew(result.message);
        setIsEmailExist(true);
        setIsLoading(false);
      } else {
        setIsEmailExist(false);
        setIsLoading(false);
      }
    });
  };
  const handleFocus = () => {
    setIsEmailExist(true);
    setIsLoading(true);
  };

  return (
    <AuthPageLayout>
      <h3 className="mb-6 mt-4 text-center text-base  text-gray-500">
        {t('common:admin-register-title')} ?
        <Link
          href={Routes.login}
          className="font-semibold text-accent underline transition-colors duration-200 ms-1 hover:text-accent-hover hover:no-underline focus:text-accent-700 focus:no-underline focus:outline-none"
        >
          {t('form:button-label-login')}
        </Link>
      </h3>

      <div>
        <Input
          label={t('form:first-name')}
          {...register('Fname')}
          onChange={onChangeName}
          value={name}
          error={t(name?.email?.message!)}
          variant="outline"
          className="mb-4"
        />
        <Input
          label={t('form:last-name')}
          {...register('Lname')}
          onChange={onChangeLastName}
          value={lastName}
          error={t(errors?.email?.message!)}
          variant="outline"
          className="mb-4"
        />
        <label className="mb-3 block text-sm font-semibold leading-none text-body-dark">
          {t('form:input-label-email')}
        </label>
        <div className="input-container mb-4">
          <input
            type="text"
            value={email}
            onFocus={handleFocus}
            onBlur={onChangeEmail}
            // onChange={(e) => {
            //   onChangeEmail(e);
            //   handleFocus();
            // }}
            readOnly={query.email ? true : false}
            // onBlur={handleBlur}
            onChange={onChangeEmail}
            className="rounded border border-inherit border-border-base p-3 focus:border-accent focus:bg-light focus:shadow"
          />
          {isLoading && <div className="loader"></div>}
        </div>
        {/* <Input
          label={t('Email')}
          {...register('email')}
          onChange={onChangeEmail}
          value={email}
          type="email"
          variant="outline"
          className="mb-4 "
          error={t(errors?.email?.message!)}
          onBlur={handleBlur}
          onFocus={handleFocus}
         
        /> */}

        {/* <PasswordInput
          label={t('form:input-label-password')}
          {...register('password')}
          onChange={onChangePassword}
          error={t(errors?.password?.message!)}
          variant="outline"
          className="mb-4"
        /> */}
        {/* <p className="mb-3 text-xs text-red-500 text-start">{errorNew}</p> */}
        {errorNew ? (
          <Alert
            message={t(errorNew)}
            variant="error"
            closeable={true}
            className="mt-5 mb-3"
            onClose={() => seterrorNew('')}
          />
        ) : null}

        <Button
          onClick={NewBtn}
          disabled={isDisable}
          className="mb-5 w-full"
          loading={NewLoading}
        >
          {t('form:next')}
        </Button>
      </div>
    </AuthPageLayout>
  );
}
