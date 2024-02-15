import EmailVerification from '@/components/email-verification/email-varified';
import AuthPageLayout from '@/components/layouts/auth-layout';
import { SUPER_ADMIN } from '@/utils/constants';
import { parseContextCookie } from '@/utils/parse-cookie';
import { Routes } from '@/config/routes';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import tickImg from '../../public/image/Flat_tick_icon.svg.png';
import corssImg from '../../public/image/cross-tick.png';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { setForgotPassword } from '@/services/Service';
import { useRouter } from 'next/router';

// export const getServerSideProps: GetServerSideProps = async ({
//     context,
//     locale,
// }: any) => {
//     const cookies = parseContextCookie(context?.req?.headers?.cookie);
//     if (cookies?.auth_token) {
//         if (cookies?.auth_permissions?.includes(SUPER_ADMIN)) {
//             return {
//                 redirect: { destination: Routes.dashboard, permanent: false },
//             };
//         }
//     }
//     return {
//         props: {
//             ...(await serverSideTranslations(locale!, ['common', 'form'])),
//         },
//     };
// };

export default function ForgotPasswordPage() {
  const { query } = useRouter();
  const [status, setStatus] = useState<any>();
  const [message, setMessage] = useState<any>();
  useEffect(() => {
    let uuid = { uuid: query.uuid };
    if (query.uuid) {
      setForgotPassword('/email-verification', uuid).then((result) => {
        if (result.success == true) {
          setStatus(true);
          setMessage(result.message);
        } else if (result.success == false) {
          setStatus(false);
          setMessage(result.message);
        }
      });
    }
  }, [query]);
  const { t } = useTranslation();
  return (
    <AuthPageLayout>
      {status && status == true ? (
        <div className="py-4 flex flex-col ">
          <div className="justify-center flex">
            {' '}
            <Image alt="img" width={100} height={100} src={tickImg} />
          </div>
          <div className="flex justify-center py-2">
            {' '}
            <p>
              {message} <br />{' '}
              <span className="text-sky-600">
                {' '}
                <a href={Routes.login}>Login</a>
              </span>{' '}
              to continue using application
            </p>
          </div>
        </div>
      ) : (
        <div className="py-4 flex flex-col ">
          <div className="justify-center flex">
            {' '}
            <Image alt="img" width={100} height={100} src={corssImg} />
          </div>
          <div className="flex justify-center py-2"> {message} </div>
        </div>
      )}
    </AuthPageLayout>
  );
}
