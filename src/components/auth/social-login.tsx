import { useTranslation } from 'next-i18next';
import { useState, useCallback } from 'react';
import { IResolveParams } from 'reactjs-social-login';
import { FcGoogle } from 'react-icons/fc';
import { BsFacebook } from 'react-icons/bs';
import { BsApple } from 'react-icons/bs';
import { AiFillTwitterCircle } from 'react-icons/ai';
import { IoLogoApple } from 'react-icons/io';
import Router, { useRouter } from 'next/router';
import { allowedRoles, setAuthCredentials } from '@/utils/auth-utils';
// CUSTOMIZE ANY UI BUTTON
import Logo from '@/components/ui/logo';
import { FacebookLoginButton } from 'react-social-login-buttons';
import { TwitterLoginButton } from 'react-social-login-buttons';
import { GoogleLoginButton } from 'react-social-login-buttons';
import { AppleLoginButton } from 'react-social-login-buttons';
import Loader from '../ui/loader/loader';
import { GetFunctionBDetail, GetSocialData } from '@/services/Service';
import moment from 'moment';
import { toast } from 'react-toastify';
import { Routes } from '@/config/routes';
import cn from 'classnames';
import styles from '@/components/ui/loader/loader.module.css';
import Modal from '@/components/ui/modal/modal';
import Card from '../common/card';
import { AiOutlineRight } from 'react-icons/ai';
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../../../firebase';
const LoginForm = () => {
  const { t } = useTranslation();
  const [provider, setProvider] = useState('');
  const [profile, setProfile] = useState<any>();
  const [loadingData, setloadingData] = useState(false);
  const router = useRouter();
  const REDIRECT_URI = window.location.href;
  const [LoginSocialFacebook, setLoginSocialFacebook] =
    useState<React.ComponentType<any> | null>(null);
  const [LoginSocialTwitter, setLoginSocialTwitter] =
    useState<React.ComponentType<any> | null>(null);
  const [LoginSocialGoogle, setLoginSocialGoogle] =
    useState<React.ComponentType<any> | null>(null);
  const [LoginSocialApple, setLoginSocialApple] =
    useState<React.ComponentType<any> | null>(null);

  const isBrowser = typeof window !== 'undefined';

  if (isBrowser && !LoginSocialFacebook) {
    import('reactjs-social-login').then((module) => {
      setLoginSocialFacebook(module.LoginSocialFacebook);
    });
  }
  if (isBrowser && !LoginSocialTwitter) {
    import('reactjs-social-login').then((module) => {
      setLoginSocialTwitter(module.LoginSocialTwitter);
    });
  }
  if (isBrowser && !LoginSocialGoogle) {
    import('reactjs-social-login').then((module) => {
      setLoginSocialGoogle(module.LoginSocialGoogle);
    });
  }
  if (isBrowser && !LoginSocialApple) {
    import('reactjs-social-login').then((module) => {
      setLoginSocialApple(module.LoginSocialApple);
    });
  }

  const getBusinessDetails = (token) => {
    GetFunctionBDetail('/business-details', token).then((result) => {
      localStorage.setItem(
        'business_details',
        JSON.stringify(result.data.currency)
      );

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

  const onSuccess = (data: any) => {
    const body = {
      email: data,
    };
    setloadingData(true);
    GetSocialData('/social-login', body).then((result) => {
      if (result.status) {
        localStorage.setItem('user_token', result?.token?.access_token);
        if (result?.user?.length > 1) {
          const route = {
            pathname: Routes.selectUser,
            query: { data: JSON.stringify(result.user) }, // Convert the data to a string and pass it as a query parameter
          };
          router.push(route); // Navigate to the route with the data
        } else {
          setAuthCredentials(result?.token?.access_token);
          getBusinessDetails(result?.token?.access_token);
        }
      } else {
        if (result.status_code == 422) {
          router.push({
            pathname: Routes.businessDetail,
            query: { email: data },
          });
          toast.error(result.message);
          setloadingData(false);
        } else {
          toast.error(result.message);
          setloadingData(false);
        }
      }
    });
  };
  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        onSuccess(user?.email);
      })
      .catch((error) => {
        console.log(error);
        
        const errorMessage = error.message;
        toast.error(errorMessage);
      });
  };
  const onFacebookSuccess = async() => {
    const provider = new FacebookAuthProvider();
    provider.setCustomParameters({
      display: 'popup',
    });
    await signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log('user', user);
        onSuccess(user?.email);
      })
      .catch((error) => {        
        const errorMessage = error.message;
        toast.error(errorMessage);
      });
  };
  const onAppleSuccess =async () => {
    const provider = new OAuthProvider('apple.com');

    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        onSuccess(user?.email);
      })
      .catch((error) => {
        console.log(error);
        const errorMessage = error.message;
        toast.error(errorMessage);
      });
  };

  if (loadingData)
    return (
      <div>
        <div
          className={cn('flex w-full flex-col items-center justify-center')}
          style={{ height: 'calc(50vh - 200px)' }}
        >
          <div className={styles.loading} />
        </div>
      </div>
    );

  return (
    <>
      {provider && profile ? (
        <Loader text={t('common:text-loading')} />
      ) : (
        <div className="flex justify-center">
          {/* <div className="w-12 p-3" onClick={onAppleSuccess}>
            <BsApple color="#00000" className="h-8 w-8 cursor-pointer" />
          </div> */}
          <div className="w-12 p-3" >
            <BsFacebook 
            onClick={onFacebookSuccess}
            color="#2D86FF" className="h-8 w-8 cursor-pointer" />
          </div>
          {/* {LoginSocialFacebook && (
            <LoginSocialFacebook
              // appId="950913272736930"
              appId="730498595699535"
              onResolve={({ provider, data }: IResolveParams) => {
                onFacebookSuccess(data);
              }}
              onReject={(err) => {
                console.log(err);
                console.log(err);
              }}
            >
              <div className="w-12 p-3">
                <BsFacebook
                  color="#2D86FF"
                  className="h-8 w-8 cursor-pointer"
                />
              </div>
            </LoginSocialFacebook>
          )} */}
          <div className="w-12 p-3" onClick={handleGoogleLogin}>
            <FcGoogle className="h-8 w-8 cursor-pointer" />
          </div>
          {/* {LoginSocialGoogle && (
            <LoginSocialGoogle
              client_id="187532650466-51uleg6rg1kglgn1v0seqqsflvjhcvo1.apps.googleusercontent.com"
              onResolve={({ provider, data }: IResolveParams) => {
                onGmailSuccess(data);
              }}
              onReject={(err) => {
                console.log(err);
              }}
            >
              <div className="w-12 p-3">
                <FcGoogle className="h-8 w-8 cursor-pointer" />
              </div>
            </LoginSocialGoogle>
          )} */}
          {/* {LoginSocialTwitter && (
            <LoginSocialTwitter
              isOnlyGetToken
              client_id={process.env.REACT_APP_TWITTER_V2_APP_KEY || ''}
              redirect_uri={''}
              // onLoginStart={onLoginStart}
              onResolve={({ provider, data }: IResolveParams) => {
                setProvider(provider);
                setProfile(data);
              }}
              onReject={(err: any) => {
                console.log(err);
              }}
            >
              <div className="w-12 p-3">
                <AiFillTwitterCircle color="#1D9BF0" className="h-9 w-9" />
              </div>
            </LoginSocialTwitter>
          )} */}
          {/* {LoginSocialApple && (
            <LoginSocialApple
              client_id="com.ignite.login"
              scope={'name email'}
              redirect_uri={REDIRECT_URI}
              onResolve={({ provider, data }: IResolveParams) => {
                setProvider(provider);
                setProfile(data);
              }}
              onReject={(err) => {
                console.log(err);
              }}
            >
              <div className="w-12 p-3">
                <IoLogoApple color="#666666" className="h-9 w-9" />
              </div>
            </LoginSocialApple>
          )} */}
        </div>
      )}
    </>
  );
};

export default LoginForm;
